import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy Guidelines | Stay Willas",
  description: "Read the Stay Willas cancellation and refund policy for your peace of mind. Learn about cancellation slabs, refunds, and rescheduling.",
  keywords: ["cancellation and refund policy", "stay willas cancellation"],
  alternates: {
    canonical: "https://www.staywillas.com/cancellation-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy Guidelines | Stay Willas",
    description: "Read the Stay Willas cancellation and refund policy for your peace of mind. Learn about cancellation slabs, refunds, and rescheduling.",
    url: "https://www.staywillas.com/cancellation-policy",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation & Refund Policy Guidelines | Stay Willas",
    description: "Read the Stay Willas cancellation and refund policy for your peace of mind. Learn about cancellation slabs, refunds, and rescheduling.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <Navbar />

        <section className="pt-36 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
              <XCircle size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Last Updated: July 09, 2026</span>
              <h1 className="text-3xl md:text-5xl font-heading text-[#1B3564] font-bold leading-tight mt-1">
                Cancellation & Refund Policy
              </h1>
            </div>
          </div>

          {/* Cancellation Body */}
          <div className="prose max-w-none text-left font-sans text-slate-800 space-y-8 font-light text-sm sm:text-base leading-relaxed">
            <p>
              At <strong>Stay Willas</strong>, we understand that travel plans can change. Since we hold reservations exclusively for booking guests, cancellation charges apply as per our policy slabs detailed below.
            </p>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              1. Cancellation Refund Slabs
            </h2>
            <p>
              Refund calculations are based on the date we receive your formal cancellation request in writing:
            </p>
            
            {/* Table */}
            <div className="overflow-x-auto my-6 border border-[#DAA520]/15 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[#1B3564] font-bold border-b border-[#DAA520]/15">
                    <th className="p-4">Cancellation Period (Before Check-in Date)</th>
                    <th className="p-4">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DAA520]/15">
                  <tr>
                    <td className="p-4 font-medium">7 Days or More (More than 1 Week)</td>
                    <td className="p-4 text-emerald-600 font-bold">90% Refund</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">2 to 7 Days</td>
                    <td className="p-4 text-amber-600 font-bold">70% Refund</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Less than 2 Days (48 Hours)</td>
                    <td className="p-4 text-rose-600 font-bold">No Refund (0% refund)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              2. Rescheduling Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Rescheduling is considered on a case-by-case basis and is subject to property availability and homeowner consent.</li>
              <li>Rescheduling requests made less than 7 days prior to check-in will be treated as a cancellation and fresh booking.</li>
              <li>Price differences for weekend/peak slots will be charged extra.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              3. Processing Timelines
            </h2>
            <p>
              Approved refunds will be processed within <strong>7 to 10 working days</strong> back to the original payment source (credit card, bank account, or UPI handle).
            </p>


          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
