"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const scrollToBookingBar = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking-bar-section") || document.querySelector("section.relative.z-30");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.href = "/villas";
    }
  };

  return (
    <section className="relative h-[90vh] lg:h-screen min-h-[680px] w-full overflow-hidden flex items-center">
      
      {/* Background Image of The Angle House */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/assets/villas/the-angle-house/gallery-11.webp"
          alt="Luxury villas near Mumbai - The Angle House private pool villas in Lonavala"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-center animate-ken-burns"
        />
        {/* Dark Navy Overlays for High Contrast and Luxury Feel */}
        <div className="absolute inset-0 bg-[#0E1B35]/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B35]/90 via-[#0E1B35]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35]/90 via-transparent to-[#0E1B35]/30 z-10" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 z-20 relative flex flex-col justify-center text-white h-full pt-16 md:pt-20">
        
        {/* Ad Tag & Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 backdrop-blur-md border border-[#DAA520]/40 text-[#DAA520] font-black tracking-[0.2em] uppercase text-[10px] md:text-xs px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles size={13} className="text-[#DAA520]" /> Direct Villa Stays • 0% Platform Fee
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-[10px] md:text-xs px-3 py-1.5 rounded-full">
            <Star size={12} className="text-[#DAA520] fill-[#DAA520]" /> 4.9/5 Rating (500+ Stays)
          </span>
        </motion.div>
        
        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-white font-normal mb-4 max-w-3xl leading-[1.1] tracking-tight"
        >
          Luxury Private Pool Villas in{" "}
          <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#F5D061] bg-clip-text text-transparent font-sans pr-2 inline-block font-bold">
            Lonavala & Khopoli
          </span>
        </motion.h1>
        
        {/* High-Converting Clear Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="text-sm md:text-lg text-slate-200/95 font-medium max-w-xl mb-6 leading-relaxed"
        >
          Escape the city in stunning private sanctuaries. Enjoy heated private pools, on-demand gourmet chefs, and uninterrupted mountain serenity.
        </motion.p>

        {/* Highlights Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="flex flex-wrap gap-2 md:gap-2.5 mb-8"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-white bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 100% Private Pool
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-white bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            👨‍🍳 Private Chef on Demand
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-white bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            🐾 Pet Friendly Estates
          </span>
        </motion.div>

        {/* Primary Clear High-Converting CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
        >
          {/* Primary CTA: Check Dates & Book */}
          <Link 
            href="/villas" 
            onClick={scrollToBookingBar}
            className="group bg-[#DAA520] hover:bg-[#c4941a] text-[#1B3564] font-black rounded-full px-6 py-4 text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_8px_30px_rgba(218,165,32,0.4)] hover:shadow-[0_12px_35px_rgba(218,165,32,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <Calendar size={17} className="stroke-[2.5]" />
            <span>CHECK DATES & PRICING</span>
            <ChevronRight className="transition-transform group-hover:translate-x-1 stroke-[3]" size={15} />
          </Link>

          {/* Secondary CTA: Instant WhatsApp Booking */}
          <a 
            href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I am looking to book a luxury villa near Mumbai (Lonavala/Khopoli) for my upcoming getaway. Could you share available dates and best direct pricing?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book on WhatsApp"
            className="group bg-[#25D366] hover:bg-[#20ba5a] text-white font-black rounded-full px-6 py-4 text-xs md:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
              <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
            </svg>
            <span>WHATSAPP CONCIERGE</span>
          </a>
        </motion.div>

        {/* Micro Guarantee Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-[11px] md:text-xs text-slate-300/80 mt-4 flex items-center gap-2 font-medium"
        >
          <ShieldCheck size={14} className="text-[#DAA520]" />
          <span>Best Rate Guarantee • Instant Confirmation • 24/7 Guest Support</span>
        </motion.p>

      </div>
      
    </section>
  );
};

export default Hero;

