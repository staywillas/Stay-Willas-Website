import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowUpRight, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";
import Link from "next/link";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { prisma } from "@/lib/db";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Weekend Getaway Villas Near Mumbai & Pune | Stay Willas",
  description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala, Khopoli & Mahabaleshwar. Book verified private estates with in-house chef service.",
  keywords: ["weekend getaway villas near mumbai", "private pool destinations", "villas in lonavala", "villas in khopoli", "villas in mahabaleshwar"],
  alternates: {
    canonical: "https://www.staywillas.com/areas",
  },
  openGraph: {
    title: "Weekend Getaway Villas Near Mumbai & Pune | Stay Willas",
    description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala, Khopoli & Mahabaleshwar. Book verified private estates with in-house chef service.",
    url: "https://www.staywillas.com/areas",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekend Getaway Villas Near Mumbai & Pune | Stay Willas",
    description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala, Khopoli & Mahabaleshwar. Book verified private estates with in-house chef service.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default async function AreasPage() {
  // Dynamically count active luxury retreats in each region from the database
  const lonavalaCount = await prisma.villa.count({
    where: { location: { contains: "Lonavala", mode: "insensitive" } }
  });

  const khopoliCount = await prisma.villa.count({
    where: { location: { contains: "Khopoli", mode: "insensitive" } }
  });

  const mahabaleshwarCount = await prisma.villa.count({
    where: {
      OR: [
        { location: { contains: "Mahabaleshwar", mode: "insensitive" } },
        { location: { contains: "Panchgani", mode: "insensitive" } }
      ]
    }
  });
  
  const areas = [
    {
      slug: "lonavala",
      name: "Lonavala",
      tagline: "The Mountain Sanctuary",
      desc: "Cool mountain breeze, misty green valleys, and spacious private pool villas perched on lush Sahyadri hills.",
      image: "/assets/villas/the-angle-house/gallery-11.webp",
      count: lonavalaCount,
      isLaunchingSoon: lonavalaCount === 0,
      link: "/areas/lonavala"
    },
    {
      slug: "khopoli",
      name: "Khopoli",
      tagline: "The Nature Escape",
      desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet large-group private pool sanctuaries.",
      image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      count: khopoliCount,
      isLaunchingSoon: khopoliCount === 0,
      link: "/areas/khopoli"
    },
    {
      slug: "mahabaleshwar",
      name: "Mahabaleshwar & Panchgani",
      tagline: "The Strawberry Highland",
      desc: "Fresh strawberry plantations, tranquil valley viewpoints, and rustic terracotta architecture estates.",
      image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
      count: mahabaleshwarCount,
      isLaunchingSoon: mahabaleshwarCount === 0,
      link: "/areas/mahabaleshwar"
    }
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/areas#webpage`,
    url: `${BASE_URL}/areas`,
    name: "Weekend Getaway Villas & Areas | Stay Willas",
    description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala & Khopoli.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
      {/* Structured Data: CollectionPage & BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionSchema, breadcrumbSchema]),
        }}
      />
      <div>
        <Navbar />
        
        {/* Header Section */}
        <section className="relative pt-36 pb-12 sm:pt-40 sm:pb-16 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center flex flex-col items-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#1B3564]/10 to-[#2563EB]/10 rounded-full blur-2xl md:blur-[80px] pointer-events-none -z-10" />
          
          <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
            Locations
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-tight mb-2 tracking-tight">
            Weekend Getaway Villas & <span className="italic text-accent-primary font-serif font-light">Areas</span>
          </h1>
          
          <div className="flex items-center gap-4 my-4 w-full max-w-[200px]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#2563EB]/40" />
            <div className="w-1.5 h-1.5 rounded-sm border border-accent-primary bg-bg-primary rotate-45 flex-shrink-0" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#2563EB]/40" />
          </div>
          
          <p className="text-text-primary/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal mt-4">
            Targeting the most scenic locations across Maharashtra. Choose your escape from our carefully curated destinations.
          </p>
        </section>

        {/* Grid Section */}
        <section className="pb-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {areas.map((area) => (
              <div 
                key={area.slug}
                className="group relative bg-[#F5F2EA]/40 backdrop-blur-md rounded-3xl border border-[#DAA520]/15 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div>
                  {/* Image wrapper */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image 
                      src={area.image} 
                      alt={`${area.name} Luxury Villas`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
                    
                    {area.isLaunchingSoon ? (
                      <span className="absolute top-4 right-4 bg-accent-primary text-white font-bold tracking-widest text-[9px] uppercase px-3 py-1.5 rounded-full shadow-lg">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="absolute bottom-4 left-4 text-white text-xs font-bold tracking-wider uppercase bg-[#1B3564]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                        {area.count} {area.count === 1 ? "Villa" : "Villas"} Available
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 text-left">
                    <span className="text-accent-secondary text-[10px] tracking-[0.2em] uppercase font-bold mb-2 block">
                      {area.tagline}
                    </span>
                    <h2 className="text-2xl font-heading font-semibold text-text-primary mb-3">
                      {area.name}
                    </h2>
                    <p className="text-text-primary/60 text-sm sm:text-base leading-relaxed font-light">
                      {area.desc}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0 text-left">
                  {!area.isLaunchingSoon ? (
                    <Link
                      href={area.link}
                      className="inline-flex items-center justify-between w-full bg-[#1B3564] hover:bg-[#152A50] text-white rounded-2xl px-5 py-3.5 text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 group-hover:scale-[1.02]"
                    >
                      <span>Explore {area.name} Collection</span>
                      <ArrowUpRight size={16} className="text-accent-primary" />
                    </Link>
                  ) : (
                    <a
                      href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello! I'm interested in your upcoming locations in *${area.name}*. Please notify me when you list properties here.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full border border-[#1B3564]/30 hover:border-[#1B3564] text-[#1B3564] rounded-2xl px-5 py-3.5 text-xs font-bold tracking-wider uppercase transition-all duration-300"
                    >
                      Get Notified
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full-Width 4-Column Feature Highlights */}
        <section className="py-12 bg-white border-y border-[#DAA520]/20 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[10px] font-black text-[#DAA520] uppercase tracking-[0.25em] block mb-1">
                The Stay Willas Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564]">
                Private Weekend Retreats Near Mumbai & Pune
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">100% Private Pools</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Every villa features dedicated private swimming pools with zero shared access or public crowds.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">In-House Chef Dining</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Fresh Maharashtrian breakfast, live poolside barbecue, and dedicated pure-veg / Jain meal preparation.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 text-[#1B3564]">
                  <PhoneCall size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">24/7 Estate Concierge</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Dedicated on-site caretakers and personal trip coordination from check-in to check-out.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200 hover:border-[#DAA520]/40 transition-all shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-700">
                  <Calendar size={24} />
                </div>
                <h4 className="font-bold text-[#1B3564] text-base mb-1.5">Direct 0% Platform Fee</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  No middleman OTA booking fees. Direct rates and personalized group quotes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width SEO Article Section */}
        <section className="py-16 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#DAA520]/20 shadow-sm">
            <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h3:text-[#DAA520] prose-h3:font-heading prose-h3:text-xl prose-a:text-[#DAA520]">
              <h2>Weekend Getaway Villas Near Mumbai & Pune</h2>
              <p>
                Are you tired of the repetitive city routine and seeking a relaxing break close to home? Finding private <strong>weekend getaway villas</strong> has become the preferred choice for discerning travelers who want to escape traffic, noise, and pollution. Whether it is a quick family gathering or a private pool party with friends, booking independent <strong>private pool rentals</strong> near Mumbai and Pune provides the perfect solution. You get the space, privacy, and specialized concierge services that traditional hotels simply cannot deliver.
              </p>
              <p>
                Our carefully curated portfolio highlights premium properties in the most scenic locations of Maharashtra. From the misty heights of Lonavala to the serene base of the Sahyadri mountains in Khopoli and the strawberry highlands of Mahabaleshwar & Panchgani, we offer a diverse selection of private estates to match every group&apos;s requirement.
              </p>
              <p>
                What makes renting private villas near Mumbai so popular is the travel time. You don&apos;t need to book plane tickets or plan weeks in advance. You can simply load your bags into the car on a Friday afternoon and arrive at your private sanctuary within 1.5 to 2 hours via the Mumbai-Pune Expressway.
              </p>
            </article>

            {/* High-Converting Concierge Banner */}
            <div className="mt-12 bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0E1B35] rounded-3xl p-6 sm:p-10 text-white border border-[#DAA520]/40 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-left max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#DAA520] block mb-2">Direct Concierge Assistance</span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight">Need Help Choosing the Best Destination for Your Group?</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Tell us your dates, group size, and favorite vibe (hills, waterfall, large lawn) and our destination specialists will share tailored options instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I'd like help choosing a villa destination for my upcoming trip.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall size={15} />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
