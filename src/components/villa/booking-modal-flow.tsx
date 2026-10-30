"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { 
  Calendar as CalendarIcon, 
  X, 
  Phone, 
  ArrowRight,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
const BookingCard = dynamic(() => import("@/components/villa/booking-card"), {
  loading: () => <p role="status" className="p-6 text-center text-slate-600">Loading booking details…</p>,
});
import { useLenis } from "lenis/react";
import editorialStyles from "./property-editorial.module.css";
import { willowUnits } from "@/data/property-editorial";
import BorderGlow from "@/components/ui/border-glow";
import { trackCanopyCrestInteraction } from "@/lib/angle-house-measurement";

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
  const [quickCheckIn, setQuickCheckIn] = useState(initialCheckIn ?? "");
  const [quickCheckOut, setQuickCheckOut] = useState(initialCheckOut ?? "");
  const [quickGuests, setQuickGuests] = useState(initialGuests ?? 2);
  const [quickBookingError, setQuickBookingError] = useState("");

  // Cottage selection for Willow Peak
  const isWillowPeak = villaId.includes("willow") || villaName.toLowerCase().includes("willow");
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "TWO" | "ALL">(initialCottageSelection);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const checkIn = params.get("checkIn") ?? "";
    const checkOut = params.get("checkOut") ?? "";
    const isValidDate = (value: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(Date.UTC(year, month - 1, day));
      return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
    };

    if (!initialCheckIn && !initialCheckOut && isValidDate(checkIn) && isValidDate(checkOut) && checkOut > checkIn) {
      setQuickCheckIn(checkIn);
      setQuickCheckOut(checkOut);
      setIsBookingModalOpen(true);
    }

    if (!initialGuests) {
      const guests = Number(params.get("guests"));
      if (Number.isInteger(guests) && guests > 0 && guests <= 16) setQuickGuests(guests);
    }

    const selection = params.get("cottageSelection");
    if (selection && ["A", "B", "C", "TWO", "ALL"].includes(selection)) {
      setCottageSelection(selection as "A" | "B" | "C" | "TWO" | "ALL");
    }
  }, []);

  useEffect(() => {
    const handleHeroBooking = (event: Event) => {
      const request = (event as CustomEvent<{
        checkIn: string;
        checkOut: string;
        guests?: number;
      }>).detail;
      if (!request?.checkIn || !request.checkOut || request.checkOut <= request.checkIn) return;

      setQuickCheckIn(request.checkIn);
      setQuickCheckOut(request.checkOut);
      if (Number.isInteger(request.guests) && request.guests! > 0 && request.guests! <= maxGuests) {
        setQuickGuests(request.guests!);
      }
      setQuickBookingError("");
      setIsBookingModalOpen(true);
    };

    window.addEventListener("staywillas:open-booking", handleHeroBooking);
    return () => window.removeEventListener("staywillas:open-booking", handleHeroBooking);
  }, [maxGuests]);

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

  const quickGuestLimit = isWillowPeak
    ? cottageSelection === "ALL" ? 12 : cottageSelection === "TWO" ? 8 : 4
    : maxGuests;
  const quickGuestMinimum = isWillowPeak && cottageSelection === "TWO" ? 5 : 1;
  const bookingTitle = propertySlug === "willow-peak"
    ? `${villaName} · ${cottageSelection === "ALL" ? "All 3 cottages" : cottageSelection === "TWO" ? "2 cottages" : `Cottage ${cottageSelection}`}`
    : villaName;

  const handleOpenBooking = () => {
    if (propertySlug === "canopy-crest") {
      trackCanopyCrestInteraction("canopy_crest_book_now_click", "villa_booking_summary");
    }
    if (!quickCheckIn || !quickCheckOut) {
      setQuickBookingError("Choose your check-in and check-out dates to see the live rate.");
      document.querySelector<HTMLInputElement>('[aria-label="Check-in date"]')?.focus();
      return;
    }
    if (quickCheckIn < todayInput) {
      setQuickBookingError("Choose a check-in date from today onward.");
      return;
    }
    if (quickCheckOut <= quickCheckIn) {
      setQuickBookingError("Check-out must be at least one night after check-in.");
      return;
    }
    setQuickBookingError("");
    setIsBookingModalOpen(true);
  };

  const today = new Date();
  const todayInput = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dayAfter = (value: string) => {
    if (!value) return todayInput;
    const date = new Date(`${value}T00:00:00`);
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  const updateQuickCheckIn = (value: string) => {
    setQuickCheckIn(value);
    if (quickCheckOut && value && quickCheckOut <= value) setQuickCheckOut(dayAfter(value));
    setQuickBookingError("");
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LUXURY BOOKING TRIGGER CARD (Replaces static right bar on PC & Mobile)   */}
      {/* ========================================================================= */}
      <div className={editorialStyles.bookingSummary}>
        <span className={editorialStyles.bookingLabel}>YOUR STAY, DIRECT WITH US</span>
        <h2>Make it your weekend.</h2>
        <p className={editorialStyles.quickBookingIntro}>Choose your dates and group size to see the live rate.</p>
        {isWillowPeak && (
          <div className={editorialStyles.unitPicker}>
            <p>{cottageSelection === "ALL" ? "All 3 cottages · up to 12 guests" : cottageSelection === "TWO" ? "2 cottages · up to 8 guests" : `${willowUnits.find(unit => unit.selection === cottageSelection)?.name} · up to 4 guests`}</p>
            <nav className={editorialStyles.unitLinks} aria-label="Choose your Willow Peak stay">
              {willowUnits.map(unit => <Link key={unit.slug} href={`/villa/${unit.slug}`} aria-current={unit.slug === propertySlug ? "page" : undefined}><strong>{unit.name}</strong><small>{unit.capacity} guests</small></Link>)}
            </nav>
          </div>
        )}
        <div className={editorialStyles.quickBookingFields}>
          <label className={editorialStyles.quickBookingField}>
            <span>Check-in</span>
            <input type="date" value={quickCheckIn} min={todayInput} onChange={event => updateQuickCheckIn(event.target.value)} aria-label="Check-in date" />
          </label>
          <label className={editorialStyles.quickBookingField}>
            <span>Check-out</span>
            <input type="date" value={quickCheckOut} min={dayAfter(quickCheckIn)} onChange={event => { setQuickCheckOut(event.target.value); setQuickBookingError(""); }} aria-label="Check-out date" />
          </label>
          <label className={`${editorialStyles.quickBookingField} ${editorialStyles.quickBookingGuests}`}>
            <span>Guests</span>
            <span className={editorialStyles.quickGuestSelect}>
              <Users size={16} aria-hidden="true" />
              <select value={Math.max(quickGuestMinimum, Math.min(quickGuestLimit, quickGuests))} onChange={event => { setQuickGuests(Number(event.target.value)); setQuickBookingError(""); }} aria-label="Number of guests">
                {Array.from({ length: quickGuestLimit - quickGuestMinimum + 1 }, (_, index) => index + quickGuestMinimum).map(count => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
              </select>
            </span>
          </label>
        </div>
        {quickBookingError && <p className={editorialStyles.quickBookingError} role="alert">{quickBookingError}</p>}
        <button type="button" className={editorialStyles.primaryButton} onClick={handleOpenBooking}>
          <CalendarIcon size={17} /> Book now <ArrowRight size={16} />
        </button>
        <p className={editorialStyles.bookingRateNote}>Your date-specific rates and availability appear before you send a booking request.</p>
        <p className={editorialStyles.bookingFee}><span aria-hidden="true">✓</span> No platform booking fee</p>
      </div>
      <div className={editorialStyles.mobileBooking} role="group" aria-label="Quick booking">
        <div><small>Ready to check your stay?</small><strong>Live rate after dates</strong></div>
        {isAngleHouse ? (
          <div className={editorialStyles.angleHouseMobileActions}>
            <BorderGlow className={`${editorialStyles.availabilityGlow} ${editorialStyles.mobileAvailabilityGlow}`} backgroundColor="#1b3564" borderRadius={28} glowRadius={18} animated={false}><button type="button" onClick={handleOpenBooking}>Book now <ArrowRight size={17} /></button></BorderGlow>
            <a className={editorialStyles.mobileCallButton} href="tel:+919619042310" aria-label="Call The Angle House booking team at 96190 42310"><Phone size={16} aria-hidden="true" /><span>Call</span></a>
          </div>
        ) : (
          <BorderGlow className={`${editorialStyles.availabilityGlow} ${editorialStyles.mobileAvailabilityGlow}`} backgroundColor="#1b3564" borderRadius={28} glowRadius={18} animated={false}><button type="button" onClick={handleOpenBooking}>Book now <ArrowRight size={17} /></button></BorderGlow>
        )}
      </div>

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
            <div className="bg-[#1B3564] text-white px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10 z-20">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#DAA520] font-black uppercase tracking-widest">
                    Direct booking
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg sm:text-xl leading-tight text-white">
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
              className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-5 bg-slate-50 relative z-10 touch-pan-y"
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
                initialCheckIn={quickCheckIn ? new Date(`${quickCheckIn}T00:00:00`) : null}
                initialCheckOut={quickCheckOut ? new Date(`${quickCheckOut}T00:00:00`) : null}
                initialGuests={Math.max(quickGuestMinimum, Math.min(quickGuestLimit, quickGuests))}
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
