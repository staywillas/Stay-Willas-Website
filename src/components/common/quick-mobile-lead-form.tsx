"use client";

import React, { useState } from "react";
import { Phone, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

interface QuickMobileLeadFormProps {
  villaName?: string;
  location?: string;
  defaultCoupon?: string;
  discountPercent?: number;
  className?: string;
}

export default function QuickMobileLeadForm({
  villaName = "Luxury Private Pool Villas",
  location = "Lonavala / Khopoli",
  defaultCoupon = "ESCAPE28",
  discountPercent = 28,
  className = "",
}: QuickMobileLeadFormProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number to claim your 28% discount.");
      return;
    }

    setIsSubmitting(true);

    const message = `Hi Stay Willas! 🌟 I want to claim the special *${discountPercent}% OFF* Direct Discount (Coupon: *${defaultCoupon}*) for *${villaName}* in ${location}.\n\n📱 My Contact Number: *+91 ${cleanNumber}*\n\nPlease share available dates and the discounted quotation with 28% off! ✨`;
    const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.open(whatsappUrl, "_blank");
    }, 400);
  };

  return (
    <div className={`w-full bg-[#1B3564] text-white rounded-3xl p-5 sm:p-7 md:p-8 border border-[#DAA520]/50 shadow-[0_15px_40px_rgba(27,53,100,0.25)] relative overflow-hidden ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(218,165,32,0.15)_0,rgba(218,165,32,0)_65%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center md:text-left">
        {/* Discount Badge */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/25 text-[#DAA520] border border-[#DAA520]/40 px-3.5 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} className="text-[#DAA520]" />
            LIMITED AD OFFER • {discountPercent}% OFF
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
            Coupon: <strong className="text-white font-black">{defaultCoupon}</strong>
          </span>
        </div>

        {/* Heading & Subhead */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-2 leading-tight">
          Unlock Exclusive {discountPercent}% Off Direct Deal
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 font-normal leading-relaxed">
          Enter your mobile number to instantly claim your 28% off coupon code & get a fast quotation directly on WhatsApp in under 5 minutes.
        </p>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus-within:border-[#DAA520] focus-within:ring-2 focus-within:ring-[#DAA520]/30 transition-all flex items-center px-4 py-3">
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
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap shrink-0 border-none"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
                    <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
                  </svg>
                  <span>CLAIM 28% OFF</span>
                  <ArrowRight size={14} className="stroke-[3]" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-200">
                  Coupon {defaultCoupon} Activated!
                </h4>
                <p className="text-[11px] text-slate-300">
                  Redirecting to WhatsApp with your 28% discount quote...
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
        <p className="text-[10px] md:text-[11px] text-slate-400 mt-3 flex items-center justify-center md:justify-start gap-1.5 font-medium">
          <ShieldCheck size={13} className="text-[#DAA520]" />
          <span>Instant WhatsApp confirmation • No spam • 100% Direct Booking Guarantee</span>
        </p>
      </div>
    </div>
  );
}
