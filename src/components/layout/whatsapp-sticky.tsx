"use client";

import React from "react";
import { motion } from "framer-motion";

const WhatsAppSticky = () => {
  return (
    <motion.a
      href="https://wa.me/919619042310"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 flex items-center gap-3 bg-black/80 hover:bg-[#25D366] text-white hover:text-black border border-white/10 hover:border-[#25D366] px-5 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-500 group cursor-pointer"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-full h-full fill-current"
        >
          <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
        </svg>
      </div>
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">WhatsApp Concierge</span>
    </motion.a>
  );
};

export default WhatsAppSticky;
