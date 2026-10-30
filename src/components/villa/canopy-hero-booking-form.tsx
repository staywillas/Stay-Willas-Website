"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { trackCanopyCrestInteraction } from "@/lib/angle-house-measurement";
import styles from "./canopy-hero-booking-form.module.css";

function localDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayAfter(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return localDateValue(date);
}

type HeroBookingRequest = {
  checkIn: string;
  checkOut: string;
  guests: number;
};

export default function CanopyHeroBookingForm() {
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const todayValue = localDateValue(new Date());
    setToday(todayValue);

    const params = new URLSearchParams(window.location.search);
    const queryCheckIn = params.get("checkIn") ?? "";
    const queryCheckOut = params.get("checkOut") ?? "";
    if (queryCheckIn >= todayValue && queryCheckOut > queryCheckIn) {
      setCheckIn(queryCheckIn);
      setCheckOut(queryCheckOut);
    }
  }, []);

  function updateCheckIn(value: string) {
    setCheckIn(value);
    if (checkOut && value && checkOut <= value) setCheckOut(dayAfter(value));
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Choose your check-in and check-out dates.");
      return;
    }
    if (today && checkIn < today) {
      setError("Choose a check-in date from today onward.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be at least one night after check-in.");
      return;
    }

    trackCanopyCrestInteraction("canopy_crest_book_now_click", "hero_date_form");

    const bookingUrl = new URL(window.location.href);
    bookingUrl.searchParams.set("checkIn", checkIn);
    bookingUrl.searchParams.set("checkOut", checkOut);
    bookingUrl.searchParams.set("guests", "2");
    bookingUrl.hash = "booking-card-section";
    window.history.replaceState(window.history.state, "", bookingUrl.toString());

    window.dispatchEvent(
      new CustomEvent<HeroBookingRequest>("staywillas:open-booking", {
        detail: { checkIn, checkOut, guests: 2 },
      }),
    );
  }

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
      <label className={styles.dateField}>
        <span>Check-in</span>
        <input
          type="date"
          value={checkIn}
          min={today || undefined}
          required
          onChange={(event) => updateCheckIn(event.target.value)}
          aria-label="Check-in date"
        />
      </label>
      <label className={styles.dateField}>
        <span>Check-out</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn ? dayAfter(checkIn) : today || undefined}
          required
          onChange={(event) => {
            setCheckOut(event.target.value);
            setError("");
          }}
          aria-label="Check-out date"
        />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.submit} type="submit">
        <CalendarDays size={16} aria-hidden="true" />
        Book now
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </form>
  );
}
