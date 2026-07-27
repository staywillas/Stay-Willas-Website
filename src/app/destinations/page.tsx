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
  title: "Luxury Villa Destinations | Lonavala, Khopoli & More | Stay Willas",
  description: "Discover premium luxury villa rentals across top destinations in Maharashtra including Lonavala, Khopoli, Alibaug, and Karjat. Find your perfect getaway.",
  keywords: ["Stay Willas destinations", "villas in lonavla", "luxury villas in khopoli"],
  alternates: {
    canonical: "/destinations",
  },
  openGraph: {
    title: "Luxury Villa Destinations | Lonavala, Khopoli & More | Stay Willas",
    description: "Discover premium luxury villa rentals across top destinations in Maharashtra including Lonavala, Khopoli, Alibaug, and Karjat. Find your perfect getaway.",
    url: "https://www.staywillas.com/destinations",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Stay Willas Destinations",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villa Destinations | Lonavala, Khopoli & More | Stay Willas",
    description: "Discover premium luxury villa rentals across top destinations in Maharashtra including Lonavala, Khopoli, Alibaug, and Karjat. Find your perfect getaway.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default async function DestinationsPage() {
  // Dynamically count active luxury retreats in each region from live Supabase DB
  const lonavalaCount = await prisma.villa.count({
    where: { location: { contains: "Lonavala", mode: "insensitive" } }
  });
  
  const alibaugCount = await prisma.villa.count({
    where: { location: { contains: "Alibaug", mode: "insensitive" } }
  });

  const karjatCount = await prisma.villa.count({
    where: { location: { contains: "Karjat", mode: "insensitive" } }
  });

  const khopoliCount = await prisma.villa.count({
    where: { location: { contains: "Khopoli", mode: "insensitive" } }
  });

  const destinations = [
    {
      name: "Lonavala",
      tagline: "The Mountain Sanctuary",
      desc: "Cool mountain breeze, misty green valleys, and spacious private pool villas perched on lush hills.",
      image: "/assets/villas/the-angle-house/gallery-11.webp",
      count: lonavalaCount,
      isLaunchingSoon: lonavalaCount === 0
    },
    {
      name: "Khopoli",
      tagline: "The Nature Escape",
      desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet private pool getaways.",
      image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      count: khopoliCount,
      isLaunchingSoon: khopoliCount === 0
    },
    {
      name: "Alibaug",
      tagline: "The Coastal Getaway",
      desc: "Beautiful coconut trees, quiet sandy beaches, and modern villas just a scenic catamaran ferry ride away from Mumbai.",
      image: "/assets/villas/alibaug-palms-beachhouse/main.jpg",
      count: alibaugCount,
      isLaunchingSoon: alibaugCount === 0
    },
    {
      name: "Karjat",
      tagline: "The Riverside Escape",
      desc: "Lovely green valleys, quiet flowing streams, and peaceful villas built for complete relaxation in nature.",
      image: "/assets/villas/heritage-villa/main.jpg",
      count: karjatCount,
      isLaunchingSoon: karjatCount === 0
    },
    {
      name: "Goa",
      tagline: "The Beach Paradise",
      desc: "Sunny beaches, beautiful old Portuguese-style homes, and warm private pool villas.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
      count: "LAUNCHING SOON",
      isLaunchingSoon: true
    },
    {
      name: "Igatpuri",
      tagline: "The Misty Hills",
      desc: "Gorgeous lake views, foggy mountain peaks, and peaceful hillside villas.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
      count: "LAUNCHING SOON",
      isLaunchingSoon: true
    }
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-32 pb-10 sm:pt-36 sm:pb-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center flex flex-col items-center overflow-hidden">
        {/* Background Soft Glow for Premium Aesthetic - Optimized for mobile GPU */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#1B3564]/10 to-[#2563EB]/10 rounded-full blur-2xl md:blur-[80px] pointer-events-none -z-10" />
        
        <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
          Our Stays
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading leading-tight mb-1 tracking-tight">
          Luxury Villa <span className="italic text-accent-primary font-serif">Destinations</span>
        </h1>
        
        {/* Custom Luxury Elegant Divider */}
        <div className="flex items-center gap-4 my-4 w-full max-w-[200px]">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#2563EB]/40" />
          <div className="w-1.5 h-1.5 rounded-sm border border-accent-primary bg-bg-primary rotate-45 flex-shrink-0" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#2563EB]/40" />
        </div>
        
        <p className="text-text-primary/70 text-xs sm:text-base leading-relaxed max-w-2xl font-light">
          We choose our locations very carefully. Every place we offer is selected to give you a perfect and relaxing getaway.
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
                    href={`/villas?region=${dest.name.toLowerCase()}`}
                    className="inline-flex items-center gap-3 group/link"
                  >
                    <span className="w-12 h-12 rounded-full border border-[#0F172A]/20 flex items-center justify-center group-hover/link:bg-accent-primary group-hover/link:border-accent-primary group-hover/link:text-white transition-all">
                      <ArrowUpRight size={18} />
                    </span>
                    <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Explore {dest.count} {dest.count === 1 ? "Villa" : "Villas"}</span>
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

      <Footer />
    </main>
  );
}
