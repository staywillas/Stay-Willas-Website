import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { 
  Sparkles, Award, Heart, Cake, Users, Waves, Flame, 
  UtensilsCrossed, ShieldCheck, MapPin, ChevronRight, CheckCircle2, 
  MessageCircle, Star, Calendar, Music, Clock
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Milestone Birthday Celebration Villa Maharashtra | Stay Willas",
  description: "Celebrate milestone 30th, 40th, 50th & 60th birthdays at luxury private pool estates in Maharashtra. Expansive lawns, senior-friendly suites, in-house catering & private pools.",
  keywords: [
    "milestone birthday celebration villa maharashtra",
    "50th birthday celebration villa near mumbai",
    "family milestone celebration villas maharashtra",
    "60th birthday villa with lawn maharashtra",
    "large private villa for milestone birthday party"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/milestone-birthday-celebration-villa-maharashtra",
  },
  openGraph: {
    title: "Milestone Birthday Celebration Villa Maharashtra | Stay Willas",
    description: "Celebrate milestone 30th, 40th, 50th & 60th birthdays at luxury private pool estates in Maharashtra. Multi-generational comfort, chef catering & private lawns.",
    url: "https://www.staywillas.com/milestone-birthday-celebration-villa-maharashtra",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
        width: 1200,
        height: 630,
        alt: "Milestone Birthday Celebration Villa in Maharashtra - Stay Willas",
      }
    ],
    type: "website",
  },
};

const faqs = [
  {
    question: "Which milestone birthdays are best hosted at your private estates?",
    answer: "Our properties regularly host 30th, 40th, 50th, 60th (Shashtipoorthi), and 75th milestone birthdays! The blend of expansive outdoor lawns, large air-conditioned living salons, and private pool decks allows the entire multi-generational family to celebrate together under one roof."
  },
  {
    question: "Are the villas suitable for senior citizens and grandparents?",
    answer: "Yes, absolutely. Both Canopy Crest and The Angle House offer step-free ground-floor master bedrooms with attached ensuite bathrooms, wide doorways, comfortable seating areas, and flat paved pathways, ensuring elder family members move around safely and comfortably."
  },
  {
    question: "Can we host day-guests in addition to overnight stayers?",
    answer: "Yes. For instance, Canopy Crest comfortably sleeps 16 to 20+ guests overnight, and its 4-acre open lawns can accommodate up to 35 to 40 day-guests for afternoon celebration lunches or evening dinners upon prior coordination with our concierge."
  },
  {
    question: "How is catering and dining managed for large family gatherings?",
    answer: "Our in-villa culinary teams coordinate multi-course buffet spreads tailored to your family's traditions. We cater pure vegetarian feasts, authentic Jain meals (prepared without onion/garlic in dedicated utensils), live tandoor and BBQ platters, and authentic regional Maharashtrian specialties."
  },
  {
    question: "How do we reserve our dates and customize the milestone celebration?",
    answer: "You can book directly online or connect with our dedicated celebration concierge via WhatsApp at +91 96190 42310. We will help plan your menu, lawn setup, music arrangements, and photography recommendations."
  }
];

export default async function MilestoneBirthdayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.staywillas.com/milestone-birthday-celebration-villa-maharashtra#webpage",
        url: "https://www.staywillas.com/milestone-birthday-celebration-villa-maharashtra",
        name: "Milestone Birthday Celebration Villa Maharashtra | Stay Willas",
        description: "Celebrate landmark 30th, 40th, 50th & 60th birthdays at luxury private pool estates in Maharashtra.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.staywillas.com" },
            { "@type": "ListItem", position: 2, name: "Milestone Celebrations", item: "https://www.staywillas.com/milestone-birthday-celebration-villa-maharashtra" }
          ]
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1B3564]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B1728] via-[#10223D] to-[#0A1424] text-white overflow-hidden">
        {/* Subtle Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg"
            alt="Milestone Birthday Celebration Villa in Maharashtra"
            fill
            className="object-cover opacity-25 filter brightness-90 contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1728]/85 via-[#0B1728]/70 to-[#0A1424]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DAA520]/20 border border-[#DAA520]/60 text-[#F5C542] text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-sm">
            <Award size={16} className="text-[#F5C542]" /> Grand Family Milestones
          </div>

          {/* Heading - Explicit text-white to avoid any inheritance bug */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-[1.15] mb-6 !text-white drop-shadow-md">
            Milestone Birthday Celebration Villa <br className="hidden sm:inline" />
            <span className="text-[#F5C542] underline decoration-[#DAA520]/40 decoration-wavy decoration-2 underline-offset-8">
              in Maharashtra
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-10 drop-shadow-sm">
            Honor life&apos;s landmark moments—30th, 40th, 50th, and 60th birthdays—in absolute luxury. Bring generations together at private pool estates featuring expansive lawns, senior-friendly suites, and bespoke chef catering.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a
              href="#villas"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#0B1528] font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE GRAND ESTATES</span>
              <ChevronRight size={16} />
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'm planning a milestone birthday celebration in Maharashtra for our family. Could you share estate options, catering and direct rates?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>Chat with Milestone Specialist</span>
            </a>
          </div>
        </div>
      </section>

      {/* Milestone Age Strips - High Contrast Navy Bar */}
      <section className="bg-[#0B1528] border-y border-[#DAA520]/25 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">30th & 40th</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Pool Parties & Live BBQ</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">50th Jubilee</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Family Feasts & Speeches</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">60th Milestone</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Senior Comfort & Rituals</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Multi-Gen Bond</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Private Lawns For All Ages</span>
          </div>
        </div>
      </section>

      {/* Featured Milestone Estates */}
      <section id="villas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Grand Family Capacity</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#0B1528]">Estates Engineered for Milestone Gatherings</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Spacious layouts ensuring elderly grandparents enjoy tranquility while kids splash in the pool and cousins catch up on the lawns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Villa 1: Canopy Crest */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg"
                  alt="Canopy Crest Khopoli - 4-Acre Estate for Milestone Celebrations"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Khopoli Foothills • 4 BHK Estate
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  4-Acre Grounds • Sleeps 20+
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  Canopy Crest — The 4-Acre Foothills Estate
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  The quintessential venue for grand family celebrations. Expansive manicured lawns accommodate day gathering rituals, live cooking stations, and sunset tea circles. Features 4 spacious air-conditioned suites with ground-floor accessibility.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Users size={14} />
                    </div>
                    <span>16 to 25+ Guests</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>22x12 ft Private Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Heart size={14} />
                    </div>
                    <span>Senior-Citizen Friendly</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={14} />
                    </div>
                    <span>Full In-House Catering</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Estate Rate</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹15,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/canopy-crest"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Estate Details →
              </Link>
            </div>
          </div>

          {/* Villa 2: The Angle House */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/the-angle-house/gallery-7.webp"
                  alt="The Angle House Lonavala - Double Height Glass Living Hall for Milestone Celebrations"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Lonavala (Kamshet) • 3 BHK Glass Villa
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  Designer Glass Hall • Waterfall Pool
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  The Angle House — Glass Hall & Waterfall Pool
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  For milestone birthdays that demand architectural sophistication. The double-height glass living salon provides an air-conditioned banquet setting for family toasts, photo slideshows, and multi-course meals overlooking the waterfall pool.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Users size={14} />
                    </div>
                    <span>Up to 16 Guests</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>Waterfall Swimming Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <span>Glass Fronted Photo Hall</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Flame size={14} />
                    </div>
                    <span>Evening Bonfire Deck</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Estate Rate</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹13,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/the-angle-house"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Estate Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Generational Amenities */}
      <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Complete Family Comfort</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Designed for Every Generation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Heart size={22} className="fill-[#F5C542]" />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Ground-Floor Accessibility</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Step-free master bedrooms and ensuite bathrooms guarantee comfort for grandparents and elderly guests.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <UtensilsCrossed size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Traditional & Jain Feasts</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pure vegetarian and Jain delicacies cooked in dedicated cookware, alongside sizzling non-vegetarian barbecue spreads.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Sparkles size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Photography Backdrops</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Stunning mountain vistas, architectural glass halls, and illuminated lawns make every family portrait unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Milestone Celebration FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                  ?
                </div>
                <div>
                  <h3 className="font-heading font-black text-[#0B1528] text-base sm:text-lg mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge Banner */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1728] to-[#10223D] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#DAA520]/30 shadow-2xl">
          <div>
            <span className="text-[#F5C542] font-black tracking-widest uppercase text-xs block mb-2">
              Multi-Generation Planning
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Planning a 40th, 50th or 60th Family Gathering?
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-xl font-light">
              Speak directly with our Milestone Celebration Concierge. We coordinate catering menus, grandparent room assignments, and group transfers.
            </p>
          </div>
          <a
            href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'm planning a milestone family celebration in Maharashtra. Please assist me with estate options.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0 border border-white/20 cursor-pointer"
          >
            <MessageCircle size={18} className="fill-white" />
            <span>Chat On WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Related Celebration Hubs */}
      <section className="bg-white py-12 px-4 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Explore More Special Occasion Stays</h3>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/private-villa-for-birthday-celebration-near-mumbai" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Villa for Birthday Celebration Near Mumbai →
            </Link>
            <Link href="/anniversary-celebration-villa-with-private-pool" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Anniversary Celebration Villa with Private Pool →
            </Link>
            <Link href="/private-pool-party-villa-near-pune-for-family" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Pool Party Villa Near Pune for Family →
            </Link>
            <Link href="/escape" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas for Groups in Lonavala →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
