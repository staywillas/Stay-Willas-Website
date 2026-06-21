import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Sparkles, Calendar, Heart, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Luxury Villa Experiences & Private Chef Stays | Stay Willas",
  description: "Discover curated travel and villa experiences with Stay Willas. From private chefs and BBQ services to wellness retreats, find your perfect luxury escape.",
  keywords: ["villa with private chef lonavala", "wellness retreats maharashtra", "luxury travel experiences near mumbai", "bespoke villa holidays"],
  alternates: {
    canonical: "/experiences",
  },
};

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Backdrop Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-32 pb-20">
          {/* Frosted Background */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600" 
              alt="Luxury Experience Background" 
              fill 
              priority
              sizes="100vw"
              className="object-cover opacity-25 filter grayscale" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/95 via-bg-primary/80 to-bg-primary" />
            
            {/* Elegant Amber Glow - Optimized for mobile GPU */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#DAA520]/10 to-[#1B3564]/10 rounded-full blur-3xl md:blur-[80px] pointer-events-none -z-10" />
          </div>

          {/* Coming Soon Card */}
          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
            {/* Tag */}
            <span className="text-[#DAA520] font-bold tracking-[0.3em] uppercase text-xs mb-8 inline-block bg-[#DAA520]/15 px-5 py-2.5 rounded-full border border-[#DAA520]/20 animate-fade-in select-none">
              ✨ Stay Willas Experiences
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-8xl font-heading mb-6 tracking-tight text-[#1B3564]">
              Luxury Villa <span className="italic text-[#DAA520] font-serif font-normal">Experiences</span>
            </h1>

            {/* Coming Soon Subtitle */}
            <p className="text-xl md:text-2xl font-heading tracking-[0.1em] text-accent-primary uppercase mb-8 font-black">
              EXPERIENCES COMING SOON
            </p>

            {/* Custom Elegant Divider */}
            <div className="flex items-center gap-4 my-4 w-full max-w-[240px]">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#DAA520]/40" />
              <div className="w-2.5 h-2.5 rounded-sm border border-[#DAA520] bg-bg-primary rotate-45 flex-shrink-0" />
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#DAA520]/40" />
            </div>

            {/* Description */}
            <p className="text-text-primary/70 text-lg md:text-xl leading-relaxed max-w-2xl font-light mb-12">
              We are carefully planning wonderful experiences for your stay. Soon, you will be able to book 
              local tours, wellness sessions, and private chef dinners right at your villa. We want to make 
              your holidays truly special and full of happy memories.
            </p>

            {/* Pillars Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full mb-16">
              {[
                { icon: Sparkles, title: "Wellness & Spa", desc: "Massages & relaxing yoga" },
                { icon: Calendar, title: "Fun Activities", desc: "Tours & outdoor adventures" },
                { icon: Heart, title: "Great Food", desc: "Chef-cooked tasty meals" },
                { icon: Shield, title: "Friendly Help", desc: "24/7 personal support" }
              ].map((pillar, idx) => (
                <div key={idx} className="bg-white/40 border border-[#DAA520]/15 rounded-2xl p-5 text-center shadow-sm select-none hover:border-[#DAA520]/45 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 border border-[#DAA520]/25 flex items-center justify-center text-[#DAA520] mx-auto mb-3">
                    <pillar.icon size={18} />
                  </div>
                  <h5 className="font-bold text-[11px] uppercase tracking-wider text-[#1B3564]">{pillar.title}</h5>
                  <p className="text-[9px] text-text-primary/50 mt-1">{pillar.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hello Stay Willas! 🌟 I read about your upcoming experiences. I am planning a holiday and would love to ask for some custom services (like private chefs or local recommendations) during my stay. Can you help me?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#1B3564] hover:bg-[#152A50] text-white rounded-full px-10 py-4.5 text-xs font-black tracking-[0.25em] uppercase transition-all duration-300 shadow-lg shadow-[#1B3564]/10 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer border-none"
            >
              ASK ON WHATSAPP
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" /></svg>
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
