"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  Heart,
  Trees,
  Users,
  Waves,
  UtensilsCrossed,
  X,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import Image from "@/components/ui/site-image";
import { captureBookingLead } from "@/app/actions/inquiry";
import { trackCanopyCrestAdsLandingLead } from "@/lib/angle-house-measurement";
import type { LeadAttribution } from "@/lib/angle-house-measurement";
import { canopyCrestGallery } from "@/data/canopy-crest-images";
import styles from "./khopoli-ads-lead-page.module.css";

const photos = canopyCrestGallery;

const amenities: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Waves, title: "Private swimming pool", detail: "For your group" },
  { icon: BedDouble, title: "Four bedrooms", detail: "Room to settle in" },
  { icon: Users, title: "Up to 16 guests", detail: "A stay for a larger group" },
  { icon: Trees, title: "Open lawn and gazebo", detail: "Time outside together" },
  { icon: UtensilsCrossed, title: "Meal options", detail: "Ask our team what is available" },
];

const groupSizes = ["1–4 guests", "5–8 guests", "9–12 guests", "13–16 guests"];
const tripTypes = [
  "Family time",
  "Friends getting together",
  "A celebration",
  "A team stay",
];
const stayInterests: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Waves, title: "Poolside time", detail: "Relax and swim together" },
  { icon: Trees, title: "Lawn and games", detail: "Enjoy the outdoor space" },
  { icon: Heart, title: "A group celebration", detail: "Tell us what you are planning" },
  { icon: UtensilsCrossed, title: "Meal options", detail: "Ask what is available" },
  { icon: Users, title: "Help me decide", detail: "Talk it through with our team" },
];
const enquiryStepCount = 6;

type DatePlan = "specific" | "flexible" | "";
type ContactPreference = "call" | "whatsapp" | "";

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
  compact = false,
  onOpen,
}: {
  compact?: boolean;
  onOpen: (index: number) => void;
}) {
  return (
    <div
      className={`${styles.galleryTrack} ${compact ? styles.stepPhotoTrack : styles.mainGalleryTrack}`}
      aria-label="Canopy Crest villa photos. Scroll horizontally to see more."
    >
      {photos.map((item, index) => (
        <button
          type="button"
          className={styles.galleryCard}
          key={item.src}
          aria-label={`Enlarge photo: ${item.caption}`}
          onClick={() => onOpen(index)}
        >
          <span className={styles.galleryImageFrame}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={compact
                ? "(max-width: 760px) 68vw, 340px"
                : "(max-width: 760px) 80vw, (max-width: 1100px) 45vw, 360px"}
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
  const [enlargedPhotoIndex, setEnlargedPhotoIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [groupSize, setGroupSize] = useState("");
  const [tripType, setTripType] = useState("");
  const [selectedStayInterests, setSelectedStayInterests] = useState<string[]>([]);
  const [datePlan, setDatePlan] = useState<DatePlan>("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPreference, setContactPreference] =
    useState<ContactPreference>("");
  const [agreedToContact, setAgreedToContact] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const plannerRef = useRef<HTMLElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (step === 0 || submitted) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    headingRef.current?.focus({ preventScroll: true });
    plannerRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [step, submitted]);

  useEffect(() => {
    if (enlargedPhotoIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightboxCloseRef.current?.focus();

    function handleLightboxKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setEnlargedPhotoIndex(null);
      } else if (event.key === "ArrowRight") {
        setEnlargedPhotoIndex((current) => current === null ? current : (current + 1) % photos.length);
      } else if (event.key === "ArrowLeft") {
        setEnlargedPhotoIndex((current) => current === null ? current : (current - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", handleLightboxKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleLightboxKeys);
    };
  }, [enlargedPhotoIndex]);

  function continueToNextStep() {
    setError("");
    if (step === 0 && !groupSize) {
      setError("Choose the group size that fits your stay.");
      return;
    }
    if (step === 1 && !tripType) {
      setError("Choose what you are planning.");
      return;
    }
    if (step === 2) {
      if (!datePlan) {
        setError("Choose dates or tell us your dates are flexible.");
        return;
      }
      if (datePlan === "specific" && (!checkIn || !checkOut || checkOut <= checkIn)) {
        setError("Choose a check-out date after your check-in date.");
        return;
      }
    }
    if (step === 3 && selectedStayInterests.length === 0) {
      setError("Choose at least one thing your group would enjoy.");
      return;
    }
    setStep((current) => Math.min(current + 1, enquiryStepCount - 1));
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!contactPreference) {
      setError("Choose whether you would prefer a call or WhatsApp message.");
      return;
    }
    if (!agreedToContact) {
      setError("Please confirm that our team may contact you about this request.");
      return;
    }

    setIsSubmitting(true);
    const dateSummary =
      datePlan === "specific"
        ? `${checkIn} to ${checkOut}`
        : "Flexible dates";
    const message = [
      "Standalone Khopoli ads page enquiry for Canopy Crest.",
      `Group size: ${groupSize}.`,
      `Plan: ${tripType}.`,
      `Dates: ${dateSummary}.`,
      `Stay preferences: ${selectedStayInterests.join(", ")}.`,
      `Preferred contact: ${contactPreference === "call" ? "Phone call" : "WhatsApp"}.`,
    ].join(" ");

    try {
      const result = await captureBookingLead({
        name: name.trim(),
        phone: `+91 ${phoneDigits}`,
        villaName: "Canopy Crest",
        checkIn: datePlan === "specific" ? checkIn : undefined,
        checkOut: datePlan === "specific" ? checkOut : undefined,
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

  const stepTitles = [
    "How many people are in your group?",
    "What brings you to Khopoli?",
    "When would you like to stay?",
    "What would make it a great stay?",
    "See Canopy Crest",
    "Where can our team reach you?",
  ];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="khopoli-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A PRIVATE VILLA FOR YOUR GROUP</p>
            <h1 id="khopoli-title">Villas in Khopoli</h1>
            <p className={styles.heroDescription}>
              Tell us a little about your group. Our team will help you plan a stay at Canopy Crest.
            </p>
            <div className={styles.heroFacts}>
              <span><Check size={15} aria-hidden="true" /> Private pool</span>
              <span><Check size={15} aria-hidden="true" /> Four bedrooms</span>
              <span><Check size={15} aria-hidden="true" /> Up to 16 guests</span>
            </div>

          </div>


        <section
          className={styles.planner}
          id="stay-planner"
          ref={plannerRef}
          aria-labelledby="planner-title"
        >


          {!submitted ? (
            <div className={styles.stepCard}>
              <div className={styles.stepTop}>
                <span>STEP {step + 1} OF {enquiryStepCount}</span>
                <span>{Math.round(((step + 1) / enquiryStepCount) * 100)}%</span>
              </div>
              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-label="Enquiry steps"
                aria-valuemin={1}
                aria-valuemax={enquiryStepCount}
                aria-valuenow={step + 1}
              >
                <span style={{ width: `${((step + 1) / enquiryStepCount) * 100}%` }} />
              </div>

              <h2 id="planner-title" ref={headingRef} tabIndex={-1} className={styles.stepTitle}>
                {stepTitles[step]}
              </h2>
              {step === 3 && <p className={styles.stepDescription}>Choose any that sound good. You can pick more than one.</p>}
              {step === 4 && <p className={styles.stepDescription}>Take a quick look through the villa photos. You can skip this step.</p>}
              {step === 5 && <p className={styles.stepDescription}>Leave your name and mobile number and our team will contact you.</p>}

              {step === 0 && (
                <div className={styles.choiceGrid} role="group" aria-label="Choose a group size">
                  {groupSizes.map((option) => (
                    <button
                      className={`${styles.choice} ${groupSize === option ? styles.choiceSelected : ""}`}
                      type="button"
                      key={option}
                      aria-pressed={groupSize === option}
                      onClick={() => { setGroupSize(option); setError(""); }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className={styles.choiceGrid} role="group" aria-label="Choose a stay type">
                  {tripTypes.map((option) => (
                    <button
                      className={`${styles.choice} ${tripType === option ? styles.choiceSelected : ""}`}
                      type="button"
                      key={option}
                      aria-pressed={tripType === option}
                      onClick={() => { setTripType(option); setError(""); }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className={styles.dateStep}>
                  <div className={styles.choiceGrid} role="group" aria-label="Choose your date preference">
                    <button
                      className={`${styles.choice} ${datePlan === "specific" ? styles.choiceSelected : ""}`}
                      type="button"
                      aria-pressed={datePlan === "specific"}
                      onClick={() => { setDatePlan("specific"); setError(""); }}
                    >
                      I have dates in mind
                    </button>
                    <button
                      className={`${styles.choice} ${datePlan === "flexible" ? styles.choiceSelected : ""}`}
                      type="button"
                      aria-pressed={datePlan === "flexible"}
                      onClick={() => { setDatePlan("flexible"); setError(""); }}
                    >
                      My dates are flexible
                    </button>
                  </div>
                  {datePlan === "specific" && (
                    <div className={styles.dateFields}>
                      <label>
                        <span>Check-in</span>
                        <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
                      </label>
                      <label>
                        <span>Check-out</span>
                        <input type="date" value={checkOut} min={checkIn || undefined} onChange={(event) => setCheckOut(event.target.value)} />
                      </label>
                    </div>
                  )}
                  <p className={styles.helperText}>You can share exact dates or let us know you are still deciding.</p>
                </div>
              )}

              {step === 3 && (
                <div className={`${styles.choiceGrid} ${styles.interestGrid}`} role="group" aria-label="Choose what your group would enjoy most">
                  {stayInterests.map(({ icon: Icon, title, detail }) => (
                    <button
                      className={`${styles.choice} ${styles.interestChoice} ${selectedStayInterests.includes(title) ? styles.choiceSelected : ""}`}
                      type="button"
                      key={title}
                      aria-pressed={selectedStayInterests.includes(title)}
                      onClick={() => {
                        setSelectedStayInterests((current) =>
                          current.includes(title)
                            ? current.filter((interest) => interest !== title)
                            : [...current, title],
                        );
                        setError("");
                      }}
                    >
                      <span className={styles.interestIcon}><Icon size={18} aria-hidden="true" /></span>
                      <span className={styles.interestCopy}><strong>{title}</strong><small>{detail}</small></span>
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className={styles.photoStep}>
                  <PhotoStrip compact onOpen={setEnlargedPhotoIndex} />
                  <button className={styles.skipPhotos} type="button" onClick={() => { setError(""); setStep(5); }}>
                    Skip photos and share my details
                  </button>
                </div>
              )}

              {step === 5 && (
                <div className={styles.finalStep}>
                  <div className={styles.finalSummary}>
                    <p className={styles.eyebrow}>YOUR CANOPY CREST STAY</p>
                    <p className={styles.finalSummaryChoices}>
                      {groupSize} · {tripType} · {selectedStayInterests.join(", ")} · {datePlan === "specific" ? checkIn + " to " + checkOut : "Flexible dates"}
                    </p>
                    <p className={styles.finalSummaryDetails}>
                      {amenities.map(({ title }) => title).join(" · ")}
                    </p>
                  </div>
                  <form className={styles.contactForm} onSubmit={submitLead}>
                    <label className={styles.field}>
                      <span>Your name</span>
                      <input autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
                    </label>
                    <label className={styles.field}>
                      <span>Mobile number</span>
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
                          onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                        />
                      </span>
                    </label>

                    <fieldset className={styles.contactChoice}>
                      <legend>How should we reach you?</legend>
                      <div className={styles.choiceGrid}>
                        {([
                          ["call", "Call me"],
                          ["whatsapp", "WhatsApp me"],
                        ] as const).map(([value, label]) => (
                          <button
                            className={`${styles.choice} ${contactPreference === value ? styles.choiceSelected : ""}`}
                            type="button"
                            key={value}
                            aria-pressed={contactPreference === value}
                            onClick={() => { setContactPreference(value); setError(""); }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <label className={styles.consent}>
                      <input type="checkbox" checked={agreedToContact} onChange={(event) => setAgreedToContact(event.target.checked)} />
                      <span>Our team may contact me about this Canopy Crest enquiry.</span>
                    </label>
                    {error && <p className={styles.error} role="alert">{error}</p>}
                    <div className={styles.formActions}>
                      <button className={styles.backButton} type="button" onClick={goBack}>
                        <ArrowLeft size={16} aria-hidden="true" /> Back
                      </button>
                      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending your request…" : "Request a follow-up"}
                        {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step < 5 && (
                <>
                  {error && <p className={styles.error} role="alert">{error}</p>}
                  <div className={styles.formActions}>
                    {step > 0 ? (
                      <button className={styles.backButton} type="button" onClick={goBack}>
                        <ArrowLeft size={16} aria-hidden="true" /> Back
                      </button>
                    ) : <span />}
                    <button className={styles.submitButton} type="button" onClick={continueToNextStep}>
                      Continue <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.successCard} role="status" aria-live="polite">
              <span className={styles.successIcon}><Check size={24} aria-hidden="true" /></span>
              <p className={styles.eyebrow}>REQUEST RECEIVED</p>
              <h2 id="planner-title" ref={headingRef} tabIndex={-1}>Thanks, {name || "we have your request"}.</h2>
              <p>Our team will contact you about Canopy Crest in Khopoli using your preferred method.</p>
            </div>
          )}
        </section>
        </section>

        <section className={styles.propertyPhotos} aria-labelledby="photos-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>CANOPY CREST · KHOPOLI</p>
            <h2 id="photos-title">Take a look around</h2>
          </div>
          <PhotoStrip onOpen={setEnlargedPhotoIndex} />
          <p className={styles.galleryHint}>Swipe sideways to explore. Tap any photo to see it larger.</p>
        </section>

        <section className={styles.amenities} aria-labelledby="amenities-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>FIRST, TAKE A LOOK AROUND</p>
            <h2 id="amenities-title">Space for everyone to settle in</h2>
          </div>
          <div className={styles.amenityGrid}>
            {amenities.map(({ icon: Icon, title, detail }) => (
              <article className={styles.amenity} key={title}>
                <span className={styles.amenityIcon}><Icon size={19} aria-hidden="true" /></span>
                <span><strong>{title}</strong><small>{detail}</small></span>
              </article>
            ))}
          </div>
        </section>

        <p className={styles.footerNote}>Canopy Crest · Khopoli, Maharashtra</p>
      </div>

      {enlargedPhotoIndex !== null && (
        <div className={styles.lightboxBackdrop} onClick={() => setEnlargedPhotoIndex(null)}>
          <section
            className={styles.lightboxDialog}
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged photo: ${photos[enlargedPhotoIndex].caption}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={lightboxCloseRef}
              className={styles.lightboxClose}
              type="button"
              aria-label="Close enlarged photo"
              onClick={() => setEnlargedPhotoIndex(null)}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className={styles.lightboxImageFrame}>
              <Image
                src={photos[enlargedPhotoIndex].src}
                alt={photos[enlargedPhotoIndex].alt}
                fill
                sizes="(max-width: 760px) 94vw, 90vw"
                unoptimized
                loading="eager"
                className={styles.lightboxImage}
              />
            </div>
            <div className={styles.lightboxFooter}>
              <p>{photos[enlargedPhotoIndex].caption}</p>
              <span>{enlargedPhotoIndex + 1} / {photos.length}</span>
              <div className={styles.lightboxControls}>
                <button
                  type="button"
                  aria-label="Previous enlarged photo"
                  onClick={() => setEnlargedPhotoIndex((current) => current === null ? current : (current - 1 + photos.length) % photos.length)}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next enlarged photo"
                  onClick={() => setEnlargedPhotoIndex((current) => current === null ? current : (current + 1) % photos.length)}
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
