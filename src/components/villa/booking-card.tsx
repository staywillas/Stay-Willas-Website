"use client";

import { encodeWhatsAppMessage } from "@/lib/whatsapp";
import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar as CalendarIcon, Users, Info, Loader2, Mail, Phone, CheckCircle2,
  ChefHat, Wine, Gift, Receipt, Tag, Car,
  ChevronLeft, ChevronRight, ShieldCheck, ArrowRight
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { createAwaitingVerificationBooking } from "@/app/actions/booking";
import { captureBookingLead } from "@/app/actions/inquiry";
import { useUser } from "@clerk/nextjs";
import { categorizeNight, checkLongWeekend } from "@/lib/calendar-holidays";
import { getAngleHouseAttribution, trackAngleHouseBookingEnquiry, trackAngleHouseEngagement, trackCanopyCrestBookingEnquiry, trackCanopyCrestInteraction, trackWebsiteWhatsAppClick } from "@/lib/angle-house-measurement";
import { checkAvailableVillasForDates } from "@/app/actions/booking";

interface DailyPriceProp {
  id: string;
  villaId: string;
  date: string | Date;
  price: number;
}

interface SeasonalPriceProp {
  id: string;
  villaId: string;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  label?: string | null;
}

interface BookingProp {
  checkIn: string;
  checkOut: string;
  status: string;
  cottagesCount?: number;
}

interface LiveQuote {
  isAvailable: boolean;
  totalPrice: number;
  roomSubtotal: number;
  directSavings: number;
  baseGuests: number;
  extraGuests: number;
  extraGuestFee: number;
  extraGuestTotal: number;
  nightlyRates: Array<{ date: string; label: string; price: number }>;
}

type FoodPackage = "STANDARD" | "DELUXE";

const foodPackages: Array<{ id: FoodPackage; label: string; price: number }> = [
  { id: "STANDARD", label: "Standard", price: 1250 },
  { id: "DELUXE", label: "Deluxe", price: 1550 },
];

function parseLiveQuote(value: unknown): LiveQuote | null {
  if (!value || typeof value !== "object") return null;
  const quote = value as Partial<LiveQuote>;
  if (
    typeof quote.isAvailable !== "boolean" ||
    typeof quote.totalPrice !== "number" ||
    typeof quote.roomSubtotal !== "number" ||
    typeof quote.directSavings !== "number" ||
    typeof quote.baseGuests !== "number" ||
    typeof quote.extraGuests !== "number" ||
    typeof quote.extraGuestFee !== "number" ||
    typeof quote.extraGuestTotal !== "number" ||
    !Array.isArray(quote.nightlyRates) ||
    !quote.nightlyRates.every((night) =>
      typeof night.date === "string" &&
      typeof night.label === "string" &&
      typeof night.price === "number",
    )
  ) return null;
  return quote as LiveQuote;
}

function sameLiveQuote(a: LiveQuote, b: LiveQuote) {
  return a.totalPrice === b.totalPrice
    && a.roomSubtotal === b.roomSubtotal
    && a.directSavings === b.directSavings
    && a.baseGuests === b.baseGuests
    && a.extraGuests === b.extraGuests
    && a.extraGuestFee === b.extraGuestFee
    && a.extraGuestTotal === b.extraGuestTotal
    && a.nightlyRates.length === b.nightlyRates.length
    && a.nightlyRates.every((night, index) => {
      const next = b.nightlyRates[index];
      return night.date === next?.date && night.price === next?.price && night.label === next?.label;
    });
}

interface BookingCardProps {
  villaId: string;
  villaName: string;
  isAngleHouse?: boolean;
  price: string | number;
  basePrice?: number;
  weekendPrice?: number | null;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  dailyPrices?: DailyPriceProp[];
  seasonalPrices?: SeasonalPriceProp[];
  maxGuests?: number;
  baseGuests?: number;
  extraGuestFee?: number;
  propertySlug?: string;
  bookings?: BookingProp[];
  initialCottageSelection?: "A" | "B" | "C" | "TWO" | "ALL";
  lockCottageSelection?: boolean;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: number;
  onBookingComplete?: () => void;
  isModal?: boolean;
}

const availableAddOns = [
  {
    id: "Gourmet Chef Experience",
    label: "Gourmet Chef Experience",
    description: "Private chef preparing gourmet breakfast, lunch, and dinner.",
    price: 6000,
    perNight: true,
    perGuest: false,
    icon: ChefHat,
  },
  {
    id: "Curated Vineyard Tour",
    label: "Curated Vineyard Tour",
    description: "Private guided tour of premium local vineyards with tasting.",
    price: 4500,
    perNight: false,
    perGuest: true,
    icon: Wine,
  },
  {
    id: "Celebration Decoration",
    label: "Celebration Decoration",
    description: "Custom premium balloon & floral setups for special occasions.",
    price: 7500,
    perNight: false,
    perGuest: false,
    icon: Gift,
  },
  {
    id: "Premium SUV Airport Transfer",
    label: "Premium SUV Airport Transfer",
    description: "Round-trip luxury SUV chauffeured airport transport.",
    price: 9500,
    perNight: false,
    perGuest: false,
    icon: Car,
  },
];

const BookingCard = ({ 
  villaId, 
  villaName, 
  isAngleHouse = false,
  price, 
  maxGuests = 16,
  propertySlug,
  initialCottageSelection,
  lockCottageSelection = false,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  onBookingComplete,
  isModal = false,
}: BookingCardProps) => {
  const { user } = useUser();

  const isWillowPeak = villaId.includes("willow") || villaName.toLowerCase().includes("willow");
  const actualMaxGuests = isWillowPeak ? 12 : (villaName.toLowerCase().includes("canopy") ? 16 : maxGuests);

  const [checkIn, setCheckIn] = useState<Date>(() => {
    if (initialCheckIn) {
      const d = new Date(initialCheckIn);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [checkOut, setCheckOut] = useState<Date>(() => {
    if (initialCheckOut) {
      const d = new Date(initialCheckOut);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const d = addDays(new Date(), 2);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [guests, setGuests] = useState(initialGuests || 2);
  const [guestInput, setGuestInput] = useState(String(initialGuests || 2));
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingStep, setBookingStep] = useState<"quote" | "details">("quote");
  const [calendarError, setCalendarError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedFoodPackage, setSelectedFoodPackage] = useState<FoodPackage | null>(null);
  const [foodGuests, setFoodGuests] = useState(initialGuests || 2);
  const [weekdayOfferSelected, setWeekdayOfferSelected] = useState(false);
  const [weekendOfferSelected, setWeekendOfferSelected] = useState(false);
  const [showAddOns, setShowAddOns] = useState(false);
  const [liveQuote, setLiveQuote] = useState<LiveQuote | null>(null);
  const [liveQuoteStatus, setLiveQuoteStatus] = useState<"idle" | "checking" | "available" | "unavailable" | "error">("idle");
  const [quoteRefreshToken, setQuoteRefreshToken] = useState(0);
  const calendarPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCheckIn) {
      const d = new Date(initialCheckIn);
      d.setHours(0, 0, 0, 0);
      setCheckIn(d);
    }
  }, [initialCheckIn]);

  useEffect(() => {
    if (initialCheckOut) {
      const d = new Date(initialCheckOut);
      d.setHours(0, 0, 0, 0);
      setCheckOut(d);
    }
  }, [initialCheckOut]);

  // Specific Cottage Selection for Willow Peak: "A" | "B" | "C" | "ALL"
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "TWO" | "ALL">(initialCottageSelection || "A");

  useEffect(() => {
    if (initialCottageSelection) {
      setCottageSelection(initialCottageSelection);
    }
  }, [initialCottageSelection]);

  // Cottages required for Willow Peak (1 for Cottage A/B/C, 3 for ALL)
  const cottagesCount = isWillowPeak ? (cottageSelection === "ALL" ? 3 : cottageSelection === "TWO" ? 2 : 1) : 1;
  const isSingleWillowCottage = isWillowPeak && cottageSelection !== "ALL";
  const currentMaxGuests = isWillowPeak ? cottagesCount * 4 : actualMaxGuests;
  const currentMinGuests = isWillowPeak && cottageSelection === "TWO" ? 5 : 1;

  useEffect(() => {
    setFoodGuests(count => Math.max(1, Math.min(guests, count)));
  }, [guests]);

  useEffect(() => {
    if (!initialGuests) return;
    const count = Math.max(currentMinGuests, Math.min(currentMaxGuests, initialGuests));
    setGuests(count);
    setGuestInput(String(count));
  }, [initialGuests, currentMinGuests, currentMaxGuests]);

  const updateGuestCount = (value: number) => {
    const count = Math.max(currentMinGuests, Math.min(currentMaxGuests, value));
    setGuests(count);
    setGuestInput(String(count));
  };

  // Premium custom calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"checkIn" | "checkOut">("checkIn");
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!showCalendar) return;
    const frame = window.requestAnimationFrame(() => {
      calendarPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showCalendar]);

  // Date range overlap check
  const isRangeInvalid = React.useCallback((start: Date, end: Date) => {
    const startNorm = new Date(start);
    startNorm.setHours(0, 0, 0, 0);
    const endNorm = new Date(end);
    endNorm.setHours(0, 0, 0, 0);
    return startNorm.getTime() >= endNorm.getTime();
  }, []);

  // Helper to generate calendar days grid
  const generateCalendarDays = (monthDate: Date) => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const firstDayIndex = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();
    
    const daysArray: (Date | null)[] = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    
    for (let d = 1; d <= totalDays; d++) {
      const dObj = new Date(y, m, d);
      dObj.setHours(0, 0, 0, 0);
      daysArray.push(dObj);
    }
    
    return daysArray;
  };

  const normalizedCheckIn = React.useMemo(() => {
    const d = new Date(checkIn);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [checkIn]);

  const normalizedCheckOut = React.useMemo(() => {
    const d = new Date(checkOut);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [checkOut]);

  // Safe and exact calendar night calculation (immune to timezone/hour truncation)
  const nights = React.useMemo(() => {
    const diffTime = normalizedCheckOut.getTime() - normalizedCheckIn.getTime();
    const computed = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return computed > 0 ? computed : 0;
  }, [normalizedCheckIn, normalizedCheckOut]);

  const handleDayClick = (day: Date) => {
    const targetDay = new Date(day);
    targetDay.setHours(0, 0, 0, 0);

    if (calendarTarget === "checkIn") {
      setCalendarError("");
      setCheckIn(targetDay);
      if (targetDay.getTime() >= normalizedCheckOut.getTime() || isRangeInvalid(targetDay, normalizedCheckOut)) {
        // Automatically find next available checkout date
        let tempOut = addDays(targetDay, 1);
        tempOut.setHours(0, 0, 0, 0);
        while (isRangeInvalid(targetDay, tempOut)) {
          tempOut = addDays(tempOut, 1);
          tempOut.setHours(0, 0, 0, 0);
        }
        setCheckOut(tempOut);
      }
      setCalendarTarget("checkOut");
    } else {
      if (targetDay.getTime() <= normalizedCheckIn.getTime()) {
        setCalendarError("Check-out must be after check-in.");
        return;
      }
      if (isRangeInvalid(normalizedCheckIn, targetDay)) {
        setCalendarError("Those dates are unavailable. Please choose another date range.");
        return;
      }
      setCalendarError("");
      setCheckOut(targetDay);
      setShowCalendar(false);
    }
  };

  // Prefill details from Clerk user session
  React.useEffect(() => {
    if (user) {
      const name = user.fullName ?? user.firstName ?? "";
      const email = user.primaryEmailAddress?.emailAddress ?? "";
      setClientName(name);
      setClientEmail(email);
    }
  }, [user]);

  const selectedNightDates = React.useMemo(
    () => Array.from({ length: nights }, (_, index) => addDays(normalizedCheckIn, index)),
    [normalizedCheckIn, nights],
  );

  // Dynamic add-ons cost calculation
  let addOnsCost = 0;
  selectedAddOns.forEach(addon => {
    if (addon === "Gourmet Chef Experience") {
      addOnsCost += 6000 * (nights > 0 ? nights : 0);
    } else if (addon === "Curated Vineyard Tour") {
      addOnsCost += 4500 * guests;
    } else if (addon === "Celebration Decoration") {
      addOnsCost += 7500;
    } else if (addon === "Premium SUV Airport Transfer") {
      addOnsCost += 9500;
    }
  });

  const selectedFood = foodPackages.find(option => option.id === selectedFoodPackage);
  const foodGuestCount = selectedFood ? Math.max(1, Math.min(guests, foodGuests)) : foodGuests;
  const foodAddOnCost = selectedFood ? selectedFood.price * foodGuestCount * Math.max(0, nights) : 0;
  const bookingAddOns = selectedFood
    ? [...selectedAddOns, `${selectedFood.label} food package; veg and non-veg menus available (${foodGuestCount} guests × ${nights} nights)`]
    : selectedAddOns;

  const handleToggleAddOn = (addon: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addon) 
        ? prev.filter(item => item !== addon) 
        : [...prev, addon]
    );
  };

  const normalWeekdayNightsCount = selectedNightDates.filter(date => categorizeNight(date).category === "NORMAL_WEEKDAY").length;
  const weekendAndHolidayNightsCount = nights - normalWeekdayNightsCount;

  const hasWeekdayOffer = !isSingleWillowCottage && normalWeekdayNightsCount > 0;
  const hasWeekendOffer = !isSingleWillowCottage && weekendAndHolidayNightsCount > 0;
  const isWeekdayOfferApplied = hasWeekdayOffer && weekdayOfferSelected;
  const isWeekendOfferApplied = hasWeekendOffer && weekendOfferSelected;
  const couponCode = isWeekdayOfferApplied && isWeekendOfferApplied
    ? "STAYW26"
    : isWeekdayOfferApplied
      ? "WEEKDAY26"
      : isWeekendOfferApplied
        ? "WEEKEND5"
        : "";
  const isCouponApplied = Boolean(couponCode);

  useEffect(() => {
    setWeekdayOfferSelected(false);
    setWeekendOfferSelected(false);
  }, [normalizedCheckIn, normalizedCheckOut]);

  // Refresh the selected dates, guest count and chosen coupon against the
  // database so the displayed nightly rates and total stay in sync.
  useEffect(() => {
    if (!propertySlug || nights <= 0 || isRangeInvalid(normalizedCheckIn, normalizedCheckOut)) {
      setLiveQuote(null);
      setLiveQuoteStatus("idle");
      return;
    }

    let active = true;
    setLiveQuote(null);
    setLiveQuoteStatus("checking");
    const timeout = window.setTimeout(async () => {
      try {
        const result = await checkAvailableVillasForDates({
          villaSlug: propertySlug,
          checkIn: format(normalizedCheckIn, "yyyy-MM-dd"),
          checkOut: format(normalizedCheckOut, "yyyy-MM-dd"),
          guests,
          couponCode: couponCode || undefined,
          cottageSelection: isWillowPeak ? cottageSelection : undefined,
        });
        if (!active) return;
        if (!result.success) {
          setLiveQuoteStatus("error");
          return;
        }

        const match = result.villas?.find(villa => villa.slug === propertySlug);
        if (!match) {
          setLiveQuoteStatus("unavailable");
          return;
        }
        const quote = parseLiveQuote(match);
        if (!quote) {
          setLiveQuoteStatus("error");
          return;
        }
        setLiveQuote(quote);
        setLiveQuoteStatus(quote.isAvailable && guests <= match.guests ? "available" : "unavailable");
      } catch {
        if (active) setLiveQuoteStatus("error");
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [propertySlug, normalizedCheckIn, normalizedCheckOut, guests, nights, isRangeInvalid, quoteRefreshToken, couponCode, isWillowPeak, cottageSelection]);

  const isLiveQuoteReady = liveQuoteStatus === "available" && liveQuote !== null;
  const hasLivePrice = liveQuote !== null && (liveQuoteStatus === "available" || liveQuoteStatus === "unavailable");
  const discount = hasLivePrice ? liveQuote.directSavings : 0;
  const liveEstimatedTotal = hasLivePrice ? liveQuote.totalPrice + addOnsCost + foodAddOnCost : null;
  const total = liveEstimatedTotal ?? 0;
  const isDatesUnavailable = liveQuoteStatus === "unavailable";
  const canRequestBooking = Boolean(isLiveQuoteReady && !isDatesUnavailable && nights > 0);

  const handleCheckInClick = () => {
    setCalendarTarget("checkIn");
    setShowCalendar(prev => !prev || calendarTarget !== "checkIn");
  };

  const handleCheckOutClick = () => {
    setCalendarTarget("checkOut");
    setShowCalendar(prev => !prev || calendarTarget !== "checkOut");
  };

  const validateBookingDetails = () => {
    if (!clientName.trim()) {
      setBookingError("Enter the primary guest's name.");
      return false;
    }
    const phoneDigits = clientPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setBookingError("Enter a valid WhatsApp number with country code if needed.");
      return false;
    }
    if (clientEmail.trim() && !/^\S+@\S+\.\S+$/.test(clientEmail.trim())) {
      setBookingError("Check the email address or leave it blank.");
      return false;
    }
    setBookingError("");
    return true;
  };

  const handleBooking = async () => {
    if (!validateBookingDetails()) return;
    if (!canRequestBooking || !liveQuote) {
      setBookingError("Wait for the live rates and availability check before continuing.");
      return;
    }

    setIsLoading(true);
    try {
      const latestResult = await checkAvailableVillasForDates({
        villaSlug: propertySlug,
        checkIn: format(normalizedCheckIn, "yyyy-MM-dd"),
        checkOut: format(normalizedCheckOut, "yyyy-MM-dd"),
        guests,
        couponCode: couponCode || undefined,
        cottageSelection: isWillowPeak ? cottageSelection : undefined,
      });
      const latestMatch = latestResult.success
        ? latestResult.villas?.find(villa => villa.slug === propertySlug)
        : undefined;
      const latestQuote = parseLiveQuote(latestMatch);
      if (!latestMatch || !latestQuote) {
        setLiveQuoteStatus("unavailable");
        setLiveQuote(null);
        setBookingError("Those dates are no longer available. Choose new dates and refresh the live quote.");
        return;
      }
      setLiveQuote(latestQuote);
      if (!latestQuote.isAvailable || guests > latestMatch.guests) {
        setLiveQuoteStatus("unavailable");
        setBookingError("Those dates are no longer available. Choose another date range.");
        return;
      }
      setLiveQuoteStatus("available");
      if (!sameLiveQuote(liveQuote, latestQuote)) {
        setBookingError("The live rates changed. Review the refreshed nightly prices and total, then continue again.");
        return;
      }

      const liveTotal = latestQuote.totalPrice + addOnsCost + foodAddOnCost;
      const formattedCheckIn = format(checkIn, "dd MMM yyyy");
      const formattedCheckOut = format(checkOut, "dd MMM yyyy");
      const cottageInfoSection = isWillowPeak
        ? `\n🏡 *Stay:* ${cottageSelection === "ALL" ? "All 3 cottages together" : cottageSelection === "TWO" ? "2 cottages (pair confirmed by concierge)" : `Cottage ${cottageSelection}`}`
        : "";
      const addOnsSection = bookingAddOns.length > 0
        ? `\n• *Add-ons:* ${bookingAddOns.join(", ")}`
        : "";
      const discountSection = latestQuote.directSavings > 0
        ? `\n• *Direct savings:* ₹${latestQuote.directSavings.toLocaleString("en-IN")}`
        : "";
      const requestSection = specialRequest.trim()
        ? `\n• *Request:* ${specialRequest.trim()}`
        : "";
      const emailSection = clientEmail.trim()
        ? `\n• *Email:* ${clientEmail.trim()}`
        : "";

      const message = `Hi Stay Willas, I’d like to check and request a stay at *${villaName}*.${cottageInfoSection}

*Dates:* ${formattedCheckIn} to ${formattedCheckOut} (${nights} nights)
*Guests:* ${guests}${addOnsSection}${discountSection}${requestSection}
*Live total:* ₹${liveTotal.toLocaleString("en-IN")}

*Primary guest:* ${clientName.trim()}
*WhatsApp:* ${clientPhone.trim()}${emailSection}

Please confirm availability and the final amount before confirming my booking.`;
      const whatsappUrl = `https://wa.me/919619042310?text=${encodeWhatsAppMessage(message)}`;

      captureBookingLead({
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim() || undefined,
        villaName,
        villaId,
        checkIn,
        checkOut,
        guests,
        totalPrice: liveTotal,
        couponCode: isCouponApplied ? couponCode : undefined,
        addOns: bookingAddOns,
        message: `WhatsApp booking request for ${villaName}. ${formattedCheckIn} to ${formattedCheckOut}. ${guests} guests. Live total ₹${liveTotal.toLocaleString("en-IN")}.${specialRequest.trim() ? ` Guest request: ${specialRequest.trim()}` : ""}`,
        attribution: isAngleHouse ? getAngleHouseAttribution() : undefined,
      }).then(result => {
        if (isAngleHouse && result.success && result.leadId) {
          trackAngleHouseBookingEnquiry(result.leadId, checkIn, checkOut);
        } else if (propertySlug === "canopy-crest" && result.success && result.leadId) {
          trackCanopyCrestBookingEnquiry();
        }
      }).catch(err => console.error("Failed to capture WhatsApp booking request:", err));

      if (isAngleHouse) trackAngleHouseEngagement("whatsapp_click");
      trackWebsiteWhatsAppClick("villa_booking_whatsapp");
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("WhatsApp booking request failed:", error);
      setBookingError("Could not open WhatsApp. Please try again or use the request option.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAwaitVerificationBooking = async () => {
    if (!validateBookingDetails()) return;
    if (!canRequestBooking || !liveQuote || liveEstimatedTotal === null) {
      setBookingError("Wait for the live rates and availability check before submitting your request.");
      return;
    }

    setIsSubmittingVerification(true);
    try {
      const res = await createAwaitingVerificationBooking({
        villaId,
        guestName: clientName.trim(),
        guestPhone: clientPhone.trim(),
        guestEmail: clientEmail.trim() || undefined,
        checkIn: format(checkIn, "yyyy-MM-dd"),
        checkOut: format(checkOut, "yyyy-MM-dd"),
        guests,
        addOns: selectedAddOns,
        foodPackage: selectedFoodPackage || undefined,
        foodGuests: selectedFoodPackage ? foodGuestCount : undefined,
        couponCode: isCouponApplied ? couponCode : undefined,
        cottageSelection: isWillowPeak ? cottageSelection : undefined,
        expectedTotal: liveEstimatedTotal,
        expectedNightlyRates: liveQuote.nightlyRates,
        specialRequest: specialRequest.trim() || undefined,
        attribution: isAngleHouse ? getAngleHouseAttribution() : undefined,
      });

      if (res.success && res.bookingId) {
        if (isAngleHouse) trackAngleHouseBookingEnquiry(res.bookingId, checkIn, checkOut);
        else if (propertySlug === "canopy-crest") trackCanopyCrestBookingEnquiry();
        setVerificationSubmitted(true);
        setSubmittedBookingId(res.bookingId);
        setSubmittedTotal(res.totalPrice ?? total);
        onBookingComplete?.();
      } else {
        setBookingError(res.error || "Could not submit the request. Please try again.");
        if (res.priceChanged) {
          setQuoteRefreshToken(token => token + 1);
        }
      }
    } catch (error) {
      console.error("Booking request failed:", error);
      setBookingError("Could not submit the request. Please try again.");
    } finally {
      setIsSubmittingVerification(false);
    }
  };
  if (verificationSubmitted) {
    return (
      <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xl w-full font-sans animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} className="text-emerald-600" />
        </div>
        <div>
          <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.2em] block mb-1">
            Request submitted · awaiting confirmation
          </span>
          <h3 className="text-2xl font-heading font-bold text-[#1B3564]">
            Thank You, {clientName}!
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md mx-auto">
            Your request for <strong>{villaName}</strong> has been received. The team will check availability and the final price, then contact you on WhatsApp. Your dates are not confirmed or held yet.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Booking Reference:</span>
            <span className="font-mono font-bold text-slate-800">{submittedBookingId}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Dates:</span>
            <span className="font-bold text-slate-800">{format(checkIn, "dd MMM yyyy")} – {format(checkOut, "dd MMM yyyy")} ({nights} nights)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Guests:</span>
            <span className="font-bold text-slate-800">{guests} Guest(s)</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Live total at request time:</span>
            <span className="font-bold text-slate-900 text-sm">₹{(submittedTotal ?? total).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Phone:</span>
            <span className="font-bold text-slate-800">{clientPhone}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              const msg = `Hi Stay Willas, I submitted a booking request for *${villaName}* (Reference: ${submittedBookingId}) from ${format(checkIn, "dd MMM yyyy")} to ${format(checkOut, "dd MMM yyyy")}. Guests: ${guests}. Live total at request time: ₹${(submittedTotal ?? total).toLocaleString("en-IN")}. Name: ${clientName}. WhatsApp: ${clientPhone}. Please confirm availability and final pricing.`;
              trackWebsiteWhatsAppClick("booking_confirmation_whatsapp");
              window.open(`https://wa.me/919619042310?text=${encodeWhatsAppMessage(msg)}`, "_blank");
            }}
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <span>💬 Continue with the concierge on WhatsApp</span>
          </button>
          
          <button
            type="button"
            onClick={() => setVerificationSubmitted(false)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Modify or Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white transition-all duration-300 w-full ${
      isModal 
        ? "p-2 sm:p-4 rounded-2xl relative shadow-none border-none" 
        : "border border-border-subtle/80 rounded-3xl p-5 sm:p-7 lg:p-8 sticky top-28 shadow-[0_12px_48px_rgba(27,53,100,0.08)]"
    }`}>
      {isModal && (
        <div className="mb-3 grid grid-cols-2 gap-2" aria-label="Booking steps">
          <div aria-current={bookingStep === "quote" ? "step" : undefined} className={`rounded-lg px-2.5 py-2 text-[10px] font-bold ${bookingStep === "quote" ? "bg-[#1B3564] text-white" : "bg-slate-100 text-slate-500"}`}>1 · Dates, rates &amp; extras</div>
          <div aria-current={bookingStep === "details" ? "step" : undefined} className={`rounded-lg px-2.5 py-2 text-[10px] font-bold ${bookingStep === "details" ? "bg-[#1B3564] text-white" : "bg-slate-100 text-slate-500"}`}>2 · Guest details</div>
        </div>
      )}
      <div className={`flex items-end justify-between gap-3 ${isModal ? "mb-3 pb-2 sm:mb-4 sm:pb-3" : "mb-6 pb-4"} border-b border-border-subtle/50`}>
        <div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
            {nights > 0 ? "Live average for your dates" : "Live pricing"}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`${isModal ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-heading text-[#1B3564] font-black`}>
              {hasLivePrice && liveQuote
                ? `₹${Math.round(liveQuote.roomSubtotal / Math.max(1, nights)).toLocaleString("en-IN")}`
                : nights > 0
                  ? liveQuoteStatus === "unavailable" ? "Unavailable" : liveQuoteStatus === "error" ? "—" : "Checking…"
                  : "Choose dates"}
            </span>
            {nights > 0 && hasLivePrice && <span className="text-text-primary/50 text-xs sm:text-sm font-semibold ml-1.5">/ night</span>}
          </div>
          <div className={`mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-600 ${isModal ? "max-w-[270px]" : "max-w-sm"}`}>
            <Info size={12} className="shrink-0 text-[#8b6815]" aria-hidden="true" />
            <span>{nights > 0 ? "Rates vary by date and demand." : "Choose dates to see current nightly rates."}</span>
          </div>
        </div>
        <div className={`flex shrink-0 items-center gap-1.5 ${isModal ? "px-2 py-1.5" : "px-3 py-2"} rounded-lg text-[9px] sm:text-[10px] font-bold ${
          isDatesUnavailable ? "bg-red-50 text-red-800 border border-red-200" : liveQuoteStatus === "available" ? "bg-[#EEF2F7] text-[#1B3564] border border-[#D7DFEA]" : "bg-amber-50 text-amber-900 border border-amber-200"
        }`} aria-live="polite">
          <span className={`w-1.5 h-1.5 rounded-full ${isDatesUnavailable ? "bg-red-600" : liveQuoteStatus === "available" ? "bg-[#1B3564]" : "bg-amber-500 animate-pulse"}`} />
          <span className="text-[10px] sm:text-xs">
            {isDatesUnavailable ? "Unavailable" : liveQuoteStatus === "available" ? "Available" : liveQuoteStatus === "error" ? "Check failed" : "Checking…"}
          </span>
        </div>
      </div>

      <div className={isModal ? "space-y-3 mb-4 sm:space-y-4 sm:mb-6" : "space-y-4 mb-6"}>
        {bookingStep === "quote" && (
          <>
        {/* Willow Peak Cottage Selector - A, B, C or ALL */}
        {isWillowPeak && !lockCottageSelection && (
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 text-left shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-[#1B3564] flex items-center gap-1.5 font-sans">
                <span>🏡</span> Select Cottage Allocation:
              </span>
              <span className="text-[10px] font-bold text-[#DAA520] bg-[#1B3564] px-2 py-0.5 rounded-md">
                {cottageSelection === "ALL"
                  ? "All 3 Cottages (Breeze, Crest & Heaven)"
                  : cottageSelection === "TWO"
                    ? "2 Cottages · up to 8 guests"
                    : `${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"} (1 Cottage)`}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {[
                { id: "A", label: "Breeze", sub: "Max 4 Guests" },
                { id: "B", label: "Crest", sub: "Max 4 Guests" },
                { id: "C", label: "Heaven", sub: "Max 4 Guests" },
                { id: "TWO", label: "2 Cottages", sub: "5–8 Guests" },
                { id: "ALL", label: "All 3 Cottages", sub: "Breeze, Crest, Heaven" },
              ].map((item) => {
                const isSelected = cottageSelection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newSel = item.id as "A" | "B" | "C" | "TWO" | "ALL";
                      setCottageSelection(newSel);
                      const selectionMax = newSel === "ALL" ? 12 : newSel === "TWO" ? 8 : 4;
                      const selectionMin = newSel === "TWO" ? 5 : 1;
                      const nextGuests = Math.max(selectionMin, Math.min(selectionMax, guests));
                      setGuests(nextGuests);
                      setGuestInput(String(nextGuests));
                    }}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#1B3564] text-white border-[#1B3564] shadow-sm ring-2 ring-[#DAA520]/40"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#DAA520]/70 hover:bg-amber-50/40"
                    }`}
                  >
                    <div className="text-xs font-black">{item.label}</div>
                    <div className={`text-[9.5px] font-bold mt-0.5 ${isSelected ? "text-[#DAA520]" : "text-slate-400"}`}>
                      {item.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Date picker pair */}
        <div className={`grid grid-cols-2 gap-px bg-[#E2E8F0] border rounded-2xl overflow-hidden relative transition-all duration-300 ${
          showCalendar ? 'border-[#1B3564] shadow-md ring-2 ring-[#1B3564]/10' : 'border-border-subtle hover:border-[#1B3564]/40'
        }`}>
          <div 
            onClick={handleCheckInClick}
            className={`relative ${isModal ? "p-3" : "p-3.5 sm:p-4"} text-left cursor-pointer transition-colors ${
              showCalendar && calendarTarget === 'checkIn' ? 'bg-[#1B3564]/5' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block font-bold mb-1">Check-in</span>
            <div className="flex items-center justify-between text-text-primary text-xs sm:text-sm">
              <span className="font-extrabold text-[#1B3564]">{format(normalizedCheckIn, "MMM dd, yyyy")}</span>
              <CalendarIcon size={16} className="text-[#DAA520] shrink-0 ml-1" />
            </div>
          </div>
          <div 
            onClick={handleCheckOutClick}
            className={`relative ${isModal ? "p-3" : "p-3.5 sm:p-4"} text-left border-l border-border-subtle cursor-pointer transition-colors ${
              showCalendar && calendarTarget === 'checkOut' ? 'bg-[#1B3564]/5' : 'bg-white hover:bg-slate-50'
            }`}
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block font-bold mb-1">Check-out</span>
            <div className="flex items-center justify-between text-text-primary text-xs sm:text-sm">
              <span className="font-extrabold text-[#1B3564]">{format(normalizedCheckOut, "MMM dd, yyyy")}</span>
              <CalendarIcon size={16} className="text-[#DAA520] shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {propertySlug && nights > 0 && (
          <section className={`rounded-2xl border border-[#DAA520]/35 bg-[#FAF8F5] ${showCalendar || isModal ? "p-3" : "p-4"} text-left shadow-xs`} aria-label="Live price for your selected dates" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-[#1B3564]">Your dates, your price</h4>
                <p className="mt-1 text-[11px] font-medium text-slate-600">
                  {nights} {nights === 1 ? "night" : "nights"} · {guests} {guests === 1 ? "guest" : "guests"}
                </p>
              </div>
              <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold ${liveQuoteStatus === "available" ? "border-[#D7DFEA] bg-[#EEF2F7] text-[#1B3564]" : isDatesUnavailable ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                {liveQuoteStatus === "available" ? "Live quote" : isDatesUnavailable ? "Unavailable" : liveQuoteStatus === "error" ? "Live quote unavailable" : "Checking live rates…"}
              </span>
            </div>

            {hasLivePrice && liveQuote ? showCalendar ? (
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
                <span className="text-[10px] text-slate-600">
                  {nights} {nights === 1 ? "night" : "nights"} · ₹{Math.round(liveQuote.roomSubtotal / Math.max(1, nights)).toLocaleString("en-IN")}/night average
                  {liveQuote.extraGuests > 0 ? ` · ${liveQuote.extraGuests} extra ${liveQuote.extraGuests === 1 ? "guest" : "guests"}` : ""}
                </span>
                <strong className="shrink-0 text-lg text-[#1B3564]">₹{(liveQuote.totalPrice + addOnsCost + foodAddOnCost).toLocaleString("en-IN")}</strong>
              </div>
            ) : (
              <>
                <div className="mt-3 max-h-36 space-y-2 overflow-y-auto border-y border-slate-200 py-2">
                  {liveQuote.nightlyRates.map(night => (
                    <div key={night.date} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-slate-700">{format(new Date(`${night.date}T00:00:00`), "EEE, dd MMM")}</span>
                      <span className="mr-auto text-[10px] text-slate-500">{night.label}</span>
                      <strong className="text-[#1B3564]">₹{night.price.toLocaleString("en-IN")}</strong>
                    </div>
                  ))}
                </div>

                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2 text-slate-700">
                    <span>Stay ({nights} {nights === 1 ? "night" : "nights"})</span>
                    <span>₹{liveQuote.roomSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {liveQuote.extraGuests > 0 && (
                    <div className="flex justify-between gap-2 text-slate-700">
                      <span>{liveQuote.extraGuests} extra {liveQuote.extraGuests === 1 ? "guest" : "guests"} × ₹{liveQuote.extraGuestFee.toLocaleString("en-IN")}/night</span>
                      <span>₹{liveQuote.extraGuestTotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {liveQuote.directSavings > 0 && (
                    <div className="flex justify-between gap-2 font-semibold text-[#1B3564]">
                      <span>Direct savings</span>
                      <span>−₹{liveQuote.directSavings.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {addOnsCost > 0 && (
                    <div className="flex justify-between gap-2 text-slate-700">
                      <span>Experiences ({selectedAddOns.length} selected)</span>
                      <span>₹{addOnsCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {selectedFood && (
                    <div className="flex justify-between gap-2 text-slate-700">
                      <span>{selectedFood.label} food · veg &amp; non-veg menus available · {foodGuestCount} guests × {nights} nights</span>
                      <span>₹{foodAddOnCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-2 border-t border-slate-200 pt-2 text-[#1B3564]">
                    <strong className="text-xs">Live total</strong>
                    <strong className="text-xl">₹{(liveQuote.totalPrice + addOnsCost + foodAddOnCost).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div role="status" className={`mt-3 rounded-xl border px-3 py-3 text-xs ${isDatesUnavailable ? "border-red-200 bg-red-50 text-red-800" : liveQuoteStatus === "error" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-slate-200 bg-white text-slate-600"}`}>
                {isDatesUnavailable
                  ? "These dates are unavailable. The live nightly rates are shown above; choose another range to request a stay."
                  : liveQuoteStatus === "error"
                    ? <span className="flex items-center justify-between gap-3">We couldn’t load current rates. No estimate is shown. <button type="button" className="shrink-0 font-bold underline" onClick={() => setQuoteRefreshToken(token => token + 1)}>Try again</button></span>
                    : "Fetching the current nightly rates for your dates…"}
              </div>
            )}

            {hasLivePrice && liveQuote && (
              <p className={`${showCalendar ? "mt-1.5" : "mt-2"} text-[10px] leading-relaxed text-slate-600`}>
                Up to {liveQuote.baseGuests} {liveQuote.baseGuests === 1 ? "guest is" : "guests are"} included. {liveQuote.extraGuestFee > 0 ? `Each additional guest is ₹${liveQuote.extraGuestFee.toLocaleString("en-IN")} per night.` : "There is no additional guest charge."}
                {addOnsCost > 0 ? ` Selected experiences add ₹${addOnsCost.toLocaleString("en-IN")}.` : " Optional experiences are available below."}
                {selectedFood ? ` Food adds ₹${foodAddOnCost.toLocaleString("en-IN")} for ${foodGuestCount} guests across ${nights} ${nights === 1 ? "night" : "nights"}.` : " Food packages are optional and priced per guest, per night."}
              </p>
            )}
          </section>
        )}

        {propertySlug && nights > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 sm:gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 text-left" aria-label="Offers for your selected dates">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-[#1B3564]">Offers for these dates</h4>
                <p className="mt-0.5 text-[10px] text-slate-500">Offers are matched to your stay.</p>
              </div>
              {isCouponApplied && <span className="shrink-0 rounded-md bg-[#EEF2F7] px-2 py-1 text-[9px] font-bold text-[#1B3564]">Applied</span>}
            </div>
            {(hasWeekdayOffer || hasWeekendOffer) ? <div className="grid gap-2">
              {hasWeekdayOffer && (
                <button
                  type="button"
                  aria-pressed={isWeekdayOfferApplied}
                  onClick={() => setWeekdayOfferSelected(value => !value)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${isWeekdayOfferApplied ? "border-[#1B3564] bg-[#F2F5F9]" : "border-slate-200 bg-slate-50 hover:border-[#9AAAC0]"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-[11px] text-[#1B3564]">Weekday offer · 26% off</strong>
                    <span className={`text-[9px] font-bold ${isWeekdayOfferApplied ? "text-[#1B3564]" : "text-[#8b6815]"}`}>{isWeekdayOfferApplied ? "Applied" : "Apply"}</span>
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-600">{normalWeekdayNightsCount} eligible {normalWeekdayNightsCount === 1 ? "night" : "nights"} · {isWeekdayOfferApplied ? "WEEKDAY26" : "Tap to apply"}</span>
                </button>
              )}
              {hasWeekendOffer && (
                <button
                  type="button"
                  aria-pressed={isWeekendOfferApplied}
                  onClick={() => setWeekendOfferSelected(value => !value)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${isWeekendOfferApplied ? "border-[#1B3564] bg-[#F2F5F9]" : "border-slate-200 bg-slate-50 hover:border-[#9AAAC0]"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-[11px] text-[#1B3564]">Weekend offer · 5% off</strong>
                    <span className={`text-[9px] font-bold ${isWeekendOfferApplied ? "text-[#1B3564]" : "text-[#8b6815]"}`}>{isWeekendOfferApplied ? "Applied" : "Apply"}</span>
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-600">{weekendAndHolidayNightsCount} eligible {weekendAndHolidayNightsCount === 1 ? "night" : "nights"} · {isWeekendOfferApplied ? "WEEKEND5" : "Tap to apply"}</span>
                </button>
              )}
            </div> : <p className="rounded-lg bg-slate-50 px-3 py-3 text-[11px] leading-relaxed text-slate-600">No weekday or weekend offer applies to these dates.</p>}
            {isWeekdayOfferApplied && isWeekendOfferApplied && (
              <p className="mt-2 text-[10px] font-semibold text-[#1B3564]">Both date offers are included in your quote.</p>
            )}
          </section>
          <section className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-2 sm:p-2.5 text-left" aria-label="Optional food add-on">
            <div className="mb-1">
              <h4 className="text-xs font-extrabold text-[#1B3564]">Food add-on</h4>
              <p className="mt-0.5 text-[10px] text-slate-600">Veg &amp; non-veg options available</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {foodPackages.map(option => {
                const isSelected = selectedFoodPackage === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={`${option.label} food package, ₹${option.price.toLocaleString("en-IN")} per guest per night, veg and non-veg menus available`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedFoodPackage(isSelected ? null : option.id)}
                    className={`rounded-lg border p-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1B3564] ${isSelected ? "border-[#1B3564] bg-[#F2F5F9]" : "border-slate-200 bg-white hover:border-[#9AAAC0]"}`}
                  >
                    <div className="flex items-baseline justify-between gap-1 text-[#1B3564]">
                      <strong className="text-[11px] font-extrabold">{option.label}</strong>
                      <strong className="text-[11px] font-extrabold">₹{option.price.toLocaleString("en-IN")}</strong>
                    </div>
                    <span className="mt-0.5 block text-[9px] text-slate-500">per guest / night</span>
                  </button>
                );
              })}
            </div>
            {selectedFood ? (
              <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-[#DAA520]/25 pt-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <label htmlFor="food-guests" className="text-[10px] font-semibold text-slate-700">Guests</label>
                  <select
                    id="food-guests"
                    value={foodGuestCount}
                    onChange={event => setFoodGuests(Number(event.target.value))}
                    className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-[#1B3564] outline-none focus:border-[#1B3564] focus:ring-2 focus:ring-[#1B3564]/15"
                  >
                    {Array.from({ length: guests }, (_, index) => index + 1).map(count => (
                      <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
                <strong className="shrink-0 text-[10px] font-semibold text-[#1B3564]">Food total ₹{foodAddOnCost.toLocaleString("en-IN")}</strong>
              </div>
            ) : <p className="mt-2 text-[10px] text-slate-500">Pick a package to add it to your live quote.</p>}
          </section>
          </div>
        )}

        {/* Dedicated Check Availability Trigger Button */}
        <button
          type="button"
          onClick={() => {
            if (!showCalendar && propertySlug === "canopy-crest") {
              trackCanopyCrestInteraction("canopy_crest_check_dates_click", "booking_card_availability_button");
            }
            setShowCalendar(!showCalendar);
            if (!showCalendar) {
              setCalendarTarget("checkIn");
              setCalendarError("");
            }
          }}
          className="w-full min-h-11 bg-[#1B3564] hover:bg-[#152A50] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99] cursor-pointer border border-[#DAA520]/40"
        >
          <CalendarIcon size={17} className="text-[#DAA520]" />
          <span>{showCalendar ? "Close calendar" : "Check availability"}</span>
        </button>

        {/* Breathtakingly Premium Inline Calendar Picker */}
        {showCalendar && (
          <div ref={calendarPanelRef} className="bg-slate-50 border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-inner animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 cursor-pointer border border-slate-200/50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs sm:text-sm font-sans font-black uppercase tracking-widest text-[#1B3564]">
                {currentCalendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button 
                type="button"
                onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 cursor-pointer border border-slate-200/50"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-black flex justify-between items-center px-1">
              <span>Select Date: <strong className="text-[#DAA520]">{calendarTarget === "checkIn" ? "Check-in" : "Check-out"}</strong></span>
              <button 
                type="button" 
                onClick={() => setShowCalendar(false)} 
                className="text-[#1B3564] hover:underline cursor-pointer font-bold"
              >
                Done
              </button>
            </div>

            {calendarError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
                {calendarError}
              </p>
            )}

            <div className="grid grid-cols-7 gap-1 text-center font-sans">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
              ))}
              
              {generateCalendarDays(currentCalendarMonth).map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                
                const isPast = day < new Date(new Date().setHours(0,0,0,0));
                const isSelCheckIn = normalizedCheckIn && day.toDateString() === normalizedCheckIn.toDateString();
                const isSelCheckOut = normalizedCheckOut && day.toDateString() === normalizedCheckOut.toDateString();
                const isInSelectedRange = normalizedCheckIn && normalizedCheckOut && day > normalizedCheckIn && day < normalizedCheckOut;
                
                let dayClass = "text-xs py-2 rounded-xl transition-colors relative font-bold ";
                let buttonDisabled = false;
                
                if (isPast) {
                  dayClass += "text-slate-350 cursor-not-allowed opacity-30";
                  buttonDisabled = true;
                } else if (isSelCheckIn || isSelCheckOut) {
                  dayClass += "bg-[#1B3564] text-white shadow-md scale-105 z-10 cursor-pointer";
                } else if (isInSelectedRange) {
                  dayClass += "bg-[#E7EDF6] text-[#1B3564] border border-[#C6D2E4] cursor-pointer";
                } else {
                  dayClass += "bg-white text-slate-800 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer";
                }
                
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() => handleDayClick(day)}
                    className={`${dayClass} h-9 w-9 flex items-center justify-center mx-auto`}
                    aria-label={`${format(day, "MMMM d")}, ${isPast ? "past date" : isSelCheckIn ? "selected check-in" : isSelCheckOut ? "selected check-out" : isInSelectedRange ? "in your selected stay" : "selectable date; availability checked after choosing your stay"}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
            
            <div aria-label="Calendar key" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-sans text-slate-600 pt-3 border-t border-slate-200/60 font-bold">
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-[#1B3564] block" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-[#E7EDF6] border border-[#C6D2E4] block" />
                <span>Your stay</span>
              </div>
              <span className="basis-full text-center font-medium normal-case tracking-normal text-slate-500">Availability is checked live after you choose both dates.</span>
            </div>
          </div>
        )}

        {/* Real-time Status Response Banner */}
        {isDatesUnavailable ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-2.5 sm:p-3 flex gap-2.5 items-start text-left animate-fade-in">
            <Info className="text-red-600 shrink-0 mt-0.5" size={17} />
            <div>
              <h5 className="font-bold text-[11px] text-red-900">These dates aren’t available</h5>
              <p className="text-[10px] text-red-800 leading-snug mt-0.5">
                Choose a different date range to continue.
              </p>
            </div>
          </div>
        ) : (
          <div className={`${liveQuoteStatus === "available" ? "bg-[#F2F5F9] border-[#D7DFEA] text-[#1B3564]" : liveQuoteStatus === "error" ? "bg-amber-50 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-800"} border rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5 text-left animate-fade-in`}>
            {liveQuoteStatus === "available" ? (
              <CheckCircle2 className="text-[#1B3564] shrink-0 mt-0.5" size={17} />
            ) : liveQuoteStatus === "error" ? (
              <Info className="text-amber-700 shrink-0 mt-0.5" size={17} />
            ) : (
              <Loader2 className="text-amber-700 shrink-0 mt-0.5 animate-spin" size={17} />
            )}
            <div>
              <h5 className="font-bold text-[11px]">{liveQuoteStatus === "available" ? "Dates available" : liveQuoteStatus === "error" ? "Rates are temporarily unavailable" : "Checking live availability"}</h5>
              <p className="text-[10px] font-medium leading-snug mt-0.5">
                {liveQuoteStatus === "available"
                  ? <><strong className="font-semibold">{format(normalizedCheckIn, "dd MMM")} – {format(normalizedCheckOut, "dd MMM")} · {nights} {nights === 1 ? "night" : "nights"}</strong>. Final confirmation by our concierge.</>
                  : liveQuoteStatus === "error"
                    ? "We couldn’t reach the live calendar, so no rate is shown. Please try again shortly."
                    : "Checking current availability and rates for your dates."}
              </p>
            </div>
          </div>
        )}

        {/* Guests picker - Dual Type or Select Input */}
        <div className={`w-full bg-white ${isModal ? "p-3 sm:p-4" : "p-4"} text-left border border-border-subtle rounded-2xl flex items-center justify-between gap-4`}>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">
              Guests (Max {currentMaxGuests}{isWillowPeak ? cottageSelection === "ALL" ? " · 3 cottages" : cottageSelection === "TWO" ? " · 2 cottages" : " · 1 cottage" : ""})
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={String(currentMaxGuests).length}
                aria-label={`Number of guests, up to ${currentMaxGuests}`}
                className="w-14 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0"
                value={guestInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, String(currentMaxGuests).length);
                  setGuestInput(value);
                  const count = Number.parseInt(value, 10);
                  if (Number.isInteger(count) && count >= currentMinGuests && count <= currentMaxGuests) setGuests(count);
                }}
                onBlur={() => updateGuestCount(Number.parseInt(guestInput, 10) || guests)}
              />
              <span className="text-text-primary/30 text-xs font-bold select-none border-l border-border-subtle/60 pl-2">or select:</span>
              <select
                value={guests}
                onChange={(e) => updateGuestCount(Number.parseInt(e.target.value, 10))}
                className="flex-1 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0 cursor-pointer appearance-none"
              >
                {Array.from({ length: currentMaxGuests - currentMinGuests + 1 }, (_, i) => i + currentMinGuests).map(num => (
                  <option key={num} value={num} className="text-text-primary">
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Users size={16} className="text-text-primary/30 shrink-0 pointer-events-none" />
        </div>

        {/* Willow Peak Multi-Cottage Allocation Breakdown */}
        {isWillowPeak && (
          <div className={`w-full bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200/90 rounded-2xl ${isModal ? "p-3 sm:p-4" : "p-4"} text-left shadow-xs space-y-1.5 animate-fade-in`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span>🏡</span> Selected: {cottageSelection === "ALL" ? "All 3 Cottages (A, B, C)" : cottageSelection === "TWO" ? "2 Cottages (pair confirmed by concierge)" : `Cottage ${cottageSelection}`}
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1B3564] text-[#DAA520]">
                {cottageSelection === "ALL" ? "3 of 3 Cottages" : cottageSelection === "TWO" ? "2 of 3 Cottages" : "1 of 3 Cottages"}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {cottageSelection === "ALL"
                ? `All 3 A-frame chalets (Breeze, Crest, and Heaven) are included for your group of ${guests} guests (Max 12).`
                : cottageSelection === "TWO"
                  ? `Two private A-frame cottages are requested for your group of ${guests} guests (Max 8). The concierge will confirm the available pair.`
                  : `Private Chalet: ${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"} (Cottage ${cottageSelection}) allocated for ${guests} guest(s) (Max 4). Features private en-suite jacuzzi and balcony.`
              }
            </p>
            <div className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-amber-200/60 flex items-center gap-1.5">
              <span>✓</span>
              <span>
                {cottageSelection === "ALL"
                  ? "All three cottages are selected for this request."
                  : cottageSelection === "TWO"
                    ? "Two cottages are included; the booking team will confirm which pair is available."
                    : "This request is for one cottage; the other two may be booked separately."
                }
              </span>
            </div>
          </div>
        )}

        </>)}
        {bookingStep === "details" && (
          <>
            <section className="flex items-center justify-between gap-3 rounded-xl border border-[#DAA520]/30 bg-[#FAF8F5] p-3 text-left">
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-[#1B3564]">Your stay</h4>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-600">{format(normalizedCheckIn, "dd MMM yyyy")} – {format(normalizedCheckOut, "dd MMM yyyy")} · {nights} {nights === 1 ? "night" : "nights"} · {guests} {guests === 1 ? "guest" : "guests"}</p>
                {selectedFood && <p className="mt-0.5 text-[10px] text-slate-600">{selectedFood.label} food · veg &amp; non-veg menus available · {foodGuestCount} guests</p>}
              </div>
              {liveQuote && <strong className="shrink-0 text-base font-black text-[#1B3564]">₹{(liveQuote.totalPrice + addOnsCost + foodAddOnCost).toLocaleString("en-IN")}</strong>}
            </section>
        {/* Contact Information Section */}
        <div className={`border-t border-border-subtle/60 ${isModal ? "pt-3 space-y-2.5 sm:pt-4 sm:space-y-3" : "pt-4 space-y-3"}`}>
          <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-[0.15em] block text-left">
            Guest details for confirmation
          </span>

          {/* Full Name */}
          <div className={`w-full bg-white ${isModal ? "p-3 sm:p-4" : "p-4"} border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300`}>
            <div className="flex-1 text-left">
              <label htmlFor="booking-guest-name" className="text-[9px] text-text-primary/60 uppercase tracking-widest block mb-0.5">Primary guest name <span className="text-red-600">*</span></label>
              <input
                type="text"
                id="booking-guest-name"
                required
                autoComplete="name"
                placeholder="e.g. John Doe"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (bookingError) setBookingError("");
                }}
              />
            </div>
            <Users size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Phone Number */}
          <div className={`w-full bg-white ${isModal ? "p-3 sm:p-4" : "p-4"} border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300`}>
            <div className="flex-1 text-left">
              <label htmlFor="booking-guest-phone" className="text-[9px] text-text-primary/60 uppercase tracking-widest block mb-0.5">WhatsApp number <span className="text-red-600">*</span></label>
              <input
                type="tel"
                id="booking-guest-phone"
                required
                autoComplete="tel"
                placeholder="e.g. +91 98765 43210"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  if (bookingError) setBookingError("");
                }}
              />
            </div>
            <Phone size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Email Address */}
          <div className={`w-full bg-white ${isModal ? "p-3 sm:p-4" : "p-4"} border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300`}>
            <div className="flex-1 text-left">
              <label htmlFor="booking-guest-email" className="text-[9px] text-text-primary/60 uppercase tracking-widest block mb-0.5">Email address <span className="normal-case tracking-normal">(optional)</span></label>
              <input
                type="email"
                id="booking-guest-email"
                autoComplete="email"
                placeholder="e.g. john@example.com"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientEmail}
                onChange={(e) => {
                  setClientEmail(e.target.value);
                  if (bookingError) setBookingError("");
                }}
              />
            </div>
            <Mail size={16} className="text-text-primary/30 shrink-0" />
          </div>

          <label className="block text-left">
            <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-1">Special request <span className="normal-case tracking-normal">(optional)</span></span>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={2}
              placeholder="Meals, celebration plans or anything the team should know"
              className="w-full resize-y rounded-2xl border border-border-subtle bg-white p-3 text-sm font-medium text-text-primary outline-none transition-all focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/25 placeholder:text-text-primary/35"
            />
          </label>
          {bookingError && <p role="alert" className="text-left text-sm font-medium text-red-700">{bookingError}</p>}
        </div>
          </>
        )}
      </div>

      {/* FINAL STAY BILL & DYNAMIC RATE BREAKDOWN (Displayed in Step 2 above booking buttons) */}
      {nights > 0 && isLiveQuoteReady && liveQuote && (
        <div className={`${isModal ? "space-y-3 pt-3 pb-3 mb-4 sm:space-y-4 sm:pt-5 sm:pb-5 sm:mb-5" : "space-y-4 pt-5 pb-5 mb-5"} border-t border-b border-[#DAA520]/25 text-left`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1B3564] uppercase tracking-wider flex items-center gap-1.5">
              <Receipt size={13} className="text-[#DAA520]" />
              <span>Live quote · {nights} Night{nights > 1 ? "s" : ""}</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Updated for your dates
            </span>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left">
            <summary className="cursor-pointer text-xs font-bold text-[#1B3564]">View daily rates and savings</summary>

          {/* Detailed stay breakdown card */}
          <div className={`bg-[#FAF8F5] border border-[#DAA520]/20 rounded-2xl ${isModal ? "p-3 sm:p-4" : "p-4"} space-y-2.5 text-left select-none shadow-xs`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#1B3564]/70 uppercase tracking-[0.15em] block">
                Live Daily Rates
              </span>
              <span className="text-[9px] text-slate-500 italic">
                Rates vary by date, day of week and demand
              </span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 divide-y divide-slate-100">
              {liveQuote.nightlyRates.map((item) => (
                <div key={item.date} className="flex justify-between items-center text-xs text-slate-700 pt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">
                      {format(new Date(`${item.date}T00:00:00`), "EEE, dd MMM yyyy")}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-tight bg-slate-100 text-slate-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-black text-[#1B3564]">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200 font-bold text-slate-800">
              <span>Accommodation Subtotal ({nights}N)</span>
              <span>₹{liveQuote.roomSubtotal.toLocaleString("en-IN")}</span>
            </div>

            {liveQuote.extraGuestTotal > 0 && (
              <div className="flex justify-between text-xs pt-1 font-bold text-slate-700">
                <span>Extra Guests ({liveQuote.extraGuests} Pax × ₹{liveQuote.extraGuestFee.toLocaleString("en-IN")}/n × {nights}N)</span>
                <span>₹{liveQuote.extraGuestTotal.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {addOnsCost > 0 && (
            <div className="flex justify-between text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              <span>Experiences ({selectedAddOns.length} selected)</span>
              <span className="font-black text-[#1B3564]">₹{addOnsCost.toLocaleString("en-IN")}</span>
            </div>
          )}
          {selectedFood && (
            <div className="flex justify-between gap-3 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              <span>{selectedFood.label} food · veg &amp; non-veg menus available ({foodGuestCount} guests × {nights} nights)</span>
              <span className="shrink-0 font-black text-[#1B3564]">₹{foodAddOnCost.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Coupon Discount Banner */}
          {discount > 0 && (
            <div className="flex items-center justify-between text-xs font-bold text-[#1B3564] bg-[#F2F5F9] px-3 py-2 rounded-lg border border-[#D7DFEA]">
              <div className="flex items-center gap-1.5 text-left">
                <Tag size={14} className="text-[#8b6815] shrink-0" />
                <div>
                  <span>Offer savings applied ({couponCode})</span>
                  <span className="text-[10px] text-slate-600 font-normal block">
                    {[
                      isWeekdayOfferApplied ? `${normalWeekdayNightsCount} weekday ${normalWeekdayNightsCount === 1 ? "night" : "nights"} (26% off)` : null,
                      isWeekendOfferApplied ? `${weekendAndHolidayNightsCount} weekend/holiday ${weekendAndHolidayNightsCount === 1 ? "night" : "nights"} (5% off)` : null,
                    ].filter(Boolean).join(" + ")}
                  </span>
                </div>
              </div>
              <span className="text-sm font-black shrink-0">-₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Pricing Note */}
          <div className="text-[10px] text-amber-900 bg-amber-50/90 border border-amber-200/80 rounded-xl px-3 py-1.5 text-left font-medium flex items-center gap-1.5">
            <span>ℹ️</span>
              <span><strong>Note:</strong> Rates vary by date and demand. Your quote updates for the dates you choose.</span>
          </div>

          </details>

          {/* Total Final Bill Highlight Box */}
          <div className={`${isModal ? "p-3 sm:p-4" : "p-4"} bg-[#1B3564] text-white rounded-2xl flex items-center justify-between shadow-md`}>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#DAA520] font-bold uppercase tracking-wider block">
                Live stay total
              </span>
              <span className="text-2xl font-black font-heading text-white">
                ₹{(liveQuote.totalPrice + addOnsCost + foodAddOnCost).toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <span className="text-[10.5px] text-emerald-300 font-sans font-medium mt-0.5">
                  ✓ Direct savings of ₹{discount.toLocaleString("en-IN")} applied
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-300 uppercase tracking-widest block">0% Fees</span>
              <span className="text-xs text-[#DAA520] font-bold">
                {nights} Night{nights > 1 ? "s" : ""} • {guests} Pax
              </span>
            </div>
          </div>
        </div>
      )}

      {bookingStep === "quote" ? (
        <div className="mb-4 space-y-2 text-left">
          <button type="button" onClick={() => setBookingStep("details")} disabled={!canRequestBooking} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B3564] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#294b7d] disabled:cursor-not-allowed disabled:bg-slate-300">
            Continue to booking details <ArrowRight size={17} />
          </button>
          <p className="text-center text-[10px] leading-relaxed text-slate-500" aria-live="polite">{canRequestBooking ? "Your live quote is ready. Add your contact details to send the request." : isDatesUnavailable ? "Choose another date range to continue." : liveQuoteStatus === "error" ? "Rates could not be loaded. Try again before continuing." : "We’ll enable this after live availability is confirmed."}</p>
        </div>
      ) : (
        <>
          <button type="button" onClick={() => { setBookingStep("quote"); setBookingError(""); }} className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#1B3564] hover:bg-slate-50">← Back to dates &amp; extras</button>
                <div className="space-y-3 mb-4 text-left">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
          Choose how you’d like to continue
        </span>

        {/* Option 1: Book & Await Verification */}
        <button
          type="button"
          onClick={handleAwaitVerificationBooking}
          disabled={isSubmittingVerification || !canRequestBooking}
          className="w-full bg-gradient-to-r from-[#E0534C] via-[#E7625A] to-[#D9413A] hover:from-[#D9413A] hover:to-[#C9332C] text-white py-4 px-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(224,83,76,0.35)] hover:shadow-[0_12px_35px_rgba(224,83,76,0.45)] flex items-center justify-between cursor-pointer border border-white/20 active:scale-[0.98] ring-2 ring-rose-300/30"
        >
          <div className="flex items-center gap-2.5">
            {isSubmittingVerification ? (
              <Loader2 className="animate-spin text-white" size={20} />
            ) : (
              <ShieldCheck size={20} className="text-white shrink-0" />
            )}
            <div className="text-left">
              <span className="block font-black text-xs sm:text-sm text-white">Request booking</span>
              <span className="text-[10px] text-rose-100 font-normal block">Request only; dates are not held until the team confirms</span>
            </div>
          </div>
          <span className="text-[11px] font-black bg-white text-[#C9332C] px-2.5 py-1 rounded-lg shadow-sm">Send request ➔</span>
        </button>

        {/* Option 2: Book via WhatsApp */}
        <button
          type="button"
          onClick={handleBooking}
          disabled={isLoading || !canRequestBooking}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-between cursor-pointer border-none active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
              <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
            </svg>
            <div className="text-left">
              <span className="block font-black text-xs sm:text-sm">Continue on WhatsApp</span>
              <span className="text-[10px] text-white/80 font-normal block">Send your stay details to the concierge</span>
            </div>
          </div>
          <span className="text-[11px] font-black bg-white/20 px-2.5 py-1 rounded-lg">Open WhatsApp ➔</span>
        </button>
      </div>
        </>
      )}

      {bookingStep === "details" && <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest mb-4 font-semibold select-none flex items-center justify-center gap-1.5">
        <span>🔒 Best Direct Price Guarantee • 0% Platform Fee</span>
      </p>}

      {bookingStep === "details" && <div className="mt-8 p-4 rounded-2xl bg-accent-secondary/8 border border-accent-secondary/20 flex gap-3 items-start text-left select-none">
        <Info className="text-accent-secondary shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-accent-secondary/80 leading-relaxed">
          Best Price Guarantee: If you find a lower price on another OTA, we will match it and offer a complimentary experience.
        </p>
      </div>}
    </div>
  );
};

export default BookingCard;
