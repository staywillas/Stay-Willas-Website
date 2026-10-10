import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import DestinationShowcase from "@/components/home/destination-showcase";
import HomeSitelinks from "@/components/home/home-sitelinks";
import WhyChooseUs from "@/components/home/why-choose-us";
import SEOContent from "@/components/home/seo-content";
import PartnerSection from "@/components/home/partner-section";
import Footer from "@/components/layout/footer";

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

// Fixed sections render on the server; their images remain lazy-loaded below the fold.

export const revalidate = 60; // Instant TTFB via ISR cache

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroConcept2 />

      {/* 3D Coverflow Destinations Carousel (Lonavala, Khopoli & Panchgani) */}
      <DestinationShowcase />

      {/* Primary Semantic H1 Header Section for Google Search SEO */}
      <section className="pt-2 pb-10 sm:pt-4 sm:pb-14 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-[#DAA520]/10 border border-[#DAA520]/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#1B3564] uppercase tracking-[0.2em] mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
          Curated Private Villas
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#1B3564] leading-tight tracking-tight max-w-4xl mx-auto">
          <span className="block">Private Pool Villas Near Mumbai &amp; Pune</span>
          <span className="block italic text-[#DAA520] font-serif font-light mt-1 sm:mt-1.5">
            for Weekend Getaways
          </span>
        </h1>
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
          Handpicked luxury villas across Lonavala, Khopoli, and Panchgani with private pools, chefs, and 0% OTA fees.
        </p>

        {/* Value Highlights Pill Bar - Compact on Mobile, Flex on Desktop */}
        <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#1B3564]/85 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Private Pools
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Personal Chef
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Pet Friendly
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="text-emerald-600 font-bold">✓</span> Direct Rates
          </div>
        </div>
      </section>

      {/* Sitelinks, Why Choose Us, Partner Section, and Rich SEO Content */}
      <HomeSitelinks />
      <WhyChooseUs />
      <PartnerSection />
      <SEOContent />
      <Footer />
    </main>
  );
}
