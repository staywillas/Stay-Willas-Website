import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";

export const revalidate = 60; // Instant TTFB via ISR cache

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
        url: "https://www.staywillas.com/images/hero-villa.webp",
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
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VillasPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const regionParam = resolvedParams.region;
  const categoryParam = resolvedParams.category;

  // Fetch all villas in a single query
  const allVillas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Prioritize signature properties
  const prioritySlugs = ["the-angle-house", "canopy-crest", "terra-cotta-villa", "willow-peak"];
  const prioritized = allVillas
    .filter((v) => prioritySlugs.includes(v.slug))
    .sort((a, b) => prioritySlugs.indexOf(a.slug) - prioritySlugs.indexOf(b.slug));
  const remaining = allVillas.filter((v) => !prioritySlugs.includes(v.slug));
  const dbVillas = [...prioritized, ...remaining];

  // Map the database format to the UI client model structure
  const villas = dbVillas.map((villa) => ({
    id: villa.id,
    slug: villa.slug,
    name: villa.slug === "willow-peak" ? "Willow Peak" : villa.name,
    location: villa.location,
    priceRaw: villa.price,
    priceFormatted: villa.price.toLocaleString("en-IN"),
    image: villa.slug === "terra-cotta-villa"
      ? (villa.images[0] || "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg")
      : villa.slug.includes("willow-peak") 
      ? "/assets/villas/willow-peak/main.webp" 
      : (villa.images[0] || "/images/hero-villa.webp"),
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
