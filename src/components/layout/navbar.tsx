"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Phone, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";
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
  const { user, isSignedIn, signOut } = useAuth();
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
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setIsScrolled(scrollPos > 30);
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
        "max-xl:top-4 max-xl:left-4 max-xl:right-4 max-xl:w-auto max-xl:p-0"
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
          <div className="relative w-9 h-9 sm:w-12 md:w-14 h-9 sm:h-12 md:h-14 rounded-full overflow-hidden border border-accent-secondary/30 shadow-md transition-transform duration-700 group-hover:rotate-[360deg] bg-white/5 flex items-center justify-center shrink-0">
            <img 
              src="/images/web logo.png" 
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
                "absolute -bottom-1.5 left-0 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full",
                isDarkTheme ? "bg-brand-gold" : "bg-brand-gold"
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
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block">
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

            {isSignedIn && user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-1.5 p-1 rounded-full border border-[#DAA520]/30 hover:border-[#DAA520] transition-colors cursor-pointer shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : "G"}
                  </div>
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover/user:block z-50">
                  <div className="glass-premium border border-yellow-200/50 rounded-2xl p-5 min-w-[240px] shadow-xl text-left font-sans">
                    <div className="mb-3 pb-3 border-b border-slate-200/50 select-none">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Logged In As</p>
                      <p className="text-xs font-black text-[#1B3564] mt-0.5 truncate">{user.name}</p>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {user.role === "admin" && (
                        <Link href="/admin" className="text-[10px] font-black text-[#1B3564] hover:text-[#DAA520] transition-colors uppercase tracking-widest">
                          Admin Suite
                        </Link>
                      )}
                      {user.role === "partner" && (
                        <Link href="/partner/portal" className="text-[10px] font-black text-[#1B3564] hover:text-[#DAA520] transition-colors uppercase tracking-widest">
                          Partner Portal
                        </Link>
                      )}
                      {user.role === "guest" && (
                        <Link href="/dashboard" className="text-[10px] font-black text-[#1B3564] hover:text-[#DAA520] transition-colors uppercase tracking-widest">
                          My Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={signOut}
                        className="text-left text-[10px] font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent p-0 w-full"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login?role=guest"
                className={cn(
                  "hover:bg-transparent p-2 h-auto text-[14px] flex items-center justify-center transition-colors duration-300",
                  isDarkTheme ? "text-brand-navy hover:text-brand-gold" : "text-white hover:text-brand-gold"
                )}
                title="Guest Log In"
              >
                <User size={20} />
              </Link>
            )}

            <Link href="/villas" className="bg-[#FFB800] hover:bg-[#E6A600] text-[#1B3564] rounded-full px-4 lg:px-6 py-2.5 lg:py-3 text-[11px] xl:text-[12px] font-black tracking-widest transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg">
              BOOK NOW
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle & Wishlist (Moved to Bottom Nav) */}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 xl:hidden bg-cream flex flex-col p-6 sm:p-10"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cream-border">
                  <img src="/images/web logo.png" alt="Stay Willas" className="w-full h-full object-cover scale-[1.6]" />
                </div>
                <span className="font-heading text-xl tracking-widest text-brand-navy font-bold">MENU</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
                <X size={26} className="text-brand-navy" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {[...navLinks, { name: "About", href: "/about" }, { name: "Contact", href: "/contact" }].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-heading text-brand-navy hover:text-brand-gold transition-colors font-bold tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-slate-200/60 my-6" />

              <div className="flex flex-col gap-3.5">
                <a href="tel:+919619042310" className="flex items-center gap-3 text-brand-navy/90 text-base font-bold tracking-wide hover:text-brand-gold transition-colors">
                  <Phone size={18} className="text-brand-navy" />
                  <span>+91 96190 42310</span>
                </a>

                <a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-brand-navy hover:text-[#25D366] text-base font-bold tracking-wide transition-colors">
                  <WhatsAppIcon size={18} className="text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <Link href="/villas" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#FFB800] hover:bg-[#E6A600] text-[#1B3564] text-center rounded-full w-full py-3.5 text-xs font-black tracking-widest mt-6 shadow-md hover:shadow-lg transition-all duration-300 block">
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
