"use client";

import React from "react";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone, ArrowUp, ArrowRight } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-[#0E1B35] to-[#0A162B] text-[#FAF8F5] pt-32 pb-12 px-6 md:px-12 lg:px-24 border-t border-[#DAA520]/20 relative overflow-hidden">
      {/* Elegant Gold Glow Backdrop Overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Plan Your Stay CTA Banner */}
      <div className="max-w-7xl mx-auto relative z-10 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b3564]/80 to-[#0F2341]/95 p-10 md:p-16 border border-[#DAA520]/20 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAA520]/10 rounded-full blur-[80px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#DAA520]/5 rounded-full blur-[60px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="text-[#DAA520] font-black tracking-[0.3em] uppercase text-[10px] mb-3 block">Ready to Escape?</span>
              <h3 className="text-3xl md:text-4xl font-heading text-white leading-tight">
                Plan Your <span className="italic text-[#DAA520]">Perfect Stay</span>
              </h3>
              <p className="text-white/60 text-sm mt-3 max-w-md font-light">Tell us your dates and preferences. Our villa concierge will curate the perfect villa for you.</p>
            </div>
            <a
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hello Stay Willas Concierge! 🏡 I am ready to plan our luxury escape. Could you help us check availability for our next vacation?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full px-10 py-4 text-xs font-black tracking-[0.25em] uppercase transition-all duration-300 shadow-lg shadow-[#DAA520]/20 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3 whitespace-nowrap shrink-0"
            >
              BOOK NOW
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-3">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#DAA520]/30 shadow-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:border-[#DAA520] transition-colors">
                <img 
                  src="/images/logo.png" 
                  alt="Stay Willas Logo" 
                  className="w-full h-full object-cover scale-[1.6]" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl tracking-wider text-[#FAF8F5] leading-none">STAY</span>
                <span className="font-sans text-xs tracking-[0.3em] text-[#DAA520] uppercase font-bold">Willas</span>
              </div>
            </Link>
            <p className="text-white/70 mb-12 max-w-xs leading-relaxed text-sm">
              Discover luxury redefined. We curate extraordinary homes for unforgettable escapes across Maharashtra.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Camera, href: "#" },
                { Icon: Mail, href: "mailto:staywillas@gmail.com" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#DAA520] hover:border-[#DAA520] hover:text-[#1B3564] hover:shadow-lg transition-all duration-300 group"
                >
                  <item.Icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Explore</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "All Stays", href: "/villas" },
                { name: "Destinations", href: "/destinations" },
                { name: "Villas in Lonavala", href: "/areas/lonavala" },
                { name: "Alibaug Villas", href: "/areas/alibaug" },
                { name: "Karjat Villas", href: "/areas/karjat" },
                { name: "Luxury Villas in Khopoli", href: "/areas/khopoli" },
                { name: "Experiences", href: "/experiences" },
                { name: "Guest Stories", href: "/stories" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#FAF8F5]/60 hover:text-[#DAA520] transition-colors duration-300 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Featured Stays & Special Offers */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Featured Offers</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "The Angle House", href: "/villa/the-angle-house" },
                { name: "Canopy Crest", href: "/villa/canopy-crest" },
                { name: "Lonavala Pool Villa", href: "/villas-in-lonavala-with-private-pool" },
                { name: "Khopoli Villas", href: "/khopoli-villas" },
                { name: "Group Escape Deal", href: "/escape" },
                { name: "Travel Blog", href: "/blog" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#FAF8F5]/60 hover:text-[#DAA520] transition-colors duration-300 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Company</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Partner With Us", href: "/partner" },
                { name: "Contact Us", href: "/contact" },
                { name: "My Wishlist", href: "/wishlist" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#FAF8F5]/60 hover:text-[#DAA520] transition-colors duration-300 text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h4 className="font-heading text-lg mb-8 tracking-wider text-white font-bold">Get in Touch</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3.5 group">
                <MapPin className="text-[#DAA520] shrink-0 mt-1 group-hover:scale-110 transition-transform" size={18} />
                <p className="text-white/70 text-sm leading-relaxed">
                  Kim cottage, 14, PR Kadam Marg,<br /> Maneklal Estate, Ghatkopar West,<br /> Mumbai, Maharashtra 400084
                </p>
              </div>
              <div className="flex items-center gap-3.5 group">
                <Phone className="text-[#DAA520] shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <a href="tel:+919619042310" className="text-white/70 hover:text-[#DAA520] transition-colors text-sm font-medium">+91 96190 42310</a>
              </div>
              <div className="flex items-center gap-3.5 group">
                <svg 
                  className="text-[#DAA520] shrink-0 group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  width="18" 
                  height="18" 
                  fill="currentColor"
                >
                  <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
                </svg>
                <a href="https://wa.me/919619042310?text=Hi%20Stay%20Willas%21%20%F0%9F%8D%BE%20I%27d%20love%20to%20connect%20with%20your%20luxury%20villa%20concierge%20to%20ask%20a%20few%20questions%20about%20your%20premium%20villas.%20" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#25D366] transition-colors text-sm font-medium">
                  Chat with Villa Concierge
                </a>
              </div>
              <div className="flex items-center gap-3.5 group">
                <Mail className="text-[#DAA520] shrink-0 group-hover:scale-110 transition-transform" size={18} />
                <a href="mailto:staywillas@gmail.com" className="text-white/70 hover:text-[#DAA520] transition-colors text-sm font-medium">staywillas@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#DAA520]/0 via-[#DAA520]/20 to-[#DAA520]/0 mb-12" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-xs tracking-wider font-medium uppercase">
            © {new Date().getFullYear()} Stay Willas. All Rights Reserved.
          </p>
          
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
            <Link href="/privacy" className="text-white/40 hover:text-[#DAA520] transition-colors text-xs uppercase tracking-[0.2em] font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-[#DAA520] transition-colors text-xs uppercase tracking-[0.2em] font-medium">
              Terms of Service
            </Link>
            <Link href="/cancellation-policy" className="text-white/40 hover:text-[#DAA520] transition-colors text-xs uppercase tracking-[0.2em] font-medium">
              Cancellation Policy
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#DAA520] hover:border-[#DAA520] hover:text-[#0E1B35] hover:shadow-[0_0_20px_rgba(218,165,32,0.4)] transition-all duration-300 group cursor-pointer"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
