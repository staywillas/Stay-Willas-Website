"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Users,
  Bed,
  Waves,
  Star,
  MapPin,
  Search,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EstateSlide {
  id: string;
  slug: string;
  boldTitle: string;
  thinSubtitle: string;
  category: string;
  location: string;
  tag: string;
  price: string;
  priceNote: string;
  weekdayRate: string;
  weekendRate: string;
  capacityText: string;
  bedroomsText: string;
  image: string;
  rating: string;
  features: string[];
}

const ESTATES: EstateSlide[] = [
  {
    id: "angle-house",
    slug: "the-angle-house",
    boldTitle: "Angle House",
    thinSubtitle: "luxury glass villa",
    category: "3 BHK Designer Architectural Pavilion",
    location: "Kurwande, Lonavala",
    tag: "Architectural Icon",
    price: "₹13,000",
    priceNote: "Starting from / night",
    weekdayRate: "₹13,000",
    weekendRate: "₹20,000",
    capacityText: "12 Guests",
    bedroomsText: "3 Master Beds",
    image: "/images/angle-house-hero-clean.webp",
    rating: "4.98",
    features: ["Private Waterfall Pool", "Master Jacuzzi Bath", "Dedicated Chef (Veg & Jain)"],
  },
  {
    id: "willow-peak",
    slug: "willow-peak",
    boldTitle: "Willow Peak",
    thinSubtitle: "chalet villa",
    category: "3 Private A-Frame Wooden Cottages",
    location: "Kurwande, Lonavala",
    tag: "Valley Retreat",
    price: "₹4,999",
    priceNote: "Per cottage / night (Estate: ₹17,997)",
    weekdayRate: "₹4,999 (Cottage) / ₹17,997 (Full)",
    weekendRate: "₹6,999 (Cottage) / ₹23,997 (Full)",
    capacityText: "Up to 12 Guests",
    bedroomsText: "3 A-Frame Chalets",
    image: "/images/destinations/WILLOW PEAK FINAL.jpg",
    rating: "4.95",
    features: ["Jacuzzi in Each Cottage", "Outdoor BBQ & Dining", "Sahyadri Panorama"],
  },
  {
    id: "canopy-crest",
    slug: "canopy-crest",
    boldTitle: "Canopy Crest",
    thinSubtitle: "hilltop estate",
    category: "4 BHK Multi-Acre Horizon Villa",
    location: "Khopoli, Maharashtra",
    tag: "Hilltop Seclusion",
    price: "₹15,000",
    priceNote: "Starting from / night",
    weekdayRate: "₹15,000",
    weekendRate: "₹22,000",
    capacityText: "16 Guests",
    bedroomsText: "4 Luxury Beds",
    image: "/images/destinations/canopy-crest-clean.jpg",
    rating: "4.97",
    features: ["Private Swimming Pool", "Sprawling Verdant Lawns", "Senior Citizen Friendly"],
  },
];

export default function HeroConcept1() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPriceTooltip, setShowPriceTooltip] = useState(false);
  
  // Top Booking Panel State
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(4);

  // Auto-advance slides every 6.5s if not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ESTATES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % ESTATES.length);
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + ESTATES.length) % ESTATES.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const current = ESTATES[activeIndex];

  const handleBookingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let url = `/villa/${current.slug}?guests=${guestCount}`;
    if (checkInDate) url += `&checkIn=${checkInDate}`;
    if (checkOutDate) url += `&checkOut=${checkOutDate}`;
    router.push(url);
  };

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setShowPriceTooltip(false); }}
      className="relative w-full min-h-[580px] lg:h-[85vh] lg:max-h-[760px] flex flex-col justify-between overflow-hidden bg-[#060C08] text-white select-none pt-20 sm:pt-24 lg:pt-26 pb-3 sm:pb-4"
    >
      {/* 1. Fullscreen Photographic Carousel Layer */}
      <div className="absolute inset-0 z-0 bg-[#060C08]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={current.image}
              alt={current.boldTitle}
              fill
              priority
              unoptimized
              className="object-cover object-center filter brightness-[0.80] contrast-[1.08]"
            />
            {/* Multi-layered cinematic vignettes for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060C08]/90 via-[#060C08]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060C08] via-transparent to-[#060C08]/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#060C08]/30 to-[#030604]/90" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. TOP BOOKING PANEL & EYEBROW BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Eyebrow & Slide Counter */}
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#DAA520] font-bold px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#DAA520]/35 shadow-sm">
              ✦ {current.tag}
            </span>
            <span className="text-xs text-white/75 tracking-wider uppercase font-medium truncate">
              {current.location}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-white/60 font-mono pl-2">
              <span className="text-white font-bold">0{activeIndex + 1}</span>
              <span className="text-[#DAA520]">/</span>
              <span>0{ESTATES.length}</span>
            </div>
          </div>

          {/* TOP FLOATING GLASS BOOKING PANEL (Immediately accessible on desktop & mobile) */}
          <form 
            onSubmit={handleBookingSearch}
            className="flex flex-wrap items-center gap-2 bg-[#09150D]/85 backdrop-blur-2xl border border-[#DAA520]/35 px-3 py-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          >
            {/* Property Selector */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
              <MapPin size={13} className="text-[#DAA520] shrink-0" />
              <select
                value={current.slug}
                onChange={(e) => {
                  const idx = ESTATES.findIndex(s => s.slug === e.target.value);
                  if (idx !== -1) setActiveIndex(idx);
                }}
                aria-label="Select Villa"
                className="bg-transparent text-white font-semibold text-xs border-none p-0 focus:outline-none cursor-pointer pr-1"
              >
                {ESTATES.map((e) => (
                  <option key={e.slug} value={e.slug} className="bg-[#09150D] text-white">
                    {e.boldTitle} ({e.location.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Check-In */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
              <CalendarIcon size={13} className="text-[#86EFAC] shrink-0" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                placeholder="Check In"
                aria-label="Check In"
                className="bg-transparent text-[11px] font-semibold text-white border-none p-0 focus:outline-none cursor-pointer [color-scheme:dark] w-24"
              />
            </div>

            {/* Check-Out */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
              <CalendarIcon size={13} className="text-[#86EFAC] shrink-0" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                placeholder="Check Out"
                aria-label="Check Out"
                className="bg-transparent text-[11px] font-semibold text-white border-none p-0 focus:outline-none cursor-pointer [color-scheme:dark] w-24"
              />
            </div>

            {/* Guests Counter */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs">
              <Users size={13} className="text-[#DAA520] shrink-0" />
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                aria-label="Guests"
                className="bg-transparent text-white font-semibold text-xs border-none p-0 focus:outline-none cursor-pointer pr-1"
              >
                {[2, 4, 6, 8, 10, 12, 16].map((num) => (
                  <option key={num} value={num} className="bg-[#09150D] text-white">
                    {num} Guests
                  </option>
                ))}
              </select>
            </div>

            {/* Book / Reserve Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#F3CD68] via-[#DAA520] to-[#B38209] hover:from-[#FFE082] hover:to-[#C9930D] text-[#0A110D] font-bold text-xs tracking-wider uppercase px-4 py-1.5 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-1 shrink-0 ml-auto"
            >
              <span>Check Tariff</span>
              <ArrowRight size={13} />
            </button>
          </form>

        </div>
      </div>

      {/* 3. Main Hero Core (Editorial Bold + Thin Typography & Floating Price Tag) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 my-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pt-3 pb-3">
        
        {/* Left Side: Massive Typography & Capacity Badges */}
        <div className="max-w-2xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {/* Bold Title + Ultra-Thin Contrast Title (Reduced Height on Desktop, Responsive on Mobile) */}
              <h1 className="leading-[0.92] tracking-tight mb-2 sm:mb-3">
                <span className="block font-heading font-black text-4xl xs:text-5xl sm:text-6xl lg:text-[76px] text-white uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                  {current.boldTitle}
                </span>
                <span className="block font-cormorant italic font-light text-3xl xs:text-4xl sm:text-5xl lg:text-[60px] text-[#86EFAC] -mt-1 sm:-mt-2 tracking-wide drop-shadow-md">
                  {current.thinSubtitle}
                </span>
              </h1>

              {/* Sub-label Category & Location */}
              <p className="text-xs sm:text-sm text-white/90 font-light tracking-wide mb-2 flex items-center gap-1.5">
                <span>{current.category}</span>
                <span className="text-[#DAA520]">•</span>
                <strong className="text-white font-medium">{current.location}</strong>
              </p>

              {/* Verified Capacity Chips */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] text-white/90">
                  <Users size={11} className="text-[#DAA520]" />
                  <span>{current.capacityText}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] text-white/90">
                  <Bed size={11} className="text-[#86EFAC]" />
                  <span>{current.bedroomsText}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] text-white/90">
                  <Waves size={11} className="text-[#86EFAC]" />
                  <span>Private Pool</span>
                </div>
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center space-x-2 text-xs text-white/80">
                <div className="flex items-center space-x-0.5 text-[#DAA520]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#DAA520]" />
                  ))}
                  <span className="text-white text-xs font-bold ml-1">{current.rating}</span>
                </div>
                <span className="text-white/30">•</span>
                <span className="text-stone-300 font-light text-[11px]">100% Verified Private Estate</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Book Now CTA & Floating Actual Rate Tag */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3">
          
          {/* Floating Actual Price Tag */}
          <div className="relative">
            <div 
              onMouseEnter={() => setShowPriceTooltip(true)}
              onClick={() => setShowPriceTooltip(!showPriceTooltip)}
              className="flex items-baseline space-x-2.5 bg-[#08120B]/85 backdrop-blur-2xl border border-[#DAA520]/40 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.7)] cursor-pointer hover:border-[#DAA520] transition-colors"
            >
              <div className="text-left lg:text-right">
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white tracking-tight">
                    {current.price}
                  </span>
                  <span className="text-[11px] text-[#DAA520] font-bold">INR</span>
                </div>
                <div className="text-[9px] uppercase tracking-wider text-white/70 font-medium">
                  {current.priceNote}
                </div>
              </div>

              <div className="w-5 h-5 rounded-full bg-[#DAA520]/20 border border-[#DAA520] flex items-center justify-center text-[#DAA520] shrink-0">
                <Info size={11} />
              </div>
            </div>

            {/* Price Breakdown Tooltip */}
            {showPriceTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-2xl bg-[#09150D]/95 backdrop-blur-2xl border border-[#DAA520]/50 shadow-2xl text-left z-30">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#DAA520] mb-1.5 border-b border-white/10 pb-1">
                  Actual Tariff Schedule
                </div>
                <div className="text-xs space-y-1 text-stone-200">
                  <div className="flex justify-between">
                    <span>Weekday Rate:</span>
                    <strong className="text-white">{current.weekdayRate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend (Fri-Sat):</span>
                    <strong className="text-amber-300">{current.weekendRate}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct "Book Now" Button Link */}
          <Link
            href={`/villa/${current.slug}`}
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-[#F3CD68] via-[#DAA520] to-[#B38209] hover:from-[#FFE082] hover:to-[#C9930D] text-[#0A110D] font-bold text-xs sm:text-sm tracking-wider uppercase px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-[0_10px_25px_rgba(218,165,32,0.35)] hover:shadow-[0_14px_30px_rgba(218,165,32,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Explore Villa</span>
            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </div>

      {/* 4. Bottom Bar: Slide Switcher Tabs */}
      <div className="relative z-20 w-full border-t border-white/10 bg-black/60 backdrop-blur-2xl py-2.5 sm:py-3 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Slide Indicator Label */}
          <div className="text-white/60 uppercase text-[10px] tracking-widest hidden xs:inline">
            Private Estates:
          </div>

          {/* Property Slide Switcher Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-0.5">
            {ESTATES.map((estate, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={estate.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "text-[11px] sm:text-xs tracking-wider uppercase font-medium px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-300 relative shrink-0",
                    isActive
                      ? "text-white bg-white/20 border border-[#DAA520]/60 shadow-[0_0_12px_rgba(218,165,32,0.35)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span>{estate.boldTitle}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeSlideIndicator"
                      className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#DAA520]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev / Next Slide Arrows */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + ESTATES.length) % ESTATES.length)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:border-[#DAA520] hover:text-[#DAA520] flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Previous Villa"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % ESTATES.length)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:border-[#DAA520] hover:text-[#DAA520] flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Next Villa"
            >
              <ChevronRight size={13} />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
