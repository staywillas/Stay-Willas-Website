"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
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

import "swiper/css";
import "swiper/css/navigation";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000",
    tag: "BEACHSIDE STAYS",
    title: "Memories made",
    titleItalic: "by the sea",
    desc: "From sun-kissed days to cozy nights,\nfind your perfect seaside hideaway."
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    tag: "Our Handpicked Stays",
    title: "Your Perfect",
    titleItalic: "Getaway",
    desc: "From sun-kissed days to cozy nights,\nexperience the best of beachside living in our private estates."
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
    tag: "Infinity Pools & Modern Design",
    title: "The Iconic",
    titleItalic: "Angled House",
    desc: "Where modern architecture meets slow luxury —\nour stunning designer villa in Lonavala, crafted for unforgettable escapes."
  }
];

const Hero = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
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
    const params = new URLSearchParams();
    if (destination) params.set("region", destination.toLowerCase());
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    if (guests) params.set("guests", guests);
    router.push(`/villas?${params.toString()}`);
  };

  return (
    <section className="relative h-auto lg:h-screen w-full lg:overflow-hidden bg-[#F5F2EA]">
      {/* Swiper & Controls Container */}
      <div className="relative h-[65vh] lg:h-full w-full overflow-hidden">
        <Swiper
        modules={[Autoplay, Navigation]}
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;
          return (
            <SwiperSlide key={index} className="relative h-full w-full">
              {/* Ken Burns background */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  quality={75}
                  className="object-cover animate-ken-burns"
                />
                {/* Premium soft cream vignetted overlay (bottom-up on mobile, left-to-right on desktop) */}
                <div className="absolute inset-0 md:inset-y-0 md:left-0 w-full md:w-[60%] lg:w-[55%] bg-gradient-to-t from-[#F5F2EA]/98 via-[#F5F2EA]/92 to-[#F5F2EA]/75 md:bg-gradient-to-r md:from-[#F5F2EA] md:via-[#F5F2EA]/95 md:to-transparent z-10" />
              </div>

              {/* Slide content */}
              <div className="relative z-20 h-full flex flex-col justify-center pt-16 pb-12 lg:pb-36 px-6 md:px-12 lg:px-24">
                <div className="max-w-2xl">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="flex flex-col items-start"
                    >
                      {/* Tag — Premium White Badge */}
                      <span className="inline-flex items-center gap-1.5 bg-white/95 border border-slate-200/50 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-5 py-2.5 rounded-full shadow-sm w-fit">
                        <span className="text-[#DAA520] text-xs">★</span> {slide.tag}
                      </span>
                      
                      {/* Main Heading - Refined Serif Typography */}
                      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading text-[#1B3564] leading-[1.1] mb-6 font-normal tracking-wide drop-shadow-[0_2px_4px_rgba(27,53,100,0.08)]">
                        {slide.title} <br /> 
                        <span className="relative inline-block pb-1">
                          <span className="italic text-[#DAA520] font-heading font-semibold md:font-light tracking-wide">{slide.titleItalic}</span>
                          {/* Beautiful gold horizontal line accent directly under the first half of the text (like "by the") */}
                          <span className="absolute left-0 bottom-0 w-[45%] h-[3px] bg-[#DAA520] rounded-full" />
                        </span>
                      </h1>
                      
                      {/* Subtitle - Refined dark navy on mobile, slate on desktop */}
                      <p className="text-[15px] sm:text-base text-[#1B3564] md:text-slate-600/90 font-extrabold md:font-normal max-w-md mb-8 leading-relaxed whitespace-pre-line">
                        {slide.desc}
                      </p>

                      {/* CTA Section - Aligned with screenshot 3 */}
                      <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 w-full sm:w-auto mt-2">
                        <Link 
                          href="/villas" 
                          className="group bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 hover:-translate-y-0.5 text-center justify-center"
                        >
                          EXPLORE VILLAS
                          <ChevronRight className="transition-transform group-hover:translate-x-1 stroke-[3]" size={13} />
                        </Link>
                        <Link 
                          href="/contact" 
                          className="group flex items-center justify-center sm:justify-start gap-1.5 text-[#1B3564] font-bold tracking-widest uppercase text-xs transition-all duration-300 border-b-2 border-[#FFB800] pb-1 hover:border-[#FFB800]/70 w-fit mx-auto sm:mx-0"
                        >
                          TALK TO CONCIERGE
                          <ChevronRight size={13} className="text-[#FFB800] transition-transform group-hover:translate-x-0.5 stroke-[3]" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>

    {/* Floating Side Arrow Buttons - Premium Navy */}
    <button className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[#1B3564]/20 hidden md:flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564]/5 hover:border-[#1B3564]/50 backdrop-blur-md transition-all cursor-pointer group shadow-sm">
      <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
    </button>
    <button className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[#1B3564]/20 hidden md:flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564]/5 hover:border-[#1B3564]/50 backdrop-blur-md transition-all cursor-pointer group shadow-sm">
      <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
    </button>
  </div>

    {/* Booking Form Capsule & Highlights Row */}
    <div className="relative lg:absolute lg:bottom-6 lg:left-16 lg:right-16 z-30 mx-auto max-w-6xl w-full px-4 lg:px-0 py-6 lg:py-0 bg-[#F5F2EA] lg:bg-transparent">
      <form onSubmit={handleSearch} className="bg-white border border-slate-100 rounded-[1.8rem] md:rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.08)] p-5 md:p-4 lg:pl-10 lg:pr-3 lg:py-3 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 w-full lg:w-[80%] items-center">
            {/* WHERE TO? */}
            <div className="col-span-2 lg:col-span-1 flex items-center justify-between w-full pb-3 border-b border-slate-100 lg:border-none lg:pb-0 lg:px-4 lg:border-r lg:border-slate-200/60">
              <div className="flex flex-col gap-1 w-full text-left">
                <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest">WHERE TO?</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-lg font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-4"
                >
                  <option value="Lonavala">Lonavala</option>
                </select>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B3564]/5 flex items-center justify-center text-[#1B3564] shrink-0 lg:hidden">
                <MapPin size={14} className="stroke-[2.5]" />
              </div>
            </div>

            {/* CHECK-IN & CHECK-OUT */}
            <div className="col-span-2 lg:col-span-2 grid grid-cols-2 gap-0 pb-3 border-b border-slate-100 lg:border-none lg:pb-0">
              {/* CHECK-IN */}
              <div 
                onClick={() => setIsCalendarOpen(true)}
                className="flex flex-col gap-1 px-4 cursor-pointer select-none group border-r border-slate-200/60 text-left"
              >
                <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1.5">
                  <CalendarIcon size={10} className="text-[#1B3564]/40 group-hover:text-[#E2A63B] transition-colors" />
                  CHECK-IN
                </label>
                <div className="text-base font-bold text-[#1B3564] h-5 flex items-center">
                  {checkIn ? format(checkIn, "MMM dd") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
                </div>
              </div>

              {/* CHECK-OUT */}
              <div 
                onClick={() => setIsCalendarOpen(true)}
                className="flex flex-col gap-1 px-4 cursor-pointer select-none group text-left"
              >
                <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest group-hover:text-[#E2A63B] transition-colors flex items-center gap-1.5">
                  <CalendarIcon size={10} className="text-[#1B3564]/40 group-hover:text-[#E2A63B] transition-colors" />
                  CHECK-OUT
                </label>
                <div className="text-base font-bold text-[#1B3564] h-5 flex items-center">
                  {checkOut ? format(checkOut, "MMM dd") : <span className="text-[#1B3564]/40 font-normal">Add dates</span>}
                </div>
              </div>
            </div>

            {/* GUESTS */}
            <div className="col-span-2 lg:col-span-1 flex items-center justify-between w-full pt-1 lg:pt-0 lg:px-4">
              <div className="flex flex-col gap-1 w-full text-left">
                <label className="text-[9px] font-extrabold text-[#1B3564]/50 uppercase tracking-widest">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-lg font-bold text-[#1B3564] outline-none cursor-pointer border-none p-0 focus:ring-0 w-full appearance-none pr-4"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Guests</option>
                </select>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1B3564]/5 flex items-center justify-center text-[#1B3564] shrink-0 lg:hidden">
                <ChevronDown size={14} className="stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Premium Gold CTA button */}
          <button
            type="submit"
            className="w-full lg:w-auto bg-[#E2A63B] hover:bg-[#d0952d] text-[#1B3564] font-black text-xs tracking-widest uppercase rounded-full pl-10 pr-4 py-3 shadow-lg shadow-yellow-500/10 hover:shadow-xl transition-all duration-300 cursor-pointer border-none flex items-center justify-between gap-6 shrink-0"
          >
            <span>CHECK AVAILABILITY</span>
            <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center shrink-0">
              <ArrowRight size={16} className="stroke-[2.5]" />
            </div>
          </button>

          {/* Custom Premium React Calendar Popover */}
          <AnimatePresence>
            {isCalendarOpen && (
              <>
                {/* Backdrop overlay: dark blurred on mobile, transparent on desktop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                  onClick={() => setIsCalendarOpen(false)}
                />
                
                <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:absolute md:top-auto md:bottom-full md:left-[20%] md:translate-y-0 md:mb-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] bg-[#F5F2EA] border border-[#1B3564]/10 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.18)] p-6 backdrop-blur-md">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))}
                      className="w-8 h-8 rounded-full border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564]/5 transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-[#1B3564] font-heading font-bold text-sm md:text-base tracking-wide select-none">
                      {format(calendarViewMonth, "MMMM yyyy")}
                    </span>

                    <button
                      type="button"
                      onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))}
                      className="w-8 h-8 rounded-full border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564]/5 transition-colors cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Weekdays Row */}
                  <div className="grid grid-cols-7 text-center mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-extrabold text-[#FFB800] uppercase tracking-widest select-none"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                    {/* Padding blank spaces */}
                    {Array.from({ length: getDay(startOfMonth(calendarViewMonth)) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    
                    {/* Actual Days */}
                    {eachDayOfInterval({
                      start: startOfMonth(calendarViewMonth),
                      end: endOfMonth(calendarViewMonth)
                    }).map((day) => {
                      const isPast = isBefore(day, startOfDay(new Date()));
                      const isBooked = isDateFullyBooked(day);
                      const isSelectedCheckIn = checkIn && isSameDay(day, checkIn);
                      const isSelectedCheckOut = checkOut && isSameDay(day, checkOut);
                      const isInRange = checkIn && checkOut && isAfter(day, checkIn) && isBefore(day, checkOut);
                      
                      const isDisabled = isPast || isBooked;

                      return (
                        <button
                          key={day.toString()}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateSelect(day)}
                          className={`
                            w-8 h-8 md:w-9 md:h-9 rounded-full text-xs font-bold flex flex-col items-center justify-center transition-all relative
                            ${isDisabled ? 'text-slate-400/40 line-through cursor-not-allowed pointer-events-none' : ''}
                            ${isBooked ? 'bg-[#FFB800]/5' : ''}
                            ${isSelectedCheckIn || isSelectedCheckOut 
                              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20 scale-105 z-10 hover:bg-[#1D4ED8]' 
                              : ''}
                            ${isInRange 
                              ? 'bg-[#2563EB]/10 text-[#2563EB]' 
                              : ''}
                            ${!isDisabled && !isSelectedCheckIn && !isSelectedCheckOut && !isInRange 
                              ? 'text-[#1B3564] hover:bg-[#1B3564]/10 cursor-pointer' 
                              : ''}
                          `}
                        >
                          <span>{format(day, "d")}</span>
                          {/* Booked dot */}
                          {isBooked && !isPast && (
                            <span className="w-1 h-1 rounded-full bg-[#FFB800] mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Gold Separator */}
                  <div className="h-px bg-[#FFB800]/20 my-4" />

                  {/* Legend & Buttons */}
                  <div className="flex flex-col gap-3">
                    {/* Legend */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold select-none px-1">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                        <span>Fully Booked</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300 line-through" />
                        <span>Unavailable</span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1B3564]/5">
                      <button
                        type="button"
                        onClick={() => {
                          setCheckIn(null);
                          setCheckOut(null);
                        }}
                        className="text-xs text-[#1B3564]/70 hover:text-[#1B3564] underline font-extrabold tracking-wider transition-colors cursor-pointer"
                      >
                        CLEAR DATES
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(false)}
                        className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full text-xs font-black tracking-widest transition-all shadow-md shadow-blue-500/10 cursor-pointer hover:shadow-lg"
                      >
                        DONE
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>
        </form>

        {/* Mobile Premium Translucent Highlights Capsule Card */}
        <div className="lg:hidden bg-white/85 backdrop-blur-md border border-white/60 rounded-[1.8rem] px-5 py-4 flex justify-between items-center w-full mt-4 shadow-[0_10px_30px_rgba(44,31,14,0.08)]">
          {/* Handpicked Villas */}
          <div className="flex flex-col items-center text-center flex-1">
            <Award size={18} className="text-[#A27B5C] mb-1.5" />
            <span className="text-[7.5px] font-black text-[#1B3564] tracking-[0.12em] uppercase leading-tight">
              Handpicked<br />Villas
            </span>
          </div>
          
          <div className="w-px h-8 bg-slate-200/80" />
          
          {/* Safe & Secure */}
          <div className="flex flex-col items-center text-center flex-1">
            <ShieldCheck size={18} className="text-[#A27B5C] mb-1.5" />
            <span className="text-[7.5px] font-black text-[#1B3564] tracking-[0.12em] uppercase leading-tight">
              Safe & Secure<br />Stays
            </span>
          </div>
          
          <div className="w-px h-8 bg-slate-200/80" />
          
          {/* 24/7 Support */}
          <div className="flex flex-col items-center text-center flex-1">
            <Headset size={18} className="text-[#A27B5C] mb-1.5" />
            <span className="text-[7.5px] font-black text-[#1B3564] tracking-[0.12em] uppercase leading-tight">
              24/7 Guest<br />Support
            </span>
          </div>
        </div>

        {/* Highlights Row below the capsule - Desktop Only */}
        <div className="hidden lg:flex flex-wrap justify-center sm:justify-between items-center gap-4 w-full mt-4 px-6 md:px-10">
          <span className="text-white font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
            <Shield size={14} className="text-[#FFB800]" />
            Best Price Guarantee
          </span>
          <span className="text-white font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
            <CheckCircle size={14} className="text-[#FFB800]" />
            Flexible Cancellation
          </span>
          <span className="text-white font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
            <Heart size={14} className="text-[#FFB800]" />
            Trusted by Guests
          </span>
          <span className="text-white font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 drop-shadow-md">
            <BellRing size={14} className="text-[#FFB800]" />
            24/7 Concierge
          </span>
      </div>
    </div>
  </section>
  );
};

export default Hero;
