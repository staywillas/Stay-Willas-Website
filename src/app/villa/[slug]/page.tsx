import { encodeWhatsAppMessage } from "@/lib/whatsapp";
import GuideLinks from "@/components/blog/guide-links";
import { getPropertyGuides } from "@/data/guide-navigation";
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

// Captions describe the photographed space. Alternate views are not numbered as
// separate bedrooms, and shared chalet photos are not assigned to unverified units.
const angleHouseSpaces = [
  {
    title: "Bedroom Interior",
    image: "/assets/villas/the-angle-house/gallery-6.webp",
    description: "Bedroom with a double bed, upholstered headboard and full-length curtains."
  },
  {
    title: "Glass-Fronted Bedroom",
    image: "/assets/villas/the-angle-house/gallery-9.webp",
    description: "Bedroom with a double bed, air conditioning and floor-to-ceiling glass doors."
  },
  {
    title: "Bedroom — Another View",
    image: "/assets/villas/the-angle-house/gallery-19.webp",
    description: "Another view of the glass-fronted bedroom, showing the bed and balcony doors."
  },
  {
    title: "Living Lounge",
    image: "/assets/villas/the-angle-house/gallery-14.webp",
    description: "Indoor lounge with sofa seating, a coffee table and a staircase to the upper floor."
  },
  {
    title: "Private Swimming Pool",
    image: "/assets/villas/the-angle-house/gallery-13.webp",
    description: "Private outdoor swimming pool beside the villa, with a paved poolside deck."
  },
  {
    title: "Courtyard & Garden",
    image: "/assets/villas/the-angle-house/gallery-12.webp",
    description: "Paved courtyard with garden planting beside the glass-fronted villa."
  }
];

const canopyCrestSpaces = [
  {
    title: "Pool-Facing Bedroom",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0009.jpg",
    description: "Bedroom with a double bed, wardrobe and windows facing the pool."
  },
  {
    title: "Bedroom Interior",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0010.jpg",
    description: "Front view of a double bed with bedside lamps and full-length curtains."
  },
  {
    title: "Bedroom — Close-Up",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0018.jpg",
    description: "Close-up of the bed, cushions and bedside lighting in a pool-facing bedroom."
  },
  {
    title: "Dining Room",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0014.jpg",
    description: "Indoor dining table and chairs beside the living area."
  },
  {
    title: "Living Room",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0013.jpg",
    description: "Living room with sofa seating, a coffee table and a wall-mounted TV."
  },
  {
    title: "Bathrooms",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0008.jpg",
    description: "Bathroom with a washbasin, mirror, toilet and glass shower enclosure."
  },
  {
    title: "Swimming Pool",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg",
    description: "Private swimming pool beside the villa, photographed at dusk."
  },
  {
    title: "Lawn & Sit-out",
    image: "/assets/villas/Canopy crest photos/IMG-20260607-WA0015.jpg",
    description: "Lawn with outdoor seating and a paved path overlooking the hills."
  }
];

const terraCottaSpaces = [
  {
    title: "Bedroom — Upholstered Headboard",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0035.jpg",
    description: "Double bed with an upholstered headboard and bedside lighting."
  },
  {
    title: "Bedroom — Wooden Headboard",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0047.jpg",
    description: "Bedroom with a wooden feature wall, double bed and wardrobe."
  },
  {
    title: "Circular-Bed Bedroom",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0055.jpg",
    description: "Bedroom featuring a circular bed, upholstered headboard and wall artwork."
  },
  {
    title: "Bedroom — Another View",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0042.jpg",
    description: "Front view of the double bed and wooden feature wall."
  },
  {
    title: "Private Swimming Pool",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg",
    description: "Outdoor swimming pool with a paved deck beside the villa."
  },
  {
    title: "Spacious Living & Lounge",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0043.jpg",
    description: "Family lounge with sofa seating, a coffee table and a wall-mounted TV."
  },
  {
    title: "Terrace & Balcony Deck",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0031.jpg",
    description: "Balcony seating and a table overlooking the surrounding valley."
  },
  {
    title: "Luxury Bathrooms",
    image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0057.jpg",
    description: "Bathroom with a washbasin, mirror, toilet and stone-pattern wall tiles."
  }
];

const willowPeakSpaces = [
  {
    title: "Chalet Bedroom",
    image: "/assets/villas/willow-peak/wp-04.webp",
    description: "Bedroom interior with a double bed beneath the sloping timber ceiling."
  },
  {
    title: "A-Frame Bedroom",
    image: "/assets/villas/willow-peak/wp-05.webp",
    description: "A-frame bedroom with a double bed, seating and a timber-lined ceiling."
  },
  {
    title: "Bedroom — Bed View",
    image: "/assets/villas/willow-peak/wp-06.webp",
    description: "Close-up of the double bed and pillows beneath the timber ceiling."
  },
  {
    title: "In-Room Jacuzzi",
    image: "/assets/villas/willow-peak/wp-03.webp",
    description: "Indoor Jacuzzi bath beside a window, with a small side table."
  },
  {
    title: "Chalet Sit-Out",
    image: "/assets/villas/willow-peak/wp-01.webp",
    description: "Outdoor seating beside the chalet's glass doors and covered entrance."
  },
  {
    title: "Covered Outdoor Dining",
    image: "/assets/villas/willow-peak/wp-08.webp",
    description: "Tables and chairs beneath a covered outdoor dining pavilion."
  },
  {
    title: "A-Frame Chalet Exteriors",
    image: "/assets/villas/willow-peak/wp-07.webp",
    description: "Exterior view of the A-frame chalets and their outdoor decks."
  },
  {
    title: "Chalet Bathroom",
    image: "/assets/villas/willow-peak/wp-10.webp",
    description: "Bathroom with a toilet, handheld spray and wall-mounted water heater."
  }
];

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
    titleText = "The Angle House Kamshet, Lonavala | Private Pool & Jacuzzi";
    descText = "Book The Angle House in Kamshet, Lonavala: a 3 BHK villa for up to 12 guests with a private waterfall pool and Jacuzzi. Stays from ₹13,000/night.";
    keywordsList = [
      "staywillas the angle house",
      "staywillas the angle house with jacuzzi lonavala",
      "the angle house lonavala",
      "staywillas the angle house reviews",
      "the angle house with jacuzzi lonavala reviews",
      "the angle house 3 bhk private pool villa",
      "angel house lonavala",
      "glass house villa lonavala",
      "villa with waterfall pool in lonavala",
      "jacuzzi villa lonavala",
      "pet friendly villa lonavala"
    ];
  } else if (villa.slug === "canopy-crest") {
    titleText = "Canopy Crest Khopoli | 4 BHK Private Pool Villa | Stay Willas";
    descText = "Book Canopy Crest in Khopoli: a 4 BHK private pool villa for a maximum of 16 guests. Stays from ₹15,000/night; ask about dates and meal options.";
    keywordsList = [
      "staywillas canopy crest khopoli",
      "staywillas canopy crest khopoli premium villa with swimming pool chavani",
      "staywillas canopy crest khopoli premium villa with swimming pool chavani reviews",
      "canopy crest khopoli",
      "premium villa with swimming pool chavani",
      "canopy crest chavani khopoli",
      "4 bhk private pool villa in khopoli",
      "chavani private villa with pool",
      "staywillas canopy crest reviews"
    ];
  } else if (villa.slug === "willow-peak") {
    titleText = "Willow Peak Lonavala | A-Frame Cottages with Private Jacuzzi";
    descText = "Willow Peak in Kurwande, Lonavala offers A-frame cottages with private Jacuzzis. Base rates start at ₹4,999/night per cottage; full-estate pricing is separate.";
    keywordsList = [
      "willow peak resort kurvande",
      "willow peak lonavala",
      "willow peak resort",
      "willow peak resort kurvande reviews",
      "willow peak resort kurvande lonavala",
      "willow peak kurwande",
      "willow peak",
      "a-frame cottage lonavala",
      "jacuzzi cottage lonavala",
      "resort in kurvande lonavala",
      "couples villa with jacuzzi lonavala"
    ];
  } else if (villa.slug.startsWith("willow-peak-cottage")) {
    const letter = villa.slug.replace("willow-peak-cottage-", "").toLowerCase();
    const cottageName = letter === "a" ? "Breeze" : letter === "b" ? "Crest" : "Heaven";
    titleText = `${cottageName} (Willow Peak) | A-Frame Chalet with Jacuzzi in Lonavala | Stay Willas`;
    descText = `Book ${cottageName} (Cottage ${letter.toUpperCase()} at Willow Peak) in Kurwande, Lonavala — a private 1 BHK wooden A-frame chalet featuring an ensuite jacuzzi bath, scenic mountain sit-out, and on-demand chef dining. Direct bookings from ₹4,999/night.`;
    keywordsList = [
      `willow peak ${cottageName.toLowerCase()} lonavala`,
      `willow peak cottage ${letter} lonavala`,
      "a frame cottage lonavala with jacuzzi",
      "couples cottage lonavala",
      "kurwande cottage stay",
      "chalet with jacuzzi lonavala"
    ];
  } else if (villa.slug === "casa-de-reva" || villa.slug === "terra-cotta-villa") {
    titleText = "Casa De Reva | 4 BHK Luxury Villa in Panchgani with Private Pool | Stay Willas";
    descText = "Book Casa De Reva in Panchgani — a premier 4 BHK private pool sanctuary featuring terracotta architecture, hillside gazebo, mountain views, and on-demand chef service. Direct bookings from ₹16,000/night.";
    keywordsList = [
      "casa de reva panchgani",
      "casa de reva villa with pool",
      "4 bhk private pool villa in panchgani",
      "terra cotta villa panchgani",
      "kaswand luxury villa panchgani",
      "staywillas casa de reva"
    ];
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
  const reviews = dbReviews;
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : 0;

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
        question: "Does The Angle House in Lonavala have a private pool and jacuzzi?",
        answer: "Yes, The Angle House features a private swimming pool with a soothing waterfall feature, outdoor lounging deck, as well as a private master suite jacuzzi bath overlooking scenic mountain trees."
      },
      {
        question: "Is The Angle House also known as Angel House Lonavala?",
        answer: "Yes, guests frequently refer to The Angle House as 'Angel House Lonavala' due to its iconic triangular geometric glass facade architecture in Kamshet, Lonavala."
      },
      {
        question: "Where can I read verified reviews for StayWillas The Angle House?",
        answer: "Guest feedback, when available, appears in the reviews section on this page. We do not advertise a rating when no guest reviews are available."
      },
      {
        question: "Is Jain food available at The Angle House?",
        answer: "Absolutely. The Angle House offers in-house private chef services that prepare customized veg-only and Jain food spreads in separate kitchen setups."
      },
      {
        question: "What is the guest capacity of The Angle House?",
        answer: "The Angle House accommodates up to 12 guests across 3 spacious master bedrooms, making it ideal for family reunions, birthdays, and weekend getaways."
      }
    ],
    "canopy-crest": [
      {
        question: "Where is StayWillas Canopy Crest located in Khopoli?",
        answer: "Canopy Crest is situated in scenic Chavani, Khopoli, Maharashtra (just a 15-minute scenic drive from Adlabs Imagicaa), surrounded by mist-covered mountain valleys and forest greenery."
      },
      {
        question: "What are the private pool details at Canopy Crest Khopoli?",
        answer: "Canopy Crest features an expansive 22x12 ft private swimming pool with evening pool lighting, poolside deck chairs, and an outdoor shaded gazebo lounge for large groups."
      },
      {
        question: "Is Canopy Crest pet friendly?",
        answer: "Yes, Canopy Crest is a fully pet-friendly private estate featuring sprawling multi-acre charpai green lawns where your dogs and pets can run and play freely."
      },
      {
        question: "What is the guest capacity and amenities at Canopy Crest?",
        answer: "Canopy Crest comfortably accommodates up to 16 guests across 4 master bedrooms, and features a 22ft private pool, lawn bonfire pit, music system, indoor/outdoor games, and dedicated caretaker and chef services."
      }
    ],
    "willow-peak": [
      {
        question: "What is Willow Peak Resort Kurvande in Lonavala?",
        answer: "Willow Peak Resort is a boutique hill resort nestled in Kurvande (Kurwande), Lonavala. It features 3 standalone Swiss-style wooden A-frame chalets (Breeze, Crest, and Heaven), each with an ensuite private jacuzzi bath and scenic Sahyadri mountain vistas."
      },
      {
        question: "How does booking individual cottages work at Willow Peak Resort?",
        answer: "Willow Peak consists of 3 individual A-frame wooden cottages: Breeze, Crest, and Heaven. Each cottage accommodates up to 4 guests with an en-suite jacuzzi bath. You can book either a single standalone cottage (from ₹4,999/night) or book all 3 cottages together (up to 12 guests) to reserve the entire private estate exclusively."
      },
      {
        question: "Where is Willow Peak Resort located in Lonavala?",
        answer: "Willow Peak is located in Kurvande, Lonavala, Maharashtra, near the scenic INS Shivaji road, enveloped in tranquil mountain greenery and cool hill breezes."
      },
      {
        question: "What amenities and activities are available at Willow Peak?",
        answer: "Willow Peak offers air-conditioned A-frame cottage suites, private heated jacuzzi baths, plush king beds, Wi-Fi, TV, outdoor garden dining, BBQ facilities, carrom board, and secure parking."
      }
    ],
    "casa-de-reva": [
      {
        question: "Where is Casa De Reva located?",
        answer: "Casa De Reva is located in Kaswand, Panchgani, just 4.5 km from Mapro Garden and 11 km from scenic waterfalls."
      },
      {
        question: "Does Casa De Reva have a private swimming pool and garden lawn?",
        answer: "Yes, Casa De Reva features an exclusive private swimming pool, a sprawling manicured lawn, and an outdoor gazebo with panoramic mountain and valley views."
      },
      {
        question: "What is the guest capacity of Casa De Reva?",
        answer: "Casa De Reva is a spacious 4 BHK private estate comfortably accommodating up to 16 guests, with 4 private attached bathrooms, air-conditioned bedrooms, and dedicated caretaker services."
      }
    ],
    "terra-cotta-villa": [
      {
        question: "Where is Casa De Reva located?",
        answer: "Casa De Reva is located in Kaswand, Panchgani, just 4.5 km from Mapro Garden and 11 km from scenic waterfalls."
      },
      {
        question: "Does Casa De Reva have a private swimming pool and garden lawn?",
        answer: "Yes, Casa De Reva features an exclusive private swimming pool, a sprawling manicured lawn, and an outdoor gazebo with panoramic mountain and valley views."
      },
      {
        question: "What is the guest capacity of Casa De Reva?",
        answer: "Casa De Reva is a spacious 4 BHK private estate comfortably accommodating up to 16 guests, with 4 private attached bathrooms, air-conditioned bedrooms, and dedicated caretaker services."
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
    "casa-de-reva": {
      directUrl: "https://www.google.com/maps/place/StayVista+at+Brick+Beam+with+Private+Plunge+Pool,+Lawn,+BBQ+and+Bonfire+-+Villa/@17.9040603,73.7732925,17z/data=!4m10!1m2!2m1!1sstay+vista+at+brick+beam+with+private+plunge+pool!3m6!1s0x3bc2689509c5ee9f:0xb7ae44a442241384!8m2!3d17.9040603!4d73.7732925!15sCjFzdGF5IHZpc3RhIGF0IGJyaWNrIGJlYW0gd2l0aCBwcml2YXRlIHBsdW5nZSBwb29skgEPdmFjYXRpb25fcmVudGFs4AEA!16s%2Fg%2F11z5q_y1m6",
      embedUrl: "https://maps.google.com/maps?q=17.9040603,73.7732925&hl=en&z=16&output=embed"
    },
    "terra-cotta-villa": {
      directUrl: "https://www.google.com/maps/place/StayVista+at+Brick+Beam+with+Private+Plunge+Pool,+Lawn,+BBQ+and+Bonfire+-+Villa/@17.9040603,73.7732925,17z/data=!4m10!1m2!2m1!1sstay+vista+at+brick+beam+with+private+plunge+pool!3m6!1s0x3bc2689509c5ee9f:0xb7ae44a442241384!8m2!3d17.9040603!4d73.7732925!15sCjFzdGF5IHZpc3RhIGF0IGJyaWNrIGJlYW0gd2l0aCBwcml2YXRlIHBsdW5nZSBwb29skgEPdmFjYXRpb25fcmVudGFs4AEA!16s%2Fg%2F11z5q_y1m6",
      embedUrl: "https://maps.google.com/maps?q=17.9040603,73.7732925&hl=en&z=16&output=embed"
    }
  };

  const isLonavala = villa.location.toLowerCase().includes("lonavala");
  const isKhopoli = villa.location.toLowerCase().includes("khopoli");
  const isPanchgani = villa.location.toLowerCase().includes("panchgani");
  const areaName = isLonavala ? "Lonavala" : isKhopoli ? "Khopoli" : "Panchgani";
  const areaUrl = isLonavala ? "/areas/lonavala" : isKhopoli ? "/areas/khopoli" : "/areas/panchgani";

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
        {(villaData.slug === "the-angle-house" || villaData.slug === "canopy-crest" || villaData.slug === "casa-de-reva" || villaData.slug === "terra-cotta-villa" || villaData.slug.includes("willow-peak")) && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-[#DAA520]/15 border border-[#DAA520]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 shadow-xs">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] sm:text-xs uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs animate-pulse shrink-0">
                🔥 26% OFF
              </span>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-[#1B3564] leading-tight">
                  Weekday Special: 26% OFF (Monday – Thursday Stays)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 font-light mt-0.5">
                  Direct discount on Mon–Thu getaways. Use coupon <strong className="text-[#1B3564] font-bold font-mono">Stayw26</strong> on checkout.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/919619042310?text=${encodeWhatsAppMessage(`Hi Stay Willas! 🔥 I would like to book *${villaData.name}* with the 26% Weekday Discount. Please share available dates and final quote.`)}`}
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
                    <h4 className="font-heading text-base sm:text-lg text-[#1B3564] font-bold">Pet Friendly Villa</h4>
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
                  <span>{villaData.bedrooms} bedrooms with {isWillowEntire || isWillowCottage ? "private in-room Jacuzzis" : "a private pool deck"}.</span>
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

        {/* FULL-WIDTH SECTION: Rooms & Spaces Layout (For All Villas) */}
        {(() => {
          const spaces = villaData.slug === "the-angle-house"
            ? angleHouseSpaces
            : villaData.slug === "canopy-crest"
            ? canopyCrestSpaces
            : villaData.slug.includes("willow-peak")
            ? willowPeakSpaces
            : villaData.slug === "casa-de-reva" || villaData.slug === "terra-cotta-villa"
            ? terraCottaSpaces
            : null;

          if (!spaces || spaces.length === 0) return null;

          const estateSubtitle = villaData.slug === "the-angle-house"
            ? "Signature 3 BHK glass villa accommodating up to 12 guests with private waterfall pool & jacuzzi."
            : villaData.slug === "canopy-crest"
            ? "Sprawling 4 BHK mountain villa accommodating up to 16 guests with private pool & lawns."
            : villaData.slug === "casa-de-reva" || villaData.slug === "terra-cotta-villa"
            ? "Premier 4 BHK hillside estate in Panchgani accommodating up to 16 guests with private pool & lawns."
            : villaData.slug.includes("willow-peak")
            ? villaData.slug === "willow-peak"
              ? "Bedroom, Jacuzzi and outdoor photos from the 3-cottage Willow Peak estate in Kurwande, Lonavala."
              : "Bedroom, Jacuzzi and outdoor photos from Willow Peak. Confirm the photos of your selected cottage before booking."
            : "Handpicked private estate with curated luxury rooms and spaces.";

          return (
            <div className="mb-12 sm:mb-16 animate-fade-in text-left">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-[#DAA520]/20 gap-2 sm:gap-4">
                <div>
                  <span className="text-accent-secondary text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-black block mb-1">
                    Estate Layout
                  </span>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#1B3564] font-bold">
                      Rooms &amp; Spaces
                    </h2>
                    <span className="md:hidden inline-flex items-center gap-1 text-[10px] font-bold text-[#DAA520] bg-[#DAA520]/10 px-2.5 py-0.5 rounded-full border border-[#DAA520]/30">
                      Swipe &rarr;
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                  {estateSubtitle}
                </p>
              </div>

              {/* Mobile: Horizontal scroll (one room at a time, touch-friendly, no motion); Desktop: Multi-column Grid */}
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto md:overflow-x-visible pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 gap-3.5 sm:gap-4 md:gap-5 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {spaces.map((space, idx) => (
                  <div
                    key={idx}
                    className="w-[85vw] sm:w-[65vw] md:w-auto shrink-0 snap-center md:shrink md:snap-align-none bg-white border border-[#DAA520]/20 hover:border-[#DAA520]/45 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={space.image}
                        alt={space.title}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Mobile Room Index Badge */}
                      <div className="md:hidden absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#DAA520] border border-white/10">
                        {idx + 1} / {spaces.length}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4 flex flex-col justify-center text-left">
                      <h3 className="text-sm sm:text-base font-bold text-[#1B3564] leading-tight mb-1">
                        {space.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {space.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Swipe Guidance Bar */}
              <div className="md:hidden flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
                <span className="font-medium text-[#DAA520]">
                  ← Swipe horizontally to explore all {spaces.length} spaces →
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {spaces.length} Spaces
                </span>
              </div>
            </div>
          );
        })()}

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
                    ? "Use the Canopy Crest property pin to check your route from Khopoli or Imagicaa. Travel time varies with traffic."
                    : (villaData.slug === "casa-de-reva" || villaData.slug === "terra-cotta-villa")
                    ? "Scenic drive via Wai & Pasarni Ghat in Kaswand, Panchgani — just 4.5 km from Mapro Garden."
                    : "Located in Kurwande, Lonavala. Check the Willow Peak property pin and current route before travelling."}
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
        <GuideLinks slugs={getPropertyGuides(villaData.slug)} title="Guides for this stay" />
      </section>

      <Footer />
    </main>
  );
}
