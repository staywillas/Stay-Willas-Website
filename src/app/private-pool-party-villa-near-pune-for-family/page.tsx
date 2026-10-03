import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { 
  Waves, Sparkles, Heart, Users, Flame, UtensilsCrossed, 
  MapPin, ShieldCheck, ChevronRight, CheckCircle2, MessageCircle, 
  Star, Car, Sun, Gamepad2, Compass
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Private Pool Party Villa Near Pune for Family | Stay Willas",
  description: "Book an exclusive private pool party villa near Pune for your family. Just 60–90 mins drive: filtered swimming pools, kid-safe lawns, in-house chefs & total privacy.",
  keywords: [
    "private pool party villa near pune for family",
    "pool party villas near pune for family",
    "private swimming pool villa near pune with lawn",
    "family pool villa lonavala from pune",
    "weekend pool party villa for family near pune"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/private-pool-party-villa-near-pune-for-family",
  },
  openGraph: {
    title: "Private Pool Party Villa Near Pune for Family | Stay Willas",
    description: "Book an exclusive private pool party villa near Pune for your family. Filtered swimming pools, kid-safe lawns, in-house chefs & total privacy.",
    url: "https://www.staywillas.com/private-pool-party-villa-near-pune-for-family",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "Private Pool Party Villa Near Pune for Family - Stay Willas",
      }
    ],
    type: "website",
  },
};

const faqs = [
  {
    question: "How long is the drive from Pune (Wakad / Baner / Hinjawadi)?",
    answer: "Our villas are exceptionally close for Pune families! The Angle House (Kamshet/Lonavala) is just 65 km away (approx. 70 to 80 minutes drive via the Expressway). Canopy Crest in Khopoli is roughly 85 km (80 to 90 minutes drive). Leaving early Saturday morning lets you reach before breakfast without hitting traffic."
  },
  {
    question: "Is the swimming pool safe for children and elderly parents?",
    answer: "Yes. All pools are private, sanitized daily with multi-stage filtration systems, and feature gradual steps for safe entry. Paved, non-slip pool decks ensure elderly family members can recline comfortably on loungers while watching kids play."
  },
  {
    question: "Can the chef prepare authentic Maharashtrian dishes and Jain food?",
    answer: "Absolutely! Pune families love our homestyle local cuisine: hot pithla bhakri, thecha, freshly fried kanda bhajjis, solkadhi, and live evening barbecue grills. We also cater dedicated pure vegetarian and Jain food prepared in clean, separate utensils."
  },
  {
    question: "What outdoor and indoor games are available for family fun?",
    answer: "Our properties feature open manicured lawns for badminton, box cricket, and frisbee, alongside indoor entertainment lounges with carrom boards, board games, high-speed Wi-Fi, and smart TVs."
  },
  {
    question: "Can we book directly without paying middleman platform fees?",
    answer: "Yes! Booking through Stay Willas offers 100% direct homeowner pricing with zero OTA booking commissions, complimentary meal coordination, and dedicated on-site concierge care."
  }
];

export default async function PuneFamilyPoolPartyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.staywillas.com/private-pool-party-villa-near-pune-for-family#webpage",
        url: "https://www.staywillas.com/private-pool-party-villa-near-pune-for-family",
        name: "Private Pool Party Villa Near Pune for Family | Stay Willas",
        description: "Book an exclusive private pool party villa near Pune for your family with private pool, lawn, and chef.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.staywillas.com" },
            { "@type": "ListItem", position: 2, name: "Family Pool Party Villas Pune", item: "https://www.staywillas.com/private-pool-party-villa-near-pune-for-family" }
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
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A192F] via-[#0E2442] to-[#081220] text-white overflow-hidden">
        {/* Subtle Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/villas/the-angle-house/gallery-11.webp"
            alt="Private Pool Party Villa Near Pune for Family"
            fill
            className="object-cover opacity-25 filter brightness-90 contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/85 via-[#0A192F]/70 to-[#081220]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/60 text-[#7DD3FC] text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-sm">
            <Waves size={16} className="text-[#7DD3FC]" /> Pune Family Escapes • 60–90 Mins Drive
          </div>

          {/* Heading - Explicit text-white to avoid any inheritance bug */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-[1.15] mb-6 !text-white drop-shadow-md">
            Private Pool Party Villa <br className="hidden sm:inline" />
            <span className="text-[#F5C542] underline decoration-[#DAA520]/40 decoration-wavy decoration-2 underline-offset-8">
              Near Pune for Family
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-10 drop-shadow-sm">
            Leave Wakad and Hinjawadi traffic behind. Whisk your family away to an exclusive private swimming pool villa with manicured green lawns, delicious Maharashtrian chef meals, and zero public interference.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a
              href="#villas"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#0B1528] font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE FAMILY VILLAS</span>
              <ChevronRight size={16} />
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌊 I'm looking for a private pool party villa near Pune for our family. Could you share rates, pool photos, and availability?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>Chat with Family Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Pune Proximity Strip - High Contrast Navy Bar */}
      <section className="bg-[#0B1528] border-y border-[#DAA520]/25 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">65–85 km</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">From Wakad / Baner</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">100% Private</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Daily Filtered Private Pool</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Local Chef</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Hot Bhakris, BBQ & Jain</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Kid-Safe</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Gated Lawns & Play Areas</span>
          </div>
        </div>
      </section>

      {/* Featured Family Pool Villas */}
      <section id="villas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Quick Expressway Escape</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#0B1528]">Top Private Pool Villas for Pune Families</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Independent private swimming pools, barbecue stations, open dining gazebos, and safe grassy lawns for kids.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Villa 1: The Angle House */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/the-angle-house/gallery-11.webp"
                  alt="The Angle House Lonavala - Private Waterfall Swimming Pool for Pune Families"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Kamshet • 70 Mins from Pune
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  Waterfall Pool + Jacuzzi
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  The Angle House — Waterfall Pool & Glass Hall
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Located right after the Kamshet expressway exit—just 70 minutes from Wakad! Features a sparkling private swimming pool with a cascading natural stone waterfall, indoor games, and secure fenced lawns where children and pets play safely.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Car size={14} />
                    </div>
                    <span>65 km from Pune</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>Private Waterfall Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Users size={14} />
                    </div>
                    <span>Sleeps 12 to 16 Family</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={14} />
                    </div>
                    <span>Private Chef Dining</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Family Rate</span>
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

          {/* Villa 2: Canopy Crest */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"
                  alt="Canopy Crest Khopoli - 22ft Swimming Pool Estate for Pune Family Reunions"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Khopoli Foothills • 85 Mins from Pune
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  22ft Pool + 4-Acre Lawns
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  Canopy Crest — 22ft Pool & 4-Acre Grounds
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Just down the expressway at the Khopoli foothills! Boasts a massive 22x12ft swimming pool with expansive mountain views, lush charpai lawns for family cricket and badminton, evening bonfire pit, and spacious 4 BHK suites accommodating 16 to 25+ guests.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Car size={14} />
                    </div>
                    <span>85 km from Pune</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>22x12 ft Large Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Gamepad2 size={14} />
                    </div>
                    <span>Lawn Cricket & Games</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Flame size={14} />
                    </div>
                    <span>Live Coal BBQ & Bonfire</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Family Rate</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹15,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/canopy-crest"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Villa & Dates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Pune Families Love Stay Willas */}
      <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Designed for Family Fun</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">The Ultimate Pune Family Weekend Formula</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Waves size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Private Clean Pools</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Filtered and chlorinated before every single check-in. Safe, clean water for kids and adults alike.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <UtensilsCrossed size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Authentic Local Flavors</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hot pithla bhakri, solkadhi, sukka chicken, misal breakfasts, and customized kid-friendly pastas and fries.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Kid-Safe Fenced Lawns</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gated private boundary walls ensure children can run freely without safety concerns or road traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Pune Family Pool Party FAQ</h2>
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
        <div className="rounded-3xl bg-gradient-to-r from-[#0A192F] to-[#0E2442] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#DAA520]/30 shadow-2xl">
          <div>
            <span className="text-[#F5C542] font-black tracking-widest uppercase text-xs block mb-2">
              Pune Weekend Getaway
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Ready for a Family Splash Weekend?
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-xl font-light">
              Message our family concierge on WhatsApp. We share pool dimensions, custom food packages, and direct booking rates without agent commissions.
            </p>
          </div>
          <a
            href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌊 I'm planning a Pune family pool party weekend. Please share available villas and deals.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0 border border-white/20 cursor-pointer"
          >
            <MessageCircle size={18} className="fill-white" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Related Celebration Hubs */}
      <section className="bg-white py-12 px-4 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Explore More Special Occasion Stays</h3>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/private-villa-for-birthday-celebration-near-mumbai" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Villa for Birthday Celebration Near Mumbai →
            </Link>
            <Link href="/anniversary-celebration-villa-with-private-pool" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Anniversary Celebration Villa with Private Pool →
            </Link>
            <Link href="/milestone-birthday-celebration-villa-maharashtra" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Milestone Birthday Celebration Villa Maharashtra →
            </Link>
            <Link href="/areas/lonavala" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas in Lonavala →
            </Link>
            <Link href="/areas/khopoli" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas in Khopoli →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
