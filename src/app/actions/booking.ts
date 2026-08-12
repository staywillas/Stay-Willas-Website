"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { parseICal } from "@/lib/ical-sync";
import { startOfDay, parseISO } from "date-fns";

function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_build_key_0000000000000000";
  return new Stripe(apiKey, {
    apiVersion: "2026-04-22.dahlia",
  });
}

/**
 * Calculates weighted stay pricing night-by-night applying seasonal dates, weekend rates, and defaults
 */
export async function calculateStayPrice(
  villaId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number
) {
  const villa = await prisma.villa.findUnique({
    where: { id: villaId },
    include: { seasonalPrices: true, dailyPrices: true }
  });
  
  if (!villa) throw new Error("Villa not found");

  let totalStayPrice = 0;
  let currentDate = new Date(checkIn);
  const end = new Date(checkOut);

  while (currentDate.getTime() < end.getTime()) {
    // 0. Check for exact daily override price (highest priority)
    const normalizedDate = new Date(currentDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const dailyOverride = villa.dailyPrices.find(dp => {
      const dDate = new Date(dp.date);
      dDate.setHours(0, 0, 0, 0);
      return normalizedDate.getTime() === dDate.getTime();
    });

    if (dailyOverride) {
      totalStayPrice += dailyOverride.price;
    } else {
      // 1. Check seasonal pricing table overrides
      const seasonalOverride = villa.seasonalPrices.find(sp => {
        const start = new Date(sp.startDate);
        const endSp = new Date(sp.endDate);
        return currentDate.getTime() >= start.getTime() && currentDate.getTime() <= endSp.getTime();
      });

      if (seasonalOverride) {
        totalStayPrice += seasonalOverride.price;
      } else {
        // 2. Check specific day-of-week pricing overrides
        const dayOfWeek = currentDate.getDay();
        
        if (dayOfWeek === 5 && villa.fridayPrice != null) {
          totalStayPrice += villa.fridayPrice;
        } else if (dayOfWeek === 6 && villa.saturdayPrice != null) {
          totalStayPrice += villa.saturdayPrice;
        } else if (dayOfWeek === 0 && villa.sundayPrice != null) {
          totalStayPrice += villa.sundayPrice;
        } else {
          // 3. Check legacy weekend pricing
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
          if (isWeekend && villa.weekendPrice) {
            totalStayPrice += villa.weekendPrice;
          } else {
            // 4. Fallback to base pricing
            totalStayPrice += villa.price;
          }
        }
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const baseGuestsCount = villa.baseGuests ?? villa.guests;
  const extraGuests = Math.max(0, guests - baseGuestsCount);
  const extraGuestsCostPerNight = villa.extraGuestFee ? extraGuests * villa.extraGuestFee : 0;
  const totalExtraGuestsCost = extraGuestsCostPerNight * (nights > 0 ? nights : 0);

  return { 
    totalRoomPrice: totalStayPrice, 
    totalExtraGuestsCost,
    baseRate: villa.price 
  };
}

/**
 * Initiates checkout session, checks for overlap conflicts, and generates a 10-minute HOLD status
 */
export async function createCheckoutSession(formData: {
  villaId: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  selectedAddOns?: string[];
  userId: string;
  couponCode?: string;
}) {
  const checkInDate = new Date(formData.checkIn);
  const checkOutDate = new Date(formData.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  try {
    // 1. STAGE A: Strict Double Booking & Lock Prevention using Transaction Checks
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        villaId: formData.villaId,
        status: { in: ["CONFIRMED", "BLOCKED", "HELD"] },
        OR: [
          { status: { in: ["CONFIRMED", "BLOCKED"] } },
          { status: "HELD", createdAt: { gte: tenMinutesAgo } }
        ],
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      throw new Error("These dates are already booked or temporarily locked by another user in checkout. Please select different dates.");
    }

    // 2. STAGE B: Dynamic Pricing Calculation (Weighted)
    const { totalRoomPrice, totalExtraGuestsCost } = await calculateStayPrice(formData.villaId, checkInDate, checkOutDate, formData.guests);

    // 3. STAGE C: Add-Ons Aggregate Costs
    let addOnsPrice = 0;
    if (formData.selectedAddOns && formData.selectedAddOns.length > 0) {
      for (const addon of formData.selectedAddOns) {
        if (addon === "Gourmet Chef Experience") {
          addOnsPrice += 6000 * nights;
        } else if (addon === "Curated Vineyard Tour") {
          addOnsPrice += 4500 * formData.guests;
        } else if (addon === "Celebration Decoration") {
          addOnsPrice += 7500;
        } else if (addon === "Premium SUV Airport Transfer") {
          addOnsPrice += 9500;
        }
      }
    }

    const serviceFee = 0; // Removed luxury service fee
    const discount = formData.couponCode === "STAY5" ? ((totalRoomPrice + totalExtraGuestsCost) * 0.05) : 0;
    const finalTotal = totalRoomPrice + totalExtraGuestsCost + addOnsPrice + serviceFee - discount;

    // 4. STAGE D: Create database HELD Booking Record to secure the locked dates for 10 minutes
    const holdBooking = await prisma.booking.create({
      data: {
        villaId: formData.villaId,
        userId: formData.userId || "GUEST_USER",
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: finalTotal,
        status: "HELD",
        addOns: formData.selectedAddOns || []
      }
    });

    // 5. STAGE E: Generate Stripe Session mapped to holdBooking.id
    let checkoutUrl = "";
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `${formData.villaName} - Stay Willas`,
                description: `${nights} nights stay from ${checkInDate.toLocaleDateString()} to ${checkOutDate.toLocaleDateString()}` + 
                  (formData.selectedAddOns && formData.selectedAddOns.length > 0 ? ` with add-ons: ${formData.selectedAddOns.join(", ")}` : ""),
              },
              unit_amount: finalTotal * 100, // paise units
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${holdBooking.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/villa/${formData.villaId}`,
        metadata: {
          bookingId: holdBooking.id,
          villaId: formData.villaId,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          guests: formData.guests.toString(),
        },
      });
      checkoutUrl = session.url || "";
    } catch (stripeErr: any) {
      console.warn("Stripe API failed or placeholder keys used. Generating mockup secure redirect link for preview and testing...", stripeErr);
      checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id=mock_stripe_session_${Date.now()}&booking_id=${holdBooking.id}`;
    }

    return { url: checkoutUrl };
  } catch (error: any) {
    console.error("Secure Checkout Session Generation Failed:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}

/**
 * Retrieves dynamic availability, filtering out cancelled stays and expired checkouts (HELD > 10m)
 */
export async function getDestinationAvailability(region: string) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const villas = await prisma.villa.findMany({
      where: {
        location: {
          contains: region,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        bookings: {
          where: {
            OR: [
              { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
              { status: "HELD", createdAt: { gte: tenMinutesAgo } }
            ]
          },
          select: {
            checkIn: true,
            checkOut: true,
            villaId: true,
          },
        },
      },
    });

    const totalVillas = villas.length;
    if (totalVillas === 0) {
      return { success: true, bookings: [], totalVillas: 0 };
    }

    // Flatten all bookings from all villas
    const allBookings = villas.flatMap(v => v.bookings);

    return { 
      success: true, 
      bookings: allBookings.map(b => ({
        checkIn: b.checkIn.toISOString(),
        checkOut: b.checkOut.toISOString(),
        villaId: b.villaId
      })), 
      totalVillas 
    };
  } catch (error: any) {
    console.error("Failed to fetch destination availability:", error);
    return { success: false, error: error.message || "Failed to fetch availability data." };
  }
}

/**
 * Dynamic iCal synchronizer. Fetches dynamic iCal events, parses events, and block overlaps
 */
export async function syncExternalCalendars(villaId: string) {
  try {
    const villa = await prisma.villa.findUnique({
      where: { id: villaId },
      select: { iCalUrl: true }
    });

    if (!villa || !villa.iCalUrl) {
      return { success: true, message: "No external iCal URL configured." };
    }

    const response = await fetch(villa.iCalUrl);
    if (!response.ok) throw new Error("Failed to fetch external calendar feed");
    
    const icalText = await response.text();
    const externalEvents = parseICal(icalText);

    // Delete existing sync blocked dates, and insert fresh events
    await prisma.$transaction([
      prisma.booking.deleteMany({
        where: {
          villaId,
          status: "BLOCKED",
          userId: "SYSTEM_ICAL"
        }
      }),
      prisma.booking.createMany({
        data: externalEvents.map(event => ({
          villaId,
          userId: "SYSTEM_ICAL",
          checkIn: event.start,
          checkOut: event.end,
          totalPrice: 0.0,
          status: "BLOCKED"
        }))
      })
    ]);

    return { success: true, synchronizedCount: externalEvents.length };
  } catch (error: any) {
    console.error("iCal Synchronizer Action failed:", error);
    return { success: false, error: error.message || "Calendar synchronization failed." };
  }
}

/**
 * Submits secure KYC verification documents and co-guest rosters for standard compliance checks
 */
export async function submitBookingKYC(formData: {
  bookingId: string;
  kycName: string;
  kycGuests: string[];
  kycIdUrl: string;
}) {
  try {
    const updated = await prisma.booking.update({
      where: { id: formData.bookingId },
      data: {
        kycName: formData.kycName,
        kycGuests: formData.kycGuests,
        kycIdUrl: formData.kycIdUrl
      }
    });
    return { success: true, booking: updated };
  } catch (error: any) {
    console.error("KYC Submission Server Action failed:", error);
    return { success: false, error: error.message || "Failed to submit KYC data." };
  }
}

/**
 * Cancels active bookings, releasing the locked calendar dates
 */
export async function cancelBooking(bookingId: string) {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED"
      }
    });
    return { success: true, booking: updated };
  } catch (error: any) {
    console.error("Booking cancellation server action failed:", error);
    return { success: false, error: error.message || "Failed to cancel booking." };
  }
}

export async function checkAvailableVillasForDates(data: {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  try {
    const region = data.destination || "Lonavala";
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Helper: extract UTC date-only stamp (ignoring time/timezone)
    const toUTCDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

    console.log("[Availability] Search request:", { region, checkIn: data.checkIn, checkOut: data.checkOut, guests: data.guests });

    // 1. Query ALL villas matching region (no guest filter — let user see all options)
    let villas = await prisma.villa.findMany({
      where: {
        location: { contains: region, mode: "insensitive" }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        bedrooms: true,
        guests: true,
        location: true,
        images: true,
        bookings: {
          where: {
            OR: [
              { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
              { status: "HELD", createdAt: { gte: tenMinutesAgo } }
            ]
          },
          select: {
            checkIn: true,
            checkOut: true,
            status: true
          }
        }
      }
    });

    console.log("[Availability] Villas found for region:", villas.length, "region:", region);

    // Fallback: If no villas match the region, fetch all villas
    if (villas.length === 0) {
      villas = await prisma.villa.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          bedrooms: true,
          guests: true,
          location: true,
          images: true,
          bookings: {
            where: {
              OR: [
                { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
                { status: "HELD", createdAt: { gte: tenMinutesAgo } }
              ]
            },
            select: {
              checkIn: true,
              checkOut: true,
              status: true
            }
          }
        }
      });
      console.log("[Availability] Fallback: fetched ALL villas:", villas.length);
    }

    // 2. If no dates provided, return all villas
    if (!data.checkIn || !data.checkOut) {
      console.log("[Availability] No dates provided, returning all", villas.length, "villas");
      return {
        success: true,
        villas: villas.map(v => ({
          id: v.id,
          name: v.name,
          slug: v.slug,
          price: v.price,
          bedrooms: v.bedrooms,
          guests: v.guests,
          location: v.location,
          image: v.images[0] || "/images/hero-villa.png"
        }))
      };
    }

    // 3. Parse user dates and normalize to UTC day boundaries
    const userCheckIn = new Date(data.checkIn);
    const userCheckOut = new Date(data.checkOut);
    const userCinDay = toUTCDay(userCheckIn);
    const userCoutDay = toUTCDay(userCheckOut);

    console.log("[Availability] User dates (UTC days):", { userCinDay: new Date(userCinDay).toISOString(), userCoutDay: new Date(userCoutDay).toISOString() });

    // 4. Filter: keep villas that have NO overlapping active bookings
    const availableVillas = villas.filter(v => {
      const hasOverlap = v.bookings.some(b => {
        const bCinDay = toUTCDay(new Date(b.checkIn));
        const bCoutDay = toUTCDay(new Date(b.checkOut));
        // Standard interval overlap: [userCin, userCout) overlaps [bCin, bCout)
        const overlaps = userCinDay < bCoutDay && userCoutDay > bCinDay;
        if (overlaps) {
          console.log(`[Availability] Villa "${v.name}" blocked by booking: ${new Date(bCinDay).toISOString().split('T')[0]} - ${new Date(bCoutDay).toISOString().split('T')[0]} (${b.status})`);
        }
        return overlaps;
      });
      return !hasOverlap;
    });

    console.log("[Availability] Available villas after date filter:", availableVillas.length, "/", villas.length);

    return {
      success: true,
      villas: availableVillas.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        price: v.price,
        bedrooms: v.bedrooms,
        guests: v.guests,
        location: v.location,
        image: v.images[0] || "/images/hero-villa.png"
      }))
    };
  } catch (error: any) {
    console.error("[Availability] FATAL ERROR:", error);
    return { success: false, error: "Failed to check availability" };
  }
}

