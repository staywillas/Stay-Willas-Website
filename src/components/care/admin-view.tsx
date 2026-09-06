"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Clock, Utensils, LogOut, Eye, X, Globe, Images } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface AdminViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  logs: any[];
  lang: CareLanguage;
  onLangChange: (lang: CareLanguage) => void;
}

export default function AdminView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  logs = [],
  lang,
  onLangChange,
}: AdminViewProps) {
  const t = translations[lang] || translations.en;
  
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CARETAKER" | "CHEF">("ALL");
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; log: any } | null>(null);

  const caretakerLogs = logs.filter((l) => l.role === "caretaker");
  const chefLogs = logs.filter((l) => l.role === "chef");

  const filteredLogs = logs.filter((l) => {
    if (activeFilter === "CARETAKER") return l.role === "caretaker";
    if (activeFilter === "CHEF") return l.role === "chef";
    return true;
  });

  const isTurnoverDone = caretakerLogs.length >= 5;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 text-slate-100">
      {/* Top Header & Language Switcher */}
      <div className="flex items-center justify-between mb-5 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-md flex-wrap gap-2">
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

        {/* Exit Admin Button */}
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
      <div className="text-center mb-6">
        <span className="text-[10px] uppercase tracking-widest text-[#DAA520] font-black block">
          {t.adminSubtitle}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
          {villaName}
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          {t.adminTitle}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {/* Caretaker Readiness Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between shadow-md ${
            isTurnoverDone
              ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
              : "bg-[#122A54]/60 border-[#DAA520]/40 text-white"
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Check-in Readiness Status
            </span>
            <div className="text-lg sm:text-xl font-black text-white font-heading">
              {isTurnoverDone ? "✓ Property Ready for Guests" : "⏳ Pre-Checkin Turnover In Progress"}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {caretakerLogs.length} area(s) verified today
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isTurnoverDone ? "bg-emerald-500/20 text-emerald-400" : "bg-[#DAA520]/20 text-[#DAA520]"
            }`}
          >
            {isTurnoverDone ? <CheckCircle2 size={22} /> : <Clock size={22} />}
          </div>
        </div>

        {/* Chef Culinary Logs Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-start justify-between shadow-md">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Kitchen & Culinary Quality
            </span>
            <div className="text-lg sm:text-xl font-black text-white font-heading">
              {chefLogs.length} Meal(s) Served Today
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {chefLogs.map((c) => c.category).join(" • ") || "No meal spreads logged yet"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[#DAA520] shrink-0">
            <Utensils size={20} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "ALL" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300 hover:text-white"
            }`}
          >
            {t.filterAll} ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("CARETAKER")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "CARETAKER" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300 hover:text-white"
            }`}
          >
            {t.filterCaretaker} ({caretakerLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("CHEF")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "CHEF" ? "bg-[#DAA520] text-[#1B3564]" : "text-slate-300 hover:text-white"
            }`}
          >
            {t.filterChef} ({chefLogs.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filteredLogs.length} Records
        </span>
      </div>

      {/* Log Feed Grid */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-14 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800 p-6">
          <Clock size={32} className="text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.noLogsToday}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Staff logs will appear here live with verified timestamps as soon as the Caretaker or Chef snaps proof.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLogs.map((log) => {
            const isCaretaker = log.role === "caretaker";
            const timeFormatted = new Date(log.timestamp).toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
            const photosList: string[] = log.images && log.images.length > 0 ? log.images : [];

            return (
              <div
                key={log.id}
                className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#DAA520]/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                {/* Main Photo with zoom trigger */}
                <div
                  onClick={() => photosList[0] && setSelectedPhoto({ url: photosList[0], log })}
                  className="relative h-48 bg-black cursor-pointer overflow-hidden"
                >
                  {photosList[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photosList[0]}
                      alt={log.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <Eye size={16} />
                    <span>Zoom Watermark</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/10">
                    {log.category}
                  </div>

                  {/* Role Pill */}
                  <div
                    className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isCaretaker ? "bg-emerald-500 text-black" : "bg-[#DAA520] text-black"
                    }`}
                  >
                    {log.role}
                  </div>

                  {/* Multiple Photos Indicator */}
                  {photosList.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20">
                      <Images size={11} />
                      <span>+{photosList.length - 1} more</span>
                    </div>
                  )}
                </div>

                {/* Secondary Photos Strip (if multiple photos exist) */}
                {photosList.length > 1 && (
                  <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-t border-slate-800 overflow-x-auto">
                    {photosList.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPhoto({ url: imgUrl, log })}
                        className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 cursor-pointer shrink-0 hover:border-[#DAA520]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Details Footer */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200">{log.staffName}</span>
                    <span className="font-mono text-[#DAA520] font-bold">{timeFormatted} IST</span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 italic">
                      &quot;{log.notes}&quot;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for Inspecting Watermark */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.url}
              alt="Inspected Watermark"
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <strong className="text-white text-sm block">
                  {selectedPhoto.log.category} • {selectedPhoto.log.staffName}
                </strong>
                <span className="text-slate-400 font-mono text-[11px]">
                  {new Date(selectedPhoto.log.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                </span>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Verified Real-Time Proof
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
