import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxury Villa Collection for Rent | Stay Willas",
  description: "Browse our collection of luxury villas in Lonavala, Alibaug & Karjat. Each verified property offers the ultimate private staycation experience.",
  keywords: ["luxury villas for rent in maharashtra", "book premium villa lonavala", "private pool properties alibaug", "corporate offsite villas karjat", "family vacation villas near mumbai"],
  alternates: {
    canonical: "/villas",
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VillasPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const regionParam = resolvedParams.region;
  const categoryParam = resolvedParams.category;

  // Fetch priorities to ensure they are always first
  const angleHouse = await prisma.villa.findUnique({
    where: { slug: "the-angle-house" }
  });
  
  const canopyCrest = await prisma.villa.findUnique({
    where: { slug: "canopy-crest" }
  });

  // Query other premium villas
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
        
        {/* Spacing below Navbar */}
        <div className="pt-44" />

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
