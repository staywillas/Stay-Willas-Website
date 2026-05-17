"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Explore", icon: Search, href: "/villas" },
    { name: "Wishlist", icon: Heart, href: "#" },
    { name: "Trips", icon: Briefcase, href: "#" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2">
      <div className="bg-charcoal/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-between px-8 py-4 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-gold" : "text-white/40 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive && "scale-110")} />
              <span className="text-[8px] uppercase tracking-widest font-bold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
