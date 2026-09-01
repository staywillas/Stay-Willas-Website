"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Utensils, X, Check, ChefHat, FileText, Download, ExternalLink, Leaf, Drumstick, Sparkles, Coffee, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuCategory {
  id: "veg" | "mix" | "non-veg";
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  pdfUrl: string;
  icon: typeof Leaf;
  highlights: {
    starters: string[];
    mains: string[];
    desserts: string[];
  };
}

const propertyMenus: MenuCategory[] = [
  {
    id: "veg",
    name: "Pure Vegetarian Menu",
    badge: "100% Pure Veg & Jain",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Pure vegetarian homestyle delicacies cooked fresh by private chefs in dedicated cookware.",
    pdfUrl: "/assets/menus/stay-willas-veg-menu.pdf",
    icon: Leaf,
    highlights: {
      starters: ["Paneer Tikka / Achari Tikka", "Hara Bhara Kebab", "Crispy Corn & Veg Spring Rolls", "Crispy French Fries & Pakoras"],
      mains: ["Paneer Butter Masala / Kadhai Paneer", "Veg Kolhapuri / Mix Veg Curry", "Dal Tadka / Dal Makhani", "Jeera Rice / Veg Biryani", "Butter Roti / Naan / Paratha"],
      desserts: ["Gulab Jamun with Rabdi", "Warm Moong Dal Halwa", "Ice Cream Sundae"]
    }
  },
  {
    id: "mix",
    name: "Mix Menu (Veg & Non-Veg)",
    badge: "Most Popular Spread",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Curated dual spread offering both pure vegetarian curries and aromatic non-veg specialties.",
    pdfUrl: "/assets/menus/stay-willas-mix-menu.pdf",
    icon: Sparkles,
    highlights: {
      starters: ["Tandoori Chicken / Chicken Pahadi Tikka", "Paneer Tikka / Veg Crispy", "Fish Fry / Chicken 65", "Veg Kebab Platter"],
      mains: ["Butter Chicken / Chicken Handi", "Paneer Kadhai / Dal Makhani", "Mutton Sukka / Gravy (On Request)", "Chicken Dum Biryani & Veg Pulao", "Assorted Naan & Phulkas"],
      desserts: ["Hot Gulab Jamun", "Shahi Tukda", "Kulfi Ice Cream"]
    }
  },
  {
    id: "non-veg",
    name: "Non-Vegetarian Menu",
    badge: "Signature Non-Veg",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Authentic poultry, mutton, and fresh catch dishes with sizzling live poolside barbecues.",
    pdfUrl: "/assets/menus/stay-willas-non-veg-menu.pdf",
    icon: Drumstick,
    highlights: {
      starters: ["Live Poolside BBQ Chicken", "Mutton Seekh Kebab", "Amritsari Fish Fry", "Crispy Chicken Lollipops"],
      mains: ["Kashmiri Rogan Josh / Mutton Curry", "Dhaba Style Chicken Curry", "Hyderabadi Dum Biryani with Raita", "Egg Curry & Tandoori Rotis"],
      desserts: ["Gajar Ka Halwa", "Chocolate Brownie with Vanilla", "Fresh Fruit Salad"]
    }
  }
];

export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<"veg" | "mix" | "non-veg">("veg");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Solid Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[860px] bg-[#FAF8F5] border-2 border-[#DAA520]/50 rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.6)] p-5 sm:p-7 flex flex-col justify-between overflow-hidden max-h-[90vh] z-10 text-slate-900"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DAA520]/25 shrink-0">
              <div className="text-left flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#1B3564] text-[#DAA520] flex items-center justify-center shadow-md">
                  <ChefHat size={22} />
                </div>
                <div>
                  <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.25em] block mb-0.5">
                    In-House Chef Dining
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading text-[#1B3564] font-bold">
                    Curated Villa <span className="text-[#DAA520]">Food Menus</span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-black hover:bg-slate-100 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                aria-label="Close Food Menu"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* 3 Menu Selection Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 pb-3 shrink-0">
              {propertyMenus.map((menu) => {
                const Icon = menu.icon;
                const isSelected = activeMenuId === menu.id;
                return (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => {
                      setActiveMenuId(menu.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#1B3564] text-white border-[#1B3564] shadow-lg scale-[1.02]"
                        : "bg-white text-slate-800 border-slate-200 hover:border-[#DAA520] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Icon size={14} className={isSelected ? "text-[#DAA520]" : "text-[#1B3564]"} />
                        {menu.name.replace(" Menu", "")}
                      </span>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isSelected ? "bg-[#DAA520] text-[#1B3564]" : "bg-slate-100 text-slate-700"
                      }`}>
                        PDF
                      </span>
                    </div>
                    <p className={`text-[11px] leading-tight line-clamp-1 ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                      {menu.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Menu Header Bar with Direct PDF Actions */}
            <div className="flex items-center justify-between gap-2 px-1 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#1B3564] flex items-center gap-1.5 font-sans">
                  <span>🍽️</span> {activeMenu.name} Highlights
                </span>
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${activeMenu.badgeColor}`}>
                  {activeMenu.badge}
                </span>
              </div>

              {/* Direct PDF View & Download Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={activeMenu.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1B3564] hover:bg-[#152A50] text-[#DAA520] hover:text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ExternalLink size={13} className="text-[#DAA520]" />
                  <span>View PDF</span>
                </a>
                <a
                  href={activeMenu.pdfUrl}
                  download
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download PDF"
                >
                  <Download size={13} className="text-[#1B3564]" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* Active Menu Highlights Content */}
            <div className="flex-1 overflow-y-auto min-h-0 py-2 space-y-3 pr-1 text-left">
              {/* Course Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Starters */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-[#DAA520] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1.5 border-b border-slate-100">
                    <Sparkles size={14} />
                    <span>Starters & Appetizers</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeMenu.highlights.starters.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Course */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-[#1B3564] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1.5 border-b border-slate-100">
                    <ChefHat size={14} />
                    <span>Main Courses & Breads</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeMenu.highlights.mains.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#DAA520] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desserts */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2.5 pb-1.5 border-b border-slate-100">
                    <Coffee size={14} />
                    <span>Desserts & Treats</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeMenu.highlights.desserts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Dietary Trust Note */}
            <div className="pt-3 pb-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Dedicated cookware for Veg & Jain preparations</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Check size={14} className="text-emerald-600" />
                <span>Custom spice & diet levels tailored to your family</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-[#DAA520]/25 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-left">
              <p className="text-[11px] text-slate-500 font-light">
                Please confirm your meal packages with our concierge 24h prior to arrival.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🍽️ I would like to confirm the *${activeMenu.name}* meal package for our upcoming stay.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-emerald-600 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all text-center shadow-md flex items-center justify-center gap-2"
                >
                  <span>Confirm on WhatsApp</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1B3564] hover:bg-[#152A50] text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Food Menu CTA Card Trigger */}
      <div className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DAA520]/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 select-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-start gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/15 border border-[#DAA520]/30 flex items-center justify-center text-[#1B3564] shrink-0">
            <ChefHat size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-xl text-[#1B3564] font-semibold">Curated Dining Menus</h4>
              <span className="text-[10px] bg-[#DAA520]/20 text-[#1B3564] font-black px-2.5 py-0.5 rounded-full border border-[#DAA520]/40">
                3 Menus
              </span>
            </div>
            <p className="text-xs text-text-primary/70 leading-relaxed mt-1">
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

      {/* Render via Portal so it mounts on document.body without stacking context clipping */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
