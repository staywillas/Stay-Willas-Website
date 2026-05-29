"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const WhatsAppSticky = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-24 left-5 md:bottom-8 md:left-8 z-[8000] flex items-center gap-3">
      <motion.a
        href="https://wa.me/919619042310?text=Hi%20Stay%20Willas%21%20%F0%9F%8C%B4%20I%27m%20browsing%20your%20beautiful%20collection%20of%20private%20estates%20and%20would%20love%20to%20chat%20about%20planning%20our%20perfect%20staycation.%20%E2%9C%A8"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
        className="flex items-center justify-center w-13 h-13 bg-[#1B3564] hover:bg-[#DAA520] text-white rounded-full shadow-[0_8px_24px_rgba(27,53,100,0.3)] hover:shadow-[0_12px_30px_rgba(218,165,32,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-[#DAA520]/30 hover:border-[#DAA520] relative"
        title="Villa Concierge"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
            <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
          </svg>
        </div>
      </motion.a>

      {/* Hover-Only Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="hidden sm:flex bg-white text-[#1B3564] px-4 py-2.5 rounded-2xl border border-[#DAA520]/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] items-center gap-2 select-none relative"
        >
          <div className="absolute left-[-6px] top-[18px] w-3 h-3 bg-white border-l border-b border-[#DAA520]/20 rotate-45" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-wider">Villa Concierge</span>
            <span className="text-xs font-semibold text-[#1B3564]/70">Replies within 15 min</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WhatsAppSticky;
