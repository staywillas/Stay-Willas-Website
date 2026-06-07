"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  ArrowRight,
  Award
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const yPos1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yPos2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen w-full bg-[#F5F2EA] overflow-hidden pt-24 lg:pt-0 pb-16 lg:pb-0 flex items-center bg-[url('/assets/noise.png')] bg-blend-overlay">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(226,166,59,0.15)_0,rgba(226,166,59,0)_50%)] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(27,53,100,0.12)_0,rgba(27,53,100,0)_50%)] pointer-events-none transform-gpu" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-0 lg:gap-x-12 z-10 relative items-center">
        
        {/* Text & Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full lg:col-span-5 flex flex-col z-20"
        >
          {/* Tag */}
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm w-fit"
          >
            <span className="text-[#DAA520] text-xs">★</span> Premium Luxury
          </motion.span>
          
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-heading text-[#1B3564] leading-[1.1] mb-6 font-normal tracking-tight"
          >
            The Iconic <br className="hidden sm:inline" />
            <span className="relative inline-block pb-2 mt-2">
              <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent drop-shadow-sm">Angle House & <br />Canopy Crest</span>
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[13px] md:text-base text-slate-600/90 font-medium max-w-md mb-10 leading-relaxed"
          >
            Where modern architecture meets slow luxury. Handpicked designer villas offering unforgettable private escapes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/villas" 
              className="w-fit group bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300"
            >
              <span>Explore Villas</span>
              <ChevronRight className="transition-transform group-hover:translate-x-1 stroke-[3]" size={14} />
            </Link>
            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I'm browsing your stunning website and would love to connect with your concierge.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex group bg-white border border-[#1B3564]/10 hover:border-[#1B3564]/30 text-[#1B3564] font-bold rounded-full px-8 py-4 text-xs tracking-widest uppercase items-center justify-center gap-2 transition-all duration-300 shadow-sm"
            >
              <span>Concierge</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Magazine Collage */}
        <div className="w-full lg:col-span-7 relative min-h-[450px] h-[55vh] md:h-[60vh] lg:min-h-0 lg:h-[80vh] mt-4 lg:mt-0">
          
          {/* Angle House Image - Main Back Image */}
          <Link href="/villa/the-angle-house" className="contents">
            <motion.div 
              style={{ y: yPos1 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-[2%] left-0 w-[85%] sm:w-[75%] h-[55%] lg:h-[65%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white/80 z-10 group cursor-pointer"
            >
              <Image
                src="/assets/villas/the-angle-house/gallery-11.webp"
                alt="The Angle House"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3564]/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="bg-white/95 backdrop-blur-md text-[#1B3564] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 inline-block shadow-lg">Lonavala</span>
                <h3 className="text-white text-3xl font-heading font-normal drop-shadow-lg flex items-center justify-between">
                  The Angle House
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Canopy Crest Image - Front Offset Image */}
          <Link href="/villa/canopy-crest" className="contents">
            <motion.div 
              style={{ y: yPos2 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute bottom-[2%] right-0 w-[75%] sm:w-[65%] h-[55%] lg:h-[55%] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-4 border-white/80 z-20 group cursor-pointer"
            >
              <Image
                src="/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg"
                alt="Canopy Crest"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3564]/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
              
              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="bg-[#E2A63B]/95 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 inline-block shadow-lg">Khopoli</span>
                <h3 className="text-white text-2xl font-heading font-normal drop-shadow-lg flex items-center justify-between">
                  Canopy Crest
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </h3>
              </div>
            </motion.div>
          </Link>

          {/* Floating Highlight Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 100 }}
            className="absolute bottom-[10%] left-[5%] lg:left-[10%] z-30 bg-white/95 backdrop-blur-md rounded-full px-5 py-3 shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#1B3564]/5 flex items-center justify-center">
              <Award className="text-[#DAA520]" size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[#1B3564] font-black text-[10px] uppercase tracking-widest leading-none mb-1">Premium</span>
              <span className="text-slate-500 text-[9px] font-medium leading-none">Curated Escapes</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
