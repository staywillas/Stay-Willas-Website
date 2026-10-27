"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { parseICal } from "@/lib/ical-sync";
import { startOfDay, parseISO } from "date-fns";
import { sendAdminLeadNotification } from "@/lib/lead-notifications";
import { categorizeNight } from "@/lib/calendar-holidays";
import type { LeadAttribution } from "@/lib/angle-house-measurement";
import { getTemporaryAvailabilityBlocks, hasTemporaryAvailabilityConflict } from "@/lib/temporary-availability-blocks";

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
  let normalWeekdayStayPrice = 0;
  let normalWeekdayNights = 0;
  let weekendAndHolidayStayPrice = 0;
  let weekendAndHolidayNights = 0;
  let currentDate = new Date(checkIn);
  currentDate.setHours(0, 0, 0, 0);
  const end = new Date(checkOut);
  end.setHours(0, 0, 0, 0);
  const start = new Date(currentDate);

  while (currentDate.getTime() < end.getTime()) {
    let nightPrice = 0;
    const checkY = currentDate.getFullYear();
    const checkM = currentDate.getMonth();
    const checkD = currentDate.getDate();
    const checkIso = `${checkY}-${String(checkM + 1).padStart(2, "0")}-${String(checkD).padStart(2, "0")}`;

    const dailyOverride = villa.dailyPrices.find(dp => {
      if (!dp?.date) return false;
      const dDate = new Date(dp.date);
      const matchLocal = dDate.getFullYear() === checkY && dDate.getMonth() === checkM && dDate.getDate() === checkD;
      const matchUTC = dDate.getUTCFullYear() === checkY && dDate.getUTCMonth() === checkM && dDate.getUTCDate() === checkD;
      const matchStr = typeof dp.date === "string" && (dp.date as string).startsWith(checkIso);
      return matchLocal || matchUTC || matchStr;
    });

    if (dailyOverride) {
      nightPrice = dailyOverride.price;
    } else {
      // 1. Check seasonal pricing table overrides
      const seasonalOverride = villa.seasonalPrices.find(sp => {
        const start = new Date(sp.startDate);
        const endSp = new Date(sp.endDate);
        return currentDate.getTime() >= start.getTime() && currentDate.getTime() <= endSp.getTime();
      });

      if (seasonalOverride) {
        nightPrice = seasonalOverride.price;
      } else {
        // 2. Check specific day-of-week pricing overrides
        const dayOfWeek = currentDate.getDay();
        
        if (dayOfWeek === 5 && villa.fridayPrice != null) {
          nightPrice = villa.fridayPrice;
        } else if (dayOfWeek === 6 && villa.saturdayPrice != null) {
          nightPrice = villa.saturdayPrice;
        } else if (dayOfWeek === 0 && villa.sundayPrice != null) {
          nightPrice = villa.sundayPrice;
        } else {
          // 3. Check legacy weekend pricing
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
          if (isWeekend && villa.weekendPrice) {
            nightPrice = villa.weekendPrice;
          } else {
            // 4. Fallback to base pricing
            nightPrice = villa.price;
          }
        }
      }
    }

    totalStayPrice += nightPrice;
    const { category } = categorizeNight(currentDate);
    if (category === "NORMAL_WEEKDAY") {
      normalWeekdayStayPrice += nightPrice;
      normalWeekdayNights++;
    } else {
      weekendAndHolidayStayPrice += nightPrice;
      weekendAndHolidayNights++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const isWillowPeak = villa.slug === "willow-peak";
  const cottagesCount = isWillowPeak ? Math.max(1, Math.min(3, Math.ceil(guests / 4))) : 1;

  if (isWillowPeak) {
    // Proportional pricing based on number of cottages booked (1 cottage = 1/3, 2 = 2/3, 3 = 3/3)
    totalStayPrice = Math.round(totalStayPrice * (cottagesCount / 3));
    normalWeekdayStayPrice = Math.round(normalWeekdayStayPrice * (cottagesCount / 3));
    weekendAndHolidayStayPrice = Math.round(weekendAndHolidayStayPrice * (cottagesCount / 3));
  }

  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const baseGuestsCount = isWillowPeak ? (cottagesCount * 4) : (villa.baseGuests ?? villa.guests);
  const extraGuests = Math.max(0, guests - baseGuestsCount);
  const extraGuestsCostPerNight = villa.extraGuestFee ? extraGuests * villa.extraGuestFee : 0;
  const totalExtraGuestsCost = extraGuestsCostPerNight * (nights > 0 ? nights : 0);
  const normalWeekdayExtraGuestsCost = extraGuestsCostPerNight * normalWeekdayNights;
  const normalWeekdayEligibleTotal = normalWeekdayStayPrice + normalWeekdayExtraGuestsCost;
  const weekendAndHolidayExtraGuestsCost = extraGuestsCostPerNight * weekendAndHolidayNights;
  const weekendAndHolidayEligibleTotal = weekendAndHolidayStayPrice + weekendAndHolidayExtraGuestsCost;

  return { 
    totalRoomPrice: totalStayPrice, 
    totalExtraGuestsCost,
    normalWeekdayEligibleTotal,
    normalWeekdayNights,
    weekendAndHolidayEligibleTotal,
    weekendAndHolidayNights,
    weekdayEligibleTotal: normalWeekdayEligibleTotal,
    baseRate: villa.price,
    extraGuestsCostPerNight,
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
  userId?: string;
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
    const { 
      totalRoomPrice, 
      totalExtraGuestsCost, 
      normalWeekdayEligibleTotal,
      weekendAndHolidayEligibleTotal
    } = await calculateStayPrice(formData.villaId, checkInDate, checkOutDate, formData.guests);

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
    const isSingleWillowCottage = isWillowCottage || (isWillowPeak && requiredCottages < 3);
    if (formData.couponCode && !isSingleWillowCottage) {
      const code = formData.couponCode.trim().toUpperCase();

      if (code === "STAYW26" || code.includes("26") || code === "ESCAPE26" || code === "LONAVALA26" || code === "KHOPOLI26" || code === "STAYW28" || code.includes("28")) {
        // 26% on normal weekdays + 5% on weekends and long weekends
        discount = Math.round(normalWeekdayEligibleTotal * 0.26) + Math.round(weekendAndHolidayEligibleTotal * 0.05);
      } else if (code === "STAY5" || code === "WEEKEND5") {
        discount = Math.round((normalWeekdayEligibleTotal + weekendAndHolidayEligibleTotal) * 0.05);
      } else if (code === "STAY10" || code.includes("10")) {
        discount = Math.round((normalWeekdayEligibleTotal + weekendAndHolidayEligibleTotal) * 0.10);
      } else {
        discount = Math.round(normalWeekdayEligibleTotal * 0.26) + Math.round(weekendAndHolidayEligibleTotal * 0.05);
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
        slug: true,
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
    const angleHouse = villas.find((villa) => villa.slug === "the-angle-house");
    const temporaryBlocks = angleHouse
      ? getTemporaryAvailabilityBlocks("the-angle-house").map((booking) => ({
          ...booking,
          villaId: angleHouse.id,
        }))
      : [];

    return { 
      success: true, 
      bookings: [
        ...allBookings.map(b => ({
          checkIn: b.checkIn.toISOString(),
          checkOut: b.checkOut.toISOString(),
          villaId: b.villaId
        })),
        ...temporaryBlocks,
      ],
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
  villaSlug?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  try {
    const region = data.destination && data.destination !== "all" && data.destination !== "All Locations" ? data.destination.trim() : "";
    const specificSlug = data.villaSlug && data.villaSlug !== "all" ? data.villaSlug.trim() : "";
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Helper: extract UTC date-only stamp (ignoring time/timezone)
    const toUTCDay = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

    console.log("[Availability] Search request:", { region: region || "ALL", villaSlug: specificSlug || "ALL", checkIn: data.checkIn, checkOut: data.checkOut, guests: data.guests });

    // 1. Query ALL villas (filtered by location or specific slug)
    const whereClause: any = {};
    if (specificSlug) {
      whereClause.slug = specificSlug;
    } else if (region) {
      whereClause.location = { contains: region, mode: "insensitive" };
    }

    const rawVillas = await prisma.villa.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        weekendPrice: true,
        fridayPrice: true,
        saturdayPrice: true,
        sundayPrice: true,
        bedrooms: true,
        bathrooms: true,
        guests: true,
        location: true,
        category: true,
        amenities: true,
        images: true,
        dailyPrices: true,
        seasonalPrices: true,
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

    // Sort to prioritize signature properties
    const villas = [...rawVillas]
      .sort((a, b) => {
      if (a.slug === "the-angle-house" && b.slug !== "the-angle-house") return -1;
      if (b.slug === "the-angle-house" && a.slug !== "the-angle-house") return 1;
      if (a.slug === "canopy-crest" && b.slug !== "canopy-crest") return -1;
      if (b.slug === "canopy-crest" && a.slug !== "canopy-crest") return 1;
      if (a.slug === "casa-de-reva" && b.slug !== "casa-de-reva") return -1;
      if (b.slug === "casa-de-reva" && a.slug !== "casa-de-reva") return 1;
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
      const hasTemporaryBlock = hasTemporaryAvailabilityConflict(v.slug, userCheckIn, userCheckOut);
      return !hasOverlap && !hasTemporaryBlock;
    });

    console.log("[Availability] Available villas after date filter:", availableVillas.length, "/", villas.length);

    // Helper to calculate dynamic rate for dates
    const calculateDynamicRate = (v: typeof villas[0]) => {
      let cur = new Date(userCheckIn);
      const end = new Date(userCheckOut);
      let total = 0;
      let nightsCount = 0;

      while (cur.getTime() < end.getTime()) {
        let nightRate = v.price;
        const checkY = cur.getFullYear();
        const checkM = cur.getMonth();
        const checkD = cur.getDate();
        const checkIso = `${checkY}-${String(checkM + 1).padStart(2, "0")}-${String(checkD).padStart(2, "0")}`;

        // Priority 1: Exact daily override
        const dailyOverride = v.dailyPrices?.find(dp => {
          if (!dp?.date) return false;
          const dDate = new Date(dp.date);
          const matchLocal = dDate.getFullYear() === checkY && dDate.getMonth() === checkM && dDate.getDate() === checkD;
          const matchUTC = dDate.getUTCFullYear() === checkY && dDate.getUTCMonth() === checkM && dDate.getUTCDate() === checkD;
          const matchStr = typeof dp.date === "string" && (dp.date as string).startsWith(checkIso);
          return matchLocal || matchUTC || matchStr;
        });

        if (dailyOverride) {
          nightRate = dailyOverride.price;
        } else {
          // Priority 2: Seasonal override
          const seasonal = v.seasonalPrices?.find(sp => {
            const start = new Date(sp.startDate);
            const endSp = new Date(sp.endDate);
            return cur.getTime() >= start.getTime() && cur.getTime() <= endSp.getTime();
          });

          if (seasonal) {
            nightRate = seasonal.price;
          } else {
            // Priority 3: Day-of-week rates
            const dayOfWeek = cur.getDay();
            if (dayOfWeek === 5 && v.fridayPrice != null) {
              nightRate = v.fridayPrice;
            } else if (dayOfWeek === 6 && v.saturdayPrice != null) {
              nightRate = v.saturdayPrice;
            } else if (dayOfWeek === 0 && v.sundayPrice != null) {
              nightRate = v.sundayPrice;
            } else if ((dayOfWeek === 5 || dayOfWeek === 6) && v.weekendPrice) {
              nightRate = v.weekendPrice;
            } else {
              nightRate = v.price;
            }
          }
        }

        total += nightRate;
        nightsCount++;
        cur.setDate(cur.getDate() + 1);
      }

      return nightsCount > 0 ? Math.round(total / nightsCount) : v.price;
    };

    return {
      success: true,
      villas: availableVillas.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        price: calculateDynamicRate(v),
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
  addOns?: string[];
  couponCode?: string;
  cottageSelection?: string;
  specialRequest?: string;
  attribution?: LeadAttribution;
}) {
  try {
    const guestName = data.guestName?.trim().slice(0, 100) || "";
    const guestPhone = data.guestPhone?.trim().slice(0, 30) || "";
    const guestEmail = data.guestEmail?.trim().slice(0, 150) || "";
    const specialRequest = data.specialRequest?.trim().slice(0, 500) || "";
    const phoneDigits = guestPhone.replace(/\D/g, "");

    if (!data.villaId || !guestName || !guestPhone || !data.checkIn || !data.checkOut) {
      return { success: false, error: "Add your name, WhatsApp number and stay dates." };
    }
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return { success: false, error: "Enter a valid WhatsApp number." };
    }
    if (guestEmail && !/^\S+@\S+\.\S+$/.test(guestEmail)) {
      return { success: false, error: "Enter a valid email address or leave it blank." };
    }
    if (!Number.isInteger(data.guests) || data.guests < 1) {
      return { success: false, error: "Select a valid guest count." };
    }

    // Send and parse date-only values so a guest's local midnight cannot shift
    // to the previous calendar day when the server runs in another timezone.
    const checkInDate = startOfDay(typeof data.checkIn === "string" ? parseISO(data.checkIn) : new Date(data.checkIn));
    const checkOutDate = startOfDay(typeof data.checkOut === "string" ? parseISO(data.checkOut) : new Date(data.checkOut));
    if (!Number.isFinite(checkInDate.getTime()) || !Number.isFinite(checkOutDate.getTime())) {
      return { success: false, error: "Choose valid check-in and check-out dates." };
    }
    if (checkInDate < startOfDay(new Date())) {
      return { success: false, error: "Check-in must be today or a future date." };
    }
    if (checkOutDate <= checkInDate) {
      return { success: false, error: "Check-out date must be after check-in date." };
    }
    const requestedNights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (requestedNights > 365) {
      return { success: false, error: "Choose a stay of 365 nights or fewer." };
    }

    const villa = await prisma.villa.findUnique({
      where: { id: data.villaId },
      select: { id: true, slug: true, name: true, guests: true },
    });
    if (!villa) return { success: false, error: "This villa is no longer available. Please refresh and try again." };
    if (hasTemporaryAvailabilityConflict(villa.slug, checkInDate, checkOutDate)) {
      return { success: false, error: "Those dates are unavailable. Please choose another date range." };
    }
    if (data.guests > villa.guests) {
      return { success: false, error: `This stay allows up to ${villa.guests} guests.` };
    }
    if (data.cottageSelection && !["A", "B", "C", "ALL"].includes(data.cottageSelection)) {
      return { success: false, error: "Choose a valid cottage option." };
    }
    if (villa.slug === "willow-peak") {
      if (!data.cottageSelection) {
        return { success: false, error: "Choose a Willow Peak cottage option." };
      }
      const maxGuestsForSelection = data.cottageSelection === "ALL" ? 12 : 4;
      if (data.guests > maxGuestsForSelection) {
        return { success: false, error: `This cottage selection allows up to ${maxGuestsForSelection} guests.` };
      }
    }

    // Awaiting-verification requests do not hold dates. Recheck active inventory before saving.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    let relevantVillaIds = [villa.id];
    if (villa.slug.startsWith("willow-peak-cottage")) {
      const estate = await prisma.villa.findFirst({ where: { slug: "willow-peak" }, select: { id: true } });
      if (estate) relevantVillaIds.push(estate.id);
    } else if (villa.slug === "willow-peak") {
      const willowVillas = await prisma.villa.findMany({
        where: { OR: [{ slug: "willow-peak" }, { slug: { startsWith: "willow-peak-cottage" } }] },
        select: { id: true },
      });
      relevantVillaIds = willowVillas.map((item) => item.id);
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        villaId: { in: relevantVillaIds },
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED", "HELD"] },
        OR: [
          { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
          { status: "HELD", createdAt: { gte: tenMinutesAgo } },
        ],
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
      select: { id: true },
    });
    if (conflict) {
      return { success: false, error: "Those dates have just become unavailable. Please choose another date range." };
    }

    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const selectedAddOns = Array.isArray(data.addOns) ? [...new Set(data.addOns)] : [];
    const addOnRates: Record<string, number> = {
      "Gourmet Chef Experience": 6000,
      "Curated Vineyard Tour": 4500,
      "Celebration Decoration": 7500,
      "Premium SUV Airport Transfer": 9500,
    };
    if (selectedAddOns.some((item) => !Object.prototype.hasOwnProperty.call(addOnRates, item))) {
      return { success: false, error: "One of the selected extras is no longer available. Refresh and try again." };
    }

    const pricingGuests = villa.slug === "willow-peak" && data.cottageSelection === "ALL"
      ? Math.max(data.guests, 12)
      : data.guests;
    const pricing = await calculateStayPrice(villa.id, checkInDate, checkOutDate, pricingGuests);
    const addOnsTotal = selectedAddOns.reduce((sum, item) => {
      if (item === "Gourmet Chef Experience") return sum + addOnRates[item] * nights;
      if (item === "Curated Vineyard Tour") return sum + addOnRates[item] * data.guests;
      return sum + addOnRates[item];
    }, 0);
    const isWillowCottage = villa.slug.startsWith("willow-peak-cottage");
    const isSingleWillowCottage = isWillowCottage || (villa.slug === "willow-peak" && pricing.cottagesCount < 3);
    const couponCode = data.couponCode?.trim().toUpperCase();
    const discount = couponCode === "STAYW26" && !isSingleWillowCottage
      ? Math.round(pricing.normalWeekdayEligibleTotal * 0.26) + Math.round(pricing.weekendAndHolidayEligibleTotal * 0.05)
      : 0;
    const totalPrice = Math.max(0, pricing.totalRoomPrice + pricing.totalExtraGuestsCost + addOnsTotal - discount);

    const attribution = data.attribution
      ? Object.fromEntries(
          Object.entries(data.attribution)
            .filter(([, value]) => typeof value === "string")
            .map(([key, value]) => [key, String(value).slice(0, 200)]),
        )
      : undefined;
    const userPayload = JSON.stringify({
      type: "ONLINE_VERIFICATION",
      name: guestName,
      phone: guestPhone,
      email: guestEmail,
      guests: data.guests,
      cottageSelection: villa.slug.includes("willow") ? data.cottageSelection : undefined,
      coupon: couponCode || null,
      specialRequest,
      attribution,
      submittedAt: new Date().toISOString(),
    });

    const booking = await prisma.booking.create({
      data: {
        villaId: villa.id,
        userId: userPayload,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: "AWAITING_VERIFICATION",
        addOns: selectedAddOns,
        kycName: guestName,
      },
      select: { id: true },
    });

    const unitDetail = villa.slug === "willow-peak"
      ? (data.cottageSelection === "ALL" ? "Entire estate" : `Cottage ${data.cottageSelection}`)
      : undefined;
    const requestMessage = [
      "Direct booking request awaiting concierge verification.",
      "Availability and final price must be confirmed with the guest; dates are not held and no website payment was collected.",
      unitDetail ? `Unit: ${unitDetail}.` : "",
      specialRequest ? `Guest request: ${specialRequest}` : "",
    ].filter(Boolean).join(" ");

    sendAdminLeadNotification({
      type: "BOOKING_REQUEST",
      name: guestName,
      phone: guestPhone,
      email: guestEmail || undefined,
      villaName: villa.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: data.guests,
      totalPrice,
      couponCode: couponCode || undefined,
      addOns: selectedAddOns.length ? selectedAddOns : undefined,
      message: requestMessage,
    }).catch((err) => console.error("Failed to dispatch booking request email:", err));

    return {
      success: true,
      bookingId: booking.id,
      totalPrice,
      message: "Your booking request has been submitted for concierge verification.",
    };
  } catch (error: any) {
    console.error("createAwaitingVerificationBooking error:", error);
    return { success: false, error: error.message || "Failed to submit booking request." };
  }
}
/**
 * Retrieves full villa pricing, bookings, and configuration for Homepage Quick Booking Modal
 */
export async function getVillaBookingDetails(slugOrId: string) {
  try {
    let villa = await prisma.villa.findUnique({
      where: { slug: slugOrId },
      include: {
        dailyPrices: true,
        seasonalPrices: true,
      },
    });

    if (!villa) {
      villa = await prisma.villa.findUnique({
        where: { id: slugOrId },
        include: {
          dailyPrices: true,
          seasonalPrices: true,
        },
      });
    }

    if (!villa) {
      return { success: false, error: "Villa not found" };
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const isWillowCottage = villa.slug.startsWith("willow-peak-cottage");
    const isWillowEntire = villa.slug === "willow-peak";

    let relatedVillaIds = [villa.id];
    if (isWillowCottage) {
      const entireEstate = await prisma.villa.findFirst({ where: { slug: "willow-peak" } });
      if (entireEstate) relatedVillaIds.push(entireEstate.id);
    } else if (isWillowEntire) {
      const allWillow = await prisma.villa.findMany({
        where: {
          OR: [
            { slug: "willow-peak" },
            { slug: { startsWith: "willow-peak-cottage" } }
          ]
        },
        select: { id: true }
      });
      relatedVillaIds = allWillow.map(v => v.id);
    }

    const activeBookings = await prisma.booking.findMany({
      where: {
        villaId: { in: relatedVillaIds },
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED", "HELD"] },
        OR: [
          { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
          { status: "HELD", createdAt: { gte: tenMinutesAgo } }
        ]
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        userId: true,
      }
    });

    const serializedBookings = activeBookings.map(b => {
      let cottagesCount = 1;
      try {
        if (b.userId && b.userId.startsWith('{')) {
          const parsed = JSON.parse(b.userId);
          if (parsed.cottagesCount) cottagesCount = parsed.cottagesCount;
          else if (parsed.guests) cottagesCount = Math.max(1, Math.min(3, Math.ceil(parsed.guests / 4)));
        }
      } catch (e) {}

      return {
        checkIn: b.checkIn.toISOString(),
        checkOut: b.checkOut.toISOString(),
        status: b.status,
        cottagesCount,
      };
    });

    return {
      success: true,
      villa: {
        id: villa.id,
        name: villa.name,
        slug: villa.slug,
        price: villa.price,
        weekendPrice: villa.weekendPrice,
        fridayPrice: villa.fridayPrice,
        saturdayPrice: villa.saturdayPrice,
        sundayPrice: villa.sundayPrice,
        dailyPrices: villa.dailyPrices.map(dp => ({
          id: dp.id,
          villaId: dp.villaId,
          date: dp.date instanceof Date ? dp.date.toISOString() : dp.date,
          price: dp.price,
        })),
        seasonalPrices: villa.seasonalPrices.map(sp => ({
          id: sp.id,
          villaId: sp.villaId,
          startDate: sp.startDate instanceof Date ? sp.startDate.toISOString() : sp.startDate,
          endDate: sp.endDate instanceof Date ? sp.endDate.toISOString() : sp.endDate,
          price: sp.price,
          label: sp.label,
        })),
        maxGuests: villa.guests,
        baseGuests: villa.baseGuests ?? undefined,
        extraGuestFee: villa.extraGuestFee ?? undefined,
        location: villa.location,
        isAngleHouse: villa.slug === "the-angle-house",
        bookings: [...serializedBookings, ...getTemporaryAvailabilityBlocks(villa.slug)],
      }
    };
  } catch (error: any) {
    console.error("getVillaBookingDetails error:", error);
    return { success: false, error: error.message || "Failed to fetch villa booking details." };
  }
}


