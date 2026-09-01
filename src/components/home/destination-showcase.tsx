"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles, Waves, Bath, Trees, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

const destinations = [
  {
    id: "the-angle-house",
    name: "The Angle House",
    location: "Lonavala",
    fullLocation: "Kurwande, Lonavala",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    link: "/villa/the-angle-house",
    tag: "Mountain Escapes",
    badge: "Signature Stay",
    features: ["Waterfall Pool", "Master Jacuzzi", "Private Chef"],
    desc: "Iconic glass architecture with uninterrupted Sahyadri views and waterfall pool."
  },
  {
    id: "canopy-crest",
    name: "Canopy Crest",
    location: "Khopoli",
    fullLocation: "Near Imagicaa, Khopoli",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    link: "/villa/canopy-crest",
    tag: "Nature Getaways",
    badge: "Family Favorite",
    features: ["22ft Swimming Pool", "Expansive Lawn", "In-House Dining"],
    desc: "4 BHK private estate surrounded by lush foothills, perfect for family reunions."
  },
  {
    id: "willow-peak",
    name: "Willow Peak",
    location: "Lonavala",
    fullLocation: "Kurwande, Lonavala",
    image: "/assets/villas/willow-peak/main.webp",
    link: "/villa/willow-peak",
    tag: "A-Frame Chalets",
    badge: "Romantic Stays",
    features: ["Private Jacuzzi", "Timber Balcony", "Lake Proximity"],
    desc: "Boutique wooden chalets nestled in nature with en-suite heated jacuzzi tubs."
  },
  {
    id: "terra-cotta-villa",
    name: "Terra Cotta Villa",
    location: "Mahabaleshwar",
    fullLocation: "Panchgani-Mahabaleshwar Road",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    link: "/villa/terra-cotta-villa",
    tag: "Strawberry Valleys",
    badge: "Valley Retreat",
    features: ["Private Pool", "Luxury En-Suites", "Lawn Gazebo"],
    desc: "4 BHK rustic terracotta estate with misty valley views and fresh berry orchards."
  }
];

const DestinationShowcase = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-28 bg-bg-primary relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#DAA520]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-3 inline-flex items-center gap-1.5 bg-[#DAA520]/15 px-4 py-1.5 rounded-full border border-[#DAA520]/25 shadow-xs">
              <Sparkles size={12} className="text-[#DAA520]" /> Handpicked Estates
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-[#1B3564] leading-tight mt-2 font-normal tracking-wide">
              Featured <span className="italic text-[#DAA520]">Destinations & Stays</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-3 max-w-xl mx-auto font-medium">
              Explore our verified private pool estates across Maharashtra&apos;s most scenic hill stations.
            </p>
          </motion.div>
        </div>

        {/* High-Performance Interactive Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHoveredId(dest.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative h-[440px] sm:h-[480px] lg:h-[520px] rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl border-2 border-slate-200/80 hover:border-[#DAA520] transition-all duration-500 flex flex-col justify-between bg-[#0E1B35]"
            >
              {/* Image Container with Ken-Burns Hover Zoom */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={`${dest.name} in ${dest.location}, Maharashtra`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={80}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Multi-layered High-Contrast Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35] via-[#0E1B35]/40 to-black/25 z-10" />
                <div className="absolute inset-0 bg-[#1B3564]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              </div>

              {/* Top Card Badges */}
              <div className="relative z-20 p-5 flex items-center justify-between w-full">
                <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/30 shadow-xs">
                  <MapPin size={11} className="text-[#DAA520]" />
                  {dest.location}
                </span>

                <span className="bg-[#DAA520] text-[#1B3564] font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                  {dest.badge}
                </span>
              </div>

              {/* Bottom Card Content & Actions */}
              <div className="relative z-20 p-5 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-[#DAA520] uppercase tracking-widest mb-1 block">
                  {dest.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2 leading-tight group-hover:text-[#DAA520] transition-colors duration-300">
                  {dest.name}
                </h3>

                <p className="text-xs text-slate-200/90 line-clamp-2 mb-4 font-normal leading-relaxed">
                  {dest.desc}
                </p>

                {/* Amenity Feature Chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {dest.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[10px] font-semibold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/15"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  href={dest.link}
                  className="w-full bg-[#DAA520] hover:bg-[#c99619] text-[#1B3564] font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Explore Villa</span>
                  <ArrowUpRight size={14} className="stroke-[2.5]" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DestinationShowcase;
