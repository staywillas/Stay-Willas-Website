"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BookingBar = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("region", destination.toLowerCase());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    
    setIsMobileModalOpen(false);
    router.push(`/villas?${params.toString()}`);
  };

  const SearchForm = ({ isMobile = false }) => (
    <form 
      onSubmit={handleSearch} 
      className={isMobile 
        ? "flex flex-col gap-6" 
        : "hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"}
    >
      {/* Destination Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          <MapPin size={14} className="inline mr-2" />
          Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-modern text-text-primary font-semibold text-base bg-white/50 focus:bg-white"
        >
          <option value="" className="bg-white text-text-primary">All Maharashtra</option>
          <option value="Lonavala" className="bg-white text-text-primary">Lonavala</option>
        </select>
      </div>

      {/* Check-In Date */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          <Calendar size={14} className="inline mr-2" />
          Check In
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="input-modern text-text-primary bg-white/50 focus:bg-white [color-scheme:light]"
        />
      </div>

      {/* Check-Out Date */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          <Calendar size={14} className="inline mr-2" />
          Check Out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="input-modern text-text-primary bg-white/50 focus:bg-white [color-scheme:light]"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-blue-600 uppercase tracking-widest">
          <Users size={14} className="inline mr-2" />
          Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="input-modern text-text-primary bg-white/50 focus:bg-white font-semibold"
        >
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1} className="bg-white text-text-primary">
              {i + 1} Guest{i !== 0 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full h-12 flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white font-extrabold text-[13px] tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(27,53,100,0.2)] hover:shadow-[0_0_30px_rgba(30,122,140,0.4)] transition-all duration-300 cursor-pointer border-none hover:-translate-y-1 mt-4 md:mt-0"
      >
        <Search size={16} className="stroke-[3]" />
        <span>Search</span>
      </button>
    </form>
  );

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-6 -mt-6 md:-mt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-premium rounded-3xl p-4 md:p-8 shadow-2xl"
      >
        {/* Desktop View */}
        <SearchForm />

        {/* Mobile Compact View Button */}
        <div className="md:hidden flex items-center justify-between bg-white rounded-full p-2 pl-6 shadow-sm border border-black/5" onClick={() => setIsMobileModalOpen(true)}>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-bold text-text-primary">Where to?</span>
            <span className="text-[10px] text-text-primary/60 font-medium flex items-center gap-1.5">
              <span>Anywhere</span>
              <span className="w-1 h-1 rounded-full bg-text-primary/30"></span>
              <span>Any week</span>
              <span className="w-1 h-1 rounded-full bg-text-primary/30"></span>
              <span>Add guests</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-white shrink-0 shadow-md">
            <Search size={18} className="stroke-[2.5]" />
          </div>
        </div>
      </motion.div>

      {/* Mobile Full Screen Modal */}
      <AnimatePresence>
        {isMobileModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#F5F2EA] flex flex-col px-6 pt-16 pb-24 md:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading text-brand-navy font-bold">Find your stay</h2>
              <button 
                onClick={() => setIsMobileModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 text-brand-navy"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 flex-1 overflow-y-auto">
              <SearchForm isMobile={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingBar;
