"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import BookingBar from "@/components/home/booking-bar";

const slides = [
  {
    id: "the-angle-house",
    name: "The Angle House",
    location: "Lonavala",
    tagline: "Signature Glass Villa & Waterfall Pool",
    image: "/images/destinations/ANGLE%20HOUSE%20FINAL.jpg",
    href: "/villa/the-angle-house",
  },
  {
    id: "canopy-crest",
    name: "Canopy Crest",
    location: "Khopoli",
    tagline: "4 BHK Forest Sanctuary & 22ft Private Pool",
    image: "/images/destinations/CANOPY%20CREST%20-2.png",
    href: "/villa/canopy-crest",
  },
  {
    id: "willow-peak",
    name: "Willow Peak",
    location: "Lonavala",
    tagline: "A-Frame Chalets with Private Jacuzzi",
    image: "/images/destinations/WILLOW%20PEAK%20-%202.jpeg",
    href: "/villa/willow-peak",
  },
];

const locations = [
  { name: "Lonavala", href: "/areas/lonavala" },
  { name: "Khopoli", href: "/areas/khopoli" },
];

const slideVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.9,
    scale: 1.03,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.9 },
      opacity: { duration: 0.45 },
      scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-32%" : "32%",
    opacity: 0.2,
    scale: 0.95,
    transition: {
      x: { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.9 },
      opacity: { duration: 0.45 },
      scale: { duration: 0.45 },
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

  // 5-second automatic rotation, cleanly paused when hovering over carousel or booking controls
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [paginate, isHovered, page]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      paginate(1);
    } else if (diff < -50) {
      paginate(-1);
    }
    setTouchStartX(null);
  };

  return (
    <section 
      className="relative w-full bg-[#0E1B35] pt-24 sm:pt-28 md:pt-30 pb-6 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Showcase Slider Container */}
      <div className="max-w-[1560px] 2xl:max-w-[1680px] w-full mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Stage Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9.2] min-h-[500px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[660px] max-h-[86vh] rounded-2xl md:rounded-3xl shadow-2xl border border-white/10">
          
          {/* Inner Image Carousel with rounded corners & overflow-hidden */}
          <div className="absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
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
                  className="relative block w-full h-full cursor-pointer group"
                  aria-label={`View ${currentSlide.name}`}
                >
                  {/* Ken Burns Subtle Ambient Drift */}
                  <motion.div
                    className="relative w-full h-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.045 }}
                    transition={{ duration: 6, ease: "linear" }}
                  >
                    <Image
                      src={currentSlide.image}
                      alt={currentSlide.name}
                      fill
                      priority={true}
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1536px) 1560px, 1680px"
                      className="object-cover object-center"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Current Property Showcase Badge (Top-Left) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg text-white"
                >
                  <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse shrink-0" />
                  <span className="font-heading font-bold text-xs sm:text-sm tracking-wide text-white">
                    {currentSlide.name}
                  </span>
                  <span className="text-white/40 text-xs">•</span>
                  <span className="text-xs text-[#DAA520] font-semibold">{currentSlide.location}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left / Right Arrow Controls */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                paginate(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#DAA520] text-white hover:text-[#1B3564] backdrop-blur-md border border-white/20 hover:border-[#DAA520] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} className="sm:size-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                paginate(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#DAA520] text-white hover:text-[#1B3564] backdrop-blur-md border border-white/20 hover:border-[#DAA520] flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} className="sm:size-6" />
            </button>
          </div>

          {/* INSIDE AT THE BOTTOM OF THE HERO IMAGE: 3 Location Buttons, Slide Dots & Booking Bar */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
            <div className="max-w-[1100px] w-full mx-auto pointer-events-auto flex flex-col items-center gap-2 sm:gap-2.5">
              
              {/* Top Controls Row: 3 Location Buttons & Slide Indicator Dots */}
              <div className="flex flex-wrap items-center justify-between gap-2 w-full px-1 sm:px-2">
                {/* 3 Small Location Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 z-20">
                  {locations.map((loc) => (
                    <Link
                      key={loc.name}
                      href={loc.href}
                      className="inline-flex items-center gap-1.5 bg-black/60 hover:bg-[#DAA520] text-white hover:text-[#1B3564] backdrop-blur-md border border-white/25 hover:border-[#DAA520] rounded-full px-3 sm:px-3.5 py-1 text-xs font-bold tracking-wide transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                    >
                      <MapPin size={12} className="text-[#DAA520] group-hover:text-[#1B3564]" />
                      <span>{loc.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Slide Indicator Dots with Glowing Pill Active State */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`transition-all duration-500 rounded-full cursor-pointer border-none ${
                        currentIndex === idx
                          ? "w-7 h-2 bg-[#DAA520] shadow-[0_0_8px_rgba(218,165,32,0.8)]"
                          : "w-2 h-2 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Booking Bar on the Image at Bottom */}
              <BookingBar className="my-0 px-0 w-full" />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
