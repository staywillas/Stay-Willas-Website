import React from "react";
import { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { prisma } from "@/lib/db";
import VillasClient from "@/components/villas/villas-client";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";
import {
  publicVillaAmenities,
  publicVillaCategory,
  publicVillaName,
} from "@/lib/public-copy";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";
import { nieevantPhotos } from "@/data/nieevant-images";
import { NIEEVANT_SLUG, withNieevantFallback } from "@/data/nieevant-villa";

export const revalidate = 86400; // Refresh daily; admin updates trigger on-demand revalidation.

export const metadata: Metadata = {
  title: "Luxury Villas for Rent Near Mumbai | Stay Willas",
  description: "Browse our handpicked collection of luxury villas for rent near Mumbai, Lonavala, and Khopoli. Enjoy private pools, chef service, and complete privacy.",
  keywords: [
    "luxury villas for rent near Mumbai",
    "villas for rent in Maharashtra",
    "rent luxury villas near pune",
    "luxury villa rental catalog"
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

export default async function VillasPage() {
  // Fetch all villas in a single query
  const savedVillas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
  });
  const allVillas = withNieevantFallback(savedVillas);

  // All properties are live
  const hiddenSlugs: string[] = [];

  // Prioritize signature properties
  const prioritySlugs = ["the-angle-house", "canopy-crest", NIEEVANT_SLUG, "casa-de-reva", "willow-peak"];
  const prioritized = allVillas
    .filter((v) => prioritySlugs.includes(v.slug))
    .sort((a, b) => prioritySlugs.indexOf(a.slug) - prioritySlugs.indexOf(b.slug));
  const remaining = allVillas.filter((v) => !prioritySlugs.includes(v.slug) && !hiddenSlugs.includes(v.slug));
  const dbVillas = [...prioritized, ...remaining];

  // Map the database format to the UI client model structure
  const villas = dbVillas.map((villa) => ({
    id: villa.id,
    slug: villa.slug,
    name: publicVillaName(villa.slug, villa.name),
    location: villa.location,
    priceRaw: villa.price,
    priceFormatted: villa.price.toLocaleString("en-IN"),
    image: villa.slug === "canopy-crest" ? canopyCrestPhotos.hero.src : villa.slug === NIEEVANT_SLUG ? nieevantPhotos.hero.src : villa.images[0] || (
      villa.slug === "the-angle-house" ? "/assets/villas/the-angle-house/gallery-11.webp" :
      villa.slug === "casa-de-reva" || villa.slug === "terra-cotta-villa" ? "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg" :
      villa.slug.includes("willow-peak") ? "/assets/villas/willow-peak/graded-v1/wp-01.webp" :
      "/assets/villas/the-angle-house/gallery-11.webp"
    ),
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
    guests: villa.guests,
    category: publicVillaCategory(villa.category),
    amenities: publicVillaAmenities(villa.amenities, villa.slug),
  }));

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


        {/* Spacing below Navbar */}
        <div className="pt-28 md:pt-40" />

        {/* Highly Interactive, Real-Time Client Filter and Grid Section */}
        <VillasClient initialVillas={villas} />
      </div>

      <Footer />
    </main>
  );
}
