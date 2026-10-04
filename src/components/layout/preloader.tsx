"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if running in browser
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const forcePreview = urlParams.get("preloader") === "preview" || urlParams.get("preview") === "preloader";
    const hasSeen = sessionStorage.getItem("stay_willas_preloader_seen");

    // Only run if first session visit or explicitly previewing
    if (!hasSeen || forcePreview) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      let current = 0;
      const interval = setInterval(() => {
        // Smooth editorial acceleration
        const increment = current < 30 ? 2 : current < 75 ? 3 : current < 92 ? 2 : 1;
        current += increment;

        if (current >= 100) {
          current = 100;
          setProgress(100);
          clearInterval(interval);

          // Hold briefly at 100% then slide up curtain
          const exitTimeout = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "";
            try {
              sessionStorage.setItem("stay_willas_preloader_seen", "true");
            } catch {
              // Fail silently
            }
          }, 320);

          return () => clearTimeout(exitTimeout);
        } else {
          setProgress(current);
        }
      }, 25);

      return () => {
        clearInterval(interval);
        document.body.style.overflow = "";
      };
    }
  }, []);

  // Listen for manual trigger to replay preloader for testing
  useEffect(() => {
    const handleReplay = () => {
      setProgress(0);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      let current = 0;
      const interval = setInterval(() => {
        current += 3;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "";
          }, 320);
        } else {
          setProgress(current);
        }
      }, 25);
    };

    window.addEventListener("replay-preloader", handleReplay);
    return () => window.removeEventListener("replay-preloader", handleReplay);
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
    try {
      sessionStorage.setItem("stay_willas_preloader_seen", "true");
    } catch {}
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="stay-willas-preloader"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1], // Smooth luxury curtain cubic-bezier
            },
          }}
          className="fixed inset-0 z-[999999] flex flex-col justify-between bg-[#F5F2EA] text-[#1B3564] select-none overflow-hidden"
          style={{ willChange: "transform" }}
        >
          {/* Subtle luxury ambient glow and vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(218,165,32,0.12)_0%,rgba(245,242,234,0)_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4)_0%,transparent_100%)] pointer-events-none" />

          {/* Top Header Bar */}
          <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] text-[#1B3564]/70 uppercase">
                Private Luxury Collection
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-4"
            >
              <span className="hidden sm:inline-block text-[10px] font-sans font-semibold tracking-[0.2em] text-[#1B3564]/50 uppercase">
                Lonavala • Khopoli • Panchgani
              </span>
              <button
                onClick={handleSkip}
                className="text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-[#1B3564]/15 hover:border-[#DAA520] hover:text-[#DAA520] transition-colors cursor-pointer text-[#1B3564]/60"
                aria-label="Skip preloader"
              >
                Skip
              </button>
            </motion.div>
          </div>

          {/* Central Logo & Brand Typography Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            {/* Medallion Emblem with gold halo */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Pulsing subtle ambient halo */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-[#DAA520]/25 via-transparent to-[#1B3564]/15 blur-md animate-pulse" />

              <div className="relative w-20 h-20 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full bg-white p-1.5 shadow-[0_12px_36px_rgba(27,53,100,0.12)] border border-[#DAA520]/35 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/stay-willas-emblem.webp"
                  alt="Stay Willas Logo"
                  width={112}
                  height={112}
                  priority
                  className="w-full h-full object-cover scale-[1.05]"
                />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 sm:mt-6 flex flex-col items-center"
            >
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl tracking-[0.22em] text-[#1B3564] font-bold uppercase">
                STAY WILLAS
              </h1>

              {/* Tagline: Stay • Relax • Repeat */}
              <p className="font-sans text-[10.5px] sm:text-xs md:text-sm tracking-[0.28em] text-[#DAA520] font-bold uppercase mt-2">
                Stay • Relax • Repeat
              </p>
            </motion.div>
          </div>

          {/* Bottom Editorial 00–100 Counter & Hairline Progress */}
          <div className="relative z-10 px-6 sm:px-10 md:px-14 pb-8 sm:pb-10 flex flex-col sm:flex-row items-end sm:items-end justify-between gap-4">
            {/* Status note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full sm:w-auto text-center sm:text-left"
            >
              <p className="text-[10px] sm:text-xs font-sans tracking-[0.16em] uppercase text-[#1B3564]/60 font-semibold">
                {progress === 100 ? "Welcome to Stay Willas" : "Preparing your private sanctuary..."}
              </p>
              
              {/* Hairline Progress Bar */}
              <div className="w-full sm:w-64 md:w-80 h-[2px] bg-[#1B3564]/10 rounded-full overflow-hidden mt-2.5 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#1B3564] via-[#DAA520] to-[#1B3564] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </motion.div>

            {/* Editorial Serif 00-100 Percentage Counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-baseline justify-center sm:justify-end gap-1.5 w-full sm:w-auto"
            >
              <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1B3564] tabular-nums tracking-tight leading-none">
                {String(progress).padStart(2, "0")}
              </span>
              <span className="font-sans text-xs sm:text-sm font-bold text-[#DAA520] tracking-wider">
                %
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
