"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Decorative top line */}
        <div className="w-16 h-[2px] bg-brand-gold mx-auto mb-8" />

        {/* 404 Number */}
        <h1 className="font-heading text-[120px] sm:text-[160px] leading-none font-bold text-brand-navy/10 select-none">
          404
        </h1>

        {/* Message */}
        <div className="-mt-8 sm:-mt-12 relative z-10">
          <h2 className="font-heading text-2xl sm:text-3xl text-brand-navy tracking-wide">
            This page has checked out
          </h2>
          <p className="text-text-secondary mt-3 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a new address.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="w-12 h-[1px] bg-border-subtle" />
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <div className="w-12 h-[1px] bg-border-subtle" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 bg-brand-navy text-white rounded-full px-6 py-3 text-sm font-semibold tracking-wider hover:bg-brand-navy/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-brand-navy/20"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            href="/villas"
            className="flex items-center gap-2 border border-brand-gold text-brand-navy rounded-full px-6 py-3 text-sm font-semibold tracking-wider hover:bg-brand-gold/10 transition-all duration-300"
          >
            <Search size={16} />
            Browse Villas
          </Link>
        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-brand-navy transition-colors tracking-wider uppercase font-medium cursor-pointer"
        >
          <ArrowLeft size={12} />
          Go back
        </button>
      </div>
    </div>
  );
}
