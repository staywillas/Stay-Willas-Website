"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Calendar as CalendarIcon, Sparkles, X, ChevronLeft, ChevronRight, 
  CheckCircle2, ShieldCheck, Clock, Users, ArrowRight, Home 
} from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isBefore, isAfter, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays } from "date-fns";
import BookingCard from "./booking-card";

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

interface MobileBookingControllerProps {
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
  location?: string;
}

export default function MobileBookingController(props: MobileBookingControllerProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(new Date());
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(addDays(new Date(), 2));

  // Willow Peak single cottage vs full estate selection
  const isWillowPeak = props.villaId.includes("willow") || props.villaName.toLowerCase().includes("willow");
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "ALL">("A");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen to custom event to open mobile booking if triggered from other parts of the page
  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true);
    const handleOpenAvailability = () => setIsAvailabilityOpen(true);
    window.addEventListener("open-mobile-booking", handleOpenBooking);
    window.addEventListener("open-mobile-availability", handleOpenAvailability);
    return () => {
      window.removeEventListener("open-mobile-booking", handleOpenBooking);
      window.removeEventListener("open-mobile-availability", handleOpenAvailability);
    };
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isBookingOpen || isAvailabilityOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBookingOpen, isAvailabilityOpen]);

  // Dynamic price based on cottage selection
  const activeDisplayPrice = isWillowPeak
    ? (cottageSelection === "ALL" ? "17,997" : "5,999")
    : props.price;

  const activeCottageSubtitle = isWillowPeak
    ? (cottageSelection === "ALL" 
        ? "All 3 Cottages (Full Estate, Up to 12 Guests)" 
        : `Cottage ${cottageSelection} (Max 4 Guests, Private Jacuzzi)`)
    : "";

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    for (const b of props.bookings || []) {
      if (b.status === "CANCELLED") continue;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Booked range check
      if (check >= start && check < end) {
        if (isWillowPeak && cottageSelection !== "ALL" && (b.cottagesCount ?? 1) < 3) {
          // partially booked estate still has cottages open
          continue;
        }
        return true;
      }
    }
    return false;
  };

  // Get price for specific date
  const getPriceForDate = (date: Date) => {
    if (isWillowPeak) {
      const dayIndex = date.getDay();
      const perCottageRate = dayIndex === 6 ? 8999 : (dayIndex === 5 || dayIndex === 0 ? 6999 : 5999);
      return cottageSelection === "ALL" ? perCottageRate * 3 : perCottageRate;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    const dayIndex = date.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat

    // 1. Daily Custom Price
    const customDaily = props.dailyPrices?.find(d => {
      const dStr = typeof d.date === "string" ? d.date.split("T")[0] : format(new Date(d.date), "yyyy-MM-dd");
      return dStr === dateStr;
    });
    if (customDaily) return customDaily.price;

    // 2. Seasonal Price
    const seasonal = props.seasonalPrices?.find(s => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
    if (seasonal) return seasonal.price;

    // 3. Day of week pricing
    if (dayIndex === 5 && props.fridayPrice) return props.fridayPrice;
    if (dayIndex === 6 && props.saturdayPrice) return props.saturdayPrice;
    if (dayIndex === 0 && props.sundayPrice) return props.sundayPrice;
    if ((dayIndex === 5 || dayIndex === 6) && props.weekendPrice) return props.weekendPrice;

    // 4. Default Base Price
    return props.basePrice;
  };

  // Handle date selection in availability calendar
  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date, today) || isDateBooked(date)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (isBefore(date, selectedCheckIn)) {
        setSelectedCheckIn(date);
        setSelectedCheckOut(null);
      } else if (isSameDay(date, selectedCheckIn)) {
        setSelectedCheckOut(addDays(date, 1));
      } else {
        let current = addDays(selectedCheckIn, 1);
        let hasBookedBetween = false;
        while (isBefore(current, date)) {
          if (isDateBooked(current)) {
            hasBookedBetween = true;
            break;
          }
          current = addDays(current, 1);
        }

        if (hasBookedBetween) {
          setSelectedCheckIn(date);
          setSelectedCheckOut(null);
        } else {
          setSelectedCheckOut(date);
        }
      }
    }
  };

  // Render month days for calendar
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = getDay(monthStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const blanks = Array.from({ length: startDayOfWeek }, (_, i) => i);

    return (
      <div className="grid grid-cols-7 gap-1 text-center select-none">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-[10px] font-black text-slate-400 py-1 uppercase">
            {day}
          </div>
        ))}

        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const isPast = isBefore(day, today);
          const isBooked = isDateBooked(day);
          const isCheckIn = selectedCheckIn && isSameDay(day, selectedCheckIn);
          const isCheckOut = selectedCheckOut && isSameDay(day, selectedCheckOut);
          const isInRange = selectedCheckIn && selectedCheckOut && isAfter(day, selectedCheckIn) && isBefore(day, selectedCheckOut);
          const dayPrice = getPriceForDate(day);

          let bgClass = "bg-white hover:bg-slate-50 text-slate-800 border-slate-100";
          if (isPast) {
            bgClass = "bg-slate-50 text-slate-300 cursor-not-allowed border-transparent";
          } else if (isBooked) {
            bgClass = "bg-rose-50/80 text-rose-400 border-rose-100 cursor-not-allowed";
          } else if (isCheckIn || isCheckOut) {
            bgClass = "bg-[#1B3564] text-[#DAA520] font-black shadow-md border-[#1B3564]";
          } else if (isInRange) {
            bgClass = "bg-[#DAA520]/15 text-[#1B3564] font-bold border-[#DAA520]/30";
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast || isBooked}
              onClick={() => handleDateClick(day)}
              className={`aspect-square p-1 rounded-xl border flex flex-col items-center justify-between transition-all relative ${bgClass}`}
            >
              <span className={`text-xs font-bold leading-none ${isCheckIn || isCheckOut ? "text-white" : ""}`}>
                {format(day, "d")}
              </span>
              
              {!isPast && !isBooked && (
                <span className={`text-[7.5px] leading-tight font-black ${isCheckIn || isCheckOut ? "text-[#DAA520]" : "text-emerald-700"}`}>
                  ₹{Math.round(dayPrice / 1000)}k
                </span>
              )}

              {isBooked && (
                <span className="text-[7px] text-rose-500 font-extrabold uppercase leading-none">
                  Reserved
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 1. INLINE MOBILE CALLOUT CARD */}
      <div className="lg:hidden w-full bg-gradient-to-br from-[#0E1B35] via-[#1B3564] to-[#0E1B35] rounded-3xl p-4 sm:p-5 text-white border border-[#DAA520]/30 shadow-2xl my-5">
        
        {/* Willow Peak Cottage Selector Controls */}
        {isWillowPeak && (
          <div className="mb-4 pb-3.5 border-b border-white/10 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Home size={12} /> Choose Cottage Setup:
              </span>
              <span className="text-[9px] bg-white/15 text-white font-bold px-2 py-0.5 rounded-md">
                {cottageSelection === "ALL" ? "3 Cottages" : `Cottage ${cottageSelection}`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "A", label: "Cottage A", sub: "Jacuzzi • 4G" },
                { id: "B", label: "Cottage B", sub: "Jacuzzi • 4G" },
                { id: "C", label: "Cottage C", sub: "Jacuzzi • 4G" },
                { id: "ALL", label: "All 3", sub: "Full • 12G" },
              ].map((item) => {
                const isSelected = cottageSelection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCottageSelection(item.id as any)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#DAA520] text-[#1B3564] font-black border-[#DAA520] shadow-md ring-1 ring-white"
                        : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-[10.5px] font-black leading-tight">{item.label}</div>
                    <div className={`text-[7.5px] mt-0.5 leading-tight ${isSelected ? "text-[#1B3564]/90 font-bold" : "text-white/60"}`}>
                      {item.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-amber-200/90 font-medium mt-2 leading-tight">
              ✓ {activeCottageSubtitle}
            </p>
          </div>
        )}

        {/* Pricing Header */}
        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/10">
          <div className="text-left">
            <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-widest block">
              {isWillowPeak ? `Direct Rate (${cottageSelection === "ALL" ? "All 3 Cottages" : `Cottage ${cottageSelection}`})` : "Direct Stay Guarantee"}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#FAF8F5]">₹{activeDisplayPrice}</span>
              <span className="text-xs text-white/60 font-sans">/ night</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              ✓ 0% Platform Fee
            </span>
          </div>
        </div>

        {/* 2 Primary Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setIsAvailabilityOpen(true)}
            className="w-full bg-white/10 hover:bg-white/20 border border-[#DAA520]/40 text-[#FAF8F5] py-3.5 px-3 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <CalendarIcon className="text-[#DAA520] shrink-0" size={15} />
            <span className="truncate">View Availability</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="w-full bg-gradient-to-r from-[#DAA520] to-[#E5B842] hover:from-[#c9951b] hover:to-[#DAA520] text-[#1B3564] py-3.5 px-3 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            <Sparkles size={15} className="shrink-0" />
            <span className="truncate">Book {isWillowPeak ? (cottageSelection === "ALL" ? "Estate" : `Cottage ${cottageSelection}`) : "Villa"}</span>
          </button>
        </div>
      </div>

      {/* 2. MOBILE FIXED STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-[#DAA520]/25 px-4 py-3 shadow-[0_-8px_30px_rgba(27,53,100,0.15)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col text-left shrink-0">
            <span className="text-[8px] text-[#DAA520] block uppercase tracking-widest font-black">
              {isWillowPeak ? (cottageSelection === "ALL" ? "Full Estate (3 Cottages)" : `Cottage ${cottageSelection} (Jacuzzi)`) : "Direct Best Rate"}
            </span>
            <span className="text-[#1B3564] font-black text-base leading-tight">₹{activeDisplayPrice} <span className="text-[9px] font-normal text-slate-500 font-sans">/ night</span></span>
            <span className="text-[7.5px] text-emerald-600 font-bold uppercase tracking-wider">✓ 0% Platform Fee</span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={() => setIsAvailabilityOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#1B3564] font-black px-3 py-2.5 rounded-xl text-[10px] tracking-wider uppercase transition-all duration-200 shadow-xs flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <CalendarIcon size={12} className="text-[#DAA520]" />
              <span>Availability</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-[#1B3564] to-[#254680] hover:from-[#152A50] hover:to-[#1B3564] text-[#DAA520] border border-[#DAA520]/30 font-black px-4 py-2.5 rounded-xl text-[10px] tracking-wider uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Sparkles size={12} />
              <span>Book {isWillowPeak ? (cottageSelection === "ALL" ? "Estate" : `Cottage ${cottageSelection}`) : "Villa"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. AVAILABILITY CALENDAR MODAL */}
      {mounted && isAvailabilityOpen && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsAvailabilityOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative w-full sm:max-w-lg bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DAA520]/30 p-5 sm:p-6 max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="text-left">
                <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-widest block">
                  {isWillowPeak ? `Live Availability (${cottageSelection === "ALL" ? "3 Cottages" : `Cottage ${cottageSelection}`})` : "Live Reservation Calendar"}
                </span>
                <h3 className="text-lg font-heading text-[#1B3564] font-bold">Select Dates</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailabilityOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Willow Peak Cottage Switcher inside Calendar */}
            {isWillowPeak && (
              <div className="grid grid-cols-4 gap-1 mt-3 pb-2 border-b border-slate-200">
                {[
                  { id: "A", label: "Cottage A" },
                  { id: "B", label: "Cottage B" },
                  { id: "C", label: "Cottage C" },
                  { id: "ALL", label: "All 3" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCottageSelection(item.id as any)}
                    className={`py-1 px-1 rounded-lg text-xs font-bold border transition-all ${
                      cottageSelection === item.id
                        ? "bg-[#1B3564] text-[#DAA520] border-[#1B3564]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Month Navigator */}
            <div className="flex items-center justify-between my-3 px-2">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-heading font-bold text-[#1B3564]">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto py-1">
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-around py-2.5 mt-2 border-t border-slate-200 text-[10px] text-slate-600">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B3564]" />
                <span>Selected</span>
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <button
              type="button"
              onClick={() => {
                setIsAvailabilityOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full mt-3 bg-gradient-to-r from-[#1B3564] to-[#254680] text-[#DAA520] hover:text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
            >
              <span>Continue to Book</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* 4. FULL BOOKING PANEL SLIDE-UP SHEET */}
      {mounted && isBookingOpen && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsBookingOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DAA520]/30 max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 bg-[#FAF8F5] rounded-t-3xl shrink-0">
              <div className="text-left">
                <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-widest block">Direct Sanctuary Booking</span>
                <h3 className="text-base font-heading text-[#1B3564] font-bold">{props.villaName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Booking Form */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 select-none">
              <BookingCard 
                {...props} 
                initialCottageSelection={cottageSelection}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
