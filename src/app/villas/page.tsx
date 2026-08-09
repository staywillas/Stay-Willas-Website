import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staycation Villas Near Mumbai & Lonavala | Stay Willas",
  description: "Book staycation villas near mumbai with private pools and chefs. Explore verified villas in lonavala for your next luxury weekend trip with family.",
  keywords: ["staycation villas in maharashtra", "villas near mumbai", "best villas in lonavala"],
  alternates: {
    canonical: "https://www.staywillas.com/villas",
  },
  openGraph: {
    title: "Staycation Villas Near Mumbai & Lonavala | Stay Willas",
    description: "Book staycation villas near mumbai with private pools and chefs. Explore verified villas in lonavala for your next luxury weekend trip with family.",
    url: "https://www.staywillas.com/villas",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Staycation Villas in Maharashtra",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staycation Villas Near Mumbai & Lonavala | Stay Willas",
    description: "Book staycation villas near mumbai with private pools and chefs. Explore verified villas in lonavala for your next luxury weekend trip with family.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
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
        {/* Structured Data: ItemList & BreadcrumbList for SERP Carousel & Hierarchy */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Luxury Staycation Villas in Maharashtra | Stay Willas",
                "description": "Browse handpicked staycation villas near Mumbai in Lonavala, Khopoli, Karjat, and Alibaug with private pool & chef service.",
                "numberOfItems": villas.length,
                "itemListElement": villas.map((villa, idx) => ({
                  "@type": "ListItem",
                  "position": idx + 1,
                  "name": villa.name,
                  "url": `https://www.staywillas.com/villa/${villa.slug}`,
                  "image": villa.image.startsWith("http") ? villa.image : `https://www.staywillas.com${villa.image}`
                }))
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.staywillas.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Villas",
                    "item": "https://www.staywillas.com/villas"
                  }
                ]
              }
            ])
          }}
        />

        <Navbar />
        
        {/* Spacing below Navbar */}
        <div className="pt-44" />

        <h1 className="sr-only">Staycation Villas Near Mumbai & Lonavala | Stay Willas</h1>

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
