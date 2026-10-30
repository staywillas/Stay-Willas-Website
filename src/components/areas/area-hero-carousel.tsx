"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "@/components/ui/site-image";
import styles from "./area-hero-carousel.module.css";

type AreaHeroImage = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
};

export default function AreaHeroCarousel({
  items,
  locationCaption,
}: {
  items: AreaHeroImage[];
  locationCaption: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!items.length) return null;

  const activeItem = items[activeIndex];
  const previousIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;

  return (
    <figure className={styles.carousel} aria-label="Villa photos">
      <div className={styles.frame}>
        <Image
          key={activeItem.src}
          src={activeItem.src}
          alt={activeItem.alt}
          fill
          sizes="(max-width: 700px) 92vw, (max-width: 1000px) 88vw, 54vw"
          quality={75}
          loading="eager"
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          className={styles.image}
        />
      </div>

      <figcaption className={styles.captionBar}>
        <span className={styles.caption}>
          <strong>{activeItem.title}</strong>
          <span>{activeItem.subtitle}</span>
        </span>
        <span className={styles.location}>
          <MapPin size={14} aria-hidden="true" />
          {locationCaption}
        </span>
        {items.length > 1 && (
          <div className={styles.controls} aria-label="Photo controls">
            <span className={styles.counter} aria-live="polite">
              {activeIndex + 1}
              <span aria-hidden="true"> / {items.length}</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveIndex(previousIndex)}
              aria-label={`Previous photo: ${items[previousIndex].title}`}
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(nextIndex)}
              aria-label={`Next photo: ${items[nextIndex].title}`}
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </div>
        )}
      </figcaption>
    </figure>
  );
}
