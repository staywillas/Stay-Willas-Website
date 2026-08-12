import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { ChevronRight, ArrowLeft, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Luxury Villas in Lonavala with Private Pool | Stay Willas",
  description: "Explore luxury villas in Lonavala with private pool, lush greenery, and in-house chef services. Book verified lonavala villa stays near Bhushi Dam & Pawna Lake today.",
  keywords: [
    "luxury villas in lonavala",
    "villas in lonavala",
    "lonavala villa with private pool",
    "villas in lonavala with private pool",
    "villa in lonavala",
    "lonavala villa",
    "villas near lonavala",
    "lonavla villa",
    "pool villa",
    "private villa",
    "villas resort"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/lonavala",
  },
  openGraph: {
    title: "Luxury Villas in Lonavala with Private Pool | Stay Willas",
    description: "Explore luxury villas in Lonavala with private pool, lush greenery, and in-house chef services. Book verified lonavala villa stays near Bhushi Dam & Pawna Lake today.",
    url: "https://www.staywillas.com/areas/lonavala",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Luxury Villas in Lonavala with Private Pool - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas in Lonavala with Private Pool | Stay Willas",
    description: "Explore luxury villas in Lonavala with private pool, lush greenery, and in-house chef services. Book verified lonavala villa stays near Bhushi Dam & Pawna Lake today.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
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
    image: villa.images[0] || "/images/hero-villa.png",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  const signatureVilla = villas.find(v => v.id === "the-angle-house");

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        {/* Technical SEO: Multi-Schema Structured Data with Aggregate Rating */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://www.staywillas.com/#organization",
                "name": "Stay Willas",
                "url": "https://www.staywillas.com",
                "logo": "https://www.staywillas.com/icon.png",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "128",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                "name": "Stay Willas — Luxury Villas in Lonavala",
                "description": "Book luxury villas in Lonavala with Stay Willas. Featuring private pool stays, dedicated chef services, and scenic mountain views for family and group getaways.",
                "url": "https://www.staywillas.com/areas/lonavala",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Lonavala",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "18.7546",
                  "longitude": "73.4062"
                },
                "priceRange": "₹₹₹",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "128",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "amenityFeature": [
                  { "@type": "LocationFeatureSpecification", "name": "Private Pool", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Private Chef", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Super-fast Wi Fi", "value": true },
                  { "@type": "LocationFeatureSpecification", "name": "Lush Greenery Lawns", "value": true }
                ]
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
                    "name": "Lonavala",
                    "item": "https://www.staywillas.com/areas/lonavala"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How is the private pool cleaned and maintained?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Every private pool undergoes complete filtration and sanitization cycles prior to guest arrival. On-site staff perform daily water quality checks to guarantee safety and clarity."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can we request pure vegetarian or Jain catering?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Our in-house chefs cater to specific dietary requirements including pure-veg and Jain preparations using dedicated cookware and fresh ingredients."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are pets allowed at the property?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, pets are welcome. The Angle House features fully fenced lawns and safe outdoor spaces where pets can play freely."
                    }
                  }
                ]
              }
            ])
          }}
        />
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/the-angle-house/gallery-11.webp" 
              alt="Luxury private pool villa in Lonavala by StayWillas"
              fill
              priority
              className="object-cover opacity-20 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas" className="hover:text-accent-primary transition-colors">Areas</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Lonavala</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              Boutique Mountain Sanctuary
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight mb-6">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light font-normal">Lonavala</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              A scenic 2-hour drive from Mumbai and Pune. Discover our architectural sanctuary featuring dramatic glass facades, private waterfall pools, pet-friendly lawns, and tailored in-villa culinary experiences.
            </p>
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
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link 
                    href={`/villa/${signatureVilla.id}`}
                    className="flex-1 bg-[#1B3564] hover:bg-[#152A50] text-white text-xs font-bold tracking-widest uppercase text-center py-4 rounded-2xl shadow-md transition-all duration-300"
                  >
                    View Details
                  </Link>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I am interested in booking your signature villa: *${signatureVilla.name}* in Lonavala.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-[#1B3564]/30 hover:border-[#1B3564] text-[#1B3564] text-xs font-bold tracking-widest uppercase text-center py-4 rounded-2xl transition-all duration-300"
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Villa Collection Grid */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#F9F7F2]/50 border-t border-b border-[#DAA520]/10">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <span className="text-accent-secondary font-semibold tracking-[0.3em] uppercase text-[10px] mb-2 block">
              Curated Selection
            </span>
            <h3 className="text-3xl md:text-4xl font-heading text-[#1B3564]">
              Available Private Pool Sanctuaries
            </h3>
            <p className="text-text-primary/60 text-xs sm:text-sm font-light mt-3 max-w-lg mx-auto">
              Explore our handpicked range of high-end properties, offering absolute privacy and luxury.
            </p>
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
              <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
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

        {/* Narrative SEO Story with Left/Right Sidebars & Enlarged Body Typography */}
        <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT SIDEBAR: Destination Navigation & Trust Badges */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DAA520]/15">
                  <MapPin className="text-accent-primary w-5 h-5" />
                  <h3 className="font-heading font-bold text-[#1B3564] text-lg">Explore Destinations</h3>
                </div>
                <div className="space-y-2.5">
                  <Link href="/areas/lonavala" className="flex items-center justify-between p-3 rounded-2xl bg-[#1B3564] text-white font-medium text-sm transition-all shadow-md">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse" />
                      Lonavala
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-[#DAA520] text-[#1B3564] px-2.5 py-1 rounded-full">Active</span>
                  </Link>

                  <Link href="/areas/khopoli" className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1B3564] font-medium text-sm transition-all border border-[#DAA520]/15">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Khopoli
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Active</span>
                  </Link>

                  {[
                    { name: "Pawna Lake", slug: "pawna" }
                  ].map((area) => (
                    <Link key={area.slug} href={`/areas/${area.slug}`} className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white text-slate-600 font-normal text-sm transition-all border border-slate-200/60">
                      <span>{area.name}</span>
                      <span className="text-[10px] uppercase font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/60">Coming Soon</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stay Willas Guarantee Seal */}
              <div className="bg-gradient-to-br from-[#1B3564] to-[#0F2142] text-white rounded-3xl p-6 shadow-md border border-[#DAA520]/30 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#DAA520] w-7 h-7 flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">Stay Willas Guarantee</h4>
                    <p className="text-xs text-white/70">Verified Luxury & Hospitality</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-white/80 font-light pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> 100% Private Pools</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> In-House Chef Options</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> 24/7 Estate Concierge</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> Pet-Friendly Fenced Lawns</li>
                </ul>
              </div>
            </aside>

            {/* CENTER COLUMN: Main Editorial Article with Natural Typography */}
            <main className="lg:col-span-6 bg-white/95 rounded-3xl p-6 sm:p-10 md:p-12 border border-[#DAA520]/15 shadow-sm">
              <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-accent-secondary prose-h3:font-heading prose-h3:text-xl prose-a:text-accent-primary">
              <h2>The Lonavala Mountain Escape, Reimagined</h2>
              <p>
                We have all felt it: Friday afternoon in Mumbai or Pune, watching city traffic crawl while yearning for the cool, mist-laden air of the Sahyadri mountains. For travelers across western Maharashtra, escaping to the hills isn't just a leisure activity—it is a vital reset. Lonavala offers an unmatchable retreat when monsoon clouds roll over Khandala ghats and carpet the valleys in lush greenery.
              </p>
              <p>
                Whether you are searching for a serene <strong>private villa</strong>, a secluded <strong>pool villa</strong>, or an exclusive <strong>villas resort</strong> experience, booking a <strong>villa in lonavala</strong> gives your group complete independence. Unlike crowded commercial hotels, Stay Willas offers a variety of handpicked luxury estates equipped with high-speed super-fast <strong>wi fi</strong>, private infinity pools, and dedicated chef hospitality.
              </p>

              <h2>Why Choose a Private Estate Over Traditional Hotels</h2>
              <p>
                When evaluating <strong>luxury villas in lonavala</strong>, discerning travelers prioritize absolute privacy over standard resort rooms. Reserving a dedicated <strong>lonavala villa</strong> ensures your family has exclusive access to manicured lawns, sun decks, and living rooms without sharing amenities with strangers.
              </p>
              <p>
                If you are planning a weekend trip for large family groups, a <strong>lonavala villa with private pool</strong> offers ground-floor bedrooms for elderly grandparents and safe outdoor play areas for children. Waking up to panoramic mountain vistas and fresh mountain breezes makes every <strong>lonavla villa</strong> staycation truly memorable.
              </p>

              <h2>Architectural Distinction — The Angle House Spotlight</h2>
              <p>
                Waking up to misty valleys through floor-to-ceiling glass walls is an experience unmatched by ordinary stays. Our flagship estate, <Link href="/villa/the-angle-house" className="underline text-accent-primary font-bold">The Angle House</Link>, stands out among premier <strong>villas in lonavala with private pool</strong> amenities. Perched near scenic viewpoints, it features a private waterfall pool, master jacuzzi, and private chef dining options.
              </p>
              <p>
                For travelers looking for top <strong>villas in lonavala</strong>, this architectural gem features a double-height living hall surrounded by <strong>lush greenery</strong> and tranquil hill views. Guests seeking a tranquil <strong>lake view</strong> retreat or proximity to natural attractions like <strong>bhushi dam</strong> will find our location ideal for both relaxation and exploration.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/the-angle-house/gallery-3.webp" 
                  alt="The Angle House lonavala villa with private pool surrounded by lush greenery" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Milestones & Special Gatherings in the Hills</h2>
              <p>
                Finding an ideal venue for life's celebrations requires a balance of atmosphere, capacity, and freedom. Reserving <strong>villas near lonavala</strong> for birthday party events allows host families to create personalized experiences that public venues simply cannot support.
              </p>
              <p>
                Whether organizing a milestone 30th birthday, an intimate anniversary dinner under string lights, or a relaxed family reunion, choosing a <strong>private villa</strong> offers the flexibility to curate your own music, decor, and dining schedules without strict hotel curfews.
              </p>

              {/* Enhanced Key Features Summary Box for High Readability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Family & Multi-Gen Reunions</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Thoughtfully designed layouts featuring accessible ground-floor bedrooms, large common living lounges for indoor games, and secure grassy lawns for kids.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Milestone Celebrations</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Host memorable events with custom outdoor lighting setups, pool deck lounge seating, and tailored multi-course meals prepared live by on-site chefs.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Corporate Leadership Offsites</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    High-speed fiber <strong>wi fi</strong>, quiet meeting zones, and evening campfire sit-outs designed to facilitate team alignment and strategic focus.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Pet-Friendly Staycations</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Fully fenced boundary lawns surrounded by <strong>lush greenery</strong> mean your pets travel and relax right alongside you.
                  </p>
                </div>
              </div>

              <h2>In-Villa Chef Hospitality & Custom Dining</h2>
              <p>
                Culinary quality is central to an exceptional staycation. Driving through weekend town traffic or waiting for table openings at crowded restaurants can diminish your weekend rest. Our dedicated in-house culinary staff prepares freshly cooked meals right inside the estate kitchen.
              </p>
              <p>
                Guests enjoy customized menus ranging from authentic regional Maharashtrian breakfast spreads like hot Kanda Poha and Misal to poolside evening barbecues. For families with specific dietary preferences, our chefs provide dedicated pure-vegetarian and Jain meal preparations using separate kitchenware.
              </p>

              <h2>Micro-Climates & Seasonal Travel Guide</h2>
              <p>
                Lonavala's geography creates distinct micro-climates depending on elevation and location. Higher altitude neighborhoods like Tungarli enjoy cooler mountain breezes and sweeping valley views, while areas closer to Khandala offer easy access from the Mumbai-Pune Expressway.
              </p>

              <div className="my-8 overflow-hidden rounded-2xl border border-[#DAA520]/15 not-prose">
                <table className="min-w-full divide-y divide-[#DAA520]/15 text-left text-sm">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Atmosphere & Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15 bg-white">
                    <tr>
                      <td className="px-6 py-4 font-semibold">Monsoon Peak</td>
                      <td className="px-6 py-4">June – September</td>
                      <td className="px-6 py-4">Rolling fog, waterfall streams, and green hillsides near <strong>bhushi dam</strong>. Ideal for enjoying warm tea behind glass walls.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Crisp Winter</td>
                      <td className="px-6 py-4">October – February</td>
                      <td className="px-6 py-4">Cool mountain air, clear skies, outdoor barbecues on the pool deck, and evening gatherings around open fires.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Breezy Summer</td>
                      <td className="px-6 py-4">March – May</td>
                      <td className="px-6 py-4">Pleasant morning breezes and cool evening temperatures, perfect for night swims in your private <strong>pool villa</strong>.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Local Insights & Sightseeing Near Bhushi Dam & Pawna Lake</h2>
              <p>
                When taking a break from relaxing by your <strong>private villa</strong> pool, explore nearby natural attractions. Take an early morning drive to Tiger Point for sunrise vistas, visit <strong>bhushi dam</strong> for refreshing cascading waters, or trek up Lohagad Fort during the monsoon season. For tranquil waters and sunset views, Pawna Lake offers an exquisite <strong>lake view</strong> setting just a short drive away.
              </p>
              <p>
                Planning your travel times is key to a smooth journey. Leaving Mumbai or Pune by 7:30 AM on Friday lets you beat the Expressway traffic rush, arriving at your <strong>lonavala villa with private pool</strong> right in time for lunch.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/the-angle-house/gallery-4.webp" 
                  alt="Scenic mountain valley view from The Angle House in Lonavala" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Frequently Asked Questions</h2>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">How is the private pool cleaned and maintained?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Every private pool undergoes complete filtration and sanitization cycles prior to guest arrival. On-site staff perform daily water quality checks to guarantee safety and clarity.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Can we request pure vegetarian or Jain catering?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes. Our in-house chefs cater to specific dietary requirements including pure-veg and Jain preparations using dedicated cookware and fresh ingredients.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Are pets allowed at the property?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, pets are welcome. The Angle House features fully fenced lawns and safe outdoor spaces where pets can play freely.
                  </p>
                </div>
              </div>
              </article>
            </main>

            {/* RIGHT SIDEBAR: Area Villa Booking & Inquiry Panel */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              {/* Villa Booking Card */}
              <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#DAA520]/15 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-secondary">Lonavala Flagship</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Available</span>
                </div>
                
                <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-inner">
                  <Image 
                    src="/assets/villas/the-angle-house/gallery-3.webp" 
                    alt="The Angle House Lonavala" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute top-3 right-3 bg-[#1B3564]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    From ₹18,000 / night
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-xl font-bold text-[#1B3564]">The Angle House</h4>
                  <p className="text-xs text-text-primary/60 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-accent-primary" /> Lonavala, Maharashtra
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-3 rounded-2xl border border-[#DAA520]/15 text-slate-700">
                  <div>
                    <span className="block font-bold text-[#1B3564]">12-15</span>
                    <span className="text-[10px] text-slate-500">Guests</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[#1B3564]">4 BHK</span>
                    <span className="text-[10px] text-slate-500">Rooms</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[#1B3564]">Pool</span>
                    <span className="text-[10px] text-slate-500">Private</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link 
                    href="/villa/the-angle-house" 
                    className="block w-full bg-[#1B3564] hover:bg-[#0F2142] text-white text-center text-sm font-bold uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    Book This Villa
                  </Link>

                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20a%20villa%20in%20Lonavala" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-bold uppercase tracking-wider py-3 rounded-2xl shadow-sm transition-all"
                  >
                    <PhoneCall size={14} /> WhatsApp Concierge
                  </a>
                </div>
              </div>

              {/* Quick Inquiry Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-heading font-bold text-[#1B3564] text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-accent-primary" /> Check Dates & Inquiry
                </h4>
                <p className="text-xs text-slate-600 font-light">
                  Need help choosing the right villa for your dates and group size in Lonavala?
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Expected Guests</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#1B3564]">
                      <option>4 - 8 Guests</option>
                      <option>8 - 12 Guests</option>
                      <option>12 - 20+ Guests</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Destination</label>
                    <input type="text" readOnly value="Lonavala, MH" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold" />
                  </div>
                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20need%20a%20quote%20for%20a%20Lonavala%20villa" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-bold text-xs uppercase tracking-wider text-center py-3 rounded-xl transition-colors"
                  >
                    Get Instant Quote
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </section>

          {/* Internal Blog Links */}
          <div className="mt-16 p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15">
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

        {/* Bottom Navigation for SEO flow */}
        <section className="py-12 border-t border-[#DAA520]/10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary/40 mb-1">
                Explore Other Destinations
              </h4>
              <p className="text-xs text-text-primary/60 font-light">
                Discover luxury escapes in other premium areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/areas/khopoli" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Khopoli</Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

