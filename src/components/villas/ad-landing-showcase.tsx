"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, ShieldCheck, Check, PhoneCall, Sparkles, 
  ArrowRight, Users, BedDouble, Bath, Waves, Utensils, 
  Heart, Flame, AlertCircle, Quote
} from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  highlight: string;
}

interface AdLandingShowcaseProps {
  villaSlug: string;
  villaName: string;
  location: string;
  originalPrice: number;
  discountedPrice: number;
  couponCode: string;
  images: { url: string; title: string; tag: string }[];
  reviews: Review[];
}

export default function AdLandingShowcase({
  villaSlug,
  villaName,
  location,
  originalPrice,
  discountedPrice,
  couponCode,
  images,
  reviews,
}: AdLandingShowcaseProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const savings = originalPrice - discountedPrice;
  const otaEstimatedPrice = Math.round(originalPrice * 1.18); // OTAs charge 18% service fees/taxes
  const totalDirectSavings = otaEstimatedPrice - discountedPrice;

  const whatsappMessage = `Hi Stay Willas! 🌟 I'm looking at *${villaName}* in ${location} on the special 28% off offer (Coupon: *${couponCode}*).\n\nOriginal Rate: ₹${originalPrice.toLocaleString("en-IN")}\nDiscounted Rate: ₹${discountedPrice.toLocaleString("en-IN")}/night\n\nPlease check availability and share a direct booking quote! ✨`;
  const whatsappUrl = `https://wa.me/919619042310?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="w-full space-y-12 sm:space-y-16">
      
      {/* ========================================================================= */}
      {/* 1. DIRECT VS OTA PRICING COMPARISON MATRIX */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-[#DAA520]" />
            SMART BOOKING COMPARISON
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#1B3564]">
            Why Smart Travelers Book Direct With Us
          </h3>
          <p className="text-xs sm:text-sm text-text-primary/70 max-w-xl mx-auto mt-1">
            Skip middleman OTA commissions & unlock 28% flat weekday discount + VIP concierge care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Stay Willas Direct Card (Winner) */}
          <div className="bg-gradient-to-b from-[#1B3564] to-[#102447] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#DAA520] shadow-[0_15px_40px_rgba(27,53,100,0.3)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#DAA520] text-[#1B3564] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md">
              BEST RATE GUARANTEE
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#DAA520]/30 flex items-center justify-center text-[#DAA520] font-black text-xs">
                  🏆
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#DAA520]">
                  Stay Willas Direct Booking
                </span>
              </div>

              <div className="my-4">
                <span className="text-3xl sm:text-4xl font-heading font-black text-white">
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-300 ml-1.5 font-medium">/ night (with 28% coupon)</span>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  🎉 Save ~₹{totalDirectSavings.toLocaleString("en-IN")} vs Online Portals
                </div>
              </div>

              <ul className="space-y-2.5 my-6 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0 stroke-[3]" />
                  <span><strong>28% Mega Weekday Discount</strong> with code <code className="text-[#DAA520] font-bold">{couponCode}</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0 stroke-[3]" />
                  <span><strong>0% Platform & Convenience Fee</strong> (Save 18-20% extra)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0 stroke-[3]" />
                  <span><strong>Custom In-House Chef Meal Packages</strong> (Veg, Non-Veg & Jain)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0 stroke-[3]" />
                  <span><strong>Complimentary Early Check-in Assistance</strong> (Subject to slots)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0 stroke-[3]" />
                  <span><strong>Direct 24/7 WhatsApp Concierge</strong> Support</span>
                </li>
              </ul>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>CLAIM DIRECT 28% DEAL ON WHATSAPP</span>
            </a>
          </div>

          {/* OTAs / Booking Aggregators Card */}
          <div className="bg-slate-50 text-slate-700 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between opacity-85">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Booking Portals & Third-Party OTAs
              </span>

              <div className="my-4">
                <span className="text-3xl font-heading font-bold text-slate-500 line-through">
                  ₹{otaEstimatedPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400 ml-1.5">/ night (incl. taxes & fee)</span>
                <div className="text-[11px] text-red-500 font-semibold mt-1">
                  ⚠️ Heavy OTA commissions added to your bill
                </div>
              </div>

              <ul className="space-y-2.5 my-6 text-xs text-slate-500">
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="text-red-400 font-black">✕</span>
                  <span>No 28% direct weekday discount offer</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="text-red-400 font-black">✕</span>
                  <span>18% - 20% aggregator service fees</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="text-red-400 font-black">✕</span>
                  <span>No direct contact with on-ground property manager</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="text-red-400 font-black">✕</span>
                  <span>Rigid robotic check-in / check-out times</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="text-red-400 font-black">✕</span>
                  <span>Third-party call center delays</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-200/70 p-3.5 rounded-xl text-center text-xs font-semibold text-slate-600">
              Why pay extra for the exact same villa?
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PHOTO GALLERY SHOWCASE WITH 1-CLICK INQUIRY */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-accent-secondary text-xs font-bold uppercase tracking-widest block mb-1">
            Visual Tour
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#1B3564]">
            Explore the Sanctuary & Amenities
          </h3>
          <p className="text-xs sm:text-sm text-text-primary/70 max-w-xl mx-auto mt-1">
            Real untouched photos of the private pool, master suites, lawns, and dining spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden group shadow-md border border-slate-200/80 bg-slate-100"
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Badge */}
              <span className="absolute top-3 left-3 bg-[#1B3564]/90 backdrop-blur-md text-[#DAA520] text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#DAA520]/30 shadow">
                {img.tag}
              </span>

              {/* Title & Quick Inquire Button */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <span className="text-white text-xs sm:text-sm font-bold font-heading line-clamp-1">
                  {img.title}
                </span>
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🌟 I'm viewing photos of *${villaName}* (${img.title}) on the 28% discount page. Could you confirm availability?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-600 text-white p-1.5 rounded-full shrink-0 shadow-lg transition-transform active:scale-90"
                  title="Inquire about this view"
                >
                  <PhoneCall size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VERIFIED GUEST REVIEWS & SOCIAL PROOF */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#FAF8F5] border border-[#DAA520]/30 rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-[#1B3564]">
              4.9 / 5.0 Rating from 500+ Verified Stays
            </h3>
            <p className="text-xs sm:text-sm text-text-primary/70 mt-1">
              Read real guest experiences from families, corporate groups, and weekend travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-[#1B3564] block">{rev.name}</strong>
                    <span className="text-[10px] text-slate-500">{rev.location}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase">
                    Verified Stay
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-slate-200/60">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#0F2142] text-[#DAA520] hover:text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Talk to Villa Host on WhatsApp</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STICKY MOBILE BOTTOM CONVERSION BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1B3564]/95 backdrop-blur-md border-t-2 border-[#DAA520] px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-wider block leading-none">
            28% OFF WEEKDAYS
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-heading font-black text-white leading-none">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-[9px] text-slate-300 font-medium">/ night</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/villa/${villaSlug}`}
            className="bg-white/15 hover:bg-white/25 text-white font-black text-[10px] uppercase tracking-wider px-3 py-2.5 rounded-xl border border-white/20 transition-all active:scale-95 whitespace-nowrap"
          >
            Specs
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <PhoneCall size={12} className="stroke-[2.5]" />
            <span>CLAIM 28% DEAL</span>
          </a>
        </div>
      </div>

    </div>
  );
}
