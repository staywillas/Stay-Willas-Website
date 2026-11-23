"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ZoomIn,
 } from "lucide-react";
import Image from "@/components/ui/site-image";
import { captureBookingLead } from "@/app/actions/inquiry";
import { trackCanopyCrestAdsLandingLead } from "@/lib/angle-house-measurement";
import type { LeadAttribution } from "@/lib/angle-house-measurement";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";
import { nieevantPhotos } from "@/data/nieevant-images";
import styles from "./khopoli-ads-lead-page.module.css";

type VillaPhoto = { src: string; alt: string; caption: string };
type VillaOption = {
  slug: string;
  name: string;
  locationLabel: string;
  description: string;
  facts: string[];
  photos: VillaPhoto[];
};

const propertyOptions: VillaOption[] = [
  {
    slug: "canopy-crest",
    name: "Canopy Crest",
    locationLabel: "KHOPOLI · PRIVATE POOL VILLA",
    description: "A group-friendly stay with a private pool, open lawn and room to gather.",
    facts: ["4 bedrooms", "Up to 16 guests", "Private pool"],
    photos: [canopyCrestPhotos.hero, canopyCrestPhotos.poolDay, canopyCrestPhotos.livingDining],
  },
  {
    slug: "nieevant-by-stay-willas",
    name: "Nieevant by Stay Willas",
    locationLabel: "KHOPOLI · HILLTOP VILLA",
    description: "A hilltop setting with open valley views, a private pool and outdoor space.",
    facts: ["3 bedrooms", "Up to 15 guests", "Private pool"],
    photos: [nieevantPhotos.hero, nieevantPhotos.bedroomOne, nieevantPhotos.grounds],
  },
];

const khopoliAmenities = [
  "Private swimming pools",
  "Three and four bedroom villas",
  "Space for up to 16 guests",
  "Outdoor spaces to unwind",
  "Hilltop and valley views",
  "Wi-Fi and private parking",
];

const groupSizes = ["1–4 guests", "5–8 guests", "9–12 guests", "13–16 guests"];

function getAdAttribution(): LeadAttribution {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    gclid: params.get("gclid") || undefined,
    gbraid: params.get("gbraid") || undefined,
    wbraid: params.get("wbraid") || undefined,
    landingPath: window.location.pathname,
  };
}

function PhotoStrip({
  propertyName,
  propertySlug,
  photos,
  onOpen,
}: {
  propertyName: string;
  propertySlug: string;
  photos: VillaPhoto[];
  onOpen: (propertySlug: string, index: number) => void;
}) {
  return (
    <div
      className={`${styles.galleryTrack} ${styles.propertyGalleryTrack}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${propertyName} photos. Scroll horizontally to see more.`}
    >
      {photos.map((item, index) => (
        <button
          type="button"
          className={styles.galleryCard}
          key={item.src}
          aria-label={`Enlarge photo: ${item.caption}`}
          onClick={() => onOpen(propertySlug, index)}
        >
          <span className={styles.galleryImageFrame}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 760px) 82vw, 410px"
              unoptimized
              loading="lazy"
              className={styles.photo}
            />
            <span className={styles.photoCaption}>{item.caption}</span>
          </span>
          <span className={styles.zoomHint}><ZoomIn size={14} aria-hidden="true" /> Tap to enlarge</span>
        </button>
      ))}
    </div>
  );
}

export default function KhopoliAdsLeadPage() {
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ propertySlug: string; index: number } | null>(null);
  
  const [groupSize, setGroupSize] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);


  const enlargedProperty = enlargedPhoto
    ? propertyOptions.find((property) => property.slug === enlargedPhoto.propertySlug)
    : undefined;
  const activePhoto = enlargedProperty?.photos[enlargedPhoto?.index ?? 0];

  
  useEffect(() => {
    if (!enlargedPhoto || !enlargedProperty) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();
    const photoCount = enlargedProperty.photos.length;

    function handleLightboxKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEnlargedPhoto(null);
      } else if (event.key === "ArrowRight") {
        setEnlargedPhoto((current) => current === null
          ? current
          : { ...current, index: (current.index + 1) % photoCount });
      } else if (event.key === "ArrowLeft") {
        setEnlargedPhoto((current) => current === null
          ? current
          : { ...current, index: (current.index - 1 + photoCount) % photoCount });
      }
    }

    window.addEventListener("keydown", handleLightboxKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleLightboxKeys);
    };
  }, [enlargedPhoto, enlargedProperty]);

    
  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const phoneDigits = phone.replace(/\D/g, "");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (phoneDigits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!groupSize) {
      setError("Please select the number of guests.");
      return;
    }

    setIsSubmitting(true);

    const message = `Khopoli villa enquiry. Number of guests: ${groupSize}.`;

    try {
      const result = await captureBookingLead({
        name: name.trim(),
        phone: `+91 ${phoneDigits}`,
        villaName: "Khopoli villas (Canopy Crest and Nieevant)",
        guests: groupSize,
        message,
        attribution: getAdAttribution(),
      });

      if (!result.success || !result.leadId) {
        throw new Error(result.error || "We could not send your request.");
      }

      trackCanopyCrestAdsLandingLead(result.leadId);
      setSubmitted(true);
    } catch {
      setError("We could not send your request just now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }


    return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="khopoli-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>TWO PRIVATE VILLAS IN KHOPOLI</p>
            <h1 id="khopoli-title">Villas in Khopoli</h1>
            <p className={styles.heroDescription}>
              Share a few details. Our team will help you choose between Canopy Crest and Nieevant.
            </p>
            <div className={styles.heroFacts}>
              <span><Check size={15} aria-hidden="true" /> Private pools</span>
              <span><Check size={15} aria-hidden="true" /> Three or four bedrooms</span>
              <span><Check size={15} aria-hidden="true" /> Up to 16 guests</span>
            </div>
          </div>

          <section
            className={styles.planner}
            id="stay-planner"
            aria-labelledby="planner-title"
          >
            {!submitted ? (
              <div className={styles.stepCard}>
                <h2
                  id="planner-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className={styles.stepTitle}
                >
                  Plan Your Khopoli Stay
                </h2>

                <form className={styles.contactForm} onSubmit={submitLead}>
                  <label className={styles.field}>
                    <span>Name</span>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(event) => {
  setName(event.target.value);
  setError("");
}}
                      placeholder="Enter your name"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Phone Number</span>
                    <span className={styles.phoneField}>
                      <span aria-hidden="true">+91</span>
                      <input
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(event) => {
  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
  setError("");
}}
                        placeholder="10-digit mobile number"
                      />
                    </span>
                  </label>

                  <label className={styles.field}>
                    <span>Number of Guests</span>
                    <select
                      required
                      value={groupSize}
                      onChange={(event) => {
                        setGroupSize(event.target.value);
                        setError("");
                      }}
                    >
                      <option value="" disabled>
                        Select number of guests
                      </option>
                      {groupSizes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  {error && <p className={styles.error} role="alert">{error}</p>}

                  <div className={styles.formActions}>
                    <button
                      className={styles.submitButton}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending your request…" : "Submit Enquiry"}
                      {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
                    </button>
                  </div>
                </form>
              </div>
          ) : (
            <div className={styles.successCard} role="status" aria-live="polite">
              <span className={styles.successIcon}><Check size={24} aria-hidden="true" /></span>
              <p className={styles.eyebrow}>REQUEST RECEIVED</p>
              <h2 id="planner-title" ref={headingRef} tabIndex={-1}>Thanks, {name || "we have your request"}.</h2>
              <p>Our team will contact you about the Khopoli villa options using the details you provided.</p>
              <a className={styles.successLink} href="#khopoli-villas">Compare both stays <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          )}
        </section>
        </section>

        <section className={styles.amenitiesMarquee} aria-label="Amenities across our Khopoli villas">
          <div className={styles.amenitiesMarqueeTrack}>
            {[0, 1].map((copy) => (
              <ul
                className={styles.amenitiesMarqueeGroup}
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {khopoliAmenities.map((amenity) => (
                  <li className={styles.amenitiesMarqueeItem} key={amenity}>
                    <Check size={14} aria-hidden="true" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {submitted && <section className={styles.propertyOptions} id="khopoli-villas" aria-labelledby="property-options-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>YOUR KHOPOLI OPTIONS</p>
            <h2 id="property-options-title">Two different stays to explore</h2>
            <p className={styles.propertyOptionsDescription}>Browse the real villa photos below. Tap any photo to view it larger.</p>
          </div>
          <div className={styles.propertyOptionList}>
            {propertyOptions.map((property) => (
              <article className={styles.propertyOption} key={property.slug} aria-labelledby={`${property.slug}-title`}>
                <div className={styles.propertyOptionHeader}>
                  <div className={styles.propertyOptionCopy}>
                    <p className={styles.propertyLocation}>{property.locationLabel}</p>
                    <h3 id={`${property.slug}-title`}>{property.name}</h3>
                    <p className={styles.propertyDescription}>{property.description}</p>
                  </div>
                  <ul className={styles.propertyFacts} aria-label={`${property.name} highlights`}>
                    {property.facts.map((fact) => <li key={fact}>{fact}</li>)}
                  </ul>
                </div>
                <PhotoStrip
                  propertyName={property.name}
                  propertySlug={property.slug}
                  photos={property.photos}
                  onOpen={(propertySlug, index) => setEnlargedPhoto({ propertySlug, index })}
                />
              </article>
            ))}
          </div>
        </section>}
      </div>

      {enlargedPhoto && enlargedProperty && activePhoto && (
        <div className={styles.lightboxBackdrop} onClick={() => setEnlargedPhoto(null)}>
          <section
            className={styles.lightboxDialog}
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged photo: ${activePhoto.caption} from ${enlargedProperty.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={lightboxCloseRef}
              className={styles.lightboxClose}
              type="button"
              aria-label="Close enlarged photo"
              onClick={() => setEnlargedPhoto(null)}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className={styles.lightboxImageFrame}>
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                sizes="(max-width: 760px) 94vw, 90vw"
                unoptimized
                loading="eager"
                className={styles.lightboxImage}
              />
            </div>
            <div className={styles.lightboxFooter}>
              <p>{activePhoto.caption}</p>
              <span>{enlargedPhoto.index + 1} / {enlargedProperty.photos.length}</span>
              <div className={styles.lightboxControls}>
                <button
                  type="button"
                  aria-label="Previous enlarged photo"
                  onClick={() => setEnlargedPhoto((current) => current === null
                    ? current
                    : { ...current, index: (current.index - 1 + enlargedProperty.photos.length) % enlargedProperty.photos.length })}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next enlarged photo"
                  onClick={() => setEnlargedPhoto((current) => current === null
                    ? current
                    : { ...current, index: (current.index + 1) % enlargedProperty.photos.length })}
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
