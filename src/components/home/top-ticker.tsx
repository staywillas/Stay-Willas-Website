"use client";

import React from "react";

const items = [
  "PRIVATE LUXURY VILLA RETREATS IN MAHARASHTRA",
  "NOW ACTIVE IN LONAVALA & KHOPOLI",
  "HEATED PRIVATE INFINITY POOLS",
  "24/7 PERSONAL CONCIERGE SERVICES",
  "BESPOKE PRIVATE CHEFS & JAIN FOOD",
  "RUSTIC COUNTRY ARCHITECTURE & MODERN COMFORT",
  "EXCLUSIVE CELEBRATION DECORATIONS & ADD-ONS"
];

export default function TopTicker() {
  return (
    <div className="pt-28 sm:pt-32 md:pt-36 xl:pt-40 pb-3 bg-[#0E1B35] border-b border-[#DAA520]/20 overflow-hidden select-none relative z-30 flex items-center">
      <div className="relative flex overflow-x-hidden w-full">
        <div className="flex whitespace-nowrap gap-16 animate-ticker-left">
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="flex items-center gap-16 text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold uppercase">
              {idx % 2 === 0 ? (
                <span className="text-white">
                  {item}
                </span>
              ) : (
                <span className="text-[#DAA520]">
                  {item}
                </span>
              )}
              <span className="text-[#DAA520] text-xs font-bold">✦</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker-left-anim {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .animate-ticker-left {
          display: flex;
          animation: ticker-left-anim 45s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-ticker-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
