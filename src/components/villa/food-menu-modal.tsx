"use client";

import React, { useState, useEffect } from "react";
import { Utensils, X, Check, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const indianMenu = [
  {
    category: "Starters",
    items: [
      { name: "Paneer Tikka", desc: "Soft, smoky paneer pieces grilled with fresh peppers and traditional spices.", price: 420 },
      { name: "Tandoori Chicken (Half)", desc: "Juicy chicken marinated in yogurt and traditional spices, grilled in a clay oven.", price: 480 }
    ]
  },
  {
    category: "Main Dishes",
    items: [
      { name: "Butter Chicken", desc: "Tender grilled chicken cooked in a rich, creamy tomato gravy with a touch of butter.", price: 550 },
      { name: "Dal Makhani", desc: "Slow-cooked black lentils with fresh cream and butter, cooked overnight.", price: 350 }
    ]
  },
  {
    category: "Sweet Desserts",
    items: [
      { name: "Royal Gulab Jamun (2 pcs)", desc: "Warm, sweet milk balls soaked in delicious sugar syrup.", price: 150 }
    ]
  }
];

export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {/* Food Menu CTA Card */}
      <div className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DAA520]/25 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 select-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 border border-[#DAA520]/20 flex items-center justify-center text-[#DAA520] shrink-0">
            <ChefHat size={22} className="animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="font-heading text-xl text-[#1B3564] font-semibold">Homemade Food Menu</h4>
            <p className="text-xs text-text-primary/60 leading-relaxed mt-1">
              Enjoy hot, fresh Indian meals cooked right inside the villa by our private chefs.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1B3564] hover:bg-[#152A50] text-white px-6 py-3.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0 border-none"
        >
          View Food Menu
        </button>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 md:p-10">
            {/* Frosted glass backdrop click listener */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[680px] bg-[#FDFBF7] border border-[#DAA520]/20 rounded-[2.5rem] shadow-[0_15px_40px_rgba(27,53,100,0.2)] p-5 md:p-8 flex flex-col justify-between overflow-hidden max-h-[85vh] z-10"
            >
              {/* Header with Close Cross Button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DAA520]/20 shrink-0">
                <div className="text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.25em] block mb-0.5">Dining</span>
                    <h3 className="text-2xl font-heading text-[#1B3564] italic">
                      Our Food <span className="not-italic font-bold font-sans text-accent-primary">Menu</span>
                    </h3>
                  </div>
                </div>
                {/* Cross Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-[#1B3564]/10 flex items-center justify-center text-[#1B3564]/60 hover:text-[#1B3564] hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Close Food Menu"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Scrollable Menu Items */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto min-h-0 max-h-[42vh] sm:max-h-[50vh] py-4 space-y-8 pr-3 mr-1 scrollbar-thin"
              >
                {indianMenu.map((cat, idx) => (
                  <div key={idx} className="space-y-4 text-left">
                    <h4 className="text-xs font-black text-accent-secondary uppercase tracking-[0.2em] border-b border-[#DAA520]/10 pb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]"></span>
                      {cat.category}
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white border border-border-subtle rounded-2xl p-4.5 flex justify-between gap-4 shadow-sm hover:border-[#DAA520]/30 transition-all duration-300">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-text-primary text-sm uppercase tracking-wide truncate">{item.name}</h5>
                            <p className="text-[11px] text-text-primary/50 leading-relaxed mt-1 font-light">{item.desc}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-[#1B3564]">₹{item.price.toLocaleString("en-IN")}</span>
                            <span className="block text-[8px] text-[#DAA520] font-bold uppercase tracking-wider mt-1">Chef Special</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer / Booking info */}
              <div className="pt-4 border-t border-[#DAA520]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 text-left">
                <div>
                  <span className="text-[9px] text-[#DAA520] font-black uppercase tracking-wider flex items-center gap-1">
                    <Check size={12} className="stroke-[3]" /> Fresh Local Ingredients
                  </span>
                  <p className="text-[10px] text-text-primary/55 mt-0.5 leading-relaxed font-light">
                    We can adjust the spices and ingredients to suit your taste. Please order 24 hours before you check in.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1B3564] hover:bg-[#152A50] text-white px-8 py-3.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md cursor-pointer active:scale-95 border-none w-full sm:w-auto text-center font-bold"
                >
                  CLOSE MENU
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(218, 165, 32, 0.3) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(218, 165, 32, 0.3);
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(218, 165, 32, 0.6);
        }
      `}</style>
    </>
  );
}
