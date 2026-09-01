import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import dynamic from 'next/dynamic';
const EscapeClientPage = dynamic(() => import('./escape-client-page'));
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";

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
        url: "https://www.staywillas.com/images/hero-villa.webp",
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
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
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
    guests: 16,
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Group Escapes", url: "/escape" },
  ]);

  const collectionSchema = {
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/escape#webpage`,
    url: `${BASE_URL}/escape`,
    name: "Villas for Groups in Lonavala & Khopoli | Stay Willas",
    description: "Find private villas for groups in Lonavala with pools, spacious rooms and premium amenities.",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };

  const escapeFaqs = [
    {
      question: "What are the best private pool villas for groups in Lonavala?",
      answer: "The Angle House and Canopy Crest by Stay Willas are top-rated private pool villas for groups in Lonavala and Khopoli, offering 3 to 4 expansive bedroom suites, private swimming pools, master jacuzzis, and accommodations for 12 to 20+ guests."
    },
    {
      question: "Can we host a private family reunion or celebration at your Lonavala group villas?",
      answer: "Yes, our group villas in Lonavala feature large outdoor lounging lawns, pool decks, dedicated sound systems, and on-site caretakers to support intimate family celebrations and corporate offsites."
    },
    {
      question: "Do your group villas include customized chef meal catering?",
      answer: "Yes, dedicated private chefs cook all meals fresh on-site, offering customized multi-cuisine spreads, local Maharashtrian dishes, poolside barbecues, and pure vegetarian / Jain preparations."
    }
  ];

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": escapeFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [collectionSchema, breadcrumbSchema, faqSchema],
          }),
        }}
      />
      {/* Semantic Crawlable Headings for Googlebot */}
      <div className="sr-only">
        <h2>Villas for Groups in Lonavala | Private Pool Group Stays</h2>
        <h3>Best Large Group Villa Estates in Lonavala & Khopoli</h3>
        <p>
          Discover handpicked private pool villas for groups in Lonavala accommodating 10 to 20+ guests. 
          Featuring The Angle House and Canopy Crest with private swimming pools, on-site chef dining, master jacuzzis, and pet-friendly lawns.
        </p>
      </div>
      <EscapeClientPage 
        angleHouse={serializedAngleHouse} 
        canopyCrest={serializedCanopyCrest} 
      />
    </>
  );
}
