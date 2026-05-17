"use client";

import React from "react";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal text-white pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span className="font-heading text-charcoal font-bold text-xl">W</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl tracking-wider text-white leading-none">STAY</span>
                <span className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-medium">Willas</span>
              </div>
            </Link>
            <p className="text-white/50 mb-10 max-w-xs leading-relaxed">
              We&apos;re here to help you find the perfect home for your next holiday. 
              Beautiful spaces, warm service, and great memories.
            </p>
            <div className="flex gap-4">
              {[Camera, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wide">Explore</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "All Villas", href: "/villas" },
                { name: "Destinations", href: "/destinations" },
                { name: "Experiences", href: "/experiences" },
                { name: "Special Packages", href: "/packages" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-gold transition-colors duration-300 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wide">Company</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Partner With Us", href: "/partner" },
                { name: "Careers", href: "#" },
                { name: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-gold transition-colors duration-300 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="font-heading text-lg mb-8 tracking-wide">Contact</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                <p className="text-white/50 text-sm leading-relaxed">
                  101, Luxury Plaza, Bandra West,<br /> Mumbai, Maharashtra 400050
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-gold shrink-0" size={18} />
                <p className="text-white/50 text-sm">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-gold shrink-0" size={18} />
                <p className="text-white/50 text-sm">concierge@staywillas.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-xs tracking-wider">
            © 2026 STAY WILLAS LUXURY HOSPITALITY. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex gap-8">
            <Link href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em]">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em]">
              Terms of Service
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-charcoal transition-all group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
