"use client";

import React, { useState, useEffect } from "react";
import { Timer, ArrowRight, PhoneCall, Copy, Check, ShieldCheck, Flame, Tag, Sparkles, X } from "lucide-react";

interface MegaDiscountAdBannerProps {
  pageName?: string;
  villaName?: string;
  location?: string;
  couponCode?: string;
  discountPercent?: number;
  villaLink?: string;
}

export default function MegaDiscountAdBanner({
  pageName = "lonavala",
  villaName = "Luxury Private Pool Villa",
  location = "Lonavala & Khopoli",
  couponCode = "ESCAPE28",
  discountPercent = 28,
  villaLink,
}: MegaDiscountAdBannerProps) {
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileBadgeOpen, setIsMobileBadgeOpen] = useState(false);

  // Calculate target date: 30 days from today (1 month)
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    setIsMounted(true);
    // 30-day fixed deadline
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Hi Stay Willas! 🌟 I want to grab the *${discountPercent}% MEGA WEEKDAY OFFER* (Coupon: *${couponCode}*) for *${villaName}* in ${location} before the timer ends!\n\nPlease share available Monday–Thursday dates and the discounted rate! ✨`;
  const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(whatsappMessage)}`;

  if (isDismissed) return null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY AD COUNTDOWN ANNOUNCEMENT BAR (ABOVE NAVBAR) */}
      {/* ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 z-[100000] bg-gradient-to-r from-[#1B3564] via-[#0D1F3C] to-[#1B3564] text-white border-b border-[#DAA520]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)] h-10 sm:h-11 flex items-center px-2.5 sm:px-4 select-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left Flash Offer Info */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#DAA520] text-[#1B3564] shrink-0 animate-pulse shadow-sm">
              <Flame size={12} className="fill-[#1B3564] stroke-[#1B3564]" />
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#DAA520] whitespace-nowrap">
                MEGA {discountPercent}% OFF
              </span>
              <span className="bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded uppercase whitespace-nowrap">
                Mon–Thu Only
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-300 hidden md:inline truncate">
                • Coupon: <strong className="text-white font-mono bg-white/15 px-1 rounded">{couponCode}</strong>
              </span>
            </div>
          </div>

          {/* Center Countdown Clock */}
          <div className="flex items-center gap-1 shrink-0 bg-black/50 border border-[#DAA520]/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-inner">
            <Timer size={11} className="text-[#DAA520] animate-pulse hidden xs:block" />
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
                className="hidden xs:inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white font-black text-[9px] sm:text-xs uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <span>View Villa</span>
                <ArrowRight size={10} />
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-[9px] sm:text-xs uppercase tracking-wider px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <PhoneCall size={10} className="stroke-[2.5]" />
              <span>GRAB 28%</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LEFT SIDE FLOATING SKYSCRAPER AD CARD (DESKTOP / LAPTOP - VISIBLE ON XL) */}
      {/* ========================================================================= */}
      <aside 
        aria-label="Exclusive Weekday Discount"
        className="hidden xl:flex fixed left-2 2xl:left-5 top-1/2 -translate-y-1/2 z-[90] flex-col items-center w-44 2xl:w-48 bg-gradient-to-b from-[#1B3564]/95 via-[#0F2142]/95 to-[#081326]/95 text-white rounded-2xl p-3.5 border-2 border-[#DAA520]/70 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in text-center"
      >
        {/* Glowing Top Pill */}
        <div className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md -mt-6 mb-2 border border-white/20 flex items-center gap-1">
          <Flame size={11} className="fill-[#1B3564]" /> MEGA DEAL
        </div>

        <span className="text-[9px] font-extrabold tracking-widest text-[#DAA520] uppercase block">
          LIMITED AD OFFER
        </span>
        <h4 className="text-2xl 2xl:text-3xl font-heading font-black text-white leading-none my-1">
          28% OFF
        </h4>
        <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider block bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-md mb-2.5">
          Mon–Thu Stays Only
        </span>

        {/* Live Countdown Box */}
        <div className="w-full bg-black/50 border border-[#DAA520]/40 rounded-xl p-2 mb-2.5 shadow-inner">
          <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Offer Ends In
          </span>
          <div className="grid grid-cols-4 gap-0.5 font-mono text-center">
            <div className="bg-[#1B3564] p-0.5 rounded border border-[#DAA520]/20">
              <span className="text-[11px] font-black text-[#DAA520] block">{timeLeft.days}</span>
              <span className="text-[6px] text-slate-400 uppercase">Days</span>
            </div>
            <div className="bg-[#1B3564] p-0.5 rounded border border-[#DAA520]/20">
              <span className="text-[11px] font-black text-[#DAA520] block">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[6px] text-slate-400 uppercase">Hrs</span>
            </div>
            <div className="bg-[#1B3564] p-0.5 rounded border border-[#DAA520]/20">
              <span className="text-[11px] font-black text-[#DAA520] block">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[6px] text-slate-400 uppercase">Min</span>
            </div>
            <div className="bg-[#DAA520] p-0.5 rounded">
              <span className="text-[11px] font-black text-[#1B3564] block">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[6px] text-[#1B3564] font-bold uppercase">Sec</span>
            </div>
          </div>
        </div>

        {/* Coupon Code Pill */}
        <div className="w-full bg-white/10 border border-white/20 rounded-lg p-1.5 mb-2.5 flex items-center justify-between">
          <div className="text-left min-w-0">
            <span className="text-[7px] text-slate-400 uppercase block font-bold">Coupon Code</span>
            <span className="text-[11px] font-black text-[#DAA520] font-mono tracking-wider truncate block">{couponCode}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-1 bg-[#DAA520]/20 hover:bg-[#DAA520]/30 text-[#DAA520] rounded transition-all cursor-pointer shrink-0"
            title="Copy Coupon"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          </button>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg shadow-lg transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
        >
          <PhoneCall size={11} /> Claim 28% Off
        </a>
      </aside>

      {/* ========================================================================= */}
      {/* 3. RIGHT SIDE FLOATING SKYSCRAPER AD CARD (DESKTOP / LAPTOP - VISIBLE ON XL) */}
      {/* ========================================================================= */}
      <aside 
        aria-label="Direct Booking Benefits"
        className="hidden xl:flex fixed right-2 2xl:right-5 top-1/2 -translate-y-1/2 z-[90] flex-col items-center w-44 2xl:w-48 bg-gradient-to-b from-[#1B3564]/95 via-[#0F2142]/95 to-[#081326]/95 text-white rounded-2xl p-3.5 border-2 border-[#DAA520]/70 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade-in text-center"
      >
        {/* Direct Booking Badge */}
        <div className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md -mt-6 mb-2 border border-white/20 flex items-center gap-1">
          <ShieldCheck size={11} /> 0% PLATFORM FEE
        </div>

        <span className="text-[9px] font-extrabold tracking-widest text-[#DAA520] uppercase block">
          WHY BOOK OTAS?
        </span>
        <h4 className="text-xl 2xl:text-2xl font-heading font-black text-white leading-tight my-1">
          DIRECT DEALS
        </h4>
        <p className="text-[9px] text-slate-300 leading-snug mb-2.5">
          Save <strong>28% on Weekday Stays</strong> via WhatsApp Concierge.
        </p>

        {/* Value Props */}
        <div className="w-full space-y-1 text-left text-[9px] text-slate-200 mb-2.5 bg-black/40 p-2 rounded-lg border border-white/10">
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Private Waterfall Pool
          </div>
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Gourmet Chef Dining
          </div>
          <div className="flex items-center gap-1 font-semibold truncate">
            <span className="text-emerald-400 font-black">✓</span> Pet-Friendly Lawns
          </div>
        </div>

        {/* Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-[#DAA520] to-[#E2A63B] text-[#1B3564] font-black text-[10px] uppercase tracking-wider py-2 rounded-lg shadow-lg transition-all flex items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>WhatsApp Concierge</span>
          <ArrowRight size={10} className="stroke-[3]" />
        </a>
      </aside>

      {/* ========================================================================= */}
      {/* 4. FLOATING MOBILE 28% OFFER BADGE (BOTTOM-LEFT / BOTTOM-CENTER ON MOBILE) */}
      {/* ========================================================================= */}
      <div className="xl:hidden fixed bottom-20 left-3 z-[80]">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#1B3564] text-white border-2 border-[#DAA520] pl-2.5 pr-3 py-1.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.4)] animate-bounce"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#DAA520] text-[#1B3564] font-black text-[10px]">
            %
          </span>
          <div className="text-left">
            <span className="text-[9px] font-black text-[#DAA520] uppercase block leading-none">
              28% OFF WEEKDAYS
            </span>
            <span className="text-[8px] text-slate-300 font-medium leading-none">
              Code: <strong className="text-white">{couponCode}</strong>
            </span>
          </div>
        </a>
      </div>
    </>
  );
}
