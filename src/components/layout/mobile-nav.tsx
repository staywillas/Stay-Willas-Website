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
    { name: "Wishlist", icon: Heart, href: "/wishlist" },
    { name: "Admin", icon: Briefcase, href: "/admin" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2">
      <div className="bg-[#F5F2EA]/95 backdrop-blur-md border border-[#DAA520]/20 rounded-full flex items-center justify-between px-8 py-3.5 shadow-[0_10px_35px_rgba(44,31,14,0.12)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === "Explore" && pathname === "/villas");
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-[#DAA520]" : "text-[#1B3564]/40 hover:text-[#DAA520]"
              )}
            >
              <item.icon size={19} className={cn(isActive && "scale-110")} />
              <span className="text-[8px] uppercase tracking-widest font-extrabold leading-none mt-0.5">
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
