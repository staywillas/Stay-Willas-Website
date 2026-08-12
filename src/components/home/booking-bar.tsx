"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon,
  MapPin,
  ChevronDown,
  ArrowRight,
  Users,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles
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
import { getDestinationAvailability, checkAvailableVillasForDates } from "@/app/actions/booking";
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

  // Availability Search Results Modal State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [availableVillasList, setAvailableVillasList] = useState<any[]>([]);

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

  useEffect(() => {
    if (availabilityModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [availabilityModalOpen]);

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
      return (
        (checkInDate.getTime() <= targetDay.getTime()) && 
        (targetDay.getTime() < checkOutDate.getTime())
      );
    }).length;
    
    return activeBookingsCount >= totalVillas;
  };

  // Select Date handler
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
          setTimeout(() => setIsCalendarOpen(false), 200);
        }
      }
    }
  };

  // Option 1: On-site Check Availability (Queries DB and displays matching villas in a modal)
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalendarOpen(false);
    setIsCheckingAvailability(true);
    try {
      const res = await checkAvailableVillasForDates({
        destination,
        checkIn: checkIn ? checkIn.toISOString() : undefined,
        checkOut: checkOut ? checkOut.toISOString() : undefined,
        guests: Number(guests) || 1,
      });
      if (res.success && res.villas) {
        setAvailableVillasList(res.villas);
      } else {
        setAvailableVillasList([]);
      }
    } catch (err) {
      console.error("Availability search failed:", err);
      setAvailableVillasList([]);
    } finally {
      setIsCheckingAvailability(false);
      setAvailabilityModalOpen(true);
    }
  };

  // Option 2: Direct WhatsApp Inquiry
  const handleWhatsAppInquiry = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const checkInStr = checkIn ? format(checkIn, "dd MMM yyyy") : "Not specified";
    const checkOutStr = checkOut ? format(checkOut, "dd MMM yyyy") : "Not specified";
    const guestCount = guests.trim() || "2";
    const guestLabel = guestCount === "1" ? "guest" : "guests";
    
    const msg = `Hello Stay Willas! 🌟 I am planning a luxury staycation in *${destination}* and would like to check villa availability. 

👥 *Guests:* ${guestCount} ${guestLabel}
📅 *Dates:* ${checkInStr} to ${checkOutStr}

Could you please share available villas and assist us with our booking? Thank you! ✨`;

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
        <form onSubmit={handleCheckAvailability} className="relative z-30">
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
                  aria-label="Select Destination"
                  className="bg-transparent text-sm font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-6 font-heading"
                >
                  <option value="Lonavala">Lonavala</option>
                  <option value="Khopoli">Khopoli</option>
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
                  aria-label="Number of Guests"
                  className="bg-transparent text-sm font-bold text-[#1B3564] outline-none border-none p-0 focus:ring-0 w-full font-heading"
                  placeholder="Enter guests"
                />
              </div>
            </div>

            {/* Action Buttons: Option 1 (Check Availability) & Option 2 (WhatsApp) */}
            <div className="flex items-center gap-2 shrink-0 self-center">
              <button
                type="submit"
                disabled={isCheckingAvailability}
                aria-label="Check Availability"
                className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[10px] tracking-widest uppercase rounded-full px-5 py-3.5 shadow-lg shadow-yellow-500/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none flex items-center gap-2"
              >
                {isCheckingAvailability ? (
                  <Loader2 size={13} className="animate-spin text-[#1B3564]" />
                ) : (
                  <>
                    <span>Check Availability</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                aria-label="Direct to WhatsApp"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] tracking-widest uppercase rounded-full px-5 py-3.5 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none flex items-center gap-2"
              >
                <MessageCircle size={13} className="fill-white/20 stroke-[2.5]" />
                <span>WhatsApp Inquiry</span>
              </button>
            </div>
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
                    aria-label="Select Destination"
                    className="bg-transparent text-xs font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-6 font-heading"
                  >
                    <option value="Lonavala">Lonavala</option>
                    <option value="Khopoli">Khopoli</option>
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
                <div className="flex flex-col gap-1 text-left flex-1 mr-2">
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
                      aria-label="Number of Guests"
                      className="bg-transparent text-xs font-bold text-[#1B3564] outline-none border-none p-0 focus:ring-0 w-full font-heading"
                      placeholder="Enter guests"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isCheckingAvailability}
                  aria-label="Check Availability"
                  className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[9px] tracking-widest uppercase rounded-full py-3 px-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  {isCheckingAvailability ? (
                    <Loader2 size={12} className="animate-spin text-[#1B3564]" />
                  ) : (
                    <>
                      <span>Check Dates</span>
                      <ArrowRight size={10} className="stroke-[2.5]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  aria-label="WhatsApp Inquiry"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] tracking-widest uppercase rounded-full py-3 px-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={12} />
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </form>
      </motion.div>

      {/* Calendar Popover */}
      {isMobile && mounted ? (
        createPortal(
          <AnimatePresence>
            {isCalendarOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0" onClick={() => setIsCalendarOpen(false)} />
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="relative z-10 w-full max-w-[350px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.15)] p-5 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" aria-label="Previous month" onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                    <span className="text-[#1B3564] font-bold text-xs tracking-wide">{format(calendarViewMonth, "MMMM yyyy")}</span>
                    <button type="button" aria-label="Next month" onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronRight size={14} /></button>
                  </div>
                  
                  <div className="grid grid-cols-7 text-center mb-1.5">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                      <span key={idx} className="text-[9px] font-extrabold text-[#E2A63B] uppercase tracking-widest">{day}</span>
                    ))}
                  </div>

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
                    <button type="button" aria-label="Clear Dates" onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold tracking-wider">CLEAR</button>
                    <button type="button" aria-label="Done" onClick={() => setIsCalendarOpen(false)} className="px-4 py-1.5 bg-[#1B3564] text-white rounded-full text-[10px] font-bold tracking-widest shadow-md">DONE</button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )
      ) : (
        <AnimatePresence>
          {isCalendarOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsCalendarOpen(false)} />
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute top-full left-1/2 -translate-x-1/2 translate-y-0 mt-4 z-50 w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.15)] p-5 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <button type="button" aria-label="Previous month" onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                  <span className="text-[#1B3564] font-bold text-xs tracking-wide">{format(calendarViewMonth, "MMMM yyyy")}</span>
                  <button type="button" aria-label="Next month" onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))} className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronRight size={14} /></button>
                </div>
                
                <div className="grid grid-cols-7 text-center mb-1.5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                    <span key={idx} className="text-[9px] font-extrabold text-[#E2A63B] uppercase tracking-widest">{day}</span>
                  ))}
                </div>

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
                  <button type="button" aria-label="Clear Dates" onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold tracking-wider">CLEAR</button>
                  <button type="button" aria-label="Done" onClick={() => setIsCalendarOpen(false)} className="px-4 py-1.5 bg-[#1B3564] text-white rounded-full text-[10px] font-bold tracking-widest shadow-md">DONE</button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Availability Results Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {availabilityModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-900/70 backdrop-blur-md" 
                onClick={() => setAvailabilityModalOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left my-6"
              >
                
                {/* Modal Header */}
                <div className="bg-[#1B3564] text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-cormorant font-bold text-lg text-amber-400">Villa Availability Results</h3>
                      <p className="text-[11px] text-slate-300">
                        {destination} • {checkIn ? format(checkIn, "MMM dd") : "Flex Dates"} {checkOut ? `- ${format(checkOut, "MMM dd, yyyy")}` : ""} • {guests} Guests
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvailabilityModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-none cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
                  {availableVillasList.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>{availableVillasList.length} {availableVillasList.length === 1 ? "Sanctuary" : "Sanctuaries"} Available</span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Direct Online Booking Ready
                        </span>
                      </div>

                      {availableVillasList.map((villa) => (
                        <div 
                          key={villa.id} 
                          className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400/60 transition-all group"
                        >
                          <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                            <img
                              src={villa.image || "/images/hero-villa.png"}
                              alt={villa.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-left w-full">
                            <h4 className="font-cormorant font-bold text-base text-[#1B3564] truncate">{villa.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {villa.location} • {villa.bedrooms} Bedrooms • Up to {villa.guests} Guests
                            </p>
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              ₹{villa.price?.toLocaleString("en-IN")} <span className="text-[10px] font-normal text-slate-500">/ night</span>
                            </p>
                          </div>
                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setAvailabilityModalOpen(false);
                                router.push(`/villa/${villa.slug}`);
                              }}
                              className="flex-1 sm:flex-initial px-4 py-2 bg-[#1B3564] hover:bg-[#2A4985] text-white text-[11px] font-bold rounded-xl cursor-pointer border-none shadow-md transition-colors whitespace-nowrap"
                            >
                              View Sanctuary →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mx-auto">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-950 text-sm">No Properties Available for Exact Dates</h4>
                        <p className="text-xs text-amber-800 mt-1 max-w-sm mx-auto leading-relaxed">
                          All properties in <strong>{destination}</strong> are booked for these dates or exceed guest capacity. Try selecting alternate dates or inquire directly on WhatsApp.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer border-none shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    Inquire on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvailabilityModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border-none"
                  >
                    Close
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default BookingBar;
