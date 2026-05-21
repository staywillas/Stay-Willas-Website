"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, SlidersHorizontal, Trash2, Users, Bed, Bath,
  DollarSign, Check, X, ShieldAlert, Award, Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VillaCard from "@/components/home/villa-card";

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  priceRaw: number;
  priceFormatted: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  category: string;
  amenities: string[];
}

interface VillasClientProps {
  initialVillas: Villa[];
  initialRegion?: string;
  initialCategory?: string;
}

const CATEGORIES = [
  "Infinity Pools",
  "Mountain View",
  "Beachfront",
  "Vineyards",
  "Private Estates",
  "Forest Cabins",
  "Sun-Kissed",
  "Resort Style",
  "Cold Climates"
];

const REGIONS = ["Lonavala", "Alibaug", "Nashik", "Karjat", "Mulshi"];

const AMENITY_TAGS = [
  { label: "Swimming Pool", match: ["pool", "swimming"] },
  { label: "Private Chef", match: ["chef", "kailash"] },
  { label: "Air Conditioning", match: ["ac", "conditioning"] },
  { label: "Jacuzzi", match: ["jacuzzi"] },
  { label: "Waterfront", match: ["beachfront", "lake", "riverside"] },
  { label: "Mountain View", match: ["mountain", "ghat", "valley"] },
  { label: "Super-fast Wi-Fi", match: ["wi-fi", "wifi"] }
];

export default function VillasClient({ 
  initialVillas, 
  initialRegion = "", 
  initialCategory = "" 
}: VillasClientProps) {
  
  // Filter States
  const [region, setRegion] = useState<string>(initialRegion);
  const [category, setCategory] = useState<string>(initialCategory);
  const [maxBudget, setMaxBudget] = useState<number>(60000);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);

  // Toggle Amenity Selection
  const handleToggleAmenity = (label: string) => {
    setSelectedAmenities(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setRegion("");
    setCategory("");
    setMaxBudget(60000);
    setMinBedrooms(0);
    setSelectedAmenities([]);
  };

  // Filtering Logic (Executed instantly in memory!)
  const filteredVillas = useMemo(() => {
    return initialVillas.filter(villa => {
      // Region Match
      if (region && !villa.location.toLowerCase().includes(region.toLowerCase())) {
        return false;
      }
      
      // Category Match
      if (category && villa.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      
      // Budget Match
      if (villa.priceRaw > maxBudget) {
        return false;
      }
      
      // Bedrooms Match
      if (minBedrooms > 0) {
        if (minBedrooms === 5 && villa.bedrooms < 5) return false;
        if (minBedrooms < 5 && villa.bedrooms !== minBedrooms) return false;
      }
      
      // Amenities Match
      for (const selected of selectedAmenities) {
        const amenityObj = AMENITY_TAGS.find(t => t.label === selected);
        if (amenityObj) {
          const hasMatchingAmenity = villa.amenities.some(amenity => 
            amenityObj.match.some(keyword => amenity.toLowerCase().includes(keyword))
          );
          if (!hasMatchingAmenity) {
            return false;
          }
        }
      }

      return true;
    });
  }, [initialVillas, region, category, maxBudget, minBedrooms, selectedAmenities]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (region) count++;
    if (category) count++;
    if (maxBudget < 60000) count++;
    if (minBedrooms > 0) count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    return count;
  }, [region, category, maxBudget, minBedrooms, selectedAmenities]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pb-24 text-charcoal">
      
      {/* Dynamic Search & Interactive Filters Suite */}
      <div className="relative z-30 -mt-10 mb-16">
        <div className="bg-bg-primary border border-border-subtle rounded-[32px] p-6 md:p-8 shadow-xl shadow-[#0F172A]/5 backdrop-blur-xl">
          
          {/* Main Filter Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-subtle/60">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Region Selector */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <span className="text-[9px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                  <MapPin size={10} /> Destination
                </span>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-white border border-border-subtle text-charcoal rounded-xl px-4 py-2.5 text-xs font-heading italic outline-none cursor-pointer hover:border-accent-primary/30 transition-all"
                >
                  <option value="" className="bg-white text-charcoal">All Maharashtra Stays</option>
                  {REGIONS.map(r => (
                    <option key={r} value={r.toLowerCase()} className="bg-white text-charcoal">{r}</option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <span className="text-[9px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                  <Star size={10} /> Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white border border-border-subtle text-charcoal rounded-xl px-4 py-2.5 text-xs font-heading italic outline-none cursor-pointer hover:border-accent-primary/30 transition-all"
                >
                  <option value="" className="bg-white text-charcoal">All Style Collections</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-white text-charcoal">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expand / Advanced Filters and Clear Buttons */}
            <div className="flex items-center gap-4 self-end lg:self-auto">
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-3 rounded-full border border-red-500/30 hover:border-red-500 bg-red-500/10 text-red-600 text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  <Trash2 size={12} /> Clear ({activeFilterCount})
                </button>
              )}

              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-bg-secondary/50 border border-border-subtle text-charcoal text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                {isFilterExpanded ? "Hide Advanced" : "Advanced Filters"}
              </button>
            </div>
          </div>

          {/* Advanced Sliders & Checklist Panel */}
          <AnimatePresence initial={true}>
            {isFilterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  
                  {/* Budget Slider */}
                  <div className="flex flex-col gap-4 bg-white border border-border-subtle rounded-2xl p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                        <DollarSign size={12} /> Max Budget (per night)
                      </span>
                      <span className="text-sm font-bold text-accent-secondary bg-accent-secondary/10 px-3 py-1 rounded-full border border-accent-secondary/35">
                        ₹{maxBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25000}
                      max={60000}
                      step={1000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full accent-[#1B3564] cursor-pointer bg-bg-secondary h-1.5 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-charcoal/40 font-medium">
                      <span>₹25,000</span>
                      <span>₹40,000</span>
                      <span>₹60,000+</span>
                    </div>
                  </div>

                  {/* Bedrooms count filter */}
                  <div className="flex flex-col gap-4 bg-white border border-border-subtle rounded-2xl p-6">
                    <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                      <Bed size={12} /> Bedroom Size
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Any BHK", value: 0 },
                        { label: "3 BHK", value: 3 },
                        { label: "4 BHK", value: 4 },
                        { label: "5+ BHK", value: 5 }
                      ].map((btn) => (
                        <button
                          key={btn.value}
                          type="button"
                          onClick={() => setMinBedrooms(btn.value)}
                          className={cn(
                            "py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer",
                            minBedrooms === btn.value
                              ? "bg-accent-primary border-accent-primary text-white font-black shadow-md"
                              : "bg-white border-border-subtle text-charcoal/60 hover:border-navy/30 hover:text-navy"
                          )}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Amenities Selection Strip */}
                <div className="pt-8 flex flex-col gap-3">
                  <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black">
                    Filter by Signature Offerings & Amenities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_TAGS.map((tag) => {
                      const isSelected = selectedAmenities.includes(tag.label);
                      return (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => handleToggleAmenity(tag.label)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border cursor-pointer",
                            isSelected
                              ? "bg-accent-secondary border-accent-secondary text-white font-black shadow-md"
                              : "bg-white border-border-subtle text-charcoal/50 hover:border-navy/30 hover:text-navy"
                          )}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Grid Section & Instant Layout Animations */}
      <div className="w-full">
        
        {/* Dynamic Stays Counter */}
        <div className="flex justify-between items-center mb-8 border-b border-border-subtle pb-4">
          <span className="text-charcoal/60 text-xs font-sans">
            Showing <span className="text-charcoal font-bold">{filteredVillas.length}</span> of {initialVillas.length} sanctuaries
          </span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/35 px-3 py-1 rounded-full uppercase tracking-widest font-black">
              {activeFilterCount} Active {activeFilterCount === 1 ? "Filter" : "Filters"}
            </span>
          )}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredVillas.map((villa) => (
              <motion.div
                layout
                key={villa.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full flex flex-col"
              >
                <VillaCard
                  id={villa.slug}
                  name={villa.name}
                  location={villa.location}
                  image={villa.image}
                  price={villa.priceFormatted}
                  guests={villa.guests}
                  bedrooms={villa.bedrooms}
                  bathrooms={villa.bathrooms}
                  className="h-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {filteredVillas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-24 bg-white rounded-[32px] border border-border-subtle px-6 max-w-3xl mx-auto my-12 shadow-md"
            >
              <ShieldAlert size={48} className="text-accent-primary mx-auto mb-6" />
              <h3 className="text-3xl font-heading text-charcoal mb-4 italic">No matching sanctuaries found</h3>
              <p className="text-charcoal/60 mb-8 max-w-md mx-auto leading-relaxed text-sm">
                We couldn't find any stays matching your filters. Try increasing your max budget or reducing bedroom requirements to see more handpicked retreats!
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-accent-primary hover:bg-accent-secondary text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 inline-block cursor-pointer shadow-md"
              >
                Clear All Active Filters
              </button>
            </motion.div>
          )}

        </motion.div>

      </div>

    </div>
  );
}
