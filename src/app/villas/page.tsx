import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Villa Collection | Stay Willas | Luxury Stays in Maharashtra",
  description: "Browse our handpicked collection of luxury villas in Lonavala, Alibaug, Mahabaleshwar and Karjat. Each property is personally verified for the ultimate staycation experience.",
  keywords: ["luxury villa collection", "private villas maharashtra", "premium staycations", "Stay Willas properties"],
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VillasPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const regionParam = resolvedParams.region;
  const categoryParam = resolvedParams.category;

  // Query all villas dynamically from the live Supabase PostgreSQL database
  const dbVillas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map the database format to the UI client model structure
  const villas = dbVillas.map((villa) => ({
    id: villa.id,
    slug: villa.slug,
    name: villa.name,
    location: villa.location,
    priceRaw: villa.price,
    priceFormatted: villa.price.toLocaleString("en-IN"),
    image: villa.images[0] || "/images/hero-villa.png",
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
    guests: villa.guests,
    category: villa.category,
    amenities: villa.amenities,
  }));

  const initialRegion = typeof regionParam === "string" ? regionParam.trim() : "";
  const initialCategory = typeof categoryParam === "string" ? categoryParam.trim() : "";

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Elegant Header Section */}
        <section className="pt-48 pb-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
          <span className="text-accent-secondary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
            All Our Homes
          </span>
          <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
            Find Your <br />
            <span className="italic text-accent-primary pr-4 font-heading font-medium">Perfect Stay</span>
          </h1>
          <p className="text-text-primary/55 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            Whether you want a quiet home in the hills or a beautiful place by the beach, 
            we have something for you.
          </p>
        </section>

        {/* Highly Interactive, Real-Time Client Filter and Grid Section */}
        <VillasClient 
          initialVillas={villas} 
          initialRegion={initialRegion}
          initialCategory={initialCategory}
        />
      </div>

      <Footer />
    </main>
  );
}
