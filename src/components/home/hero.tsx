"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, ChevronLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
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
    image: "/images/villa-lonavala.png",
    tag: "Mountain Escapes",
    title: "Wake Up in the",
    titleItalic: "Clouds",
    desc: "Breathe in the fresh mountain air at our beautiful cliffside homes in Lonavala."
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
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            {/* Ken Burns background effect - keep the zoom slow so it feels nice and dreamy */}
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal" />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Slide title and description content */}
            <div className="relative z-10 h-full flex flex-col justify-center pt-32 px-6 md:px-12 lg:px-24">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <span className="inline-block text-white/60 font-bold tracking-[0.4em] uppercase text-[10px] mb-4">
                    {slide.tag}
                  </span>
                  <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading text-white leading-[1.1] mb-6 pb-2">
                    {slide.title} <br /> 
                    <span className="italic text-gradient pr-4">{slide.titleItalic}</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/70 font-sans max-w-2xl mb-10 leading-relaxed">
                    {slide.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <Link href="/villas" className="btn-glow-gold rounded-full px-10 py-5 text-lg font-bold tracking-widest h-auto group flex items-center justify-center">
                      EXPLORE COLLECTION
                      <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* The custom Swiper navigation arrows in the bottom right corner */}
        <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-4">
          <button className="hero-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all">
            <ChevronLeft size={20} />
          </button>
          <button className="hero-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all">
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
