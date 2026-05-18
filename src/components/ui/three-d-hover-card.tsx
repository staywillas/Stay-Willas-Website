"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDHoverCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;      // Maximum tilt angle in degrees (default: 10)
  scale?: number;        // Scale on hover (default: 1.03)
  lift?: number;         // Y-translation on hover (default: -10)
  glareOpacity?: number; // Maximum opacity of glare/reflection (default: 0.4)
}

export default function ThreeDHoverCard({
  children,
  className,
  scale = 1.02,
  lift = -8,
}: ThreeDHoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative w-full h-full cursor-pointer select-none", className)}
    >
      <motion.div
        animate={{
          y: hovered ? lift : 0,
          scale: hovered ? scale : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className="relative w-full h-full rounded-[inherit] overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: hovered 
            ? "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 35px 0px rgba(197, 160, 89, 0.12)" 
            : "0 10px 20px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Child Content */}
        <div 
          className="w-full h-full rounded-[inherit] overflow-hidden"
          style={{ transform: "translateZ(0px)" }} // Safari clipping bug fix
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
