import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Villa Destinations in Maharashtra | Stay Willas",
  description: "Discover top villa destinations in maharashtra for family staycations. Reserve verified villas in lonavala with private pool & chef service.",
  keywords: ["villa destinations in maharashtra", "villas in lonavala with private pool", "luxury villas in lonavala"],
  alternates: {
    canonical: "https://www.staywillas.com/destinations",
  },
  openGraph: {
    title: "Villa Destinations in Maharashtra | Stay Willas",
    description: "Discover top villa destinations in maharashtra. Reserve verified villas in lonavala with private pool & chef service for a memorable staycation.",
    url: "https://www.staywillas.com/destinations",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Villa Destinations in Maharashtra",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villa Destinations in Maharashtra | Stay Willas",
    description: "Discover top villa destinations in maharashtra. Reserve verified villas in lonavala with private pool & chef service for a memorable staycation.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default async function DestinationsPage() {
  // Dynamically count active luxury retreats in each region from live Supabase DB
  const lonavalaCount = await prisma.villa.count({
    where: { location: { contains: "Lonavala", mode: "insensitive" } }
  });

  const khopoliCount = await prisma.villa.count({
    where: { location: { contains: "Khopoli", mode: "insensitive" } }
  });
  
  const destinations = [
    {
      name: "Lonavala (The Angle House)",
      tagline: "The Mountain Sanctuary",
      desc: "Cool mountain breeze, misty green valleys, and spacious pool estates perched on lush hills.",
      image: "/assets/villas/the-angle-house/gallery-11.webp",
      count: lonavalaCount,
      isLaunchingSoon: lonavalaCount === 0,
      link: "/villa/the-angle-house"
    },
    {
      name: "Khopoli (Canopy Crest)",
      tagline: "The Nature Escape",
      desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet pool retreats.",
      image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      count: khopoliCount,
      isLaunchingSoon: khopoliCount === 0,
      link: "/villa/canopy-crest"
    }
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-32 pb-10 sm:pt-36 sm:pb-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center flex flex-col items-center overflow-hidden">
        {/* Background Soft Glow for Premium Aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#1B3564]/10 to-[#2563EB]/10 rounded-full blur-2xl md:blur-[80px] pointer-events-none -z-10" />
        
        <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
          Our Stays
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading leading-tight mb-1 tracking-tight">
          Villa Destinations in <span className="italic text-accent-primary font-serif">Maharashtra</span>
        </h1>
        
        {/* Custom Luxury Elegant Divider */}
        <div className="flex items-center gap-4 my-4 w-full max-w-[200px]">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#2563EB]/40" />
          <div className="w-1.5 h-1.5 rounded-sm border border-accent-primary bg-bg-primary rotate-45 flex-shrink-0" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#2563EB]/40" />
        </div>
        
        <p className="text-text-primary/70 text-xs sm:text-base leading-relaxed max-w-2xl font-light">
          We select each location with great care. Every luxury escape we offer is crafted to give you an unforgettable holiday experience.
        </p>
      </section>

      {/* Destinations List */}
      <section className="pb-16 px-4 md:px-12 max-w-7xl mx-auto space-y-12 md:space-y-20">
        {destinations.map((dest, i) => (
          <div key={dest.name} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-12 items-center group`}>
            <ThreeDHoverCard
              maxTilt={5}
              scale={1.02}
              lift={-6}
              className="w-full md:w-[48%] aspect-[3/2] rounded-3xl"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <Image 
                  src={dest.image} 
                  alt={dest.name} 
                  fill 
                  priority={i === 0}
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 55vw, 680px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                
                {dest.isLaunchingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <span className="text-lg md:text-xl lg:text-2xl font-heading font-black tracking-[0.25em] text-white border border-white/30 px-5 py-3 rounded-2xl uppercase shadow-xl select-none">
                      LAUNCHING SOON
                    </span>
                  </div>
                )}
              </div>
            </ThreeDHoverCard>
            
            <div className="w-full md:w-[46%] text-left">
              <div className="text-accent-secondary font-medium tracking-widest uppercase text-xs mb-3 flex items-center gap-3">
                <span className="h-px w-6 bg-accent-secondary" />
                {dest.tagline}
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading mb-4 leading-tight">{dest.name}</h2>
              <p className="text-text-primary/55 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
                {dest.desc}
              </p>
              
              {!dest.isLaunchingSoon ? (
                <div className="flex flex-col gap-3">
                  <Link 
                    href={dest.link}
                    className="inline-flex items-center gap-3 group/link"
                  >
                    <span className="w-12 h-12 rounded-full border border-[#0F172A]/20 flex items-center justify-center group-hover/link:bg-accent-primary group-hover/link:border-accent-primary group-hover/link:text-white transition-all">
                      <ArrowUpRight size={18} />
                    </span>
                    <span className="uppercase tracking-[0.2em] text-[10px] font-bold">View Details & Book</span>
                  </Link>
                  <a
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hey Stay Willas team! 🏔️ I am exploring your getaways in *${dest.name}* and would love to check availability for an upcoming escape. Could you share some suggestions?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#152A50] text-white rounded-full px-4.5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 w-fit"
                  >
                    CHECK AVAILABILITY
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" /></svg>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="text-xl sm:text-2xl md:text-3xl font-heading font-black tracking-[0.15em] text-accent-primary uppercase select-none">
                    LAUNCHING SOON
                  </div>
                  <a
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello! 🌟 I noticed you are launching soon in *${dest.name}*! It looks absolutely beautiful. I would love to be notified as soon as these sanctuaries are open for bookings.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1B3564]/60 hover:text-[#1B3564] text-xs font-bold tracking-wider uppercase transition-all duration-300 w-fit"
                  >
                    GET NOTIFIED
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" /></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 1000-Word SEO Optimized Content Section */}
      <section className="bg-white/60 border-t border-border-subtle py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-12 text-text-primary">
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold leading-snug">
              Exploring Premier Villa Destinations in Maharashtra for Unforgettable Holiday Stays
            </h2>
            <p className="text-sm md:text-base text-text-primary/75 leading-relaxed font-light">
              Finding the ideal holiday escape requires a balance of scenic natural surroundings, exclusive solitude, and world-class hospitality. Across the Western Ghats and coastal stretches, villa destinations in maharashtra have emerged as the leading choice for discerning travelers seeking luxury holiday rentals. Whether you are planning a weekend getaway with family, celebrating a milestone anniversary, or organizing a peaceful corporate retreat, Stay Willas offers handpicked luxury sanctuaries across top regional locations. From mountain sanctuaries perched high in hill stations to tranquil coastal retreats near the Arabian Sea, our curated collection provides an unmatched hospitality experience tailored to your precise desires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="bg-bg-primary p-8 rounded-3xl border border-[#1B3564]/10 space-y-4">
              <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
                Villas in Lonavala with Private Pool for Corporate & Family Breaks
              </h2>
              <p className="text-xs sm:text-sm text-text-primary/70 leading-relaxed font-light">
                When travelers plan a mountain getaway from Mumbai or Pune, Lonavala remains the undisputed favorite destination. Booking villas in lonavala with private pool provides complete solitude away from crowded commercial resorts, allowing families and friend groups to unwind in total comfort. Our properties in Lonavala feature temperature-regulated swimming pools, expansive manicured lawns, open-air dining pavilions, and dedicated house staff. Guests can start their morning with a warm cup of freshly brewed coffee while looking over misty Sahyadri valleys, spend afternoons relaxing by their swimming pool, and enjoy evening barbecues under starry skies.
              </p>
              <p className="text-xs sm:text-sm text-text-primary/70 leading-relaxed font-light">
                Furthermore, these exclusive properties are situated in quiet, secure residential enclaves close to popular sightseeing spots like Tiger Point, Bhushi Dam, and Karla Caves. This proximity ensures effortless access to local attractions while keeping your getaway completely secluded from city noise and tourist traffic.
              </p>
            </div>

            <div className="bg-bg-primary p-8 rounded-3xl border border-[#1B3564]/10 space-y-4">
              <h3 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
                Discovering Luxury Villas in Lonavala with Customized Concierge Service
              </h3>
              <p className="text-xs sm:text-sm text-text-primary/70 leading-relaxed font-light">
                For those seeking an elevated vacation experience, luxury villas in lonavala deliver an extraordinary blend of modern architectural design and personalized hospitality. Every luxury property in our collection is outfitted with plush designer furnishings, floor-to-ceiling glass windows framing panoramic mountain views, high-speed fiber-optic internet, en-suite bathrooms, and state-of-the-art entertainment systems.
              </p>
              <p className="text-xs sm:text-sm text-text-primary/70 leading-relaxed font-light">
                To ensure complete peace of mind, every booking at our premier retreats includes a dedicated stay concierge who oversees every aspect of your staycation. From organizing resident chef services preparing authentic local cuisine to coordinating airport transfers, bonfire arrangements, and poolside setup, our goal is to deliver five-star hotel luxury combined with the intimacy of a dedicated home.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Why Choose Coastal & Mountain Stays Across Regional Destinations?
            </h3>
            <p className="text-xs sm:text-sm text-text-primary/75 leading-relaxed font-light">
              The Western Ghats and coastal regions of Maharashtra offer a rich diversity of geography, making this region one of India's most attractive choices for luxury rentals. Exploring different holiday destinations in maharashtra allows travelers to experience distinct microclimates and landscapes throughout the year:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-text-primary/80 pt-2 font-light">
              <li className="bg-white p-4 rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block font-bold mb-1">1. Lonavala & Khandala</strong>
                Renowned for green hillsides, monsoon waterfalls, and cool mountain air throughout the year. Perfect for quick drive-away getaways from Mumbai.
              </li>
              <li className="bg-white p-4 rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block font-bold mb-1">2. Khopoli</strong>
                Nestled at the foothills of the Sahyadri range, offering secluded green valleys, cascading streams, and close proximity to popular theme parks and nature trails.
              </li>
            </ul>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Essential Amenities Included in Every Luxury Sanctuary
            </h3>
            <p className="text-xs sm:text-sm text-text-primary/75 leading-relaxed font-light">
              When you book an exclusive estate through Stay Willas, you enjoy top-tier amenities designed for comfort, safety, and convenience:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-bg-primary border border-border-subtle">
                <h4 className="font-bold text-[#1B3564] text-sm mb-1">Private Swimming Pools</h4>
                <p className="text-xs text-text-primary/70 font-light">Clean, well-maintained pools reserved exclusively for your group, complete with lounger decks and pool floaters.</p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-primary border border-border-subtle">
                <h4 className="font-bold text-[#1B3564] text-sm mb-1">In-House Chef Options</h4>
                <p className="text-xs text-text-primary/70 font-light">Talented resident cooks capable of preparing custom meal plans, including vegetarian delicacies, seafood specialties, and kids' menus.</p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-primary border border-border-subtle">
                <h4 className="font-bold text-[#1B3564] text-sm mb-1">24/7 Power & Security</h4>
                <p className="text-xs text-text-primary/70 font-light">Gated premises with round-the-clock security personnel, safe parking facilities, and high-capacity power backup.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1B3564] text-white p-8 md:p-10 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-xl md:text-2xl font-heading font-bold">
              Plan Your Escape Across Top Regional Holiday Spots
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              Whether you are seeking a weekend retreat surrounded by monsoon waterfalls or a sun-drenched beach home, our platform makes finding your dream vacation simple and transparent. Browse through verified listings, view detailed photo galleries, check available dates, and speak directly with our concierge team to reserve your stay. Every stay is managed with extreme care to guarantee safety, privacy, and seamless comfort for you and your guests. Selecting from curated villa destinations in maharashtra ensures that every getaway feels unique, refreshing, and deeply memorable.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Frequently Asked Questions About Planning Luxury Stays
            </h3>
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-2">
                <h4 className="font-bold text-sm text-[#1B3564]">Q: How do I book an exclusive stay through Stay Willas?</h4>
                <p className="text-xs text-text-primary/70 font-light leading-relaxed">
                  A: You can browse our verified listings online, select your preferred location and dates, and connect directly with our reservations team via WhatsApp or phone call for instant booking confirmation and personalized assistance.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-2">
                <h4 className="font-bold text-sm text-[#1B3564]">Q: Are pool properties suitable for large family gatherings and events?</h4>
                <p className="text-xs text-text-primary/70 font-light leading-relaxed">
                  A: Yes! Our luxury properties range from cozy 3 BHK retreats to expansive 5+ BHK estates capable of hosting intimate celebrations, pre-wedding gatherings, and corporate team outings comfortably.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-2">
                <h4 className="font-bold text-sm text-[#1B3564]">Q: What safety and cleanliness measures are maintained?</h4>
                <p className="text-xs text-text-primary/70 font-light leading-relaxed">
                  A: Every property undergoes thorough cleaning, sanitization, and linen replacement before guest arrival. Swimming pool water parameters are checked daily to ensure optimal hygiene.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

