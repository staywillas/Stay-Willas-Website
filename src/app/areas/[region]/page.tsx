import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { MapPin, ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { generateDestinationCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

interface AreaDetails {
  name: string;
  tagline: string;
  desc: string;
  image: string;
  isLaunchingSoon: boolean;
}

const AREA_DATA: { [key: string]: AreaDetails } = {
  lonavala: {
    name: "Lonavala",
    tagline: "The Mountain Sanctuary",
    desc: "Cool mountain breeze, misty green valleys, and spacious private pool villas perched on lush hills.",
    image: "/assets/villas/the-angle-house/gallery-11.webp",
    isLaunchingSoon: false
  },
  khopoli: {
    name: "Khopoli",
    tagline: "The Nature Escape",
    desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet private pool getaways near Imagicaa.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    isLaunchingSoon: false
  },
  mahabaleshwar: {
    name: "Mahabaleshwar & Panchgani",
    tagline: "The Strawberry Highland",
    desc: "Misty Sahyadri valleys, fresh strawberry farms, and rustic private pool estates like Terra Cotta Villa.",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
    isLaunchingSoon: false
  },
  pawna: {
    name: "Pawna Lake",
    tagline: "The Lakeside Oasis",
    desc: "Tranquil waters, scenic mountain views, and serene private pool villas near Pawna Lake.",
    image: "/assets/villas/the-angle-house/gallery-4.webp",
    isLaunchingSoon: true
  }
};

interface PageProps {
  params: Promise<{ region: string }>;
}

export const revalidate = 60; // Instant TTFB via ISR cache

export function generateStaticParams() {
  return [
    { region: "lonavala" },
    { region: "khopoli" },
    { region: "mahabaleshwar" },
    { region: "pawna" },
  ];
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const regionKey = resolvedParams.region.toLowerCase();
  const area = AREA_DATA[regionKey];

  if (!area) {
    return {
      title: "Luxury Villas & Staycations in Maharashtra | Stay Willas",
      description: "Book premium verified private pool villas in Maharashtra.",
    };
  }

  let titleText = `Private Pool Villa in ${area.name} | ${area.name} Luxury Stays | Stay Willas`;
  let descText = `Book a private pool villa in ${area.name} with chef service. Discover verified ${area.name} luxury stays for family getaways and group staycations.`;
  let keywordList = [`private pool villa in ${area.name}`, `${area.name} luxury stays`];
  let indexRobots = true;

  if (regionKey === "lonavala") {
    titleText = "Luxury Villa Lonavala with Private Pool | Lonavala Villa Staycation";
    descText = "Book a luxury villa Lonavala with private pool at The Angle House. Ideal lonavala villa staycation & luxury villa stays in lonavala for family getaways & birthday party celebrations.";
    keywordList = [
      "lonavala villa staycation",
      "luxury villa stays in lonavala",
      "luxury villa Lonavala with private pool",
      "villa in Lonavala for birthday party",
      "villa in Lonavala for family"
    ];
  } else if (regionKey === "khopoli") {
    titleText = "Khopoli Villa Staycation | Large Group Villa Khopoli | Stay Willas";
    descText = "Book a khopoli villa staycation at Canopy Crest. The ultimate weekend getaway villa Khopoli for corporate offsite villa Khopoli & large group villa khopoli bookings.";
    keywordList = [
      "khopoli villa staycation",
      "weekend getaway villa Khopoli",
      "corporate offsite villa Khopoli",
      "large group villa khopoli"
    ];
  } else if (regionKey === "pawna") {
    titleText = "Pawna Lake Villas & Private Pool Stays | Stay Willas";
    descText = "Book private pool villas near Pawna Lake Lonavala with serene lake views and in-house chef service.";
    keywordList = ["pawna lake villas", "villas near pawna lake lonavala"];
    indexRobots = true;
  }

  return {
    title: titleText,
    description: descText,
    keywords: keywordList,
    robots: {
      index: indexRobots,
      follow: true,
    },
    alternates: {
      canonical: `https://www.staywillas.com/areas/${regionKey}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://www.staywillas.com/areas/${regionKey}`,
      images: [
        {
          url: "https://www.staywillas.com/images/hero-villa.webp",
          width: 1200,
          height: 630,
          alt: `Stay Willas Luxury Villas in ${area.name}`,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: ["https://www.staywillas.com/images/hero-villa.webp"],
    },
  };
}

export default async function AreaRegionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const regionKey = resolvedParams.region.toLowerCase();
  const area = AREA_DATA[regionKey];

  if (!area) {
    notFound();
  }

  // Fetch villas belonging to this region
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: area.name,
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const villas = dbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/images/hero-villa.webp",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  // Region FAQs map
  const regionalFaqsMap: Record<string, { question: string; answer: string }[]> = {
    lonavala: [
      {
        question: "What is the best time to book a private pool villa in Lonavala?",
        answer: "Monsoon season (June to September) offers lush green views and mountain waterfalls, while winter (October to February) brings pleasant, cool weather ideal for outdoor pool gatherings."
      },
      {
        question: "Are Stay Willas properties in Lonavala pet-friendly?",
        answer: "Yes, signature properties like The Angle House feature fully fenced green lawns so your pets can run and play safely."
      },
      {
        question: "What dining options are available at your Lonavala villas?",
        answer: "Dedicated on-site chefs prepare fresh, customized multi-cuisine meals, poolside barbecues, and pure-vegetarian & Jain menus prepared in separate cookware."
      }
    ],
    khopoli: [
      {
        question: "How far is Khopoli from Mumbai and Pune?",
        answer: "Khopoli is located approximately 75 km from Mumbai (around a 1.5-hour drive via the Mumbai-Pune Expressway) and 80 km from Pune."
      },
      {
        question: "Is Canopy Crest in Khopoli suitable for large group staycations?",
        answer: "Yes, Canopy Crest comfortably accommodates 20 to 25+ guests across 4 spacious master BHK suites, featuring a massive 22x12 ft private pool and sprawling lawns."
      }
    ],
    karjat: [
      {
        question: "What amenities do Karjat private pool villas include?",
        answer: "Our Karjat staycation villas feature private swimming pools, riverfront decks, lush gardens, air conditioning, and full in-house chef dining options."
      }
    ]
  };

  const currentFaqs = regionalFaqsMap[regionKey] || [
    {
      question: `What amenities are included in Stay Willas ${area.name} properties?`,
      answer: `Our ${area.name} villas feature private swimming pools, air-conditioned master bedrooms, high-speed Wi-Fi, and optional in-house chef culinary services.`
    }
  ];

  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: regionKey,
    regionName: area.name,
    title: `Luxury Villas in ${area.name} with Private Pool | Stay Willas`,
    description: `Discover luxury villas in ${area.name} with private swimming pools, scenic mountain greenery, and in-house chef services.`,
    villas: villas.map(v => ({
      slug: v.id,
      name: v.name,
      location: v.location,
      image: v.image,
      price: v.price,
      bedrooms: v.bedrooms,
      guests: v.guests,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
    { name: area.name, url: `/areas/${regionKey}` },
  ]);

  const faqSchema = generateFAQSchema(currentFaqs);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
      {/* Structured Data: CollectionPage, ItemList, BreadcrumbList & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            ...destinationSchema["@graph"],
            breadcrumbSchema,
            ...(faqSchema ? [faqSchema] : []),
          ]),
        }}
      />
      <div>
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10">
          <div className="absolute inset-0 -z-10">
            <Image 
              src={area.image} 
              alt={`${area.name} scenery`}
              fill
              priority
              className="object-cover opacity-15 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col items-start text-left">
            {/* Breadcrumb Navigation for SEO */}
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas" className="hover:text-accent-primary transition-colors">Areas</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">{area.name}</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              {area.tagline}
            </span>
            <h1 className="sr-only">Luxury Villas in {area.name} with Private Pool</h1>
            <TextGenerateEffect 
              words={`Luxury Villas in ${area.name} with Private Pool`}
              highlightWords={[area.name]}
              className="text-4xl md:text-6xl mb-4"
            />
            <p className="text-text-primary/75 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              {area.desc}
            </p>
          </div>
        </section>
        {/* Full-Width Destination Switcher Tabs */}
        <section className="bg-white border-b border-[#DAA520]/20 py-4 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#DAA520]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Explore Destinations:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link 
                href="/areas/lonavala"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${regionKey === 'lonavala' ? 'bg-[#1B3564] text-white shadow-sm' : 'bg-[#FAF8F5] text-slate-700 hover:bg-[#1B3564] hover:text-white border border-slate-200'}`}
              >
                Lonavala
              </Link>
              <Link 
                href="/areas/khopoli"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${regionKey === 'khopoli' ? 'bg-[#1B3564] text-white shadow-sm' : 'bg-[#FAF8F5] text-slate-700 hover:bg-[#1B3564] hover:text-white border border-slate-200'}`}
              >
                Khopoli
              </Link>
              <Link 
                href="/areas/mahabaleshwar"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${regionKey === 'mahabaleshwar' ? 'bg-[#1B3564] text-white shadow-sm' : 'bg-[#FAF8F5] text-slate-700 hover:bg-[#1B3564] hover:text-white border border-slate-200'}`}
              >
                Mahabaleshwar & Panchgani
              </Link>
              <Link 
                href="/areas"
                className="px-4 py-2 rounded-full text-xs font-bold bg-transparent text-[#DAA520] hover:underline"
              >
                View All Areas →
              </Link>
            </div>
          </div>
        </section>

        {/* Full-Width Region Content Section */}
        <section className="py-14 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          {area.isLaunchingSoon ? (
            <div className="bg-white rounded-3xl border border-[#DAA520]/25 p-8 sm:p-14 text-center shadow-lg space-y-6 max-w-3xl mx-auto">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold tracking-widest text-[10px] uppercase px-4 py-1.5 rounded-full inline-block shadow-sm">
                Launching Soon
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-bold">
                Stay Willas is coming to {area.name}
              </h2>
              <p className="text-slate-700 text-base md:text-lg leading-relaxed font-normal max-w-md mx-auto">
                We are actively curating premium private pool sanctuaries in {area.name} to offer you the signature Stay Willas experience. Join the waitlist to be notified first!
              </p>
              <div className="pt-4">
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas team! 🌟 Please let me know when your private pool villas in *${area.name}* are live.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl px-7 py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <PhoneCall size={15} /> Get Notified on WhatsApp
                </a>
              </div>
            </div>
          ) : villas.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#DAA520]/20 p-12 text-center shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-heading mb-4 text-[#1B3564]">No villas found</h2>
              <p className="text-slate-600 text-base mb-6">There are currently no active listings in this region. Please check back soon.</p>
              <Link href="/areas" className="text-[#1B3564] hover:text-accent-primary font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2">
                <ArrowLeft size={16} /> View all areas
              </Link>
            </div>
          ) : (
            <div className="space-y-14">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {villas.map((villa) => (
                  <VillaCard 
                    key={villa.id}
                    id={villa.id}
                    name={villa.name}
                    location={villa.location}
                    image={villa.image}
                    price={villa.price}
                    guests={villa.guests}
                    bedrooms={villa.bedrooms}
                    bathrooms={villa.bathrooms}
                  />
                ))}
              </div>

              {/* Frequently Asked Questions */}
              <div className="bg-white border border-[#DAA520]/20 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B3564]">
                  Frequently Asked Questions — {area.name} Staycations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {currentFaqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 space-y-2">
                      <h4 className="font-heading font-bold text-[#1B3564] text-base">{faq.question}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
