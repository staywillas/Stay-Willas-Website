"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { 
  Calendar as CalendarIcon, 
  Zap, 
  CheckCircle2, 
  X, 
  Phone, 
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
const BookingCard = dynamic(() => import("@/components/villa/booking-card"), {
  loading: () => <p role="status" className="p-6 text-center text-slate-600">Loading booking details…</p>,
});
import { useLenis } from "lenis/react";
import editorialStyles from "./property-editorial.module.css";
import { willowUnits } from "@/data/property-editorial";
import BorderGlow from "@/components/ui/border-glow";

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
  presentation?: "default" | "editorial";
  initialCottageSelection?: "A" | "B" | "C" | "TWO" | "ALL";
  propertySlug?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
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
  presentation = "default",
  initialCottageSelection = "A",
  propertySlug,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: BookingModalFlowProps) {
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();
  
  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(Boolean(initialCheckIn && initialCheckOut));

  // Cottage selection for Willow Peak
  const isWillowPeak = villaId.includes("willow") || villaName.toLowerCase().includes("willow");
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "TWO" | "ALL">(initialCottageSelection);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep keyboard interaction inside the editorial booking overlays and return
  // focus to the trigger after closing.
  useEffect(() => {
    if (presentation !== "editorial" || !mounted || !isBookingModalOpen) return;
    const dialog = document.querySelector<HTMLElement>('[data-editorial-booking="true"]');
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(element => element.getClientRects().length > 0);
    focusable()[0]?.focus({ preventScroll: true });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsBookingModalOpen(false);
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    dialog.addEventListener("keydown", handleKey);
    return () => { dialog.removeEventListener("keydown", handleKey); previousFocus?.focus({ preventScroll: true }); };
  }, [presentation, mounted, isBookingModalOpen]);

  // Lock body scroll and pause Lenis smooth scroll when any modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
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
  }, [isBookingModalOpen, lenis]);

  const isSingleWillowCottage = (propertySlug?.startsWith("willow-peak-cottage-") ?? false) || (isWillowPeak && cottageSelection !== "ALL");
  // Willow Peak Entire Estate base starting rate is 15,000, single cottage is 4,999
  const willowEntireStartingPrice = 15000;
  const willowCottageStartingPrice = 4999;
  const displayPrice = isWillowPeak 
    ? (cottageSelection === "ALL" ? (basePrice && basePrice <= 15000 ? basePrice : willowEntireStartingPrice) : cottageSelection === "TWO" ? willowCottageStartingPrice * 2 : willowCottageStartingPrice)
    : price;
  const bookingTitle = propertySlug === "willow-peak"
    ? `${villaName.replace(/\s*\(Entire Estate.*\)$/i, "")} · ${cottageSelection === "ALL" ? "Entire estate" : cottageSelection === "TWO" ? "2 cottages" : `Cottage ${cottageSelection}`}`
    : villaName;

  const handleOpenBooking = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LUXURY BOOKING TRIGGER CARD (Replaces static right bar on PC & Mobile)   */}
      {/* ========================================================================= */}
      {presentation === "editorial" ? (
        <>
          <div className={editorialStyles.bookingSummary}>
            <span className={editorialStyles.bookingLabel}>YOUR STAY, DIRECT WITH US</span>
            <h2>Make it your weekend.</h2>
            <div className={editorialStyles.bookingPrice}><span>{initialCheckIn && initialCheckOut ? "Date-specific rate" : "Starting rate"}</span><div>{initialCheckIn && initialCheckOut ? <strong>See live quote</strong> : <><strong>₹{displayPrice.toLocaleString("en-IN")}</strong><span> / night</span></>}</div></div>
            <p className={editorialStyles.bookingRateNote}>{initialCheckIn && initialCheckOut ? "Your dates are prefilled. The booking panel is checking live availability and rates." : "Choose dates in the booking panel to see the live scheduled rate."}</p>
            {isWillowPeak && <div className={editorialStyles.unitPicker}><p>{cottageSelection === "ALL" ? "Entire estate · up to 12 guests" : cottageSelection === "TWO" ? "2 cottages · up to 8 guests" : `${willowUnits.find(unit => unit.selection === cottageSelection)?.name} · up to 4 guests`}</p><nav className={editorialStyles.unitLinks} aria-label="Choose your Willow Peak stay">{willowUnits.map(unit => <Link key={unit.slug} href={`/villa/${unit.slug}`} aria-current={unit.slug === propertySlug ? "page" : undefined}><strong>{unit.name}</strong><small>{unit.capacity} guests</small></Link>)}</nav></div>}
            {!isSingleWillowCottage && (
              <div className={editorialStyles.bookingOffer}><span>Date offers</span><div><strong>26% Weekdays · 5% Weekends &amp; Holidays</strong><small>Choose eligible offers below the live quote</small></div></div>
            )}
            <BorderGlow className={editorialStyles.availabilityGlow} backgroundColor="#1b3564" borderRadius={28} animated={false}><button type="button" className={editorialStyles.primaryButton} onClick={handleOpenBooking}><CalendarIcon size={17} /> Check availability</button></BorderGlow>
            <button type="button" className={editorialStyles.secondaryButton} onClick={handleOpenBooking}>Reserve your stay <ArrowRight size={17} /></button>
            <p className={editorialStyles.bookingFee}><CheckCircle2 size={15} /> No platform booking fee</p>
          </div>
          <div className={editorialStyles.mobileBooking} role="group" aria-label="Quick booking">
            <div><small>{initialCheckIn && initialCheckOut ? "Live quote" : "From"}</small><strong>{initialCheckIn && initialCheckOut ? "See booking panel" : <>₹{displayPrice.toLocaleString("en-IN")}<span> / night</span></>}</strong></div>
            {isAngleHouse ? (
              <div className={editorialStyles.angleHouseMobileActions}>
                <BorderGlow className={`${editorialStyles.availabilityGlow} ${editorialStyles.mobileAvailabilityGlow}`} backgroundColor="#1b3564" borderRadius={28} glowRadius={18} animated={false}><button type="button" onClick={handleOpenBooking}>Check dates <ArrowRight size={17} /></button></BorderGlow>
                <a className={editorialStyles.mobileCallButton} href="tel:+919619042310" aria-label="Call The Angle House booking team at 96190 42310">
                  <Phone size={16} aria-hidden="true" />
                  <span>Call</span>
                </a>
              </div>
            ) : (
              <BorderGlow className={`${editorialStyles.availabilityGlow} ${editorialStyles.mobileAvailabilityGlow}`} backgroundColor="#1b3564" borderRadius={28} glowRadius={18} animated={false}><button type="button" onClick={handleOpenBooking}>Check dates <ArrowRight size={17} /></button></BorderGlow>
            )}
          </div>
        </>
      ) : (
      <div className="bg-white border-2 border-[#DAA520]/25 rounded-3xl p-6 sm:p-7 shadow-[0_16px_50px_rgba(27,53,100,0.1)] space-y-5 text-left w-full sticky top-28 backdrop-blur-md">
        {/* Header with Live Starting Price */}
        <div className="flex items-start justify-between pb-4 border-b border-[#DAA520]/20">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck size={13} className="text-[#DAA520]" />
              <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-[0.2em]">
                Direct Villa Booking
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">
              {initialCheckIn && initialCheckOut ? "Live quote below" : "Starting at"}
            </span>
            <div className="flex items-baseline gap-1.5">
              {!initialCheckIn || !initialCheckOut ? <span className="text-3xl sm:text-4xl font-heading text-[#1B3564] font-black">₹{displayPrice.toLocaleString("en-IN")}</span> : <span className="text-lg font-bold text-[#1B3564]">See live quote below</span>}
              <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                / night {isWillowPeak ? (cottageSelection === "ALL" ? "(Entire Estate - 12 Guests)" : `(Cottage ${cottageSelection})`) : ""}
              </span>
            </div>
            <div className="text-[10px] font-semibold text-amber-800 bg-amber-50/90 border border-amber-200 rounded-lg px-2 py-1 mt-1.5 flex items-center gap-1.5">
              <span>ℹ️</span>
              <span>Pricing varies between weekdays and weekends.</span>
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
              <span>Select Villa Unit:</span>
              <span className="text-[#DAA520] font-black">
                {cottageSelection === "ALL" ? "Full Estate · up to 12 guests" : cottageSelection === "TWO" ? "2 Cottages · up to 8 guests" : `${cottageSelection === "A" ? "Breeze" : cottageSelection === "B" ? "Crest" : "Heaven"} · up to 4 guests`}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { key: "A", label: "Breeze" },
                { key: "B", label: "Crest" },
                { key: "C", label: "Heaven" },
                { key: "TWO", label: "2 Cottages" },
                { key: "ALL", label: "All 3" }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCottageSelection(item.key as "A" | "B" | "C" | "TWO" | "ALL")}
                  className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    cottageSelection === item.key
                      ? "bg-[#1B3564] text-white shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-[#1B3564]/40"
                  }`}
                >
                  {item.label}
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
            <span className="text-slate-700 font-bold text-[11px]">{isSingleWillowCottage ? "Direct Net Tariff" : "Direct Savings Active"}</span>
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
            onClick={handleOpenBooking}
            className="w-full bg-gradient-to-r from-[#E0534C] via-[#E7625A] to-[#D9413A] hover:from-[#D9413A] hover:to-[#C9332C] text-white py-4 px-6 rounded-2xl text-xs sm:text-sm font-black tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_8px_30px_rgba(224,83,76,0.38)] hover:shadow-[0_12px_40px_rgba(224,83,76,0.5)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-white/25"
          >
            <Zap size={16} className="text-amber-200" />
            <span>Book {villaName}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenBooking}
            className="w-full bg-white hover:bg-rose-50/50 text-[#C9332C] py-3.5 px-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all border border-rose-200/80 hover:border-[#E0534C]/60 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarIcon size={14} className="text-[#E0534C]" />
            <span>View Availability Calendar</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase pt-2">
          🔒 Secure Direct Booking • Free Cancellation Assist
        </p>
      </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SINGLE BOOKING PANEL (Dates, Guest Details, Pricing & Booking Choices) */}
      {/* ========================================================================= */}
      {mounted && isBookingModalOpen && typeof document !== "undefined" && createPortal(
        <div 
          role={presentation === "editorial" ? "dialog" : undefined}
          aria-modal={presentation === "editorial" ? true : undefined}
          aria-label={presentation === "editorial" ? `${villaName} booking details` : undefined}
          data-editorial-booking={presentation === "editorial" ? "true" : undefined}
          data-lenis-prevent="true"
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fade-in font-sans"
        >
          {/* Backdrop dismiss */}
          <div className="fixed inset-0" onClick={() => setIsBookingModalOpen(false)} />

          <div 
            data-lenis-prevent="true"
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_24px_80px_rgba(0,0,0,0.5)] border-2 border-[#DAA520]/30 overflow-hidden z-10 my-auto"
          >
            {/* Modal Sticky Header */}
            <div className="bg-[#1B3564] text-white px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10 z-20">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-widest">
                    YOUR STAY • DIRECT WITH STAY WILLAS
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl tracking-wide text-white">
                  {bookingTitle}
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
              className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 bg-slate-50 relative z-10 touch-pan-y"
              style={{ maxHeight: "calc(92vh - 75px)", WebkitOverflowScrolling: "touch" }}
            >
              <BookingCard
                villaId={villaId}
                villaName={bookingTitle}
                isAngleHouse={isAngleHouse}
                price={price}
                basePrice={basePrice}
                weekendPrice={weekendPrice}
                fridayPrice={fridayPrice}
                saturdayPrice={saturdayPrice}
                sundayPrice={sundayPrice}
                dailyPrices={dailyPrices}
                seasonalPrices={seasonalPrices}
                propertySlug={propertySlug}
                maxGuests={maxGuests}
                baseGuests={baseGuests}
                extraGuestFee={extraGuestFee}
                bookings={bookings}
                initialCottageSelection={cottageSelection}
                lockCottageSelection={propertySlug?.startsWith("willow-peak-cottage-") ?? false}
                initialCheckIn={initialCheckIn ? new Date(`${initialCheckIn}T00:00:00`) : null}
                initialCheckOut={initialCheckOut ? new Date(`${initialCheckOut}T00:00:00`) : null}
                initialGuests={initialGuests}
                isModal={true}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}

    </>
  );
}
