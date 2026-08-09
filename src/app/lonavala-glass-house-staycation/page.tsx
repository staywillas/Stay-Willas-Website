import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  ChevronRight, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  Dog, 
  Utensils, 
  Sparkles, 
  Waves, 
  Users, 
  BedDouble, 
  Bath
} from "lucide-react";

import VillaFeatureMarquee, { FeatureMarqueeItem } from "@/components/villas/villa-feature-marquee";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

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

export const metadata: Metadata = {
  title: "Lonavala Villa with Pool | Best Villa in Lonavala",
  description: "Book the best villa in Lonavala. Enjoy a luxury Lonavala villa with pool featuring private chef service, jacuzzi & mountain views for your staycation.",
  keywords: [
    "lonavala villa with pool",
    "best villa in lonavala",
    "luxury villa in lonavala",
    "private pool villa in lonavala",
    "staycation villa in lonavala with pool",
    "top villa in lonavala"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/lonavala-glass-house-staycation",
  },
  openGraph: {
    title: "Lonavala Villa with Pool | Best Villa in Lonavala",
    description: "Book the best villa in Lonavala. Enjoy a luxury Lonavala villa with pool featuring private chef service, jacuzzi & mountain views for your staycation.",
    url: "https://www.staywillas.com/lonavala-glass-house-staycation",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "The Angle House - Lonavala Villa with Pool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lonavala Villa with Pool | Best Villa in Lonavala",
    description: "Book the best villa in Lonavala. Enjoy a luxury Lonavala villa with pool featuring private chef service, jacuzzi & mountain views for your staycation.",
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
                "name": "The Angle House — Premier Lonavala Villa with Pool",
                "description": "Book the best villa in Lonavala featuring a private waterfall pool, luxury villa in Lonavala amenities, master suite jacuzzi, pet-friendly lawns, and chef service.",
                "url": "https://www.staywillas.com/lonavala-glass-house-staycation",
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
                    "name": "Lonavala Villa with Pool",
                    "item": "https://www.staywillas.com/lonavala-glass-house-staycation"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Why is The Angle House considered the best villa in Lonavala?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The Angle House combines modern luxury villa in Lonavala architecture, a private waterfall pool, master suite jacuzzi, 24/7 concierge, pet-friendly lawns, and dedicated in-house chef dining."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does this Lonavala villa with pool feature private dining?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, our on-site culinary team prepares fresh multi-cuisine, vegetarian, and Jain meals tailored to your taste."
                    }
                  }
                ]
              }
            ])
          }}
        />

        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/15 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/the-angle-house/gallery-11.webp" 
              alt="The Angle House luxury Lonavala villa with pool illuminated at night"
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
              <span className="text-text-primary font-bold">Lonavala Villa with Pool</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Exclusive Private Retreat
            </span>
            <h1 className="sr-only">Luxury Lonavala Villa with Pool</h1>
            <TextGenerateEffect 
              words="Luxury Lonavala Villa with Pool"
              highlightWords={["Lonavala"]}
              className="text-4xl md:text-6xl lg:text-7xl mb-6"
            />
            <p className="text-text-primary/80 text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Discover <strong className="font-semibold text-[#1B3564]">The Angle House</strong>, widely rated as the <strong className="font-semibold text-[#1B3564]">best villa in Lonavala</strong>. Featuring a private waterfall pool, master jacuzzi, pet-friendly green lawns, and customized chef service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Link 
                href="/villa/the-angle-house" 
                className="bg-[#1B3564] hover:bg-[#0F2142] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all text-center"
              >
                View Villa Specifications
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20booking%20the%20best%20Lonavala%20villa%20with%20pool%20-%20The%20Angle%20House" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#25D366] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </section>

        {/* Feature Image Marquee Section (Below Hero) */}
        <VillaFeatureMarquee 
          heading="The Angle House — Estate Highlights" 
          subheading="Experience modern architectural luxury with private waterfall pool, jacuzzi & in-house chef service."
          items={angleHouseFeatures} 
        />

        {/* Feature Grid Spotlight */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1B3564] mb-3">
              Why We Are Voted the Best Villa in Lonavala
            </h2>
            <p className="text-text-primary/70 text-sm md:text-base font-light max-w-2xl mx-auto">
              Designed for families, pet parents, and groups seeking a luxury villa in Lonavala with absolute privacy and top-tier hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Waves className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Private Waterfall Pool</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Enjoy your own Lonavala villa with pool complete with a soothing waterfall feature, sun lounge deck, and evening mood lights.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Sparkles className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Luxury Villa Architecture</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Expansive glass panels and high ceilings make this a flagship luxury villa in Lonavala offering panoramic mountain views.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Dog className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Pet-Friendly Fenced Lawns</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Fully secure boundary fencing ensures your pets and children can play freely in safety across lush green gardens.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Utensils className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">In-House Chef Service</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Fresh gourmet meals cooked on-site by dedicated chefs, featuring authentic local dishes as well as vegetarian and Jain menus.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Preview Grid */}
        <section className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/the-angle-house/gallery-11.webp" 
                alt="Exterior view of the best villa in Lonavala illuminated at dusk" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/the-angle-house/gallery-3.webp" 
                alt="Private waterfall swimming pool deck at Lonavala villa with pool" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/the-angle-house/gallery-19.webp" 
                alt="Master suite jacuzzi bath setup at luxury villa in Lonavala" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </section>

        {/* Comprehensive Editorial Guide Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-lg md:prose-xl max-w-none text-left bg-white/90 p-8 sm:p-12 rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-a:text-accent-primary">
            <h2>Why The Angle House is the Best Villa in Lonavala for Your Staycation</h2>
            <p>
              When planning a weekend getaway from Mumbai or Pune, travelers seek privacy, comfort, and premium amenities. The Angle House has established itself as the <strong>best villa in Lonavala</strong> for discerning guests who desire an upscale private estate experience. Set in the quiet heights of Tungarli, this property combines state-of-the-art architecture with serene natural surroundings.
            </p>
            <p>
              Whether you are relaxing in the spacious living hall or enjoying a sunset swim, staying at a premier <strong>luxury villa in Lonavala</strong> ensures your family and friends experience uncompromised relaxation throughout your trip.
            </p>

            <h2>Unwind at a Premier Lonavala Villa with Pool and Waterfall</h2>
            <p>
              A major highlight of booking a <strong>Lonavala villa with pool</strong> is having absolute control over your leisure time. Unlike public resort pools with operating restrictions and crowded decks, your private waterfall pool at The Angle House is exclusively yours.
            </p>
            <p>
              Featuring temperature-filtered water, clean sun loungers, and nighttime deck lighting, guests can enjoy refreshing morning laps or serene late-night dips surrounded by misty hills.
            </p>

            <h2>Experience Modern Elegance at a Luxury Villa in Lonavala</h2>
            <p>
              As a signature <strong>luxury villa in Lonavala</strong>, The Angle House boasts 3 oversized master BHK suites with plush mattresses, split air conditioning, private balconies, and an luxurious master suite jacuzzi bath. Double-height floor-to-ceiling windows bring natural sunlight and panoramic views of the Sahyadri mountains straight into your living space.
            </p>

            <h2>Family Getaways, Milestones & Celebrations</h2>
            <p>
              Whether hosting a milestone birthday party, family reunion, or intimate gathering, booking the <strong>best villa in Lonavala</strong> provides a personalized setting impossible to replicate at standard hotels. With total capacity for up to 16 guests, spacious indoor games, and secure pet-friendly green lawns, every member of your group stays entertained and relaxed.
            </p>

            <h2>Gourmet Culinary Services: Chef-Curated Meals & Jain Kitchens</h2>
            <p>
              Dining at your private <strong>Lonavala villa with pool</strong> is completely hassle-free. Dedicated in-house culinary staff prepare hot, customized meals using fresh local ingredients. Enjoy savory Maharashtrian specialties, poolside barbecues, and specialized pure-vegetarian and Jain menus prepared in separate clean cookware.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-8 space-y-4 not-prose text-left">
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Why is The Angle House considered the best villa in Lonavala?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  The Angle House combines modern architectural design, a private waterfall pool, master suite jacuzzi, 24/7 concierge, pet-friendly lawns, and dedicated in-house chef dining.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Does this Lonavala villa with pool feature private dining?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  Yes, our on-site culinary team prepares fresh multi-cuisine, vegetarian, and Jain meals tailored to your taste.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Specs Bar & Direct Booking Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-8 md:p-12 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-left max-w-xl">
              <span className="text-accent-secondary text-xs font-bold uppercase tracking-widest block">
                Property Overview
              </span>
              <h3 className="font-heading text-3xl font-bold text-[#1B3564]">
                The Angle House — Lonavala Villa with Pool
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Users className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Capacity</span>
                    <span className="font-bold text-xs text-[#1B3564]">12-16 Guests</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <BedDouble className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Bedrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">3 BHK Suites</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Bath className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Bathrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">3 Modern Baths</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Waves className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Pool</span>
                    <span className="font-bold text-xs text-[#1B3564]">Private Waterfall</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-center">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Starting Rate</span>
                <span className="text-2xl font-bold text-[#1B3564]">₹13,000 <span className="text-xs font-normal text-slate-500">/ night</span></span>
              </div>

              <Link 
                href="/villa/the-angle-house" 
                className="block w-full bg-[#1B3564] hover:bg-[#0F2142] text-white font-bold text-xs uppercase tracking-wider text-center py-3.5 rounded-xl shadow transition-all"
              >
                Reserve Property Online
              </Link>

              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20the%20best%20Lonavala%20villa%20with%20pool" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider text-center py-3 rounded-xl transition-all"
              >
                <PhoneCall size={14} /> Quick WhatsApp Quote
              </a>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}

