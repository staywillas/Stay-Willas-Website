"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ArrowRight, 
  ArrowUpRight,
  Star, 
  ChevronRight, 
  Plane, 
  Heart 
} from "lucide-react";
import BookingBar from "@/components/home/booking-bar";
import { cn } from "@/lib/utils";

const VILLAS = [
  {
    name: "The Angle House",
    location: "Kurwande, Lonavala",
    startingRate: "₹13,000",
    rateNote: "Starting weekday tariff",
    weekendRate: "₹20,000",
    rating: "4.5",
    capacity: "12 Guests • 3 Beds",
    image: "/images/destinations/ANGLE HOUSE FINAL.jpg",
    slug: "the-angle-house",
    badge: "Architectural Icon",
    highlight: "Waterfall Pool & Jacuzzi"
  },
  {
    name: "Willow Peak",
    location: "Kurwande, Lonavala",
    startingRate: "₹4,999",
    rateNote: "From ₹4,999 (Full: ₹17,997)",
    weekendRate: "₹6,999",
    rating: "4.6",
    capacity: "Up to 12 Guests • 3 Cottages",
    image: "/images/destinations/WILLOW PEAK FINAL.jpg",
    slug: "willow-peak",
    badge: "A-Frame Chalet",
    highlight: "In-Room Jacuzzis & BBQ"
  },
  {
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    startingRate: "₹15,000",
    rateNote: "Starting weekday tariff",
    weekendRate: "₹22,000",
    rating: "4.8",
    capacity: "16 Guests • 4 Beds",
    image: "/images/destinations/CANOPY CREST -2.png",
    slug: "canopy-crest",
    badge: "Hilltop Estate",
    highlight: "Multi-Acre Heated Pool"
  },
];

export default function HeroConcept2() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-bg-primary text-slate-900 pt-20 sm:pt-28 lg:pt-32 pb-10 sm:pb-18 overflow-hidden">
      
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DAA520]/9 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#86EFAC]/14 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. TOP TWO-COLUMN HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Brand Highlights (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            

            {/* Grand Editorial Headline */}
            <h1 className="text-3xl xs:text-[38px] sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.08] tracking-tight mb-3 sm:mb-4">
              <span className="font-heading font-semibold text-slate-900 tracking-[-0.03em] block">
                Beyond the stay.
              </span>
              <span 
                className="font-serif italic font-normal text-[#1B3564] block mt-1 sm:mt-1.5 text-[1.1em] tracking-normal"
                style={{ fontFeatureSettings: '"liga" 1, "dlig" 1' }}
              >
                Into the memories.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600/90 text-xs sm:text-[15px] md:text-base leading-relaxed mb-4 sm:mb-6 max-w-lg font-normal tracking-wide">
              Handpicked villas and cottages for weekends, celebrations, and unforgettable getaways.
            </p>

            {/* 2 Glass Destination Badges (Lonavala & Khopoli) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-sm mb-4 sm:mb-6">
              {/* Location 1: Lonavala */}
              <Link
                href="/areas/lonavala"
                className="group relative flex items-center justify-between gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#DAA520]/70 shadow-[0_4px_16px_rgba(27,53,100,0.06)] hover:shadow-[0_8px_24px_rgba(218,165,32,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-[#1B3564]/10 group-hover:bg-[#DAA520]/20 border border-[#1B3564]/15 group-hover:border-[#DAA520]/40 transition-colors">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1B3564] group-hover:text-[#B8860B]" strokeWidth={2.4} />
                  </div>
                  <span className="font-heading font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-[#1B3564] transition-colors leading-tight truncate">
                    Lonavala
                  </span>
                </div>
                <ArrowUpRight size={13} className="text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>

              {/* Location 2: Khopoli */}
              <Link
                href="/areas/khopoli"
                className="group relative flex items-center justify-between gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#DAA520]/70 shadow-[0_4px_16px_rgba(27,53,100,0.06)] hover:shadow-[0_8px_24px_rgba(218,165,32,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-[#1B3564]/10 group-hover:bg-[#DAA520]/20 border border-[#1B3564]/15 group-hover:border-[#DAA520]/40 transition-colors">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1B3564] group-hover:text-[#B8860B]" strokeWidth={2.4} />
                  </div>
                  <span className="font-heading font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-[#1B3564] transition-colors leading-tight truncate">
                    Khopoli
                  </span>
                </div>
                <ArrowUpRight size={13} className="text-slate-400 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-3 mb-4 sm:mb-7 w-full">
              <Link
                href="/villas"
                className="inline-flex items-center justify-center gap-2 bg-[#1B3564] hover:bg-[#122344] text-[#DAA520] hover:text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3 sm:px-7 sm:py-3.5 rounded-full shadow-[0_8px_20px_rgba(27,53,100,0.22)] hover:shadow-[0_12px_28px_rgba(27,53,100,0.32)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Stays</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </Link>
            </div>

          </div>

          {/* Right Column: Organic Sculpted Photo Curve (Mobile-Optimized Height) */}
          <div className="lg:col-span-7 relative">
            
            {/* The Sculpted Fluid Image Frame */}
            <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[340px] lg:h-[410px] rounded-3xl sm:rounded-[2.5rem] lg:rounded-l-[120px] lg:rounded-r-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(27,53,100,0.14)] border border-slate-200/80 group">
              <Image
                src="/images/angle-house-hero-clean.webp"
                alt="The Angle House Luxury Villa"
                fill
                priority
                unoptimized
                className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000"
              />
              
              {/* Atmospheric Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


              {/* Villa Name & Real Rate Overlay in Bottom-Right (Visible on Mobile and Desktop) */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 z-20 text-white text-right">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DAA520]/25 backdrop-blur-md border border-[#DAA520]/40 text-[#F5C042] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                  <Star size={9} className="fill-[#F5C042]" />
                  <span>Featured Villa</span>
                </div>
                <h3 className="font-heading text-sm sm:text-xl lg:text-2xl font-bold leading-tight">The Angle House</h3>
                <p className="text-[10px] sm:text-xs text-stone-200 mt-0.5">
                  Kurwande, Lonavala • <strong className="text-[#DAA520]">₹13,000/night</strong>
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* 2. FLOATING MULTI-SEGMENT BOOKING & AVAILABILITY SEARCH BAR */}
        <div className="mt-6 sm:mt-10 lg:mt-12 w-full max-w-5xl mx-auto">
          <BookingBar className="my-0 px-0 w-full" />
        </div>

        {/* 3. LOWER SHOWCASE */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Promo Card: 26% Off Weekdays Offer (4 Cols) */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden p-6 text-white text-left flex flex-col justify-between shadow-xl group min-h-[210px] sm:min-h-[220px] border border-slate-200/60">
            <Image
              src="/images/exp-pool.webp"
              alt="26% Off Weekday Offer - Stay Willas"
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
            {/* Deep Dark Gradient Overlay for Maximum Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/60 to-[#0A1628]/30" />
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/25 border border-[#DAA520]/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-amber-200 shadow-xs">
                ✦ MON – THU OFFER
              </span>
              <h4 className="font-heading text-2xl sm:text-[26px] font-bold mt-3 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                26% Off on Weekdays
              </h4>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                href="/villas"
                className="inline-flex items-center gap-2 bg-[#DAA520] hover:bg-[#e2ac24] text-[#0A1628] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(218,165,32,0.35)] hover:shadow-[0_6px_22px_rgba(218,165,32,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Claim 26% Off</span>
                <ArrowRight size={13} className="stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Featured Villas with Actual Rates & Capacity (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Places with Love
              </h3>
              <Link
                href="/villas"
                className="text-xs font-bold text-[#1B3564] hover:text-[#DAA520] transition-colors flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VILLAS.map((villa) => (
                <Link
                  key={villa.slug}
                  href={`/villa/${villa.slug}`}
                  className="group block bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-2.5 bg-slate-900">
                    <Image
                      src={villa.image}
                      alt={villa.name}
                      fill
                      unoptimized
                      className="object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="px-0.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span className="truncate">{villa.name}</span>
                      <div className="flex items-center text-amber-500 text-[11px] shrink-0 ml-1">
                        <Star size={11} className="fill-amber-400 mr-0.5" />
                        <span>{villa.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {villa.location} • {villa.capacity}
                    </div>

                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[9px] text-slate-400 font-medium">Starts from</span>
                      <span className="font-heading font-black text-sm text-[#1B3564]">
                        {villa.startingRate} <span className="text-[10px] font-normal text-slate-400">/ night</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
