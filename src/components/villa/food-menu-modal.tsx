"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ChefHat } from "lucide-react";
const FoodMenuDialog = dynamic(() => import("./food-menu-dialog"), {
  ssr: false,
  loading: () => <p role="status" className="fixed bottom-24 inset-x-4 z-[999999] rounded-xl bg-white p-4 text-center text-slate-700">Loading dining menus…</p>,
});
export default function FoodMenuModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (<>
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


    {isOpen && <FoodMenuDialog onClose={() => setIsOpen(false)} />}
  </>);
}
