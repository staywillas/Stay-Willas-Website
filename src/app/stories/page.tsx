import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import TopTicker from "@/components/home/top-ticker";
import Footer from "@/components/layout/footer";
import VideoCard from "@/components/stories/video-card";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Luxury Villa Guest Stories & Testimonials | Stay Willas",
  description: "Read luxury villa guest stories & real testimonials from families who enjoyed staycations at our verified private pool estates near Mumbai & Pune.",
  keywords: ["luxury villa guest stories"],
  alternates: {
    canonical: "https://www.staywillas.com/stories",
  },
  openGraph: {
    title: "Luxury Villa Guest Stories & Testimonials | Stay Willas",
    description: "Read luxury villa guest stories & real testimonials from families who enjoyed staycations at our verified private pool estates near Mumbai & Pune.",
    url: "https://www.staywillas.com/stories",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Stay Willas Guest Stories",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villa Guest Stories & Testimonials | Stay Willas",
    description: "Read luxury villa guest stories & real testimonials from families who enjoyed staycations at our verified private pool estates near Mumbai & Pune.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EA] bg-[url('/assets/noise.png')] bg-blend-overlay">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 text-center px-6 border-b border-[#DAA520]/15">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,166,59,0.06)_0,rgba(226,166,59,0)_60%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm">
            <Sparkles size={12} className="text-[#DAA520]" /> Guest Experiences
          </span>
          <h1 className="text-4xl md:text-6xl font-heading text-[#1B3564] leading-tight mb-6">
            Luxury Villa Guest Stories & <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent drop-shadow-sm font-sans pr-2 inline-block">Testimonials</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto justify-items-center">
          <VideoCard src="/VIDEOS/TESTIMONIAL1.mp4" />
          <VideoCard src="/VIDEOS/TESTIMONIAL2.mp4" />
          <VideoCard src="/VIDEOS/TESTIMONIAL3.mp4" />
          <VideoCard src="/assets/villas/testimonials/video_20260713_123127.mp4" />
          <VideoCard src="/assets/villas/testimonials/video_20260712_123243.mp4" />
          <VideoCard src="/assets/villas/testimonials/video_20260710_120159.mp4" />
          <VideoCard src="/assets/villas/testimonials/video_20260706_104802.mp4" />
          <VideoCard src="/assets/villas/testimonials/video_20260704_112850.mp4" />
          <VideoCard src="/assets/villas/testimonials/VID-20260705-WA0006.mp4" />
        </div>
      </section>

      {/* SEO Guide Section */}
      <section className="py-16 bg-[#1B3564]/5 border-t border-[#DAA520]/15 text-charcoal">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-2xl font-heading text-[#1B3564] mb-3 font-bold">Unfiltered Staycation Vlogs</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore authentic, uncut vlogs and video walkthroughs filmed directly by our guests. See the actual layout, private pool experiences, and home-style hospitality of Stay Willas properties as experienced by real families and groups.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-heading text-[#1B3564] mb-3 font-bold">Why Our Guests Love The Angle House</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nestled in the scenic hills of Lonavala, The Angle House is celebrated for its cutting-edge modern architecture, pristine temperature-controlled pool, expansive green lawns, and professional culinary services. It offers a flawless blend of isolation and luxury convenience.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-heading text-[#1B3564] mb-3 font-bold">Book Your Own Luxury Stay Story</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ready to write your own chapter of slow luxury? Connect with our dedicated concierge today to customize your itinerary, request private chef bookings, or organize special events at one of our premium Maharashtra estates.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
