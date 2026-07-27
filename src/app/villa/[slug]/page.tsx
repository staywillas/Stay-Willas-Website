import React, { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Wifi, Waves, Car,
  Wind, MapPin, Award, ChevronLeft,
  Share2, Heart, CheckCircle2,
  Users, Bed, Bath, PawPrint
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
  "Jacuzzi in Master Bedroom": AnimatedPoolIcon,
  "Waterfall Feature": AnimatedWaterfallIcon,
  "Panoramic Glass Frontage": AnimatedGlassFrontageIcon,
  "Modern warm lighting": AnimatedLightingIcon,
  "Outdoor lounging spaces": AnimatedLoungingIcon,
  "Living Hall": AnimatedLivingHallIcon,
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
  const primaryKeyword = `luxury villa in ${city} with private pool`;
  const secondaryKeyword = `rent private pool villa in ${city}`;
  const tertiaryKeyword = `holiday home in ${city}`;
  const quartKeyword = `${villa.bedrooms}BHK villa in ${city}`;

  let titleText = `${villa.name} | Luxury Villa in ${city} with Private Pool`;
  if (titleText.length > 60) {
    titleText = `${villa.name} | Luxury Villa in ${city} with Pool`;
  }
  if (titleText.length > 60) {
    titleText = `${villa.name} | Villa in ${city} with Pool`;
  }

  const descText = `Book ${villa.name}, a premium ${villa.bedrooms}BHK luxury villa in ${city} with private pool, premium amenities, and scenic views. Reserve your staycation today!`;

  const ogImageUrl = villa.images[0] ? `https://www.staywillas.com${villa.images[0]}` : "https://www.staywillas.com/images/hero-villa.png";

  return {
    title: titleText,
    description: descText,
    keywords: [primaryKeyword, secondaryKeyword, tertiaryKeyword],
    alternates: {
      canonical: `https://www.staywillas.com/villa/${villa.slug}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://www.staywillas.com/villa/${villa.slug}`,
      images: [{ url: ogImageUrl }],
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

  const reviews = await getCachedReviews(villa.id);
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : 0;

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
    }
  });

  const serializedBookings = activeBookings.map(b => ({
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    status: b.status,
  }));

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
    amenities: villa.amenities.map((name) => {
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
        question: "What amenities are available at Canopy Crest?",
        answer: "Canopy Crest features a private pool (22x12 ft), spacious lawn, music system, indoor/outdoor games, wheelchair accessibility, CCTV security, and dedicated caretaker services."
      }
    ]
  };

  const villaFaqs = villaFaqsMap[villa.slug] || [];
  
  const faqSchema = villaFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": villaFaqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary pb-28 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.staywillas.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Villas",
                "item": "https://www.staywillas.com/villas"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": villaData.name,
                "item": `https://www.staywillas.com/villa/${villaData.slug}`
              }
            ]
          })
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": villaData.name,
            "description": villaData.description,
            "image": villaData.images,
            "url": `https://www.staywillas.com/villa/${villaData.slug}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": villaData.location
            },
            "numberOfRooms": villaData.bedrooms,
            "occupancy": {
              "@type": "QuantitativeValue",
              "value": villaData.guests
            },
            "amenityFeature": villaData.amenities.map(a => ({
              "@type": "LocationFeatureSpecification",
              "name": a.name,
              "value": true
            })),
            "aggregateRating": villaData.reviews > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": villaData.rating,
              "reviewCount": villaData.reviews
            } : undefined
          })
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

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="order-2 lg:order-1 lg:col-span-8">
            {/* 1. Guests, Bedrooms & Bathrooms Specs Capsule (Moved under photos) */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-900 text-xs uppercase tracking-widest mb-8 bg-white border border-[#DAA520]/20 px-6 py-4 rounded-2xl max-w-fit shadow-sm">
              <span className="flex items-center gap-2 font-bold"><Users size={14} className="text-accent-secondary" />{villaData.guests} Guests</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-2 font-bold"><Bed size={14} className="text-accent-secondary" />{villaData.bedrooms} Bedrooms</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
              <span className="flex items-center gap-2 font-bold"><Bath size={14} className="text-accent-secondary" />{villaData.bathrooms} Bathrooms</span>
            </div>

            {/* 2. What this place offers (Amenities first) */}
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

            {/* 3. In-Villa Bespoke Food Menu Popup */}
            <div className="mb-12">
              <FoodMenuModal />
            </div>

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

          </div>

          <div className="order-1 lg:order-2 lg:col-span-4 relative" id="booking-card-section">
            <BookingCard
              villaId={villaData.id}
              villaName={villaData.name}
              price={villaData.price}
              basePrice={villa.price}
              weekendPrice={villa.weekendPrice}
              dailyPrices={villa.dailyPrices as any}
              seasonalPrices={villa.seasonalPrices as any}
              maxGuests={villaData.guests}
              bookings={serializedBookings}
            />
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
        
        <VillaSEOContent slug={villaData.slug} />
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-xl border-t border-border-subtle px-6 py-4 shadow-[0_-8px_30px_rgba(44,31,14,0.12)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-accent-secondary block uppercase tracking-wider font-bold">Starts from</span>
            <span className="text-text-primary font-semibold text-base sm:text-lg">₹{villaData.price} <span className="text-[10px] font-normal text-text-primary/50">/ night</span></span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] text-green-600 font-bold uppercase tracking-wider">✓ Free Cancellation</span>
              <span className="text-[8px] text-[#DAA520] font-bold uppercase tracking-wider">✓ Best Price</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hello Stay Willas Concierge! 🌿 I am absolutely in love with *${villaData.name}* in ${villaData.location}. I would love to enquire about its availability and details for my next escape.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.3)] shrink-0 active:scale-95 cursor-pointer"
              aria-label="Enquire on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🏰 I would love to book a luxury stay at *${villaData.name}* in ${villaData.location}. Could you please help me with availability, custom packages, and pricing for my group?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-primary hover:bg-accent-secondary text-white font-extrabold px-6 sm:px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(27,53,100,0.3)] flex items-center justify-center active:scale-95 whitespace-nowrap"
            >
              BOOK NOW
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
