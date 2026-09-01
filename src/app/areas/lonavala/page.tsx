import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { ChevronRight, ArrowLeft, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar, MessageCircle, Sparkles, Star, Tag, Zap, Waves, Users, Utensils } from "lucide-react";
import { generateDestinationCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const revalidate = 60; // Instant TTFB via ISR cache

export const metadata: Metadata = {
  title: "Private Pool Villas in Lonavala | Handcrafted Mountain Stays | Stay Willas",
  description: "Explore premier private pool villas in Lonavala with lush greenery, mountain views, and in-house chef services. Book verified estates with zero platform fees.",
  keywords: [
    "villas in lonavala with private pool",
    "lonavala villa with private pool",
    "villas in lonavala",
    "private pool villa in lonavala",
    "villa in lonavala for family",
    "lonavala villa staycation",
    "pool villa lonavala",
    "private villa lonavala"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/lonavala",
  },
  openGraph: {
    title: "Private Pool Villas in Lonavala | Handcrafted Mountain Stays | Stay Willas",
    description: "Explore premier private pool villas in Lonavala with lush greenery, mountain views, and in-house chef services. Book verified estates with zero platform fees.",
    url: "https://www.staywillas.com/areas/lonavala",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Private Pool Villas in Lonavala - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas in Lonavala with Private Pool | Stay Willas",
    description: "Explore luxury villas in Lonavala with private pool, lush greenery, and in-house chef services. Book verified lonavala villa stays near Bhushi Dam & Pawna Lake today.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default async function LonavalaPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Lonavala",
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'the-angle-house' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "the-angle-house") return -1;
    if (b.slug === "the-angle-house") return 1;
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

  const signatureVilla = villas.find(v => v.id === "the-angle-house");

  const lonavalaFaqs = [
    {
      question: "How is the private pool cleaned and maintained?",
      answer: "Every private pool undergoes complete filtration and sanitization cycles prior to guest arrival. On-site staff perform daily water quality checks to guarantee safety and clarity."
    },
    {
      question: "Can we request pure vegetarian or Jain catering?",
      answer: "Yes. Our in-house chefs cater to specific dietary requirements including pure-veg and Jain preparations using dedicated cookware and fresh ingredients."
    },
    {
      question: "Are pets allowed at the property?",
      answer: "Yes, pets are welcome. The Angle House features fully fenced lawns and safe outdoor spaces where pets can play freely."
    }
  ];

  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: "lonavala",
    regionName: "Lonavala",
    title: "Luxury Villas in Lonavala with Private Pool | Stay Willas",
    description: "Explore luxury villas in Lonavala with private pool, lush greenery, and in-house chef services.",
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
    { name: "Lonavala", url: "/areas/lonavala" },
  ]);

  const faqSchema = generateFAQSchema(lonavalaFaqs);

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
              src="/assets/villas/the-angle-house/gallery-11.webp" 
              alt="Luxury private pool villa in Lonavala by Stay Willas"
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
                  <span className="text-[#DAA520] font-bold">Lonavala</span>
                </div>

                {/* Big Floating 28% Off on Weekdays Button */}
                <Link 
                  href="/villa/the-angle-house"
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
                    Lonavala
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl font-light mb-4 sm:mb-8">
                  A scenic 2-hour drive from Mumbai and Pune. Discover architectural glass-facade sanctuaries, private waterfall pools, on-demand gourmet chefs, and cozy mountain cottages.
                </p>

                {/* Direct Booking Hero CTA Group */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-4 sm:mb-8">
                  <a 
                    href="#lonavala-villas-grid"
                    className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] hover:text-[#0E1B35] font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-glow-gold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Zap size={15} className="text-[#1B3564] fill-[#1B3564]" />
                    <span>BOOK DIRECT (0% FEE)</span>
                  </a>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct booking offers, available dates and catering menus for luxury villas in Lonavala.")}`}
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
                        Lonavala Escapes
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Starting From</span>
                      <span className="text-xl sm:text-2xl font-black text-[#DAA520]">₹4,999</span>
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
                      <span><strong>In-Villa Chef</strong> — Fresh Veg, Jain & Non-Veg Menus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <span><strong>100% Private</strong> — Entire villa or cottage to yourself</span>
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
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check available dates and direct pricing for Lonavala villas.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={16} />
                      <span>Check Dates & Pricing (WhatsApp)</span>
                    </a>
                    <a 
                      href="#lonavala-villas-grid"
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <span>Explore 4 Properties Below</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Angle House) */}
        {signatureVilla && (
          <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="bg-[#FAF8F5]/80 backdrop-blur-md rounded-3xl border border-[#DAA520]/25 overflow-hidden flex flex-col lg:flex-row shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Image side */}
              <div className="lg:w-3/5 relative min-h-[300px] md:min-h-[450px] overflow-hidden">
                <Image 
                  src={signatureVilla.image}
                  alt="The Angle House Lonavala Signature Pool Villa"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-6 left-6 bg-[#1B3564] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  Signature Retreat
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
                    A stunning architectural landmark perched on the hills of Lonavala. Boasting a massive private pool, glass facade, expansive lawns, and five-star hospitality services, it stands as the ultimate benchmark for a luxury villa Lonavala with private pool.
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
                    <span className="text-xs font-bold text-emerald-700">From ₹13,000 / night</span>
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
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I'd like to check custom dates, rates and food menus for *${signatureVilla.name}* in Lonavala.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black tracking-widest uppercase text-center py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
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
        <section id="lonavala-villas-grid" className="py-16 px-6 md:px-12 lg:px-24 bg-[#F9F7F2]/50 border-t border-b border-[#DAA520]/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/15 text-accent-secondary font-bold tracking-[0.25em] uppercase text-[10px] px-3.5 py-1 rounded-full mb-2">
                Curated Collection • {villas.length} Properties
              </span>
              <h3 className="text-3xl md:text-4xl font-heading text-[#1B3564]">
                Available Private Sanctuaries in Lonavala
              </h3>
              <p className="text-text-primary/60 text-xs sm:text-sm font-light mt-2 max-w-xl">
                Explore our handpicked range of architectural glass villas, private pool estates, and cozy mountain cottages.
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
                 <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Lonavala inventory.</p>
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
                The Private Pool Villa Advantage in Lonavala
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Waves size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Waterfall Pools & Jacuzzi</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Enjoy private temperature-filtered waterfall pools and private master suite Jacuzzis with total privacy.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Family & Group Reunions</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Spacious living lounges, double-height ceilings, and large manicured lawns designed to host up to 16 guests.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <Utensils size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">In-House Chef Dining</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Fresh Maharashtrian breakfast, poolside barbecues, and dedicated pure-vegetarian and Jain meals prepared on-site.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-700">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Direct 0% Platform Fee</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Book directly with Stay Willas with zero booking portal markups, transparent pricing, and instant concierge support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Editorial Article Section */}
        <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#DAA520]/20 shadow-sm">
            <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-[#DAA520] prose-h3:font-heading prose-h3:text-xl prose-a:text-[#DAA520]">
              <h2>The Lonavala Mountain Escape, Reimagined</h2>
              <p>
                We have all felt it: Friday afternoon in Mumbai or Pune, watching city traffic crawl while yearning for the cool, mist-laden air of the Sahyadri mountains. For travelers across western Maharashtra, escaping to the hills isn&apos;t just a leisure activity—it is a vital reset. Lonavala offers an unmatchable retreat when monsoon clouds roll over Khandala ghats and carpet the valleys in lush greenery.
              </p>
              <p>
                Whether you are searching for a serene <strong>private villa</strong>, a secluded <strong>pool villa</strong>, or an exclusive mountain sanctuary, booking a <strong>villa in lonavala with private pool</strong> gives your group complete independence. Unlike crowded commercial hotels, Stay Willas offers handpicked estates equipped with high-speed super-fast Wi-Fi, private pools, and dedicated chef hospitality.
              </p>

              <h2>Why Choose a Private Estate Over Traditional Hotels</h2>
              <p>
                When evaluating <strong>villas in lonavala</strong>, discerning travelers prioritize absolute privacy over standard resort rooms. Reserving a dedicated <strong>lonavala villa</strong> ensures your family has exclusive access to manicured lawns, sun decks, and living rooms without sharing amenities with strangers.
              </p>
              <p>
                If you are planning a weekend trip for large family groups, a <strong>lonavala villa with private pool</strong> offers ground-floor bedrooms for elderly grandparents and safe outdoor play areas for children. Waking up to panoramic mountain vistas and fresh mountain breezes makes every staycation truly memorable.
              </p>

              <div className="my-10 relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl not-prose">
                <Image 
                  src="/assets/villas/the-angle-house/gallery-3.webp" 
                  alt="The Angle House lonavala villa with private pool surrounded by lush greenery" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Gatherings, Celebrations & Offsites in the Hills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 not-prose">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Family Reunions</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Thoughtfully designed layouts featuring accessible ground-floor bedrooms, large living lounges, and secure grassy lawns for kids.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Milestone Birthdays</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Host memorable events with custom outdoor lighting, pool deck lounge seating, and tailored multi-course meals prepared live by on-site chefs.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Corporate Offsites</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    High-speed fiber Wi-Fi, quiet meeting zones, and evening campfire sit-outs designed to facilitate team alignment and strategic focus.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Pet-Friendly Grounds</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Fully fenced boundary lawns surrounded by lush greenery mean your pets travel and relax right alongside you.
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
                      Planning a Family Reunion, Birthday, or Offsite in Lonavala?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                      Skip the search. Tell us your dates and group size, and our Lonavala destination manager will share verified private pool villas, customized chef menus, and direct booking rates.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                    <a
                      href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'm planning a special gathering in Lonavala. Could you share curated private pool villas and catering options for our dates?")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Proposal</span>
                    </a>
                    <Link
                      href="/villa/the-angle-house#booking-card-section"
                      className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <Zap size={15} className="fill-[#1B3564]" />
                      <span>Check Rates & Book</span>
                    </Link>
                  </div>
                </div>
              </div>

              <h2>Micro-Climates & Seasonal Travel Guide</h2>
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
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Monsoon Peak</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">June – September</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Rolling fog, waterfall streams, and green hillsides near Bhushi Dam. Ideal for enjoying warm tea behind glass walls.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Crisp Winter</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">October – February</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Cool mountain air, clear skies, outdoor barbecues on the pool deck, and evening gatherings around open fires.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Breezy Summer</td>
                      <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">March – May</td>
                      <td className="px-6 py-4 text-slate-600 leading-relaxed">Pleasant morning breezes and cool evening temperatures, perfect for night swims in your private pool.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Frequently Asked Questions — Lonavala Villas</h2>
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">How is the private pool cleaned and maintained?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Every private pool undergoes complete filtration and sanitization cycles prior to guest arrival. On-site staff perform daily water quality checks to guarantee safety and clarity.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Can we request pure vegetarian or Jain catering?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Yes. Our in-house chefs cater to specific dietary requirements including pure-veg and Jain preparations using dedicated cookware and fresh ingredients.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Are pets allowed at the property?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Yes, pets are welcome. The Angle House features fully fenced lawns and safe outdoor spaces where pets can play freely.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">How do direct bookings compare to OTA platforms?</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Direct bookings via Stay Willas carry 0% platform commission, providing you with guaranteed lowest prices and customized meal coordination.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

          {/* Internal Blog Links */}
          <div className="mt-16 p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15 max-w-7xl mx-auto">
            <h3 className="text-lg font-heading text-[#1B3564] font-bold mb-4">Related Guides</h3>
            <ul className="space-y-3 text-sm text-slate-700 font-light">
              <li>→ <Link href="/blog/top-7-hidden-gems-secret-viewpoints-in-lonavala" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Top 7 Hidden Gems & Secret Viewpoints in Lonavala (And Where to Stay Nearby)</Link></li>
              <li>→ <Link href="/blog/ultimate-2-day-lonavala-weekend-itinerary" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Ultimate 2-Day Lonavala Weekend Itinerary: From Mountain Sunrises to Private Pool Barbecues</Link></li>
              <li>→ <Link href="/blog/villas-near-pawna-lake-lonavala" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Villas Near Pawna Lake, Lonavala: Your Ultimate Lakeside Retreat</Link></li>
              <li>→ <Link href="/blog/villa-near-lohagad-fort-trek-lonavala" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Choosing a Villa Near Lohagad Fort Trek, Lonavala</Link></li>
              <li>→ <Link href="/blog/lonavala-villa-monsoon-weekend-guide" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Ultimate Lonavala Villa Monsoon Weekend Guide</Link></li>
              <li>→ <Link href="/blog/lonavala-vs-khandala-villa-comparison" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Lonavala vs Khandala Villa Comparison: Which Location Is Best for You?</Link></li>
              <li>→ <Link href="/blog/pet-friendly-villas-near-mumbai-why-the-angle-house" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Pet-Friendly Villas Near Mumbai: Why The Angle House Is Perfect for You</Link></li>
              <li>→ <Link href="/blog/best-villa-in-lonavala-for-birthday-parties-family-reunions" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Best Villa in Lonavala for Birthday Parties & Family Reunions</Link></li>
              <li>→ <Link href="/blog/pet-friendly-villa-rules-near-mumbai-what-to-know" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Pet-Friendly Villa Rules Near Mumbai — What to Know Before You Book</Link></li>
            </ul>
          </div>

        {/* High-Converting VIP Direct Booking Privilege Banner */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full my-8">
          <div className="bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-8 sm:p-12 text-white border border-[#DAA520]/40 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full mb-4">
              <Star size={12} className="fill-[#DAA520]" /> Direct Booking Privilege
            </span>

            <h3 className="font-heading font-bold text-3xl sm:text-5xl text-white max-w-2xl leading-tight">
              Why Book Direct with Stay Willas in Lonavala?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-4 max-w-xl leading-relaxed">
              Enjoy guaranteed best rates, zero middleman commissions, custom meal menu design, and priority check-in assistance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 w-full max-w-4xl text-left">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">0% Commission</span>
                <p className="text-[11px] text-slate-300 font-light">No OTA markups or hidden fees</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">Chef Assist</span>
                <p className="text-[11px] text-slate-300 font-light">Direct pure-veg & Jain culinary planning</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[#DAA520] font-bold text-lg block mb-1">100% Private</span>
                <p className="text-[11px] text-slate-300 font-light">Exclusive villa & waterfall pool access</p>
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
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to talk to a destination specialist about booking a luxury villa in Lonavala.")}`}
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
              From ₹13,000<span className="text-[9px] text-slate-300 font-normal"> / nt</span>
            </span>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
              <Zap size={10} className="fill-emerald-400" /> 0% Platform Fee
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I want to check direct booking rates for Lonavala private pool villas.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] active:bg-[#20ba5a] text-white font-black text-[11px] uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            <a 
              href="#lonavala-villas-grid"
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

