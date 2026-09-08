"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  Star, 
  Waves, 
  Utensils, 
  ShieldCheck, 
  Bed, 
  Users, 
  ArrowRight, 
  MessageCircle,
  HeartHandshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookingBar from "@/components/home/booking-bar";

interface VillaSlide {
  id: string;
  slug: string;
  name: string;
  location: string;
  tagline: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  price: string;
  priceNumeric: number;
  rating: number;
  reviewsCount: number;
  heroBadge: string;
  accentColor: string;
  image: string;
  href: string;
  highlights: string[];
  isComingSoon?: boolean;
}

const slides: VillaSlide[] = [
  {
    id: "the-angle-house",
    slug: "the-angle-house",
    name: "The Angle House",
    location: "Kamshet, Lonavala",
    tagline: "Signature Glass Facade & Waterfall Pool",
    bedrooms: 3,
    bathrooms: 3,
    guests: 12,
    price: "₹13,000",
    priceNumeric: 13000,
    rating: 4.98,
    reviewsCount: 42,
    heroBadge: "Architectural Icon",
    accentColor: "#DAA520",
    image: "/images/destinations/ANGLE%20HOUSE%20FINAL.jpg",
    href: "/villa/the-angle-house",
    highlights: ["Waterfall Pool", "Master Jacuzzi", "Pet Friendly", "Private Chef & Jain Setup"],
  },
  {
    id: "canopy-crest",
    slug: "canopy-crest",
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    tagline: "4 BHK Sprawling Estate & 22ft Private Pool",
    bedrooms: 4,
    bathrooms: 5,
    guests: 16,
    price: "₹15,000",
    priceNumeric: 15000,
    rating: 4.96,
    reviewsCount: 38,
    heroBadge: "Sprawling Estate",
    accentColor: "#10B981",
    image: "/images/destinations/CANOPY%20CREST%20-2.png",
    href: "/villa/canopy-crest",
    highlights: ["22ft Private Pool", "Manicured Lawns", "Poolside Barbecue", "Wheelchair Friendly"],
  },
  {
    id: "willow-peak",
    slug: "willow-peak",
    name: "Willow Peak",
    location: "Kurwande, Lonavala",
    tagline: "Standalone A-Frame Chalets with Private Jacuzzis",
    bedrooms: 3,
    bathrooms: 3,
    guests: 12,
    price: "₹4,999",
    priceNumeric: 4999,
    rating: 4.95,
    reviewsCount: 31,
    heroBadge: "Alpine Chalets",
    accentColor: "#F59E0B",
    image: "/images/destinations/WILLOW%20PEAK%20-%202.jpeg",
    href: "/villa/willow-peak",
    highlights: ["A-Frame Architecture", "In-Room Jacuzzi", "Mountain Views", "Outdoor Dining Deck"],
  },
  {
    id: "terra-cotta-villa",
    slug: "terra-cotta-villa",
    name: "Terra Cotta Villa",
    location: "Panchgani - Mahabaleshwar",
    tagline: "Rustic Brick Sanctuary & Private Pool",
    bedrooms: 4,
    bathrooms: 4,
    guests: 16,
    price: "Coming Soon",
    priceNumeric: 0,
    rating: 4.99,
    reviewsCount: 29,
    heroBadge: "Coming Soon",
    accentColor: "#E06D53",
    image: "/images/destinations/TERRA%20COTTA%20FINAL.jpg",
    href: "/villa/terra-cotta-villa",
    highlights: ["Private Pool & Gazebo", "Near Mapro Garden", "Terracotta Architecture", "Bespoke Chef"],
    isComingSoon: true,
  },
];

const locations = [
  { name: "All Stays", href: "/villas" },
  { name: "Lonavala", href: "/areas/lonavala" },
  { name: "Khopoli", href: "/areas/khopoli" },
];

const slideVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? "40%" : "-40%",
    opacity: 0,
    scale: 1.04,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 260, damping: 30, mass: 0.8 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-30%" : "30%",
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring", stiffness: 260, damping: 30, mass: 0.8 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  }),
};

const Hero = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentIndex = ((page % slides.length) + slides.length) % slides.length;
  const currentSlide = slides[currentIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const goToSlide = useCallback((targetIndex: number) => {
    setPage(([prevPage]) => {
      const current = ((prevPage % slides.length) + slides.length) % slides.length;
      if (targetIndex === current) return [prevPage, 0];
      const dir = targetIndex > current ? 1 : -1;
      return [prevPage + (targetIndex - current), dir];
    });
  }, []);

  // 6-second auto-rotation, pauses smoothly on interaction
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [paginate, isHovered, page]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      paginate(1);
    } else if (diff < -45) {
      paginate(-1);
    }
    setTouchStartX(null);
  };

  const openWhatsApp = () => {
    const text = currentSlide.isComingSoon
      ? encodeURIComponent(
          `Hello Stay Willas! 🌟 I'd love to join the exclusive waitlist for *${currentSlide.name}* in ${currentSlide.location}. Please notify me as soon as bookings go live!`
        )
      : encodeURIComponent(
          `Hello Stay Willas! 🌟 I'm interested in booking *${currentSlide.name}* in ${currentSlide.location}. Could you share current availability and best direct rates?`
        );
    window.open(`https://wa.me/919619042310?text=${text}`, "_blank");
  };

  return (
    <section 
      className="relative w-full bg-gradient-to-b from-[#081121] via-[#0E1B35] to-[#0A1426] pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[#DAA520]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1560px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* OPTION 2: ASYMMETRIC SPLIT-SCREEN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center mb-8 sm:mb-12">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial Typography, Trust Badges, Dynamic Active Villa Specs */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* 1. Gold Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-[#DAA520]/40 rounded-full px-4 py-1.5 w-fit mb-4 transition-all duration-300 shadow-sm">
              <Sparkles size={14} className="text-[#DAA520] animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#E2A63B]">
                THE STAY WILLAS COLLECTION
              </span>
            </div>

            {/* 2. Bold Editorial Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl text-white font-extrabold leading-[1.12] tracking-tight mb-4">
              Where Time Slows Down{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3C065] via-[#DAA520] to-[#E5B54C] italic font-serif">
                &amp; Luxury Begins
              </span>
            </h1>

            {/* 3. Subtitle / Brand Promise */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mb-6 font-light">
              Discover private pool sanctuaries nestled in the Sahyadri hills. Unwind with personal chef dining, expansive lawns, and five-star hospitality across Lonavala &amp; Khopoli.
            </p>

            {/* 4. Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 py-3 border-y border-white/10">
              <div className="flex items-center gap-2 text-white/90">
                <Waves size={16} className="text-[#DAA520] shrink-0" />
                <span className="text-xs font-medium">100% Private Pools</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Utensils size={16} className="text-[#DAA520] shrink-0" />
                <span className="text-xs font-medium">Bespoke Chef & Jain</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <HeartHandshake size={16} className="text-[#DAA520] shrink-0" />
                <span className="text-xs font-medium">Pet-Friendly Lawns</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <ShieldCheck size={16} className="text-[#DAA520] shrink-0" />
                <span className="text-xs font-medium">0% Booking Fees</span>
              </div>
            </div>

            {/* 5. Active Property Live Card (Synchronized with Right Gallery) */}
            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-xl transition-all duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DAA520] bg-[#DAA520]/15 px-2 py-0.5 rounded-md">
                          {currentSlide.heroBadge}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={12} className="text-[#DAA520]" />
                          {currentSlide.location}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
                        {currentSlide.name}
                      </h2>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 font-medium">
                        {currentSlide.isComingSoon ? "Status" : "From"}
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-[#E2A63B] font-heading">
                        {currentSlide.price}
                        {!currentSlide.isComingSoon && (
                          <span className="text-xs font-normal text-white/60"> / night</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mb-3 font-light">
                    {currentSlide.tagline}
                  </p>

                  {/* Specs Pill Row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 pb-3 mb-3 border-b border-white/10">
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Bed size={13} className="text-[#DAA520]" />
                      {currentSlide.bedrooms} Bedrooms
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Users size={13} className="text-[#DAA520]" />
                      Up to {currentSlide.guests} Guests
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                      <Star size={13} className="fill-[#DAA520] text-[#DAA520]" />
                      {currentSlide.rating} ({currentSlide.isComingSoon ? "Waitlist Open" : `${currentSlide.reviewsCount} reviews`})
                    </span>
                  </div>

                  {/* CTA Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={currentSlide.href}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#DAA520] hover:bg-[#c99518] text-[#0A1426] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-[#DAA520]/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{currentSlide.isComingSoon ? "Preview Villa" : "Explore Villa Details"}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className={`inline-flex items-center justify-center gap-1.5 ${currentSlide.isComingSoon ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-white/10 hover:bg-[#25D366] text-white hover:text-slate-900"} border border-white/20 font-semibold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                      title={currentSlide.isComingSoon ? "Join Launch Waitlist on WhatsApp" : "Quick Inquiry on WhatsApp"}
                    >
                      <MessageCircle size={15} />
                      <span className="hidden sm:inline">{currentSlide.isComingSoon ? "Waitlist" : "WhatsApp"}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 6. Quick Location Jump Links */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-white/50 font-medium">Popular:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {locations.map((loc) => (
                  <Link
                    key={loc.name}
                    href={loc.href}
                    className="text-[11px] sm:text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Interactive High-Resolution Showcase Stage & Property Strip */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* Main Interactive Stage Box */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 ring-1 ring-white/10 group bg-slate-900">
              
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <Link
                    href={currentSlide.href}
                    className="relative block w-full h-full cursor-pointer"
                    aria-label={`View ${currentSlide.name}`}
                  >
                    {/* Ken Burns Subtle Drift */}
                    <motion.div
                      className="relative w-full h-full"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.04 }}
                      transition={{ duration: 6, ease: "linear" }}
                    >
                      <Image
                        src={currentSlide.image}
                        alt={currentSlide.name}
                        fill
                        priority={true}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
                        className="object-cover object-center"
                      />
                    </motion.div>

                    {/* Gradient Overlays for readable badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Floating Top Left Pill: Property Name & Location */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg text-white">
                  <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse shrink-0" />
                  <span className="font-heading font-bold text-xs sm:text-sm tracking-wide text-white">
                    {currentSlide.name}
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-xs text-[#DAA520] font-semibold">{currentSlide.location}</span>
                </div>
              </div>

              {/* Floating Top Right Pill: Verified Rating */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-lg text-white text-xs font-semibold">
                  <Star size={13} className="fill-[#DAA520] text-[#DAA520]" />
                  <span>{currentSlide.rating}</span>
                  <span className="text-white/50 text-[11px]">Verified</span>
                </div>
              </div>

              {/* Floating Bottom Highlights */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-20 pointer-events-none flex items-end justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentSlide.highlights.slice(0, 2).map((item) => (
                    <span 
                      key={item}
                      className="text-[11px] sm:text-xs font-medium bg-black/70 backdrop-blur-md text-white/90 border border-white/15 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>

                <div className={`${currentSlide.isComingSoon ? "bg-amber-500 text-slate-950 font-black" : "bg-[#DAA520] text-slate-900 font-extrabold"} text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow-lg`}>
                  {currentSlide.price} {!currentSlide.isComingSoon && <span className="font-normal text-[11px]">/ night</span>}
                </div>
              </div>

              {/* Left / Right Arrow Controls */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  paginate(-1);
                }}
                aria-label="Previous property"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#DAA520] text-white hover:text-slate-950 backdrop-blur-md border border-white/20 hover:border-[#DAA520] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={20} className="sm:size-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  paginate(1);
                }}
                aria-label="Next property"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#DAA520] text-white hover:text-slate-950 backdrop-blur-md border border-white/20 hover:border-[#DAA520] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              >
                <ChevronRight size={20} className="sm:size-6" />
              </button>

            </div>

            {/* Property Interactive Thumbnails Strip (4 Villas) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {slides.map((slide, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`relative p-2 rounded-xl text-left transition-all duration-300 cursor-pointer overflow-hidden border ${
                      isActive 
                        ? "bg-white/15 border-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.3)] ring-1 ring-[#DAA520]" 
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Thumbnail mini-image */}
                      <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0 border border-white/15">
                        <Image
                          src={slide.image}
                          alt={slide.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold truncate leading-tight ${isActive ? "text-[#E2A63B]" : "text-white"}`}>
                          {slide.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {slide.location.split(",")[0]}
                        </p>
                        <p className="text-[10px] font-semibold text-white/80">
                          {slide.isComingSoon ? (
                            <span className="text-amber-400 font-bold">Coming Soon</span>
                          ) : (
                            slide.price
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Active Bottom Glow Line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activePill"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#DAA520]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* UNIFIED FLOATING BOOKING & AVAILABILITY SEARCH BAR                        */}
        {/* ========================================================================= */}
        <div className="w-full">
          <BookingBar className="my-0 px-0 w-full" />
        </div>

      </div>
    </section>
  );
};

export default Hero;
