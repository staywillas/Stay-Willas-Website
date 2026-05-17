"use client";

import React, { useRef, useState } from "react";
import { 
  Waves, Mountain, Palmtree, 
  Wine, Home, Trees, 
  Sun, Umbrella, Snowflake,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Infinity Pools", icon: Waves },
  { name: "Mountain View", icon: Mountain },
  { name: "Beachfront", icon: Palmtree },
  { name: "Vineyards", icon: Wine },
  { name: "Private Estates", icon: Home },
  { name: "Forest Cabins", icon: Trees },
  { name: "Sun-Kissed", icon: Sun },
  { name: "Resort Style", icon: Umbrella },
  { name: "Cold Climates", icon: Snowflake },
];

const CategoryBar = () => {
  const [active, setActive] = useState("Infinity Pools");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-charcoal/80 backdrop-blur-md py-4 border-y border-white/5 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4">
        
        <button 
          onClick={() => scroll("left")}
          className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all hidden md:flex"
        >
          <ChevronLeft size={16} />
        </button>

        <div 
          ref={scrollRef}
          className="flex items-center gap-10 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActive(cat.name)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-fit transition-all duration-300 relative pb-2",
                active === cat.name ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <cat.icon size={24} className={cn("transition-transform", active === cat.name && "scale-110")} />
              <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
                {cat.name}
              </span>
              {active === cat.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scroll("right")}
          className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all hidden md:flex"
        >
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default CategoryBar;
