"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface SaveButtonProps {
  villaId: string;
  villaName: string;
}

export default function SaveButton({ villaId, villaName }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsSaved(wishlist.includes(villaId));
    } catch (e) {
      console.error("Failed to read wishlist from localStorage:", e);
    }
  }, [villaId]);

  const handleToggleSave = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let updatedWishlist = [];
      
      if (wishlist.includes(villaId)) {
        updatedWishlist = wishlist.filter((id: string) => id !== villaId);
        setIsSaved(false);
      } else {
        updatedWishlist = [...wishlist, villaId];
        setIsSaved(true);
      }
      
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      // Dispatch custom event to let navbar know wishlist count changed!
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (e) {
      console.error("Failed to write wishlist to localStorage:", e);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      className={`flex items-center gap-2 transition-all duration-300 text-xs uppercase tracking-widest border px-4 py-2 rounded-full active:scale-95 cursor-pointer relative overflow-hidden group shrink-0 ${
        isSaved 
          ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20" 
          : "border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/50 hover:bg-white/5"
      }`}
      title={isSaved ? `Remove ${villaName} from Wishlist` : `Save ${villaName} to Wishlist`}
    >
      <Heart 
        size={14} 
        className={`transition-all duration-300 ${
          isSaved 
            ? "fill-red-500 text-red-500 scale-110" 
            : "group-hover:scale-110"
        }`} 
      />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
}
