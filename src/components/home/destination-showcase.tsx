"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Preserved for when Terra Cotta Villa (Mahabaleshwar) goes live:
// {
//   id: "mahabaleshwar",
//   name: "Mahabaleshwar",
//   image: "/images/destinations/TERRA%20COTTA%20FINAL.jpg",
//   link: "/areas/mahabaleshwar",
//   isComingSoon: true
// }

export interface DestinationLocation {
  id: string;
  name: string;
  image: string;
  link: string;
  isComingSoon?: boolean;
}

const locations: DestinationLocation[] = [
  {
    id: "lonavala",
    name: "Lonavala",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    link: "/areas/lonavala",
  },
  {
    id: "khopoli",
    name: "Khopoli",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    link: "/areas/khopoli",
  },
  {
    id: "pawna",
    name: "Pawna Lake",
    image: "/assets/villas/willow-peak/gallery-12.webp",
    link: "/areas/pawna",
  }
];

const DestinationShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to middle card (Khopoli)
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
    setActiveIndex((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Linear offset calculation (no circular looping): returns negative for left, 0 for center, positive for right
  const getOffset = (index: number) => {
    return index - activeIndex;
  };

  return (
    <section className="py-12 md:py-20 bg-bg-primary relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#DAA520]/5 rounded-full blur-[130px] pointer-events-none" />

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

        {/* 3D Coverflow Gallery Stage - Spread out to acquire more horizontal space */}
        <div className="relative w-full max-w-6xl xl:max-w-7xl mx-auto h-[380px] sm:h-[430px] md:h-[470px] flex items-center justify-center select-none">
          
          {/* Left Arrow Button (disabled at left edge) */}
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous Location"
            className="absolute left-1 sm:left-3 md:left-5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0E1B35]/85 hover:bg-[#DAA520] disabled:opacity-20 disabled:hover:bg-[#0E1B35]/85 disabled:hover:text-white disabled:cursor-not-allowed disabled:hover:scale-100 text-white hover:text-[#0E1B35] border border-white/20 hover:border-[#DAA520] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer group"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Right Arrow Button (disabled at right edge) */}
          <button
            onClick={handleNext}
            disabled={activeIndex === total - 1}
            aria-label="Next Location"
            className="absolute right-1 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0E1B35]/85 hover:bg-[#DAA520] disabled:opacity-20 disabled:hover:bg-[#0E1B35]/85 disabled:hover:text-white disabled:cursor-not-allowed disabled:hover:scale-100 text-white hover:text-[#0E1B35] border border-white/20 hover:border-[#DAA520] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer group"
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

              // Compute 3D transforms with generous horizontal spread
              let xPos = "0%";
              let zPos = 0;
              let rotY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;

              if (isCenter) {
                xPos = "0%";
                zPos = 40;
                rotY = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
              } else if (isLeft) {
                xPos = isMobile ? "-74%" : "-94%";
                zPos = -70;
                rotY = 16;
                scale = isMobile ? 0.84 : 0.88;
                opacity = 0.75;
                zIndex = 20;
              } else if (isRight) {
                xPos = isMobile ? "74%" : "94%";
                zPos = -70;
                rotY = -16;
                scale = isMobile ? 0.84 : 0.88;
                opacity = 0.75;
                zIndex = 20;
              } else if (offset <= -2) {
                xPos = isMobile ? "-130%" : "-178%";
                zPos = -160;
                rotY = 24;
                scale = isMobile ? 0.72 : 0.78;
                opacity = 0.35;
                zIndex = 10;
              } else {
                // offset >= 2
                xPos = isMobile ? "130%" : "178%";
                zPos = -160;
                rotY = -24;
                scale = isMobile ? 0.72 : 0.78;
                opacity = 0.35;
                zIndex = 10;
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
                    stiffness: 210,
                    damping: 25,
                    mass: 0.75,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex,
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
                  className={`absolute w-[225px] sm:w-[265px] md:w-[295px] lg:w-[315px] h-[340px] sm:h-[390px] md:h-[430px] rounded-[24px] sm:rounded-[28px] overflow-hidden cursor-pointer select-none transition-shadow duration-500 ${
                    isCenter
                      ? "border-2 border-[#DAA520] shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(218,165,32,0.3)]"
                      : "border border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:opacity-80"
                  } bg-[#0E1B35]`}
                >
                  {/* Clean HQ Background Image (No text watermarks) */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={loc.image}
                      alt={`${loc.name}, Maharashtra`}
                      fill
                      sizes="(max-width: 768px) 80vw, 350px"
                      priority={isCenter}
                      quality={85}
                      className={`object-cover transition-transform duration-700 ease-out ${
                        isCenter ? "scale-105" : "scale-100 filter brightness-65"
                      }`}
                    />
                    
                    {/* Clean Gradient Overlay */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isCenter
                          ? "bg-gradient-to-t from-[#071324] via-[#0E1B35]/35 to-black/15 opacity-90"
                          : "bg-gradient-to-t from-[#071324] via-black/55 to-black/40 opacity-95"
                      }`}
                    />
                  </div>

                  {/* Card Content */}
                  {isCenter ? (
                    /* Center Card: Clean Location Name + Explore Button */
                    <motion.div
                      key={`center-${loc.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 }}
                      className="relative z-20 p-5 sm:p-6 flex flex-col items-center justify-end text-white h-full mt-auto"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                        <MapPin size={13} className="text-[#DAA520]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DAA520]">
                          Maharashtra
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3 text-center tracking-wide uppercase">
                        {loc.name}
                      </h3>

                      {/* Clean Explore Button */}
                      <Link
                        href={loc.link}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-[#DAA520] hover:bg-[#E6B830] text-[#1B3564] font-black py-2.5 sm:py-3 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_20px_rgba(218,165,32,0.45)] transition-all duration-300 group/btn"
                      >
                        <span>Explore</span>
                        <ArrowUpRight
                          size={14}
                          className="stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                        />
                      </Link>
                    </motion.div>
                  ) : (
                    /* Side Cards: Clean, minimal location name at bottom */
                    <div className="relative z-20 p-5 flex flex-col items-center justify-end text-center text-white h-full mt-auto pb-6">
                      <div className="flex items-center gap-1.5 mb-1.5 opacity-85">
                        <MapPin size={12} className="text-[#DAA520]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#DAA520]">
                          Maharashtra
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-heading font-bold text-white tracking-wide uppercase">
                        {loc.name}
                      </h3>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
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
