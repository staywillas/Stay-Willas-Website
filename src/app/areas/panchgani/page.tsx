import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  MessageCircle, 
  Sparkles, 
  Star, 
  Tag, 
  Zap, 
  Waves, 
  Users, 
  Utensils 
} from "lucide-react";
import { 
  generateDestinationCollectionSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema 
} from "@/lib/schema";

export const revalidate = 60; // Instant TTFB via ISR cache

export const metadata: Metadata = {
  title: "Villas in Panchgani with Pool | Luxury Private Pool Villas | Stay Willas",
  description: "Discover luxury villas in Panchgani with pool, panoramic valley views, private lawns & in-house chef dining in Kaswand near Mapro Garden. Direct booking with 0% fees.",
  keywords: [
    "villas in panchgani",
    "villas in panchgani with pool",
    "villas in panchgani with private pool",
    "luxury villas in panchgani",
    "private pool villa in panchgani",
    "panchgani villa with pool",
    "villa in panchgani for family",
    "panchgani pool villa staycation",
    "villas in kaswand panchgani",
    "best villa in panchgani with private pool"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/panchgani",
  },
  openGraph: {
    title: "Villas in Panchgani with Pool | Luxury Private Pool Villas | Stay Willas",
    description: "Explore premier private pool villas in Panchgani with lush valley views, private plunge pools, and in-house chef services. Book verified estates with zero platform fees.",
    url: "https://www.staywillas.com/areas/panchgani",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Villas in Panchgani with Pool - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Panchgani with Pool | Stay Willas",
    description: "Explore verified luxury villas in Panchgani with private pool, hillside lawns, and in-house chef dining near Mapro Garden & Table Land.",
    images: ["https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg"],
  },
};

export default async function PanchganiPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      OR: [
        { location: { contains: "Panchgani", mode: "insensitive" } },
        { slug: "casa-de-reva" },
        { slug: "terra-cotta-villa" }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'casa-de-reva' or 'terra-cotta-villa' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "casa-de-reva" || a.slug === "terra-cotta-villa") return -1;
    if (b.slug === "casa-de-reva" || b.slug === "terra-cotta-villa") return 1;
    return 0;
  });

  const villas = sortedDbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  const signatureVilla = villas.find(v => v.id === "casa-de-reva" || v.id === "terra-cotta-villa") || villas[0];

  const panchganiFaqs = [
    {
      question: "Do your villas in Panchgani have private swimming pools?",
      answer: "Yes. Our signature estate Casa De Reva in Kaswand, Panchgani features a 100% exclusive private swimming pool, sun deck, and lawn completely reserved for your group with zero shared access."
    },
    {
      question: "How far is Casa De Reva in Panchgani from Mapro Garden and Table Land?",
      answer: "Casa De Reva is ideally located in Kaswand, Panchgani — just 4.5 km (~10 minutes) from Mapro Garden and approximately 12 minutes from the iconic Table Land mountain plateau."
    },
    {
      question: "What dietary preparations are available with the in-house chef?",
      answer: "Our culinary caretakers specialize in fresh authentic Maharashtrian cuisine, poolside barbecues, pure vegetarian dishes, and dedicated Jain food prepared with separate cookware."
    },
    {
      question: "How long is the drive to Panchgani from Pune and Mumbai?",
      answer: "Panchgani is approximately 100 km (2.5 hours) from Pune via the NH48 / Shirwal / Wai route ascending Pasarni Ghat, and around 240 km (4.5 to 5 hours) from Mumbai via the Mumbai-Pune Expressway."
    },
    {
      question: "Is there a weekday discount available for Panchgani villas?",
      answer: "Yes! Stay Willas offers a special 26% discount on weekday stays (Monday to Thursday) using coupon code Stayw26 when booking directly."
    }
  ];

  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: "panchgani",
    regionName: "Panchgani",
    title: "Villas in Panchgani with Pool | Luxury Private Pool Villas | Stay Willas",
    description: "Discover luxury villas in Panchgani with pool, panoramic valley views, private lawns & in-house chef dining in Kaswand near Mapro Garden.",
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
    { name: "Panchgani", url: "/areas/panchgani" },
  ]);

  const faqSchema = generateFAQSchema(panchganiFaqs);

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
              src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg" 
              alt="Luxury private pool villa in Panchgani by Stay Willas"
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
                  <span className="text-[#DAA520] font-bold">Panchgani</span>
                </div>

                {/* Big Floating 26% Off on Weekdays Button */}
                <Link 
                  href="/villa/casa-de-reva"
                  className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600 via-amber-600 to-[#DAA520] hover:from-red-500 hover:to-amber-500 text-white px-4.5 sm:px-8 py-2.5 sm:py-4 rounded-full shadow-[0_4px_20px_rgba(220,38,38,0.45)] hover:shadow-[0_8px_35px_rgba(218,165,32,0.6)] transition-all duration-300 transform hover:-translate-y-1 mb-3 sm:mb-5 cursor-pointer border border-white/25"
                >
                  <span className="text-xs sm:text-base md:text-lg font-black tracking-wide flex items-center gap-1.5 sm:gap-2">
                    🔥 26% Off on Weekdays
                  </span>
                  <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">Stayw26</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading leading-tight tracking-tight mb-2.5 sm:mb-4 text-white">
                  Luxury Villas in{" "}
                  <span className="italic font-light font-sans bg-gradient-to-r from-[#DAA520] via-[#F3C766] to-[#FFE082] bg-clip-text text-transparent font-bold pr-2 sm:pr-3 inline-block">
                    Panchgani
                  </span>
                  {" "}with Pool
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl font-light mb-4 sm:mb-8">
                  Perched amidst the cool Sahyadri highlands in Kaswand, 2.5 hours from Pune and 4.5 hours from Mumbai. Discover secluded 4 BHK private pool estates, sweeping valley vistas, fresh strawberry farms, and personalized in-villa chef dining.
                </p>

                {/* Direct Booking Hero CTA Group */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-4 sm:mb-8">
                  <a 
                    href="#panchgani-villas-grid"
                    className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] hover:text-[#0E1B35] font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-glow-gold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Zap size={15} className="text-[#1B3564] fill-[#1B3564]" />
                    <span>BOOK DIRECT (0% FEE)</span>
                  </a>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct booking offers, available dates and catering menus for luxury private pool villas in Panchgani.")}`}
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
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> 100% Private Pools</span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> In-House Chef</span>
                  <span className="text-white/40">•</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Guaranteed Lowest Rate</span>
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
                        Panchgani Escapes
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Starting From</span>
                      <span className="text-xl sm:text-2xl font-black text-[#DAA520]">₹14,000</span>
                      <span className="text-[10px] text-slate-400"> / night</span>
                      <span className="text-[8px] text-slate-400 block italic mt-0.5">*26% off on weekdays with Stayw26</span>
                    </div>
                  </div>

                  {/* Benefit Checkmarks */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      <span><strong>0% Commission</strong> — Save 15% to 20% vs Airbnb & OTAs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#DAA520]/20 text-[#DAA520] flex items-center justify-center shrink-0">
                        <Sparkles size={14} />
                      </div>
                      <span><strong>In-Villa Chef</strong> — Fresh Veg, Jain & Maharashtrian Menus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <span><strong>100% Private Pool</strong> — Entire 4 BHK estate exclusively yours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <MessageCircle size={14} />
                      </div>
                      <span><strong>Fast Response</strong> — Direct concierge support in &lt; 2 mins</span>
                    </div>
                  </div>

                  {/* Fast Action Buttons in Card */}
                  <div className="space-y-2.5 pt-2">
                    <a 
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check available dates and direct pricing for Panchgani private pool villas.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={16} />
                      <span>Check Dates & Pricing (WhatsApp)</span>
                    </a>
                    <a 
                      href="#panchgani-villas-grid"
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <span>Explore Panchgani Collection Below</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Casa De Reva) */}
        {signatureVilla && (
          <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="bg-[#FAF8F5]/90 backdrop-blur-md rounded-3xl border border-[#DAA520]/30 overflow-hidden flex flex-col shadow-2xl transform hover:scale-[1.005] transition-all duration-500">
              {/* Full Width Image Container */}
              <div className="w-full relative aspect-[16/9] sm:aspect-[16/8.5] md:aspect-[21/9] min-h-[340px] sm:min-h-[440px] md:min-h-[520px] overflow-hidden group">
                <Image 
                  src={signatureVilla.image}
                  alt="Casa De Reva Panchgani Signature Private Pool Villa"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                
                {/* Floating Top Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="bg-[#1B3564]/90 backdrop-blur-md text-[#DAA520] text-xs font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-[#DAA520]/30">
                    Signature Retreat
                  </span>
                  <span className="bg-red-600 text-white text-xs font-black tracking-wide uppercase px-3.5 py-2 rounded-xl shadow-lg">
                    🔥 26% Off Weekdays
                  </span>
                </div>

                {/* Floating Bottom Overlays */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white pointer-events-none">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#DAA520] block mb-1 drop-shadow-sm">
                      Panchgani Hillside Haven • Kaswand
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-heading font-extrabold text-white drop-shadow-md">
                      {signatureVilla.name}
                    </h3>
                  </div>

                  <div className="bg-black/70 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold text-[#DAA520]">
                      <Star size={15} className="fill-[#DAA520]" /> 4.9/5
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-sm font-bold text-white">From ₹14,000 / night</span>
                  </div>
                </div>
              </div>
              
              {/* Full Width Content & Actions Bar Below */}
              <div className="p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left">
                <div className="flex-1 max-w-2xl">
                  <span className="text-accent-secondary text-[11px] tracking-[0.25em] uppercase font-bold mb-2 block">
                    Exposed Terracotta Architecture & Private Pool
                  </span>
                  <p className="text-text-primary/80 text-sm sm:text-base font-light leading-relaxed mb-4">
                    A private sanctuary situated in scenic Kaswand, Panchgani, just 4.5 km from Mapro Garden. Featuring rustic terracotta brickwork, an exclusive private swimming pool, panoramic Sahyadri valley views, expansive party lawns, and dedicated culinary hospitality. The ultimate choice for travelers seeking luxury villas in Panchgani with pool.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-text-primary/70">
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-[#DAA520]/20 flex items-center gap-1.5">
                      ✓ Up to 16 Guests Capacity
                    </span>
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-[#DAA520]/20 flex items-center gap-1.5">
                      ✓ 4 BHK Air-Conditioned Bedrooms
                    </span>
                    <span className="bg-white px-3 py-1.5 rounded-lg border border-[#DAA520]/20 flex items-center gap-1.5">
                      ✓ Private Swimming Pool & Gazebo
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
                      0% Commission Direct Booking
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 min-w-[280px]">
                  <Link 
                    href={`/villa/${signatureVilla.id}#booking-card-section`}
                    className="w-full bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white text-xs font-black tracking-widest uppercase text-center py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>CHECK DATES & BOOK</span>
                    <ChevronRight size={14} />
                  </Link>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I'd like to check custom dates, weekday discounts and food menus for *${signatureVilla.name}* in Panchgani.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black tracking-widest uppercase text-center py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>GET WHATSAPP QUOTE</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Villa Collection Grid */}
        <section id="panchgani-villas-grid" className="py-16 px-6 md:px-12 lg:px-24 bg-[#F9F7F2]/50 border-t border-b border-[#DAA520]/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/15 text-accent-secondary font-bold tracking-[0.25em] uppercase text-[10px] px-3.5 py-1 rounded-full mb-2">
                Curated Collection • Verified Estates
              </span>
              <h3 className="text-3xl md:text-4xl font-heading text-[#1B3564]">
                Available Private Villas in Panchgani
              </h3>
              <p className="text-text-primary/60 text-xs sm:text-sm font-light mt-2 max-w-xl">
                Explore handpicked estates with private swimming pools, hillside manicured lawns, and dedicated chef hospitality.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={13} /> 0% Middleman Fees
              </span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            {villas.length === 0 ? (
               <div className="bg-[#FAF8F5]/50 border border-[#DAA520]/15 rounded-2xl p-8 text-center max-w-md mx-auto">
                 <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Panchgani inventory.</p>
                 <Link href="/areas" className="text-[#1B3564] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:text-accent-primary">
                   <ArrowLeft size={16} /> View other areas
                 </Link>
               </div>
            ) : (
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 lg:gap-10">
                {villas.map((villa) => (
                  <div key={villa.id} className="w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.33%-27px)] max-w-sm transform transition duration-300 hover:-translate-y-2">
                    <VillaCard 
                      id={villa.id}
                      name={villa.name}
                      location={villa.location}
                      image={villa.image}
                      price={villa.price}
                      guests={villa.guests}
                      bedrooms={villa.bedrooms}
                      bathrooms={villa.bathrooms}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Full-Width 4-Column Feature Highlights */}
        <section className="py-12 bg-white border-b border-[#DAA520]/20 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
                Stay Willas Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
                The Private Pool Villa Advantage in Panchgani
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Waves size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Private Swimming Pool</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Enjoy an exclusive private swimming pool overlooking misty valleys with sun lounger decks and total group privacy.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Family & Group Gatherings</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Spacious 4 BHK layouts, double-height ceilings, and sprawling manicured lawns designed to host up to 16 guests comfortably.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Utensils size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">In-House Chef Dining</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Fresh Maharashtrian breakfast, live evening barbecues, fresh strawberry specialties, and dedicated pure-veg & Jain menus.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-700">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Direct 0% Platform Fee</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Book directly with Stay Willas with zero OTA commission markups, transparent pricing, and instant concierge support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pinpoint Location & Interactive Map Section */}
        <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          <div className="bg-white border border-[#DAA520]/30 rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DAA520]/20">
              <div>
                <span className="text-[10px] text-accent-secondary font-black uppercase tracking-widest block mb-1">
                  Panchgani Hillside Pinpoint • Kaswand
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564] flex items-center gap-2">
                  <MapPin size={22} className="text-[#DAA520]" />
                  Casa De Reva Location & Map Access
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kaswand, Panchgani, Maharashtra 412805 • Plus code: WQ3F+J8 Kaswand, Maharashtra
                </p>
              </div>

              <a
                href="https://www.google.com/maps/place/StayVista+at+Brick+Beam+with+Private+Plunge+Pool,+Lawn,+BBQ+and+Bonfire+-+Villa/@17.9040603,73.7732925,17z/data=!4m10!1m2!2m1!1sstay+vista+at+brick+beam+with+private+plunge+pool!3m6!1s0x3bc2689509c5ee9f:0xb7ae44a442241384!8m2!3d17.9040603!4d73.7732925!15sCjFzdGF5IHZpc3RhIGF0IGJyaWNrIGJlYW0gd2l0aCBwcml2YXRlIHBsdW5nZSBwb29skgEPdmFjYXRpb25fcmVudGFs4AEA!16s%2Fg%2F11z5q_y1m6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1B3564] hover:bg-[#152A50] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
              >
                <MapPin size={14} className="text-[#DAA520]" />
                Open in Google Maps
              </a>
            </div>

            {/* Google Map Embed Frame */}
            <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <iframe
                title="Casa De Reva Panchgani Google Maps Location"
                src="https://maps.google.com/maps?q=17.9040603,73.7732925&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Travel Times & Key Distances Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                <span className="font-bold text-[#1B3564] block mb-1">🚗 From Pune</span>
                <span className="text-slate-600">~100 km (2.5 hours) via NH48, Shirwal, Wai & Pasarni Ghat</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                <span className="font-bold text-[#1B3564] block mb-1">🚗 From Mumbai</span>
                <span className="text-slate-600">~240 km (4.5 to 5 hours) via Mumbai-Pune Expressway & Wai</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                <span className="font-bold text-[#1B3564] block mb-1">🍓 Mapro Garden</span>
                <span className="text-slate-600">Just 4.5 km (~10 mins) — fresh strawberry treats, cafe & jams</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                <span className="font-bold text-[#1B3564] block mb-1">🌄 Table Land & Sydney Point</span>
                <span className="text-slate-600">10–12 mins — Asia&apos;s 2nd largest mountain plateau & sunset views</span>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Editorial Article Section */}
        <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#DAA520]/20 shadow-sm">
            <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-[#DAA520] prose-h3:font-heading prose-h3:text-xl prose-a:text-[#DAA520]">
              <h2>The Panchgani Hillside Escape, Reimagined</h2>
              <p>
                Perched at an elevation of 1,293 meters in the Sahyadri mountains of western Maharashtra, Panchgani is renowned for its crisp mountain air, rolling strawberry valleys, and awe-inspiring tableland vistas. For urban dwellers seeking relief from the fast pace and humidity of Mumbai and Pune, booking private <strong>villas in panchgani</strong> provides an unmatched sanctuary of peace, seclusion, and refined comfort.
              </p>
              <p>
                Whether you are organizing an extended family reunion, a milestone birthday celebration, or a focused corporate leadership retreat, staying in dedicated <strong>villas in panchgani with pool</strong> gives your group complete sovereignty over your schedule. At Stay Willas, our handpicked properties in Kaswand feature expansive private swimming pools, high-speed Wi-Fi, air-conditioned bedroom suites, manicured green lawns, and dedicated on-demand chef hospitality.
              </p>

              <h2>Why Choose Private Pool Villas in Panchgani Over Traditional Hotels</h2>
              <p>
                When searching for top-tier <strong>villas in panchgani with private pool</strong>, travelers consistently prioritize seclusion and exclusivity over crowded hotel corridors. In a traditional resort, swimming pools, dining halls, and gardens are shared with hundreds of strangers. In contrast, reserving a private <strong>panchgani villa with pool</strong> means the entire property belongs strictly to you and your companions.
              </p>
              <p>
                Families traveling with elderly grandparents and young children particularly value ground-floor bedroom accessibility, secure perimeter fences, and personalized meal planning. From dawn yoga sessions overlooking the mist-filled Krishna Valley to late-night poolside conversations under starlit skies, a private estate transforms a simple vacation into an unforgettable gathering.
              </p>

              <div className="my-10 relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl not-prose">
                <Image 
                  src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg" 
                  alt="Casa De Reva private pool overlooking misty mountain valley in Panchgani" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Gatherings, Celebrations & Offsites in Kaswand, Panchgani</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 not-prose">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Family Reunions</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Thoughtfully designed 4 BHK configurations accommodating up to 16 guests with spacious living lounges and child-safe lawns.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Milestone Celebrations</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Host memorable birthdays and anniversaries with poolside barbecues, customized lawn lighting, and bespoke multi-course menus.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Executive Offsites</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    High-speed fiber connectivity, quiet outdoor breakout pavilions, and crisp mountain breeze to stimulate creative collaboration.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Strawberry Trails</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Located in Kaswand just 4.5 km from Mapro Garden, offering easy access to fresh strawberry picking and local artisanal produce.
                  </p>
                </div>
              </div>

              {/* Mid-Article High-Converting Concierge Breakout Box */}
              <div className="my-10 bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-6 sm:p-10 text-white border border-[#DAA520]/40 shadow-xl not-prose relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] font-black uppercase text-[10px] tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                      <Sparkles size={12} /> Direct Concierge Service
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-3xl text-white leading-tight">
                      Planning a Gathering or Staycation in Panchgani?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                      Skip the booking platform commissions. Tell us your requested dates and group size, and our Panchgani destination concierge will provide verified private pool availability, customized culinary options, and weekday discounts.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                    <a
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'm planning a getaway to Panchgani. Could you share available private pool villas, weekday discounts and catering options for our dates?")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Proposal</span>
                    </a>
                    <Link
                      href="/villa/casa-de-reva#booking-card-section"
                      className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <Zap size={15} className="fill-[#1B3564]" />
                      <span>Check Rates & Book</span>
                    </Link>
                  </div>
                </div>
              </div>

              <h2>Panchgani Seasonal Travel & Sahyadri Micro-Climate Guide</h2>
              <p>
                Thanks to its high altitude on the volcanic Deccan plateau, Panchgani enjoys a pleasant micro-climate throughout the year, with temperatures consistently 6°C to 10°C cooler than the coastal plains.
              </p>

              <div className="my-8 overflow-hidden rounded-3xl border border-[#DAA520]/20 not-prose shadow-xs">
                <table className="min-w-full divide-y divide-[#DAA520]/20 text-left text-xs sm:text-sm bg-white">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Atmosphere & Highlights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15">
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Strawberry & Crisp Winter</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">October – March</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Cool 12°C to 18°C evenings, crystal-clear skies, sweet aroma of ripening strawberries in Kaswand, and bonfire sit-outs under the stars.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Sahyadri Monsoon Magic</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">June – September</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Rolling fog over the valleys, lush emerald landscapes across Pasarni Ghat, and cascading roadside waterfalls. Enjoy piping hot chai and pakoras poolside.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Breezy Hillside Summer</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">April – May</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Refreshing mountain winds, cool shaded gazebos, and all-day private pool sessions that offer the perfect antidote to city heat.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Frequently Asked Questions — Panchgani Villa Stays</h2>
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose text-left">
                {panchganiFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                    <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">{faq.question}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </article>
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
              Why Book Direct with Stay Willas in Panchgani?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-4 max-w-xl leading-relaxed">
              Enjoy guaranteed best rates, zero middleman commissions, weekday savings with code Stayw26, custom meal menus, and direct on-site caretaker assistance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 w-full max-w-4xl text-left">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">0% Commission</span>
                <p className="text-[11px] text-slate-300 font-light">No OTA markups or platform fees</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">Chef Assist</span>
                <p className="text-[11px] text-slate-300 font-light">Direct pure-veg & Jain culinary planning</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">100% Private</span>
                <p className="text-[11px] text-slate-300 font-light">Exclusive villa & plunge pool access</p>
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
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to talk to a destination specialist about booking a luxury villa in Panchgani with pool.")}`}
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

      {/* Floating Mobile Sticky Bar (1-Tap Conversion) */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E1B35]/95 backdrop-blur-xl border-t border-[#DAA520]/30 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#DAA520] leading-tight">
              From ₹14,000<span className="text-[9px] text-slate-300 font-normal"> / nt</span>
            </span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <Zap size={10} className="fill-emerald-400" /> 0% Platform Fee • 26% Off Weekdays
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I want to check direct booking rates and weekday discounts for Panchgani private pool villas.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] active:bg-[#20ba5a] text-white font-black text-[11px] uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            <a 
              href="#panchgani-villas-grid"
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
