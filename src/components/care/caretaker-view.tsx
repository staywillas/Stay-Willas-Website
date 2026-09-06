"use client";

import React, { useState } from "react";
import CameraWatermark from "./camera-watermark";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Waves, BedDouble, Bath, Armchair, Trees, Send, LogOut, Check } from "lucide-react";

interface CaretakerViewProps {
  staffName: string;
  villaName: string;
  villaSlug: string;
  onLogout: () => void;
  onSubmitLog: (data: { category: string; notes?: string; imageBase64: string; villaSlug?: string }) => Promise<{ success: boolean; error?: string }>;
  existingLogs: any[];
}

const CHECKLIST_ITEMS = [
  {
    id: "POOL",
    title: "Swimming Pool",
    desc: "Water is crystal clear, filter is running, pool lights working.",
    icon: Waves,
  },
  {
    id: "BEDROOMS",
    title: "Bedrooms & Linen",
    desc: "Beds neatly made with fresh crisp linen, extra blankets placed, AC operational.",
    icon: BedDouble,
  },
  {
    id: "BATHROOMS",
    title: "Bathrooms & Jacuzzi",
    desc: "Dry sanitised floors, fresh towels & toiletries stocked, clean jacuzzi.",
    icon: Bath,
  },
  {
    id: "LIVING",
    title: "Living Hall & Kitchen",
    desc: "Clean furniture, sanitized countertops, refrigerator cleaned.",
    icon: Armchair,
  },
  {
    id: "OUTDOOR",
    title: "Lawn & Patio",
    desc: "Lawns swept, outdoor deck chairs arranged, ambient lights checked.",
    icon: Trees,
  },
];

export default function CaretakerView({
  staffName,
  villaName,
  villaSlug,
  onLogout,
  onSubmitLog,
  existingLogs = [],
}: CaretakerViewProps) {
  const [capturedPhotos, setCapturedPhotos] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submittedItems, setSubmittedItems] = useState<string[]>(
    existingLogs.filter((l) => l.role === "caretaker").map((l) => l.category)
  );

  const handlePhotoCaptured = (categoryId: string, base64: string) => {
    setCapturedPhotos((prev) => ({ ...prev, [categoryId]: base64 }));
  };

  const handleSubmitItem = async (item: typeof CHECKLIST_ITEMS[0]) => {
    const photo = capturedPhotos[item.id];
    if (!photo) {
      alert(`Please snap a photo for ${item.title} first.`);
      return;
    }

    setSubmittingId(item.id);
    try {
      const res = await onSubmitLog({
        category: item.id,
        notes: notes[item.id] || `${item.title} verified and clean.`,
        imageBase64: photo,
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
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#DAA520] block">
            Caretaker Operations Portal
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

      {/* Target Notice Banner */}
      <div className={`p-4 rounded-2xl border mb-6 ${
        isAllComplete 
          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
          : "bg-[#1B3564]/80 border-[#DAA520]/40 text-white"
      }`}>
        <div className="flex items-start gap-3">
          {isAllComplete ? (
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Clock size={24} className="text-[#DAA520] shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider">
                {isAllComplete ? "🎉 Villa 100% Ready for Guests" : "Pre-Check-in Turnover Checklist"}
              </h4>
              <span className="text-xs font-mono font-bold bg-black/30 px-2.5 py-0.5 rounded-full">
                {verifiedCount}/{CHECKLIST_ITEMS.length} Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isAllComplete
                ? "All 5 areas have been timestamped and verified! Management has received the readiness report."
                : "Please take live photos of all 5 areas before 1:00 PM so management can approve guest check-in."}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/40 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isAllComplete ? "bg-emerald-400" : "bg-[#DAA520]"
            }`}
            style={{ width: `${(verifiedCount / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSubmitted = submittedItems.includes(item.id);
          const hasCaptured = !!capturedPhotos[item.id];
          const isCurrentSubmitting = submittingId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-[#0d172e] rounded-2xl p-4 sm:p-5 border transition-all ${
                isSubmitted
                  ? "border-emerald-500/50 bg-emerald-950/20"
                  : hasCaptured
                  ? "border-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.15)]"
                  : "border-white/10"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSubmitted ? "bg-emerald-500/20 text-emerald-400" : "bg-[#DAA520]/20 text-[#DAA520]"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                </div>

                {/* Badge */}
                {isSubmitted ? (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={11} className="stroke-[3]" />
                    Verified
                  </span>
                ) : (
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0">
                    Pending
                  </span>
                )}
              </div>

              {/* Camera Trigger / Watermarked Preview */}
              <div className="my-3">
                <CameraWatermark
                  roleName="Caretaker"
                  categoryName={item.title}
                  villaName={villaName}
                  buttonLabel={`Capture ${item.title} Photo`}
                  onPhotoCaptured={(b64) => handlePhotoCaptured(item.id, b64)}
                  existingPhoto={capturedPhotos[item.id] || null}
                />
              </div>

              {/* Submit Single Item Button */}
              {!isSubmitted && hasCaptured && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Optional note (e.g. fresh towels placed)"
                    value={notes[item.id] || ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 outline-none focus:border-[#DAA520]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubmitItem(item)}
                    disabled={isCurrentSubmitting}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    <Send size={12} className="stroke-[2.5]" />
                    <span>{isCurrentSubmitting ? "Uploading..." : "Save Proof"}</span>
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
