"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/use-wishlist";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistButtonProps {
  villaId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function WishlistButton({ villaId, className, size = "md" }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist(villaId);

  const sizeMap = {
    sm: { icon: 14, btn: "w-7 h-7" },
    md: { icon: 17, btn: "w-9 h-9" },
    lg: { icon: 20, btn: "w-11 h-11" },
  };

  const { icon, btn } = sizeMap[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(villaId);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      aria-label={isInWishlist ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        btn,
        "rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-sm border cursor-pointer",
        isInWishlist
          ? "bg-red-500 border-red-400 shadow-red-200/60 hover:bg-red-600"
          : "bg-white/90 border-white/60 hover:bg-white hover:border-[#DAA520]/40 shadow-black/10",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isInWishlist ? "filled" : "empty"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Heart
            size={icon}
            className={cn(
              "transition-colors duration-200",
              isInWishlist ? "fill-white text-white" : "fill-none text-[#1B3564]/60 hover:text-red-500"
            )}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
