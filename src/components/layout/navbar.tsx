"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center transition-transform duration-700 group-hover:rotate-[360deg]">
            <span className="font-heading text-charcoal font-bold text-xl leading-none">W</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl tracking-[0.1em] text-white leading-tight">STAY WILLAS</span>
            <span className="font-sans text-[8px] tracking-[0.4em] text-white/40 uppercase font-bold">The Gold Standard</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
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
        <div className="hidden md:flex items-center gap-6">
          <Link href="tel:+919876543210" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors duration-300">
            <Phone size={14} />
            <span className="text-[10px] font-bold tracking-widest uppercase">+91 98765 43210</span>
          </Link>
          
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
            
            <Button className="bg-gold hover:bg-gold/80 text-charcoal rounded-full px-6 py-5 h-auto text-[10px] font-black tracking-[0.2em] shadow-lg shadow-gold/20">
              BOOK NOW
            </Button>
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
              
              <Link href="tel:+919876543210" className="flex items-center gap-4 text-gold text-xl font-medium">
                <Phone size={24} />
                <span>+91 98765 43210</span>
              </Link>
              
              <Button className="bg-gold hover:bg-gold/80 text-charcoal rounded-full w-full py-8 text-xl font-black tracking-widest mt-8">
                RESERVE NOW
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
