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
        // intercept the wheel event so it doesn't propagate to Lenis or trigger native vertical scrolling.
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
    <section className="py-32 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-blue-100/30 whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter">
        Explore
      </div>

      {/* Ambient gradient */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-[120px]" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 px-6 md:px-12">
          <div>
            <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 inline-block bg-blue-50 px-4 py-2 rounded-full">
              🗺️ Where Do You Want To Go?
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading text-text-primary leading-tight mt-6">
              Find Your <span className="italic bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Perfect Spot</span>
            </h2>
            {/* Scroll guideline */}
            <div className="flex items-center gap-3 mt-8 text-xs uppercase tracking-[0.3em] text-blue-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Scroll or drag to explore</span>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button className="dest-prev w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center text-text-primary hover:bg-blue-500 hover:border-blue-500 hover:text-white hover:shadow-lg transition-all duration-300 group">
              <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="dest-next w-12 h-12 rounded-full border border-blue-200 flex items-center justify-center text-text-primary hover:bg-blue-500 hover:border-blue-500 hover:text-white hover:shadow-lg transition-all duration-300 group">
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
          className="dest-swiper py-20"
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
                  className="block relative aspect-[3/4] w-full h-full rounded-3xl overflow-hidden group border border-white/10 cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                    {/* Tag */}
                    <div className="flex items-center gap-2 text-blue-200 text-[11px] font-bold uppercase tracking-[0.3em] mb-6">
                      <MapPin size={13} />
                      {dest.tag}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-heading text-white mb-4 italic pr-4">
                      {dest.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/75 text-sm mb-10 max-w-[260px] leading-relaxed font-light">
                      {dest.desc}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center gap-4 group/btn">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 text-white flex items-center justify-center group-hover/btn:scale-110 transition-all duration-300 shadow-lg">
                        <ArrowUpRight size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white">{dest.count}</span>
                    </div>
                  </div>
                </Link>
              </ThreeDHoverCard>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Side Arrow Buttons - Premium */}
        <div className="hidden xl:block absolute top-[55%] left-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-prev pointer-events-auto w-16 h-16 rounded-full glass-premium border-blue-200/50 flex items-center justify-center text-text-primary hover:text-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
            <ChevronLeft size={28} className="group-hover:scale-125 transition-transform" />
          </button>
        </div>
        <div className="hidden xl:block absolute top-[55%] right-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-next pointer-events-auto w-16 h-16 rounded-full glass-premium border-blue-200/50 flex items-center justify-center text-text-primary hover:text-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Custom Enhanced Scrollbar Bar */}
        <div className="max-w-2xl mx-auto mt-16 px-12">
          <div className="dest-scrollbar h-2.5 bg-text-primary/8 border border-border-subtle rounded-full overflow-hidden relative cursor-pointer" />
        </div>
      </div>

      <style jsx global>{`
        .dest-swiper .swiper-pagination-bullet {
          background: rgba(37, 99, 235, 0.3);
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .dest-swiper .swiper-pagination-bullet-active {
          background: #3B82F6;
          width: 24px;
          border-radius: 4px;
        }
        .dest-scrollbar {
          height: 10px !important;
          background: #DBEAFE !important;
          border: 1px solid #BFDBFE !important;
          border-radius: 9999px !important;
        }
        .dest-scrollbar .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%) !important;
          height: 100% !important;
          border-radius: 9999px !important;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }
        .dest-scrollbar:hover .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%) !important;
          box-shadow: 0 0 18px rgba(37, 99, 235, 0.6);
        }
      `}</style>
    </section>
  );
};

export default DestinationShowcase;
