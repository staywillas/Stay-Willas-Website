"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronRight, Play, ChevronLeft } from "lucide-react";

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
              {/* Ken Burns background effect - keep the zoom slow so it feels nice and dreamy */}
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
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal" />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Slide title and description content */}
              <div className="relative z-10 h-full flex flex-col justify-start pt-32 md:pt-36 lg:pt-40 pb-16 px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <span className="inline-block text-[#FFCC00] font-bold tracking-[0.5em] uppercase text-xs mb-4 block drop-shadow-[0_0_10px_rgba(255,204,0,0.1)]">
                          {slide.tag}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-heading text-white leading-[1.1] mb-4 pb-1">
                          {slide.title} <br /> 
                          <span className="italic text-gradient-yellow pr-4 font-heading font-medium">{slide.titleItalic}</span>
                        </h1>
                        <p className="text-base md:text-lg text-white/80 font-sans max-w-2xl mb-8 leading-relaxed tracking-wide">
                          {slide.desc}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          <Link href="/villas" className="bg-[#FFCC00] hover:bg-[#FFD700] text-black font-extrabold rounded-full px-8 py-4 text-sm md:text-base tracking-widest h-auto group flex items-center justify-center shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.5)] transition-all duration-300">
                            EXPLORE COLLECTION
                            <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
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

        {/* The custom Swiper navigation arrows in the bottom right corner - shifted left to prevent chatbot collision */}
        <div className="absolute bottom-12 right-32 z-20 hidden md:flex items-center gap-4">
          <button className="hero-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:text-charcoal transition-all cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <button className="hero-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:text-charcoal transition-all cursor-pointer">
            <ChevronRight size={20} />
          </button>
        </div>
      </Swiper>
      
      {/* Small rotated branding line on the right side */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 hidden lg:flex flex-col gap-10 pr-10 items-center z-20">
        <div className="w-px h-24 bg-white/10" />
        <span className="rotate-90 text-white/20 text-[10px] tracking-[0.5em] uppercase whitespace-nowrap">STAY WILLAS</span>
        <div className="w-px h-24 bg-white/10" />
      </div>
    </section>
  );
};

export default Hero;
