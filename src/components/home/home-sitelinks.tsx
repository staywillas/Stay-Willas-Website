"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Percent, 
  MapPin, 
  Trees, 
  Waves, 
  Crown, 
  CalendarCheck, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";

export interface SitelinkItem {
  id: string;
  title: string;
  line1: string;
  line2: string;
  href: string;
  badge?: string;
  icon: React.ElementType;
  isExternal?: boolean;
}

export const homeSitelinksData: SitelinkItem[] = [
  {
    id: "weekday-offer",
    title: "26% Off Weekday Stays",
    line1: "Save 26% on weekdays",
    line2: "Book your villa today",
    href: "/villas?offer=weekday",
    badge: "Special Deal",
    icon: Percent,
  },
  {
    id: "lonavala-villas",
    title: "Lonavala Villas",
    line1: "Explore villas in Lonavala",
    line2: "Check prices & availability",
    href: "/areas/lonavala",
    badge: "Top Pick",
    icon: MapPin,
  },
  {
    id: "khopoli-villas",
    title: "Khopoli Villas",
    line1: "Discover private villas",
    line2: "View amenities & prices",
    href: "/areas/khopoli",
    badge: "Scenic Foothills",
    icon: Trees,
  },
  {
    id: "private-pool-villas",
    title: "Private Pool Villas",
    line1: "Enjoy your own private pool",
    line2: "Perfect for groups & families",
    href: "/villas-in-lonavala-with-private-pool",
    badge: "100% Private",
    icon: Waves,
  },
  {
    id: "luxury-villas-near-mumbai",
    title: "Luxury Villas Near Mumbai",
    line1: "Premium villas for getaways",
    line2: "Easy weekend escape",
    href: "/destinations",
    badge: "Weekend Escape",
    icon: Crown,
  },
  {
    id: "book-your-villa",
    title: "Book Your Villa",
    line1: "Check dates & villa options",
    line2: "Call or WhatsApp us",
    href: "https://wa.me/919619042310?text=Hi%20Stay%20Willas!%20%F0%9F%8F%A1%20I'd%20like%20to%20check%20dates%20and%20villa%20options%20for%20our%20upcoming%20getaway.",
    badge: "Direct Rates",
    icon: CalendarCheck,
    isExternal: true,
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

        {/* Sitelinks 6-Card Responsive Grid */}
        <nav aria-label="Homepage Sitelinks Grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {homeSitelinksData.map((item, idx) => {
            const Icon = item.icon;
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
              >
                <CardWrapper
                  {...linkProps}
                  className="group block h-full bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#FAF8F5] border border-slate-200/80 hover:border-[#DAA520] rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
                >
                  {/* Subtle Top Border Glow on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#1B3564] group-hover:via-[#DAA520] group-hover:to-[#1B3564] transition-all duration-300" />

                  <div className="flex items-start justify-between gap-4">
                    {/* Icon Box */}
                    <div className="w-11 h-11 rounded-xl bg-[#1B3564]/5 group-hover:bg-[#DAA520]/15 text-[#1B3564] group-hover:text-[#DAA520] flex items-center justify-center transition-colors shrink-0 border border-slate-100 group-hover:border-[#DAA520]/30 shadow-xs">
                      <Icon size={20} className="stroke-[2]" />
                    </div>

                    {/* Badge & Arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-[#DAA520]/20 group-hover:text-[#1B3564] transition-colors border border-slate-200/50">
                          {item.badge}
                        </span>
                      )}
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#DAA520] text-slate-500 group-hover:text-[#1B3564] flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                        <ArrowUpRight size={13} className="stroke-[2.5]" />
                      </span>
                    </div>
                  </div>

                  {/* Sitelink Content (Text, Description Line 1, Description Line 2) */}
                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-heading font-bold text-[#1B3564] group-hover:text-[#DAA520] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-1.5 space-y-0.5 text-xs text-slate-600 leading-relaxed font-normal">
                      <p className="text-slate-800 font-medium">
                        {item.line1}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {item.line2}
                      </p>
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
