"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bath, BedDouble, SlidersHorizontal, Users, Waves, X } from "lucide-react";
import VillaCard from "@/components/home/villa-card";
import styles from "./villas-browser.module.css";

export type Villa = {
  id: string; slug: string; name: string; location: string; priceRaw: number;
  priceFormatted: string; image: string; bedrooms: number; bathrooms: number;
  guests: number; category: string; amenities: string[];
};
export type VillasBrowserProps = { initialVillas: Villa[]; initialRegion?: string; initialCategory?: string };
type Filters = { region: string; category: string; minPrice: string; maxPrice: string; guests: string; bedrooms: string; amenities: string[] };
const emptyFilters: Filters = { region: "", category: "", minPrice: "", maxPrice: "", guests: "", bedrooms: "", amenities: [] };
const amenities = [
  { label: "Swimming pool", keywords: ["pool", "swimming"], icon: Waves },
  { label: "Jacuzzi", keywords: ["jacuzzi"], icon: Bath },
  { label: "Private chef", keywords: ["chef", "kailash"] },
  { label: "Air conditioning", keywords: ["air conditioning", "air-conditioned", " ac", "ac "] },
  { label: "Wi-Fi", keywords: ["wi-fi", "wifi"] },
  { label: "Mountain view", keywords: ["mountain", "ghat", "valley"] },
  { label: "Waterfront", keywords: ["beachfront", "lake", "riverside"] },
];

function FilterControls({ filters, setFilters, categories, maxGuests, prefix }: {
  filters: Filters; setFilters: (filters: Filters) => void; categories: string[]; maxGuests: number; prefix: string;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters({ ...filters, [key]: value });
  const invalidPrice = filters.minPrice !== "" && filters.maxPrice !== "" && Number(filters.minPrice) > Number(filters.maxPrice);
  return <div className={styles.controls}>
    <label className={styles.field} htmlFor={`${prefix}-destination`}><span>Destination</span><select id={`${prefix}-destination`} value={filters.region} onChange={e => set("region", e.target.value)}><option value="">All destinations</option>{["Lonavala", "Khopoli", "Panchgani"].map(place => <option value={place.toLowerCase()} key={place}>{place}</option>)}</select></label>
    <fieldset><legend>Price per night</legend><div className={styles.priceFields}><label htmlFor={`${prefix}-min-price`}><span>Min ₹</span><input id={`${prefix}-min-price`} type="number" min="0" step="1" placeholder="No minimum" inputMode="numeric" value={filters.minPrice} onChange={e => set("minPrice", e.target.value)} aria-invalid={invalidPrice} /></label><label htmlFor={`${prefix}-max-price`}><span>Max ₹</span><input id={`${prefix}-max-price`} type="number" min="0" step="1" placeholder="No maximum" inputMode="numeric" value={filters.maxPrice} onChange={e => set("maxPrice", e.target.value)} aria-invalid={invalidPrice} /></label></div>{invalidPrice && <p className={styles.filterError} role="alert">Maximum price must be at least the minimum.</p>}</fieldset>
    <label className={styles.field} htmlFor={`${prefix}-guests`}><span><Users size={16} /> Guests</span><select id={`${prefix}-guests`} value={filters.guests} onChange={e => set("guests", e.target.value)}><option value="">Any group size</option>{Array.from({ length: maxGuests }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
    <label className={styles.field} htmlFor={`${prefix}-bedrooms`}><span><BedDouble size={16} /> Bedrooms</span><select id={`${prefix}-bedrooms`} value={filters.bedrooms} onChange={e => set("bedrooms", e.target.value)}><option value="">Any bedrooms</option>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? "bedroom" : "bedrooms"}</option>)}<option value="5">5+ bedrooms</option></select></label>
    <fieldset><legend>Pool & Jacuzzi</legend><div className={styles.checkOptions}>{amenities.slice(0, 2).map(({ label, icon: Icon }) => <label key={label} className={styles.checkOption}><input type="checkbox" checked={filters.amenities.includes(label)} onChange={e => set("amenities", e.target.checked ? [...filters.amenities, label] : filters.amenities.filter(value => value !== label))} />{Icon && <Icon size={19} />}<span>{label}</span></label>)}</div><p className={styles.hint}>Choose both to find stays with both features.</p></fieldset>
    <details className={styles.moreFilters}><summary>More preferences</summary><div className={styles.extraControls}><label className={styles.field} htmlFor={`${prefix}-category`}><span>Stay style</span><select id={`${prefix}-category`} value={filters.category} onChange={e => set("category", e.target.value)}><option value="">All stay styles</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label><div className={styles.checkOptions}>{amenities.slice(2).map(({ label }) => <label className={styles.checkOption} key={label}><input type="checkbox" checked={filters.amenities.includes(label)} onChange={e => set("amenities", e.target.checked ? [...filters.amenities, label] : filters.amenities.filter(value => value !== label))} /><span>{label}</span></label>)}</div></div></details>
  </div>;
}

export default function VillasBrowser({ initialVillas, initialRegion = "", initialCategory = "" }: VillasBrowserProps) {
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, region: initialRegion, category: initialCategory });
  const [sort, setSort] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const categories = [...new Set([...initialVillas.map(villa => villa.category), ...(initialCategory ? [initialCategory] : [])])].sort();
  const maxGuests = Math.max(1, ...initialVillas.map(villa => villa.guests));
  const activeFilters = [
    ...(filters.region ? [{ label: filters.region, clear: () => setFilters({ ...filters, region: "" }) }] : []),
    ...(filters.category ? [{ label: filters.category, clear: () => setFilters({ ...filters, category: "" }) }] : []),
    ...(filters.minPrice !== "" ? [{ label: `From ₹${Number(filters.minPrice).toLocaleString("en-IN")}`, clear: () => setFilters({ ...filters, minPrice: "" }) }] : []),
    ...(filters.maxPrice !== "" ? [{ label: `Up to ₹${Number(filters.maxPrice).toLocaleString("en-IN")}`, clear: () => setFilters({ ...filters, maxPrice: "" }) }] : []),
    ...(filters.guests ? [{ label: `${filters.guests} guests`, clear: () => setFilters({ ...filters, guests: "" }) }] : []),
    ...(filters.bedrooms ? [{ label: `${filters.bedrooms}${filters.bedrooms === "5" ? "+" : ""} bedrooms`, clear: () => setFilters({ ...filters, bedrooms: "" }) }] : []),
    ...filters.amenities.map(amenity => ({ label: amenity, clear: () => setFilters({ ...filters, amenities: filters.amenities.filter(value => value !== amenity) }) })),
  ];

  useEffect(() => {
    if (!isFilterOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [isFilterOpen]);

  const filteredVillas = useMemo(() => {
    const matches = initialVillas.filter(villa => {
      if (filters.region && !villa.location.toLowerCase().includes(filters.region.toLowerCase())) return false;
      if (filters.category && villa.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.minPrice !== "" && villa.priceRaw < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== "" && villa.priceRaw > Number(filters.maxPrice)) return false;
      if (filters.guests && villa.guests < Number(filters.guests)) return false;
      if (filters.bedrooms === "5" ? villa.bedrooms < 5 : filters.bedrooms !== "" && villa.bedrooms !== Number(filters.bedrooms)) return false;
      return filters.amenities.every(selected => {
        const option = amenities.find(amenity => amenity.label === selected);
        return option && villa.amenities.some(amenity => option.keywords.some(keyword => amenity.toLowerCase().includes(keyword)));
      });
    });
    if (sort === "price-low") matches.sort((a, b) => a.priceRaw - b.priceRaw);
    if (sort === "price-high") matches.sort((a, b) => b.priceRaw - a.priceRaw);
    return matches;
  }, [initialVillas, filters, sort]);

  const reset = () => setFilters({ ...emptyFilters });
  const controls = (prefix: string) => <FilterControls filters={filters} setFilters={setFilters} categories={categories} maxGuests={maxGuests} prefix={prefix} />;

  return <div className={styles.browser}>
    <header className={styles.heading}><span>FIND YOUR LITTLE ESCAPE</span><h1>Our villa collection</h1><p>Private pool villas and Jacuzzi cottages in Lonavala, Khopoli and Panchgani. Choose the stay that fits your people.</p></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-label="Filter villas"><div className={styles.sidebarHeading}><h2><SlidersHorizontal size={19} /> Filters</h2><button type="button" onClick={reset} disabled={!activeFilters.length}>Reset all</button></div>{controls("sidebar")}</aside>
      <section className={styles.results} aria-label="Villa results">
        <div className={styles.toolbar}><p role="status" aria-live="polite" aria-atomic="true"><strong>{filteredVillas.length}</strong> of {initialVillas.length} stays</p><div className={styles.toolbarActions}><button type="button" className={styles.filterButton} onClick={() => setIsFilterOpen(true)} aria-haspopup="dialog"><SlidersHorizontal size={17} /> Filters{activeFilters.length > 0 && <span>{activeFilters.length}</span>}</button><label className={styles.sort}><span>Sort</span><select aria-label="Sort villas" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div>
        {activeFilters.length > 0 && <div className={styles.activeFilters} aria-label="Active filters">{activeFilters.map(filter => <button key={filter.label} type="button" onClick={filter.clear} aria-label={`Remove ${filter.label} filter`}>{filter.label}<X size={14} /></button>)}<button className={styles.clearAll} type="button" onClick={reset}>Clear all</button></div>}
        <div className={styles.grid}>{filteredVillas.map(villa => <div key={villa.id} data-villa-slug={villa.slug}><VillaCard id={villa.slug} name={villa.name} location={villa.location} image={villa.image} price={villa.priceFormatted} guests={villa.guests} bedrooms={villa.bedrooms} bathrooms={villa.bathrooms} className="h-full" /></div>)}</div>
        {filteredVillas.length === 0 && <div className={styles.empty}><Waves size={32} /><h2>Let’s find another little escape.</h2><p>No stays match this combination. Try another budget, group size or feature.</p><button type="button" onClick={reset}>Clear filters & see all stays</button></div>}
        <p className={styles.rateNote}>Rates shown are starting prices. Dates, taxes and extras may change your final quote. Willow Peak cottage listings are priced per cottage; the full-estate listing has its own rate.</p>
      </section>
    </div>
    <dialog ref={dialogRef} className={styles.filterDialog} data-lenis-prevent aria-labelledby="mobile-filter-title" onCancel={() => setIsFilterOpen(false)} onClick={event => { if (event.target === event.currentTarget) setIsFilterOpen(false); }}>
      <div className={styles.dialogContent}><div className={styles.dialogHeader}><h2 id="mobile-filter-title"><SlidersHorizontal size={21} /> Find your stay</h2><button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Close filters"><X size={22} /></button></div><div className={styles.dialogBody}>{controls("mobile")}</div><div className={styles.dialogFooter}><button type="button" onClick={reset} disabled={!activeFilters.length}>Reset all</button><button type="button" onClick={() => setIsFilterOpen(false)}>Show {filteredVillas.length} {filteredVillas.length === 1 ? "stay" : "stays"}</button></div></div>
    </dialog>
  </div>;
}
