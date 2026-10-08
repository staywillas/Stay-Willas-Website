"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ArrowRight, 
  ArrowUpRight, 
  Star, 
  ChevronLeft,
  ChevronRight, 
  Copy, 
  Check,
  Sparkles,
  Users,
  BedDouble,
  Waves
} from "lucide-react";
import BookingBar from "@/components/home/booking-bar";
import { cn } from "@/lib/utils";

// Rotating Hero Carousel Data (Simple details: Cost & Max Guests, Heaven for Willow Peak)
const HERO_SLIDES = [
  {
    name: "The Angle House",
    location: "Kurwande, Lonavala",
    cost: "₹13,000/night",
    capacity: "Max 12 Guests",
    image: "/images/angle-house-hero-clean.webp",
    slug: "the-angle-house",
    badge: "Architectural Icon",
    objectPosition: "object-center"
  },
  {
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    cost: "₹15,000/night",
    capacity: "Max 16 Guests",
    image: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
    slug: "canopy-crest",
    badge: "Hilltop Estate",
    objectPosition: "object-[center_82%]"
  },
  {
    name: "Casa De Reva",
    location: "Panchgani, Maharashtra",
    cost: "₹16,000/night",
    capacity: "Max 16 Guests",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    slug: "casa-de-reva",
    badge: "Hillside Sanctuary",
    objectPosition: "object-center"
  },
  {
    name: "Willow Peak (Heaven)",
    location: "Kurwande, Lonavala",
    cost: "₹4,999/night",
    capacity: "Max 4 Guests",
    image: "/assets/villas/willow-peak/wp-01.webp",
    slug: "willow-peak",
    badge: "A-Frame Cottage",
    objectPosition: "object-[center_72%]"
  }
];

// 4 Signature Villas for the 2x2 Showcase Grid
const VILLAS = [
  {
    name: "The Angle House",
    location: "Kurwande, Lonavala",
    startingRate: "₹13,000",
    rateNote: "Weekday tariff • Weekend ₹20,000",
    rating: "4.9",
    reviewsCount: 42,
    capacity: "12 Guests",
    bedrooms: "3 Bedrooms",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    slug: "the-angle-house",
    badge: "Architectural Icon",
    highlight: "Waterfall Pool & Jacuzzi",
    features: ["Private Waterfall Pool", "In-Room Jacuzzi", "Mountain View Lawn", "Chef On Demand"],
    objectPosition: "object-center"
  },
  {
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    startingRate: "₹15,000",
    rateNote: "Weekday tariff • Weekend ₹22,000",
    rating: "4.8",
    reviewsCount: 38,
    capacity: "16 Guests",
    bedrooms: "4 Bedrooms",
    image: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
    slug: "canopy-crest",
    badge: "Hilltop Estate",
    highlight: "Multi-Acre Heated Pool",
    features: ["Heated Swimming Pool", "360° Valley Views", "Billiards & Turf", "Expansive Lawns"],
    objectPosition: "object-[center_82%]"
  },
  {
    name: "Casa De Reva",
    location: "Panchgani, Maharashtra",
    startingRate: "₹16,000",
    rateNote: "Weekday tariff • Weekend ₹22,000",
    rating: "4.9",
    reviewsCount: 51,
    capacity: "16 Guests",
    bedrooms: "4 Bedrooms",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    slug: "casa-de-reva",
    badge: "Hillside Sanctuary",
    highlight: "Private Pool & Gazebo",
    features: ["Private Pool & Gazebo", "Valley Sunset Views", "Strawberry Farm Walk", "Custom BBQ Setup"],
    objectPosition: "object-center"
  },
  {
    name: "Willow Peak",
    location: "Kurwande, Lonavala",
    startingRate: "₹4,999",
    rateNote: "Heaven: ₹4,999/nt • Entire Estate (12 Guests): From ₹15,000/nt",
    rating: "4.8",
    reviewsCount: 46,
    capacity: "Up to 12 Guests",
    bedrooms: "3 A-Frame Chalets",
    image: "/assets/villas/willow-peak/gallery-1.webp",
    slug: "willow-peak",
    badge: "A-Frame Chalet",
    highlight: "In-Room Jacuzzis & BBQ Deck",
    features: ["Book 1 Cottage or All 3", "Jacuzzi in Every Room", "Private Sit-Out Decks", "Bonfire & Lawn"],
    objectPosition: "object-[center_72%]"
  }
];

export default function HeroConcept2() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Auto-rotating Hero Carousel (every 4.5 seconds, paused on hover)
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("Stayw26");
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <section className="relative w-full bg-bg-primary text-slate-900 pt-20 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden">
      
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DAA520]/9 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#86EFAC]/14 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. TOP TWO-COLUMN HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Brand Highlights (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Grand Editorial Headline */}
            <div className="text-3xl xs:text-[38px] sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.08] tracking-tight mb-3 sm:mb-4">
              <span className="font-heading font-semibold text-slate-900 tracking-[-0.03em] block">
                Beyond the stay.
              </span>
              <span 
                className="font-serif italic font-normal text-[#1B3564] block mt-1 sm:mt-1.5 text-[1.1em] tracking-normal"
                style={{ fontFeatureSettings: '"liga" 1, "dlig" 1' }}
              >
                Into the memories.
              </span>
            </div>

            {/* Subtext */}
            <p className="text-slate-600/90 text-xs sm:text-[15px] md:text-base leading-relaxed mb-4 sm:mb-6 max-w-lg font-normal tracking-wide">
              Handpicked villas and cottages for weekends, celebrations, and unforgettable getaways.
            </p>

            {/* 3 Glass Destination Badges (Lonavala, Khopoli & Panchgani) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-md mb-4 sm:mb-6">
              {/* Location 1: Lonavala */}
              <Link
                href="/areas/lonavala"
                className="group relative flex items-center justify-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#DAA520]/70 shadow-2xs hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-center"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DAA520] shrink-0" strokeWidth={2.4} />
                <span className="font-heading font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-[#1B3564] transition-colors leading-tight whitespace-nowrap">
                  Lonavala
                </span>
                <ArrowUpRight size={11} className="hidden xs:inline text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>

              {/* Location 2: Khopoli */}
              <Link
                href="/areas/khopoli"
                className="group relative flex items-center justify-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#DAA520]/70 shadow-2xs hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-center"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DAA520] shrink-0" strokeWidth={2.4} />
                <span className="font-heading font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-[#1B3564] transition-colors leading-tight whitespace-nowrap">
                  Khopoli
                </span>
                <ArrowUpRight size={11} className="hidden xs:inline text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>

              {/* Location 3: Panchgani */}
              <Link
                href="/areas/panchgani"
                className="group relative flex items-center justify-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#DAA520]/70 shadow-2xs hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-center"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DAA520] shrink-0" strokeWidth={2.4} />
                <span className="font-heading font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-[#1B3564] transition-colors leading-tight whitespace-nowrap">
                  Panchgani
                </span>
                <ArrowUpRight size={11} className="hidden xs:inline text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-3 mb-4 sm:mb-7 w-full">
              <a
                href="#booking-bar-section"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E0534C] via-[#E7625A] to-[#D9413A] hover:from-[#D9413A] hover:to-[#C9332C] text-white font-black text-xs sm:text-sm tracking-wider uppercase px-6 py-3 sm:px-7 sm:py-3.5 rounded-full shadow-[0_8px_25px_rgba(224,83,76,0.38)] hover:shadow-[0_12px_32px_rgba(224,83,76,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-white/20"
              >
                <span>⚡ Quick Book</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </a>
              <Link
                href="/villas"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase px-5 py-3 sm:px-6 sm:py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Stays</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Organic Sculpted Photo Curve with ROTATING CAROUSEL (Willow Peak, Angle House, Canopy Crest, Casa De Reva) */}
          <div className="lg:col-span-7 relative">
            
            {/* The Sculpted Fluid Image Frame with Rotating Carousel */}
            <div 
              className="relative w-full h-[230px] xs:h-[270px] sm:h-[350px] lg:h-[420px] rounded-3xl sm:rounded-[2.5rem] lg:rounded-l-[120px] lg:rounded-r-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(27,53,100,0.14)] border border-slate-200/80 group"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              {/* Carousel Slides */}
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === currentHeroIdx;
                return (
                  <Link
                    key={slide.slug}
                    href={`/villa/${slide.slug}`}
                    className={cn(
                      "absolute inset-0 block transition-opacity duration-700 ease-in-out cursor-pointer",
                      isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                    )}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.name}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 55vw"
                      quality={85}
                      className={cn(
                        "object-cover transition-transform duration-1000",
                        slide.objectPosition,
                        isActive ? "scale-100 group-hover:scale-105" : "scale-105"
                      )}
                    />
                    
                    {/* Atmospheric Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                    {/* Simple Details Overlay in Bottom-Right: Cost & Max People Only */}
                    <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 z-20 text-white text-right max-w-[85%]">
                      <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#DAA520]/25 backdrop-blur-md border border-[#DAA520]/40 text-[#F5C042] text-[9px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Star size={10} className="fill-[#F5C042]" />
                        <span>{slide.badge}</span>
                      </div>
                      <h3 className="font-heading text-base sm:text-2xl lg:text-[26px] font-bold leading-tight text-yellow-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {slide.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs lg:text-sm text-stone-200 mt-0.5 sm:mt-1 font-medium drop-shadow-sm flex items-center justify-end gap-1.5 flex-wrap">
                        <span>{slide.location}</span>
                        <span className="text-stone-400">•</span>
                        <strong className="text-[#DAA520] font-black">{slide.cost}</strong>
                        <span className="text-stone-400">•</span>
                        <span className="text-white/90">{slide.capacity}</span>
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* Previous Slide Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentHeroIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-85 hover:opacity-100 transition-all cursor-pointer shadow-md"
                aria-label="Previous villa"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Next Slide Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-85 hover:opacity-100 transition-all cursor-pointer shadow-md"
                aria-label="Next villa"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Slide Indicator Dots */}
              <div className="absolute bottom-3 left-4 sm:bottom-5 sm:left-6 z-30 flex items-center gap-1.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentHeroIdx(idx);
                    }}
                    className={cn(
                      "h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer",
                      idx === currentHeroIdx
                        ? "w-6 sm:w-8 bg-[#DAA520] shadow-sm"
                        : "w-1.5 sm:w-2 bg-white/45 hover:bg-white/80"
                    )}
                    aria-label={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* 2. FLOATING MULTI-SEGMENT BOOKING & AVAILABILITY SEARCH BAR */}
        <div id="booking-bar-section" className="mt-6 sm:mt-10 lg:mt-12 w-full max-w-6xl mx-auto">
          <BookingBar className="my-0 px-0 w-full" />
        </div>

        {/* 3. LUXURY PROMO BANNER: 26% OFF ON WEEKDAYS (Stayw26) */}
        <div className="mt-10 sm:mt-14 relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-7 bg-[#0A1628] border border-[#DAA520]/30 shadow-xl text-white">
          {/* Ambient background decoration */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#DAA520]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#1B3564]/50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left w-full lg:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center shrink-0 shadow-lg shadow-[#DAA520]/20">
                <Sparkles className="w-6 h-6 text-[#0A1628]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#F5C042] text-[10px] font-bold uppercase tracking-widest">
                    ✦ Mon – Thu Exclusive Offer
                  </span>
                  <span className="text-xs text-stone-300 font-medium hidden sm:inline">• Limited Availability</span>
                </div>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Enjoy Flat 26% Off on All Weekday Getaways
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                  Book your private villa for Monday through Thursday and unlock luxury at unbeatable rates with promo code.
                </p>
              </div>
            </div>

            {/* Interactive Coupon Box with Copy Code & Claim Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
              <div
                onClick={handleCopyCode}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCopyCode(e as any);
                }}
                className="group/coupon cursor-pointer flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-dashed border-[#DAA520]/80 rounded-xl px-4 py-2.5 backdrop-blur-md transition-all shadow-inner flex-1 sm:flex-none justify-between sm:justify-start"
                title="Click to copy coupon code Stayw26"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-medium">
                    Coupon Code
                  </span>
                  <span className="font-mono text-base font-black tracking-widest text-[#DAA520] group-hover/coupon:text-amber-300 transition-colors">
                    Stayw26
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 select-none",
                    copiedCode
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-[#DAA520] hover:bg-[#e2ac24] text-[#0A1628] shadow-xs"
                  )}
                >
                  {copiedCode ? (
                    <>
                      <Check size={13} className="stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="stroke-[2.5]" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </div>

              <Link
                href="/villas"
                className="inline-flex items-center justify-center gap-2 bg-[#DAA520] hover:bg-[#e2ac24] text-[#0A1628] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-[0_4px_16px_rgba(218,165,32,0.35)] hover:shadow-[0_6px_22px_rgba(218,165,32,0.5)] transition-all transform hover:-translate-y-0.5 shrink-0 flex-1 sm:flex-none"
              >
                <span>Claim 26% Off</span>
                <ArrowRight size={13} className="stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. OUR SIGNATURE VILLAS SHOWCASE (2 IN ONE ROW - BIGGER & NICE) */}
        <div className="mt-12 sm:mt-16">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3564]/10 text-[#1B3564] text-xs font-bold tracking-wider uppercase mb-2">
                <Sparkles size={12} className="text-[#DAA520]" />
                <span>Featured Private Estates</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                Our Signature Villas & Chalets
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                Every property includes private pools or in-room jacuzzis, expansive valley views, and attentive caretakers.
              </p>
            </div>
            
            <Link
              href="/villas"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B3564] hover:text-[#DAA520] transition-colors group"
            >
              <span>Explore all properties</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 2 in 1 Row Grid (grid-cols-1 md:grid-cols-2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {VILLAS.map((villa) => (
              <div
                key={villa.slug}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col text-left"
              >
                {/* Bigger Villa Photography */}
                <Link href={`/villa/${villa.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 block">
                  <Image
                    src={villa.image}
                    alt={villa.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                    className={cn(
                      "object-cover group-hover:scale-105 transition-transform duration-700",
                      villa.objectPosition || "object-center"
                    )}
                  />
                  
                  {/* Atmospheric Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  {/* Top Badges: Category & Rating */}
                  <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold shadow-xs">
                      {villa.badge}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm text-slate-900 text-xs font-bold">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      <span>{villa.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({villa.reviewsCount})</span>
                    </span>
                  </div>

                  {/* Bottom Highlight Pill on Photo */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DAA520]/90 backdrop-blur-md text-[#0A1628] text-xs font-bold shadow-md">
                    <Waves size={13} className="stroke-[2.5]" />
                    <span>{villa.highlight}</span>
                  </div>
                </Link>

                {/* Card Content Body */}
                <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                  
                  <div>
                    {/* Villa Name & Location */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/villa/${villa.slug}`}>
                          <h4 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#1B3564] transition-colors leading-tight">
                            {villa.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                          <MapPin size={14} className="text-[#DAA520] shrink-0" strokeWidth={2.4} />
                          <span>{villa.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Capacity & Bedroom Specs */}
                    <div className="flex items-center gap-4 mt-3.5 pt-3.5 border-t border-slate-100 text-xs sm:text-[13px] text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-slate-400" />
                        <span>{villa.capacity}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={14} className="text-slate-400" />
                        <span>{villa.bedrooms}</span>
                      </div>
                    </div>

                    {/* Key Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
                      {villa.features.map((feature, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs font-medium text-slate-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Call to Action Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Starts From
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-heading text-2xl sm:text-3xl font-black text-[#1B3564] tracking-tight">
                          {villa.startingRate}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ night</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {villa.rateNote}
                      </span>
                    </div>

                    <Link
                      href={`/villa/${villa.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#0A1628] group-hover:bg-[#1B3564] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-6 py-3 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-[1.02] shrink-0"
                    >
                      <span>Explore Villa</span>
                      <ArrowRight size={14} className="stroke-[2.5]" />
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
