"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Waves, Flame, MapPin } from "lucide-react";

export interface MarqueeItem {
  id: string;
  image: string;
  villaName: string;
  badge: string;
  location: string;
  slug: string;
  feature: string;
}

export const LONAVALA_MARQUEE_ITEMS: MarqueeItem[] = [
  {
    id: "ah-1",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    villaName: "The Angle House",
    badge: "Architectural Glass Facade",
    location: "Kamshet, Lonavala",
    slug: "the-angle-house",
    feature: "Double-Height Glass Living Lounge with 180° Sahyadri Views"
  },
  {
    id: "wp-1",
    image: "/assets/villas/willow-peak/gallery-1.webp",
    villaName: "Willow Peak",
    badge: "Alpine A-Frame Chalet",
    location: "Kurwande, Lonavala",
    slug: "willow-peak",
    feature: "Standalone Wooden Chalet with Private Jacuzzi & Forest Decks"
  },
  {
    id: "ah-2",
    image: "/assets/villas/the-angle-house/gallery-13.webp",
    villaName: "The Angle House",
    badge: "Private Waterfall Pool",
    location: "Kamshet, Lonavala",
    slug: "the-angle-house",
    feature: "Cascading Waterfall Pool with Evening Underwater Mood Lighting"
  },
  {
    id: "wp-2",
    image: "/assets/villas/willow-peak/gallery-4.webp",
    villaName: "Willow Peak",
    badge: "Master Jacuzzi Suite",
    location: "Kurwande, Lonavala",
    slug: "willow-peak",
    feature: "Heated Bubble Jacuzzi Overlooking Sahyadri Mountain Mist"
  },
  {
    id: "ah-3",
    image: "/assets/villas/the-angle-house/gallery-19.webp",
    villaName: "The Angle House",
    badge: "Panoramic Jacuzzi Suite",
    location: "Kamshet, Lonavala",
    slug: "the-angle-house",
    feature: "Deep Hydrotherapy Soaking Tub Framed by Mountain Silhouettes"
  },
  {
    id: "wp-3",
    image: "/assets/villas/willow-peak/gallery-11.webp",
    villaName: "Willow Peak",
    badge: "Scenic Lawn & Sit-Out",
    location: "Kurwande, Lonavala",
    slug: "willow-peak",
    feature: "Manicured Highland Greenery with Outdoor Bonfire & BBQ Setup"
  },
  {
    id: "ah-4",
    image: "/assets/villas/the-angle-house/gallery-5.webp",
    villaName: "The Angle House",
    badge: "Pet-Friendly Fenced Lawns",
    location: "Kamshet, Lonavala",
    slug: "the-angle-house",
    feature: "Sprawling Secure Turf where Pets & Children Play Freely"
  },
  {
    id: "wp-4",
    image: "/assets/villas/willow-peak/gallery-6.webp",
    villaName: "Willow Peak",
    badge: "Timber Bedroom Suite",
    location: "Kurwande, Lonavala",
    slug: "willow-peak",
    feature: "Cozy Pine Wood Interiors, Plush Mattress & Split Climate Control"
  },
  {
    id: "ah-5",
    image: "/assets/villas/the-angle-house/gallery-18.webp",
    villaName: "The Angle House",
    badge: "Grand Living Lounge",
    location: "Kamshet, Lonavala",
    slug: "the-angle-house",
    feature: "Plush Velvet Seating, 65-inch Smart 4K TV & Sound System"
  },
  {
    id: "wp-5",
    image: "/assets/villas/willow-peak/gallery-13.webp",
    villaName: "Willow Peak",
    badge: "Evening Bonfire Deck",
    location: "Kurwande, Lonavala",
    slug: "willow-peak",
    feature: "Open-Sky Stargazing, Live Barbecue Grills & Private Chef Dining"
  }
];

interface BlogHorizontalMarqueeProps {
  items?: MarqueeItem[];
  title?: string;
  subtitle?: string;
}

export default function BlogHorizontalMarquee({
  items = LONAVALA_MARQUEE_ITEMS,
  title = "Explore The Angle House & Willow Peak",
  subtitle = "Hover over any image to pause the gallery. Click to view complete villa specifications, gallery & real-time booking."
}: BlogHorizontalMarqueeProps) {
  // Duplicate array for seamless infinite looping
  const marqueeList = [...items, ...items];

  return (
    <div className="my-14 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 bg-gradient-to-b from-[#0E1B35]/95 via-[#0A162B] to-[#0E1B35]/95 py-12 px-4 sm:px-8 border-y border-[#DAA520]/25 relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-[#DAA520]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-[#2563EB]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Header section */}
      <div className="max-w-4xl mx-auto text-center mb-8 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#DAA520]/50 rounded-full px-4 py-1.5 mb-3 shadow-[0_4px_20px_rgba(218,165,32,0.25)]">
          <Sparkles size={13} className="text-[#F3C065] animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#F3C065]">
            Featured Lonavala Villas
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm font-light max-w-2xl mx-auto mt-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Infinite Horizontal Marquee Track with Hover Pause */}
      <div className="relative w-full overflow-hidden group">
        {/* Left and Right Fade Gradients for editorial infinity look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#0E1B35] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#0E1B35] to-transparent z-20 pointer-events-none" />

        <div className="flex gap-5 sm:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] py-3 transform-gpu">
          {marqueeList.map((item, idx) => {
            const isAngleHouse = item.slug === "the-angle-house";
            return (
              <Link
                key={`${item.id}-${idx}`}
                href={`/villa/${item.slug}`}
                className="group/card relative w-[300px] sm:w-[360px] h-[260px] sm:h-[290px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DAA520]/30 hover:border-[#F3C065] shadow-lg hover:shadow-[0_12px_36px_rgba(218,165,32,0.35)] transition-all duration-500 flex-shrink-0 flex flex-col justify-between p-4 sm:p-5 transform hover:-translate-y-1.5"
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={`${item.villaName} - ${item.badge}`}
                  fill
                  sizes="360px"
                  className="object-cover object-center group-hover/card:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 group-hover/card:via-black/25 transition-colors duration-300" />

                {/* Top Row: Villa Brand Pill + Arrow Link */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border shadow-md flex items-center gap-1.5 ${
                    isAngleHouse
                      ? "bg-[#1B3564]/90 text-[#F3C065] border-[#DAA520]/40"
                      : "bg-[#064E3B]/90 text-[#34D399] border-[#10B981]/40"
                  }`}>
                    {isAngleHouse ? <Waves size={12} /> : <Flame size={12} />}
                    {item.villaName}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover/card:bg-[#DAA520] group-hover/card:text-slate-950 transition-colors duration-300 shadow-md">
                    <ArrowUpRight size={15} />
                  </div>
                </div>

                {/* Bottom Row: Highlight Details */}
                <div className="relative z-10 text-left">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-[#F3C065] block mb-1">
                    {item.badge}
                  </span>
                  <p className="text-white text-xs sm:text-sm font-medium leading-snug drop-shadow-md line-clamp-2 mb-2">
                    {item.feature}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300/90 font-light">
                    <MapPin size={11} className="text-[#DAA520]" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
