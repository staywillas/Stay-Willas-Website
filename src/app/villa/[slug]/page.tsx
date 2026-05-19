import React from "react";
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
import { getReviews } from "@/app/actions/review";
import { prisma } from "@/lib/db";
import {
  AnimatedPoolIcon,
  AnimatedBonfireIcon,
  AnimatedChefIcon,
  AnimatedMountainIcon
} from "@/components/ui/animated-amenity-icons";

export const dynamic = "force-dynamic";

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
  
  let villa = await prisma.villa.findUnique({
    where: { slug },
  });

  if (!villa) {
    villa = await prisma.villa.findUnique({
      where: { id: slug },
    });
  }
  
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

  let villa = await prisma.villa.findUnique({
    where: { slug },
  });

  if (!villa) {
    villa = await prisma.villa.findUnique({
      where: { id: slug },
    });
  }

  if (!villa) {
    notFound();
  }

  const reviews = await getReviews(villa.id);
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
    amenities: villa.amenities.map((name) => ({
      name,
      icon: amenityIconMap[name] || CheckCircle2,
    })),
    rules: defaultRules,
  };

  return (
    <main className="min-h-screen bg-charcoal text-white pb-28 lg:pb-0">
      <Navbar />
      
      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-xs uppercase tracking-widest">
            <ChevronLeft size={16} />
            Back to Collection
          </Link>
          {/* Nice little share/save bar at the top right of the page */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
              <Share2 size={14} /> Share
            </button>
            <button className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-xs uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full">
              <Heart size={14} /> Save
            </button>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading mb-4">{villaData.name}</h1>
        <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gold" />
            <span>{villaData.location}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          {villaData.reviews > 0 ? (
            <div className="flex items-center gap-1">
              <Award size={14} className="text-[#FFCC00] fill-[#FFCC00]" />
              <span className="text-white font-medium">{villaData.rating}</span>
              <span>({villaData.reviews} {villaData.reviews === 1 ? "review" : "reviews"})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Award size={14} className="text-white/20" />
              <span className="text-white/40 italic">No reviews yet</span>
            </div>
          )}
        </div>

        {/* Specs / Features Grid */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/70 text-xs uppercase tracking-widest mb-10 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl max-w-fit">
          <span className="flex items-center gap-2 font-bold"><Users size={14} className="text-gold" />{villaData.guests} Guests</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/10" />
          <span className="flex items-center gap-2 font-bold"><Bed size={14} className="text-gold" />{villaData.bedrooms} Bedrooms</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/10" />
          <span className="flex items-center gap-2 font-bold"><Bath size={14} className="text-gold" />{villaData.bathrooms} Bathrooms</span>
        </div>

        {/* Cinematic, Interactive Property Gallery & Lightbox */}
        <PropertyGallery images={villaData.images} propertyName={villaData.name} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-8">
            <div className="mb-12">
              <h2 className="text-3xl font-heading mb-6 border-b border-white/5 pb-6 italic text-gold">The Story</h2>
              <p className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
                {villaData.description}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-heading mb-8">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {villaData.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center gap-4 text-white/60">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">
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
            />
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <span className="text-[10px] text-gold/80 block uppercase tracking-wider font-bold">Starts from</span>
          <span className="text-white font-semibold text-lg">₹{villaData.price} <span className="text-[10px] font-normal text-white/60">/ night</span></span>
        </div>
        <a 
          href="#booking-card-section"
          className="bg-[#FFCC00] hover:bg-[#FFD700] text-black font-extrabold px-8 py-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,204,0,0.3)] flex items-center justify-center"
        >
          BOOK NOW
        </a>
      </div>

      <Footer />
    </main>
  );
}
