import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Villas Near Mumbai & Lonavala | Luxury Private Pool Villa Rentals | Stay Willas",
  description: "Rent luxury private pool villas near Mumbai, Lonavala, and Khopoli. Handpicked verified getaway homes, premium amenities, and scenic views. Book your dream staycation now.",
  keywords: ["villas in lonavala", "luxury villas in lonavala and khopoli", "luxury villas in khopoli"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Villas Near Mumbai & Lonavala | Luxury Private Pool Villa Rentals | Stay Willas",
    description: "Rent luxury private pool villas near Mumbai, Lonavala, and Khopoli. Handpicked verified getaway homes, premium amenities, and scenic views. Book your dream staycation now.",
    url: "https://www.staywillas.com",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Stay Willas Luxury Villas and Staycations",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas Near Mumbai & Lonavala | Luxury Private Pool Villa Rentals | Stay Willas",
    description: "Rent luxury private pool villas near Mumbai, Lonavala, and Khopoli. Handpicked verified getaway homes, premium amenities, and scenic views. Book your dream staycation now.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

// Critical above-the-fold components (loaded immediately)
import Hero from "@/components/home/hero";
import TopTicker from "@/components/home/top-ticker";
import BookingBar from "@/components/home/booking-bar";

// Below-the-fold components (lazy-loaded, only rendered when scrolled into view)
const DestinationShowcase = dynamic(() => import("@/components/home/destination-showcase"));
const FeaturedVillas = dynamic(() => import("@/components/home/featured-villas"));
const Experiences = dynamic(() => import("@/components/home/experiences"));
const InfiniteMarquee = dynamic(() => import("@/components/home/infinite-marquee"));
const WhyChooseUs = dynamic(() => import("@/components/home/why-choose-us"));
const SEOContent = dynamic(() => import("@/components/home/seo-content"));
const PartnerSection = dynamic(() => import("@/components/home/partner-section"));
const Footer = dynamic(() => import("@/components/layout/footer"));

import { prisma } from "@/lib/db";

export default async function Home() {
  // Let's explicitly fetch priorities
  const angleHouse = await prisma.villa.findUnique({
    where: { slug: "the-angle-house" }
  });
  
  const canopyCrest = await prisma.villa.findUnique({
    where: { slug: "canopy-crest" }
  });

  // Query all other premium villas
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

  const featuredVillas = dbVillas.map((villa) => ({
    id: villa.slug,
    name: villa.name,
    location: villa.location,
    image: villa.images[0] || "/images/hero-villa.png",
    price: villa.price.toLocaleString("en-IN"),
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
  }));

  return (
    <main className="min-h-screen bg-bg-primary">
      <h1 className="sr-only">Luxury Private Pool Villas Near Mumbai & Pune | Stay Willas</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Stay Willas",
            "alternateName": ["StayWillas", "Stay Willas"],
            "url": "https://www.staywillas.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.staywillas.com/villas?region={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Stay Willas",
            "alternateName": ["StayWillas", "Stay Willas"],
            "description": "Premium luxury villa rentals in Maharashtra. Handpicked private pool villas near Mumbai and Pune with chef services, pet-friendly options, and concierge support.",
            "url": "https://www.staywillas.com",
            "logo": "https://www.staywillas.com/icon.png",
            "image": "https://www.staywillas.com/icon.png",
            "telephone": "+91-9619042310",
            "email": "bookings@staywillas.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kim cottage, 14, PR Kadam Marg, Maneklal Estate, Ghatkopar West",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "postalCode": "400084",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "19.0912",
              "longitude": "72.9016"
            },
            "areaServed": [
              { "@type": "Place", "name": "Lonavala" },
              { "@type": "Place", "name": "Alibaug" },
              { "@type": "Place", "name": "Karjat" },
              { "@type": "Place", "name": "Khopoli" }
            ],
            "priceRange": "₹₹₹",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "00:00",
              "closes": "23:59"
            },
            "sameAs": [
              "https://www.instagram.com/staywillas"
            ]
          })
        }}
      />
      <Navbar />
      <TopTicker />
      <Hero />
      <BookingBar />
      <DestinationShowcase />
      <FeaturedVillas villas={featuredVillas} />
      <Experiences />
      <InfiniteMarquee />
      <WhyChooseUs />
      <SEOContent />
      <PartnerSection />
      <Footer />
    </main>
  );
}
