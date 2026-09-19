"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface DestinationLocation {
  id: string;
  name: string;
  image: string;
  link: string;
  villaCountText: string;
  villasText: string;
  isComingSoon?: boolean;
  objectPosition?: string;
}

const locations: DestinationLocation[] = [
  {
    id: "lonavala",
    name: "Lonavala",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    link: "/areas/lonavala",
    villaCountText: "2 Luxury Villas",
    villasText: "The Angle House • Willow Peak",
    objectPosition: "object-center",
  },
  {
    id: "khopoli",
    name: "Khopoli",
    image: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
    link: "/areas/khopoli",
    villaCountText: "1 Luxury Villa",
    villasText: "Canopy Crest",
    objectPosition: "object-[center_80%]",
  },
  {
    id: "panchgani",
    name: "Panchgani",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    link: "/areas/panchgani",
    villaCountText: "1 Luxury Villa",
    villasText: "Casa De Reva",
    objectPosition: "object-center",
  },
];

const DestinationShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0); // 0: Lonavala, 1: Khopoli
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const total = locations.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Circular offset calculation: 0 = center, -1 = left, +1 = right
  const getOffset = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="py-14 md:py-24 bg-bg-primary relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[#DAA520]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-2.5 inline-flex items-center gap-1.5 bg-[#DAA520]/15 px-3.5 py-1 rounded-full border border-[#DAA520]/25 shadow-xs">
              <Compass size={12} className="text-[#DAA520]" /> Curated Destinations
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading text-[#1B3564] leading-tight mt-1 font-normal tracking-wide">
              Featured <span className="italic text-[#DAA520]">Destinations</span>
            </h2>
          </motion.div>
        </div>

        {/* 3D Coverflow Gallery Stage (3 Locations: Lonavala, Khopoli & Panchgani) */}
        <div className="relative w-full max-w-5xl mx-auto h-[410px] sm:h-[460px] md:h-[510px] flex items-center justify-center select-none">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Destination"
            className="absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0E1B35]/85 hover:bg-[#DAA520] text-white hover:text-[#0E1B35] border border-white/20 hover:border-[#DAA520] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer group"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Destination"
            className="absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0E1B35]/85 hover:bg-[#DAA520] text-white hover:text-[#0E1B35] border border-white/20 hover:border-[#DAA520] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer group"
          >
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* 3D Perspective Stage */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            {locations.map((loc, idx) => {
              const offset = getOffset(idx);
              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

              // Compute 3D transforms for 3 locations
              let xPos = "0%";
              let zPos = -120;
              let rotY = 0;
              let scale = 0.75;
              let opacity = 0;
              let zIndex = 5;

              if (isCenter) {
                xPos = "0%";
                zPos = 40;
                rotY = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
              } else if (isLeft) {
                xPos = isMobile ? "-56%" : "-70%";
                zPos = -70;
                rotY = 16;
                scale = isMobile ? 0.82 : 0.88;
                opacity = 0.7;
                zIndex = 20;
              } else if (isRight) {
                xPos = isMobile ? "56%" : "70%";
                zPos = -70;
                rotY = -16;
                scale = isMobile ? 0.82 : 0.88;
                opacity = 0.7;
                zIndex = 20;
              }

              return (
                <motion.div
                  key={loc.id}
                  animate={{
                    x: xPos,
                    z: zPos,
                    rotateY: rotY,
                    scale: scale,
                    opacity: opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                    mass: 0.5,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex,
                    pointerEvents: isCenter || isLeft || isRight ? "auto" : "none",
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                    }
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 35 || info.velocity.x > 0.35) {
                      handlePrev();
                    } else if (info.offset.x < -35 || info.velocity.x < -0.35) {
                      handleNext();
                    }
                  }}
                  className={`absolute w-[235px] sm:w-[275px] md:w-[315px] lg:w-[345px] h-[360px] sm:h-[410px] md:h-[460px] rounded-[24px] sm:rounded-[28px] overflow-hidden cursor-pointer select-none transform-gpu will-change-transform transition-shadow duration-300 ${
                    isCenter
                      ? "border-2 border-[#DAA520] shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(218,165,32,0.25)]"
                      : "border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:opacity-85"
                  } bg-[#0E1B35]`}
                >
                  {/* Clean HQ Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={loc.image}
                      alt={`${loc.name}, Maharashtra - Stay Willas`}
                      fill
                      sizes="(max-width: 768px) 80vw, 360px"
                      priority={isCenter}
                      quality={85}
                      className={`object-cover ${loc.objectPosition || "object-center"} transition-transform duration-500 ease-out ${
                        isCenter ? "scale-105" : "scale-100"
                      }`}
                    />
                    
                    {/* Clean Gradient Overlay - Bottom Focused for Maximum Photo Visibility */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isCenter
                          ? "bg-gradient-to-t from-[#071324]/95 via-[#071324]/30 to-transparent"
                          : "bg-gradient-to-t from-[#071324]/95 via-black/40 to-black/30"
                      }`}
                    />
                  </div>

                  {/* Card Content - Streamlined & Minimal to Showcase the Property */}
                  {isCenter ? (
                    <div className="relative z-20 p-5 sm:p-6 flex flex-col items-center justify-end text-white h-full mt-auto w-full text-center pb-5 sm:pb-6">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white text-center tracking-wide uppercase drop-shadow-md">
                        {loc.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#DAA520] font-semibold uppercase tracking-widest mt-1 drop-shadow-sm">
                        {loc.villaCountText}
                      </p>

                      {/* Small Explore Button at the Bottom */}
                      <Link
                        href={loc.link}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3.5 inline-flex items-center gap-1.5 bg-[#DAA520] hover:bg-[#E6B830] text-[#1B3564] font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowUpRight size={13} className="stroke-[2.5]" />
                      </Link>
                    </div>
                  ) : (
                    /* Side Inactive Card: Minimal Location Name + Count */
                    <div className="relative z-20 p-4 sm:p-5 flex flex-col items-center justify-end text-center text-white h-full mt-auto pb-5 w-full">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide uppercase drop-shadow-md">
                        {loc.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#DAA520] font-semibold uppercase tracking-wider mt-0.5">
                        {loc.villaCountText}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicator Dots (2 Dots) */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {locations.map((loc, idx) => (
            <button
              key={loc.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to ${loc.name}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx
                  ? "w-7 h-2 bg-[#DAA520] shadow-[0_0_10px_rgba(218,165,32,0.6)]"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default DestinationShowcase;
