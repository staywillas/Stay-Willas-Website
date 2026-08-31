import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";
import { ChevronRight, ArrowLeft, MapPin, ShieldCheck, CheckCircle2, PhoneCall, Calendar } from "lucide-react";
import { generateDestinationCollectionSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
  description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
  keywords: [
    "villas in khopoli with private pool",
    "villas in khopoli",
    "khopoli villa with swimming pool",
    "luxury villas in khopoli",
    "canopy crest khopoli",
    "khopoli villas",
    "villas near imagica with private pool",
    "khopoli villa staycation",
    "corporate offsite villa khopoli"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/areas/khopoli",
  },
  openGraph: {
    title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
    description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
    url: "https://www.staywillas.com/areas/khopoli",
    siteName: "Stay Willas",
    locale: "en_IN",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Villas in Khopoli with Private Pool - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
    description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa. Book verified 4 BHK group estates from ₹12,000/night.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default async function KhopoliPage() {
  const dbVillas = await prisma.villa.findMany({
    where: {
      location: {
        contains: "Khopoli",
        mode: "insensitive"
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Pin 'canopy-crest' to the top of the collection
  const sortedDbVillas = [...dbVillas].sort((a, b) => {
    if (a.slug === "canopy-crest") return -1;
    if (b.slug === "canopy-crest") return 1;
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

  const signatureVilla = villas.find(v => v.id === "canopy-crest");

  const khopoliFaqs = [
    {
      question: "How many guests can Canopy Crest accommodate?",
      answer: "Canopy Crest comfortably accommodates up to 16 guests across 4 spacious BHK suites."
    },
    {
      question: "Is there high-speed Wi-Fi for work offsites?",
      answer: "Yes, the estate is equipped with high-speed fiber internet suitable for video conferencing and remote work."
    },
    {
      question: "Can we order pure vegetarian or Jain food?",
      answer: "Yes. Our in-house chefs cater dedicated pure-veg and Jain meals using separate cookware."
    },
    {
      question: "Is there a market nearby for grocery shopping?",
      answer: "Yes, Khopoli town has full-fledged markets within a 10-15 minute drive from our properties. However, we recommend informing our concierge of your grocery requirements beforehand so we can stock your chosen villa."
    }
  ];

  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: "khopoli",
    regionName: "Khopoli",
    title: "Villas in Khopoli with Private Pool | Luxury Staycations | Stay Willas",
    description: "Discover luxury villas in Khopoli with private pool, sprawling green lawns & in-house chef dining near Imagicaa.",
    villas: villas.map(v => ({
      slug: v.id,
      name: v.name,
      location: v.location,
      image: v.image,
      price: v.price,
      bedrooms: v.bedrooms,
      guests: v.guests,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
    { name: "Khopoli", url: "/areas/khopoli" },
  ]);

  const faqSchema = generateFAQSchema(khopoliFaqs);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        {/* Structured Data: CollectionPage, ItemList, BreadcrumbList & FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              ...destinationSchema["@graph"],
              breadcrumbSchema,
              ...(faqSchema ? [faqSchema] : []),
            ]),
          }}
        />
        <Navbar />
        
        {/* Banner Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-[#DAA520]/10 text-center flex flex-col items-center">
          <div className="absolute inset-0 -z-10">
            <Image 
              src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
              alt="Luxury private pool villa in Khopoli by StayWillas"
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
              <span className="text-text-primary font-bold">Khopoli</span>
            </div>

            <span className="text-accent-secondary font-semibold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-3 block">
              The Nature Escape
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight mb-6">
              Luxury Villas in <span className="italic text-accent-primary font-serif font-light font-normal">Khopoli</span>
            </h1>
            <p className="text-text-primary/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Tucked at the base of the Sahyadri mountains, Khopoli is Maharashtra's best-kept secret for luxury nature escapes. Discover premium private pool villas hidden amidst waterfalls and lush forests.
            </p>
          </div>
        </section>

        {/* Signature Villa Hero Highlight (Canopy Crest) */}
        {signatureVilla && (
          <section className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="bg-[#FAF8F5]/80 backdrop-blur-md rounded-3xl border border-[#DAA520]/25 overflow-hidden flex flex-col lg:flex-row shadow-xl transform hover:scale-[1.01] transition-transform duration-500">
              {/* Image side */}
              <div className="lg:w-3/5 relative min-h-[300px] md:min-h-[450px] overflow-hidden">
                <Image 
                  src={signatureVilla.image}
                  alt="Canopy Crest Khopoli Signature Pool Villa"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-6 left-6 bg-[#1B3564] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  Signature Escape
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
                    Escape to a stunning nature sanctuary. Perched amidst the Sahyadri mountains, this villa offers a spectacular private pool, sprawling green layout, five-star hospitality services, and ultimate seclusion.
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
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas! 🌟 I am interested in booking your signature villa: *${signatureVilla.name}* in Khopoli.`)}`}
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
                 <p className="text-text-primary/60 text-sm mb-4">We are currently updating our Khopoli inventory.</p>
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

        {/* Narrative SEO Story with Left/Right Sidebars & Enlarged Body Typography */}
        <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT SIDEBAR: Destination Navigation & Trust Badges */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#FAF8F5] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DAA520]/15">
                  <MapPin className="text-accent-primary w-5 h-5" />
                  <h3 className="font-heading font-bold text-[#1B3564] text-lg">Explore Destinations</h3>
                </div>
                <div className="space-y-2.5">
                  <Link href="/areas/lonavala" className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1B3564] font-medium text-sm transition-all border border-[#DAA520]/15">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
                      Lonavala
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-[#DAA520] text-[#1B3564] px-2.5 py-1 rounded-full">Active</span>
                  </Link>

                  <Link href="/areas/khopoli" className="flex items-center justify-between p-3 rounded-2xl bg-[#1B3564] text-white font-medium text-sm transition-all shadow-md">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Khopoli
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Active</span>
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

              {/* Stay Willas Guarantee Seal */}
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
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#DAA520]" /> Pet-Friendly Fenced Lawns</li>
                </ul>
              </div>
            </aside>

            {/* CENTER COLUMN: Main SEO Article with Larger Text */}
            <main className="lg:col-span-6 bg-white/95 rounded-3xl p-6 sm:p-10 md:p-12 border border-[#DAA520]/15 shadow-sm">
              <article className="prose prose-lg md:prose-xl max-w-none text-left select-text prose-p:text-slate-800 prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed md:prose-p:leading-loose prose-h2:text-[#1B3564] prose-h2:font-heading prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-accent-secondary prose-h3:font-heading prose-h3:text-xl prose-a:text-accent-primary">
              <h2>The Undiscovered Sanctuary at the Base of the Ghats</h2>
              <p>
                When planning a drive out of Mumbai or Pune along the Expressway, Lonavala is usually the first destination that comes to mind. Yet right before the steep, traffic-congested climb up the ghats lies Khopoli—a tranquil valley nestled against the base of the Sahyadri mountains. For travelers seeking nature without highway gridlock, choosing a khopoli villa staycation offers a peaceful, refreshing alternative.
              </p>
              <p>
                Khopoli's location provides a distinct advantage: expansive plot sizes surrounded by lush forest cover. Heavy monsoon rains create seasonal streams that flow right past private estate lawns, providing dramatic mountain scenery without the tourist crowds of higher hill stations.
              </p>

              <h2>The Travel Time Advantage: Skipping Ghat Traffic</h2>
              <p>
                A major reason families and corporate groups are selecting a weekend getaway villa Khopoli location is convenience. Driving up the Khandala ghats during weekend rush hours can add up to 90 minutes of stressful bumper-to-bumper traffic.
              </p>
              <p>
                By taking the Khalapur exit directly off the Mumbai-Pune Expressway, guests arrive at their private villa within 15 minutes of leaving the highway. You save significant travel time, allowing your group to start relaxing in the pool while others are still stuck in traffic.
              </p>

              <h2>Spacious Estates for Large Group Gatherings</h2>
              <p>
                Finding luxury accommodations that comfortably house up to 16 guests under one roof can be challenging. Standard hotels require booking multiple separated rooms, breaking up the togetherness of a group vacation.
              </p>
              <p>
                Reserving a large group villa khopoli property like <Link href="/villa/canopy-crest" className="underline text-accent-primary font-bold">Canopy Crest</Link> solves this problem. Featuring a 4 BHK layout with 5 bathrooms, massive common living rooms, charpai lawns, and a large private swimming pool, everyone stays together comfortably.
              </p>

              <div className="my-12 relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg" 
                  alt="Canopy Crest 4 BHK large group private pool estate in Khopoli" 
                  fill 
                  className="object-cover"
                />
              </div>

              <h2>Corporate Offsites & Strategic Team Retreats</h2>
              <p>
                Modern corporate teams are moving away from sterile city hotel conference rooms. Booking a corporate offsite villa Khopoli location provides the ideal balance of productivity and relaxation.
              </p>
              <p>
                Equipped with high-speed fiber internet, quiet indoor lounge areas for breakout sessions, and expansive outdoor lawns for team-building exercises, private estates foster genuine connection. In the evenings, teams gather around the outdoor bonfire pit or poolside barbecue deck to unwind and build camaraderie.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Corporate Strategy Offsites</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Fiber Wi-Fi, air-conditioned meeting lounges, quiet break-out zones, and full chef catering to keep your team energized and focused.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Multi-Family Reunions</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Spacious 4 BHK layouts with accessible ground-floor bedrooms, safe swimming pools, and manicured grassy lawns for kids.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Milestone Celebrations</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Host milestone birthdays and anniversaries with pool deck seating, bonfire pits, and live barbecue catering.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-lg font-bold mb-2">Weekend Wellness Escapes</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Clean mountain air, morning yoga on charpai lawns, and quiet valley views free from urban noise pollution.
                  </p>
                </div>
              </div>

              <h2>Seasonality & Climate Guide</h2>
              <p>
                Khopoli's valley geography offers distinct seasonal appeal throughout the year:
              </p>

              <div className="my-8 overflow-hidden rounded-2xl border border-[#DAA520]/15 not-prose">
                <table className="min-w-full divide-y divide-[#DAA520]/15 text-left text-sm">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Season</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Months</th>
                      <th className="px-6 py-4 font-bold text-[#1B3564]">Atmosphere & Highlights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAA520]/15 bg-white">
                    <tr>
                      <td className="px-6 py-4 font-semibold">Monsoon Magic</td>
                      <td className="px-6 py-4">June – September</td>
                      <td className="px-6 py-4">Vibrant green valley cover, nearby Zenith waterfalls in full flow, and refreshing rain showers over the pool.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Pleasant Winter</td>
                      <td className="px-6 py-4">October – February</td>
                      <td className="px-6 py-4">Crisp morning air, sunny afternoons, and cool evenings ideal for outdoor bonfires and barbecue dinners.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Summer Pool Retreat</td>
                      <td className="px-6 py-4">March – May</td>
                      <td className="px-6 py-4">Warm sunny weather perfect for spending all day in the pool with evening valley breezes.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2>Gourmet Catering & In-Villa Dining</h2>
              <p>
                A great group trip requires great food. Our in-house culinary staff handles all meal preparation right inside the estate kitchen, serving fresh, multi-cuisine meals so you never have to worry about cooking or finding restaurants.
              </p>
              <p>
                From authentic Maharashtrian breakfast spreads to live poolside barbecues and specialized pure-veg or Jain menus, our chefs customize meals to your group's exact preferences.
              </p>

              <h2>Local Attractions Near Khopoli Estates</h2>
              <p>
                If your group wishes to explore the surrounding region, several popular attractions are located close by:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Imagicaa Theme Park</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    Located just 10 minutes away, making our estates the ideal basecamp for family thrill-seekers.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Zenith Waterfall</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    A popular monsoon trekking destination featuring a dramatic waterfall cascade through lush forest trails.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#DAA520]/15">
                  <h4 className="text-[#1B3564] font-heading text-base font-bold mb-2">Khandala Viewpoints</h4>
                  <p className="text-text-primary/70 text-xs font-light leading-relaxed">
                    A short 20-minute drive up the ghats to take in panoramic sunset views across the valley.
                  </p>
                </div>
              </div>

              <h2>Frequently Asked Questions</h2>

              <div className="my-8 space-y-4 not-prose text-left">
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">How many guests can Canopy Crest accommodate?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Canopy Crest comfortably accommodates up to 16 guests across 4 spacious BHK suites.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Is there high-speed Wi-Fi for work offsites?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, the estate is equipped with high-speed fiber internet suitable for video conferencing and remote work.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Can we order pure vegetarian or Jain food?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes. Our in-house chefs cater dedicated pure-veg and Jain meals using separate cookware.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15">
                  <h4 className="font-heading font-bold text-[#1B3564] mb-2 text-base">Is there a market nearby for grocery shopping?</h4>
                  <p className="text-text-primary/70 text-sm font-light leading-relaxed">
                    Yes, Khopoli town has full-fledged markets within a 10-15 minute drive from our properties. However, we recommend informing our concierge of your grocery requirements beforehand so we can stock your chosen villa.
                  </p>
                </div>
              </div>
            </article>
            </main>

            {/* RIGHT SIDEBAR: Area Villa Booking & Inquiry Panel */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
              {/* Villa Booking Card */}
              <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#DAA520]/15 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-secondary">Khopoli Flagship</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Available</span>
                </div>
                
                <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-inner">
                  <Image 
                    src="/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg" 
                    alt="Canopy Crest Khopoli" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute top-3 right-3 bg-[#1B3564]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    From ₹15,000 / night
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-xl font-bold text-[#1B3564]">Canopy Crest</h4>
                  <p className="text-xs text-text-primary/60 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-accent-primary" /> Khopoli, Maharashtra
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-3 rounded-2xl border border-[#DAA520]/15 text-slate-700">
                  <div>
                    <span className="block font-bold text-[#1B3564]">16</span>
                    <span className="text-[10px] text-slate-500">Guests</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[#1B3564]">4 BHK</span>
                    <span className="text-[10px] text-slate-500">Suites</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[#1B3564]">Pool</span>
                    <span className="text-[10px] text-slate-500">22ft Pool</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link 
                    href="/villa/canopy-crest" 
                    className="block w-full bg-[#1B3564] hover:bg-[#0F2142] text-white text-center text-sm font-bold uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    Book This Villa
                  </Link>

                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20want%20to%20book%20a%20villa%20in%20Khopoli" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-bold uppercase tracking-wider py-3 rounded-2xl shadow-sm transition-all"
                  >
                    <PhoneCall size={14} /> WhatsApp Concierge
                  </a>
                </div>
              </div>

              {/* Quick Inquiry Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-heading font-bold text-[#1B3564] text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-accent-primary" /> Check Dates & Inquiry
                </h4>
                <p className="text-xs text-slate-600 font-light">
                  Need help choosing the right villa for your dates and group size in Khopoli?
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Expected Guests</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#1B3564]">
                      <option>4 - 8 Guests</option>
                      <option>8 - 12 Guests</option>
                      <option>12 - 20+ Guests</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">Destination</label>
                    <input type="text" readOnly value="Khopoli, MH" className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold" />
                  </div>
                  <a 
                    href="https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20need%20a%20quote%20for%20a%20Khopoli%20villa" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#DAA520] hover:bg-[#B8860B] text-[#1B3564] font-bold text-xs uppercase tracking-wider text-center py-3 rounded-xl transition-colors"
                  >
                    Get Instant Quote
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </section>

        {/* Internal Blog Links */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
          <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-[#DAA520]/15">
            <h3 className="text-lg font-heading text-[#1B3564] font-bold mb-4">Related Guides</h3>
            <ul className="space-y-3 text-sm text-slate-700 font-light">
              <li>→ <Link href="/blog/khopoli-vs-lonavala-villa-comparison" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Khopoli vs Lonavala Villa Comparison: Valley Views or Quiet Sanctuary?</Link></li>
              <li>→ <Link href="/blog/khopoli-waterfall-monsoon-villa-guide" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Khopoli Waterfall & Monsoon Villa Guide</Link></li>
              <li>→ <Link href="/blog/best-khopoli-villa-for-large-groups" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">The Best Khopoli Villa for Large Groups & Corporate Offsites</Link></li>
              <li>→ <Link href="/blog/corporate-offsite-checklist-for-a-khopoli-villa" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Corporate Offsite Checklist for a Khopoli Villa</Link></li>
              <li>→ <Link href="/blog/things-to-do-near-adlabs-imagica-khopoli" className="underline text-accent-primary hover:text-[#1B3564] transition-colors">Things to Do Near Adlabs Imagica, Khopoli</Link></li>
            </ul>
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
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
