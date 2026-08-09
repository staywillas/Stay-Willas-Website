"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Waves, Dog, Utensils, Users, ShieldCheck, Flame, Trees, Bath } from "lucide-react";

export interface FeatureMarqueeItem {
  id: string | number;
  title: string;
  badge: string;
  description: string;
  image: string;
  iconName?: string;
}

interface VillaFeatureMarqueeProps {
  heading?: string;
  subheading?: string;
  items: FeatureMarqueeItem[];
}

export default function VillaFeatureMarquee({
  heading = "Signature Estate Features",
  subheading = "Handcrafted luxury amenities designed for uncompromised relaxation",
  items,
}: VillaFeatureMarqueeProps) {
  // 2x duplicate array for lightweight, seamless infinite marquee loop
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-12 bg-gradient-to-b from-bg-primary via-[#FAF8F5] to-bg-primary border-b border-[#DAA520]/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <span className="text-accent-secondary font-semibold tracking-[0.3em] uppercase text-[10px] md:text-xs mb-2 block">
          Curated Property Highlights
        </span>
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-[#1B3564]">
          {heading}
        </h2>
        <p className="text-text-primary/70 text-xs md:text-sm font-light max-w-xl mx-auto mt-1">
          {subheading}
        </p>
      </div>

      {/* Infinite Marquee Loop Track */}
      <div className="relative w-full overflow-hidden group">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] py-4 transform-gpu">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-72 sm:w-80 bg-white border border-[#DAA520]/25 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#DAA520] hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="340px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-[#1B3564]/90 backdrop-blur-md text-[#DAA520] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#DAA520]/30 shadow-md">
                  {item.badge}
                </span>
              </div>

              {/* Feature Details */}
              <div className="p-5 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-[#1B3564] text-base mb-1.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-text-primary/75 text-xs font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
