import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Stay Willas | Ultra-Luxury Villas & Private Estates in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Discover curated premium villas with private pools in Lonavala, Alibaug, and Karjat. Book your exclusive getaway today.",
  keywords: ["luxury villas maharashtra", "private pool villas lonavala", "luxury staycation alibaug", "Stay Willas luxury"],
};

// Critical above-the-fold components (loaded immediately)
import Hero from "@/components/home/hero";

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
  // Let's explicitly fetch "The Angle House" (slug: 'the-angle-house') to ensure it is always first at the top
  const angleHouse = await prisma.villa.findUnique({
    where: { slug: "the-angle-house" }
  });

  // Query all other premium villas
  const otherVillas = await prisma.villa.findMany({
    where: {
      slug: { not: "the-angle-house" }
    },
    orderBy: { createdAt: "desc" },
  });

  // Combine them with "The Angle House" always at the top/first spot!
  const dbVillas = [];
  if (angleHouse) {
    dbVillas.push(angleHouse);
  }
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
      <Navbar />
      <Hero />
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
