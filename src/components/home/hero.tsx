"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Sparkles,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Hero = () => {
  return (
    <section className="relative h-[85vh] lg:h-screen min-h-[650px] w-full overflow-hidden flex items-center">
      
      {/* Background Image of The Angle House */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/assets/villas/the-angle-house/gallery-11.webp"
          alt="Luxury villas near Mumbai - The Angle House private pool villas in Lonavala"
          fill
          priority
          sizes="100vw"
          quality={60}
          className="object-cover object-center animate-ken-burns"
        />
        {/* Dark Navy Overlays for High Contrast and Luxury Feel */}
        <div className="absolute inset-0 bg-[#0E1B35]/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B35]/80 via-[#0E1B35]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35]/80 via-transparent to-[#0E1B35]/20 z-10" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 z-20 relative flex flex-col justify-center text-white h-full pt-12 md:pt-16">
        
        {/* Tag */}
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[#E2A63B] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm w-fit"
        >
          <Sparkles size={12} className="text-[#E2A63B]" /> Architectural Icon
        </motion.span>
        
        {/* Main Heading */}
        <TextGenerateEffect 
          words="The Angle House"
          highlightWords={["Angle", "House"]}
          highlightClass="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent font-sans"
          className="text-4xl md:text-6xl lg:text-[5.5rem] text-white font-normal mb-6"
        />
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm md:text-base text-slate-200/90 font-medium max-w-md mb-8 leading-relaxed"
        >
          Discover premier <strong>luxury villas near Mumbai</strong>. Experience signature <strong>private pool villas in Lonavala</strong> and exclusive <strong>villas near mumbai</strong> for slow luxury staycations.
        </motion.p>

        {/* Highlights Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap gap-2.5 md:gap-3 mb-10"
        >
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold text-white/95 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2A63B]" /> 3 Bedrooms
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold text-white/95 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2A63B]" /> Private Pool
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-semibold text-white/95 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 shadow-sm font-sans">
            <MapPin size={10} className="text-[#E2A63B] inline mr-1" /> Lonavala, MH
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="flex flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link 
            href="/villa/the-angle-house" 
            className="w-fit group bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full px-4 py-2.5 sm:px-8 sm:py-4 text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 whitespace-nowrap"
          >
            <span>Explore Villa</span>
            <ChevronRight className="transition-transform group-hover:translate-x-1 stroke-[3]" size={12} />
          </Link>
          <a 
            href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I'm looking at the stunning Angle House on your website and would love to check availability.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Concierge via WhatsApp"
            className="flex group bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/45 text-white font-bold rounded-full px-4 py-2.5 sm:px-8 sm:py-4 text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-sm hover:bg-white/20 whitespace-nowrap"
          >
            <span>Concierge</span>
          </a>
        </motion.div>
      </div>
      
    </section>
  );
};

export default Hero;
