"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Building2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";


export default function MobileBottomNav() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isVillaDetailPage = pathname?.startsWith("/villa/");
  const isCarePage = pathname?.startsWith("/care");

  useEffect(() => {
    const handleMenuState = (e: any) => {
      setIsMenuOpen(e.detail?.isOpen ?? false);
    };
    window.addEventListener("mobile-menu-state", handleMenuState);
    return () => {
      window.removeEventListener("mobile-menu-state", handleMenuState);
    };
  }, []);

  useEffect(() => {
    const updateCount = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wishlist.length);
      } catch (e) {
        console.error(e);
      }
    };
    updateCount();
    window.addEventListener("wishlist-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const [isCareDomain, setIsCareDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      if (host.startsWith("care.") || host.includes("carestaywillas")) {
        setIsCareDomain(true);
      }
    }
  }, []);

  if (isVillaDetailPage || isMenuOpen || isCarePage || isCareDomain || pathname === "/colortheory") return null;

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
  };

  return (
    <div
      id="mobile-bottom-nav"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav-root"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Frosted Glass Bar */}
      <div className="bg-[#F5F2EA]/92 backdrop-blur-2xl border-t border-[#DAA520]/15 shadow-[0_-4px_20px_rgba(44,31,14,0.06)] px-3 py-1">
        <div className="flex items-center justify-around max-w-sm mx-auto relative">
          
          {/* Home Tab */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 min-w-[44px] transition-all duration-300 active:scale-90 relative",
              pathname === "/" ? "text-[#DAA520]" : "text-[#1B3564]/50 hover:text-[#1B3564]"
            )}
          >
            <Home size={17} className={cn("transition-all", pathname === "/" ? "stroke-[2.5]" : "stroke-[1.8]")} />
            <span className={cn("text-[8px] tracking-wider uppercase leading-none", pathname === "/" ? "font-bold" : "font-medium")}>
              Home
            </span>
            {/* Active indicator dot */}
            {pathname === "/" && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#DAA520]" />
            )}
          </Link>

          {/* Villas Tab */}
          <Link
            href="/villas"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 min-w-[44px] transition-all duration-300 active:scale-90 relative",
              pathname === "/villas" ? "text-[#DAA520]" : "text-[#1B3564]/50 hover:text-[#1B3564]"
            )}
          >
            <Building2 size={17} className={cn("transition-all", pathname === "/villas" ? "stroke-[2.5]" : "stroke-[1.8]")} />
            <span className={cn("text-[8px] tracking-wider uppercase leading-none", pathname === "/villas" ? "font-bold" : "font-medium")}>
              Villas
            </span>
            {/* Active indicator dot */}
            {pathname === "/villas" && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#DAA520]" />
            )}
          </Link>

          {/* Center BOOK FAB (More compact) */}
          <div className="flex flex-col items-center -mt-3.5">
            <Link
              href="/villas"
              prefetch={false}
              aria-label="Browse villas and book direct"
              className="w-[42px] h-[42px] rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] flex items-center justify-center shadow-[0_3px_15px_rgba(218,165,32,0.35)] hover:shadow-[0_4px_20px_rgba(218,165,32,0.45)] active:scale-90 transition-all duration-300 border-2 border-[#F5F2EA] relative"
            >
              <Building2 size={20} aria-hidden="true" />
            </Link>
            <span className="text-[7px] tracking-[0.16em] uppercase font-black text-[#DAA520] mt-0.5 leading-none">BOOK</span>
          </div>

          {/* Wishlist Tab */}
          <Link
            href="/wishlist"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 min-w-[44px] transition-all duration-300 relative active:scale-90",
              pathname === "/wishlist" ? "text-[#DAA520]" : "text-[#1B3564]/50 hover:text-[#1B3564]"
            )}
          >
            <div className="relative">
              <Heart size={17} className={cn("transition-all", pathname === "/wishlist" ? "stroke-[2.5]" : "stroke-[1.8]")} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-[7px] font-black text-white flex items-center justify-center border border-[#F5F2EA]">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className={cn("text-[8px] tracking-wider uppercase leading-none", pathname === "/wishlist" ? "font-bold" : "font-medium")}>
              Wishlist
            </span>
            {/* Active indicator dot */}
            {pathname === "/wishlist" && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#DAA520]" />
            )}
          </Link>

          {/* Menu Tab */}
          <button
            onClick={handleMenuClick}
            aria-label="Open Mobile Menu"
            className="flex flex-col items-center justify-center gap-0.5 py-1 min-w-[44px] text-[#1B3564]/50 hover:text-[#1B3564] transition-all duration-300 active:scale-90 cursor-pointer border-none bg-transparent"
          >
            <Menu size={17} className="stroke-[1.8]" />
            <span className="text-[8px] tracking-wider uppercase font-medium leading-none">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
