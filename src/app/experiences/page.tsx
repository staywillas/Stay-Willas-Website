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
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/exp-pool.png" 
          alt="Luxury Experience" 
          fill 
          priority
          sizes="100vw"
          className="object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-transparent to-[#FFFFFF]" />
        
        <div className="relative z-10 text-center px-6">
          <span className="text-accent-secondary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
            The Stay Willas Experience
          </span>
          <h1 className="text-6xl md:text-9xl font-heading mb-8">
            Beyond <span className="italic text-accent-primary">The House</span>
          </h1>
          <p className="text-text-primary/55 text-xl max-w-xl mx-auto leading-relaxed">
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
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 30vw, 380px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-8 left-8">
                  <exp.icon className="text-accent-primary mb-4" size={32} />
                  <h3 className="text-3xl font-heading text-white">{exp.title}</h3>
                </div>
              </div>
              <p className="text-text-primary/40 leading-relaxed text-sm px-2">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 md:px-12 lg:px-24 text-center border-t border-border-subtle">
        <h2 className="text-4xl md:text-6xl font-heading mb-12">Ready for an <span className="italic text-accent-primary">Unforgettable</span> Stay?</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-16">
          {[
            { icon: Heart, text: "Personalized Concierge" },
            { icon: Zap, text: "Seamless Service" },
            { icon: Camera, text: "Picture Perfect Moments" }
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-text-primary/40 uppercase tracking-widest text-xs">
              <item.icon className="text-accent-secondary" size={16} />
              {item.text}
            </div>
          ))}
        </div>
        <a
          href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi! I'd love to experience luxury with Stay Willas. Could you help me find the perfect villa with curated experiences?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#1B3564] hover:bg-[#152A50] text-white rounded-full px-10 py-4.5 text-xs font-black tracking-[0.25em] uppercase transition-all duration-300 shadow-lg shadow-[#1B3564]/20 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          BOOK YOUR EXPERIENCE
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" /></svg>
        </a>
      </section>

      <Footer />
    </main>
  );
}
