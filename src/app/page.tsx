import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Stay Willas | Ultra-Luxury Villas & Private Estates in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Discover curated premium villas with private pools in Lonavala, Alibaug, and Karjat. Book your exclusive getaway today.",
  keywords: ["luxury villas maharashtra", "private pool villas lonavala", "luxury staycation alibaug", "Stay Willas luxury"],
};
import Hero from "@/components/home/hero";
import BookingBar from "@/components/home/booking-bar";
import DestinationShowcase from "@/components/home/destination-showcase";
import FeaturedVillas from "@/components/home/featured-villas";
import Experiences from "@/components/home/experiences";
import InfiniteMarquee from "@/components/home/infinite-marquee";
import WhyChooseUs from "@/components/home/why-choose-us";
import PartnerSection from "@/components/home/partner-section";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";

export default async function Home() {
  // Query our top 3 featured luxury stays from Supabase PostgreSQL
  const dbVillas = await prisma.villa.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const featuredVillas = dbVillas.map((villa) => ({
    id: villa.id,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/images/hero-villa.png",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-charcoal">
      <Navbar />
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
