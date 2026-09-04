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
  ArrowRight,
  Users,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Bed,
  Bath,
  Waves,
  UtensilsCrossed
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

interface VillaResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  bedrooms: number;
  bathrooms?: number;
  guests: number;
  location: string;
  category?: string;
  amenities?: string[];
  image: string;
}

const BookingBar = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState("2");
  
  // Custom Calendar Popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarViewMonth, setCalendarViewMonth] = useState<Date>(new Date());
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [totalVillas, setTotalVillas] = useState<number>(0);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Property Selection / Availability Modal State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [availableVillasList, setAvailableVillasList] = useState<VillaResult[]>([]);
  const [modalLocationFilter, setModalLocationFilter] = useState<string>("ALL");

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

  // Load all global availability on demand when user opens calendar or modal
  useEffect(() => {
    if (!isCalendarOpen && !availabilityModalOpen) return;
    if (bookingsData.length > 0) return;

    let active = true;
    const fetchAvailability = async () => {
      setIsLoadingBookings(true);
      try {
        const res = await getDestinationAvailability("all");
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
    
    return () => {
      active = false;
    };
  }, [isCalendarOpen, availabilityModalOpen, bookingsData.length]);

  // Helper: check if a calendar date is fully booked across ALL villas in collection
  const isDateFullyBooked = (date: Date) => {
    if (totalVillas === 0) return false;
    const targetDay = startOfDay(date).getTime();
    
    const bookedVillaIds = new Set<string>();
    bookingsData.forEach(booking => {
      const checkInDate = startOfDay(parseISO(booking.checkIn)).getTime();
      const checkOutDate = startOfDay(parseISO(booking.checkOut)).getTime();
      if (checkInDate <= targetDay && targetDay < checkOutDate) {
        bookedVillaIds.add(booking.villaId);
      }
    });
    
    return bookedVillaIds.size >= totalVillas;
  };

  // Helper to format date only YYYY-MM-DD
  const formatDateOnly = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Fetch villas for given dates and open the property selection modal
  const fetchVillasAndOpenModal = async (selectedCheckIn: Date | null, selectedCheckOut: Date | null, guestCount: string) => {
    setIsCheckingAvailability(true);
    try {
      const res = await checkAvailableVillasForDates({
        destination: "all",
        checkIn: selectedCheckIn ? formatDateOnly(selectedCheckIn) : undefined,
        checkOut: selectedCheckOut ? formatDateOnly(selectedCheckOut) : undefined,
        guests: Number(guestCount) || 1,
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
          const newCheckOut = day;
          setCheckOut(newCheckOut);
          setIsCalendarOpen(false);
          // Automatically trigger popup when dates are completed!
          fetchVillasAndOpenModal(checkIn, newCheckOut, guests);
        }
      }
    }
  };

  // Primary Check Availability trigger
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalendarOpen(false);
    await fetchVillasAndOpenModal(checkIn, checkOut, guests);
  };

  // WhatsApp Inquiry handler
  const handleWhatsAppInquiry = (e?: React.MouseEvent, specificVillaName?: string) => {
    if (e) e.preventDefault();
    const checkInStr = checkIn ? format(checkIn, "dd MMM yyyy") : "Flexible dates";
    const checkOutStr = checkOut ? format(checkOut, "dd MMM yyyy") : "Flexible dates";
    const guestCount = guests.trim() || "2";
    const guestLabel = guestCount === "1" ? "guest" : "guests";
    
    let msg = "";
    if (specificVillaName) {
      msg = `Hello Stay Willas! 🌟 I would love to enquire about *${specificVillaName}*.
      
👥 *Guests:* ${guestCount} ${guestLabel}
📅 *Dates:* ${checkInStr} to ${checkOutStr}

Could you please confirm availability, special offers, and assist with reservation details? Thank you! ✨`;
    } else {
      msg = `Hello Stay Willas! 🌟 I am planning a luxury staycation near Mumbai and would like to check villa availability. 

👥 *Guests:* ${guestCount} ${guestLabel}
📅 *Dates:* ${checkInStr} to ${checkOutStr}

Could you please share the available luxury villas and packages? Thank you! ✨`;
    }

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/919619042310?text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank");
  };

  // Filter villas by location in the modal
  const filteredModalVillas = availableVillasList.filter((villa) => {
    if (modalLocationFilter === "ALL") return true;
    return villa.location.toLowerCase().includes(modalLocationFilter.toLowerCase());
  });

  // Calculate nights if dates selected
  const computedNights = checkIn && checkOut 
    ? Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  return (
    <div id="booking-bar-section" className="relative z-40 max-w-[1100px] w-full mx-auto px-6 -mt-8 md:-mt-12 lg:-mt-14 mb-8 scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white rounded-[2rem] md:rounded-full p-4 md:p-3 pl-4 md:pl-8 pr-4 md:pr-3.5 shadow-[0_25px_60px_rgba(27,53,100,0.16)] border border-[#DAA520]/40 ring-4 ring-[#DAA520]/10"
      >
        <form onSubmit={handleCheckAvailability} className="relative z-30">
          {/* Desktop Layout (Without Location, Focused on Dates & Guests) */}
          <div className="hidden md:flex items-center justify-between gap-2">
            
            {/* CHECK-IN */}
            <div 
              onClick={() => setIsCalendarOpen(true)}
              className="flex-[1.2] px-5 py-2 flex flex-col gap-0.5 cursor-pointer select-none group text-left rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1.5 cursor-pointer">
                <CalendarIcon size={12} className="text-[#DAA520]" />
                CHECK-IN
              </label>
              <div className="text-sm font-bold text-[#1B3564] h-6 flex items-center font-heading">
                {checkIn ? format(checkIn, "dd MMM, yyyy") : <span className="text-[#1B3564]/40 font-normal">Choose Check-in</span>}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-9 w-[1px] bg-slate-200/70 self-center" />

            {/* CHECK-OUT */}
            <div 
              onClick={() => setIsCalendarOpen(true)}
              className="flex-[1.2] px-5 py-2 flex flex-col gap-0.5 cursor-pointer select-none group text-left rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1.5 cursor-pointer">
                <CalendarIcon size={12} className="text-[#DAA520]" />
                CHECK-OUT
              </label>
              <div className="text-sm font-bold text-[#1B3564] h-6 flex items-center font-heading">
                {checkOut ? format(checkOut, "dd MMM, yyyy") : <span className="text-[#1B3564]/40 font-normal">Choose Check-out</span>}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-9 w-[1px] bg-slate-200/70 self-center" />

            {/* GUESTS */}
            <div className="flex-1 px-5 py-2 flex flex-col gap-0.5 text-left rounded-2xl hover:bg-slate-50 transition-colors">
              <label className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest flex items-center gap-1.5">
                <Users size={12} className="text-[#DAA520]" />
                GUESTS
              </label>
              <div className="relative flex items-center h-6">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  aria-label="Number of Guests"
                  className="bg-transparent text-sm font-bold text-[#1B3564] outline-none border-none p-0 focus:ring-0 w-full font-heading"
                  placeholder="2 Guests"
                />
              </div>
            </div>

            {/* Action Buttons: Check Availability & WhatsApp */}
            <div className="flex items-center gap-2.5 shrink-0 self-center pl-2">
              <button
                type="submit"
                disabled={isCheckingAvailability}
                aria-label="Check Availability"
                className="bg-[#DAA520] hover:bg-[#c4941a] text-[#1B3564] font-black text-xs tracking-wider uppercase rounded-full px-7 py-4 shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none flex items-center gap-2"
              >
                {isCheckingAvailability ? (
                  <Loader2 size={15} className="animate-spin text-[#1B3564]" />
                ) : (
                  <>
                    <span>CHECK VILLAS & RATES</span>
                    <ArrowRight size={14} className="stroke-[2.5]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleWhatsAppInquiry(e)}
                aria-label="Direct to WhatsApp"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs tracking-wider uppercase rounded-full px-5 py-4 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none flex items-center gap-2"
              >
                <MessageCircle size={15} className="fill-white/20 stroke-[2.5]" />
                <span className="hidden lg:inline">WHATSAPP</span>
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-2.5 pb-1">
              
              {/* DATES ROW */}
              <div className="grid grid-cols-2 gap-2.5">
                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none text-left bg-slate-50/70 p-3 rounded-2xl border border-slate-200/70"
                >
                  <label className="text-[9px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon size={10} className="text-[#DAA520]" />
                    CHECK-IN
                  </label>
                  <div className="text-xs font-bold text-[#1B3564] h-5 flex items-center font-heading">
                    {checkIn ? format(checkIn, "dd MMM, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add date</span>}
                  </div>
                </div>

                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none text-left bg-slate-50/70 p-3 rounded-2xl border border-slate-200/70"
                >
                  <label className="text-[9px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest flex items-center gap-1">
                    <CalendarIcon size={10} className="text-[#DAA520]" />
                    CHECK-OUT
                  </label>
                  <div className="text-xs font-bold text-[#1B3564] h-5 flex items-center font-heading">
                    {checkOut ? format(checkOut, "dd MMM, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add date</span>}
                  </div>
                </div>
              </div>

              {/* GUESTS ROW */}
              <div className="flex items-center justify-between bg-slate-50/70 p-3 rounded-2xl border border-slate-200/70">
                <div className="flex flex-col gap-1 text-left flex-1 mr-2">
                  <label className="text-[9px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest flex items-center gap-1">
                    <Users size={10} className="text-[#DAA520]" />
                    GUESTS CAPACITY
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
                  className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[10px] tracking-widest uppercase rounded-full py-3.5 px-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  {isCheckingAvailability ? (
                    <Loader2 size={13} className="animate-spin text-[#1B3564]" />
                  ) : (
                    <>
                      <span>CHECK VILLAS</span>
                      <ArrowRight size={11} className="stroke-[2.5]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleWhatsAppInquiry(e)}
                  aria-label="WhatsApp Inquiry"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] tracking-widest uppercase rounded-full py-3.5 px-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={13} />
                  <span>WHATSAPP</span>
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

      {/* Property Selection Pop-up Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {availabilityModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#0E1B35]/80 backdrop-blur-md" 
                onClick={() => setAvailabilityModalOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl sm:rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.35)] border border-[#DAA520]/30 overflow-hidden text-left my-auto"
              >
                
                {/* Modal Header */}
                <div className="bg-[#1B3564] text-white px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#DAA520]/20 border border-[#DAA520]/40 flex items-center justify-center text-[#DAA520] shrink-0">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-cormorant font-bold text-xl sm:text-2xl text-[#DAA520] tracking-wide">
                          Select Your Luxury Sanctuary
                        </h3>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Live Available
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap font-sans">
                        <span>
                          {checkIn && checkOut ? (
                            <>
                              📅 <strong className="text-white">{format(checkIn, "dd MMM")} - {format(checkOut, "dd MMM yyyy")}</strong> ({computedNights} {computedNights === 1 ? "Night" : "Nights"})
                            </>
                          ) : (
                            "Flexible Dates"
                          )}
                        </span>
                        <span>•</span>
                        <span>👥 <strong className="text-white">{guests} Guests</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setAvailabilityModalOpen(false);
                        setIsCalendarOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#DAA520] hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-white/15 hidden sm:inline-block"
                    >
                      Change Dates
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvailabilityModalOpen(false)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Location Filter Pills Bar */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#1B3564]/60 uppercase tracking-widest hidden sm:inline">
                      Filter Location:
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalLocationFilter("ALL")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        modalLocationFilter === "ALL"
                          ? "bg-[#1B3564] text-white shadow-sm font-black"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-[#1B3564]"
                      }`}
                    >
                      All ({availableVillasList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalLocationFilter("Lonavala")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                        modalLocationFilter === "Lonavala"
                          ? "bg-[#1B3564] text-white shadow-sm font-black"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-[#1B3564]"
                      }`}
                    >
                      <MapPin size={10} className="text-[#DAA520]" />
                      Lonavala
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalLocationFilter("Khopoli")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                        modalLocationFilter === "Khopoli"
                          ? "bg-[#1B3564] text-white shadow-sm font-black"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-[#1B3564]"
                      }`}
                    >
                      <MapPin size={10} className="text-[#DAA520]" />
                      Khopoli
                    </button>
                  </div>

                  <span className="text-[10px] text-emerald-600 font-bold hidden md:flex items-center gap-1">
                    <CheckCircle2 size={12} /> Best Rate Guarantee
                  </span>
                </div>

                {/* Modal Body: Property Cards */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  {filteredModalVillas.length > 0 ? (
                    <div className="space-y-4">
                      {filteredModalVillas.map((villa) => {
                        const cityName = villa.location.split(",")[0].trim();
                        const isTheAngleHouse = villa.slug === "the-angle-house";
                        const isCanopyCrest = villa.slug === "canopy-crest";

                        return (
                          <div 
                            key={villa.id} 
                            className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#DAA520]/60 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5 items-start md:items-center group"
                          >
                            {/* Property Single High-Res Image */}
                            <div className="relative w-full md:w-60 h-44 md:h-36 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner">
                              <Image
                                src={villa.image || "/images/hero-villa.webp"}
                                alt={villa.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {/* Overlay Pill / Tag */}
                              <div className="absolute top-2.5 left-2.5 bg-[#0E1B35]/85 backdrop-blur-md text-[#DAA520] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20">
                                {isTheAngleHouse ? "Architectural Icon" : isCanopyCrest ? "Sprawling Estate" : (villa.category || "Luxury Stay")}
                              </div>
                            </div>

                            {/* Property Details & Specs */}
                            <div className="flex-1 min-w-0 w-full text-left flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                                  <h4 className="font-cormorant font-bold text-xl text-[#1B3564] group-hover:text-blue-600 transition-colors">
                                    {villa.name}
                                  </h4>
                                  
                                  {/* Small Location Button / Pill Badge */}
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#1B3564]/5 text-[#1B3564] border border-[#1B3564]/15 shadow-2xs">
                                    <MapPin size={10} className="text-[#DAA520]" />
                                    <span>{cityName}</span>
                                  </span>
                                </div>

                                {/* Specs Row with Icons & Badges */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 mb-3.5">
                                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-semibold text-slate-800">
                                    <Bed size={13} className="text-[#DAA520]" />
                                    <span>{villa.bedrooms} Bedrooms</span>
                                  </span>
                                  
                                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-semibold text-slate-800">
                                    <Users size={13} className="text-[#DAA520]" />
                                    <span>Up to {villa.guests} Guests</span>
                                  </span>

                                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-semibold text-slate-800">
                                    <Waves size={13} className="text-[#5CADE2]" />
                                    <span>Private Pool</span>
                                  </span>

                                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-semibold text-slate-800">
                                    <UtensilsCrossed size={13} className="text-[#4A5D23]" />
                                    <span>Chef On Request</span>
                                  </span>
                                </div>
                              </div>

                              {/* Price and Action Buttons */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3 flex-wrap">
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">Base Rate</span>
                                  <span className="text-base font-black text-slate-900">
                                    ₹{villa.price?.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">/ night</span>
                                  </span>
                                  <span className="text-[8px] text-amber-800/80 font-medium italic block mt-0.5">
                                    *Prices may vary due to demand
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Direct WhatsApp button for this specific property */}
                                  <button
                                    type="button"
                                    onClick={(e) => handleWhatsAppInquiry(e, villa.name)}
                                    className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                                    title="Inquire on WhatsApp"
                                  >
                                    <MessageCircle size={14} className="text-emerald-600" />
                                    <span className="hidden sm:inline">WhatsApp</span>
                                  </button>

                                  {/* Explore & Book Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAvailabilityModalOpen(false);
                                      router.push(`/villa/${villa.slug}`);
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer border-none"
                                  >
                                    <span>Book Sanctuary</span>
                                    <ArrowRight size={13} className="stroke-[2.5]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-4 bg-amber-50/50 rounded-3xl border border-amber-200/60">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mx-auto">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-950 text-base">No Properties Found Matching Criteria</h4>
                        <p className="text-xs text-amber-800 mt-1 max-w-sm mx-auto leading-relaxed">
                          All properties in this location might be booked for these dates or exceed guest capacity. Try adjusting your dates or inquire directly with our concierge on WhatsApp.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setModalLocationFilter("ALL")}
                          className="px-4 py-2 bg-[#1B3564] text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-sm"
                        >
                          View All Sanctuaries
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleWhatsAppInquiry(e)}
                    className="flex-1 sm:flex-initial px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer border-none shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle size={14} />
                    <span>Chat with Concierge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvailabilityModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border-none transition-colors"
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

