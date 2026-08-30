import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import EscapeClientPage from "./escape-client-page";

export const metadata: Metadata = {
  title: "Villas for Groups in Lonavala | Private Pool Stays | Stay Willas",
  description: "Find private villas for groups in Lonavala with pools, spacious rooms and premium amenities. Perfect for friends, families and weekend getaways.",
  keywords: [
    "villas for groups in Lonavala",
    "group villas in Lonavala",
    "villa for group in Lonavala",
    "Lonavala villas for groups",
    "villa for friends in Lonavala",
    "private villa for groups in Lonavala",
    "villas for family groups in Lonavala",
    "weekend villa in Lonavala",
    "large group villa in Lonavala"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/escape",
  },
  openGraph: {
    title: "Villas for Groups in Lonavala | Private Pool Stays | Stay Willas",
    description: "Find private villas for groups in Lonavala with pools, spacious rooms and premium amenities. Perfect for friends, families and weekend getaways.",
    url: "https://www.staywillas.com/escape",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Villas for Groups in Lonavala - Stay Willas Collection",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas for Groups in Lonavala | Private Pool Stays | Stay Willas",
    description: "Find private villas for groups in Lonavala with pools, spacious rooms and premium amenities. Perfect for friends, families and weekend getaways.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default async function EscapePage() {
  // Fetch the two main properties
  const angleHouse = await prisma.villa.findUnique({
    where: { slug: "the-angle-house" }
  });

  const canopyCrest = await prisma.villa.findUnique({
    where: { slug: "canopy-crest" }
  });

  // Fallback data in case the database is not seeded or records are missing
  const defaultAngleHouse = {
    id: "lonavala-estate",
    slug: "the-angle-house",
    name: "The Angle House",
    location: "Kamshet, Lonavala, Maharashtra",
    price: 13000,
    weekendPrice: 20000,
    fridayPrice: 15000,
    saturdayPrice: 20000,
    sundayPrice: 13000,
    baseGuests: 12,
    extraGuestFee: 1200,
    guests: 16,
    bedrooms: 3,
    bathrooms: 3,
    images: [
      "/assets/villas/the-angle-house/gallery-11.webp",
      "/assets/villas/the-angle-house/gallery-3.webp",
      "/assets/villas/the-angle-house/gallery-13.webp"
    ],
    amenities: [
      "Private Swimming Pool",
      "Outdoor lounging spaces",
      "Jacuzzi in Master Bedroom",
      "Dedicated Caretaker"
    ]
  };

  const defaultCanopyCrest = {
    id: "khopoli-canopy-crest",
    slug: "canopy-crest",
    name: "Canopy Crest",
    location: "Khopoli, Maharashtra",
    price: 15000,
    weekendPrice: 22000,
    fridayPrice: 18000,
    saturdayPrice: 22000,
    sundayPrice: 22000,
    baseGuests: 12,
    extraGuestFee: 1200,
    guests: 20,
    bedrooms: 4,
    bathrooms: 5,
    images: [
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
      "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg"
    ],
    amenities: [
      "Private Swimming Pool",
      "Indoor/Outdoor Games",
      "Music System/Speaker",
      "Spacious Lawn",
      "Dedicated Caretaker"
    ]
  };

  const serializedAngleHouse = angleHouse ? {
    id: angleHouse.id,
    slug: angleHouse.slug,
    name: angleHouse.name,
    location: angleHouse.location,
    price: angleHouse.price,
    weekendPrice: angleHouse.weekendPrice,
    fridayPrice: angleHouse.fridayPrice,
    saturdayPrice: angleHouse.saturdayPrice,
    sundayPrice: angleHouse.sundayPrice,
    baseGuests: angleHouse.baseGuests,
    extraGuestFee: angleHouse.extraGuestFee,
    guests: angleHouse.guests,
    bedrooms: angleHouse.bedrooms,
    bathrooms: angleHouse.bathrooms,
    images: angleHouse.images,
    amenities: angleHouse.amenities
  } : defaultAngleHouse;

  const serializedCanopyCrest = canopyCrest ? {
    id: canopyCrest.id,
    slug: canopyCrest.slug,
    name: canopyCrest.name,
    location: canopyCrest.location,
    price: canopyCrest.price,
    weekendPrice: canopyCrest.weekendPrice,
    fridayPrice: canopyCrest.fridayPrice,
    saturdayPrice: canopyCrest.saturdayPrice,
    sundayPrice: canopyCrest.sundayPrice,
    baseGuests: canopyCrest.baseGuests,
    extraGuestFee: canopyCrest.extraGuestFee,
    guests: canopyCrest.guests,
    bedrooms: canopyCrest.bedrooms,
    bathrooms: canopyCrest.bathrooms,
    images: canopyCrest.images,
    amenities: canopyCrest.amenities
  } : defaultCanopyCrest;

  return (
    <EscapeClientPage 
      angleHouse={serializedAngleHouse} 
      canopyCrest={serializedCanopyCrest} 
    />
  );
}
