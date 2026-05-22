"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Users, Info, Loader2 } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

interface BookingCardProps {
  villaId: string;
  villaName: string;
  price: string;
}

const BookingCard = ({ villaId, villaName, price }: BookingCardProps) => {
  const numericPrice = parseInt(price.replace(/,/g, ""));
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const nights = differenceInDays(checkOut, checkIn);
  const subtotal = numericPrice * (nights > 0 ? nights : 0);
  const serviceFee = 5000;
  const total = subtotal + serviceFee;

  const handleCheckInClick = () => {
    if (checkInRef.current) {
      try { checkInRef.current.showPicker(); } catch (err) { checkInRef.current.click(); }
    }
  };

  const handleCheckOutClick = () => {
    if (checkOutRef.current) {
      try { checkOutRef.current.showPicker(); } catch (err) { checkOutRef.current.click(); }
    }
  };

  const handleBooking = () => {
    setIsLoading(true);
    try {
      const checkInStr = format(checkIn, "MMM dd, yyyy");
      const checkOutStr = format(checkOut, "MMM dd, yyyy");
      
      const message = `🏰 *STAY WILLAS - RESERVATION REQUEST* 🏰\n` +
        `------------------------------------------\n` +
        `✨ *Villa:* ${villaName}\n` +
        `📅 *Check-In:* ${checkInStr}\n` +
        `📅 *Check-Out:* ${checkOutStr}\n` +
        `🌙 *Nights:* ${nights}\n` +
        `👥 *Guests:* ${guests} Guests\n\n` +
        `💳 *BILLING SUMMARY:*\n` +
        `• Rate per Night: ₹${price}\n` +
        `• Subtotal: ₹${subtotal.toLocaleString("en-IN")}\n` +
        `• Luxury Service & Culinary Fee: ₹${serviceFee.toLocaleString("en-IN")}\n` +
        `------------------------------------------\n` +
        `🌟 *TOTAL BILL: ₹${total.toLocaleString("en-IN")}*\n` +
        `------------------------------------------\n` +
        `✨ *Status:* Booking Inquiry Pending. Please verify calendar availability!`;

      const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-primary border border-border-subtle rounded-3xl p-6 md:p-8 sticky top-32 shadow-[0_10px_40px_rgba(44,31,14,0.1)]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-3xl font-heading text-text-primary">₹{price}</span>
          <span className="text-text-primary/40 text-sm ml-2">/ night</span>
        </div>
        <div className="flex items-center gap-1 text-accent-secondary text-xs font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {/* Date picker pair */}
        <div className="grid grid-cols-2 gap-px bg-[#E2E8F0] border border-border-subtle rounded-2xl overflow-hidden relative">
          <div 
            onClick={handleCheckInClick}
            className="relative bg-white p-4 text-left cursor-pointer hover:bg-bg-primary transition-colors"
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Check-in</span>
            <div className="flex items-center justify-between text-text-primary text-sm">
              <span>{format(checkIn, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-accent-secondary" />
            </div>
            <input 
              ref={checkInRef}
              type="date"
              className="absolute bottom-0 right-0 w-0 h-0 opacity-0 pointer-events-none"
              min={format(new Date(), "yyyy-MM-dd")}
              value={format(checkIn, "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value);
                  setCheckIn(newDate);
                  if (newDate >= checkOut) setCheckOut(addDays(newDate, 3));
                }
              }}
            />
          </div>
          <div 
            onClick={handleCheckOutClick}
            className="relative bg-white p-4 text-left border-l border-border-subtle cursor-pointer hover:bg-bg-primary transition-colors"
          >
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Check-out</span>
            <div className="flex items-center justify-between text-text-primary text-sm">
              <span>{format(checkOut, "MMM dd, yyyy")}</span>
              <CalendarIcon size={14} className="text-accent-secondary" />
            </div>
            <input 
              ref={checkOutRef}
              type="date"
              className="absolute bottom-0 right-0 w-0 h-0 opacity-0 pointer-events-none"
              min={format(addDays(checkIn, 1), "yyyy-MM-dd")}
              value={format(checkOut, "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) setCheckOut(new Date(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="w-full bg-white p-4 text-left border border-border-subtle rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Guests</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-accent-secondary hover:text-accent-primary font-bold text-lg leading-none">-</button>
              <span className="text-text-primary text-sm">{guests} Guests</span>
              <button onClick={() => setGuests(Math.min(20, guests + 1))} className="text-accent-secondary hover:text-accent-primary font-bold text-lg leading-none">+</button>
            </div>
          </div>
          <Users size={16} className="text-text-primary/30" />
        </div>
      </div>

      <Button 
        onClick={handleBooking}
        disabled={isLoading || nights <= 0}
        className="w-full bg-accent-primary hover:bg-accent-secondary text-white rounded-full py-6 text-[10px] md:text-xs font-black tracking-[0.2em] mb-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(27,53,100,0.25)] hover:shadow-[0_0_30px_rgba(30,122,140,0.4)] transition-all duration-300 whitespace-nowrap"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "RESERVE NOW & SECURE STAY"}
      </Button>
      
      <p className="text-center text-text-primary/40 text-[10px] uppercase tracking-widest mb-6">
        You won&apos;t be charged yet
      </p>

      {nights > 0 && (
        <div className="space-y-4 pt-6 border-t border-border-subtle">
          <div className="flex justify-between text-sm">
            <span className="text-text-primary/60">₹{price} x {nights} nights</span>
            <span className="text-text-primary">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-primary/60">Service fee</span>
            <span className="text-text-primary">₹{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-heading pt-4 border-t border-border-subtle">
            <span className="text-text-primary">Total</span>
            <span className="text-accent-primary">₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 rounded-2xl bg-accent-secondary/8 border border-accent-secondary/20 flex gap-3 items-start">
        <Info className="text-accent-secondary shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-accent-secondary/80 leading-relaxed">
          Best Price Guarantee: If you find a lower price on another OTA, we will match it and offer a complimentary experience.
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
