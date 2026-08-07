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

export const metadata: Metadata = {
  title: "Glass House Villa in Lonavala with Private Pool | Stay Willas",
  description: "Book The Angle House, a luxury villa Lonavala with private pool. Ideal lonavala villa staycation & luxury villa stays in lonavala for family & birthday party.",
  keywords: [
    "lonavala villa staycation",
    "luxury villa stays in lonavala",
    "luxury villa Lonavala with private pool",
    "villa in Lonavala for birthday party",
    "villa in Lonavala for family"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/lonavala-glass-house-staycation",
  },
  openGraph: {
    title: "Glass House Villa in Lonavala with Private Pool | Stay Willas",
    description: "Book The Angle House, a luxury villa Lonavala with private pool. Ideal lonavala villa staycation & luxury villa stays in lonavala for family & birthday party.",
    url: "https://www.staywillas.com/lonavala-glass-house-staycation",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "The Angle House Glass House Villa Lonavala with Private Pool",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glass House Villa in Lonavala with Private Pool | Stay Willas",
    description: "Book The Angle House, a luxury villa Lonavala with private pool. Ideal lonavala villa staycation & luxury villa stays in lonavala for family & birthday party.",
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
                "name": "The Angle House — Glass House Villa in Lonavala",
                "description": "Boutique 3 BHK glass house villa in Lonavala featuring a private waterfall pool, master suite jacuzzi, pet-friendly fenced lawns, and in-house chef service.",
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
                    "name": "Lonavala Glass House",
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
                    "name": "Is the villa suitable for pets?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, The Angle House features fully fenced green lawns and safe open areas where pets can play safely."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What is the total guest capacity of The Angle House?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The villa comfortably accommodates 12 to 16 guests across 3 spacious BHK master suites and additional extra bedding setups."
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
              alt="The Angle House glass facade illuminated at night in Lonavala"
              fill
              priority
              className="object-cover opacity-25 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas/lonavala" className="hover:text-accent-primary transition-colors">Lonavala</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Glass House Feature</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Architectural Flagship Retreat
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight mb-6">
              3 BHK Glass House Villa in <span className="italic text-accent-primary font-serif font-light">Lonavala</span>
            </h1>
            <p className="text-text-primary/80 text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Experience modern architectural luxury at <strong className="font-semibold text-[#1B3564]">The Angle House</strong>. Floor-to-ceiling glass walls, private waterfall pool, master suite jacuzzi, fenced pet lawns, and dedicated in-house chef dining.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Link 
                href="/villa/the-angle-house" 
                className="bg-[#1B3564] hover:bg-[#0F2142] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all text-center"
              >
                View Full Villa Specs
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20booking%20The%20Angle%20House%20Glass%20House%20in%20Lonavala" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#25D366] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall size={14} /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </section>

        {/* Feature Grid Spotlight */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1B3564] mb-3">
              Why Stay at The Angle House?
            </h2>
            <p className="text-text-primary/70 text-sm md:text-base font-light max-w-2xl mx-auto">
              Crafted specifically for families, pet parents, and groups seeking modern architectural design and absolute privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Sparkles className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Angular Glass Facade</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Double-height floor-to-ceiling glass windows allowing uninterrupted views of misty hillscapes from every room.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Waves className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Private Waterfall Pool</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Temperature-filtered private pool complete with a soothing waterfall cascade feature and sun lounge deck.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Dog className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Pet-Friendly Fenced Lawns</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Secure boundary-fenced green lawns so your furry family members can run freely and safely.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Utensils className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">In-House Chef Dining</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Fresh multi-cuisine meals cooked on site, with dedicated pure-vegetarian and Jain culinary options.
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
                alt="Glass House exterior illuminated at twilight" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/the-angle-house/gallery-3.webp" 
                alt="Private waterfall swimming pool deck" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/the-angle-house/gallery-19.webp" 
                alt="Master suite jacuzzi bath setup" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </section>

        {/* Comprehensive Editorial Guide Section (~1500 words) */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-lg md:prose-xl max-w-none text-left bg-white/90 p-8 sm:p-12 rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-a:text-accent-primary">
            <h2>Architectural Innovation at The Angle House</h2>
            <p>
              When planning a lonavala villa staycation, travelers are often met with standard suburban home layouts that feel disconnected from the surrounding landscape. The Angle House breaks that convention. Designed as a modern glass-and-steel sanctuary in the Tungarli hills, this 3 BHK property offers an immersive experience where floor-to-ceiling glass panels blur the boundaries between indoors and out.
            </p>
            <p>
              Whether watching morning fog drift across the Sahyadri mountains from the double-height living lounge or swimming in your private waterfall pool, the architecture creates an immediate sense of spaciousness and tranquility.
            </p>

            <h2>Why Private Pool Estates Elevate Your Weekend Experience</h2>
            <p>
              Reserving a luxury villa Lonavala with private pool gives guests total control over their schedule and leisure. Unlike hotel pools with restricted operating hours and crowded decks, your private pool at The Angle House features temperature-filtered water, a soothing waterfall feature, and ambient pool lighting for evening dips under the stars.
            </p>
            <p>
              Families traveling with children appreciate having a safe, clean swimming environment, while adults can relax on sun loungers on the adjacent teakwood deck without interruption.
            </p>

            <h2>Designing the Perfect Family Vacation</h2>
            <p>
              Finding a suitable villa in Lonavala for family getaways means balancing comfort across different age groups. Grandparents require accessible ground-floor bedroom suites without steep staircases, parents seek quiet corners for reading and relaxation, and children need open, safe grassy lawns to play.
            </p>
            <p>
              The Angle House accommodates up to 16 guests with ease. Its 3 spacious master BHK suites feature plush mattresses, ensuite bathrooms, and split air conditioning, while the sprawling living hall acts as a central gathering hub for board games, family storytelling, and group meals.
            </p>

            <h2>Milestone Celebrations & Intimate Event Planning</h2>
            <p>
              If you are organizing a special event, choosing a villa in Lonavala for birthday party gatherings provides a level of personalization that public venues cannot match. From milestone 30th or 50th birthdays to intimate family anniversaries, having exclusive access to a private estate lets host families design custom dining setups, curated playlist music, and themed lighting decorations.
            </p>
            <p>
              Our on-site estate staff assist with setup, food service, and cleanup, allowing hosts to focus entirely on enjoying the celebration with their guests.
            </p>

            <h2>Boutique Hospitality vs Conventional Resorts</h2>
            <p>
              When evaluating luxury villa stays in lonavala, service quality makes all the difference. Traditional resorts rely on standardized buffets and automated desk services. Stay Willas pairs architectural distinction with warm, attentive hospitality.
            </p>
            <p>
              From personalized check-ins to dedicated in-villa chefs who customize meals to your exact taste, your group experiences the warmth of home combined with the refinement of a luxury retreat.
            </p>

            <h2>Gourmet Dining: Custom Meals & Dedicated Jain Kitchens</h2>
            <p>
              Food is often the highlight of a memorable getaway. Our in-house culinary service eliminates the stress of searching for restaurants or ordering delivery. Dedicated estate chefs prepare hot, freshly cooked meals on site.
            </p>
            <p>
              Enjoy authentic regional Maharashtrian specialties, crisp evening appetizers by the pool, or multi-course dinner spreads. For families with specific dietary preferences, our culinary staff provides dedicated pure-vegetarian and Jain meal preparation using separate cookware and fresh, locally sourced ingredients.
            </p>

            <h2>Micro-Climates, Travel Tips & Weather Guide</h2>
            <p>
              Located in the quiet heights of Tungarli, The Angle House enjoys a cooler micro-climate than lower Lonavala town center. Fog frequently settles over the estate during monsoon mornings, while winter evenings bring crisp mountain air perfect for outdoor gatherings.
            </p>
            <p>
              To avoid weekend traffic along the Mumbai-Pune Expressway, we recommend departing early Friday morning (around 7:30 AM). This ensures a smooth 2-hour drive from Mumbai or Pune, arriving at the villa just as lunch is served on the terrace.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-8 space-y-4 not-prose text-left">
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Is the villa suitable for pets?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  Yes, The Angle House features fully fenced green lawns and safe open areas where pets can play safely.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">What is the total guest capacity of The Angle House?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  The villa comfortably accommodates 12 to 16 guests across 3 spacious BHK master suites and additional extra bedding setups.
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
                Property Specifications
              </span>
              <h3 className="font-heading text-3xl font-bold text-[#1B3564]">
                The Angle House — Key Details
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
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20check%20availability%20for%20The%20Angle%20House%20in%20Lonavala" 
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
