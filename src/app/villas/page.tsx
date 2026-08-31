import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxury Villas for Rent Near Mumbai & Lonavala | Stay Willas",
  description: "Browse our handpicked collection of luxury villas for rent near Mumbai, Lonavala, and Khopoli. Enjoy private pools, chef service, and complete privacy.",
  keywords: [
    "luxury villas for rent near Mumbai",
    "villas for rent in Lonavala",
    "luxury villas in Maharashtra",
    "private pool villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/villas",
  },
  openGraph: {
    title: "Luxury Villas for Rent Near Mumbai & Lonavala | Stay Willas",
    description: "Browse our handpicked collection of luxury villas for rent near Mumbai, Lonavala, and Khopoli. Enjoy private pools, chef service, and complete privacy.",
    url: "https://www.staywillas.com/villas",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Villas for rent near Mumbai - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas for Rent Near Mumbai & Lonavala | Stay Willas",
    description: "Browse our handpicked collection of luxury villas for rent near Mumbai, Lonavala, and Khopoli. Enjoy private pools, chef service, and complete privacy.",
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "All Villas", url: "/villas" },
  ]);

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/villas#webpage`,
    url: `${BASE_URL}/villas`,
    name: "Luxury Villas for Rent Near Mumbai & Lonavala | Stay Willas",
    description: "Browse handpicked villas with private pool & chef service across Lonavala and Khopoli.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${BASE_URL}/villas#itemlist`,
    name: "Stay Willas Luxury Collection",
    numberOfItems: villas.length,
    itemListElement: villas.map((villa, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: villa.name,
      url: `${BASE_URL}/villa/${villa.slug}`,
      image: villa.image.startsWith("http") ? villa.image : `${BASE_URL}${villa.image}`,
    })),
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between">
      <div>
        {/* Structured Data: CollectionPage, ItemList & BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                collectionSchema,
                itemListSchema,
                breadcrumbSchema,
              ],
            }),
          }}
        />

        <Navbar />
        
        {/* Spacing below Navbar */}
        <div className="pt-44" />

        <h1 className="sr-only">Luxury Villas for Rent Near Mumbai & Lonavala | Stay Willas</h1>

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
