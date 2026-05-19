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
    <section className="py-32 bg-charcoal relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-white/5 whitespace-nowrap pointer-events-none select-none uppercase tracking-tighter">
        Places to Go
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 px-6 md:px-12">
          <div>
            <span className="text-white/40 font-bold tracking-[0.5em] uppercase text-[9px] mb-4 block">
              Where Do You Want To Go?
            </span>
            <h2 className="text-5xl md:text-7xl font-heading text-white leading-tight">
              Find Your <span className="text-gradient-yellow font-heading font-medium italic">Spot</span>
            </h2>
            {/* Elegant, glowing scroll guideline instruction */}
            <div className="flex items-center gap-3 mt-6 text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
              <span>Scroll or drag to see destinations</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="dest-prev w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="dest-next w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

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
                className="rounded-[32px]"
              >
                <Link
                  href={`/villas?region=${dest.name.toLowerCase()}`}
                  className="block relative aspect-[3/4] w-full h-full rounded-[32px] overflow-hidden group border border-white/5 cursor-pointer"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <MapPin size={12} />
                      {dest.tag}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-heading text-white mb-4 italic pr-4">{dest.name}</h3>
                    <p className="text-white/60 text-sm mb-8 max-w-[250px] leading-relaxed">
                      {dest.desc}
                    </p>
                    
                    <div className="flex items-center gap-4 group/btn">
                      <div className="w-12 h-12 rounded-full bg-[#FFCC00] group-hover:bg-[#FFD700] text-charcoal flex items-center justify-center group-hover/btn:scale-110 transition-all duration-300">
                        <ArrowUpRight size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white">{dest.count}</span>
                    </div>
                  </div>
                </Link>
              </ThreeDHoverCard>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Side Arrow Buttons - Cinematic Desktop Overlay */}
        <div className="hidden xl:block absolute top-[58%] left-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-prev pointer-events-auto w-16 h-16 rounded-full bg-charcoal/85 backdrop-blur-md border border-white/10 hover:border-gold/50 flex items-center justify-center text-white hover:text-gold hover:scale-105 shadow-2xl transition-all duration-300">
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="hidden xl:block absolute top-[58%] right-8 -translate-y-1/2 z-30 pointer-events-none">
          <button className="dest-next pointer-events-auto w-16 h-16 rounded-full bg-charcoal/85 backdrop-blur-md border border-white/10 hover:border-gold/50 flex items-center justify-center text-white hover:text-gold hover:scale-105 shadow-2xl transition-all duration-300">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Custom Enhanced Scrollbar Bar */}
        <div className="max-w-2xl mx-auto mt-16 px-12">
          <div className="dest-scrollbar h-2.5 bg-white/5 border border-white/5 rounded-full overflow-hidden relative cursor-pointer" />
        </div>
      </div>

      <style jsx global>{`
        .dest-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.2);
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .dest-swiper .swiper-pagination-bullet-active {
          background: #c5a059;
          width: 24px;
          border-radius: 4px;
        }
        .dest-scrollbar {
          height: 10px !important;
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 9999px !important;
        }
        .dest-scrollbar .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #c5a059, #e5c07b) !important;
          height: 100% !important;
          border-radius: 9999px !important;
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.4);
          transition: all 0.3s ease;
        }
        .dest-scrollbar:hover .swiper-scrollbar-drag {
          background: linear-gradient(90deg, #e5c07b, #f5d08b) !important;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.6);
        }
      `}</style>
    </section>
  );
};

export default DestinationShowcase;
