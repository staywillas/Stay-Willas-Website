import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Utensils, Sparkles, Map, Heart, Zap, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Luxury Travel Experiences | Stay Willas Lifestyle",
  description: "Beyond just a villa booking. Discover Stay Willas' curated experiences including private chefs, wellness retreats, and guided local tours.",
  keywords: ["private chef villa", "luxury wellness retreat", "curated travel india", "Stay Willas experiences"],
};

const experiences = [
  {
    icon: Utensils,
    title: "Homemade Feast",
    desc: "Private chefs who cook whatever you're in the mood for—from local favorites to gourmet meals.",
    image: "/images/exp-chef.png"
  },
  {
    icon: Sparkles,
    title: "Wellness & Spa",
    desc: "Relaxing massages, yoga at sunrise, and therapies designed to help you truly unwind.",
    image: "/images/exp-wellness.png"
  },
  {
    icon: Map,
    title: "Guided Discovery",
    desc: "Discover secret trails, local artists, and hidden spots with our friendly local guides.",
    image: "/images/exp-pool.png"
  }
];

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/exp-pool.png" 
          alt="Luxury Experience" 
          fill 
          className="object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal" />
        
        <div className="relative z-10 text-center px-6">
          <span className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
            The Stay Willas Experience
          </span>
          <h1 className="text-6xl md:text-9xl font-heading mb-8">
            Beyond <span className="italic text-gold">The House</span>
          </h1>
          <p className="text-white/60 text-xl max-w-xl mx-auto leading-relaxed">
            We don&apos;t just rent out homes. We want to help you make memories that stay with 
            you long after you&apos;ve checked out.
          </p>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {experiences.map((exp) => (
            <div key={exp.title} className="group">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8">
                <Image 
                  src={exp.image} 
                  alt={exp.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-8 left-8">
                  <exp.icon className="text-gold mb-4" size={32} />
                  <h3 className="text-3xl font-heading text-white">{exp.title}</h3>
                </div>
              </div>
              <p className="text-white/40 leading-relaxed text-sm px-2">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 md:px-12 lg:px-24 text-center border-t border-white/5">
        <h2 className="text-4xl md:text-6xl font-heading mb-12">Ready for an <span className="italic text-gold">Unforgettable</span> Stay?</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {[
            { icon: Heart, text: "Personalized Concierge" },
            { icon: Zap, text: "Seamless Service" },
            { icon: Camera, text: "Picture Perfect Moments" }
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-white/40 uppercase tracking-widest text-xs">
              <item.icon className="text-gold" size={16} />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
