import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
  description: "Discover premier private pool villas near Mumbai with bespoke hospitality & chef services across Lonavala, Khopoli & Mahabaleshwar. Direct rates with 0% platform fee.",
  keywords: [
    "private pool villas near Mumbai",
    "villas in lonavala with private pool",
    "villas in khopoli with private pool",
    "villas in mahabaleshwar with private pool",
    "weekend getaway villas near mumbai",
    "exclusive villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com",
  },
  openGraph: {
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Discover premier private pool villas near Mumbai with bespoke hospitality & chef services across Lonavala, Khopoli & Mahabaleshwar. Direct rates with 0% platform fee.",
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
import BookingBar from "@/components/home/booking-bar";

// Below-the-fold components (lazy-loaded, only rendered when scrolled into view)
const DestinationShowcase = dynamic(() => import("@/components/home/destination-showcase"));
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

  // Prioritize signature stays always at top
  const prioritySlugs = ["the-angle-house", "canopy-crest", "terra-cotta-villa", "willow-peak"];
  const prioritized = allVillas
    .filter((v) => prioritySlugs.includes(v.slug))
    .sort((a, b) => prioritySlugs.indexOf(a.slug) - prioritySlugs.indexOf(b.slug));
  const remaining = allVillas.filter((v) => !prioritySlugs.includes(v.slug));
  const dbVillas = [...prioritized, ...remaining];

  const featuredVillas = dbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.slug === "willow-peak" ? "Willow Peak" : villa.name,
    location: villa.location,
    image: villa.slug === "terra-cotta-villa"
      ? (villa.images[0] || "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg")
      : villa.slug.includes("willow-peak") 
      ? "/assets/villas/willow-peak/main.webp" 
      : (villa.images[0] || "/images/hero-villa.webp"),
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <BookingBar />
      <DestinationShowcase />
      <FeaturedVillas villas={featuredVillas} />
      <WhyChooseUs />
      <SEOContent />
      <PartnerSection />
      <Footer />
    </main>
  );
}
