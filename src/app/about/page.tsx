import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Award, ShieldCheck, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Stay Willas | Premier Luxury Villa Rentals in Maharashtra",
  description: "Learn about the philosophy behind Stay Willas. We are dedicated to curating the most exclusive luxury villa experiences in Maharashtra.",
  keywords: ["about stay willas", "luxury hospitality company maharashtra", "premium villa curation experts", "best villa rental company near mumbai"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent-secondary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
              What Luxury <br />
              <span className="italic text-accent-primary">Really Means.</span>
            </h1>
            <p className="text-text-primary/55 text-xl leading-relaxed mb-10">
              Stay Willas started because we realized something simple: a great holiday isn&apos;t just about 
              a fancy house. It&apos;s about how a space makes you feel, and the care and warmth you 
              experience while you&apos;re there.
            </p>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/hero-villa.png" 
              alt="Luxury Estate" 
              fill 
              priority
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 550px"
              className="object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading mb-6 italic">What We Believe In</h2>
            <div className="w-24 h-px bg-accent-primary/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "Handpicked", desc: "We personally visit and check every home to ensure everything is perfect." },
              { icon: Sparkles, title: "Unique Stays", desc: "Access to beautiful private homes you won't find anywhere else." },
              { icon: Heart, title: "Hospitality", desc: "Warm, friendly local hosts who love making you feel welcome." },
              { icon: Award, title: "Quality", desc: "Creating beautiful, stress-free staycations you'll love." }
            ].map((pillar) => (
              <div key={pillar.title} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-border-subtle flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-primary group-hover:text-white transition-all">
                  <pillar.icon size={32} />
                </div>
                <h3 className="text-xl font-heading mb-4">{pillar.title}</h3>
                <p className="text-text-primary/40 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-white rounded-[40px] p-12 md:p-24 border border-border-subtle text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-3xl md:text-5xl font-heading mb-10 max-w-3xl mx-auto leading-tight">
            &quot;We don&apos;t just book villas. We want to help you make memories that stay with you long after you&apos;ve checked out.&quot;
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-secondary/15 flex items-center justify-center">
              <span className="text-accent-secondary font-bold italic font-heading">W</span>
            </div>
            <div className="text-left">
              <p className="font-bold tracking-widest text-xs uppercase">The Stay Willas Team</p>
              <p className="text-text-primary/40 text-[10px] uppercase tracking-widest">Curation Specialists</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
