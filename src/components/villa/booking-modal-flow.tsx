"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  CheckCircle2, 
  X, 
  User, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import BookingCard from "@/components/villa/booking-card";
import { format } from "date-fns";
import { captureBookingLead } from "@/app/actions/inquiry";
import { useLenis } from "lenis/react";

interface BookingModalFlowProps {
  villaId: string;
  villaName: string;
  price: number;
  basePrice?: number;
  weekendPrice?: number | null;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  dailyPrices?: any[];
  seasonalPrices?: any[];
  maxGuests?: number;
  baseGuests?: number;
  extraGuestFee?: number;
  bookings?: any[];
  location?: string;
  isAngleHouse?: boolean;
}

export default function BookingModalFlow({
  villaId,
  villaName,
  price,
  basePrice,
  weekendPrice,
  fridayPrice,
  saturdayPrice,
  sundayPrice,
  dailyPrices = [],
  seasonalPrices = [],
  maxGuests = 16,
  baseGuests = 10,
  extraGuestFee = 1500,
  bookings = [],
  location = "Lonavala, Maharashtra",
  isAngleHouse = false,
}: BookingModalFlowProps) {
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();
  
  // Modals state
  const [isLeadGateOpen, setIsLeadGateOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // Guest Details Gate Form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Cottage selection for Willow Peak
  const isWillowPeak = villaId.includes("willow") || villaName.toLowerCase().includes("willow");
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "ALL">("A");

  // Availability Calendar State
  const [calMonth, setCalMonth] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and pause Lenis smooth scroll when any modal is open
  useEffect(() => {
    if (isLeadGateOpen || isBookingModalOpen || isAvailabilityModalOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) {
        try { lenis.stop(); } catch {}
      }
    } else {
      document.body.style.overflow = "unset";
      if (lenis) {
        try { lenis.start(); } catch {}
      }
    }
    return () => {
      document.body.style.overflow = "unset";
      if (lenis) {
        try { lenis.start(); } catch {}
      }
    };
  }, [isLeadGateOpen, isBookingModalOpen, isAvailabilityModalOpen, lenis]);

  const cottagesCount = isWillowPeak ? (cottageSelection === "ALL" ? 3 : 1) : 1;
  const displayPrice = isWillowPeak ? 5999 * cottagesCount : price;

  const handleOpenLeadGate = () => {
    setIsLeadGateOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert("Please enter your name.");
      return;
    }
    const cleanPhone = guestPhone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 8) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setPhoneError("");

    // Automatically capture lead to Admin CRM in background
    captureBookingLead({
      name: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail?.trim() || undefined,
      villaName,
      villaId,
    }).catch(err => console.error("Lead capture background error:", err));

    // Transition from lead gate to full booking modal
    setIsLeadGateOpen(false);
    setIsBookingModalOpen(true);
  };

  // Calendar Helpers for Availability Modal
  const isDateReserved = (date: Date) => {
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    if (isWillowPeak) {
      let booked = 0;
      for (const b of bookings) {
        if (b.status === "CANCELLED") continue;
        const s = new Date(b.checkIn);
        const e = new Date(b.checkOut);
        s.setHours(0, 0, 0, 0);
        e.setHours(0, 0, 0, 0);
        if (check >= s && check < e) {
          booked += b.cottagesCount || 1;
        }
      }
      return booked + cottagesCount > 3;
    }

    return bookings.some((b) => {
      if (b.status === "CANCELLED") return false;
      const s = new Date(b.checkIn);
      const e = new Date(b.checkOut);
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);
      return check >= s && check < e;
    });
  };

  const renderMonthDays = (baseMonth: Date) => {
    const y = baseMonth.getFullYear();
    const m = baseMonth.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10" />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const current = new Date(y, m, d);
      const reserved = isDateReserved(current);
      const past = current < new Date(new Date().setHours(0, 0, 0, 0));

      cells.push(
        <div
          key={`day-${d}`}
          className={`h-10 sm:h-12 flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all relative ${
            reserved
              ? "bg-red-50 text-red-700 border border-red-200"
              : past
              ? "bg-slate-50 text-slate-400"
              : "bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100"
          }`}
        >
          <span>{d}</span>
          <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">
            {reserved ? "Booked" : past ? "Past" : "Open"}
          </span>
        </div>
      );
    }
    return cells;
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LUXURY BOOKING TRIGGER CARD (Replaces static right bar on PC & Mobile)   */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-[#DAA520]/25 rounded-3xl p-6 sm:p-7 shadow-[0_16px_50px_rgba(27,53,100,0.1)] space-y-5 text-left w-full sticky top-28 backdrop-blur-md">
        {/* Header with Live Starting Price */}
        <div className="flex items-start justify-between pb-4 border-b border-[#DAA520]/20">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={13} className="text-[#DAA520]" />
              <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-[0.2em]">
                Direct Sanctuary Booking
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-black">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                / night {isWillowPeak ? (cottageSelection === "ALL" ? "(All 3 Cottages)" : `(Cottage ${cottageSelection})`) : ""}
              </span>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Best Rate</span>
          </div>
        </div>

        {/* Willow Peak Cottage Selector (if applicable) */}
        {isWillowPeak && (
          <div className="p-3 bg-[#FAF8F5] border border-[#DAA520]/25 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1B3564]">
              <span>Select Sanctuary Unit:</span>
              <span className="text-[#DAA520] font-black">
                {cottageSelection === "ALL" ? "Full Estate (12 Guests)" : `Cottage ${cottageSelection} (4 Guests)`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["A", "B", "C", "ALL"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCottageSelection(opt)}
                  className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    cottageSelection === opt
                      ? "bg-[#1B3564] text-white shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-[#1B3564]/40"
                  }`}
                >
                  {opt === "ALL" ? "All 3" : `Cottage ${opt}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-bold text-[11px]">0% Platform Fee</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={14} className="text-[#DAA520] shrink-0" />
            <span className="text-slate-700 font-bold text-[11px]">28% Promo Active</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={14} className="text-[#1B3564] shrink-0" />
            <span className="text-slate-700 font-bold text-[11px]">Personal Concierge</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-bold text-[11px]">Verified Hygiene</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleOpenLeadGate}
            className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white py-4 px-6 rounded-2xl text-xs sm:text-sm font-black tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_8px_30px_rgba(27,53,100,0.3)] hover:shadow-[0_12px_40px_rgba(27,53,100,0.45)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-[#DAA520]/40"
          >
            <Sparkles size={16} className="text-[#DAA520]" />
            <span>Book {villaName}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAvailabilityModalOpen(true)}
            className="w-full bg-white hover:bg-slate-50 text-[#1B3564] py-3.5 px-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all border border-slate-200 hover:border-[#1B3564]/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarIcon size={14} className="text-[#DAA520]" />
            <span>View Availability Calendar</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase pt-2">
          🔒 Secure Direct Booking • Free Cancellation Assist
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. STEP 1: LEAD CAPTURE GATE MODAL (Name & Phone Number First)            */}
      {/* ========================================================================= */}
      {mounted && isLeadGateOpen && typeof document !== "undefined" && createPortal(
        <div 
          data-lenis-prevent="true"
          data-lenis-prevent
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-4 overflow-y-auto overscroll-contain animate-fade-in font-sans"
        >
          {/* Backdrop dismiss */}
          <div className="fixed inset-0" onClick={() => setIsLeadGateOpen(false)} />

          <div 
            data-lenis-prevent="true"
            data-lenis-prevent
            className="relative bg-white border-2 border-[#DAA520]/30 rounded-[32px] p-6 sm:p-9 max-w-lg w-full my-auto shadow-[0_24px_70px_rgba(0,0,0,0.4)] z-10 text-slate-900 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-[0.2em] block mb-1">
                  Step 1 of 2 • Guest Details
                </span>
                <h3 className="text-2xl font-heading font-bold text-[#1B3564]">
                  Reserve {villaName}
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Please provide your name and phone number to access the reservation panel and personalized rates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLeadGateOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-black transition-all cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Rohit Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3564] focus:ring-2 focus:ring-[#1B3564]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => {
                      setGuestPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3564] focus:ring-2 focus:ring-[#1B3564]/20 outline-none transition-all"
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-600 font-medium mt-1">{phoneError}</p>
                )}
              </div>

              {/* Email Address (Optional) */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Email Address <span className="text-slate-400 text-[10px] font-normal">(Optional for confirmation)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. rohit@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1B3564] focus:ring-2 focus:ring-[#1B3564]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Privacy Guarantee */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-left text-xs text-slate-600">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span className="text-[11px]">
                  Your details are 100% private and used exclusively for your Stay Willas concierge reservation.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-[0.16em] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#DAA520]/40 mt-2 active:scale-[0.99]"
              >
                <span>Continue to Booking Panel</span>
                <ArrowRight size={16} className="text-[#DAA520]" />
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 3. STEP 2: FULL BOOKING PANEL MODAL (Dates, Add-ons & 3 Booking Modes)     */}
      {/* ========================================================================= */}
      {mounted && isBookingModalOpen && typeof document !== "undefined" && createPortal(
        <div 
          data-lenis-prevent="true"
          data-lenis-prevent
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fade-in font-sans"
        >
          {/* Backdrop dismiss */}
          <div className="fixed inset-0" onClick={() => setIsBookingModalOpen(false)} />

          <div 
            data-lenis-prevent="true"
            data-lenis-prevent
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_24px_80px_rgba(0,0,0,0.5)] border-2 border-[#DAA520]/30 overflow-hidden z-10 my-auto"
          >
            {/* Modal Sticky Header */}
            <div className="bg-[#1B3564] text-white px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10 z-20">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-widest">
                    Step 2 of 2 • Customized Stay Builder
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl tracking-wide text-white">
                  {villaName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Booking Card Content */}
            <div 
              data-lenis-prevent="true"
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 bg-slate-50 relative z-10 touch-pan-y"
              style={{ maxHeight: "calc(92vh - 75px)", WebkitOverflowScrolling: "touch" }}
            >
              <BookingCard
                villaId={villaId}
                villaName={villaName}
                price={price}
                basePrice={basePrice}
                weekendPrice={weekendPrice}
                fridayPrice={fridayPrice}
                saturdayPrice={saturdayPrice}
                sundayPrice={sundayPrice}
                dailyPrices={dailyPrices}
                seasonalPrices={seasonalPrices}
                maxGuests={maxGuests}
                baseGuests={baseGuests}
                extraGuestFee={extraGuestFee}
                bookings={bookings}
                initialCottageSelection={cottageSelection}
                initialGuestName={guestName}
                initialGuestPhone={guestPhone}
                isModal={true}
                onBookingComplete={() => {
                  // Keep modal open so success confirmation can be viewed
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 4. AVAILABILITY CALENDAR MODAL (Green = Open, Red = Reserved)              */}
      {/* ========================================================================= */}
      {mounted && isAvailabilityModalOpen && typeof document !== "undefined" && createPortal(
        <div 
          data-lenis-prevent="true"
          data-lenis-prevent
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain animate-fade-in font-sans"
        >
          <div className="fixed inset-0" onClick={() => setIsAvailabilityModalOpen(false)} />

          <div 
            data-lenis-prevent="true"
            data-lenis-prevent
            className="relative bg-white border-2 border-[#DAA520]/30 rounded-[32px] p-5 sm:p-8 max-w-lg w-full my-auto shadow-2xl z-10 text-slate-900 space-y-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-[0.2em] block mb-0.5">
                  Live Calendar Availability
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#1B3564]">
                  {villaName}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Real-time synchronization with Airbnb, MakeMyTrip & Direct reservations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailabilityModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-black transition-all cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Willow Peak Cottage Switch inside Availability Modal */}
            {isWillowPeak && (
              <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
                {(["A", "B", "C", "ALL"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCottageSelection(opt)}
                    className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                      cottageSelection === opt
                        ? "bg-[#1B3564] text-white shadow-sm"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    {opt === "ALL" ? "All 3" : `Cottage ${opt}`}
                  </button>
                ))}
              </div>
            )}

            {/* Month Navigator */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#1B3564]">
                {format(calMonth, "MMMM yyyy")}
              </h4>
              <button
                type="button"
                onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-400">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {renderMonthDays(calMonth)}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600 text-[11px]">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600 text-[11px]">Reserved / Hold</span>
              </div>
            </div>

            {/* Proceed CTA */}
            <button
              type="button"
              onClick={() => {
                setIsAvailabilityModalOpen(false);
                handleOpenLeadGate();
              }}
              className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-[#DAA520]" />
              <span>Proceed to Reserve Dates</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
