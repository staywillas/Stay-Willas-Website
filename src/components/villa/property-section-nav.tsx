"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./property-editorial.module.css";

const sections = [
  { href: "#about", label: "Overview" },
  { href: "#spaces", label: "Rooms & spaces" },
  { href: "#amenities", label: "Amenities" },
  { href: "#dining", label: "Dining" },
  { href: "#location", label: "Location" },
  { href: "#reviews", label: "Guest reviews" },
  { href: "#know", label: "Good to know" },
];

export default function PropertySectionNav({ propertyName }: { propertyName: string }) {
  const linksRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const links = linksRef.current;
    if (!links) return;
    setCanScrollLeft(links.scrollLeft > 1);
    setCanScrollRight(links.scrollLeft + links.clientWidth < links.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const links = linksRef.current;
    if (!links) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(links);
    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollLinks = (direction: -1 | 1) => {
    const links = linksRef.current;
    if (!links) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    links.scrollBy({ left: direction * Math.max(150, links.clientWidth * 0.65), behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <nav className={styles.sectionNav} aria-label={`Explore ${propertyName} sections`}>
      <button
        type="button"
        className={styles.sectionNavArrow}
        aria-label="Scroll sections left"
        aria-controls="villa-section-links"
        disabled={!canScrollLeft}
        onClick={() => scrollLinks(-1)}
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </button>
      <div
        id="villa-section-links"
        ref={linksRef}
        className={styles.sectionNavLinks}
        onScroll={updateScrollState}
      >
        {sections.map(section => <a key={section.href} href={section.href}>{section.label}</a>)}
      </div>
      <button
        type="button"
        className={styles.sectionNavArrow}
        aria-label="Scroll sections right"
        aria-controls="villa-section-links"
        disabled={!canScrollRight}
        onClick={() => scrollLinks(1)}
      >
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
}
