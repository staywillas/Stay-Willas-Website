import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VillaCard from "@/components/home/villa-card";

export const metadata: Metadata = {
  title: "Our Villa Collection | Stay Willas | Luxury Stays in Maharashtra",
  description: "Browse our handpicked collection of luxury villas in Lonavala, Alibaug, Mahabaleshwar and Karjat. Each property is personally verified for the ultimate staycation experience.",
  keywords: ["luxury villa collection", "private villas maharashtra", "premium staycations", "Stay Willas properties"],
};

const villas = [
  {
    id: "lonavala-estate",
    slug: "the-mist-estate",
    name: "Misty Mornings Cliffhouse",
    location: "Lonavala, Maharashtra",
    price: "45,000",
    rating: 4.9,
    image: "/images/villa-lonavala.png",
    bedrooms: 5,
    bathrooms: 6,
    guests: 12,
    category: "Mountain View"
  },
  {
    id: "alibaug-shores",
    slug: "azure-beach-house",
    name: "Alibaug Palms Beachhouse",
    location: "Alibaug, Maharashtra",
    price: "38,000",
    rating: 4.8,
    image: "/images/villa-alibaug.png",
    bedrooms: 4,
    bathrooms: 4,
    guests: 10,
    category: "Beachfront"
  },
  {
    id: "nashik-vineyard",
    slug: "vignette-manor",
    name: "Lake-View Vineyard Villa",
    location: "Nashik, Maharashtra",
    price: "28,000",
    rating: 4.7,
    image: "/images/exp-chef.png",
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    category: "Vineyards"
  },
  {
    id: "panchgani-heights",
    slug: "sahyardi-manor",
    name: "Panchgani Whispering Pines",
    location: "Panchgani, Maharashtra",
    price: "55,000",
    rating: 5.0,
    image: "/images/villa-mahabaleshwar.png",
    bedrooms: 6,
    bathrooms: 7,
    guests: 15,
    category: "Mountain View"
  },
  {
    id: "karjat-riverside",
    slug: "river-echoes",
    name: "Karjat River House",
    location: "Karjat, Maharashtra",
    price: "32,000",
    rating: 4.7,
    image: "/images/hero-villa.png",
    bedrooms: 3,
    bathrooms: 3,
    guests: 8,
    category: "Private Estates"
  },
  {
    id: "mulshi-lakefront",
    slug: "serene-waters-estate",
    name: "Mulshi Lakehouse",
    location: "Mulshi, Maharashtra",
    price: "42,000",
    rating: 4.9,
    image: "/images/exp-pool.png",
    bedrooms: 4,
    bathrooms: 5,
    guests: 10,
    category: "Infinity Pools"
  },
  {
    id: "igatpuri-peaks",
    slug: "cloud-nine-villa",
    name: "Igatpuri Clouds Villa",
    location: "Igatpuri, Maharashtra",
    price: "35,000",
    rating: 4.8,
    image: "/images/villa-lonavala.png",
    bedrooms: 4,
    bathrooms: 4,
    guests: 10,
    category: "Mountain View"
  },
  {
    id: "kashid-beach",
    slug: "palm-grove-sanctuary",
    name: "Kashid Palms Villa",
    location: "Kashid, Maharashtra",
    price: "50,000",
    rating: 4.9,
    image: "/images/villa-alibaug.png",
    bedrooms: 5,
    bathrooms: 5,
    guests: 12,
    category: "Beachfront"
  }
];

import CategoryBar from "@/components/layout/category-bar";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VillasPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const regionParam = resolvedParams.region;
  const categoryParam = resolvedParams.category;

  const region = typeof regionParam === "string" ? regionParam.trim().toLowerCase() : undefined;
  const category = typeof categoryParam === "string" ? categoryParam.trim() : undefined;

  // Filter villas based on active region or category search params
  const filteredVillas = villas.filter((villa) => {
    const matchesRegion = region ? villa.location.toLowerCase().includes(region) : true;
    const matchesCategory = category ? villa.category.toLowerCase() === category.toLowerCase() : true;
    return matchesRegion && matchesCategory;
  });

  const hasActiveFilter = !!(region || category);

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-48 pb-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
          All Our Homes
        </span>
        <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
          Find Your <br />
          <span className="italic text-gold text-gradient">Perfect Stay</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          Whether you want a quiet home in the hills or a beautiful place by the beach, 
          we have something for you.
        </p>
      </section>

      {/* Airbnb Style Category Bar */}
      <CategoryBar />

      {/* Active Filter Indicators */}
      {hasActiveFilter && (
        <section className="pt-8 pb-2 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div className="text-white/80 font-sans text-lg">
            Found <span className="text-gold font-bold">{filteredVillas.length}</span> luxury stays 
            {category && <span> matching <span className="text-gold italic font-heading font-bold">"{category}"</span></span>}
            {region && <span> in <span className="text-gold capitalize font-bold">{region}</span></span>}
          </div>
          <Link href="/villas" className="btn-glow-gold px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 w-fit">
            Clear Active Filters
          </Link>
        </section>
      )}

      {/* Grid Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {filteredVillas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {filteredVillas.map((villa) => (
              <VillaCard key={villa.id} {...villa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 px-6 max-w-3xl mx-auto my-12">
            <h3 className="text-3xl font-heading text-white mb-4 italic">No matching sanctuaries found</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed text-sm">
              We don't have any stays matching your selected criteria in this location yet. Let's look at all our handpicked Maharashtra retreats!
            </p>
            <Link href="/villas" className="btn-glow-gold px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-block">
              Explore Entire Collection
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
