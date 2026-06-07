"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Swiper imports removed for static hero section
import { 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  CheckCircle, 
  Heart, 
  BellRing,
  Calendar as CalendarIcon,
  MapPin,
  ChevronDown,
  ArrowRight,
  Award,
  ShieldCheck,
  Headset
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
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
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

  const { scrollYProgress } = useScroll();
  const yPos1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yPos2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section className="relative min-h-screen w-full bg-[#F5F2EA] overflow-hidden pt-24 lg:pt-0 pb-12 lg:pb-0 flex items-center bg-[url('/assets/noise.png')] bg-blend-overlay">
      
      {/* Decorative Background Elements (Optimized for Performance) */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(226,166,59,0.15)_0,rgba(226,166,59,0)_50%)] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(27,53,100,0.12)_0,rgba(27,53,100,0)_50%)] pointer-events-none transform-gpu" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-y-0 lg:gap-x-12 z-10 relative items-center">
        
        {/* Text & Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full lg:col-span-5 flex flex-col z-20 order-1 lg:self-end lg:pb-8"
        >
          {/* Tag */}
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm w-fit"
          >
            <span className="text-[#DAA520] text-xs">★</span> Premium Luxury
          </motion.span>
          
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-heading text-[#1B3564] leading-[1.1] mb-6 font-normal tracking-tight"
          >
            The Iconic <br className="hidden sm:inline" />
            <span className="relative inline-block pb-2 mt-2">
              <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent drop-shadow-sm">Angle House & <br />Canopy Crest</span>
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[13px] md:text-base text-slate-600/90 font-medium max-w-md mb-10 leading-relaxed"
          >
            Where modern architecture meets slow luxury. Handpicked designer villas offering unforgettable private escapes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-row items-center gap-4 w-full sm:w-auto mb-12"
          >
            <Link 
              href="/villas" 
              className="w-fit group bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300"
            >
              <span>Explore Villas</span>
              <ChevronRight className="transition-transform group-hover:translate-x-1 stroke-[3]" size={14} />
            </Link>
            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I'm browsing your stunning website and would love to connect with your concierge.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex group bg-white border border-[#1B3564]/10 hover:border-[#1B3564]/30 text-[#1B3564] font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase items-center justify-center gap-2 transition-all duration-300 shadow-sm"
            >
              <span>Concierge</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Booking Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="w-full relative lg:col-span-5 order-3 lg:order-none z-30 lg:self-start lg:pt-4"
        >
            <form onSubmit={handleSearch} className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.08)] p-5 md:p-6 flex flex-col gap-4 relative z-30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-4">
                
                {/* WHERE TO? */}
                <div className="flex flex-col gap-1 w-full text-left pr-4 md:border-r border-slate-100">
                  <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest">WHERE TO?</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent text-base font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-4"
                  >
                    <option value="Lonavala">Lonavala</option>
                    <option value="Alibaug">Alibaug</option>
                    <option value="Karjat">Karjat</option>
                    <option value="Khopoli">Khopoli</option>
                  </select>
                </div>

                {/* CHECK-IN */}
                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none group text-left px-4 md:border-r border-slate-100"
                >
                  <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors">
                    CHECK-IN
                  </label>
                  <div className="text-base font-bold text-[#1B3564] h-6 flex items-center">
                    {checkIn ? format(checkIn, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
                  </div>
                </div>

                {/* CHECK-OUT */}
                <div 
                  onClick={() => setIsCalendarOpen(true)}
                  className="flex flex-col gap-1 cursor-pointer select-none group text-left pl-4"
                >
                  <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors">
                    CHECK-OUT
                  </label>
                  <div className="text-base font-bold text-[#1B3564] h-6 flex items-center">
                    {checkOut ? format(checkOut, "MMM dd, yyyy") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* GUESTS */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest">GUESTS</label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button type="button" onClick={() => { const c = parseInt(guests)||1; if(c>1) setGuests(String(c-1)); }} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200">-</button>
                    <span className="text-base font-bold text-[#1B3564] min-w-[20px] text-center">{guests}</span>
                    <button type="button" onClick={() => { const c = parseInt(guests)||1; setGuests(String(c+1)); }} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200">+</button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-[10px] tracking-widest uppercase rounded-full px-6 py-3 shadow-lg shadow-yellow-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer border-none flex items-center gap-2 shrink-0"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Calendar Popover */}
              <AnimatePresence>
                {isCalendarOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-black/40 md:bg-transparent" onClick={() => setIsCalendarOpen(false)} />
                    <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:absolute md:top-full md:left-0 md:translate-y-0 md:mt-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.15)] p-6">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button type="button" onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronLeft size={16} /></button>
                        <span className="text-[#1B3564] font-bold text-sm tracking-wide">{format(calendarViewMonth, "MMMM yyyy")}</span>
                        <button type="button" onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50"><ChevronRight size={16} /></button>
                      </div>
                      
                      {/* Weekdays */}
                      <div className="grid grid-cols-7 text-center mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                          <span key={idx} className="text-[10px] font-extrabold text-[#E2A63B] uppercase tracking-widest">{day}</span>
                        ))}
                      </div>

                      {/* Days */}
                      <div className="grid grid-cols-7 gap-1">
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
                              className={`w-9 h-9 rounded-full text-xs font-bold flex flex-col items-center justify-center transition-all
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

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-xs text-slate-500 hover:text-slate-800 font-bold tracking-wider">CLEAR</button>
                        <button type="button" onClick={() => setIsCalendarOpen(false)} className="px-5 py-2 bg-[#1B3564] text-white rounded-full text-xs font-bold tracking-widest shadow-md">DONE</button>
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </form>
        </motion.div>

        {/* Right Column: Magazine Collage */}
        <div className="w-full lg:col-span-7 relative min-h-[450px] h-[55vh] md:h-[60vh] lg:min-h-0 lg:h-[85vh] lg:row-span-2 order-2 lg:order-none mt-4 lg:mt-0">
          
          {/* Angle House Image - Main Back Image */}
          <Link href="/villa/the-angle-house" className="contents">
            <motion.div 
              style={{ y: yPos1 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-[2%] left-0 w-[85%] sm:w-[75%] h-[55%] lg:h-[65%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white/80 z-10 group cursor-pointer"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-11.webp"
                alt="The Angle House"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3564]/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="bg-white/95 backdrop-blur-md text-[#1B3564] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 inline-block shadow-lg">Lonavala</span>
                <h3 className="text-white text-3xl font-heading font-normal drop-shadow-lg flex items-center justify-between">
                  The Angle House
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Canopy Crest Image - Front Offset Image */}
          <Link href="/villa/canopy-crest" className="contents">
            <motion.div 
              style={{ y: yPos2 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute bottom-[2%] right-0 w-[75%] sm:w-[65%] h-[55%] lg:h-[55%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-4 border-white/80 z-20 group cursor-pointer"
            >
              <Image
                src="/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg"
                alt="Canopy Crest"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3564]/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="bg-[#E2A63B]/95 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 inline-block shadow-lg">Khopoli</span>
                <h3 className="text-white text-2xl font-heading font-normal drop-shadow-lg flex items-center justify-between">
                  Canopy Crest
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Floating Highlight Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 100 }}
            className="absolute bottom-[10%] left-[5%] lg:left-[10%] z-30 bg-white/95 backdrop-blur-md rounded-full px-5 py-3 shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#1B3564]/5 flex items-center justify-center">
              <Award className="text-[#DAA520]" size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[#1B3564] font-black text-[10px] uppercase tracking-widest leading-none mb-1">Premium</span>
              <span className="text-slate-500 text-[9px] font-medium leading-none">Curated Escapes</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
