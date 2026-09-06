"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { CheckCircle2, Waves, BedDouble, Bath, Armchair, Trees, Send, LogOut, Check, Globe } from "lucide-react";
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

  const CHECKLIST_ITEMS = [
    {
      id: "POOL",
      title: t.poolTitle,
      desc: t.poolDesc,
      icon: Waves,
    },
    {
      id: "BEDROOMS",
      title: t.bedroomsTitle,
      desc: t.bedroomsDesc,
      icon: BedDouble,
    },
    {
      id: "BATHROOMS",
      title: t.bathroomsTitle,
      desc: t.bathroomsDesc,
      icon: Bath,
    },
    {
      id: "LIVING",
      title: t.livingTitle,
      desc: t.livingDesc,
      icon: Armchair,
    },
    {
      id: "OUTDOOR",
      title: t.lawnTitle,
      desc: t.lawnDesc,
      icon: Trees,
    },
  ];

  const [capturedPhotos, setCapturedPhotos] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittedItems, setSubmittedItems] = useState<string[]>(
    existingLogs.filter((l) => l.role === "caretaker").map((l) => l.category)
  );

  const handlePhotosChange = (categoryId: string, photos: string[]) => {
    setCapturedPhotos((prev) => ({ ...prev, [categoryId]: photos }));
  };

  const handleSubmitItem = async (item: typeof CHECKLIST_ITEMS[0]) => {
    const photos = capturedPhotos[item.id] || [];
    if (photos.length === 0) {
      alert(lang === "hi" ? "कृपया पहले कम से कम एक लाइव फोटो खींचें।" : lang === "mr" ? "कृपया आधी किमान एक थेट फोटो काढा." : "Please snap at least one live photo first.");
      return;
    }

    setSubmittingId(item.id);
    try {
      const res = await onSubmitLog({
        category: item.id,
        notes: notes[item.id] || `${item.title} verified and clean.`,
        images: photos,
        villaSlug,
      });

      if (res.success) {
        setSubmittedItems((prev) => [...prev, item.id]);
      } else {
        alert(res.error || "Failed to submit proof. Please try again.");
      }
    } catch (err: any) {
      alert("Submission error: " + (err.message || err));
    } finally {
      setSubmittingId(null);
    }
  };

  const verifiedCount = submittedItems.length;
  const isAllComplete = verifiedCount >= CHECKLIST_ITEMS.length;

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

      {/* Villa Name & Title */}
      <div className="text-center mb-5">
        <span className="text-[10px] uppercase tracking-widest text-[#DAA520] font-black block">
          {t.staffPortal} • {staffName}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
          {t.caretakerTitle}
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1">
          {t.caretakerSubtitle}
        </p>
      </div>

      {/* Visual Progress Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-6 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-300">
            {t.progress}: {verifiedCount} / {CHECKLIST_ITEMS.length}
          </span>
          <span className={isAllComplete ? "text-emerald-400" : "text-[#DAA520]"}>
            {Math.round((verifiedCount / CHECKLIST_ITEMS.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAllComplete
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                : "bg-gradient-to-r from-[#DAA520] to-amber-500"
            }`}
            style={{ width: `${(verifiedCount / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>
        {isAllComplete && (
          <div className="mt-3 p-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>{t.allComplete}</span>
          </div>
        )}
      </div>

      {/* 5 Checklist Items Cards */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => {
          const isSubmitted = submittedItems.includes(item.id);
          const currentPhotos = capturedPhotos[item.id] || [];
          const Icon = item.icon;
          const isCurrentlySubmitting = submittingId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-4 sm:p-5 transition-all shadow-md border ${
                isSubmitted
                  ? "bg-emerald-950/20 border-emerald-500/50"
                  : currentPhotos.length > 0
                  ? "bg-slate-900 border-[#DAA520]/60 shadow-[0_4px_20px_rgba(218,165,32,0.1)]"
                  : "bg-slate-900/80 border-slate-800"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSubmitted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-[#1B3564]/80 text-[#DAA520]"
                    }`}
                  >
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isSubmitted ? (
                    <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Check size={12} className="stroke-[3]" />
                      <span>{t.verifiedDone}</span>
                    </div>
                  ) : (
                    <div className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {t.pending}
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Multi-Photo Upload Area */}
              <div className="mt-3">
                <CameraWatermark
                  roleName="Caretaker"
                  categoryName={item.title}
                  villaName={villaName}
                  photos={currentPhotos}
                  onPhotosChange={(photos) => handlePhotosChange(item.id, photos)}
                  lang={lang}
                  maxPhotos={5}
                />
              </div>

              {/* Notes & Submit Button */}
              {currentPhotos.length > 0 && !isSubmitted && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                  <input
                    type="text"
                    value={notes[item.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                    placeholder={t.notesPlaceholder}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#DAA520]"
                  />

                  <button
                    type="button"
                    onClick={() => handleSubmitItem(item)}
                    disabled={isCurrentlySubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isCurrentlySubmitting ? (
                      <span>{t.submitting}</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>{t.submitProof} ({currentPhotos.length} {t.photosTaken})</span>
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
