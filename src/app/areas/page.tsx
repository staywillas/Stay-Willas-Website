import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ArrowUpRight, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";
import Link from "next/link";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Weekend Getaway Villas Near Mumbai | Private Pool Destinations | Stay Willas",
  description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala & Khopoli. Book verified luxury staycations with in-house chef service.",
  keywords: ["weekend getaway villas near mumbai", "private pool destinations"],
  alternates: {
    canonical: "https://www.staywillas.com/areas",
  },
  openGraph: {
    title: "Weekend Getaway Villas Near Mumbai | Private Pool Destinations | Stay Willas",
    description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala & Khopoli. Book verified luxury staycations with in-house chef service.",
    url: "https://www.staywillas.com/areas",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekend Getaway Villas Near Mumbai | Private Pool Destinations | Stay Willas",
    description: "Explore weekend getaway villas near Mumbai with private pool destinations across Lonavala & Khopoli. Book verified luxury staycations with in-house chef service.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
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
  
  const areas = [
    {
      slug: "lonavala",
      name: "The Angle House (Lonavala)",
      tagline: "The Mountain Sanctuary",
      desc: "Cool mountain breeze, misty green valleys, and spacious private pool villas perched on lush hills.",
      image: "/assets/villas/the-angle-house/gallery-11.webp",
      count: lonavalaCount,
      isLaunchingSoon: lonavalaCount === 0,
      link: "/villa/the-angle-house"
    },
    {
      slug: "khopoli",
      name: "Canopy Crest (Khopoli)",
      tagline: "The Nature Escape",
      desc: "Beautiful seasonal waterfalls, green Sahyadri hills, and quiet private pool getaways.",
      image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      count: khopoliCount,
      isLaunchingSoon: khopoliCount === 0,
      link: "/villa/canopy-crest"
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
                      View Details & Book
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

        {/* SEO Content Section with 3-Column Desktop Layout */}
        <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px] mx-auto w-full border-t border-[#DAA520]/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT SIDEBAR: Area Switcher */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DAA520]/15">
                  <MapPin className="text-accent-primary w-5 h-5" />
                  <h3 className="font-heading font-bold text-[#1B3564] text-lg">Active Locations</h3>
                </div>
                <div className="space-y-2.5">
                  <Link href="/areas/lonavala" className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1B3564] font-medium text-sm transition-all border border-[#DAA520]/15">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
                      Lonavala
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-[#DAA520] text-[#1B3564] px-2.5 py-1 rounded-full">Available</span>
                  </Link>

                  <Link href="/areas/khopoli" className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1B3564] font-medium text-sm transition-all border border-[#DAA520]/15">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Khopoli
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Available</span>
                  </Link>

                  {[
                    { name: "Pawna Lake", slug: "pawna" }
                  ].map((area) => (
                    <Link key={area.slug} href={`/areas/${area.slug}`} className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white text-slate-600 font-normal text-sm transition-all border border-slate-200/60">
                      <span>{area.name}</span>
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
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> Pet-Friendly Lawns</li>
                </ul>
              </div>
            </aside>

            {/* CENTER COLUMN: Main SEO Article with Larger Text */}
            <main className="lg:col-span-6 bg-white/95 rounded-3xl p-6 sm:p-10 md:p-12 border border-[#DAA520]/15 shadow-sm">
              <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-accent-secondary prose-h3:font-heading prose-h3:text-xl prose-a:text-accent-primary">
                <h2>Weekend Getaway Villas Near Mumbai & Pune</h2>
                <p>
                  Are you tired of the repetitive city routine and seeking a relaxing break close to home? Finding luxury <strong>weekend getaway villas</strong> has become the preferred choice for discerning travelers who want to escape traffic, noise, and pollution. Whether it is a quick family gathering or a private pool party with friends, booking independent <strong>private pool rentals</strong> near Mumbai and Pune provides the perfect solution. You get the space, privacy, and specialized concierge services that traditional hotels simply cannot deliver. Our homes are built to offer you a home away from home.
                </p>
                <p>
                  Our carefully curated portfolio highlights premium properties in the most scenic locations of Maharashtra. From the misty heights of Lonavala to the serene base of the Sahyadri mountains in Khopoli, we offer a diverse selection of <strong>villas near mumbai</strong> to match every group's requirement. If you are a resident of Pune looking to beat the summer heat, our properties act as the ultimate collection of <strong>villas near pune</strong>, offering cool, temperature-controlled private pools and spacious lawns. Each villa is checked for safety, hygiene, and luxury standards before your arrival.
                </p>
                <p>
                  What makes renting private <strong>villas near mumbai</strong> so popular is the travel time. You don't need to book plane tickets or plan weeks in advance. You can simply load your bags into the car on a Friday afternoon and arrive at your private sanctuary within 1.5 to 2 hours. Similarly, Pune residents have easy access to these getaways via the Mumbai-Pune Expressway, making our <strong>villas near pune</strong> highly accessible for weekend retreats. It makes it incredibly easy to arrange spontaneous family reunions or weekend get-togethers without heavy travel stress.
                </p>
                <p>
                  Furthermore, these holiday homes are fully staffed with professional estate managers and private chefs. When you choose our <strong>villas near mumbai</strong>, you get to customize your menus, set your own schedules, and enjoy standard luxury amenities like high-speed Wi-Fi, private pools, and custom bonfire lawns. For teams looking to align their goals in a relaxed environment, these <strong>villas near pune</strong> also double as high-end corporate retreats, offering spacious meeting areas and recreational facilities. You can host workshops in the afternoon and relax by the poolside bar in the evening.
                </p>
                <p>
                  In addition, pet owners will find our collection highly appealing, as many of these properties offer large fenced lawns and pet-friendly policies. Your pets can enjoy the open space just as much as you do. Browse our premium locations today, find the destination that fits your group, and secure your upcoming staycation. Whether you want a lush group estate in Khopoli or an architectural mountain sanctuary in Lonavala, we have the ideal properties ready for your arrival. We are constantly expanding our listings to provide you with the most luxurious options available.
                </p>
              </article>
            </main>

            {/* RIGHT SIDEBAR: Quick Booking Inquiry Panel */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#DAA520]/15 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-secondary">Instant Villa Booking</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">2 Destinations</span>
                </div>
                
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Select an active location below to view verified villas or chat directly with our concierge team:
                </p>

                <div className="space-y-3 pt-1">
                  <Link 
                    href="/areas/lonavala" 
                    className="flex items-center justify-between w-full bg-[#1B3564] hover:bg-[#0F2142] text-white p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Lonavala — The Angle House</span>
                    <ArrowUpRight size={16} className="text-[#DAA520]" />
                  </Link>

                  <Link 
                    href="/areas/khopoli" 
                    className="flex items-center justify-between w-full bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Khopoli — Canopy Crest</span>
                    <ArrowUpRight size={16} className="text-emerald-200" />
                  </Link>
                </div>

                <div className="pt-2 border-t border-[#DAA520]/15">
                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20a%20private%20pool%20villa" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] text-center text-xs font-bold uppercase tracking-wider py-3.5 rounded-2xl shadow-sm transition-all"
                  >
                    <PhoneCall size={14} /> WhatsApp Reservation
                  </a>
                </div>
              </div>

              {/* Quick Inquiry Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-heading font-bold text-[#1B3564] text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-accent-primary" /> Group Villa Inquiry
                </h4>
                <p className="text-xs text-slate-600 font-light">
                  Tell us your dates and preferred destination for a custom quote:
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Target Area</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#1B3564]">
                      <option>Lonavala (1 Villa Available)</option>
                      <option>Khopoli (1 Villa Available)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Group Size</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#1B3564]">
                      <option>4 - 8 Guests</option>
                      <option>8 - 12 Guests</option>
                      <option>12 - 20+ Guests</option>
                    </select>
                  </div>
                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20need%20a%20villa%20recommendation" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#1B3564] hover:bg-[#0F2142] text-white font-bold text-xs uppercase tracking-wider text-center py-3.5 rounded-xl transition-colors"
                  >
                    Request Custom Quote
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
