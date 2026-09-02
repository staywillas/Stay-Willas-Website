"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Utensils, X, ChefHat, FileText, Download, ExternalLink, Leaf, Drumstick, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuCategory {
  id: "veg" | "mix" | "non-veg";
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  pdfUrl: string;
  icon: typeof Leaf;
}

const propertyMenus: MenuCategory[] = [
  {
    id: "veg",
    name: "Pure Vegetarian Menu",
    badge: "100% Veg & Jain",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Pure vegetarian delicacies prepared fresh with separate cookware.",
    pdfUrl: "/assets/menus/stay-willas-veg-menu.pdf",
    icon: Leaf,
  },
  {
    id: "mix",
    name: "Mix Menu (Veg & Non-Veg)",
    badge: "Popular Dual Spread",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Curated combination of vegetarian dishes and non-veg curries.",
    pdfUrl: "/assets/menus/stay-willas-mix-menu.pdf",
    icon: Sparkles,
  },
  {
    id: "non-veg",
    name: "Non-Vegetarian Menu",
    badge: "Signature Non-Veg",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Poultry, mutton, and fresh catch with live poolside barbecue.",
    pdfUrl: "/assets/menus/stay-willas-non-veg-menu.pdf",
    icon: Drumstick,
  }
];

export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-[#DAA520]/40 rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 overflow-hidden z-10 text-slate-900 max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 shrink-0">
              <div className="text-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B3564] text-[#DAA520] flex items-center justify-center shadow-md">
                  <ChefHat size={20} />
                </div>
                <div>
                  <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-widest block">
                    In-House Chef Dining
                  </span>
                  <h3 className="text-lg sm:text-xl font-heading text-[#1B3564] font-bold">
                    Curated Villa <span className="text-[#DAA520]">Food Menus</span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 hover:text-black transition-all cursor-pointer"
                aria-label="Close Food Menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Clean Menu PDF List (Heading + View PDF + Download PDF) */}
            <div className="space-y-3 overflow-y-auto py-1">
              {propertyMenus.map((menu) => {
                const Icon = menu.icon;
                return (
                  <div
                    key={menu.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-[#DAA520]/60 transition-all flex flex-col gap-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1B3564]/5 border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564] shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1B3564] leading-tight">
                            {menu.name}
                          </h4>
                          <span className={`inline-block mt-0.5 text-[8px] font-bold px-2 py-0.5 rounded-full border ${menu.badgeColor}`}>
                            {menu.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {menu.description}
                    </p>

                    {/* Action Buttons: View PDF (opens in new tab) & Download PDF */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={menu.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                      >
                        <ExternalLink size={13} className="shrink-0" />
                        <span>View PDF</span>
                      </a>

                      <a
                        href={menu.pdfUrl}
                        download
                        className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
                      >
                        <Download size={13} className="text-[#1B3564] shrink-0" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Concise Footer */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 text-left">
              <span className="text-[10px] text-slate-500 font-medium">
                ✓ 100% Dedicated Veg/Jain cookware
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Food Menu CTA Card Trigger */}
      <div className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DAA520]/30 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 select-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#DAA520]/15 border border-[#DAA520]/30 flex items-center justify-center text-[#1B3564] shrink-0">
            <ChefHat size={20} />
          </div>
          <div>
            <h4 className="font-heading text-base sm:text-lg text-[#1B3564] font-bold">In-Villa Dining Menus</h4>
            <p className="text-[11px] sm:text-xs text-text-primary/70 leading-tight mt-0.5">
              Pure Veg, Jain, Mix & Non-Veg PDF menus prepared fresh by private chefs.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md active:scale-95 cursor-pointer shrink-0 text-center"
        >
          View Menus (PDF)
        </button>
      </div>

      {/* Render via Portal so it mounts directly on body */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
