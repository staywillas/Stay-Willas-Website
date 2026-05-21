"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { Users, Bed, ArrowUpRight } from "lucide-react";
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
      className={cn("w-full bg-white border border-border-subtle p-4 md:p-5 rounded-3xl transition-all duration-500 hover:border-accent-primary/40 hover:shadow-elevated", className)}
    >
      <Link href={`/villa/${id}`} className="flex flex-col h-full group w-full">
        {/* Image Container */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gradient-warm shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={75}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Arrow indicator - Premium */}
          <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-white text-text-primary group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-glow-blue transform group-hover:scale-110">
            <ArrowUpRight size={19} strokeWidth={2.5} />
          </div>

          {/* Category Badge - Enhanced */}
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-white/95 backdrop-blur-sm border border-white/80 text-blue-600 text-[11px] uppercase tracking-widest font-bold shadow-md">
            Featured Stay
          </div>
        </div>
        
        {/* Content Section */}
        <div className="mt-6 flex flex-col flex-1 justify-between px-5 pb-4">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-blue-600 text-[11px] tracking-[0.25em] uppercase font-bold mb-2.5 block">
                {location}
              </span>
              <h3 className="text-xl md:text-2xl font-heading text-text-primary group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {name}
              </h3>
            </div>
            
            {/* Specs - Refined */}
            <div className="mt-5 flex items-center gap-4 text-text-primary/60 text-xs md:text-sm">
              <span className="flex items-center gap-1.5 font-medium"><Users size={13} className="text-blue-600" />{guests} Guests</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              <span className="flex items-center gap-1.5 font-medium"><Bed size={13} className="text-blue-600" />{bedrooms} Beds</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border-subtle my-6" />
          
          {/* Pricing & Button Row - Enhanced */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-text-primary/50 uppercase tracking-widest font-bold mb-1">Starting at</span>
              <span className="text-text-primary text-lg md:text-xl font-bold whitespace-nowrap">
                ₹{price} <span className="text-sm font-light text-text-primary/60 font-sans">/ night</span>
              </span>
            </div>
            
            <button className="flex-shrink-0 bg-accent-primary hover:bg-accent-secondary text-white py-3 px-4 rounded-xl text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-300 shadow-lg group-hover:shadow-glow-blue hover:-translate-y-1 font-sans">
              BOOK
            </button>
          </div>
        </div>
      </Link>
    </ThreeDHoverCard>
  );
};

export default VillaCard;
