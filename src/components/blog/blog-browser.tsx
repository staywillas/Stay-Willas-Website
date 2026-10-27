"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import { PhotoFrame } from "@/components/ui/site-image";
import styles from "./blog-browser.module.css";

export interface GuideSummary {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  readTime: string;
  topic: string;
}
export interface GuideFilter { id: string; label: string; }

export default function BlogBrowser({ guides, topics, initialTopic = "all" }: {
  guides: GuideSummary[]; topics: GuideFilter[]; initialTopic?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return guides.filter(guide => (topic === "all" || guide.topic === topic) &&
      words.every(word => `${guide.title} ${guide.description}`.toLocaleLowerCase().includes(word)));
  }, [guides, query, topic]);

  return <section className={styles.browser} aria-label="Browse travel guides">
    <div className={styles.controls}>
      <label className={styles.search} htmlFor="guide-search">
        <Search size={19} aria-hidden="true" />
        <input id="guide-search" type="search" value={query} onChange={event => setQuery(event.target.value)}
          placeholder="Search a destination, stay or occasion" />
        {query && <button type="button" aria-label="Clear guide search" onClick={() => setQuery("")}><X size={18} /></button>}
      </label>
      <div className={styles.topics} aria-label="Filter guides by topic">
        {[{id:"all",label:"All guides"}, ...topics].map(filter => <button key={filter.id} type="button"
          aria-pressed={topic === filter.id} onClick={() => setTopic(filter.id)}>
          {filter.label}<span>{filter.id === "all" ? guides.length : guides.filter(guide => guide.topic === filter.id).length}</span>
        </button>)}
      </div>
    </div>
    <div className={styles.resultsBar}>
      <p role="status" aria-live="polite" aria-atomic="true"><strong>{matches.length}</strong> {matches.length === 1 ? "guide" : "guides"}{topic !== "all" && ` · ${topics.find(item => item.id === topic)?.label}`}</p>
      {(query || topic !== "all") && <button type="button" onClick={() => {setQuery("");setTopic("all");}}>Clear filters <X size={14} /></button>}
    </div>
    <div className={styles.grid}>
      {matches.map(guide => <article key={guide.slug} className={styles.card}>
        <Link href={`/blog/${guide.slug}`} className={styles.cardLink}>
          <div className={styles.photo}><PhotoFrame src={guide.image} alt={guide.imageAlt || guide.title} fill
            sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 380px" /></div>
          <div className={styles.copy}>
            <div className={styles.meta}><span>{topics.find(item => item.id === guide.topic)?.label || "Travel guide"}</span><span><Clock size={13} aria-hidden="true" />{guide.readTime}</span></div>
            <h2>{guide.title}</h2><p>{guide.description}</p>
            <span className={styles.read}>Read guide <ArrowRight size={17} aria-hidden="true" /></span>
          </div>
        </Link>
      </article>)}
    </div>
    {!matches.length && <div className={styles.empty}>
      <h2>Let’s find another guide.</h2><p>Try a destination such as Lonavala, or clear your filters.</p>
      <button type="button" onClick={() => {setTopic("all");setQuery("");}}>Show all guides</button>
    </div>}
  </section>;
}
