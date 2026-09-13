"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

export interface SitelinkItem {
  id: string;
  title: string;
  line1: string;
  line2: string;
  href: string;
  badge?: string;
  image: string;
  isExternal?: boolean;
}

export const homeSitelinksData: SitelinkItem[] = [
  {
    id: "lonavala-villa-pool",
    title: "Lonavala Villa Pool",
    line1: "Top villas in Lonavala with private pool",
    line2: "What makes The Angle House one of the top villas with private pool...",
    href: "/villas-in-lonavala-with-private-pool",
    badge: "Private Pool",
    image: "/images/sitelinks/angle-house-pool-exact.webp",
  },
  {
    id: "luxury-villas-khopoli",
    title: "Luxury Villas in Khopoli",
    line1: "Canopy Crest • Sahyadri nature sanctuary",
    line2: "Escape to a stunning nature sanctuary with mountain views & hospitality...",
    href: "/areas/khopoli",
    badge: "Nature Escape",
    image: "/images/sitelinks/khopoli-canopy.webp",
  },
  {
    id: "luxury-villas-mumbai",
    title: "Luxury Villas Near Mumbai",
    line1: "Browse our handpicked collection for rent",
    line2: "Curated private estates across Lonavala & Khopoli with private pools...",
    href: "/villas",
    badge: "All Villas",
    image: "/images/sitelinks/willow-peak-chalets.webp",
  },
  {
    id: "about-stay-willas",
    title: "About",
    line1: "Learn about Stay Willas, our story & values",
    line2: "Discover our curation process & bespoke villa hospitality...",
    href: "/about",
    badge: "Our Story",
    image: "/images/sitelinks/about-story.webp",
  },
  {
    id: "villa-destinations",
    title: "Villa Destinations in Maharashtra",
    line1: "How do I book an exclusive stay through Stay Willas?",
    line2: "Explore premium getaways across Lonavala, Khopoli & beyond...",
    href: "/destinations",
    badge: "Destinations",
    image: "/images/sitelinks/maharashtra-hills-villa.webp",
  },
  {
    id: "luxury-experiences",
    title: "Luxury Villa Experiences",
    line1: "Carefully planned wonderful experiences for your stay",
    line2: "Curated dining, celebrations, and serene weekend escapes...",
    href: "/experiences",
    badge: "Experiences",
    image: "/images/sitelinks/luxury-experiences.webp",
  },
];

export default function HomeSitelinks() {
  return (
    <section 
      aria-label="Popular Sitelinks & Quick Access"
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-12 bg-[#FAF8F5] border-y border-[#DAA520]/20 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#DAA520]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#1B3564]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <span className="text-[#DAA520] font-black tracking-[0.25em] uppercase text-[10px] sm:text-xs mb-2 inline-flex items-center gap-1.5 bg-[#DAA520]/15 px-3.5 py-1 rounded-full border border-[#DAA520]/25">
              <Sparkles size={12} className="text-[#DAA520]" /> Quick Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#1B3564] font-bold tracking-tight mt-1">
              Explore <span className="italic text-[#DAA520]">Popular Stays</span> & Deals
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
              Direct access to our most requested villa collections, regional guides, and seasonal privileges.
            </p>
          </div>

          <Link
            href="/villas"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1B3564] hover:text-[#DAA520] transition-colors self-start sm:self-end shrink-0"
          >
            <span>View All Villas</span>
            <ArrowUpRight size={14} className="stroke-[2.5]" />
          </Link>
        </div>

        {/* Sitelinks 6-Card Responsive Grid with Image Backgrounds */}
        <nav aria-label="Homepage Sitelinks Grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {homeSitelinksData.map((item, idx) => {
            const CardWrapper = item.isExternal ? "a" : Link;
            const linkProps = item.isExternal 
              ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: item.href };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="h-full"
              >
                <CardWrapper
                  {...linkProps}
                  className="group relative block h-[240px] sm:h-[260px] rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#DAA520] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Category Background Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    {/* Multi-stop Luxury Dark Overlay for High Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070E1A]/95 via-[#070E1A]/55 to-[#070E1A]/30 group-hover:via-[#070E1A]/45 transition-colors duration-500" />
                  </div>

                  {/* Subtle Top Gold Border Glow on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#1B3564] group-hover:via-[#DAA520] group-hover:to-[#1B3564] transition-all duration-300 z-10" />

                  {/* Content Container */}
                  <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
                    {/* Top Row: Category Badge + Arrow Icon */}
                    <div className="flex items-center justify-between gap-3">
                      {item.badge ? (
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#070E1A]/60 backdrop-blur-md text-[#DAA520] border border-[#DAA520]/40 shadow-xs">
                          {item.badge}
                        </span>
                      ) : <span />}

                      <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white group-hover:bg-[#DAA520] group-hover:text-[#0B1528] group-hover:border-[#DAA520] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0 shadow-xs">
                        <ArrowUpRight size={15} className="stroke-[2.5]" />
                      </span>
                    </div>

                    {/* Bottom Row: Title + Descriptions */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-white group-hover:text-[#DAA520] transition-colors leading-snug drop-shadow-sm">
                        {item.title}
                      </h3>
                      <div className="mt-1.5 space-y-0.5">
                        <p className="text-white/95 text-xs sm:text-sm font-medium leading-snug line-clamp-1 drop-shadow-xs">
                          {item.line1}
                        </p>
                        <p className="text-white/75 text-[11px] sm:text-xs leading-relaxed line-clamp-2 drop-shadow-xs">
                          {item.line2}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </nav>

      </div>
    </section>
  );
}
