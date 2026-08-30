"use client";

import React, { useState, useEffect } from "react";
import { Utensils, X, Check, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MealItem {
  course: string;
  veg: string;
  nonVeg?: string;
  jainAvailable?: boolean;
}

const foodPackages = {
  standard: {
    name: "Standard Meal Package",
    tagline: "Homestyle comfort meals cooked fresh on-site",
    price: 1250,
    badge: "Popular Choice",
    meals: [
      {
        course: "Breakfast (8:30 AM – 10:30 AM)",
        items: [
          "Choice of Kanda Poha / Upma / Misal Pav / Idli Sambar",
          "Eggs to order (Scrambled / Omelette / Boiled) with Bread & Butter",
          "Hot Masala Chai & Fresh Brewed Coffee"
        ]
      },
      {
        course: "Lunch (1:00 PM – 3:00 PM)",
        items: [
          "Main Course: Paneer Butter Masala / Kadhai Veg OR Homestyle Chicken Curry",
          "Yellow Dal Tadka / Dal Fry with Steamed Jeera Rice",
          "Fresh Handmade Phulkas / Chapatis",
          "Garden Green Salad, Roasted Papad & Pickle",
          "Dessert: Hot Gulab Jamun / Shrikhand"
        ]
      },
      {
        course: "Evening High Tea (5:00 PM – 6:30 PM)",
        items: [
          "Steaming Hot Onion / Mix Veg Pakoras with Green Chutney",
          "Biscuits & Cookies",
          "Masala Chai & Coffee"
        ]
      },
      {
        course: "Dinner (8:30 PM – 10:30 PM)",
        items: [
          "Main Course: Veg Kolhapuri / Mix Veg OR Chicken Masala Gravy",
          "Comforting Dal Fry with Steamed Rice",
          "Fresh Hot Phulkas / Chapatis",
          "Cooling Boondi Raita & Salad",
          "Dessert: Kheer / Sweet Dish"
        ]
      }
    ]
  },
  deluxe: {
    name: "Deluxe Gourmet Package",
    tagline: "Lavish multi-course feast with BBQ starters & premium specials",
    price: 1500,
    badge: "Chef's Special",
    meals: [
      {
        course: "Breakfast (8:30 AM – 10:30 AM)",
        items: [
          "Choice of Stuffed Aloo/Paneer Parathas OR South Indian Platter (Idli/Dosa/Vada)",
          "Eggs to order (Cheese Omelette / Sunny Side Up / Bhurji) with Toast & Jam",
          "Fresh Seasonal Cut Fruits & Juice",
          "Special Masala Chai & Filter Coffee"
        ]
      },
      {
        course: "Lunch (1:00 PM – 3:00 PM)",
        items: [
          "Paneer Tikka Masala / Kadhai Paneer OR Butter Chicken / Mutton Sukka",
          "Dal Makhani slow-cooked overnight with fresh cream",
          "Fragrant Jeera Rice / Veg Pulao",
          "Fresh Butter Phulkas / Naan",
          "Cucumber Raita, Roasted Papad, Achari Salad",
          "Dessert: Gulab Jamun with Vanilla Ice Cream / Rasmalai"
        ]
      },
      {
        course: "Evening BBQ & Hi-Tea (5:00 PM – 6:30 PM)",
        items: [
          "Live Barbecue Starters: Paneer Tikka / Veg Seekh OR Chicken Tikka / Seekh Kebab",
          "Crispy French Fries / Cheese Corn Balls with Dips",
          "Adrak Elaichi Chai, Cappuccino & Cookies"
        ]
      },
      {
        course: "Dinner (8:30 PM – 10:30 PM)",
        items: [
          "Signature Dum Biryani (Veg Dum Biryani OR Chicken Dum Biryani)",
          "Mughlai Gravy / Paneer Lababdar OR Chicken Korma",
          "Dal Tadka with Steamed Basmati Rice & Mirchi Ka Salan",
          "Fresh Tandoori Rotis / Butter Phulkas",
          "Dessert: Sizzling Brownie / Shahi Tukda"
        ]
      }
    ]
  }
};

export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "deluxe">("standard");

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

  const activePackage = foodPackages[selectedPlan];

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
              <h4 className="font-heading text-xl text-[#1B3564] font-semibold">Homemade Meal Packages</h4>
              <span className="text-[10px] bg-[#DAA520]/15 text-[#1B3564] font-bold px-2 py-0.5 rounded-full border border-[#DAA520]/30">
                ₹1,250 – ₹1,500 / day
              </span>
            </div>
            <p className="text-xs text-text-primary/60 leading-relaxed mt-1">
              All 4 daily meals included: Breakfast, Lunch, Evening Snacks with Tea/Coffee & Dinner prepared by private in-villa chefs.
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
          <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 md:p-6">
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
              className="relative w-full max-w-[760px] bg-[#FDFBF7] border border-[#DAA520]/30 rounded-[2rem] shadow-[0_20px_50px_rgba(27,53,100,0.3)] p-5 md:p-7 flex flex-col justify-between overflow-hidden max-h-[90vh] z-10"
            >
              {/* Header with Close Cross Button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#DAA520]/20 shrink-0">
                <div className="text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-accent-secondary font-black uppercase tracking-[0.25em] block mb-0.5">Dining Packages</span>
                    <h3 className="text-2xl font-heading text-[#1B3564] italic">
                      Private Chef <span className="not-italic font-bold font-sans text-accent-primary">Meal Menu</span>
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

              {/* Package Selector Tabs */}
              <div className="grid grid-cols-2 gap-3 pt-4 pb-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPlan("standard")}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    selectedPlan === "standard"
                      ? "bg-[#1B3564] text-white border-[#1B3564] shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#DAA520]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider">Standard Package</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedPlan === "standard" ? "bg-[#DAA520] text-[#1B3564]" : "bg-slate-100 text-slate-600"
                    }`}>
                      Popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-extrabold ${selectedPlan === "standard" ? "text-[#DAA520]" : "text-[#1B3564]"}`}>
                      ₹1,250
                    </span>
                    <span className={`text-[10px] ${selectedPlan === "standard" ? "text-slate-300" : "text-slate-500"}`}>
                      / person / day
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan("deluxe")}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    selectedPlan === "deluxe"
                      ? "bg-[#1B3564] text-white border-[#1B3564] shadow-md scale-[1.02]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#DAA520]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider">Deluxe Package</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedPlan === "deluxe" ? "bg-[#DAA520] text-[#1B3564]" : "bg-amber-100 text-amber-800"
                    }`}>
                      Chef Special BBQ
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-extrabold ${selectedPlan === "deluxe" ? "text-[#DAA520]" : "text-[#1B3564]"}`}>
                      ₹1,500
                    </span>
                    <span className={`text-[10px] ${selectedPlan === "deluxe" ? "text-slate-300" : "text-slate-500"}`}>
                      / person / day
                    </span>
                  </div>
                </button>
              </div>

              {/* Scrollable Menu Items */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto min-h-0 max-h-[44vh] sm:max-h-[48vh] py-2 space-y-4 pr-2 mr-0.5 scrollbar-thin text-left"
              >
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
                  <span>✨ <strong>{activePackage.name}:</strong> {activePackage.tagline}</span>
                  <span className="font-bold text-[#1B3564]">All 4 Meals Included</span>
                </div>

                {activePackage.meals.map((meal, idx) => (
                  <div key={idx} className="bg-white border border-[#DAA520]/20 rounded-2xl p-4 shadow-xs hover:border-[#DAA520]/40 transition-all">
                    <h5 className="font-heading font-bold text-[#1B3564] text-sm mb-2.5 pb-1.5 border-b border-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DAA520]" />
                      {meal.course}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {meal.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Dietary notes */}
              <div className="pt-3 pb-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Pure Veg & Jain cooking with separate cookware</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-600" />
                  <span>Customizable spice levels for kids & seniors</span>
                </div>
              </div>

              {/* Footer / Booking info */}
              <div className="pt-3 border-t border-[#DAA520]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-left">
                <p className="text-[10px] text-slate-500">
                  Orders must be confirmed at least 24 hours prior to check-in.
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! 🍽️ I would love to select the ${activePackage.name} (₹${activePackage.price}/person/day) for our stay.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Confirm Meal on WhatsApp
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
