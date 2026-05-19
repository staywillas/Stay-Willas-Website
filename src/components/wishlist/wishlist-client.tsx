"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import VillaCard from "@/components/home/villa-card";

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

interface WishlistClientProps {
  allVillas: Villa[];
}

export default function WishlistClient({ allVillas }: WishlistClientProps) {
  const [savedVillas, setSavedVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const filtered = allVillas.filter(
        (villa) => wishlist.includes(villa.id) || wishlist.includes(villa.slug)
      );
      setSavedVillas(filtered);
    } catch (e) {
      console.error("Failed to parse wishlist:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    // Listen to our custom local storage wishlist update event!
    window.addEventListener("wishlist-updated", fetchWishlist);
    return () => {
      window.removeEventListener("wishlist-updated", fetchWishlist);
    };
  }, [allVillas]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-white/40">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest">Loading Saved Sanctuaries...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
      <div className="flex items-center justify-between mb-16">
        <Link 
          href="/villas" 
          className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Villas
        </Link>
        
        <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-red-400 flex items-center gap-2">
          <Heart size={10} className="fill-red-500 text-red-500 animate-pulse" />
          {savedVillas.length} Saved Stays
        </div>
      </div>

      {savedVillas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {savedVillas.map((villa) => (
            <VillaCard key={villa.id} {...villa} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/[0.02] rounded-[32px] border border-white/5 px-6 max-w-3xl mx-auto my-12">
          <Heart className="mx-auto text-white/10 mb-6" size={56} />
          <h3 className="text-3xl font-heading text-white mb-4 italic">No saved sanctuaries found</h3>
          <p className="text-white/60 mb-10 max-w-md mx-auto leading-relaxed text-sm">
            You haven't added any luxury properties to your wishlist yet. Explore our handpicked retreats in Maharashtra to save your favorites!
          </p>
          <Link 
            href="/villas" 
            className="bg-[#FFCC00] hover:bg-[#FFD700] text-black px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-block shadow-[0_0_15px_rgba(255,204,0,0.3)] hover:shadow-[0_0_25px_rgba(255,204,0,0.5)]"
          >
            Explore Entire Collection
          </Link>
        </div>
      )}
    </div>
  );
}
