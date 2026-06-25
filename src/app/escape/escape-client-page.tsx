"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Check, Plus, Minus, ArrowRight, ShieldCheck, Star, Users, Home, 
  MapPin, Flame, Utensils, Music, Heart, Calendar, ArrowDown, AlertCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Fill silver scratch pattern
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#C0C0C0");
    gradient.addColorStop(0.3, "#E8E8E8");
    gradient.addColorStop(0.5, "#A8A8A8");
    gradient.addColorStop(0.7, "#E8E8E8");
    gradient.addColorStop(1, "#909090");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw card inner border
    ctx.strokeStyle = "rgba(218, 165, 32, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

    // Draw luxury graphics & text
    ctx.fillStyle = "#1B3564";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("STAY WILLAS", rect.width / 2, rect.height / 2 - 25);

    ctx.fillStyle = "#DAA520";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("★ SCRATCH HERE ★", rect.width / 2, rect.height / 2);

    ctx.fillStyle = "#4A4A4A";
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
    <div className="relative w-full h-[160px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#101F3B] to-[#1B3564] border border-[#DAA520]/20 flex flex-col items-center justify-center p-4">
      {/* Revealed discount offer details */}
      <div className="text-center z-0 select-none space-y-1.5 animate-fade-in">
        <Sparkles className="text-[#DAA520] mx-auto animate-pulse" size={22} />
        <span className="text-[10px] uppercase tracking-widest text-[#DAA520] font-bold block">
          {title}
        </span>
        <div className="text-2xl font-black text-white tracking-wide font-heading">
          10% DISCOUNT
        </div>
        <p className="text-[9px] text-white/90 uppercase tracking-widest font-semibold border border-dashed border-[#DAA520]/50 px-2 py-1 rounded bg-[#DAA520]/15 inline-block">
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
  // Navigation active state on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Filter tabs state
  const [activeTab, setActiveTab] = useState<"family" | "friends" | "romantic" | "corporate">("family");
  
  // Calculator states
  const [selectedVillaSlug, setSelectedVillaSlug] = useState<string>("the-angle-house");
  const [nights, setNights] = useState<number>(2);
  const [guestsCount, setGuestsCount] = useState<number>(12);

  // Scratch card states
  const [isCard1Scratched, setIsCard1Scratched] = useState(false);
  const [isCard2Scratched, setIsCard2Scratched] = useState(false);
  const isDiscountApplied = isCard1Scratched || isCard2Scratched;
  
  // Active selected villa data helper
  const selectedVilla = selectedVillaSlug === "the-angle-house" ? angleHouse : canopyCrest;

  // Track scroll position for glass header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update guests count if selected villa limits are lower than current selection
  useEffect(() => {
    if (guestsCount > selectedVilla.guests) {
      setGuestsCount(selectedVilla.guests);
    }
  }, [selectedVillaSlug, selectedVilla.guests, guestsCount]);

  // Pricing calculations
  const basePricePerNight = selectedVilla.price;
  const extraGuestFee = selectedVilla.extraGuestFee || 1200;
  const baseGuestsLimit = selectedVilla.baseGuests || 12;

  const extraGuestsCount = Math.max(0, guestsCount - baseGuestsLimit);
  const baseStayTotal = basePricePerNight * nights;
  const extraGuestsTotal = extraGuestsCount * extraGuestFee * nights;
  const estimatedTotal = baseStayTotal + extraGuestsTotal;

  const discountAmount = isDiscountApplied ? estimatedTotal * 0.1 : 0;
  const finalTotal = estimatedTotal - discountAmount;

  // WhatsApp prefilled message link builder
  const whatsappNumber = "919619042310";
  const whatsappText = isDiscountApplied
    ? `Hello Stay Willas! 🌟 I scratched the Escape card and unlocked my 10% Promo discount!\n\nI am interested in booking *${selectedVilla.name}* in ${selectedVilla.location}.\n\n📅 *Stay Details:*\n- Duration: ${nights} Nights\n- Guests: ${guestsCount} Guests\n- Original Tariff: ₹${estimatedTotal.toLocaleString("en-IN")}\n- Promo Discount (10% Off): -₹${discountAmount.toLocaleString("en-IN")}\n- Final Total: ₹${finalTotal.toLocaleString("en-IN")}\n\nCan you please check availability and apply my discount?`
    : `Hello Stay Willas! 🌟 I am interested in booking an exclusive getaway at *${selectedVilla.name}* in ${selectedVilla.location}.\n\n📅 *Stay Details:*\n- Duration: ${nights} Nights\n- Guests: ${guestsCount} Guests\n- Estimated Base price: ₹${estimatedTotal.toLocaleString("en-IN")}\n\nCan you please check availability for our group?`;
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
    <div className="min-h-screen bg-[#F5F2EA] text-[#1A1A1A] font-sans antialiased overflow-x-hidden selection:bg-[#4A5D23]/20 selection:text-[#4A5D23]">
      
      {/* 1. STICKY GLASS HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#F5F2EA]/85 backdrop-blur-xl border-b border-[#DAA520]/15 shadow-sm py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#DAA520]/30 shadow-md bg-white flex items-center justify-center shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Stay Willas Logo" 
                className="w-full h-full object-cover scale-[1.5]" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-widest text-[#1B3564] leading-tight">
                STAY WILLAS
              </span>
              <span className="font-sans text-[8px] tracking-[0.14em] uppercase font-bold text-[#1B3564]/70">
                stay ! Relax ! Repeat !
              </span>
            </div>
          </Link>
          
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase bg-[#1B3564] text-white hover:bg-[#2563EB] shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Book Direct
          </a>
        </div>
      </header>

      {/* 2. HERO / PSYCHOLOGICAL COPY HOOK */}
      <section className="relative min-h-[105vh] lg:min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center overflow-hidden">
        {/* Subtle Background Image of The Angle House */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/assets/villas/the-angle-house/gallery-11.webp" 
            alt="The Angle House Background" 
            className="w-full h-full object-cover opacity-[0.14] filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2EA]/95 via-[#F5F2EA]/75 to-[#F5F2EA]" />
          {/* Radial shadow overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#F5F2EA_100%)]" />
        </div>

        <div className="max-w-5xl mx-auto z-10 w-full flex flex-col items-center gap-10">
          
          {/* Header text container */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <span className="text-[#DAA520] font-semibold tracking-[0.4em] uppercase text-xs sm:text-sm block animate-pulse">
              🌟 An Unexpected Detour
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-[#1B3564] tracking-tight leading-[1.05] text-balance">
              What if your best vacation started with a <span className="italic text-[#4A5D23] underline decoration-[#DAA520]/40">wrong click?</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-[#4A4A4A] text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Step off the digital treadmill. Scratch cards below to unlock your secret 10% discount on Lonavala and Khopoli luxury pool villas.
            </p>
          </div>

          {/* SCRATCHCARDS GRID */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-4">
            {/* Card 1: The Angle House Promo */}
            <div className="flex flex-col gap-3">
              <div className="text-left flex items-center justify-between px-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B3564]">
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
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B3564]">
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
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#DAA520]/45 shadow-xl max-w-2xl w-full mx-auto space-y-6 text-center"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#4A5D23] bg-[#4A5D23]/10 px-4 py-1.5 rounded-full inline-block">
                  🎉 10% DISCOUNT ACTIVATED (ESCAPE10)
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-[#1B3564]">
                  Your Luxury Escape Awaits!
                </h3>
                <p className="text-xs text-[#4A4A4A] max-w-md mx-auto font-light">
                  Select your private villa below to automatically apply the 10% discount and start chatting on WhatsApp instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setSelectedVillaSlug("the-angle-house")}
                  className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedVillaSlug === "the-angle-house"
                      ? "bg-[#1B3564] text-white border-[#1B3564] shadow-md scale-[1.02]"
                      : "bg-white text-[#1B3564] border-[#E2E8F0] hover:bg-[#F5F2EA] hover:border-[#1B3564]/30"
                  }`}
                >
                  The Angle House
                </button>
                <button
                  onClick={() => setSelectedVillaSlug("canopy-crest")}
                  className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedVillaSlug === "canopy-crest"
                      ? "bg-[#1B3564] text-white border-[#1B3564] shadow-md scale-[1.02]"
                      : "bg-white text-[#1B3564] border-[#E2E8F0] hover:bg-[#F5F2EA] hover:border-[#1B3564]/30"
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
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-8 rounded-full text-xs tracking-widest uppercase transition-all duration-300 shadow-lg inline-flex items-center gap-3 hover:-translate-y-0.5"
                >
                  <span>Avail Discount & Chat on WhatsApp</span>
                  <ArrowRight size={14} />
                </a>
                <span className="text-[10px] text-[#4A4A4A]/60 block mt-3 italic">
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
                className="inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#1B3564] hover:text-[#4A5D23] transition-colors focus:outline-none"
              >
                <span>Or scroll to explore</span>
                <ArrowDown size={14} className="text-[#DAA520]" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. IMMERSIVE ROW (THE PHILOSOPHY) */}
      <section id="philosophy-section" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white border-y border-[#E2E8F0] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#5CADE2]/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#1B3564] leading-tight">
              Imagine waking up to sweeping mountain silhouettes...
            </h2>
            <div className="w-16 h-0.5 bg-[#4A5D23]/30" />
            <p className="text-[#4A4A4A] text-lg leading-relaxed">
              No alarms, no deadlines, no screens clamoring for your attention. At Stay Willas, we believe in slow luxury. We build architecture that wraps around the landscape, not the other way around. 
            </p>
            <p className="text-[#4A4A4A] text-md leading-relaxed opacity-80">
              Each estate is hand-curated and fully staffed with premium catering and hospitality, designed specifically to help you disconnect from the routine and reconnect with yourself.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => scrollToSection("properties-section")}
                className="inline-flex items-center gap-3 text-sm font-bold text-[#4A5D23] hover:text-[#1B3564] group transition-colors"
              >
                Explore our flagships <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Right Column: Immersive Card Image */}
          <div className="lg:col-span-7">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-[#DAA520]/15 bg-bg-primary aspect-[4/3] sm:aspect-[16/10]">
              <img 
                src="/assets/villas/the-angle-house/gallery-11.webp" 
                alt="The Angle House Lonavala" 
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-110" 
              />
              {/* Blur gradient cover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
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
      <section id="properties-section" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="text-[#4A5D23] font-medium tracking-[0.4em] uppercase text-xs block">
            Our Sanctuaries
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#1B3564]">
            Two Main Flagship Properties
          </h2>
          <p className="max-w-2xl mx-auto text-[#4A4A4A] text-md font-light">
            We list only the most premium, fully private estates. Here are our top two properties, available for direct booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Property 1: The Angle House */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-lg flex flex-col hover:shadow-xl transition-all duration-300 group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={angleHouse.images[0] || "/assets/villas/the-angle-house/gallery-11.webp"} 
                alt={angleHouse.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1B3564] shadow-sm flex items-center gap-1 border border-[#DAA520]/25">
                <Star size={12} className="fill-[#DAA520] text-[#DAA520]" /> 4.9 (18 Reviews)
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white pt-12">
                <div className="flex items-center gap-1.5 text-xs text-[#DAA520] uppercase font-bold tracking-wider mb-1">
                  <MapPin size={12} /> {angleHouse.location}
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">{angleHouse.name}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-3 font-light">
                  An architectural masterpiece. Striking angular facade featuring double-height glass panels that open to a cascading private waterfall swimming pool and an indoor heated Jacuzzi.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-y border-[#E2E8F0] py-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Bedrooms</span>
                    <span className="font-semibold text-[#1B3564] text-base">{angleHouse.bedrooms} BHK</span>
                  </div>
                  <div className="border-x border-[#E2E8F0]">
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Guests</span>
                    <span className="font-semibold text-[#1B3564] text-base">Up to {angleHouse.guests}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Private Pool</span>
                    <span className="font-semibold text-[#1B3564] text-base">Yes (Waterfall)</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {angleHouse.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="text-[11px] bg-[#F5F2EA] border border-[#DAA520]/20 text-[#1B3564] px-2.5 py-1 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#4A4A4A]/60 block font-light">Starting from</span>
                    <span className="text-2xl font-bold text-[#1B3564]">₹{angleHouse.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[#4A4A4A]/60 font-light"> / night (Weekday)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#4A4A4A]/60 block font-light">Weekend Tariff</span>
                    <span className="text-sm font-semibold text-[#DAA520]">₹{angleHouse.weekendPrice?.toLocaleString("en-IN") || "20,000"}</span>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Fri - Sun</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSelectVillaForCalculator("the-angle-house")}
                    className="w-full bg-[#1B3564] hover:bg-[#2563EB] text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md active:translate-y-0.5 hover:-translate-y-0.5"
                  >
                    Select & Quote
                  </button>
                  <Link 
                    href={`/villa/${angleHouse.slug}`}
                    target="_blank"
                    className="w-full border border-[#1B3564]/30 hover:border-[#1B3564] hover:bg-[#1B3564]/5 text-[#1B3564] py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
                  >
                    View Villa
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Property 2: Canopy Crest */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-lg flex flex-col hover:shadow-xl transition-all duration-300 group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={canopyCrest.images[0] || "/assets/villas/Canopy crest photos/IMG-20260607-WA0007.jpg"} 
                alt={canopyCrest.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1B3564] shadow-sm flex items-center gap-1 border border-[#DAA520]/25">
                <Star size={12} className="fill-[#DAA520] text-[#DAA520]" /> 4.8 (14 Reviews)
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white pt-12">
                <div className="flex items-center gap-1.5 text-xs text-[#DAA520] uppercase font-bold tracking-wider mb-1">
                  <MapPin size={12} /> {canopyCrest.location}
                </div>
                <h3 className="text-2xl font-heading font-bold text-white">{canopyCrest.name}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-3 font-light">
                  A sprawling sanctuary enveloped in a lush verdant forest. Features huge manicured lawns, indoor/outdoor sports, open-air BBQ by the pool, and wide windows framing misty green hills.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 border-y border-[#E2E8F0] py-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Bedrooms</span>
                    <span className="font-semibold text-[#1B3564] text-base">{canopyCrest.bedrooms} BHK</span>
                  </div>
                  <div className="border-x border-[#E2E8F0]">
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Guests</span>
                    <span className="font-semibold text-[#1B3564] text-base">Up to {canopyCrest.guests}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#4A4A4A]/60 tracking-wider block">Private Pool</span>
                    <span className="font-semibold text-[#1B3564] text-base">Yes (Lawnside)</span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {canopyCrest.amenities.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} className="text-[11px] bg-[#F5F2EA] border border-[#DAA520]/20 text-[#1B3564] px-2.5 py-1 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#4A4A4A]/60 block font-light">Starting from</span>
                    <span className="text-2xl font-bold text-[#1B3564]">₹{canopyCrest.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[#4A4A4A]/60 font-light"> / night (Weekday)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#4A4A4A]/60 block font-light">Weekend Tariff</span>
                    <span className="text-sm font-semibold text-[#DAA520]">₹{canopyCrest.weekendPrice?.toLocaleString("en-IN") || "22,000"}</span>
                    <span className="text-[10px] text-[#4A4A4A]/60 block">Fri - Sun</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSelectVillaForCalculator("canopy-crest")}
                    className="w-full bg-[#1B3564] hover:bg-[#2563EB] text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md active:translate-y-0.5 hover:-translate-y-0.5"
                  >
                    Select & Quote
                  </button>
                  <Link 
                    href={`/villa/${canopyCrest.slug}`}
                    target="_blank"
                    className="w-full border border-[#1B3564]/30 hover:border-[#1B3564] hover:bg-[#1B3564]/5 text-[#1B3564] py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center"
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
      <section id="calculator-section" className="py-24 md:py-32 bg-[#EBE5D6]/50 border-y border-[#D1C7B3]/40 px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
              Tailored Getaway Planner
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#1B3564]">
              Build Your Private Escape
            </h2>
            <p className="max-w-xl mx-auto text-[#4A4A4A] text-sm font-light">
              Customize your booking requirements below. Switch stay styles to explore custom amenities and calculate your pricing.
            </p>
          </div>

          {/* DYNAMIC FILTER TABS */}
          <div className="flex flex-wrap justify-center gap-3">
            {(["family", "friends", "romantic", "corporate"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none ${
                  activeTab === tab
                    ? "bg-[#4A5D23] text-white shadow-md scale-105"
                    : "bg-white text-[#1B3564]/70 border border-[#D1C7B3] hover:bg-[#F5F2EA] hover:text-[#1B3564]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Left side: Dynamic Content from Tabs */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-8 bg-white/40 border border-white/50 p-8 rounded-3xl backdrop-blur-sm">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#DAA520] tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520] animate-pulse" />
                  Recommended Stay Style
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#1B3564] leading-snug">
                  {tabs[activeTab].headline}
                </h3>
                <p className="text-[#4A4A4A] text-base leading-relaxed font-light">
                  {tabs[activeTab].description}
                </p>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-3.5 pt-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#1B3564]">Included Highlights:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tabs[activeTab].amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-[#4A4A4A]">
                      <div className="w-5 h-5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] flex items-center justify-center shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-[#4A4A4A]/60 flex items-start gap-2 italic">
                <AlertCircle size={14} className="shrink-0 text-[#DAA520] mt-0.5" />
                <span>All Stay Willas properties feature standard premium luxury comforts: air conditioning, high speed Wi-Fi, toiletries, security, and private parking.</span>
              </div>
            </div>

            {/* Right side: Interactive Calculator */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#D1C7B3]/50 shadow-xl space-y-6 flex flex-col justify-between h-full">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <h3 className="font-heading text-lg font-bold text-[#1B3564]">Estimated Getaway Plan</h3>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-[#DAA520]/15 text-[#DAA520]">
                      Best price guaranteed
                    </span>
                  </div>

                  {/* Villa Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#4A4A4A]/70">1. Select Private Villa</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedVillaSlug("the-angle-house")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedVillaSlug === "the-angle-house"
                            ? "bg-[#1B3564] text-white border-[#1B3564]"
                            : "border-[#E2E8F0] text-[#1B3564] hover:bg-[#F5F2EA]"
                        }`}
                      >
                        The Angle House
                      </button>
                      <button
                        onClick={() => setSelectedVillaSlug("canopy-crest")}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedVillaSlug === "canopy-crest"
                            ? "bg-[#1B3564] text-white border-[#1B3564]"
                            : "border-[#E2E8F0] text-[#1B3564] hover:bg-[#F5F2EA]"
                        }`}
                      >
                        Canopy Crest
                      </button>
                    </div>
                  </div>

                  {/* Steppers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Nights Stepper */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[#4A4A4A]/70 block">2. Nights</label>
                      <div className="flex items-center justify-between bg-[#F5F2EA] rounded-xl p-2 border border-[#E2E8F0]">
                        <button
                          onClick={() => setNights(Math.max(1, nights - 1))}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B3564] hover:bg-[#EBE5D6] transition-colors focus:outline-none"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-heading font-bold text-lg text-[#1B3564]">{nights}</span>
                        <button
                          onClick={() => setNights(Math.min(14, nights + 1))}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B3564] hover:bg-[#EBE5D6] transition-colors focus:outline-none"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Guests Stepper */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[#4A4A4A]/70 block">
                        3. Guests (Max {selectedVilla.guests})
                      </label>
                      <div className="flex items-center justify-between bg-[#F5F2EA] rounded-xl p-2 border border-[#E2E8F0]">
                        <button
                          onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B3564] hover:bg-[#EBE5D6] transition-colors focus:outline-none"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-heading font-bold text-lg text-[#1B3564]">{guestsCount}</span>
                        <button
                          onClick={() => setGuestsCount(Math.min(selectedVilla.guests, guestsCount + 1))}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1B3564] hover:bg-[#EBE5D6] transition-colors focus:outline-none"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Calculation Output */}
                <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
                  <div className="space-y-2 text-sm text-[#4A4A4A]">
                    <div className="flex justify-between">
                      <span>Base Stay ({nights} nights):</span>
                      <span className="font-semibold">₹{baseStayTotal.toLocaleString("en-IN")}</span>
                    </div>
                    {guestsCount > baseGuestsLimit && (
                      <div className="flex justify-between text-[#4A5D23]">
                        <span>Extra Guests ({extraGuestsCount} guests x ₹{extraGuestFee}):</span>
                        <span className="font-semibold">₹{extraGuestsTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {isDiscountApplied && (
                      <div className="flex justify-between text-[#4A5D23] font-semibold bg-[#4A5D23]/5 p-2 rounded-lg border border-[#4A5D23]/25">
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} className="text-[#DAA520] animate-pulse" />
                          Escape 10% Discount:
                        </span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px] opacity-60">
                      <span>Base Villa Tariff includes up to {baseGuestsLimit} guests.</span>
                    </div>
                  </div>

                  <div className="bg-[#F5F2EA] p-4 rounded-2xl flex items-center justify-between border border-[#DAA520]/15">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A4A4A]">
                        {isDiscountApplied ? "Est. Discounted Total" : "Est. Base Total"}
                      </span>
                      <div className="text-2xl md:text-3xl font-black text-[#1B3564] font-heading">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </div>
                      {isDiscountApplied && (
                        <span className="text-[9px] text-[#4A5D23] font-bold uppercase tracking-wider block mt-0.5">
                          Code ESCAPE10 applied
                        </span>
                      )}
                    </div>
                    
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#4A5D23] hover:bg-[#1B3564] text-white px-5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md text-center inline-flex items-center gap-2 hover:-translate-y-0.5"
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
      <section className="bg-[#1B3564] text-white py-10 border-y border-[#DAA520]/20 overflow-hidden relative">
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
      <section className="py-28 md:py-36 px-6 text-center relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#4A5D23]/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-10 z-10 relative">
          <span className="text-[#DAA520] font-medium tracking-[0.4em] uppercase text-xs block">
            Make the Detour Count
          </span>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#1B3564] tracking-tight leading-tight">
            What if this wasn&apos;t a wrong click?
          </h2>
          
          <p className="max-w-xl mx-auto text-[#4A4A4A] text-lg font-light leading-relaxed">
            Maybe this is exactly where you were supposed to land. Browse our complete handpicked selection of premium luxury private estates and start planning your escape.
          </p>

          <div className="pt-4">
            <Link 
              href="/villas"
              className="inline-flex items-center gap-3 bg-[#1B3564] hover:bg-[#4A5D23] text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Explore Handpicked Villas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101F3B] text-white/50 text-xs py-8 border-t border-[#DAA520]/10 text-center px-6">
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
