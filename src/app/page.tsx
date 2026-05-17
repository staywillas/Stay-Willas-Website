import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Stay Willas | Ultra-Luxury Villas & Private Estates in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Discover curated premium villas with private pools in Lonavala, Alibaug, and Karjat. Book your exclusive getaway today.",
  keywords: ["luxury villas maharashtra", "private pool villas lonavala", "luxury staycation alibaug", "Stay Willas luxury"],
};
import Hero from "@/components/home/hero";
import DestinationShowcase from "@/components/home/destination-showcase";
import FeaturedVillas from "@/components/home/featured-villas";
import Experiences from "@/components/home/experiences";
import WhyChooseUs from "@/components/home/why-choose-us";
import PartnerSection from "@/components/home/partner-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal">
      <Navbar />
      <Hero />
      <DestinationShowcase />
      <FeaturedVillas />
      <Experiences />
      <WhyChooseUs />
      <PartnerSection />
      <Footer />
    </main>
  );
}
