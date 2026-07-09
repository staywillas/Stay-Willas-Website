import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Stay Willas",
  description: "Read the Stay Willas Terms and Conditions for villa rentals, bookings, guest conduct, and liability details.",
  alternates: {
    canonical: "https://www.staywillas.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <Navbar />

        <section className="pt-36 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Last Updated: July 09, 2026</span>
              <h1 className="text-3xl md:text-5xl font-heading text-[#1B3564] font-bold leading-tight mt-1">
                Terms & Conditions
              </h1>
            </div>
          </div>

          {/* Terms Body */}
          <div className="prose max-w-none text-left font-sans text-slate-800 space-y-8 font-light text-sm sm:text-base leading-relaxed">
            <p>
              Welcome to <strong>Stay Willas</strong>. These terms and conditions outline the rules and regulations for the use of Stay Willas' Website, located at <a href="https://www.staywillas.com" className="underline font-bold text-accent-primary">www.staywillas.com</a>.
            </p>
            <p>
              By accessing this website we assume you accept these terms and conditions. Do not continue to use Stay Willas if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              1. Booking & Reservation Policies
            </h2>
            <p>
              Reservations are confirmed only upon receipt of the designated booking advance (normally 50% or 100% depending on seasonal demand) and confirmation from our team.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Guest Identification:</strong> All guests staying at the villa must submit valid government ID documents prior to check-in. Non-registered guests are not allowed overnight without prior approval.</li>
              <li><strong>Check-in/Check-out:</strong> Standard Check-in is at 2:00 PM and Check-out is at 11:00 AM. Early check-in or late check-out is subject to availability and extra charges.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              2. Guest Conduct & Property Damage
            </h2>
            <p>
              We pride ourselves on offering peaceful family retreat environments. Guests are expected to maintain social decency and keep properties clean.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Damages:</strong> A security deposit is collected at check-in. Any damage to furniture, pools, gardens, or structure caused during the stay will be charged directly from the security deposit.</li>
              <li><strong>Illegal Activities:</strong> Possession or use of illegal substances, weapons, or organizing unapproved commercial events is strictly banned. Violations will lead to immediate eviction without refund.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              3. Limitation of Liability
            </h2>
            <p>
              Stay Willas acts as a listing and concierge agent. We are not liable for accidental injuries, natural disasters, utility failures (water/electricity cuts by municipal boards), or personal property loss during your stay. We recommend guests lock valuables in bedroom drawers.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
