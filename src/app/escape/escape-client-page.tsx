"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Check, Plus, Minus, ArrowRight, ShieldCheck, Star, Users, Home, 
  MapPin, Flame, Utensils, Music, Heart, Calendar, ArrowDown, AlertCircle,
  Sparkles, Menu, X, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
const GhostCursor = dynamic(() => import('@/components/ui/GhostCursor'), { ssr: false });
import WarpLines from "@/components/ui/WarpLines";
import Navbar from "@/components/layout/navbar";
import QuickMobileLeadForm from "@/components/common/quick-mobile-lead-form";
import MegaDiscountAdBanner from "@/components/common/mega-discount-ad-banner";
import Image from "next/image";

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
          28% DISCOUNT
        </div>
        <p className="text-[9px] text-white/90 uppercase tracking-widest font-semibold border border-dashed border-[#DAA520]/50 px-3 py-1 rounded bg-[#DAA520]/15 inline-block">
          PROMO: STAYW28
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

  // 28% discount with promo coupon
  const discountPercent = isDiscountApplied ? 0.28 : 0;
  const discountAmount = Math.round(estimatedTotal * discountPercent);
  const finalTotal = Math.max(0, estimatedTotal - discountAmount);

  // WhatsApp prefilled message link builder
  const whatsappNumber = "919619042310";
  const whatsappText = isDiscountApplied
    ? `Hello Stay Willas! 🌟 I unlocked the special *28% OFF* Promo discount (Coupon: *STAYW28*)!\n\nI am interested in booking *${selectedVilla.name}* in ${selectedVilla.location}.\n\n📅 *Stay Details:*\n- Duration: ${nights} Nights (${stayType} stay)\n- Guests: ${guestsCount} Guests\n- Original Tariff: ₹${estimatedTotal.toLocaleString("en-IN")}\n- Promo Discount (28% Off): -₹${discountAmount.toLocaleString("en-IN")}\n- Final Discounted Total: ₹${finalTotal.toLocaleString("en-IN")}\n\nCan you please check availability and confirm our 28% discount?`
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
      <section className="relative min-h-[105vh] lg:min-h-screen flex flex-col items-center justify-center pt-40 sm:pt-52 pb-16 px-6 text-center overflow-hidden z-10">
        
        {/* Subtle Background Image of The Angle House */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-25 mix-blend-overlay">
          <Image 
            src="/assets/villas/the-angle-house/gallery-11.webp" 
            alt="The Angle House Background" 
            fill
            className="object-cover filter brightness-[0.4]"
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
              🍻 GROUP ESCAPE SPECIAL • 28% OFF CODE: STAYW28
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.08] text-balance bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Villas for Groups in <span className="italic text-[#B497CF] underline decoration-[#DAA520]/40">Lonavala</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Private pool villas for friends, families and celebrations, with spacious stays, premium amenities and everything your group needs for a memorable weekend.
            </p>

            <p className="text-xs sm:text-sm text-[#B497CF] font-medium tracking-wide italic">
              "Accidentally clicked? Or did your crew just demand a villa vacation in Lonavala?"
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection("properties-section")}
                className="bg-white hover:bg-slate-100 border-2 border-white/40 text-black font-black px-7 py-3.5 rounded-full text-xs tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>View Villas Specs & Photos</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => scrollToSection("properties-section")}
                className="bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold px-7 py-3.5 rounded-full text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.4)] hover:scale-105 active:scale-100 cursor-pointer"
              >
                Explore Group Villas
              </button>
              <button
                onClick={() => scrollToSection("calculator-section")}
                className="border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                Check Rates & 28% Off
              </button>
            </div>
          </div>

          {/* Quick 1-Field Mobile Contact Form */}
          <div className="w-full max-w-3xl px-4">
            <QuickMobileLeadForm 
              villaName="Group Luxury Villas" 
              location="Lonavala & Khopoli" 
              defaultCoupon="STAYW28" 
              discountPercent={28} 
            />
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
                subtitle="Scratch to reveal 28% Lonavala discount"
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
                subtitle="Scratch to reveal 28% Khopoli discount"
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
                  🎉 28% DISCOUNT ACTIVATED (STAYW28)
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-white">
                  Your Luxury Escape Awaits!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-light">
                  Select your private villa below to automatically apply the 28% discount and start chatting on WhatsApp instantly.
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

      {/* GROUP-FIT USE CASES SECTION */}
      <section id="group-fit-section" className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Tailored Group Experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Built for Group Getaways
          </h2>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            Whether reuniting with old friends or celebrating a family milestone, our estates are designed to bring groups together in complete privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Friends' Weekend",
              icon: Users,
              desc: "Unwind by your private pool, enjoy outdoor BBQ spreads, and enjoy late-night music under starry mountain skies."
            },
            {
              title: "Family Getaway",
              icon: Home,
              desc: "Multi-generational family stays featuring ground-floor suites for elders, manicured lawns for kids, and custom chef meals."
            },
            {
              title: "Birthday Celebration",
              icon: Sparkles,
              desc: "Host milestone birthday gatherings with private pool deck setups, custom lighting, and dedicated in-house caretakers."
            },
            {
              title: "Bachelor / Bachelorette",
              icon: Flame,
              desc: "Exclusive pre-wedding retreats offering complete privacy, high-decibel audio setups, and absolute freedom with zero hotel curfews."
            },
            {
              title: "Couple & Friends Trip",
              icon: Heart,
              desc: "Multi-couple weekend escapes featuring separate private master suites alongside expansive double-height common lounges."
            },
            {
              title: "Corporate Retreat",
              icon: Briefcase,
              desc: "Offsite team strategy sessions with high-speed Wi-Fi, quiet lawn brainstorming zones, and customized multi-course dining."
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className="bg-[#0D0A14]/80 border border-[#DAA520]/20 rounded-3xl p-6 md:p-8 space-y-4 hover:border-[#DAA520]/50 transition-all duration-300 shadow-xl group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 border border-[#DAA520]/30 flex items-center justify-center text-[#DAA520] group-hover:scale-110 transition-transform">
                <card.icon size={22} />
              </div>
              <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#DAA520] transition-colors">{card.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{card.desc}</p>
            </div>
          ))}
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
              <Image 
                src="/assets/villas/the-angle-house/gallery-11.webp" 
                alt="The Angle House Lonavala" 
                fill
                className="object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110" 
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
            Handpicked Group Sanctuaries
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Best Villas for Groups in Lonavala
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-md font-light">
            Discover our premier group-friendly properties featuring exclusive private pools, generous living spaces, and dedicated chef hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Property 1: The Angle House */}
          <div className="bg-[#0D0A14]/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#DAA520]/20 shadow-2xl flex flex-col hover:border-[#DAA520]/45 transition-all duration-500 group">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[#DAA520]/15">
              <Image 
                src={angleHouse.images[0] || "/assets/villas/the-angle-house/gallery-11.webp"} 
                alt={angleHouse.name} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
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
                    <span className="text-[10px] text-amber-400/90 block italic mt-0.5">*Prices may vary due to demand</span>
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
                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold py-3 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] active:translate-y-0.5 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer flex items-center justify-center gap-1"
                  >
                    Check Availability
                  </button>
                  <Link 
                    href={`/villa/${angleHouse.slug}#booking-card-section`}
                    target="_blank"
                    className="w-full border border-[#DAA520]/20 hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
                  >
                    View Villa & Dates
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Property 2: Canopy Crest */}
          <div className="bg-[#0D0A14]/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#DAA520]/20 shadow-2xl flex flex-col hover:border-[#DAA520]/45 transition-all duration-500 group">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-[#DAA520]/15">
              <Image 
                src={canopyCrest.images[0] || "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"} 
                alt={canopyCrest.name} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
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
                    <span className="text-[10px] text-amber-400/90 block italic mt-0.5">*Prices may vary due to demand</span>
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
                    className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-black font-extrabold py-3 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-[0_0_15px_rgba(218,165,32,0.3)] active:translate-y-0.5 hover:-translate-y-0.5 hover:brightness-110 cursor-pointer flex items-center justify-center gap-1"
                  >
                    Check Availability
                  </button>
                  <Link 
                    href={`/villa/${canopyCrest.slug}#booking-card-section`}
                    target="_blank"
                    className="w-full border border-[#DAA520]/20 hover:border-[#DAA520]/50 hover:bg-[#DAA520]/5 text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
                  >
                    View Villa & Dates
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE A VILLA FOR GROUPS */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Group Living Advantages
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Why Choose a Villa for Your Group Stay?
          </h2>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            Skip cramped hotel corridors and shared amenities. Private villas offer the freedom and togetherness your group deserves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <ShieldCheck className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">Absolute Seclusion</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Your group gets an entire private property with dedicated staff rather than separate hotel rooms spread across floors.
            </p>
          </div>
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <Home className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">Generous Living Spaces</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Double-height central lounges, manicured green lawns, and dining tables designed specifically for everyone to gather.
            </p>
          </div>
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <Sparkles className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">Exclusive Swimming Pools</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Enjoy private swimming pools with waterfall cascades and lounge decks reserved exclusively for your group&apos;s stay.
            </p>
          </div>
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <Utensils className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">In-Villa Chef Hospitality</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Freshly prepared Maharashtrian spreads, outdoor barbecues, and Jain meals cooked directly in the villa kitchen.
            </p>
          </div>
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <Music className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">Shared Games & Music</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Play board games, outdoor lawn sports, or listen to music on high-decibel speaker systems without hotel curfews.
            </p>
          </div>
          <div className="bg-[#0D0A14]/75 border border-white/10 p-8 rounded-3xl space-y-3">
            <Calendar className="text-[#DAA520] w-8 h-8" />
            <h3 className="text-lg font-heading font-bold text-white">Flexible Weekend Schedules</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Set your own breakfast times, enjoy midnight pool dips, and relax at your group&apos;s natural pace.
            </p>
          </div>
        </div>
      </section>

      {/* GROUP SIZE CAPACITY SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Capacity Guide
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            What Size Group Can Stay?
          </h2>
          <p className="max-w-xl mx-auto text-slate-300 text-sm font-light">
            We offer properties tailored to small family groups, medium-sized friend gatherings, and large corporate retreats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0D0A14]/80 border border-[#DAA520]/20 p-8 rounded-3xl space-y-4 text-center">
            <span className="text-3xl font-heading font-black text-[#DAA520]">6 – 8 Guests</span>
            <h3 className="text-lg font-bold text-white">Intimate Family & Friend Groups</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Ideal for small family reunions or double-date getaways wanting private 3 BHK luxury with a private waterfall pool.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#B497CF]">Recommended: The Angle House (Lonavala)</div>
          </div>

          <div className="bg-[#0D0A14]/80 border border-[#DAA520]/20 p-8 rounded-3xl space-y-4 text-center">
            <span className="text-3xl font-heading font-black text-[#DAA520]">8 – 12 Guests</span>
            <h3 className="text-lg font-bold text-white">Standard Group Staycations</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Comfortably fits within the base guest allocation for both of our flagship estates with no extra guest fees required.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#B497CF]">Recommended: The Angle House or Canopy Crest</div>
          </div>

          <div className="bg-[#0D0A14]/80 border border-[#DAA520]/20 p-8 rounded-3xl space-y-4 text-center">
            <span className="text-3xl font-heading font-black text-[#DAA520]">12 – 20 Guests</span>
            <h3 className="text-lg font-bold text-white">Large Group Celebrations</h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Sprawling 4 BHK estate setup featuring large grassy lawns, multi-bath suites, and capacity for up to 20 guests.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#B497CF]">Recommended: Canopy Crest (Khopoli)</div>
          </div>
        </div>
      </section>

      {/* PRIVATE POOL SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <div className="bg-gradient-to-r from-[#120a24] via-[#1a0f35] to-[#120a24] border border-[#DAA520]/30 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#DAA520]">
            Exclusive Pool Comfort
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
            Private Pool Villas for Groups
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Having your own temperature-filtered swimming pool transforms a standard weekend trip into a memorable celebration. Whether swimming morning laps or hosting evening deck barbecues, our pool setups belong exclusively to your crew.
          </p>
          <div className="pt-2">
            <Link 
              href="/villas-in-lonavala-with-private-pool"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#DAA520] hover:text-white underline transition-colors"
            >
              Explore villas in Lonavala with private pools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WEEKEND GETAWAY & LONAVALA DESTINATION SECTION */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative z-10 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Box 1 */}
          <div className="bg-[#0D0A14]/80 border border-white/10 p-8 md:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Plan a Weekend Villa Getaway in Lonavala
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Planning a weekend villa in Lonavala is the fastest way to reset after a hectic work week in Mumbai or Pune. Located just a scenic 2-hour drive via the Expressway, Lonavala allows groups to escape the city noise without spending half their weekend stuck in transit.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              From Friday evening arrival to Sunday afternoon poolside brunch, spending a weekend villa staycation with your favorite people creates lasting memories.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-[#0D0A14]/80 border border-white/10 p-8 md:p-10 rounded-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Why Lonavala Works for a Group Getaway
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Lonavala combines cool Sahyadri mountain breezes, mist-laden valleys, and convenient highway access. Groups can easily explore local viewpoints like Tiger Point, visit Pawna Lake, or trek up Lohagad Fort before returning to their private villa.
            </p>
            <div className="pt-2">
              <Link 
                href="/areas/lonavala"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DAA520] hover:text-white underline transition-colors"
              >
                Explore luxury villas in Lonavala <ArrowRight size={14} />
              </Link>
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
                    {isDiscountApplied && (
                      <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={13} className="text-[#DAA520]" />
                          Special 28% Promo Discount:
                        </span>
                        <span className="font-black text-emerald-300">-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Base Villa Tariff includes up to {baseGuestsLimit} guests.</span>
                    </div>

                    {/* Coupon Apply Box */}
                    <div className="bg-[#120d1c] p-3 rounded-xl border border-[#DAA520]/25 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs">🏷️</span>
                        <span className="text-xs text-slate-300 font-bold uppercase">Code: <strong className="text-[#DAA520]">STAYW28</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCard1Scratched(true);
                          setIsCard2Scratched(true);
                        }}
                        className="bg-[#DAA520] hover:bg-[#c4941a] text-black px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                      >
                        {isDiscountApplied ? "✓ 28% Applied" : "Apply 28% Off"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#120d1c] p-4 rounded-2xl flex items-center justify-between border border-[#DAA520]/25 shadow-lg">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {isDiscountApplied ? "Est. 28% Discounted Total" : "Est. Base Total"}
                      </span>
                      <div className="text-2xl md:text-3xl font-black text-white font-heading">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </div>
                      {isDiscountApplied && (
                        <span className="text-[9px] text-[#DAA520] font-bold uppercase tracking-wider block mt-0.5 animate-pulse">
                          Code STAYW28 applied (28% OFF)
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
        
        <div className="max-w-3xl mx-auto space-y-8 z-10 relative">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Make Your Group Escape Happen
          </span>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white tracking-tight leading-tight">
            Ready for Your Group Escape?
          </h2>
          
          <p className="max-w-xl mx-auto text-slate-300 text-lg font-light leading-relaxed">
            Bring your friends, family or crew and make your next Lonavala weekend a private villa experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection("properties-section")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#DAA520] to-[#C9A84C] text-black px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg hover:scale-105 active:scale-100 transition-all duration-300 cursor-pointer"
            >
              Explore Group Villas
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection("calculator-section")}
              className="inline-flex items-center gap-3 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
            >
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* GROUP FAQs SECTION WITH STRUCTURED DATA */}
      <section className="py-24 px-6 md:px-12 bg-[#090613] border-t border-white/5 relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What are the best villas for groups in Lonavala?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "StayWillas offers premier villas for groups in Lonavala including The Angle House (3 BHK, up to 12 guests with private waterfall pool) and Canopy Crest (4 BHK, up to 16 guests with sprawling lawns and private pool)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How many guests can stay in a StayWillas group villa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our group villas comfortably accommodate groups ranging from 4 to 16 guests depending on the property selected. Canopy Crest accommodates up to 16 guests, while The Angle House accommodates up to 12 guests."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do the group villas feature private swimming pools?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, 100% of our featured group villas include exclusive, temperature-filtered private swimming pools with sun loungers and deck spaces reserved solely for your group."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are StayWillas villas suitable for family groups and reunions?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Our properties feature ground-floor bedrooms for elders, manicured grassy lawns for children, spacious common lounges, and dedicated caretaker support for family gatherings."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I book a weekend villa in Lonavala for my group?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can easily check weekend availability and reserve group stays via our website or directly with our StayWillas concierge team on WhatsApp."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are group celebrations allowed at the villas?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Gatherings and celebrations for registered guests are welcome. Dedicated caretakers and on-site chefs can help set up poolside barbecues and dining spreads."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How far are the group villas from Mumbai and Pune?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All StayWillas villas are located within a 90-minute to 2-hour drive from Mumbai and Pune via the Mumbai-Pune Expressway."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can we arrange food or an in-house chef for our group?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, customized meals, live barbeques, and pure-vegetarian or Jain preparations are prepared fresh by on-site culinary staff inside the villa kitchen."
                  }
                }
              ]
            })
          }}
        />

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">Frequently Asked Questions</h2>
            <div className="w-12 h-0.5 bg-[#DAA520]/40 mx-auto" />
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What are the best villas for groups in Lonavala?",
                a: "StayWillas offers premier villas for groups in Lonavala including The Angle House (3 BHK, up to 12 guests with private waterfall pool) and Canopy Crest (4 BHK, up to 16 guests with sprawling lawns and private pool)."
              },
              {
                q: "How many guests can stay in a StayWillas group villa?",
                a: "Our group villas comfortably accommodate groups ranging from 4 to 16 guests depending on the property selected. Canopy Crest accommodates up to 16 guests, while The Angle House accommodates up to 12 guests."
              },
              {
                q: "Do the group villas feature private swimming pools?",
                a: "Yes, 100% of our featured group villas include exclusive, temperature-filtered private swimming pools with sun loungers and deck spaces reserved solely for your group."
              },
              {
                q: "Are StayWillas villas suitable for family groups and reunions?",
                a: "Absolutely. Our properties feature ground-floor bedrooms for elders, manicured grassy lawns for children, spacious common lounges, and dedicated caretaker support for family gatherings."
              },
              {
                q: "Can I book a weekend villa in Lonavala for my group?",
                a: "Yes, you can easily check weekend availability and reserve group stays via our website or directly with our StayWillas concierge team on WhatsApp."
              },
              {
                q: "Are group celebrations allowed at the villas?",
                a: "Gatherings and celebrations for registered guests are welcome. Dedicated caretakers and on-site chefs can help set up poolside barbecues and dining spreads."
              },
              {
                q: "How far are the group villas from Mumbai and Pune?",
                a: "All StayWillas villas are located within a 90-minute to 2-hour drive from Mumbai and Pune via the Mumbai-Pune Expressway."
              },
              {
                q: "Can we arrange food or an in-house chef for our group?",
                a: "Yes, customized meals, live barbeques, and pure-vegetarian or Jain preparations are prepared fresh by on-site culinary staff inside the villa kitchen."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#120a24]/80 border border-white/10 rounded-2xl p-6 space-y-2">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <span className="text-[#DAA520]">Q:</span> {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 800+ Words SEO Rich Content Guide */}
      <section className="py-24 bg-[#0a0712] border-t border-white/5 relative z-10 select-text">
        <div className="max-w-4xl mx-auto px-6 text-left space-y-12">
          
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-4 tracking-tight">
              The Ultimate Guide to Booking Villas for Groups in Lonavala
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              The concept of weekend getaways near Mumbai and Pune has undergone a massive evolution. Instead of booking multiple detached hotel rooms where groups are separated, travelers are seeking cohesive, private sanctuaries. Selecting private <strong className="text-[#DAA520] font-semibold">villas for groups in Lonavala</strong> provides the space, freedom, and exclusivity required for memorable group getaways. From infinity pools overlooking deep green valley panoramas to customized gourmet meals prepared by dedicated in-house chefs, private estates represent a complete shift in leisure travel.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Why Lonavala Works Best for Group Stays
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              Lonavala has always been the primary choice for weekenders. Whether it is trekking up the historic Lohagad Fort, enjoying picnics at Pawna Lake, or buying local chikki, there is something for everyone. Checking into premier <strong className="text-[#DAA520] font-semibold">group villas in Lonavala</strong> like The Angle House seamlessly combines modern architecture with high-end hospitality services. When planning an escape with friends, features like temperature-filtered pools, spacious deck spaces, and custom sound systems make a massive difference. Opting for a private <strong className="text-[#DAA520] font-semibold">villa for friends in Lonavala</strong> ensures your group enjoys complete freedom without hotel curfews or sharing facilities with strangers.
            </p>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Furthermore, the proximity of Lonavala makes it incredibly easy to coordinate travel logistics for large groups. Whether your friends are arriving from different parts of Mumbai or Pune, Lonavala serves as a central meeting point. Many high-end <strong className="text-[#DAA520] font-semibold">villas for family groups in Lonavala</strong> also offer specialized workspaces and high-speed internet connectivity, making them popular for corporate offsites and family reunions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Discovering Nearby Group Estates in Khopoli
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-6">
              For groups seeking absolute peace away from tourist crowds, Khopoli is a rising favorite. Situated at the base of Bhor Ghat, it offers pristine scenery, raw forests, and beautiful seasonal waterfalls. If you want a sanctuary where you only hear bird calls and the rustle of leaves, booking a <strong className="text-[#DAA520] font-semibold">large group villa in Lonavala</strong> or nearby Khopoli is highly recommended. Estates like Canopy Crest offer a dramatic escape from urban density, providing gorgeous mountain-view pools and glass-front layouts that immerse your group in nature.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Essential Amenities for Your Group Villa Experience
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light mb-4">
              When reviewing potential properties for your <strong className="text-[#DAA520] font-semibold">group stay in Lonavala</strong>, ensure the property offers:
            </p>
            <ul className="text-xs md:text-sm text-slate-300 space-y-3 pl-5 list-disc font-light">
              <li>
                <strong className="text-white font-semibold">Private Swimming Pools:</strong> Perfect for morning laps or evening pool volleyball with friends.
              </li>
              <li>
                <strong className="text-white font-semibold">In-house Chef Services:</strong> Authentic home-style meals, live barbeques, and late-night snacks prepared fresh on call.
              </li>
              <li>
                <strong className="text-white font-semibold">Entertainment & Games:</strong> Board games, outdoor lawn sports, and high-decibel audio setups.
              </li>
              <li>
                <strong className="text-white font-semibold">High-speed Wi-Fi:</strong> Critical for streaming music, sharing photos, or running remote team meetings.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-4">
              Booking Your Next Group Getaway with Stay Willas
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              Planning a group getaway should be exciting, not stressful. Vetting caretakers, coordinating food menus, and verifying pool cleanliness are details we handle directly at Stay Willas. Booking verified <strong className="text-[#DAA520] font-semibold">villas for groups in Lonavala</strong> guarantees that your weekend plays out exactly as expected. Secure your dates well in advance and let us build the perfect group retreat for you.
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
