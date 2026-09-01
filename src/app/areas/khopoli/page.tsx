import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ChevronRight, ArrowLeft, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar, MessageCircle, Sparkles, Star, Tag, Zap, Waves, Users, Utensils } from "lucide-react";
import { generateDestinationCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const revalidate = 60; // Instant TTFB via ISR cache

export const metadata: Metadata = {
  title: "Villas in Khopoli with Private Pool | Exclusive Group Estates | Stay Willas",
  description: "Discover private pool villas in Khopoli with sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
  keywords: [
    "villas in khopoli with private pool",
    "villas in khopoli",
    "khopoli villa with swimming pool",
    "canopy crest khopoli",
    "khopoli villas",
    "villas near imagica with private pool",
    "khopoli villa staycation",
    "corporate offsite villa khopoli"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/khopoli",
  },
  openGraph: {
    title: "Villas in Khopoli with Private Pool | Exclusive Group Estates | Stay Willas",
    description: "Discover private pool villas in Khopoli with sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
    url: "https://www.staywillas.com/areas/khopoli",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Villas in Khopoli with Private Pool - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
    description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default async function KhopoliPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Khopoli",
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'canopy-crest' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "canopy-crest") return -1;
    if (b.slug === "canopy-crest") return 1;
    return 0;
  });

  const villas = sortedDbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/images/hero-villa.webp",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  const signatureVilla = villas.find(v => v.id === "canopy-crest");

  const khopoliFaqs = [
    {
      question: "How many guests can Canopy Crest accommodate?",
      answer: "Canopy Crest comfortably accommodates up to 16 guests across 4 spacious BHK suites."
    },
    {
      question: "Is there high-speed Wi-Fi for work offsites?",
      answer: "Yes, the estate is equipped with high-speed fiber internet suitable for video conferencing and remote work."
    },
    {
      question: "Can we order pure vegetarian or Jain food?",
      answer: "Yes. Our in-house chefs cater dedicated pure-veg and Jain meals using separate cookware."
    },
    {
      question: "Is there a market nearby for grocery shopping?",
      answer: "Yes, Khopoli town has full-fledged markets within a 10-15 minute drive from our properties. However, we recommend informing our concierge of your grocery requirements beforehand so we can stock your chosen villa."
    }
  ];

  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: "khopoli",
    regionName: "Khopoli",
    title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
    description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa.",
    villas: villas.map(v => ({
      slug: v.id,
      name: v.name,
      location: v.location,
      image: v.image,
      price: v.price,
      bedrooms: v.bedrooms,
      guests: v.guests,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
    { name: "Khopoli", url: "/areas/khopoli" },
  ]);

  const faqSchema = generateFAQSchema(khopoliFaqs);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        {/* Structured Data: CollectionPage, ItemList, BreadcrumbList & FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              ...destinationSchema["@graph"],
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : []),
            ]),
          }}
        />
        <Navbar />
        
        {/* Modern 2-Column Split Luxury Hero Banner */}
        <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 px-4 sm:px-8 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/20 min-h-[480px] sm:min-h-[580px] md:min-h-[660px] flex items-center">
          {/* High-Resolution Stunning Villa Background Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
              alt="Luxury private pool villa in Khopoli by Stay Willas"
              fill
              priority
              quality={85}
              className="object-cover object-center"
            />
            {/* Cinematic Luxury Dark Overlays */}
            <div className="absolute inset-0 bg-[#0E1B35]/70 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35] via-[#0E1B35]/50 to-[#0E1B35]/75 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B35]/90 via-[#0E1B35]/60 to-[#0E1B35]/40 z-10" />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-20 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
              
              {/* Left Column (7 cols): Editorial & Action */}
              <div className="lg:col-span-7 text-left flex flex-col items-start">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-xs text-slate-300/80 tracking-wider uppercase font-semibold mb-2 sm:mb-3 bg-black/30 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15">
                  <Link href="/" className="hover:text-[#DAA520] transition-colors">Home</Link>
                  <ChevronRight size={10} className="text-slate-400" />
                  <Link href="/areas" className="hover:text-[#DAA520] transition-colors">Areas</Link>
                  <ChevronRight size={10} className="text-slate-400" />
                  <span className="text-[#DAA520] font-bold">Khopoli</span>
                </div>

                {/* Big Floating 28% Off on Weekdays Button */}
                <Link 
                  href="/villa/canopy-crest"
                  className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600 via-amber-600 to-[#DAA520] hover:from-red-500 hover:to-amber-500 text-white px-4.5 sm:px-8 py-2.5 sm:py-4 rounded-full shadow-[0_4px_20px_rgba(220,38,38,0.45)] hover:shadow-[0_8px_35px_rgba(218,165,32,0.6)] transition-all duration-300 transform hover:-translate-y-1 mb-3 sm:mb-5 cursor-pointer border border-white/25"
                >
                  <span className="text-xs sm:text-base md:text-lg font-black tracking-wide flex items-center gap-1.5 sm:gap-2">
                    🔥 28% Off on Weekdays
                  </span>
                  <ChevronRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading leading-tight tracking-tight mb-2.5 sm:mb-4 text-white">
                  Luxury Villas in{" "}
                  <span className="italic font-light font-sans bg-gradient-to-r from-[#DAA520] via-[#F3C766] to-[#FFE082] bg-clip-text text-transparent font-bold pr-2 sm:pr-3 inline-block">
                    Khopoli
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl font-light mb-4 sm:mb-8">
                  Tucked at the base of the Sahyadri mountains, just 1.5 hours from Mumbai. Discover sprawling 4 BHK private pool estates accommodating up to 16 guests with custom catering and direct rates.
                </p>

                {/* Direct Booking Hero CTA Group */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-4 sm:mb-8">
                  <a 
                    href="#khopoli-signature-villa"
                    className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] hover:text-[#0E1B35] font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-glow-gold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Zap size={15} className="text-[#1B3564] fill-[#1B3564]" />
                    <span>BOOK DIRECT (0% FEE)</span>
                  </a>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct booking offers, available dates and meal packages for Canopy Crest / Khopoli villas.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <MessageCircle size={15} />
                    <span>WHATSAPP DIRECT OFFER</span>
                  </a>
                </div>

                {/* Direct Booking Value Trust Anchor */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-white/90 font-bold bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Up to 16 Guests</span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> 22ft Private Pool</span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> 1.5 Hrs from Mumbai</span>
                </div>
              </div>

              {/* Right Column (5 cols): Interactive Floating Privilege Card */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-[#0E1B35]/85 backdrop-blur-2xl border border-[#DAA520]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#DAA520]/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-[#DAA520]/20 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DAA520] block mb-0.5">
                        Direct Rates
                      </span>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                        Khopoli Sanctuary
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Starting From</span>
                      <span className="text-xl sm:text-2xl font-black text-[#DAA520]">₹15,000</span>
                      <span className="text-[10px] text-slate-400"> / night</span>
                    </div>
                  </div>

                  {/* Benefit Checkmarks */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span><strong>0% Commission</strong> — Save 15% vs Airbnb & OTAs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#DAA520]/20 text-[#DAA520] flex items-center justify-center shrink-0">
                        <Sparkles size={14} />
                      </div>
                      <span><strong>Large Group Ready</strong> — Up to 16 guests under one roof</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <span><strong>22ft Private Pool</strong> — Mountain valley view & charpai lawns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <MessageCircle size={14} />
                      </div>
                      <span><strong>Fast Response</strong> — Direct manager support in &lt; 2 mins</span>
                    </div>
                  </div>

                  {/* Fast Action Buttons in Card */}
                  <div className="space-y-2.5 pt-2">
                    <a 
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check group availability and direct pricing for Canopy Crest in Khopoli.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={16} />
                      <span>Check Group Dates & Menu (WhatsApp)</span>
                    </a>
                    <a 
                      href="#khopoli-signature-villa"
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <span>Explore Khopoli Villas Below</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Canopy Crest) */}
        {signatureVilla && (
          <section id="khopoli-signature-villa" className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-20">
            <div className="bg-[#FAF8F5]/80 backdrop-blur-md rounded-3xl border border-[#DAA520]/25 overflow-hidden flex flex-col lg:flex-row shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Image side */}
              <div className="lg:w-3/5 relative min-h-[300px] md:min-h-[450px] overflow-hidden">
                <Image 
                  src={signatureVilla.image}
                  alt="Canopy Crest Khopoli Signature Pool Villa"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-6 left-6 bg-[#1B3564] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  Signature Escape
                </span>
              </div>
              
              {/* Content side */}
              <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-between items-start text-left">
                <div>
                  <span className="text-accent-secondary text-[10px] tracking-[0.3em] uppercase font-bold mb-3 block">
                    Featured Masterpiece
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-primary mb-4">
                    {signatureVilla.name}
                  </h2>
                  <p className="text-text-primary/75 text-sm font-light leading-relaxed mb-6">
                    Escape to a stunning nature sanctuary. Perched amidst the Sahyadri mountains, this villa offers a spectacular private pool, sprawling green layout, five-star hospitality services, and ultimate seclusion.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-b border-[#DAA520]/15 py-6 mb-8 w-full">
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Guests</span>
                      <span className="font-semibold text-sm">{signatureVilla.guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Bedrooms</span>
                      <span className="font-semibold text-sm">{signatureVilla.bedrooms} BHK</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Bathrooms</span>
                      <span className="font-semibold text-sm">{signatureVilla.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6 bg-white/70 px-4 py-2 rounded-xl border border-[#DAA520]/20 w-fit">
                    <span className="flex items-center gap-1 text-xs font-bold text-[#1B3564]">
                      <Star size={13} className="text-[#DAA520] fill-[#DAA520]" /> 4.9/5
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs font-bold text-emerald-700">From ₹15,000 / night</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] text-slate-500 font-medium">0% Commission</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 w-full">
                  <Link 
                    href={`/villa/${signatureVilla.id}#booking-card-section`}
                    className="flex-1 bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white text-xs font-black tracking-widest uppercase text-center py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>CHECK DATES & BOOK</span>
                    <ChevronRight size={14} />
                  </Link>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I'd like to check group discounts, available dates, and meal menus for *${signatureVilla.name}* in Khopoli.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black tracking-widest uppercase text-center py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>GET GROUP QUOTE</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Full-Width 4-Column Feature Highlights */}
        <section className="py-12 bg-white border-b border-[#DAA520]/20 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
                Stay Willas Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
                The Private Pool Villa Advantage in Khopoli
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Waves size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">22ft Private Swimming Pool</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Enjoy private temperature-filtered swimming pools with charpai green lawns and sun decks.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Up to 16+ Guests Capacity</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Spacious 4 BHK layouts, expansive outdoor lawns, and large dining tables for large family groups.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Utensils size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">In-House Chef & Barbecue</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Fresh Maharashtrian breakfast, poolside barbecues, and dedicated pure-vegetarian and Jain meals.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-700">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Direct 0% Platform Fee</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Book directly with Stay Willas with zero booking portal markups, transparent pricing, and instant support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Editorial Article Section */}
        <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#DAA520]/20 shadow-sm">
            <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-[#DAA520] prose-h3:font-heading prose-h3:text-xl prose-a:text-[#DAA520]">
              <h2>The Undiscovered Sanctuary at the Base of the Ghats</h2>
              <p>
                When planning a drive out of Mumbai or Pune along the Expressway, Lonavala is usually the first destination that comes to mind. Yet right before the steep, traffic-congested climb up the ghats lies Khopoli—a tranquil valley nestled against the base of the Sahyadri mountains. For travelers seeking nature without highway gridlock, choosing a khopoli villa staycation offers a peaceful, refreshing alternative.
              </p>
              <p>
                Khopoli&apos;s location provides a distinct advantage: expansive plot sizes surrounded by lush forest cover. Heavy monsoon rains create seasonal streams that flow right past private estate lawns, providing dramatic mountain scenery without the tourist crowds of higher hill stations.
              </p>

              <h2>The Travel Time Advantage: Skipping Ghat Traffic</h2>
              <p>
                A major reason families and corporate groups are selecting a weekend getaway villa in Khopoli is convenience. Driving up the Khandala ghats during weekend rush hours can add up to 90 minutes of stressful bumper-to-bumper traffic.
              </p>
              <p>
                By taking the Khalapur exit directly off the Mumbai-Pune Expressway, guests arrive at their private villa within 15 minutes of leaving the highway. You save significant travel time, allowing your group to start relaxing in the pool while others are still stuck in traffic.
              </p>

              <div className="my-10 relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl not-prose">
                <Image 
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg" 
                  alt="Canopy Crest 4 BHK large group private pool estate in Khopoli" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Spacious Estates for Large Group Gatherings & Offsites</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 not-prose">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Corporate Offsites</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Fiber Wi-Fi, air-conditioned meeting lounges, quiet break-out zones, and full chef catering to keep your team energized.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Multi-Family Reunions</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Spacious 4 BHK layouts with accessible ground-floor bedrooms, safe swimming pools, and manicured grassy lawns for kids.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Milestone Celebrations</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Host milestone birthdays and anniversaries with pool deck seating, bonfire pits, and live barbecue catering.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Wellness Escapes</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Clean mountain air, morning yoga on charpai lawns, and quiet valley views free from urban noise pollution.
                  </p>
                </div>
              </div>

              {/* Mid-Article High-Converting Concierge Breakout Box */}
              <div className="my-10 bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-6 sm:p-10 text-white border border-[#DAA520]/40 shadow-xl not-prose relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] font-black uppercase text-[10px] tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                      <Sparkles size={12} /> Large Group Specialist
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-3xl text-white leading-tight">
                      Planning a Large Group Vacation or Corporate Offsite in Khopoli?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                      Skip the search. Tell us your dates and group size, and our Khopoli destination specialist will share verified private pool estates, group menus, and direct rates.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                    <a
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'm planning a group trip/offsite in Khopoli. Could you share estate options, catering packages and direct rates?")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Specialist</span>
                    </a>
                    <Link
                      href="/villa/canopy-crest#booking-card-section"
                      className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <Zap size={15} className="fill-[#1B3564]" />
                      <span>Check Rates & Book</span>
                    </Link>
                  </div>
                </div>
              </div>

              <h2>Micro-Climates & Seasonal Travel Guide — Khopoli</h2>
              <div className="my-8 overflow-hidden rounded-3xl border border-[#DAA520]/20 not-prose shadow-xs">
                <table className="min-w-full divide-y divide-[#DAA520]/20 text-left text-xs sm:text-sm bg-white">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Atmosphere & Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15">
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Monsoon Sanctuary</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">June – September</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Roaring waterfalls like Zenith Falls, swollen forest streams, emerald lawns, and misty mountain backdrops.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Crisp Winter</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">October – February</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Pleasant temperatures, clear mountain views, outdoor lawn sports, open-air barbecues, and evening bonfire gatherings.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Summer Pool Retreat</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">March – May</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Warm sunny days perfect for spending hours inside your 22ft private pool, with cool breezes under tree canopies.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Frequently Asked Questions — Khopoli Villas</h2>
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">How far is Canopy Crest from Imagicaa Theme Park?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Canopy Crest is located just a quick 10-minute drive from Imagicaa, making it the perfect staycation hub for families and thrill-seekers.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Can the property accommodate large corporate groups?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Yes. With 4 BHK suites, 5 bathrooms, massive lawns, high-speed Wi-Fi, and live BBQ setups, Canopy Crest comfortably accommodates groups of 16+ guests.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Is fresh food prepared on-site?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Yes. Dedicated caretakers and chefs prepare homestyle Maharashtrian dishes, barbecue spreads, and 100% pure vegetarian / Jain menus.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">What are the advantages of booking directly?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Direct bookings via Stay Willas carry 0% platform commission, providing you with guaranteed lowest prices and customized meal coordination.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Internal Blog Links */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15">
            <h3 className="text-lg font-heading text-[#1B3564] font-bold mb-4">Related Guides</h3>
            <ul className="space-y-3 text-sm text-slate-700 font-light">
              <li>→ <Link href="/blog/khopoli-vs-lonavala-villa-comparison" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Khopoli vs Lonavala Villa Comparison: Valley Views or Quiet Sanctuary?</Link></li>
              <li>→ <Link href="/blog/khopoli-waterfall-monsoon-villa-guide" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Khopoli Waterfall & Monsoon Villa Guide</Link></li>
              <li>→ <Link href="/blog/best-khopoli-villa-for-large-groups" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Best Khopoli Villa for Large Groups & Corporate Offsites</Link></li>
              <li>→ <Link href="/blog/corporate-offsite-checklist-for-a-khopoli-villa" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Corporate Offsite Checklist for a Khopoli Villa</Link></li>
              <li>→ <Link href="/blog/things-to-do-near-adlabs-imagica-khopoli" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Things to Do Near Adlabs Imagica, Khopoli</Link></li>
            </ul>
          </div>
        </section>

        {/* High-Converting VIP Direct Booking Privilege Banner */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full my-8">
          <div className="bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-8 sm:p-12 text-white border border-[#DAA520]/40 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full mb-4">
              <Star size={12} className="fill-[#DAA520]" /> Direct Booking Privilege
            </span>

            <h3 className="font-heading font-bold text-3xl sm:text-5xl text-white max-w-2xl leading-tight">
              Why Book Direct with Stay Willas in Khopoli?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-4 max-w-xl leading-relaxed">
              Enjoy guaranteed best rates, zero middleman commissions, custom group meal packages, and priority check-in assistance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 w-full max-w-4xl text-left">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">0% Commission</span>
                <p className="text-[11px] text-slate-300 font-light">No OTA markups or hidden fees</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">Group Catering</span>
                <p className="text-[11px] text-slate-300 font-light">Custom pure-veg, Jain & non-veg meal plans</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">22ft Pool & Lawns</span>
                <p className="text-[11px] text-slate-300 font-light">Exclusive estate privacy for up to 16 guests</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">24/7 Caretaker</span>
                <p className="text-[11px] text-slate-300 font-light">Dedicated on-site estate hospitality</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
              <Link 
                href="/villas"
                className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider py-4 px-8 rounded-full shadow-lg transition-all"
              >
                Explore All Villas
              </Link>
              <a 
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to talk to a destination specialist about booking a luxury villa in Khopoli.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                <span>Chat with Specialist</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Option E: Floating Mobile Sticky Bar (1-Tap Conversion) */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E1B35]/95 backdrop-blur-xl border-t border-[#DAA520]/30 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#DAA520] leading-tight">
              From ₹15,000<span className="text-[9px] text-slate-300 font-normal"> / nt</span>
            </span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <Zap size={10} className="fill-emerald-400" /> Up to 16 Guests
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I want to check direct booking rates for Canopy Crest Khopoli.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] active:bg-[#20ba5a] text-white font-black text-[11px] uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            <a 
              href="#khopoli-villas-grid"
              className="bg-[#DAA520] active:bg-[#B8860B] text-[#1B3564] font-black text-[11px] uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Zap size={13} className="fill-[#1B3564]" />
              <span>Book Direct</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
