"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, MapPin, User } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isSignedIn } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

  // Hide on villa detail pages to give priority to the sticky Book Now CTA
  const isVillaDetailPage = pathname?.startsWith("/villa/");

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

  if (isVillaDetailPage) {
    return null;
  }

  const handleProfileClick = () => {
    if (isSignedIn && user) {
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else if (user.role === "partner") {
        window.location.href = "/partner/portal";
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      window.location.href = "/login?role=guest";
    }
  };

  const navItems = [
    {
      name: "Explore",
      href: "/",
      icon: Search,
      isActive: pathname === "/",
    },
    {
      name: "Destinations",
      href: "/destinations",
      icon: MapPin,
      isActive: pathname === "/destinations",
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
    },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F5F2EA]/95 backdrop-blur-xl border-t border-[#DAA520]/20 pb-safe pt-2 px-6 shadow-[0_-8px_30px_rgba(44,31,14,0.08)] font-sans">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto pb-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-300 relative min-w-[64px]",
              item.isActive ? "text-[#DAA520]" : "text-[#1B3564]/60 hover:text-[#1B3564]"
            )}
          >
            <div className="relative">
              <item.icon
                size={22}
                className={cn(
                  "transition-all duration-300",
                  item.isActive ? "stroke-[2.5]" : "stroke-[1.8]"
                )}
              />
              {item.name === "Wishlist" && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border border-[#F5F2EA]">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] tracking-wide",
              item.isActive ? "font-bold" : "font-medium"
            )}>
              {item.name}
            </span>
          </Link>
        ))}

        {/* Profile Item */}
        <button 
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center gap-1.5 p-2 min-w-[56px] text-[#1B3564]/60 hover:text-[#1B3564] transition-all cursor-pointer border-none bg-transparent"
        >
          {isSignedIn && user ? (
            <div className="w-5.5 h-5.5 rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold text-[9px] uppercase shadow-sm">
              {user.name ? user.name.charAt(0) : "G"}
            </div>
          ) : (
            <User size={22} className="stroke-[1.8]" />
          )}
          <span className="text-[10px] tracking-wide font-medium">
            Profile
          </span>
        </button>

        {/* Menu Toggle */}
        <button 
          onClick={() => window.dispatchEvent(new Event("toggle-mobile-menu"))}
          className="flex flex-col items-center justify-center gap-1.5 p-2 min-w-[56px] text-[#1B3564]/60 hover:text-[#1B3564] transition-all"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </div>
          <span className="text-[10px] tracking-wide font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
}
