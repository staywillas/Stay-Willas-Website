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
    const params = new URLSearchParams();
    if (destination) params.set("region", destination.toLowerCase());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    router.push(`/villas?${params.toString()}`);
  };

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-6 -mt-8 md:-mt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-premium rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
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
              <option value="Alibaug" className="bg-white text-text-primary">Alibaug</option>
              <option value="Nashik" className="bg-white text-text-primary">Nashik</option>
              <option value="Karjat" className="bg-white text-text-primary">Karjat</option>
              <option value="Mulshi" className="bg-white text-text-primary">Mulshi</option>
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

          {/* Navy Search Button */}
          <button
            type="submit"
            className="w-full h-12 flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-white font-extrabold text-[13px] tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(27,53,100,0.2)] hover:shadow-[0_0_30px_rgba(30,122,140,0.4)] transition-all duration-300 cursor-pointer border-none hover:-translate-y-1"
          >
            <Search size={16} className="stroke-[3]" />
            <span>Search</span>
          </button>

        </form>
      </motion.div>
    </div>
  );
};

export default BookingBar;
