"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown, ChevronRight, Heart, MapPin, Sparkles, Info, Handshake, Mail, Home, Building2, MessageSquare, BookOpen, Flame, ShieldCheck } from "lucide-react";
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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const toggleSubmenu = (key: string) => setOpenSubmenu((prev) => (prev === key ? null : key));
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lenisRef = useRef<any>(null);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  useLenis((lenis) => {
    lenisRef.current = lenis;
    if (lenis) {
      setIsScrolled(lenis.scroll > 30);
    }
  });

  const isHomePage = pathname === "/";
  const hasTopPromoBanner = ["/khopoli-villas", "/villas-in-lonavala-with-private-pool", "/escape"].includes(pathname);

  const isDarkTheme = true;

  const updateCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    } catch {
      // Silently fail in production
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

  // Lock body scroll and stop Lenis when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      try { lenisRef.current?.stop(); } catch {}
    } else {
      document.body.style.overflow = "";
      try { lenisRef.current?.start(); } catch {}
    }
    return () => {
      document.body.style.overflow = "";
      try { lenisRef.current?.start(); } catch {}
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Villas", href: "/villas" },
    { name: "Areas", href: "/areas" },
    { name: "Experiences", href: "/experiences" },
    { name: "Stories", href: "/stories" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav 
        className={cn(
        "fixed transition-all duration-500 ease-in-out",
        isScrolled 
          ? "top-0 left-0 right-0 w-full px-0 py-0" 
          : hasTopPromoBanner
            ? "top-11 sm:top-12 left-0 right-0 w-full px-4 md:px-8 lg:px-12 py-2 md:py-3"
            : "top-0 left-0 right-0 w-full px-4 md:px-8 lg:px-12 py-4 md:py-6",
        // Mobile override: always float like a card at the top
        hasTopPromoBanner
          ? "max-xl:top-12 max-xl:left-3 max-xl:right-3 max-xl:w-auto max-xl:p-0"
          : "max-xl:top-4 max-xl:left-4 max-xl:right-4 max-xl:w-auto max-xl:p-0",
        // Scroll-direction-aware mobile hide/show
        !isNavVisible && !isMobileMenuOpen ? "max-xl:-translate-y-[calc(100%+4rem)] max-xl:opacity-0" : "max-xl:translate-y-0 max-xl:opacity-100"
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
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full overflow-hidden border border-accent-secondary/30 shadow-md transition-transform duration-700 group-hover:rotate-[360deg] bg-white/5 flex items-center justify-center shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Stay Willas Logo" 
              width="52"
              height="52"
              className="w-full h-full object-cover scale-[1.6]" 
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-heading text-xs sm:text-lg md:text-2xl tracking-widest leading-tight transition-colors duration-500 whitespace-nowrap font-bold",
              isDarkTheme ? "text-brand-navy" : "text-white"
            )}>STAY WILLAS</span>
            <span className={cn(
              "font-sans text-[7px] sm:text-[10px] md:text-[11px] tracking-[0.14em] uppercase font-extrabold transition-colors duration-500 whitespace-nowrap hidden sm:block",
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
                  <Link href="/destinations" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Destinations</Link>
                  <Link href="/villas-in-lonavala-with-private-pool" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Lonavala Villa Pool</Link>
                  <Link href="/khopoli-villas" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Khopoli Villas</Link>
                  <Link href="/escape" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Escape</Link>
                  <Link href="/partner" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Partner</Link>
                  <Link href="/contact" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-4 shrink-0">

          <a href="https://wa.me/919619042310?text=Hi%20Stay%20Willas%21%20%F0%9F%8C%BF%20I%27m%20exploring%20your%20exquisite%20villas%20on%20your%20website%20and%20would%20love%20to%20chat%20with%20a%20concierge%20to%20plan%20our%20next%20vacation.%20%E2%9C%A8" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={cn(
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
                    "px-4 py-2 border text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-full hover:bg-[#DAA520]/10 whitespace-nowrap cursor-pointer",
                    isDarkTheme
                      ? "text-brand-navy border-[#1B3564]/15 hover:border-brand-navy hover:text-brand-gold"
                      : "text-white border-white/15 hover:border-white hover:text-brand-gold"
                  )}
                  title="Guest Log In / Register"
                  aria-label="Login or Register"
                >
                  Login / Register
                </button>
              </SignInButton>
            )}

            <a 
              href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas Concierge! 🏡 I would love to check availability and book a luxury villa near Mumbai. Could you share details and best direct pricing?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-[11px] xl:text-[12px] font-black tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              BOOK DIRECT
            </a>
          </div>
        </div>
        {/* Mobile Header Quick Actions */}
        <div className="xl:hidden flex items-center gap-2 shrink-0">
          {/* Quick WhatsApp Action Button */}
          <a
            href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas! 🌟 I am browsing your villas and would love to check dates and rates.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Concierge"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <WhatsAppIcon size={18} className="fill-white" />
          </a>

          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border-2 border-[#DAA520] rounded-full shadow-sm",
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <button
                className="px-3 py-1 border border-[#1B3564]/20 hover:border-[#DAA520] text-[#1B3564] hover:text-[#DAA520] text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-full bg-white/90 hover:bg-[#DAA520]/10 whitespace-nowrap cursor-pointer shadow-sm hidden sm:inline-flex"
                aria-label="Login"
              >
                Login
              </button>
            </SignInButton>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1B3564] border border-[#DAA520] flex items-center justify-center text-[#DAA520] hover:bg-[#152A50] hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={19} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </nav>

    {/* Premium Slide-In Mobile Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[100000] xl:hidden"
        >
          {/* Backdrop — tap to close */}
          <motion.div
            className="absolute inset-0 bg-[#0F1E36]/75 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 h-full max-h-screen w-[85%] max-w-[380px] bg-[#0E1B35] border-l border-[#DAA520]/20 shadow-2xl flex flex-col z-[100001]"
            data-lenis-prevent
          >
            {/* Panel Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-[#DAA520]/15 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#DAA520]/35">
                  <img src="/images/logo.png" alt="Stay Willas" width="36" height="36" className="w-full h-full object-cover scale-[1.6]" />
                </div>
                <span className="font-heading text-lg tracking-widest text-[#FAF8F5]">STAY WILLAS</span>
              </div>
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-[#DAA520]/30 flex items-center justify-center text-[#FAF8F5]/80 hover:text-white hover:border-[#DAA520] transition-all duration-300 cursor-pointer"
                whileTap={{ scale: 0.9, rotate: 90 }}
                aria-label="Close Navigation Menu"
              >
                <X size={18} className="text-[#FAF8F5]" />
              </motion.button>
            </div>

            {/* Scrollable Navigation Content */}
            <div 
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 px-4 custom-scrollbar touch-pan-y overscroll-contain" 
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                
                {/* 1. Main Explore Section */}
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase font-black text-[#DAA520] mb-2 pl-2">
                    EXPLORE
                  </p>
                  <div className="flex flex-col gap-1">
                    
                    {/* Home Link */}
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-all duration-200",
                        pathname === "/"
                          ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                          : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home size={15} className="text-[#DAA520] shrink-0" />
                      <span className="text-[13px]">Home</span>
                    </Link>

                    {/* Villas Dropdown Accordion */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu("villas")}
                        className={cn(
                          "w-full flex items-center justify-between py-2 px-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left",
                          pathname.startsWith("/villa")
                            ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                            : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 size={15} className="text-[#DAA520] shrink-0" />
                          <span className="text-[13px]">Villas</span>
                        </div>
                        <ChevronDown 
                          size={13} 
                          className={cn("text-[#DAA520]/70 transition-transform duration-200", openSubmenu === "villas" && "rotate-180")} 
                        />
                      </button>

                      {openSubmenu === "villas" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l border-[#DAA520]/25"
                        >
                          <Link
                            href="/villas"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                            <span>All Luxury Villas</span>
                          </Link>
                          <Link
                            href="/villa/the-angle-house"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>The Angle House (Lonavala)</span>
                          </Link>
                          <Link
                            href="/villa/canopy-crest"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Canopy Crest (Khopoli)</span>
                          </Link>
                          <Link
                            href="/villa/willow-peak"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Willow Peak (Lonavala)</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>

                    {/* Areas & Destinations Dropdown Accordion */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu("areas")}
                        className={cn(
                          "w-full flex items-center justify-between py-2 px-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left",
                          pathname.startsWith("/areas") || pathname === "/destinations"
                            ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                            : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin size={15} className="text-[#DAA520] shrink-0" />
                          <span className="text-[13px]">Destinations</span>
                        </div>
                        <ChevronDown 
                          size={13} 
                          className={cn("text-[#DAA520]/70 transition-transform duration-200", openSubmenu === "areas" && "rotate-180")} 
                        />
                      </button>

                      {openSubmenu === "areas" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l border-[#DAA520]/25"
                        >
                          <Link
                            href="/destinations"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                            <span>All Destinations</span>
                          </Link>
                          <Link
                            href="/areas/lonavala"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Lonavala Villas</span>
                          </Link>
                          <Link
                            href="/areas/khopoli"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Khopoli Villas</span>
                          </Link>
                          <Link
                            href="/areas"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>All Destination Areas</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>

                    {/* Experiences Link */}
                    <Link
                      href="/experiences"
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-all duration-200",
                        pathname === "/experiences"
                          ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                          : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Sparkles size={15} className="text-[#DAA520] shrink-0" />
                      <span className="text-[13px]">Experiences</span>
                    </Link>

                    {/* Stories & Reviews */}
                    <Link
                      href="/stories"
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-all duration-200",
                        pathname === "/stories"
                          ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                          : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageSquare size={15} className="text-[#DAA520] shrink-0" />
                      <span className="text-[13px]">Stories</span>
                    </Link>

                    {/* Travel Blog */}
                    <Link
                      href="/blog"
                      className={cn(
                        "flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-all duration-200",
                        pathname === "/blog"
                          ? "bg-[#DAA520]/15 text-[#DAA520] font-bold border border-[#DAA520]/25"
                          : "text-[#FAF8F5]/85 hover:text-[#DAA520] hover:bg-[#FAF8F5]/5 font-semibold text-[13px]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen size={15} className="text-[#DAA520] shrink-0" />
                      <span className="text-[13px]">Blog</span>
                    </Link>
                  </div>
                </div>

                {/* 2. Special 28% Off Offers Dropdown */}
                <div className="bg-[#DAA520]/10 border border-[#DAA520]/30 rounded-2xl p-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu("offers")}
                    className="w-full flex items-center justify-between cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#DAA520] text-[#1B3564] flex items-center justify-center font-black text-[10px]">
                        %
                      </span>
                      <span className="text-[12px] font-black uppercase tracking-wider text-[#DAA520]">
                        MEGA 28% OFF OFFERS
                      </span>
                    </div>
                    <ChevronDown 
                      size={13} 
                      className={cn("text-[#DAA520] transition-transform duration-200", openSubmenu === "offers" && "rotate-180")} 
                    />
                  </button>

                  {(openSubmenu === "offers" || true) && (
                    <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-[#DAA520]/20">
                      <Link
                        href="/villas-in-lonavala-with-private-pool"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Lonavala Villa Private Pool</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">28% OFF</span>
                      </Link>
                      <Link
                        href="/khopoli-villas"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Khopoli Villas</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">28% OFF</span>
                      </Link>
                      <Link
                        href="/escape"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Group Escape Special</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">28% OFF</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. Company & More Dropdown Accordion */}
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase font-black text-[#DAA520] mb-2 pl-2">
                    COMPANY & MORE
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/about"
                      className={cn(
                        "flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 text-[12px]",
                        pathname === "/about" ? "text-[#DAA520] font-bold" : "text-[#FAF8F5]/80 hover:text-[#DAA520]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Info size={14} className="text-[#DAA520]" />
                      <span>About Us</span>
                    </Link>

                    <Link
                      href="/partner"
                      className={cn(
                        "flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 text-[12px]",
                        pathname === "/partner" ? "text-[#DAA520] font-bold" : "text-[#FAF8F5]/80 hover:text-[#DAA520]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Handshake size={14} className="text-[#DAA520]" />
                      <span>Partner / List Property</span>
                    </Link>

                    <Link
                      href="/contact"
                      className={cn(
                        "flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 text-[12px]",
                        pathname === "/contact" ? "text-[#DAA520] font-bold" : "text-[#FAF8F5]/80 hover:text-[#DAA520]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Mail size={14} className="text-[#DAA520]" />
                      <span>Contact Concierge</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      className={cn(
                        "flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-all duration-200 text-[12px]",
                        pathname === "/wishlist" ? "text-[#DAA520] font-bold" : "text-[#FAF8F5]/80 hover:text-[#DAA520]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart size={14} className="text-[#DAA520]" />
                        <span>Saved Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* 4. User Auth Box */}
                <div className="bg-[#FAF8F5]/5 rounded-xl p-3 border border-[#DAA520]/15">
                  {isSignedIn ? (
                    <div className="flex items-center gap-2.5">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 border border-[#DAA520]/40 rounded-full",
                            userButtonPopoverCard: "shadow-xl border border-[#DAA520]/20 rounded-2xl",
                          },
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[#FAF8F5] text-xs font-semibold">My Account</span>
                        <span className="text-[#FAF8F5]/45 text-[10px]">Manage bookings</span>
                      </div>
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="flex items-center gap-2.5 w-full text-left cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[#FAF8F5]/5 border border-[#DAA520]/30 flex items-center justify-center">
                          <User size={15} className="text-[#DAA520]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#FAF8F5] text-xs font-semibold">Sign In / Register</span>
                          <span className="text-[#FAF8F5]/45 text-[10px]">Access bookings & saved villas</span>
                        </div>
                      </button>
                    </SignInButton>
                  )}
                </div>

              </div>
            </div>

            {/* Panel Footer — CTA + Contact */}
            <div className="px-6 pb-6 pt-3 border-t border-[#DAA520]/15 flex flex-col gap-4 shrink-0">
              <a
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hello Stay Willas Concierge! ✨ I am browsing your mobile app and would love to book a luxury staycation. Could you help us find the perfect private estate?")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] text-center rounded-full w-full py-3.5 text-xs font-black tracking-[0.25em] uppercase shadow-lg shadow-[#DAA520]/25 hover:shadow-xl transition-all duration-300 block active:scale-95"
              >
                RESERVE YOUR VILLA
              </a>

              <div className="flex items-center justify-center gap-5">
                <a href="tel:+919619042310" className="flex items-center gap-2 text-[#FAF8F5]/50 hover:text-[#DAA520] transition-colors text-xs font-medium">
                  <Phone size={14} className="text-[#DAA520]" />
                  <span>Call Us</span>
                </a>
                <div className="w-px h-3.5 bg-[#DAA520]/20" />
                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="flex items-center gap-2 text-[#FAF8F5]/50 hover:text-[#25D366] transition-colors text-xs font-medium">
                  <WhatsAppIcon size={14} className="fill-[#DAA520]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
};

export default Navbar;
