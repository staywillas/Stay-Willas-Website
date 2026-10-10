"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#DAA520] hover:border-[#DAA520] hover:text-[#0E1B35] hover:shadow-[0_0_20px_rgba(218,165,32,0.4)] transition-all duration-300 group cursor-pointer"
    >
      <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
    </button>
  );
}
