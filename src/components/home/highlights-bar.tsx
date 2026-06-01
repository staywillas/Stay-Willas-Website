"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  BellRing, 
  ChefHat, 
  Waves, 
  Sparkles, 
  Compass, 
  Sun, 
  Palmtree,
  LucideIcon 
} from "lucide-react";

// Map string keys to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Shield,
  CheckCircle,
  BellRing,
  ChefHat,
  Waves,
  Sparkles,
  Compass,
  Sun,
  Palmtree
};

const highlightsData = [
  // Slide 0: General Handpicked Stays
  [
    {
      icon: "Shield",
      title: "Strictly Handpicked",
      desc: "Only the finest private villas in Maharashtra",
    },
    {
      icon: "CheckCircle",
      title: "Verified Comfort",
      desc: "150+ point quality and safety checklist",
    },
    {
      icon: "BellRing",
      title: "Dedicated Concierge",
      desc: "We're here to curate your perfect escape",
    },
    {
      icon: "ChefHat",
      title: "Curated Gastronomy",
      desc: "Private chefs serving delicious local cuisines",
    },
  ],
  // Slide 1: Lonavala Infinity Pool / Angle House
  [
    {
      icon: "Waves",
      title: "Infinity Pool",
      desc: "Relax in your private temperature-controlled pool",
    },
    {
      icon: "Sparkles",
      title: "Modern Design",
      desc: "Striking architecture meets bespoke interiors",
    },
    {
      icon: "BellRing",
      title: "Dedicated Concierge",
      desc: "We're here to curate your perfect escape",
    },
    {
      icon: "Compass",
      title: "Scenic Escape",
      desc: "Stunning valley views in the heart of Lonavala",
    },
  ],
  // Slide 2: Alibaug Beachfront / Steps from the Sand
  [
    {
      icon: "Sun",
      title: "Beachfront Bliss",
      desc: "Wake up to ocean views and sea breeze",
    },
    {
      icon: "Palmtree",
      title: "Handpicked Stays",
      desc: "Beautiful beach houses with premium comfort",
    },
    {
      icon: "BellRing",
      title: "Dedicated Concierge",
      desc: "We're here to curate your perfect escape",
    },
    {
      icon: "Compass",
      title: "Local Experiences",
      desc: "Discover Alibaug beyond the sandy beaches",
    },
  ],
];

interface HighlightsBarProps {
  activeIndex: number;
}

const HighlightsBar = ({ activeIndex }: HighlightsBarProps) => {
  // Safe fallback if activeIndex is out of range
  const currentHighlights = highlightsData[activeIndex % highlightsData.length] || highlightsData[0];

  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 lg:left-16 lg:right-16 z-30 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/10 border-solid"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          <AnimatePresence mode="wait">
            {currentHighlights.map((item, idx) => {
              const IconComponent = iconMap[item.icon] || Shield;
              return (
                <motion.div
                  key={`${activeIndex}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`flex items-start gap-4 ${idx > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''} first:pt-0`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-500/5">
                    <IconComponent size={20} className="stroke-[1.75]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HighlightsBar;
