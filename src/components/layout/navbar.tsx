"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown, Heart } from "lucide-react";
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
  const [wishlistCount, setWishlistCount] = useState(0);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isDarkTheme = isScrolled || !isHomePage;

  const updateCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("wishlist-updated", updateCount);
    window.addEventListener("storage", updateCount);
    
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setIsScrolled(scrollPos > 30);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Villas", href: "/villas" },
    { name: "Destinations", href: "/destinations" },
    { name: "Experiences", href: "/experiences" },
    { name: "Packages", href: "/packages" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out w-full",
      isScrolled ? "px-0 py-0" : "px-4 md:px-8 lg:px-12 py-4 md:py-6"
    )}>
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-in-out flex items-center justify-between gap-6 md:gap-8 w-full",
          isScrolled
            ? "rounded-none glass shadow-md shadow-charcoal/5 border-b border-cream-border/50 px-6 md:px-8 lg:px-12 py-3 md:py-4"
            : "max-w-7xl rounded-full px-6 md:px-8 lg:px-12 py-3 md:py-4 " + (
                isDarkTheme
                  ? "glass shadow-lg shadow-charcoal/10 border border-cream-border/60"
                  : "bg-transparent border-transparent"
              )
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="relative w-10 md:w-11 h-10 md:h-11 rounded-full overflow-hidden border border-accent-secondary/30 shadow-md transition-transform duration-700 group-hover:rotate-[360deg] bg-white/5 flex items-center justify-center shrink-0">
            <img 
              src="/images/stay villa brand logo.png" 
              alt="Stay Willas Logo" 
              className="w-full h-full object-cover scale-110" 
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-heading text-lg md:text-xl tracking-[0.1em] leading-tight transition-colors duration-500 whitespace-nowrap",
              isDarkTheme ? "text-text-primary" : "text-white"
            )}>STAY WILLAS</span>
            <span className={cn(
              "font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold transition-colors duration-500 whitespace-nowrap",
              isDarkTheme ? "text-text-primary/50" : "text-white/50"
            )}>The Gold Standard</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-8 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[12px] xl:text-[13px] font-bold transition-all duration-300 tracking-[0.2em] uppercase relative group/link whitespace-nowrap",
                isDarkTheme
                  ? "text-text-primary/70 hover:text-accent-primary"
                  : "text-white/70 hover:text-white"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover/link:w-full",
                isDarkTheme ? "bg-accent-primary" : "bg-white"
              )} />
            </Link>
          ))}

          <div className="relative group cursor-pointer">
            <div className={cn(
              "flex items-center gap-1 text-[12px] xl:text-[13px] font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap",
              isDarkTheme
                ? "text-text-primary/70 hover:text-accent-primary"
                : "text-white/70 hover:text-white"
            )}>
              More <ChevronDown size={12} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
              <div className="glass border border-border-subtle/60 rounded-2xl p-6 min-w-[180px] shadow-xl shadow-[#2C1F0E]/10">
                <div className="flex flex-col gap-4">
                  <Link href="/about" className="text-[12px] font-bold text-text-primary/70 hover:text-accent-primary tracking-widest uppercase transition-colors">About</Link>
                  <Link href="/partner" className="text-[12px] font-bold text-text-primary/70 hover:text-accent-primary tracking-widest uppercase transition-colors">Partner</Link>
                  <Link href="/contact" className="text-[12px] font-bold text-text-primary/70 hover:text-accent-primary tracking-widest uppercase transition-colors">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 shrink-0">
          <a href="tel:+919619042310" className={cn(
            "flex items-center gap-2 transition-colors duration-300 p-1",
            isDarkTheme ? "text-text-primary/50 hover:text-accent-primary" : "text-white/50 hover:text-white"
          )} title="+91 96190 42310">
            <Phone size={14} className="shrink-0" />
            <span className="text-[11px] xl:text-[12px] font-bold tracking-widest uppercase whitespace-nowrap hidden 2xl:inline">+91 96190 42310</span>
          </a>

          <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className={cn(
            "flex items-center gap-2 transition-colors duration-300 p-1",
            isDarkTheme ? "text-text-primary/50 hover:text-[#25D366]" : "text-white/50 hover:text-[#25D366]"
          )} title="WhatsApp Chat">
            <WhatsAppIcon size={14} className="shrink-0" />
            <span className="text-[11px] xl:text-[12px] font-bold tracking-widest uppercase whitespace-nowrap hidden 2xl:inline">WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
            <Link 
              href="/wishlist" 
              className={cn(
                "transition-colors relative group/wish flex items-center justify-center p-2",
                isDarkTheme ? "text-text-primary/50 hover:text-red-500" : "text-white/50 hover:text-red-400"
              )}
              title="View Wishlist"
            >
              <Heart size={18} className="group-hover/wish:scale-110 transition-transform duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border border-bg-primary">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" className={cn(
                  "hover:bg-transparent p-2 h-auto",
                  isDarkTheme ? "text-text-primary/60 hover:text-accent-primary" : "text-white/60 hover:text-white"
                )}>
                  <User size={18} />
                </Button>
              </SignInButton>
            )}

            <Link href="/villas" className="bg-accent-primary hover:bg-[#1E7A8C] text-bg-primary rounded-full px-4 lg:px-5 py-2.5 lg:py-3 text-[10px] xl:text-[11px] font-black tracking-[0.2em] shadow-[0_0_15px_rgba(27,53,100,0.3)] hover:shadow-[0_0_20px_rgba(30,122,140,0.4)] transition-all duration-300 flex items-center justify-center whitespace-nowrap">
              BOOK NOW
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle & Wishlist */}
        <div className="lg:hidden flex items-center gap-2 md:gap-3 shrink-0">
          <Link 
            href="/wishlist" 
            className={cn(
              "transition-colors relative group/wish flex items-center justify-center p-2",
              isDarkTheme ? "text-text-primary/50 hover:text-red-500" : "text-white/50 hover:text-red-400"
            )}
            title="View Wishlist"
          >
            <Heart size={18} className="group-hover/wish:scale-110 transition-transform duration-300" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] font-black text-white flex items-center justify-center border border-bg-primary">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <button
            className={cn(
              "p-2 transition-colors",
              isDarkTheme ? "text-text-primary" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden bg-cream flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cream-border">
                  <img src="/images/stay villa brand logo.png" alt="Stay Willas" className="w-full h-full object-cover scale-110" />
                </div>
                <span className="font-heading text-2xl tracking-widest text-charcoal">MENU</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} className="text-navy" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {[...navLinks, { name: "About", href: "/about" }, { name: "Contact", href: "/contact" }].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-4xl font-heading text-charcoal hover:text-navy transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-cream-border my-8" />

              <div className="flex flex-col gap-4">
                <a href="tel:+919619042310" className="flex items-center gap-4 text-navy text-xl font-medium">
                  <Phone size={24} className="text-navy" />
                  <span>+91 96190 42310</span>
                </a>

                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-charcoal hover:text-[#25D366] text-xl font-medium transition-colors">
                  <WhatsAppIcon size={24} className="text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <Link href="/villas" onClick={() => setIsMobileMenuOpen(false)} className="bg-navy hover:bg-teal text-cream text-center rounded-full w-full py-5 text-base font-black tracking-widest mt-8 shadow-[0_0_15px_rgba(27,53,100,0.3)] transition-all duration-300 block">
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
