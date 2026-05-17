import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Gift, Zap, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Exclusive Villa Packages | Stay Willas Offers",
  description: "Explore our curated villa packages. From romantic getaways to corporate offsites, discover special deals on Maharashtra's finest villas.",
  keywords: ["villa deals maharashtra", "honeymoon packages lonavala", "corporate offsite villas", "Stay Willas packages"],
};

const packages = [
  {
    title: "Romantic Getaway",
    tagline: "Just the Two of You",
    desc: "A beautiful 2-night stay complete with a private candlelit dinner, romantic decor, and breakfast right by the pool.",
    price: "₹65,000",
    image: "/images/exp-pool.png",
    perks: ["Private Chef", "Decor", "Spa Session"]
  },
  {
    title: "Work from the Hills",
    tagline: "Change Your Desk View",
    desc: "Perfect for corporate teams or remote workers. Super fast Wi-Fi, unlimited great coffee, and peaceful work spots.",
    price: "₹1,20,000",
    image: "/images/hero-villa.png",
    perks: ["Starlink WiFi", "Projector", "Meeting Support"]
  },
  {
    title: "Weekend Extended",
    tagline: "Stay 3 nights, Pay for 2",
    desc: "Get an extra night on us! Perfect for families who want to slow down and spend a bit more time away from the city.",
    price: "Starts at ₹85,000",
    image: "/images/villa-alibaug.png",
    perks: ["Free Night", "Late Checkout", "Kids Activities"]
  }
];

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
          Our Offers
        </span>
        <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
          Special <br />
          <span className="italic text-gold text-gradient">Offers</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          Get the most out of your holiday with these special stay packages, 
          created for families, couples, and groups.
        </p>
      </section>

      {/* Packages Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {packages.map((pkg) => (
            <div key={pkg.title} className="glass-dark border border-white/5 rounded-[32px] overflow-hidden group hover:border-gold/30 transition-all flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={pkg.image} 
                  alt={pkg.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-6 left-6 px-4 py-1 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Limited Offer
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">{pkg.tagline}</span>
                <h3 className="text-3xl font-heading mb-4">{pkg.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 flex-grow">
                  {pkg.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {pkg.perks.map(perk => (
                    <span key={perk} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/60">
                      {perk}
                    </span>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest block">Price</span>
                    <span className="text-2xl font-heading text-white">{pkg.price}</span>
                  </div>
                  <Button className="bg-gold hover:bg-gold/80 text-charcoal rounded-full px-6 font-bold">
                    INQUIRE
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-16">
          {[
            { icon: Gift, text: "Complimentary Welcome" },
            { icon: Clock, text: "Early Check-in Subject to Avail" },
            { icon: Star, text: "Premium Guest Support" },
            { icon: Zap, text: "Instant Confirmation" }
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-3 text-white/40 text-[10px] uppercase tracking-widest">
              <badge.icon size={16} className="text-gold" />
              {badge.text}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
