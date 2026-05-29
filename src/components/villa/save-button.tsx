"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface SaveButtonProps {
  villaId: string;
  villaName: string;
  minimal?: boolean;
}

export default function SaveButton({ villaId, villaName, minimal = false }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsSaved(wishlist.includes(villaId));
    } catch {
      // Silently handle localStorage errors
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
    } catch {
      // Silently handle localStorage errors
    }
  };

  if (minimal) {
    return (
      <button
        onClick={handleToggleSave}
        className={`w-9 h-9 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg group shrink-0 relative overflow-hidden ${
          isSaved 
            ? "border-red-500 text-white bg-red-500 hover:bg-red-600 shadow-red-200/50" 
            : "border-white/10 text-white hover:text-red-400 bg-black/60 backdrop-blur-md"
        }`}
        title={isSaved ? `Remove ${villaName} from Wishlist` : `Save ${villaName} to Wishlist`}
      >
        <Heart 
          size={16} 
          className={`transition-all duration-300 ${
            isSaved 
              ? "fill-white text-white scale-110" 
              : "group-hover:scale-110 text-white"
          }`} 
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSave}
      className={`flex items-center gap-2 transition-all duration-300 text-xs uppercase tracking-widest border px-4 py-2 rounded-full active:scale-95 cursor-pointer relative overflow-hidden group shrink-0 ${
        isSaved 
          ? "border-red-500 bg-red-500 text-white hover:bg-red-600 shadow-red-200/50" 
          : "border-text-primary/10 text-text-primary/60 hover:text-red-400 hover:border-red-400/50 hover:bg-text-primary/5"
      }`}
      title={isSaved ? `Remove ${villaName} from Wishlist` : `Save ${villaName} to Wishlist`}
    >
      <Heart 
        size={14} 
        className={`transition-all duration-300 ${
          isSaved 
            ? "fill-white text-white scale-110" 
            : "group-hover:scale-110"
        }`} 
      />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
}
