"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, Users, Info, Loader2, Mail, Phone, CheckCircle2,
  ChefHat, Wine, Sparkles, Car, Check, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { createCheckoutSession } from "@/app/actions/booking";
import { useUser, SignInButton } from "@clerk/nextjs";

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
  price: string;
  basePrice: number;
  weekendPrice?: number | null;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  dailyPrices: DailyPriceProp[];
  seasonalPrices: SeasonalPriceProp[];
  maxGuests?: number;
  baseGuests?: number;
  extraGuestFee?: number;
  bookings?: BookingProp[];
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
    icon: Sparkles,
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
  price, 
  basePrice, 
  weekendPrice, 
  fridayPrice,
  saturdayPrice,
  sundayPrice,
  dailyPrices = [], 
  seasonalPrices = [], 
  maxGuests = 16,
  baseGuests,
  extraGuestFee,
  bookings = []
}: BookingCardProps) => {
  const { user, isSignedIn } = useUser();

  const isWillowPeak = villaId.includes("willow") || villaName.toLowerCase().includes("willow");
  const actualMaxGuests = isWillowPeak ? 12 : (villaName.toLowerCase().includes("canopy") ? 16 : maxGuests);

  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Cottages required for Willow Peak (max 4 per cottage)
  const cottagesCount = isWillowPeak ? Math.max(1, Math.min(3, Math.ceil(guests / 4))) : 1;

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
    if (start >= end) return true;

    if (isWillowPeak) {
      let cur = new Date(start);
      cur.setHours(0, 0, 0, 0);
      const endNorm = new Date(end);
      endNorm.setHours(0, 0, 0, 0);

      while (cur < endNorm) {
        let bookedCottages = 0;
        for (const b of bookings) {
          if (b.status === "CANCELLED") continue;
          const bStart = new Date(b.checkIn);
          const bEnd = new Date(b.checkOut);
          bStart.setHours(0, 0, 0, 0);
          bEnd.setHours(0, 0, 0, 0);
          if (cur >= bStart && cur < bEnd) {
            bookedCottages += (b.cottagesCount || 1);
          }
        }
        if (bookedCottages + cottagesCount > 3) return true;
        cur = addDays(cur, 1);
      }
      return false;
    }

    return bookings.some(b => {
      if (b.status === "CANCELLED") return false;
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      bStart.setHours(0, 0, 0, 0);
      bEnd.setHours(0, 0, 0, 0);
      return bStart < end && bEnd > start;
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
      let checkOutTemp = addDays(tempDate, 3);
      
      // Shift checkOut if the range overlaps
      let rangeShift = 0;
      if (isRangeInvalid(tempDate, checkOutTemp)) {
        checkOutTemp = addDays(tempDate, 1);
        while (isRangeInvalid(tempDate, checkOutTemp) && rangeShift < 365) {
          checkOutTemp = addDays(checkOutTemp, 1);
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
      daysArray.push(new Date(y, m, d));
    }
    
    return daysArray;
  };

  const handleDayClick = (day: Date) => {
    if (calendarTarget === "checkIn") {
      setCheckIn(day);
      if (day >= checkOut || isRangeInvalid(day, checkOut)) {
        // Automatically find next available checkout date
        let tempOut = addDays(day, 1);
        while (isRangeInvalid(day, tempOut)) {
          tempOut = addDays(tempOut, 1);
        }
        setCheckOut(tempOut);
      }
      setCalendarTarget("checkOut");
    } else {
      if (day <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
      }
      if (isRangeInvalid(checkIn, day)) {
        alert("This range overlaps with an existing reservation. Please select another check-out date.");
        return;
      }
      setCheckOut(day);
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



  const nights = differenceInDays(checkOut, checkIn);

  // Timezone-safe daily rate calculation
  const getDayPriceDetails = (date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    // 1. Check Daily Overrides (highest priority)
    const dailyOverride = dailyPrices?.find(dp => {
      const dDate = new Date(dp.date);
      return check.getFullYear() === dDate.getUTCFullYear() &&
             check.getMonth() === dDate.getUTCMonth() &&
             check.getDate() === dDate.getUTCDate();
    });

    if (dailyOverride) {
      return { price: dailyOverride.price, type: "DAILY" as const, label: "due to demand" };
    }

    // 2. Check Seasonal Price Overrides
    const seasonalOverride = seasonalPrices?.find(sp => {
      const start = new Date(sp.startDate);
      const end = new Date(sp.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check.getTime() >= start.getTime() && check.getTime() <= end.getTime();
    });

    if (seasonalOverride) {
      return { 
        price: seasonalOverride.price, 
        type: "SEASONAL" as const, 
        label: seasonalOverride.label || "Holiday Season" 
      };
    }

    // 3. Check specific day-of-week pricing overrides
    const dayOfWeek = check.getDay();
    if (dayOfWeek === 5 && fridayPrice != null) {
      return { price: fridayPrice, type: "FRIDAY" as const, label: "Friday Rate" };
    }
    if (dayOfWeek === 6 && saturdayPrice != null) {
      return { price: saturdayPrice, type: "SATURDAY" as const, label: "Saturday Rate" };
    }
    if (dayOfWeek === 0 && sundayPrice != null) {
      return { price: sundayPrice, type: "SUNDAY" as const, label: "Sunday Rate" };
    }

    // 4. Check Legacy Weekend Pricing
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    if (isWeekend && weekendPrice) {
      return { price: weekendPrice, type: "WEEKEND" as const, label: "Weekend Rate" };
    }

    // 5. Fallback to base rate
    return { price: basePrice, type: "BASE" as const, label: "Base Rate" };
  };

  const getPricingBreakdown = () => {
    const breakdownList: Array<{ date: Date; price: number; type: string; label: string }> = [];
    if (nights <= 0) return breakdownList;

    for (let i = 0; i < nights; i++) {
      const dayDate = addDays(checkIn, i);
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
  const subtotal = Math.round(rawSubtotal * (isWillowPeak ? (cottagesCount / 3) : 1));

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

  const serviceFee = 0; // Removed luxury service fee

  const getDiscountRate = (code: string): number => {
    const clean = code.trim().toUpperCase();
    if (clean === "STAYW28" || clean.includes("28") || clean === "ESCAPE28" || clean === "FLASH28" || clean === "STAY28" || clean === "WILLAS28" || clean === "OFFER28" || clean === "LONAVALA28" || clean === "KHOPOLI28" || clean === "SUMMER28" || clean === "DIRECT28") {
      return 0.28;
    }
    if (clean === "STAY5") {
      return 0.05;
    }
    if (clean.length > 0) {
      return 0.28; // Standard 28% promo discount
    }
    return 0;
  };

  const discountRate = isCouponApplied ? getDiscountRate(couponCode) : 0;
  const discount = Math.round((subtotal + totalExtraGuestsCost) * discountRate);
  const total = Math.max(0, subtotal + totalExtraGuestsCost + serviceFee + addOnsCost - discount);

  const handleCheckInClick = () => {
    setCalendarTarget("checkIn");
    setShowCalendar(prev => !prev || calendarTarget !== "checkIn");
  };

  const handleCheckOutClick = () => {
    setCalendarTarget("checkOut");
    setShowCalendar(prev => !prev || calendarTarget !== "checkOut");
  };

  const handleBooking = async () => {
    if (!clientName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!clientEmail.trim() || !/^\S+@\S+\.\S+$/.test(clientEmail)) {
      alert("Please enter a valid Email Address.");
      return;
    }
    if (!clientPhone.trim()) {
      alert("Please enter your Phone Number.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedCheckIn = format(checkIn, "dd MMM yyyy");
      const formattedCheckOut = format(checkOut, "dd MMM yyyy");
      
      const addOnsSection = selectedAddOns.length > 0
        ? `\n• Add-On Experiences: *${selectedAddOns.join(", ")}*`
        : "";

      const discountSection = discount > 0
        ? `\n🏷️ *Discount Applied:* -₹${discount.toLocaleString("en-IN")} (Coupon: ${couponCode.toUpperCase()})`
        : "";

      const msg = `Hello Stay Willas team! 🌟 I'm planning our next luxury staycation and would love to reserve *${villaName}* for our group of *${guests}* guest(s). 🏰✨

Here are our stay details:
📅 *Dates:* ${formattedCheckIn} to ${formattedCheckOut} (${nights} nights)${addOnsSection}${discountSection}
💵 *Total Stay Bill:* ₹${total.toLocaleString("en-IN")}

Our Contact & Verified Details:
👤 *Name:* ${clientName.trim()}
✉️ *Email:* ${clientEmail.trim()}
📱 *Phone:* ${clientPhone.trim()}

We are so excited about this getaway! Could you please check availability and help us confirm our booking? Thank you so much! 🥂🍾`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/919619042310?text=${encodedMsg}`;
      
      window.open(whatsappUrl, "_blank");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Booking Error:", error);
      alert("Failed to initiate WhatsApp redirection. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickWhatsAppQuote = () => {
    const formattedCheckIn = format(checkIn, "dd MMM yyyy");
    const formattedCheckOut = format(checkOut, "dd MMM yyyy");
    const msg = `Hi Stay Willas Concierge! 🌟 I'm looking at *${villaName}* for ${guests} guest(s) from ${formattedCheckIn} to ${formattedCheckOut} (${nights} nights, ~₹${total.toLocaleString("en-IN")}). Could you please share your best direct offer and confirm availability?`;
    window.open(`https://wa.me/919619042310?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bg-white border border-border-subtle/80 rounded-3xl p-5 sm:p-7 lg:p-8 sticky top-28 shadow-[0_12px_48px_rgba(27,53,100,0.08)] w-full transition-all duration-300">
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-border-subtle/50">
        <div>
          <span className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-black">₹{price}</span>
          <span className="text-text-primary/50 text-xs sm:text-sm font-semibold ml-1.5">/ night</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
          isOverlapping ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOverlapping ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
          {isOverlapping ? 'Reserved' : 'Slots Open'}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Live Admin Panel Sync Status Badge */}
        <div className="flex items-center justify-between bg-slate-100/90 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-200/80">
          <span className="flex items-center gap-2 text-[#1B3564]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Admin Calendar Sync
          </span>
          <span className="text-[#DAA520] font-black">100% Real-Time</span>
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
              <span className="font-extrabold text-[#1B3564]">{format(checkIn, "MMM dd, yyyy")}</span>
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
              <span className="font-extrabold text-[#1B3564]">{format(checkOut, "MMM dd, yyyy")}</span>
              <CalendarIcon size={16} className="text-[#DAA520] shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {/* Dedicated Check Availability Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setShowCalendar(!showCalendar);
            if (!showCalendar) setCalendarTarget("checkIn");
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

            <div className="grid grid-cols-7 gap-1 text-center font-sans">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
              ))}
              
              {generateCalendarDays(currentCalendarMonth).map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                
                const isPast = day < new Date(new Date().setHours(0,0,0,0));
                const isBooked = isDateBooked(day);
                
                const isSelCheckIn = checkIn && day.toDateString() === checkIn.toDateString();
                const isSelCheckOut = checkOut && day.toDateString() === checkOut.toDateString();
                const isInSelectedRange = checkIn && checkOut && day > checkIn && day < checkOut;
                
                let dayClass = "text-xs py-2 rounded-xl transition-all relative font-bold ";
                let buttonDisabled = false;
                
                if (isPast) {
                  dayClass += "text-slate-350 cursor-not-allowed opacity-30";
                  buttonDisabled = true;
                } else if (isBooked) {
                  dayClass += "bg-red-50 text-red-400 line-through cursor-not-allowed border border-red-100/50 opacity-60";
                  buttonDisabled = true;
                } else if (isSelCheckIn || isSelCheckOut) {
                  dayClass += "bg-[#1B3564] text-white shadow-md scale-105 z-10 cursor-pointer";
                } else if (isInSelectedRange) {
                  dayClass += "bg-blue-50 text-[#1B3564] cursor-pointer";
                } else {
                  dayClass += "text-slate-800 hover:bg-slate-200 cursor-pointer hover:scale-105";
                }
                
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={buttonDisabled}
                    onClick={() => handleDayClick(day)}
                    className={`${dayClass} h-9 w-9 flex items-center justify-center mx-auto`}
                    title={isBooked ? "Unavailable due to Reservation" : undefined}
                  >
                    {day.getDate()}
                    {isBooked && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-4 text-[9px] font-sans text-slate-400 pt-3 border-t border-slate-200/60 uppercase tracking-widest font-black">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-50 border border-red-150 line-through block" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#1B3564] block" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-50 block" />
                <span>In Range</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Status Response Banner */}
        {isOverlapping ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 items-start text-left select-none shadow-sm border-l-4 border-l-red-500 animate-fade-in">
            <Info className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-red-900">Dates Unavailable (Already Reserved)</h5>
              <p className="text-[11px] text-red-800 leading-relaxed mt-0.5 font-medium">
                The range <strong className="font-bold">{format(checkIn, "dd MMM")} – {format(checkOut, "dd MMM yyyy")}</strong> overlaps with an active reservation. Please choose open dates on the calendar above.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 flex items-start gap-3 text-left select-none shadow-sm border-l-4 border-l-emerald-500 animate-fade-in">
            <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950">100% Available for Your Dates!</h5>
              <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5">
                Verified live against our reservation calendar for <strong className="font-bold">{format(checkIn, "dd MMM")} – {format(checkOut, "dd MMM")} ({nights} nights)</strong>. Proceed below to reserve!
              </p>
            </div>
          </div>
        )}

        {/* Guests picker - Dual Type or Select Input */}
        <div className="w-full bg-white p-4 text-left border border-border-subtle rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">
              Guests (Max {actualMaxGuests})
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={actualMaxGuests}
                className="w-12 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0"
                value={guests}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setGuests(Math.min(actualMaxGuests, Math.max(1, val)));
                  }
                }}
              />
              <span className="text-text-primary/30 text-xs font-bold select-none border-l border-border-subtle/60 pl-2">or select:</span>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="flex-1 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0 cursor-pointer appearance-none"
              >
                {Array.from({ length: actualMaxGuests }, (_, i) => i + 1).map(num => (
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
                <span>🏡</span> Cottage Allocation
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#1B3564] text-[#DAA520]">
                {cottagesCount} of 3 Cottages Booked
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              For <strong>{guests} guests</strong>, <strong>{cottagesCount} private cottage{cottagesCount > 1 ? "s are" : " is"}</strong> reserved (max 4 guests per cottage).
            </p>
            <div className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-amber-200/60 flex items-center gap-1.5">
              <span>✓</span>
              <span>
                {cottagesCount === 3
                  ? "Full Estate Reserved — exclusive access to all 3 cottages."
                  : `${3 - cottagesCount} cottage${3 - cottagesCount > 1 ? "s remain" : " remains"} free for other bookings on these dates.`
                }
              </span>
            </div>
          </div>
        )}

        {/* Coupon Code Section */}
        <div className="w-full bg-gradient-to-r from-amber-50 to-emerald-50/50 border border-[#DAA520]/40 rounded-2xl p-4 text-left shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#DAA520]/20 text-[#1B3564] text-xs font-black shrink-0">🎁</span>
              <div>
                <span className="text-[10px] text-[#DAA520] uppercase tracking-wider font-black block">Special Direct Offer</span>
                <p className="text-xs text-slate-800 font-bold mt-0.5 leading-tight">
                  Flat <span className="text-emerald-600 font-black">28% OFF</span> with coupon <strong className="text-[#1B3564] bg-white px-1.5 py-0.5 rounded border border-[#DAA520]/40 select-all">STAYW28</strong>
                </p>
              </div>
            </div>
            {!isCouponApplied ? (
              <button
                type="button"
                onClick={() => {
                  setIsCouponApplied(true);
                  setCouponCode("STAYW28");
                }}
                className="px-4 py-2 sm:px-3 sm:py-1.5 w-full sm:w-auto bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 shadow-xs"
              >
                Apply 28% Off
              </button>
            ) : (
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-full sm:w-auto shrink-0 justify-center">
                <Check size={12} className="stroke-[3]" /> 28% Applied (-₹{discount.toLocaleString("en-IN")})
              </span>
            )}
          </div>
          
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Enter coupon code (e.g. STAYW28)"
              className="flex-1 min-w-0 bg-white border border-border-subtle rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider placeholder:text-text-primary/30 placeholder:normal-case outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520]/20"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                if (isCouponApplied) {
                  setIsCouponApplied(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (isCouponApplied) {
                  setIsCouponApplied(false);
                  setCouponCode("");
                } else {
                  if (couponCode.trim().length > 0) {
                    setIsCouponApplied(true);
                  } else {
                    alert("Please enter a valid coupon code or click Apply 28% Off.");
                    setIsCouponApplied(false);
                  }
                }
              }}
              className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                isCouponApplied 
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" 
                  : "border-border-subtle bg-white hover:bg-slate-50 text-text-primary font-black"
              }`}
            >
              {isCouponApplied ? "Remove" : "Apply"}
            </button>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="pt-4 border-t border-border-subtle/60 space-y-3">
          <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-[0.15em] block text-left">
            Contact Information (Secure Checkout)
          </span>

          {/* Full Name */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Full Name</span>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <Users size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Email Address */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Email Address</span>
              <input
                type="email"
                required
                placeholder="e.g. john@example.com"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <Mail size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Phone Number */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Phone Number</span>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
            <Phone size={16} className="text-text-primary/30 shrink-0" />
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <Button 
          onClick={handleBooking}
          disabled={isLoading || nights <= 0 || isOverlapping}
          className={`w-full text-white rounded-2xl py-6 text-xs sm:text-sm font-black tracking-[0.16em] flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap cursor-pointer border border-[#DAA520]/40 ${
            isOverlapping 
              ? "bg-red-500 hover:bg-red-600 shadow-md cursor-not-allowed" 
              : "bg-[#1B3564] hover:bg-[#152A50] shadow-[0_8px_25px_rgba(27,53,100,0.3)] hover:shadow-[0_12px_35px_rgba(27,53,100,0.45)] hover:scale-[1.01] active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : isOverlapping ? (
            "DATES UNAVAILABLE DUE TO RESERVATION"
          ) : (
            "CONFIRM RESERVATION VIA WHATSAPP"
          )}
        </Button>

        {/* Fast-Track 1-Click WhatsApp Quote */}
        <button
          type="button"
          onClick={handleQuickWhatsAppQuote}
          disabled={nights <= 0 || isOverlapping}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
            <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
          </svg>
          <span>1-CLICK INSTANT WHATSAPP QUOTE</span>
        </button>
      </div>
      
      <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest mb-4 font-semibold select-none flex items-center justify-center gap-1.5">
        <span>🔒 Best Direct Price Guarantee • 0% Platform Fee</span>
      </p>

      {nights > 0 && (
        <div className="space-y-4 pt-6 border-t border-border-subtle">
          {/* Detailed stay breakdown card */}
          <div className="bg-bg-primary border border-border-subtle rounded-2xl p-4 space-y-2.5 text-left select-none shadow-sm">
            <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-[0.15em] block">
              Stay Rate Breakdown
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-text-primary/70">
                  <span className="font-medium">
                    {format(item.date, "dd MMM yyyy")} ({item.label})
                  </span>
                  <span className="font-bold text-text-primary">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs pt-2.5 border-t border-border-subtle/60 font-bold text-text-primary/80">
              <span>Accommodation Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {totalExtraGuestsCost > 0 && (
              <div className="flex justify-between text-xs pt-1 font-bold text-text-primary/80">
                <span>Extra Guests ({extraGuests} × ₹{extraGuestFee}/night)</span>
                <span>₹{totalExtraGuestsCost.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {addOnsCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-primary/60">Signature Experiences</span>
              <span className="text-text-primary">₹{addOnsCost.toLocaleString("en-IN")}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="flex items-center gap-1">🎁 Promo ({Math.round(discountRate * 100)}% Off)</span>
              <span>-₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-heading pt-4 border-t border-[#1B3564]/10">
            <span className="text-[#1B3564]">Total Stay Bill</span>
            <span className="text-[#1B3564] font-bold">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

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
