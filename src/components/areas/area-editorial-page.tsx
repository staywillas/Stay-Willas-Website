import Link from "next/link";
import Image from "@/components/ui/site-image";
import AreaHeroCarousel from "@/components/areas/area-hero-carousel";
import Footer from "@/components/layout/footer";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
  Users,
  Waves,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { encodeWhatsAppMessage } from "@/lib/whatsapp";
import {
  generateBreadcrumbSchema,
  generateDestinationCollectionSchema,
  generateFAQSchema,
} from "@/lib/schema";
import { areaEditorial, type AreaSlug } from "@/data/area-editorial";
import { blogsData } from "@/data/blogs";
import { destinationGuides } from "@/data/guide-navigation";
import styles from "./area-editorial.module.css";

const propertyPhotos: Record<
  string,
  { src: string; alt: string; name: string; type: string; text: string }
> = {
  "the-angle-house": {
    src: "/assets/villas/the-angle-house/gallery-13.webp",
    alt: "The Angle House private waterfall swimming pool in Kamshet",
    name: "The Angle House",
    type: "Private pool + master-suite Jacuzzi",
    text: "Glass-fronted bedrooms, a waterfall pool and a living lounge for time together.",
  },
  "willow-peak": {
    src: "/assets/villas/willow-peak/graded-v1/chalets-night.webp",
    alt: "The three Willow Peak A-frame cottages illuminated at night in Kurwande",
    name: "Willow Peak",
    type: "Three private-Jacuzzi cottages",
    text: "Breeze, Crest and Heaven together, with an in-room Jacuzzi in each A-frame cottage.",
  },
  "canopy-crest": {
    src: "/assets/villas/canopy-crest/IMG-20260607-WA0015.jpg",
    alt: "Canopy Crest's lawn and outdoor seating in Khopoli",
    name: "Canopy Crest",
    type: "Private pool villa",
    text: "A poolside home with room to gather, four bedrooms and outdoor lawn space.",
  },
  "casa-de-reva": {
    src: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0031.jpg",
    alt: "Casa De Reva's outdoor pool in Kaswand, Panchgani",
    name: "Casa De Reva",
    type: "Private pool villa",
    text: "A hillside home in Kaswand with its own pool, outdoor spaces and a shared living lounge.",
  },
};

export default async function AreaEditorialPage({ slug }: { slug: AreaSlug }) {
  const area = areaEditorial[slug];
  const dbVillas = await prisma.villa.findMany({
    where: {
      OR: [
        { location: { contains: area.name, mode: "insensitive" } },
        ...(slug === "panchgani"
          ? [{ slug: "casa-de-reva" }, { slug: "terra-cotta-villa" }]
          : []),
      ],
    },
    select: {
      slug: true,
      name: true,
      location: true,
      images: true,
      price: true,
      guests: true,
      bedrooms: true,
      bathrooms: true,
    },
    orderBy: { createdAt: "desc" },
  });
  // Match the whole-estate starting rate displayed on Willow Peak's property page.
  const villas = dbVillas.map((villa) => ({
    ...villa,
    price:
      villa.slug === "willow-peak" ? Math.min(villa.price, 15000) : villa.price,
  }));
  villas.sort(
    (a, b) =>
      Number(b.slug === area.featuredSlug) -
      Number(a.slug === area.featuredSlug),
  );
  const homes = villas.filter(
    (villa) => !villa.slug.startsWith("willow-peak-cottage"),
  );
  const cottages = villas
    .filter((villa) => villa.slug.startsWith("willow-peak-cottage"))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const lowestRate = villas.length
    ? Math.min(...villas.map((villa) => villa.price))
    : null;
  const faqs = [
    ...area.faqs,
    {
      question: `How much does a stay in ${area.name} cost?`,
      answer: `${lowestRate !== null ? `Listed base accommodation starts from ₹${lowestRate.toLocaleString("en-IN")} per night${slug === "lonavala" ? " for an individual Willow Peak cottage" : " for the villa"}. ` : "Ask the booking team for current rates. "}Your dates, group size, meals, taxes and selected extras determine the final quote. Check the property calendar for date-specific pricing.`,
    },
    {
      question:
        "Are meals included, and can we arrange vegetarian or Jain food?",
      answer:
        "Meals and chef services are arranged separately. Discuss the menu, dietary preferences, cookware requirements, timings and charges with the booking team before confirming your stay.",
    },
    {
      question: "What are the check-in and check-out times?",
      answer:
        "Check-in is from 2:00 PM and check-out is by 11:00 AM for all properties. Early arrival or late departure needs advance confirmation and is subject to availability.",
    },
    {
      question: `Can I get 26% off weekday stays in ${area.name}?`,
      answer:
        "Eligible Monday–Thursday stays receive 26% off with code Stayw26 when booking directly. Confirm eligibility and the final quote for your property and dates; weekend and holiday rates may differ.",
    },
  ];
  const guides = (destinationGuides[slug] || [])
    .map((guideSlug) => blogsData.find((guide) => guide.slug === guideSlug))
    .filter((guide) => guide !== undefined);
  const destinationSchema = generateDestinationCollectionSchema({
    regionSlug: slug,
    regionName: area.name,
    title: area.title,
    description: area.description,
    villas: villas.map((villa) => ({
      ...villa,
      image: propertyPhotos[villa.slug]?.src || villa.images[0],
    })),
  });
  // A collection includes both swimming-pool villas and private-Jacuzzi cottages.
  const collectionGraph = destinationSchema["@graph"].map((node) =>
    node["@type"] === "ItemList"
      ? { ...node, name: `Stays in ${area.name}` }
      : node,
  );
  const schema = [
    ...collectionGraph,
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/areas" },
      { name: area.name, url: `/areas/${slug}` },
    ]),
    generateFAQSchema(faqs),
  ].filter(Boolean);
  const whatsapp = `https://wa.me/919619042310?text=${encodeWhatsAppMessage(`Hi Stay Willas! I'm interested in the 26% off Monday–Thursday offer in ${area.name}, with code Stayw26. Could you share eligible dates, available properties and the full quote for my group?`)}`;
  const collectionId = `${slug}-villas-grid`;

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href="/areas">Destinations</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">{area.name}</span>
        </nav>
        <section className={styles.hero} aria-labelledby="area-title">
          <div className={styles.heroCopy}>
            <div className={styles.heroEyebrow}>A STAY WILLAS COLLECTION · {area.name.toUpperCase()}</div>
            <div className={styles.heroOffer}>
              <strong>26% off</strong>
              <span>Monday–Thursday stays</span>
            </div>
            <h1 id="area-title">
              Villas in <span>{area.name}.</span>
            </h1>
            <p>{area.summary}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={`#${collectionId}`}>
                Check 26% off dates <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className={styles.textLink} href="tel:+919619042310">
                <Phone size={16} aria-hidden="true" /> Call to book
              </a>
            </div>
            <p className={styles.heroOfferNote}>
              Book direct with code <b>Stayw26</b> on eligible weekday dates.
            </p>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.carouselStage}>
              <AreaHeroCarousel
                items={area.hero.items}
                className={styles.carousel}
              />
            </div>
            <figcaption>
              <span><MapPin size={14} aria-hidden="true" />{area.hero.caption}</span>
              <span className={styles.carouselHint}>Drag or swipe to explore</span>
            </figcaption>
          </figure>
        </section>
        <div className={styles.stayNotes} aria-label="Booking information">
          <span>
            <Waves size={19} aria-hidden="true" />
            <span>
              Private stays<strong>Your own space to unwind</strong>
            </span>
          </span>
          <span>
            <CalendarDays size={19} aria-hidden="true" />
            <span>
              2 PM in · 11 AM out<strong>Time to settle into your stay</strong>
            </span>
          </span>
          <span>
            <Phone size={19} aria-hidden="true" />
            <span>
              Book direct<strong>Speak with the Stay Willas team</strong>
            </span>
          </span>
        </div>

        <section
          className={styles.offer}
          id="weekday-offer"
          aria-labelledby="weekday-offer-title"
        >
          <div className={styles.offerCopy}>
            <h2 id="weekday-offer-title">
              <span>26% off</span>{" "}
              {area.name} weekday stays.
            </h2>
            <p>
              More room to unwind. A little less to spend. Book your
              Monday–Thursday escape directly with Stay Willas.
            </p>
          </div>
          <div className={styles.offerCode}>
            <span>Your booking code</span>
            <code>Stayw26</code>
            <small>Monday–Thursday stays</small>
          </div>
          <div className={styles.offerActions}>
            <a href={`#${collectionId}`} className={styles.primaryButton}>
              Check offer dates <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className={styles.offerCall} href="tel:+919619042310">
              <Phone size={17} aria-hidden="true" />
              Call for the weekday offer
            </a>
            <a
              className={styles.offerMessage}
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get a weekday quote on WhatsApp{" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <p className={styles.offerTerms}>
            26% off eligible Monday–Thursday stays with code Stayw26. Subject to
            availability and offer eligibility; confirm your date-specific
            quote. Meals, taxes and extras are quoted separately.
          </p>
        </section>

        <section
          className={styles.collection}
          id={collectionId}
          aria-labelledby="collection-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="collection-title">{area.collectionTitle}</h2>
            <p>{area.collectionIntro}</p>
          </div>
          {homes.length ? (
            <div
              className={`${styles.homeGrid} ${homes.length === 1 ? styles.singleHome : ""}`}
            >
              {homes.map((villa) => {
                const copy = propertyPhotos[villa.slug];
                const name = copy?.name || villa.name;
                return (
                  <article
                    className={styles.home}
                    key={villa.slug}
                    id={
                      villa.slug === "canopy-crest"
                        ? "khopoli-signature-villa"
                        : undefined
                    }
                  >
                    <Link
                      href={`/villa/${villa.slug}`}
                      className={styles.homePhoto}
                      aria-label={`Explore ${name}`}
                    >
                      <Image
                        src={copy?.src || villa.images[0] || area.hero.src}
                        alt={copy?.alt || `${name} in ${villa.location}`}
                        fill
                        sizes={
                          homes.length === 1
                            ? "(max-width: 700px) 92vw, 50vw"
                            : "(max-width: 700px) 92vw, 45vw"
                        }
                        className={styles.cover}
                      />
                      <span className={styles.photoLabel}>
                        {copy?.type || "Private stay"}
                      </span>
                      <span className={styles.photoArrow}>
                        <ArrowRight size={18} aria-hidden="true" />
                      </span>
                    </Link>
                    <div className={styles.homeCopy}>
                      <p className={styles.location}>
                        <MapPin size={13} aria-hidden="true" />
                        {villa.location}
                      </p>
                      <h3>
                        <Link href={`/villa/${villa.slug}`}>{name}</Link>
                      </h3>
                      <p className={styles.homeDescription}>
                        {copy?.text ||
                          "Explore the photos, room layout and available dates for your private stay."}
                      </p>
                      <div className={styles.specs}>
                        <span>
                          <Users size={15} aria-hidden="true" />
                          Up to {villa.guests}
                        </span>
                        <span>
                          <BedDouble size={15} aria-hidden="true" />
                          {villa.bedrooms}{" "}
                          {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}
                        </span>
                        <span>
                          {villa.bathrooms}{" "}
                          {villa.bathrooms === 1 ? "bathroom" : "bathrooms"}
                        </span>
                      </div>
                      <p className={styles.cardOffer}>
                        26% off eligible Mon–Thu stays · Code Stayw26
                      </p>
                      <div className={styles.homeBottom}>
                        <p>
                          From{" "}
                          <strong>
                            ₹{villa.price.toLocaleString("en-IN")}
                          </strong>
                          <span> / night</span>
                        </p>
                        <Link
                          href={`/villa/${villa.slug}#booking-card-section`}
                        >
                          Check weekday rates{" "}
                          <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3>Let’s find your next stay.</h3>
              <p>Contact our team for current options in {area.name}.</p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                Ask about available stays{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          {cottages.length > 0 && (
            <div className={styles.cottageSection}>
              <h3>Just the two of you? Choose a cottage.</h3>
              <p>
                Each Willow Peak cottage has a private Jacuzzi. Estate photos
                show the shared setting; confirm your selected unit with the
                team.
              </p>
              <div className={styles.cottageGrid}>
                {cottages.map((villa, index) => (
                  <Link
                    href={`/villa/${villa.slug}`}
                    className={styles.cottage}
                    key={villa.slug}
                  >
                    <span className={styles.cottageLetter}>0{index + 1}</span>
                    <span>
                      <strong>
                        {["Breeze", "Crest", "Heaven"][index] || villa.name}
                      </strong>
                      <small>
                        Up to {villa.guests} guests · Private Jacuzzi
                      </small>
                    </span>
                    <span className={styles.cottageRate}>
                      From ₹{villa.price.toLocaleString("en-IN")}
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <p className={styles.rateNote}>
            Listed base rates are a starting point. Your dates, guest count and
            extras determine the final quote.
          </p>
        </section>

        <section className={styles.localSection} aria-labelledby="local-title">
          <div className={styles.localIntro}>
            <span className={styles.eyebrow}>A LITTLE LOCAL KNOW-HOW</span>
            <h2 id="local-title">{area.introTitle}</h2>
            {area.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.planning}>
            {area.planning.map((item, index) => (
              <article key={item.title}>
                <span className={styles.planNumber}>0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.faqIntro}>
            <h2 id="faq-title">
              A few things to know
              <br />
              before you go.
            </h2>
            <p>Planning a villa stay in {area.name}? Start here.</p>
          </div>
          <div className={styles.faqs}>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {guides.length > 0 && (
          <section
            className={styles.guideSection}
            aria-labelledby="guides-title"
          >
            <div className={styles.sectionHeading}>
              <h2 id="guides-title">A little help with the planning.</h2>
              <p>
                {area.name} travel guides, stay comparisons and ideas for your
                weekend.
              </p>
            </div>
            <div className={styles.guideGrid}>
              {guides.map((guide) => (
                <Link
                  href={`/blog/${guide.slug}`}
                  key={guide.slug}
                  className={styles.guide}
                >
                  <span>{guide.readTime}</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className={styles.readGuide}>
                    Read the guide <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav
          className={styles.otherAreas}
          aria-label="Explore other destinations"
        >
          <h2>A different change of scenery?</h2>
          <div>
            {(Object.keys(areaEditorial) as AreaSlug[])
              .filter((otherSlug) => otherSlug !== slug)
              .map((otherSlug) => (
                <Link href={`/areas/${otherSlug}`} key={otherSlug}>
                  <span>Explore villas in</span>
                  <strong>{areaEditorial[otherSlug].name}</strong>
                  <ArrowRight size={22} aria-hidden="true" />
                </Link>
              ))}
          </div>
        </nav>
      </div>
      <div className={styles.mobileBar} aria-label="Plan your stay">
        <a href="tel:+919619042310">
          <Phone size={17} aria-hidden="true" />
          <span>
            Call our team<small>26% off · Mon–Thu</small>
          </span>
        </a>
        <a className={styles.primaryButton} href={`#${collectionId}`}>
          Check offer dates <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
      <Footer />
    </main>
  );
}
