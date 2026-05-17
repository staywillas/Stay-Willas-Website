"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Users, Info, Loader2 } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { createCheckoutSession } from "@/app/actions/booking";

interface BookingCardProps {
  villaId: string;
  villaName: string;
  price: string;
}

const BookingCard = ({ villaId, villaName, price }: BookingCardProps) => {
  // Quick cleanup to convert string price (like "45,000") to a clean JS number we can calculate with
  const numericPrice = parseInt(price.replace(/,/g, ""));
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  // Simple check on how many nights they are booking for
  const nights = differenceInDays(checkOut, checkIn);
  const subtotal = numericPrice * (nights > 0 ? nights : 0);
  const serviceFee = 5000; // Flat fee for our on-site team, private chef, and keeping everything clean
  const total = subtotal + serviceFee;

  // Let's create checkout session on Stripe so they can pay securely
  const handleBooking = async () => {
    setIsLoading(true);
    try {
      const response = await createCheckoutSession({
        villaId,
        villaName,
        checkIn,
        checkOut,
        guests,
        pricePerNight: numericPrice,
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong on our end. Please try again or drop us a line!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-dark border border-white/10 rounded-3xl p-8 sticky top-32 shadow-2xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-3xl font-heading text-white">₹{price}</span>
          <span className="text-white/40 text-sm ml-2">/ night</span>
        </div>
        <div className="flex items-center gap-1 text-gold text-xs font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {/* Double-date picker box. Separated with a thin border. */}
        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-charcoal p-4 text-left">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Check-in</span>
            <div className="flex items-center justify-between text-white text-sm">
              <span>{format(checkIn, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-gold" />
            </div>
          </div>
          <div className="bg-charcoal p-4 text-left border-l border-white/10">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Check-out</span>
            <div className="flex items-center justify-between text-white text-sm">
              <span>{format(checkOut, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-gold" />
            </div>
          </div>
        </div>

        <div className="w-full bg-charcoal p-4 text-left border border-white/10 rounded-2xl flex items-center justify-between group">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Guests</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-gold hover:text-white">-</button>
              <span className="text-white text-sm">{guests} Guests</span>
              <button onClick={() => setGuests(Math.min(10, guests + 1))} className="text-gold hover:text-white">+</button>
            </div>
          </div>
          <Users size={16} className="text-white/40" />
        </div>
      </div>

      <Button 
        onClick={handleBooking}
        disabled={isLoading || nights <= 0}
        className="w-full bg-gold hover:bg-gold/80 text-charcoal rounded-full py-7 text-lg font-bold tracking-wider mb-4 shadow-[0_10px_20px_-10px_rgba(197,160,89,0.5)] flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "RESERVE NOW"}
      </Button>
      
      <p className="text-center text-white/40 text-[10px] uppercase tracking-widest mb-6">
        You won&apos;t be charged yet
      </p>

      {nights > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">₹{price} x {nights} nights</span>
            <span className="text-white">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Service fee</span>
            <span className="text-white">₹{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-heading pt-4 border-t border-white/5">
            <span className="text-white">Total</span>
            <span className="text-gold">₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 rounded-2xl bg-gold/5 border border-gold/10 flex gap-3 items-start">
        <Info className="text-gold shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-gold/80 leading-relaxed">
          Best Price Guarantee: If you find a lower price on another OTA, we will match it and offer a complimentary experience.
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
