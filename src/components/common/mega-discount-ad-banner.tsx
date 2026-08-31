"use client";

import React, { useState, useEffect } from "react";
import { Timer, ArrowRight, PhoneCall, Copy, Check, ShieldCheck, Flame, Tag, Sparkles, X, CloudRain } from "lucide-react";

interface MegaDiscountAdBannerProps {
  pageName?: string;
  villaName?: string;
  location?: string;
  couponCode?: string;
  discountPercent?: number;
  villaLink?: string;
  offerTitle?: string;
  highlightText?: string;
}

export default function MegaDiscountAdBanner({
  pageName = "lonavala",
  villaName = "Luxury Private Pool Villa",
  location = "Lonavala & Khopoli",
  couponCode = "STAYW28",
  discountPercent = 28,
  villaLink,
  offerTitle = "Monsoon Escape",
  highlightText = "Stay 2 Nights & Save More",
}: MegaDiscountAdBannerProps) {
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileBadgeOpen, setIsMobileBadgeOpen] = useState(false);

  // Dynamic countdown to end of current month
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    // Real end-of-month target date (e.g., last day of current month at 23:59:59)
    const now = new Date();
    const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

    const updateTimer = () => {
      const current = new Date().getTime();
      const difference = deadline - current;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Hi Stay Willas! 🌧️ I want to claim the *${offerTitle}* offer (*${highlightText}* on Weekdays) for *${villaName}* in ${location} with Coupon: *${couponCode}* (Flat ${discountPercent}%+ Off)!\n\nPlease share available Monday–Thursday dates and the best 2-night discounted quote! ✨`;
  const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(whatsappMessage)}`;

  if (isDismissed) return null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY AD COUNTDOWN ANNOUNCEMENT BAR (ABOVE NAVBAR) */}
      {/* ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-[100000] bg-gradient-to-r from-[#1B3564] via-[#0B1A33] to-[#1B3564] text-white border-b-2 border-[#DAA520] shadow-[0_4px_30px_rgba(0,0,0,0.6)] h-11 sm:h-12 flex items-center px-2.5 sm:px-4 select-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left Flash Offer Info */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
            <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#DAA520] text-[#1B3564] shrink-0 animate-bounce shadow-md">
              <CloudRain size={14} className="stroke-[2.5]" />
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#DAA520] whitespace-nowrap bg-amber-400/10 px-2 py-0.5 rounded border border-[#DAA520]/40">
                🌧️ {offerTitle.toUpperCase()}
              </span>
              <span className="bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded uppercase whitespace-nowrap animate-pulse">
                {highlightText}
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-200 font-bold hidden lg:inline bg-white/10 px-2 py-0.5 rounded">
                ⚡ Weekdays Only (Mon–Thu)
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 hidden xl:inline truncate">
                • Code: <strong className="text-white font-mono bg-white/15 px-1.5 py-0.5 rounded">{couponCode}</strong>
              </span>
            </div>
          </div>

          {/* Center Countdown Clock */}
          <div className="flex items-center gap-1 shrink-0 bg-black/60 border border-[#DAA520]/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-inner">
            <Timer size={12} className="text-[#DAA520] animate-spin hidden xs:block" />
            <div className="flex items-center gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-xs font-black text-white">
              <span className="text-[#DAA520]">{timeLeft.days}d</span>:
              <span className="text-[#DAA520]">{String(timeLeft.hours).padStart(2, "0")}h</span>:
              <span className="text-[#DAA520]">{String(timeLeft.minutes).padStart(2, "0")}m</span>:
              <span className="bg-[#DAA520] text-[#1B3564] px-1 rounded font-black">{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {villaLink && (
              <a
                href={villaLink}
                className="hidden md:inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white font-black text-[9px] sm:text-xs uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <span>View Villa</span>
                <ArrowRight size={10} />
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.5)] active:scale-95 whitespace-nowrap cursor-pointer hover:scale-105"
            >
              <PhoneCall size={12} className="stroke-[2.5]" />
              <span>CLAIM OFFER</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LEFT SIDE FLOATING SKYSCRAPER AD CARD (DESKTOP / LAPTOP - VISIBLE ON XL) */}
      {/* ========================================================================= */}
      <aside 
        aria-label="Monsoon Escape Weekday Discount"
        className="hidden xl:flex fixed left-2 2xl:left-5 top-1/2 -translate-y-1/2 z-[90] flex-col items-center w-48 2xl:w-52 bg-gradient-to-b from-[#1B3564]/98 via-[#0F2142]/98 to-[#081326]/98 text-white rounded-3xl p-4 border-2 border-[#DAA520] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-in text-center"
      >
        {/* Glowing Top Pill */}
        <div className="bg-gradient-to-r from-[#DAA520] to-[#FFD700] text-[#1B3564] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg -mt-7 mb-2.5 border border-white/30 flex items-center gap-1">
          <CloudRain size={12} className="stroke-[2.5]" /> {offerTitle.toUpperCase()}
        </div>

        <span className="text-[9px] font-black tracking-widest text-[#DAA520] uppercase block">
          LIMITED MONSOON DEAL
        </span>
        <h4 className="text-xl 2xl:text-2xl font-heading font-black text-white leading-tight my-1">
          {highlightText}
        </h4>
        <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider block bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md mb-2.5">
          Weekdays Only (Mon–Thu)
        </span>

        {/* Live Countdown Box */}
        <div className="w-full bg-black/60 border border-[#DAA520]/50 rounded-xl p-2.5 mb-2.5 shadow-inner">
          <span className="text-[8px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
            Offer Expires In
          </span>
          <div className="grid grid-cols-4 gap-1 font-mono text-center">
            <div className="bg-[#1B3564] p-1 rounded border border-[#DAA520]/30">
              <span className="text-[11px] font-black text-[#DAA520] block">{timeLeft.days}</span>
              <span className="text-[6px] text-slate-400 uppercase">Days</span>
            </div>
            <div className="bg-[#1B3564] p-1 rounded border border-[#DAA520]/30">
              <span className="text-[11px] font-black text-[#DAA520] block">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[6px] text-slate-400 uppercase">Hrs</span>
            </div>
            <div className="bg-[#1B3564] p-1 rounded border border-[#DAA520]/30">
              <span className="text-[11px] font-black text-[#DAA520] block">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[6px] text-slate-400 uppercase">Min</span>
            </div>
            <div className="bg-[#DAA520] p-1 rounded shadow-sm">
              <span className="text-[11px] font-black text-[#1B3564] block">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[6px] text-[#1B3564] font-bold uppercase">Sec</span>
            </div>
          </div>
        </div>

        {/* Coupon Code Pill */}
        <div className="w-full bg-white/10 border border-white/20 rounded-xl p-2 mb-3 flex items-center justify-between">
          <div className="text-left min-w-0">
            <span className="text-[7px] text-slate-300 uppercase block font-bold">Use Coupon Code</span>
            <span className="text-[12px] font-black text-[#DAA520] font-mono tracking-wider truncate block">{couponCode}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-1.5 bg-[#DAA520]/30 hover:bg-[#DAA520]/50 text-[#DAA520] rounded-lg transition-all cursor-pointer shrink-0"
            title="Copy Coupon"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer hover:scale-102"
        >
          <PhoneCall size={12} /> Claim 2-Night Deal
        </a>
      </aside>

      {/* ========================================================================= */}
      {/* 3. RIGHT SIDE FLOATING SKYSCRAPER AD CARD (DESKTOP / LAPTOP - VISIBLE ON XL) */}
      {/* ========================================================================= */}
      <aside 
        aria-label="Direct Booking Benefits"
        className="hidden xl:flex fixed right-2 2xl:right-5 top-1/2 -translate-y-1/2 z-[90] flex-col items-center w-48 2xl:w-52 bg-gradient-to-b from-[#1B3564]/98 via-[#0F2142]/98 to-[#081326]/98 text-white rounded-3xl p-4 border-2 border-[#DAA520] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-in text-center"
      >
        {/* Direct Booking Badge */}
        <div className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg -mt-7 mb-2.5 border border-white/30 flex items-center gap-1">
          <ShieldCheck size={12} /> 0% PLATFORM FEE
        </div>

        <span className="text-[9px] font-extrabold tracking-widest text-[#DAA520] uppercase block">
          DIRECT ADVANTAGE
        </span>
        <h4 className="text-xl 2xl:text-2xl font-heading font-black text-white leading-tight my-1">
          MONSOON PERKS
        </h4>
        <p className="text-[9px] text-slate-300 leading-snug mb-2.5">
          Book <strong>2 Weekday Nights</strong> & unlock maximum savings + VIP chef dining.
        </p>

        {/* Value Props */}
        <div className="w-full space-y-1.5 text-left text-[9px] text-slate-200 mb-3 bg-black/50 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Stay 2 Nights & Save More
          </div>
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Weekdays (Mon–Thu) Special
          </div>
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Private Pool & Waterfall
          </div>
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> In-House Chef Cuisine
          </div>
        </div>

        {/* Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] hover:from-[#c9951b] hover:to-[#d19730] text-[#1B3564] font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95 cursor-pointer"
        >
          <span>WhatsApp Host</span>
          <ArrowRight size={12} className="stroke-[3]" />
        </a>
      </aside>

      {/* ========================================================================= */}
      {/* 4. FLOATING MOBILE OFFER BADGE (BOTTOM-LEFT ON MOBILE) */}
      {/* ========================================================================= */}
      <div className="xl:hidden fixed bottom-20 left-3 z-[80]">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1B3564] text-white border-2 border-[#DAA520] pl-2.5 pr-3 py-1.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-bounce"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DAA520] text-[#1B3564] font-black text-[11px]">
            🌧️
          </span>
          <div className="text-left">
            <span className="text-[9px] font-black text-[#DAA520] uppercase block leading-none">
              MONSOON ESCAPE • 2-NIGHT DEAL
            </span>
            <span className="text-[8px] text-emerald-300 font-bold leading-none">
              Weekdays (Mon–Thu) • Code: {couponCode}
            </span>
          </div>
        </a>
      </div>
    </>
  );
}

