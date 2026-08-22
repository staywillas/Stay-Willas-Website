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
  Bath
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
    comment: "The waterfall pool is genuinely private, and the glass facade gives insane mountain views during monsoon. Kailash's team prepared mouth-watering food!",
    highlight: "Waterfall Pool & Dining"
  },
  {
    name: "Vikram Singhania",
    location: "Koregaon Park, Pune",
    rating: 5,
    date: "Stayed June 2026",
    comment: "Booked directly via WhatsApp on their 28% weekday deal. Saved ₹5,000+ compared to Airbnb, and the caretaker had the jacuzzi ready before check-in.",
    highlight: "Direct Booking Savings"
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
    comment: "Celebrated my 30th birthday here with 12 friends. Cleanest pool in Lonavala and zero noise disturbances.",
    highlight: "Group Celebration"
  }
];

export const metadata: Metadata = {
  title: "Villas in Lonavala with Private Pool | Best Villa in Lonavala",
  description: "Book premier villas in lonavala with private pool at The Angle House. Voted the best villa in lonavala & top villa for rent in lonavala with chef & jacuzzi.",
  keywords: [
    "villas in lonavala with private pool",
    "best villa in lonavala",
    "villa for rent in lonavala"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/villas-in-lonavala-with-private-pool",
  },
  openGraph: {
    title: "Villas in Lonavala with Private Pool | Best Villa in Lonavala",
    description: "Book premier villas in lonavala with private pool at The Angle House. Voted the best villa in lonavala & top villa for rent in lonavala with chef & jacuzzi.",
    url: "https://www.staywillas.com/villas-in-lonavala-with-private-pool",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "The Angle House - Villas in Lonavala with Private Pool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Lonavala with Private Pool | Best Villa in Lonavala",
    description: "Book premier villas in lonavala with private pool at The Angle House. Voted the best villa in lonavala & top villa for rent in lonavala with chef & jacuzzi.",
    images: ["https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp"],
  },
};

export default async function LonavalaGlassHousePage() {
  const villa = await prisma.villa.findFirst({
    where: { slug: "the-angle-house" },
  });

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
                "name": "The Angle House — Premier Villas in Lonavala with Private Pool",
                "description": "Book the best villa in Lonavala featuring a waterfall pool, master suite jacuzzi, pet-friendly lawns, and chef service. An exclusive villa for rent in Lonavala for staycations.",
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
                  },
                  {
                    "@type": "Question",
                    "name": "How can I book this villa for rent in Lonavala?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can book this villa for rent in Lonavala directly online or by contacting our Stay Willas concierge on WhatsApp for instant dates and tariff confirmation."
                    }
                  }
                ]
              }
            ])
          }}
        />

        <Navbar />

        {/* 28% Mega Weekday Offer Floating Ads & Countdown Strip */}
        <MegaDiscountAdBanner 
          pageName="lonavala"
          villaName="The Angle House (Lonavala)"
          location="Lonavala, Maharashtra"
          couponCode="LONAVALA28"
          discountPercent={28}
          villaLink="/villa/the-angle-house"
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
              <span className="text-text-primary font-bold">Villas in Lonavala with Private Pool</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Exclusive Private Retreat
            </span>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1B3564] mb-6">
              Villas in Lonavala with Private Pool
            </h1>

            <p className="text-text-primary/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Discover <strong className="font-semibold text-[#1B3564]">The Angle House</strong>, widely rated as the <strong className="font-semibold text-[#1B3564]">best villa in Lonavala</strong>. If you are searching for a premium <strong className="font-semibold text-[#1B3564]">villa for rent in Lonavala</strong>, enjoy our private waterfall pool, master jacuzzi, pet-friendly lawns, and in-house chef service.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl mb-8">
              <Link 
                href="/villa/the-angle-house" 
                className="bg-white hover:bg-slate-100 border-2 border-[#1B3564]/30 text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all active:scale-95 text-center flex items-center gap-1.5"
              >
                <span>View Villa Gallery & Specs</span>
                <ChevronRight size={14} />
              </Link>
              <Link 
                href="/villa/the-angle-house" 
                className="bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all text-center"
              >
                Book with 28% Off
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20booking%20The%20Angle%20House%20in%20Lonavala%20with%20the%2028%%20discount%20coupon%20LONAVALA28" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#25D366] hover:bg-emerald-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} /> WhatsApp 28% Deal
              </a>
            </div>

            {/* Quick 1-Field Mobile Lead Form */}
            <div className="w-full max-w-2xl">
              <QuickMobileLeadForm
                villaName="The Angle House (Lonavala)"
                location="Lonavala, Maharashtra"
                defaultCoupon="LONAVALA28"
                discountPercent={28}
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
            originalPrice={villa?.price || 13000}
            discountedPrice={Math.round((villa?.price || 13000) * 0.72)}
            couponCode="LONAVALA28"
            images={angleHouseShowcaseImages}
            reviews={angleHouseReviews}
          />
        </section>

        {/* Comprehensive Editorial Guide Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-left bg-white/90 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:mt-8 sm:prose-h2:mt-12 prose-h3:text-[#1B3564] prose-h3:font-heading prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:mt-6 sm:prose-h3:mt-8 prose-a:text-accent-primary">
            
            <h2>Discover Premier Villas in Lonavala with Private Pool</h2>
            <p>
              When planning a weekend getaway from Mumbai or Pune, travelers seek absolute privacy, comfort, and top-tier amenities. Out of all the available <strong>villas in lonavala with private pool</strong>, <strong className="font-semibold text-[#1B3564]">The Angle House</strong> stands out for its modern design, lush surroundings, and exclusive features. Set in the peaceful heights of Tungarli, this estate provides an unmatched vacation environment.
            </p>
            <p>
              Having access to a secluded waterfall pool lets you swim and relax at any time of day, making your stay genuinely refreshing and private.
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
              If you are searching for a premier <strong>villa for rent in lonavala</strong> that accommodates groups up to 16 guests, The Angle House is meticulously equipped to deliver total convenience:
            </p>

            <h3>Exclusive Private Amenities</h3>
            <p>
              Unlike crowded resort properties, renting this <strong>villa for rent in lonavala</strong> grants your group sole access to manicured pet-friendly lawns, indoor lounge games, and a private waterfall pool.
            </p>

            <h3>Gourmet Culinary Services & Customized Dining</h3>
            <p>
              Dining at our <strong>villas in lonavala with private pool</strong> is effortless. Dedicated in-house culinary staff prepare fresh, hot meals right on site. Enjoy local Maharashtrian delicacies, poolside barbecues, and specialized pure-vegetarian or Jain options cooked in separate dedicated cookware.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-6 sm:my-8 space-y-3 sm:space-y-4 not-prose text-left">
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
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">How can I book this villa for rent in Lonavala?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  You can book this villa for rent in Lonavala directly online or by contacting our Stay Willas concierge on WhatsApp for instant dates and tariff confirmation.
                </p>
              </div>
            </div>

            {/* Additional CTA inside article */}
            <div className="mt-8 not-prose text-center pt-4 border-t border-slate-100">
              <Link 
                href="/villa/the-angle-house" 
                className="inline-block bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 px-8 rounded-2xl shadow transition-all"
              >
                View Villa Specifications
              </Link>
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
                28% OFF APPLIED
              </div>

              <div className="border-b border-slate-100 pb-3 pt-2">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Special Direct Offer</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm line-through text-slate-400 font-medium">₹13,000</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1B3564]">₹9,360</span>
                  <span className="text-xs font-normal text-slate-500">/ night</span>
                </div>
                <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Coupon: <strong className="text-[#1B3564]">LONAVALA28</strong>
                </span>
              </div>

              <Link 
                href="/villa/the-angle-house" 
                className="block w-full bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white font-black text-xs uppercase tracking-wider text-center py-3.5 rounded-xl shadow transition-all"
              >
                Claim 28% Off & Book
              </Link>

              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20The%20Angle%20House%20in%20Lonavala%20with%2028%%20Discount%20(Coupon:%20LONAVALA28)" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider text-center py-3 rounded-xl transition-all shadow-md"
              >
                <PhoneCall size={14} /> WhatsApp 28% Quote
              </a>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
