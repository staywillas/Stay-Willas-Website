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
  Tag,
  Sparkles
} from "lucide-react";
import { setDailyPrice, deleteDailyPrice, setDailyPriceRange, deleteDailyPriceRange } from "@/app/actions/admin";

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

  // Bulk rate override states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkOperation, setBulkOperation] = useState<"SET" | "DELETE">("SET");
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkDayPreset, setBulkDayPreset] = useState<"ALL" | "WEEKDAYS" | "WEEKENDS" | "SAT_SUN" | "FRI_SAT" | "CUSTOM">("ALL");
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Open modal with pre-configured month & day preset
  const openBulkForMonthPreset = (preset: "ALL" | "WEEKDAYS" | "WEEKENDS" | "SAT_SUN" | "FRI_SAT" = "ALL") => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const startStr = `${y}-${pad(m + 1)}-01`;
    const endStr = `${y}-${pad(m + 1)}-${pad(lastDay.getDate())}`;

    setBulkStartDate(startStr);
    setBulkEndDate(endStr);
    setBulkOperation("SET");
    setBulkPrice("");

    applyDayPreset(preset);
    setShowBulkModal(true);
  };

  const applyDayPreset = (preset: "ALL" | "WEEKDAYS" | "WEEKENDS" | "SAT_SUN" | "FRI_SAT" | "CUSTOM") => {
    setBulkDayPreset(preset);
    if (preset === "ALL") {
      setSelectedDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    } else if (preset === "WEEKDAYS") {
      setSelectedDaysOfWeek([1, 2, 3, 4]); // Mon, Tue, Wed, Thu
    } else if (preset === "WEEKENDS") {
      setSelectedDaysOfWeek([0, 5, 6]); // Fri, Sat, Sun
    } else if (preset === "SAT_SUN") {
      setSelectedDaysOfWeek([0, 6]); // Sat, Sun
    } else if (preset === "FRI_SAT") {
      setSelectedDaysOfWeek([5, 6]); // Fri, Sat
    }
  };

  const toggleDayOfWeek = (dayIndex: number) => {
    setBulkDayPreset("CUSTOM");
    setSelectedDaysOfWeek(prev => {
      if (prev.includes(dayIndex)) {
        if (prev.length === 1) return prev; // Keep at least one day selected
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  // Calculate total matching dates
  const countMatchingDates = () => {
    if (!bulkStartDate || !bulkEndDate) return 0;
    const start = new Date(bulkStartDate);
    const end = new Date(bulkEndDate);
    if (start > end) return 0;

    let count = 0;
    let curr = new Date(start);
    while (curr <= end) {
      if (selectedDaysOfWeek.includes(curr.getDay())) {
        count++;
      }
      curr.setDate(curr.getDate() + 1);
    }
    return count;
  };

  // Prefill bulk dates on default modal show
  useEffect(() => {
    if (showBulkModal && !bulkStartDate) {
      openBulkForMonthPreset("ALL");
    }
  }, [showBulkModal]);

  const handleBulkOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillaId || !bulkStartDate || !bulkEndDate) return;

    const start = new Date(bulkStartDate);
    const end = new Date(bulkEndDate);
    if (start > end) {
      alert("Start Date must be on or before End Date.");
      return;
    }

    if (selectedDaysOfWeek.length === 0) {
      alert("Please select at least one day of the week.");
      return;
    }

    setIsBulkSubmitting(true);
    try {
      if (bulkOperation === "SET") {
        const numericPrice = parseFloat(bulkPrice);
        if (isNaN(numericPrice) || numericPrice <= 0) {
          alert("Please enter a valid positive price.");
          setIsBulkSubmitting(false);
          return;
        }

        const res = await setDailyPriceRange(
          selectedVillaId, 
          bulkStartDate, 
          bulkEndDate, 
          numericPrice, 
          selectedDaysOfWeek
        );
        
        if (res.success && res.overrides) {
          // Reactively update parent villas state
          const updatedVillas = villas.map(v => {
            if (v.id === selectedVillaId) {
              const overriddenDatesSet = new Set(
                res.overrides.map((o: any) => new Date(o.date).toISOString().split("T")[0])
              );

              // Filter out old overrides for dates that were just updated
              let dailyPrices = (v.dailyPrices || []).filter(dp => {
                const dStr = new Date(dp.date).toISOString().split("T")[0];
                return !overriddenDatesSet.has(dStr);
              });

              // Append new overrides
              const newOverrides = res.overrides.map((o: any) => ({
                id: o.id,
                villaId: o.villaId,
                date: new Date(o.date),
                price: o.price
              }));
              dailyPrices = [...dailyPrices, ...newOverrides];

              return { ...v, dailyPrices };
            }
            return v;
          });

          onVillasChange(updatedVillas);
          setShowBulkModal(false);
        } else {
          alert(res.error || "Failed to set bulk price overrides.");
        }
      } else {
        // DELETE operation
        const daysLabel = selectedDaysOfWeek.length === 7 ? "all dates" : "the selected weekdays/weekends";
        if (!confirm(`Are you sure you want to restore the base rate for ${daysLabel} between ${bulkStartDate} and ${bulkEndDate}?`)) {
          setIsBulkSubmitting(false);
          return;
        }

        const res = await deleteDailyPriceRange(
          selectedVillaId, 
          bulkStartDate, 
          bulkEndDate, 
          selectedDaysOfWeek
        );
        
        if (res.success) {
          const updatedVillas = villas.map(v => {
            if (v.id === selectedVillaId) {
              const startObj = new Date(bulkStartDate);
              const endObj = new Date(bulkEndDate);

              const dailyPrices = (v.dailyPrices || []).filter(dp => {
                const d = new Date(dp.date);
                if (d >= startObj && d <= endObj) {
                  return !selectedDaysOfWeek.includes(d.getDay());
                }
                return true;
              });

              return { ...v, dailyPrices };
            }
            return v;
          });

          onVillasChange(updatedVillas);
          setShowBulkModal(false);
        } else {
          alert(res.error || "Failed to clear bulk pricing overrides.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during the bulk pricing operation.");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

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
      return check.getFullYear() === dDate.getUTCFullYear() &&
             check.getMonth() === dDate.getUTCMonth() &&
             check.getDate() === dDate.getUTCDate();
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
      const utcDateStr = new Date(Date.UTC(
        selectedCellDate.getFullYear(),
        selectedCellDate.getMonth(),
        selectedCellDate.getDate()
      )).toISOString();
      const res = await setDailyPrice(selectedVillaId, utcDateStr, numericPrice);
      if (res.success && res.override) {
        // Reactively update parent villas state
        const updatedVillas = villas.map(v => {
          if (v.id === selectedVillaId) {
            const dailyPrices = [...(v.dailyPrices || [])];
            const existingIdx = dailyPrices.findIndex(
              dp => {
                const dDate = new Date(dp.date);
                return dDate.getUTCFullYear() === selectedCellDate.getFullYear() &&
                       dDate.getUTCMonth() === selectedCellDate.getMonth() &&
                       dDate.getUTCDate() === selectedCellDate.getDate();
              }
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
      const utcDateStr = new Date(Date.UTC(
        selectedCellDate.getFullYear(),
        selectedCellDate.getMonth(),
        selectedCellDate.getDate()
      )).toISOString();
      const res = await deleteDailyPrice(selectedVillaId, utcDateStr);
      if (res.success) {
        // Reactively update local parent state
        const updatedVillas = villas.map(v => {
          if (v.id === selectedVillaId) {
            const dailyPrices = (v.dailyPrices || []).filter(
              dp => {
                const dDate = new Date(dp.date);
                return !(dDate.getUTCFullYear() === selectedCellDate.getFullYear() &&
                         dDate.getUTCMonth() === selectedCellDate.getMonth() &&
                         dDate.getUTCDate() === selectedCellDate.getDate());
              }
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-100">
        <div className="text-left">
          <h3 className="text-2xl font-cormorant font-bold italic tracking-wide text-[#1B3564] flex items-center gap-3">
            <TrendingUp className="text-[#DAA520]" size={24} />
            Everyday Pricing Scheduler
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            Fine-tuned price control calendar. Click any calendar date or use bulk buttons to override weekdays/weekends instantly.
          </p>
        </div>

        {/* Villa Picker & Month Navigation */}
        <div className="flex flex-wrap items-center gap-3 font-sans shrink-0">
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

          {/* Month Navigation */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full font-sans shadow-sm">
            <button 
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 hover:text-[#1B3564] cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs uppercase tracking-widest font-black text-[#1B3564] whitespace-nowrap min-w-[110px] text-center select-none">
              {monthName} {year}
            </span>
            <button 
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 hover:text-[#1B3564] cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Month Bulk Override Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-[#FAF8F5] to-slate-50 border border-[#DAA520]/25 shadow-2xs font-sans">
        <div className="flex items-center gap-2 text-left">
          <Sparkles size={16} className="text-[#DAA520] shrink-0" />
          <span className="text-xs font-bold text-[#1B3564]">
            Quick Overrides for <strong className="text-[#DAA520]">{monthName} {year}</strong>:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Weekdays Quick Button */}
          <button
            type="button"
            onClick={() => openBulkForMonthPreset("WEEKDAYS")}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#1B3564] text-[#1B3564] hover:text-white border border-slate-200 hover:border-[#1B3564] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-2xs hover:shadow-sm cursor-pointer"
          >
            <span>💼 Weekdays (Mon-Thu)</span>
          </button>

          {/* Weekends Quick Button */}
          <button
            type="button"
            onClick={() => openBulkForMonthPreset("WEEKENDS")}
            className="inline-flex items-center gap-1.5 bg-[#DAA520]/15 hover:bg-[#DAA520] text-[#1B3564] border border-[#DAA520]/30 hover:border-[#DAA520] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-2xs hover:shadow-sm cursor-pointer"
          >
            <span>🏖️ Weekends (Fri-Sun)</span>
          </button>

          {/* Entire Month Quick Button */}
          <button
            type="button"
            onClick={() => openBulkForMonthPreset("ALL")}
            className="inline-flex items-center gap-1.5 bg-[#1B3564] hover:bg-[#DAA520] text-white hover:text-[#1B3564] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <Tag size={13} />
            <span>Full Month / Custom</span>
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
          <strong>How Everyday Pricing Priority Works:</strong> If a date has a custom <strong>Daily Override</strong>, that rate is strictly applied. Otherwise, the engine checks for active <strong>Seasonal Ranges</strong> (holiday periods), then <strong>Weekend rates</strong> (Fridays/Saturdays), and finally defaults to the villa&apos;s <strong>Base Rate</strong>.
        </p>
      </div>

      {/* Single Cell Price Override Modal */}
      {selectedCellDate && selectedVilla && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in font-sans">
          <form 
            onSubmit={handleSaveOverride}
            className="glass border border-slate-200 rounded-[32px] p-8 max-w-sm w-full relative shadow-2xl space-y-6"
          >
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#DAA520] block mb-1">
                {selectedVilla.name}
              </span>
              <h4 className="text-xl font-cormorant font-bold italic text-[#1B3564]">
                {selectedCellDate.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
              </h4>
            </div>

            <div className="space-y-3">
              <div className="text-left space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                  SET DAILY RATE (INR)
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
                    placeholder="e.g. 15000"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl pl-8 pr-4 py-3.5 text-sm font-black focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/10 outline-none"
                    min={1}
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOverridePrice(selectedVilla.price.toString())}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl py-2 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Base (₹{selectedVilla.price.toLocaleString("en-IN")})
                </button>
                {selectedVilla.weekendPrice && (
                  <button
                    type="button"
                    onClick={() => setOverridePrice(selectedVilla.weekendPrice!.toString())}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl py-2 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    Weekend (₹{selectedVilla.weekendPrice.toLocaleString("en-IN")})
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B3564] hover:bg-[#DAA520] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                {isSubmitting ? "SAVING RATE..." : "APPLY RATE OVERRIDE"}
              </button>

              {/* Reset to Base Price button (only visible if currently overridden) */}
              {selectedVilla.dailyPrices?.some(dp => {
                const dDate = new Date(dp.date);
                return dDate.getUTCFullYear() === selectedCellDate.getFullYear() &&
                       dDate.getUTCMonth() === selectedCellDate.getMonth() &&
                       dDate.getUTCDate() === selectedCellDate.getDate();
              }) && (
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

      {/* Enhanced Bulk Pricing Setter Overlay Modal */}
      {showBulkModal && selectedVilla && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in font-sans">
          <form 
            onSubmit={handleBulkOverride}
            className="glass border border-slate-200 rounded-[32px] p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6 text-left"
          >
            <div className="text-left border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DAA520]">
                  {selectedVilla.name}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Bulk Scheduler
                </span>
              </div>
              <h4 className="text-2xl font-cormorant font-bold italic text-[#1B3564] mt-1 flex items-center gap-2">
                <Tag size={20} className="text-[#DAA520]" />
                Bulk Rate Override
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                Quickly select weekdays, weekends, or specific days of the month to apply or clear rates.
              </p>
            </div>

            <div className="space-y-4">
              {/* Operation type toggler */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setBulkOperation("SET")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    bulkOperation === "SET" 
                      ? "bg-white text-[#1B3564] shadow-sm font-black" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Set Custom Price
                </button>
                <button
                  type="button"
                  onClick={() => setBulkOperation("DELETE")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    bulkOperation === "DELETE" 
                      ? "bg-white text-red-600 shadow-sm font-black" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Restore Base (Clear)
                </button>
              </div>

              {/* Date Range Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={bulkStartDate}
                    onChange={(e) => setBulkStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">End Date</label>
                  <input
                    type="date"
                    required
                    value={bulkEndDate}
                    min={bulkStartDate}
                    onChange={(e) => setBulkEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none"
                  />
                </div>
              </div>

              {/* Day Preset Buttons */}
              <div className="space-y-2">
                <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                  DAY SELECTION PRESET
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyDayPreset("ALL")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "ALL" 
                        ? "bg-[#1B3564] text-white border-[#1B3564]" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    All 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDayPreset("WEEKDAYS")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "WEEKDAYS" 
                        ? "bg-[#1B3564] text-white border-[#1B3564]" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    💼 Weekdays
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDayPreset("WEEKENDS")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "WEEKENDS" 
                        ? "bg-[#DAA520] text-[#1B3564] border-[#DAA520] font-black" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    🏖️ Fri-Sun
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDayPreset("SAT_SUN")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "SAT_SUN" 
                        ? "bg-[#DAA520] text-[#1B3564] border-[#DAA520] font-black" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Sat & Sun
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDayPreset("FRI_SAT")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "FRI_SAT" 
                        ? "bg-[#DAA520] text-[#1B3564] border-[#DAA520] font-black" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Fri & Sat
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkDayPreset("CUSTOM")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      bulkDayPreset === "CUSTOM" 
                        ? "bg-[#1B3564] text-white border-[#1B3564]" 
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    ✏️ Custom
                  </button>
                </div>
              </div>

              {/* Individual Day-of-Week Interactive Pills */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">
                    TARGET DAYS OF WEEK:
                  </span>
                  <span className="text-[10px] text-[#DAA520] font-black">
                    {selectedDaysOfWeek.length} of 7 Selected
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    { label: "Sun", day: 0, isWeekend: true },
                    { label: "Mon", day: 1, isWeekend: false },
                    { label: "Tue", day: 2, isWeekend: false },
                    { label: "Wed", day: 3, isWeekend: false },
                    { label: "Thu", day: 4, isWeekend: false },
                    { label: "Fri", day: 5, isWeekend: true },
                    { label: "Sat", day: 6, isWeekend: true },
                  ].map(item => {
                    const isSelected = selectedDaysOfWeek.includes(item.day);
                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => toggleDayOfWeek(item.day)}
                        className={`py-2 rounded-xl text-center text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? item.isWeekend 
                              ? "bg-[#DAA520] text-[#1B3564] border-[#DAA520] shadow-xs scale-105"
                              : "bg-[#1B3564] text-white border-[#1B3564] shadow-xs scale-105"
                            : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Matching Dates Badge */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-[#DAA520]/30 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3564] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#DAA520]" />
                  Matching Target Dates:
                </span>
                <span className="text-xs font-black text-[#1B3564] bg-white px-2.5 py-0.5 rounded-full border border-[#DAA520]/40">
                  {countMatchingDates()} Days
                </span>
              </div>

              {/* Custom price field */}
              {bulkOperation === "SET" && (
                <div className="text-left space-y-2 pt-1">
                  <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                    NEW RATE FOR SELECTED DAYS (INR)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none text-xs">
                      ₹
                    </div>
                    <input 
                      type="number"
                      required
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      placeholder="e.g. 16500"
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl pl-8 pr-4 py-3 text-sm font-black focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/10 outline-none"
                      min={1}
                    />
                  </div>

                  {/* Quick price helpers */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setBulkPrice(selectedVilla.price.toString())}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Base (₹{selectedVilla.price.toLocaleString("en-IN")})
                    </button>
                    {selectedVilla.weekendPrice && (
                      <button
                        type="button"
                        onClick={() => setBulkPrice(selectedVilla.weekendPrice!.toString())}
                        className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Weekend (₹{selectedVilla.weekendPrice.toLocaleString("en-IN")})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const b = parseFloat(bulkPrice) || selectedVilla.price;
                        setBulkPrice(Math.round(b * 1.15).toString());
                      }}
                      className="text-[10px] font-bold text-[#1B3564] bg-[#DAA520]/20 hover:bg-[#DAA520]/30 px-2.5 py-1 rounded-md transition-colors"
                    >
                      +15%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const b = parseFloat(bulkPrice) || selectedVilla.price;
                        setBulkPrice(Math.round(b * 1.25).toString());
                      }}
                      className="text-[10px] font-bold text-[#1B3564] bg-[#DAA520]/20 hover:bg-[#DAA520]/30 px-2.5 py-1 rounded-md transition-colors"
                    >
                      +25%
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isBulkSubmitting || countMatchingDates() === 0}
                className={`w-full text-white py-3.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg ${
                  bulkOperation === "SET"
                    ? "bg-[#1B3564] hover:bg-[#DAA520] hover:text-[#1B3564]"
                    : "bg-red-500 hover:bg-red-650"
                }`}
              >
                {isBulkSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : bulkOperation === "SET" ? (
                  `APPLY TO ${countMatchingDates()} MATCHING DATES`
                ) : (
                  `CLEAR OVERRIDES FOR ${countMatchingDates()} DATES`
                )}
              </button>

              <button 
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
