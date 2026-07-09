"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon,
  MapPin,
  ChevronDown,
  ArrowRight,
  Users
} from "lucide-react";
import { 
  format, 
  isBefore, 
  isAfter, 
  isSameDay, 
  startOfDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  addMonths, 
  subMonths, 
  parseISO 
} from "date-fns";
import { getDestinationAvailability } from "@/app/actions/booking";
import { AnimatePresence, motion } from "framer-motion";

const BookingBar = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("Lonavala");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState("2");
  
  // Custom Calendar Popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarViewMonth, setCalendarViewMonth] = useState<Date>(new Date());
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [totalVillas, setTotalVillas] = useState<number>(0);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync destination with live Prisma database availability
  useEffect(() => {
    let active = true;
    const fetchAvailability = async () => {
      if (!destination) return;
      setIsLoadingBookings(true);
      try {
        const res = await getDestinationAvailability(destination);
        if (active && res.success && res.bookings) {
          setBookingsData(res.bookings);
          setTotalVillas(res.totalVillas);
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        if (active) setIsLoadingBookings(false);
      }
    };
    fetchAvailability();
    
    // Clear dates when destination changes to prevent illegal/cross-region reservations
    setCheckIn(null);
    setCheckOut(null);
    
    return () => {
      active = false;
    };
  }, [destination]);

  // Helper: check if a calendar date is fully booked across all villas in the region
  const isDateFullyBooked = (date: Date) => {
    if (totalVillas === 0) return false;
    const targetDay = startOfDay(date);
    
    const activeBookingsCount = bookingsData.filter(booking => {
      const checkInDate = startOfDay(parseISO(booking.checkIn));
      const checkOutDate = startOfDay(parseISO(booking.checkOut));
      // Overlap condition: booking.checkIn <= targetDay < booking.checkOut
      return (
        (checkInDate.getTime() <= targetDay.getTime()) && 
        (targetDay.getTime() < checkOutDate.getTime())
      );
    }).length;
    
    return activeBookingsCount >= totalVillas;
  };

  // Select Date handler with premium validation rules
  const handleDateSelect = (day: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (isBefore(day, checkIn)) {
        setCheckIn(day);
        setCheckOut(null);
      } else if (isSameDay(day, checkIn)) {
        setCheckIn(null);
      } else {
        // Enforce range safety: No fully booked night between checkIn and checkOut
        let hasBookedDayInRange = false;
        let temp = new Date(checkIn);
        while (isBefore(temp, day)) {
          if (isDateFullyBooked(temp)) {
            hasBookedDayInRange = true;
            break;
          }
          temp = new Date(temp.setDate(temp.getDate() + 1));
        }

        if (hasBookedDayInRange) {
          setCheckIn(day);
          setCheckOut(null);
        } else {
          setCheckOut(day);
          // Smooth closing delay for premium user feedback
          setTimeout(() => setIsCalendarOpen(false), 200);
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checkInStr = checkIn ? format(checkIn, "dd MMM yyyy") : "Not specified";
    const checkOutStr = checkOut ? format(checkOut, "dd MMM yyyy") : "Not specified";
    const guestCount = guests.trim() || "2";
    const guestLabel = guestCount === "1" ? "guest" : "guests";
    
    const msg = `Hello Stay Willas! 🌟 I am planning a luxury villa staycation in *${destination}* and would love to check your availability. 

Here are our details:
👥 *Guest Count:* ${guestCount} ${guestLabel}
📅 *Preferred Dates:* ${checkInStr} to ${checkOutStr}

Could you please share the options available and help us plan our perfect getaway? Thank you so much! ✨`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/919619042310?text=${encodedMsg}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="relative z-40 max-w-[1200px] w-full mx-auto px-6 -mt-8 md:-mt-12 lg:-mt-14 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white rounded-[2rem] md:rounded-full p-4 md:p-3.5 pl-4 md:pl-8 pr-4 md:pr-4 shadow-[0_25px_60px_rgba(27,53,100,0.15)] border border-[#DAA520]/25"
      >
        <form onSubmit={handleSearch} className="relative z-30">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-1">
            
            {/* WHERE TO */}
            <div className="flex-[1.2] min-w-0 px-4 py-1.5 flex flex-col gap-0.5 text-left">
              <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} className="text-[#DAA520]" />
                WHERE TO?
              </label>
              <div className="relative flex items-center">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-sm font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-6 font-heading"
                >
                  <option value="Lonavala">Lonavala</option>
                  <option value="Khopoli">Khopoli</option>
                  <option value="Alibaug">Alibaug</option>
                  <option value="Karjat">Karjat</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 text-[#1B3564]/50 pointer-events-none" />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-8 w-[1px] bg-slate-200/60 self-center" />

            {/* CHECK-IN */}
            <div 
              onClick={() => setIsCalendarOpen(true)}
              className="flex-1 px-4 py-1.5 flex flex-col gap-0.5 cursor-pointer select-none group text-left"
            >
              <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1">
                <CalendarIcon size={10} className="text-[#DAA520]" />
                CHECK-IN
              </label>
              <div className="text-sm font-bold text-[#1B3564] h-5 flex items-center font-heading">
                {checkIn ? format(checkIn, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-8 w-[1px] bg-slate-200/60 self-center" />

            {/* CHECK-OUT */}
            <div 
              onClick={() => setIsCalendarOpen(true)}
              className="flex-1 px-4 py-1.5 flex flex-col gap-0.5 cursor-pointer select-none group text-left"
            >
              <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1">
                <CalendarIcon size={10} className="text-[#DAA520]" />
                CHECK-OUT
              </label>
              <div className="text-sm font-bold text-[#1B3564] h-5 flex items-center font-heading">
                {checkOut ? format(checkOut, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-8 w-[1px] bg-slate-200/60 self-center" />

            {/* GUESTS */}
            <div className="flex-1 px-4 py-1.5 flex flex-col gap-0.5 text-left">
              <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                <Users size={10} className="text-[#DAA520]" />
                GUESTS
              </label>
              <div className="relative flex items-center mt-0.5">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-sm font-bold text-[#1B3564] outline-none border-none p-0 focus:ring-0 w-full font-heading"
                  placeholder="Enter guests"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[10px] tracking-widest uppercase rounded-full px-6 py-3.5 shadow-lg shadow-yellow-500/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none flex items-center gap-2 shrink-0 self-center"
            >
              <span>Check Availability</span>
              <ArrowRight size={12} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-2.5 pb-2">
              
              {/* WHERE TO */}
              <div className="flex flex-col gap-1 text-left bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <label className="text-[8px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={8} className="text-[#DAA520]" />
                  WHERE TO?
                </label>
                <div className="relative flex items-center">
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-6 font-heading"
                  >
                    <option value="Lonavala">Lonavala</option>
                    <option value="Khopoli">Khopoli</option>
                    <option value="Alibaug">Alibaug</option>
                    <option value="Karjat">Karjat</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-0 text-[#1B3564]/50 pointer-events-none" />
                </div>
              </div>

              {/* DATES ROW */}
              <div className="grid grid-cols-2 gap-2.5">
                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none text-left bg-slate-50/50 p-2.5 rounded-xl border border-slate-100"
                >
                  <label className="text-[8px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon size={8} className="text-[#DAA520]" />
                    CHECK-IN
                  </label>
                  <div className="text-xs font-bold text-[#1B3564] h-4 flex items-center font-heading">
                    {checkIn ? format(checkIn, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal text-[11px]">Add dates</span>}
                  </div>
                </div>

                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none text-left bg-slate-50/50 p-2.5 rounded-xl border border-slate-100"
                >
                  <label className="text-[8px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon size={8} className="text-[#DAA520]" />
                    CHECK-OUT
                  </label>
                  <div className="text-xs font-bold text-[#1B3564] h-4 flex items-center font-heading">
                    {checkOut ? format(checkOut, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal text-[11px]">Add dates</span>}
                  </div>
                </div>
              </div>

              {/* GUESTS ROW */}
              <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex flex-col gap-1 text-left flex-1 mr-3">
                  <label className="text-[8px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest flex items-center gap-1">
                    <Users size={8} className="text-[#DAA520]" />
                    GUESTS
                  </label>
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#1B3564] outline-none border-none p-0 focus:ring-0 w-full font-heading"
                      placeholder="Enter guests"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[9px] tracking-widest uppercase rounded-full px-4.5 py-2.5 shadow-lg shadow-yellow-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer border-none flex items-center gap-1 shrink-0"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={10} className="stroke-[2.5]" />
                </button>
              </div>

            </div>
          </div>
        </form>
      </motion.div>

      {/* Calendar Popover */}
      <AnimatePresence>
        {isCalendarOpen && (
          isMobile && mounted ? (
            createPortal(
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Dark blur backdrop */}
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)} />
                {/* Centered Modal Content Card */}
                <div className="relative z-[1000] w-full max-w-[350px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.15)] p-5 text-left">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                    <span className="text-[#1B3564] font-bold text-xs tracking-wide">{format(calendarViewMonth, "MMMM yyyy")}</span>
                    <button type="button" onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronRight size={14} /></button>
                  </div>
                  
                  {/* Weekdays */}
                  <div className="grid grid-cols-7 text-center mb-1.5">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                      <span key={idx} className="text-[9px] font-extrabold text-[#E2A63B] uppercase tracking-widest">{day}</span>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: getDay(startOfMonth(calendarViewMonth)) }).map((_, i) => <div key={`empty-${i}`} />)}
                    {eachDayOfInterval({ start: startOfMonth(calendarViewMonth), end: endOfMonth(calendarViewMonth) }).map((day) => {
                      const isPast = isBefore(day, startOfDay(new Date()));
                      const isBooked = isDateFullyBooked(day);
                      const isSelectedCheckIn = checkIn && isSameDay(day, checkIn);
                      const isSelectedCheckOut = checkOut && isSameDay(day, checkOut);
                      const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                      const isDisabled = isPast || isBooked;

                      return (
                        <button
                          key={day.toString()} type="button" disabled={isDisabled} onClick={() => handleDateSelect(day)}
                          className={`w-8 h-8 rounded-full text-[11px] font-bold flex flex-col items-center justify-center transition-all
                            ${isDisabled ? 'text-slate-300 cursor-not-allowed' : ''}
                            ${isBooked ? 'bg-[#FFB800]/10 text-slate-400' : ''}
                            ${isSelectedCheckIn || isSelectedCheckOut ? 'bg-[#2563EB] text-white shadow-md scale-105 z-10' : ''}
                            ${isInRange ? 'bg-[#2563EB]/10 text-[#2563EB]' : ''}
                            ${!isDisabled && !isSelectedCheckIn && !isSelectedCheckOut && !isInRange ? 'text-[#1B3564] hover:bg-slate-100 cursor-pointer' : ''}
                          `}
                        >
                          <span>{format(day, "d")}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                    <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold tracking-wider">CLEAR</button>
                    <button type="button" onClick={() => setIsCalendarOpen(false)} className="px-4 py-1.5 bg-[#1B3564] text-white rounded-full text-[10px] font-bold tracking-widest shadow-md">DONE</button>
                  </div>
                </div>
              </div>,
              document.body
            )
          ) : (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsCalendarOpen(false)} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-0 mt-4 z-50 w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.15)] p-5 text-left">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                  <span className="text-[#1B3564] font-bold text-xs tracking-wide">{format(calendarViewMonth, "MMMM yyyy")}</span>
                  <button type="button" onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronRight size={14} /></button>
                </div>
                
                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center mb-1.5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                    <span key={idx} className="text-[9px] font-extrabold text-[#E2A63B] uppercase tracking-widest">{day}</span>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: getDay(startOfMonth(calendarViewMonth)) }).map((_, i) => <div key={`empty-${i}`} />)}
                  {eachDayOfInterval({ start: startOfMonth(calendarViewMonth), end: endOfMonth(calendarViewMonth) }).map((day) => {
                    const isPast = isBefore(day, startOfDay(new Date()));
                    const isBooked = isDateFullyBooked(day);
                    const isSelectedCheckIn = checkIn && isSameDay(day, checkIn);
                    const isSelectedCheckOut = checkOut && isSameDay(day, checkOut);
                    const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                    const isDisabled = isPast || isBooked;

                    return (
                      <button
                        key={day.toString()} type="button" disabled={isDisabled} onClick={() => handleDateSelect(day)}
                        className={`w-8 h-8 rounded-full text-[11px] font-bold flex flex-col items-center justify-center transition-all
                          ${isDisabled ? 'text-slate-300 cursor-not-allowed' : ''}
                          ${isBooked ? 'bg-[#FFB800]/10 text-slate-400' : ''}
                          ${isSelectedCheckIn || isSelectedCheckOut ? 'bg-[#2563EB] text-white shadow-md scale-105 z-10' : ''}
                          ${isInRange ? 'bg-[#2563EB]/10 text-[#2563EB]' : ''}
                          ${!isDisabled && !isSelectedCheckIn && !isSelectedCheckOut && !isInRange ? 'text-[#1B3564] hover:bg-slate-100 cursor-pointer' : ''}
                        `}
                      >
                        <span>{format(day, "d")}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold tracking-wider">CLEAR</button>
                  <button type="button" onClick={() => setIsCalendarOpen(false)} className="px-4 py-1.5 bg-[#1B3564] text-white rounded-full text-[10px] font-bold tracking-widest shadow-md">DONE</button>
                </div>
              </div>
            </>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingBar;
