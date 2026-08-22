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
  Utensils, 
  Waves, 
  Users, 
  BedDouble, 
  Bath,
  Flame,
  Trees
} from "lucide-react";
import VillaFeatureMarquee, { FeatureMarqueeItem } from "@/components/villas/villa-feature-marquee";
import QuickMobileLeadForm from "@/components/common/quick-mobile-lead-form";
import MegaDiscountAdBanner from "@/components/common/mega-discount-ad-banner";
import AdLandingShowcase from "@/components/villas/ad-landing-showcase";

const canopyCrestFeatures: FeatureMarqueeItem[] = [
  {
    id: 1,
    title: "22x12 Ft Private Swimming Pool",
    badge: "Massive Pool",
    description: "Expansive private swimming pool designed for large group staycations & pool parties.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
  },
  {
    id: 2,
    title: "Sprawling Charpai Green Lawns",
    badge: "Multi-Acre Lawn",
    description: "Open manicured lawns with traditional charpai seating for cricket & outdoor sports.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg",
  },
  {
    id: 3,
    title: "4 Master BHK Bedroom Suites",
    badge: "Group Capacity",
    description: "Spacious master suites accommodating up to 20 to 25+ guests with 5 bathrooms.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg",
  },
  {
    id: 4,
    title: "Outdoor Gazebo & Evening Lounge",
    badge: "Outdoor Lounge",
    description: "Shaded gazebo lounge & dedicated bonfire pit for evening gatherings under the stars.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
  },
  {
    id: 5,
    title: "Indoor Games & Music Lounge",
    badge: "Entertainment",
    description: "Carrom board, indoor games & sound system for corporate offsites and family games.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
  },
  {
    id: 6,
    title: "In-House Dedicated Chef Dining",
    badge: "Fresh Dining",
    description: "Freshly cooked multi-cuisine meal packages for large group celebrations.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
  },
];

const canopyCrestShowcaseImages = [
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg", title: "22x12 Ft Private Swimming Pool", tag: "Massive Pool" },
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0012.jpg", title: "Charpai Green Lawns", tag: "Multi-Acre" },
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg", title: "Spacious 4 BHK Master Suites", tag: "Capacity 20+" },
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg", title: "Outdoor Gazebo & Bonfire Pit", tag: "Evening Lounge" },
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg", title: "Indoor Games & Music Lounge", tag: "Entertainment" },
  { url: "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg", title: "In-House Gourmet Dining", tag: "Chef Service" },
];

const canopyCrestReviews = [
  {
    name: "Anand & Shweta Joshi",
    location: "Dadar, Mumbai",
    rating: 5,
    date: "Stayed July 2026",
    comment: "Massive 2-acre lawn and huge swimming pool. We hosted a family reunion of 18 people and everyone had ample bedroom space.",
    highlight: "Large Family Reunion"
  },
  {
    name: "Rahul Verma (Tech Mahindra)",
    location: "Hinjawadi, Pune",
    rating: 5,
    date: "Stayed June 2026",
    comment: "Organized our startup leadership offsite here. High-speed Wi-Fi, great indoor games, and the direct WhatsApp booking with 28% discount was seamless.",
    highlight: "Corporate Offsite"
  },
  {
    name: "Deepak Sharma",
    location: "Navi Mumbai",
    rating: 5,
    date: "Stayed May 2026",
    comment: "Hardly 1 hour drive from Mumbai via the Expressway. The mountain views and fresh barbecue by the pool made our weekend unforgettable.",
    highlight: "Quick Expressway Access"
  },
  {
    name: "Pooja Hegde",
    location: "Andheri West, Mumbai",
    rating: 5,
    date: "Stayed August 2026",
    comment: "Cleanest bathrooms, powerful air conditioning, and absolute seclusion without noisy neighbors. We are coming back every monsoon!",
    highlight: "100% Privacy"
  }
];

export const metadata: Metadata = {
  title: "Khopoli Villas | Villas in Khopoli for Groups",
  description: "Discover premier khopoli villas at Canopy Crest. Book top villas in khopoli with private pool, chef service & spacious large group villa khopoli options.",
  keywords: [
    "khopoli villas",
    "villas in khopoli",
    "large group villa khopoli"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/khopoli-villas",
  },
  openGraph: {
    title: "Khopoli Villas | Villas in Khopoli for Groups",
    description: "Discover premier khopoli villas at Canopy Crest. Book top villas in khopoli with private pool, chef service & spacious large group villa khopoli options.",
    url: "https://www.staywillas.com/khopoli-villas",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
        width: 1200,
        height: 630,
        alt: "Canopy Crest — Premier Khopoli Villas for Groups",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khopoli Villas | Villas in Khopoli for Groups",
    description: "Discover premier khopoli villas at Canopy Crest. Book top villas in khopoli with private pool, chef service & spacious large group villa khopoli options.",
    images: ["https://www.staywillas.com/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"],
  },
};

export default async function KhopoliGroupEstatePage() {
  const villa = await prisma.villa.findFirst({
    where: { slug: "canopy-crest" },
  });

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        {/* Technical SEO: Multi-Schema Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "VacationRental",
                "name": "Canopy Crest — Premier Khopoli Villas with Private Pool",
                "description": "Sprawling estate among top khopoli villas accommodating up to 20 guests. Features a private pool, charpai lawns, bonfire sit-outs, and in-house chef service. The ideal large group villa khopoli destination.",
                "url": "https://www.staywillas.com/khopoli-villas",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Khopoli",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                },
                "numberOfRooms": 4,
                "occupancy": {
                  "@type": "QuantitativeValue",
                  "maxValue": 20
                },
                "priceRange": "₹15,000 - ₹22,000"
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
                    "name": "Khopoli Villas",
                    "item": "https://www.staywillas.com/khopoli-villas"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What makes Canopy Crest unique among khopoli villas?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Canopy Crest stands out among khopoli villas with its multi-acre private estate grounds, 22ft private swimming pool, 4 master BHK suites, and in-house chef service."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why is Canopy Crest ideal for those searching for villas in khopoli?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Out of all villas in khopoli, Canopy Crest offers complete privacy, multi-acre lawns with traditional charpai lounge setups, and capacity for up to 20 guests."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do I reserve this large group villa khopoli?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can reserve this large group villa khopoli online or get an instant booking quote by messaging our Stay Willas concierge team on WhatsApp."
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
          pageName="khopoli"
          villaName="Canopy Crest (Khopoli)"
          location="Khopoli, Maharashtra"
          couponCode="KHOPOLI28"
          discountPercent={28}
          villaLink="/villa/canopy-crest"
        />

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-52 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/15 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
              alt="Canopy Crest - Premier khopoli villas with private pool"
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
              <Link href="/areas/khopoli" className="hover:text-accent-primary transition-colors">Khopoli</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Khopoli Villas</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Sprawling Multi-Acre Sanctuary
            </span>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1B3564] mb-6">
              Khopoli Villas: Private Pool Estate
            </h1>

            <p className="text-text-primary/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Experience the best of <strong className="font-semibold text-[#1B3564]">khopoli villas</strong> at <strong className="font-semibold text-[#1B3564]">Canopy Crest</strong>. If you are comparing <strong className="font-semibold text-[#1B3564]">villas in khopoli</strong> for reunions or retreats, our <strong className="font-semibold text-[#1B3564]">large group villa khopoli</strong> accommodates up to 20 guests with private pool, charpai lawns, and chef service.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xl mb-8">
              <Link 
                href="/villa/canopy-crest" 
                className="bg-white hover:bg-slate-100 border-2 border-[#1B3564]/30 text-[#1B3564] font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-md transition-all active:scale-95 text-center flex items-center gap-1.5"
              >
                <span>View Villa Gallery & Specs</span>
                <ChevronRight size={14} />
              </Link>
              <Link 
                href="/villa/canopy-crest" 
                className="bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all text-center"
              >
                Book with 28% Off
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20booking%20Canopy%20Crest%20in%20Khopoli%20with%20the%2028%%20discount%20coupon%20KHOPOLI28" 
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
                villaName="Canopy Crest (Khopoli)"
                location="Khopoli, Maharashtra"
                defaultCoupon="KHOPOLI28"
                discountPercent={28}
              />
            </div>
          </div>
        </section>

        {/* Feature Image Marquee Section (Below Hero) */}
        <VillaFeatureMarquee 
          heading="Canopy Crest — Estate Highlights" 
          subheading="Discover sprawling multi-acre private estate features among top khopoli villas for groups & offsites."
          items={canopyCrestFeatures} 
        />

        {/* Feature Grid Spotlight */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#1B3564] mb-3">
              Why Canopy Crest Stands Out Among Villas in Khopoli
            </h2>
            <p className="text-text-primary/70 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Designed for families, corporate teams, and groups looking for an exclusive large group villa khopoli retreat with complete privacy and full-service dining.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Users className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Up to 20 Guests</h3>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Trees className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Charpai Green Lawns</h3>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 flex flex-col items-center text-center space-y-2.5 sm:space-y-3 hover:shadow-md hover:border-[#DAA520]/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#1B3564]/5 group-hover:bg-[#1B3564] flex items-center justify-center transition-colors">
                <Flame className="w-6 h-6 text-accent-primary group-hover:text-[#DAA520] transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-[#1B3564] text-sm sm:text-base">Bonfire & Barbecue Deck</h3>
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
            villaSlug="canopy-crest"
            villaName="Canopy Crest"
            location="Khopoli, Maharashtra"
            originalPrice={villa?.price || 15000}
            discountedPrice={Math.round((villa?.price || 15000) * 0.72)}
            couponCode="KHOPOLI28"
            images={canopyCrestShowcaseImages}
            reviews={canopyCrestReviews}
          />
        </section>

        {/* Comprehensive Editorial Guide Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-base sm:prose-lg md:prose-xl max-w-none text-left bg-white/90 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:mt-8 sm:prose-h2:mt-12 prose-h3:text-[#1B3564] prose-h3:font-heading prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:mt-6 sm:prose-h3:mt-8 prose-a:text-accent-primary">
            
            <h2>Discover Luxury Staycations at Khopoli Villas</h2>
            <p>
              When organizing a group staycation from Mumbai or Pune, finding a property that delivers scale, privacy, and full hospitality is paramount. Out of all available <strong>khopoli villas</strong>, <strong className="font-semibold text-[#1B3564]">Canopy Crest</strong> provides an ideal balance of multi-acre open lawns, a 22ft private swimming pool, and comfortable accommodations for up to 20 guests.
            </p>
            <p>
              Located just off the Khalapur exit, this destination saves you from heavy mountain traffic while placing your group in a scenic valley retreat.
            </p>

            <h2>Why Canopy Crest is the Premier Choice for Villas in Khopoli</h2>
            <p>
              When evaluating premium <strong>villas in khopoli</strong>, Canopy Crest stands out with its 4 spacious master BHK suites, 5 bathrooms, and expansive indoor lounges. Unlike standard hotel rooms where group members are separated across different corridors, staying here keeps your entire family or team together under one roof.
            </p>
            <p>
              Traditional charpai lounge setups on manicured green lawns provide a charming outdoor environment for morning tea, casual conversations, or evening cricket matches.
            </p>

            <h2>Hosting Events at a Premier Large Group Villa Khopoli</h2>
            <p>
              Planning a corporate offsite, milestone anniversary, or family reunion requires a versatile location. Choosing a dedicated <strong>large group villa khopoli</strong> like Canopy Crest ensures your event runs effortlessly:
            </p>

            <h3>Exclusive Private Estate Amenities</h3>
            <p>
              Your group enjoys exclusive access to private swimming pools, outdoor gazebo lounges, bonfire sit-outs, and indoor games without sharing spaces with outside guests.
            </p>

            <h3>In-House Chef Dining & Customized Menus</h3>
            <p>
              Meal planning for large groups at <strong>khopoli villas</strong> is completely managed by our on-site culinary team. Enjoy hot breakfasts, live poolside barbecues, and authentic local or Jain meals cooked fresh on site.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-6 sm:my-8 space-y-3 sm:space-y-4 not-prose text-left">
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">What makes Canopy Crest unique among khopoli villas?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  Canopy Crest stands out among khopoli villas with its multi-acre private estate grounds, 22ft private swimming pool, 4 master BHK suites, and in-house chef service.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">Why is Canopy Crest ideal for those searching for villas in khopoli?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  Out of all villas in khopoli, Canopy Crest offers complete privacy, multi-acre lawns with traditional charpai lounge setups, and capacity for up to 20 guests.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#DAA520]/15">
                <h3 className="font-heading font-bold text-[#1B3564] mb-2 text-sm sm:text-base">How do I reserve this large group villa khopoli?</h3>
                <p className="text-text-primary/70 text-xs sm:text-sm font-light leading-relaxed">
                  You can reserve this large group villa khopoli online or get an instant booking quote by messaging our Stay Willas concierge team on WhatsApp.
                </p>
              </div>
            </div>

            {/* Additional CTA inside article */}
            <div className="mt-8 not-prose text-center pt-4 border-t border-slate-100">
              <Link 
                href="/villa/canopy-crest" 
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
                Estate Overview
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B3564]">
                Canopy Crest — Khopoli Villas Specification
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Users className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Max Guests</span>
                    <span className="font-bold text-xs text-[#1B3564]">Up to 20 Guests</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <BedDouble className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Bedrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">4 BHK Suites</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Bath className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Bathrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">5 Full Baths</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#DAA520]/15 flex items-center gap-2.5 sm:gap-3">
                  <Waves className="text-accent-primary w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase">Pool</span>
                    <span className="font-bold text-xs text-[#1B3564]">Large Pool</span>
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
                  <span className="text-sm line-through text-slate-400 font-medium">₹15,000</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1B3564]">₹10,800</span>
                  <span className="text-xs font-normal text-slate-500">/ night</span>
                </div>
                <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Coupon: <strong className="text-[#1B3564]">KHOPOLI28</strong>
                </span>
              </div>

              <Link 
                href="/villa/canopy-crest" 
                className="block w-full bg-[#1B3564] hover:bg-[#0F2142] active:scale-95 text-[#DAA520] hover:text-white font-black text-xs uppercase tracking-wider text-center py-3.5 rounded-xl shadow transition-all"
              >
                Claim 28% Off & Book
              </Link>

              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20Canopy%20Crest%20in%20Khopoli%20with%2028%%20Discount%20(Coupon:%20KHOPOLI28)" 
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
