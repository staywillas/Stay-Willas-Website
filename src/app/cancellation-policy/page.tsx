import React from "react";
import { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy Guidelines | Stay Willas",
  description: "Contact Stay Willas to discuss cancellation, refund and rescheduling details for your booking.",
  keywords: ["cancellation and refund policy", "stay willas cancellation"],
  alternates: {
    canonical: "https://www.staywillas.com/cancellation-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy Guidelines | Stay Willas",
    description: "Contact Stay Willas to discuss cancellation, refund and rescheduling details for your booking.",
    url: "https://www.staywillas.com/cancellation-policy",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation & Refund Policy Guidelines | Stay Willas",
    description: "Contact Stay Willas to discuss cancellation, refund and rescheduling details for your booking.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>

        <section className="pt-36 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
              <XCircle size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Updated: November 02, 2026</span>
              <h1 className="text-3xl md:text-5xl font-heading text-[#1B3564] font-bold leading-tight mt-1">
                Cancellation & Refund Policy
              </h1>
            </div>
          </div>

          <div className="prose max-w-none text-left font-sans text-slate-800 space-y-5 text-sm sm:text-base leading-relaxed">
            <p>Plans can change. Please contact the Stay Willas team by phone to discuss a cancellation, refund or change of dates for your booking.</p>
            <p>Cancellation and refund arrangements are discussed directly with the team for each booking. Ask for the applicable terms and complete price before you confirm your stay.</p>
            <p><a className="font-bold text-[#1B3564] underline" href="tel:+919619042310">Call +91 96190 42310</a></p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
