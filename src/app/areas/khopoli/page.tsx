import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { ChevronRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Khopoli Private Pool Villa | Luxury Villa in Khopoli on Rent",
  description: "Book a premium khopoli private pool villa for your next holiday. Escape to a private mountain view villa in khopoli on rent with customized chef service.",
  keywords: ["villas in khopoli", "luxury villas in khopoli", "khopoli private pool villa"],
  alternates: {
    canonical: "https://www.staywillas.com/areas/khopoli",
  },
  openGraph: {
    title: "Khopoli Private Pool Villa | Luxury Villa in Khopoli on Rent",
    description: "Book a premium khopoli private pool villa for your next holiday. Escape to a private mountain view villa in khopoli on rent with customized chef service.",
    url: "https://www.staywillas.com/areas/khopoli",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Stay Willas Luxury Villas in Khopoli",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khopoli Private Pool Villa | Luxury Villa in Khopoli on Rent",
    description: "Book a premium khopoli private pool villa for your next holiday. Escape to a private mountain view villa in khopoli on rent with customized chef service.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default async function KhopoliPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Khopoli",
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'canopy-crest' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "canopy-crest") return -1;
    if (b.slug === "canopy-crest") return 1;
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

  const signatureVilla = villas.find(v => v.id === "canopy-crest");

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Stay Willas — Khopoli Villas",
              "description": "Premium private pool villas near Imagica in Khopoli, Maharashtra. Spacious estates for corporate offsites, family weekends, and adventure getaways.",
              "url": "https://www.staywillas.com/areas/khopoli",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Khopoli",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.7830",
                "longitude": "73.3430"
              },
              "priceRange": "₹₹₹",
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "Private Pool", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Near Imagica", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Private Chef", "value": true }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                  "name": "Khopoli",
                  "item": "https://www.staywillas.com/areas/khopoli"
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Are your private estates suitable for hosting events?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, absolutely. Many of our villas in Khopoli have massive lawns and poolside bars built specifically for events. Our team can help organize catering, basic sound set-ups, and custom decorations."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a market nearby for grocery shopping?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Khopoli town has full-fledged markets within a 10-15 minute drive from our properties. However, we recommend informing our concierge of your grocery requirements beforehand so we can stock your chosen villa."
                  }
                }
              ]
            })
          }}
        />
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
              alt="Luxury private pool villa in Khopoli by StayWillas"
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
              <span className="text-text-primary font-bold">Khopoli</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              The Nature Escape
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight mb-6">
              Khopoli Private Pool Villa <span className="italic text-accent-primary font-serif font-light font-normal">Rentals</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Tucked at the base of the Sahyadri mountains, Khopoli is Maharashtra's best-kept secret for luxury nature escapes. Discover premium private pool villas hidden amidst waterfalls and lush forests.
            </p>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Canopy Crest) */}
        {signatureVilla && (
          <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="bg-[#FAF8F5]/80 backdrop-blur-md rounded-3xl border border-[#DAA520]/25 overflow-hidden flex flex-col lg:flex-row shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Image side */}
              <div className="lg:w-3/5 relative min-h-[300px] md:min-h-[450px] overflow-hidden">
                <Image 
                  src={signatureVilla.image}
                  alt="Canopy Crest Khopoli Signature Pool Villa"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-6 left-6 bg-[#1B3564] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  Signature Escape
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
                    Escape to a stunning nature sanctuary. Perched amidst the Sahyadri mountains, this villa offers a spectacular private pool, sprawling green layout, five-star hospitality services, and ultimate seclusion.
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
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I am interested in booking your signature villa: *${signatureVilla.name}* in Khopoli.`)}`}
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
                 <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Khopoli inventory.</p>
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

        {/* Narrative SEO Story (Single-column layout, expanded to ~2000 words in structured manner) */}
        <section className="py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-invert prose-p:text-text-primary/75 prose-p:text-base prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-accent-secondary prose-h3:font-heading prose-h3:text-xl prose-a:text-accent-primary">
              <h2>The Undiscovered Charm of a Khopoli Private Pool Villa</h2>
              <p>
                When people think of driving out of Mumbai on the expressway, Lonavala is usually the default answer. But right before you begin the steep climb up the ghats, sitting quietly at the base of the majestic Sahyadri mountain range, is Khopoli. If you want to escape the crowded commercial areas, choosing a <strong>khopoli private pool villa</strong> is a refreshing alternative. Exploring luxury holiday options by finding a premium <strong>villa in khopoli on rent</strong> allows you to connect with nature without distraction.
              </p>
              <p>
                Why? Because it offers something increasingly rare: untouched nature. The deep valleys here catch the heavy monsoon clouds, creating seasonal waterfalls that flow right through the backyards of some of our most exclusive holiday homes. If you want the dramatic views of the mountains without the tourist traffic jams of the more famous hill stations, renting spacious vacation rentals is the smartest decision you can make for your next weekend getaway.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg" 
                  alt="Luxury private pool villa in Khopoli by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Why Choose a Khopoli Private Pool Villa?</h2>
              <p>
                Khopoli gets warmer than the hill stations above it during the summer months, which makes it the absolute perfect location for a pool villa. There is a distinct joy in jumping into a massive, crystal-clear pool when you rent private exclusive villas. If you are specifically searching for a relaxing staycation, the premium villa properties offer uncompromised space, absolute privacy, and scenic mountain backdrops. You can read details about our premium <Link href="/villa/canopy-crest" className="underline text-accent-primary font-bold">Canopy Crest</Link> villa online.
              </p>
              <p>
                Our private getaway rentals are massive. Because land here is slightly more abundant than up in the hills, these properties tend to feature sprawling lawns, huge outdoor gazebos, and enormous living spaces. This makes our private estates incredibly popular for group stays. The homes are designed to let the outside in, with massive floor-to-ceiling glass windows that ensure you're always connected to the natural landscape when staying at our luxury properties.
              </p>

              <div className="my-10 border-l-4 border-accent-primary bg-[#FAF8F5] p-6 rounded-r-2xl text-left">
                <p className="text-[#1B3564] font-serif italic text-lg leading-relaxed mb-2">
                  "Khopoli offers a unique climate and massive plots, allowing for expansive villa layouts that let you experience nature from your doorstep."
                </p>
                <span className="text-[10px] tracking-wider uppercase font-bold text-accent-secondary">- Stay Willas Concierge</span>
              </div>

              <h2>Seasonality & Weather Guide for premium retreats</h2>
              <p>
                Before scheduling your stay, it is helpful to understand how Khopoli's seasonal dynamics affect the surrounding landscape. Monsoons bring spectacular greenery, while summers are perfect for pool lounging at our holiday homes. We suggest planning ahead because peak dates for luxury vacation rentals fill up fast.
              </p>

              <div className="my-8 overflow-hidden rounded-2xl border border-[#DAA520]/15 not-prose">
                <table className="min-w-full divide-y divide-[#DAA520]/15 text-left text-sm">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Landscape & Vibe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15 bg-white">
                    <tr>
                      <td className="px-6 py-4 font-semibold">Monsoon Splendor</td>
                      <td className="px-6 py-4">June to September</td>
                      <td className="px-6 py-4">Heavy tropical downpours. Waterfalls spring up across the hills. Pool sessions are incredibly scenic at our private sanctuaries.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Mild Winter</td>
                      <td className="px-6 py-4">October to February</td>
                      <td className="px-6 py-4">Cool and comfortable mornings. Ideal for visiting Adlabs Imagica and organizing outdoor barbecue parties at our exclusive villas.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Summertime Pool Chill</td>
                      <td className="px-6 py-4">March to May</td>
                      <td className="px-6 py-4">Warm afternoons. Perfect season to book private villa properties and take refreshing midnight dips.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>The Proximity Advantage of getaway rentals</h3>
              <p>
                Perhaps the best part about choosing a holiday in private estates is the travel time. You don't have to navigate the winding ghat roads, which can be a blessing if you have elderly family members or children. You simply cruise down the Mumbai-Pune Expressway, take the Khalapur toll exit, and within 15 minutes, you are pulling into the driveway of your private sanctuary. Renting a villa here cuts your travel time by almost 45 minutes compared to driving all the way up to Lonavala.
              </p>
              <p>
                This easy drive makes Khopoli the absolute perfect choice for short weekend getaways. You get to spend more time swimming in your private pool and less time stuck in highway traffic when you choose our luxury pool retreats. Feel free to browse our <Link href="/areas" className="underline text-accent-primary font-bold">other holiday locations</Link> also.
              </p>

              <h2>Things to Do Around Your Villas in Khopoli</h2>
              <p>
                While the point of a luxury staycation is to do absolutely nothing, the region around our properties offers some brilliant nearby attractions if your group gets restless.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Adlabs Imagica</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    One of India's biggest theme parks is right here. Many of our guests rent our properties as a basecamp, spending the day riding coasters and returning to their private pool.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Zenith Waterfall</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    During the monsoons, this is a spectacular sight. A short trek will take you to this massive cascade of water, located close to several of our estates.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Ghat Viewpoints</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    You are just a 20-minute drive from the famous viewpoints of Khandala if you want to catch the sunset from the top of the mountains near our estates.
                  </p>
                </div>
              </div>

              <h2>Booking Your Khopoli Private Pool Villa Escape</h2>
              <p>
                When browsing our inventory, pay attention to the amenities that suit your group. If you're coming with a large group of friends to celebrate, you can rent party-friendly villas equipped with outdoor barbecue pits, massive music systems, and poolside bars.
              </p>
              <p>
                If it's a quiet family retreat, we have beautiful farmhouses surrounded by mango orchards. We also offer options for teams searching for a corporate retreat to run collaborative offsites. Whatever your vibe, you'll find the perfect escape. Browse our curated selection of luxury properties below, select your dates, and let our concierge team handle the rest.
              </p>

              <h2>Curated 2-Day Luxury Itinerary</h2>
              <p>
                If you are planning your upcoming weekend trip, here is a structured timeline suggesting how to spend it at our premium properties:
              </p>

              <div className="my-10 space-y-6 not-prose">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 flex-1">
                    <h5 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Day 1: Arrival & Oasis Chill</h5>
                    <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                      Check-in at your private pool estate at 1:00 PM. Enjoy a heavy lunch with local Konkani flavors. Relax in the massive lawns of your choice of Villas in Khopoli or jump into the private pool. In the evening, arrange a customized bonfire session at your luxury retreat.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 flex-1">
                    <h5 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Day 2: Theme Park Thrills or Waterfall Hikes</h5>
                    <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                      If traveling during the monsoon, take an early trek to Zenith Waterfall. For families, plan a full day at Adlabs Imagica theme park, which is just 10 minutes away from our Villas in Khopoli. Return to your estate for a relaxing hot bath, followed by a chef-prepared dinner.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Frequently Asked Questions About Staying in Khopoli</h2>
              <p>
                We have compiled the most common queries from travelers planning their luxury retreats in our Villas in Khopoli:
              </p>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Are your private estates suitable for hosting events?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, absolutely. Many of our Villas in Khopoli have massive lawns and poolside bars built specifically for events. Our team can help organize catering, basic sound set-ups, and custom decorations.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Is there a market nearby for grocery shopping?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, Khopoli town has full-fledged markets within a 10-15 minute drive from our properties. However, we recommend informing our concierge of your grocery requirements beforehand so we can stock your chosen villa.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Internal Blog Links */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15">
            <h3 className="text-lg font-heading text-[#1B3564] font-bold mb-4">Related Guides</h3>
            <ul className="space-y-3 text-sm text-slate-700 font-light">
              <li>→ <Link href="/blog/khopoli-vs-lonavala-villa-comparison" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Khopoli vs Lonavala Villa Comparison: Valley Views or Quiet Sanctuary?</Link></li>
              <li>→ <Link href="/blog/khopoli-waterfall-monsoon-villa-guide" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Khopoli Waterfall & Monsoon Villa Guide</Link></li>
              <li>→ <Link href="/blog/best-khopoli-villa-for-large-groups" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Best Khopoli Villa for Large Groups & Corporate Offsites</Link></li>
              <li>→ <Link href="/blog/corporate-offsite-checklist-for-a-khopoli-villa" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Corporate Offsite Checklist for a Khopoli Villa</Link></li>
              <li>→ <Link href="/blog/things-to-do-near-adlabs-imagica-khopoli" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Things to Do Near Adlabs Imagica, Khopoli</Link></li>
            </ul>
          </div>
        </section>

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
              <Link href="/areas/lonavala" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Lonavala</Link>
              <Link href="/areas/alibaug" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Alibaug</Link>
              <Link href="/areas/karjat" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Karjat</Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
