"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  minimal?: boolean;
}

export default function ShareButton({ minimal = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: typeof document !== "undefined" ? document.title : "",
      text: "Check out this luxury villa getaway!",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
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

  if (minimal) {
    return (
      <button
        onClick={handleShare}
        className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg group shrink-0 relative overflow-hidden"
        title="Share Villa"
      >
        {copied ? (
          <Check size={16} className="text-[#FFCC00] animate-pulse" />
        ) : (
          <Share2 size={16} className="group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-text-primary/60 hover:text-accent-primary transition-all duration-300 text-xs uppercase tracking-widest border border-text-primary/10 px-4 py-2 rounded-full hover:bg-text-primary/5 hover:border-text-primary/30 active:scale-95 cursor-pointer relative overflow-hidden group shrink-0"
    >
      {copied ? (
        <>
          <Check size={14} className="text-[#FFCC00] animate-bounce" />
          <span className="text-text-primary font-bold">Copied!</span>
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
