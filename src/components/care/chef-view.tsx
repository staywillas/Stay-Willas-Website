"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { UtensilsCrossed, Coffee, Sun, Sunset, Moon, Send, LogOut, Check, Sparkles, Globe } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface ChefViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  onSubmitLog: (data: { category: string; notes?: string; images: string[]; villaSlug?: string }) => Promise<{ success: boolean; error?: string }>;
  existingLogs: any[];
  lang: CareLanguage;
  onLangChange: (lang: CareLanguage) => void;
}

export default function ChefView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  onSubmitLog,
  existingLogs = [],
  lang,
  onLangChange,
}: ChefViewProps) {
  const t = translations[lang] || translations.en;

  const MEAL_TYPES = [
    { id: "BREAKFAST", label: t.breakfast, icon: Coffee, time: "8:30 AM - 10:30 AM" },
    { id: "LUNCH", label: t.lunch, icon: Sun, time: "1:00 PM - 3:00 PM" },
    { id: "HI_TEA", label: t.highTea, icon: Sunset, time: "5:00 PM - 6:30 PM" },
    { id: "DINNER", label: t.dinner, icon: Moon, time: "8:30 PM - 10:30 PM" },
  ];

  const DIETARY_OPTIONS = [
    { id: "veg", label: t.pureVeg, color: "border-emerald-500 text-emerald-400 bg-emerald-500/10" },
    { id: "nonveg", label: t.nonVeg, color: "border-amber-500 text-amber-400 bg-amber-500/10" },
    { id: "jain", label: t.jain, color: "border-teal-500 text-teal-400 bg-teal-500/10" },
    { id: "kids", label: t.kids, color: "border-purple-500 text-purple-400 bg-purple-500/10" },
  ];

  const [selectedMeal, setSelectedMeal] = useState<string>("LUNCH");
  const [photos, setPhotos] = useState<string[]>([]);
  const [menuNotes, setMenuNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["veg"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>(
    existingLogs.filter((l) => l.role === "chef")
  );

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleMealSubmit = async () => {
    if (photos.length === 0) {
      alert(lang === "hi" ? "कृपया पहले खाने की कम से कम एक लाइव फोटो खींचें।" : lang === "mr" ? "कृपया आधी जेवणाचा किमान एक थेट फोटो काढा." : "Please snap at least one live food photo first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeMeal = MEAL_TYPES.find((m) => m.id === selectedMeal);
      const tagsText = selectedTags.length > 0 ? `[Tags: ${selectedTags.join(", ")}] ` : "";
      const fullNotes = `${tagsText}${menuNotes || `${activeMeal?.label} prepared and served to guests.`}`;

      const res = await onSubmitLog({
        category: selectedMeal,
        notes: fullNotes,
        images: photos,
        villaSlug,
      });

      if (res.success) {
        setRecentLogs((prev) => [
          {
            id: Date.now().toString(),
            category: selectedMeal,
            notes: fullNotes,
            images: photos,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
        setPhotos([]);
        setMenuNotes("");
        alert(t.submitSuccess);
      } else {
        alert(res.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeMealObj = MEAL_TYPES.find((m) => m.id === selectedMeal);

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-5 text-slate-100">
      {/* Top Header & Language Switcher */}
      <div className="flex items-center justify-between mb-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-md">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <Globe size={13} className="text-[#DAA520] ml-1 mr-0.5" />
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === "en" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLangChange("hi")}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === "hi" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300"
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onLangChange("mr")}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              lang === "mr" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300"
            }`}
          >
            मराठी
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold"
        >
          <LogOut size={13} />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-5">
        <span className="text-[10px] uppercase tracking-widest text-[#DAA520] font-black block">
          {t.staffPortal} • {staffName}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
          {t.chefTitle}
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1">
          {t.chefSubtitle}
        </p>
      </div>

      {/* Meal Category Selector Grid */}
      <div className="mb-5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
          {t.selectMeal}
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {MEAL_TYPES.map((meal) => {
            const isSelected = selectedMeal === meal.id;
            const Icon = meal.icon;
            return (
              <button
                key={meal.id}
                type="button"
                onClick={() => setSelectedMeal(meal.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? "bg-[#1B3564] border-[#DAA520] text-white shadow-[0_4px_20px_rgba(218,165,32,0.2)] scale-[1.02]"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-[#DAA520] text-[#1B3564]" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black block">{meal.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {meal.time}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Submission Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 mb-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-[#DAA520]" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {activeMealObj?.label} Spread Proof
            </span>
          </div>
          <span className="text-[11px] text-[#DAA520] font-mono font-bold">
            {activeMealObj?.time}
          </span>
        </div>

        {/* Camera Live Snap Area (Multi-Photo) */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            📸 Live Photos of Buffet & Cooking Station ({photos.length} added)
          </label>
          <CameraWatermark
            roleName="Chef"
            categoryName={activeMealObj?.label || "Meal Spread"}
            villaName={villaName}
            photos={photos}
            onPhotosChange={setPhotos}
            lang={lang}
            maxPhotos={6}
          />
        </div>

        {/* Dietary Highlights Tags */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            {t.dietaryBadges}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected ? tag.color : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {isSelected && "✓ "}
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Notes Input */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">
            {t.menuNotesPlaceholder}
          </label>
          <textarea
            value={menuNotes}
            onChange={(e) => setMenuNotes(e.target.value)}
            rows={2}
            placeholder={t.menuNotesPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DAA520] transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleMealSubmit}
          disabled={isSubmitting || photos.length === 0}
          className="w-full bg-[#DAA520] hover:bg-[#c5961d] active:scale-98 text-[#1B3564] font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span>{t.submitting}</span>
          ) : (
            <>
              <Send size={15} className="stroke-[2.5]" />
              <span>
                {t.submitProof} ({photos.length} {t.photosTaken})
              </span>
            </>
          )}
        </button>
      </div>

      {/* Today's Logged Meals History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {t.todaysMeals} ({recentLogs.length})
        </h3>
        {recentLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400">
            {t.noMealsYet}
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentLogs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3">
                  {log.images && log.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={log.images[0]}
                      alt="Meal Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-emerald-500/40"
                    />
                  )}
                  <div>
                    <span className="text-xs font-black text-white block">
                      {log.category}
                    </span>
                    <span className="text-[10px] text-slate-300 block line-clamp-1">
                      {log.notes || "Meal verified."}
                    </span>
                    <span className="text-[9px] text-[#DAA520] font-mono block mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ✓ {log.images?.length || 1} Photos
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
