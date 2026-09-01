"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Users, 
  Waves, 
  ArrowUpRight,
  ShieldCheck,
  Utensils
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const locationModules = [
  {
    location: "Lonavala",
    primaryKeyword: "Villas in Lonavala with Private Pool",
    slug: "/areas/lonavala",
    featuredVilla: "The Angle House",
    villaSlug: "/villa/the-angle-house",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    travelTime: "2 – 2.5 Hours from Mumbai • 1.5 – 2 Hours from Pune",
    bestFor: "Family Getaways, Birthday Celebrations & Large Group Stays",
    insights: [
      "Exclusive Waterfall Pool & Master Jacuzzi: Relax in a private waterfall-fed swimming pool with glass architecture framing Sahyadri mountain cloud cover.",
      "Dedicated On-Site Culinary Team: Enjoy hot freshly made pakodas, Maharashtrian delicacies, and custom barbecue grills prepared in your private villa kitchen.",
      "100% Pet-Friendly Secure Lawns: Fully fenced, manicured green turf allows your pets to play freely and safely.",
      "Direct Road Connectivity: Effortless highway access via the Mumbai-Pune Expressway without bumpy interior roads."
    ],
    highlightText: "Planning a large reunion? Explore our specialized",
    groupLink: true
  },
  {
    location: "Khopoli",
    primaryKeyword: "Villas in Khopoli for Family Stays",
    slug: "/areas/khopoli",
    featuredVilla: "Canopy Crest",
    villaSlug: "/villa/canopy-crest",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    travelTime: "1.5 – 2 Hours from Mumbai • 2 – 2.5 Hours from Pune",
    bestFor: "Multi-Generational Families & Imagicaa Theme Park Trips",
    insights: [
      "15 Minutes to Imagicaa Theme Park: Spend a thrilling day on rollercoasters and water slides, then retreat to complete mountain tranquility.",
      "Spacious 4 BHK Layout for 16 Guests: Single expansive private estate where all family members stay together with complete privacy.",
      "Massive 22ft Swimming Pool & Open Lawn: Ideal for poolside evening dinners, outdoor cricket, and family badminton matches.",
      "No Ghat Driving Required: Situated right at the foothills of the Western Ghats, avoiding heavy weekend monsoon ghat jams."
    ],
    highlightText: "Plan your family weekend escape with",
    groupLink: false
  },
  {
    location: "Kurwande / Lakeside",
    primaryKeyword: "A-Frame Cottages in Lonavala with Jacuzzi",
    slug: "/areas/lonavala",
    featuredVilla: "Willow Peak",
    villaSlug: "/villa/willow-peak",
    image: "/assets/villas/willow-peak/main.webp",
    travelTime: "2 – 2.5 Hours from Mumbai • 1.5 – 2 Hours from Pune",
    bestFor: "Couples, Anniversaries & Intimate Weekend Getaways",
    insights: [
      "Private En-Suite Heated Jacuzzi: Every standalone wooden chalet features a temperature-controlled bubble jacuzzi bath.",
      "Proximity to Scenic Lakes & Viewpoints: Located in peaceful Kurwande near Lion's Point, Tiger's Leap, and Pawna Lake streams.",
      "Flexible Booking Options: Book 1 single A-frame chalet suite for 2–4 guests, or reserve all 3 chalets for an intimate private estate of up to 12 guests.",
      "Artisanal Hill Hospitality: Candlelight garden dining, bonfire setups under starry skies, and customized Jain meal options on demand."
    ],
    highlightText: "Discover serene hillside living and book",
    groupLink: false
  },
  {
    location: "Mahabaleshwar",
    primaryKeyword: "Private Villas in Mahabaleshwar with Mountain View",
    slug: "/areas/mahabaleshwar",
    featuredVilla: "Terra Cotta Villa",
    villaSlug: "/villa/terra-cotta-villa",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    travelTime: "4.5 – 5.5 Hours from Mumbai • 2.5 – 3 Hours from Pune",
    bestFor: "Strawberry Orchard Tours, Cool Highlands & Quiet Rejuvenation",
    insights: [
      "Rustic Terracotta Architecture: High ceilings, exposed brick textures, and modern luxury furnishings that blend seamlessly into the green hills.",
      "Private Swimming Pool & Balcony Decks: Marvel at misty valley sunrises and strawberry plantations directly from your bedroom balcony.",
      "Immaculate Luxury Bathrooms: 4 spacious en-suite bathrooms equipped with premium fixtures, high-pressure hot water, and toiletries.",
      "Authentic Highland Cuisine: Farm-fresh local Maharashtrian thalis and seasonal strawberry desserts prepared by dedicated caretakers."
    ],
    highlightText: "Experience slow highland living and reserve",
    groupLink: false
  }
];

const faqs: FAQItem[] = [
  {
    question: "What makes Stay Willas the top choice for private villas near Mumbai?",
    answer: "Stay Willas provides handpicked private pool villas near Mumbai featuring crystal-clear swimming pools, bespoke architecture, lush green lawns, and dedicated in-house chef services for unmatched privacy and relaxation."
  },
  {
    question: "Why choose a private villa stay over a hotel?",
    answer: "Our private villa stays offer total seclusion, private swimming pools, mountain valley views, master suite jacuzzis, dedicated concierge support, and pet-friendly fenced grounds without sharing amenities with strangers."
  },
  {
    question: "How far are your weekend villas from Mumbai and Pune?",
    answer: "Our holiday villas in Lonavala and Khopoli are located within a scenic 90-minute to 2-hour drive via the Expressway, while our Mahabaleshwar estate offers a serene highland escape without long, exhausting travel."
  },
  {
    question: "Are your private villas near Mumbai pet-friendly?",
    answer: "Yes, our private estates feature secure, fully fenced lawns and safe open layouts designed so your pets can run freely while you relax by the pool."
  },
  {
    question: "Do your private pool retreats include in-house chef dining?",
    answer: "Yes, our private villa retreats offer customized culinary services with on-site chefs who prepare fresh multi-cuisine spreads, local Maharashtrian dishes, poolside barbecues, and dedicated Jain meals."
  },
  {
    question: "How do I book a private villa stay with Stay Willas?",
    answer: "You can easily browse real-time availability and book your stay directly through our website or connect with our Stay Willas concierge team on WhatsApp for custom quotes."
  }
];

export default function SEOContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-24 bg-white border-t border-[#DAA520]/20 text-charcoal relative overflow-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3564]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Main Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-[#DAA520] font-bold tracking-[0.25em] uppercase text-xs mb-3 inline-flex items-center gap-1.5 bg-[#DAA520]/15 px-4 py-1.5 rounded-full border border-[#DAA520]/25">
            <Sparkles size={13} className="text-[#DAA520]" /> Destination Insights & Regional Guide
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-[#1B3564] leading-tight mt-2 font-normal tracking-wide">
            Curated Weekend Stays <span className="italic text-[#DAA520]">Near Mumbai & Pune</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            Planning a private staycation? Here is everything you need to know about Maharashtra&apos;s top hill destinations, driving routes, property highlights, and guest insights.
          </p>
        </div>

        {/* 4 Location Modules with Keyword Optimization, Images & Points */}
        <div className="space-y-12 md:space-y-16 mb-24">
          {locationModules.map((item, idx) => (
            <motion.div
              key={item.location}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-[32px] overflow-hidden p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                
                {/* Visual Image Card (5 Cols) */}
                <div className={`lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#DAA520]/30 group ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <Image
                    src={item.image}
                    alt={`${item.primaryKeyword} - ${item.featuredVilla}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  
                  {/* Image Overlays */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 bg-[#1B3564]/90 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
                      <MapPin size={11} className="text-[#DAA520]" />
                      {item.location}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
                    <div>
                      <p className="text-[11px] font-medium text-[#DAA520] uppercase tracking-widest">Featured Stay</p>
                      <h4 className="text-lg font-heading font-bold text-white">{item.featuredVilla}</h4>
                    </div>
                    <Link
                      href={item.villaSlug}
                      className="w-9 h-9 rounded-full bg-[#DAA520] hover:bg-white text-[#1B3564] flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110"
                    >
                      <ArrowUpRight size={16} className="stroke-[2.5]" />
                    </Link>
                  </div>
                </div>

                {/* Structured Text & Points (7 Cols) */}
                <div className={`lg:col-span-7 text-left flex flex-col justify-between ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  
                  {/* Keyword-Rich Heading */}
                  <div>
                    <span className="text-[10px] font-extrabold text-[#DAA520] uppercase tracking-[0.2em] mb-1.5 block">
                      Destination Spotlight • {item.location}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-heading text-[#1B3564] font-bold mb-3 leading-tight">
                      <Link href={item.slug} className="hover:text-[#DAA520] transition-colors">
                        {item.primaryKeyword}
                      </Link>
                    </h3>

                    {/* Quick Meta Chips */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                        <Clock size={12} className="text-[#DAA520]" />
                        {item.travelTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                        <Users size={12} className="text-[#DAA520]" />
                        {item.bestFor}
                      </span>
                    </div>

                    {/* Bullet Points with Meaningful Insights */}
                    <ul className="space-y-3 mb-6">
                      {item.insights.map((point, pIdx) => {
                        const [title, desc] = point.split(": ");
                        return (
                          <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            <CheckCircle2 size={16} className="text-[#559C24] shrink-0 mt-0.5" />
                            <span>
                              <strong className="font-bold text-[#1B3564]">{title}: </strong>
                              {desc}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Contextual Links */}
                  <div className="pt-4 border-t border-[#DAA520]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <p className="text-slate-600 font-medium">
                      {item.highlightText}{" "}
                      {item.groupLink ? (
                        <>
                          <Link href="/escape" className="text-[#1B3564] font-bold underline hover:text-[#DAA520] transition-colors">
                            villas for groups in Lonavala
                          </Link>
                          {", reserve "}
                        </>
                      ) : null}
                      <Link href={item.villaSlug} className="text-[#1B3564] font-bold underline hover:text-[#DAA520] transition-colors">
                        {item.featuredVilla}
                      </Link>{" "}
                      or view all{" "}
                      <Link href={item.slug} className="text-[#1B3564] font-bold underline hover:text-[#DAA520] transition-colors">
                        villas in {item.location}
                      </Link>.
                    </p>

                    <Link
                      href={item.slug}
                      className="inline-flex items-center gap-1 text-[#DAA520] hover:text-[#1B3564] font-black uppercase tracking-wider text-[11px] transition-colors"
                    >
                      <span>Explore Area Guide</span>
                      <ArrowUpRight size={13} className="stroke-[2.5]" />
                    </Link>
                  </div>

                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Pillars of Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            { 
              icon: ShieldCheck, 
              title: "100% Handpicked & Verified", 
              desc: "Every villa is inspected in person to guarantee cleanliness, swimming pool hygiene, and 5-star amenities." 
            },
            { 
              icon: Utensils, 
              title: "Dedicated Chef Services", 
              desc: "Customized multi-cuisine spreads, local Maharashtrian dishes, poolside barbecues, and Jain meals made to order." 
            },
            { 
              icon: MapPin, 
              title: "Scenic 90-Min Drives", 
              desc: "Private hillside sanctuaries located within an effortless drive from Mumbai and Pune via the Expressway." 
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 text-left hover:border-[#DAA520]/60 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] mb-4">
                <pillar.icon size={20} />
              </div>
              <h4 className="font-bold text-[#1B3564] text-sm uppercase tracking-wider mb-2">{pillar.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-[#DAA520]/20 pt-16">
          <div className="text-center mb-12">
            <span className="text-[#DAA520] font-bold tracking-[0.25em] uppercase text-[10px] block mb-2">FAQ Guide</span>
            <h3 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold">Frequently Asked Questions</h3>
            <div className="h-[2px] w-12 bg-[#DAA520] mx-auto mt-4" />
          </div>

          <div className="space-y-4 max-w-4xl mx-auto text-left">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#FAF8F5] border border-[#DAA520]/20 hover:border-[#DAA520]/40 rounded-3xl overflow-hidden transition-colors shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-heading text-sm md:text-base text-[#1B3564] font-bold focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle size={18} className="text-[#DAA520] shrink-0" />
                      {faq.question}
                    </span>
                    <span className="ml-4 shrink-0 w-8 h-8 rounded-full border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] bg-white">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-slate-700 font-light leading-relaxed border-t border-[#DAA520]/10 mt-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
