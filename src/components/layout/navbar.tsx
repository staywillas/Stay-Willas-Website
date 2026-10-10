"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
const MobileMenu = dynamic(() => import("./mobile-menu"), {
  ssr: false,
  loading: () => <p role="status" className="fixed top-20 right-4 z-[100000] rounded-xl bg-[#0E1B35] p-4 text-sm text-white">Opening navigation…</p>,
});
import { Menu, ChevronDown, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";


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

const Navbar = ({ alwaysVisible = false }: { alwaysVisible?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  useLenis((lenis) => {
    lenisRef.current = lenis;
    if (lenis) {
      setIsScrolled(lenis.scroll > 30);
    }
  });

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
    const initialCountFrame = window.requestAnimationFrame(updateCount);
    window.addEventListener("wishlist-updated", updateCount);
    window.addEventListener("storage", updateCount);
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
          setIsScrolled(currentScrollY > 30);
          
          // Mobile hide/show based on scroll direction
          if (currentScrollY < 80) {
            setIsNavVisible(true);
          } else if (currentScrollY > lastScrollY.current + 8) {
            setIsNavVisible(false); // Scrolling down
          } else if (currentScrollY < lastScrollY.current - 8) {
            setIsNavVisible(true); // Scrolling up
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleToggleMenu = () => setIsMobileMenuOpen(prev => !prev);
    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    
    return () => {
      window.cancelAnimationFrame(initialCountFrame);
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
    };
  }, []);

  // Lock body scroll and stop Lenis when mobile menu is open
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mobile-menu-state", { detail: { isOpen: isMobileMenuOpen } }));
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
            ? "top-11 sm:top-12 left-0 right-0 w-full px-4 md:px-6 lg:px-8 py-2"
            : "top-0 left-0 right-0 w-full px-4 md:px-6 lg:px-8 py-3",
        // Mobile override: always float like a card at the top
        hasTopPromoBanner
          ? "max-xl:top-12 max-xl:left-3 max-xl:right-3 max-xl:w-auto max-xl:p-0"
          : "max-xl:top-3.5 max-xl:left-3 max-xl:right-3 max-xl:w-auto max-xl:p-0",
        // Scroll-direction-aware mobile hide/show
        !alwaysVisible && !isNavVisible && !isMobileMenuOpen ? "max-xl:-translate-y-[calc(100%+4rem)] max-xl:opacity-0" : "max-xl:translate-y-0 max-xl:opacity-100"
      )}
      style={{ zIndex: 99999 }}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-in-out flex items-center justify-between gap-2 sm:gap-3 xl:gap-4 w-full",
          isScrolled
            ? "rounded-none bg-[#F5F2EA]/95 backdrop-blur-md shadow-md border-b border-[#DAA520]/15 px-3 sm:px-5 xl:px-7 py-1 xl:py-2"
            : "max-w-[1280px] rounded-2xl xl:rounded-full px-3 sm:px-4 xl:px-7 py-1 xl:py-2 bg-[#F5F2EA]/95 backdrop-blur-md border border-[#DAA520]/25 shadow-xl"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
          <div className="relative w-8.5 h-8.5 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-full overflow-hidden shadow-md transition-transform duration-700 group-hover:rotate-[360deg] flex items-center justify-center shrink-0">
            <Image 
              src="/images/stay-willas-emblem.webp" 
              alt="Stay Willas Logo" 
              width={64}
              height={64}
              className="w-full h-full object-cover scale-[1.05]" 
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-heading text-[12px] sm:text-[15px] xl:text-[18px] tracking-widest leading-tight transition-colors duration-500 whitespace-nowrap font-bold",
              isDarkTheme ? "text-brand-navy" : "text-white"
            )}>STAY WILLAS</span>
            <span className={cn(
              "font-sans text-[6.5px] sm:text-[8px] xl:text-[9px] tracking-[0.12em] sm:tracking-[0.14em] uppercase font-bold transition-colors duration-500 whitespace-nowrap",
              isDarkTheme ? "text-brand-navy/75" : "text-white/75"
            )}>Stay • Relax • Repeat</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center justify-center gap-3.5 2xl:gap-5 flex-initial min-w-max px-1">
          {navLinks.map((link) => {
            if (link.name === "Areas") {
              return (
                <div key="Areas" className="relative group cursor-pointer">
                  <Link
                    href="/areas"
                    className={cn(
                      "flex items-center gap-1 text-[13px] font-semibold transition-all duration-300 tracking-wider relative group/link whitespace-nowrap",
                      isDarkTheme
                        ? "text-brand-navy hover:text-brand-gold"
                        : "text-white hover:text-brand-gold"
                    )}
                  >
                    Areas <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                    <span className={cn(
                      "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100",
                      "bg-brand-gold"
                    )} />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto z-50">
                    <div className="glass-premium border border-yellow-200/50 rounded-2xl p-5 min-w-[210px] shadow-xl shadow-yellow-900/5 bg-[#FAF8F5]/95 backdrop-blur-md">
                      <div className="flex flex-col gap-3 text-left">
                        <Link href="/areas/lonavala" className="text-[13px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors flex items-center justify-between group/item">
                          <span>Lonavala Villas</span>
                          <ChevronRight size={13} className="text-brand-gold/60 group-hover/item:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/areas/khopoli" className="text-[13px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors flex items-center justify-between group/item">
                          <span>Khopoli Villas</span>
                          <ChevronRight size={13} className="text-brand-gold/60 group-hover/item:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/areas/panchgani" className="text-[13px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors flex items-center justify-between group/item">
                          <span>Panchgani Villas</span>
                          <ChevronRight size={13} className="text-brand-gold/60 group-hover/item:translate-x-1 transition-transform" />
                        </Link>
                        <div className="pt-2 mt-1 border-t border-[#DAA520]/20">
                          <Link href="/areas" className="text-[12px] font-semibold text-brand-gold hover:text-brand-navy tracking-wide transition-colors flex items-center gap-1">
                            <span>All Destination Areas</span>
                            <ChevronRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[13px] font-semibold transition-all duration-300 tracking-wider relative group/link whitespace-nowrap",
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
            );
          })}

          <div className="relative group cursor-pointer">
            <div className={cn(
              "flex items-center gap-1 text-[13px] font-semibold tracking-wider transition-all whitespace-nowrap",
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
                  <Link href="/escape" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Group Stays in Lonavala</Link>
                  <Link href="/partner" className="text-[14px] font-bold text-[#1B3564] hover:text-[#559C24] tracking-wide transition-colors flex items-center justify-between group/partner">
                    <span>Partner With Us</span>
                    <span className="text-[9px] bg-[#559C24]/15 text-[#4D7C0F] px-2 py-0.5 rounded-full font-black uppercase tracking-wider group-hover/partner:bg-[#559C24] group-hover/partner:text-white transition-colors">Host</span>
                  </Link>
                  <Link href="/contact" className="text-[14px] font-bold text-brand-navy hover:text-brand-gold tracking-wide transition-colors">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">

          <a href="https://wa.me/919619042310?text=Hi%20Stay%20Willas!%20I'm%20exploring%20your%20exquisite%20villas%20on%20your%20website%20and%20would%20love%20to%20chat%20with%20a%20concierge%20to%20plan%20our%20next%20vacation." target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={cn(
            "flex items-center gap-2 transition-colors duration-300 p-1",
            isDarkTheme ? "text-brand-navy hover:text-[#25D366]" : "text-white hover:text-[#25D366]"
          )} title="WhatsApp Chat">
            <WhatsAppIcon size={16} className="shrink-0" />
            <span className="text-[13px] xl:text-[14px] font-semibold tracking-wide whitespace-nowrap hidden 2xl:inline">WhatsApp</span>
          </a>

          <div className="flex items-center gap-3">
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

            <Link href="/villas" prefetch={false}
              className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full min-h-10 px-4 py-2 text-[11px] font-black tracking-wider transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              BOOK DIRECT
            </Link>
          </div>
        </div>
        {/* Mobile Header Quick Actions */}
        <div className="xl:hidden flex items-center gap-1.5 xs:gap-2 shrink-0">
          <Link href="/villas" prefetch={false}
            className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full min-h-9 px-2.5 sm:px-3 py-1.5 text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-xs active:scale-95"
          >
              BOOK DIRECT
            </Link>

          {isSignedIn ? (
            <div className="hidden min-[380px]:block">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-6 h-6 xs:w-7 xs:h-7 border-2 border-[#DAA520] rounded-full shadow-sm",
                  },
                }}
              />
            </div>
          ) : null}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#1B3564] hover:text-[#DAA520] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu size={19} className="stroke-[2.2]" />
          </button>
        </div>
      </div>
    </nav>

    {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} wishlistCount={wishlistCount} />}

  </>
);
};

export default Navbar;
