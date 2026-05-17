import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
    image: "/images/villa-lonavala.png",
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
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
              Our Footprint
            </span>
            <h1 className="text-5xl md:text-8xl font-heading leading-tight">
              Curated <br />
              <span className="italic text-gold">Landscapes</span>
            </h1>
          </div>
          <p className="text-white/40 text-xl leading-relaxed lg:pb-4">
            We don&apos;t just pick villas; we pick settings. Each of our destinations 
            offers a unique soul, carefully vetted to provide a complete sense of escape.
          </p>
        </div>
      </section>

      {/* Destinations List */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-32">
        {destinations.map((dest, i) => (
          <div key={dest.name} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center group`}>
            <div className="w-full md:w-3/5 aspect-[3/2] relative overflow-hidden rounded-3xl">
              <Image 
                src={dest.image} 
                alt={dest.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="text-gold font-medium tracking-widest uppercase text-sm mb-6 flex items-center gap-4">
                <span className="h-px w-8 bg-gold" />
                {dest.tagline}
              </div>
              <h2 className="text-5xl md:text-7xl font-heading mb-8">{dest.name}</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
                {dest.desc}
              </p>
              
              <Link 
                href={`/villas?region=${dest.name.toLowerCase()}`}
                className="inline-flex items-center gap-4 group/link"
              >
                <span className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-gold group-hover/link:border-gold group-hover/link:text-charcoal transition-all">
                  <ArrowUpRight size={24} />
                </span>
                <span className="uppercase tracking-[0.2em] text-xs font-bold">Explore {dest.count} Villas</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
