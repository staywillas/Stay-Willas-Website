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
  Utensils, 
  Users, 
  BedDouble, 
  Bath, 
  Mountain, 
  Calendar, 
  Gift, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  MapPin,
  Star
} from "lucide-react";

import VillaFeatureMarquee, { FeatureMarqueeItem } from "@/components/villas/villa-feature-marquee";
import QuickMobileLeadForm from "@/components/common/quick-mobile-lead-form";
import MegaDiscountAdBanner from "@/components/common/mega-discount-ad-banner";
import AdLandingShowcase from "@/components/villas/ad-landing-showcase";

export const metadata: Metadata = {
  title: "Villas in Panchgani with Private Pool | Casa De Reva | Stay Willas",
  description: "Rent top-rated villas in Panchgani with private pool. Casa De Reva offers 4 BHK luxury suites, valley-view private swimming pool, and in-house chef from ₹16,000/night.",
  keywords: [
    "villas in panchgani with private pool",
    "villas in panchgani with pool",
    "panchgani villa with pool",
    "4 bhk villa in panchgani with private pool",
    "casa de reva panchgani",
    "luxury private pool villa panchgani",
    "private pool villa in mahabaleshwar panchgani",
    "panchgani villas for rent with pool"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/villas-in-panchgani-with-private-pool",
  },
  openGraph: {
    title: "Villas in Panchgani with Private Pool | Casa De Reva | Stay Willas",
    description: "Book verified luxury villas in Panchgani with private pool. Valley-facing infinity views, 4 BHK suites, lawn & private chef in Kaswand, Panchgani.",
    url: "https://www.staywillas.com/villas-in-panchgani-with-private-pool",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg",
        width: 1200,
        height: 630,
        alt: "Casa De Reva — Villas in Panchgani with Private Pool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Panchgani with Private Pool | Stay Willas",
    description: "Discover Casa De Reva: 4 BHK valley-view estate with private swimming pool in Panchgani from ₹16,000/night.",
    images: ["https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg"],
  },
};

const casaDeRevaFeatures: FeatureMarqueeItem[] = [
  {
    id: 1,
    title: "Private Valley-View Pool",
    badge: "Private Pool",
    description: "Panoramic swimming pool overlooking the misty green hills and Krishna Valley.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg",
  },
  {
    id: 2,
    title: "4 Master BHK Bedroom Suites",
    badge: "Group Capacity",
    description: "Accommodates up to 16 guests with private balconies and mountain outlooks.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0038.jpg",
  },
  {
    id: 3,
    title: "Private In-House Chef Service",
    badge: "Gourmet Dining",
    description: "Freshly prepared Maharashtrian, North Indian, barbecue, and pure Jain meal packages.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0039.jpg",
  },
  {
    id: 4,
    title: "Manicured Green Party Lawn",
    badge: "Outdoor Lawns",
    description: "Expansive green lawn ideal for outdoor games, yoga, and evening barbecues.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0040.jpg",
  },
  {
    id: 5,
    title: "Kaswand Serene Seclusion",
    badge: "Prime Location",
    description: "Tucked peacefully in Kaswand away from tourist traffic yet close to Sydney Point.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0041.jpg",
  },
];

const casaDeRevaShowcaseImages = [
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg", title: "Valley-Facing Private Swimming Pool", tag: "Private Pool" },
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0038.jpg", title: "Luxury Mountain-View Bedroom Suite", tag: "4 BHK Suites" },
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0039.jpg", title: "Spacious Living Room & Dining Hall", tag: "Living Lounge" },
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0040.jpg", title: "Private Landscaped Lawn & Courtyard", tag: "Outdoor Lawn" },
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0041.jpg", title: "Scenic Sunset Deck & Terracotta Balcony", tag: "Sunset Deck" },
  { url: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0042.jpg", title: "Architectural Stone & Brickwork Exterior", tag: "Architecture" },
];

const casaDeRevaReviews = [
  {
    name: "Dr. Aniruddha & Neha Patil",
    location: "Kothrud, Pune",
    rating: 5,
    date: "Stayed August 2026",
    comment: "Casa De Reva is hands down the best private pool villa in Panchgani we have ever booked. The valley view from the pool deck is majestic, especially during the morning mist. The caretaker cooked incredible Maharashtrian meals!",
    highlight: "Valley-Facing Private Pool"
  },
  {
    name: "Siddharth & Natasha Verma",
    location: "Juhu, Mumbai",
    rating: 5,
    date: "Stayed July 2026",
    comment: "Booked Casa De Reva for a 3-generation family reunion of 14 people. Ground floor bedrooms made it easy for grandparents, and kids loved the pool. Starting price of ₹16,000 for a 4 BHK is fantastic value.",
    highlight: "Spacious Family Reunion"
  },
  {
    name: "Karan Singhal",
    location: "Kalyani Nagar, Pune",
    rating: 5,
    date: "Stayed September 2026",
    comment: "We booked directly through Stay Willas WhatsApp concierge. Zero commission fees and the property was spotlessly clean upon check-in. The Kaswand location is peaceful and pristine.",
    highlight: "Direct Booking Experience"
  }
];

export const dynamic = "force-dynamic";

export default async function VillasInPanchganiWithPrivatePoolPage() {
  const basePrice = 16000;
  const discountedPrice = 16000;

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      {/* Dynamic JSON-LD SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "additionalType": "https://schema.org/VacationRental",
              "name": "Casa De Reva - Villas in Panchgani with Private Pool",
              "description": "Premium 4 BHK luxury private pool villa in Kaswand, Panchgani with valley views, private pool, and chef hospitality.",
              "url": "https://www.staywillas.com/villas-in-panchgani-with-private-pool",
              "image": "https://www.staywillas.com/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg",
              "telephone": "+91-9619042310",
              "priceRange": "₹16,000/night",
              "checkinTime": "14:00",
              "checkoutTime": "11:00",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kaswand",
                "addressLocality": "Panchgani",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 17.9040603,
                "longitude": 73.7732925
              },
              "numberOfRooms": 4,
              "numberOfBedrooms": 4,
              "numberOfBathroomsTotal": 4,
              "maximumAttendeeCapacity": 16,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": 4.9,
                "reviewCount": 28,
                "bestRating": 5,
                "worstRating": 1
              }
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
                  "name": "Areas",
                  "item": "https://www.staywillas.com/areas"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Panchgani",
                  "item": "https://www.staywillas.com/areas/panchgani"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Villas in Panchgani with Private Pool",
                  "item": "https://www.staywillas.com/villas-in-panchgani-with-private-pool"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Which is the best villa in Panchgani with private pool for families?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Casa De Reva in Kaswand, Panchgani is one of the top-rated villas in Panchgani with private pool. It offers 4 spacious BHK suites accommodating up to 16 guests, an infinity-edge private swimming pool overlooking Krishna Valley, private lawns, and in-house chef dining."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the starting price of renting a private pool villa in Panchgani?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "At Stay Willas, Casa De Reva in Panchgani starts at ₹16,000 per night for weekdays, offering exceptional value for a standalone 4 BHK private pool estate."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Casa De Reva in Panchgani provide chef service?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Casa De Reva includes dedicated on-demand culinary caretakers who prepare fresh Maharashtrian specialties, barbecue meals, and pure vegetarian or Jain dishes upon request."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How far is Casa De Reva from Panchgani market and Sydney Point?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Casa De Reva is located in Kaswand, approximately 15 minutes from Panchgani market and Table Land, offering peaceful hillside seclusion without heavy tourist traffic."
                  }
                }
              ]
            }
          ])
        }}
      />

      <Navbar />

      {/* Floating Offer Strip */}
      <MegaDiscountAdBanner 
        pageName="panchgani"
        villaName="Casa De Reva (Panchgani)"
        location="Kaswand, Panchgani"
        couponCode="Stayw26"
        discountPercent={26}
        villaLink="/villa/casa-de-reva"
        offerTitle="Hillside Escape"
        highlightText="Starting ₹16,000 • Valley View Pool"
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 md:pt-52 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/15 text-center flex flex-col items-center">
        <div className="absolute inset-0 -z-10">
          <Image 
            src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg" 
            alt="Casa De Reva - Premier villas in panchgani with private pool" 
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
            <Link href="/areas/panchgani" className="hover:text-accent-primary transition-colors">Panchgani</Link>
            <ChevronRight size={10} />
            <span className="text-text-primary font-bold">Casa De Reva</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#DAA520] text-[#1B3564] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md mb-4">
            <Mountain size={15} className="stroke-[2.5]" />
            <span>KASWAND • VALLEY VIEW ESTATE</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1B3564] mb-4">
            Villas in Panchgani with Private Pool
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-text-primary/75 max-w-2xl font-light mb-8 leading-relaxed">
            Discover <strong className="text-[#1B3564] font-semibold">Casa De Reva</strong>: an exclusive 4 BHK hillside estate in Kaswand, Panchgani. Featuring an infinity private pool overlooking Krishna Valley, manicured lawns, and personal chef hospitality from <strong className="text-[#DAA520] font-bold">₹16,000/night</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20am%20interested%20in%20booking%20Casa%20De%20Reva%20in%20Panchgani%20(₹16,000/night%20starting%20offer)"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-montserrat text-xs font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <PhoneCall size={16} />
              <span>WhatsApp Instant Booking</span>
            </a>
            <Link 
              href="/villa/casa-de-reva"
              className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] px-8 py-4 rounded-full font-montserrat text-xs font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 border border-[#DAA520]/30"
            >
              <span>Explore Casa De Reva</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Showcase Gallery */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <AdLandingShowcase 
          villaSlug="casa-de-reva"
          villaName="Casa De Reva"
          location="Kaswand, Panchgani"
          originalPrice={basePrice}
          discountedPrice={discountedPrice}
          couponCode="Stayw26"
          images={casaDeRevaShowcaseImages}
          reviews={casaDeRevaReviews}
          offerTitle="Hillside Escape"
          highlightText="Starting ₹16,000 • Valley View Pool"
        />
      </section>

      {/* Feature Marquee */}
      <VillaFeatureMarquee 
        items={casaDeRevaFeatures}
        heading="Casa De Reva Estate Highlights"
        subheading="Handcrafted luxury amenities designed for uncompromised relaxation in Panchgani"
      />

      {/* Quick Lead Form & Inclusions */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#DAA520] font-black tracking-[0.25em] uppercase text-xs block">
              The Stay Willas Panchgani Standard
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B3564]">
              Why Reserve Casa De Reva Over Crowded Panchgani Hotels?
            </h2>
            <p className="text-text-primary/70 text-sm sm:text-base leading-relaxed">
              Panchgani is famous for its crisp mountain air and panoramic valley lookouts. Traditional resorts require you to share swimming pools and dining halls with dozens of other guests. At Casa De Reva, you receive complete privacy over a standalone 4 BHK luxury estate with your personal infinity pool.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { title: "Private Valley-Facing Pool", desc: "Clean, temperature-suitable pool with uninterrupted mountain horizon views." },
                { title: "16-Guest Capacity", desc: "4 master suites with modern bathrooms, balconies, and extra bedding." },
                { title: "On-Demand Private Chef", desc: "Freshly cooked local Maharashtrian dishes, barbecue, and vegetarian menus." },
                { title: "High-Speed Wi-Fi & Power Backup", desc: "Workation-ready internet with full inverter backup for seamless stays." },
                { title: "Lush Outdoor Lawns", desc: "Manicured green lawn with outdoor seating for morning tea and sunset yoga." },
                { title: "Transparent Direct Pricing", desc: "Starts at ₹16,000/night without middleman commissions or hidden OTA markups." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-[#DAA520]/20 flex gap-3 items-start shadow-sm">
                  <CheckCircle2 size={18} className="text-[#559C24] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3564]">{item.title}</h4>
                    <p className="text-[11px] text-text-primary/60 mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DAA520]/30 shadow-xl">
              <h3 className="font-heading text-xl font-bold text-[#1B3564] mb-2 text-center">
                Check Dates & Pricing
              </h3>
              <p className="text-xs text-text-primary/60 text-center mb-6">
                Receive instant availability and best direct quotes on WhatsApp
              </p>
              <QuickMobileLeadForm villaName="Casa De Reva (Panchgani)" />
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section className="py-16 bg-bg-secondary/30 border-t border-border-subtle px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#DAA520] font-black tracking-[0.25em] uppercase text-xs block mb-2">
              Verified Guest Experiences
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B3564]">
              What Travelers Say About Our Panchgani Villa with Pool
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {casaDeRevaReviews.map((rev, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#DAA520]/20 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#DAA520] mb-3">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#559C24] uppercase tracking-wider block mb-2">
                    {rev.highlight}
                  </span>
                  <p className="text-xs text-text-primary/75 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <strong className="text-[#1B3564]">{rev.name}</strong>
                  <span className="text-text-primary/40">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long-Form SEO Content & FAQ Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <article className="prose prose-slate max-w-none text-left">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B3564]">
            Finding the Best Villas in Panchgani with Private Pool
          </h2>
          <p>
            When planning a hill station holiday in the Western Ghats of Maharashtra, discerning travelers consistently look for <strong>villas in panchgani with private pool</strong>. Whether escaping the sweltering city heat of Mumbai or embarking on a short 2-hour road trip from Pune, having an independent luxury villa with an exclusive swimming pool elevates the getaway from an ordinary hotel stay into a memorable retreat.
          </p>
          <p>
            Casa De Reva, situated in the peaceful pocket of Kaswand, provides the ultimate private experience. With 4 spacious bedrooms accommodating up to 16 guests, high-speed fiber internet, and dedicated cook hospitality, it caters effortlessly to family reunions, birthday celebrations, and corporate strategy retreats.
          </p>

          <h3 className="font-heading text-xl font-bold text-[#1B3564] mt-8">
            Frequently Asked Questions (FAQs)
          </h3>
          <div className="my-6 space-y-4 not-prose">
            <div className="bg-white p-5 rounded-2xl border border-[#DAA520]/20 shadow-sm">
              <h4 className="font-heading font-bold text-[#1B3564] text-sm mb-1">
                Which is the best villa in Panchgani with private pool for large groups?
              </h4>
              <p className="text-xs text-text-primary/70 leading-relaxed">
                Casa De Reva is widely considered the top choice for large groups up to 16 guests, featuring 4 expansive master BHK suites, large living lounges, and a private swimming pool with direct Krishna Valley views.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DAA520]/20 shadow-sm">
              <h4 className="font-heading font-bold text-[#1B3564] text-sm mb-1">
                What is the starting price for Casa De Reva in Panchgani?
              </h4>
              <p className="text-xs text-text-primary/70 leading-relaxed">
                Casa De Reva base pricing starts at ₹16,000 per night for weekdays. Weekend rates vary depending on group size and seasonality. Direct WhatsApp bookings receive complimentary bonfire setups.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DAA520]/20 shadow-sm">
              <h4 className="font-heading font-bold text-[#1B3564] text-sm mb-1">
                Are meals provided at the villa?
              </h4>
              <p className="text-xs text-text-primary/70 leading-relaxed">
                Yes, our on-site culinary caretakers prepare delicious homestyle Maharashtrian dishes, barbecue grills, and customized pure vegetarian or Jain meals with fresh local ingredients.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Direct Booking Bar */}
      <section className="py-12 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-[#1B3564] text-white p-8 md:p-12 rounded-3xl border border-[#DAA520]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[#DAA520] font-black uppercase tracking-widest text-xs block mb-2">
              Bespoke Hillside Luxury
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              Ready to Book Casa De Reva in Panchgani?
            </h3>
            <p className="text-white/70 text-xs sm:text-sm mt-2 max-w-xl">
              Starting from ₹16,000/night with zero booking fees and personalized WhatsApp concierge assistance.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a 
              href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20reserve%20Casa%20De%20Reva%20in%20Panchgani%20(Starting%20₹16,000/night)"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-emerald-700 text-white font-montserrat font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <PhoneCall size={15} />
              <span>WhatsApp Direct</span>
            </a>
            <Link 
              href="/villa/casa-de-reva"
              className="bg-[#DAA520] hover:bg-[#c4951c] text-[#1B3564] font-montserrat font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <span>View Property</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
