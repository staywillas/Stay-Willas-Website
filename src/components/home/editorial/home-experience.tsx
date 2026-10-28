"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { PhotoFrame } from "@/components/ui/site-image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BedDouble, Check, Leaf, LoaderCircle, Search, Users } from "lucide-react";
import { checkAvailableVillasForDates } from "@/app/actions/booking";
import WeekdayCarousel from "./weekday-carousel";
import styles from "./home.module.css";

type Villa = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  guests: number;
  baseGuests?: number;
  extraGuestFee?: number;
  bedrooms: number;
  image?: string;
  totalPrice?: number;
  roomSubtotal?: number;
  directSavings?: number;
  extraGuests?: number;
  extraGuestTotal?: number;
  cottagesCount?: number;
  nightlyRates?: Array<{ date: string; label: string; price: number }>;
};
const photos: Record<string, string> = {
  "the-angle-house": "/images/angle-house-hero-clean.webp",
  "canopy-crest": "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
  "casa-de-reva": "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg",
};
const whatsapp = "https://wa.me/919619042310";

export default function HomeExperience({ villas, children }: { villas: Villa[]; children: ReactNode }) {
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
      setResults(result.villas.filter(villa =>
        villa.guests >= guestCount && (villa.slug !== "willow-peak" || guestCount > 4),
      ));
      setSearchedWithDates(Boolean(arrival));
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch { setError("We couldn’t connect. Please try again."); }
    finally { setPending(false); }
  }

  return <main className={styles.page} data-lenis-prevent>


    <section className={styles.hero} aria-label="Find your next villa escape">
      <div className={styles.heroVisual}>
        <PhotoFrame src="/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg" alt="Canopy Crest villa and its private pool at twilight in Khopoli" fill sizes="100vw" preload className={styles.heroImage} />
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>PRIVATE HOMES. PERSONAL MOMENTS.</span>
        <h1><span className={styles.heroTitleLine}>A slower kind</span>{" "}<span className={styles.heroTitleLine}>of <em>escape.</em></span></h1>
        <p>Beautiful villas. Your favourite people. Nothing else on the agenda.</p>
        <form className={styles.searchBar} data-home-search-form onSubmit={search}>
          <label className={styles.locationField}><span>Where to?</span><select name="destination" aria-label="Destination" value={location} onChange={e => setLocation(e.target.value)}><option value="all">All destinations</option><option>Lonavala</option><option>Khopoli</option><option>Panchgani</option></select></label>
          <label><span>Check in</span><input name="checkIn" aria-label="Check in" type="date" min={today} value={checkIn} onChange={e => {setCheckIn(e.target.value); if(checkOut && checkOut <= e.target.value) setCheckOut("");}} /></label>
          <label><span>Check out</span><input name="checkOut" aria-label="Check out" type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} /></label>
          <label className={styles.guestField}><span>Your people</span><select name="guests" aria-label="Guests" value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({length:16},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
          <button className={styles.searchButton} type="submit" disabled={pending} aria-label="Search villas">{pending ? <LoaderCircle className={styles.spinner} size={22} /> : <Search size={22} />}<span>Find my escape</span></button>
        </form>
        {error && <p role="alert" className={styles.searchError}>{error}</p>}
        <div className={styles.heroNote}><span><Check size={13} /> Book direct, with no platform fee</span><span><Leaf size={13} /> Handpicked homes in Maharashtra</span></div>
        <Link
          href="/slatewood"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#f5df9e] border border-amber-300/30 text-xs font-medium backdrop-blur-md transition-all shadow-lg hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-[#daa520] shrink-0 animate-pulse" />
          <span>New Property Announcement: <strong>Slatewood</strong> with Pool &amp; Turf — Coming Soon &rarr;</span>
        </Link>
      </div>
      <div className={styles.heroBottom}><a href="#slow-days">A little inspiration <ArrowDown size={15} /></a><Link href="/villa/canopy-crest">Canopy Crest · Khopoli <ArrowUpRight size={14} /></Link></div>
    </section>

    <WeekdayCarousel />

    <section className={styles.introduction} aria-labelledby="intro-title">
      <span className={styles.eyebrow}>STAY · RELAX · REPEAT</span>
      <h2 id="intro-title">A private home.<br /><em>A weekend that feels like you.</em></h2>
      <p>Discover handpicked pool villas and Jacuzzi cottages near Mumbai and Pune. From Lonavala and Khopoli to the hills of Panchgani, find a little more space for the people you love.</p>
      <nav className={styles.quickLinks} aria-label="Explore this page">
        <Link
          href="/slatewood"
          style={{ borderColor: "#daa520", background: "#fffdf5", fontWeight: 600, color: "#1b3564" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#daa520] inline-block mr-1.5" /> Slatewood (Coming Soon)
        </Link>
        <a href="#jacuzzi-villas">Jacuzzi stays <ArrowDown size={14} /></a>
        <a href="#pool-villas">Private pool villas <ArrowDown size={14} /></a>
        <a href="#destinations">Destinations <ArrowDown size={14} /></a>
        <a href="#partner">Partner with us <ArrowDown size={14} /></a>
      </nav>
    </section>

    <section ref={resultsRef} id="stays" className={styles.staysSection} aria-labelledby="stays-title">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>{results ? "YOUR NEXT GETAWAY" : "THE STAY WILLAS COLLECTION"}</span><h2 id="stays-title">{results ? "Stays for your people" : "Some places just feel different."}</h2><p>{results ? `${results.length} ${results.length === 1 ? "stay matches" : "stays match"} your search${searchedWithDates ? " and dates" : ""}.` : "Private pools, hillside mornings and homes with a little soul."}</p>{results && searchedWithDates && <p className={styles.searchSummary}>{checkIn} – {checkOut} · {guests} {Number(guests) === 1 ? "guest" : "guests"} · Live date-specific rates</p>}</div><div className={styles.collectionActions}>{results && <button onClick={()=>setResults(null)}>Reset search</button>}<Link href="/villas">Explore all stays <ArrowUpRight size={18} /></Link></div></div>
      <div className={styles.villaGrid}>{(results ?? villas).map(villa => {
        const query = new URLSearchParams();
        if (searchedWithDates) {
          query.set("checkIn", checkIn);
          query.set("checkOut", checkOut);
          query.set("guests", guests);
          if (villa.slug === "willow-peak") query.set("cottageSelection", villa.cottagesCount === 2 ? "TWO" : "ALL");
        }
        const searchQuery = searchedWithDates ? `?${query.toString()}` : "";
        const bookingAnchor = searchedWithDates ? "#booking-card-section" : "";
        const stayName = villa.slug === "willow-peak" && villa.cottagesCount === 2
          ? "Willow Peak · 2 cottages"
          : villa.slug === "willow-peak" ? "Willow Peak · Entire estate" : villa.name;
        const stayCapacity = villa.slug === "willow-peak" && villa.cottagesCount
          ? villa.cottagesCount * 4
          : villa.guests;
        return <Link href={`/villa/${villa.slug}${searchQuery}${bookingAnchor}`} className={styles.villaCard} key={villa.id}>
          <div className={styles.villaPhoto}><PhotoFrame src={photos[villa.slug] || (villa.slug.includes("willow-peak") ? "/assets/villas/willow-peak/graded-v1/wp-07.webp" : villa.image || "/images/angle-house-hero-clean.webp")} alt={`${villa.name} exterior`} fill sizes="(max-width: 600px) 85vw, (max-width: 1000px) 45vw, 25vw" className={styles.cover} /><span className={styles.photoType}>{villa.slug.includes("willow") ? "Jacuzzi cottage" : "Private pool villa"}</span><span className={styles.cardArrow}><ArrowUpRight size={18} /></span></div>
          <div className={styles.villaInfo}><span className={styles.villaLocation}>{villa.location}</span><h3>{villa.slug === "willow-peak-cottage-c" ? "Heaven at Willow Peak" : stayName}</h3><div className={styles.villaSpecs}><span><Users size={14} /> up to {stayCapacity} guests</span><span><BedDouble size={14} /> {villa.bedrooms} {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}</span></div>
            {villa.nightlyRates?.length ? <>
              <div className={styles.stayRateTotal}><strong>₹{villa.totalPrice?.toLocaleString("en-IN")}</strong><span>live stay total · {villa.nightlyRates.length} {villa.nightlyRates.length === 1 ? "night" : "nights"}</span></div>
              <p className={styles.stayRateAverage}>₹{villa.price.toLocaleString("en-IN")} average per night{villa.slug.includes("cottage") ? " · per cottage" : ""}</p>
              <div className={styles.stayRateBreakdown}>
                {villa.nightlyRates.map(night => <div key={night.date}><span>{new Date(`${night.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span><span>{night.label}</span><strong>₹{night.price.toLocaleString("en-IN")}</strong></div>)}
              </div>
              {villa.extraGuests && villa.extraGuestTotal ? <p className={styles.guestFeeNote}>{villa.extraGuests} extra {villa.extraGuests === 1 ? "guest" : "guests"} × ₹{villa.extraGuestFee?.toLocaleString("en-IN")}/night · ₹{villa.extraGuestTotal.toLocaleString("en-IN")}</p> : null}
              <p className={styles.ratePolicyNote}>{villa.baseGuests ?? villa.guests} guests included · {villa.extraGuestFee ? `₹${villa.extraGuestFee.toLocaleString("en-IN")} per extra guest/night` : "no extra guest fee"}</p>
              {!!villa.directSavings && <p className={styles.savingsNote}>Direct savings included · −₹{villa.directSavings.toLocaleString("en-IN")}</p>}
              <p className={styles.ratePolicyNote}>Live date-specific rates · select an eligible offer in the booking panel</p>
            </> : <p><strong>₹{villa.price.toLocaleString("en-IN")}</strong><span> / night{villa.slug.includes("cottage") ? " · per cottage" : ""}</span></p>}
          </div>
        </Link>;
      })}</div>
      {results?.length === 0 && <div className={styles.emptyState}><h3>Let’s find another little escape.</h3><p>Try different dates, a smaller group or another destination.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer">Ask our concierge <ArrowUpRight size={15} /></a></div>}
    </section>

    {children}
  </main>;
}
