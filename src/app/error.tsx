"use client";

import { useEffect } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Warning icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
          <AlertTriangle size={28} className="text-brand-gold" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl text-brand-navy tracking-wide">
          Something went wrong
        </h2>
        <p className="text-text-secondary mt-3 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="w-12 h-[1px] bg-border-subtle" />
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <div className="w-12 h-[1px] bg-border-subtle" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-brand-navy text-white rounded-full px-6 py-3 text-sm font-semibold tracking-wider hover:bg-brand-navy/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-brand-navy/20 cursor-pointer"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 border border-brand-gold text-brand-navy rounded-full px-6 py-3 text-sm font-semibold tracking-wider hover:bg-brand-gold/10 transition-all duration-300"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] text-text-secondary/50 tracking-wider uppercase">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
