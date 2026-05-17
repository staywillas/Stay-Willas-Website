"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { ArrowUpRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const destinations = [
  {
    name: "Lonavala",
    image: "/images/villa-lonavala.png",
    count: "12 Villas",
    tag: "Mountain Escapes",
    desc: "Cool breeze, misty green hills, and quiet retreats."
  },
  {
    name: "Alibaug",
    image: "/images/villa-alibaug.png",
    count: "8 Villas",
    tag: "Beachside Stays",
    desc: "Golden sand beaches, pools, and beautiful sunsets."
  },
  {
    name: "Nashik",
    image: "/images/exp-chef.png",
    count: "5 Villas",
    tag: "Vineyards & Hills",
    desc: "Stunning lakefront stays, wine tasting, and perfect weather."
  },
  {
    name: "Karjat",
    image: "/images/hero-villa.png",
    count: "7 Villas",
    tag: "Riverside Views",
    desc: "Green valleys, quiet rivers, and pure relaxation."
  },
  {
    name: "Mulshi",
    image: "/images/exp-pool.png",
    count: "4 Villas",
    tag: "By the Lake",
    desc: "Gorgeous views of the blue water right outside your room."
  }
];

const DestinationShowcase = () => {
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
            <h2 className="text-5xl md:text-7xl font-heading text-white italic text-shadow">
              Find Your <span className="text-white/20 not-italic font-bold">Spot</span>
            </h2>
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
          modules={[EffectCoverflow, Navigation, Pagination, Scrollbar]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true,
          }}
          navigation={{
            prevEl: ".dest-prev",
            nextEl: ".dest-next",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          scrollbar={{ draggable: true, el: ".dest-scrollbar" }}
          className="dest-swiper py-20"
        >
          {destinations.map((dest) => (
            <SwiperSlide key={dest.name} className="max-w-[320px] md:max-w-[400px]">
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden group shadow-2xl border border-white/5">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
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
                  
                  <Link 
                    href={`/villas?region=${dest.name.toLowerCase()}`}
                    className="flex items-center gap-4 group/btn"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold text-charcoal flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">{dest.count}</span>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Scrollbar Bar */}
        <div className="max-w-xl mx-auto mt-12 px-12">
          <div className="dest-scrollbar h-1 bg-white/10 rounded-full overflow-hidden" />
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
        .dest-scrollbar .swiper-scrollbar-drag {
          background: #c5a059 !important;
          height: 100% !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  );
};

export default DestinationShowcase;
