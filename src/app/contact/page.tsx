import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Stay Willas | Book Lonavala Villa with Pool",
  description: "Contact Stay Willas concierge to book the best villa in Lonavala with pool or Khopoli staycation estate. 24/7 WhatsApp customer support available.",
  keywords: [
    "stay willas contact", 
    "lonavala villa with pool booking", 
    "best villa in lonavala", 
    "khopoli villa staycation",
    "private pool villa near mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/contact",
  },
  openGraph: {
    title: "Contact Stay Willas | Book Lonavala Villa with Pool",
    description: "Contact Stay Willas concierge to book the best villa in Lonavala with pool or Khopoli staycation estate. 24/7 WhatsApp customer support available.",
    url: "https://www.staywillas.com/contact",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Contact Stay Willas Concierge",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Stay Willas | Book Lonavala Villa with Pool",
    description: "Contact Stay Willas concierge to book the best villa in Lonavala with pool or Khopoli staycation estate. 24/7 WhatsApp customer support available.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <h1 className="sr-only">Stay Willas Contact | Customer Support & Villa Bookings</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.staywillas.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact Us",
                "item": "https://www.staywillas.com/contact"
              }
            ]
          })
        }}
      />
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
              <h2 className="text-2xl font-heading mb-8 flex items-center gap-4 italic text-accent-primary">
                Direct Contact
              </h2>
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
                {/* Mumbai Office */}
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-accent-secondary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mb-1">Mumbai Office</p>
                    <p className="text-sm font-semibold text-[#1B3564]">Kim Cottage, 14, PR Kadam Marg</p>
                    <p className="text-xs text-text-primary/60 leading-snug mt-0.5">
                      Maneklal Estate, Ghatkopar West, Mumbai, MH 400084
                    </p>
                  </div>
                </div>

                {/* Chennai Office */}
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#DAA520]/40 flex items-center justify-center text-[#DAA520] shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] text-accent-secondary uppercase tracking-widest font-bold">Chennai Office</p>
                      <span className="bg-[#DAA520]/15 text-[#1B3564] text-[9px] font-black px-1.5 py-0.5 rounded">X736+H45</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1B3564]">1st Cross St, Sunrise Ave</p>
                    <p className="text-xs text-text-primary/60 leading-snug mt-0.5">
                      Singaravelan Salai, Neelankarai, Chennai, TN 600115
                    </p>
                    <a
                      href="https://www.google.com/maps/place/12%C2%B057'14.0%22N+80%C2%B015'37.3%22E/@12.953897,80.260373,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-accent-primary hover:text-accent-secondary font-bold mt-2"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="p-10 rounded-[32px] bg-gradient-to-br from-[#1B3564] to-[#0F2341] text-white border border-white/10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/15 rounded-full blur-[40px] translate-x-1/4 -translate-y-1/4" />
              <div className="relative z-10">
                <h2 className="text-2xl font-heading mb-3 text-[#DAA520] italic">Explore Properties</h2>
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
              <h2 className="text-xl font-heading mb-4 text-accent-primary italic underline underline-offset-8">Property Owners</h2>
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

      {/* Interactive Google Maps Pinpoint Section */}
      <section className="pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DAA520]/30 rounded-[2.5rem] p-6 md:p-10 shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent-secondary font-bold tracking-[0.25em] uppercase text-xs">
                  Official Office Location
                </span>
                <span className="bg-[#DAA520]/15 text-[#1B3564] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#DAA520]/30">
                  Chennai Hub
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-heading text-[#1B3564] font-semibold">
                Visit Our <span className="italic text-accent-primary">Chennai Office</span>
              </h2>
              <p className="text-xs md:text-sm text-text-primary/60 mt-1 max-w-2xl">
                1st Cross St, Sunrise Ave, Singaravelan Salai, Neelankarai, Chennai, Tamil Nadu 600115 (Plus Code: <strong>X736+H45 Chennai, Tamil Nadu</strong>)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/maps/place/12%C2%B057'14.0%22N+80%C2%B015'37.3%22E/@12.953897,80.260373,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1B3564] hover:bg-[#152A50] text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <MapPin size={14} className="text-[#DAA520]" />
                Open in Google Maps
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=12.953897,80.260373"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#1B3564]/20 hover:border-[#DAA520] text-[#1B3564] px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <ArrowRight size={14} className="text-accent-primary" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Embedded Map Container */}
          <div className="relative w-full h-[380px] md:h-[450px] rounded-3xl overflow-hidden border border-[#DAA520]/25 shadow-inner bg-slate-100">
            <iframe
              title="Stay Willas Chennai Office Google Maps Pinpoint"
              src="https://maps.google.com/maps?q=12.953897,80.260373&hl=en&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Coordinates Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1B3564]">GPS Coordinates:</span>
              <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">12.953897, 80.260373</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1B3564]">Plus Code:</span>
              <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">X736+H45 Chennai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1B3564]">Landmarks:</span>
              <span className="text-slate-800 text-[11px]">Sunrise Ave, Neelankarai / ECR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rich SEO Contact & Booking Information Section */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#DAA520]/20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-accent-secondary font-semibold tracking-[0.3em] uppercase text-xs mb-3 block">
              Reservations & Guest Support
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#1B3564] mb-4">
              Planning Your Next <span className="italic text-accent-primary font-serif font-light">Luxury Staycation?</span>
            </h2>
            <p className="text-text-primary/75 text-sm md:text-base leading-relaxed font-light">
              Our reservation concierge is standing by to help you choose the perfect private pool villa in Lonavala or sprawling group estate in Khopoli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-3">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Lonavala Villa with Pool Desk
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                Interested in reserving <a href="/villas-in-lonavala-with-private-pool" className="underline font-semibold text-accent-primary">The Angle House</a>—voted the <strong className="font-semibold text-[#1B3564]">best villa in Lonavala</strong>? Get instant availability checks, tariff details, and private waterfall pool customization via WhatsApp.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-3">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Khopoli Group Offsite Booking
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                Need a <strong className="font-semibold text-[#1B3564]">weekend getaway villa in Khopoli</strong> for large family reunions or corporate retreats? Contact us for custom stay packages at <a href="/khopoli-villas" className="underline font-semibold text-accent-primary">Canopy Crest</a> with charpai lawns & swimming pools.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#DAA520]/20 shadow-sm space-y-3">
              <h3 className="text-xl font-heading font-bold text-[#1B3564]">
                Chef & Concierge Services
              </h3>
              <p className="text-text-primary/75 text-xs md:text-sm leading-relaxed font-light">
                We organize in-house chef meal packages (including dedicated Jain & vegetarian setups), pet-friendly arrangements, barbecue grilles, and outdoor bonfire setups tailored to your trip preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
