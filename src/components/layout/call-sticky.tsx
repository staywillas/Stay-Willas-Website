"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const CallSticky = () => {
  return (
    <div className="fixed bottom-24 right-5 z-[8000] md:hidden flex items-center">
      <motion.a
        href="tel:+919619042310"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.9 }}
        className="flex items-center justify-center w-13 h-13 bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] rounded-full shadow-[0_8px_24px_rgba(27,53,100,0.35)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-[#DAA520]/45 relative"
        title="Call Stay Willas"
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Phone className="w-full h-full fill-current" />
        </div>
      </motion.a>
    </div>
  );
};

export default CallSticky;
