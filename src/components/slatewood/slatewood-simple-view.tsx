"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Waves,
  Trophy,
  Home,
  UtensilsCrossed,
  MessageCircle,
  Phone,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export default function SlatewoodSimpleView() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subtle, sleek loading state for fluid liquid glass entry
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl =
    "https://wa.me/919619042310?text=Hi%20Stay%20Willas,%20I%20would%20like%20to%20pre-book%20Slatewood%20Villa%20(Pool%20&%20Turf).%20Please%20share%20priority%20dates%20and%20rates.";

  const amenities = [
    {
      icon: Waves,
      title: "Private Swimming Pool",
      desc: "Sun deck & underwater evening illumination",
      accent: "text-sky-300",
      glow: "group-hover:border-sky-400/40",
    },
    {
      icon: Trophy,
      title: "Private Sports Turf",
      desc: "All-weather floodlit turf for box cricket & games",
      accent: "text-emerald-300",
      glow: "group-hover:border-emerald-400/40",
    },
    {
      icon: Home,
      title: "Slate & Teak Architecture",
      desc: "Spacious suites & private balconies for 16-20 guests",
      accent: "text-amber-200",
      glow: "group-hover:border-amber-400/40",
    },
    {
      icon: UtensilsCrossed,
      title: "In-Villa Chef & Caretaker",
      desc: "Home-cooked meals, barbecue & 0% booking fee",
      accent: "text-rose-200",
      glow: "group-hover:border-rose-400/40",
    },
  ];

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-[#050811] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/80 animate-spin" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/50 font-light">Loading Preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#060a14] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none relative font-sans">
      {/* ----------------- FLUID LIQUID BACKGROUND ORBS ----------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-amber-400/15 via-rose-500/10 to-transparent blur-[130px]" />
        <div className="absolute -bottom-[10%] left-[30%] w-[600px] h-[400px] rounded-full bg-gradient-to-t from-sky-600/15 via-indigo-700/10 to-transparent blur-[140px]" />
      </div>

      {/* ----------------- ARCHITECTURAL LIQUID GLASS SLIDING DOORS (REPLACES THEATRE CURTAINS) ----------------- */}
      <div
        className={`fixed inset-0 z-50 flex pointer-events-none transition-all duration-1000 ${
          curtainsOpen ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        {/* Left Liquid Glass Panel */}
        <div
          onClick={() => !curtainsOpen && setCurtainsOpen(true)}
          className={`relative w-1/2 h-full backdrop-blur-3xl bg-white/[0.03] border-r border-white/[0.12] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.2)] ${
            curtainsOpen ? "-translate-x-full" : "translate-x-0 cursor-pointer"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-white/[0.04]" />
        </div>

        {/* Right Liquid Glass Panel */}
        <div
          onClick={() => !curtainsOpen && setCurtainsOpen(true)}
          className={`relative w-1/2 h-full backdrop-blur-3xl bg-white/[0.03] border-l border-white/[0.12] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)] ${
            curtainsOpen ? "translate-x-full" : "translate-x-0 cursor-pointer"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-white/[0.04]" />
        </div>

        {/* Centered Liquid Glass Unveiling Monolith */}
        {!curtainsOpen && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-50 pointer-events-auto">
            <div
              onClick={() => setCurtainsOpen(true)}
              className="group relative cursor-pointer w-full max-w-[360px] sm:max-w-[420px] p-6 sm:p-8 rounded-[32px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.2] shadow-[0_30px_90px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:border-white/[0.3] hover:bg-white/[0.08]"
            >
              <div className="flex flex-col items-center text-center">
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.2] shadow-inner mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-white/90">
                    Stay Willas • Private Preview
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-2">
                  Slatewood
                </h1>

                <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed max-w-xs mb-5">
                  Modern Villa with Private Swimming Pool &amp; Sports Turf
                </p>

                {/* Minimal Glass Badges */}
                <div className="flex items-center gap-2 text-[11px] text-white/70 mb-6 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                  <span>🏊 Private Pool</span>
                  <span className="text-white/20">•</span>
                  <span>🏏 Box Turf</span>
                  <span className="text-white/20">•</span>
                  <span>🌿 Western Ghats</span>
                </div>

                {/* Unveil Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurtainsOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl bg-white/[0.12] hover:bg-white/[0.2] text-white text-xs sm:text-sm font-medium border border-white/[0.25] shadow-[0_10px_25px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all group-hover:border-white/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Slide Glass to Unveil</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Control: Re-seal / Re-open */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setCurtainsOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.18] backdrop-blur-2xl text-[11px] text-white/80 transition-all shadow-md active:scale-95"
          title={curtainsOpen ? "Close Glass Partitions" : "Slide Open"}
        >
          {curtainsOpen ? (
            <>
              <RotateCcw className="w-3 h-3 text-cyan-300" />
              <span>Close Glass</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-3 h-3 text-cyan-300" />
              <span>Slide Open</span>
            </>
          )}
        </button>
      </div>

      {/* ----------------- THE REVEALED STAGE: LIQUID GLASS ARCHITECTURE (NO SCROLL) ----------------- */}

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto shrink-0 pt-1 sm:pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-all py-1.5 px-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] backdrop-blur-2xl shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-2xl text-[10px] sm:text-xs text-white/80 font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Opening Soon</span>
        </div>
      </header>

      {/* Main Glass Stage */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center my-auto px-2">
        {/* Subtle Glass Capsule Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl mb-2 sm:mb-3 shadow-inner">
          <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/80 font-medium">
            Architectural Retreat • Maharashtra
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-white mb-2">
          Slatewood
        </h2>

        {/* 1 to 2 Lines Summary */}
        <p className="text-white/60 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed mb-4 sm:mb-6">
          A luxury private sanctuary crafted for family holidays and celebrations, balancing active play with restorative poolside comfort.
        </p>

        {/* 4 Clean Liquid Glass Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-xl text-left">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.12] hover:border-white/[0.25] backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.06] border border-white/[0.15] shadow-inner">
                    <Icon className={`w-4 h-4 ${item.accent}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-medium text-white tracking-tight truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-white/50 truncate font-light mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Liquid Glass CTA Row */}
      <footer className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-2 shrink-0 pb-1">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#25D366]/90 hover:bg-[#25D366] text-white font-medium text-xs sm:text-sm shadow-[0_10px_30px_rgba(37,211,102,0.25)] border border-emerald-400/30 backdrop-blur-xl transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pre-book Now on WhatsApp</span>
          </a>

          <a
            href="tel:+919619042310"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.16] backdrop-blur-xl text-white font-medium text-xs sm:text-sm transition-all"
          >
            <Phone className="w-4 h-4 text-cyan-300" />
            <span>+91 9619042310</span>
          </a>
        </div>

        <span className="text-[10px] text-white/40 tracking-wider uppercase font-light">
          0% Platform Fee • Exclusive Direct Booking
        </span>
      </footer>
    </div>
  );
}
