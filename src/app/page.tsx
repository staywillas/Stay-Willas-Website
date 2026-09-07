import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
  description: "Discover premier private pool villas near Mumbai with bespoke hospitality & chef services across Lonavala & Khopoli. Best direct rates with 0% platform fee.",
  keywords: [
    "private pool villas near Mumbai",
    "villas in lonavala with private pool",
    "villas in khopoli with private pool",
    "weekend getaway villas near mumbai",
    "luxury villas in lonavala",
    "exclusive villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com",
  },
  openGraph: {
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Discover premier private pool villas near Mumbai with bespoke hospitality & chef services across Lonavala & Khopoli. Best direct rates with 0% platform fee.",
    url: "https://www.staywillas.com",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Private pool villas near Mumbai - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Discover premier private pool villas near Mumbai with bespoke hospitality & chef services across Lonavala, Khopoli & Mahabaleshwar.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

// Critical above-the-fold components (loaded immediately)
import Hero from "@/components/home/hero";
import TopTicker from "@/components/home/top-ticker";

// Below-the-fold components (lazy-loaded, only rendered when scrolled into view)
const DestinationShowcase = dynamic(() => import("@/components/home/destination-showcase"));
const HomeSitelinks = dynamic(() => import("@/components/home/home-sitelinks"));
const FeaturedVillas = dynamic(() => import("@/components/home/featured-villas"));
const InfiniteMarquee = dynamic(() => import("@/components/home/infinite-marquee"));
const WhyChooseUs = dynamic(() => import("@/components/home/why-choose-us"));
const SEOContent = dynamic(() => import("@/components/home/seo-content"));
const PartnerSection = dynamic(() => import("@/components/home/partner-section"));
const Footer = dynamic(() => import("@/components/layout/footer"));

import { prisma } from "@/lib/db";

export const revalidate = 60; // Instant TTFB via ISR cache

export default async function Home() {
  // Query all villas in a single roundtrip
  const allVillas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      name: true,
      location: true,
      price: true,
      guests: true,
      bedrooms: true,
      bathrooms: true,
      images: true,
    }
  });

  // Hidden for now until property goes live
  const hiddenSlugs = ["terra-cotta-villa", "mahabaleshwar-terra-cotta"];

  // Prioritize signature stays always at top
  const prioritySlugs = ["the-angle-house", "canopy-crest", "willow-peak"];
  const prioritized = allVillas
    .filter((v) => prioritySlugs.includes(v.slug))
    .sort((a, b) => prioritySlugs.indexOf(a.slug) - prioritySlugs.indexOf(b.slug));
  const remaining = allVillas.filter((v) => !prioritySlugs.includes(v.slug) && !hiddenSlugs.includes(v.slug));
  const dbVillas = [...prioritized, ...remaining];

  const featuredVillas = dbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.slug === "willow-peak" ? "Willow Peak" : villa.name,
    location: villa.location,
    image: villa.images[0] || (
      villa.slug === "the-angle-house" ? "/images/destinations/ANGLE%20HOUSE%20FINAL.jpg" :
      villa.slug === "canopy-crest" ? "/images/destinations/CANOPY%20CREST%20-2.png" :
      villa.slug.includes("willow-peak") ? "/images/destinations/WILLOW%20PEAK%20-%202.jpeg" :
      "/images/hero-villa.webp"
    ),
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />

      {/* Primary Semantic H1 Header Section for Google Search SEO */}
      <section className="pt-8 pb-3 sm:pt-12 sm:pb-5 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-[#DAA520]/10 border border-[#DAA520]/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#1B3564] uppercase tracking-[0.2em] mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
          Curated Private Sanctuaries
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#1B3564] leading-tight tracking-tight">
          Private Pool Villas Near <span className="italic text-[#DAA520] font-serif font-light">Mumbai &amp; Pune</span> for Weekend Getaways
        </h1>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
          Handpicked luxury villas across Lonavala and Khopoli featuring private swimming pools, in-room jacuzzis, dedicated personal chefs, and lush green lawns. Book direct with best rates and 0% OTA platform fees.
        </p>

        {/* Value Highlights Pill Bar */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#1B3564]/80">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> 100% Private Swimming Pool
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Personal Chef &amp; BBQ Dining
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Pet-Friendly Fenced Lawns
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> 0% Platform Commission
          </div>
        </div>
      </section>

      <HomeSitelinks />
      <DestinationShowcase />
      <FeaturedVillas villas={featuredVillas} />
      <WhyChooseUs />
      <SEOContent />
      <PartnerSection />
      <Footer />
    </main>
  );
}
