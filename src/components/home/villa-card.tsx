"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { Users, Bed, Bath, MapPin, ArrowUpRight } from "lucide-react";
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
      maxTilt={5}
      scale={1.02}
      lift={-8}
      className={cn("w-full bg-[#FDFBF7] border border-[#D1C7B3]/45 p-2 md:p-3.5 rounded-xl md:rounded-2xl transition-all duration-500 hover:border-[#DAA520]/50 hover:shadow-[0_15px_40px_rgba(27,53,100,0.10)]", className)}
    >
      <Link href={`/villa/${id}`} className="flex flex-col h-full group w-full">
        {/* Image Container */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg md:rounded-xl bg-gradient-warm shrink-0">
          <Image
            src={image}
            alt={`Luxury private pool villas near Mumbai: ${name} in ${location}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            quality={75}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Arrow indicator - Premium */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 w-6 h-6 md:w-9 md:h-9 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md hidden sm:flex items-center justify-center border border-white/80 text-[#1B3564] group-hover:bg-[#DAA520] group-hover:border-[#DAA520] group-hover:text-[#FDFBF7] transition-all duration-500 shadow-md group-hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] transform group-hover:scale-110 group-hover:rotate-45">
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </div>

          {/* Wishlist Heart Button */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 scale-90" onClick={(e) => e.stopPropagation()}>
            <WishlistButton villaId={id} size="sm" />
          </div>

          {/* Category Badge - Enhanced Glassmorphism */}
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 px-2 md:px-2.5 py-1 rounded-full bg-[#1B3564]/90 backdrop-blur-md border border-[#DAA520]/30 text-[#FAF8F5] text-[7.5px] md:text-[9px] uppercase tracking-[0.2em] font-bold shadow-md hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse shrink-0" />
            Featured Stay
          </div>
        </div>
        
        {/* Content Section */}
        <div className="mt-2 md:mt-4 flex flex-col flex-1 justify-between px-0.5 pb-0.5 md:px-2 md:pb-2">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Destination Tag */}
              <div className="flex items-center gap-1 mb-1 md:mb-1.5">
                <MapPin size={9} className="text-[#DAA520] shrink-0" />
                <span className="text-[#DAA520] text-[7.5px] md:text-[9px] tracking-[0.25em] uppercase font-extrabold block truncate">
                  {location}
                </span>
              </div>
              <h3 className="text-xs sm:text-base md:text-lg lg:text-base xl:text-lg font-heading text-[#1B3564] group-hover:text-[#DAA520] transition-colors duration-300 leading-tight line-clamp-1">
                {name}
              </h3>
            </div>
            
            {/* Specs - Refined with elegant tags */}
            <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-y-1 gap-x-1 sm:gap-x-2 text-[#1B3564] text-[8px] sm:text-[10px]">
              <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-md sm:rounded-lg">
                <Users size={9} className="text-[#DAA520]" />
                {guests}<span className="hidden sm:inline"> Guests</span><span className="sm:hidden">G</span>
              </span>
              <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-md sm:rounded-lg">
                <Bed size={9} className="text-[#DAA520]" />
                {bedrooms}<span className="hidden sm:inline"> {bedrooms === 1 ? "Bed" : "Beds"}</span><span className="sm:hidden">B</span>
              </span>
              {bathrooms > 0 && (
                <span className="flex items-center gap-1 font-bold bg-[#1B3564]/5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-md sm:rounded-lg">
                  <Bath size={9} className="text-[#DAA520]" />
                  {bathrooms}<span className="hidden sm:inline"> {bathrooms === 1 ? "Bath" : "Baths"}</span><span className="sm:hidden">Ba</span>
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#D1C7B3]/30 my-2 md:my-3.5" />
          
          {/* Pricing & Button Row - Enhanced */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col text-left">
              <span className="text-[7.5px] md:text-[8px] text-[#1B3564]/50 uppercase tracking-[0.2em] font-extrabold mb-0.5 block">Starting at</span>
              <span className="text-[#1B3564] text-xs sm:text-base md:text-md font-bold whitespace-nowrap">
                ₹{price} <span className="text-[8px] sm:text-xs font-light text-text-primary/60 font-sans">/ night</span>
              </span>
            </div>
            
            <button className="hidden sm:block flex-shrink-0 bg-accent-primary hover:bg-[#5C742D] text-[#FAF8F5] py-2 px-3.5 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-[0_6px_15px_rgba(74,93,35,0.25)] hover:-translate-y-0.5 font-sans">
              BOOK
            </button>
          </div>
        </div>
      </Link>
    </ThreeDHoverCard>
  );
};

export default VillaCard;
