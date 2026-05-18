"use client";

import React from "react";

const row1 = [
  "CRACKLING BONFIRES",
  "PRIVATE INFINITY POOLS",
  "CURATED WINE TASTINGS",
  "MAJESTIC MOUNTAIN ESCAPES",
  "FLOATING BREAKFASTS",
  "CINEMATIC SUNSETS",
];

const row2 = [
  "THE GOLD STANDARD",
  "UNCOMPROMISING LUXURY",
  "PRIVATE CHEF SERVICES",
  "BESPOKE EXPERIENCE CONCIERGE",
  "HEATED PLUNGE JACUZZIS",
  "AN UNFORGETTABLE ESCAPE",
];

export default function InfiniteMarquee() {
  return (
    <section className="py-16 bg-[#0a0a0a] overflow-hidden relative select-none">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Top Line */}
      <div className="w-full flex justify-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold flex items-center gap-3">
          <span className="w-6 h-px bg-gold/30" />
          The Stay Willas Experience
          <span className="w-6 h-px bg-gold/30" />
        </span>
      </div>

      {/* Marquee Row 1 - Scrolling Left */}
      <div className="relative flex overflow-x-hidden border-y border-white/5 bg-charcoal/20 py-4 backdrop-blur-md mb-4">
        <div className="flex whitespace-nowrap gap-10 animate-marquee-left">
          {[...row1, ...row1, ...row1].map((item, idx) => (
            <div key={idx} className="flex items-center gap-10 text-lg md:text-2xl font-heading tracking-[0.15em] font-bold uppercase">
              {idx % 2 === 0 ? (
                <span className="text-white hover:text-gold transition-colors duration-500">
                  {item}
                </span>
              ) : (
                <span
                  style={{
                    WebkitTextStroke: "1px rgba(197, 160, 89, 0.4)",
                    color: "transparent",
                  }}
                  className="font-outline hover:text-gold/20 transition-all duration-500"
                >
                  {item}
                </span>
              )}
              <span className="text-gold/80 text-sm md:text-base font-light">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Scrolling Right */}
      <div className="relative flex overflow-x-hidden border-y border-white/5 bg-charcoal/20 py-4 backdrop-blur-md">
        <div className="flex whitespace-nowrap gap-10 animate-marquee-right">
          {[...row2, ...row2, ...row2].map((item, idx) => (
            <div key={idx} className="flex items-center gap-10 text-lg md:text-2xl font-heading tracking-[0.15em] font-bold uppercase">
              {idx % 2 !== 0 ? (
                <span className="text-white hover:text-gold transition-colors duration-500">
                  {item}
                </span>
              ) : (
                <span
                  style={{
                    WebkitTextStroke: "1px rgba(197, 160, 89, 0.4)",
                    color: "transparent",
                  }}
                  className="font-outline hover:text-gold/20 transition-all duration-500"
                >
                  {item}
                </span>
              )}
              <span className="text-gold/80 text-sm md:text-base font-light">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes and styling */}
      <style jsx global>{`
        @keyframes marquee-left-anim {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        @keyframes marquee-right-anim {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          display: flex;
          animation: marquee-left-anim 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          animation: marquee-right-anim 35s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
