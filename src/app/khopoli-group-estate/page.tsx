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
  Utensils, 
  Waves, 
  Users, 
  BedDouble, 
  Bath,
  Flame,
  Gamepad2,
  Trees
} from "lucide-react";
import VillaFeatureMarquee, { FeatureMarqueeItem } from "@/components/villas/villa-feature-marquee";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

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

export const metadata: Metadata = {
  title: "4 BHK Large Group Villa in Khopoli | Stay Willas",
  description: "Book Canopy Crest for a khopoli villa staycation. A weekend getaway villa Khopoli for corporate offsite villa Khopoli & large group villa khopoli.",
  keywords: [
    "khopoli villa staycation",
    "weekend getaway villa Khopoli",
    "corporate offsite villa Khopoli",
    "large group villa khopoli"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/khopoli-group-estate",
  },
  openGraph: {
    title: "4 BHK Large Group Villa in Khopoli | Stay Willas",
    description: "Book Canopy Crest for a khopoli villa staycation. A weekend getaway villa Khopoli for corporate offsite villa Khopoli & large group villa khopoli.",
    url: "https://www.staywillas.com/khopoli-group-estate",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
        width: 1200,
        height: 630,
        alt: "Canopy Crest 4 BHK Large Group Villa in Khopoli",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "4 BHK Large Group Villa in Khopoli | Stay Willas",
    description: "Book Canopy Crest for a khopoli villa staycation. A weekend getaway villa Khopoli for corporate offsite villa Khopoli & large group villa khopoli.",
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
                "name": "Canopy Crest — 4 BHK Private Pool Estate in Khopoli",
                "description": "Sprawling 4 BHK estate in Khopoli accommodating up to 20 guests. Features a private pool, extensive charpai lawns, outdoor bonfire setups, and in-house chef dining.",
                "url": "https://www.staywillas.com/khopoli-group-estate",
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
                    "name": "Khopoli Group Estate",
                    "item": "https://www.staywillas.com/khopoli-group-estate"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is the maximum guest capacity at Canopy Crest?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Canopy Crest accommodates up to 20 guests across 4 spacious BHK master suites with extra bedding arrangements."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are pets allowed at Canopy Crest?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, pets are welcome to enjoy the sprawling fenced lawns and open estate spaces."
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
              src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
              alt="Canopy Crest sprawling estate lawn and private pool in Khopoli"
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
              <Link href="/areas/khopoli" className="hover:text-accent-primary transition-colors">Khopoli</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Group Estate Feature</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Sprawling Multi-Acre Sanctuary
            </span>
            <h1 className="sr-only">4 BHK Private Pool Estate in Khopoli</h1>
            <TextGenerateEffect 
              words="4 BHK Private Pool Estate in Khopoli"
              highlightWords={["Khopoli"]}
              className="text-4xl md:text-6xl lg:text-7xl mb-6"
            />
            <p className="text-text-primary/80 text-base md:text-lg leading-relaxed max-w-2xl font-light mb-8">
              Designed for large family reunions, milestone celebrations & corporate offsites at <strong className="font-semibold text-[#1B3564]">Canopy Crest</strong>. Accommodates up to 20 guests with 4 master BHK suites, 5 bathrooms, private pool & charpai lawns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Link 
                href="/villa/canopy-crest" 
                className="bg-[#1B3564] hover:bg-[#0F2142] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg transition-all text-center"
              >
                View Full Estate Specs
              </Link>
              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I'm%20interested%20in%20booking%20Canopy%20Crest%20Group%20Estate%20in%20Khopoli" 
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
          heading="Canopy Crest — Estate Highlights" 
          subheading="Discover sprawling multi-acre private estate features in Khopoli for large groups & offsites."
          items={canopyCrestFeatures} 
        />

        {/* Feature Grid Spotlight */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1B3564] mb-3">
              Built for Unforgettable Group Gatherings
            </h2>
            <p className="text-text-primary/70 text-sm md:text-base font-light max-w-2xl mx-auto">
              Skip cramped hotel rooms. Canopy Crest provides the space, privacy, and full-service hospitality your group needs to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Users className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Up to 20 Guests</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                4 expansive BHK suites and 5 ensuite bathrooms designed to comfortably house large multi-generational groups.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Trees className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Charpai Green Lawns</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Manicured lawns featuring traditional charpai lounge setups overlooking panoramic valley horizons.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Flame className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Bonfire & Barbecue Deck</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Cozy evening outdoor bonfire pit and poolside barbecue grill for late-night stargazing gatherings.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 space-y-4 hover:shadow-md transition-shadow">
              <Utensils className="w-8 h-8 text-accent-primary" />
              <h3 className="font-heading font-bold text-[#1B3564] text-lg">Full In-House Chef Service</h3>
              <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                Dedicated on-site culinary team serving fresh group buffets, live barbecues, and Jain meals on request.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Preview Grid */}
        <section className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
                alt="Canopy Crest private pool and lawn in Khopoli" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg" 
                alt="Spacious living hall for group gatherings" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="relative h-72 rounded-3xl overflow-hidden shadow-md group">
              <Image 
                src="/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg" 
                alt="Mountain backdrop and open site view" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </section>

        {/* Comprehensive Editorial Guide Section (~1500 words) */}
        <section className="py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <article className="prose prose-lg md:prose-xl max-w-none text-left bg-white/90 p-8 sm:p-12 rounded-3xl border border-[#DAA520]/20 shadow-sm prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-a:text-accent-primary">
            <h2>The Canopy Crest Estate Experience</h2>
            <p>
              When planning a khopoli villa staycation for a sizable gathering, finding a home that combines spacious living, luxury amenities, and complete privacy can be challenging. Canopy Crest was built specifically to solve that problem. Nestled in a quiet valley corner off the Khalapur exit, this sprawling 4 BHK / 5 bath estate comfortably houses up to 20 guests.
            </p>
            <p>
              From expansive private swimming pools to manicured charpai green lawns and outdoor bonfire sit-outs, every aspect of the property is crafted for shared memories and genuine relaxation.
            </p>

            <h2>Why Canopy Crest is the Premier Large Group Choice</h2>
            <p>
              Booking a large group villa khopoli retreat requires thoughtful room design. Canopy Crest features 4 master BHK suites with ensuite bathrooms, ensuring privacy for couples and families, while large common living rooms and dining verandas keep everyone connected.
            </p>
            <p>
              Instead of splitting a big group across disconnected hotel floors, everyone stays together under one roof. Children have safe lawns for outdoor games, while adults can relax by the pool or enjoy evening conversation on the shaded veranda.
            </p>

            <h2>Hosting Productive Corporate Leadership Offsites</h2>
            <p>
              Choosing a corporate offsite villa Khopoli location gives business leadership teams an ideal environment for strategic alignment. Unlike sterile city hotel conference centers, Canopy Crest offers quiet indoor lounges with high-speed fiber internet for presentations and brain-storming sessions.
            </p>
            <p>
              During breaks, teams step out onto open lawns or take poolside breaks to recharge. In the evenings, our on-site team sets up a cozy outdoor bonfire and live barbecue grill, creating an informal environment for team bonding.
            </p>

            <h2>The Convenience of a Fast Weekend Escape</h2>
            <p>
              Selecting a weekend getaway villa Khopoli destination means saving valuable travel time. By bypassing the heavy traffic delays of the Khandala ghat ascent, guests arrive at Canopy Crest within 15 minutes of taking the Khalapur Expressway toll exit.
            </p>
            <p>
              This easy access makes a 2-night weekend stay feel significantly longer, maximizing your relaxation time in the pool and lawns.
            </p>

            <h2>In-Villa Catering: Chef-Prepared Buffets & Jain Kitchens</h2>
            <p>
              Managing meals for 15 to 20 guests can be complex. At Canopy Crest, our dedicated in-house culinary staff takes care of everything. Freshly prepared multi-cuisine buffets are served directly in the estate dining pavilion.
            </p>
            <p>
              From morning Maharashtrian breakfast spreads like Misal Pav and Poha to live evening barbecues and customized pure-vegetarian or Jain menus, meals are prepared on site using fresh, quality ingredients and separate cookware.
            </p>

            <h2>Weather & Local Attractions</h2>
            <p>
              Khopoli enjoys pleasant weather year-round, with dramatic monsoon waterfalls from June through September, crisp winter air from October through February, and sunny pool weather during summer months.
            </p>
            <p>
              If your group wishes to venture off the estate, Imagicaa Theme Park is just 10 minutes away, while the scenic Zenith Waterfalls offer fantastic monsoon hiking opportunities.
            </p>

            <h2>Frequently Asked Questions</h2>
            <div className="my-8 space-y-4 not-prose text-left">
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">What is the maximum guest capacity at Canopy Crest?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  Canopy Crest accommodates up to 20 guests across 4 spacious BHK master suites with extra bedding arrangements.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Are pets allowed at Canopy Crest?</h4>
                <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                  Yes, pets are welcome to enjoy the sprawling fenced lawns and open estate spaces.
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
                Estate Specifications
              </span>
              <h3 className="font-heading text-3xl font-bold text-[#1B3564]">
                Canopy Crest — Group Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Users className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Max Guests</span>
                    <span className="font-bold text-xs text-[#1B3564]">Up to 20 Guests</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <BedDouble className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Bedrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">4 BHK Suites</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Bath className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Bathrooms</span>
                    <span className="font-bold text-xs text-[#1B3564]">5 Full Baths</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#DAA520]/15 flex items-center gap-3">
                  <Waves className="text-accent-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Pool</span>
                    <span className="font-bold text-xs text-[#1B3564]">Large Swimming Pool</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 text-center">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Starting Rate</span>
                <span className="text-2xl font-bold text-[#1B3564]">₹15,000 <span className="text-xs font-normal text-slate-500">/ night</span></span>
              </div>

              <Link 
                href="/villa/canopy-crest" 
                className="block w-full bg-[#1B3564] hover:bg-[#0F2142] text-white font-bold text-xs uppercase tracking-wider text-center py-3.5 rounded-xl shadow transition-all"
              >
                Reserve Property Online
              </Link>

              <a 
                href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20get%20a%20group%20quote%20for%20Canopy%20Crest%20in%20Khopoli" 
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
