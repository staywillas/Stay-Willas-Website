import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";
import { Award, ShieldCheck, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Stay Willas | Luxury Villa Rentals in Maharashtra",
  description: "Learn about Stay Willas and our luxury villa rentals in Maharashtra. Handpicked private pool villas in Lonavala & Khopoli with warm hospitality.",
  keywords: ["about Stay Willas", "luxury villa rentals in maharashtra", "premium villa management"],
  alternates: {
    canonical: "https://www.staywillas.com/about",
  },
  openGraph: {
    title: "About Stay Willas | Luxury Villa Rentals in Maharashtra",
    description: "Learn about Stay Willas and our luxury villa rentals in Maharashtra. Handpicked private pool villas in Lonavala & Khopoli with warm hospitality.",
    url: "https://www.staywillas.com/about",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "About Stay Willas",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Stay Willas | Luxury Villa Rentals in Maharashtra",
    description: "Learn about Stay Willas and our luxury villa rentals in Maharashtra. Handpicked private pool villas in Lonavala & Khopoli with warm hospitality.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  const aboutSchema = {
    "@type": "AboutPage",
    "@id": `${BASE_URL}/about#webpage`,
    url: `${BASE_URL}/about`,
    name: "About Stay Willas | Luxury Villa Rentals in Maharashtra",
    description: "Learn about Stay Willas and our luxury villa rentals in Maharashtra. Handpicked private pool villas in Lonavala & Khopoli with warm hospitality.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    about: {
      "@id": `${BASE_URL}/#organization`,
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <h1 className="sr-only">About Stay Willas - Luxury Villa Rentals in Maharashtra</h1>
      <Navbar />
      {/* Structured Data: AboutPage & BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [aboutSchema, breadcrumbSchema],
          }),
        }}
      />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent-secondary font-medium tracking-[0.4em] uppercase text-xs mb-6 block">
              Our Story
            </span>
            <h2 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
              What Luxury <br />
              <span className="italic text-accent-primary">Really Means.</span>
            </h2>
            <p className="text-text-primary/55 text-xl leading-relaxed mb-10">
              Stay Willas started because we realized something simple: a great holiday isn&apos;t just about 
              a fancy house. It&apos;s about how a space makes you feel, and the care and warmth you 
              experience while you&apos;re there.
            </p>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/hero-villa.png" 
              alt="Luxury Estate" 
              fill 
              priority
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 550px"
              className="object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading mb-6 italic">What We Believe In</h2>
            <div className="w-24 h-px bg-accent-primary/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "Handpicked", desc: "We personally visit and check every home to ensure everything is perfect." },
              { icon: Sparkles, title: "Unique Stays", desc: "Access to beautiful private homes you won't find anywhere else." },
              { icon: Heart, title: "Hospitality", desc: "Warm, friendly local hosts who love making you feel welcome." },
              { icon: Award, title: "Quality", desc: "Creating beautiful, stress-free staycations you'll love." }
            ].map((pillar) => (
              <div key={pillar.title} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border border-border-subtle flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-primary group-hover:text-white transition-all">
                  <pillar.icon size={32} />
                </div>
                <h3 className="text-xl font-heading mb-4">{pillar.title}</h3>
                <p className="text-text-primary/40 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-white rounded-[40px] p-12 md:p-24 border border-border-subtle text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-3xl md:text-5xl font-heading mb-10 max-w-3xl mx-auto leading-tight">
            &quot;We don&apos;t just book villas. We want to help you make memories that stay with you long after you&apos;ve checked out.&quot;
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-secondary/15 flex items-center justify-center">
              <span className="text-accent-secondary font-bold italic font-heading">W</span>
            </div>
            <div className="text-left">
              <p className="font-bold tracking-widest text-xs uppercase">The Stay Willas Team</p>
              <p className="text-text-primary/40 text-[10px] uppercase tracking-widest">Curation Specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rich SEO Content Section */}
      <section className="py-24 bg-[#FAF8F5] border-t border-[#DAA520]/20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent-secondary font-semibold tracking-[0.3em] uppercase text-xs mb-3 block">
              Maharashtra's Premier Villa Management
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#1B3564] mb-4">
              Redefining <span className="italic text-accent-primary font-serif font-light">Luxury Villa Rentals</span> in Maharashtra
            </h2>
            <p className="text-text-primary/75 text-sm md:text-base leading-relaxed font-light">
              At Stay Willas, we curate extraordinary private staycation experiences for families, corporate teams, and celebration groups seeking uncompromised comfort near Mumbai and Pune.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SEO Pillar 1: Lonavala */}
            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-4">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Lonavala Villa with Pool
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                Looking for the <strong className="font-semibold text-[#1B3564]">best villa in Lonavala</strong>? Our handpicked collection features signature architectural icons like <a href="/villa/the-angle-house" className="underline font-semibold text-accent-primary hover:text-[#1B3564]">The Angle House</a>. Enjoy a private waterfall swimming pool, master suite Jacuzzi, double-height glass facades, and pet-friendly fenced lawns.
              </p>
              <a href="/areas/lonavala" className="text-xs font-bold uppercase tracking-wider text-accent-primary hover:underline block pt-2">
                Explore Lonavala Villas &rarr;
              </a>
            </div>

            {/* SEO Pillar 2: Khopoli */}
            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-4">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Khopoli Villa Staycation
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                Plan a memorable <strong className="font-semibold text-[#1B3564]">weekend getaway villa in Khopoli</strong> with sprawling multi-acre grounds like <a href="/villa/canopy-crest" className="underline font-semibold text-accent-primary hover:text-[#1B3564]">Canopy Crest</a>. Ideal for large group gatherings up to 16+ guests, corporate offsites, charpai green lawns, and dedicated in-house chef services.
              </p>
              <a href="/areas/khopoli" className="text-xs font-bold uppercase tracking-wider text-accent-primary hover:underline block pt-2">
                Explore Khopoli Estates &rarr;
              </a>
            </div>

            {/* SEO Pillar 3: Signature Hospitality */}
            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-4">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Luxury Villa Rentals Maharashtra
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                Whether you need a <strong className="font-semibold text-[#1B3564]">pet friendly villa in Lonavala</strong> or a private pool retreat in Khopoli, Stay Willas offers 100% verified properties with 24/7 concierge support and customized dining.
              </p>
              <a href="/villas" className="text-xs font-bold uppercase tracking-wider text-accent-primary hover:underline block pt-2">
                View Full Villa Catalog &rarr;
              </a>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#DAA520]/20 space-y-6 text-left">
            <h3 className="text-2xl font-heading font-bold text-[#1B3564]">
              Why Travelers Choose Stay Willas for Private Villa Bookings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm text-text-primary/80 font-light leading-relaxed">
              <ul className="space-y-3 list-disc pl-5">
                <li><strong className="font-semibold text-[#1B3564]">Handpicked Luxury Properties:</strong> Every villa is personally inspected for safety, privacy, clean water filtration, and premium bedding.</li>
                <li><strong className="font-semibold text-[#1B3564]">In-House Chef & Dining:</strong> Freshly prepared Maharashtrian specialties, continental menus, and dedicated Jain meal preparation.</li>
                <li><strong className="font-semibold text-[#1B3564]">Pet-Friendly Havens:</strong> Securely fenced private gardens allowing your furry companions to run freely.</li>
              </ul>
              <ul className="space-y-3 list-disc pl-5">
                <li><strong className="font-semibold text-[#1B3564]">Corporate Offsites & Events:</strong> Spacious multi-acre estates equipped with high-speed Wi-Fi, audio setups, and outdoor gazebos.</li>
                <li><strong className="font-semibold text-[#1B3564]">Direct WhatsApp Concierge:</strong> Instant booking assistance with zero hidden reservation fees or surprise charges.</li>
                <li><strong className="font-semibold text-[#1B3564]">Prime Western Ghats Locations:</strong> Conveniently located within 2 hours of drive time from Mumbai and Pune.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
