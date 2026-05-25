"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary text-text-primary">
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,53,100,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Pulsing Logo Circle */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(27, 53, 100, 0.15)",
              "0 0 40px rgba(30, 122, 140, 0.30)",
              "0 0 20px rgba(27, 53, 100, 0.15)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-full flex items-center justify-center border border-border-subtle overflow-hidden bg-white shadow-lg"
        >
          <img 
            src="/images/web logo.png" 
            alt="Stay Willas Logo" 
            className="w-full h-full object-cover object-[center_47.5%] scale-[1.6]" 
          />
        </motion.div>

        {/* Elegant typography */}
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="font-heading text-2xl tracking-[0.15em] text-text-primary uppercase"
          >
            STAY WILLAS
          </motion.h2>
          <p className="font-sans text-[9px] tracking-[0.4em] text-accent-secondary uppercase font-black mt-2">
            Curating Serenity
          </p>
        </div>
        
        {/* Premium loading line */}
        <div className="w-24 h-[1px] bg-[#E2E8F0] rounded-full overflow-hidden relative mt-2">
          <motion.div
            animate={{
              left: ["-100%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#1B3564] to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
