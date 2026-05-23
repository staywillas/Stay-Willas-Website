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
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="text-accent-secondary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
          List Your Property
        </span>
        <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
          Let&apos;s Share Your <br />
          <span className="italic text-accent-primary">Home With Guests.</span>
        </h1>
        <p className="text-text-primary/55 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          Let us handle the hard work of running, managing, and promoting your villa 
          so you can sit back and watch it thrive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="#partner-form" className="btn-glow-gold px-12 py-6 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl inline-block w-full sm:w-auto text-center">
            INQUIRE NOW
          </a>
          <a href="/partner/portal" className="border border-accent-secondary hover:bg-accent-secondary/10 px-12 py-6 rounded-full text-[10px] font-bold tracking-widest text-accent-secondary uppercase transition-all duration-300 inline-block w-full sm:w-auto text-center">
            OWNER LOG IN
          </a>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-bg-secondary">
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
              <div key={benefit.title} className="bg-bg-primary p-10 rounded-3xl border border-border-subtle hover:border-accent-primary/30 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6 text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all">
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-2xl font-heading mb-4">{benefit.title}</h3>
                <p className="text-text-primary/40 leading-relaxed text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-heading text-center mb-16 italic text-accent-primary">The Journey to Partnership</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div 
              key={step.title} 
              className="relative bg-bg-primary border border-border-subtle rounded-3xl p-8 hover:shadow-xl hover:border-accent-secondary/30 transition-all duration-300 group flex flex-col justify-between min-h-[220px]"
            >
              {/* Number Badge */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl font-heading font-bold text-accent-primary/40 group-hover:text-accent-secondary/50 transition-colors">
                  0{i+1}
                </span>
                <span className="w-8 h-8 rounded-full bg-accent-primary/5 group-hover:bg-accent-secondary/10 flex items-center justify-center text-accent-primary group-hover:text-accent-secondary transition-all text-xs font-bold font-mono">
                  ✓
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-heading text-accent-primary mb-3 uppercase tracking-wider group-hover:text-accent-secondary transition-colors">
                  {step.title}
                </h3>
                <p className="text-text-primary/70 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
              
              {/* Connecting Line Accent */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-4 h-[1px] bg-[#E2E8F0]/80 z-20 pointer-events-none" />
              )}
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
