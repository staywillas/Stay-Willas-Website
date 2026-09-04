import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  ChevronRight, 
  PhoneCall, 
  Sparkles, 
  Waves, 
  Dog, 
  Utensils, 
  Users, 
  BedDouble, 
  Bath,
  CloudRain,
  Calendar,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

import VillaFeatureMarquee, { FeatureMarqueeItem } from "@/components/villas/villa-feature-marquee";
import QuickMobileLeadForm from "@/components/common/quick-mobile-lead-form";
import MegaDiscountAdBanner from "@/components/common/mega-discount-ad-banner";
import AdLandingShowcase from "@/components/villas/ad-landing-showcase";

const angleHouseFeatures: FeatureMarqueeItem[] = [
  {
    id: 1,
    title: "Private Waterfall Swimming Pool",
    badge: "Private Pool",
    description: "Temperature-filtered pool with cascading waterfall feature & evening deck lighting.",
    image: "/assets/villas/the-angle-house/gallery-13.webp",
  },
  {
    id: 2,
    title: "Double-Height Glass Facade",
    badge: "Architecture",
    description: "Floor-to-ceiling glass walls offering panoramic Sahyadri mountain views.",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
  },
  {
    id: 3,
    title: "Master Suite Jacuzzi Bath",
    badge: "Jacuzzi Suite",
    description: "Private master suite with luxury Jacuzzi setup and tranquil forest outlook.",
    image: "/assets/villas/the-angle-house/gallery-19.webp",
  },
  {
    id: 4,
    title: "Pet-Friendly Fenced Lawns",
    badge: "Pet Friendly",
    description: "Lush green manicured lawns with secure boundary fencing for pets & children.",
    image: "/assets/villas/the-angle-house/gallery-5.webp",
  },
  {
    id: 5,
    title: "In-House Gourmet Chef Dining",
    badge: "Chef Service",
    description: "Fresh multi-cuisine meals, Maharashtrian specialties, vegetarian & Jain menus.",
    image: "/assets/villas/the-angle-house/gallery-16.webp",
  },
  {
    id: 6,
    title: "Spacious Living Lounge",
    badge: "Spacious Lounge",
    description: "Double-height central hall designed for family board games & storytelling.",
    image: "/assets/villas/the-angle-house/gallery-18.webp",
  },
];

const angleHouseShowcaseImages = [
  { url: "/assets/villas/the-angle-house/gallery-13.webp", title: "Private Waterfall Swimming Pool", tag: "Signature Pool" },
  { url: "/assets/villas/the-angle-house/gallery-11.webp", title: "Double-Height Glass Facade", tag: "Architecture" },
  { url: "/assets/villas/the-angle-house/gallery-19.webp", title: "Master Jacuzzi Suite", tag: "Luxury Bath" },
  { url: "/assets/villas/the-angle-house/gallery-5.webp", title: "Pet-Friendly Fenced Lawns", tag: "Outdoor" },
  { url: "/assets/villas/the-angle-house/gallery-16.webp", title: "In-House Gourmet Chef Dining", tag: "Culinary" },
  { url: "/assets/villas/the-angle-house/gallery-18.webp", title: "Expansive Living Lounge Hall", tag: "Lounge" },
];

const angleHouseReviews = [
  {
    name: "Rohan & Priya Mehta",
    location: "Bandra, Mumbai",
    rating: 5,
    date: "Stayed July 2026",
    comment: "The Monsoon Escape at The Angle House was breathtaking! The waterfall pool in the rain and glass facade view of Sahyadri clouds made it unforgettable. Kailash's team prepared steaming hot pakoras & tea!",
    highlight: "Monsoon Escape & Waterfall Pool"
  },
  {
    name: "Vikram Singhania",
    location: "Koregaon Park, Pune",
    rating: 5,
    date: "Stayed June 2026",
    comment: "Booked directly via WhatsApp for their 2-night weekday saver offer (Monday to Wednesday). Saved ₹11,000+ compared to Airbnb, and the caretaker had the jacuzzi ready before check-in.",
    highlight: "2-Night Weekday Saver Deal"
  },
  {
    name: "Aditi Deshmukh",
    location: "Thane, Mumbai",
    rating: 5,
    date: "Stayed May 2026",
    comment: "Our Golden Retriever had the best time running across the fenced lawns! Total peace of mind for pet parents.",
    highlight: "Pet-Friendly Security"
  },
  {
    name: "Sameer Kulkarni",
    location: "Kothrud, Pune",
    rating: 5,
    date: "Stayed August 2026",
    comment: "Celebrated my 30th birthday here with 12 friends on a weekday. Cleanest pool in Lonavala and zero noise disturbances.",
    highlight: "Group Celebration"
  }
];

export const metadata: Metadata = {
  title: "Villas in Lonavala with Private Pool | Luxury Staycations | Stay Willas",
  description: "Book verified luxury villas in Lonavala with private pool, master suite jacuzzi, pet-friendly lawns & in-house chef. Best direct booking deals from ₹13,000/night.",
  keywords: [
    "villas in lonavala with private pool",
    "lonavala villa with private pool",
    "private pool villas in lonavala",
    "villas in lonavala",
    "villa in lonavala",
    "best villas in lonavala",
    "luxury villas in lonavala",
    "the angle house lonavala",
    "villa for rent in lonavala with swimming pool",
    "private villa in lonavala"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/villas-in-lonavala-with-private-pool",
  },
  openGraph: {
    title: "Villas in Lonavala with Private Pool | Luxury Staycations | Stay Willas",
    description: "Book verified luxury villas in Lonavala with private pool, master suite jacuzzi, pet-friendly lawns & in-house chef. Best direct booking deals from ₹13,000/night.",
    url: "https://www.staywillas.com/villas-in-lonavala-with-private-pool",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "The Angle House - Luxury Villas in Lonavala with Private Pool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Lonavala with Private Pool | Luxury Staycations | Stay Willas",
    description: "Book verified luxury villas in Lonavala with private pool, master suite jacuzzi, pet-friendly lawns & in-house chef. Best direct booking deals from ₹13,000/night.",
    images: ["https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp"],
  },
};

export default async function LonavalaGlassHousePage() {
  const villa = await prisma.villa.findFirst({
    where: { slug: "the-angle-house" },
  });

  const basePrice = villa?.price || 13000;
  const discounted1Night = Math.round(basePrice * 0.72);
  const discounted2NightsTotal = Math.round(discounted1Night * 2 * 0.95); // 5% extra discount for 2-night weekday stay

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        {/* Structured Data: Multi-Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "VacationRental",
                "name": "The Angle House — Premier Villas in Lonavala with Private Pool (Monsoon Escape)",
                "description": "Book the best villa in Lonavala featuring a waterfall pool, master suite jacuzzi, pet-friendly lawns, and chef service. Special Monsoon Escape weekday offer: Stay 2 nights & save more.",
                "url": "https://www.staywillas.com/villas-in-lonavala-with-private-pool",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Lonavala",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                },
                "numberOfRooms": 3,
                "occupancy": {
                  "@type": "QuantitativeValue",
                  "maxValue": 16
                },
                "priceRange": "₹13,000 - ₹20,000"
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.staywillas.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Villas in Lonavala with Private Pool",
                    "item": "https://www.staywillas.com/villas-in-lonavala-with-private-pool"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is the Monsoon Escape offer for The Angle House?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The Monsoon Escape offer provides exclusive weekday savings on The Angle House. When you stay for 2 nights (Monday to Thursday), you save even more with flat discounts, complimentary evening snacks, and direct WhatsApp booking benefits."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What makes The Angle House one of the top villas in Lonavala with private pool?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The Angle House stands out among villas in Lonavala with private pool due to its signature glass architecture, waterfall pool, master suite jacuzzi, 24/7 concierge, and in-house chef service."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why is The Angle House considered the best villa in Lonavala for families?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "It is widely recognized as the best villa in Lonavala because it offers full privacy, secure pet-friendly green lawns, spacious 3 BHK suites, and tailored meal options."
                    }
                  }
                ]
              }
            ])
          }}
        />

        <Navbar />

        {/* Monsoon Escape Floating Ads & Countdown Strip */}
        <MegaDiscountAdBanner 
          pageName="lonavala"
          villaName="The Angle House (Lonavala)"
          location="Lonavala, Maharashtra"
          couponCode="STAYW28"
          discountPercent={28}
          villaLink="/villa/the-angle-house"
          offerTitle="Monsoon Escape"
          highlightText="Stay 2 Nights & Save More"
        />

        {/* Hero Section */}
        <section className="relative pt-36 pb-20 md:pt-52 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/15 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/the-angle-house/gallery-11.webp" 
              alt="The Angle House - Luxury villas in Lonavala with private pool"
              fill
              priority
              className="object-cover opacity-25 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center relative z-20">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas/lonavala" className="hover:text-accent-primary transition-colors">Lonavala</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">The Angle House</span>
            </div>

            {/* Monsoon Escape Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#DAA520] text-[#1B3564] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md mb-4 animate-bounce">
              <CloudRain size={15} className="stroke-[2.5]" />
              <span>MONSOON ESCAPE • THE ANGLE HOUSE</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1B3564] mb-4">
              Villas in Lonavala with Private Pool
            </h1>

            {/* Prominent Offer Callout */}
            <div className="bg-gradient-to-r from-[#1B3564]/10 via-[#DAA520]/15 to-[#1B3564]/10 border border-[#DAA520]/50 rounded-2xl p-4 mb-6 max-w-2xl text-center">
              <span className="text-[#1B3564] font-black text-sm sm:text-base md:text-lg block">
                🌧️ Stay for 2 Nights & Save More — <span className="text-emerald-700 underline">Weekdays Only (Mon–Thu)</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                Book <strong>The Angle House</strong> for 2 weekday nights and unlock maximum direct savings + complimentary Jacuzzi prep & live barbecue service.
              </p>
            </div>

            <p className="text-text-primary/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Discover <strong className="font-semibold text-[#1B3564]">The Angle House</strong>, voted the <strong className="font-semibold text-[#1B3564]">best villa in Lonavala</strong>. If you are searching for a premier <strong className="font-semibold text-[#1B3564]">villa for rent in Lonavala</strong>, enjoy our private waterfall pool, master jacuzzi, pet-friendly lawns, and in-house chef service.
            </p>

            {/* Strong Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl mb-8">
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20the%20Monsoon%20Escape%20Offer%20for%20The%20Angle%20House%20in%20Lonavala%20(Stay%20for%202%20Nights%20and%20Save%20More%20-%20Weekdays%20Only).%20Coupon:%20STAYW28" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#25D366] hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-black uppercase tracking-wider py-4 px-7 rounded-2xl shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <PhoneCall size={16} className="stroke-[2.5]" />
                <span>CLAIM MONSOON 2-NIGHT DEAL</span>
              </a>
              <Link 
                href="/villa/the-angle-house" 
                className="bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white text-xs sm:text-sm font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg transition-all text-center hover:scale-102"
              >
                Book with 28% Off
              </Link>
              <Link 
                href="/villa/the-angle-house" 
                className="bg-white hover:bg-slate-100 border-2 border-[#1B3564]/30 text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-md transition-all active:scale-95 text-center flex items-center gap-1.5"
              >
                <span>View Villa Gallery</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Quick 1-Field Mobile Lead Form */}
            <div className="w-full max-w-2xl">
              <QuickMobileLeadForm
                villaName="The Angle House (Lonavala)"
                location="Lonavala, Maharashtra"
                defaultCoupon="STAYW28"
                discountPercent={28}
                offerTitle="Monsoon Escape"
                highlightText="Stay 2 Nights & Save More (Weekdays Only)"
              />
            </div>
          </div>
        </section>

        {/* Feature Image Marquee Section (Below Hero) */}
        <VillaFeatureMarquee 
          heading="The Angle House — Estate Highlights" 
          subheading="Experience modern architectural luxury among top villas in Lonavala with private pool, jacuzzi & in-house chef service."
          items={angleHouseFeatures} 
        />

        {/* Dedicated Monsoon Escape Weekday Saver Banner Section */}
        <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#1B3564] to-[#0A1A36] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#DAA520] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 bg-[#DAA520] text-[#1B3564] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                  <CloudRain size={14} />
                  SPECIAL MONSOON OFFER • THE ANGLE HOUSE
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-white">
                  Stay for 2 Nights & Save More on Weekdays
                </h2>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Lonavala comes alive during the rains. Watch cascading clouds drift past the double-height glass facade, take a dip in your private waterfall pool, and relax in the master jacuzzi suite. 
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Weekdays Only:</strong> Monday to Thursday Check-ins</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Extra 2-Night Discount:</strong> Maximum direct savings</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Complimentary:</strong> Evening chai & hot pakoras</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>0% Middleman Fees:</strong> Direct WhatsApp support</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md border border-[#DAA520]/60 rounded-3xl p-6 text-center space-y-4 shadow-xl shrink-0">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                  Exclusive Weekday Deal
                </span>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-slate-400 line-through text-base font-semibold">₹{(basePrice * 2).toLocaleString("en-IN")}</span>
                    <span className="text-3xl sm:text-4xl font-heading font-black text-white">₹{discounted2NightsTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-[11px] text-[#DAA520] font-bold block mt-1">Total for 2 Weekday Nights</span>
                </div>
                <a
                  href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20claim%20the%20Monsoon%20Escape%202-Night%20Weekday%20Deal%20for%20The%20Angle%20House%20in%20Lonavala%20(Coupon:%20STAYW28)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <PhoneCall size={14} className="stroke-[2.5]" />
                    <span>CLAIM 2-NIGHT OFFER</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Spotlight */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#1B3564] mb-3">
              Why We Are Voted the Best Villa in Lonavala
            </h2>
            <p className="text-text-primary/70 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Designed for families, pet parents, and groups looking for an exclusive villa for rent in Lonavala with total privacy and signature hospitality.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Waves className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Private Waterfall Pool</h3>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Sparkles className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Architectural Masterpiece</h3>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Dog className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Pet-Friendly Fenced Lawns</h3>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Utensils className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">In-House Chef Service</h3>
            </div>
          </div>
        </section>

        {/* Ad Conversion Suite: Comparison Matrix, Photo Tour, Reviews, and Sticky Mobile Bar */}
        <section className="py-10 sm:py-16">
          <AdLandingShowcase
            villaSlug="the-angle-house"
            villaName="The Angle House"
            location="Lonavala, Maharashtra"
            originalPrice={basePrice}
            discountedPrice={discounted1Night}
            couponCode="STAYW28"
            images={angleHouseShowcaseImages}
            reviews={angleHouseReviews}
            offerTitle="Monsoon Escape"
            highlightText="Stay 2 Nights & Save More"
          />
        </section>

        {/* Comprehensive Editorial Guide Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-left bg-white/90 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:mt-8 sm:prose-h2:mt-12 prose-h3:text-[#1B3564] prose-h3:font-heading prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:mt-6 sm:prose-h3:mt-8 prose-a:text-accent-primary">
            
            <h2>Discover Premier Villas in Lonavala with Private Pool: Monsoon Escape</h2>
            <p>
              When planning a monsoon getaway from Mumbai or Pune, travelers seek absolute privacy, comfort, and top-tier amenities. Out of all the available <strong>villas in lonavala with private pool</strong>, <strong className="font-semibold text-[#1B3564]">The Angle House</strong> stands out for its modern design, lush surroundings, and exclusive features. Set in the peaceful heights of Tungarli, this estate provides an unmatched vacation environment.
            </p>
            <p>
              Under our special <strong>Monsoon Escape</strong> promotion, groups who <strong>stay for 2 nights save more</strong> on weekdays (Monday to Thursday). Having access to a secluded waterfall pool lets you swim and relax at any time of day, making your stay genuinely refreshing and private.
            </p>

            <h2>Why The Angle House is the Best Villa in Lonavala for Your Staycation</h2>
            <p>
              Consistently recognized as the <strong>best villa in lonavala</strong>, The Angle House boasts 3 oversized master BHK suites with plush bedding, split air conditioning, private balconies, and an indulgent master suite jacuzzi bath. Double-height floor-to-ceiling glass facades allow natural sunlight to flood the living hall while offering sweeping views of the Sahyadri mountains.
            </p>
            <p>
              Whether you are hosting a milestone family reunion, a corporate retreat, or a quiet celebration, choosing the <strong>best villa in lonavala</strong> guarantees personalized hospitality tailored to your preferences.
            </p>

            <h2>Choosing the Perfect Villa for Rent in Lonavala</h2>
            <p>
              If you are searching for a premier <strong>villa for rent in lonavala</strong> that accommodates groups up to 12 guests, The Angle House is meticulously equipped to deliver total convenience:
            </p>

            <h3>Exclusive Private Amenities & Jacuzzi</h3>
            <p>
              Unlike crowded resort properties, renting this <strong>villa for rent in lonavala</strong> grants your group sole access to manicured pet-friendly lawns, indoor lounge games, master jacuzzi, and a private waterfall pool.
            </p>

            <h3>Gourmet Culinary Services & Monsoon Delicacies</h3>
            <p>
              Dining at our <strong>villas in lonavala with private pool</strong> is effortless. Dedicated in-house culinary staff prepare fresh, hot meals right on site. Enjoy local Maharashtrian delicacies, poolside barbecues, and specialized pure-vegetarian or Jain options cooked in separate dedicated cookware.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-6 sm:my-8 space-y-3 sm:space-y-4 not-prose text-left">
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">What is the Monsoon Escape offer for The Angle House?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  The Monsoon Escape offer provides exclusive weekday savings on The Angle House. When you stay for 2 nights (Monday to Thursday), you save even more with flat discounts, complimentary evening snacks, and direct WhatsApp booking benefits.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">What makes The Angle House one of the top villas in Lonavala with private pool?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  The Angle House stands out among villas in Lonavala with private pool due to its signature glass architecture, waterfall pool, master suite jacuzzi, 24/7 concierge, and in-house chef service.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Why is The Angle House considered the best villa in Lonavala for families?</h3>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  It is widely recognized as the best villa in Lonavala because it offers full privacy, secure pet-friendly green lawns, spacious 3 BHK suites, and tailored meal options.
                </p>
              </div>
            </div>

            {/* Additional CTA inside article */}
            <div className="mt-8 not-prose text-center pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <Link 
                href="/villa/the-angle-house" 
                className="inline-block bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow transition-all"
              >
                View Villa Specifications
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20The%20Angle%20House%20Monsoon%20Escape%20Deal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow transition-all"
              >
                <PhoneCall size={14} />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </article>
        </section>

        {/* Specs Bar & Direct Booking Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-4 text-left max-w-xl w-full">
              <span className="text-accent-secondary text-xs font-bold uppercase tracking-widest block">
                Property Overview
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B3564]">
                The Angle House — Villas in Lonavala with Private Pool
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                🌧️ <strong>Monsoon Escape:</strong> Stay for 2 nights and save more on weekdays (Mon–Thu).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Users className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Capacity</span>
                    <span className="font-bold text-xs text-[#1B3564]">12-16 Guests</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <BedDouble className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Bedrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">3 BHK Suites</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Bath className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Bathrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">3 Modern Baths</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Waves className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Pool</span>
                    <span className="font-bold text-xs text-[#1B3564]">Private Waterfall</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#DAA520]/40 shadow-xl space-y-3.5 sm:space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#DAA520] text-[#1B3564] text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-lg">
                MONSOON DEAL APPLIED
              </div>

              <div className="border-b border-slate-100 pb-3 pt-2">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Special Direct Offer</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm line-through text-slate-400 font-medium">₹{basePrice.toLocaleString("en-IN")}</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1B3564]">₹{discounted1Night.toLocaleString("en-IN")}</span>
                  <span className="text-xs font-normal text-slate-500">/ night</span>
                </div>
                <div className="text-[9px] text-amber-700 italic font-medium mt-0.5">
                  *Prices may vary due to demand
                </div>
                <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Coupon: <strong className="text-[#1B3564]">STAYW28</strong>
                </span>
              </div>

              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20The%20Angle%20House%20in%20Lonavala%20with%20the%20Monsoon%20Escape%20Offer%20(Stay%202%20Nights%20and%20Save%20More%20-%20Weekdays%20Only)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider text-center py-3.5 rounded-xl transition-all shadow-md hover:scale-102"
              >
                <PhoneCall size={14} />
                <span>WhatsApp 2-Night Deal</span>
              </a>

              <Link 
                href="/villa/the-angle-house" 
                className="block w-full bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white font-black text-xs uppercase tracking-wider text-center py-3 rounded-xl shadow transition-all"
              >
                Claim 28% Off & Book
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}

