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
  title: "Luxury Villa Lonavala with Private Pool | Stay Willas",
  description: "Rent a luxury villa in Lonavala with private pool, scenic mountain views & private chef. Ideal for friends group trips & family getaways. Check availability.",
  keywords: [
    "luxury villa Lonavala with private pool",
    "weekend getaway villas near Pune",
    "villa for friends group trip Lonavala",
    "villa with private chef Lonavala",
    "New Year villa party Lonavala",
    "Stay Willas"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/lonavala",
  },
};

export default async function LonavalaPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Lonavala",
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'the-angle-house' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "the-angle-house") return -1;
    if (b.slug === "the-angle-house") return 1;
    return 0;
  });

  const villas = sortedDbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/images/hero-villa.png",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  const signatureVilla = villas.find(v => v.id === "the-angle-house");

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/the-angle-house/gallery-11.webp" 
              alt="Luxury private pool villa in Lonavala by StayWillas"
              fill
              priority
              className="object-cover opacity-20 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-bg-primary/95 to-bg-primary" />
          </div>

          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-primary/50 tracking-wider uppercase font-semibold mb-6">
              <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/areas" className="hover:text-accent-primary transition-colors">Areas</Link>
              <ChevronRight size={10} />
              <span className="text-text-primary font-bold">Lonavala</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              The Mountain Sanctuary
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight mb-6">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light font-normal">Lonavala</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Just a short drive away from the chaos of Mumbai and Pune lies Lonavala—a misty, green paradise. Discover our handpicked selection of premium private pool villas designed for unforgettable weekend getaways.
            </p>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Angle House) */}
        {signatureVilla && (
          <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="bg-[#FAF8F5]/80 backdrop-blur-md rounded-3xl border border-[#DAA520]/25 overflow-hidden flex flex-col lg:flex-row shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Image side */}
              <div className="lg:w-3/5 relative min-h-[300px] md:min-h-[450px] overflow-hidden">
                <Image 
                  src={signatureVilla.image}
                  alt="The Angle House Lonavala Signature Pool Villa"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-6 left-6 bg-[#1B3564] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  Signature Retreat
                </span>
              </div>
              
              {/* Content side */}
              <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-between items-start text-left">
                <div>
                  <span className="text-accent-secondary text-[10px] tracking-[0.3em] uppercase font-bold mb-3 block">
                    Featured Masterpiece
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading font-semibold text-text-primary mb-4">
                    {signatureVilla.name}
                  </h2>
                  <p className="text-text-primary/75 text-sm font-light leading-relaxed mb-6">
                    A stunning architectural landmark perched on the hills of Lonavala. Boasting a massive private pool, glass facade, expansive lawns, and five-star hospitality services, it stands as the ultimate benchmark for a Private Pool Villa in Lonavala.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-b border-[#DAA520]/15 py-6 mb-8 w-full">
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Guests</span>
                      <span className="font-semibold text-sm">{signatureVilla.guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Bedrooms</span>
                      <span className="font-semibold text-sm">{signatureVilla.bedrooms} BHK</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-text-primary/40 block mb-1">Bathrooms</span>
                      <span className="font-semibold text-sm">{signatureVilla.bathrooms} Baths</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link 
                    href={`/villa/${signatureVilla.id}`}
                    className="flex-1 bg-[#1B3564] hover:bg-[#152A50] text-white text-xs font-bold tracking-widest uppercase text-center py-4 rounded-2xl shadow-md transition-all duration-300"
                  >
                    View Details
                  </Link>
                  <a 
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I am interested in booking your signature villa: *${signatureVilla.name}* in Lonavala.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-[#1B3564]/30 hover:border-[#1B3564] text-[#1B3564] text-xs font-bold tracking-widest uppercase text-center py-4 rounded-2xl transition-all duration-300"
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Villa Collection Grid */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#F9F7F2]/50 border-t border-b border-[#DAA520]/10">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <span className="text-accent-secondary font-semibold tracking-[0.3em] uppercase text-[10px] mb-2 block">
              Curated Selection
            </span>
            <h3 className="text-3xl md:text-4xl font-heading text-[#1B3564]">
              Available Private Pool Sanctuaries
            </h3>
            <p className="text-text-primary/60 text-xs sm:text-sm font-light mt-3 max-w-lg mx-auto">
              Explore our handpicked range of high-end properties, offering absolute privacy and luxury.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {villas.length === 0 ? (
               <div className="bg-[#FAF8F5]/50 border border-[#DAA520]/15 rounded-2xl p-8 text-center max-w-md mx-auto">
                 <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Lonavala inventory.</p>
                 <Link href="/areas" className="text-[#1B3564] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:text-accent-primary">
                   <ArrowLeft size={16} /> View other areas
                 </Link>
               </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
                {villas.map((villa) => (
                  <div key={villa.id} className="w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.33%-27px)] max-w-sm transform transition duration-300 hover:-translate-y-2">
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
        </section>

        {/* Narrative SEO Story (Single-column layout, expanded to ~2000 words in structured manner) */}
        <section className="py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-invert prose-p:text-text-primary/75 prose-p:text-base prose-p:leading-relaxed prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-accent-secondary prose-h3:font-heading prose-h3:text-xl prose-a:text-accent-primary">
              <h2>Why Villas in Lonavala Remain the Ultimate Weekend Escape</h2>
              <p>
                We’ve all been there. It’s Thursday afternoon in Mumbai, the traffic on the Western Express Highway is at a standstill, and you’re staring out the window dreaming of breathing actual fresh air. Selecting premium private estates isn't just a destination choice; for anyone living in western Maharashtra, it’s a necessary pressure valve. When the monsoon hits and the Sahyadri mountains turn a green shade, nothing beats renting private Villas in Lonavala. 
              </p>
              <p>
                But let's be honest—the days of cramming into a crowded hotel room are over. You work hard, and when you take a break, you want space, privacy, and absolute comfort. That is exactly why choosing luxury properties has completely changed how we experience this classic hill station. For city dwellers, renting quality Villas in Lonavala represents a hassle-free journey to natural rejuvenation. It is the easiest way to swap concrete skylines for mist-laden valleys when you select from our exclusive premium retreats.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/the-angle-house/gallery-3.webp" 
                  alt="Luxury private pool villa in Lonavala by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>The Private Pool Experience in Villas in Lonavala</h2>
              <p>
                Imagine waking up to the sound of rain hitting the large French windows of your bedroom. You step out onto a massive private deck, cup of hot chai in hand, looking out over a valley shrouded in mist. Our luxury holiday homes are designed around this exact feeling of uninterrupted peace. There's no rush to hit the breakfast buffet before 10 AM, no fighting for a lounge chair by a shared pool, and zero noisy neighbors when you book private Villas in Lonavala here.
              </p>
              <p>
                If you seek a private pool getaway, our handpicked vacation rentals feature temperature-controlled private pools, meaning even in the cool December winter or rainy July monsoon, you can take a comfortable dip. Many modern travelers prefer independent Villas in Lonavala over hotels because they provide complete freedom. When you compare standard resorts with our private private sanctuaries, the difference in quality and personal space is striking.
              </p>
              <p>
                We’ve noticed a massive shift in how families travel. Instead of booking multiple separate hotel rooms, families are pooling their budgets to rent spacious Villas in Lonavala. You get a massive living room to play board games, a private garden for the kids to run around in, and a kitchen where a private chef can cook authentic meals. If you prefer to travel with your pets, we offer pet-friendly exclusive villas options, so you never have to leave your furry family members behind.
              </p>

              <div className="my-10 border-l-4 border-accent-primary bg-[#FAF8F5] p-6 rounded-r-2xl text-left">
                <p className="text-[#1B3564] font-serif italic text-lg leading-relaxed mb-2">
                  "Private pool villas offer the perfect balance of luxury and space, making them a default choice for families and groups who want quality time together."
                </p>
                <span className="text-[10px] tracking-wider uppercase font-bold text-accent-secondary">- Stay Willas Concierge</span>
              </div>

              <h2>Villas in Lonavala: Ideal for Every Occasion</h2>
              <p>
                We host a massive variety of groups here at Stay Willas. Geographically, our villa properties are perfectly positioned, making them the ideal choice for a weekend retreat. From family reunions to corporate gatherings, renting Villas in Lonavala ensures that your group has the space it needs to connect and unwind. If you want to check out our primary listing, you can visit <Link href="/villa/lonavala-anglehouse" className="underline text-accent-primary font-bold">The Angle House</Link> directly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Family & Group Reunions</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Sprawling estates that act as a spacious group home with ground-floor bedrooms for grandparents. Our getaway rentals cater to all generations.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Corporate Getaways</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Escape the office environment by booking our Villas in Lonavala to run collaborative offsites, workshops, and build team bonding around a cozy bonfire.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Intimate Escapes</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Tucked away in quiet corners of the hills, perfect if you are looking for romantic escape options in luxury private estates with heated pools.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Milestone Celebrations</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Celebrate birthdays or get-togethers by booking party-friendly Villas in Lonavala with private chefs and custom event spaces.
                  </p>
                </div>
              </div>

              <h2>Comprehensive Lonavala Weather & Seasonality Guide</h2>
              <p>
                Deciding when to book your stay in Lonavala depends greatly on the kind of experience you are seeking. Unlike coastal beach destinations, Lonavala changes dramatically through the year, offering distinct climates. We suggest checking availability at our luxury properties early, as peak dates fill up quickly.
              </p>

              <div className="my-8 overflow-hidden rounded-2xl border border-[#DAA520]/15 not-prose">
                <table className="min-w-full divide-y divide-[#DAA520]/15 text-left text-sm">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Vibe & Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15 bg-white">
                    <tr>
                      <td className="px-6 py-4 font-semibold">Monsoon Peak</td>
                      <td className="px-6 py-4">June to September</td>
                      <td className="px-6 py-4">Foggy mornings, heavy rains, lush green valleys, and rushing waterfalls. High demand for our Villas in Lonavala.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Crisp Winter</td>
                      <td className="px-6 py-4">October to February</td>
                      <td className="px-6 py-4">Cool nights, pleasant sunny days, outdoor barbecues, and campfire gatherings at our premium retreats.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Warm Summer</td>
                      <td className="px-6 py-4">March to May</td>
                      <td className="px-6 py-4">Warm afternoons, cool evening breezes. Excellent season to lounge in the pools of our Villas in Lonavala.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Beyond the Chikki: Things to Do near holiday homes</h2>
              <p>
                Yes, you have to buy Maganlal chikki and walnut fudge from Cooper's—it's practically the law when you visit. But if you manage to leave the comfort of your private pool, the area surrounding our Villas in Lonavala is packed with things to explore. Tiger Point at sunrise is stunning. The ancient Karla and Bhaja Buddhist caves offer a surreal step back in time, cut directly into the mountainside close to several popular vacation rentals.
              </p>
              <p>
                For the adventurous, a trek up to Lohagad Fort during the monsoons is spectacular. The stone steps get slippery, but the view from the top is worth every drop of sweat. Speaking of Pawna, a short drive from most Villas in Lonavala will take you to the lake, which is perfect for a quiet afternoon picnic away from the main town crowds.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/the-angle-house/gallery-4.webp" 
                  alt="Scenic valley view from private pool villa in Lonavala by StayWillas" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Planning Your Next Staycation in private sanctuaries</h2>
              <p>
                When booking your next getaway, think about what matters most to your group. If you're traveling during the monsoon, prioritizing Villas in Lonavala with a great indoor game room and a covered veranda is smart. If it's a summer trip, look for exclusive villas with massive outdoor pools and sunset decks.
              </p>
              <p>
                Location matters too. Villas in Lonavala closer to Khandala tend to offer dramatic valley views and a bit more quiet. Properties closer to the main market are brilliant if you want the convenience of walking to restaurants and shops. Further out towards Pawna, you trade convenience for absolute, undisturbed wilderness. Whatever your preference, we have the perfect villa properties ready for your arrival on our <Link href="/areas" className="underline text-accent-primary font-bold">booking directory page</Link>.
              </p>

              <h2>Curated 2-Day Luxury Itinerary</h2>
              <p>
                To help you plan your upcoming stay, we have created a refined, structured itinerary that balances outdoor activities with luxurious relaxation at our premium Villas in Lonavala.
              </p>

              <div className="my-10 space-y-6 not-prose">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">1</div>
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 flex-1">
                    <h5 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Day 1: Arrival & Unwinding</h5>
                    <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                      Check-in at one of our signature getaway rentals at 1:00 PM. Enjoy a traditional Maharashtrian lunch prepared in-house by your private chef. Spend the afternoon lounging in the pool. As night falls, light up the barbecue on the lawn of your luxury retreat.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">2</div>
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 flex-1">
                    <h5 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Day 2: Sunrise Trek & Heritage Exploration</h5>
                    <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                      Start early for a guided trek up to Lohagad Fort. Return to your pool estate for a heavy breakfast. In the afternoon, visit the historic Karla Caves. Wrap up your day with board games and a customized gourmet dinner inside your private estate.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Frequently Asked Questions About Staying in Lonavala</h2>
              <p>
                To address common questions from travelers looking to rent properties, we have structured the most essential information into this quick FAQ guide:
              </p>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Are the private pools in Villas in Lonavala safe and hygienic?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes. All private pools in our private estates undergo a strict chlorine filtration cycle before every arrival. Our estate managers test the water quality daily to ensure absolute safety and hygiene.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Do your Villas in Lonavala provide in-house chef options?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Absolutely. We offer customizable meal packages where professional in-house chefs cook fresh multi-cuisine meals directly inside your private estate. This is a standard luxury feature in our premium luxury properties.
                  </p>
                </div>
              </div>
            </article>
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
              <Link href="/areas/khopoli" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Khopoli</Link>
              <Link href="/areas/alibaug" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Alibaug</Link>
              <Link href="/areas/karjat" className="bg-[#FAF8F5] hover:bg-[#1B3564] border border-[#DAA520]/20 hover:border-[#1B3564] text-[#1B3564] hover:text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all">Karjat</Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

