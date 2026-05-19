"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

const WhatsAppIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Villas", href: "/villas" },
    { name: "Destinations", href: "/destinations" },
    { name: "Experiences", href: "/experiences" },
    { name: "Packages", href: "/packages" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
      <div
        className={cn(
          "max-w-7xl mx-auto rounded-full transition-all duration-700 ease-in-out flex items-center justify-between px-8 py-3",
          isScrolled 
            ? "glass-dark shadow-2xl backdrop-blur-2xl border-white/10 py-3" 
            : "bg-transparent border-transparent py-4"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center transition-transform duration-700 group-hover:rotate-[360deg]">
            <span className="font-heading text-charcoal font-bold text-xl leading-none">W</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl tracking-[0.1em] text-white leading-tight">STAY WILLAS</span>
            <span className="font-sans text-[8px] tracking-[0.4em] text-white/40 uppercase font-bold">The Gold Standard</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] font-bold text-white/60 hover:text-gold transition-all duration-300 tracking-[0.2em] uppercase relative group/link"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover/link:w-full" />
            </Link>
          ))}
          
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1 text-[11px] font-bold text-white/60 hover:text-gold tracking-[0.2em] uppercase transition-all">
              More <ChevronDown size={12} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
              <div className="glass-dark border border-white/10 rounded-2xl p-6 min-w-[180px] shadow-2xl">
                <div className="flex flex-col gap-4">
                  <Link href="/about" className="text-[10px] font-bold text-white/60 hover:text-gold tracking-widest uppercase">About</Link>
                  <Link href="/partner" className="text-[10px] font-bold text-white/60 hover:text-gold tracking-widest uppercase">Partner</Link>
                  <Link href="/contact" className="text-[10px] font-bold text-white/60 hover:text-gold tracking-widest uppercase">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4 xl:gap-6 shrink-0">
          <a href="tel:+919619042310" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors duration-300" title="+91 96190 42310">
            <Phone size={14} className="shrink-0" />
            <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap hidden xl:inline">+91 96190 42310</span>
          </a>
          
          <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-[#25D366] transition-colors duration-300" title="WhatsApp Chat">
            <WhatsAppIcon size={14} className="shrink-0" />
            <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap hidden xl:inline">WhatsApp</span>
          </a>
          
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white/60 hover:text-gold hover:bg-transparent px-2">
                  <User size={18} />
                </Button>
              </SignInButton>
            )}
            
            <Link href="/villas" className="bg-[#FFCC00] hover:bg-[#FFD700] text-black rounded-full px-6 py-3.5 text-[10px] font-black tracking-[0.2em] shadow-[0_0_15px_rgba(255,204,0,0.3)] transition-all duration-300 flex items-center justify-center">
              BOOK NOW
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden bg-charcoal flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-heading text-2xl tracking-widest">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} className="text-gold" />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {[...navLinks, { name: "About", href: "/about" }, { name: "Contact", href: "/contact" }].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-4xl font-heading text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px w-full bg-white/5 my-8" />
              
              <div className="flex flex-col gap-4">
                <a href="tel:+919619042310" className="flex items-center gap-4 text-gold text-xl font-medium">
                  <Phone size={24} className="text-gold" />
                  <span>+91 96190 42310</span>
                </a>
                
                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white hover:text-[#25D366] text-xl font-medium transition-colors">
                  <WhatsAppIcon size={24} className="text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
              
              <Link href="/villas" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#FFCC00] hover:bg-[#FFD700] text-black text-center rounded-full w-full py-5 text-base font-black tracking-widest mt-8 shadow-[0_0_15px_rgba(255,204,0,0.3)] transition-all duration-300 block">
                RESERVE NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
