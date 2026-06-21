import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Stay Willas | Luxury Villa Bookings & Inquiries",
  description: "Get in touch with the Stay Willas support team. Whether you want to book a private pool villa or list your luxury property, we are here to help.",
  keywords: ["stay willas contact", "book luxury villa maharashtra", "villa rental customer support", "stay willas concierge"],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <h1 className="sr-only">Contact Stay Willas - Luxury Villa Bookings & Inquiries</h1>
      <Navbar />
      
      {/* Hero */}
      <section className="pt-48 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-accent-secondary font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-5xl md:text-8xl font-heading mb-8 leading-tight">
            We&apos;re Here <br />
            <span className="italic text-accent-primary">To Help.</span>
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h3 className="text-2xl font-heading mb-8 flex items-center gap-4 italic text-accent-primary">
                Direct Contact
              </h3>
              <div className="space-y-8">
                <a href="tel:+919619042310" className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary group-hover:bg-accent-primary group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mb-1">Give Us a Call</p>
                    <p className="text-xl group-hover:text-accent-secondary transition-colors">+91 96190 42310</p>
                  </div>
                </a>

                <a href="https://wa.me/919619042310?text=Hello%20Stay%20Willas%21%20%F0%9F%8C%B8%20I%20visited%20your%20contact%20page%20and%20would%20love%20to%20connect%20with%20your%20villa%20concierge%20to%20discuss%20planning%20an%20unforgettable%20luxury%20staycation.%20%E2%9C%A8" target="_blank" rel="noopener noreferrer" className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary group-hover:bg-[#25D366] group-hover:text-white transition-all">
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
                    <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mb-1">WhatsApp Chat</p>
                    <p className="text-xl group-hover:text-[#25D366] transition-colors">+91 96190 42310</p>
                  </div>
                </a>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mb-1">Email Us</p>
                    <a href="mailto:staywillas@gmail.com" className="text-xl hover:text-accent-secondary transition-colors">staywillas@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-xl leading-snug">
                      Kim cottage, 14, PR Kadam Marg, <br />
                      Maneklal Estate, Ghatkopar West, <br />
                      Mumbai, Maharashtra 400084
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="p-10 rounded-[32px] bg-gradient-to-br from-[#1B3564] to-[#0F2341] text-white border border-white/10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/15 rounded-full blur-[40px] translate-x-1/4 -translate-y-1/4" />
              <div className="relative z-10">
                <h4 className="text-2xl font-heading mb-3 text-[#DAA520] italic">Explore Properties</h4>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  Ready to experience absolute luxury? Browse our handpicked private villas and premium destinations.
                </p>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/villas"
                    className="w-full bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] text-center rounded-full py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                  >
                    View Our Villas
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/destinations"
                    className="w-full border border-white/20 hover:border-white hover:bg-white/5 text-white text-center rounded-full py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Explore Destinations
                  </Link>
                  <Link
                    href="/experiences"
                    className="w-full border border-white/20 hover:border-white hover:bg-white/5 text-white text-center rounded-full py-4 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Luxury Experiences
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-accent-primary/5 border border-accent-primary/10">
              <h4 className="text-xl font-heading mb-4 text-accent-primary italic underline underline-offset-8">Property Owners</h4>
              <p className="text-text-primary/55 text-sm leading-relaxed mb-6">
                Want to list your home with us? We&apos;d love to share it with our guests.
              </p>
              <Button className="w-full bg-accent-primary text-white hover:bg-accent-secondary rounded-full font-bold">
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
