import React, { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Wifi, Waves, Car,
  Wind, MapPin, Award, ChevronLeft,
  Share2, Heart, CheckCircle2,
  Users, Bed, BedDouble, Bath, PawPrint,
  Tv, Home, Trees, UtensilsCrossed, Utensils,
  Flame, Gamepad2, ShowerHead, Sun, Sparkles,
  Speaker, Music, ShieldCheck, Accessibility,
  HeartHandshake, DoorClosed, Layers, UserCheck, ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BookingCard from "@/components/villa/booking-card";
import MobileBookingController from "@/components/villa/mobile-booking-controller";
import BookingModalFlow from "@/components/villa/booking-modal-flow";
import ReviewSection from "@/components/villa/review-section";
import PropertyGallery from "@/components/villa/property-gallery";
import ShareButton from "@/components/villa/share-button";
import SaveButton from "@/components/villa/save-button";
import { getReviews } from "@/app/actions/review";
import { prisma } from "@/lib/db";
import FoodMenuModal from "@/components/villa/food-menu-modal";
import VillaSEOContent from "@/components/villas/villa-seo-content";
import { generatePropertySchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import {
  AnimatedPoolIcon,
  AnimatedBonfireIcon,
  AnimatedChefIcon,
  AnimatedMountainIcon,
  AnimatedWaterfallIcon,
  AnimatedGlassFrontageIcon,
  AnimatedLightingIcon,
  AnimatedLoungingIcon,
  AnimatedBalconyIcon,
  AnimatedLivingHallIcon
} from "@/components/ui/animated-amenity-icons";

export const revalidate = 60; // Instant TTFB via ISR cache

export async function generateStaticParams() {
  const villas = await prisma.villa.findMany({
    select: { slug: true },
  });
  return villas.map((v) => ({ slug: v.slug }));
}

// Cache query to avoid duplicate roundtrips between generateMetadata and VillaDetailPage
const getCachedVilla = React.cache
  ? React.cache(async (slug: string) => {
      let villa = await prisma.villa.findUnique({
        where: { slug },
        include: {
          dailyPrices: true,
          seasonalPrices: true,
        },
      });

      if (!villa) {
        villa = await prisma.villa.findUnique({
          where: { id: slug },
          include: {
            dailyPrices: true,
            seasonalPrices: true,
          },
        });
      }
      return villa;
    })
  : async (slug: string) => {
      let villa = await prisma.villa.findUnique({
        where: { slug },
        include: {
          dailyPrices: true,
          seasonalPrices: true,
        },
      });

      if (!villa) {
        villa = await prisma.villa.findUnique({
          where: { id: slug },
          include: {
            dailyPrices: true,
            seasonalPrices: true,
          },
        });
      }
      return villa;
    };

const getCachedReviews = React.cache
  ? React.cache(async (villaId: string) => {
      return await getReviews(villaId);
    })
  : async (villaId: string) => {
      return await getReviews(villaId);
    };

interface PageProps {
  params: Promise<{ slug: string }>;
}

const amenityIconMap: { [key: string]: React.ComponentType<any> } = {
  // Pool & Jacuzzi
  "Private Swimming Pool": AnimatedPoolIcon,
  "Massive Swimming Pool": AnimatedPoolIcon,
  "Heated Infinity Pool": AnimatedPoolIcon,
  "Infinity Swimming Pool": AnimatedPoolIcon,
  "Plunge Pool": AnimatedPoolIcon,
  "Heated Pool": AnimatedPoolIcon,
  "Private Jacuzzi": AnimatedPoolIcon,
  "Private Jacuzzi Bath": AnimatedPoolIcon,
  "Jacuzzi in Master Bedroom": AnimatedPoolIcon,
  "Jacuzzi Bath": AnimatedPoolIcon,
  "Waterfall Feature": AnimatedWaterfallIcon,

  // Music & Entertainment
  "Music System/Speaker": Speaker,
  "Music System / Speaker": Speaker,
  "Music System": Speaker,
  "Indoor/Outdoor Games": Gamepad2,
  "Indoor Games & Carrom": Gamepad2,
  "Carrom Board": Gamepad2,
  "Carrom Board Entertainment": Gamepad2,
  "Television": Tv,
  "Televisions in Each Unit": Tv,
  "Billiards Table": Gamepad2,
  "Beach Volley Net": Gamepad2,

  // Architecture & Rooms
  "Balcony/Terrace": AnimatedBalconyIcon,
  "2 Balconies": AnimatedBalconyIcon,
  "Spacious Balcony": AnimatedBalconyIcon,
  "Private Sit-Out": AnimatedBalconyIcon,
  "Cottage Sit-Outs": AnimatedBalconyIcon,
  "Living Hall": AnimatedLivingHallIcon,
  "Spacious Living Hall": AnimatedLivingHallIcon,
  "1 BHK A-Frame Cottage": Home,
  "3 Individual Standalone Cottages (Exclusive Estate)": Home,
  "Individual Cottages": Home,
  "A-Frame Alpine Architecture": Home,
  "A-Frame / Cottage-Style Architecture": Home,
  "Outdoor lounging spaces": AnimatedLoungingIcon,
  "Outdoor Seating": AnimatedLoungingIcon,
  "Open-air Lounge Pavilions": AnimatedLoungingIcon,

  // Accessibility & Safety
  "Wheelchair Friendly": Accessibility,
  "Senior Citizen Friendly": HeartHandshake,
  "CCTV Security": ShieldCheck,
  "Secure Private Parking": Car,
  "Private Parking": Car,
  "Parking": Car,

  // Bedroom & Living Essentials
  "Extra Mattress": BedDouble,
  "3 Beds": Bed,
  "Comfortable Double Bed": Bed,
  "Comfortable Double Beds": Bed,
  "Air-Conditioned Room": Wind,
  "Air-Conditioned Rooms": Wind,
  "Air-Conditioned Bedrooms": Wind,
  "Chilled Air Conditioning": Wind,
  "Air Conditioning": Wind,
  "Wardrobes": DoorClosed,
  "Super-fast Wi-Fi": Wifi,
  "High-Speed Wi-Fi": Wifi,
  "Wi-Fi": Wifi,

  // Bathrooms & Toiletries
  "Geyser": Flame,
  "Towels & Toiletries": Sparkles,
  "Attached Bathroom": Bath,
  "Attached Bathrooms": Bath,
  "3 Attached Bathrooms": Bath,
  "Shower Facilities": ShowerHead,

  // Dining & Chef
  "Meals Available": UtensilsCrossed,
  "Meals & Chef On-Demand": UtensilsCrossed,
  "Kailash (Private Chef)": AnimatedChefIcon,
  "Private Chef Included": AnimatedChefIcon,
  "Open-air BBQ Grill": Flame,
  "BBQ Grill Station": Flame,
  "BBQ Facility": Flame,
  "Outdoor Fireplace": AnimatedBonfireIcon,
  "Beach Bonfire Pit": AnimatedBonfireIcon,
  "Outdoor Dining Area": UtensilsCrossed,
  "Outdoor Dining & BBQ Area": UtensilsCrossed,
  "Dedicated Caretaker": UserCheck,
  "Daily Housekeeping": UserCheck,

  // Outdoor & Views
  "Spacious Lawn": Trees,
  "Expansive Lawn & Gazebo": Trees,
  "Lawn & Garden Area": Trees,
  "Garden & Greenery": Trees,
  "Spacious Gardens & Greenery": Trees,
  "Organic Vegetable Garden": Trees,
  "Tropical Courtyard": Trees,
  "Mountain & Valley Views": AnimatedMountainIcon,
  "Mountain & Ghat Views": AnimatedMountainIcon,
  "Mountain & Garden Views": AnimatedMountainIcon,
  "Panoramic Mountain Views": AnimatedMountainIcon,
  "Mountain / Scenic Views": AnimatedMountainIcon,
  "Panoramic Lake Views": AnimatedMountainIcon,
  "Lake Access & Views": AnimatedMountainIcon,
  "Beachfront Access": AnimatedMountainIcon,
  "Riverside Deck": AnimatedMountainIcon,
  "Well-Lit Outdoor Areas": Sun,
  "Well-Lit Evening Lawns": Sun,
  "Spacious Stone Deck": AnimatedBalconyIcon,
  "Vineyard Tours": Award,
  "Private Wine Tasting Cellar": ChefHat,
  "Kayaking Equipment": Waves,
};

const defaultRules = [
  "Check-in starts at 2:00 PM",
  "Check-out by 11:00 AM (so we can clean up for the next family!)",
  "Please don't smoke inside (but feel free to use the deck!)",
  "Your furry friends are more than welcome!",
  "Keep the music low after 10:00 PM so we stay friends with the neighbors",
];

const canopyCrestSpaces = [
  {
    title: "Bedroom 1",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
    description: "Ground floor suite with king bed, AC, WiFi & ensuite bath."
  },
  {
    title: "Bedroom 2",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
    description: "Cozy king bedroom with AC, wardrobe & attached bathroom."
  },
  {
    title: "Bedroom 3",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg",
    description: "Air-conditioned suite with scenic hillside garden views."
  },
  {
    title: "Bedroom 4",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
    description: "Spacious private bedroom with king bed & attached bath."
  },
  {
    title: "Living & Dining Room",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
    description: "Air-conditioned seating for 6 with TV & dining area."
  },
  {
    title: "Bathrooms",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
    description: "4 ensuite luxury bathrooms with hot water geysers & towels."
  },
  {
    title: "Swimming Pool",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    description: "Private 22x12 ft pool overlooking Sahyadri hills."
  },
  {
    title: "Lawn & Sit-out",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
    description: "Expansive green lawn with traditional charpai seating."
  }
];

const terraCottaSpaces = [
  {
    title: "Master Bedroom 1",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0035.jpg",
    description: "Plush king bed suite with AC, valley view & attached bath."
  },
  {
    title: "Bedroom 2",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0047.jpg",
    description: "Elegantly styled double bed suite with AC & wardrobe."
  },
  {
    title: "Bedroom 3 (Circular Bed)",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0055.jpg",
    description: "Distinctive circular bed design with AC & ensuite bath."
  },
  {
    title: "Bedroom 4",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0042.jpg",
    description: "Valley view bedroom with wooden finish & attached bath."
  },
  {
    title: "Private Swimming Pool",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg",
    description: "Exclusive pool with rustic mountain-view deck."
  },
  {
    title: "Spacious Living & Lounge",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0043.jpg",
    description: "Spacious family lounge with TV, sofas & music system."
  },
  {
    title: "Terrace & Balcony Deck",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0031.jpg",
    description: "Private upper-level sit-out overlooking valley mist."
  },
  {
    title: "Luxury Bathrooms",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0059.jpg",
    description: "Modern en-suite bathrooms with hot water & toiletries."
  }
];

const willowPeakSpaces = [
  {
    title: "Cottage A (A-Frame Chalet)",
    image: "/assets/villas/willow-peak/gallery-12.webp",
    description: "Chalet with king bed, in-room jacuzzi & garden sit-out."
  },
  {
    title: "Cottage B (A-Frame Chalet)",
    image: "/assets/villas/willow-peak/gallery-6.webp",
    description: "Alpine A-frame chalet with private jacuzzi & hill views."
  },
  {
    title: "Cottage C (A-Frame Chalet)",
    image: "/assets/villas/willow-peak/gallery-7.webp",
    description: "Secluded mountain cottage with private jacuzzi & BBQ deck."
  },
  {
    title: "Private In-Room Jacuzzis",
    image: "/assets/villas/willow-peak/gallery-1.webp",
    description: "Warm soothing jacuzzi inside each private cottage suite."
  },
  {
    title: "Expansive Garden & Lawns",
    image: "/assets/villas/willow-peak/gallery-2.webp",
    description: "Lush lawn with evening lighting & outdoor seating."
  },
  {
    title: "Outdoor Dining & BBQ Deck",
    image: "/assets/villas/willow-peak/gallery-4.webp",
    description: "Outdoor group dining area with live barbecue setup."
  }
];

const defaultVillaReviews: Record<string, { id: string; villaId: string; userId: string; userName: string; rating: number; comment: string; createdAt: Date }[]> = {
  "the-angle-house": [
    {
      id: "rev_ah_1",
      villaId: "lonavala-estate",
      userId: "guest_rohan_mehta",
      userName: "Rohan & Priya Mehta",
      rating: 5,
      comment: "The Monsoon Escape at The Angle House was breathtaking! The waterfall pool in the rain and glass facade view of Sahyadri clouds made it unforgettable. Kailash's culinary team prepared steaming hot pakoras & tea!",
      createdAt: new Date("2026-07-15"),
    },
    {
      id: "rev_ah_2",
      villaId: "lonavala-estate",
      userId: "guest_vikram_singhania",
      userName: "Vikram Singhania",
      rating: 5,
      comment: "Booked directly via WhatsApp for our weekday stay. Saved significantly compared to OTA platforms, and the caretaker had the master jacuzzi ready before check-in.",
      createdAt: new Date("2026-06-20"),
    },
    {
      id: "rev_ah_3",
      villaId: "lonavala-estate",
      userId: "guest_aditi_deshmukh",
      userName: "Aditi Deshmukh",
      rating: 5,
      comment: "Our Golden Retriever had the best time running across the fenced lawns! Total peace of mind for pet parents.",
      createdAt: new Date("2026-05-18"),
    },
    {
      id: "rev_ah_4",
      villaId: "lonavala-estate",
      userId: "guest_sameer_kulkarni",
      userName: "Sameer Kulkarni",
      rating: 5,
      comment: "Celebrated my 30th birthday here with 12 friends on a weekday. Cleanest pool in Lonavala and zero noise disturbances.",
      createdAt: new Date("2026-08-04"),
    },
  ],
  "canopy-crest": [
    {
      id: "rev_cc_1",
      villaId: "khopoli-canopy-crest",
      userId: "guest_anand_joshi",
      userName: "Anand & Shweta Joshi",
      rating: 5,
      comment: "The Monsoon Escape at Canopy Crest was unbelievable! The massive open lawn turns emerald green in the rains and the 22ft pool is huge. We booked for 16 family members and had a fantastic experience!",
      createdAt: new Date("2026-07-22"),
    },
    {
      id: "rev_cc_2",
      villaId: "khopoli-canopy-crest",
      userId: "guest_rahul_verma",
      userName: "Rahul Verma",
      rating: 5,
      comment: "Organized our startup leadership offsite here for 2 weekday nights. High-speed Wi-Fi, great indoor games, and direct WhatsApp concierge booking was seamless.",
      createdAt: new Date("2026-06-28"),
    },
    {
      id: "rev_cc_3",
      villaId: "khopoli-canopy-crest",
      userId: "guest_deepak_sharma",
      userName: "Deepak Sharma",
      rating: 5,
      comment: "Hardly 1 hour drive from Mumbai via the Expressway. The mountain views and fresh barbecue by the pool during monsoon made our stay unforgettable.",
      createdAt: new Date("2026-05-30"),
    },
    {
      id: "rev_cc_4",
      villaId: "khopoli-canopy-crest",
      userId: "guest_pooja_hegde",
      userName: "Pooja Hegde",
      rating: 5,
      comment: "Cleanest bathrooms, powerful air conditioning, and absolute seclusion without noisy neighbors. We are coming back every monsoon!",
      createdAt: new Date("2026-08-12"),
    },
  ],
  "willow-peak": [
    {
      id: "rev_wp_1",
      villaId: "lonavala-willow-peak",
      userId: "guest_kunal_patel",
      userName: "Kunal & Neha Patel",
      rating: 5,
      comment: "Willow Peak in Kurwande is an absolute hidden gem! The A-frame cottages are super cozy with in-room jacuzzi baths and serene hill views.",
      createdAt: new Date("2026-07-10"),
    },
    {
      id: "rev_wp_2",
      villaId: "lonavala-willow-peak",
      userId: "guest_siddharth_rao",
      userName: "Siddharth Rao",
      rating: 5,
      comment: "We booked 2 cottages for a weekend getaway with friends. The garden sit-out, barbecue setup, and quiet surroundings were wonderful.",
      createdAt: new Date("2026-08-01"),
    },
  ],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const villa = await getCachedVilla(slug);

  if (!villa) {
    return {
      title: "Requested Luxury Villa Was Not Found | Stay Willas",
    };
  }

  const city = villa.location.split(",")[0].trim();
  let titleText = `${villa.name} | Private Pool Villa in ${city} | Stay Willas`;
  let descText = `Book ${villa.name}, a ${villa.bedrooms} BHK private pool villa in ${city} with in-house chef service, private pool & luxury staycation amenities. Best direct rates with 0% platform fee.`;
  let keywordsList = [`${villa.bedrooms} BHK private pool villa in ${city}`, `${villa.name.toLowerCase()}`, `villa in ${city.toLowerCase()}`, `private pool villa ${city.toLowerCase()}`];

  if (villa.slug === "the-angle-house") {
    titleText = "The Angle House | 3 BHK Villa in Lonavala | Stay Willas";
    descText = "Book The Angle House in Kamshet, Lonavala — a 3 BHK luxury glass house villa featuring private waterfall pool, master suite jacuzzi, pet-friendly fenced lawns, and in-house chef service. Direct bookings from ₹13,000/night.";
    keywordsList = [
      "the angle house lonavala",
      "glass house villa lonavala",
      "the angle house kamshet",
      "3 BHK glass house villa in lonavala",
      "villa with waterfall pool in lonavala",
      "pet friendly villa lonavala",
      "jacuzzi villa lonavala"
    ];
  } else if (villa.slug === "canopy-crest") {
    titleText = "Canopy Crest | 4 BHK Pool Villa in Khopoli | Stay Willas";
    descText = "Book Canopy Crest in Khopoli — a sprawling 4 BHK private estate for large groups & corporate offsites featuring a 22ft private pool, charpai lawns, bonfire deck, and on-demand chef service. Direct bookings from ₹15,000/night.";
    keywordsList = [
      "canopy crest khopoli",
      "khopoli villa with swimming pool",
      "4 BHK villa in khopoli with private pool",
      "large group villa khopoli",
      "corporate offsite villa khopoli",
      "villas in khopoli with private pool"
    ];
  } else if (villa.slug === "willow-peak") {
    titleText = "Willow Peak | A-Frame Cottages in Lonavala | Stay Willas";
    descText = "Book Willow Peak in Kurwande, Lonavala — 3 standalone A-frame cottages (Cottage A, B, and C) with private jacuzzi baths, mountain views, garden barbecue, and scenic sit-outs. Book individual cottages or all 3 from ₹5,999/night/cottage.";
    keywordsList = [
      "willow peak lonavala",
      "a-frame cottage lonavala",
      "cottage stay in kurwande lonavala",
      "jacuzzi cottage lonavala",
      "a frame villa lonavala",
      "couples villa with jacuzzi lonavala"
    ];
  } else if (villa.slug === "terra-cotta-villa") {
    titleText = "Terra Cotta Villa | 4 BHK Villa in Mahabaleshwar | Stay Willas";
    descText = "Book Terra Cotta Villa in Mahabaleshwar — a 4 BHK mountain-view private estate with swimming pool, garden gazebos, and on-demand chef service.";
  }

  const ogImageUrl = villa.images[0] 
    ? (villa.images[0].startsWith("http") ? villa.images[0] : `https://www.staywillas.com${villa.images[0]}`) 
    : "https://www.staywillas.com/images/hero-villa.webp";

  return {
    title: titleText,
    description: descText,
    keywords: keywordsList,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: `https://www.staywillas.com/villa/${villa.slug}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://www.staywillas.com/villa/${villa.slug}`,
      siteName: "Stay Willas",
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${villa.name} - Luxury Villa Staycation in ${city}`,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [ogImageUrl],
    }
  };
}

export default async function VillaDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const villa = await getCachedVilla(slug);

  if (!villa) {
    notFound();
  }

  const dbReviews = await getCachedReviews(villa.id);
  const reviews = dbReviews.length > 0 ? dbReviews : (defaultVillaReviews[villa.slug] || []);
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : 5.0;

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const isWillowCottage = villa.slug.startsWith("willow-peak-cottage");
  const isWillowEntire = villa.slug === "willow-peak";

  let relatedVillaIds = [villa.id];
  if (isWillowCottage) {
    const entireEstate = await prisma.villa.findFirst({ where: { slug: "willow-peak" } });
    if (entireEstate) relatedVillaIds.push(entireEstate.id);
  } else if (isWillowEntire) {
    const allWillow = await prisma.villa.findMany({
      where: {
        OR: [
          { slug: "willow-peak" },
          { slug: { startsWith: "willow-peak-cottage" } }
        ]
      },
      select: { id: true }
    });
    relatedVillaIds = allWillow.map(v => v.id);
  }

  const activeBookings = await prisma.booking.findMany({
    where: {
      villaId: { in: relatedVillaIds },
      status: { in: ["CONFIRMED", "PENDING", "BLOCKED", "HELD"] },
      OR: [
        { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
        { status: "HELD", createdAt: { gte: tenMinutesAgo } }
      ]
    },
    select: {
      checkIn: true,
      checkOut: true,
      status: true,
      userId: true,
    }
  });

  const serializedBookings = activeBookings.map(b => {
    let cottagesCount = 1;
    try {
      if (b.userId && b.userId.startsWith('{')) {
        const parsed = JSON.parse(b.userId);
        if (parsed.cottagesCount) cottagesCount = parsed.cottagesCount;
        else if (parsed.guests) cottagesCount = Math.max(1, Math.min(3, Math.ceil(parsed.guests / 4)));
      }
    } catch (e) {}

    return {
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
      status: b.status,
      cottagesCount,
    };
  });

  const villaData = {
    id: villa.id,
    slug: villa.slug,
    name: villa.name,
    location: villa.location,
    rating: avgRating,
    reviews: reviewCount,
    price: villa.price.toLocaleString("en-IN"),
    images: villa.images,
    description: villa.description,
    guests: villa.guests,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
    amenities: villa.amenities
      .filter((name) => {
        const lower = name.toLowerCase().trim();
        return (
          !lower.includes("modern warm lighting") &&
          !lower.includes("warm lighting") &&
          !lower.includes("panoramic glass") &&
          !lower.includes("glass frontage")
        );
      })
      .map((name) => {
        let icon = amenityIconMap[name];
        if (!icon) {
          const lower = name.toLowerCase();
          if (lower.includes("music") || lower.includes("speaker") || lower.includes("sound") || lower.includes("audio")) icon = Speaker;
          else if (lower.includes("game") || lower.includes("carrom") || lower.includes("play") || lower.includes("board")) icon = Gamepad2;
          else if (lower.includes("wheelchair") || lower.includes("accessible")) icon = Accessibility;
          else if (lower.includes("senior") || lower.includes("elder") || lower.includes("friendly")) icon = HeartHandshake;
          else if (lower.includes("cctv") || lower.includes("security") || lower.includes("guard")) icon = ShieldCheck;
          else if (lower.includes("mattress") || lower.includes("bed")) icon = BedDouble;
          else if (lower.includes("geyser") || lower.includes("heater") || lower.includes("hot water") || lower.includes("warm")) icon = Flame;
          else if (lower.includes("wardrobe") || lower.includes("closet") || lower.includes("cupboard")) icon = DoorClosed;
          else if (lower.includes("towel") || lower.includes("toilet") || lower.includes("linen") || lower.includes("amenities")) icon = Sparkles;
          else if (lower.includes("meal") || lower.includes("food") || lower.includes("dining") || lower.includes("kitchen")) icon = UtensilsCrossed;
          else if (lower.includes("lawn") || lower.includes("garden") || lower.includes("tree") || lower.includes("grass")) icon = Trees;
          else if (lower.includes("balcon") || lower.includes("terrace") || lower.includes("sit-out") || lower.includes("deck")) icon = AnimatedBalconyIcon;
          else if (lower.includes("pool") || lower.includes("jacuzzi") || lower.includes("bath") || lower.includes("swim")) icon = AnimatedPoolIcon;
          else if (lower.includes("waterfall")) icon = AnimatedWaterfallIcon;
          else if (lower.includes("chef") || lower.includes("cook") || lower.includes("grill") || lower.includes("bbq")) icon = AnimatedChefIcon;
          else if (lower.includes("light") || lower.includes("sun")) icon = Sun;
          else if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("internet")) icon = Wifi;
          else if (lower.includes("ac") || lower.includes("air cond") || lower.includes("cool")) icon = Wind;
          else if (lower.includes("lounge") || lower.includes("seating") || lower.includes("outdoor")) icon = AnimatedLoungingIcon;
          else if (lower.includes("hall") || lower.includes("living")) icon = AnimatedLivingHallIcon;
          else if (lower.includes("caretaker") || lower.includes("staff") || lower.includes("housekeeping")) icon = UserCheck;
          else if (lower.includes("tv") || lower.includes("television")) icon = Tv;
          else if (lower.includes("park") || lower.includes("car")) icon = Car;
          else if (lower.includes("mountain") || lower.includes("valley") || lower.includes("view")) icon = AnimatedMountainIcon;
          else if (lower.includes("cottage") || lower.includes("house") || lower.includes("villa") || lower.includes("home")) icon = Home;
          else icon = Sparkles;
        }
        return {
          name,
          icon: icon || Sparkles,
        };
      }),
    rules: defaultRules,
  };

  // Define FAQ data
  const villaFaqsMap: Record<string, { question: string; answer: string }[]> = {
    "the-angle-house": [
      {
        question: "Does The Angle House in Lonavala have a private pool?",
        answer: "Yes, The Angle House features a private swimming pool with a soothing waterfall feature, outdoor lounging spaces, and comfortable chairs."
      },
      {
        question: "Is Jain food available at The Angle House?",
        answer: "Absolutely. The Angle House offers in-house private chef services that can prepare customized veg-only and Jain food spreads in separate kitchen setups."
      },
      {
        question: "What is the guest capacity of The Angle House?",
        answer: "The Angle House can comfortably host up to 16 guests, making it ideal for family reunions, birthdays, and celebrations."
      }
    ],
    "canopy-crest": [
      {
        question: "Is Canopy Crest pet friendly?",
        answer: "Yes, Canopy Crest is a fully pet-friendly private estate featuring an expansive lawn where your pets can run and play safely."
      },
      {
        question: "How close is Canopy Crest to Adlabs Imagica in Khopoli?",
        answer: "Canopy Crest is located in Khopoli, Maharashtra, just a short drive from Adlabs Imagica, making it an ideal base for families visiting the theme park."
      },
      {
        question: "What is the guest capacity and amenities at Canopy Crest?",
        answer: "Canopy Crest comfortably accommodates up to 16 guests across 4 bedrooms, and features a private pool (22x12 ft), spacious lawn, music system, indoor/outdoor games, and dedicated caretaker services."
      }
    ],
    "willow-peak": [
      {
        question: "Where is Willow Peak located?",
        answer: "Willow Peak is located in Kurwande, Lonavala, Maharashtra, enveloped in scenic mountain greenery and tranquil landscapes."
      },
      {
        question: "How does booking individual cottages work at Willow Peak?",
        answer: "Willow Peak consists of 3 individual A-frame wooden cottages: Cottage A, Cottage B, and Cottage C. Each cottage accommodates up to 4 guests and features its own private en-suite jacuzzi bath. You can book either a single standalone cottage (Cottage A, B, or C for up to 4 guests) or all 3 cottages together (up to 12 guests) to reserve the entire private estate exclusively."
      },
      {
        question: "What amenities and activities are available at Willow Peak?",
        answer: "Willow Peak offers air-conditioned A-frame cottage suites (Cottage A, B, C), private jacuzzi baths, plush king beds, Wi-Fi, TV, outdoor garden dining, BBQ facilities, carrom board, and secure parking."
      }
    ],
    "terra-cotta-villa": [
      {
        question: "Where is Terra Cotta Villa located?",
        answer: "Terra Cotta Villa is located in Kaswand, along the scenic Panchgani - Mahabaleshwar Road, just 4.5 km from Mapro Garden and 11 km from Lingmala Falls."
      },
      {
        question: "Does Terra Cotta Villa have a private swimming pool and garden lawn?",
        answer: "Yes, Terra Cotta Villa features an exclusive private swimming pool, a sprawling manicured lawn, and an outdoor gazebo with panoramic mountain and valley views."
      },
      {
        question: "What is the guest capacity of Terra Cotta Villa?",
        answer: "Terra Cotta Villa is a spacious 4 BHK private estate comfortably accommodating up to 16 guests, with 4 private attached bathrooms, air-conditioned bedrooms, and dedicated caretaker services."
      }
    ]
  };

  const villaMapData: Record<string, { directUrl: string; embedUrl: string }> = {
    "the-angle-house": {
      directUrl: "https://www.google.com/maps/place/StayWillas+The+Angle+House+%7C+With+Jacuzzi+%7C+Lonavala/@18.7687773,73.5659749,17z/data=!3m1!4b1!4m9!3m8!1s0x3bc2ad6536845e45:0x4a41e2fba2fc985c!5m2!4m1!1i2!8m2!3d18.7687773!4d73.5685498!16s%2Fg%2F11zb_x4877",
      embedUrl: "https://maps.google.com/maps?q=18.7687773,73.5685498&hl=en&z=16&output=embed"
    },
    "canopy-crest": {
      directUrl: "https://www.google.com/maps/place/StayWillas+Canopy+Crest+Khopoli+%7C+Premium+Villa+with+Swimming+Pool/@18.7101381,73.3318344,17z/data=!3m1!4b1!4m6!3m5!1s0x3be80541e66fe4dd:0xf311fa62a65e318f!8m2!3d18.7101381!4d73.3344093!16s%2Fg%2F11zcgpz6w2",
      embedUrl: "https://maps.google.com/maps?q=18.7101381,73.3344093&hl=en&z=16&output=embed"
    },
    "willow-peak": {
      directUrl: "https://www.google.com/maps?q=P9P9+5XW+Willow+Peak+Resort,+Kurvande,+Maharashtra+410402&ftid=0x3be8070059702d61:0x4182db34c43d1717",
      embedUrl: "https://maps.google.com/maps?q=P9P9+5XW+Willow+Peak+Resort,+Kurvande,+Maharashtra+410402&hl=en&z=16&output=embed"
    },
    "terra-cotta-villa": {
      directUrl: "https://maps.google.com/?q=Kaswand,+Panchgani,+Maharashtra+412805",
      embedUrl: "https://maps.google.com/maps?q=Kaswand,+Panchgani,+Maharashtra+412805&hl=en&z=15&output=embed"
    }
  };

  const isLonavala = villa.location.toLowerCase().includes("lonavala");
  const isKhopoli = villa.location.toLowerCase().includes("khopoli");
  const isMahabaleshwar = villa.location.toLowerCase().includes("mahabaleshwar") || villa.location.toLowerCase().includes("panchgani");
  const areaName = isLonavala ? "Lonavala" : isKhopoli ? "Khopoli" : "Mahabaleshwar";
  const areaUrl = isLonavala ? "/areas/lonavala" : isKhopoli ? "/areas/khopoli" : "/areas/mahabaleshwar";

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/areas" },
    { name: areaName, url: areaUrl },
    { name: villaData.name, url: `/villa/${villaData.slug}` },
  ]);

  const propertySchema = generatePropertySchema({
    slug: villaData.slug,
    name: villaData.name,
    description: villaData.description,
    images: villaData.images,
    price: villaData.price,
    location: villaData.location,
    bedrooms: villaData.bedrooms,
    bathrooms: villaData.bathrooms,
    guests: villaData.guests,
    amenities: villaData.amenities,
    reviews: reviews.map((r) => ({
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
  });

  const villaFaqs = villaFaqsMap[villa.slug] || [];
  const faqSchema = generateFAQSchema(villaFaqs);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary pb-28 lg:pb-0">
      {/* Structured Data: VacationRental / Lodging, BreadcrumbList & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema,
            propertySchema,
            ...(faqSchema ? [faqSchema] : []),
          ]),
        }}
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-8 sm:pb-12 px-3.5 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2.5 sm:mb-6">
          <Link href="/" className="flex items-center gap-1.5 text-text-primary/40 hover:text-accent-primary transition-colors text-[11px] sm:text-xs uppercase tracking-widest font-bold">
            <ChevronLeft size={14} />
            Back to Collection
          </Link>
          {/* Nice little share/save bar at the top right of the page */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ShareButton />
            <SaveButton villaId={villaData.slug} villaName={villaData.name} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading mb-1 sm:mb-2">{villaData.name}</h1>
        <div className="flex items-center gap-2.5 sm:gap-4 text-text-primary/60 text-xs sm:text-sm mb-3 sm:mb-5">
          <div className="flex items-center gap-1">
            <MapPin size={13} className="text-accent-secondary" />
            <span>{villaData.location}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-text-primary/20" />
          {villaData.reviews > 0 ? (
            <div className="flex items-center gap-1">
              <Award size={13} className="text-accent-primary fill-[#2563EB]" />
              <span className="text-text-primary font-medium">{villaData.rating}</span>
              <span>({villaData.reviews} {villaData.reviews === 1 ? "review" : "reviews"})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Award size={13} className="text-text-primary/20" />
              <span className="text-text-primary/40 italic">No reviews yet</span>
            </div>
          )}
        </div>

        {/* Cinematic, Interactive Property Gallery & Lightbox (Rendered immediately below title) */}
        <PropertyGallery images={villaData.images} propertyName={villaData.name} villaId={villaData.slug} />

        {/* Weekday Promo Banner for Signature Villas */}
        {(villaData.slug === "the-angle-house" || villaData.slug === "canopy-crest" || villaData.slug === "terra-cotta-villa" || villaData.slug.includes("willow-peak")) && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-[#DAA520]/15 border border-[#DAA520]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 shadow-xs">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] sm:text-xs uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs animate-pulse shrink-0">
                🔥 28% OFF
              </span>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-[#1B3564] leading-tight">
                  Weekday Special: 28% OFF (Monday – Thursday Stays)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-light mt-0.5">
                  Direct discount on Mon–Thu getaways. Use coupon <strong className="text-[#1B3564] font-bold">STAYW28</strong> on checkout.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🔥 I would like to book *${villaData.name}* with the 28% Weekday Discount. Please share available dates and final quote.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl shadow-xs shrink-0 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto text-center"
            >
              <span>Claim on WhatsApp</span>
            </a>
          </div>
        )}

        {/* In-Villa Bespoke Food Menu (Moved up for high prominence & fast access) */}
        <div className="mb-4 sm:mb-6">
          <FoodMenuModal />
        </div>

        {/* TOP OVERVIEW & BOOKING SECTION (Split 7 / 5 Columns on Desktop) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 mb-10 sm:mb-16 items-start">
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-6 w-full">
            {/* 1. Guests, Bedrooms & Bathrooms Specs Capsule */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-slate-900 text-[11px] sm:text-xs uppercase tracking-widest bg-white border border-[#DAA520]/20 px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl max-w-fit shadow-xs">
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold">
                <Users size={13} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "12 Guests (All 3 Cottages)" : `${villaData.guests} Guests`}
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold">
                <Bed size={13} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "3 Cottages (A, B, C)" : `${villaData.bedrooms} Bedrooms`}
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-1.5 sm:gap-2 font-bold">
                <Bath size={13} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "3 Jacuzzi Baths" : `${villaData.bathrooms} Bathrooms`}
              </span>
            </div>

            {/* 2. Pet Friendly Badge */}
            {villaData.rules.some(r => r.toLowerCase().includes("furry") || r.toLowerCase().includes("pet")) && (
              <div className="bg-[#DAA520]/5 border border-[#DAA520]/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 shadow-xs select-none">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#DAA520]/10 border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] shrink-0">
                    <PawPrint size={22} className="animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-heading text-base sm:text-lg text-[#1B3564] font-bold">Pet Friendly Sanctuary</h4>
                    <p className="text-[11px] sm:text-xs text-text-primary/60 leading-relaxed mt-0.5 font-medium">
                      Your furry friends are more than welcome here! Sprawling outdoor space and safe layouts await.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#DAA520] font-black uppercase tracking-widest bg-white border border-[#DAA520]/10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs shrink-0">
                  Pets Allowed
                </span>
              </div>
            )}

            {/* 3. Highlight Readability Points Box */}
            <div className="bg-white border border-[#DAA520]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs text-left">
              <h3 className="text-xs sm:text-base font-bold text-[#1B3564] mb-3 sm:mb-4 uppercase tracking-wider">Key Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                <li className="flex items-start gap-2 text-slate-900 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={15} />
                  <span>Luxe retreat ideal for up to {villaData.guests} guests.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-900 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={15} />
                  <span>Expansive {villaData.bedrooms} bedrooms & private pool deck.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-900 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={15} />
                  <span>
                    {villaData.slug === "the-angle-house"
                      ? "Curated private chef & bespoke menu choices."
                      : "Curated private chef & gourmet dining choices."}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-slate-900 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={15} />
                  <span>Pristine verified hygiene & full housekeeping.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Luxury Reservation Trigger & Lead-Gated Modal Flow (PC & Mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative w-full lg:sticky lg:top-28" id="booking-card-section">
            <BookingModalFlow
              villaId={villaData.id}
              villaName={villaData.name}
              price={Number(villaData.price) || villa.price}
              basePrice={villa.price}
              weekendPrice={villa.weekendPrice}
              fridayPrice={villa.fridayPrice}
              saturdayPrice={villa.saturdayPrice}
              sundayPrice={villa.sundayPrice}
              dailyPrices={villa.dailyPrices as any}
              seasonalPrices={villa.seasonalPrices as any}
              maxGuests={villaData.guests}
              baseGuests={villa.baseGuests ?? undefined}
              extraGuestFee={villa.extraGuestFee ?? undefined}
              bookings={serializedBookings}
              location={villaData.location}
              isAngleHouse={villaData.slug === "the-angle-house"}
            />
          </div>
        </div>

        {/* FULL-WIDTH SECTION: What this place offers (Amenities) */}
        <div className="mb-12 sm:mb-16 text-left">
          <div className="mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-[#DAA520]/20">
            <span className="text-accent-secondary text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-black block mb-1">
              Included Amenities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#1B3564] font-bold">
              What This Place Offers
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
            {villaData.amenities.map((amenity) => (
              <div 
                key={amenity.name} 
                className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1.5 sm:gap-3 bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#DAA520]/20 shadow-xs hover:border-[#DAA520]/40 transition-all justify-center sm:justify-start"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#FAF8F5] border border-[#DAA520]/20 flex items-center justify-center text-accent-secondary shrink-0">
                  <amenity.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight line-clamp-2">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FULL-WIDTH SECTION: Rooms & Spaces Layout (For Canopy Crest, Terra Cotta Villa & Willow Peak) */}
        {(villaData.slug === "canopy-crest" || villaData.slug === "terra-cotta-villa" || villaData.slug.includes("willow-peak")) && (
          <div className="mb-12 sm:mb-16 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-[#DAA520]/20 gap-2 sm:gap-4">
              <div>
                <span className="text-accent-secondary text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-black block mb-1">
                  Estate Layout
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#1B3564] font-bold">
                  Rooms & Spaces
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {villaData.slug === "terra-cotta-villa"
                  ? "Rustic 4 BHK private pool estate in Panchgani / Mahabaleshwar accommodating up to 16 guests."
                  : villaData.slug === "canopy-crest"
                  ? "Sprawling 4 BHK mountain sanctuary accommodating up to 16 guests with private pool & lawns."
                  : "Exclusive 3-cottage mountain estate in Kurwande, Lonavala with private in-room jacuzzis for up to 12 guests."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
              {(villaData.slug === "terra-cotta-villa"
                ? terraCottaSpaces 
                : villaData.slug === "canopy-crest"
                ? canopyCrestSpaces 
                : willowPeakSpaces
              ).map((space, idx) => (
                <div key={idx} className="bg-white border border-[#DAA520]/20 hover:border-[#DAA520]/45 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={space.image}
                      alt={space.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5 sm:p-3.5 flex flex-col justify-center text-left">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1B3564] truncate leading-tight mb-0.5">
                      {space.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-light truncate leading-tight">
                      {space.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL-WIDTH SECTION: The Story */}
        <div className="mb-16 text-left">
          <div className="mb-8 pb-4 border-b border-[#DAA520]/20">
            <span className="text-accent-secondary text-[10px] tracking-[0.3em] uppercase font-bold block mb-1">
              About The Property
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-bold italic">
              The Story
            </h2>
          </div>
          <div className="bg-white border border-[#DAA520]/20 rounded-3xl p-6 sm:p-10 shadow-sm">
            <p className="text-slate-900 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
              {villaData.description}
            </p>
          </div>
        </div>

        {/* FULL-WIDTH SECTION: Location & Surroundings (Interactive Google Map) */}
        <div className="mb-16 text-left">
          <div className="mb-8 pb-4 border-b border-[#DAA520]/20">
            <span className="text-accent-secondary text-[10px] tracking-[0.3em] uppercase font-bold block mb-1">
              Neighborhood & Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-bold">
              Location & Surroundings
            </h2>
          </div>
          
          <div className="bg-white border border-[#DAA520]/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-accent-secondary font-black uppercase tracking-widest block mb-1">
                  Exact Google Maps Pinpoint
                </span>
                <h3 className="text-xl font-heading font-bold text-[#1B3564] flex items-center gap-2">
                  <MapPin size={18} className="text-[#DAA520]" />
                  {villaData.location}
                </h3>
              </div>
              
              {villaMapData[villaData.slug]?.directUrl && (
                <a
                  href={villaMapData[villaData.slug].directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1B3564] hover:bg-[#152A50] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
                >
                  <MapPin size={14} className="text-[#DAA520]" />
                  Open in Google Maps
                </a>
              )}
            </div>

            {/* Map Embed Frame */}
            {villaMapData[villaData.slug]?.embedUrl && (
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <iframe
                  title={`${villaData.name} Google Maps Location`}
                  src={villaMapData[villaData.slug].embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Getting Here Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#DAA520] shrink-0 mt-0.5" />
                <span>
                  {villaData.slug === "the-angle-house" 
                    ? "Conveniently accessible from Mumbai-Pune Expressway via Kamshet / Old Highway." 
                    : villaData.slug === "canopy-crest"
                    ? "Direct smooth drive from Khopoli toll plaza, 15 mins from Imagicaa."
                    : "Scenic hilltop drive through Kurwande, close to Tiger Point & Bushi Dam."}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-[#DAA520] shrink-0 mt-0.5" />
                <span>Free on-site private vehicle parking with well-lit driveway access.</span>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
        
        <VillaSEOContent slug={villaData.slug} />
      </section>

      <Footer />
    </main>
  );
}
