"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BedDouble, Check, Leaf, LoaderCircle, Search, Users } from "lucide-react";
import { checkAvailableVillasForDates } from "@/app/actions/booking";
import ColorTheoryNavigation from "./navigation";
import WeekdayCarousel from "./weekday-carousel";
import styles from "./preview.module.css";

type Villa = { id: string; slug: string; name: string; location: string; price: number; guests: number; bedrooms: number; image?: string };
const photos: Record<string, string> = {
  "the-angle-house": "/images/angle-house-hero-clean.webp",
  "canopy-crest": "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
  "casa-de-reva": "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
};
const whatsapp = "https://wa.me/919619042310";

export default function ColorTheoryPreview({ villas, children }: { villas: Villa[]; children: ReactNode }) {
  const [location, setLocation] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Villa[] | null>(null);
  const [searchedWithDates, setSearchedWithDates] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const arrival = String(fields.get("checkIn") || "");
    const departure = String(fields.get("checkOut") || "");
    const destination = String(fields.get("destination") || "all");
    const guestCount = Number(fields.get("guests") || 2);
    if (!!arrival !== !!departure || (arrival && departure <= arrival)) {
      setError("Choose a check-in and a later check-out date."); return;
    }
    setError(""); setPending(true);
    try {
      const result = await checkAvailableVillasForDates({ destination, checkIn: arrival || undefined, checkOut: departure || undefined, guests: guestCount });
      if (!result.success || !result.villas) { setError("We couldn’t check those dates. Please try again."); return; }
      setResults(result.villas.filter(villa => villa.guests >= guestCount));
      setSearchedWithDates(Boolean(arrival));
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch { setError("We couldn’t connect. Please try again."); }
    finally { setPending(false); }
  }

  return <main className={styles.page} data-lenis-prevent>
    <ColorTheoryNavigation />

    <section className={styles.hero} aria-label="Find your next villa escape">
      <div className={styles.heroVisual}>
        <Image src="/assets/villas/terra-cotta-villa/IMG-20260901-WA0037.jpg" alt="Casa De Reva's private pool and hillside villa in Panchgani" fill sizes="100vw" preload className={styles.heroImage} />
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>PRIVATE HOMES. PERSONAL MOMENTS.</span>
        <h1><span className={styles.heroTitleLine}>A slower kind</span>{" "}<span className={styles.heroTitleLine}>of <em>escape.</em></span></h1>
        <p>Beautiful villas. Your favourite people. Nothing else on the agenda.</p>
        <form className={styles.searchBar} onSubmit={search}>
          <label className={styles.locationField}><span>Where to?</span><select name="destination" aria-label="Destination" value={location} onChange={e => setLocation(e.target.value)}><option value="all">All destinations</option><option>Lonavala</option><option>Khopoli</option><option>Panchgani</option></select></label>
          <label><span>Check in</span><input name="checkIn" aria-label="Check in" type="date" min={today} value={checkIn} onChange={e => {setCheckIn(e.target.value); if(checkOut && checkOut <= e.target.value) setCheckOut("");}} /></label>
          <label><span>Check out</span><input name="checkOut" aria-label="Check out" type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
          <label className={styles.guestField}><span>Your people</span><select name="guests" aria-label="Guests" value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({length:16},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
          <button className={styles.searchButton} type="submit" disabled={pending} aria-label="Search villas">{pending ? <LoaderCircle className={styles.spinner} size={22} /> : <Search size={22} />}<span>Find my escape</span></button>
        </form>
        {error && <p role="alert" className={styles.searchError}>{error}</p>}
        <div className={styles.heroNote}><span><Check size={13} /> Book direct, with no platform fee</span><span><Leaf size={13} /> Handpicked homes in Maharashtra</span></div>
      </div>
      <div className={styles.heroBottom}><a href="#slow-days">A little inspiration <ArrowDown size={15} /></a><Link href="/villa/casa-de-reva">Casa De Reva · Panchgani <ArrowUpRight size={14} /></Link></div>
    </section>

    <WeekdayCarousel />

    <section className={styles.introduction} aria-labelledby="intro-title">
      <span className={styles.eyebrow}>STAY · RELAX · REPEAT</span>
      <h2 id="intro-title">A private home.<br /><em>A weekend that feels like you.</em></h2>
      <p>Discover handpicked pool villas and Jacuzzi cottages near Mumbai and Pune. From Lonavala and Khopoli to the hills of Panchgani, find a little more space for the people you love.</p>
      <nav className={styles.quickLinks} aria-label="Explore this page">
        <a href="#jacuzzi-villas">Jacuzzi stays <ArrowDown size={14} /></a>
        <a href="#pool-villas">Private pool villas <ArrowDown size={14} /></a>
        <a href="#destinations">Destinations <ArrowDown size={14} /></a>
        <a href="#partner">Partner with us <ArrowDown size={14} /></a>
      </nav>
    </section>

    <section ref={resultsRef} id="stays" className={styles.staysSection} aria-labelledby="stays-title">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>{results ? "YOUR NEXT GETAWAY" : "THE STAY WILLAS COLLECTION"}</span><h2 id="stays-title">{results ? "Stays for your people" : "Some places just feel different."}</h2><p>{results ? `${results.length} ${results.length === 1 ? "stay matches" : "stays match"} your search${searchedWithDates ? " and dates" : ""}.` : "Private pools, hillside mornings and homes with a little soul."}</p></div><div className={styles.collectionActions}>{results && <button onClick={()=>setResults(null)}>Reset search</button>}<Link href="/villas">Explore all stays <ArrowUpRight size={18} /></Link></div></div>
      <div className={styles.villaGrid}>{(results ?? villas).map(villa => <Link href={`/villa/${villa.slug}`} className={styles.villaCard} key={villa.id}>
        <div className={styles.villaPhoto}><Image src={photos[villa.slug] || (villa.slug.includes("willow-peak") ? "/assets/villas/willow-peak/wp-07.webp" : villa.image || "/images/angle-house-hero-clean.webp")} alt={`${villa.name} exterior`} fill sizes="(max-width: 600px) 85vw, (max-width: 1000px) 45vw, 25vw" className={styles.cover} /><span>{villa.slug.includes("willow") ? "Jacuzzi cottage" : "Private pool villa"}</span><span className={styles.cardArrow}><ArrowUpRight size={18} /></span></div>
        <div className={styles.villaInfo}><span className={styles.villaLocation}>{villa.location}</span><h3>{villa.slug === "willow-peak-cottage-c" ? "Heaven at Willow Peak" : villa.name}</h3><div className={styles.villaSpecs}><span><Users size={14} /> {villa.guests} guests</span><span><BedDouble size={14} /> {villa.bedrooms} {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}</span></div><p><strong>₹{villa.price.toLocaleString("en-IN")}</strong><span> / night{villa.slug.includes("cottage") ? " · per cottage" : ""}</span></p></div>
      </Link>)}</div>
      {results?.length === 0 && <div className={styles.emptyState}><h3>Let’s find another little escape.</h3><p>Try different dates, a smaller group or another destination.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer">Ask our concierge <ArrowUpRight size={15} /></a></div>}
    </section>

    {children}
  </main>;
}
