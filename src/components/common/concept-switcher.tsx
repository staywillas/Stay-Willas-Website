"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowLeft, Eye } from "lucide-react";

export default function ConceptSwitcher() {
  const pathname = usePathname();

  return (
    <aside aria-label="Concept Preview Selector" className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[99990] w-auto max-w-[95vw]">
      <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-[#080D0A]/95 backdrop-blur-2xl border border-[#DAA520]/40 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-xs">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#DAA520]">
          <Sparkles size={12} className="text-[#DAA520] animate-pulse" />
          <span>Hero Concepts</span>
        </div>

        <Link
          href="/test1"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-semibold text-[11px] sm:text-xs transition-all duration-300 ${
            pathname === "/test1"
              ? "bg-[#DAA520] text-stone-950 shadow-md font-bold"
              : "text-stone-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Eye size={12} />
          <span>Concept 1 (Twilight Glasshouse)</span>
        </Link>

        <Link
          href="/test2"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-semibold text-[11px] sm:text-xs transition-all duration-300 ${
            pathname === "/test2"
              ? "bg-[#DAA520] text-stone-950 shadow-md font-bold"
              : "text-stone-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Sparkles size={12} />
          <span>Concept 2 (Estate Visualizer)</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 text-[11px] sm:text-xs transition-all duration-300"
          title="Return to live Home"
        >
          <ArrowLeft size={12} />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
    </aside>
  );
}
