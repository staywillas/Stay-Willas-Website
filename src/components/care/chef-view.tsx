"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { Utensils, Coffee, Moon, Sun, Send, LogOut, CheckCircle2, Sparkles, ChefHat } from "lucide-react";

interface ChefViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  onSubmitLog: (data: { category: string; notes?: string; imageBase64: string; villaSlug?: string }) => Promise<{ success: boolean; error?: string }>;
  existingLogs: any[];
}

const MEAL_TYPES = [
  { id: "BREAKFAST", label: "Breakfast", time: "8:00 AM – 10:30 AM", icon: Sun },
  { id: "LUNCH", label: "Lunch", time: "1:00 PM – 3:00 PM", icon: Utensils },
  { id: "HI_TEA", label: "High-Tea", time: "5:00 PM – 6:30 PM", icon: Coffee },
  { id: "DINNER", label: "Dinner / BBQ", time: "8:30 PM – 10:30 PM", icon: Moon },
];

export default function ChefView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  onSubmitLog,
  existingLogs = [],
}: ChefViewProps) {
  const [selectedMeal, setSelectedMeal] = useState("LUNCH");
  const [menuNotes, setMenuNotes] = useState("");
  const [dietaryType, setDietaryType] = useState<string[]>(["Pure Veg"]);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const chefLogsToday = existingLogs.filter((l) => l.role === "chef");

  const toggleDiet = (type: string) => {
    setDietaryType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleMealSubmit = async () => {
    if (!capturedPhoto) {
      alert("Please capture a live photo of the meal spread before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeMeal = MEAL_TYPES.find((m) => m.id === selectedMeal);
      const combinedNotes = `${dietaryType.join(", ")} | Menu: ${menuNotes || "Standard Meal Spread"}`;

      const res = await onSubmitLog({
        category: selectedMeal,
        notes: combinedNotes,
        imageBase64: capturedPhoto,
        villaSlug,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setCapturedPhoto(null);
        setMenuNotes("");
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        alert(res.error || "Failed to log meal spread.");
      }
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMealObj = MEAL_TYPES.find((m) => m.id === selectedMeal) || MEAL_TYPES[1];

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#DAA520] block">
            Chef Culinary Portal
          </span>
          <h2 className="text-xl font-black font-heading text-white">{villaName}</h2>
          <span className="text-xs text-slate-300 font-medium">Logged in: {staffName}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut size={13} />
          <span>Exit</span>
        </button>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Meal Proof Successfully Logged!</h4>
            <p className="text-[11px] text-slate-200 mt-0.5">
              Timestamped photo and menu details have been archived and dispatched.
            </p>
          </div>
        </div>
      )}

      {/* Meal Selection Tabs */}
      <div className="mb-6">
        <label className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block mb-2">
          Select Meal To Log:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MEAL_TYPES.map((meal) => {
            const Icon = meal.icon;
            const isSelected = selectedMeal === meal.id;
            const isAlreadyLogged = chefLogsToday.some((l) => l.category === meal.id);

            return (
              <button
                key={meal.id}
                type="button"
                onClick={() => {
                  setSelectedMeal(meal.id);
                  setCapturedPhoto(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1B3564] border-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.25)]"
                    : "bg-[#0d172e] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon size={16} className={isSelected ? "text-[#DAA520]" : "text-slate-400"} />
                  {isAlreadyLogged && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Already logged today" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-black text-white block">{meal.label}</span>
                  <span className="text-[9px] text-slate-400 block">{meal.time}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu & Dietary Specification Form */}
      <div className="bg-[#0d172e] rounded-3xl p-5 border border-white/10 mb-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <ChefHat size={14} className="text-[#DAA520]" />
              <span>Today&apos;s {activeMealObj.label} Menu Description:</span>
            </label>
          </div>
          <textarea
            rows={2}
            placeholder="e.g. Paneer Butter Masala, Dal Tadka, Jeera Rice, Hot Phulkas, Fresh Salad"
            value={menuNotes}
            onChange={(e) => setMenuNotes(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#DAA520] leading-relaxed"
          />
        </div>

        {/* Dietary Tag Badges */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
            Dietary Category:
          </span>
          <div className="flex flex-wrap gap-2">
            {["Pure Veg", "Non-Veg", "Jain Food", "Live BBQ", "Kids Special"].map((tag) => {
              const active = dietaryType.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDiet(tag)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    active
                      ? "bg-[#DAA520] text-black border-[#DAA520]"
                      : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  {active ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Camera Watermark */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block mb-2">
            Capture Live Dining Table / Buffet Setup:
          </span>
          <CameraWatermark
            roleName="Chef"
            categoryName={`${activeMealObj.label} Meal`}
            villaName={villaName}
            buttonLabel={`Capture ${activeMealObj.label} Photo`}
            onPhotoCaptured={(b64) => setCapturedPhoto(b64)}
            existingPhoto={capturedPhoto}
          />
        </div>

        {/* Submit Meal Proof Button */}
        <button
          type="button"
          onClick={handleMealSubmit}
          disabled={isSubmitting || !capturedPhoto}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={14} className="stroke-[2.5]" />
          <span>{isSubmitting ? "Uploading Meal Proof..." : `Submit ${activeMealObj.label} Proof`}</span>
        </button>
      </div>

      {/* Today's Meals Timeline */}
      {chefLogsToday.length > 0 && (
        <div className="border-t border-white/10 pt-5">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
            Today&apos;s Submitted Meal Proofs:
          </h4>
          <div className="space-y-3">
            {chefLogsToday.map((log) => (
              <div
                key={log.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={log.images[0]}
                    alt={log.category}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-white uppercase">{log.category}</strong>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        Logged
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{log.notes || "Standard Spread"}</p>
                    <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
