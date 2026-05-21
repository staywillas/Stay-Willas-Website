"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const slides = [
  {
    image: "/images/hero-villa.png",
    tag: "Our Handpicked Homes",
    title: "Your Perfect",
    titleItalic: "Getaway",
    desc: "We've found the most beautiful homes in Maharashtra so you don't have to. Come in, relax, and make yourself at home."
  },
  {
    image: "/assets/villas/angled-house/main.webp",
    tag: "Infinity Pools & Modern Design",
    title: "The Iconic",
    titleItalic: "Angled House",
    desc: "Where modern architecture meets slow luxury — our stunning designer villa in Lonavala, crafted for unforgettable escapes."
  },
  {
    image: "/images/villa-alibaug.png",
    tag: "Beachside Stays",
    title: "Steps from the",
    titleItalic: "Sand",
    desc: "Slow down and listen to the waves at our gorgeous beachfront houses in Alibaug."
  }
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-screen w-full overflow-hidden">
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
                {/* Premium overlay with multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
              </div>

              {/* Slide content */}
              <div className="relative z-10 h-full flex flex-col justify-start pt-28 md:pt-32 lg:pt-40 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        {/* Tag — Premium Badge */}
                        <span className="inline-block text-[#3B82F6] bg-white/10 backdrop-blur-xl border border-white/20 font-bold tracking-[0.4em] uppercase text-xs mb-8 px-6 py-3 rounded-full block w-fit shadow-lg shadow-blue-500/20 hover:bg-white/15 transition-all duration-300">
                          ✨ {slide.tag}
                        </span>
                        
                        {/* Main Heading - Premium Typography */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading text-white leading-[0.95] mb-6 font-bold tracking-tighter">
                          {slide.title} <br /> 
                          <span className="italic text-gradient-yellow pr-4 font-heading font-medium bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">{slide.titleItalic}</span>
                        </h1>
                        
                        {/* Subtitle - Refined */}
                        <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mb-10 leading-relaxed tracking-wide">
                          {slide.desc}
                        </p>

                        {/* CTA Section - Enhanced */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          <Link href="/villas" className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full px-8 py-4 text-sm md:text-base tracking-widest uppercase h-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                              EXPLORE COLLECTION
                              <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                            </span>
                          </Link>
                          <Link href="/contact" className="flex items-center gap-3 text-white/80 hover:text-white font-medium tracking-widest uppercase text-sm transition-all duration-300 border-b border-white/40 hover:border-white pb-1 hover:gap-4">
                            Talk to Concierge
                            <ChevronRight size={14} />
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

        {/* Swiper navigation arrows */}
        <div className="absolute bottom-12 right-32 z-20 hidden md:flex items-center gap-4">
          <button className="hero-prev w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-blue-500 hover:border-blue-500 transition-all cursor-pointer backdrop-blur-md hover:shadow-lg hover:shadow-blue-500/40 group">
            <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="hero-next w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-blue-500 hover:border-blue-500 transition-all cursor-pointer backdrop-blur-md hover:shadow-lg hover:shadow-blue-500/40 group">
            <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </Swiper>
      
      {/* Rotated branding line */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden lg:flex flex-col gap-10 pr-10 items-center z-20">
        <div className="w-px h-24 bg-white/20" />
        <span className="rotate-90 text-white/30 text-[10px] tracking-[0.5em] uppercase whitespace-nowrap font-light">Luxury Escapes</span>
        <div className="w-px h-24 bg-white/20" />
      </div>
    </section>
  );
};

export default Hero;
