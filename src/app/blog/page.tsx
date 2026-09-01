import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { blogsData } from "@/data/blogs";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import ThreeDHoverCard from "@/components/ui/three-d-hover-card";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
  description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
  keywords: ["stay willas blog"],
  alternates: {
    canonical: "https://www.staywillas.com/blog",
  },
  openGraph: {
    title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
    description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
    url: "https://www.staywillas.com/blog",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Stay Willas Blog",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
    description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default function BlogIndexPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blog#webpage`,
    url: `${BASE_URL}/blog`,
    name: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
    description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      {/* Structured Data: CollectionPage & BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [collectionSchema, breadcrumbSchema],
          }),
        }}
      />
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 text-center px-6 border-b border-[#DAA520]/15 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,166,59,0.06)_0,rgba(226,166,59,0)_60%)] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-[#DAA520] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm">
              <Sparkles size={12} className="text-[#DAA520]" /> Stay Willas Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-heading text-[#1B3564] leading-tight mb-6">
              Curated <span className="italic font-light tracking-wide bg-gradient-to-r from-[#DAA520] via-[#E2A63B] to-[#B8860B] bg-clip-text text-transparent drop-shadow-sm font-sans pr-2 inline-block">Luxury Villa Guides & Stories</span>
            </h1>
            <p className="text-sm md:text-base text-slate-600/90 max-w-xl mx-auto leading-relaxed">
              Explore expert tips on booking the best private pool villas, planning corporate offsites, hosting events, and getting the most out of your weekend staycations near Mumbai and Pune.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {blogsData.map((blog) => (
              <div 
                key={blog.slug} 
                className="bg-white border border-[#DAA520]/15 hover:border-[#DAA520]/45 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group w-full"
              >
                <div>
                  {/* Image wrapper with 3D hover support */}
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-60" />
                    
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#1B3564] font-bold text-[9px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm font-mono border border-[#DAA520]/20 select-none">
                      Guide
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left">
                    {/* Date and Read Time Row */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3 select-none">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#DAA520]" />
                        {blog.date}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/40" />
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#DAA520]" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg md:text-xl font-heading text-[#1B3564] font-bold mb-3 group-hover:text-accent-primary transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed font-normal line-clamp-3 mb-5">
                      {blog.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0 text-left">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center justify-between w-full bg-[#1B3564] hover:bg-[#152A50] text-white rounded-xl px-5 py-3 text-xs font-bold tracking-wider uppercase shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                  >
                    Read Article
                    <ArrowRight size={14} className="text-[#DAA520] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
