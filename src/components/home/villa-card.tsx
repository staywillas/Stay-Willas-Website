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
              {id.includes("willow-peak") && name.includes("(") ? "Willow Peak" : name}
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
                ₹{id === "terra-cotta-villa" || id === "mahabaleshwar-terra-cotta"
                  ? "14,000"
                  : id === "lonavala-willow-peak" || id === "willow-peak" 
                  ? "17,997" 
                  : id.includes("cottage") 
                  ? "4,999" 
                  : price} <span className="text-[8px] sm:text-[10px] font-normal text-slate-500 font-sans">/ night {id.includes("cottage") ? "/ cottage" : ""}</span>
              </span>
              <span className="text-[7.5px] sm:text-[8px] text-amber-800/80 font-medium italic mt-0.5 block">
                *Prices may vary due to demand
              </span>
            </div>
            <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              0% Fee
            </span>
          </div>

          {/* Action Button */}
          <div className="w-full">
            <Link
              href={`/villa/${id}#booking-card-section`}
              className="w-full bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white py-2.5 px-3 rounded-xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center justify-center text-center shadow-xs cursor-pointer active:scale-95"
            >
              Dates &amp; Rates
            </Link>
          </div>
        </div>

      </div>
    </ThreeDHoverCard>
  );
};

export default VillaCard;

