import React, { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Wifi, Waves, Car,
  Wind, MapPin, Award, ChevronLeft,
  Share2, Heart, CheckCircle2,
  Users, Bed, Bath, PawPrint,
  Tv, Home, Trees, UtensilsCrossed,
  Flame, Gamepad2, ShowerHead, Sun, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BookingCard from "@/components/villa/booking-card";
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

export const dynamic = "force-dynamic";

// Cache query to avoid duplicate roundtrips between generateMetadata and VillaDetailPage
const getCachedVilla = cache(async (slug: string) => {
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
});

const getCachedReviews = cache(async (villaId: string) => {
  return await getReviews(villaId);
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

const amenityIconMap: { [key: string]: React.ComponentType<any> } = {
  "Super-fast Wi-Fi": Wifi,
  "Heated Infinity Pool": AnimatedPoolIcon,
  "Infinity Swimming Pool": AnimatedPoolIcon,
  "Private Swimming Pool": AnimatedPoolIcon,
  "Massive Swimming Pool": AnimatedPoolIcon,
  "Plunge Pool": AnimatedPoolIcon,
  "Heated Pool": AnimatedPoolIcon,
  "Private Parking": Car,
  "Kailash (Private Chef)": AnimatedChefIcon,
  "Private Chef Included": AnimatedChefIcon,
  "Chilled Air Conditioning": Wind,
  "Daily Housekeeping": CheckCircle2,
  "Beachfront Access": AnimatedMountainIcon,
  "Beach Bonfire Pit": AnimatedBonfireIcon,
  "Vineyard Tours": Award,
  "Lake Access & Views": AnimatedMountainIcon,
  "Private Wine Tasting Cellar": AnimatedChefIcon,
  "Spacious Stone Deck": Award,
  "Billiards Table": Award,
  "Mountain & Valley Views": AnimatedMountainIcon,
  "Mountain & Ghat Views": AnimatedMountainIcon,
  "Panoramic Lake Views": AnimatedMountainIcon,
  "Lawn & Garden Area": CheckCircle2,
  "Riverside Deck": AnimatedMountainIcon,
  "Organic Vegetable Garden": CheckCircle2,
  "Open-air BBQ Grill": AnimatedChefIcon,
  "BBQ Grill Station": AnimatedChefIcon,
  "Outdoor Fireplace": AnimatedBonfireIcon,
  "Kayaking Equipment": Waves,
  "Private Jacuzzi": AnimatedPoolIcon,
  "Spacious Balcony": MapPin,
  "Tropical Courtyard": CheckCircle2,
  "Open-air Lounge Pavilions": CheckCircle2,
  "Beach Volley Net": Award,
  "Individual Cottages": Home,
  "A-Frame / Cottage-Style Architecture": Home,
  "Air-Conditioned Rooms": Wind,
  "Comfortable Double Beds": Bed,
  "Television": Tv,
  "Wi-Fi": Wifi,
  "Attached Bathrooms": Bath,
  "Shower Facilities": ShowerHead,
  "Jacuzzi Bath": AnimatedPoolIcon,
  "Mountain / Scenic Views": AnimatedMountainIcon,
  "Garden & Greenery": Trees,
  "Outdoor Seating": AnimatedLoungingIcon,
  "Outdoor Dining Area": UtensilsCrossed,
  "Carrom Board": Gamepad2,
  "BBQ Facility": Flame,
  "Parking": Car,
  "Well-Lit Outdoor Areas": Sun,
  "Cottage Sit-Outs": AnimatedBalconyIcon,
  "3 Beds": Bed,
  "2 Balconies": AnimatedBalconyIcon,
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
    description: "This is a spacious bedroom situated on the ground floor of the property.\n\nThe room offers a comfortable king-sized bed, AC, Wi-Fi, wardrobes and a window that opens up to a beautiful view of the manicured field.\n\nIt has an ensuite bathroom with a geyser, towels, and basic toiletries."
  },
  {
    title: "Bedroom 2",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
    description: "This is a spacious bedroom situated on the ground floor of the property.\n\nThe room offers a comfortable king-sized bed, AC, Wi-Fi, wardrobes and a window that opens up to a beautiful view of the manicured field.\n\nIt has an ensuite bathroom with a geyser, towels, and basic toiletries."
  },
  {
    title: "Bedroom 3",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg",
    description: "This is a spacious bedroom situated on the ground floor of the property.\n\nThe room offers a comfortable king-sized bed, AC, Wi-Fi, wardrobes and a window that opens up to a beautiful view of the manicured field.\n\nIt has an ensuite bathroom with a geyser, towels, and basic toiletries."
  },
  {
    title: "Bedroom 4",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
    description: "This is a spacious bedroom situated on the ground floor of the property.\n\nThe room offers a comfortable king-sized bed, AC, Wi-Fi, wardrobes and a window that opens up to a beautiful view of the manicured field.\n\nIt has an ensuite bathroom with a geyser, towels, and basic toiletries."
  },
  {
    title: "Living & Dining Room",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
    description: "This living room is set on the ground floor.\n\nIt can easily seat upto 6 people & is equipped with an AC, a wired music system, WiFi and a cosy seating arrangement.\n\nThe dining room, offering comfortable seating for up to 6 people, is a part of the living room."
  },
  {
    title: "Bathrooms",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
    description: "There are 4 ensuite bathrooms and 1 powder room in the living area.\n\nAll bathrooms have geysers, towels and basic toiletries."
  },
  {
    title: "Swimming Pool",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    description: "Guests can enjoy a relaxing soak in the private swimming pool.\n\nThis pool overlooks the surrounding hills, 22x12 ft. in size and 4 ft. in depth."
  },
  {
    title: "Lawn",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
    description: "This is an expansive lawn, located on the ground floor of the property, overlooking amazing views of the hills around.\n\nIt is decked with a sit-out space and comfortable traditional charpais for up to 12 people.\n\nGuests can meditate here, take a walk, have fun or relish some barbeque."
  }
];

const defaultVillaReviews: Record<string, { id: string; villaId: string; userId: string; userName: string; rating: number; comment: string; createdAt: Date }[]> = {
  "the-angle-house": [
    {
      id: "rev_ah_1",
      villaId: "lonavala-estate",
      userId: "guest_rohan_mehta",
      userName: "Rohan & Priya Mehta (Bandra, Mumbai)",
      rating: 5,
      comment: "The Monsoon Escape at The Angle House was breathtaking! The waterfall pool in the rain and glass facade view of Sahyadri clouds made it unforgettable. Kailash's culinary team prepared steaming hot pakoras & tea!",
      createdAt: new Date("2026-07-15"),
    },
    {
      id: "rev_ah_2",
      villaId: "lonavala-estate",
      userId: "guest_vikram_singhania",
      userName: "Vikram Singhania (Koregaon Park, Pune)",
      rating: 5,
      comment: "Booked directly via WhatsApp for our weekday stay. Saved significantly compared to OTA platforms, and the caretaker had the master jacuzzi ready before check-in.",
      createdAt: new Date("2026-06-20"),
    },
    {
      id: "rev_ah_3",
      villaId: "lonavala-estate",
      userId: "guest_aditi_deshmukh",
      userName: "Aditi Deshmukh (Thane, Mumbai)",
      rating: 5,
      comment: "Our Golden Retriever had the best time running across the fenced lawns! Total peace of mind for pet parents.",
      createdAt: new Date("2026-05-18"),
    },
    {
      id: "rev_ah_4",
      villaId: "lonavala-estate",
      userId: "guest_sameer_kulkarni",
      userName: "Sameer Kulkarni (Kothrud, Pune)",
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
      userName: "Anand & Shweta Joshi (Dadar, Mumbai)",
      rating: 5,
      comment: "The Monsoon Escape at Canopy Crest was unbelievable! The massive open lawn turns emerald green in the rains and the 22ft pool is huge. We booked for 16 family members and had a fantastic experience!",
      createdAt: new Date("2026-07-22"),
    },
    {
      id: "rev_cc_2",
      villaId: "khopoli-canopy-crest",
      userId: "guest_rahul_verma",
      userName: "Rahul Verma (Tech Mahindra, Pune)",
      rating: 5,
      comment: "Organized our startup leadership offsite here for 2 weekday nights. High-speed Wi-Fi, great indoor games, and direct WhatsApp concierge booking was seamless.",
      createdAt: new Date("2026-06-28"),
    },
    {
      id: "rev_cc_3",
      villaId: "khopoli-canopy-crest",
      userId: "guest_deepak_sharma",
      userName: "Deepak Sharma (Navi Mumbai)",
      rating: 5,
      comment: "Hardly 1 hour drive from Mumbai via the Expressway. The mountain views and fresh barbecue by the pool during monsoon made our stay unforgettable.",
      createdAt: new Date("2026-05-30"),
    },
    {
      id: "rev_cc_4",
      villaId: "khopoli-canopy-crest",
      userId: "guest_pooja_hegde",
      userName: "Pooja Hegde (Andheri West, Mumbai)",
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
      userName: "Kunal & Neha Patel (Vile Parle, Mumbai)",
      rating: 5,
      comment: "Willow Peak in Kurwande is an absolute hidden gem! The A-frame cottages are super cozy with in-room jacuzzi baths and serene hill views.",
      createdAt: new Date("2026-07-10"),
    },
    {
      id: "rev_wp_2",
      villaId: "lonavala-willow-peak",
      userId: "guest_siddharth_rao",
      userName: "Siddharth Rao (Baner, Pune)",
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
  let titleText = `${villa.name} | ${villa.bedrooms} BHK Private Pool Villa in ${city} | Stay Willas`;
  let descText = `Book ${villa.name}, a ${villa.bedrooms} BHK private pool villa in ${city} with in-house chef service, private pool & luxury staycation amenities. Best direct rates with 0% platform fee.`;
  let keywordsList = [`${villa.bedrooms} BHK private pool villa in ${city}`, `${villa.name.toLowerCase()}`, `villa in ${city.toLowerCase()}`, `private pool villa ${city.toLowerCase()}`];

  if (villa.slug === "the-angle-house") {
    titleText = "The Angle House | 3 BHK Glass House Villa in Lonavala with Waterfall Pool & Jacuzzi | Stay Willas";
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
    titleText = "Canopy Crest | 4 BHK Private Pool Estate in Khopoli for Groups (Up to 16 Guests) | Stay Willas";
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
    titleText = "Willow Peak | Scenic A-Frame Cottages & Jacuzzi Retreat in Kurwande, Lonavala | Stay Willas";
    descText = "Book Willow Peak in Kurwande, Lonavala — 3 standalone A-frame cottages (Cottage A, B, and C) with private jacuzzi baths, mountain views, garden barbecue, and scenic sit-outs. Book individual cottages or all 3 from ₹5,999/night/cottage.";
    keywordsList = [
      "willow peak lonavala",
      "a-frame cottage lonavala",
      "cottage stay in kurwande lonavala",
      "jacuzzi cottage lonavala",
      "a frame villa lonavala",
      "couples villa with jacuzzi lonavala"
    ];
  }

  const ogImageUrl = villa.images[0] 
    ? (villa.images[0].startsWith("http") ? villa.images[0] : `https://www.staywillas.com${villa.images[0]}`) 
    : "https://www.staywillas.com/images/hero-villa.png";

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
  const activeBookings = await prisma.booking.findMany({
    where: {
      villaId: villa.id,
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
        const lowerName = name.toLowerCase();
        if (lowerName.includes("bed")) icon = Bed;
        else if (lowerName.includes("balcon")) icon = AnimatedBalconyIcon;
        else if (lowerName.includes("pool")) icon = AnimatedPoolIcon;
        else if (lowerName.includes("chef") || lowerName.includes("grill")) icon = AnimatedChefIcon;
        else if (lowerName.includes("light")) icon = AnimatedLightingIcon;
        else if (lowerName.includes("wifi") || lowerName.includes("wi-fi")) icon = Wifi;
        else if (lowerName.includes("ac ") || lowerName.includes("air cond")) icon = Wind;
        else if (lowerName.includes("lounge") || lowerName.includes("outdoor")) icon = AnimatedLoungingIcon;
        else if (lowerName.includes("hall") || lowerName.includes("living")) icon = AnimatedLivingHallIcon;
        else if (lowerName.includes("waterfall")) icon = AnimatedWaterfallIcon;
        else if (lowerName.includes("glass") || lowerName.includes("panoramic")) icon = AnimatedGlassFrontageIcon;
      }
      return {
        name,
        icon: icon || CheckCircle2,
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
    }
  };

  const isLonavala = villa.location.toLowerCase().includes("lonavala");
  const areaName = isLonavala ? "Lonavala" : "Khopoli";
  const areaUrl = isLonavala ? "/areas/lonavala" : "/areas/khopoli";

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

      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-text-primary/40 hover:text-accent-primary transition-colors text-xs uppercase tracking-widest">
            <ChevronLeft size={16} />
            Back to Collection
          </Link>
          {/* Nice little share/save bar at the top right of the page */}
          <div className="flex items-center gap-4">
            <ShareButton />
            <SaveButton villaId={villaData.slug} villaName={villaData.name} />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading mb-4">{villaData.name}</h1>
        <div className="flex items-center gap-4 text-text-primary/60 text-sm mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-accent-secondary" />
            <span>{villaData.location}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-text-primary/20" />
          {villaData.reviews > 0 ? (
            <div className="flex items-center gap-1">
              <Award size={14} className="text-accent-primary fill-[#2563EB]" />
              <span className="text-text-primary font-medium">{villaData.rating}</span>
              <span>({villaData.reviews} {villaData.reviews === 1 ? "review" : "reviews"})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Award size={14} className="text-text-primary/20" />
              <span className="text-text-primary/40 italic">No reviews yet</span>
            </div>
          )}
        </div>

        {/* Cinematic, Interactive Property Gallery & Lightbox */}
        <PropertyGallery images={villaData.images} propertyName={villaData.name} villaId={villaData.slug} />

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 mb-24">
          <div className="order-2 lg:order-1 lg:col-span-7">
            {/* 1. Guests, Bedrooms & Bathrooms Specs Capsule (Moved under photos) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-900 text-xs uppercase tracking-widest mb-8 bg-white border border-[#DAA520]/20 px-6 py-4 rounded-2xl max-w-fit shadow-sm">
              <span className="flex items-center gap-2 font-bold">
                <Users size={14} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "4 Guests/Cottage (Max 12 Full Estate)" : `${villaData.guests} Guests`}
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-2 font-bold">
                <Bed size={14} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "3 Cottages (A, B, C)" : `${villaData.bedrooms} Bedrooms`}
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-2 font-bold">
                <Bath size={14} className="text-accent-secondary" />
                {villaData.slug === "willow-peak" ? "3 Jacuzzi Baths" : `${villaData.bathrooms} Bathrooms`}
              </span>
            </div>

            {/* 2. In-Villa Bespoke Food Menu Popup (Above Amenities section) */}
            <div>
              <FoodMenuModal />
            </div>

            {/* 3. What this place offers (Amenities) */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading text-[#1B3564] mb-8 font-bold border-b border-border-subtle pb-4">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {villaData.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center gap-4 text-slate-900 font-medium">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#DAA520]/20 flex items-center justify-center text-accent-secondary">
                      <amenity.icon size={20} />
                    </div>
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms & Spaces Layout (Conditional for Canopy Crest) */}
            {villaData.slug === "canopy-crest" && (
              <div className="mb-12 animate-fade-in">
                <h2 className="text-3xl font-heading text-[#1B3564] mb-8 font-bold border-b border-border-subtle pb-4 border-[#DAA520]/20">
                  Rooms & Spaces
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {canopyCrestSpaces.map((space, idx) => (
                    <div key={idx} className="bg-white border border-[#DAA520]/15 hover:border-[#DAA520]/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={space.image}
                          alt={space.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#1B3564] mb-2">{space.title}</h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{space.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. The Story & Readability Points (Story last, high contrast) */}
            <div className="mb-12">
              {/* Pet Friendly Badge */}
              {villaData.rules.some(r => r.toLowerCase().includes("furry") || r.toLowerCase().includes("pet")) && (
                <div className="mb-6 bg-[#DAA520]/5 border border-[#DAA520]/20 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm select-none animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] shrink-0">
                      <PawPrint size={26} className="animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-heading text-lg text-[#1B3564] font-bold">Pet Friendly Sanctuary</h4>
                      <p className="text-xs text-text-primary/60 leading-relaxed mt-0.5 font-medium">
                        Your furry friends are more than welcome here! Sprawling outdoor space and safe layouts await.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-widest bg-white border border-[#DAA520]/10 px-3.5 py-1.5 rounded-full shadow-sm shrink-0">
                    Pets Allowed
                  </span>
                </div>
              )}

              <h2 className="text-3xl font-heading mb-6 border-b border-[#DAA520]/20 pb-6 italic text-[#1B3564] font-bold">The Story</h2>
              
              {/* Highlight Readability Points Box */}
              <div className="mb-8 bg-white border border-[#DAA520]/20 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B3564] mb-4 uppercase tracking-wider">Key Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-2.5 text-slate-900 text-sm font-medium">
                    <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={16} />
                    <span>Luxe retreat ideal for up to {villaData.guests} guests.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-900 text-sm font-medium">
                    <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={16} />
                    <span>Expansive {villaData.bedrooms} bedrooms & private pool deck.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-900 text-sm font-medium">
                    <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={16} />
                    <span>
                      {villaData.slug === "the-angle-house"
                        ? "Curated private chef & bespoke menu choices."
                        : "Curated private chef & gourmet dining choices."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-900 text-sm font-medium">
                    <CheckCircle2 className="text-[#DAA520] shrink-0 mt-0.5" size={16} />
                    <span>Pristine verified hygiene & full housekeeping.</span>
                  </li>
                </ul>
              </div>

              {/* High Contrast Story Text */}
              <p className="text-slate-900 text-lg leading-relaxed whitespace-pre-line font-normal">
                {villaData.description}
              </p>
            </div>

            {/* 5. Location & Surroundings (Interactive Google Map) */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading mb-6 border-b border-[#DAA520]/20 pb-6 italic text-[#1B3564] font-bold">
                Location & Surroundings
              </h2>
              
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
                  <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
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

          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 relative w-full" id="booking-card-section">
            <BookingCard
              villaId={villaData.id}
              villaName={villaData.name}
              price={villaData.slug === "willow-peak" ? "5,999" : villaData.price}
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
            />
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
        
        <VillaSEOContent slug={villaData.slug} />
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#DAA520]/25 px-4 py-3 shadow-[0_-8px_30px_rgba(27,53,100,0.15)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex flex-col text-left shrink-0">
            <span className="text-[8px] text-[#DAA520] block uppercase tracking-widest font-black">Direct Best Rate</span>
            <span className="text-[#1B3564] font-black text-base leading-tight">₹{villaData.slug === "willow-peak" ? "5,999" : villaData.price} <span className="text-[9px] font-normal text-slate-500 font-sans">/ night {villaData.slug === "willow-peak" ? "/ cottage" : ""}</span></span>
            <span className="text-[7.5px] text-emerald-600 font-bold uppercase tracking-wider">✓ 0% Platform Fee</span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <a
              href="#booking-card-section"
              className="bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white font-black px-3.5 py-3 rounded-xl text-[10px] tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center active:scale-95 whitespace-nowrap"
            >
              Dates & Rates
            </a>
            
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I would love to book *${villaData.name}* in ${villaData.location}. Could you please check available dates and share your best direct offer?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black px-4 py-3 rounded-xl text-[10px] tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
              </svg>
              <span>Book WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
