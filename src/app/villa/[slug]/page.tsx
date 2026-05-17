import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  Wifi, Waves, Car, Coffee, 
  Wind, MapPin, Award, ChevronLeft,
  Share2, Heart, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BookingCard from "@/components/villa/booking-card";
import ReviewSection from "@/components/villa/review-section";
import { getReviews } from "@/app/actions/review";

export const dynamic = "force-dynamic";

// Get the SEO meta tags right so search engines don't hate us
export async function generateMetadata(): Promise<Metadata> {
  const villa = {
    name: "Misty Mornings Cliffhouse",
    location: "Lonavala",
  };
  
  return {
    title: `${villa.name} | Beautiful Cliffside Villa in ${villa.location} | Stay Willas`,
    description: `Spend a magical weekend at ${villa.name}, a cozy 5-bedroom cliffside estate in ${villa.location}.`,
  };
}

// Static data for the Lonavala house (we'll fetch from the database later, but this works perfectly for now!)
const villaData = {
  id: "lonavala-estate",
  name: "Misty Mornings Cliffhouse",
  location: "Lonavala, Maharashtra",
  rating: 4.9,
  reviews: 124,
  price: "45,000",
  images: [
    "/images/villa-lonavala.png",
    "/images/villa-alibaug.png",
    "/images/villa-mahabaleshwar.png",
    "/images/hero-villa.png",
    "/images/exp-pool.png"
  ],
  description: `Misty Mornings Cliffhouse is our absolute favorite family getaway, and we’re so excited to share it with you. We built this 5-bedroom house right on the edge of the valley in Lonavala. On early mornings, the mist literally rolls right over the deck and through the glass doors of the living room—it feels like you're sitting inside a cloud.

It features cozy wooden ceilings, a stunning infinity pool that looks like it drops off into the valley, and a private chef (Kailash) who will pamper you with piping hot batata wadas, local Konkani fish curries, and incredible fresh-brewed filter coffee. It’s the perfect place to disconnect from the city noise and just breathe.`,
  amenities: [
    { icon: Wifi, name: "Super-fast Wi-Fi" },
    { icon: Waves, name: "Heated Infinity Pool" },
    { icon: Car, name: "Private Parking" },
    { icon: Coffee, name: "Kailash (Private Chef)" },
    { icon: Wind, name: "Chilled Air Conditioning" },
    { icon: CheckCircle2, name: "Daily Housekeeping" },
  ],
  rules: [
    "Check-in starts at 2:00 PM",
    "Check-out by 11:00 AM (so we can clean up for the next family!)",
    "Please don't smoke inside (but feel free to use the deck!)",
    "Your furry friends are more than welcome!",
    "Keep the music low after 10:00 PM so we stay friends with the neighbors",
  ]
};

export default async function VillaDetailPage() {
  const reviews = await getReviews(villaData.id);

  return (
    <main className="min-h-screen bg-charcoal text-white">
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
        <div className="flex items-center gap-4 text-white/60 text-sm mb-10">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gold" />
            <span>{villaData.location}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1">
            <Award size={14} className="text-gold fill-gold" />
            <span className="text-white font-medium">{villaData.rating}</span>
            <span>({villaData.reviews} reviews)</span>
          </div>
        </div>

        {/* The 5-image grid. One huge hero image, and 4 small ones on the right. Classic Airbnb-style layout. */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 aspect-video md:aspect-[21/9] w-full mb-16 overflow-hidden rounded-3xl">
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
            <Image src={villaData.images[0]} alt="Villa Image 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="relative group overflow-hidden">
            <Image src={villaData.images[1]} alt="Villa Image 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="relative group overflow-hidden">
            <Image src={villaData.images[2]} alt="Villa Image 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="relative group overflow-hidden">
            <Image src={villaData.images[3]} alt="Villa Image 4" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="relative group overflow-hidden">
            <Image src={villaData.images[4]} alt="Villa Image 5" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>

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

          <div className="lg:col-span-4 relative">
            <BookingCard 
              villaId={villaData.id} 
              villaName={villaData.name} 
              price={villaData.price} 
            />
          </div>
        </div>

        <ReviewSection villaId={villaData.id} initialReviews={reviews} />
      </section>

      <Footer />
    </main>
  );
}
