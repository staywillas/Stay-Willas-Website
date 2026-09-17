import { Metadata } from "next";
import ReactDOM from "react-dom";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Private Pool Villas Near Mumbai | Stay Willas",
  description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli. Best direct rates with 0% booking fee.",
  keywords: [
    "private pool villas near Mumbai",
    "weekend getaway villas near mumbai",
    "luxury villa staycations near pune",
    "private pool villas for rent maharashtra",
    "exclusive villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com",
  },
  openGraph: {
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli. Best direct rates with 0% booking fee.",
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
    description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

import HeroConcept2 from "@/components/home/hero-concept-2";

// Below-the-fold components (lazy-loaded, only rendered when scrolled into view)
const DestinationShowcase = dynamic(() => import("@/components/home/destination-showcase"));
const HomeSitelinks = dynamic(() => import("@/components/home/home-sitelinks"));
const WhyChooseUs = dynamic(() => import("@/components/home/why-choose-us"));
const SEOContent = dynamic(() => import("@/components/home/seo-content"));
const PartnerSection = dynamic(() => import("@/components/home/partner-section"));
const Footer = dynamic(() => import("@/components/layout/footer"));

export const revalidate = 60; // Instant TTFB via ISR cache

export default async function Home() {
  // Preload hero background image immediately in HTML head
  ReactDOM.preload("/images/angle-house-hero-clean.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });

  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroConcept2 />

      {/* Primary Semantic H1 Header Section for Google Search SEO */}
      <section className="pt-10 pb-4 sm:pt-14 sm:pb-6 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-[#DAA520]/10 border border-[#DAA520]/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#1B3564] uppercase tracking-[0.2em] mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
          Curated Private Villas
        </div>
        <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-[#1B3564] leading-snug tracking-tight max-w-2xl mx-auto">
          <span className="block">Private Pool Villas Near Mumbai &amp; Pune</span>
          <span className="block italic text-[#DAA520] font-serif font-light mt-0.5 sm:mt-1">
            for Weekend Getaways
          </span>
        </h1>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
          Handpicked luxury villas across Lonavala, Khopoli, and Panchgani featuring private swimming pools, in-room jacuzzis, dedicated personal chefs, and lush green lawns. Book direct with best rates and 0% OTA platform fees.
        </p>

        {/* Value Highlights Pill Bar - Compact 2x2 Grid on Mobile, Flex on Desktop */}
        <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#1B3564]/85 max-w-sm sm:max-w-none mx-auto">
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Private Pools
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Personal Chef
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Pet Friendly
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Direct Rates
          </div>
        </div>
      </section>

      {/* 3D Coverflow Destinations Carousel (Lonavala, Khopoli & Panchgani) */}
      <DestinationShowcase />

      {/* Sitelinks, Why Choose Us, Partner Section, and Rich SEO Content */}
      <HomeSitelinks />
      <WhyChooseUs />
      <PartnerSection />
      <SEOContent />
      <Footer />
    </main>
  );
}
