"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  IndianRupee, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Info, 
  Loader2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Tag
} from "lucide-react";
import { setDailyPrice, deleteDailyPrice } from "@/app/actions/admin";

interface SeasonalPrice {
  id: string;
  villaId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  label?: string | null;
}

interface DailyPrice {
  id: string;
  villaId: string;
  date: Date;
  price: number;
}

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  category: string;
  bedrooms: number;
  guests: number;
  images: string[];
  description: string;
  weekendPrice?: number | null;
  seasonalPrices: SeasonalPrice[];
  dailyPrices: DailyPrice[];
}

interface DailyPricingCalendarProps {
  villas: Villa[];
  onVillasChange: (updatedVillas: Villa[]) => void;
}

export default function DailyPricingCalendar({ villas, onVillasChange }: DailyPricingCalendarProps) {
  const [selectedVillaId, setSelectedVillaId] = useState<string>(villas[0]?.id || "");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCellDate, setSelectedCellDate] = useState<Date | null>(null);
  const [overridePrice, setOverridePrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedVilla = villas.find(v => v.id === selectedVillaId);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday

  // Prev/Next month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedCellDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedCellDate(null);
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  // Calculate price for a specific date cell
  const getDayPriceDetails = (date: Date) => {
    if (!selectedVilla) return { price: 0, type: "BASE" as const, label: "Base Rate" };

    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    // 1. Check Daily Overrides (highest priority)
    const dailyOverride = selectedVilla.dailyPrices?.find(dp => {
      const dDate = new Date(dp.date);
      dDate.setHours(0, 0, 0, 0);
      return check.getTime() === dDate.getTime();
    });

    if (dailyOverride) {
      return { price: dailyOverride.price, type: "DAILY" as const, label: "Daily Override" };
    }

    // 2. Check Seasonal Price Overrides
    const seasonalOverride = selectedVilla.seasonalPrices?.find(sp => {
      const start = new Date(sp.startDate);
      const end = new Date(sp.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check.getTime() >= start.getTime() && check.getTime() <= end.getTime();
    });

    if (seasonalOverride) {
      return { 
        price: seasonalOverride.price, 
        type: "SEASONAL" as const, 
        label: seasonalOverride.label || "Holiday Season" 
      };
    }

    // 3. Check Weekend Pricing (Friday = 5, Saturday = 6)
    const dayOfWeek = check.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    if (isWeekend && selectedVilla.weekendPrice) {
      return { price: selectedVilla.weekendPrice, type: "WEEKEND" as const, label: "Weekend Rate" };
    }

    // 4. Fallback to base rate
    return { price: selectedVilla.price, type: "BASE" as const, label: "Base Rate" };
  };

  // Open modal/panel to override price
  const handleCellClick = (date: Date) => {
    setSelectedCellDate(date);
    const dayDetails = getDayPriceDetails(date);
    setOverridePrice(dayDetails.price.toString());
  };

  // Submit new price override
  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillaId || !selectedCellDate || !overridePrice.trim()) return;

    setIsSubmitting(true);
    const numericPrice = parseFloat(overridePrice);
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Please enter a valid positive price.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await setDailyPrice(selectedVillaId, selectedCellDate.toISOString(), numericPrice);
      if (res.success && res.override) {
        // Reactively update parent villas state
        const updatedVillas = villas.map(v => {
          if (v.id === selectedVillaId) {
            const dailyPrices = [...(v.dailyPrices || [])];
            const existingIdx = dailyPrices.findIndex(
              dp => new Date(dp.date).toDateString() === selectedCellDate.toDateString()
            );

            const newOverride: DailyPrice = {
              id: res.override.id,
              villaId: res.override.villaId,
              date: new Date(res.override.date),
              price: res.override.price
            };

            if (existingIdx > -1) {
              dailyPrices[existingIdx] = newOverride;
            } else {
              dailyPrices.push(newOverride);
            }

            return { ...v, dailyPrices };
          }
          return v;
        });

        onVillasChange(updatedVillas);
        setSelectedCellDate(null);
      } else {
        alert(res.error || "Failed to set price override.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save pricing details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete price override
  const handleResetOverride = async () => {
    if (!selectedVillaId || !selectedCellDate) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteDailyPrice(selectedVillaId, selectedCellDate.toISOString());
      if (res.success) {
        // Reactively update local parent state
        const updatedVillas = villas.map(v => {
          if (v.id === selectedVillaId) {
            const dailyPrices = (v.dailyPrices || []).filter(
              dp => new Date(dp.date).toDateString() !== selectedCellDate.toDateString()
            );
            return { ...v, dailyPrices };
          }
          return v;
        });

        onVillasChange(updatedVillas);
        setSelectedCellDate(null);
      } else {
        alert(res.error || "Failed to reset price override.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reset daily price.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate calendar grid array
  const renderCalendarCells = () => {
    const cells = [];

    // Empty cells for the start offset of the month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-28 bg-slate-50/10 border border-slate-100/50 rounded-xl" />);
    }

    // Days cells
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dayDate = new Date(year, month, dayNum);
      const dayDetails = getDayPriceDetails(dayDate);
      const isToday = new Date().toDateString() === dayDate.toDateString();
      const isSelected = selectedCellDate?.toDateString() === dayDate.toDateString();

      let borderClass = "border-slate-100 hover:border-[#1B3564]/30";
      let bgClass = "bg-white hover:bg-slate-50/30";
      
      if (isToday) {
        borderClass = "border-[#1B3564] shadow-sm";
      }

      if (isSelected) {
        bgClass = "bg-[#1B3564]/5 border-[#1B3564]/50 ring-1 ring-[#1B3564]/20";
      }

      // Overrides pill colors
      let badgeClass = "bg-slate-100 text-slate-600";
      if (dayDetails.type === "DAILY") {
        badgeClass = "bg-[#DAA520]/15 text-[#DAA520] border border-[#DAA520]/30 font-bold";
      } else if (dayDetails.type === "SEASONAL") {
        badgeClass = "bg-[#559C24]/15 text-[#559C24] border border-[#559C24]/30";
      } else if (dayDetails.type === "WEEKEND") {
        badgeClass = "bg-[#1B3564]/10 text-[#1B3564] border border-[#1B3564]/15";
      }

      cells.push(
        <div 
          key={`day-${dayNum}`}
          onClick={() => handleCellClick(dayDate)}
          className={`h-28 border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-300 ${borderClass} ${bgClass}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold select-none ${isToday ? "text-[#1B3564] font-black w-6 h-6 rounded-full bg-[#1B3564]/10 flex items-center justify-center" : "text-slate-400"}`}>
              {dayNum}
            </span>
            <span className={`text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full select-none ${badgeClass}`}>
              {dayDetails.type === "DAILY" ? "OVERRIDE" : dayDetails.type === "SEASONAL" ? "SEASON" : dayDetails.type === "WEEKEND" ? "WKND" : "BASE"}
            </span>
          </div>

          <div className="text-left mt-2 select-none">
            <div className="flex items-baseline gap-0.5 text-slate-800">
              <span className="text-[10px] font-medium text-slate-400">₹</span>
              <span className="text-sm font-black tracking-tight">{dayDetails.price.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[7px] uppercase tracking-widest text-slate-400 mt-1 truncate max-w-full font-medium">
              {dayDetails.label}
            </p>
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="glass border border-slate-200 rounded-[32px] p-8 overflow-hidden relative shadow-elevated">
      
      {/* Calendar Header Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
        <div className="text-left">
          <h3 className="text-2xl font-cormorant font-bold italic tracking-wide text-[#1B3564] flex items-center gap-3">
            <TrendingUp className="text-[#DAA520]" size={24} />
            Everyday Pricing Scheduler
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            Fine-tuned price control calendar. Click any calendar date to override rates instantly.
          </p>
        </div>

        {/* Villa Picker */}
        <div className="flex items-center gap-3 font-sans shrink-0">
          <span className="text-xs uppercase tracking-widest font-bold text-slate-500">SANCTUARY:</span>
          <select 
            value={selectedVillaId}
            onChange={(e) => {
              setSelectedVillaId(e.target.value);
              setSelectedCellDate(null);
            }}
            className="bg-white border border-slate-200 text-[#1B3564] rounded-full px-5 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none shadow-sm cursor-pointer"
          >
            {villas.map(v => (
              <option key={v.id} value={v.id} className="text-slate-800">
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full self-start md:self-auto font-sans shrink-0 shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#1B3564] cursor-pointer border border-transparent hover:border-slate-200"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs uppercase tracking-widest font-black text-[#1B3564] whitespace-nowrap min-w-[120px] text-center select-none">
            {monthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#1B3564] cursor-pointer border border-transparent hover:border-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend Block */}
      <div className="flex flex-wrap gap-6 mb-8 text-[10px] font-sans text-slate-400 font-bold tracking-widest uppercase select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#DAA520]/15 border border-[#DAA520]/30"></span>
          <span className="text-slate-600">Daily Override Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#559C24]/15 border border-[#559C24]/30"></span>
          <span className="text-slate-600">Seasonal Holiday Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#1B3564]/10 border border-[#1B3564]/15"></span>
          <span className="text-slate-600">Weekend Special Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white border border-slate-200"></span>
          <span className="text-slate-600">Base Standard Rate</span>
        </div>
      </div>

      {/* Pricing Calendar Month Grid */}
      <div className="grid grid-cols-7 gap-3 mb-4 select-none">
        {/* Days Header */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center py-2 text-[9px] uppercase tracking-widest text-slate-400 font-black">
            {day}
          </div>
        ))}

        {/* Cells grid */}
        {renderCalendarCells()}
      </div>

      {/* Inline Help / Overview card */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-start text-left font-sans select-none">
        <Info className="text-[#1B3564] shrink-0 mt-0.5" size={16} />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <strong>How Everyday Pricing Priority Works:</strong> If a date has a custom <strong>Daily Override</strong>, that rate is strictly applied. Otherwise, the engine checks for active <strong>Seasonal Ranges</strong> (holiday periods), then <strong>Weekend rates</strong> (Fridays/Saturdays), and finally defaults to the villa's <strong>Base Rate</strong>.
        </p>
      </div>

      {/* Pricing Setter Overlay Modal */}
      {selectedCellDate && selectedVilla && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in font-sans">
          <form 
            onSubmit={handleSaveOverride}
            className="glass border border-slate-200 rounded-[32px] p-8 max-w-sm w-full relative shadow-2xl space-y-6"
          >
            <div className="text-left">
              <h4 className="text-xl font-cormorant font-bold italic text-[#1B3564] flex items-center gap-2">
                <Tag size={18} className="text-[#DAA520]" />
                Daily Rate Override
              </h4>
              <p className="text-slate-400 text-xs mt-1">
                Override single-day pricing for <strong className="text-slate-800">{selectedVilla.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Selected Calendar Date</span>
                <span className="text-sm font-black text-[#1B3564]">
                  {selectedCellDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Default Calibrated Rate</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                  ₹{getDayPriceDetails(selectedCellDate).price.toLocaleString("en-IN")}
                  <span className="text-[8px] uppercase tracking-wider text-slate-400">
                    ({getDayPriceDetails(selectedCellDate).label})
                  </span>
                </span>
              </div>
            </div>

            <div className="text-left space-y-1.5">
              <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                NEW OVERRIDE RATE (INR)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none text-xs">
                  ₹
                </div>
                <input 
                  type="number"
                  required
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                  placeholder="e.g. 18500"
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl pl-8 pr-4 py-3.5 text-sm font-black focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/10 outline-none"
                  min={1}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B3564] text-white hover:bg-[#DAA520] py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : "APPLY RATE OVERRIDE"}
              </button>

              {/* Reset to Base Price button (only visible if currently overridden) */}
              {selectedVilla.dailyPrices?.some(dp => new Date(dp.date).toDateString() === selectedCellDate.toDateString()) && (
                <button 
                  type="button"
                  onClick={handleResetOverride}
                  disabled={isDeleting}
                  className="w-full bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-600 hover:text-white py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  {isDeleting ? "RESETTING..." : "RESTORE BASE RATE"}
                </button>
              )}

              <button 
                type="button"
                onClick={() => setSelectedCellDate(null)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                CLOSE OVERRIDE PANEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
