"use client";

import { useRef, useState } from "react";
import { PhotoFrame } from "@/components/ui/site-image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./kamshet-guide.module.css";

const slides = [
  {
    src: "/assets/villas/the-angle-house/gallery-11.webp",
    alt: "The Angle House glass facade and balcony at dusk",
    caption: "The glass-fronted home, at dusk",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-13.webp",
    alt: "The Angle House private swimming pool and waterfall feature",
    caption: "A private waterfall pool",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-14.webp",
    alt: "Sofa seating and staircase in The Angle House living lounge",
    caption: "A lounge for the whole group",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-9.webp",
    alt: "Bedroom at The Angle House with a double bed and glass doors",
    caption: "A quiet bedroom retreat",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-12.webp",
    alt: "The Angle House courtyard with garden planting",
    caption: "A green corner outside",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-1.webp",
    alt: "The Angle House exterior beside its private pool",
    caption: "Home and pool in one view",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-7.webp",
    alt: "Outdoor deck and seating at The Angle House",
    caption: "Time outside, between plans",
  },
  {
    src: "/assets/villas/the-angle-house/gallery-16.webp",
    alt: "Indoor dining space at The Angle House",
    caption: "Gather around the table",
  },
];

export default function KamshetAngleHouseCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: reduceMotion ? "instant" : "smooth",
    });
    setActiveIndex(nextIndex);
  }

  function onTrackScroll() {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  }

  return (
    <section className={styles.gallery} aria-label="The Angle House photo gallery">
      <div
        ref={trackRef}
        className={styles.galleryTrack}
        role="group"
        aria-label="The Angle House photos"
        aria-roledescription="carousel"
        tabIndex={0}
        onScroll={onTrackScroll}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(activeIndex + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(activeIndex - 1);
          }
        }}
      >
        {slides.map((slide, index) => (
          <figure
            className={styles.gallerySlide}
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.caption}`}
          >
            <PhotoFrame
              src={slide.src}
              alt={slide.alt}
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={78}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className={styles.galleryImage}
            />
            <figcaption className={styles.galleryCaption}>{slide.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.galleryControls}>
        <p className={styles.galleryCount} aria-live="polite" aria-atomic="true">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className={styles.galleryDivider}>/</span>
          {String(slides.length).padStart(2, "0")}
        </p>
        <div className={styles.galleryDots} aria-label="Choose a photo">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`${styles.galleryDot} ${activeIndex === index ? styles.galleryDotActive : ""}`}
              aria-label={`Show photo ${index + 1}: ${slide.caption}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <div className={styles.galleryArrows}>
          <button
            type="button"
            className={styles.galleryArrow}
            aria-label="Previous Angle House photo"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.galleryArrow}
            aria-label="Next Angle House photo"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
          >
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
      <span className="sr-only">Swipe or use the arrow controls to view all eight Angle House photos.</span>
    </section>
  );
}
