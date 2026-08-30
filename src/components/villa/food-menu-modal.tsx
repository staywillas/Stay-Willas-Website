"use client";

import React, { useState, useEffect } from "react";
import { Utensils, X, Check, ChefHat, FileText, Download, ExternalLink, Leaf, Drumstick, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuCategory {
  id: "veg" | "mix" | "non-veg";
  name: string;
  badge: string;
  badgeColor: string;
  description: string; // Max 10 words
  pdfUrl: string;
  icon: typeof Leaf;
}

const propertyMenus: MenuCategory[] = [
  {
    id: "veg",
    name: "Pure Vegetarian Menu",
    badge: "100% Pure Veg & Jain",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Pure vegetarian homestyle delicacies cooked fresh by private chefs.",
    pdfUrl: "/assets/menus/stay-willas-veg-menu.pdf",
    icon: Leaf
  },
  {
    id: "mix",
    name: "Mix Menu (Veg & Non-Veg)",
    badge: "Most Popular Spread",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Best of both: curated veg curries and non-veg specialties.",
    pdfUrl: "/assets/menus/stay-willas-mix-menu.pdf",
    icon: Sparkles
  },
  {
    id: "non-veg",
    name: "Non-Vegetarian Menu",
    badge: "Signature Non-Veg",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    description: "Authentic chicken, mutton, and seafood curries with tandoori starters.",
    pdfUrl: "/assets/menus/stay-willas-non-veg-menu.pdf",
    icon: Drumstick
  }
];

export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<"veg" | "mix" | "non-veg">("veg");

  // Lock background scroll when the popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeMenu = propertyMenus.find((m) => m.id === activeMenuId) || propertyMenus[0];

  return (
    <>
      {/* Food Menu CTA Card */}
      <div className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 select-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] shrink-0">
            <ChefHat size={22} className="animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-xl text-[#1B3564] font-semibold">Curated Dining Menus</h4>
              <span className="text-[10px] bg-[#DAA520]/15 text-[#1B3564] font-bold px-2 py-0.5 rounded-full border border-[#DAA520]/30">
                3 Menus Available
              </span>
            </div>
            <p className="text-xs text-text-primary/60 leading-relaxed mt-1">
              Explore our official Veg, Mix & Non-Veg menus cooked fresh on-site.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1B3564] hover:bg-[#152A50] text-white px-6 py-3.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 border-none"
        >
          View Food Menus
        </button>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-4 md:p-6">
            {/* Frosted glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[820px] bg-[#FDFBF7] border border-[#DAA520]/30 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.3)] p-4 sm:p-6 md:p-7 flex flex-col justify-between overflow-hidden max-h-[92vh] z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#DAA520]/20 shrink-0">
                <div className="text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.25em] block mb-0.5">
                      Private Chef Dining
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading text-[#1B3564] italic">
                      Property <span className="not-italic font-bold font-sans text-accent-primary">Food Menus</span>
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564]/60 hover:text-[#1B3564] hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Close Food Menu"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* 3 Menu Selection Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 pb-3 shrink-0">
                {propertyMenus.map((menu) => {
                  const Icon = menu.icon;
                  const isSelected = activeMenuId === menu.id;
                  return (
                    <button
                      key={menu.id}
                      type="button"
                      onClick={() => setActiveMenuId(menu.id)}
                      className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#1B3564] text-white border-[#1B3564] shadow-md scale-[1.02]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-[#DAA520]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider truncate flex items-center gap-1.5">
                          <Icon size={12} className={isSelected ? "text-[#DAA520]" : "text-slate-500"} />
                          {menu.name.replace(" Menu", "")}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          isSelected ? "bg-[#DAA520] text-[#1B3564]" : "bg-slate-100 text-slate-600"
                        }`}>
                          PDF
                        </span>
                      </div>
                      <p className={`text-[10px] line-clamp-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {menu.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Active Menu Detail & PDF Viewer Box */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto min-h-0 py-2 space-y-3 pr-1 text-left"
              >
                {/* Heading & Short Description Card */}
                <div className="bg-white border border-[#DAA520]/25 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading font-bold text-[#1B3564] text-base sm:text-lg">
                        {activeMenu.name}
                      </h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${activeMenu.badgeColor}`}>
                        {activeMenu.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {activeMenu.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <a
                      href={activeMenu.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial bg-[#1B3564] hover:bg-[#152A50] text-white px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <FileText size={13} className="text-[#DAA520]" />
                      <span>Open Full PDF</span>
                    </a>
                    <a
                      href={activeMenu.pdfUrl}
                      download
                      className="bg-white border border-[#1B3564]/20 hover:border-[#DAA520] text-[#1B3564] p-2.5 rounded-full transition-all flex items-center justify-center shrink-0"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>

                {/* Embedded Interactive PDF Viewer */}
                <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-[#DAA520]/20 shadow-inner bg-slate-100">
                  <iframe
                    key={activeMenu.pdfUrl}
                    title={`${activeMenu.name} PDF Preview`}
                    src={`${activeMenu.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Dietary Note */}
              <div className="pt-2.5 pb-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Prepared fresh on-site with separate cookware for Veg & Jain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Custom spice levels tailored to your preference</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2.5 border-t border-[#DAA520]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-left">
                <p className="text-[10px] text-slate-500">
                  Please confirm your menu choice 24 hours prior to check-in.
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🍽️ I would love to select the *${activeMenu.name}* for our stay.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Select on WhatsApp
                  </a>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-[#1B3564] hover:bg-[#152A50] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
