import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { ChevronRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Karjat Villa with Pool Booking | Stay Willas",
  description: "Secure your Karjat villa with pool booking for family farmstays, corporate offsites, and weekend getaways. Enjoy private chef services & pools. Book now.",
  keywords: [
    "Karjat villa with pool booking",
    "corporate offsite villa Karjat",
    "Stay Willas"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/karjat",
  },
};

export default async function KarjatPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Karjat",
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
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Stay Willas — Karjat Villas",
              "description": "Premium pet-friendly private pool villas in Karjat, Maharashtra. Riverside countryside estates with chef services for corporate offsites and family weekends.",
              "url": "https://www.staywillas.com/areas/karjat",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Karjat",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.9105",
                "longitude": "73.3243"
              },
              "priceRange": "₹₹₹",
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "Private Pool", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Pet Friendly", "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Riverside Location", "value": true }
              ]
            })
          }}
        />
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/heritage-villa/main.jpg" 
              alt="Luxury private pool villa in Karjat by StayWillas"
              fill
              priority
              className="object-cover opacity-20 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/90 via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas" className="hover:text-accent-primary transition-colors">Areas</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Karjat</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              The Riverside Escape
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-none tracking-tight mb-6">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light">Karjat</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Tired of the commercialized hill stations? Karjat offers sprawling organic farms, untouched riversides, and massive luxury villas built for ultimate tranquility.
            </p>
          </div>
        </section>

        {/* Content & Villas Layout */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Long-form SEO Content */}
          <article className="lg:w-1/2 prose prose-invert prose-p:text-text-primary/70 prose-h2:text-text-primary prose-h2:font-heading prose-h2:text-3xl prose-h3:text-text-primary prose-a:text-accent-primary">
              <h2>What Makes private estates Special?</h2>
              <p>
                If you are looking for a weekend escape that is quiet, green, and completely peaceful, renting luxury properties is the ultimate choice. Unlike the steep, tightly packed hills of Lonavala, Karjat is spread out across a wide, fertile valley bordered by the Ulhas river and the Bhimashankar mountain range. This unique geography allows for something you rarely find elsewhere: absolutely massive luxury farmhouses. When you choose our premium retreats, you aren't just getting a house; you are often getting acres of private, manicured land all to yourself.
              </p>
              <p>
                Our luxury holiday homes lean heavily into the "farm-stay" aesthetic, but elevated to five-star standards. Picture exposed brickwork, massive vaulted wooden ceilings, and wrap-around verandas that look out over private mango orchards. The pools in our vacation rentals are extraordinary. Because there are no space constraints, many of our properties boast massive infinity pools that overlook the river or the surrounding paddy fields. When you rent private sanctuaries, you experience nature at its finest. If you'd like to book our featured property, you can view <Link href="/villa/karjat-heritage" className="underline text-accent-primary font-bold">Heritage Villa</Link> online.
              </p>

              <div className="my-8 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/heritage-villa/gallery-2.jpg" 
                  alt="Luxury private pool villa in Karjat by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>A Paradise for Pet Owners in exclusive villas</h2>
              <p>
                Furthermore, Karjat is renowned for being incredibly pet-friendly. If you are a pet owner living in a cramped city apartment, renting sprawling villa properties with fully fenced lawns is a dream come true for your furry friend. They can run off-leash for hours while you relax by the pool. Our pet-friendly getaway rentals are designed to keep both you and your pets safe and comfortable throughout your weekend stay.
              </p>
              <p>
                More and more travelers choose private estates because they want to disconnect from technology and connect with family. Our curated collection of luxury properties features homes with indoor game rooms, table tennis, board games, and outdoor sports setups, ensuring that there is never a dull moment. Whether it's a family reunion or a group of friends, booking premium retreats guarantees a memorable holiday. Browse our <Link href="/areas" className="underline text-accent-primary font-bold">booking categories directory</Link> to compare destinations.
              </p>
              <p>
                In addition, the climate here is wonderful. Even during the warmer summer months, the evenings at our holiday homes are pleasant, with cool mountain breezes flowing down the valleys. This makes the private lawns of our vacation rentals the perfect place to sit back, sip a drink, and stargaze.
              </p>

              <h3>The Culinary Experience in private sanctuaries</h3>
              <p>
                A huge part of the experience of renting exclusive villas is the food. The region is known for its incredible organic farming. Many of our private chefs working at these Villas in Karjat source their vegetables directly from the local farms or even from the villa's own backyard garden.
              </p>
              <ul>
                <li><strong>Authentic Maharashtrian Feasts:</strong> Enjoy piping hot Bhakri, fiery Kolhapuri mutton, and fresh Pithla cooked straight off a traditional chulha at our Villas in Karjat.</li>
                <li><strong>Barbecues Under the Stars:</strong> The night sky in Karjat is surprisingly clear. We highly recommend utilizing the outdoor barbecue pits that come standard with our premium Villas in Karjat.</li>
              </ul>

              <h2>Adventure and Exploration near Villas in Karjat</h2>
              <p>
                While our Villas in Karjat are perfect for a lazy weekend reading a book on a porch swing, the area is also a haven for soft adventure. During the monsoon, the Ulhas River becomes a hotspot for white water rafting—a thrilling experience just minutes from your chosen Villas in Karjat. The area is also famous for trekking, making our holiday homes a popular choice for active travelers.
              </p>
              <p>
                The trek to the Kondana Caves is relatively easy and incredibly scenic, taking you past several small waterfalls. If you want something more challenging near your properties, the hike up to Kothaligad (Peth Fort) offers panoramic views of the entire valley. Returning to your private pool after a long day of trekking is an experience that makes renting Villas in Karjat worth every penny.
              </p>

              <div className="my-8 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/heritage-villa/gallery-3.jpg" 
                  alt="Riverside gardens at private pool villa in Karjat by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Choosing Your Ideal Sanctuary in Villas in Karjat</h2>
              <p>
                Whether you want a modern villa with glass walls and minimalist styling or a rustic brick farmhouse with old-world charm, we have the perfect options in our catalog of Villas in Karjat. Each of our holiday homes has been handpicked for its location, design, and premium amenities.
              </p>
              <p>
                Our booking process is simple, and our concierge team is always available to help you plan your meals, organize transport, and arrange local guides. Choose to stay at our exclusive holiday estates for a holiday that combines rustic countryside charm with five-star luxury. We look forward to welcoming you to our premium Villas in Karjat.
              </p>

              <h2>Frequently Asked Questions About Staying in Karjat</h2>
              <p>
                To help you make the right choice, we have answered the most common questions about booking Villas in Karjat:
              </p>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Do the Villas in Karjat have power back-up?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, all of our premium Villas in Karjat are equipped with heavy-duty generator back-up systems to ensure that your air conditioning, lights, and Wi-Fi run smoothly.
                  </p>
                </div>
              </div>
            </article>

              {/* Internal Blog Links */}
              <div className="mt-10 p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15">
                <h3 className="text-lg font-heading text-[#1B3564] font-bold mb-4">Related Guides</h3>
                <ul className="space-y-3 text-sm text-slate-700 font-light">
                  <li>→ <Link href="/blog/best-time-to-visit-karjat-for-a-villa-stay" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Best Time to Visit Karjat for a Villa Stay</Link></li>
                  <li>→ <Link href="/blog/pet-friendly-villa-rules-near-mumbai-what-to-know" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Pet-Friendly Villa Rules Near Mumbai — What to Know Before You Book</Link></li>
                </ul>
              </div>

          {/* Right Column: Villa Grid */}
          <div className="lg:w-1/2">
            <div className="sticky top-32">
              <h3 className="text-2xl font-heading mb-6 flex items-center justify-between border-b border-[#DAA520]/20 pb-4">
                Available Villas in Karjat
                <span className="text-xs font-sans font-bold bg-[#1B3564] text-white px-3 py-1 rounded-full">
                  {villas.length} Stays
                </span>
              </h3>
              
              {villas.length === 0 ? (
                 <div className="bg-[#FAF8F5]/50 border border-[#DAA520]/15 rounded-2xl p-8 text-center">
                   <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Karjat inventory.</p>
                   <Link href="/areas" className="text-[#1B3564] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:text-accent-primary">
                     <ArrowLeft size={16} /> View other areas
                   </Link>
                 </div>
              ) : (
                <div className="flex flex-col gap-6 max-h-[1200px] overflow-y-auto pr-2 pb-10 custom-scrollbar">
                  {villas.map((villa) => (
                    <div key={villa.id} className="transform transition duration-300 hover:-translate-y-1">
                      <VillaCard 
                        id={villa.id}
                        name={villa.name}
                        location={villa.location}
                        image={villa.image}
                        price={villa.price}
                        guests={villa.guests}
                        bedrooms={villa.bedrooms}
                        bathrooms={villa.bathrooms}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Navigation for SEO flow */}
        <section className="py-12 border-t border-[#DAA520]/10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-primary/40 mb-1">
                Explore Other Destinations
              </h4>
              <p className="text-xs text-text-primary/60 font-light">
                Discover luxury escapes in other premium areas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/areas/lonavala" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Lonavala</Link>
              <Link href="/areas/khopoli" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Khopoli</Link>
              <Link href="/areas/alibaug" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Alibaug</Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
