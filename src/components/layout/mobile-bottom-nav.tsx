"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, Building2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";

const WA_BOOKING_URL = `https://wa.me/919619042310?text=${encodeURIComponent("Hello Stay Willas Concierge! 🌟 I am using your mobile app and would love to book a luxury villa stay. Could you help us find the perfect sanctuary for our next getaway?")}`;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isSignedIn } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

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

  if (isVillaDetailPage) return null;

  const handleProfileClick = () => {
    if (isSignedIn && user) {
      if (user.role === "admin") window.location.href = "/admin";
      else if (user.role === "partner") window.location.href = "/partner/portal";
      else window.location.href = "/dashboard";
    } else {
      window.location.href = "/login?role=guest";
    }
  };

  const leftItems = [
    { name: "Explore", href: "/", icon: Search, isActive: pathname === "/" },
    { name: "Villas", href: "/villas", icon: Building2, isActive: pathname === "/villas" },
  ];

  const rightItems = [
    { name: "Wishlist", href: "/wishlist", icon: Heart, isActive: pathname === "/wishlist" },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Frosted Glass Bar */}
      <div className="bg-[#F5F2EA]/90 backdrop-blur-2xl border-t border-[#DAA520]/15 shadow-[0_-8px_30px_rgba(44,31,14,0.08)] px-4 pt-2 pb-2">
        <div className="flex items-end justify-around max-w-md mx-auto relative">
          {/* Left Items */}
          {leftItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 min-w-[56px] transition-all duration-300",
                item.isActive ? "text-[#DAA520]" : "text-[#1B3564]/50 hover:text-[#1B3564]"
              )}
            >
              <item.icon size={21} className={cn("transition-all", item.isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span className={cn("text-[9px] tracking-wider uppercase", item.isActive ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          ))}

          {/* Center BOOK FAB */}
          <div className="flex flex-col items-center -mt-5">
            <a
              href={WA_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[56px] h-[56px] rounded-full bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] flex items-center justify-center shadow-[0_4px_20px_rgba(218,165,32,0.4)] hover:shadow-[0_6px_25px_rgba(218,165,32,0.55)] active:scale-90 transition-all duration-300 border-[3px] border-[#F5F2EA] relative"
            >
              {/* WhatsApp icon disguised */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1B3564]">
                <path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" />
              </svg>
            </a>
            <span className="text-[8px] tracking-[0.2em] uppercase font-black text-[#DAA520] mt-1">BOOK</span>
          </div>

          {/* Right Items */}
          {rightItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 min-w-[56px] transition-all duration-300 relative",
                item.isActive ? "text-[#DAA520]" : "text-[#1B3564]/50 hover:text-[#1B3564]"
              )}
            >
              <div className="relative">
                <item.icon size={21} className={cn("transition-all", item.isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
                {item.name === "Wishlist" && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-500 text-[8px] font-black text-white flex items-center justify-center border-2 border-[#F5F2EA]">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className={cn("text-[9px] tracking-wider uppercase", item.isActive ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          ))}

          {/* Profile */}
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center gap-1 py-1.5 min-w-[56px] text-[#1B3564]/50 hover:text-[#1B3564] transition-all cursor-pointer border-none bg-transparent"
          >
            {isSignedIn && user ? (
              <div className="w-[21px] h-[21px] rounded-full bg-[#1B3564] text-white flex items-center justify-center font-bold text-[8px] uppercase">
                {user.name ? user.name.charAt(0) : "G"}
              </div>
            ) : (
              <User size={21} className="stroke-[1.8]" />
            )}
            <span className="text-[9px] tracking-wider uppercase font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
