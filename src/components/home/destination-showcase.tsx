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
    image: "/assets/villas/misty-mornings-cliffhouse/main.png",
    count: "12 Villas",
    tag: "Mountain Escapes",
    desc: "Cool breeze, misty green hills, and quiet retreats."
  },
  {
    name: "Alibaug",
    image: "/assets/villas/alibaug-palms-beachhouse/main.png",
    count: "8 Villas",
    tag: "Beachside Stays",
    desc: "Golden sand beaches, pools, and beautiful sunsets."
  },
  {
    name: "Nashik",
    image: "/assets/villas/lakeview-vineyard-villa/main.png",
    count: "5 Villas",
    tag: "Vineyards & Hills",
    desc: "Stunning lakefront stays, wine tasting, and perfect weather."
  },
  {
    name: "Karjat",
    image: "/assets/villas/karjat-river-house/main.png",
    count: "7 Villas",
    tag: "Riverside Views",
    desc: "Green valleys, quiet rivers, and pure relaxation."
  },
  {
    name: "Mulshi",
    image: "/assets/villas/mulshi-lakehouse/main.png",
    count: "4 Villas",
    tag: "By the Lake",
    desc: "Gorgeous views of the blue water right outside your room."
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
    <section className="py-32 bg-gradient-to-b from-[#4A5D23] via-[#2D3D16] to-[#16210A] relative overflow-hidden">
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
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-[#DAA520]/5 whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter">
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
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading text-[#F5F2EA] leading-tight mt-6 font-normal tracking-wide">
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
            <button className="dest-prev w-12 h-12 rounded-full border border-[#DAA520]/30 flex items-center justify-center text-[#F5F2EA] hover:bg-[#DAA520] hover:border-[#DAA520] hover:text-slate-950 transition-all duration-300 group cursor-pointer">
              <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="dest-next w-12 h-12 rounded-full border border-[#DAA520]/30 flex items-center justify-center text-[#F5F2EA] hover:bg-[#DAA520] hover:border-[#DAA520] hover:text-slate-950 transition-all duration-300 group cursor-pointer">
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
                  href={`/villas?region=${dest.name.toLowerCase()}`}
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
                    <div className="flex items-center gap-2 text-[#DAA520] text-[11px] font-bold uppercase tracking-[0.3em] mb-4">
                      <MapPin size={13} className="stroke-[2.5]" />
                      {dest.tag}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-heading text-[#F5F2EA] mb-3 italic pr-4 font-normal tracking-wide">
                      {dest.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/80 text-xs md:text-sm mb-8 max-w-[260px] leading-relaxed font-light">
                      {dest.desc}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center gap-4 group/btn">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#DAA520] to-[#E6B830] text-slate-950 flex items-center justify-center group-hover/btn:scale-110 transition-all duration-300 shadow-md">
                        <ArrowUpRight size={18} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#F5F2EA]">{dest.count}</span>
                    </div>
                  </div>
                </Link>
              </ThreeDHoverCard>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Side Arrow Buttons - Premium */}
        <div className="hidden xl:block absolute top-[55%] left-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-prev pointer-events-auto w-16 h-16 rounded-full bg-white/10 hover:bg-[#DAA520] hover:text-slate-950 border border-white/20 flex items-center justify-center text-white hover:shadow-lg hover:scale-105 transition-all duration-300 group backdrop-blur-md cursor-pointer">
            <ChevronLeft size={28} className="group-hover:scale-125 transition-transform" />
          </button>
        </div>
        <div className="hidden xl:block absolute top-[55%] right-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-next pointer-events-auto w-16 h-16 rounded-full bg-white/10 hover:bg-[#DAA520] hover:text-slate-950 border border-white/20 flex items-center justify-center text-white hover:shadow-lg hover:scale-105 transition-all duration-300 group backdrop-blur-md cursor-pointer">
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
