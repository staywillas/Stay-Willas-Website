import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Stay Willas | Concierge & Inquiries",
  description: "Get in touch with the Stay Willas team. Whether you're looking for a villa booking or want to list your property, we're here to help.",
  keywords: ["contact stay willas", "villa inquiry", "customer support villas"],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
            We&apos;re Here <br />
            <span className="italic text-gold text-gradient">To Help.</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h3 className="text-2xl font-heading mb-8 flex items-center gap-4 italic text-gold">
                Direct Contact
              </h3>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Give Us a Call</p>
                    <p className="text-xl">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-xl">concierge@staywillas.com</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-xl">101, Luxury Plaza, Bandra West, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-gold/5 border border-gold/10">
              <h4 className="text-xl font-heading mb-4 text-gold italic underline underline-offset-8">Property Owners</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Want to list your home with us? We&apos;d love to share it with our guests.
              </p>
              <Button className="w-full bg-gold text-charcoal hover:bg-gold/80 rounded-full font-bold">
                PARTNER WITH US
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
