"use client";

import React, { useState } from "react";
import { Phone, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Loader2, CloudRain } from "lucide-react";

interface QuickMobileLeadFormProps {
  villaName?: string;
  location?: string;
  defaultCoupon?: string;
  discountPercent?: number;
  className?: string;
  offerTitle?: string;
  highlightText?: string;
}

export default function QuickMobileLeadForm({
  villaName = "Luxury Private Pool Villas",
  location = "Lonavala / Khopoli",
  defaultCoupon = "STAYW28",
  discountPercent = 28,
  className = "",
  offerTitle = "Monsoon Escape",
  highlightText = "Stay 2 Nights & Save More (Weekdays Only)",
}: QuickMobileLeadFormProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number to claim your Monsoon Escape discount.");
      return;
    }

    setIsSubmitting(true);

    const message = `Hi Stay Willas! 🌧️ I want to claim the *${offerTitle}* Direct Weekday Offer (*${highlightText}*) for *${villaName}* in ${location} (Coupon: *${defaultCoupon}*).\n\n📱 My Contact Number: *+91 ${cleanNumber}*\n\nPlease send the available Monday–Thursday dates and the 2-night saver quote! ✨`;
    const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.open(whatsappUrl, "_blank");
    }, 400);
  };

  return (
    <div className={`w-full bg-gradient-to-r from-[#1B3564] via-[#122A54] to-[#1B3564] text-white rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-[#DAA520] shadow-[0_15px_40px_rgba(27,53,100,0.35)] relative overflow-hidden ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.18)_0,rgba(218,165,32,0)_65%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center md:text-left">
        {/* Discount Badge */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#DAA520] text-[#1B3564] px-3.5 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider shadow-sm">
            <CloudRain size={13} className="stroke-[2.5]" />
            {offerTitle.toUpperCase()} • {discountPercent}%+ OFF
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider">
            {highlightText}
          </span>
        </div>

        {/* Heading & Subhead */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-2 leading-tight">
          Unlock the {offerTitle} 2-Night Weekday Saver Deal
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 mb-5 font-normal leading-relaxed">
          Enter your mobile number to get the direct weekday offer quotation (valid Monday to Thursday) sent instantly to your WhatsApp in under 5 minutes.
        </p>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl focus-within:border-[#DAA520] focus-within:ring-2 focus-within:ring-[#DAA520]/40 transition-all flex items-center px-4 py-3">
              <span className="text-slate-300 text-xs sm:text-sm font-bold mr-2 select-none border-r border-white/20 pr-2">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="Enter 10-digit Mobile No."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-transparent text-white placeholder:text-slate-400 text-xs sm:text-sm font-semibold outline-none border-none p-0 focus:ring-0"
              />
              <Phone size={16} className="text-slate-400 shrink-0 ml-2" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap shrink-0 border-none hover:scale-102"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <>
                  <Phone size={14} className="stroke-[2.5]" />
                  <span>CLAIM MONSOON OFFER</span>
                  <ArrowRight size={14} className="stroke-[3]" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-500/25 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-200">
                  {offerTitle} Offer Activated!
                </h4>
                <p className="text-[11px] text-slate-300">
                  Redirecting to WhatsApp with your 2-night weekday saver quote...
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[10px] text-slate-300 hover:text-white uppercase tracking-wider font-bold underline cursor-pointer"
            >
              Edit No.
            </button>
          </div>
        )}

        {/* Micro-guarantee */}
        <p className="text-[10px] md:text-[11px] text-slate-300 mt-3 flex items-center justify-center md:justify-start gap-1.5 font-medium">
          <ShieldCheck size={14} className="text-[#DAA520]" />
          <span>Strictly Valid on Mon–Thu Stays • Instant WhatsApp Quotation • 100% Direct Booking Rate</span>
        </p>
      </div>
    </div>
  );
}

