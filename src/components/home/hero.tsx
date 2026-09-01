"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles,
  MapPin,
  Star,
  Waves,
  UtensilsCrossed,
  Trees,
  Dog,
  Bath
} from "lucide-react";
import { motion } from "framer-motion";

const quickDestinations = [
  {
    name: "Lonavala",
    image: "/images/villa-lonavala.webp",
    href: "/areas/lonavala",
  },
  {
    name: "Khopoli",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    href: "/areas/khopoli",
  },
  {
    name: "Mahabaleshwar",
    image: "/images/villa-mahabaleshwar.webp",
    href: "/areas/mahabaleshwar",
  },
];

const visualAmenities = [
  { icon: Waves, label: "Private Pools" },
  { icon: Bath, label: "Jacuzzi Suites" },
  { icon: UtensilsCrossed, label: "Gourmet Chefs" },
  { icon: Trees, label: "Mountain Views" },
  { icon: Dog, label: "Pet Friendly" },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-center bg-[#0E1B35] min-h-[520px] md:min-h-[580px] pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-16 md:pb-20">
      
      {/* Background Image with Cinematic Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/assets/villas/the-angle-house/gallery-11.webp"
          alt="Luxury private pool villas near Mumbai - Stay Willas"
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-center animate-ken-burns scale-105"
        />
        {/* Multi-layered Dark Navy & Gold Ambient Overlays */}
        <div className="absolute inset-0 bg-[#0E1B35]/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35] via-[#0E1B35]/40 to-[#0E1B35]/60 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0E1B35]/50 to-[#0E1B35]/90 z-10" />
      </div>

      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 z-20 relative text-white flex flex-col items-center text-center">
        
        {/* Trust Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#DAA520]/20 backdrop-blur-md border border-[#DAA520]/40 px-4 py-1.5 rounded-full mb-4 shadow-sm"
        >
          <Sparkles size={13} className="text-[#DAA520]" />
          <span className="text-[#DAA520] font-black tracking-[0.2em] uppercase text-[10px] md:text-xs">
            Direct Villa Stays • 0% Commission
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#DAA520]" />
          <span className="hidden sm:inline-flex items-center gap-1 text-white font-bold text-[10px] md:text-xs">
            <Star size={11} className="text-[#DAA520] fill-[#DAA520]" /> 4.9/5 (500+ Stays)
          </span>
        </motion.div>
        
        {/* Shorter, High-Impact Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white font-normal mb-3 max-w-3xl leading-[1.15] tracking-tight"
        >
          Signature Private Pool Villas{" "}
          <span className="italic bg-gradient-to-r from-[#DAA520] via-[#F5D061] to-[#DAA520] bg-clip-text text-transparent font-bold">
            in Maharashtra
          </span>
        </motion.h1>
        
        {/* Shorter, Crisp Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm md:text-base text-slate-200/90 font-medium max-w-xl mb-6 leading-relaxed"
        >
          Exclusive private sanctuaries with private pools, jacuzzis, and on-demand gourmet chefs across Lonavala, Khopoli & Mahabaleshwar.
        </motion.p>

        {/* Visual Destination Quick-Pills (More Visuals in Hero) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 mb-5"
        >
          {quickDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={dest.href}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-[#DAA520]/60 rounded-full pl-1.5 pr-3.5 py-1 transition-all duration-300 shadow-md hover:scale-105"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden relative shrink-0 border border-white/30">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-[#DAA520] transition-colors flex items-center gap-1">
                  <MapPin size={11} className="text-[#DAA520]" />
                  {dest.name}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Visual Amenity Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="hidden sm:flex flex-wrap justify-center items-center gap-2"
        >
          {visualAmenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-white/85 bg-[#0E1B35]/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
              >
                <Icon size={12} className="text-[#DAA520]" />
                {item.label}
              </span>
            );
          })}
        </motion.div>

      </div>
      
    </section>
  );
};

export default Hero;

