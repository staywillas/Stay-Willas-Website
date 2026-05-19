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
                <a href="tel:+919619042310" className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-charcoal transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Give Us a Call</p>
                    <p className="text-xl group-hover:text-gold transition-colors">+91 96190 42310</p>
                  </div>
                </a>

                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-[#25D366] group-hover:text-white transition-all">
                    <svg 
                      viewBox="0 0 24 24" 
                      width="20" 
                      height="20" 
                      fill="currentColor"
                    >
                      <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">WhatsApp Chat</p>
                    <p className="text-xl group-hover:text-[#25D366] transition-colors">+91 96190 42310</p>
                  </div>
                </a>
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
