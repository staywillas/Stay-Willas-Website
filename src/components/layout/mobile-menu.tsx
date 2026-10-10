"use client";

import { encodeWhatsAppMessage } from "@/lib/whatsapp";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, ChevronDown, Heart, MapPin, Sparkles, Info, Handshake, Mail, Home, Building2, MessageSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";


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


interface MobileMenuProps { onClose: () => void; wishlistCount: number; }
export default function MobileMenu({ onClose, wishlistCount }: MobileMenuProps) {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const toggleSubmenu = (key: string) => setOpenSubmenu(prev => prev === key ? null : key);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (<>
    {/* Premium Slide-In Mobile Menu */}
    <AnimatePresence>
      <>
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
            onClick={() => onClose()}
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
            <div className="flex justify-between items-center px-4 py-4 border-b border-[#DAA520]/15 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md flex items-center justify-center shrink-0">
                  <Image src="/images/stay-willas-emblem.webp" alt="Stay Willas" width={48} height={48} className="w-full h-full object-cover scale-[1.05]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[15px] tracking-widest text-[#FAF8F5]">STAY WILLAS</span>
                  <span className="font-sans text-[8px] tracking-[0.16em] uppercase font-bold text-[#DAA520]">Stay • Relax • Repeat</span>
                </div>
              </div>
              <motion.button
                onClick={() => onClose()}
                className="w-10 h-10 rounded-full border border-[#DAA520]/30 flex items-center justify-center text-[#FAF8F5]/80 hover:text-white hover:border-[#DAA520] transition-all duration-300 cursor-pointer"
                whileTap={{ scale: 0.9, rotate: 90 }}
                aria-label="Close Navigation Menu"
              >
                <X size={18} className="text-[#FAF8F5]" />
              </motion.button>
            </div>

                {/* Account access stays above the scrolling navigation links. */}
                <div className="mx-4 mt-3 mb-1 bg-[#FAF8F5]/5 rounded-xl p-3 border border-[#DAA520]/25 shrink-0">
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
                        <span className="text-[#FAF8F5] text-[13px] font-semibold">My Account</span>
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
                          <span className="text-[#FAF8F5] text-xs font-semibold">Login / Register</span>
                          <span className="text-[#FAF8F5]/45 text-[10px]">Access bookings & saved villas</span>
                        </div>
                      </button>
                    </SignInButton>
                  )}
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
                      onClick={() => onClose()}
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
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                            <span>All Luxury Villas</span>
                          </Link>
                          <Link
                            href="/villa/the-angle-house"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>The Angle House (Lonavala)</span>
                          </Link>
                          <Link
                            href="/villa/canopy-crest"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Canopy Crest (Khopoli)</span>
                          </Link>
                          <Link
                            href="/villa/willow-peak"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Willow Peak (Lonavala)</span>
                          </Link>
                          <Link
                            href="/villa/casa-de-reva"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Casa De Reva (Panchgani)</span>
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
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
                            <span>All Destinations</span>
                          </Link>
                          <Link
                            href="/areas/lonavala"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Lonavala Villas</span>
                          </Link>
                          <Link
                            href="/areas/khopoli"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Khopoli Villas</span>
                          </Link>
                          <Link
                            href="/areas/panchgani"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/50" />
                            <span>Panchgani Villas</span>
                          </Link>
                          <Link
                            href="/areas"
                            className="py-1.5 px-2 text-[12px] font-medium text-[#FAF8F5]/75 hover:text-[#DAA520] rounded-lg transition-colors flex items-center gap-1.5"
                            onClick={() => onClose()}
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
                      onClick={() => onClose()}
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
                      onClick={() => onClose()}
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
                      onClick={() => onClose()}
                    >
                      <BookOpen size={15} className="text-[#DAA520] shrink-0" />
                      <span className="text-[13px]">Blog</span>
                    </Link>
                  </div>
                </div>

                {/* 2. Special 26% Off Offers Dropdown */}
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
                        MEGA 26% OFF OFFERS
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
                        href="/areas/lonavala"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => onClose()}
                      >
                        <span>Lonavala Villas</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">26% OFF</span>
                      </Link>
                      <Link
                        href="/areas/khopoli"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => onClose()}
                      >
                        <span>Khopoli Villas</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">26% OFF</span>
                      </Link>
                      <Link
                        href="/escape"
                        className="py-1 px-2 text-[11px] font-bold text-white hover:text-[#DAA520] flex items-center justify-between rounded transition-colors"
                        onClick={() => onClose()}
                      >
                        <span>Group Villas in Lonavala</span>
                        <span className="bg-[#DAA520] text-[#1B3564] text-[9px] font-black px-1 rounded">26% OFF</span>
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
                      onClick={() => onClose()}
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
                      onClick={() => onClose()}
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
                      onClick={() => onClose()}
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
                      onClick={() => onClose()}
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



              </div>
            </div>

            {/* Panel Footer — CTA + Contact */}
            <div className="px-6 pb-6 pt-3 border-t border-[#DAA520]/15 flex flex-col gap-4 shrink-0">
              <a
                href={`https://wa.me/919619042310?text=${encodeWhatsAppMessage("Hello Stay Willas Concierge! ✨ I am browsing your mobile app and would love to book a luxury staycation. Could you help us find the perfect private estate?")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onClose()}
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
      </>
    </AnimatePresence>
  </>);
}
