import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Check, Trophy, UtensilsCrossed, Waves } from "lucide-react";
import styles from "./home.module.css";

export default function SlatewoodAnnouncement() {
  return (
    <section
      id="slatewood-announcement"
      className="py-14 sm:py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0e1b35 0%, #0a1426 50%, #070e1c 100%)",
        color: "#f5f2ea",
      }}
      aria-labelledby="slatewood-heading"
    >
      {/* Subtle radial dark gradients for luxury ambience */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #daa520 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[350px] rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #1b3564 0%, transparent 70%)" }}
      />

      <div className={styles.contentWidth}>
        {/* Editorial Top Headline Banner */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[#f5df9e] text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#daa520] shrink-0" />
            <span>New Property Announcement • Coming Soon</span>
          </div>

          <h2
            id="slatewood-heading"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(36px, 5.2vw, 56px)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
              color: "#ffffff",
            }}
          >
            Introducing Slatewood.<br />
            <em style={{ color: "#f5df9e", fontStyle: "italic", fontWeight: 400 }}>
              A new pace of play and quiet.
            </em>
          </h2>

          <p className="text-sm sm:text-base text-[#c5d3e6] leading-relaxed font-light max-w-2xl">
            Our newest handcrafted retreat is coming soon to Maharashtra. Designed around an expansive private swimming pool, a dedicated championship turf for box cricket and games, and signature Stay Willas hospitality.
          </p>
        </div>

        {/* Feature Cards Grid (No Images — Pure Dark Gradient UI with Rest-of-Website Styling) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 text-left">
          {/* Card 1: Private Pool */}
          <div
            className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(24, 42, 77, 0.75) 0%, rgba(13, 24, 44, 0.85) 100%)",
              borderColor: "rgba(218, 165, 32, 0.35)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#daa520]"
                style={{ background: "rgba(218, 165, 32, 0.15)", border: "1px solid rgba(218, 165, 32, 0.3)" }}
              >
                <Waves size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Star Amenity
              </span>
            </div>
            <h3
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}
            >
              Private Swimming Pool
            </h3>
            <p className="text-xs text-[#a3b3c6] leading-relaxed mb-4">
              Expansive pool with built-in underwater evening illumination, shallow lounging shelf, and wooden sun decks.
            </p>
            <ul className="space-y-1.5 text-xs text-[#dce5f0]">
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> 100% private &amp; unshared</li>
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> Sunset mountain backdrop</li>
            </ul>
          </div>

          {/* Card 2: Sports Turf */}
          <div
            className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(20, 48, 44, 0.75) 0%, rgba(10, 26, 24, 0.85) 100%)",
              borderColor: "rgba(52, 211, 153, 0.35)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400"
                style={{ background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)" }}
              >
                <Trophy size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                Star Amenity
              </span>
            </div>
            <h3
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}
            >
              Multi-Sport Turf
            </h3>
            <p className="text-xs text-[#a3b3c6] leading-relaxed mb-4">
              Floodlit synthetic turf designed for competitive box cricket, mini-football, pickleball, and morning yoga.
            </p>
            <ul className="space-y-1.5 text-xs text-[#dce5f0]">
              <li className="flex items-center gap-2"><Check size={13} className="text-emerald-400" /> High perimeter safety nets</li>
              <li className="flex items-center gap-2"><Check size={13} className="text-emerald-400" /> Night match floodlighting</li>
            </ul>
          </div>

          {/* Card 3: Modern Slate & Timber */}
          <div
            className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(24, 42, 77, 0.75) 0%, rgba(13, 24, 44, 0.85) 100%)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-300"
                style={{ background: "rgba(147, 197, 253, 0.12)", border: "1px solid rgba(147, 197, 253, 0.25)" }}
              >
                <Building2 size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Architecture
              </span>
            </div>
            <h3
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}
            >
              Slate &amp; Wood Design
            </h3>
            <p className="text-xs text-[#a3b3c6] leading-relaxed mb-4">
              Textural charcoal slate stone masonry paired with warm natural teak louvers, glass walls, and soaring ceilings.
            </p>
            <ul className="space-y-1.5 text-xs text-[#dce5f0]">
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> Sprawling social lounge</li>
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> Scenic private balconies</li>
            </ul>
          </div>

          {/* Card 4: Chef & Concierge */}
          <div
            className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, rgba(24, 42, 77, 0.75) 0%, rgba(13, 24, 44, 0.85) 100%)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-300"
                style={{ background: "rgba(251, 191, 36, 0.12)", border: "1px solid rgba(251, 191, 36, 0.25)" }}
              >
                <UtensilsCrossed size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Hospitality
              </span>
            </div>
            <h3
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "22px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}
            >
              Chef &amp; Butler Service
            </h3>
            <p className="text-xs text-[#a3b3c6] leading-relaxed mb-4">
              Home-cooked regional Maharashtrian dishes, poolside barbecue evenings, and dedicated on-site estate staff.
            </p>
            <ul className="space-y-1.5 text-xs text-[#dce5f0]">
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> Custom group meal plans</li>
              <li className="flex items-center gap-2"><Check size={13} className="text-[#daa520]" /> 0% platform booking fee</li>
            </ul>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div
          className="p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
          style={{
            background: "linear-gradient(135deg, rgba(14, 27, 53, 0.95) 0%, rgba(9, 17, 34, 0.95) 100%)",
            borderColor: "rgba(218, 165, 32, 0.3)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold text-[#f5df9e] uppercase tracking-wider">
                Interactive Preview Available
              </span>
            </div>
            <h4
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "24px", color: "#ffffff", margin: "0 0 4px" }}
            >
              Experience the Curtains Reveal
            </h4>
            <p className="text-xs text-[#a0b3cb] m-0">
              Open the theatrical curtains on the Slatewood page to explore all amenities and get priority launch privileges.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/slatewood"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md text-center w-full sm:w-auto"
              style={{
                background: "#daa520",
                color: "#142031",
                boxShadow: "0 4px 16px rgba(218, 165, 32, 0.3)",
              }}
            >
              <span>Step Behind the Curtain</span>
              <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/919619042310?text=Hi%20Stay%20Willas%2C%20I%20saw%20the%20Slatewood%20announcement%20on%20your%20website.%20Can%20you%20share%20details%20and%20notify%20me%20when%20it%20opens%20for%20bookings%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold text-white/90 border border-white/15 hover:bg-white/10 transition-all text-center w-full sm:w-auto whitespace-nowrap"
            >
              <span>RSVP via WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
