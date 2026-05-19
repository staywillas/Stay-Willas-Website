"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { Users, Bed, Bath, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      maxTilt={6}
      scale={1.03}
      lift={-10}
      className={cn("w-full bg-white/[0.02] border border-white/5 p-4 rounded-3xl transition-all duration-300 hover:border-gold/20 hover:bg-white/[0.04]", className)}
    >
      <Link href={`/villa/${id}`} className="block group w-full h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-charcoal">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={75}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Subtle top-right floating arrow indicator */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-white group-hover:bg-[#FFCC00] group-hover:border-[#FFCC00] group-hover:text-black transition-all duration-300 shadow-md">
            <ArrowUpRight size={18} />
          </div>

          {/* Quick Category Floating Badge on bottom-left */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-[9px] uppercase tracking-widest font-bold">
            Featured Stay
          </div>
        </div>
        
        {/* Content Section - Placed Below Image */}
        <div className="mt-5 flex flex-col justify-between">
          <div>
            <span className="text-[#FFCC00] text-[9px] tracking-[0.25em] uppercase font-bold mb-1.5 block">
              {location}
            </span>
            <h3 className="text-2xl font-heading text-white group-hover:text-gold transition-colors duration-300 leading-tight">
              {name}
            </h3>
          </div>
          
          {/* Specs / Features Grid */}
          <div className="mt-4 flex items-center gap-4 text-white/50 text-xs">
            <span className="flex items-center gap-1.5 font-medium"><Users size={13} className="text-gold" />{guests} Guests</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span className="flex items-center gap-1.5 font-medium"><Bed size={13} className="text-gold" />{bedrooms} Bedrooms</span>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/5 my-5" />
          
          {/* Pricing & Button Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Starts from</span>
              <span className="text-white text-lg font-bold">
                ₹{price} <span className="text-[10px] font-normal text-white/50">/ night</span>
              </span>
            </div>
            
            <div className="flex-1 max-w-[200px] bg-[#FFCC00] hover:bg-[#FFD700] text-black py-3 px-4 rounded-xl text-center text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 shadow-md group-hover:shadow-[0_0_15px_rgba(255,204,0,0.3)]">
              VIEW & BOOK
            </div>
          </div>
        </div>
      </Link>
    </ThreeDHoverCard>
  );
};

export default VillaCard;
