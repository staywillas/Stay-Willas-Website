"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Users, Info, Loader2, Mail, Phone, CheckCircle2 } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { createCheckoutSession } from "@/app/actions/booking";
import { useUser, SignInButton } from "@clerk/nextjs";

interface BookingCardProps {
  villaId: string;
  villaName: string;
  price: string;
  maxGuests?: number;
}

const BookingCard = ({ villaId, villaName, price, maxGuests = 16 }: BookingCardProps) => {
  const numericPrice = parseInt(price.replace(/,/g, ""));
  const { user, isSignedIn } = useUser();

  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 3));
  const [guests, setGuests] = useState(2);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prefill details from Clerk user session
  React.useEffect(() => {
    if (user) {
      const name = user.fullName ?? user.firstName ?? "";
      const email = user.primaryEmailAddress?.emailAddress ?? "";
      setClientName(name);
      setClientEmail(email);
    }
  }, [user]);

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

  const handleBooking = async () => {
    if (!clientName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!clientEmail.trim() || !/^\S+@\S+\.\S+$/.test(clientEmail)) {
      alert("Please enter a valid Email Address.");
      return;
    }
    if (!clientPhone.trim()) {
      alert("Please enter your Phone Number.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedCheckIn = format(checkIn, "dd MMM yyyy");
      const formattedCheckOut = format(checkOut, "dd MMM yyyy");
      
      const msg = `Hi Stay Willas! I would like to book *${villaName}* for *${guests}* guest(s).

• Check-in: *${formattedCheckIn}*
• Check-out: *${formattedCheckOut}*
• Total Bill: *₹${total.toLocaleString("en-IN")}*

My Verified Guest Details:
• Name: *${clientName.trim()}*
• Email: *${clientEmail.trim()}*
• Phone: *${clientPhone.trim()}*

Please check availability and confirm my booking request!`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/919619042310?text=${encodedMsg}`;
      
      window.open(whatsappUrl, "_blank");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Booking Error:", error);
      alert("Failed to initiate WhatsApp redirection. Please try again.");
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

        {/* Guests picker - Dual Type or Select Input */}
        <div className="w-full bg-white p-4 text-left border border-border-subtle rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-text-primary/40 uppercase tracking-widest block mb-1">Guests (Max {maxGuests})</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={maxGuests}
                className="w-12 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0"
                value={guests}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setGuests(Math.min(maxGuests, Math.max(1, val)));
                  }
                }}
              />
              <span className="text-text-primary/30 text-xs font-bold select-none border-l border-border-subtle/60 pl-2">or select:</span>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="flex-1 bg-transparent text-text-primary text-sm font-bold border-none outline-none p-0 focus:ring-0 cursor-pointer appearance-none"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className="text-text-primary">
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Users size={16} className="text-text-primary/30 shrink-0 pointer-events-none" />
        </div>



        {/* Contact Information Section */}
        <div className="pt-4 border-t border-border-subtle/60 space-y-3">
          <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-[0.15em] block text-left">
            Contact Information (Secure Checkout)
          </span>

          {/* Full Name */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Full Name</span>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <Users size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Email Address */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Email Address</span>
              <input
                type="email"
                required
                placeholder="e.g. john@example.com"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <Mail size={16} className="text-text-primary/30 shrink-0" />
          </div>

          {/* Phone Number */}
          <div className="w-full bg-white p-4 border border-border-subtle rounded-2xl flex items-center justify-between shadow-sm focus-within:border-[#1B3564] focus-within:ring-1 focus-within:ring-[#1B3564]/25 transition-all duration-300">
            <div className="flex-1 text-left">
              <span className="text-[9px] text-text-primary/40 uppercase tracking-widest block mb-0.5">Phone Number</span>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                className="w-full text-text-primary text-sm font-semibold bg-transparent border-none outline-none p-0 focus:ring-0 placeholder:text-text-primary/20"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
            <Phone size={16} className="text-text-primary/30 shrink-0" />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleBooking}
        disabled={isLoading || nights <= 0}
        className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white rounded-full py-6 text-[10px] md:text-xs font-black tracking-[0.2em] mb-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(27,53,100,0.25)] hover:shadow-[0_0_30px_rgba(27,53,100,0.4)] transition-all duration-300 whitespace-nowrap cursor-pointer"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "RESERVE NOW & SECURE STAY"}
      </Button>
      
      <p className="text-center text-text-primary/40 text-[10px] uppercase tracking-widest mb-6 select-none">
        Secure checkout & temporary 10-minute hold
      </p>

      {nights > 0 && (
        <div className="space-y-4 pt-6 border-t border-border-subtle">
          <div className="flex justify-between text-sm">
            <span className="text-text-primary/60">₹{price} x {nights} nights</span>
            <span className="text-text-primary">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-text-primary/60">Luxury Service Fee</span>
            <span className="text-text-primary">₹{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-heading pt-4 border-t border-[#1B3564]/10">
            <span className="text-[#1B3564]">Total Stay Bill</span>
            <span className="text-[#1B3564] font-bold">₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 rounded-2xl bg-accent-secondary/8 border border-accent-secondary/20 flex gap-3 items-start text-left select-none">
        <Info className="text-accent-secondary shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-accent-secondary/80 leading-relaxed">
          Best Price Guarantee: If you find a lower price on another OTA, we will match it and offer a complimentary experience.
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
