"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, Utensils, LogOut, Eye, X, Calendar, Filter, Sparkles } from "lucide-react";

interface AdminViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  logs: any[];
}

export default function AdminView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  logs = [],
}: AdminViewProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CARETAKER" | "CHEF">("ALL");
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const caretakerLogs = logs.filter((l) => l.role === "caretaker");
  const chefLogs = logs.filter((l) => l.role === "chef");

  const filteredLogs = logs.filter((l) => {
    if (activeFilter === "CARETAKER") return l.role === "caretaker";
    if (activeFilter === "CHEF") return l.role === "chef";
    return true;
  });

  const isTurnoverDone = caretakerLogs.length >= 4; // Pool, Bedrooms, Bathrooms, Living

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#DAA520]">
              Stay Willas Operations Audit Hub
            </span>
          </div>
          <h2 className="text-2xl font-black font-heading text-white">{villaName}</h2>
          <span className="text-xs text-slate-400">Inspecting Live Property Readiness & Culinary Feeds</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Caretaker Readiness Card */}
        <div className={`p-5 rounded-3xl border flex items-start justify-between ${
          isTurnoverDone
            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
            : "bg-[#122A54]/60 border-[#DAA520]/40 text-white"
        }`}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Check-in Readiness Status
            </span>
            <div className="text-xl font-black text-white font-heading">
              {isTurnoverDone ? "✓ Villa Ready For Guests" : "⏳ Readiness Proof Pending"}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {caretakerLogs.length} verified area photo(s) submitted today
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isTurnoverDone ? "bg-emerald-500/20 text-emerald-400" : "bg-[#DAA520]/20 text-[#DAA520]"
          }`}>
            {isTurnoverDone ? <CheckCircle2 size={22} /> : <Clock size={22} />}
          </div>
        </div>

        {/* Chef Culinary Logs Card */}
        <div className="p-5 rounded-3xl bg-[#0d172e] border border-white/10 text-white flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Culinary Quality Logs
            </span>
            <div className="text-xl font-black text-white font-heading">
              {chefLogs.length} Meal(s) Served Today
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {chefLogs.map((c) => c.category).join(" • ") || "No meal spreads logged yet"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#DAA520]">
            <Utensils size={20} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "ALL" ? "bg-[#DAA520] text-black" : "text-slate-300 hover:text-white"
            }`}
          >
            All Proofs ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("CARETAKER")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "CARETAKER" ? "bg-[#DAA520] text-black" : "text-slate-300 hover:text-white"
            }`}
          >
            Caretaker ({caretakerLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("CHEF")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "CHEF" ? "bg-[#DAA520] text-black" : "text-slate-300 hover:text-white"
            }`}
          >
            Chef Meals ({chefLogs.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredLogs.length} operational record(s)
        </span>
      </div>

      {/* Log Feed Grid */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-[#0d172e] rounded-3xl border border-dashed border-white/15 p-8">
          <Clock size={36} className="text-slate-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">No Submissions Recorded Yet Today</h4>
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

            return (
              <div
                key={log.id}
                className="bg-[#0d172e] rounded-3xl overflow-hidden border border-white/10 hover:border-[#DAA520]/50 transition-all flex flex-col justify-between group shadow-lg"
              >
                {/* Photo with zoom trigger */}
                <div
                  onClick={() => setSelectedImage(log)}
                  className="relative h-48 bg-black cursor-pointer overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={log.images[0]}
                    alt={log.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                    <Eye size={16} />
                    <span>Click to Zoom Watermark</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/15">
                    {log.category}
                  </div>

                  {/* Role Pill */}
                  <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isCaretaker ? "bg-emerald-500 text-black" : "bg-[#DAA520] text-black"
                  }`}>
                    {log.role}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4">
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
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-3xl w-full bg-[#0d172e] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.images[0]}
              alt={selectedImage.category}
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-4 bg-[#122A54] border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <strong className="text-white text-sm block">
                  {selectedImage.category} • {selectedImage.staffName}
                </strong>
                <span className="text-slate-300 font-mono text-[11px]">
                  {new Date(selectedImage.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
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
