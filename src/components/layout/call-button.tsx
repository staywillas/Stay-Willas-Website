"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneCall, X, Clock, ShieldCheck } from "lucide-react";

export default function CallButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const phoneNumber = "+919619042310";
  const displayPhone = "+91 9619042310";

  return (
    <div ref={containerRef} className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[8001] flex flex-col items-end">
      {/* Small Elegant Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Direct Villa Concierge Calling"
          className="mb-3 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[340px] bg-white/95 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-5 shadow-[0_20px_50px_rgba(27,53,100,0.18)] text-[#1B3564] animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                Direct Line
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close call popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="pt-3 pb-4">
            <h4 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-1.5 font-serif">
              Speak to Villa Concierge
            </h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Instant date availability, custom meal plans & direct booking quotes for Lonavala & Khopoli estates.
            </p>

            {/* Quick Benefits */}
            <div className="mt-3.5 space-y-1.5 text-[11px] text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>0% Commission • Best Direct Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Available 9:00 AM – 10:30 PM (Mon–Sun)</span>
              </div>
            </div>
          </div>

          {/* Call CTA Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2.5 w-full bg-[#1B3564] hover:bg-[#122444] active:scale-[0.98] text-white py-3 px-4 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 text-center"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Call {displayPhone}</span>
          </a>

          <div className="mt-2.5 text-center">
            <span className="text-[10px] text-stone-400">Toll-free mobile call • Instant connection</span>
          </div>
        </div>
      )}

      {/* Floating Call Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#1B3564] to-[#2A4E8C] text-white rounded-full shadow-[0_10px_30px_rgba(27,53,100,0.38)] hover:shadow-[0_14px_35px_rgba(27,53,100,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/40 focus:outline-none focus:ring-4 focus:ring-[#1B3564]/30"
        title="Call Villa Concierge"
        aria-label="Call Stay Willas Concierge"
        aria-expanded={isOpen}
      >
        {/* Soft breathing pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-[#2A4E8C]/30 animate-ping pointer-events-none" />

        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200 rotate-90" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Phone className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-12" />
            {/* Live Indicator Dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#1B3564] rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
}
