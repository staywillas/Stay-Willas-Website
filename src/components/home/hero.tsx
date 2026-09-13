"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowUpRight, 
  Building2, 
  Palmtree, 
  Mountain 
} from "lucide-react";
import BookingBar from "@/components/home/booking-bar";

const HERO_BLUR_DATA_URL = "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACwAwCdASoYAA4APzmEuVOvKKWisAgB4CcJQBhQBA0gSkzLs9U/wAD90+5FfJMbgJdgz2St07HhIsCuVBCVclMA82z1cq8XO0ZllrT76uZTqmnFCXRgcmkUCakBRV+X0piDoyhQiVxjb5TRvGCHLQa/z97F2rB2MwYZjIvSnAIAAA==";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] sm:min-h-[94vh] flex flex-col justify-between pt-20 pb-5 sm:pt-36 sm:pb-14 overflow-hidden bg-[#07162C]">
      {/* 1. Ultra-HQ Static Background: The Angle House */}
      <div className="absolute inset-0 z-0 bg-[#07162C]">
        <Image
          src="/images/angle-house-hero-clean.webp"
          alt="The Angle House Luxury Villa - Stay Willas"
          fill
          priority
          unoptimized
          placeholder="blur"
          blurDataURL={HERO_BLUR_DATA_URL}
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />
        
        {/* 2. Bespoke Luxury Blue Tint Overlay (Vibrant Royal / Deep Sapphire Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07162C]/90 via-[#0B254A]/75 to-[#040C1A]/95 backdrop-blur-[1px]" />

        {/* Ambient Radial Lighting for Dramatic Architectural Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#2563EB]/25 via-[#1D4ED8]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[400px] bg-[#DAA520]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[400px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* 3. Hero Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between flex-1">
        
        {/* Top Centered Editorial Headline Block */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center pt-1 sm:pt-4">
          
          {/* Gold Luxury Pill Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-[#DAA520]/50 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-2 sm:mb-6 shadow-[0_4px_20px_rgba(218,165,32,0.2)]">
            <Sparkles size={13} className="text-[#F3C065] animate-pulse shrink-0" />
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#F3C065]">
              THE STAY WILLAS COLLECTION
            </span>
          </div>

          {/* Bold Centered Headline - Enhanced Text Size for Mobile Impact */}
          <h1 className="font-heading text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] sm:leading-[1.12] drop-shadow-lg max-w-4xl">
            Where Time Slows Down{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCE59F] via-[#DAA520] to-[#E5B54C] italic font-serif block sm:inline">
              &amp; Luxury Begins
            </span>
          </h1>

          {/* Subheadline / Brand Promise */}
          <p className="mt-2.5 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto font-light leading-snug sm:leading-relaxed drop-shadow-sm px-2 line-clamp-2 sm:line-clamp-none">
            Discover premier private pool villas across Maharashtra with bespoke in-house chefs, panoramic mountain views, and total seclusion.
          </p>

          {/* 4. Well-Placed 3 Main Properties (In 1 Single Row on Mobile, Glassmorphic 3D Icons) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-3xl mx-auto mt-3.5 sm:mt-8">
            
            {/* Property 1: The Angle House */}
            <Link
              href="/villa/the-angle-house"
              className="group relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-xl border border-white/20 hover:border-[#DAA520]/70 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 3D Glassmorphism Icon */}
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#60A5FA] via-[#2563EB] to-[#1E3A8A] shadow-[0_4px_12px_rgba(37,99,235,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_2px_rgba(0,0,0,0.4)] border border-white/40 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-between">
                  <span className="font-heading font-bold text-white text-[11px] sm:text-base lg:text-lg group-hover:text-[#F3C065] transition-colors leading-tight truncate">
                    The Angle House
                  </span>
                  <ArrowUpRight size={16} className="hidden sm:inline-block text-white/60 group-hover:text-[#F3C065] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="hidden sm:block text-[11px] sm:text-xs text-slate-300 truncate font-light mt-0.5">
                  Lonavala • Pool Villa
                </p>
              </div>
            </Link>

            {/* Property 2: Canopy Crest */}
            <Link
              href="/villa/canopy-crest"
              className="group relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-xl border border-white/20 hover:border-[#10B981]/70 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 3D Glassmorphism Icon */}
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#34D399] via-[#059669] to-[#064E3B] shadow-[0_4px_12px_rgba(16,185,129,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_2px_rgba(0,0,0,0.4)] border border-white/40 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Palmtree className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-between">
                  <span className="font-heading font-bold text-white text-[11px] sm:text-base lg:text-lg group-hover:text-[#34D399] transition-colors leading-tight truncate">
                    Canopy Crest
                  </span>
                  <ArrowUpRight size={16} className="hidden sm:inline-block text-white/60 group-hover:text-[#34D399] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="hidden sm:block text-[11px] sm:text-xs text-slate-300 truncate font-light mt-0.5">
                  Khopoli • 4 BHK Estate
                </p>
              </div>
            </Link>

            {/* Property 3: Willow Peak */}
            <Link
              href="/villa/willow-peak"
              className="group relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-xl border border-white/20 hover:border-[#DAA520]/70 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_12px_36px_rgba(218,165,32,0.3)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 3D Glassmorphism Icon */}
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#FBBF24] via-[#D97706] to-[#78350F] shadow-[0_4px_12px_rgba(245,158,11,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.8),inset_0_-1.5px_2px_rgba(0,0,0,0.4)] border border-white/40 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Mountain className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-between">
                  <span className="font-heading font-bold text-white text-[11px] sm:text-base lg:text-lg group-hover:text-[#F3C065] transition-colors leading-tight truncate">
                    Willow Peak
                  </span>
                  <ArrowUpRight size={16} className="hidden sm:inline-block text-white/60 group-hover:text-[#F3C065] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="hidden sm:block text-[11px] sm:text-xs text-slate-300 truncate font-light mt-0.5">
                  Lonavala • A-Frame Chalets
                </p>
              </div>
            </Link>

          </div>

        </div>

        {/* 5. Floating Booking & Availability Search Bar (Shifted Upward on Mobile) */}
        <div className="w-full max-w-5xl mx-auto mt-3.5 sm:mt-10 pt-0 sm:pt-2">
          <BookingBar className="my-0 px-0 w-full" />
        </div>

      </div>
    </section>
  );
}
