"use client";

import React from "react";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white pt-32 pb-12 px-6 md:px-12 lg:px-24 border-t border-white/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/30 shadow-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:border-blue-300 transition-colors">
                <img 
                  src="/images/web logo.png" 
                  alt="Stay Willas Logo" 
                  className="w-full h-full object-cover scale-[1.6]" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl tracking-wider text-white leading-none">STAY</span>
                <span className="font-sans text-xs tracking-[0.3em] text-blue-300 uppercase font-bold">Willas</span>
              </div>
            </Link>
            <p className="text-white/70 mb-12 max-w-xs leading-relaxed text-sm">
              Discover luxury redefined. We curate extraordinary homes for unforgettable escapes across Maharashtra.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Camera, href: "#" },
                { Icon: Mail, href: "#" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <item.Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Explore</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "All Villas", href: "/villas" },
                { name: "Destinations", href: "/destinations" },
                { name: "Experiences", href: "/experiences" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-blue-300 transition-colors duration-300 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Company</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Partner With Us", href: "/partner" },
                { name: "Careers", href: "#" },
                { name: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-blue-300 transition-colors duration-300 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Get in Touch</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3.5 group">
                <MapPin className="text-blue-300 shrink-0 mt-1 group-hover:scale-110 transition-transform" size={18} />
                <p className="text-white/70 text-sm leading-relaxed">
                  101, Luxury Plaza, Bandra West,<br /> Mumbai, Maharashtra 400050
                </p>
              </div>
              <div className="flex items-center gap-3.5 group">
                <Phone className="text-blue-300 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <a href="tel:+919619042310" className="text-white/70 hover:text-blue-300 transition-colors text-sm font-medium">+91 96190 42310</a>
              </div>
              <div className="flex items-center gap-3.5 group">
                <svg 
                  className="text-blue-300 shrink-0 group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  width="18" 
                  height="18" 
                  fill="currentColor"
                >
                  <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
                </svg>
                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-green-300 transition-colors text-sm font-medium">
                  WhatsApp Us
                </a>
              </div>
              <div className="flex items-center gap-3.5 group">
                <Mail className="text-blue-300 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <a href="mailto:staywillas@gmail.com" className="text-white/70 hover:text-blue-300 transition-colors text-sm font-medium">staywillas@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-12" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-xs tracking-wider font-medium">
            © 2026 STAY WILLAS LUXURY HOSPITALITY. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex gap-8">
            <Link href="#" className="text-white/40 hover:text-blue-300 transition-colors text-xs uppercase tracking-[0.2em] font-medium">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/40 hover:text-blue-300 transition-colors text-xs uppercase tracking-[0.2em] font-medium">
              Terms of Service
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 hover:shadow-glow-blue transition-all duration-300 group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
