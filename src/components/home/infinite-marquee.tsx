"use client";

import React from "react";

const row1 = [
  "HEATED INFINITY POOLS",
  "PRIVATE MASTER SUITE JACUZZIS",
  "PANORAMIC GLASS FRONTAGE",
  "PANORAMIC MOUNTAIN & GHAT VIEWS",
  "RUSTIC COUNTRY STONE ARCHITECTURE",
  "STUNNING WATERFALL FEATURES",
  "OUTDOOR BONFIRE LOUNGES",
];

const row2 = [
  "BESPOKE PRIVATE CHEFS",
  "24/7 PERSONAL CONCIERGE",
  "OPEN-AIR SUNSET BBQ GRILLS",
  "LUSH TROPICAL GARDENS",
  "ROOFTOP TURF LOUNGES",
  "AL FRESCO LUXURY DINING",
  "RESTORATIVE WELLNESS SESSIONS",
];

export default function InfiniteMarquee() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0E1B35] via-[#1B3564] to-[#0E1B35] overflow-hidden relative select-none">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#DAA520]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Top Line */}
      <div className="w-full flex justify-center mb-10">
        <span className="text-xs uppercase tracking-[0.4em] text-[#DAA520]/80 font-bold flex items-center gap-4">
          <span className="w-8 h-px bg-gradient-to-r from-[#DAA520]/0 to-[#DAA520]/50" />
          ✨ The Stay Willas Experience
          <span className="w-8 h-px bg-gradient-to-l from-[#DAA520]/0 to-[#DAA520]/50" />
        </span>
      </div>

      {/* Marquee Row 1 - Scrolling Left */}
      <div className="relative flex overflow-x-hidden border-y border-[#DAA520]/20 bg-white/5 py-5 backdrop-blur-sm mb-4">
        <div className="flex whitespace-nowrap gap-12 animate-marquee-left">
          {[...row1, ...row1, ...row1].map((item, idx) => (
            <div key={idx} className="flex items-center gap-12 text-lg md:text-xl lg:text-2xl font-heading tracking-wider font-extrabold uppercase">
              {idx % 2 === 0 ? (
                <span className="text-[#FAF8F5] hover:text-[#DAA520] transition-colors duration-500 cursor-default">
                  {item}
                </span>
              ) : (
                <span className="text-[#DAA520] hover:text-[#FAF8F5] transition-colors duration-500 font-extrabold">
                  {item}
                </span>
              )}
              <span className="text-[#DAA520]/85 text-sm md:text-base font-light">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Scrolling Right */}
      <div className="relative flex overflow-x-hidden border-y border-[#DAA520]/20 bg-white/5 py-5 backdrop-blur-sm">
        <div className="flex whitespace-nowrap gap-12 animate-marquee-right">
          {[...row2, ...row2, ...row2].map((item, idx) => (
            <div key={idx} className="flex items-center gap-12 text-lg md:text-xl lg:text-2xl font-heading tracking-wider font-extrabold uppercase">
              {idx % 2 !== 0 ? (
                <span className="text-[#FAF8F5] hover:text-[#DAA520] transition-colors duration-500 cursor-default">
                  {item}
                </span>
              ) : (
                <span className="text-[#DAA520] hover:text-[#FAF8F5] transition-colors duration-500 font-extrabold">
                  {item}
                </span>
              )}
              <span className="text-[#DAA520]/85 text-sm md:text-base font-light">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes marquee-left-anim {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        @keyframes marquee-right-anim {
          0% { transform: translate3d(-33.33%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          display: flex;
          animation: marquee-left-anim 35s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-marquee-right {
          display: flex;
          animation: marquee-right-anim 35s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
