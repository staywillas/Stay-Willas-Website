import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Private Pool Villa near Mumbai & Maharashtra | Stay Willas",
  description: "Rent luxury staycation villas in Maharashtra. Curated private pool villas near Mumbai & Pune with chef services. Perfect for family getaways. Book now.",
  keywords: [
    "private pool villa near Mumbai",
    "staycation villas Maharashtra",
    "luxury villa rental near Mumbai for family",
    "private villa with heated pool near Mumbai",
    "pet friendly villa near Mumbai",
    "villa near Mumbai for weekend",
    "villa 2 hours from Mumbai/Pune",
    "Stay Willas"
  ],
  alternates: {
    canonical: "/",
  },
};

// Critical above-the-fold components (loaded immediately)
import Hero from "@/components/home/hero";
import TopTicker from "@/components/home/top-ticker";
import BookingBar from "@/components/home/booking-bar";

// Below-the-fold components (lazy-loaded, only rendered when scrolled into view)
const DestinationShowcase = dynamic(() => import("@/components/home/destination-showcase"));
const FeaturedVillas = dynamic(() => import("@/components/home/featured-villas"));
const Experiences = dynamic(() => import("@/components/home/experiences"));
const InfiniteMarquee = dynamic(() => import("@/components/home/infinite-marquee"));
const WhyChooseUs = dynamic(() => import("@/components/home/why-choose-us"));
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
      <h1 className="sr-only">Stay Willas - Luxury Private Pool Villas for Rent in Maharashtra</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Stay Willas",
            "url": "https://www.staywillas.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.staywillas.com/villas?region={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Navbar />
      <TopTicker />
      <Hero />
      <BookingBar />
      <DestinationShowcase />
      <FeaturedVillas villas={featuredVillas} />
      <Experiences />
      <InfiniteMarquee />
      <WhyChooseUs />
      <PartnerSection />
      <Footer />
    </main>
  );
}
