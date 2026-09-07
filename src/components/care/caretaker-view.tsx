"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { CheckCircle2, Waves, BedDouble, Bath, Armchair, Wine, Sparkles, Send, LogOut, Check, Globe } from "lucide-react";
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

  // The 9 Clean & Simple Sections
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
        notes: `${section.title} proof verified.`,
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
    <div className="w-full max-w-lg mx-auto p-3 sm:p-5 text-slate-100 pb-20">
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

      {/* Villa Name & Title */}
      <div className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
          {villaName}
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          {t.caretakerTitle} ({completedCount} / {SECTIONS.length})
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-5 border border-slate-700">
        <div
          className={`h-full transition-all duration-500 ${
            isAllComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-[#DAA520] to-amber-500"
          }`}
          style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
        />
      </div>

      {/* 9 Simple Clean Cards */}
      <div className="space-y-3">
        {SECTIONS.map((section, idx) => {
          const isSubmitted = submittedItems.includes(section.id);
          const currentPhotos = capturedPhotos[section.id] || [];
          const Icon = section.icon;
          const isCurrentlySubmitting = submittingId === section.id;

          return (
            <div
              key={section.id}
              className={`rounded-2xl p-3.5 sm:p-4 transition-all border shadow-md ${
                isSubmitted
                  ? "bg-emerald-950/20 border-emerald-500/40"
                  : currentPhotos.length > 0
                  ? "bg-slate-900 border-[#DAA520]/70"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {/* Top Row: Title + Status */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSubmitted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-[#1B3564] text-[#DAA520]"
                    }`}
                  >
                    <Icon size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">
                      {idx + 1}. {section.title}
                    </h2>
                  </div>
                </div>

                {/* Status Pill */}
                {isSubmitted ? (
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                    <Check size={11} className="stroke-[3]" />
                    <span>{t.verifiedDone}</span>
                  </div>
                ) : (
                  <div className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {t.pending}
                  </div>
                )}
              </div>

              {/* Camera Trigger & Photos */}
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

              {/* One-Tap Big Submit Button when photo is clicked */}
              {currentPhotos.length > 0 && !isSubmitted && (
                <div className="mt-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSubmitSection(section)}
                    disabled={isCurrentlySubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isCurrentlySubmitting ? (
                      <span>{t.submitting}</span>
                    ) : (
                      <>
                        <Send size={13} />
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
