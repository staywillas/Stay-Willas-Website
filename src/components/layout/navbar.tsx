"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useLenis } from "lenis/react";


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
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  useLenis((lenis) => {
    if (lenis) {
      setIsScrolled(lenis.scroll > 30);
    }
  });

  const isHomePage = pathname === "/";

  const isDarkTheme = true;

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
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setIsScrolled(currentScrollY > 30);
      
      // Mobile hide/show based on scroll direction
      if (currentScrollY < 80) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current + 5) {
        setIsNavVisible(false); // Scrolling down
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsNavVisible(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const handleToggleMenu = () => setIsMobileMenuOpen(prev => !prev);
    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    
    return () => {
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Villas", href: "/villas" },
    { name: "Destinations", href: "/destinations" },
    { name: "Experiences", href: "/experiences" },
  ];

  return (
    <nav 
      className={cn(
        "fixed transition-all duration-500 ease-in-out",
        isScrolled 
          ? "top-0 left-0 right-0 w-full px-0 py-0" 
          : "top-0 left-0 right-0 w-full px-4 md:px-8 lg:px-12 py-4 md:py-6",
        // Mobile override: always float like a card at the top
        "max-xl:top-4 max-xl:left-4 max-xl:right-4 max-xl:w-auto max-xl:p-0",
        // Scroll-direction-aware mobile hide/show
        !isNavVisible && !isMobileMenuOpen ? "max-xl:-translate-y-[calc(100%+2rem)] max-xl:opacity-0" : "max-xl:translate-y-0 max-xl:opacity-100"
      )}
      style={{ zIndex: 99999 }}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-in-out flex items-center justify-between gap-6 md:gap-8 w-full",
          isScrolled
            ? "rounded-none bg-[#F5F2EA]/95 backdrop-blur-md shadow-md border-b border-[#DAA520]/15 px-6 md:px-8 lg:px-12 py-3 md:py-4"
            : "max-w-[1400px] rounded-full px-6 md:px-8 lg:px-12 py-3 md:py-4 bg-[#F5F2EA]/90 backdrop-blur-md border border-[#DAA520]/20 shadow-xl",
          // Mobile overrides: always rounded-full, with clean spacing
          "max-xl:rounded-full max-xl:bg-[#F5F2EA]/90 max-xl:border max-xl:border-[#DAA520]/20 max-xl:shadow-xl max-xl:px-4 max-xl:py-2.5"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-accent-secondary/30 shadow-md transition-transform duration-700 group-hover:rotate-[360deg] bg-white/5 flex items-center justify-center shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Stay Willas Logo" 
              className="w-full h-full object-cover scale-[1.6]" 
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-heading text-sm sm:text-xl md:text-2xl tracking-widest leading-tight transition-colors duration-500 whitespace-nowrap",
              isDarkTheme ? "text-brand-navy" : "text-white"
            )}>STAY WILLAS</span>
            <span className={cn(
              "font-sans text-[7px] sm:text-[11px] md:text-[12px] tracking-[0.14em] uppercase font-bold transition-colors duration-500 whitespace-nowrap",
              isDarkTheme ? "text-brand-navy/70" : "text-white/70"
            )}>stay ! Relax ! Repeat !</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center justify-center gap-2.5 xl:gap-4.5 flex-initial min-w-max px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-all duration-300 tracking-wider relative group/link whitespace-nowrap",
                isDarkTheme
                  ? "text-brand-navy hover:text-brand-gold"
                  : "text-white hover:text-brand-gold"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100",
                "bg-brand-gold"
              )} />
            </Link>
          ))}

          <div className="relative group cursor-pointer">
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold tracking-wider transition-all whitespace-nowrap",
              isDarkTheme
                ? "text-brand-navy hover:text-brand-gold"
                : "text-white hover:text-brand-gold"
            )}>
              More <ChevronDown size={14} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
              <div className="glass-premium border border-yellow-200/50 rounded-2xl p-6 min-w-[200px] shadow-xl shadow-yellow-900/5">
                <div className="flex flex-col gap-4">
                  <Link href="/about" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">About</Link>
                  <Link href="/partner" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Partner</Link>
                  <Link href="/contact" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-4 shrink-0">
          <a href="tel:+919619042310" className={cn(
            "flex items-center gap-2 transition-colors duration-300 p-1",
            isDarkTheme ? "text-brand-navy hover:text-brand-gold" : "text-white hover:text-brand-gold"
          )} title="+91 96190 42310">
            <Phone size={16} className="shrink-0" />
            <span className="text-[13px] xl:text-[14px] font-semibold tracking-wide whitespace-nowrap hidden 2xl:inline">+91 96190 42310</span>
          </a>

          <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className={cn(
            "flex items-center gap-2 transition-colors duration-300 p-1",
            isDarkTheme ? "text-brand-navy hover:text-[#25D366]" : "text-white hover:text-[#25D366]"
          )} title="WhatsApp Chat">
            <WhatsAppIcon size={16} className="shrink-0" />
            <span className="text-[13px] xl:text-[14px] font-semibold tracking-wide whitespace-nowrap hidden 2xl:inline">WhatsApp</span>
          </a>

          <div className="flex items-center gap-2.5 lg:gap-3 xl:gap-4">
            <Link 
              href="/wishlist" 
              className={cn(
                "transition-colors relative group/wish flex items-center justify-center p-2",
                isDarkTheme ? "text-brand-navy hover:text-red-500" : "text-white hover:text-red-400"
              )}
              title="View Wishlist"
            >
              <Heart size={20} className="group-hover/wish:scale-110 transition-transform duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border border-bg-primary">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-[#DAA520]/40 hover:border-[#DAA520] transition-colors rounded-full",
                    userButtonPopoverCard: "shadow-xl border border-[#DAA520]/20 rounded-2xl font-sans",
                    userButtonPopoverActionButton: "font-semibold text-[#1B3564] hover:text-[#DAA520]",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  className={cn(
                    "p-2 flex items-center justify-center transition-colors duration-300 rounded-full hover:bg-[#DAA520]/10",
                    isDarkTheme ? "text-brand-navy hover:text-brand-gold" : "text-white hover:text-brand-gold"
                  )}
                  title="Guest Log In"
                >
                  <User size={20} />
                </button>
              </SignInButton>
            )}

            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi! I'd like to book a luxury villa stay with Stay Willas. Could you help me find the perfect villa?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full px-4 lg:px-6 py-2.5 lg:py-3 text-[11px] xl:text-[12px] font-black tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              BOOK NOW
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle & Wishlist (Moved to Bottom Nav) */}
      </div>

      {/* Full-Screen Glassmorphism Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100000] xl:hidden"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-[#0a1628]/85 backdrop-blur-2xl" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-12">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img src="/images/logo.png" alt="Stay Willas" className="w-full h-full object-cover scale-[1.6]" />
                  </div>
                  <span className="font-heading text-xl tracking-widest text-white/90">STAY WILLAS</span>
                </div>
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 cursor-pointer"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={22} />
                </motion.button>
              </div>

              {/* Navigation Links - Centered with stagger */}
              <motion.nav 
                className="flex flex-col items-center justify-center gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
                  }
                }}
              >
                {[...navLinks, { name: "About", href: "/about" }, { name: "Contact", href: "/contact" }].map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
                    }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-3xl sm:text-4xl font-heading tracking-wider transition-all duration-300 py-3 block",
                        pathname === link.href 
                          ? "text-[#DAA520]" 
                          : "text-white/70 hover:text-white"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Bottom Section */}
              <div className="flex flex-col items-center gap-6">
                {/* Reserve CTA */}
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi! I'd like to book a luxury villa stay with Stay Willas. Could you help me find the perfect villa?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] text-center rounded-full w-full max-w-xs py-4 text-xs font-black tracking-[0.25em] uppercase shadow-lg shadow-[#DAA520]/20 hover:shadow-xl transition-all duration-300 block active:scale-95"
                >
                  RESERVE YOUR VILLA
                </a>
                
                {/* Contact Row */}
                <div className="flex items-center gap-6">
                  <a href="tel:+919619042310" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                    <Phone size={16} />
                    <span className="font-medium">Call</span>
                  </a>
                  <div className="w-px h-4 bg-white/20" />
                  <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-[#25D366] transition-colors text-sm">
                    <WhatsAppIcon size={16} />
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
