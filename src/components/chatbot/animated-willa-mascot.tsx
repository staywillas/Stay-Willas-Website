"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type MascotEmotion = "namaste" | "happy" | "sad" | "thinking" | "idle";

interface AnimatedWillaMascotProps {
  emotion?: MascotEmotion;
  size?: number;
  className?: string;
}

export default function AnimatedWillaMascot({
  emotion = "idle",
  size = 100,
  className = "",
}: AnimatedWillaMascotProps) {
  // Head Motion Parameters per Emotion
  const headRotation = {
    namaste: [0, 2, 0],
    happy: [0, -5, 5, 0],
    sad: 10,
    thinking: -14,
    idle: [0, -3, 3, 0],
  }[emotion];

  const headY = {
    namaste: 3,
    happy: [0, -5, 0],
    sad: 5,
    thinking: -3,
    idle: [0, -3, 0],
  }[emotion];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 120 130"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        initial={false}
        animate={{
          scale: emotion === "happy" ? [1, 1.04, 1] : 1,
        }}
        transition={{
          repeat: emotion === "happy" ? Infinity : 0,
          duration: 1.6,
          ease: "easeInOut",
        }}
      >
        <defs>
          {/* Skin Shading */}
          <linearGradient id="skinBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0E0" />
            <stop offset="60%" stopColor="#FED8B1" />
            <stop offset="100%" stopColor="#F5C296" />
          </linearGradient>

          {/* Hair Color */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A2E1B" />
            <stop offset="100%" stopColor="#2C1A0E" />
          </linearGradient>

          {/* Linen Resort Polo */}
          <linearGradient id="poloGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F4F7FA" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Navy Collar Accent */}
          <linearGradient id="navyCollar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B3564" />
            <stop offset="100%" stopColor="#0F2142" />
          </linearGradient>

          {/* Panama Hat Texture */}
          <linearGradient id="panamaHat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5E1" />
            <stop offset="50%" stopColor="#F7E6C4" />
            <stop offset="100%" stopColor="#EAD29F" />
          </linearGradient>

          {/* Gold Accent */}
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE87C" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>

          {/* Tropical Coconut Drink */}
          <radialGradient id="coconutGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7A5230" />
            <stop offset="70%" stopColor="#4A2F13" />
            <stop offset="100%" stopColor="#2E1B09" />
          </radialGradient>

          {/* Soft Blush */}
          <radialGradient id="softBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
          </radialGradient>

          {/* Tropical Leaf Green */}
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2ECC71" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Grounding Glow Shadow */}
        <ellipse cx="60" cy="122" rx="34" ry="5" fill="#1B3564" opacity="0.12" />

        {/* --- TROPICAL PALM ACCENTS (BACKGROUND) --- */}
        <g id="TropicalPalmBg" opacity="0.85">
          <path
            d="M 8 95 C 2 80, 10 65, 22 60 C 18 72, 16 82, 8 95 Z"
            fill="url(#leafGrad)"
            opacity="0.4"
          />
          <path
            d="M 112 95 C 118 80, 110 65, 98 60 C 102 72, 104 82, 112 95 Z"
            fill="url(#leafGrad)"
            opacity="0.4"
          />
        </g>

        {/* --- BODY & BRANDED LINEN POLO --- */}
        <g id="ResortBodyGroup" filter="url(#softShadow)">
          {/* Main Torso / Polo Shirt */}
          <path
            d="M 32 78 Q 60 72 88 78 L 96 122 Q 60 126 24 122 Z"
            fill="url(#poloGrad)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Navy Blue Lapel & Collar */}
          <path
            d="M 44 76 L 60 92 L 76 76 L 70 76 L 60 86 L 50 76 Z"
            fill="url(#navyCollar)"
          />

          {/* Button Placket */}
          <line x1="60" y1="86" x2="60" y2="108" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="60" cy="94" r="1.2" fill="#DAA520" />
          <circle cx="60" cy="102" r="1.2" fill="#DAA520" />

          {/* STAY WILLAS BRAND EMBLEM ON CHEST */}
          <g id="BrandEmblem" transform="translate(60, 107)">
            {/* Crown Crest */}
            <path
              d="M -5 -8 L 0 -12 L 5 -8 L 3 -4 L -3 -4 Z"
              fill="url(#goldShine)"
            />
            {/* STAY WILLAS Text */}
            <text
              x="0"
              y="1"
              textAnchor="middle"
              fill="#1B3564"
              fontSize="5.2"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.6"
            >
              STAY WILLAS
            </text>
            <text
              x="0"
              y="5.5"
              textAnchor="middle"
              fill="#DAA520"
              fontSize="3.2"
              fontWeight="800"
              fontFamily="sans-serif"
              letterSpacing="0.8"
            >
              LUXURY CONCIERGE
            </text>
          </g>
        </g>

        {/* --- TROPICAL COCONUT DRINK ACCESSORY (HAPPY & IDLE) --- */}
        <AnimatePresence>
          {(emotion === "happy" || emotion === "idle") && (
            <motion.g
              id="TropicalCoconutDrink"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              transform="translate(94, 80)"
            >
              {/* Coconut Body */}
              <circle cx="0" cy="0" r="11" fill="url(#coconutGrad)" stroke="#2E1B09" strokeWidth="1" />
              {/* White Coconut Rim */}
              <ellipse cx="0" cy="-6" rx="9" ry="3.5" fill="#FFFFFF" />
              <ellipse cx="0" cy="-6" rx="7" ry="2.5" fill="#FFF8F0" />

              {/* Red & Yellow Mini Sun Umbrella */}
              <path d="M 2 -7 L 12 -22 L 2 -18 L -8 -22 Z" fill="#EF4444" />
              <path d="M 2 -7 L 7 -22 L 2 -18 L -3 -22 Z" fill="#FFD700" />
              <line x1="2" y1="-7" x2="2" y2="-22" stroke="#DAA520" strokeWidth="1.2" />

              {/* Drinking Straw */}
              <path d="M -3 -6 L -8 -16 L -13 -18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Little Hibiscus Flower */}
              <circle cx="7" cy="-2" r="2.5" fill="#EC4899" />
              <circle cx="7" cy="-2" r="1" fill="#FFD700" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC ARMS & GESTURES --- */}
        <AnimatePresence mode="wait">
          {/* NAMASTE GESTURE: Traditional Folded Hands 🙏 */}
          {emotion === "namaste" && (
            <motion.g
              key="arm-namaste"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left Arm */}
              <path
                d="M 32 80 Q 44 94 56 82"
                stroke="url(#skinBase)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Arm */}
              <path
                d="M 88 80 Q 76 94 64 82"
                stroke="url(#skinBase)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Folded Hands 🙏 */}
              <path
                d="M 54 86 Q 60 70 60 70 Q 60 70 66 86 Z"
                fill="url(#skinBase)"
                stroke="#E5A97D"
                strokeWidth="1.2"
              />
              {/* Golden Sparkle Aura */}
              <motion.circle
                cx="60"
                cy="72"
                r="4"
                fill="#FFD700"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.g>
          )}

          {/* HAPPY GESTURE: Hands up & holding drink */}
          {emotion === "happy" && (
            <motion.g
              key="arm-happy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { repeat: Infinity, duration: 0.6 } }}
            >
              {/* Left Arm Waving Up */}
              <path
                d="M 32 80 Q 18 64 14 50"
                stroke="url(#skinBase)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="14" cy="48" r="5" fill="url(#skinBase)" />

              {/* Right Arm Holding Coconut */}
              <path
                d="M 88 80 Q 94 75 94 80"
                stroke="url(#skinBase)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>
          )}

          {/* SAD / FAREWELL GESTURE: Sorrowful posture & drooping arms */}
          {emotion === "sad" && (
            <motion.g
              key="arm-sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Arm Drooping */}
              <path
                d="M 32 80 Q 24 98 22 110"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="22" cy="111" r="4.5" fill="url(#skinBase)" />

              {/* Right Arm Drooping */}
              <path
                d="M 88 80 Q 96 98 98 110"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="98" cy="111" r="4.5" fill="url(#skinBase)" />
            </motion.g>
          )}

          {/* THINKING GESTURE: Hand on chin pondering */}
          {emotion === "thinking" && (
            <motion.g
              key="arm-thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Arm Resting */}
              <path
                d="M 32 80 Q 24 96 26 108"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Arm to Chin */}
              <path
                d="M 88 80 Q 74 80 66 64"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="65" cy="62" r="5" fill="url(#skinBase)" />

              {/* Animated Pondering Bubbles */}
              <motion.g
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <circle cx="82" cy="40" r="2.5" fill="#DAA520" />
                <circle cx="90" cy="30" r="4" fill="#DAA520" />
                <circle cx="100" cy="20" r="6" fill="#1B3564" />
                <text x="100" y="22" textAnchor="middle" fill="#FFD700" fontSize="6.5" fontWeight="bold">?</text>
              </motion.g>
            </motion.g>
          )}

          {/* IDLE GESTURE: Friendly wave */}
          {emotion === "idle" && (
            <motion.g key="arm-idle">
              {/* Left Arm Resting */}
              <path
                d="M 32 80 Q 24 95 26 106"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Arm Waving */}
              <motion.path
                d="M 88 80 Q 98 70 96 58"
                stroke="url(#skinBase)"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{ originX: "88px", originY: "80px" }}
              />
              <circle cx="96" cy="56" r="4.5" fill="url(#skinBase)" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- HEAD & EXPRESSIONS GROUP --- */}
        <motion.g
          id="ResortHeadGroup"
          animate={{
            rotate: headRotation,
            y: headY,
          }}
          transition={{
            rotate: { duration: 0.5 },
            y: {
              repeat: typeof headY !== "number" ? Infinity : 0,
              duration: 2.8,
              ease: "easeInOut",
            },
          }}
          style={{ originX: "60px", originY: "54px" }}
          filter="url(#softShadow)"
        >
          {/* Neck */}
          <rect x="53" y="60" width="14" height="15" rx="5" fill="url(#skinBase)" />

          {/* Stylish Hair behind head */}
          <path
            d="M 36 48 C 36 28, 84 28, 84 48 L 84 56 L 36 56 Z"
            fill="url(#hairGrad)"
          />

          {/* Head Base */}
          <ellipse cx="60" cy="52" rx="23" ry="22" fill="url(#skinBase)" />

          {/* Ears with depth */}
          <circle cx="36" cy="52" r="5" fill="url(#skinBase)" />
          <circle cx="36" cy="52" r="2.8" fill="#F5C296" />

          <circle cx="84" cy="52" r="5" fill="url(#skinBase)" />
          <circle cx="84" cy="52" r="2.8" fill="#F5C296" />

          {/* Rosy Cheeks */}
          <ellipse cx="44" cy="57" rx="4.5" ry="3" fill="url(#softBlush)" />
          <ellipse cx="76" cy="57" rx="4.5" ry="3" fill="url(#softBlush)" />

          {/* --- EXPRESSIVE EYES --- */}
          <g id="RichEyes">
            {/* NAMASTE or HAPPY EYES: Curved joyful arcs (^ ^) */}
            {(emotion === "namaste" || emotion === "happy") && (
              <>
                <path
                  d="M 44 51 Q 50 43 56 51"
                  stroke="#1B3564"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 64 51 Q 70 43 76 51"
                  stroke="#1B3564"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}

            {/* SAD EYES: Sorrowful eyes with dropping tear */}
            {emotion === "sad" && (
              <>
                {/* Slanted Brows */}
                <path d="M 43 43 L 55 47" stroke="#1B3564" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 77 43 L 65 47" stroke="#1B3564" strokeWidth="2.5" strokeLinecap="round" />

                {/* Sorrowful Pupils */}
                <ellipse cx="49" cy="52" rx="4" ry="4.5" fill="#1B3564" />
                <ellipse cx="71" cy="52" rx="4" ry="4.5" fill="#1B3564" />

                {/* Sparkling Glistening Tear */}
                <motion.path
                  d="M 77 56 Q 79 62 77 65 Q 75 62 77 56 Z"
                  fill="#3B82F6"
                  animate={{ y: [0, 8, 16], opacity: [1, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
              </>
            )}

            {/* THINKING EYES: Looking up-right */}
            {emotion === "thinking" && (
              <>
                <path d="M 43 44 Q 49 40 55 44" stroke="#1B3564" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 65 41 Q 71 37 77 41" stroke="#1B3564" strokeWidth="2.2" strokeLinecap="round" />

                <circle cx="51" cy="49" r="4.2" fill="#1B3564" />
                <circle cx="73" cy="49" r="4.2" fill="#1B3564" />
                <circle cx="53" cy="47" r="1.5" fill="#FFFFFF" />
                <circle cx="75" cy="47" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* IDLE EYES: Open sparkling pupils with double catchlights */}
            {emotion === "idle" && (
              <>
                <ellipse cx="49" cy="51" rx="4.5" ry="4.8" fill="#1B3564" />
                <ellipse cx="71" cy="51" rx="4.5" ry="4.8" fill="#1B3564" />

                {/* Catchlight sparkles */}
                <circle cx="51" cy="49" r="1.6" fill="#FFFFFF" />
                <circle cx="47.5" cy="53" r="0.9" fill="#FFFFFF" />

                <circle cx="73" cy="49" r="1.6" fill="#FFFFFF" />
                <circle cx="69.5" cy="53" r="0.9" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* --- EXPRESSIVE MOUTH --- */}
          <g id="RichMouth">
            {/* NAMASTE or HAPPY MOUTH: Big cheerful open smile */}
            {(emotion === "namaste" || emotion === "happy") && (
              <path
                d="M 48 60 Q 60 74 72 60 Z"
                fill="#E11D48"
                stroke="#9F1239"
                strokeWidth="1.2"
              />
            )}

            {/* SAD MOUTH: Downturned sorrowful pout */}
            {emotion === "sad" && (
              <path
                d="M 50 65 Q 60 58 70 65"
                stroke="#1B3564"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* THINKING MOUTH: Pondering side mouth */}
            {emotion === "thinking" && (
              <path
                d="M 52 62 Q 60 64 68 59"
                stroke="#1B3564"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* IDLE MOUTH: Warm welcoming smile */}
            {emotion === "idle" && (
              <path
                d="M 49 60 Q 60 68 71 60"
                stroke="#1B3564"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* --- DETAILED PANAMA STRAW HAT & SUNGLASSES --- */}
          <g id="PanamaStrawHat">
            {/* Hat Shadow on Head */}
            <ellipse cx="60" cy="36" rx="31" ry="5" fill="#000000" opacity="0.15" />

            {/* Wide Panama Brim */}
            <ellipse cx="60" cy="33" rx="33" ry="7" fill="url(#panamaHat)" stroke="#C7B282" strokeWidth="1.2" />

            {/* Crown Body */}
            <path
              d="M 38 32 C 38 17, 46 14, 60 14 C 74 14, 82 17, 82 32 Z"
              fill="url(#panamaHat)"
              stroke="#C7B282"
              strokeWidth="1.2"
            />

            {/* Crown Top Crease */}
            <path d="M 48 16 Q 60 19 72 16" stroke="#D1B886" strokeWidth="1.5" fill="none" />

            {/* Navy Blue Ribbon */}
            <path
              d="M 38.5 28.5 C 45 26.5, 75 26.5, 81.5 28.5 L 82 32.5 C 75 30.5, 45 30.5, 38 32.5 Z"
              fill="url(#navyCollar)"
            />

            {/* 24K Gold Crest Badge on Ribbon */}
            <circle cx="43" cy="29" r="2.5" fill="url(#goldShine)" stroke="#B8860B" strokeWidth="0.5" />

            {/* COOL RESORT SUNGLASSES (Sitting on Hat Brim) */}
            <g id="CoolSunglassesOnHat" transform="translate(0, -6)">
              {/* Left Lens */}
              <rect x="40" y="36" width="17" height="9" rx="3" fill="#0F172A" opacity="0.9" />
              <rect x="41" y="37" width="6" height="3" rx="1" fill="#FFFFFF" opacity="0.4" />
              {/* Right Lens */}
              <rect x="63" y="36" width="17" height="9" rx="3" fill="#0F172A" opacity="0.9" />
              <rect x="64" y="37" width="6" height="3" rx="1" fill="#FFFFFF" opacity="0.4" />
              {/* Gold Bridge */}
              <line x1="57" y1="39" x2="63" y2="39" stroke="#DAA520" strokeWidth="1.8" />
            </g>
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
