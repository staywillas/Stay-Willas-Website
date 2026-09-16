"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowUpRight, 
  MapPin 
} from "lucide-react";
import BookingBar from "@/components/home/booking-bar";
import RotatingText from "@/components/ui/RotatingText";
import { cn } from "@/lib/utils";

const HERO_BLUR_DATA_URL = "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACwAwCdASoYAA4APzmEuVOvKKWisAgB4CcJQBhQBA0gSkzLs9U/wAD90+5FfJMbgJdgz2St07HhIsCuVBCVclMA82z1cq8XO0ZllrT76uZTqmnFCXRgcmkUCakBRV+X0piDoyhQiVxjb5TRvGCHLQa/z97F2rB2MwYZjIvSnAIAAA==";

const ROTATING_PHRASES = [
  {
    text: "Memories Are Made",
    bgClass: "bg-white/[0.10] backdrop-blur-xl",
    borderClass: "border-[#DAA520]/45",
    shadowClass: "shadow-[0_4px_24px_rgba(218,165,32,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.4)]",
    textClass: "text-[#F5C042]", // Brand Gold/Yellow
  },
  {
    text: "Families Unwind",
    bgClass: "bg-white/[0.10] backdrop-blur-xl",
    borderClass: "border-[#559C24]/45",
    shadowClass: "shadow-[0_4px_24px_rgba(85,156,36,0.2),inset_0_1px_1.5px_rgba(255,255,255,0.4)]",
    textClass: "text-[#86EFAC]", // Light Botanical Brand Green
  },
  {
    text: "Peace Begins",
    bgClass: "bg-white/[0.10] backdrop-blur-xl",
    borderClass: "border-[#DAA520]/45",
    shadowClass: "shadow-[0_4px_24px_rgba(218,165,32,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.4)]",
    textClass: "text-[#DAA520]", // Brand Gold
  },
  {
    text: "You Truly Relax",
    bgClass: "bg-white/[0.10] backdrop-blur-xl",
    borderClass: "border-[#559C24]/45",
    shadowClass: "shadow-[0_4px_24px_rgba(85,156,36,0.2),inset_0_1px_1.5px_rgba(255,255,255,0.4)]",
    textClass: "text-[#6EE7B7]", // Luminous Mint Brand Green
  },
];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const currentPhrase = ROTATING_PHRASES[phraseIndex] || ROTATING_PHRASES[0];

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
        
        {/* 2. Soft Tint Overlay (Reduced tint for luminous architectural depth) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07162C]/65 via-[#0B254A]/40 to-[#040C1A]/80" />

        {/* Subtle Ambient Radial Lighting in Brand Gold & Green */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#559C24]/15 via-[#DAA520]/8 to-transparent rounded-full blur-[80px] sm:blur-[140px] pointer-events-none" />
        <div className="hidden sm:block absolute bottom-10 right-0 w-[500px] h-[400px] bg-[#DAA520]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="hidden sm:block absolute bottom-10 left-0 w-[500px] h-[400px] bg-[#559C24]/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* 3. Hero Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between flex-1">
        
        {/* Top Centered Editorial Headline Block */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center pt-2 sm:pt-6">
          
          {/* Sleek Headline with Brand Signature Colors & React Bits RotatingText */}
          <h1 className="font-heading text-center tracking-tight text-[1.65rem] xs:text-2xl sm:text-3xl md:text-[2.65rem] lg:text-[3.35rem] font-light text-white leading-[1.18] sm:leading-[1.22] drop-shadow-md max-w-4xl mx-auto flex flex-col items-center justify-center">
            <span className="block text-center font-light tracking-[-0.01em]">
              Where Time <span className="font-cormorant italic font-semibold sm:font-bold text-[#86EFAC] drop-shadow-sm">Slows</span>{" "}
              <span className="font-cormorant italic font-semibold sm:font-bold text-[#DAA520] drop-shadow-sm">Down &amp;</span>
            </span>
            <span className="inline-flex items-center justify-center mt-2 sm:mt-3">
              <RotatingText
                texts={ROTATING_PHRASES.map((p) => p.text)}
                onNext={(index: number) => setPhraseIndex(index)}
                mainClassName={cn(
                  "pl-4 sm:pl-7 pr-6 sm:pr-9 py-1 sm:py-1.5 justify-center rounded-2xl sm:rounded-full font-cormorant italic font-semibold inline-flex items-center align-middle whitespace-nowrap flex-nowrap border transition-all duration-500 ease-out",
                  currentPhrase.bgClass,
                  currentPhrase.borderClass,
                  currentPhrase.shadowClass,
                  currentPhrase.textClass
                )}
                staggerDuration={0}
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                splitLevelClassName="overflow-visible pb-0.5 sm:pb-1 pr-1.5"
                elementLevelClassName="inline-block pr-[0.06em]"
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                rotationInterval={2800}
                splitBy="words"
                auto
                loop
              />
            </span>
            <span className="sr-only"> — Private Pool Villas in Lonavala &amp; Khopoli Near Mumbai &amp; Pune</span>
          </h1>

          {/* Subheadline / Brand Promise */}
          <p className="mt-2.5 sm:mt-5 text-xs sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-sm px-2 line-clamp-2 sm:line-clamp-none">
            Enjoy private pool villas in Lonavala and Khopoli with fresh home-cooked meals, scenic mountain views, and complete privacy for your family and friends.
          </p>

          {/* 4. Well-Placed Destination Location Badges (2 Buttons Only: Lonavala & Khopoli) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-sm mx-auto mt-3.5 sm:mt-8">
            
            {/* Location 1: Lonavala */}
            <Link
              href="/areas/lonavala"
              className="group relative flex items-center justify-between gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 hover:border-[#DAA520]/60 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_28px_rgba(218,165,32,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-white/[0.16] group-hover:bg-white/[0.28] backdrop-blur-md border border-white/35 group-hover:border-white/60 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] transform group-hover:scale-105 transition-all duration-300">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" strokeWidth={2.2} />
                </div>
                <span className="font-heading font-medium sm:font-semibold text-white text-xs sm:text-sm lg:text-base group-hover:text-[#DAA520] transition-colors leading-tight truncate">
                  Lonavala
                </span>
              </div>
              <ArrowUpRight size={14} className="text-white/50 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </Link>

            {/* Location 2: Khopoli */}
            <Link
              href="/areas/khopoli"
              className="group relative flex items-center justify-between gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xl border border-white/20 hover:border-[#DAA520]/60 shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_28px_rgba(218,165,32,0.2)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-white/[0.16] group-hover:bg-white/[0.28] backdrop-blur-md border border-white/35 group-hover:border-white/60 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.6)] transform group-hover:scale-105 transition-all duration-300">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" strokeWidth={2.2} />
                </div>
                <span className="font-heading font-medium sm:font-semibold text-white text-xs sm:text-sm lg:text-base group-hover:text-[#DAA520] transition-colors leading-tight truncate">
                  Khopoli
                </span>
              </div>
              <ArrowUpRight size={14} className="text-white/50 group-hover:text-[#DAA520] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
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
