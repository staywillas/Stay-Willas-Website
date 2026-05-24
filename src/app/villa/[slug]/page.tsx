import React, { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Wifi, Waves, Car, Coffee,
  Wind, MapPin, Award, ChevronLeft,
  Share2, Heart, CheckCircle2,
  Users, Bed, Bath
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
  });

  if (!villa) {
    villa = await prisma.villa.findUnique({
      where: { id: slug },
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const villa = await getCachedVilla(slug);

  if (!villa) {
    return {
      title: "Villa Not Found | Stay Willas",
    };
  }

  return {
    title: `${villa.name} | Premium Luxury Retreat in ${villa.location} | Stay Willas`,
    description: `Spend a magical, luxurious staycation at ${villa.name}, a curated premium property in ${villa.location}. Featuring ${villa.bedrooms} bedrooms, top-tier amenities, and gorgeous views.`,
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

  const villaData = {
    id: villa.id,
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

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary pb-28 lg:pb-0">
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
            <SaveButton villaId={villaData.id} villaName={villaData.name} />
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

        {/* Specs / Features Grid */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-text-primary/70 text-xs uppercase tracking-widest mb-10 bg-white border border-border-subtle px-6 py-4 rounded-2xl max-w-fit shadow-sm">
          <span className="flex items-center gap-2 font-bold"><Users size={14} className="text-accent-secondary" />{villaData.guests} Guests</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
          <span className="flex items-center gap-2 font-bold"><Bed size={14} className="text-accent-secondary" />{villaData.bedrooms} Bedrooms</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
          <span className="flex items-center gap-2 font-bold"><Bath size={14} className="text-accent-secondary" />{villaData.bathrooms} Bathrooms</span>
        </div>

        {/* Cinematic, Interactive Property Gallery & Lightbox */}
        <PropertyGallery images={villaData.images} propertyName={villaData.name} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-8">
            <div className="mb-12">
              <h2 className="text-3xl font-heading mb-6 border-b border-border-subtle pb-6 italic text-accent-primary">The Story</h2>
              <p className="text-text-primary/65 text-lg leading-relaxed whitespace-pre-line">
                {villaData.description}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-heading mb-8">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {villaData.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center gap-4 text-text-primary/65">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary">
                      <amenity.icon size={20} />
                    </div>
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative" id="booking-card-section">
            <BookingCard
              villaId={villaData.id}
              villaName={villaData.name}
              price={villaData.price}
              maxGuests={villaData.guests}
            />
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-xl border-t border-border-subtle px-6 py-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(44,31,14,0.12)]">
        <div>
          <span className="text-[10px] text-accent-secondary block uppercase tracking-wider font-bold">Starts from</span>
          <span className="text-text-primary font-semibold text-lg">₹{villaData.price} <span className="text-[10px] font-normal text-text-primary/50">/ night</span></span>
        </div>
        <a
          href="#booking-card-section"
          className="bg-accent-primary hover:bg-accent-secondary text-white font-extrabold px-8 py-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(27,53,100,0.3)] flex items-center justify-center"
        >
          BOOK NOW
        </a>
      </div>

      <Footer />
    </main>
  );
}
