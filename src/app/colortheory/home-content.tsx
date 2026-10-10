import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bath, BadgeCheck, BedDouble, CalendarCheck2, ChevronDown, HeartHandshake, UtensilsCrossed, Users, Waves } from "lucide-react";
import styles from "./preview.module.css";

type Villa = { slug: string; name: string; location: string; price: number; guests: number; bedrooms: number };
type Stay = {
  slug: string; sourceSlug?: string; name: string; location: string; image: string;
  imageAlt: string; description: string; compactDescription?: string; features: string[]; compactFeatures?: string[]; cottage?: boolean;
};

const angle: Stay = {
  slug: "the-angle-house", name: "The Angle House", location: "Kamshet · Lonavala",
  image: "/images/angle-house-hero-clean.webp", imageAlt: "The Angle House with its private swimming pool and glass-fronted villa",
  description: "A glass-fronted escape with a waterfall pool, a master-suite Jacuzzi and space to gather with your favourite people.",
  compactDescription: "A master-suite Jacuzzi and your own waterfall pool for an easy group escape.",
  features: ["Master-suite Jacuzzi", "Private waterfall pool", "3 bedrooms"],
  compactFeatures: ["Master-suite Jacuzzi", "Private waterfall pool"],
};
const willow: Stay = {
  slug: "willow-peak", sourceSlug: "willow-peak-cottage-c", name: "Willow Peak", location: "Kurwande · Lonavala",
  image: "/assets/villas/willow-peak/wp-07.webp", imageAlt: "The A-frame cottages at Willow Peak in Lonavala",
  description: "Three A-frame cottages, each with a private in-room Jacuzzi. Choose one for a cosy escape or ask about all three for your group.",
  compactDescription: "A private Jacuzzi in every A-frame cottage. Choose one or book all three.",
  features: ["Jacuzzi in every cottage", "Up to 4 guests per cottage", "3 cottages available"], cottage: true,
  compactFeatures: ["Private in-room Jacuzzi", "3 A-frame cottages"],
};
const canopy: Stay = {
  slug: "canopy-crest", name: "Canopy Crest", location: "Khopoli · Maharashtra",
  image: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg", imageAlt: "Canopy Crest villa with its private pool in Khopoli",
  description: "A four-bedroom home for up to 16 guests, with a private pool, outdoor gazebo and plenty of room for a weekend together.",
  features: ["Private swimming pool", "4 bedrooms", "Outdoor gazebo"],
};
const casa: Stay = {
  slug: "casa-de-reva", name: "Casa De Reva", location: "Kaswand · Panchgani",
  image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg", imageAlt: "Casa De Reva villa and private pool in the hills of Panchgani",
  description: "Slow mornings in the hills, afternoons by your private pool and evenings on the lawn. A four-bedroom getaway in Panchgani.",
  features: ["Private swimming pool", "4 bedrooms", "Lawn & hillside gazebo"],
};

const reasons = [
  { icon: BadgeCheck, title: "Handpicked homes", text: "We visit every home ourselves, so you can choose your stay with confidence." },
  { icon: UtensilsCrossed, title: "A little extra care", text: "Ask about meal packages, a private chef or a special setup for your stay." },
  { icon: HeartHandshake, title: "Warm hospitality", text: "Our team helps with the details before you arrive and throughout your getaway." },
  { icon: CalendarCheck2, title: "Book directly", text: "Check your dates and book with Stay Willas, with no platform booking fee." },
];

const faqs = [
  { question: "Which properties have a private Jacuzzi?", answer: "The Angle House has a Jacuzzi in its master suite. At Willow Peak, each of the three A-frame cottages has its own private in-room Jacuzzi. Browse the Jacuzzi collection above to choose your stay." },
  { question: "Which villas have a private swimming pool?", answer: "The Angle House, Canopy Crest and Casa De Reva each have a private swimming pool. Willow Peak is our Jacuzzi cottage collection; choose a pool villa if swimming is the main plan for your weekend." },
  { question: "Can we book one cottage at Willow Peak?", answer: "Yes. Choose Breeze, Crest or Heaven for up to four guests per cottage. You can also ask about booking all three together for up to 12 guests. The starting rate shown here is per cottage, per night; the full-estate quote is separate." },
  { question: "How do I check availability and book?", answer: "Use the search above with your destination, dates and group size, or tap Check dates & book on a property card. Review the property’s availability and final quote before confirming. Our concierge can also help you on WhatsApp." },
  { question: "Can you arrange food or a celebration?", answer: "Ask our team about meals, private chefs, decorations and celebration setups for your chosen stay. Availability, additional charges, guest limits and music timings vary by property; confirm the arrangements with your booking." },
  { question: "Are pets welcome?", answer: "Tell our concierge about your pet when choosing a property. Confirm the selected villa’s pet policy, any charges and house rules before booking." },
  { question: "What is included in the displayed starting price?", answer: "The cards show an accommodation starting rate per night. Your dates, group size, taxes, meals and optional extras can change the total. Check the full quote and cancellation policy on your property page before payment." },
  { question: "How can I list my villa with Stay Willas?", answer: "Tap Partner With Us to visit our homeowner page. Share your property details with the team to learn about guest bookings, property care and operations." },
];

function StayCard({ stay, villa, compact = false }: { stay: Stay; villa?: Villa; compact?: boolean }) {
  return <article className={`${styles.featureCard} ${compact ? styles.compactCard : ""}`}>
    <Link href={`/villa/${stay.slug}`} className={styles.featurePhoto} aria-label={`Explore ${stay.name}`}>
      <Image src={stay.image} alt={stay.imageAlt} fill sizes={compact ? "(max-width: 600px) 90vw, (max-width: 1100px) 44vw, 460px" : "(max-width: 600px) 90vw, (max-width: 900px) 45vw, 580px"} className={styles.cover} />
      <span className={styles.featureTag}>{stay.cottage ? <Bath size={14} /> : <Waves size={14} />}{stay.cottage ? "Private Jacuzzi cottages" : "Your own private villa"}</span>
      <span className={styles.featurePhotoArrow}><ArrowUpRight size={20} /></span>
    </Link>
    <div className={styles.featureBody}>
      <span className={styles.villaLocation}>{stay.location}</span>
      <h3><Link href={`/villa/${stay.slug}`}>{stay.name}</Link></h3>
      <p className={styles.featureDescription}>{compact ? stay.compactDescription || stay.description : stay.description}</p>
      <ul className={styles.featurePills}>{(compact ? stay.compactFeatures || stay.features : stay.features).map(feature => <li key={feature}>{feature}</li>)}</ul>
      {villa && <div className={styles.villaSpecs}><span><Users size={15} /> Up to {villa.guests} guests{stay.cottage ? " / cottage" : ""}</span><span><BedDouble size={15} /> {villa.bedrooms} {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}</span></div>}
      <div className={styles.featureBooking}>
        {villa && <p><span>From</span><strong>₹{villa.price.toLocaleString("en-IN")}</strong><small>/ night{stay.cottage ? " · per cottage" : ""}</small></p>}
        <Link href={`/villa/${stay.slug}#booking-card-section`} className={styles.primaryButton} aria-label={`Check dates and book ${stay.name}`}>Check dates & book <ArrowRight size={16} /></Link>
      </div>
    </div>
  </article>;
}

export default function HomeContent({ villas }: { villas: Villa[] }) {
  const lookup = new Map(villas.map(villa => [villa.slug, villa]));
  return <>
    <section id="jacuzzi-villas" className={`${styles.featureSection} ${styles.jacuzziSection}`} aria-labelledby="jacuzzi-title">
      <div className={styles.contentWidth}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}><Bath size={15} /> SOAK. SWITCH OFF. STAY A LITTLE LONGER.</span><h2 id="jacuzzi-title">Our Jacuzzi Villas</h2><p>A private soak, a slower evening and a stay made for unwinding.</p></div><a href="#pool-villas" className={styles.collectionButton}>More of a pool person? <ChevronDown size={20} /></a></div>
        <div className={styles.jacuzziGrid}>{[angle, willow].map(stay => <StayCard key={stay.slug} stay={stay} villa={lookup.get(stay.sourceSlug || stay.slug)} compact />)}</div>
      </div>
    </section>

    <section id="pool-villas" className={styles.featureSection} aria-labelledby="pool-title">
      <div className={styles.contentWidth}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}><Waves size={15} /> THE POOL IS ALL YOURS</span><h2 id="pool-title">Our Private Pool Villas</h2><p>From the first dip to the last sunset. Find your favourite poolside home.</p></div><Link href="/villas" className={styles.collectionButton}>Explore all stays <ArrowUpRight size={20} /></Link></div>
        <div className={styles.poolGrid}>{[angle, canopy, casa].map(stay => <StayCard key={stay.slug} stay={stay} villa={lookup.get(stay.slug)} />)}</div>
        <p className={styles.rateNote}>Starting rates vary by date and group size. Review the final quote on your chosen property.</p>
      </div>
    </section>

    <section id="destinations" className={styles.destinations} aria-labelledby="destinations-title"><div><span className={styles.eyebrow}>CLOSER THAN YOU THINK</span><h2 id="destinations-title">Leave the city.<br /><em>Find your quiet.</em></h2><p className={styles.destinationCopy}>Three destinations. A different pace in each one.</p></div><div className={styles.destinationLinks}>{[{ name: "Lonavala", text: "Glass villas & Jacuzzi cottages" }, { name: "Khopoli", text: "Pool days with your whole group" }, { name: "Panchgani", text: "Hillside mornings & garden evenings" }].map((place, i) => <Link href={`/areas/${place.name.toLowerCase()}`} key={place.name}><span>0{i + 1}</span><div><strong>{place.name}</strong><small>{place.text}</small></div><ArrowUpRight size={22} /></Link>)}</div></section>

    <section className={styles.careSection} aria-labelledby="care-title">
      <div className={styles.contentWidth}><div className={styles.centerHeading}><span className={styles.eyebrow}>THE STAY WILLAS WAY</span><h2 id="care-title">We care about <em>your stay.</em></h2><p>The beautiful home is just the beginning. We help make the rest feel easy.</p></div><div className={styles.reasonGrid}>{reasons.map(({ icon: Icon, title, text }) => <article key={title}><span className={styles.reasonIcon}><Icon size={24} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
    </section>

    <section className={styles.momentsSection} aria-labelledby="moments-title"><div className={styles.contentWidth}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>MORE THAN A PLACE TO STAY</span><h2 id="moments-title">Make it your kind of weekend.</h2><p>A quiet escape, a family catch-up or a reason to celebrate.</p></div></div><div className={styles.momentGrid}>{[
      { title: "Just the two of you", text: "A-frame cottages, a private Jacuzzi and time to slow down.", href: "/villa/willow-peak", label: "Find your cottage" },
      { title: "Everyone together", text: "Room for your people, poolside afternoons and unhurried meals.", href: "/escape", label: "Plan a group escape" },
      { title: "A little celebration", text: "Ask about a special meal, decorations or a thoughtful extra.", href: "/experiences", label: "Explore experiences" },
    ].map((moment, i) => <Link href={moment.href} key={moment.title}><span>0{i + 1}</span><h3>{moment.title}</h3><p>{moment.text}</p><strong>{moment.label} <ArrowUpRight size={16} /></strong></Link>)}</div></div></section>

    <section id="partner" className={styles.partnerSection} aria-labelledby="partner-title"><div className={styles.partnerPanel}><div className={styles.partnerPhoto}><Image src="/assets/villas/the-angle-house/gallery-11.webp" alt="The Angle House, a Stay Willas property with a private pool" fill sizes="(max-width: 850px) 90vw, 45vw" className={styles.cover} /></div><div className={styles.partnerCopy}><span className={styles.eyebrow}>FOR HOMEOWNERS</span><h2 id="partner-title">Your home.<br /><em>Our care.</em><br />A better partnership.</h2><p>Own a villa in Maharashtra? We treat your home like our own. From guest bookings to maintenance and daily operations, let our team help you share it with the world.</p><ul><li><BadgeCheck size={17} /> Thoughtful property care</li><li><Users size={17} /> Guest bookings & hospitality</li><li><HeartHandshake size={17} /> Support with daily operations</li></ul><Link href="/partner" className={styles.partnerButton}>Partner With Us <ArrowRight size={18} /></Link><Link href="/contact" className={styles.partnerContact}>Speak to our team <ArrowUpRight size={15} /></Link></div></div></section>

    <section id="faqs" className={styles.faqSection} aria-labelledby="faq-title"><div className={styles.faqIntro}><span className={styles.eyebrow}>A FEW THINGS TO KNOW</span><h2 id="faq-title">Good questions.<br /><em>Easy answers.</em></h2><p>Everything you need to start planning your stay.</p><a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer">Still wondering? Ask our concierge <ArrowUpRight size={16} /></a></div><div className={styles.faqList}>{faqs.map(faq => <details key={faq.question} name="stay-faq"><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div></section>
  </>;
}

