import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Luxury Villas Near Mumbai with Private Pools | Stay Willas",
  description: "Discover premier luxury villas near Mumbai with private pools, signature hospitality & chef services in Lonavala and Khopoli. Ideal for weekend getaways.",
  keywords: [
    "luxury villas near Mumbai",
    "luxury villas near Mumbai with private pools",
    "private pool villas near Mumbai",
    "villas near Mumbai for weekend",
    "luxury villas in Maharashtra",
    "weekend villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com",
  },
  openGraph: {
    title: "Luxury Villas Near Mumbai with Private Pools | Stay Willas",
    description: "Discover premier luxury villas near Mumbai with private pools, signature hospitality & chef services in Lonavala and Khopoli. Ideal for weekend getaways.",
    url: "https://www.staywillas.com",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Luxury villas near Mumbai - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas Near Mumbai with Private Pools | Stay Willas",
    description: "Discover premier luxury villas near Mumbai with private pools, signature hospitality & chef services in Lonavala and Khopoli. Ideal for weekend getaways.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
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

export default async function Home() {
  // Let's explicitly fetch priorities
  const angleHouse = await prisma.villa.findUnique({
    where: { slug: "the-angle-house" }
  });
  
  const canopyCrest = await prisma.villa.findUnique({
    where: { slug: "canopy-crest" }
  });

  // Query all other premium villas
  const otherVillas = await prisma.villa.findMany({
    where: {
      slug: { notIn: ["the-angle-house", "canopy-crest"] }
    },
    orderBy: { createdAt: "desc" },
  });

  // Combine them with priorities always at the top/first spot!
  const dbVillas = [];
  if (angleHouse) dbVillas.push(angleHouse);
  if (canopyCrest) dbVillas.push(canopyCrest);
  dbVillas.push(...otherVillas);

  const featuredVillas = dbVillas.map((villa) => ({
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
    <main className="min-h-screen bg-bg-primary">
      <h1 className="sr-only">Luxury Villas Near Mumbai for Private Getaways</h1>
      <Navbar />
      <TopTicker />
      <Hero />
      <BookingBar />
      <DestinationShowcase />
      <FeaturedVillas villas={featuredVillas} />
      <InfiniteMarquee />
      <WhyChooseUs />
      <SEOContent />
      <PartnerSection />
      <Footer />
    </main>
  );
}
