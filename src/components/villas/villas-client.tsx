"use client";

import React, { useState, useMemo, useEffect } from "react";
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

const REGIONS = ["Lonavala", "Khopoli", "Karjat", "Igatpuri", "Alibaug", "Goa"];

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
  const [maxBudget, setMaxBudget] = useState<number>(100000);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterModalOpen]);

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
    setMaxBudget(100000);
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
    if (maxBudget < 100000) count++;
    if (minBedrooms > 0) count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    return count;
  }, [region, category, maxBudget, minBedrooms, selectedAmenities]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-24 text-charcoal">
      
      {/* Search Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-border-subtle pb-6 select-none">
        <div className="text-left w-full sm:w-auto">
          <h2 className="text-3xl font-heading text-[#1B3564] italic">
            Explore <span className="not-italic font-bold font-sans text-accent-primary">Sanctuaries</span>
          </h2>
          <p className="text-[10px] text-[#1B3564]/50 font-black uppercase tracking-widest mt-1">
            Handpicked premium luxury villa stays in Maharashtra
          </p>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-red-500/30 hover:border-red-500 bg-red-500/10 text-red-600 text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            >
              <Trash2 size={12} /> Clear ({activeFilterCount})
            </button>
          )}

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1B3564] hover:bg-[#152A50] text-white text-[11px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/10"
          >
            <SlidersHorizontal size={14} className="text-[#FFCC00]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FFCC00] text-slate-950 text-[9px] font-black flex items-center justify-center animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Search & Interactive Filters Suite inside Popup Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <>
            {/* Dark frosted backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 z-[9000] bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-y-auto md:top-[12%] md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-[9100] bg-[#F5F2EA] border border-[#1B3564]/10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(27,53,100,0.22)] p-6 md:p-8 flex flex-col justify-between overflow-hidden max-h-[88vh] md:max-h-[76vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1B3564]/10 shrink-0">
                <div className="text-left">
                  <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.25em] block mb-1">Stay Filter Suite</span>
                  <h3 className="text-2xl font-heading text-[#1B3564] italic">
                    Filter <span className="not-italic font-bold font-sans text-accent-primary">Sanctuaries</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564]/60 hover:text-[#1B3564] hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto py-6 space-y-8 pr-1 md:pr-2 select-none no-scrollbar">
                {/* Destination & Category Selector Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Region Selector */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                      <MapPin size={12} /> Destination
                    </span>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-white border border-border-subtle text-charcoal rounded-2xl px-4 py-3.5 text-xs font-heading italic outline-none cursor-pointer hover:border-accent-primary/30 transition-all shadow-sm"
                    >
                      <option value="" className="bg-white text-charcoal">All Maharashtra Stays</option>
                      {REGIONS.map(r => (
                        <option key={r} value={r.toLowerCase()} className="bg-white text-charcoal">{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selector */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                      <Star size={12} /> Category
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-border-subtle text-charcoal rounded-2xl px-4 py-3.5 text-xs font-heading italic outline-none cursor-pointer hover:border-accent-primary/30 transition-all shadow-sm"
                    >
                      <option value="" className="bg-white text-charcoal">All Style Collections</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} className="bg-white text-charcoal">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget Slider */}
                <div className="flex flex-col gap-4 bg-white border border-border-subtle rounded-2xl p-6 text-left shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-accent-secondary uppercase tracking-[0.2em] font-black flex items-center gap-1">
                      <DollarSign size={12} /> Max Budget (per night)
                    </span>
                    <span className="text-xs font-bold text-accent-secondary bg-accent-secondary/10 px-3.5 py-1.5 rounded-full border border-accent-secondary/35">
                      ₹{maxBudget.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={100000}
                    step={1000}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-[#1B3564] cursor-pointer bg-bg-secondary h-1.5 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-charcoal/40 font-medium">
                    <span>₹10,000</span>
                    <span>₹55,000</span>
                    <span>₹100,000</span>
                  </div>
                </div>

                {/* Bedrooms count filter */}
                <div className="flex flex-col gap-4 bg-white border border-border-subtle rounded-2xl p-6 text-left shadow-sm">
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
                          "py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer",
                          minBedrooms === btn.value
                            ? "bg-accent-primary border-accent-primary text-white font-black shadow-md"
                            : "bg-white border-border-subtle text-charcoal/60 hover:border-[#1B3564]/30 hover:text-[#1B3564]"
                        )}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Selection Strip */}
                <div className="flex flex-col gap-3 text-left">
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
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border cursor-pointer shadow-sm",
                            isSelected
                              ? "bg-accent-secondary border-accent-secondary text-white font-black shadow-md"
                              : "bg-white border-border-subtle text-charcoal/50 hover:border-[#1B3564]/30 hover:text-[#1B3564]"
                          )}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#1B3564]/10 flex items-center justify-between shrink-0">
                <button
                  onClick={handleResetFilters}
                  disabled={activeFilterCount === 0}
                  className="text-xs text-red-600 hover:text-red-700 underline font-extrabold tracking-wider transition-colors cursor-pointer disabled:opacity-30 disabled:no-underline disabled:cursor-not-allowed"
                >
                  RESET FILTERS
                </button>
                
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="bg-[#1B3564] hover:bg-[#152A50] text-white px-8 py-3.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer active:scale-95"
                >
                  APPLY RETREATS ({filteredVillas.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
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
