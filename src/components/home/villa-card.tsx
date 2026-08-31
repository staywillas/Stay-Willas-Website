"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { Users, Bed, Bath, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import WishlistButton from "@/components/villa/wishlist-button";

interface VillaCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  price: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  className?: string;
}

const VillaCard = ({
  id,
  name,
  location,
  image,
  price,
  guests,
  bedrooms,
  bathrooms,
  className,
}: VillaCardProps) => {
  const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I'm looking at *${name}* in ${location} (₹${price}/night) on your website. Could you check availability and share the best deal for our group?`)}`;

  return (
    <ThreeDHoverCard
      maxTilt={4}
      scale={1.015}
      lift={-6}
      className={cn("w-full bg-[#FDFBF7] border border-[#D1C7B3]/50 p-2.5 sm:p-3.5 rounded-2xl md:rounded-3xl transition-all duration-300 hover:border-[#DAA520] hover:shadow-[0_15px_35px_rgba(27,53,100,0.12)] flex flex-col justify-between", className)}
    >
      <div className="flex flex-col h-full group w-full justify-between">
        
        {/* Top Link Wrap */}
        <Link href={`/villa/${id}`} className="block relative w-full">
          {/* Image Container */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl md:rounded-2xl bg-slate-200 shrink-0">
            <Image
              src={image}
              alt={`Luxury villas near Mumbai - ${name} in ${location}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
              quality={75}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Arrow indicator - Top Right */}
            <div className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md flex items-center justify-center border border-white/80 text-[#1B3564] group-hover:bg-[#DAA520] group-hover:text-white transition-all duration-300 shadow-md">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </div>

            {/* Wishlist Heart Button */}
            <div className="absolute top-2.5 left-2.5 z-10 scale-90" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <WishlistButton villaId={id} size="sm" />
            </div>

            {/* Verified Badge */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#1B3564]/90 backdrop-blur-md border border-[#DAA520]/40 text-[#FAF8F5] text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{id.includes("willow") ? "Private Jacuzzi" : "Private Pool"}</span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="mt-3 flex flex-col text-left px-1">
            {/* Destination Tag */}
            <div className="flex items-center gap-1 mb-1">
              <MapPin size={10} className="text-[#DAA520] shrink-0" />
              <span className="text-[#DAA520] text-[8px] sm:text-[9.5px] tracking-[0.2em] uppercase font-black truncate">
                {location}
              </span>
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-heading text-[#1B3564] group-hover:text-[#DAA520] transition-colors duration-300 font-bold leading-tight line-clamp-1">
              {name}
            </h3>
            
            {/* Specs */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[#1B3564] text-[9px] sm:text-[10px]">
              <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-2 py-0.5 rounded-md">
                <Users size={10} className="text-[#DAA520]" />
                {guests} Pax
              </span>
              <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-2 py-0.5 rounded-md">
                <Bed size={10} className="text-[#DAA520]" />
                {bedrooms} Beds
              </span>
              {bathrooms > 0 && (
                <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-2 py-0.5 rounded-md">
                  <Bath size={10} className="text-[#DAA520]" />
                  {bathrooms} Baths
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Bottom Pricing & Explicit Dual Action CTAs */}
        <div className="mt-3 pt-2.5 border-t border-[#D1C7B3]/40 px-1">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex flex-col text-left">
              <span className="text-[7.5px] sm:text-[8px] text-[#1B3564]/60 uppercase tracking-widest font-extrabold">Starting at</span>
              <span className="text-[#1B3564] text-xs sm:text-base font-black whitespace-nowrap">
                ₹{price} <span className="text-[8px] sm:text-[10px] font-normal text-slate-500 font-sans">/ night</span>
              </span>
            </div>
            <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              0% Fee
            </span>
          </div>

          {/* Dual Conversion Action Buttons (Visible on Mobile & Desktop) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/villa/${id}`}
              className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white py-2 px-2.5 rounded-xl text-[9px] sm:text-[10px] font-black tracking-wider uppercase transition-all duration-200 flex items-center justify-center text-center shadow-xs cursor-pointer"
            >
              View Details
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-2 rounded-xl text-[9px] sm:text-[10px] font-black tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              title="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white shrink-0">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </ThreeDHoverCard>
  );
};

export default VillaCard;

