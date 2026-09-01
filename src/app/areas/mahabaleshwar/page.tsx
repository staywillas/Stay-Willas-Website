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
  Compass,
  Utensils,
  Clock,
  Car,
  Heart,
  Trees,
  Award
} from "lucide-react";
import { generateDestinationCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const revalidate = 60; // Instant TTFB via ISR cache

export const metadata: Metadata = {
  title: "Private Pool Villas in Mahabaleshwar & Panchgani | Stay Willas",
  description: "Explore private pool villas in Mahabaleshwar and Panchgani. Book verified 4 BHK estates with panoramic valley views, private lawns & in-house chef dining from ₹14,000/night.",
  keywords: [
    "villas in mahabaleshwar with private pool",
    "villas in panchgani with private pool",
    "private pool villa mahabaleshwar",
    "terra cotta villa panchgani",
    "terra cotta villa mahabaleshwar",
    "4 bhk villa in mahabaleshwar",
    "4 bhk villa in panchgani",
    "best villa in mahabaleshwar for family",
    "villas near mapro garden mahabaleshwar",
    "weekend getaway villa mahabaleshwar"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/mahabaleshwar",
  },
  openGraph: {
    title: "Private Pool Villas in Mahabaleshwar & Panchgani | Stay Willas",
    description: "Explore private pool villas in Mahabaleshwar and Panchgani. Book verified 4 BHK estates with panoramic valley views, private lawns & in-house chef dining from ₹14,000/night.",
    url: "https://www.staywillas.com/areas/mahabaleshwar",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
        width: 1200,
        height: 630,
        alt: "Private pool villas in Mahabaleshwar and Panchgani - Stay Willas",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Pool Villas in Mahabaleshwar & Panchgani | Stay Willas",
    description: "Explore private pool villas in Mahabaleshwar and Panchgani. Book verified 4 BHK estates with panoramic valley views, private lawns & in-house chef dining from ₹14,000/night.",
    images: ["https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg"],
  },
};

export default async function MahabaleshwarPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      OR: [
        { location: { contains: "Mahabaleshwar", mode: "insensitive" } },
        { location: { contains: "Panchgani", mode: "insensitive" } },
        { slug: { contains: "terra-cotta", mode: "insensitive" } }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  const villas = dbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  const mahabaleshwarFaqs = [
    {
      question: "What is the best villa in Mahabaleshwar and Panchgani for large family groups?",
      answer: "Terra Cotta Villa is a premier 4 BHK private estate in Kaswand along the Panchgani-Mahabaleshwar road. It comfortably accommodates up to 16 guests with 4 air-conditioned bedrooms, 4 en-suite bathrooms, an exclusive private swimming pool, expansive lawn, outdoor gazebo, and dedicated caretaker services."
    },
    {
      question: "How far is Terra Cotta Villa from Mapro Garden and other popular viewpoints?",
      answer: "Terra Cotta Villa is ideally situated just 4.5 km (around 8 minutes drive) from Mapro Garden, 11 km from Lingmala Waterfalls, 14 km from Venna Lake, and 6 km from Table Land in Panchgani."
    },
    {
      question: "Is pure vegetarian and Jain food prepared on-site?",
      answer: "Yes, our dedicated on-site staff and chefs prepare customized homestyle meals, including 100% pure vegetarian and authentic Jain menus with separate cookware, upon request."
    },
    {
      question: "Does the villa have high-speed Wi-Fi for workcations and remote offsites?",
      answer: "Yes, Terra Cotta Villa offers super-fast high-speed Wi-Fi, power backup, and quiet indoor and outdoor working zones, making it ideal for executive team offsites and remote workcations."
    },
    {
      question: "Can we book Terra Cotta Villa directly with 0% platform commission?",
      answer: "Absolutely. When booking directly via Stay Willas or through our direct WhatsApp concierge, you get guaranteed best direct-to-owner rates, personalized meal coordination, and zero OTA platform booking commissions."
    },
    {
      question: "What are the check-in and check-out timings at Mahabaleshwar villas?",
      answer: "Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out can be accommodated subject to prior calendar availability."
    }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
    { name: "Mahabaleshwar & Panchgani", url: "/areas/mahabaleshwar" }
  ]);

  const collectionSchema = generateDestinationCollectionSchema({
    regionSlug: "mahabaleshwar",
    regionName: "Mahabaleshwar & Panchgani",
    title: "Villas in Mahabaleshwar & Panchgani with Private Pool",
    description: "Exclusive private pool villas and hillside retreats in Mahabaleshwar and Panchgani.",
    villas: villas.map(v => ({
      slug: v.id,
      name: v.name,
      image: v.image,
      price: parseInt(v.price.replace(/,/g, ""), 10),
      bedrooms: v.bedrooms,
      guests: v.guests,
      location: v.location
    }))
  });

  const faqSchema = generateFAQSchema(mahabaleshwarFaqs);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-slate-900 overflow-x-hidden selection:bg-[#DAA520]/20 selection:text-[#1B3564]">
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, collectionSchema, faqSchema]),
        }}
      />
      <Navbar />

      {/* Modern Full-Width Luxury Hero Banner */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-b border-[#DAA520]/20 min-h-[520px] sm:min-h-[600px] md:min-h-[680px] flex items-center">
        {/* High-Resolution Full-Bleed Villa Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image 
            src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg" 
            alt="Private pool villa in Mahabaleshwar and Panchgani by Stay Willas"
            fill
            priority
            quality={85}
            className="object-cover object-center"
          />
          {/* Cinematic Dark Overlays */}
          <div className="absolute inset-0 bg-[#0E1B35]/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B35] via-[#0E1B35]/50 to-[#0E1B35]/75 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1B35]/95 via-[#0E1B35]/70 to-[#0E1B35]/40 z-10" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 cols): Editorial & Action */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-xs text-slate-300/80 tracking-wider uppercase font-semibold mb-3 sm:mb-4 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Link href="/" className="hover:text-[#DAA520] transition-colors">Home</Link>
                <ChevronRight size={10} className="text-slate-400" />
                <Link href="/areas" className="hover:text-[#DAA520] transition-colors">Areas</Link>
                <ChevronRight size={10} className="text-slate-400" />
                <span className="text-[#DAA520] font-bold">Mahabaleshwar & Panchgani</span>
              </div>

              {/* Big Floating Direct Offer Button */}
              <Link 
                href="/villa/terra-cotta-villa"
                className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-600 via-amber-600 to-[#DAA520] hover:from-red-500 hover:to-amber-500 text-white px-4.5 sm:px-8 py-2.5 sm:py-4 rounded-full shadow-[0_4px_20px_rgba(220,38,38,0.45)] hover:shadow-[0_8px_35px_rgba(218,165,32,0.6)] transition-all duration-300 transform hover:-translate-y-1 mb-3 sm:mb-5 cursor-pointer border border-white/25"
              >
                <span className="text-xs sm:text-base md:text-lg font-black tracking-wide flex items-center gap-1.5 sm:gap-2">
                  🔥 Direct Rates • 0% Platform Fee
                </span>
                <ChevronRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading leading-tight tracking-tight mb-3 sm:mb-4 text-white">
                Private Pool Villas in{" "}
                <span className="italic font-light font-sans bg-gradient-to-r from-[#DAA520] via-[#F3C766] to-[#FFE082] bg-clip-text text-transparent font-bold pr-2 sm:pr-3 inline-block">
                  Mahabaleshwar
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-6 sm:mb-8">
                Perched high on the Sahyadri plateau among fresh strawberry valleys. Discover authentic terracotta brick architecture, crystal-clear private pools, misty mountain balconies, and bespoke homestyle dining.
              </p>

              {/* Direct Booking Hero CTA Group */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-6 sm:mb-8">
                <a 
                  href="#mahabaleshwar-villas-grid"
                  className="w-full sm:w-auto bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] hover:text-[#0E1B35] font-black text-xs sm:text-sm tracking-wider uppercase px-7 sm:px-9 py-4 rounded-full shadow-lg hover:shadow-glow-gold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Zap size={16} className="text-[#1B3564] fill-[#1B3564]" />
                  <span>VIEW ALL VILLAS (0% FEE)</span>
                </a>
                <a 
                  href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct booking offers, available dates and meal packages for Terra Cotta Villa in Mahabaleshwar / Panchgani.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm tracking-wider uppercase px-7 sm:px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} />
                  <span>WHATSAPP DIRECT OFFER</span>
                </a>
              </div>

              {/* Direct Booking Value Trust Anchor */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/90 font-bold bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  100% Private Pool
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5 text-[#DAA520]">
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  4.5 km to Mapro Garden
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  Accommodates Up to 16 Guests
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Visual Quick Overview Card */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl text-left text-white">
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/15">
                  <div>
                    <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-widest block">Featured Mountain Estate</span>
                    <h3 className="text-xl font-heading font-bold text-white">Terra Cotta Villa</h3>
                  </div>
                  <span className="bg-[#DAA520] text-[#1B3564] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    4 BHK
                  </span>
                </div>

                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-white/15">
                  <Image
                    src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg"
                    alt="Terra Cotta Villa Mahabaleshwar private pool"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#DAA520]">
                    Panchgani - Mahabaleshwar
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <span className="block text-slate-300 text-[9px] uppercase">Capacity</span>
                    <strong className="text-white text-xs">16 Guests</strong>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <span className="block text-slate-300 text-[9px] uppercase">Pool</span>
                    <strong className="text-white text-xs">Private Pool</strong>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <span className="block text-slate-300 text-[9px] uppercase">Starting</span>
                    <strong className="text-[#DAA520] text-xs">₹14,000/n</strong>
                  </div>
                </div>

                <Link
                  href="/villa/terra-cotta-villa#booking-card-section"
                  className="w-full bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>CHECK DATES & BOOK →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Destination Switcher Tabs */}
      <section className="bg-white border-b border-[#DAA520]/20 py-4 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#DAA520]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Explore Destinations:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link 
              href="/areas/lonavala"
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#FAF8F5] text-slate-700 hover:bg-[#1B3564] hover:text-white border border-slate-200 transition-all"
            >
              Lonavala Villas
            </Link>
            <Link 
              href="/areas/khopoli"
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#FAF8F5] text-slate-700 hover:bg-[#1B3564] hover:text-white border border-slate-200 transition-all"
            >
              Khopoli Villas
            </Link>
            <Link 
              href="/areas/mahabaleshwar"
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#1B3564] text-white shadow-sm border border-[#1B3564]"
            >
              Mahabaleshwar & Panchgani
            </Link>
            <Link 
              href="/areas"
              className="px-4 py-2 rounded-full text-xs font-bold bg-transparent text-[#DAA520] hover:underline"
            >
              View All Areas →
            </Link>
          </div>
        </div>
      </section>

      {/* Full-Width Villa Showcase Grid Section */}
      <section id="mahabaleshwar-villas-grid" className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-left mb-10 pb-4 border-b border-[#DAA520]/25 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
              Handpicked Estates
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading text-[#1B3564] font-bold">
              Available Private Pool Villas in <span className="text-[#DAA520]">Mahabaleshwar & Panchgani</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Direct owner rates, transparent pricing, 0% platform commissions, and dedicated on-site caretaker services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa) => (
            <VillaCard key={villa.id} {...villa} />
          ))}
        </div>
      </section>

      {/* Full-Width 4-Column Feature Highlights */}
      <section className="py-12 bg-white border-y border-[#DAA520]/20 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
              Why Book With Stay Willas
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
              The Private Villa Advantage in Mahabaleshwar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center mb-4 text-[#1B3564]">
                <Waves size={24} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-base mb-1.5">100% Private Pool</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Zero shared amenities with strangers. Enjoy crystal-clear swimming pool waters and relaxing pool decks in total privacy.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Up to 16 Guests</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Large 4 BHK layout with spacious living lounges, dining tables, and lawns ensuring your entire group stays comfortably together.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                <Utensils size={24} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Homestyle & Jain Dining</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dedicated in-house caretakers and on-demand local chefs prepare fresh multi-cuisine spreads and pure-veg Jain meals.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-700">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Direct 0% Platform Fee</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Skip 18-25% OTA portal commissions. Book directly with Stay Willas for guaranteed lowest rates and flexible custom quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Spotlight Section: Terra Cotta Villa */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#DAA520]/25 overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Image Showcase (6 cols) */}
            <div className="lg:col-span-6 relative aspect-[16/11] lg:h-full w-full bg-slate-900 min-h-[340px]">
              <Image 
                src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg" 
                alt="Terra Cotta Villa swimming pool and hill view in Panchgani"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#DAA520]">
                ⭐ Signature Mountain Estate
              </div>
            </div>

            {/* Right Content Breakdown (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 text-left space-y-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#DAA520] block mb-1">
                  Spotlight Property
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#1B3564]">
                  Terra Cotta Villa
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin size={14} className="text-[#DAA520]" /> Kaswand, Panchgani - Mahabaleshwar Road
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Terra Cotta Villa seamlessly combines earthy countryside aesthetics with modern luxury. Built with rustic brickwork, this 4 BHK estate features a private swimming pool overlooking Sahyadri hilltops, manicured lawns with an evening gazebo, comfortable king-size bedroom suites, high-speed Wi-Fi, and live BBQ setups.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center py-2 border-y border-slate-100">
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Bedrooms</span>
                  <strong className="text-sm font-bold text-[#1B3564]">4 BHK</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Max Guests</span>
                  <strong className="text-sm font-bold text-[#1B3564]">16 Pax</strong>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Direct Rate</span>
                  <strong className="text-sm font-bold text-[#DAA520]">From ₹14,000/n</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/villa/terra-cotta-villa"
                  className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>View Full Photo Gallery & Book</span>
                  <ChevronRight size={14} />
                </Link>
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct pricing and dates for Terra Cotta Villa in Mahabaleshwar / Panchgani.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Full-Width Seasonality & Climate Guide */}
      <section className="py-12 bg-[#FAF8F5] px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-left">
          <div className="mb-8">
            <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
              Travel Planner
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
              Best Time to Visit Mahabaleshwar & Panchgani
            </h3>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#DAA520]/20 shadow-xs">
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
                  <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Strawberry Season & Winter</td>
                  <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">November – February</td>
                  <td className="px-6 py-4 text-slate-600 leading-relaxed">Crisp chilly evenings (12°C–18°C), fresh strawberry plucking at nearby farms, outdoor bonfires, and barbecue nights.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Summer Mountain Escape</td>
                  <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">March – May</td>
                  <td className="px-6 py-4 text-slate-600 leading-relaxed">Pleasant mountain weather to escape city heat, all-day pool sessions, and sunset viewpoints at Table Land.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-[#1B3564] whitespace-nowrap">Misty Monsoon Romance</td>
                  <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">June – October</td>
                  <td className="px-6 py-4 text-slate-600 leading-relaxed">Lush emerald valleys, roaring waterfalls like Lingmala, drifting monsoon clouds, and piping hot pakoras by the poolside.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Full-Width Nearby Attractions Proximity Chart */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#DAA520]/20 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#DAA520]/20 gap-4">
            <div>
              <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
                Sightseeing & Proximity
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
                Top Attractions Near Terra Cotta Villa
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Centrally located on the Panchgani-Mahabaleshwar road for effortless exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1B3564] text-base">Mapro Garden</h4>
                <span className="text-[10px] font-black bg-[#DAA520]/20 text-[#1B3564] px-2.5 py-0.5 rounded-full">4.5 km (8 mins)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Famous for fresh strawberry creams, wood-fired pizzas, fruit preserves, and chocolate factory tours.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1B3564] text-base">Table Land</h4>
                <span className="text-[10px] font-black bg-[#DAA520]/20 text-[#1B3564] px-2.5 py-0.5 rounded-full">6.2 km (12 mins)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Asia&apos;s second-largest mountain plateau offering horse riding, cave exploring, and 360° valley vistas.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1B3564] text-base">Lingmala Falls</h4>
                <span className="text-[10px] font-black bg-[#DAA520]/20 text-[#1B3564] px-2.5 py-0.5 rounded-full">11 km (18 mins)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Spectacular cascading waterfalls nestled inside a tranquil forest sanctuary.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1B3564] text-base">Venna Lake</h4>
                <span className="text-[10px] font-black bg-[#DAA520]/20 text-[#1B3564] px-2.5 py-0.5 rounded-full">14 km (22 mins)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Picturesque boating lake surrounded by pine trees with bustling street food stalls and evening horse rides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width High-Converting Mid Banner */}
      <section className="py-12 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-8 sm:p-12 text-white border border-[#DAA520]/40 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] font-black uppercase text-[10px] tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                <Sparkles size={12} /> Direct Booking Special
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-4xl text-white leading-tight mb-2">
                Ready for a Mountain Getaway in Mahabaleshwar?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Lock in direct-to-owner rates, custom Jain/non-veg meal catering, and zero platform booking commissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 w-full lg:w-auto shrink-0">
              <a
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like to check direct booking offers, available dates and meal packages for Terra Cotta Villa in Mahabaleshwar / Panchgani.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Concierge</span>
              </a>
              <Link
                href="/villa/terra-cotta-villa#booking-card-section"
                className="bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <Zap size={16} className="fill-[#1B3564]" />
                <span>Check Calendar & Book</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 2-Column FAQs Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto text-left">
        <div className="mb-10 pb-4 border-b border-[#DAA520]/20">
          <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
            Got Questions?
          </span>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
            Frequently Asked Questions — Mahabaleshwar & Panchgani Villas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mahabaleshwarFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-[#DAA520]/20 shadow-xs">
              <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">
                {faq.question}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
