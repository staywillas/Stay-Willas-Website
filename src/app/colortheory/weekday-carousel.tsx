"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import styles from "./preview.module.css";

const stays = [
  {
    name: "Canopy Crest",
    slug: "canopy-crest",
    location: "Khopoli",
    image: "/assets/villas/canopy-crest/canopy-crest-sunset-guests.jpg",
    alt: "Guests enjoying the golden hour sunset on the lawn at Canopy Crest in Khopoli",
    feature: "Golden hour on the lawn",
  },
  {
    name: "The Angle House",
    slug: "the-angle-house",
    location: "Kamshet, Lonavala",
    image: "/assets/villas/the-angle-house/angle-house-pool-balcony-guests.jpg",
    alt: "Guests on the upper balcony and friends playing in the private pool at The Angle House",
    feature: "Private pool & balcony views",
  },
];

export default function WeekdayCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  function goTo(next: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  async function copyOffer() {
    try { await navigator.clipboard.writeText("Stayw26"); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }

  return <section id="slow-days" className={styles.offerSection} aria-labelledby="offer-title">
    <div className={styles.offerPanel}>
      <div className={styles.offerCarousel} role="region" aria-roledescription="carousel" aria-label="Featured weekday getaways">
        <div ref={trackRef} className={styles.offerTrack} onScroll={event => { const track = event.currentTarget; setIndex(Math.max(0, Math.min(stays.length - 1, Math.round(track.scrollLeft / track.clientWidth)))); }}>
          {stays.map((stay, position) => <div key={stay.slug} className={styles.offerSlide} role="group" aria-roledescription="slide" aria-label={`${position + 1} of ${stays.length}: ${stay.name}`} aria-hidden={position !== index}>
            <Link href={`/villa/${stay.slug}`} prefetch={false} className={styles.offerPhoto} tabIndex={position === index ? 0 : -1} aria-label={`Explore ${stay.name}`}>
              <Image src={stay.image} alt={stay.alt} fill sizes="(max-width: 760px) 90vw, 700px" className={styles.cover} />
              <div className={styles.photoCaption}><span>{stay.name}</span><span>{stay.location} <ArrowUpRight size={16} /></span></div>
              <span className={styles.photoTag}>{stay.feature}</span>
            </Link>
          </div>)}
        </div>
        <div className={styles.carouselControls}>
          <button onClick={() => goTo((index + stays.length - 1) % stays.length)} aria-label="Previous property"><ArrowLeft size={16} /></button>
          <div className={styles.carouselPages}>{stays.map((stay, position) => <button key={stay.slug} onClick={() => goTo(position)} aria-label={`Show ${stay.name}`} aria-current={position === index ? "true" : undefined}><span /></button>)}</div>
          <button onClick={() => goTo((index + 1) % stays.length)} aria-label="Next property"><ArrowRight size={16} /></button>
        </div>
        <span className={styles.carouselStatus} aria-live="polite" aria-atomic="true">{stays[index].name}, {index + 1} of {stays.length}</span>
      </div>
      <div className={styles.offerCopy}>
        <Image src="/images/stay-willas-emblem.webp" alt="Stay Willas" width={42} height={42} className={styles.offerLogo} />
        <span className={styles.eyebrow}>THE WEEKDAY EDIT</span>
        <h2 id="offer-title">More time together.<br /><em>A little less rush.</em></h2>
        <p>Your kind of getaway, at your own pace.<br />Enjoy 26% off your Monday–Thursday stay.</p>
        <button className={styles.coupon} onClick={copyOffer}><span>{copied ? "COPIED" : "USE CODE"} <strong>Stayw26</strong></span>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
        {copyError && <small role="status">Use code Stayw26 when booking.</small>}
        <Link href="/villas" prefetch={false} className={styles.primaryButton}>Explore weekday stays <ArrowRight size={17} /></Link>
        <small>Final rates and inclusions depend on your dates.</small>
      </div>
    </div>
  </section>;
}
