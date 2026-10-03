import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import { 
  Sparkles, PartyPopper, Cake, Flame, UtensilsCrossed, Music, 
  Waves, ShieldCheck, MapPin, Users, ChevronRight, CheckCircle2, 
  MessageCircle, Star, Phone, Clock, Heart, Award
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Private Villa for Birthday Celebration Near Mumbai | Stay Willas",
  description: "Host an unforgettable birthday party at a private pool villa near Mumbai. Enjoy private swimming pools, poolside BBQ grills, sound systems, lawn decor & gourmet chef dining.",
  keywords: [
    "private villa for birthday celebration near mumbai",
    "birthday party villa near mumbai with pool",
    "villa for birthday celebration with chef",
    "lonavala villa for birthday party",
    "khopoli pool villa for birthday",
    "private pool villa near mumbai for birthday celebration"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/private-villa-for-birthday-celebration-near-mumbai",
  },
  openGraph: {
    title: "Private Villa for Birthday Celebration Near Mumbai | Private Pool & Chef | Stay Willas",
    description: "Host an unforgettable birthday party at a private pool villa near Mumbai. Enjoy private swimming pools, poolside BBQ grills, sound systems & gourmet chef dining.",
    url: "https://www.staywillas.com/private-villa-for-birthday-celebration-near-mumbai",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/the-angle-house/gallery-11.webp",
        width: 1200,
        height: 630,
        alt: "Private Villa for Birthday Celebration Near Mumbai - Stay Willas",
      }
    ],
    type: "website",
  },
};

const faqs = [
  {
    question: "Can we play music and host a midnight cake cutting at the villa?",
    answer: "Yes, absolutely! Unlike restrictive hotels, our private villas feature indoor and outdoor sound systems. You can play your favorite music, set up midnight cake cutting on the pool deck or living hall, and celebrate in total privacy. We simply ask that outdoor volume is moderated after 10:00 PM to respect neighboring estates."
  },
  {
    question: "Can Stay Willas arrange birthday decorations and a customized cake?",
    answer: "Yes. Our concierge can coordinate with verified local floral and balloon decorators for personalized themes, fairy light backdrops, and photo booths. We can also source artisanal birthday cakes from top local bakeries delivered fresh to your villa."
  },
  {
    question: "Is the swimming pool 100% private for our birthday group?",
    answer: "Yes, 100%. When you book with Stay Willas, the entire villa and its swimming pool are exclusively yours. Zero shared pools, zero strangers, and no rigid 7:00 PM closing times that commercial hotels enforce."
  },
  {
    question: "What meal options are available for birthday parties?",
    answer: "Our in-villa culinary teams specialize in celebration dining! We offer live coal barbecue grills (paneer tikka, chicken skewers, corn on the cob), authentic Maharashtrian or North Indian buffet spreads, evening party snacks, and customized Jain or pure vegetarian menus prepared in separate cookware."
  },
  {
    question: "How far are the birthday villas from Mumbai?",
    answer: "Our villas are strategically located along the Mumbai-Pune Expressway: Canopy Crest in Khopoli is just 75 to 90 minutes from Vashi/Chembur (bypassing ghat traffic), while The Angle House and Willow Peak in Lonavala are reached within 95 to 110 minutes."
  }
];

export default async function BirthdayCelebrationPage() {
  const angleHouse = await prisma.villa.findUnique({ where: { slug: "the-angle-house" } });
  const canopyCrest = await prisma.villa.findUnique({ where: { slug: "canopy-crest" } });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.staywillas.com/private-villa-for-birthday-celebration-near-mumbai#webpage",
        url: "https://www.staywillas.com/private-villa-for-birthday-celebration-near-mumbai",
        name: "Private Villa for Birthday Celebration Near Mumbai | Stay Willas",
        description: "Host an unforgettable birthday party at a private pool villa near Mumbai with in-house chef, private pool, and sound system.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.staywillas.com" },
            { "@type": "ListItem", position: 2, name: "Birthday Celebration Villas", item: "https://www.staywillas.com/private-villa-for-birthday-celebration-near-mumbai" }
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
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B1528] via-[#10203E] to-[#0A1424] text-white overflow-hidden">
        {/* Subtle Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/villas/the-angle-house/gallery-11.webp"
            alt="Private Villa for Birthday Celebration Near Mumbai"
            fill
            className="object-cover opacity-25 filter brightness-90 contrast-125"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1528]/85 via-[#0B1528]/70 to-[#0A1424]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DAA520]/20 border border-[#DAA520]/60 text-[#F5C542] text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-sm">
            <PartyPopper size={16} className="text-[#F5C542]" /> Celebration Collection
          </div>

          {/* Heading - Explicit text-white to avoid any inheritance bug */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-[1.15] mb-6 !text-white drop-shadow-md">
            Private Villa for Birthday Celebration <br className="hidden sm:inline" />
            <span className="text-[#F5C542] underline decoration-[#DAA520]/40 decoration-wavy decoration-2 underline-offset-8">
              Near Mumbai
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-10 drop-shadow-sm">
            Skip sterile hotel banquet halls and crowded restaurant tables. Celebrate your special day with exclusive 100% private pool access, live coal barbecues, personal chef dining, and starry mountain lawns.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a
              href="#villas"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#0B1528] font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE BIRTHDAY VILLAS</span>
              <ChevronRight size={16} />
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🎂 I'm looking for a private villa for a birthday celebration near Mumbai. Could you share available options and packages?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>Chat with Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Bar - High Contrast Navy & Glowing Gold */}
      <section className="bg-[#0B1528] border-y border-[#DAA520]/25 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">100% Private</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Pools & Grounds Just for You</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">Live BBQ & Chef</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Custom Party Food Spreads</span>
          </div>
          <div className="p-3 border-r border-white/10 md:border-r">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">75–90 Mins</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Easy Expressway Drive</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-black text-[#F5C542] block tracking-tight">0% Extra Fees</span>
            <span className="text-xs sm:text-sm text-white/80 font-medium mt-1 block">Direct Homeowner Rates</span>
          </div>
        </div>
      </section>

      {/* Featured Birthday Villas */}
      <section id="villas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Handpicked for Parties & Celebrations</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#0B1528]">Featured Birthday Pool Villas</h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Each property offers dedicated caretaker support, sound system connectivity, outdoor party lawns, and custom meal planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Villa 1: The Angle House */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/the-angle-house/gallery-11.webp"
                  alt="The Angle House Lonavala - Private Waterfall Pool Villa for Birthday"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Lonavala (Kamshet) • 3 BHK
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  Waterfall Pool + Jacuzzi
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  The Angle House — Architectural Glass Villa
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Iconic double-height glass design with a private natural waterfall swimming pool, master bedroom hydrotherapy jacuzzi, pet-friendly fenced lawns, and live barbecue deck. Ideal for birthdays of 10 to 16 guests.
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
                    <span>Private Waterfall Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Flame size={14} />
                    </div>
                    <span>Live Coal BBQ Grill</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Music size={14} />
                    </div>
                    <span>Sound System Setup</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Booking Rates</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹13,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/the-angle-house"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Villa & Dates →
              </Link>
            </div>
          </div>

          {/* Villa 2: Canopy Crest */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"
                  alt="Canopy Crest Khopoli - Large Group Private Pool Estate for Birthday Celebration"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B1528]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-sm">
                  Khopoli (Chavani) • 4 BHK
                </div>
                <div className="absolute top-4 right-4 bg-[#DAA520] text-[#0B1528] px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                  22ft Pool + 4-Acre Grounds
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-heading font-bold text-[#0B1528] mb-3">
                  Canopy Crest — Sprawling Hillside Estate
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Expansive private estate at the foothills of the Western Ghats. Features a sparkling 22x12ft swimming pool, traditional charpai lawns, outdoor bonfire circle, and capacity for 16 to 25+ guests. Perfect for big birthday gatherings.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-semibold mb-6">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Users size={14} />
                    </div>
                    <span>Up to 25+ Guests</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Waves size={14} />
                    </div>
                    <span>22x12 ft Swimming Pool</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <Flame size={14} />
                    </div>
                    <span>Bonfire Pit & Gazebo</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#DAA520]/20 text-[#B8860B] flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={14} />
                    </div>
                    <span>Full In-House Chef Service</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Booking Rates</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B1528]">₹15,000<span className="text-xs font-normal text-slate-500"> / night</span></span>
              </div>
              <Link
                href="/villa/canopy-crest"
                className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-[#DAA520] hover:text-[#0B1528] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View Villa & Dates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Birthday Features Grid */}
      <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Tailored Hospitality</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">What Makes Our Birthday Stays Unmatched</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Flame size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Live Barbecue Evenings</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enjoy smoky live tikkas and marinated skewers grilled by our staff while you lounge by the pool.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Music size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Music & Party Vibe</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                High-power Bluetooth sound systems and ambient evening garden lights let you celebrate on your terms.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Cake size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Decor & Cake Support</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Need balloon arches, fairy light backdrops, or fresh bakery cakes? Our concierge coordinates it seamlessly.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <UtensilsCrossed size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Customized Menus</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Separate vegetarian and non-vegetarian preparation, strict Jain food options, and midnight munchies.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <Clock size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Flexible Celebrations</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No rigid hotel restaurant closing hours. Cut your cake at midnight by the poolside without restrictions.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1528] flex items-center justify-center text-[#F5C542] mb-5 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h4 className="font-heading font-black text-[#0B1528] text-lg mb-2">Gated Estate Security</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Private gates, secure parking, and dedicated 24/7 on-site caretakers to assist with luggage and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#B8860B] font-black tracking-widest text-xs uppercase block mb-2">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-[#0B1528]">Birthday Villa Planning Guide</h2>
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
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1528] to-[#14264A] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-[#DAA520]/30 shadow-2xl">
          <div>
            <span className="text-[#F5C542] font-black tracking-widest uppercase text-xs block mb-2">
              Fast Track Availability
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Ready to Lock In Your Birthday Weekend?
            </h3>
            <p className="text-white/80 text-sm mt-2 max-w-xl font-light">
              Chat with our dedicated concierge on WhatsApp. We will suggest available villas, organize catering menus, and confirm your booking instantly.
            </p>
          </div>
          <a
            href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🎂 I want to check availability and rates for a birthday celebration villa near Mumbai. Please help me.")}`}
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
            <Link href="/anniversary-celebration-villa-with-private-pool" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Anniversary Celebration Villa with Private Pool →
            </Link>
            <Link href="/milestone-birthday-celebration-villa-maharashtra" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Milestone Birthday Celebration Villa Maharashtra →
            </Link>
            <Link href="/private-pool-party-villa-near-pune-for-family" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Private Pool Party Villa Near Pune for Family →
            </Link>
            <Link href="/areas/lonavala" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas in Lonavala →
            </Link>
            <Link href="/areas/khopoli" className="px-5 py-2.5 rounded-full bg-[#FAF8F5] border border-slate-200 hover:border-[#0B1528] hover:bg-[#0B1528] text-[#0B1528] hover:text-white font-semibold transition-all">
              Villas in Khopoli →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
