import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Partner With Stay Willas | Luxury Villa Management Maharashtra",
  description: "List your property with Maharashtra's most exclusive villa staycation platform. We offer end-to-end management, marketing, and premium guest hospitality.",
  keywords: ["villa management lonavala", "luxury villa management alibaug", "list my villa", "Stay Willas partners"],
};
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, BarChart3, Globe2, ShieldCheck, Zap } from "lucide-react";
import PartnerForm from "@/components/partner/partner-form";

export default function PartnerPage() {
  const steps = [
    { title: "Get in Touch", desc: "Tell us a bit about your home through our simple form." },
    { title: "Drop by", desc: "We'll visit to see the space and talk about how we can work together." },
    { title: "Beautiful Setup", desc: "We take professional photos and write a lovely description of your home." },
    { title: "Go Live", desc: "Your home goes live on our site, and we start welcoming guests!" }
  ];

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
          List Your Property
        </span>
        <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
          Let&apos;s Share Your <br />
          <span className="italic text-gold">Home With Guests.</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          Let us handle the hard work of running, managing, and promoting your villa 
          so you can sit back and watch it thrive.
        </p>
        <a href="#partner-form" className="btn-glow-gold px-12 py-6 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl inline-block">
          INQUIRE NOW
        </a>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Higher Earnings", desc: "Smart, dynamic pricing to make sure you get the best value for your home." },
              { icon: BarChart3, title: "All Bookings Handled", desc: "We manage your listings across all top booking platforms so you don't have to." },
              { icon: ShieldCheck, title: "Total Peace of Mind", desc: "We screen all guests carefully and have full insurance coverage to protect your home." },
              { icon: Globe2, title: "Loved by Travelers", desc: "We show your home to thousands of families and groups looking for great stays." },
              { icon: Zap, title: "Easy Reservations", desc: "Real-time updates and seamless booking systems mean no double-bookings." },
              { icon: CheckCircle2, title: "Professional Care", desc: "Our trained staff keeps your home clean, fresh, and perfectly looked after." },
            ].map((benefit) => (
              <div key={benefit.title} className="glass-dark p-10 rounded-3xl border border-white/5 hover:border-gold/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 text-gold group-hover:bg-gold group-hover:text-charcoal transition-all">
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-2xl font-heading mb-4">{benefit.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-heading text-center mb-20 italic">The Journey to Partnership</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="text-8xl font-heading text-white/5 absolute -top-10 -left-4">0{i+1}</div>
              <div className="relative z-10 pt-4">
                <h3 className="text-2xl font-heading text-gold mb-4 uppercase tracking-widest">{step.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{step.desc}</p>
              </div>
              {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gold/20" />}
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <PartnerForm />
      </section>

      <Footer />
    </main>
  );
}
