"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import { motion } from "framer-motion";

const BookingBar = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build dynamic query parameters for the villas collection page
    const params = new URLSearchParams();
    if (destination) params.set("region", destination.toLowerCase());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);

    router.push(`/villas?${params.toString()}`);
  };

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-6 -mt-6 md:-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-dark border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          
          {/* Destination Selector */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <label className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center gap-1.5">
              <MapPin size={12} />
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent text-white font-heading italic text-base outline-none cursor-pointer pr-4"
            >
              <option value="" className="bg-charcoal text-white">All Maharashtra Stays</option>
              <option value="Lonavala" className="bg-charcoal text-white">Lonavala</option>
              <option value="Alibaug" className="bg-charcoal text-white">Alibaug</option>
              <option value="Nashik" className="bg-charcoal text-white">Nashik</option>
              <option value="Karjat" className="bg-charcoal text-white">Karjat</option>
              <option value="Mulshi" className="bg-charcoal text-white">Mulshi</option>
            </select>
          </div>

          {/* Check-In Date */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <label className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Calendar size={12} />
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-white text-sm outline-none cursor-pointer w-full [color-scheme:dark]"
            />
          </div>

          {/* Check-Out Date */}
          <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <label className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Calendar size={12} />
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-white text-sm outline-none cursor-pointer w-full [color-scheme:dark]"
            />
          </div>

          {/* Guests and Submit Button Panel */}
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Guests Selector */}
            <div className="col-span-1 flex flex-col gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all h-full justify-center">
              <label className="text-[10px] text-gold uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Users size={12} />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent text-white text-sm outline-none cursor-pointer font-bold"
              >
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-charcoal text-white">
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Bright Yellow Action Button */}
            <button
              type="submit"
              className="col-span-2 w-full h-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#FFD700] text-black font-extrabold text-[11px] tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(255,204,0,0.2)] hover:shadow-[0_0_30px_rgba(255,204,0,0.4)] transition-all duration-300 py-5 cursor-pointer border-none"
            >
              <Search size={14} className="stroke-[3]" />
              <span>Search</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default BookingBar;
