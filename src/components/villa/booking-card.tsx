"use client";

import { encodeWhatsAppMessage } from "@/lib/whatsapp";
import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Users, Info, Loader2, Mail, Phone, CheckCircle2,
  ChefHat, Wine, Gift, Receipt, Tag, Car,
  ChevronLeft, ChevronRight, ShieldCheck
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { createAwaitingVerificationBooking } from "@/app/actions/booking";
import { captureBookingLead } from "@/app/actions/inquiry";
import { useUser } from "@clerk/nextjs";
import { categorizeNight, checkLongWeekend } from "@/lib/calendar-holidays";
import { getAngleHouseAttribution, trackAngleHouseBookingEnquiry, trackAngleHouseEngagement } from "@/lib/angle-house-measurement";

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
  bookings?: BookingProp[];
  initialCottageSelection?: "A" | "B" | "C" | "ALL";
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
  basePrice, 
  weekendPrice, 
  fridayPrice,
  saturdayPrice,
  sundayPrice,
  dailyPrices = [], 
  seasonalPrices = [], 
  maxGuests = 16,
  baseGuests = 10,
  extraGuestFee = 1500,
  bookings = [],
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
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [calendarError, setCalendarError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);

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

  useEffect(() => {
    if (initialGuests) setGuests(initialGuests);
  }, [initialGuests]);

  // Specific Cottage Selection for Willow Peak: "A" | "B" | "C" | "ALL"
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "ALL">(initialCottageSelection || "A");

  useEffect(() => {
    if (initialCottageSelection) {
      setCottageSelection(initialCottageSelection);
    }
  }, [initialCottageSelection]);

  // Cottages required for Willow Peak (1 for Cottage A/B/C, 3 for ALL)
  const cottagesCount = isWillowPeak ? (cottageSelection === "ALL" ? 3 : 1) : 1;
  const isSingleWillowCottage = isWillowPeak && cottageSelection !== "ALL";
  const couponCode = isSingleWillowCottage ? "" : "STAYW26";
  const isCouponApplied = !isSingleWillowCottage;
  const currentMaxGuests = isWillowPeak ? (cottageSelection === "ALL" ? 12 : 4) : actualMaxGuests;

  // Premium custom calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"checkIn" | "checkOut">("checkIn");
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  // Date booked checking logic (exclusive checkout day)
  const isDateBooked = React.useCallback((date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    if (isWillowPeak) {
      let bookedCottages = 0;
      for (const b of bookings) {
        if (b.status === "CANCELLED") continue;
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        if (check >= start && check < end) {
          bookedCottages += (b.cottagesCount || 1);
        }
      }
      return (bookedCottages + cottagesCount) > 3;
    }

    return bookings.some(b => {
      if (b.status === "CANCELLED") return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check >= start && check < end;
    });
  }, [bookings, isWillowPeak, cottagesCount]);

  // Date range overlap check
  const isRangeInvalid = React.useCallback((start: Date, end: Date) => {
    const startNorm = new Date(start);
    startNorm.setHours(0, 0, 0, 0);
    const endNorm = new Date(end);
    endNorm.setHours(0, 0, 0, 0);

    if (startNorm.getTime() >= endNorm.getTime()) return true;

    if (isWillowPeak) {
      let cur = new Date(startNorm);

      while (cur.getTime() < endNorm.getTime()) {
        let bookedCottages = 0;
        for (const b of bookings) {
          if (b.status === "CANCELLED") continue;
          const bStart = new Date(b.checkIn);
          const bEnd = new Date(b.checkOut);
          bStart.setHours(0, 0, 0, 0);
          bEnd.setHours(0, 0, 0, 0);
          if (cur.getTime() >= bStart.getTime() && cur.getTime() < bEnd.getTime()) {
            bookedCottages += (b.cottagesCount || 1);
          }
        }
        if (bookedCottages + cottagesCount > 3) return true;
        cur = addDays(cur, 1);
        cur.setHours(0, 0, 0, 0);
      }
      return false;
    }

    return bookings.some(b => {
      if (b.status === "CANCELLED") return false;
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      bStart.setHours(0, 0, 0, 0);
      bEnd.setHours(0, 0, 0, 0);
      return bStart.getTime() < endNorm.getTime() && bEnd.getTime() > startNorm.getTime();
    });
  }, [bookings, isWillowPeak, cottagesCount]);

  const isOverlapping = isRangeInvalid(checkIn, checkOut);

  // Auto-shift default dates if current selection is booked/blocked
  React.useEffect(() => {
    let tempDate = new Date();
    tempDate.setHours(0, 0, 0, 0);
    let shiftCount = 0;
    
    // Shift checkIn until an available day is found
    while (isDateBooked(tempDate) && shiftCount < 365) {
      tempDate = addDays(tempDate, 1);
      shiftCount++;
    }
    
    if (isDateBooked(checkIn)) {
      setCheckIn(tempDate);
      let checkOutTemp = addDays(tempDate, 2);
      checkOutTemp.setHours(0, 0, 0, 0);
      
      // Shift checkOut if the range overlaps
      let rangeShift = 0;
      if (isRangeInvalid(tempDate, checkOutTemp)) {
        checkOutTemp = addDays(tempDate, 1);
        checkOutTemp.setHours(0, 0, 0, 0);
        while (isRangeInvalid(tempDate, checkOutTemp) && rangeShift < 365) {
          checkOutTemp = addDays(checkOutTemp, 1);
          checkOutTemp.setHours(0, 0, 0, 0);
          rangeShift++;
        }
      }
      setCheckOut(checkOutTemp);
    }
  }, [bookings, isDateBooked, isRangeInvalid]);

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

  // Timezone-safe daily rate calculation from dynamic pricing scheduler
  const getDayPriceDetails = (date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    const checkY = check.getFullYear();
    const checkM = check.getMonth();
    const checkD = check.getDate();
    const checkIso = `${checkY}-${String(checkM + 1).padStart(2, "0")}-${String(checkD).padStart(2, "0")}`;

    // 1. Check Daily Overrides (highest priority from dynamic pricing scheduler)
    const dailyOverride = dailyPrices?.find(dp => {
      if (!dp?.date) return false;
      const dDate = new Date(dp.date);
      const matchLocal = dDate.getFullYear() === checkY && dDate.getMonth() === checkM && dDate.getDate() === checkD;
      const matchUTC = dDate.getUTCFullYear() === checkY && dDate.getUTCMonth() === checkM && dDate.getUTCDate() === checkD;
      const matchStr = typeof dp.date === "string" && dp.date.startsWith(checkIso);
      return matchLocal || matchUTC || matchStr;
    });

    if (dailyOverride) {
      return { 
        price: Number(dailyOverride.price), 
        type: "DAILY" as const, 
        label: (dailyOverride as any).label || "Scheduled Rate" 
      };
    }

    // 2. Check Seasonal Price Overrides
    const seasonalOverride = seasonalPrices?.find(sp => {
      if (!sp?.startDate || !sp?.endDate) return false;
      const start = new Date(sp.startDate);
      const end = new Date(sp.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return check.getTime() >= start.getTime() && check.getTime() <= end.getTime();
    });

    if (seasonalOverride) {
      return { 
        price: Number(seasonalOverride.price), 
        type: "SEASONAL" as const, 
        label: seasonalOverride.label || "Seasonal Rate" 
      };
    }

    // 3. Check specific day-of-week pricing overrides
    const dayOfWeek = check.getDay();
    if (dayOfWeek === 5 && fridayPrice != null && Number(fridayPrice) > 0) {
      return { price: Number(fridayPrice), type: "FRIDAY" as const, label: "Friday Rate" };
    }
    if (dayOfWeek === 6 && saturdayPrice != null && Number(saturdayPrice) > 0) {
      return { price: Number(saturdayPrice), type: "SATURDAY" as const, label: "Saturday Rate" };
    }
    if (dayOfWeek === 0 && sundayPrice != null && Number(sundayPrice) > 0) {
      return { price: Number(sundayPrice), type: "SUNDAY" as const, label: "Sunday Rate" };
    }

    // 4. Check Legacy Weekend Pricing
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    if (isWeekend && weekendPrice != null && Number(weekendPrice) > 0) {
      return { price: Number(weekendPrice), type: "WEEKEND" as const, label: "Weekend Rate" };
    }

    // 5. Fallback to base rate
    let numericBasePrice = typeof basePrice === "number" && basePrice > 0 
      ? basePrice 
      : (typeof price === "number" && price > 0 ? price : parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0);

    // Willow Peak Entire Estate base starting rate is 15,000 (if DB still has old 17997 seed, client base is 15000)
    if (isWillowPeak && numericBasePrice > 15000) {
      numericBasePrice = 15000;
    }

    return { price: numericBasePrice, type: "BASE" as const, label: "Base Rate" };
  };

  const getPricingBreakdown = () => {
    const breakdownList: Array<{ date: Date; price: number; type: string; label: string }> = [];
    if (nights <= 0) return breakdownList;

    for (let i = 0; i < nights; i++) {
      const dayDate = addDays(normalizedCheckIn, i);
      dayDate.setHours(0, 0, 0, 0);
      const details = getDayPriceDetails(dayDate);
      breakdownList.push({
        date: dayDate,
        price: details.price,
        type: details.type,
        label: details.label
      });
    }
    return breakdownList;
  };

  const breakdown = getPricingBreakdown();
  const rawSubtotal = breakdown.reduce((sum, item) => sum + item.price, 0);
  const subtotal = Math.round(rawSubtotal * (isWillowPeak ? (cottageSelection === "ALL" ? 1 : 1 / 3) : 1));

  const baseGuestsCount = isWillowPeak ? (cottagesCount * 4) : (baseGuests ?? actualMaxGuests);
  const extraGuests = Math.max(0, guests - baseGuestsCount);
  const extraGuestsCostPerNight = extraGuestFee ? extraGuests * extraGuestFee : 0;
  const totalExtraGuestsCost = extraGuestsCostPerNight * (nights > 0 ? nights : 0);

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

  const handleToggleAddOn = (addon: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addon) 
        ? prev.filter(item => item !== addon) 
        : [...prev, addon]
    );
  };

  const serviceFee = 0;

  // Split breakdown into Normal Weekdays (26% off) vs. Weekends & Long Weekends (5% off)
  const normalWeekdayBreakdown = breakdown.filter(item => {
    const { category } = categorizeNight(item.date, item.type);
    return category === "NORMAL_WEEKDAY";
  });
  const rawNormalWeekdaySubtotal = normalWeekdayBreakdown.reduce((sum, item) => sum + item.price, 0);
  const normalWeekdaySubtotal = Math.round(rawNormalWeekdaySubtotal * (isWillowPeak ? (cottagesCount / 3) : 1));
  const normalWeekdayNightsCount = normalWeekdayBreakdown.length;
  const normalWeekdayExtraCost = extraGuestsCostPerNight * normalWeekdayNightsCount;
  const normalWeekdayEligibleBase = normalWeekdaySubtotal + normalWeekdayExtraCost;

  const weekendAndHolidayBreakdown = breakdown.filter(item => {
    const { category } = categorizeNight(item.date, item.type);
    return category === "WEEKEND" || category === "LONG_WEEKEND";
  });
  const rawWeekendAndHolidaySubtotal = weekendAndHolidayBreakdown.reduce((sum, item) => sum + item.price, 0);
  const weekendAndHolidaySubtotal = Math.round(rawWeekendAndHolidaySubtotal * (isWillowPeak ? (cottagesCount / 3) : 1));
  const weekendAndHolidayNightsCount = weekendAndHolidayBreakdown.length;
  const weekendAndHolidayExtraCost = extraGuestsCostPerNight * weekendAndHolidayNightsCount;
  const weekendAndHolidayEligibleBase = weekendAndHolidaySubtotal + weekendAndHolidayExtraCost;

  const calculateDiscount = () => {
    if (isSingleWillowCottage) return 0;
    if (!isCouponApplied || nights <= 0) return 0;
    const clean = (couponCode || "STAYW26").trim().toUpperCase();

    if (clean.includes("26") || clean === "STAYW26" || clean === "WEEKDAY26" || clean.includes("28") || clean === "STAYW28") {
      // 26% discount strictly on Normal Mon-Thu Weekdays + 5% discount on Weekends & Long Weekends
      const weekdayDisc = Math.round(normalWeekdayEligibleBase * 0.26);
      const weekendDisc = Math.round(weekendAndHolidayEligibleBase * 0.05);
      return weekdayDisc + weekendDisc;
    }

    if (clean === "STAY5" || clean === "WEEKEND5") {
      return Math.round((normalWeekdayEligibleBase + weekendAndHolidayEligibleBase) * 0.05);
    }

    if (clean === "STAY10" || clean.includes("10")) {
      return Math.round((normalWeekdayEligibleBase + weekendAndHolidayEligibleBase) * 0.10);
    }

    const weekdayDisc = Math.round(normalWeekdayEligibleBase * 0.26);
    const weekendDisc = Math.round(weekendAndHolidayEligibleBase * 0.05);
    return weekdayDisc + weekendDisc;
  };

  const discount = calculateDiscount();
  const total = Math.max(0, subtotal + totalExtraGuestsCost + serviceFee + addOnsCost - discount);

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

    setIsLoading(true);
    try {
      const formattedCheckIn = format(checkIn, "dd MMM yyyy");
      const formattedCheckOut = format(checkOut, "dd MMM yyyy");
      const cottageInfoSection = isWillowPeak
        ? `\n🏡 *Stay:* ${cottageSelection === "ALL" ? "All 3 cottages (entire estate)" : `Cottage ${cottageSelection}`}`
        : "";
      const addOnsSection = selectedAddOns.length > 0
        ? `\n• *Add-ons:* ${selectedAddOns.join(", ")}`
        : "";
      const discountSection = discount > 0
        ? `\n• *Direct savings:* ₹${discount.toLocaleString("en-IN")}`
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
*Estimated total:* ₹${total.toLocaleString("en-IN")}

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
        totalPrice: total,
        couponCode: isCouponApplied ? couponCode : undefined,
        addOns: selectedAddOns,
        message: `WhatsApp booking request for ${villaName}. ${formattedCheckIn} to ${formattedCheckOut}. ${guests} guests. Estimated total ₹${total.toLocaleString("en-IN")}.${specialRequest.trim() ? ` Guest request: ${specialRequest.trim()}` : ""}`,
        attribution: isAngleHouse ? getAngleHouseAttribution() : undefined,
      }).then(result => {
        if (isAngleHouse && result.success && result.leadId) {
          trackAngleHouseBookingEnquiry(result.leadId, checkIn, checkOut);
        }
      }).catch(err => console.error("Failed to capture WhatsApp booking request:", err));

      if (isAngleHouse) trackAngleHouseEngagement("whatsapp_click");
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
        couponCode: isCouponApplied ? couponCode : undefined,
        cottageSelection: isWillowPeak ? cottageSelection : undefined,
        specialRequest: specialRequest.trim() || undefined,
        attribution: isAngleHouse ? getAngleHouseAttribution() : undefined,
      });

      if (res.success && res.bookingId) {
        if (isAngleHouse) trackAngleHouseBookingEnquiry(res.bookingId, checkIn, checkOut);
        setVerificationSubmitted(true);
        setSubmittedBookingId(res.bookingId);
        setSubmittedTotal(res.totalPrice ?? total);
        onBookingComplete?.();
      } else {
        setBookingError(res.error || "Could not submit the request. Please try again.");
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
            <span>Total Estimated Bill:</span>
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
              const msg = `Hi Stay Willas, I submitted a booking request for *${villaName}* (Reference: ${submittedBookingId}) from ${format(checkIn, "dd MMM yyyy")} to ${format(checkOut, "dd MMM yyyy")}. Guests: ${guests}. Estimated total: ₹${(submittedTotal ?? total).toLocaleString("en-IN")}. Name: ${clientName}. WhatsApp: ${clientPhone}. Please confirm availability and final pricing.`;
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
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-border-subtle/50">
        <div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
            Starting at
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-black">
              ₹{isWillowPeak 
                ? (Math.round(5999 * cottagesCount)).toLocaleString("en-IN") 
                : (nights > 0 && subtotal > 0
                    ? Math.round(subtotal / nights).toLocaleString("en-IN")
                    : (typeof price === "number" ? price.toLocaleString("en-IN") : price))}
            </span>
            <span className="text-text-primary/50 text-xs sm:text-sm font-semibold ml-1.5">
              / night {isWillowPeak ? (cottageSelection === "ALL" ? "(Entire Estate - 12 Guests)" : `(Cottage ${cottageSelection})`) : ""}
            </span>
          </div>
          <div className="text-[10px] font-semibold text-amber-800 bg-amber-50/90 border border-amber-200 rounded-lg px-2 py-0.5 mt-1 flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>Pricing varies between weekdays and weekends.</span>
          </div>
          {isWillowPeak && (
            <div className="text-[10.5px] font-medium text-slate-500 mt-1">
              {cottageSelection === "ALL"
                ? "From ₹15,000/n Weekday • All 3 Cottages (A, B, C) — Full Estate (up to 12 Guests)"
                : `From ₹4,999/n Weekday • Cottage ${cottageSelection} (${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"}) (up to 4 Guests)`
              }
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
          isOverlapping ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOverlapping ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
          {isOverlapping ? 'Unavailable' : 'No conflict shown'}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Willow Peak Cottage Selector - A, B, C or ALL */}
        {isWillowPeak && !lockCottageSelection && (
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 text-left shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-[#1B3564] flex items-center gap-1.5 font-sans">
                <span>🏡</span> Select Cottage Allocation:
              </span>
              <span className="text-[10px] font-bold text-[#DAA520] bg-[#1B3564] px-2 py-0.5 rounded-md">
                {cottageSelection === "ALL" 
                  ? "Full Estate (Breeze, Crest & Heaven)" 
                  : `${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"} (1 Cottage)`}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { id: "A", label: "Breeze", sub: "Max 4 Guests" },
                { id: "B", label: "Crest", sub: "Max 4 Guests" },
                { id: "C", label: "Heaven", sub: "Max 4 Guests" },
                { id: "ALL", label: "All 3 Cottages", sub: "Breeze, Crest, Heaven" },
              ].map((item) => {
                const isSelected = cottageSelection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newSel = item.id as "A" | "B" | "C" | "ALL";
                      setCottageSelection(newSel);
                      if (newSel !== "ALL" && guests > 4) {
                        setGuests(4);
                      } else if (newSel === "ALL" && guests < 5) {
                        setGuests(6);
                      }
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
        {/* Live Admin Panel Sync Status Badge */}
        <div className="flex items-center justify-between bg-slate-100/90 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-200/80">
            <span className="flex items-center gap-2 text-[#1B3564]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Calendar check
          </span>
          <span className="text-[#DAA520] font-black">Concierge confirms</span>
        </div>

        {/* Date picker pair */}
        <div className={`grid grid-cols-2 gap-px bg-[#E2E8F0] border rounded-2xl overflow-hidden relative transition-all duration-300 ${
          showCalendar ? 'border-[#1B3564] shadow-md ring-2 ring-[#1B3564]/10' : 'border-border-subtle hover:border-[#1B3564]/40'
        }`}>
          <div 
            onClick={handleCheckInClick}
            className={`relative p-3.5 sm:p-4 text-left cursor-pointer transition-colors ${
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
            className={`relative p-3.5 sm:p-4 text-left border-l border-border-subtle cursor-pointer transition-colors ${
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

        {/* Dedicated Check Availability Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setShowCalendar(!showCalendar);
            if (!showCalendar) {
              setCalendarTarget("checkIn");
              setCalendarError("");
            }
          }}
          className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white font-black text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer tracking-wider uppercase border border-[#DAA520]/40"
        >
          <CalendarIcon size={17} className="text-[#DAA520]" />
          <span>{showCalendar ? "Close Calendar" : "Check Date Availability"}</span>
        </button>

        {/* Breathtakingly Premium Inline Calendar Picker */}
        {showCalendar && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-inner animate-fade-in space-y-4">
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
                const isBooked = isDateBooked(day);
                
                const isSelCheckIn = normalizedCheckIn && day.toDateString() === normalizedCheckIn.toDateString();
                const isSelCheckOut = normalizedCheckOut && day.toDateString() === normalizedCheckOut.toDateString();
                const isInSelectedRange = normalizedCheckIn && normalizedCheckOut && day > normalizedCheckIn && day < normalizedCheckOut;
                
                let dayClass = "text-xs py-2 rounded-xl transition-colors relative font-bold ";
                let buttonDisabled = false;
                
                if (isPast) {
                  dayClass += "text-slate-350 cursor-not-allowed opacity-30";
                  buttonDisabled = true;
                } else if (isBooked) {
                  dayClass += "bg-red-100 text-red-900 cursor-not-allowed border border-red-300";
                  buttonDisabled = true;
                } else if (isSelCheckIn || isSelCheckOut) {
                  dayClass += "bg-[#1B3564] text-white shadow-md scale-105 z-10 cursor-pointer";
                } else if (isInSelectedRange) {
                  dayClass += "bg-[#E7EDF6] text-[#1B3564] border border-[#C6D2E4] cursor-pointer";
                } else {
                  dayClass += "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer";
                }
                
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() => handleDayClick(day)}
                    className={`${dayClass} h-9 w-9 flex items-center justify-center mx-auto`}
                    aria-label={`${format(day, "MMMM d")}, ${isPast ? "past date" : isBooked ? "unavailable" : isSelCheckIn ? "selected check-in" : isSelCheckOut ? "selected check-out" : isInSelectedRange ? "in your selected stay" : "available"}`}
                    title={isBooked ? "Unavailable" : undefined}
                  >
                    {day.getDate()}
                    {isBooked && (
                      <span aria-hidden="true" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-700" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div aria-label="Calendar key" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-sans text-slate-600 pt-3 border-t border-slate-200/60 font-bold">
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 block" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-red-100 border border-red-300 block" />
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-[#1B3564] block" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="w-3 h-3 rounded bg-[#E7EDF6] border border-[#C6D2E4] block" />
                <span>Your stay</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Status Response Banner */}
        {isOverlapping ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 items-start text-left select-none shadow-sm border-l-4 border-l-red-500 animate-fade-in">
            <Info className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-red-900">These dates aren’t available</h5>
              <p className="text-[11px] text-red-800 leading-relaxed mt-0.5 font-medium">
                Choose a different date range to continue.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 flex items-start gap-3 text-left select-none shadow-sm border-l-4 border-l-emerald-500 animate-fade-in">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">No conflict shown for these dates</h5>
              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5">
                Our calendar shows <strong className="font-bold">{format(checkIn, "dd MMM")} – {format(checkOut, "dd MMM")} ({nights} nights)</strong> as open. The concierge will recheck availability before confirming.
              </p>
            </div>
          </div>
        )}

        {/* Guests picker - Dual Type or Select Input */}
        <div className="w-full bg-white p-4 text-left border border-border-subtle rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">
              Guests (Max {currentMaxGuests} {isWillowPeak ? (cottageSelection === "ALL" ? "for 3 Cottages" : "per Cottage") : ""})
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={currentMaxGuests}
                className="w-12 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0"
                value={guests}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setGuests(Math.min(currentMaxGuests, Math.max(1, val)));
                  }
                }}
              />
              <span className="text-text-primary/30 text-xs font-bold select-none border-l border-border-subtle/60 pl-2">or select:</span>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="flex-1 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0 cursor-pointer appearance-none"
              >
                {Array.from({ length: currentMaxGuests }, (_, i) => i + 1).map(num => (
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
          <div className="w-full bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200/90 rounded-2xl p-4 text-left shadow-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span>🏡</span> Selected: {cottageSelection === "ALL" ? "All 3 Cottages (A, B, C)" : `Cottage ${cottageSelection}`}
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1B3564] text-[#DAA520]">
                {cottageSelection === "ALL" ? "3 of 3 Cottages" : "1 of 3 Cottages"}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {cottageSelection === "ALL"
                ? `Full Estate: All 3 A-frame chalets (Breeze, Crest, and Heaven) reserved for your group of ${guests} guests (Max 12).`
                : `Private Chalet: ${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"} (Cottage ${cottageSelection}) allocated for ${guests} guest(s) (Max 4). Features private en-suite jacuzzi and balcony.`
              }
            </p>
            <div className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-amber-200/60 flex items-center gap-1.5">
              <span>✓</span>
              <span>
                {cottageSelection === "ALL"
                  ? "Entire estate selected — all three cottages are included in this request."
                  : "This request is for one cottage; the other two may be booked separately."
                }
              </span>
            </div>
          </div>
        )}

        {!isSingleWillowCottage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs text-emerald-900">
            Direct savings are included automatically: 26% on eligible weekdays and 5% on weekends and holidays.
          </div>
        )}

        {/* Contact Information Section */}
        <div className="pt-4 border-t border-border-subtle/60 space-y-3">
          <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-[0.15em] block text-left">
            Guest details for confirmation
          </span>

          {/* Full Name */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
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
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
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
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
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
      </div>

      {/* FINAL STAY BILL & DYNAMIC RATE BREAKDOWN (Displayed in Step 2 above booking buttons) */}
      {nights > 0 && (
        <div className="space-y-4 pt-5 pb-5 mb-5 border-t border-b border-[#DAA520]/25 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1B3564] uppercase tracking-wider flex items-center gap-1.5">
              <Receipt size={13} className="text-[#DAA520]" />
              <span>Your stay estimate · {nights} Night{nights > 1 ? "s" : ""}</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-black">
              Dynamic Rates Applied
            </span>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left">
            <summary className="cursor-pointer text-xs font-bold text-[#1B3564]">View daily rates and savings</summary>

          {/* Detailed stay breakdown card */}
          <div className="bg-[#FAF8F5] border border-[#DAA520]/20 rounded-2xl p-4 space-y-2.5 text-left select-none shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#1B3564]/70 uppercase tracking-[0.15em] block">
                Scheduled Daily Rates
              </span>
              <span className="text-[9px] text-slate-500 italic">
                *Prices may vary due to demand
              </span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 divide-y divide-slate-100">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-700 pt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">
                      {format(item.date, "EEE, dd MMM yyyy")}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-tight ${
                      item.type === "DAILY" 
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : item.type === "SEASONAL"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : item.type === "SATURDAY" || item.type === "FRIDAY" || item.type === "SUNDAY" || item.type === "WEEKEND"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="font-black text-[#1B3564]">
                    ₹{(isWillowPeak && cottageSelection !== "ALL" ? Math.round(item.price / 3) : item.price).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs pt-2.5 border-t border-slate-200 font-bold text-slate-800">
              <span>Accommodation Subtotal ({nights}N)</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {totalExtraGuestsCost > 0 && (
              <div className="flex justify-between text-xs pt-1 font-bold text-slate-700">
                <span>Extra Guests ({extraGuests} Pax × ₹{extraGuestFee.toLocaleString("en-IN")}/n × {nights}N)</span>
                <span>₹{totalExtraGuestsCost.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {addOnsCost > 0 && (
            <div className="flex justify-between text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              <span>Signature Experiences ({selectedAddOns.length} selected)</span>
              <span className="font-black text-[#1B3564]">₹{addOnsCost.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Coupon Discount Banner */}
          {discount > 0 && (
            <div className="flex items-center justify-between text-xs font-black text-emerald-800 bg-emerald-100/90 px-3.5 py-2.5 rounded-xl border border-emerald-300 shadow-xs">
              <div className="flex items-center gap-1.5 text-left">
                <Tag size={14} className="text-emerald-700 shrink-0" />
                <div>
                  <span>Direct Savings Applied ({couponCode || "STAYW26"})</span>
                  <span className="text-[10px] text-emerald-700 font-normal block">
                    {[
                      normalWeekdayNightsCount > 0 ? `${normalWeekdayNightsCount} Weekday (26% off)` : null,
                      weekendAndHolidayNightsCount > 0 ? `${weekendAndHolidayNightsCount} Weekend/Holiday (5% off)` : null,
                    ].filter(Boolean).join(" + ")}
                  </span>
                </div>
              </div>
              <span className="text-sm font-black shrink-0">-₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}

          {isCouponApplied && discount === 0 && nights > 0 && (
            <div className="text-[11px] text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 text-left">
              ℹ️ <strong>Direct Offer Active:</strong> Direct savings applies to eligible nights (26% on normal weekdays, 5% on weekends &amp; holidays).
            </div>
          )}

          {/* Pricing Note */}
          <div className="text-[10px] text-amber-900 bg-amber-50/90 border border-amber-200/80 rounded-xl px-3 py-1.5 text-left font-medium flex items-center gap-1.5">
            <span>ℹ️</span>
            <span><strong>Note:</strong> Pricing varies between weekdays and weekends. Verified final rates are calculated dynamically based on your chosen dates.</span>
          </div>

          </details>

          {/* Total Final Bill Highlight Box */}
          <div className="p-4 bg-[#1B3564] text-white rounded-2xl flex items-center justify-between shadow-md">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#DAA520] font-bold uppercase tracking-wider block">
                Estimated stay total
              </span>
              <span className="text-2xl font-black font-heading text-white">
                ₹{total.toLocaleString("en-IN")}
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

      <div className="space-y-3 mb-4 text-left">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
          Choose how you’d like to continue
        </span>

        {/* Option 1: Book & Await Verification */}
        <button
          type="button"
          onClick={handleAwaitVerificationBooking}
          disabled={isSubmittingVerification || nights <= 0 || isOverlapping}
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
          disabled={isLoading || nights <= 0 || isOverlapping}
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

      <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest mb-4 font-semibold select-none flex items-center justify-center gap-1.5">
        <span>🔒 Best Direct Price Guarantee • 0% Platform Fee</span>
      </p>

      <div className="mt-8 p-4 rounded-2xl bg-accent-secondary/8 border border-accent-secondary/20 flex gap-3 items-start text-left select-none">
        <Info className="text-accent-secondary shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-accent-secondary/80 leading-relaxed">
          Best Price Guarantee: If you find a lower price on another OTA, we will match it and offer a complimentary experience.
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
