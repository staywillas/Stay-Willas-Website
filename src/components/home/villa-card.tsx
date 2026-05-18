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
      className={cn("w-full rounded-2xl", className)}
    >
      <Link href={`/villa/${id}`} className="block group w-full h-full">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-charcoal rounded-2xl">
          {/* Image */}
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-80" />
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-bold mb-1 block">
                  {location}
                </span>
                <h3 className="text-2xl font-heading text-white group-hover:text-gold transition-colors duration-300">
                  {name}
                </h3>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-gold group-hover:border-gold group-hover:text-charcoal transition-all duration-300">
                <ArrowUpRight size={20} />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users size={14} />{guests} guests</span>
                  <span className="flex items-center gap-1"><Bed size={14} />{bedrooms} rooms</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-gold/60 block uppercase tracking-wider font-bold">Starts from</span>
                <span className="text-white font-semibold">₹{price} <span className="text-[10px] font-normal text-white/60">/ night</span></span>
              </div>
            </div>

            <div className="mt-6 w-full bg-[#FFCC00] hover:bg-[#FFD700] text-black py-4 rounded-xl text-center text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,204,0,0.3)]">
              VIEW DETAILED HOUSE & BOOK NOW
            </div>
          </div>
        </div>
      </Link>
    </ThreeDHoverCard>
  );
};

export default VillaCard;
