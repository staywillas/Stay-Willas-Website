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

  const isWillowPeak = villa.slug === "willow-peak";
  const cottagesCount = isWillowPeak ? Math.max(1, Math.min(3, Math.ceil(guests / 4))) : 1;

  if (isWillowPeak) {
    // Proportional pricing based on number of cottages booked (1 cottage = 1/3, 2 = 2/3, 3 = 3/3)
    totalStayPrice = Math.round(totalStayPrice * (cottagesCount / 3));
  }

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const baseGuestsCount = isWillowPeak ? (cottagesCount * 4) : (villa.baseGuests ?? villa.guests);
  const extraGuests = Math.max(0, guests - baseGuestsCount);
  const extraGuestsCostPerNight = villa.extraGuestFee ? extraGuests * villa.extraGuestFee : 0;
  const totalExtraGuestsCost = extraGuestsCostPerNight * (nights > 0 ? nights : 0);

  return { 
    totalRoomPrice: totalStayPrice, 
    totalExtraGuestsCost,
    baseRate: villa.price,
    cottagesCount
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
    const targetVilla = await prisma.villa.findUnique({
      where: { id: formData.villaId }
    });
    const isWillowPeak = targetVilla?.slug === "willow-peak" || formData.villaName.toLowerCase().includes("willow");
    const requiredCottages = isWillowPeak ? Math.max(1, Math.min(3, Math.ceil(formData.guests / 4))) : 1;

    // 1. STAGE A: Strict Double Booking & Lock Prevention using Transaction Checks
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const isWillowEntire = targetVilla?.slug === "willow-peak";
    const isWillowCottage = Boolean(targetVilla?.slug?.startsWith("willow-peak-cottage"));

    let relevantVillaIds = [formData.villaId];
    if (isWillowCottage) {
      // If booking an individual cottage, also check if the entire estate is booked
      const entireEstate = await prisma.villa.findFirst({ where: { slug: "willow-peak" } });
      if (entireEstate) relevantVillaIds.push(entireEstate.id);
    } else if (isWillowEntire) {
      // If booking entire estate, check all 3 cottages and entire estate
      const allWillow = await prisma.villa.findMany({
        where: {
          OR: [
            { slug: "willow-peak" },
            { slug: { startsWith: "willow-peak-cottage" } }
          ]
        },
        select: { id: true }
      });
      relevantVillaIds = allWillow.map(v => v.id);
    }

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        villaId: { in: relevantVillaIds },
        status: { in: ["CONFIRMED", "BLOCKED", "HELD"] },
        OR: [
          { status: { in: ["CONFIRMED", "BLOCKED"] } },
          { status: "HELD", createdAt: { gte: tenMinutesAgo } }
        ],
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } }
        ]
      },
      include: {
        villa: true
      }
    });

    if (isWillowEntire) {
      if (overlappingBookings.length > 0) {
        throw new Error("Cannot book Willow Peak (Entire Estate): one or more cottages or the entire estate is already reserved on these dates. Please select different dates.");
      }
    } else if (isWillowCottage) {
      if (overlappingBookings.length > 0) {
        throw new Error("This cottage is unavailable on the selected dates (either already booked or the Entire Estate is reserved). Please select different dates.");
      }
    } else {
      if (overlappingBookings.length > 0) {
        throw new Error("These dates are already booked or temporarily locked by another user in checkout. Please select different dates.");
      }
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
    let discount = 0;
    if (formData.couponCode) {
      const code = formData.couponCode.trim().toUpperCase();
      
      // Calculate weekday-only eligible accommodation price
      let weekdayEligibleRoomPrice = 0;
      let weekdayNights = 0;
      let curNight = new Date(checkInDate);
      
      while (curNight.getTime() < checkOutDate.getTime()) {
        const day = curNight.getDay();
        // Monday (1) to Thursday (4) are weekdays
        if (day >= 1 && day <= 4) {
          const matchingDaily = dailyPrices.find((dp: any) => {
            const d = new Date(dp.date);
            return curNight.getFullYear() === d.getUTCFullYear() &&
                   curNight.getMonth() === d.getUTCMonth() &&
                   curNight.getDate() === d.getUTCDate();
          });
          
          let nightRate = matchingDaily ? matchingDaily.price : baseRate;
          nightRate = Math.round(nightRate * (isWillowPeak ? (requiredCottages / 3) : 1));
          weekdayEligibleRoomPrice += nightRate;
          weekdayNights++;
        }
        curNight.setDate(curNight.getDate() + 1);
      }

      const weekdayExtraGuestsCost = extraGuestsCostPerNight * weekdayNights;
      const weekdayEligibleTotal = weekdayEligibleRoomPrice + weekdayExtraGuestsCost;

      if (code === "STAYW28" || code.includes("28") || code === "ESCAPE28" || code === "LONAVALA28" || code === "KHOPOLI28") {
        discount = Math.round(weekdayEligibleTotal * 0.28);
      } else if (code === "STAY5") {
        discount = Math.round(weekdayEligibleTotal * 0.05);
      } else if (code === "STAY10" || code.includes("10")) {
        discount = Math.round(weekdayEligibleTotal * 0.10);
      }
    }
    const finalTotal = totalRoomPrice + totalExtraGuestsCost + addOnsPrice + serviceFee - discount;

    const userPayload = JSON.stringify({
      userId: formData.userId || "GUEST_USER",
      guests: formData.guests,
      cottagesCount: requiredCottages,
      cottageLabel: isWillowPeak ? `${requiredCottages} of 3 Cottages` : undefined,
    });

    // 4. STAGE D: Create database HELD Booking Record to secure the locked dates for 10 minutes
    const holdBooking = await prisma.booking.create({
      data: {
        villaId: formData.villaId,
        userId: userPayload,
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
export async function getDestinationAvailability(region?: string) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const villas = await prisma.villa.findMany({
      where: region && region !== "all" ? {
        location: {
          contains: region,
          mode: "insensitive",
        },
      } : {},
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
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  try {
    const region = data.destination && data.destination !== "all" ? data.destination.trim() : "";
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Helper: extract UTC date-only stamp (ignoring time/timezone)
    const toUTCDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

    console.log("[Availability] Search request:", { region: region || "ALL", checkIn: data.checkIn, checkOut: data.checkOut, guests: data.guests });

    // 1. Query ALL villas (filtered by location only if specific destination is passed)
    const whereClause: any = {};
    if (region) {
      whereClause.location = { contains: region, mode: "insensitive" };
    }

    const rawVillas = await prisma.villa.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        guests: true,
        location: true,
        category: true,
        amenities: true,
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

    // Sort to prioritize The Angle House and Canopy Crest
    const villas = [...rawVillas].sort((a, b) => {
      if (a.slug === "the-angle-house" && b.slug !== "the-angle-house") return -1;
      if (b.slug === "the-angle-house" && a.slug !== "the-angle-house") return 1;
      if (a.slug === "canopy-crest" && b.slug !== "canopy-crest") return -1;
      if (b.slug === "canopy-crest" && a.slug !== "canopy-crest") return 1;
      return 0;
    });

    console.log("[Availability] Villas found:", villas.length);

    // 2. If no dates provided, return all sorted villas
    if (!data.checkIn || !data.checkOut) {
      return {
        success: true,
        villas: villas.map(v => ({
          id: v.id,
          name: v.name,
          slug: v.slug,
          price: v.price,
          bedrooms: v.bedrooms,
          bathrooms: v.bathrooms,
          guests: v.guests,
          location: v.location,
          category: v.category,
          amenities: v.amenities,
          image: v.images[0] || "/images/hero-villa.webp"
        }))
      };
    }

    // 3. Parse user dates and normalize to UTC day boundaries
    const userCheckIn = new Date(data.checkIn);
    const userCheckOut = new Date(data.checkOut);
    const userCinDay = toUTCDay(userCheckIn);
    const userCoutDay = toUTCDay(userCheckOut);

    // 4. Filter: keep villas that have NO overlapping active bookings
    const availableVillas = villas.filter(v => {
      const hasOverlap = v.bookings.some(b => {
        const bCinDay = toUTCDay(new Date(b.checkIn));
        const bCoutDay = toUTCDay(new Date(b.checkOut));
        const overlaps = userCinDay < bCoutDay && userCoutDay > bCinDay;
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
        bathrooms: v.bathrooms,
        guests: v.guests,
        location: v.location,
        category: v.category,
        amenities: v.amenities,
        image: v.images[0] || "/images/hero-villa.webp"
      }))
    };
  } catch (error: any) {
    console.error("[Availability] Error:", error);
    return { success: false, error: "Failed to check availability" };
  }
}

/**
 * Creates a provisional reservation awaiting admin verification and confirmation
 */
export async function createAwaitingVerificationBooking(data: {
  villaId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
  addOns?: any[];
  couponCode?: string;
  totalPrice: number;
  cottageSelection?: string;
}) {
  try {
    if (!data.villaId || !data.guestName || !data.guestPhone || !data.checkIn || !data.checkOut) {
      return { success: false, error: "Missing required booking details." };
    }

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    if (checkOutDate <= checkInDate) {
      return { success: false, error: "Check-out date must be after check-in date." };
    }

    // Verify no conflicting confirmed or blocked booking exists
    const conflict = await prisma.booking.findFirst({
      where: {
        villaId: data.villaId,
        status: { in: ["CONFIRMED", "BLOCKED"] },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflict) {
      return {
        success: false,
        error: "These dates have already been reserved. Please choose alternate dates.",
      };
    }

    const userPayload = JSON.stringify({
      type: "ONLINE_VERIFICATION",
      name: data.guestName.trim(),
      phone: data.guestPhone.trim(),
      email: data.guestEmail?.trim() || "",
      guests: data.guests,
      cottageSelection: data.cottageSelection || "ALL",
      coupon: data.couponCode || null,
      submittedAt: new Date().toISOString(),
    });

    const booking = await prisma.booking.create({
      data: {
        villaId: data.villaId,
        userId: userPayload,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: data.totalPrice,
        status: "AWAITING_VERIFICATION",
        addOns: data.addOns ? (data.addOns as any) : undefined,
        kycName: data.guestName.trim(),
      },
      include: {
        villa: true,
      },
    });

    return {
      success: true,
      bookingId: booking.id,
      booking,
      message: "Your booking request has been submitted for concierge verification.",
    };
  } catch (error: any) {
    console.error("createAwaitingVerificationBooking error:", error);
    return { success: false, error: error.message || "Failed to submit booking for verification." };
  }
}

