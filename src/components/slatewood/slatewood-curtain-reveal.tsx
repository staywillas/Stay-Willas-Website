"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  MapPin,
  MessageCircle,
  Phone,
  Trophy,
  Users,
  UtensilsCrossed,
  Waves,
  Eye,
  RotateCcw,
  BedDouble,
  ShieldCheck,
  Mountain,
} from "lucide-react";
import styles from "./slatewood.module.css";

export default function SlatewoodCurtainReveal() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGroup, setRsvpGroup] = useState("8-12");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleCurtains = () => {
    setCurtainsOpen((prev) => !prev);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) return;
    setRsvpSubmitted(true);
  };

  if (!mounted) return null;

  return (
    <div className={styles.stageContainer}>
      {/* ----------------- THEATRICAL CURTAIN SYSTEM (100% CSS & DARK GRADIENTS) ----------------- */}
      <div
        className={`${styles.curtainOverlay} ${curtainsOpen ? styles.curtainsOpen : styles.curtainsClosed}`}
        aria-hidden={curtainsOpen ? "true" : "false"}
      >
        {/* Top Valance / Pelmet */}
        <div className={styles.topPelmet}>
          <div className={styles.pelmetTrim} />
          <div className={styles.pelmetCenterPlaque}>
            <span className={styles.pelmetStar}>✦</span>
            <span>STAY WILLAS • EXCLUSIVE PREVIEW</span>
            <span className={styles.pelmetStar}>✦</span>
          </div>
        </div>

        {/* Left Velvet Curtain with Dark Gradients */}
        <div
          className={`${styles.curtainPanel} ${styles.leftCurtain}`}
          onClick={!curtainsOpen ? toggleCurtains : undefined}
        >
          <div className={styles.velvetFolds} />
          <div className={styles.curtainFringe} />
          <div className={styles.tiebackRopeLeft} />
        </div>

        {/* Right Velvet Curtain with Dark Gradients */}
        <div
          className={`${styles.curtainPanel} ${styles.rightCurtain}`}
          onClick={!curtainsOpen ? toggleCurtains : undefined}
        >
          <div className={styles.velvetFolds} />
          <div className={styles.curtainFringe} />
          <div className={styles.tiebackRopeRight} />
        </div>

        {/* Center Seal / Invitation Medallion (Visible when curtains are closed) */}
        {!curtainsOpen && (
          <div className={styles.centerMedallion} onClick={toggleCurtains}>
            <div className={styles.medallionGlow} />
            <div className={styles.medallionBadge}>
              <div className={styles.medallionInner}>
                <div className={styles.crestHeader}>
                  <span className="w-2 h-2 rounded-full bg-[#daa520] animate-pulse" />
                  <span>UNVEILING SOON</span>
                </div>
                <h1 className={styles.crestTitle}>SLATEWOOD</h1>
                <p className={styles.crestSubtitle}>
                  Luxury Modern Villa with Private Pool &amp; Sports Turf
                </p>

                <div className={styles.medallionAmenities}>
                  <span>🏊 Private Pool</span>
                  <span>•</span>
                  <span>🏏 Sports Turf</span>
                  <span>•</span>
                  <span>🌿 Western Ghats</span>
                </div>

                <button
                  type="button"
                  className={styles.unveilButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCurtains();
                  }}
                  aria-label="Open curtains to unveil Slatewood"
                >
                  <Eye size={16} />
                  <span>Pull Curtains to Unveil</span>
                  <ArrowRight size={16} />
                </button>
                <span className={styles.clickHint}>Tap anywhere on the curtains to open</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Curtain Control (Allows re-drawing or opening the curtains anytime) */}
      <div className={styles.floatingControls}>
        <button
          type="button"
          onClick={toggleCurtains}
          className={styles.curtainTogglePill}
          title={curtainsOpen ? "Draw Curtains Closed" : "Open Curtains"}
          aria-label={curtainsOpen ? "Draw Curtains Closed" : "Open Curtains"}
        >
          {curtainsOpen ? (
            <>
              <RotateCcw size={14} />
              <span>Draw Curtains</span>
            </>
          ) : (
            <>
              <Eye size={14} />
              <span>Open Curtains</span>
            </>
          )}
        </button>
      </div>

      {/* ----------------- THE REVEALED STAGE CONTENT ----------------- */}
      <main className={styles.revealedContent}>
        {/* Navigation Breadcrumb */}
        <div className={styles.pageNav}>
          <Link href="/" className={styles.backLink}>
            ← Return to Home
          </Link>
          <div className={styles.statusBadge}>
            <span className={styles.pulsingDot} />
            <span>Coming Soon • Opening Soon for Bookings</span>
          </div>
        </div>

        {/* Hero Headline Section */}
        <section className={styles.heroSection}>
          <div className={styles.eyebrowContainer}>
            <span className={styles.goldEyebrow}>STAY WILLAS • NEW PROPERTY REVEAL</span>
          </div>
          <h1 className={styles.mainHeading}>
            Slatewood
          </h1>
          <p className={styles.tagline}>
            Where Raw Slate Architecture Meets Warm Timber &amp; Boundless Leisure
          </p>
          <p className={styles.heroLead}>
            A brand-new architectural sanctuary handcrafted for large family holidays, milestone celebrations, and lively weekends. Featuring an Olympic-proportioned private swimming pool, a championship sports turf for box cricket and games, and unhurried Western Ghats mountain mornings.
          </p>

          <div className={styles.heroActions}>
            <a
              href="https://wa.me/919619042310?text=Hi%20Stay%20Willas%2C%20I%20am%20excited%20about%20Slatewood%20coming%20soon!%20Please%20put%20me%20on%20the%20priority%20list%20for%20dates%20and%20rates."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryWhatsappBtn}
            >
              <MessageCircle size={18} />
              <span>Get Priority VIP Access on WhatsApp</span>
            </a>
            <a href="#amenities" className={styles.secondaryExploreBtn}>
              <span>Explore Amenities</span>
              <ChevronDown size={17} />
            </a>
          </div>
        </section>

        {/* Architectural Showcase Banner (Pure Dark Gradient UI — No Images) */}
        <section className={styles.architecturalShowcase}>
          <div className={styles.showcaseGlow} />
          <div className={styles.showcaseContent}>
            <div className={styles.showcaseHeader}>
              <div>
                <span className={styles.subEyebrow}>VILLA BLUEPRINT &amp; SPECS</span>
                <h2>Crafted for Togetherness. Finished in Slate &amp; Teak.</h2>
              </div>
              <span className={styles.exclusiveBadge}>
                <Compass size={13} /> Handcrafted Design
              </span>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <Waves size={20} className="text-[#daa520]" />
                </div>
                <div className={styles.specDetails}>
                  <strong>Private Swimming Pool</strong>
                  <p>Sunken sun deck, waterfall feature &amp; ambient underwater night glow</p>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <Trophy size={20} className="text-emerald-400" />
                </div>
                <div className={styles.specDetails}>
                  <strong>Championship Sports Turf</strong>
                  <p>Enclosed all-weather turf with floodlights for box cricket &amp; mini-football</p>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <Mountain size={20} className="text-blue-300" />
                </div>
                <div className={styles.specDetails}>
                  <strong>Western Ghats Setting</strong>
                  <p>Serene mountain valley air, lush green surroundings &amp; star-filled nights</p>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <Users size={20} className="text-amber-300" />
                </div>
                <div className={styles.specDetails}>
                  <strong>Up to 16–20 Guests</strong>
                  <p>Spacious air-conditioned bedrooms, private ensuite baths &amp; wide balconies</p>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <UtensilsCrossed size={20} className="text-amber-400" />
                </div>
                <div className={styles.specDetails}>
                  <strong>In-Villa Chef &amp; Butler</strong>
                  <p>Fresh home-style Maharashtrian meals, barbecue grills &amp; personalized service</p>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIconWrap}>
                  <ShieldCheck size={20} className="text-emerald-300" />
                </div>
                <div className={styles.specDetails}>
                  <strong>0% Platform Booking Fee</strong>
                  <p>Verified Stay Willas property care with direct transparent pricing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Amenities Deep Dive (Featuring Pool and Turf prominently) */}
        <section id="amenities" className={styles.amenitiesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.subEyebrow}>SIGNATURE AMENITIES</span>
            <h2>Built for Play. Designed for Peace.</h2>
            <p>Every corner of Slatewood has been thoughtfully planned to balance high-energy sport matches with restorative poolside comfort.</p>
          </div>

          <div className={styles.amenitiesGrid}>
            {/* Pool Feature Card */}
            <article className={`${styles.amenityCard} ${styles.amenityHighlightPool}`}>
              <div className={styles.amenityIconWrap}>
                <Waves size={26} className="text-cyan-400" />
              </div>
              <span className={styles.amenityTag}>Star Amenity</span>
              <h3>Private Infinity Pool</h3>
              <p>
                A crystal-clear private pool surrounded by natural teakwood sun decks, built-in underwater night illumination, and sunken loungers. Step right from the living pavilion into cool waters as twilight settles over the hills.
              </p>
              <ul className={styles.cardBulletList}>
                <li><Check size={14} className="text-cyan-400" /> 100% private and unshared exclusively for your group</li>
                <li><Check size={14} className="text-cyan-400" /> Built-in shallow lounging shelf &amp; deep lap zone</li>
                <li><Check size={14} className="text-cyan-400" /> Outdoor poolside rain shower &amp; sunset recliners</li>
              </ul>
            </article>

            {/* Sports Turf Feature Card */}
            <article className={`${styles.amenityCard} ${styles.amenityHighlightTurf}`}>
              <div className={styles.amenityIconWrap}>
                <Trophy size={26} className="text-emerald-400" />
              </div>
              <span className={styles.amenityTagTurf}>Star Amenity</span>
              <h3>Championship Sports Turf</h3>
              <p>
                Your own private all-weather multi-sport turf with high-perimeter safety nets and bright floodlighting. Gather the family for a thrilling gully cricket tournament, futsal match, badminton rally, or morning yoga with mountain breezes.
              </p>
              <ul className={styles.cardBulletList}>
                <li><Check size={14} className="text-emerald-400" /> Floodlit for evening and late-night box cricket</li>
                <li><Check size={14} className="text-emerald-400" /> Equipment provided: cricket kit, footballs &amp; racquets</li>
                <li><Check size={14} className="text-emerald-400" /> Safe shock-absorbent synthetic turf for all ages</li>
              </ul>
            </article>

            {/* Architecture Card */}
            <article className={styles.amenityCard}>
              <div className={styles.amenityIconWrap}>
                <Compass size={24} className="text-amber-400" />
              </div>
              <h3>Modern Slate &amp; Wood Architecture</h3>
              <p>
                Dressed in textural charcoal slate masonry and warm vertical timber louvers. Soaring ceilings, expansive glass facades, and cantilevered roof overhangs frame uninterrupted valley views from every room.
              </p>
              <ul className={styles.cardBulletList}>
                <li><Check size={14} className="text-[#daa520]" /> Monolithic natural stone &amp; teak detailing</li>
                <li><Check size={14} className="text-[#daa520]" /> Sprawling air-conditioned social lounges</li>
                <li><Check size={14} className="text-[#daa520]" /> Panoramic private balconies in every suite</li>
              </ul>
            </article>

            {/* Hospitality Card */}
            <article className={styles.amenityCard}>
              <div className={styles.amenityIconWrap}>
                <UtensilsCrossed size={24} className="text-amber-300" />
              </div>
              <h3>Private Chef &amp; Butler Hospitality</h3>
              <p>
                Enjoy freshly cooked home-style Maharashtrian specialties, barbecue grills by the poolside, and warm attentive service from our dedicated on-site villa staff.
              </p>
              <ul className={styles.cardBulletList}>
                <li><Check size={14} className="text-[#daa520]" /> Custom multi-course breakfast, lunch &amp; dinner</li>
                <li><Check size={14} className="text-[#daa520]" /> Evening barbecue setup by the pool deck</li>
                <li><Check size={14} className="text-[#daa520]" /> 100% verified Stay Willas property care</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Priority RSVP & Early Launch Access Section */}
        <section className={styles.rsvpSection}>
          <div className={styles.rsvpCard}>
            <div className={styles.rsvpGlow} />
            <div className={styles.rsvpHeader}>
              <span className={styles.rsvpBadge}>
                <ShieldCheck size={14} /> VIP Priority Access
              </span>
              <h2>Be First to Step Inside Slatewood</h2>
              <p>
                Join our private launch guestlist. You’ll receive early booking dates, inaugural stay privileges, and guaranteed direct pricing before the property is listed publicly.
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className={styles.rsvpSuccess}>
                <CheckCircle2 size={42} className="text-emerald-400 mx-auto mb-3" />
                <h3>You’re on the Priority Guestlist!</h3>
                <p>
                  Thank you, <strong>{rsvpName}</strong>. Our concierge team has registered your contact ({rsvpPhone}). We will reach out with first-look booking privileges as soon as the launch calendar is unveiled.
                </p>
                <a
                  href={`https://wa.me/919619042310?text=Hi%20Stay%20Willas%2C%20I%20just%20RSVP%27d%20for%20Slatewood%20on%20your%20website!%20My%20name%20is%20${encodeURIComponent(rsvpName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappFollowup}
                >
                  <MessageCircle size={16} />
                  <span>Connect with Concierge on WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className={styles.rsvpForm}>
                <div className={styles.formRow}>
                  <label>
                    <span>Full Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>WhatsApp / Phone Number *</span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                    />
                  </label>
                </div>

                <div className={styles.formRowSingle}>
                  <label>
                    <span>Expected Group Size</span>
                    <select
                      value={rsvpGroup}
                      onChange={(e) => setRsvpGroup(e.target.value)}
                    >
                      <option value="4-8">Small Family (4–8 Guests)</option>
                      <option value="8-12">Medium Group (8–12 Guests)</option>
                      <option value="12-16">Large Reunion / Friends (12–16 Guests)</option>
                      <option value="16+">Extended Celebration (16+ Guests)</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className={styles.rsvpSubmitBtn}>
                  <CheckCircle2 size={17} />
                  <span>Register for Inaugural Launch Privileges</span>
                  <ArrowRight size={17} />
                </button>
                <small className={styles.privacyNote}>
                  🔒 Zero spam. We will only contact you regarding Slatewood launch dates and exclusive rates.
                </small>
              </form>
            )}

            {/* Quick Contact Line */}
            <div className={styles.quickContactRow}>
              <span>Prefer speaking directly?</span>
              <a href="tel:+919619042310">
                <Phone size={14} /> Call Concierge (+91 96190 42310)
              </a>
            </div>
          </div>
        </section>

        {/* Back Link Footer Bar */}
        <section className={styles.bottomNavSection}>
          <div className={styles.bottomNavInner}>
            <div>
              <h3>Looking for a stay right now?</h3>
              <p>Explore our active collection of private pool villas and Jacuzzi chalets in Lonavala, Khopoli &amp; Panchgani.</p>
            </div>
            <Link href="/villas" className={styles.exploreAllBtn}>
              <span>Browse Active Stays</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
