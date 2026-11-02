import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CarFront,
  Flower2,
  Ruler,
  Utensils,
  Waves,
  Wind,
} from "lucide-react";
import Footer from "@/components/layout/footer";
import styles from "./slatewood-page.module.css";

const whatsappUrl =
  "https://wa.me/919619042310?text=Hi%20Stay%20Willas%2C%20I%27d%20like%20to%20know%20more%20about%20Slatewood%20and%20its%20availability.";

const photos = [
  {
    src: "/assets/villas/slatewood/drive-slatewood-exterior-day.webp",
    alt: "Daylight view of Slatewood's villa and open grounds",
    caption: "A private estate surrounded by greenery",
    className: styles.galleryLead,
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-infinity-pool.webp",
    alt: "Slatewood's infinity-edge swimming pool",
    caption: "A 14 × 22 ft infinity-edge pool",
    className: "",
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-living-room.webp",
    alt: "The spacious living hall at Slatewood",
    caption: "Room to spend time together",
    className: "",
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-bedroom-window.webp",
    alt: "One of Slatewood's three air-conditioned bedrooms",
    caption: "Three bedrooms, each with an attached bathroom",
    className: "",
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-garden-gazebo.webp",
    alt: "The garden, lawn and gazebo at Slatewood",
    caption: "A garden, lawn and gazebo to enjoy outdoors",
    className: "",
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-dining.webp",
    alt: "Slatewood's shared dining area",
    caption: "Space to share a meal",
    className: "",
  },
  {
    src: "/assets/villas/slatewood/drive-slatewood-kitchenette.webp",
    alt: "The kitchenette at Slatewood",
    caption: "A handy kitchenette in the hall",
    className: "",
  },
];

const highlights = [
  {
    icon: BedDouble,
    title: "Three air-conditioned bedrooms",
    description: "Each bedroom has its own attached bathroom.",
  },
  {
    icon: Wind,
    title: "A spacious living hall",
    description: "Two air conditioners keep the shared living area comfortable.",
  },
  {
    icon: Utensils,
    title: "A kitchenette in the hall",
    description: "A convenient kitchenette sits within the shared living area.",
  },
  {
    icon: Waves,
    title: "An infinity-edge pool",
    description: "A private 14 × 22 ft swimming pool with a depth of 4.5 ft.",
  },
  {
    icon: Flower2,
    title: "Garden, lawn and gazebo",
    description: "A gently sloping 1.5-acre estate with plants that attract butterflies.",
  },
  {
    icon: Ruler,
    title: "A dedicated turf",
    description: "An outdoor turf area measuring 6 × 35 ft.",
  },
  {
    icon: CarFront,
    title: "Private parking",
    description: "Space for 3–4 cars beside the villa on the upper level.",
  },
];

export default function SlatewoodSimpleView() {
  return (
    <>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="slatewood-title">
          <Image
            src="/assets/villas/slatewood/drive-slatewood-exterior-evening.webp"
            alt="Stay Willas Slatewood set within its landscaped estate"
            fill
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Stay Willas Slatewood</p>
            <h1 id="slatewood-title">
              A private escape,
              <br />
              <em>surrounded by nature.</em>
            </h1>
            <p className={styles.heroDescription}>
              Stay Willas Slatewood is a thoughtfully designed 3BHK private
              infinity pool villa set across a landscaped 1.5-acre estate.
              Contemporary spaces open onto greenery, a garden and a dedicated
              turf.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryButton}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask about Slatewood <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className={styles.textButton} href="#the-stay">
                Explore the stay <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className={styles.heroNote}>Stay. Relax. Repeat.</p>
          </div>
        </section>

        <section className={styles.facts} aria-label="Slatewood at a glance">
          <div>
            <strong>3</strong>
            <span>bedrooms</span>
          </div>
          <div>
            <strong>14 × 22 ft</strong>
            <span>infinity-edge pool</span>
          </div>
          <div>
            <strong>1.5 acres</strong>
            <span>landscaped estate</span>
          </div>
          <div>
            <strong>6 × 35 ft</strong>
            <span>dedicated turf</span>
          </div>
        </section>

        <section className={styles.introSection} id="the-stay" aria-labelledby="stay-title">
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>Room for your people</p>
            <h2 id="stay-title">Together feels easy here.</h2>
            <p>
              The villa brings three air-conditioned bedrooms, each with an
              attached bathroom, around a large living hall with two air
              conditioners. A kitchenette within the hall makes it easy to
              settle in and spend time together.
            </p>
            <p>
              Step outside for a swim, follow the sloping garden down to the
              turf, or take a quiet moment beneath the gazebo. The estate has
              been landscaped with greenery and plants that draw butterflies
              into the garden.
            </p>
            <a className={styles.inlineLink} href="#property-highlights">
              See the property details <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <figure className={styles.introPhoto}>
            <Image
              src="/assets/villas/slatewood/drive-slatewood-infinity-pool.webp"
              alt="The private infinity-edge pool at Slatewood"
              fill
              sizes="(max-width: 760px) 100vw, 46vw"
              loading="lazy"
              className={styles.coverImage}
            />
            <figcaption>Cool off, then let the afternoon take its time.</figcaption>
          </figure>
        </section>

        <section className={styles.gallerySection} aria-labelledby="gallery-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>A closer look</p>
            <h2 id="gallery-title">The spaces that make Slatewood.</h2>
          </div>
          <div className={styles.galleryGrid}>
            {photos.map((photo, index) => (
              <figure
                className={`${styles.galleryItem} ${photo.className}`}
                key={photo.src}
              >
                <div className={styles.galleryImage}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 640px) 100vw, (max-width: 1100px) 65vw, 760px"
                        : "(max-width: 640px) 100vw, (max-width: 1100px) 32vw, 390px"
                    }
                    loading="lazy"
                    className={styles.coverImage}
                  />
                </div>
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          className={styles.highlightsSection}
          id="property-highlights"
          aria-labelledby="highlights-title"
        >
          <div className={styles.highlightsIntro}>
            <p className={styles.eyebrow}>The thoughtful details</p>
            <h2 id="highlights-title">Your own little escape.</h2>
            <p>
              Some places are made for exploring. Others are made for slowing
              down. At Slatewood, enjoy your own private estate, comfortable
              spaces and the simple pleasure of being surrounded by nature.
            </p>
          </div>
          <div className={styles.highlightList}>
            {highlights.map(({ icon: Icon, title, description }, index) => (
              <article className={styles.highlight} key={title}>
                <span className={styles.highlightIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.highlightIcon}>
                  <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.conciergeSection} aria-labelledby="concierge-title">
          <div>
            <p className={styles.eyebrow}>A Stay Willas stay</p>
            <h2 id="concierge-title">Make a little room for nature.</h2>
            <p>
              Ask our concierge about Slatewood and planning a stay for your
              group.
            </p>
          </div>
          <div className={styles.conciergeActions}>
            <a
              className={styles.lightButton}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask about Slatewood <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link className={styles.homeLink} href="/villas">
              Explore current stays <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
