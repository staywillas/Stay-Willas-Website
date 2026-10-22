import type { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock3,
  MapPin,
  PawPrint,
  Phone,
  Star,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  Mountain,
  Trees,
  Accessibility,
  Gamepad2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import Image from "@/components/ui/site-image";
import Footer from "@/components/layout/footer";
import BookingModalFlow from "./booking-modal-flow";
import AngleHouseClickTracker from "./angle-house-click-tracker";
import ShareButton from "./share-button";
import SaveButton from "./save-button";
import PropertyEditorialGallery from "./property-editorial-gallery";
import PropertyEditorialExtras from "./property-editorial-extras";
import { resolvePropertyImage } from "@/lib/property-images";
import {
  generateBreadcrumbSchema,
  generatePropertySchema,
  generateFAQSchema,
} from "@/lib/schema";
import { getPropertyGuides } from "@/data/guide-navigation";
import { blogsData } from "@/data/blogs";
import styles from "./property-editorial.module.css";
import {
  getPropertyEditorial,
  type Highlight,
} from "@/data/property-editorial";

type EditorialVilla = Prisma.VillaGetPayload<{
  include: { dailyPrices: true; seasonalPrices: true };
}>;
type GuestReview = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};
type Availability = {
  checkIn: string;
  checkOut: string;
  status: string;
  cottagesCount: number;
};

export default function PropertyEditorialDetails({
  villa,
  reviews,
  bookings,
}: {
  villa: EditorialVilla;
  reviews: GuestReview[];
  bookings: Availability[];
}) {
  const property = getPropertyEditorial(villa);
  const { faqs, spaces } = property;
  const images = villa.images
    .map(resolvePropertyImage)
    .map((src) =>
      villa.slug === "canopy-crest"
        ? src.replace(
            "/assets/villas/Canopy crest photos/",
            "/assets/villas/canopy-crest/",
          )
        : src,
    );
  const amenities = getEssentialAmenities(villa.amenities);
  const initialPrice =
    property.isWillow && !property.cottage
      ? Math.min(villa.price, 15000)
      : villa.price;
  // The legacy Willow booking calculator consumes estate-level rates and divides
  // by three for one cottage. Adapt cottage data at the boundary without changing it.
  const rateFactor = property.cottage ? 3 : 1;
  const rate = (value: number | null) =>
    value === null ? null : value * rateFactor;
  const averageRating = reviews.length
    ? Number(
        (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1),
      )
    : null;
  const formattedPrice = initialPrice.toLocaleString("en-IN");
  const guides = getPropertyGuides(villa.slug)
    .map((slug) => blogsData.find((guide) => guide.slug === slug))
    .filter((guide) => guide !== undefined);
  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: property.areaName, url: property.areaUrl },
      { name: villa.name, url: `/villa/${villa.slug}` },
    ]),
    generatePropertySchema({
      ...villa,
      images,
      amenities: villa.amenities.map((name) => ({ name })),
      reviews,
    }),
    generateFAQSchema(faqs),
  ];

  return (
    <main
      className={styles.page}
      data-property-editorial-page
      data-property-slug={villa.slug}
    >
      {villa.slug === "the-angle-house" && <AngleHouseClickTracker />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas).replace(/</g, "\\u003c"),
        }}
      />
      <div className={styles.container}>
        <div className={styles.topline}>
          <Link href="/villas" className={styles.backLink}>
            <ChevronLeft size={15} /> The collection
          </Link>
          <div className={styles.shareActions}>
            <ShareButton />
            <SaveButton villaId={villa.slug} villaName={villa.name} />
          </div>
        </div>

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{property.eyebrow}</p>
            <h1>{property.name}</h1>
            <div className={styles.locationLine}>
              <span>
                <MapPin size={15} />{" "}
                {villa.location.replace(/, Maharashtra$/, "")}
              </span>
              {averageRating !== null && (
                <a href="#reviews">
                  <Star size={14} /> {averageRating.toFixed(1)}{" "}
                  <span>
                    ({reviews.length} guest{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </a>
              )}
            </div>
          </div>
          <div className={styles.headerNote}>
            <p>{property.summary}</p>
            <a href="#booking-card-section">
              Plan your stay <ArrowDownIcon />
            </a>
          </div>
        </header>

        <PropertyEditorialGallery
          key={villa.slug}
          images={images}
          featured={property.featured}
          propertyName={property.name}
        />
        {property.photoNote && (
          <p className={styles.galleryNote}>{property.photoNote}</p>
        )}

        <div
          className={styles.facts}
          role="group"
          aria-label="Villa at a glance"
        >
          <div>
            <Users size={23} />
            <span>
              <strong>Up to {villa.guests}</strong>
              <small>guests</small>
            </span>
          </div>
          <div>
            <BedDouble size={23} />
            <span>
              <strong>
                {villa.bedrooms} {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}
              </strong>
              <small>space to switch off</small>
            </span>
          </div>
          <div>
            <Bath size={23} />
            <span>
              <strong>
                {villa.bathrooms}{" "}
                {villa.bathrooms === 1 ? "bathroom" : "bathrooms"}
              </strong>
              <small>
                {villa.slug === "the-angle-house"
                  ? "plus a master-suite Jacuzzi"
                  : "the daily comforts"}
              </small>
            </span>
          </div>
          <div>
            {property.hasPool ? (
              <Waves size={23} />
            ) : property.hasJacuzzi ? (
              <Bath size={23} />
            ) : (
              <Mountain size={23} />
            )}
            <span>
              <strong>
                {property.hasPool
                  ? "Private pool"
                  : property.hasJacuzzi
                    ? "Private Jacuzzi"
                    : "A change of scenery"}
              </strong>
              <small>
                {villa.slug === "the-angle-house"
                  ? "with a waterfall feature"
                  : property.hasPool
                    ? "exclusive to your group"
                    : property.hasJacuzzi
                      ? property.cottage
                        ? "in your cottage"
                        : "one in every cottage"
                      : villa.location.split(",")[0]}
              </small>
            </span>
          </div>
        </div>

        <section
          id="amenities"
          className={styles.heroAmenities}
          aria-labelledby="amenities-title"
        >
          <div className={styles.amenitiesHeading}>
            <h2 id="amenities-title">Included with your stay</h2>
            <span>The comforts, covered.</span>
          </div>
          <div className={styles.amenityPreview}>
            {amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <span key={amenity}>
                  <Icon size={19} />
                  {getAmenityLabel(amenity)}
                </span>
              );
            })}
          </div>
          <details className={styles.amenitiesDropdown}>
            <summary>
              <span>View all {villa.amenities.length} amenities</span>
              <ChevronDown size={17} />
            </summary>
            <ul className={styles.fullAmenities}>
              {villa.amenities.map((amenity) => (
                <li key={amenity}>
                  <Check size={16} />
                  {amenity}
                </li>
              ))}
            </ul>
          </details>
        </section>

        <nav
          className={styles.sectionNav}
          aria-label={`Explore ${property.name}`}
        >
          <a href="#about">The stay</a>
          <a href="#spaces">Rooms & spaces</a>
          <a href="#amenities">Amenities</a>
          <a href="#location">Location</a>
          <a href="#reviews">Guest reviews</a>
        </nav>

        <div className={styles.contentLayout}>
          <div className={styles.content}>
            <section
              id="about"
              className={styles.section}
              aria-labelledby="about-title"
            >
              <h2 id="about-title">
                A little space.
                <br />
                <em>A lot of togetherness.</em>
              </h2>
              <p className={styles.intro}>{property.intro}</p>
              <p>{property.detail}</p>
              <div className={styles.highlights}>
                {property.highlights.map((highlight) => {
                  const Icon = highlightIcons[highlight.icon];
                  return (
                    <div key={highlight.title}>
                      <Icon size={20} />
                      <span>
                        <strong>{highlight.title}</strong>
                        <small>{highlight.text}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
              <details className={styles.disclosure}>
                <summary>
                  Read the full property story <ChevronDown size={17} />
                </summary>
                <p className={styles.fullStory}>{villa.description}</p>
              </details>
            </section>

            <section
              id="spaces"
              className={styles.section}
              aria-labelledby="spaces-title"
            >
              <div className={styles.sectionHeading}>
                <h2 id="spaces-title">Make yourself at home.</h2>
                <p>
                  {property.cottage
                    ? "A closer look at spaces across Willow Peak."
                    : "A closer look at the spaces you’ll share."}
                </p>
              </div>

              <p className={styles.swipeHint} aria-hidden="true">
                Swipe to explore <ArrowRight size={15} />
              </p>
              <div
                className={styles.spacesGrid}
                role="region"
                aria-label="Rooms and spaces"
                tabIndex={0}
              >
                {spaces.map((space) => (
                  <article key={space.title} className={styles.space}>
                    <div className={styles.spacePhoto}>
                      <Image
                        src={space.src}
                        alt={space.alt}
                        fill
                        quality={80}
                        sizes="(max-width: 700px) 92vw, (max-width: 1050px) 44vw, 355px"
                        className={styles.cover}
                      />
                    </div>
                    <h3>{space.title}</h3>
                    <p>{space.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="dining"
              className={styles.section}
              aria-labelledby="dining-title"
            >
              <div className={styles.sectionHeading}>
                <h2 id="dining-title">Dining, your way.</h2>
                <p>Menus and meal options for your stay.</p>
              </div>
              <div className={styles.dining}>
                <UtensilsCrossed size={26} />
                <div>
                  <h3>Good food. More time together.</h3>
                  <p>
                    Explore vegetarian, Jain and other menu options. Meals and
                    chef services are arranged separately.
                  </p>
                  <PropertyEditorialExtras key={villa.id} kind="menus" />
                </div>
              </div>
            </section>

            <section
              id="location"
              className={styles.section}
              aria-labelledby="location-title"
            >
              <div className={styles.sectionHeading}>
                <h2 id="location-title">A change of scenery.</h2>
                <p>{villa.location}.</p>
              </div>
              <div className={styles.locationPanel}>
                <div className={styles.locationIllustration}>
                  <MapPin size={35} strokeWidth={1.3} />
                  <span>{property.locationName}</span>
                  <small>{property.areaName}, Maharashtra</small>
                </div>
                <div>
                  <h3>Find your way to {property.name}.</h3>
                  <p>{property.directions}</p>
                  <a
                    href={property.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.textLink}
                  >
                    Open in Google Maps <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
              <p className={styles.smallNote}>
                Check your arrival instructions, route and current traffic
                before travelling.
              </p>
            </section>

            <section
              id="reviews"
              className={styles.section}
              aria-labelledby="reviews-title"
            >
              <div className={styles.sectionHeading}>
                <h2 id="reviews-title">A few words from our guests.</h2>
                {averageRating !== null && (
                  <p className={styles.reviewScore}>
                    <Star size={16} /> {averageRating.toFixed(1)} out of 5, from{" "}
                    {reviews.length} guest reviews
                  </p>
                )}
              </div>
              {reviews.length ? (
                <div className={styles.reviewGrid}>
                  {reviews.slice(0, 2).map((review) => (
                    <figure key={review.id}>
                      <div
                        className={styles.reviewStars}
                        role="img"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            size={13}
                            fill={
                              index < review.rating ? "currentColor" : "none"
                            }
                          />
                        ))}
                      </div>
                      <blockquote>{review.comment}</blockquote>
                      <figcaption>{review.userName}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p>Guest reviews will appear here after a stay.</p>
              )}
              <PropertyEditorialExtras
                key={villa.id}
                kind="reviews"
                villaId={villa.id}
                reviews={reviews}
              />
            </section>

            <section className={styles.section} aria-labelledby="know-title">
              <div className={styles.sectionHeading}>
                <h2 id="know-title">Good to know before you go.</h2>
              </div>
              <div className={styles.checkTimes}>
                <span>
                  <Clock3 size={19} />
                  <strong>Check-in</strong> From 2:00 PM
                </span>
                <span>
                  <Clock3 size={19} />
                  <strong>Check-out</strong> By 11:00 AM
                </span>
              </div>
              <div className={styles.faqs}>
                {faqs.map((faq) => (
                  <details key={faq.question} name="property-faq">
                    <summary>
                      {faq.question}
                      <ChevronDown size={17} />
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
              <p className={styles.smallNote}>
                No smoking indoors. Keep music low after 10:00 PM. Review the{" "}
                <Link href="/cancellation-policy">cancellation policy</Link>{" "}
                before booking.
              </p>
            </section>

            <section className={styles.guides} aria-labelledby="guides-title">
              <h2 id="guides-title">A little help with the planning.</h2>
              <div>
                {guides.map((guide) => (
                  <Link key={guide.slug} href={`/blog/${guide.slug}`}>
                    {guide.title}
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
              <Link className={styles.textLink} href={property.areaUrl}>
                Explore {property.areaName} stays <ArrowRight size={16} />
              </Link>
            </section>
            <div className={styles.closing}>
              <span>
                {property.name}, {property.locationName}
              </span>
              <h2>
                Your people.
                <br />
                <em>Your kind of weekend.</em>
              </h2>
              <a href="#booking-card-section" className={styles.primaryButton}>
                Check dates & plan your stay <ArrowRight size={17} />
              </a>
              <p>
                From ₹{formattedPrice} per night. Final rates depend on your
                dates and group.
              </p>
            </div>
          </div>

          <aside
            className={styles.reservation}
            data-lenis-prevent="true"
            id="booking-card-section"
            aria-label={`Plan your ${property.name} stay`}
          >
            <BookingModalFlow
              key={villa.id}
              presentation="editorial"
              villaId={villa.id}
              villaName={
                property.cottage ? `${property.name} (Willow Peak)` : villa.name
              }
              price={villa.price}
              basePrice={villa.price * rateFactor}
              initialCottageSelection={property.initialCottageSelection}
              propertySlug={villa.slug}
              weekendPrice={rate(villa.weekendPrice)}
              fridayPrice={rate(villa.fridayPrice)}
              saturdayPrice={rate(villa.saturdayPrice)}
              sundayPrice={rate(villa.sundayPrice)}
              dailyPrices={villa.dailyPrices.map((day) => ({
                ...day,
                price: day.price * rateFactor,
              }))}
              seasonalPrices={villa.seasonalPrices.map((season) => ({
                ...season,
                price: season.price * rateFactor,
              }))}
              maxGuests={villa.guests}
              baseGuests={villa.baseGuests}
              extraGuestFee={villa.extraGuestFee}
              bookings={bookings}
              location={villa.location}
              isAngleHouse={villa.slug === "the-angle-house"}
            />
            <div className={styles.concierge}>
              <Phone size={17} />
              <span>
                Prefer a conversation?
                <a href="tel:+919619042310">
                  Call our booking team <ArrowUpRight size={14} />
                </a>
              </span>
            </div>

          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function ArrowDownIcon() {
  return <ArrowRight size={16} className={styles.downArrow} />;
}

const highlightIcons: Record<Highlight["icon"], LucideIcon> = {
  pool: Waves,
  jacuzzi: Bath,
  garden: Trees,
  view: Mountain,
  meals: UtensilsCrossed,
  pet: PawPrint,
  access: Accessibility,
};

function getEssentialAmenities(amenities: string[]) {
  const priorities = [
    /pool/i,
    /jacuzzi/i,
    /air.?condition/i,
    /wi.?fi/i,
    /lawn|garden/i,
    /views/i,
    /wheelchair/i,
    /meal/i,
    /games|carrom/i,
    /parking/i,
  ];
  return Array.from(
    new Set([
      ...priorities
        .map((pattern) => amenities.find((amenity) => pattern.test(amenity)))
        .filter((amenity): amenity is string => Boolean(amenity)),
      ...amenities,
    ]),
  ).slice(0, 6);
}
function getAmenityIcon(name: string): LucideIcon {
  if (/pool/i.test(name)) return Waves;
  if (/jacuzzi|bathroom|shower/i.test(name)) return Bath;
  if (/wi.?fi/i.test(name)) return Wifi;
  if (/air.?condition/i.test(name)) return Wind;
  if (/lawn|garden/i.test(name)) return Trees;
  if (/views/i.test(name)) return Mountain;
  if (/park/i.test(name)) return Car;
  if (/wheelchair|senior/i.test(name)) return Accessibility;
  if (/games|carrom/i.test(name)) return Gamepad2;
  if (/meal|chef|dining/i.test(name)) return UtensilsCrossed;
  return CheckCircle2;
}
function getAmenityLabel(name: string) {
  if (/pool/i.test(name)) return "Private swimming pool";
  if (/jacuzzi/i.test(name)) return "Private Jacuzzi";
  if (/wi.?fi/i.test(name)) return "Wi-Fi";
  if (/air.?condition/i.test(name)) return "Air-conditioned rooms";
  if (/mountain.*views/i.test(name)) return "Mountain views";
  return name;
}
