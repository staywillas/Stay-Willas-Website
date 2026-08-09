"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X, Maximize2 } from "lucide-react";

interface OrbitItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

const ORBIT_ITEMS: OrbitItem[] = [
  {
    id: 1,
    title: "Waterfall Pool",
    subtitle: "Private temperature-filtered pool",
    image: "/assets/villas/the-angle-house/gallery-3.webp",
    badge: "Private Pool",
  },
  {
    id: 2,
    title: "Glass Facade",
    subtitle: "Floor-to-ceiling mountain views",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    badge: "Architecture",
  },
  {
    id: 3,
    title: "Master Jacuzzi",
    subtitle: "Luxury bath suite experience",
    image: "/assets/villas/the-angle-house/gallery-19.webp",
    badge: "Jacuzzi Suite",
  },
  {
    id: 4,
    title: "Sunset Deck",
    subtitle: "Panoramic valley view terrace",
    image: "/assets/villas/the-angle-house/gallery-4.webp",
    badge: "View Deck",
  },
  {
    id: 5,
    title: "Living Hall",
    subtitle: "Double-height luxury lounge",
    image: "/assets/villas/the-angle-house/gallery-6.webp",
    badge: "Spacious Lounge",
  },
];

export default function HeroOrbitGallery() {
  const [activeImage, setActiveImage] = useState<OrbitItem | null>(null);

  return (
    <>
      {/* 
        Orbit Gallery Container - ONLY AVAILABLE ON PC VIEW (hidden lg:block)
        Performance optimized with CSS transform keyframe GPU acceleration
      */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="relative w-full h-full max-w-[1400px] mx-auto flex items-center justify-center">
          
          {/* Orbital Ellipse Track Ring */}
          <div className="absolute w-[920px] h-[460px] rounded-[100%] border border-[#DAA520]/20 bg-gradient-to-b from-[#DAA520]/5 via-transparent to-[#DAA520]/5 shadow-[0_0_50px_rgba(218,165,32,0.05)] pointer-events-none" />
          <div className="absolute w-[920px] h-[460px] rounded-[100%] border border-dashed border-[#DAA520]/15 pointer-events-none animate-[spin_120s_linear_infinite]" />

          {/* Interactive Orbit Group (Pauses on Hover for Clean User Control) */}
          <div className="group/orbit pointer-events-auto relative w-[920px] h-[460px]">
            {ORBIT_ITEMS.map((item, index) => {
              // Calculate initial offset angles for 5 cards (0, 72, 144, 216, 288 deg)
              const angleDeg = (index * 360) / ORBIT_ITEMS.length;
              const delay = -(index * 30) / ORBIT_ITEMS.length;

              return (
                <div
                  key={item.id}
                  style={{
                    animationDelay: `${delay}s`,
                    ["--orbit-start-angle" as any]: `${angleDeg}deg`,
                  }}
                  className="absolute top-1/2 left-1/2 -mt-16 -ml-16 w-32 h-44 animate-orbit-card group-hover/orbit:[animation-play-state:paused] transition-transform duration-300"
                >
                  <div
                    onClick={() => setActiveImage(item)}
                    className="relative w-full h-full bg-white/85 backdrop-blur-xl border border-[#DAA520]/35 rounded-2xl shadow-xl hover:shadow-[0_20px_40px_rgba(218,165,32,0.25)] hover:border-[#DAA520] hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden group/card flex flex-col justify-between p-1.5"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-28 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="160px"
                        className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/card:opacity-30 transition-opacity" />
                      
                      {/* Zoom Icon Hint */}
                      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1 rounded-full text-white/80 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <Maximize2 size={12} />
                      </div>

                      <span className="absolute bottom-1.5 left-2 bg-[#1B3564]/90 backdrop-blur-md text-[#DAA520] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#DAA520]/30 shadow-sm">
                        {item.badge}
                      </span>
                    </div>

                    {/* Card Label */}
                    <div className="p-1.5 text-left">
                      <h4 className="text-[11px] font-bold text-[#1B3564] truncate leading-tight group-hover/card:text-accent-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 font-light truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Fullscreen Lightbox Modal when a card is clicked */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0F2142] border border-[#DAA520]/40 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8 text-white"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-[#DAA520]/20 shadow-inner">
              <Image
                src={activeImage.image}
                alt={activeImage.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-[#DAA520] font-bold uppercase tracking-widest block mb-1">
                  {activeImage.badge} — The Angle House
                </span>
                <h3 className="text-2xl font-heading font-bold text-white">
                  {activeImage.title}
                </h3>
                <p className="text-sm text-slate-300 font-light">
                  {activeImage.subtitle}
                </p>
              </div>

              <a
                href="/villa/the-angle-house"
                className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-md"
              >
                View Full Specs
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
