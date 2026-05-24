"use client";

import { useState, useEffect, useCallback } from "react";

const WISHLIST_KEY = "staywillas_wishlist";

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function dispatchWishlistEvent() {
  window.dispatchEvent(new Event("wishlist-updated"));
}

export function useWishlist(villaId?: string) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setWishlist(getWishlist());
    const onUpdate = () => setWishlist(getWishlist());
    window.addEventListener("wishlist-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const isInWishlist = villaId ? wishlist.includes(villaId) : false;

  const addToWishlist = useCallback((id: string) => {
    const current = getWishlist();
    if (!current.includes(id)) {
      const next = [...current, id];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      setWishlist(next);
      dispatchWishlistEvent();
    }
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    const next = getWishlist().filter((v) => v !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    setWishlist(next);
    dispatchWishlistEvent();
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      const current = getWishlist();
      if (current.includes(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist(id);
      }
    },
    [addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    localStorage.removeItem(WISHLIST_KEY);
    setWishlist([]);
    dispatchWishlistEvent();
  }, []);

  return {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    count: wishlist.length,
  };
}
