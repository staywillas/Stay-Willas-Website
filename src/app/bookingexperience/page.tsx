import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BookingExperienceClient from "./booking-experience-client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "4 Flexible Booking Options & Transparent Flowchart | Stay Willas",
  description:
    "Choose from 4 easy ways to book your private luxury villa near Mumbai & Pune: Instant Online Checkout (0% Fee), WhatsApp VIP Concierge, 25% Token Hold, or Bespoke Corporate Event Planning.",
  keywords: [
    "stay willas booking options",
    "luxury villa booking experience",
    "villa booking flowchart",
    "pay 25 percent hold villa",
    "whatsapp villa booking",
    "private pool villa booking options lonavala",
    "corporate retreat booking lonavala",
  ],
  alternates: {
    canonical: "https://www.staywillas.com/bookingexperience",
  },
  openGraph: {
    title: "4 Flexible Booking Options | Stay Willas Luxury Villas",
    description:
      "Explore 4 transparent booking paths for your private pool villa escape in Lonavala, Khopoli, and Panchgani. 0% platform fee, 25% hold deposit, or 1-on-1 WhatsApp concierge.",
    url: "https://www.staywillas.com/bookingexperience",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "4 Flexible Booking Options | Stay Willas",
    description:
      "Choose the booking journey that fits your style. Instant online checkout, WhatsApp concierge, 25% token hold, or corporate retreats.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export const revalidate = 60; // 60s ISR revalidation

export default async function BookingExperiencePage() {
  // Query active villas for quick selection inside the booking client
  let villas: { id: string; slug: string; name: string; location: string; price: number }[] = [];
  try {
    villas = await prisma.villa.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        location: true,
        price: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching villas for booking experience page:", error);
  }

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.staywillas.com/bookingexperience#webpage",
        url: "https://www.staywillas.com/bookingexperience",
        name: "4 Flexible Booking Options | Stay Willas",
        description:
          "Choose between 4 transparent booking journeys: Instant 0% fee checkout, WhatsApp Concierge, 25% Token Hold, or Group Retreats.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.staywillas.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Booking Experience",
              item: "https://www.staywillas.com/bookingexperience",
            },
          ],
        },
      },
      {
        "@type": "HowTo",
        name: "How to Book a Luxury Villa on Stay Willas",
        description:
          "A step-by-step flowchart guide detailing 4 options to reserve private pool villas in Maharashtra.",
        step: [
          {
            "@type": "HowToStep",
            name: "Option 1: Instant Direct Online Booking",
            text: "Browse villas, select dates, add optional chef services, and checkout in 2 minutes with 0% OTA fees.",
          },
          {
            "@type": "HowToStep",
            name: "Option 2: VIP WhatsApp Concierge",
            text: "Chat 1-on-1 with a villa specialist for video walkthroughs, pet queries, and customized meal plans.",
          },
          {
            "@type": "HowToStep",
            name: "Option 3: 25% Token Hold (Flexi-Pay)",
            text: "Lock high-demand weekend dates with only a 25% deposit; pay the balance 48 hours prior to check-in.",
          },
          {
            "@type": "HowToStep",
            name: "Option 4: Bespoke Group & Corporate Retreats",
            text: "Multi-cottage buyouts (Breeze, Crest & Heaven at Willow Peak), tailored catering, GST input credit tax invoices, and dedicated on-site event managers.",
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <BookingExperienceClient villas={villas} />
      <Footer />
    </main>
  );
}
