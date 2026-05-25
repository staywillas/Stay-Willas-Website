import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";

export const metadata: Metadata = {
  title: "Top Luxury Destinations in Maharashtra | Stay Willas",
  description: "Explore the most exclusive staycation destinations in Maharashtra. From the misty mountains of Lonavala to the serene beaches of Alibaug, find your perfect escape.",
  keywords: ["best villa destinations", "lonavala luxury tourism", "alibaug weekend stays", "mahabaleshwar estates"],
};

const destinations = [
  {
    name: "Lonavala",
    tagline: "The Sahyadri Sanctuary",
    desc: "Misty valleys, cascading waterfalls, and sprawling private estates perched on cliff edges.",
    image: "/assets/villas/angled-house/gallery-11.webp",
    count: 12
  },
  {
    name: "Alibaug",
    tagline: "The Coastal Escape",
    desc: "Pristine beaches and ultra-modern beachfront villas just a ferry ride away from Mumbai.",
    image: "/images/villa-alibaug.png",
    count: 8
  },
  {
    name: "Mahabaleshwar",
    tagline: "The Heritage Highlands",
    desc: "Colonial-style manors surrounded by strawberry fields and ancient evergreen forests.",
    image: "/images/villa-mahabaleshwar.png",
    count: 5
  }
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center flex flex-col items-center overflow-hidden">
        {/* Background Soft Glow for Premium Aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#1B3564]/5 to-[#2563EB]/8 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow" />
        
        <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-xs md:text-sm mb-4 block">
          Our Footprint
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading leading-tight mb-2 tracking-tight">
          Curated <span className="italic text-accent-primary font-serif">Landscapes</span>
        </h1>
        
        {/* Custom Luxury Elegant Divider */}
        <div className="flex items-center gap-4 my-8 w-full max-w-[240px]">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#2563EB]/40" />
          <div className="w-2 h-2 rounded-sm border border-accent-primary bg-bg-primary rotate-45 flex-shrink-0" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#2563EB]/40" />
        </div>
        
        <p className="text-text-primary/70 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
          We don&apos;t just pick villas; we pick settings. Each of our destinations 
          offers a unique soul, carefully vetted to provide a complete sense of escape.
        </p>
      </section>

      {/* Destinations List */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-32">
        {destinations.map((dest, i) => (
          <div key={dest.name} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center group`}>
            <ThreeDHoverCard
              maxTilt={6}
              scale={1.02}
              lift={-8}
              className="w-full md:w-3/5 aspect-[3/2] rounded-3xl"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <Image 
                  src={dest.image} 
                  alt={dest.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                
                {dest.name.toLowerCase() !== "lonavala" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <span className="text-xl md:text-2xl lg:text-3xl font-heading font-black tracking-[0.25em] text-white border border-white/30 px-6 py-3.5 rounded-2xl uppercase shadow-xl select-none">
                      LAUNCHING SOON
                    </span>
                  </div>
                )}
              </div>
            </ThreeDHoverCard>
            
            <div className="w-full md:w-1/2">
              <div className="text-accent-secondary font-medium tracking-widest uppercase text-sm mb-6 flex items-center gap-4">
                <span className="h-px w-8 bg-accent-secondary" />
                {dest.tagline}
              </div>
              <h2 className="text-5xl md:text-7xl font-heading mb-8">{dest.name}</h2>
              <p className="text-text-primary/55 text-lg leading-relaxed mb-10 max-w-md">
                {dest.desc}
              </p>
              
              {dest.name.toLowerCase() === "lonavala" ? (
                <Link 
                  href={`/villas?region=${dest.name.toLowerCase()}`}
                  className="inline-flex items-center gap-4 group/link"
                >
                  <span className="w-16 h-16 rounded-full border border-[#0F172A]/20 flex items-center justify-center group-hover/link:bg-accent-primary group-hover/link:border-accent-primary group-hover/link:text-white transition-all">
                    <ArrowUpRight size={24} />
                  </span>
                  <span className="uppercase tracking-[0.2em] text-xs font-bold">Explore {dest.count} Villas</span>
                </Link>
              ) : (
                <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-[0.15em] text-accent-primary uppercase select-none">
                  LAUNCHING SOON
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
