import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WishlistClient from "@/components/wishlist/wishlist-client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "My Wishlist | Stay Willas | Premium Luxury Retreats",
  description: "Browse your handpicked saved collection of luxury villas and private staycations in Lonavala, Alibaug, and Karjat.",
  keywords: ["wishlist villas", "saved luxury stays", "favourite villas maharashtra"],
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
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

  // Map the database format to the UI model structure
  const allVillas = dbVillas.map((villa) => ({
    id: villa.id,
    slug: villa.slug,
    name: villa.name,
    location: villa.location,
    price: villa.price.toLocaleString("en-IN"),
    image: villa.images[0] || "/images/hero-villa.png",
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-48 pb-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="text-accent-secondary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
          Your Saved Sanctuary
        </span>
        <h1 className="text-5xl md:text-8xl font-heading mb-6 leading-tight">
          My <span className="italic text-accent-primary pr-4 font-heading font-medium">Wishlist</span>
        </h1>
        <p className="text-text-primary/55 text-lg max-w-2xl mx-auto leading-relaxed">
          Your private collection of premium getaways and modern architecture estates across Maharashtra.
        </p>
      </section>

      <WishlistClient allVillas={allVillas} />

      <Footer />
    </main>
  );
}
