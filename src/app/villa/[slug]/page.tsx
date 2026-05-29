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
    title: `${villa.name} | Luxury Villa in ${villa.location} | Stay Willas`,
    description: `Book ${villa.name} — a curated ${villa.bedrooms}-bedroom luxury villa in ${villa.location} with private pool, premium amenities, and stunning views. Available for exclusive stays.`,
    keywords: [villa.name, villa.location, "luxury villa stay", "private pool villa", "Stay Willas"],
    openGraph: {
      title: `${villa.name} | Stay Willas`,
      description: `A curated ${villa.bedrooms}-bedroom luxury villa in ${villa.location}.`,
      images: villa.images[0] ? [{ url: villa.images[0] }] : [],
      type: "website",
    },
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
    foodMenu: villa.foodMenu || [],
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

        {/* Specs / Features Grid */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-text-primary/70 text-xs uppercase tracking-widest mb-10 bg-white border border-border-subtle px-6 py-4 rounded-2xl max-w-fit shadow-sm">
          <span className="flex items-center gap-2 font-bold"><Users size={14} className="text-accent-secondary" />{villaData.guests} Guests</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
          <span className="flex items-center gap-2 font-bold"><Bed size={14} className="text-accent-secondary" />{villaData.bedrooms} Bedrooms</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#E2E8F0]" />
          <span className="flex items-center gap-2 font-bold"><Bath size={14} className="text-accent-secondary" />{villaData.bathrooms} Bathrooms</span>
        </div>

        {/* Cinematic, Interactive Property Gallery & Lightbox */}
        <PropertyGallery images={villaData.images} propertyName={villaData.name} villaId={villaData.slug} />

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

            {villaData.foodMenu && villaData.foodMenu.length > 0 && (
              <div className="mb-12 bg-gradient-to-br from-[#1B3564]/5 via-[#DAA520]/5 to-transparent border border-border-subtle p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/10 rounded-full blur-2xl pointer-events-none" />
                
                <h2 className="text-3xl font-heading mb-2 flex items-center gap-3 text-[#1B3564] italic">
                  <Coffee className="text-[#DAA520] stroke-[1.8]" size={28} />
                  <span>Signature Culinary <span className="italic text-[#DAA520] font-serif font-light">Menu</span></span>
                </h2>
                <p className="text-[10px] text-[#1B3564]/60 font-black uppercase tracking-widest mb-6">
                  Indulge in gourmet dishes prepared fresh by our private chefs
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {villaData.foodMenu.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-border-subtle rounded-2xl shadow-sm hover:border-[#DAA520]/40 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] shrink-0 font-heading font-black text-sm">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <span className="text-sm font-semibold text-text-primary/80 text-left">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
