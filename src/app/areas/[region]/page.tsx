import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { MapPin, ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";

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
  alibaug: {
    name: "Alibaug",
    tagline: "The Coastal Getaway",
    desc: "Beautiful coconut trees, quiet sandy beaches, and modern villas just a scenic catamaran ferry ride away from Mumbai.",
    image: "/assets/villas/alibaug-palms-beachhouse/main.jpg",
    isLaunchingSoon: true
  },
  karjat: {
    name: "Karjat",
    tagline: "The Riverside Escape",
    desc: "Explore luxury villas in Karjat with private pools, serene riverfront views, and green Sahyadri valley staycations near Mumbai and Pune.",
    image: "/assets/villas/heritage-villa/main.jpg",
    isLaunchingSoon: false
  },
  khopoli: {
    name: "Khopoli",
    tagline: "The Nature Escape",
    desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet private pool getaways.",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    isLaunchingSoon: false
  },
  goa: {
    name: "Goa",
    tagline: "The Beach Paradise",
    desc: "Sunny beaches, beautiful old Portuguese-style homes, and warm private pool villas.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    isLaunchingSoon: true
  },
  igatpuri: {
    name: "Igatpuri",
    tagline: "The Misty Hills",
    desc: "Gorgeous lake views, foggy mountain peaks, and peaceful hillside villas.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
    isLaunchingSoon: true
  }
};

interface PageProps {
  params: Promise<{ region: string }>;
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
  } else if (regionKey === "alibaug") {
    titleText = "Alibaug Private Pool Villa & Luxury Beach Stays | Stay Willas";
    descText = "Explore Alibaug private pool villa options and upcoming luxury beach stays with in-house chef service.";
    keywordList = ["alibaug private pool villa", "luxury beach stays"];
    indexRobots = false;
  } else if (regionKey === "karjat") {
    titleText = "Karjat Private Pool Villa & Riverfront Stays | Stay Willas";
    descText = "Book a Karjat private pool villa with riverfront stays and scenic mountain views. Verified retreats with in-house chef options.";
    keywordList = ["karjat private pool villa", "riverfront stays"];
    indexRobots = true;
  } else if (regionKey === "khopoli") {
    titleText = "Khopoli Villa Staycation | Large Group Villa Khopoli | Stay Willas";
    descText = "Book a khopoli villa staycation at Canopy Crest. The ultimate weekend getaway villa Khopoli for corporate offsite villa Khopoli & large group villa khopoli bookings.";
    keywordList = [
      "khopoli villa staycation",
      "weekend getaway villa Khopoli",
      "corporate offsite villa Khopoli",
      "large group villa khopoli"
    ];
  } else if (regionKey === "goa") {
    titleText = "Goa Private Pool Villa & Beach Rentals | Stay Willas";
    descText = "Book a Goa private pool villa with beach rentals and fully serviced hospitality. Check availability and book online.";
    keywordList = ["goa private pool villa", "beach rentals"];
  } else if (regionKey === "igatpuri") {
    titleText = "Igatpuri Private Pool Villa & Mountain Retreats | Stay Willas";
    descText = "Escape to an Igatpuri private pool villa with mountain retreats, scenic hill views, and in-house chef options.";
    keywordList = ["igatpuri private pool villa", "mountain retreats"];
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
          url: "https://www.staywillas.com/images/hero-villa.png",
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
      images: ["https://www.staywillas.com/images/hero-villa.png"],
    },
  };
}

export default async function AreaRegionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const regionKey = resolvedParams.region.toLowerCase();
  const area = AREA_DATA[regionKey];

  if (!area) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="pt-48 pb-24 text-center">
            <h1 className="text-3xl font-heading mb-4">Luxury Villa Location Not Found</h1>
            <p className="text-text-primary/60 mb-6">The location you are looking for does not exist.</p>
            <Link href="/areas" className="text-[#1B3564] hover:text-accent-primary font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to all areas
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
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
    image: villa.images[0] || "/images/hero-villa.png",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
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
                "name": area.name,
                "item": `https://www.staywillas.com/areas/${regionKey}`
              }
            ]
          })
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
            <h1 className="text-4xl md:text-6xl font-heading leading-none tracking-tight mb-4">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light">{area.name}</span> with Private Pool
            </h1>
            <p className="text-text-primary/75 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              {area.desc}
            </p>
          </div>
        </section>
        {/* 3-Column Region Container with Navigation and Booking Sidebars */}
        <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT SIDEBAR: Area Navigation & Trust Badges */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DAA520]/15">
                  <MapPin className="text-accent-primary w-5 h-5" />
                  <h3 className="font-heading font-bold text-[#1B3564] text-lg">Explore Destinations</h3>
                </div>
                <div className="space-y-2.5">
                  <Link href="/areas/lonavala" className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${regionKey === 'lonavala' ? 'bg-[#1B3564] text-white shadow-md' : 'bg-white hover:bg-slate-100 text-[#1B3564] border-[#DAA520]/15'}`}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${regionKey === 'lonavala' ? 'bg-[#DAA520] animate-pulse' : 'bg-[#DAA520]'}`} />
                      Lonavala
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-[#DAA520] text-[#1B3564] px-2.5 py-1 rounded-full">Active</span>
                  </Link>

                  <Link href="/areas/khopoli" className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${regionKey === 'khopoli' ? 'bg-[#1B3564] text-white shadow-md' : 'bg-white hover:bg-slate-100 text-[#1B3564] border-[#DAA520]/15'}`}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${regionKey === 'khopoli' ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`} />
                      Khopoli
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Active</span>
                  </Link>

                  {[
                    { name: "Alibaug", slug: "alibaug" },
                    { name: "Karjat", slug: "karjat" },
                    { name: "Pawna Lake", slug: "pawna" },
                    { name: "Igatpuri", slug: "igatpuri" },
                    { name: "Goa", slug: "goa" }
                  ].map((a) => (
                    <Link key={a.slug} href={`/areas/${a.slug}`} className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${regionKey === a.slug ? 'bg-[#1B3564] text-white font-bold' : 'bg-white/60 hover:bg-white text-slate-600 border-slate-200/60'}`}>
                      <span>{a.name}</span>
                      <span className="text-[10px] uppercase font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/60">Coming Soon</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stay Willas Guarantee */}
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
                </ul>
              </div>
            </aside>

            {/* CENTER COLUMN: Main Content */}
            <main className="lg:col-span-6">
              {area.isLaunchingSoon ? (
                <div className="bg-white rounded-3xl border border-[#DAA520]/15 p-8 sm:p-12 text-center shadow-sm space-y-6">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold tracking-widest text-[10px] uppercase px-4 py-1.5 rounded-full inline-block shadow-sm">
                    Launching Soon
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-heading text-[#1B3564]">
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
                      className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#152A50] text-white rounded-2xl px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <PhoneCall size={14} className="text-[#DAA520]" /> Get Notified on WhatsApp
                    </a>
                  </div>
                </div>
              ) : villas.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#DAA520]/15 p-12 text-center shadow-sm">
                  <h2 className="text-2xl font-heading mb-4 text-[#1B3564]">No villas found</h2>
                  <p className="text-slate-600 text-base mb-6">There are currently no active listings in this region. Please check back soon.</p>
                  <Link href="/areas" className="text-[#1B3564] hover:text-accent-primary font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2">
                    <ArrowLeft size={16} /> View all areas
                  </Link>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                </div>
              )}
            </main>

            {/* RIGHT SIDEBAR: Booking & Reservation Concierge */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#DAA520]/15 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-secondary">Active Bookings</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Available</span>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Looking to book a private pool villa immediately? Choose one of our 2 active destinations:
                </p>

                <div className="space-y-3 pt-1">
                  <Link 
                    href="/areas/lonavala" 
                    className="flex items-center justify-between w-full bg-[#1B3564] hover:bg-[#0F2142] text-white p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Lonavala — The Angle House</span>
                    <ChevronRight size={16} className="text-[#DAA520]" />
                  </Link>

                  <Link 
                    href="/areas/khopoli" 
                    className="flex items-center justify-between w-full bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Khopoli — Canopy Crest</span>
                    <ChevronRight size={16} className="text-emerald-200" />
                  </Link>
                </div>
              </div>

              {/* Inquiry Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-heading font-bold text-[#1B3564] text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-accent-primary" /> Concierge Waitlist
                </h4>
                <p className="text-xs text-slate-600 font-light">
                  Want us to help you book in {area.name} or recommend an active villa nearby?
                </p>
                <a 
                  href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas concierge, I'm interested in booking a villa in ${area.name}`)}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-bold text-xs uppercase tracking-wider text-center py-3.5 rounded-xl transition-colors"
                >
                  Contact Concierge
                </a>
              </div>
            </aside>

          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
