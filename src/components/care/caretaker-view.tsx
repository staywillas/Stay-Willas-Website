"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { Waves, BedDouble, Bath, Armchair, Wine, Sparkles, Send, LogOut, Check, Globe } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface CaretakerViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  onSubmitLog: (data: { category: string; notes?: string; images: string[]; villaSlug?: string }) => Promise<{ success: boolean; error?: string }>;
  existingLogs: any[];
  lang: CareLanguage;
  onLangChange: (lang: CareLanguage) => void;
}

export default function CaretakerView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  onSubmitLog,
  existingLogs = [],
  lang,
  onLangChange,
}: CaretakerViewProps) {
  const t = translations[lang] || translations.en;

  // The 9 Clean Sections (No subtitles, pure headings)
  const SECTIONS = [
    { id: "POOL", title: t.poolTitle, icon: Waves },
    { id: "BEDROOM_1", title: t.bedroom1Title, icon: BedDouble },
    { id: "BEDROOM_2", title: t.bedroom2Title, icon: BedDouble },
    { id: "BEDROOM_3", title: t.bedroom3Title, icon: BedDouble },
    { id: "BATHROOM_1", title: t.bathroom1Title, icon: Bath },
    { id: "BATHROOM_2", title: t.bathroom2Title, icon: Bath },
    { id: "LIVING", title: t.livingTitle, icon: Armchair },
    { id: "LOUNGE", title: t.loungeTitle, icon: Wine },
    { id: "EXTRA", title: t.extraTitle, icon: Sparkles },
  ];

  const [capturedPhotos, setCapturedPhotos] = useState<Record<string, string[]>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittedItems, setSubmittedItems] = useState<string[]>(
    existingLogs.filter((l) => l.role === "caretaker").map((l) => l.category)
  );

  const handlePhotosChange = (categoryId: string, photos: string[]) => {
    setCapturedPhotos((prev) => ({ ...prev, [categoryId]: photos }));
  };

  const handleSubmitSection = async (section: typeof SECTIONS[0]) => {
    const photos = capturedPhotos[section.id] || [];
    if (photos.length === 0) {
      alert(lang === "hi" ? "कृपया पहले फोटो खींचें।" : lang === "mr" ? "कृपया आधी फोटो काढा." : "Please snap a photo first.");
      return;
    }

    setSubmittingId(section.id);
    try {
      const res = await onSubmitLog({
        category: section.id,
        notes: `${section.title} proof.`,
        images: photos,
        villaSlug,
      });

      if (res.success) {
        setSubmittedItems((prev) => [...prev, section.id]);
      } else {
        alert(res.error || "Failed to submit. Please try again.");
      }
    } catch (err: any) {
      alert("Submission error: " + (err.message || err));
    } finally {
      setSubmittingId(null);
    }
  };

  const completedCount = submittedItems.length;
  const isAllComplete = completedCount >= SECTIONS.length;

  return (
    <div className="w-full max-w-lg mx-auto p-3 sm:p-5 text-white pb-24 select-none">
      {/* Top Bar: Language & Logout */}
      <div className="flex items-center justify-between mb-5 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-md">
        {/* Big 1-Tap Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          <Globe size={15} className="text-[#DAA520] ml-1 mr-0.5" />
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              lang === "en" ? "bg-[#DAA520] text-black shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLangChange("hi")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              lang === "hi" ? "bg-[#DAA520] text-black shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onLangChange("mr")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              lang === "mr" ? "bg-[#DAA520] text-black shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            मराठी
          </button>
        </div>

        {/* Big Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 px-3 py-2 rounded-xl transition-all cursor-pointer font-black"
        >
          <LogOut size={14} />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Header (No Subtitles - Clean Heading Only) */}
      <div className="text-center mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide">
          {villaName}
        </h1>
        {/* Simple Big Counter Pill */}
        <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-sm font-black text-[#DAA520]">
          <span>{completedCount} / {SECTIONS.length} {t.verifiedDone}</span>
        </div>
      </div>

      {/* Big Visual Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6 border border-slate-700">
        <div
          className={`h-full transition-all duration-500 ${
            isAllComplete
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-[#DAA520] to-amber-400"
          }`}
          style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
        />
      </div>

      {/* 9 Clean Cards with Big Headings & White Photo Buttons */}
      <div className="space-y-4">
        {SECTIONS.map((section, idx) => {
          const isSubmitted = submittedItems.includes(section.id);
          const currentPhotos = capturedPhotos[section.id] || [];
          const Icon = section.icon;
          const isCurrentlySubmitting = submittingId === section.id;

          return (
            <div
              key={section.id}
              className={`rounded-3xl p-4 sm:p-5 transition-all border-2 shadow-lg ${
                isSubmitted
                  ? "bg-emerald-950/30 border-emerald-500/70"
                  : currentPhotos.length > 0
                  ? "bg-slate-900 border-[#DAA520]"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {/* Header: Pure Big Heading + Status */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSubmitted
                        ? "bg-emerald-500 text-black"
                        : "bg-[#1B3564] text-[#DAA520]"
                    }`}
                  >
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                    {idx + 1}. {section.title}
                  </h2>
                </div>

                {/* Status Badge */}
                {isSubmitted ? (
                  <div className="bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-md shrink-0">
                    <Check size={14} className="stroke-[3]" />
                    <span>{t.verifiedDone}</span>
                  </div>
                ) : (
                  <div className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                    {t.pending}
                  </div>
                )}
              </div>

              {/* White Camera Trigger Button & Photo Grid */}
              <div className="mt-2">
                <CameraWatermark
                  roleName="Caretaker"
                  categoryName={section.title}
                  villaName={villaName}
                  photos={currentPhotos}
                  onPhotosChange={(photos) => handlePhotosChange(section.id, photos)}
                  lang={lang}
                  maxPhotos={4}
                />
              </div>

              {/* Big Green Send Button (Shows when photo is taken) */}
              {currentPhotos.length > 0 && !isSubmitted && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSubmitSection(section)}
                    disabled={isCurrentlySubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-black py-4 px-5 rounded-2xl text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xl disabled:opacity-50"
                  >
                    {isCurrentlySubmitting ? (
                      <span>{t.submitting}</span>
                    ) : (
                      <>
                        <Send size={18} className="stroke-[2.5]" />
                        <span>
                          {t.submitProof} ({currentPhotos.length})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
