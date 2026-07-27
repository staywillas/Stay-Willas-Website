"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Check, Plus, Minus, ArrowRight, ShieldCheck, Star, Users, Home, 
  MapPin, Flame, Utensils, Music, Heart, Calendar, ArrowDown, AlertCircle,
  Sparkles, Menu, X, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GhostCursor from "@/components/ui/GhostCursor";
import WarpLines from "@/components/ui/WarpLines";
import Navbar from "@/components/layout/navbar";

interface VillaData {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  weekendPrice?: number | null;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  baseGuests: number;
  extraGuestFee: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
}

interface EscapeClientPageProps {
  angleHouse: VillaData;
  canopyCrest: VillaData;
}

interface ScratchCardProps {
  id: string;
  title: string;
  subtitle: string;
  isUnlocked: boolean;
  onScratchComplete: () => void;
}

function ScratchCard({ id, title, subtitle, isUnlocked, onScratchComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isUnlocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina display resolution scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Fill premium dark charcoal scratch pattern
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#191526");
    gradient.addColorStop(0.3, "#2C2542");
    gradient.addColorStop(0.5, "#141021");
    gradient.addColorStop(0.7, "#221C34");
    gradient.addColorStop(1, "#0D0A14");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw card inner border (gold outline)
    ctx.strokeStyle = "rgba(218, 165, 32, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

    // Draw luxury graphics & text
    ctx.fillStyle = "#FAF8F3";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("STAY WILLAS", rect.width / 2, rect.height / 2 - 25);

    ctx.fillStyle = "#DAA520";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("★ SCRATCH HERE ★", rect.width / 2, rect.height / 2);

    ctx.fillStyle = "#A3A3A3";
    ctx.font = "italic 9px sans-serif";
    ctx.fillText("Unlock Special Detour Discount", rect.width / 2, rect.height / 2 + 25);
  }, [isUnlocked]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isUnlocked) return;
    if (e.cancelable) e.preventDefault();
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    checkScratchPercentage();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || isUnlocked) return;
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const coords = getCoordinates(e);
    if (!canvas || !ctx || !coords) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const percent = (transparentCount / totalPixels) * 100;

    if (percent >= 35) {
      onScratchComplete();
    }
  };

  return (
    <div className="relative w-full h-[160px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#120a24]/80 to-[#1d0e38]/80 border border-[#DAA520]/20 flex flex-col items-center justify-center p-4">
      {/* Revealed discount offer details */}
      <div className="text-center z-0 select-none space-y-1.5 animate-fade-in">
        <Sparkles className="text-[#DAA520] mx-auto animate-pulse" size={22} />
        <span className="text-[10px] uppercase tracking-widest text-[#DAA520] font-bold block">
          {title}
        </span>
        <div className="text-2xl font-black text-white tracking-wide font-heading">
          10% DISCOUNT
        </div>
        <p className="text-[9px] text-white/90 uppercase tracking-widest font-semibold border border-dashed border-[#DAA520]/50 px-3 py-1 rounded bg-[#DAA520]/15 inline-block">
          PROMO: ESCAPE10
        </p>
      </div>

      {/* Scratch Layer */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair z-10 touch-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EscapeClientPage({ angleHouse, canopyCrest }: EscapeClientPageProps) {
  // Filter tabs state
  const [activeTab, setActiveTab] = useState<"family" | "friends" | "romantic" | "corporate">("friends");
  
  // Calculator states
  const [selectedVillaSlug, setSelectedVillaSlug] = useState<string>("the-angle-house");
  const [stayType, setStayType] = useState<"weekday" | "weekend">("weekday");
  const [nights, setNights] = useState<number>(2);
  const [guestsCount, setGuestsCount] = useState<number>(12);

  // Scratch card states
  const [isCard1Scratched, setIsCard1Scratched] = useState(false);
  const [isCard2Scratched, setIsCard2Scratched] = useState(false);
  const isDiscountApplied = isCard1Scratched || isCard2Scratched;
  
  // Active selected villa data helper
  const selectedVilla = selectedVillaSlug === "the-angle-house" ? angleHouse : canopyCrest;

  // Update guests count if selected villa limits are lower than current selection
  useEffect(() => {
    if (guestsCount > selectedVilla.guests) {
      setGuestsCount(selectedVilla.guests);
    }
  }, [selectedVillaSlug, selectedVilla.guests, guestsCount]);

  // Pricing calculations
  const basePricePerNight = stayType === "weekday" ? selectedVilla.price : (selectedVilla.weekendPrice || selectedVilla.price);
  const extraGuestFee = selectedVilla.extraGuestFee || 1200;
  const baseGuestsLimit = selectedVilla.baseGuests || 12;

  const extraGuestsCount = Math.max(0, guestsCount - baseGuestsLimit);
  const baseStayTotal = basePricePerNight * nights;
  const extraGuestsTotal = extraGuestsCount * extraGuestFee * nights;
  const estimatedTotal = baseStayTotal + extraGuestsTotal;

  // 10% discount on weekdays, 0% on weekends
  const discountPercent = (stayType === "weekday" && isDiscountApplied) ? 0.1 : 0;
  const discountAmount = estimatedTotal * discountPercent;
  const finalTotal = estimatedTotal - discountAmount;

  // WhatsApp prefilled message link builder
  const whatsappNumber = "919619042310";
  const whatsappText = (stayType === "weekday" && isDiscountApplied)
    ? `Hello Stay Willas! 🌟 I scratched the Escape card and unlocked my 10% Promo discount!\n\nI am interested in booking *${selectedVilla.name}* in ${selectedVilla.location} for a Weekday stay.\n\n📅 *Stay Details:*\n- Duration: ${nights} Nights (${stayType} stay)\n- Guests: ${guestsCount} Guests\n- Original Tariff: ₹${estimatedTotal.toLocaleString("en-IN")}\n- Promo Discount (10% Off): -₹${discountAmount.toLocaleString("en-IN")}\n- Final Total: ₹${finalTotal.toLocaleString("en-IN")}\n\nCan you please check availability and apply my discount?`
    : `Hello Stay Willas! 🌟 I am interested in booking an exclusive getaway at *${selectedVilla.name}* in ${selectedVilla.location} for a ${stayType === "weekday" ? "Weekday" : "Weekend"} stay.\n\n📅 *Stay Details:*\n- Duration: ${nights} Nights (${stayType} stay)\n- Guests: ${guestsCount} Guests\n- Estimated Total: ₹${estimatedTotal.toLocaleString("en-IN")}\n\nCan you please check availability for our group?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  // Tab definitions
  const tabs = {
    family: {
      headline: "Reconnect where timelines don't clash.",
      description: "Spacious private lawns for children to run free, customized kid-friendly meals prepared by our gourmet chef, and secure, walled estates so parents can truly relax.",
      amenities: ["Dedicated Caretaker", "Kids Activity Area", "Fresh Local Kitchen", "Secured Walled Boundary"]
    },
    friends: {
      headline: "No curfews, no compromises. Just raw connection.",
      description: "Submerge in our cascading infinity pool, light up the barbeque grill on the deck, and blast your favorite playlist under a canopy of stars with absolutely zero interruptions.",
      amenities: ["High-Decibel Sound System", "Open-air BBQ Grill", "Private Swimming Pool", "Spacious Pool Lounges"]
    },
    romantic: {
      headline: "Escape to your private sanctuary.",
      description: "Sip wine overlooking sweeping mountain silhouettes, enjoy a hot bath in your private master suite Jacuzzi, and enjoy absolute quiet with personalized chef service.",
      amenities: ["Private Master Jacuzzi", "Scenic Balconies", "Candlelit Dinners on Call", "Panoramic Glass Views"]
    },
    corporate: {
      headline: "Brainstorm on the grass. Recharge by the pool.",
      description: "High-speed Wi-Fi throughout the villa, wide spaces for team workshops, professional catering, and comfortable double-occupancy bedrooms for team building retreats.",
      amenities: ["Super-fast Wi-Fi", "Lawn Brainstorming Space", "Full Catering & Pantry", "Double-Occupancy Suites"]
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to select villa and scroll to booking section
  const handleSelectVillaForCalculator = (slug: string) => {
    setSelectedVillaSlug(slug);
    const villa = slug === "the-angle-house" ? angleHouse : canopyCrest;
    setGuestsCount(Math.min(12, villa.guests));
    scrollToSection("calculator-section");
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-[#B497CF]/30 selection:text-white relative">
      
      {/* GhostCursor follows the cursor across the entire page */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <GhostCursor
          color="#B497CF"
          brightness={2.0}
          edgeIntensity={0}
          trailLength={20}
          inertia={0.5}
          grainIntensity={0.02}
          bloomStrength={0.05}
          bloomRadius={1}
          bloomThreshold={0.025}
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />
      </div>

      {/* Background visual components */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] rounded-full bg-[#1b1035]/35 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#40186d]/25 blur-[150px]" />
        <div className="absolute top-[40%] right-[-20%] w-[45%] h-[40%] rounded-full bg-[#DAA520]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      </div>

      <Navbar />

      {/* 2. HERO / PSYCHOLOGICAL COPY HOOK */}
      <section className="relative min-h-[105vh] lg:min-h-screen flex flex-col items-center justify-center pt-36 sm:pt-48 pb-16 px-6 text-center overflow-hidden z-10">
        
        {/* Subtle Background Image of The Angle House */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-25 mix-blend-overlay">
          <img 
            src="/assets/villas/the-angle-house/gallery-11.webp" 
            alt="The Angle House Background" 
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
        </div>
        {/* CSS Ambient Glowing Orbs */}
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[30%] rounded-full bg-[#1b1035]/35 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[25%] rounded-full bg-[#40186d]/25 blur-[120px] pointer-events-none" />
        
        {/* WarpLines Interactive Background (60fps, 2D Canvas speed lines) */}
        <div className="absolute inset-0 z-0 opacity-50 select-none pointer-events-auto">
          <WarpLines count={50} baseSpeed={3} colorGold="#DAA520" colorPurple="#B497CF" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#07050d]/80 via-transparent to-[#07050d]" />

        <div className="max-w-5xl mx-auto z-10 w-full flex flex-col items-center gap-10">
          
          {/* Header text container */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <span className="text-[#DAA520] font-semibold tracking-[0.4em] uppercase text-xs sm:text-sm block animate-pulse">
              🍻 crew getaway activated
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.08] text-balance bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Accidentally clicked? Or did your crew just demand a <span className="italic text-[#B497CF] underline decoration-[#DAA520]/40">villa vacation in Lonavala or Khopoli</span>?
            </h1>
            
            <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Stop pretending to work. Scratch the cards below to reveal your secret 10% discount on premium villa rentals in Lonavala and Khopoli. Gather your friends, fire up the BBQ, and book the ultimate pool retreat.
            </p>
          </div>
          {/* SCRATCHCARDS GRID */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-4">
            {/* Card 1: The Angle House Promo */}
            <div className="flex flex-col gap-3">
              <div className="text-left flex items-center justify-between px-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B497CF]">
                  📍 Lonavala Flagship
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#DAA520]">
                  The Angle House
                </span>
              </div>
              <ScratchCard 
                id="card-angle-house"
                title="The Angle House Secret"
                subtitle="Scratch to reveal 10% Lonavala discount"
                isUnlocked={isCard1Scratched}
                onScratchComplete={() => {
                  setIsCard1Scratched(true);
                }}
              />
            </div>

            {/* Card 2: Canopy Crest Promo */}
            <div className="flex flex-col gap-3">
              <div className="text-left flex items-center justify-between px-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B497CF]">
                  📍 Khopoli Flagship
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#DAA520]">
                  Canopy Crest
                </span>
              </div>
              <ScratchCard 
                id="card-canopy-crest"
                title="Canopy Crest Secret"
                subtitle="Scratch to reveal 10% Khopoli discount"
                isUnlocked={isCard2Scratched}
                onScratchComplete={() => {
                  setIsCard2Scratched(true);
                }}
              />
            </div>
          </div>

          {/* Quick Booking Options and Congratulations banner */}
          {isDiscountApplied && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="bg-[#130f24]/50 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-[#DAA520]/30 shadow-[0_0_30px_rgba(218,165,32,0.15)] max-w-2xl w-full mx-auto space-y-6 text-center"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#DAA520] bg-[#DAA520]/10 px-4 py-1.5 rounded-full inline-block border border-[#DAA520]/20">
                  🎉 10% DISCOUNT ACTIVATED (ESCAPE10)
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Your Luxury Escape Awaits!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-light">
                  Select your private villa below to automatically apply the 10% discount and start chatting on WhatsApp instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setSelectedVillaSlug("the-angle-house")}
                  className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedVillaSlug === "the-angle-house"
                      ? "bg-gradient-to-r from-[#DAA520] to-[#C9A84C] text-black border-transparent shadow-[0_0_15px_rgba(218,165,32,0.3)] scale-[1.02]"
                      : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  The Angle House
                </button>
                <button
                  onClick={() => setSelectedVillaSlug("canopy-crest")}
                  className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedVillaSlug === "canopy-crest"
                      ? "bg-gradient-to-r from-[#DAA520] to-[#C9A84C] text-black border-transparent shadow-[0_0_15px_rgba(218,165,32,0.3)] scale-[1.02]"
                      : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  Canopy Crest
                </button>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-full text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.25)] inline-flex items-center gap-3 hover:-translate-y-0.5"
                >
                  <span>Avail Discount & Chat on WhatsApp</span>
                  <ArrowRight size={14} />
                </a>
                <span className="text-[10px] text-slate-400 block mt-3 italic">
                  Estimated price will automatically deduct the 10% promo code details in chat
                </span>
              </div>
            </motion.div>
          )}

          {/* Scroll indicator */}
          {!isDiscountApplied && (
            <div className="pt-4 animate-bounce">
              <button 
                onClick={() => scrollToSection("philosophy-section")}
                className="inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-slate-300 hover:text-[#DAA520] transition-colors focus:outline-none"
              >
                <span>Or scroll to explore</span>
                <ArrowDown size={14} className="text-[#DAA520]" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. IMMERSIVE ROW (THE PHILOSOPHY) */}
      <section id="philosophy-section" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-y border-white/5 relative overflow-hidden z-10 bg-transparent">
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#B497CF]/5 blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-tight">
              Imagine waking up to sweeping mountain silhouettes...
            </h2>
            <div className="w-16 h-0.5 bg-[#DAA520]/30" />
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              No alarms, no deadlines, no screens clamoring for your attention. At Stay Willas, we believe in slow luxury. We build architecture that wraps around the landscape, not the other way around. 
            </p>
            <p className="text-slate-400 text-md leading-relaxed font-light">
              Each estate is hand-curated and fully staffed with premium catering and hospitality, designed specifically to help you disconnect from the routine and reconnect with yourself.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => scrollToSection("properties-section")}
                className="inline-flex items-center gap-3 text-sm font-bold text-[#DAA520] hover:text-white group transition-colors"
              >
                Explore our flagships <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Right Column: Immersive Card Image */}
          <div className="lg:col-span-7">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 aspect-[4/3] sm:aspect-[16/10]">
              <img 
                src="/assets/villas/the-angle-house/gallery-11.webp" 
                alt="The Angle House Lonavala" 
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110" 
              />
              {/* Blur gradient cover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-[#DAA520] font-semibold mb-2">Flagship Sanctuary</span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">The Angle House</h3>
                <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1 font-light">
                  <MapPin size={12} className="text-[#DAA520]" /> Lonavala, Maharashtra
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FLAGSHIP PROPERTIES SHOWCASE */}
      <section id="properties-section" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-16 z-10 relative">
        <div className="text-center space-y-4">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Our Sanctuaries
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Two Main Flagship Properties
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-md font-light">
            We list only the most premium, fully private estates. Here are our top two properties, available for direct booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Property 1: The Angle House */}
          <div className="bg-[#0D0A14]/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#DAA520]/20 shadow-2xl flex flex-col hover:border-[#DAA520]/45 transition-all duration-500 group">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[#DAA520]/15">
              <img 
                src={angleHouse.images[0] || "/assets/villas/the-angle-house/gallery-11.webp"} 
                alt={angleHouse.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-[#DAA520]/35">
                <Star size={12} className="fill-[#DAA520] text-[#DAA520]" /> 4.9 (18 Reviews)
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-12">
                <div className="flex items-center gap-1.5 text-xs text-[#DAA520] uppercase font-bold tracking-wider mb-1">
                  <MapPin size={12} /> {angleHouse.location}
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">{angleHouse.name}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 font-light">
                  An architectural masterpiece. Striking angular facade featuring double-height glass panels that open to a cascading private waterfall swimming pool and an indoor heated Jacuzzi.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-y border-[#DAA520]/15 py-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Bedrooms</span>
                    <span className="font-semibold text-white text-base">{angleHouse.bedrooms} BHK</span>
                  </div>
                  <div className="border-x border-[#DAA520]/15">
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Guests</span>
                    <span className="font-semibold text-white text-base">Up to {angleHouse.guests}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Private Pool</span>
                    <span className="font-semibold text-white text-base">Yes (Waterfall)</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {angleHouse.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="text-[11px] bg-white/5 border border-white/10 text-slate-200 px-3 py-1.5 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#DAA520]/15">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-light">Starting from</span>
                    <span className="text-2xl font-bold text-white">₹{angleHouse.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400 font-light"> / night (Weekday)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-light">Weekend Tariff</span>
                    <span className="text-sm font-semibold text-[#DAA520]">₹{angleHouse.weekendPrice?.toLocaleString("en-IN") || "20,000"}</span>
                    <span className="text-[10px] text-slate-400 block">Fri - Sun</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSelectVillaForCalculator("the-angle-house")}
                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold py-3 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] active:translate-y-0.5 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                  >
                    Select & Quote
                  </button>
                  <Link 
                    href={`/villa/${angleHouse.slug}`}
                    target="_blank"
                    className="w-full border border-[#DAA520]/20 hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
                  >
                    View Villa
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Property 2: Canopy Crest */}
          <div className="bg-[#0D0A14]/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#DAA520]/20 shadow-2xl flex flex-col hover:border-[#DAA520]/45 transition-all duration-500 group">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[#DAA520]/15">
              <img 
                src={canopyCrest.images[0] || "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"} 
                alt={canopyCrest.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-[#DAA520]/35">
                <Star size={12} className="fill-[#DAA520] text-[#DAA520]" /> 4.8 (14 Reviews)
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-12">
                <div className="flex items-center gap-1.5 text-xs text-[#DAA520] uppercase font-bold tracking-wider mb-1">
                  <MapPin size={12} /> {canopyCrest.location}
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">{canopyCrest.name}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 font-light">
                  A sprawling sanctuary enveloped in a lush verdant forest. Features huge manicured lawns, indoor/outdoor sports, open-air BBQ by the pool, and wide windows framing misty green hills.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-y border-[#DAA520]/15 py-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Bedrooms</span>
                    <span className="font-semibold text-white text-base">{canopyCrest.bedrooms} BHK</span>
                  </div>
                  <div className="border-x border-[#DAA520]/15">
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Guests</span>
                    <span className="font-semibold text-white text-base">Up to {canopyCrest.guests}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Private Pool</span>
                    <span className="font-semibold text-white text-base">Yes (Lawnside)</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {canopyCrest.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="text-[11px] bg-white/5 border border-white/10 text-slate-200 px-3 py-1.5 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#DAA520]/15">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-light">Starting from</span>
                    <span className="text-2xl font-bold text-white">₹{canopyCrest.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400 font-light"> / night (Weekday)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-light">Weekend Tariff</span>
                    <span className="text-sm font-semibold text-[#DAA520]">₹{canopyCrest.weekendPrice?.toLocaleString("en-IN") || "22,000"}</span>
                    <span className="text-[10px] text-slate-400 block">Fri - Sun</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSelectVillaForCalculator("canopy-crest")}
                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold py-3 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] active:translate-y-0.5 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                  >
                    Select & Quote
                  </button>
                  <Link 
                    href={`/villa/${canopyCrest.slug}`}
                    target="_blank"
                    className="w-full border border-[#DAA520]/20 hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
                  >
                    View Villa
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC FILTER TABS & INTERACTIVE VALUE MODULE */}
      <section id="calculator-section" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-y border-white/5 relative z-10 bg-transparent">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#DAA520]/5 blur-[130px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
              Tailored Getaway Planner
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
              Build Your Private Escape
            </h2>
            <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
              Customize your booking requirements below. Switch stay styles to explore custom amenities and calculate your pricing.
            </p>
          </div>

          {/* DYNAMIC FILTER TABS */}
          <div className="flex flex-wrap justify-center relative z-20">
            <div className="bg-[#120D1A]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl sm:rounded-full flex flex-wrap gap-2 shadow-2xl justify-center">
              {(["family", "friends", "romantic", "corporate"] as const).map((tab) => {
                const Icon = {
                  family: Home,
                  friends: Users,
                  romantic: Heart,
                  corporate: Briefcase,
                }[tab];
                
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 rounded-xl sm:rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none flex items-center gap-2 relative cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black shadow-lg scale-105"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-black animate-pulse" : "text-[#DAA520]"} />
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Left side: Dynamic Content from Tabs */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8 bg-[#0D0A14]/75 border border-[#DAA520]/20 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-[#DAA520]/45">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#DAA520] tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
                  Recommended Stay Style
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-snug tracking-wide bg-gradient-to-r from-white via-slate-100 to-[#B497CF] bg-clip-text text-transparent">
                  {tabs[activeTab].headline}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed font-light">
                  {tabs[activeTab].description}
                </p>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Included Highlights:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tabs[activeTab].amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-[#DAA520]/15 text-[#DAA520] border border-[#DAA520]/30 flex items-center justify-center shrink-0 shadow-md">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span className="font-semibold">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-start gap-2 italic border-t border-[#DAA520]/10 pt-4">
                <AlertCircle size={14} className="shrink-0 text-[#DAA520] mt-0.5" />
                <span>All Stay Willas properties feature standard premium luxury comforts: air conditioning, high speed Wi-Fi, toiletries, security, and private parking.</span>
              </div>
            </div>

            {/* Right side: Interactive Calculator */}
            <div className="lg:col-span-6">
              <div className="bg-[#0D0A14]/75 border border-[#DAA520]/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between h-full transition-all duration-500 hover:border-[#DAA520]/45">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#DAA520]/15 pb-4">
                    <h3 className="font-heading text-lg font-bold text-white">Estimated Getaway Plan</h3>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-[#DAA520]/15 text-[#DAA520] border border-[#DAA520]/20">
                      Best price guaranteed
                    </span>
                  </div>

                  {/* Villa Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">1. Select Private Villa</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedVillaSlug("the-angle-house")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all duration-300 cursor-pointer ${
                          selectedVillaSlug === "the-angle-house"
                            ? "bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold border-transparent shadow-[0_0_15px_rgba(218,165,32,0.35)] scale-[1.02]"
                            : "border-white/10 text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        The Angle House
                      </button>
                      <button
                        onClick={() => setSelectedVillaSlug("canopy-crest")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all duration-300 cursor-pointer ${
                          selectedVillaSlug === "canopy-crest"
                            ? "bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold border-transparent shadow-[0_0_15px_rgba(218,165,32,0.35)] scale-[1.02]"
                            : "border-white/10 text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        Canopy Crest
                      </button>
                    </div>
                  </div>

                  {/* Stay Type Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">2. Select Stay Period</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setStayType("weekday")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all duration-300 cursor-pointer ${
                          stayType === "weekday"
                            ? "bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold border-transparent shadow-[0_0_15px_rgba(218,165,32,0.35)] scale-[1.02]"
                            : "border-white/10 text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        Weekday (Mon - Thu)
                      </button>
                      <button
                        onClick={() => setStayType("weekend")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all duration-300 cursor-pointer ${
                          stayType === "weekend"
                            ? "bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold border-transparent shadow-[0_0_15px_rgba(218,165,32,0.35)] scale-[1.02]"
                            : "border-white/10 text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        Weekend (Fri - Sun)
                      </button>
                    </div>
                  </div>

                  {/* Steppers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Nights Stepper */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">3. Nights</label>
                      <div className="flex items-center justify-between bg-black/50 rounded-xl p-2 border border-white/10">
                        <button
                          onClick={() => setNights(Math.max(1, nights - 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#DAA520] hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 transition-all duration-200 focus:outline-none cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-heading font-bold text-lg text-white">{nights}</span>
                        <button
                          onClick={() => setNights(Math.min(14, nights + 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#DAA520] hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 transition-all duration-200 focus:outline-none cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Guests Stepper */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                        4. Guests (Max {selectedVilla.guests})
                      </label>
                      <div className="flex items-center justify-between bg-black/50 rounded-xl p-2 border border-white/10">
                        <button
                          onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#DAA520] hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 transition-all duration-200 focus:outline-none cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-heading font-bold text-lg text-white">{guestsCount}</span>
                        <button
                          onClick={() => setGuestsCount(Math.min(selectedVilla.guests, guestsCount + 1))}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#DAA520] hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 transition-all duration-200 focus:outline-none cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Output */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Base Stay ({nights} nights):</span>
                      <span className="font-semibold text-white">₹{baseStayTotal.toLocaleString("en-IN")}</span>
                    </div>
                    {guestsCount > baseGuestsLimit && (
                      <div className="flex justify-between text-slate-300">
                        <span>Extra Guests ({extraGuestsCount} guests x ₹{extraGuestFee}):</span>
                        <span className="font-semibold text-white">₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {isDiscountApplied && stayType === "weekday" && (
                      <div className="flex justify-between text-[#DAA520] font-semibold bg-[#DAA520]/5 p-2 rounded-lg border border-[#DAA520]/25 animate-pulse">
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} className="text-[#DAA520]" />
                          Escape 10% Weekday Discount:
                        </span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {isDiscountApplied && stayType === "weekend" && (
                      <div className="flex justify-between text-slate-400 font-semibold bg-white/5 p-2 rounded-lg border border-white/10">
                        <span className="flex items-center gap-1 text-[11px]">
                          <AlertCircle size={12} className="text-slate-400" />
                          Promo active (No weekend discount)
                        </span>
                        <span>₹0</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Base Villa Tariff includes up to {baseGuestsLimit} guests.</span>
                    </div>
                  </div>

                  <div className="bg-[#120d1c] p-4 rounded-2xl flex items-center justify-between border border-[#DAA520]/25 shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {isDiscountApplied && stayType === "weekday" ? "Est. Discounted Total" : "Est. Base Total"}
                      </span>
                      <div className="text-2xl md:text-3xl font-black text-white font-heading">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </div>
                      {isDiscountApplied && stayType === "weekday" && (
                        <span className="text-[9px] text-[#DAA520] font-bold uppercase tracking-wider block mt-0.5 animate-pulse">
                          Code ESCAPE10 applied
                        </span>
                      )}
                      {isDiscountApplied && stayType === "weekend" && (
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                          ESCAPE10 not applicable on weekends
                        </span>
                      )}
                    </div>
                    
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md text-center inline-flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] active:scale-100 cursor-pointer"
                    >
                      Book Getaway <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. TRUST VERIFICATION BAR */}
      <section className="bg-[#0b0816]/80 backdrop-blur-md text-white py-10 border-y border-white/5 overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Verification elements */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center z-10 relative">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#DAA520] shrink-0" size={24} />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">100% Private Pool Villas</span>
          </div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50 max-md:hidden" />
          
          <div className="flex items-center gap-3">
            <Star className="text-[#DAA520] shrink-0 fill-[#DAA520]" size={24} />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Scenic Spots & Heights</span>
          </div>
          
          <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50 max-md:hidden" />
          
          <div className="flex items-center gap-3">
            <Utensils className="text-[#DAA520] shrink-0" size={24} />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Premium Culinary Chefs</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50 max-md:hidden" />
          
          <div className="flex items-center gap-3">
            <Users className="text-[#DAA520] shrink-0" size={24} />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">5-Star Checked Hospitality</span>
          </div>
        </div>
      </section>

      {/* 6. FINAL HIGH-CONVERSION CTA */}
      <section className="py-28 md:py-36 px-6 text-center relative overflow-hidden bg-transparent z-10">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#B497CF]/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-10 z-10 relative">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Make the Detour Count
          </span>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white tracking-tight leading-tight">
            What if this wasn&apos;t a wrong click?
          </h2>
          
          <p className="max-w-xl mx-auto text-slate-300 text-lg font-light leading-relaxed">
            Maybe this is exactly where you were supposed to land. Browse our complete handpicked selection of premium luxury private estates and start planning your escape.
          </p>

          <div className="pt-4">
            <Link 
              href="/villas"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#DAA520] to-[#C9A84C] text-black px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg hover:scale-105 active:scale-100 transition-all duration-300"
            >
              Explore Handpicked Villas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 800+ Words SEO Rich Content Guide */}
      <section className="py-24 bg-[#0a0712] border-t border-white/5 relative z-10 select-text">
        <div className="max-w-4xl mx-auto px-6 text-left space-y-12">
          
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-4 tracking-tight">
              The Ultimate Guide to Luxury Group Escapes: Lonavala & Khopoli Villa Vacations
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              The concept of weekend getaways near Mumbai and Pune has undergone a massive evolution. Instead of booking multiple detached hotel rooms where groups are separated, travelers are seeking cohesive, private sanctuaries. Selecting premium <strong className="text-[#DAA520] font-semibold">villa rentals in lonavala</strong> provides the space, freedom, and exclusivity required for memorable group getaways. From infinity pools overlooking deep green valley panoramas to customized gourmet meals prepared by dedicated in-house chefs, private estates represent a complete shift in leisure travel. The monsoons turn the surrounding Sahyadri hills into a misty playground, making the quick drive up the ghats an absolute pleasure for friend reunions and family milestone celebrations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Why Lonavala Remains the Flagship Mountain Retreat
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              Lonavala has always been the primary choice for weekenders. Whether it is trekking up the historic Lohagad Fort, enjoying picnics at Pawna Lake, or buying local chikki, there is something for everyone. However, the true luxury experience lies in checking into one of the elite <strong className="text-[#DAA520] font-semibold">villa rentals in lonavala</strong> such as The Angle House. These private pool villas seamlessly combine cutting-edge modern architecture with high-end hospitality services. When planning an escape with friends, features like temperature-controlled pools, spacious deck spaces, and custom sound systems make a massive difference. Opting for modern <strong className="text-[#DAA520] font-semibold">villa rentals in lonavala</strong> ensures your group enjoys complete freedom without hotel curfews or sharing facilities with strangers.
            </p>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Furthermore, the proximity of Lonavala makes it incredibly easy to coordinate travel logistics for large groups. Whether your friends are arriving from different parts of Mumbai or Pune, Lonavala serves as a central meeting point. Many high-end <strong className="text-[#DAA520] font-semibold">villa rentals in lonavala</strong> also offer specialized workspaces and high-speed internet connectivity, making them popular for creative retreats and brainstorming sessions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Discovering Khopoli: The Scenic Forest Sanctuary
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              For groups seeking absolute peace away from tourist crowds, Khopoli is a rising favorite. Situated at the base of Bhor Ghat, it offers pristine scenery, raw forests, and beautiful seasonal waterfalls. If you want a sanctuary where you only hear bird calls and the rustle of leaves, booking premium <strong className="text-[#DAA520] font-semibold">villas in khopoli</strong> is highly recommended. Estates like Canopy Crest offer a dramatic escape from urban density, providing gorgeous mountain-view infinity pools and glass-front layouts that immerse you in nature. The peaceful environment surrounding these <strong className="text-[#DAA520] font-semibold font-bold">villas in khopoli</strong> makes them perfect for nature lovers and groups who want to disconnect from corporate screens.
            </p>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Staying at luxury <strong className="text-[#DAA520] font-semibold font-bold">villas in khopoli</strong> also places you close to thrilling outdoor attractions like Adlabs Imagicaa, making it easy to plan day trips before returning to your private sanctuary. The absolute isolation of these properties ensures your friends can party late into the night on the pool deck without disturbing any neighbors, which is a major advantage when choosing <strong className="text-[#DAA520] font-semibold font-bold">villas in khopoli</strong> for reunions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Key Amenities to Vette for a Perfect Group Getaway
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-4">
              When reviewing potential properties for your group stay, certain amenities are non-negotiable. Whether you are looking at spacious <strong className="text-[#DAA520] font-semibold">villa rentals in lonavala</strong> or quiet <strong className="text-[#DAA520] font-semibold">villas in khopoli</strong>, ensure the property offers:
            </p>
            <ul className="text-xs md:text-sm text-slate-300 space-y-3 pl-5 list-disc font-light">
              <li>
                <strong className="text-white font-semibold">Private Swimming Pools:</strong> Perfect for morning laps or evening pool volleyball with friends.
              </li>
              <li>
                <strong className="text-white font-semibold">In-house Chef Services:</strong> Authentic home-style meals, live barbeques, and late-night snacks prepared fresh on call.
              </li>
              <li>
                <strong className="text-white font-semibold">Entertainment Zones:</strong> Poker tables, pool tables, board games, and home theatre setups.
              </li>
              <li>
                <strong className="text-white font-semibold">High-speed Wi-Fi:</strong> Critical for streaming music, sharing photos, or running remote team meetings.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Booking Your Next Staycation with Stay Willas
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Planning a group getaway should be exciting, not stressful. Vetting caretakers, coordinating food menus, and verifying pool cleanliness are details we handle directly at Stay Willas. Booking verified luxury <strong className="text-[#DAA520] font-semibold font-bold font-heading">villas in khopoli</strong> or Lonavala guarantees that your weekend plays out exactly as shown in photographs. Secure your dates well in advance, particularly during the monsoon and winter seasons when the Sahyadri mountains are at their most beautiful, and let us build the perfect group retreat for you and your friends.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050308]/90 text-white/40 text-xs py-8 border-t border-white/5 text-center px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Stay Willas. All rights reserved. Crafted for slow luxury.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/" className="hover:text-white transition-colors">Home Page</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
