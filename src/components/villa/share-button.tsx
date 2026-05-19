"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this luxury villa getaway!",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn("Navigator sharing cancelled/failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
    >
      {copied ? (
        <>
          <Check size={14} className="text-[#FFCC00] animate-bounce" />
          <span className="text-[#FFCC00] font-bold">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={14} className="group-hover:rotate-12 transition-transform duration-300" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
