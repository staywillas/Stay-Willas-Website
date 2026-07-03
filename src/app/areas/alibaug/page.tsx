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
  title: "Villa on Rent in Alibaug for Weekend | Stay Willas",
  description: "Rent a luxury beachfront villa in Alibaug for weekend getaways, bachelor parties, or birthday parties. Enjoy private pool, chef service & views. Book now.",
  keywords: [
    "villa on rent in Alibaug for weekend",
    "villa for birthday party Lonavala/Alibaug",
    "birthday party villa Alibaug",
    "bachelor party villa Alibaug",
    "Stay Willas"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/alibaug",
  },
};

export default async function AlibaugPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Alibaug",
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
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/alibaug-palms-beachhouse/main.jpg" 
              alt="Luxury private pool villa in Alibaug by StayWillas"
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
              <span className="text-text-primary font-bold">Alibaug</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              The Coastal Getaway
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-none tracking-tight mb-6">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light">Alibaug</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Just a breezy ferry ride from Mumbai lies the Hamptons of Maharashtra. Discover our curated collection of Alibaug's most breathtaking private pool villas, where coastal charm meets absolute luxury.
            </p>
          </div>
        </section>

        {/* Content & Villas Layout */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Long-form SEO Content */}
          <article className="lg:w-1/2 prose prose-invert prose-p:text-text-primary/70 prose-h2:text-text-primary prose-h2:font-heading prose-h2:text-3xl prose-h3:text-text-primary prose-a:text-accent-primary">
              <h2>The New Hamptons of Mumbai: Why Choose Villas in Alibaug</h2>
              <p>
                Not too long ago, traveling to Alibaug meant a grueling three-hour drive along the coastal highway. It was a beautiful drive, but exhausting for a quick weekend. Today, thanks to the massive Ro-Ro ferries and modern speedboats departing from the Gateway of India or Bhaucha Dhakka, you can leave the chaos of South Mumbai and step onto the serene shores of Mandwa within 60 minutes. This incredible accessibility has transformed the region. Choosing to rent private estates gives you an experience that rivals a high-end resort in Goa, but without the hassle of airports.
              </p>
              <p>
                This ease of travel has changed Alibaug. It is no longer just a rustic beach town; it has evolved into the ultimate coastal luxury destination. And at the heart of this transformation is the rise of the ultra-premium private pool estates. Renting Villas in Alibaug gives you complete privacy, massive green lawns, and direct beach access in many of our properties. Our curated catalog of luxury properties contains something for everyone, from cozy couple retreats to massive multi-acre group stays. If you want to check out our featured estate, view <Link href="/villa/alibaug-palms-beachhouse" className="underline text-accent-primary font-bold">Alibaug Palms Beachhouse</Link> directly.
              </p>

              <div className="my-8 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/alibaug-palms-beachhouse/gallery-2.jpg" 
                  alt="Luxury private pool villa in Alibaug by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Coastal Living, Elevated in Villas in Alibaug</h2>
              <p>
                When you book one of our Alibaug properties, you aren't just renting a house—you are securing a private tropical oasis. Think massive coconut groves, hammocks swaying in the sea breeze, and striking modern architecture that blends seamlessly into the Konkan landscape. Booking private premium retreats guarantees an uninterrupted holiday with your loved ones.
              </p>
              <p>
                Many of our curated Villas in Alibaug feature spectacular al fresco dining areas. There is nothing quite like having your private chef prepare a fresh, locally sourced seafood barbecue (the Pomfret and Prawns here are legendary) while you dine under the stars by your illuminated swimming pool. It is the perfect setting for milestone birthdays, intimate anniversary celebrations, or simply unwinding with a group of close friends when you rent exclusive holiday homes.
              </p>
              <p>
                Indeed, luxury Villas in Alibaug offer a sense of relaxation that hotels cannot match. You can wake up at noon, swim in your private pool at midnight, and enjoy customized meals. This freedom is why families return to our vacation rentals year after year.
              </p>

              <h3>The Villa Selection</h3>
              <p>
                Alibaug's villa landscape is incredibly diverse. Based on what you're looking for, we can match you with the perfect property from our selection of Villas in Alibaug:
              </p>
              <ul>
                <li><strong>The Beachside Retreats:</strong> private sanctuaries located near Nagaon or Kihim beach, where you can hear the waves crashing from your bedroom window.</li>
                <li><strong>The Forest Estates:</strong> Tucked away in the quieter, greener parts of Awas and Zirad, these sprawling Villas in Alibaug offer complete silence, massive lawns, and absolute privacy.</li>
                <li><strong>The Modern Architectural Marvels:</strong> Glass, steel, and infinity pools. These modern exclusive villas are designed by award-winning architects and are built to impress.</li>
              </ul>

              <h2>Beyond the Villa Gates near Villas in Alibaug</h2>
              <p>
                While the temptation to never leave your private pool is strong, Alibaug has developed a fantastic dining and cultural scene worth exploring near our villa properties.
              </p>
              <p>
                The Mandwa jetty area has blossomed into a chic culinary destination. You can grab artisanal coffee, wood-fired pizzas, or contemporary coastal cuisine right by the water, just minutes away from most Villas in Alibaug. For the historically inclined, the Kolaba Fort, which is accessible by foot or horse cart during low tide, is a surreal experience close to our getaway rentals. The beaches of Murud and Kashid, though a bit of a drive, offer pristine white sands and water sports for the more adventurous members of your group.
              </p>

              <div className="my-8 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/alibaug-palms-beachhouse/gallery-3.jpg" 
                  alt="Beach view near private pool villa in Alibaug by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Planning Your Perfect Coastal Escape in Villas in Alibaug</h2>
              <p>
                Planning a trip to Alibaug requires a bit of logistical thought—primarily booking your ferry tickets in advance. However, once you step off that boat, the vacation truly begins. When you rent private estates, our concierges can help organize pick-ups from the jetty directly to your villa, ensuring a seamless, stress-free arrival. Check our <Link href="/areas" className="underline text-accent-primary font-bold">locations directory</Link> for additional details.
              </p>
              <p>
                Whether you are craving the fiery local Malvani curries or want a curated Mediterranean menu cooked in-house, our fully staffed Villas in Alibaug are ready to cater to your every whim. Skip the crowded resorts and experience the ultimate beachside hospitality by booking our luxury properties.
              </p>
              <p>
                From private pools to manicured tropical gardens, our Villas in Alibaug redefine coastal luxury. Browse our exclusive portfolio of premium retreats below, find the estate that speaks to you, and prepare for a coastal holiday that redefines relaxation. With options ranging from beach front cottages to modern architectural wonders, our Villas in Alibaug are sure to impress.
              </p>

              <h2>Frequently Asked Questions About Staying in Alibaug</h2>
              <p>
                To help you choose the best options, we have compiled the most common questions from guests looking to book holiday homes:
              </p>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Do your beachside properties have direct beach access?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, many of our beachside properties feature private gates that lead directly onto the soft sands of Kihim or Awas beach, offering unparalleled convenience.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Is housekeeping and pool maintenance included in the booking?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Absolutely. All of our premium Villas in Alibaug are fully staffed and include daily housekeeping, professional pool cleaning, and estate managers to take care of all your needs.
                  </p>
                </div>
              </div>
            </article>

          {/* Right Column: Villa Grid */}
          <div className="lg:w-1/2">
            <div className="sticky top-32">
              <h3 className="text-2xl font-heading mb-6 flex items-center justify-between border-b border-[#DAA520]/20 pb-4">
                Available Villas in Alibaug
                <span className="text-xs font-sans font-bold bg-[#1B3564] text-white px-3 py-1 rounded-full">
                  {villas.length} Stays
                </span>
              </h3>
              
              {villas.length === 0 ? (
                 <div className="bg-[#FAF8F5]/50 border border-[#DAA520]/15 rounded-2xl p-8 text-center">
                   <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Alibaug inventory.</p>
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
              <Link href="/areas/karjat" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Karjat</Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
