"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, EffectCoverflow, Mousewheel } from "swiper/modules";
import { ArrowUpRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";

const destinations = [
  {
    name: "Lonavala",
    image: "/assets/villas/angled-house/gallery-11.webp",
    count: "1 Villa",
    tag: "Mountain Escapes",
    desc: "Cool breeze, misty green hills, and quiet retreats.",
    isLaunchingSoon: false,
    link: "/villas?region=lonavala"
  },
  {
    name: "Karjat",
    image: "/assets/villas/karjat-river-house/main.png",
    count: "LAUNCHING SOON",
    tag: "Riverside Views",
    desc: "Green valleys, quiet rivers, and pure relaxation.",
    isLaunchingSoon: true,
    link: "/partner"
  },
  {
    name: "Igatpuri",
    image: "/assets/villas/igatpuri-clouds-villa/main.png",
    count: "LAUNCHING SOON",
    tag: "Mountain Views",
    desc: "Mist-laden Western Ghats, waterfalls, and peaceful retreats.",
    isLaunchingSoon: true,
    link: "/partner"
  },
  {
    name: "Alibaug",
    image: "/assets/villas/alibaug-palms-beachhouse/main.png",
    count: "LAUNCHING SOON",
    tag: "Beachside Stays",
    desc: "Golden sand beaches, pools, and beautiful sunsets.",
    isLaunchingSoon: true,
    link: "/partner"
  },
  {
    name: "Khopoli",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1000",
    count: "LAUNCHING SOON",
    tag: "Nature Getaways",
    desc: "Scenic foothills, waterfalls, and green valleys near the hills.",
    isLaunchingSoon: true,
    link: "/partner"
  },
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    count: "LAUNCHING SOON",
    tag: "Coastal Paradise",
    desc: "Boho-chic beach villas, Portuguese architecture, and ocean breezes.",
    isLaunchingSoon: true,
    link: "/partner"
  }
];

const DestinationShowcase = () => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (!swiperInstance) return;

    const swiperEl = swiperInstance.el;
    if (!swiperEl) return;

    const handleWheel = (e: WheelEvent) => {
      const swiper = swiperInstance;
      const { deltaY, deltaX } = e;

      // Only intercept if vertical scrolling is the primary intent
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        const isAtBeginning = swiper.isBeginning;
        const isAtEnd = swiper.isEnd;

        // If scrolling down and not at the end, or scrolling up and not at the beginning,
        // intercept the wheel event so it doesn't propagate to native vertical scrolling.
        if ((deltaY > 0 && !isAtEnd) || (deltaY < 0 && !isAtBeginning)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    swiperEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      swiperEl.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className="py-32 bg-bg-primary relative overflow-hidden">
      {/* Elegant Gold Wave Lines - Left Boundary Overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none select-none z-0">
        <svg className="w-full h-full text-[#DAA520]" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 100 C 100 150, 50 350, -50 400" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-30 80 C 120 130, 70 330, -30 380" stroke="currentColor" strokeWidth="1" />
          <path d="M-10 60 C 140 110, 90 310, -10 360" stroke="currentColor" strokeWidth="0.75" />
          <path d="M-50 450 C 100 500, 50 700, -50 750" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-30 430 C 120 480, 70 680, -30 730" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Elegant Gold Wave Lines - Right Boundary Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none select-none z-0">
        <svg className="w-full h-full text-[#DAA520]" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M250 100 C 100 150, 150 350, 250 400" stroke="currentColor" strokeWidth="1.5" />
          <path d="M230 80 C 80 130, 130 330, 230 380" stroke="currentColor" strokeWidth="1" />
          <path d="M210 60 C 60 110, 110 310, 210 360" stroke="currentColor" strokeWidth="0.75" />
          <path d="M250 450 C 100 500, 150 700, 250 750" stroke="currentColor" strokeWidth="1.5" />
          <path d="M230 430 C 80 480, 130 680, 230 730" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Background Decorative Text - Premium Ghost Gold */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-[#1B3564]/3 whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter">
        Explore
      </div>

      {/* Ambient gold glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-[120px]" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-6 md:px-12">
          <div>
            <span className="text-[#DAA520] font-bold tracking-[0.3em] uppercase text-xs mb-4 inline-block bg-[#DAA520]/15 px-4.5 py-2 rounded-full border border-[#DAA520]/20">
              🗺️ Where Do You Want To Go?
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading text-[#1B3564] leading-tight mt-6 font-normal tracking-wide">
              Find Your <span className="italic text-[#DAA520]">Perfect Spot</span>
            </h2>
            {/* Scroll guideline */}
            <div className="flex items-center gap-3 mt-8 text-xs uppercase tracking-[0.3em] text-[#DAA520]/80 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse"></span>
              <span>Scroll or drag to explore stays</span>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button className="dest-prev w-12 h-12 rounded-full border border-[#1B3564]/30 flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564] hover:border-[#1B3564] hover:text-white transition-all duration-300 group cursor-pointer">
              <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="dest-next w-12 h-12 rounded-full border border-[#1B3564]/30 flex items-center justify-center text-[#1B3564] hover:bg-[#1B3564] hover:border-[#1B3564] hover:text-white transition-all duration-300 group cursor-pointer">
              <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Scrollbar, EffectCoverflow, Mousewheel]}
          effect={"coverflow"}
          centeredSlides={true}
          grabCursor={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 15,
            stretch: -20,
            depth: 150,
            modifier: 1.1,
            slideShadows: false,
          }}
          navigation={{
            prevEl: ".dest-prev",
            nextEl: ".dest-next",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          scrollbar={{ draggable: true, el: ".dest-scrollbar" }}
          mousewheel={{
            releaseOnEdges: true,
          }}
          className="dest-swiper py-16"
        >
          {destinations.map((dest) => (
            <SwiperSlide key={dest.name} className="max-w-[320px] md:max-w-[400px] px-4">
              <ThreeDHoverCard
                maxTilt={8}
                scale={1.04}
                lift={-12}
                className="rounded-3xl shadow-lg"
              >
                <Link
                  href={dest.link}
                  className="block relative aspect-[3/4] w-full h-full rounded-3xl overflow-hidden group border border-[#DAA520]/25 cursor-pointer shadow-xl shadow-black/20 hover:border-[#DAA520]/75 hover:shadow-[0_0_35px_rgba(218,165,32,0.45)] transition-all duration-500"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 400px"
                    loading="lazy"
                    quality={75}
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                    {/* Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4 w-full">
                      <div className="flex items-center gap-2 text-[#DAA520] text-[11px] font-bold uppercase tracking-[0.3em]">
                        <MapPin size={13} className="stroke-[2.5]" />
                        {dest.tag}
                      </div>

                      {dest.isLaunchingSoon && (
                        <span className="text-[8px] font-black uppercase tracking-wider bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/30 px-2 py-0.5 rounded-full shrink-0">
                          LAUNCHING SOON
                        </span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-heading text-[#F5F2EA] mb-3 italic pr-4 font-normal tracking-wide">
                      {dest.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/80 text-xs md:text-sm mb-8 max-w-[260px] leading-relaxed font-light">
                      {dest.desc}
                    </p>
                    
                    {/* CTA / Partner with us Option */}
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-3 group/btn">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#DAA520] to-[#E6B830] text-slate-950 flex items-center justify-center group-hover/btn:scale-110 transition-all duration-300 shadow-md">
                          <ArrowUpRight size={18} className="stroke-[2.5]" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#F5F2EA]">
                          {dest.count}
                        </span>
                      </div>

                      {dest.isLaunchingSoon && (
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#DAA520] hover:text-[#E6B830] transition-colors border-b border-transparent hover:border-[#DAA520]/60 pb-0.5 shrink-0 z-20">
                          Partner with us →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </ThreeDHoverCard>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Side Arrow Buttons - Premium */}
        <div className="hidden xl:block absolute top-[55%] left-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-prev pointer-events-auto w-16 h-16 rounded-full bg-white/70 hover:bg-[#1B3564] hover:text-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564] hover:shadow-lg hover:scale-105 transition-all duration-300 group backdrop-blur-md cursor-pointer">
            <ChevronLeft size={28} className="group-hover:scale-125 transition-transform" />
          </button>
        </div>
        <div className="hidden xl:block absolute top-[55%] right-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-next pointer-events-auto w-16 h-16 rounded-full bg-white/70 hover:bg-[#1B3564] hover:text-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564] hover:shadow-lg hover:scale-105 transition-all duration-300 group backdrop-blur-md cursor-pointer">
            <ChevronRight size={28} className="group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Custom Enhanced Scrollbar Bar */}
        <div className="max-w-2xl mx-auto mt-16 px-12">
          <div className="dest-scrollbar h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden relative cursor-pointer" />
        </div>
      </div>

      <style jsx global>{`
        .dest-swiper .swiper-pagination-bullet {
          background: rgba(218, 165, 32, 0.3);
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .dest-swiper .swiper-pagination-bullet-active {
          background: #DAA520;
          width: 24px;
          border-radius: 4px;
        }
        .dest-scrollbar {
          height: 10px !important;
          background: rgba(218, 165, 32, 0.1) !important;
          border: 1px solid rgba(218, 165, 32, 0.2) !important;
          border-radius: 9999px !important;
        }
        .dest-scrollbar .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #DAA520 0%, #B8860B 100%) !important;
          height: 100% !important;
          border-radius: 9999px !important;
          box-shadow: 0 0 12px rgba(218, 165, 32, 0.4);
          transition: all 0.3s ease;
        }
        .dest-scrollbar:hover .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #E6B830 0%, #DAA520 100%) !important;
          box-shadow: 0 0 18px rgba(218, 165, 32, 0.6);
        }
      `}</style>
    </section>
  );
};

export default DestinationShowcase;
