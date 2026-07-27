import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { MapPin, ChevronRight, ArrowLeft } from "lucide-react";

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
    desc: "Lovely green valleys, quiet flowing streams, and peaceful villas built for complete relaxation in nature.",
    image: "/assets/villas/heritage-villa/main.jpg",
    isLaunchingSoon: true
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

  let titleText = `Luxury Villas in ${area.name} with Private Pool | Stay Willas`;
  let descText = `Rent luxury villas in ${area.name} with private pool, scenic views & chef service. Ideal for family weekend getaways. Check availability and book now.`;
  let keywordList = [`luxury villas in ${area.name} with private pool`, `private pool villa in ${area.name}`];
  let indexRobots = true;

  if (regionKey === "lonavala") {
    titleText = `Luxury Villa in Lonavala with Private Pool | Stay Willas`;
    descText = "Rent a luxury villa in lonavala with private pool, scenic mountain views & chef. Ideal for a lonavala villa staycation and group trips. Check availability now.";
    keywordList = ["luxury villa in lonavala with private pool", "lonavala villa staycation"];
  } else if (regionKey === "alibaug") {
    titleText = "Alibaug Villas Coming Soon | Join the Waitlist – Stay Willas";
    descText = "Join the Stay Willas waitlist for our upcoming luxury private pool villas in Alibaug. Be the first to get notified when these premium properties launch.";
    keywordList = ["luxury villa in alibaug with private pool", "villa on rent in alibaug"];
    indexRobots = false;
  } else if (regionKey === "karjat") {
    titleText = "Karjat Villas Coming Soon | Join the Waitlist – Stay Willas";
    descText = "Join the Stay Willas waitlist for our upcoming luxury private pool villas in Karjat. Be the first to get notified when these premium properties launch.";
    keywordList = ["private pool villa in karjat", "karjat villa on rent"];
    indexRobots = false;
  } else if (regionKey === "khopoli") {
    titleText = `Khopoli Private Pool Villa | Luxury Villa in Khopoli on Rent`;
    descText = "Book a premium khopoli private pool villa nestled in green mountains. Escape to a private mountain view villa in khopoli on rent with customized chef service.";
    keywordList = ["khopoli private pool villa", "villa in khopoli on rent"];
  } else if (regionKey === "goa") {
    titleText = `Luxury Villa in Goa with Private Pool | Goa Villa Rental`;
    descText = "Book an exquisite luxury villa in goa with private pool, beach views, and fully serviced hospitality. Explore premier goa villa rental options with Stay Willas.";
    keywordList = ["luxury villa in goa with private pool", "goa villa rental"];
  } else if (regionKey === "igatpuri") {
    titleText = `Private Pool Villa in Igatpuri | Luxury Villa in Igatpuri`;
    descText = "Escape to a scenic private pool villa in igatpuri. Rent premium luxury villa in igatpuri properties with stunning mountain views, private chef, and top amenities. Book today!";
    keywordList = ["private pool villa in igatpuri", "luxury villa in igatpuri"];
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

        {/* Villa Grid Section */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          {area.isLaunchingSoon ? (
            <div className="bg-[#FAF8F5]/50 backdrop-blur-md rounded-3xl border border-[#DAA520]/15 p-12 text-center max-w-2xl mx-auto shadow-sm">
              <span className="bg-accent-primary text-white font-bold tracking-widest text-[9px] uppercase px-3.5 py-1.5 rounded-full inline-block mb-4 shadow-md">
                Launching Soon
              </span>
              <h2 className="text-3xl font-heading mb-4 text-[#1B3564]">
                Stay Willas is coming to {area.name}
              </h2>
              <p className="text-text-primary/60 text-sm font-light mb-8 max-w-md mx-auto">
                We are actively curating premium private pool sanctuaries in {area.name} to offer you the signature Stay Willas experience.
              </p>
              <a
                href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas team! 🌟 Please let me know when your private pool villas in *${area.name}* are live.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#152A50] text-white rounded-full px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Notified on WhatsApp
              </a>
            </div>
          ) : villas.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-heading mb-4 text-[#1B3564]">No villas found</h2>
              <p className="text-text-primary/60 text-sm mb-6">There are currently no active listings in this region. Please check back soon.</p>
              <Link href="/areas" className="text-[#1B3564] hover:text-accent-primary font-bold uppercase tracking-wider text-xs inline-flex items-center gap-2">
                <ArrowLeft size={16} /> View all areas
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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

              {/* Bottom Navigation to other regions for SEO flow */}
              <div className="mt-20 border-t border-[#DAA520]/15 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary/40 mb-1">
                    Explore Other Destinations
                  </h4>
                  <p className="text-xs text-text-primary/60 font-light">
                    Discover luxury escapes in other premium areas of Maharashtra.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(AREA_DATA)
                    .filter(k => k !== regionKey)
                    .map(k => (
                      <Link
                        key={k}
                        href={`/areas/${k}`}
                        className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300"
                      >
                        {AREA_DATA[k].name}
                      </Link>
                    ))
                  }
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
