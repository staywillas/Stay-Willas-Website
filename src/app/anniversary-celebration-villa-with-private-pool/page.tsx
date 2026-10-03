import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { 
  Heart, Sparkles, Waves, Flame, UtensilsCrossed, Moon, 
  MapPin, Users, ChevronRight, CheckCircle2, MessageCircle, 
  Star, Wine, Bath, Eye, ShieldCheck
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Anniversary Celebration Villa with Private Pool | Stay Willas",
  description: "Celebrate your anniversary at an exclusive romantic villa with private pool and heated jacuzzi near Mumbai & Pune. Enjoy candlelit dinners, mountain views & chef dining.",
  keywords: [
    "anniversary celebration villa with private pool",
    "romantic anniversary villas near mumbai",
    "anniversary staycation with private jacuzzi and pool",
    "couples anniversary villa lonavala",
    "private pool villa for anniversary celebration"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/anniversary-celebration-villa-with-private-pool",
  },
  openGraph: {
    title: "Anniversary Celebration Villa with Private Pool | Stay Willas",
    description: "Celebrate your anniversary at an exclusive romantic villa with private pool and heated jacuzzi near Mumbai & Pune. Enjoy candlelit dinners & scenic mountain views.",
    url: "https://www.staywillas.com/anniversary-celebration-villa-with-private-pool",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/willow-peak/gallery-1.webp",
        width: 1200,
        height: 630,
        alt: "Anniversary Celebration Villa with Private Pool - Stay Willas",
      }
    ],
    type: "website",
  },
};

const faqs = [
  {
    question: "Can we book a private villa or cottage specifically for just 2 people?",
    answer: "Yes! At Willow Peak in Lonavala, you can reserve individual Swiss-style A-frame chalets specifically designed for couples. You enjoy a private ensuite hydrotherapy jacuzzi tub, panoramic mountain balcony, plush king bed, and room service without paying for a massive empty 4 BHK villa."
  },
  {
    question: "Can Stay Willas set up a romantic candlelight dinner for our anniversary?",
    answer: "Absolutely. Our caretakers and in-villa culinary team can arrange an enchanting candlelit dinner setup on your private balcony, lawn gazebo, or poolside deck with rose petal decor, ambient warm lantern lighting, and a multi-course fresh dinner."
  },
  {
    question: "What privacy measures are in place for couples?",
    answer: "Complete secluded privacy is guaranteed. At Willow Peak, each chalet is oriented towards open Sahyadri valley horizons with independent entrances and private balconies. At The Angle House, the entire 3 BHK estate and waterfall swimming pool are booked exclusively for your private use."
  },
  {
    question: "How can we arrange anniversary cakes, flowers, or special decorations?",
    answer: "Simply inform our WhatsApp concierge 24 to 48 hours prior to check-in. We coordinate fresh rose bouquets, custom anniversary cakes, celebratory balloons, and champagne chilling so everything is ready the moment you step through the doors."
  },
  {
    question: "What are the drive times from Mumbai and Pune?",
    answer: "Both Lonavala properties (Willow Peak and The Angle House) are reachable within 90 minutes from Pune via NH 48 and 100 to 110 minutes from Mumbai via the Mumbai-Pune Expressway, making for an effortless romantic road trip."
  }
];

export default async function AnniversaryCelebrationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.staywillas.com/anniversary-celebration-villa-with-private-pool#webpage",
        url: "https://www.staywillas.com/anniversary-celebration-villa-with-private-pool",
        name: "Anniversary Celebration Villa with Private Pool | Stay Willas",
        description: "Celebrate your anniversary at an exclusive romantic villa with private pool and heated jacuzzi near Mumbai & Pune.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.staywillas.com" },
            { "@type": "ListItem", position: 2, name: "Anniversary Celebration Villas", item: "https://www.staywillas.com/anniversary-celebration-villa-with-private-pool" }
          ]
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1B3564]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#180D24] via-[#1F1735] to-[#0E1528] text-white overflow-hidden">
        {/* Subtle Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/villas/willow-peak/gallery-1.webp"
            alt="Anniversary Celebration Villa with Private Pool"
            fill
            className="object-cover opacity-25 filter brightness-90 contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#180D24]/85 via-[#180D24]/70 to-[#0E1528]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E0A899]/20 border border-[#E0A899]/60 text-[#FFD4C8] text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-sm">
            <Heart size={16} className="fill-[#FFD4C8]" /> Romantic Escapes & Anniversaries
          </div>

          {/* Heading - Explicit text-white to avoid any inheritance bug */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-[1.15] mb-6 !text-white drop-shadow-md">
            Anniversary Celebration Villa <br className="hidden sm:inline" />
            <span className="text-[#F5C542] underline decoration-[#DAA520]/40 decoration-wavy decoration-2 underline-offset-8">
              with Private Pool & Jacuzzi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-10 drop-shadow-sm">
            Reignite romance away from city crowds. Immerse yourselves in misty mountain chalets with private hydrotherapy jacuzzis, secluded swimming pools, candlelit balcony dinners, and starry Sahyadri night skies.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a
              href="#villas"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#0B1528] font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VIEW ROMANTIC VILLAS</span>
              <ChevronRight size={16} />
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 💖 I'm looking for an anniversary celebration villa with private pool/jacuzzi near Mumbai. Could you share romantic packages and availability?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>Chat with Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Romantic Inclusions Strip - High Contrast Navy Bar */}
      <section className="bg-[#0B1528] border-y border-[#DAA520]/25 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Private Jacuzzi</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">In-Room Hydrotherapy Soak</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Candlelit Dining</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Private Balcony Setup</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">100% Seclusion</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Couples-Only Retreats</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">From ₹4,500</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Direct Homeowner Tariffs</span>
          </div>
        </div>
      </section>

      {/* Featured Romantic Villas */}
      <section id="villas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Curated for Two</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#0B1528]">Romantic Anniversary Villa Collection</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Escape to intimate timber chalets with en-suite jacuzzis or exclusive private pool glass estates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Villa 1: Willow Peak */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/willow-peak/gallery-3.webp"
                  alt="Willow Peak Resort Kurvande Lonavala - Romantic A-Frame Chalet with Private Jacuzzi"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Kurwande, Lonavala • 1 BHK Chalet
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  In-Room Jacuzzi + Mountain Deck
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  Willow Peak Resort Kurvande — Alpine A-Frame Chalet
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Swiss-inspired standalone wooden A-frame chalet featuring an en-suite hot hydrotherapy jacuzzi bath, high timber ceilings, panoramic mountain deck, and candlelit balcony dining. Designed exclusively for romantic anniversaries.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Bath size={14} />
                    </div>
                    <span>Private Heated Jacuzzi</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Eye size={14} />
                    </div>
                    <span>Sahyadri Mountain Views</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Heart size={14} />
                    </div>
                    <span>Candlelit Dining Setup</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Moon size={14} />
                    </div>
                    <span>Quiet Kurwande Ridge</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Couple Rates</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹4,500<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/willow-peak"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Chalet & Dates →
              </Link>
            </div>
          </div>

          {/* Villa 2: The Angle House */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/the-angle-house/gallery-1.webp"
                  alt="The Angle House Lonavala - Master Jacuzzi Suite & Waterfall Pool for Anniversary"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Kamshet, Lonavala • 3 BHK Glass Villa
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  Waterfall Pool + Jacuzzi
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  The Angle House — Master Jacuzzi Suite & Waterfall Pool
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  For couples wanting absolute grandeur and exclusive estate buyout. Enjoy a master bedroom with glass-fronted jacuzzi, a private cascading waterfall swimming pool, and private gourmet chef service.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>Private Waterfall Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Bath size={14} />
                    </div>
                    <span>Master Jacuzzi Bath</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={14} />
                    </div>
                    <span>Personal Chef Dining</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Wine size={14} />
                    </div>
                    <span>Sunset Lawn Lounge</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Estate Direct Rate</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹13,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/the-angle-house"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Villa & Dates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Romantic Experience Perks */}
      <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Unforgettable Moments</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Romantic Anniversary Inclusions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Heart size={22} className="fill-[#F5C542]" />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Candlelit Balcony Dinner</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enjoy an intimate candlelight dinner served on your private timber terrace overlooking misty hills.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Bath size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Private Jacuzzi Bubbles</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Soak in your private hydrotherapy jacuzzi with soothing warm water and scenic mountain views.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Sparkles size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Floral & Room Decor</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Surprise your partner with rose petal room decor, romantic lighting, and anniversary cake setups.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Flame size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Private Bonfire & BBQ</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Spend cozy evenings around an outdoor bonfire with live skewered appetizers and acoustic melodies.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Moon size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Dark Sky Stargazing</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bask under unpolluted Sahyadri night skies on quiet private lawns far away from city streetlights.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">100% Couple Privacy</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Discrete on-site caretakers available when you need assistance, offering absolute peace and quiet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Anniversary Villa FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  ?
                </div>
                <div>
                  <h3 className="font-heading font-black text-[#0B1528] text-base sm:text-lg mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge Banner */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#180D24] to-[#1F1735] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#DAA520]/30 shadow-2xl">
          <div>
            <span className="text-[#F5C542] font-black tracking-widest uppercase text-xs block mb-2">
              Plan Your Romantic Surprise
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Celebrate Your Love Story with Stay Willas
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-xl font-light">
              Message our romantic concierge directly on WhatsApp. We will help you set up candlelight dinners, room decor, cake cutting, and jacuzzis.
            </p>
          </div>
          <a
            href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 💖 I want to check availability and romantic setups for our anniversary. Please assist me.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0 border border-white/20 cursor-pointer"
          >
            <MessageCircle size={18} className="fill-white" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Related Links */}
      <section className="bg-white py-12 px-4 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Explore More Special Occasion Stays</h3>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/private-villa-for-birthday-celebration-near-mumbai" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Villa for Birthday Celebration Near Mumbai →
            </Link>
            <Link href="/milestone-birthday-celebration-villa-maharashtra" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Milestone Birthday Celebration Villa Maharashtra →
            </Link>
            <Link href="/private-pool-party-villa-near-pune-for-family" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Pool Party Villa Near Pune for Family →
            </Link>
            <Link href="/villa/willow-peak" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Willow Peak Resort Kurvande →
            </Link>
            <Link href="/areas/lonavala" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas in Lonavala with Private Pool →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
