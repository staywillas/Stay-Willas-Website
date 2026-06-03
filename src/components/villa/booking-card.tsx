"use client";

import React, { useState, useRef } from "react";
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
}

interface BookingCardProps {
  villaId: string;
  villaName: string;
  price: string;
  basePrice: number;
  weekendPrice?: number | null;
  dailyPrices: DailyPriceProp[];
  seasonalPrices: SeasonalPriceProp[];
  maxGuests?: number;
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
  dailyPrices = [], 
  seasonalPrices = [], 
  maxGuests = 16,
  bookings = []
}: BookingCardProps) => {
  const { user, isSignedIn } = useUser();

  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);

  // Premium custom calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"checkIn" | "checkOut">("checkIn");
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  // Date booked checking logic (exclusive checkout day)
  const isDateBooked = React.useCallback((date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);
    return bookings.some(b => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check >= start && check < end;
    });
  }, [bookings]);

  // Date range overlap check
  const isRangeInvalid = React.useCallback((start: Date, end: Date) => {
    if (start >= end) return true;
    return bookings.some(b => {
      const bStart = new Date(b.checkIn);
      const bEnd = new Date(b.checkOut);
      bStart.setHours(0, 0, 0, 0);
      bEnd.setHours(0, 0, 0, 0);
      return bStart < end && bEnd > start;
    });
  }, [bookings]);

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

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

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

    // 3. Check Weekend Pricing (Friday = 5, Saturday = 6)
    const dayOfWeek = check.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    if (isWeekend && weekendPrice) {
      return { price: weekendPrice, type: "WEEKEND" as const, label: "Weekend Rate" };
    }

    // 4. Fallback to base rate
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
  const subtotal = breakdown.reduce((sum, item) => sum + item.price, 0);

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

  const serviceFee = 5000;
  const total = subtotal + serviceFee + addOnsCost;

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

      const msg = `Hello Stay Willas team! 🌟 I'm planning our next luxury staycation and would love to reserve *${villaName}* for our group of *${guests}* guest(s). 🏰✨

Here are our stay details:
📅 *Dates:* ${formattedCheckIn} to ${formattedCheckOut} (${nights} nights)${addOnsSection}
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

  return (
    <div className="bg-bg-primary border border-border-subtle rounded-3xl p-6 md:p-8 sticky top-32 shadow-[0_10px_40px_rgba(44,31,14,0.1)]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-3xl font-heading text-text-primary">₹{price}</span>
          <span className="text-text-primary/40 text-sm ml-2">/ night</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wider ${isOverlapping ? 'text-red-500' : 'text-accent-secondary'}`}>
          <span className={`w-2 h-2 rounded-full ${isOverlapping ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
          {isOverlapping ? 'Reserved' : 'Available'}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {/* Date picker pair */}
        <div className={`grid grid-cols-2 gap-px bg-[#E2E8F0] border rounded-2xl overflow-hidden relative transition-all duration-300 ${
          showCalendar ? 'border-[#1B3564] shadow-sm' : 'border-border-subtle'
        }`}>
          <div 
            onClick={handleCheckInClick}
            className={`relative p-4 text-left cursor-pointer transition-colors ${
              showCalendar && calendarTarget === 'checkIn' ? 'bg-[#1B3564]/5' : 'bg-white hover:bg-bg-primary'
            }`}
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Check-in</span>
            <div className="flex items-center justify-between text-text-primary text-sm">
              <span className="font-bold">{format(checkIn, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-accent-secondary" />
            </div>
            <input 
              ref={checkInRef}
              type="date"
              className="absolute bottom-0 right-0 w-0 h-0 opacity-0 pointer-events-none"
              min={format(new Date(), "yyyy-MM-dd")}
              value={format(checkIn, "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value);
                  setCheckIn(newDate);
                  if (newDate >= checkOut) setCheckOut(addDays(newDate, 3));
                }
              }}
            />
          </div>
          <div 
            onClick={handleCheckOutClick}
            className={`relative p-4 text-left border-l border-border-subtle cursor-pointer transition-colors ${
              showCalendar && calendarTarget === 'checkOut' ? 'bg-[#1B3564]/5' : 'bg-white hover:bg-bg-primary'
            }`}
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Check-out</span>
            <div className="flex items-center justify-between text-text-primary text-sm">
              <span className="font-bold">{format(checkOut, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-accent-secondary" />
            </div>
            <input 
              ref={checkOutRef}
              type="date"
              className="absolute bottom-0 right-0 w-0 h-0 opacity-0 pointer-events-none"
              min={format(addDays(checkIn, 1), "yyyy-MM-dd")}
              value={format(checkOut, "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) setCheckOut(new Date(e.target.value));
              }}
            />
          </div>
        </div>

        {/* Breathtakingly Premium Inline Calendar Picker */}
        {showCalendar && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-inner animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 cursor-pointer border border-slate-200/50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-sans font-black uppercase tracking-widest text-[#1B3564]">
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

        {isOverlapping && (
          <div className="bg-red-50 border border-red-250 text-red-800 rounded-3xl p-4 flex gap-3 items-start text-left select-none shadow-sm border-l-4 border-l-red-500">
            <Info className="text-red-500 shrink-0 mt-0.5" size={16} />
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-red-800">Dates Reserved</h5>
              <p className="text-[11px] text-red-750 leading-relaxed mt-0.5">
                These dates overlap with an existing reservation. Please select available sanctuary dates using the calendar.
              </p>
            </div>
          </div>
        )}

        {/* Guests picker - Dual Type or Select Input */}
        <div className="w-full bg-white p-4 text-left border border-border-subtle rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Guests (Max {maxGuests})</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={maxGuests}
                className="w-12 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0"
                value={guests}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setGuests(Math.min(maxGuests, Math.max(1, val)));
                  }
                }}
              />
              <span className="text-text-primary/30 text-xs font-bold select-none border-l border-border-subtle/60 pl-2">or select:</span>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="flex-1 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0 cursor-pointer appearance-none"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className="text-text-primary">
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Users size={16} className="text-text-primary/30 shrink-0 pointer-events-none" />
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

      <Button 
        onClick={handleBooking}
        disabled={isLoading || nights <= 0 || isOverlapping}
        className={`w-full text-white rounded-full py-6 text-[10px] md:text-xs font-black tracking-[0.2em] mb-4 flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap cursor-pointer ${
          isOverlapping 
            ? "bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-not-allowed" 
            : "bg-[#1B3564] hover:bg-[#152A50] shadow-[0_0_20px_rgba(27,53,100,0.25)] hover:shadow-[0_0_30px_rgba(27,53,100,0.4)]"
        }`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isOverlapping ? (
          "DATES UNAVAILABLE DUE TO RESERVATION"
        ) : (
          "RESERVE NOW & SECURE STAY"
        )}
      </Button>
      
      <p className="text-center text-text-primary/40 text-[10px] uppercase tracking-widest mb-6 select-none">
        Secure checkout & temporary 10-minute hold
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
          </div>

          {addOnsCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-primary/60">Signature Experiences</span>
              <span className="text-text-primary">₹{addOnsCost.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-text-primary/60">Luxury Service Fee</span>
            <span className="text-text-primary">₹{serviceFee.toLocaleString("en-IN")}</span>
          </div>
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
