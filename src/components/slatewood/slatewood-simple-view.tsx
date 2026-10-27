import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Home, Trophy, UtensilsCrossed, Waves } from "lucide-react";
import Footer from "@/components/layout/footer";
import styles from "./slatewood-page.module.css";

const whatsappUrl =
  "https://wa.me/919619042310?text=Hi%20Stay%20Willas%2C%20I%27d%20like%20to%20know%20more%20about%20Slatewood%20and%20its%20launch%20dates.";

const features = [
  {
    icon: Waves,
    title: "A pool made for long afternoons",
    description: "Cool off, stretch out on the sun deck and leave a little space in the day for doing nothing.",
  },
  {
    icon: Trophy,
    title: "A turf for friendly rivalry",
    description: "A private, floodlit sports turf for box cricket, mini-football and games with your group.",
  },
  {
    icon: Home,
    title: "Room to settle in together",
    description: "Slate and teak details, generous shared spaces and private balconies shape the stay.",
  },
  {
    icon: UtensilsCrossed,
    title: "Thoughtful hosting, throughout",
    description: "An in-villa chef and caretaker help with meals, barbecue evenings and the small details.",
  },
];

export default function SlatewoodSimpleView() {
  return (
    <>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="slatewood-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A new Stay Willas retreat</p>
            <h1 id="slatewood-title">
              Make room for
              <br />
              <em>play and pause.</em>
            </h1>
            <p className={styles.heroDescription}>
              Slatewood brings a private pool, a floodlit sports turf and the
              easy care of Stay Willas hosting together for your next group
              escape.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Ask about Slatewood <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className={styles.textButton} href="#the-stay">
                Explore the stay <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className={styles.comingSoon}>
              <span aria-hidden="true" /> Coming soon to Maharashtra
            </p>

            <ul className={styles.heroHighlights} aria-label="Slatewood highlights">
              <li><span className={styles.highlightIndex}>01</span>Private pool</li>
              <li><span className={styles.highlightIndex}>02</span>Floodlit sports turf</li>
              <li><span className={styles.highlightIndex}>03</span>Stay Willas hosting</li>
            </ul>
          </div>
        </section>

        <section className={styles.staySection} id="the-stay" aria-labelledby="stay-title">
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>A weekend with more ways to unwind</p>
            <h2 id="stay-title">Bring your people.<br />Set your own pace.</h2>
            <p>
              Start with a match on the turf, drift over to the pool, then let
              dinner take its time. Slatewood is being shaped for shared plans
              and unhurried hours in between.
            </p>
          </div>

          <div className={styles.featureList}>
            {features.map(({ icon: Icon, title, description }, index) => (
              <article className={styles.feature} key={title}>
                <span className={styles.featureIndex}>0{index + 1}</span>
                <div className={styles.featureIcon}><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
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
            <h2 id="concierge-title">Be first to hear when Slatewood opens.</h2>
            <p>Our concierge can share launch updates and help you plan a group stay.</p>
          </div>
          <div className={styles.conciergeActions}>
            <a className={styles.lightButton} href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Message the concierge <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link className={styles.homeLink} href="/">
              Explore current stays <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
