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
  title: "Weekend Getaway Villas | Private Pool Rentals | Stay Willas",
  description: "Explore premium weekend getaway villas with private pools near Mumbai and Pune. Rent handpicked private pool rentals in Lonavala, Alibaug, and Karjat.",
  keywords: ["weekend getaway villas", "private pool rentals"],
  alternates: {
    canonical: "https://www.staywillas.com/areas",
  },
};

export default async function AreasPage() {
  // Dynamically count active luxury retreats in each region from the database
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

  const areas = [
    {
      slug: "lonavala",
      name: "Lonavala",
      tagline: "The Mountain Sanctuary",
      desc: "Cool mountain breeze, misty green valleys, and spacious private pool villas perched on lush hills.",
      image: "/assets/villas/the-angle-house/gallery-11.webp",
      count: lonavalaCount,
      isLaunchingSoon: lonavalaCount === 0
    },
    {
      slug: "khopoli",
      name: "Khopoli",
      tagline: "The Nature Escape",
      desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet private pool getaways.",
      image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      count: khopoliCount,
      isLaunchingSoon: khopoliCount === 0
    },
    {
      slug: "alibaug",
      name: "Alibaug",
      tagline: "The Coastal Getaway",
      desc: "Beautiful coconut trees, quiet sandy beaches, and modern villas just a scenic catamaran ferry ride away from Mumbai.",
      image: "/assets/villas/alibaug-palms-beachhouse/main.jpg",
      count: alibaugCount,
      isLaunchingSoon: alibaugCount === 0
    },
    {
      slug: "karjat",
      name: "Karjat",
      tagline: "The Riverside Escape",
      desc: "Lovely green valleys, quiet flowing streams, and peaceful villas built for complete relaxation in nature.",
      image: "/assets/villas/heritage-villa/main.jpg",
      count: karjatCount,
      isLaunchingSoon: karjatCount === 0
    },
    {
      slug: "goa",
      name: "Goa",
      tagline: "The Beach Paradise",
      desc: "Sunny beaches, beautiful old Portuguese-style homes, and warm private pool villas.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
      count: 0,
      isLaunchingSoon: true
    },
    {
      slug: "igatpuri",
      name: "Igatpuri",
      tagline: "The Misty Hills",
      desc: "Gorgeous lake views, foggy mountain peaks, and peaceful hillside villas.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
      count: 0,
      isLaunchingSoon: true
    }
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
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
          
          <p className="text-text-primary/70 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
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
                    <p className="text-text-primary/60 text-xs sm:text-sm leading-relaxed font-light">
                      {area.desc}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0 text-left">
                  {!area.isLaunchingSoon ? (
                    <Link
                      href={`/areas/${area.slug}`}
                      className="inline-flex items-center justify-between w-full bg-[#1B3564] hover:bg-[#152A50] text-white rounded-2xl px-5 py-3.5 text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-300 group-hover:scale-[1.02]"
                    >
                      Explore {area.name} Stays
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

        {/* SEO Content Section */}
        <section className="py-20 px-6 md:px-12 bg-white border-t border-[#DAA520]/15 w-full">
          <div className="max-w-4xl mx-auto prose text-left">
            <h2>Weekend Getaway Villas Near Mumbai & Pune</h2>
            <p>
              Are you tired of the repetitive city routine and seeking a relaxing break close to home? Finding luxury <strong>weekend getaway villas</strong> has become the preferred choice for discerning travelers who want to escape traffic, noise, and pollution. Whether it is a quick family gathering or a private pool party with friends, booking independent <strong>private pool rentals</strong> near Mumbai and Pune provides the perfect solution. You get the space, privacy, and specialized concierge services that traditional hotels simply cannot deliver. Our homes are built to offer you a home away from home.
            </p>
            <p>
              Our carefully curated portfolio highlights premium properties in the most scenic locations of Maharashtra. From the misty heights of Lonavala and the serene base of the Sahyadri mountains in Khopoli, to the quiet coastal breezes of Alibaug and the riverside farmhouses in Karjat, we offer a diverse selection of <strong>villas near mumbai</strong> to match every group's requirement. If you are a resident of Pune looking to beat the summer heat, our properties act as the ultimate collection of <strong>villas near pune</strong>, offering cool, temperature-controlled private pools and spacious lawns. Each villa is checked for safety, hygiene, and luxury standards before your arrival.
            </p>
            <p>
              What makes renting private <strong>villas near mumbai</strong> so popular is the travel time. You don't need to book plane tickets or plan weeks in advance. You can simply load your bags into the car on a Friday afternoon and arrive at your private sanctuary within 1.5 to 2 hours. Similarly, Pune residents have easy access to these getaways via the Mumbai-Pune Expressway, making our <strong>villas near pune</strong> highly accessible for weekend retreats. It makes it incredibly easy to arrange spontaneous family reunions or weekend get-togethers without heavy travel stress.
            </p>
            <p>
              Furthermore, these holiday homes are fully staffed with professional estate managers and private chefs. When you choose our <strong>villas near mumbai</strong>, you get to customize your menus, set your own schedules, and enjoy standard luxury amenities like high-speed Wi-Fi, private pools, and custom bonfire lawns. For teams looking to align their goals in a relaxed environment, these <strong>villas near pune</strong> also double as high-end corporate retreats, offering spacious meeting areas and recreational facilities. You can host workshops in the afternoon and relax by the poolside bar in the evening.
            </p>
            <p>
              In addition, pet owners will find our collection highly appealing, as many of these properties offer large fenced lawns and pet-friendly policies. Your pets can enjoy the open space just as much as you do. Browse our premium locations today, find the destination that fits your group, and secure your upcoming staycation. Whether you want a beachside villa in Alibaug or a mountain sanctuary in Lonavala, we have the ideal properties ready for your arrival. We are constantly expanding our listings to provide you with the most luxurious options available.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
