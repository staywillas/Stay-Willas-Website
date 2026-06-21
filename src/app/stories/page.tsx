import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import TopTicker from "@/components/home/top-ticker";
import Footer from "@/components/layout/footer";
import VideoCard from "@/components/stories/video-card";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Guest Stories & Video Testimonials | Stay Willas",
  description: "Hear from our guests. Watch video reviews from luxury private pool villa staycations at The Angle House, Lonavala.",
  keywords: ["guest reviews stay willas", "villa rental reviews maharashtra", "video testimonials lonavala villa", "stay willas testimonials", "verified client reviews"],
  alternates: {
    canonical: "/stories",
  },
};

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EA] bg-[url('/assets/noise.png')] bg-blend-overlay">
      <Navbar />
      <TopTicker />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 text-center px-6 border-b border-[#DAA520]/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,166,59,0.06)_0,rgba(226,166,59,0)_60%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm">
            <Sparkles size={12} className="text-[#DAA520]" /> Guest Experiences
          </span>
          <h1 className="text-4xl md:text-6xl font-heading text-[#1B3564] leading-tight mb-6">
            Guest <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent drop-shadow-sm font-sans">Stories</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600/90 max-w-xl mx-auto leading-relaxed">
            Step into the real moments of slow luxury captured by our guests during their stays at The Angle House. Explore their video diaries.
          </p>
        </div>
      </section>

      {/* Video Diaries Section */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#DAA520] font-black tracking-[0.3em] uppercase text-[10px] mb-2.5 block">Vlog Highlights</span>
          <h2 className="text-3xl md:text-4xl font-heading text-[#1B3564] font-bold">Video Diaries</h2>
          <div className="h-[2px] w-12 bg-[#DAA520] mx-auto mt-4" />
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto justify-items-center">
          <VideoCard
            src="/VIDEOS/TESTIMONIAL1.mp4"
            title="A gorgeous architectural villa getaway. Loved every single detail!"
            guestName="Amit & Shreya S."
            villaName="The Angle House"
            location="Lonavala, MH"
          />
          <VideoCard
            src="/VIDEOS/TESTIMONIAL2.mp4"
            title="Relaxing poolside retreat. Spotless spaces and great staff hospitality."
            guestName="Dr. Riya Patel"
            villaName="The Angle House"
            location="Lonavala, MH"
          />
          <VideoCard
            src="/VIDEOS/TESTIMONIAL3.mp4"
            title="Clean lawns, pristine swimming pool, and delicious home-style food."
            guestName="Devang M."
            villaName="The Angle House"
            location="Lonavala, MH"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
