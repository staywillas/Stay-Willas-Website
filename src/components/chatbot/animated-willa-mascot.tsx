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
  size = 110,
  className = "",
}: AnimatedWillaMascotProps) {
  // Dynamic Head Rotation & Tilt based on emotion
  const headRotation = {
    namaste: [0, 1.5, 0],
    happy: [0, -4, 4, 0],
    sad: 12,
    thinking: -15,
    idle: [0, -2.5, 2.5, 0],
  }[emotion];

  const headY = {
    namaste: 2,
    happy: [0, -5, 0],
    sad: 6,
    thinking: -3,
    idle: [0, -3, 0],
  }[emotion];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 140 150"
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
          {/* Warm Brown Skin Tones */}
          <linearGradient id="warmSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="40%" stopColor="#C4956A" />
            <stop offset="80%" stopColor="#B07D52" />
            <stop offset="100%" stopColor="#8E6340" />
          </linearGradient>

          <linearGradient id="skinShadow2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A07048" opacity="0.6" />
            <stop offset="100%" stopColor="#7A5030" opacity="0.9" />
          </linearGradient>

          {/* Dark Styled Hair with Fade */}
          <linearGradient id="styledHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A2E" />
            <stop offset="50%" stopColor="#0F0F1A" />
            <stop offset="100%" stopColor="#050510" />
          </linearGradient>

          <linearGradient id="hairShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3A3A5C" opacity="0" />
            <stop offset="50%" stopColor="#5A5A8C" opacity="0.5" />
            <stop offset="100%" stopColor="#3A3A5C" opacity="0" />
          </linearGradient>

          {/* Iris Gradient — Deep Warm Brown */}
          <radialGradient id="warmIris" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#6B4226" />
            <stop offset="50%" stopColor="#3D2414" />
            <stop offset="100%" stopColor="#1A0F08" />
          </radialGradient>

          {/* Tropical Linen Shirt — White with Aqua/Teal Accent */}
          <linearGradient id="tropicalLinen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F0FFFE" />
            <stop offset="100%" stopColor="#E0F2F1" />
          </linearGradient>

          {/* Shirt Pattern — Subtle Floral/Leaf Print */}
          <pattern id="tropicalPattern" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(15)">
            <circle cx="4" cy="4" r="1.2" fill="#26A69A" opacity="0.12" />
            <circle cx="12" cy="12" r="1.2" fill="#26A69A" opacity="0.12" />
            <path d="M 8 2 Q 10 6 8 10" stroke="#4DB6AC" strokeWidth="0.5" fill="none" opacity="0.08" />
          </pattern>

          {/* Gold Chain */}
          <linearGradient id="goldChain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="30%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>

          {/* Panama Straw Hat — Lighter, More Vacation */}
          <linearGradient id="vacationStraw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="30%" stopColor="#F5E6C8" />
            <stop offset="70%" stopColor="#E8D4A2" />
            <stop offset="100%" stopColor="#D4BC82" />
          </linearGradient>

          {/* Hat Ribbon — Teal Tropical */}
          <linearGradient id="tealRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00897B" />
            <stop offset="50%" stopColor="#26A69A" />
            <stop offset="100%" stopColor="#00897B" />
          </linearGradient>

          {/* Aviator Sunglasses Gradient */}
          <linearGradient id="aviatorLens" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A2E" />
            <stop offset="25%" stopColor="#2D2D44" />
            <stop offset="50%" stopColor="#0F0F1A" />
            <stop offset="75%" stopColor="#3D3D5C" />
            <stop offset="100%" stopColor="#1A1A2E" />
          </linearGradient>

          {/* Aviator Frame */}
          <linearGradient id="aviatorFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>

          {/* 24K Gold Metallic Shine */}
          <linearGradient id="gold24k" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1AA" />
            <stop offset="30%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Tropical Coconut Drink */}
          <radialGradient id="coconutShell" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8A5A36" />
            <stop offset="60%" stopColor="#4E311A" />
            <stop offset="100%" stopColor="#2A170A" />
          </radialGradient>

          {/* Cheek Warmth */}
          <radialGradient id="warmCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07050" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E07050" stopOpacity="0" />
          </radialGradient>

          {/* Subtle Stubble Pattern */}
          <pattern id="stubblePattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="0.4" fill="#3D2414" opacity="0.15" />
          </pattern>

          {/* Ambient Drop Shadows */}
          <filter id="ambientShadow2" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.22" />
          </filter>

          <filter id="softGlow2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grounding Shadow */}
        <ellipse cx="70" cy="142" rx="42" ry="6" fill="#1B3564" opacity="0.16" />

        {/* --- TORSO & TROPICAL OPEN-COLLAR SHIRT --- */}
        <g id="StylishBody" filter="url(#ambientShadow2)">
          {/* Main Torso */}
          <path
            d="M 36 90 Q 70 82 104 90 L 112 142 Q 70 148 28 142 Z"
            fill="url(#tropicalLinen)"
            stroke="#B2DFDB"
            strokeWidth="1"
          />

          {/* Subtle Tropical Pattern Overlay */}
          <path
            d="M 36 90 Q 70 82 104 90 L 112 142 Q 70 148 28 142 Z"
            fill="url(#tropicalPattern)"
          />

          {/* Open Collar — Relaxed V-Neck showing skin */}
          <path
            d="M 52 88 L 70 110 L 88 88"
            fill="url(#warmSkin)"
            stroke="none"
          />
          {/* Collar Folds */}
          <path
            d="M 52 88 L 62 92 L 70 110 L 58 96 Z"
            fill="url(#tropicalLinen)"
            stroke="#B2DFDB"
            strokeWidth="0.8"
          />
          <path
            d="M 88 88 L 78 92 L 70 110 L 82 96 Z"
            fill="url(#tropicalLinen)"
            stroke="#B2DFDB"
            strokeWidth="0.8"
          />

          {/* Exposed Chest — Warm Skin with Gold Chain */}
          <path
            d="M 60 92 Q 70 108 80 92"
            stroke="url(#goldChain)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Chain Pendant — Small Gold Emblem */}
          <circle cx="70" cy="104" r="2.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.5" />
          <path d="M 68.5 103 L 70 100.5 L 71.5 103" fill="#FFD700" />

          {/* Shirt Seam Lines */}
          <path d="M 36 90 Q 46 100 56 98" stroke="#B2DFDB" strokeWidth="0.8" fill="none" opacity="0.5" />
          <path d="M 104 90 Q 94 100 84 98" stroke="#B2DFDB" strokeWidth="0.8" fill="none" opacity="0.5" />

          {/* Chest Pocket */}
          <path d="M 84 105 L 98 105 L 98 118 Q 91 122 84 118 Z" fill="#F0FFFE" stroke="#B2DFDB" strokeWidth="0.8" />
          <path d="M 84 105 L 98 105" stroke="#26A69A" strokeWidth="1.5" />

          {/* STAY WILLAS Brand Logo On Chest */}
          <g id="BrandLogo" transform="translate(70, 126)">
            <text
              x="0"
              y="1"
              textAnchor="middle"
              fill="#1B3564"
              fontSize="5.5"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.8"
            >
              STAY WILLAS
            </text>
            <text
              x="0"
              y="5.5"
              textAnchor="middle"
              fill="#26A69A"
              fontSize="3"
              fontWeight="800"
              fontFamily="sans-serif"
              letterSpacing="1.2"
            >
              LUXURY CONCIERGE
            </text>
          </g>
        </g>

        {/* --- TROPICAL COCONUT DRINK (HAPPY & IDLE) --- */}
        <AnimatePresence>
          {(emotion === "happy" || emotion === "idle") && (
            <motion.g
              id="CoconutDrink"
              initial={{ opacity: 0, scale: 0.5, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              transform="translate(112, 90)"
              filter="url(#ambientShadow2)"
            >
              {/* Coconut Shell */}
              <circle cx="0" cy="0" r="12" fill="url(#coconutShell)" stroke="#1C0E07" strokeWidth="1" />
              <path d="M -7 -2 Q -3 4 -7 7" stroke="#3B2214" strokeWidth="0.8" fill="none" opacity="0.5" />
              <path d="M 3 -5 Q 7 0 3 5" stroke="#3B2214" strokeWidth="0.8" fill="none" opacity="0.5" />

              {/* White Creamy Rim */}
              <ellipse cx="0" cy="-6" rx="9.5" ry="3.5" fill="#FFFFFF" />
              <ellipse cx="0" cy="-6" rx="7.5" ry="2.5" fill="#FFFBF5" />

              {/* Cocktail Umbrella — Tropical Colors */}
              <path d="M 2 -7 L 12 -22 L 2 -18 L -8 -22 Z" fill="#FF6B6B" />
              <path d="M 2 -7 L 7 -22 L 2 -18 L -3 -22 Z" fill="#FFD700" />
              <line x1="2" y1="-7" x2="2" y2="-22" stroke="#B8860B" strokeWidth="1.2" />

              {/* Straw */}
              <path d="M -2 -6 L -8 -17 L -13 -19" stroke="#26A69A" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              {/* Hibiscus Flower */}
              <circle cx="7" cy="-2" r="2.8" fill="#FF6B6B" />
              <circle cx="7" cy="-2" r="1" fill="#FFD700" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC HANDS & GESTURES --- */}
        <AnimatePresence mode="wait">
          {/* NAMASTE 🙏 */}
          {emotion === "namaste" && (
            <motion.g
              key="arm-namaste"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M 38 92 Q 52 108 66 94" stroke="url(#warmSkin)" strokeWidth="9.5" strokeLinecap="round" fill="none" />
              <path d="M 102 92 Q 88 108 74 94" stroke="url(#warmSkin)" strokeWidth="9.5" strokeLinecap="round" fill="none" />
              <path d="M 63 98 Q 70 78 70 78 Q 70 78 77 98 Z" fill="url(#warmSkin)" stroke="#A07048" strokeWidth="1.2" />
              <line x1="70" y1="78" x2="70" y2="92" stroke="#8E6340" strokeWidth="1" />

              {/* Sparkle Aura */}
              <motion.circle
                cx="70"
                cy="80"
                r="5"
                fill="url(#gold24k)"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.g>
          )}

          {/* HAPPY — Wave + Hold Drink */}
          {emotion === "happy" && (
            <motion.g
              key="arm-happy"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { repeat: Infinity, duration: 0.6 } }}
            >
              <path d="M 38 92 Q 22 74 16 56" stroke="url(#warmSkin)" strokeWidth="9.5" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="54" r="6" fill="url(#warmSkin)" />
              <path d="M 11 50 L 14 44 M 14 48 L 18 42 M 18 49 L 22 44" stroke="#A07048" strokeWidth="1.5" strokeLinecap="round" />

              <path d="M 102 92 Q 108 86 108 92" stroke="url(#warmSkin)" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            </motion.g>
          )}

          {/* SAD — Drooping */}
          {emotion === "sad" && (
            <motion.g
              key="arm-sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path d="M 38 92 Q 28 114 26 128" stroke="url(#warmSkin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx="26" cy="130" r="5" fill="url(#warmSkin)" />
              <path d="M 102 92 Q 112 114 114 128" stroke="url(#warmSkin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx="114" cy="130" r="5" fill="url(#warmSkin)" />
            </motion.g>
          )}

          {/* THINKING — Hand on Chin */}
          {emotion === "thinking" && (
            <motion.g
              key="arm-thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path d="M 38 92 Q 28 112 30 125" stroke="url(#warmSkin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M 102 92 Q 86 92 76 74" stroke="url(#warmSkin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <circle cx="75" cy="72" r="5.5" fill="url(#warmSkin)" />

              {/* Floating Question Bubbles */}
              <motion.g
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <circle cx="96" cy="46" r="3" fill="url(#gold24k)" />
                <circle cx="106" cy="34" r="5" fill="url(#gold24k)" />
                <circle cx="118" cy="22" r="7.5" fill="#1B3564" />
                <text x="118" y="25" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold">?</text>
              </motion.g>
            </motion.g>
          )}

          {/* IDLE — Casual Wave */}
          {emotion === "idle" && (
            <motion.g key="arm-idle">
              <path d="M 38 92 Q 28 110 30 124" stroke="url(#warmSkin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <motion.path
                d="M 102 92 Q 114 80 112 66"
                stroke="url(#warmSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{ originX: "102px", originY: "92px" }}
              />
              <circle cx="112" cy="64" r="5.5" fill="url(#warmSkin)" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- HEAD & FACIAL FEATURES --- */}
        <motion.g
          id="StylishHead"
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
          style={{ originX: "70px", originY: "62px" }}
          filter="url(#ambientShadow2)"
        >
          {/* Neck with Warm Skin */}
          <rect x="62" y="68" width="16" height="18" rx="6" fill="url(#warmSkin)" />
          <path d="M 62 68 Q 70 78 78 68 Z" fill="url(#skinShadow2)" />

          {/* Hair Back Layer */}
          <path
            d="M 42 56 C 42 32, 98 32, 98 56 L 98 66 L 42 66 Z"
            fill="url(#styledHair)"
          />

          {/* Head Shape — Slightly Angular/Chiseled Jawline */}
          <path
            d="M 44 54 C 44 40, 52 36, 70 36 C 88 36, 96 40, 96 54 C 96 68, 88 80, 70 82 C 52 80, 44 68, 44 54 Z"
            fill="url(#warmSkin)"
          />

          {/* Subtle Stubble / Jawline Definition */}
          <path
            d="M 52 70 Q 70 82 88 70"
            fill="url(#stubblePattern)"
            opacity="0.4"
          />

          {/* Jawline Highlight */}
          <path
            d="M 48 66 Q 70 80 92 66"
            stroke="#8E6340"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />

          {/* Ears */}
          <g id="Ears">
            <ellipse cx="43" cy="56" rx="4.5" ry="7" fill="url(#warmSkin)" />
            <path d="M 43 52 Q 45 56 43 60" stroke="#A07048" strokeWidth="1" fill="none" />
            {/* Gold Stud Earring */}
            <circle cx="43" cy="60" r="1.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.4" />

            <ellipse cx="97" cy="56" rx="4.5" ry="7" fill="url(#warmSkin)" />
            <path d="M 97 52 Q 95 56 97 60" stroke="#A07048" strokeWidth="1" fill="none" />
            <circle cx="97" cy="60" r="1.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.4" />
          </g>

          {/* Cheek Warmth */}
          <ellipse cx="52" cy="64" rx="5" ry="3.5" fill="url(#warmCheek)" />
          <ellipse cx="88" cy="64" rx="5" ry="3.5" fill="url(#warmCheek)" />

          {/* Nose — More Defined */}
          <path d="M 70 52 Q 73 62 67 65 Q 70 67 73 65" stroke="#A07048" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* --- EYES --- */}
          <g id="Eyes">
            {/* NAMASTE or HAPPY: Joyful Arcs */}
            {(emotion === "namaste" || emotion === "happy") && (
              <>
                <path d="M 51 55 Q 58 46 65 55" stroke="#1A1A2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                <path d="M 75 55 Q 82 46 89 55" stroke="#1A1A2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* SAD: Sorrowful */}
            {emotion === "sad" && (
              <>
                <path d="M 50 47 L 63 51" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 90 47 L 77 51" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="57" cy="56" rx="4.5" ry="5.2" fill="url(#warmIris)" />
                <ellipse cx="83" cy="56" rx="4.5" ry="5.2" fill="url(#warmIris)" />
                <motion.path
                  d="M 89 60 Q 91 67 89 71 Q 87 67 89 60 Z"
                  fill="#60A5FA"
                  animate={{ y: [0, 9, 18], opacity: [1, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
              </>
            )}

            {/* THINKING: Upward Pondering */}
            {emotion === "thinking" && (
              <>
                <path d="M 50 47 Q 57 43 64 47" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 76 44 Q 83 40 90 44" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="59" cy="52" r="4.8" fill="url(#warmIris)" />
                <circle cx="85" cy="52" r="4.8" fill="url(#warmIris)" />
                <circle cx="61" cy="50" r="1.8" fill="#FFFFFF" />
                <circle cx="87" cy="50" r="1.8" fill="#FFFFFF" />
              </>
            )}

            {/* IDLE: Open Sparkling */}
            {emotion === "idle" && (
              <>
                <path d="M 50 47 Q 57 44 64 47" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 76 47 Q 83 44 90 47" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
                <ellipse cx="57" cy="55" rx="5" ry="5.5" fill="url(#warmIris)" />
                <ellipse cx="83" cy="55" rx="5" ry="5.5" fill="url(#warmIris)" />
                <circle cx="59" cy="53" r="1.8" fill="#FFFFFF" />
                <circle cx="55" cy="57" r="1" fill="#FFFFFF" />
                <circle cx="85" cy="53" r="1.8" fill="#FFFFFF" />
                <circle cx="81" cy="57" r="1" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* --- MOUTH --- */}
          <g id="Mouth">
            {(emotion === "namaste" || emotion === "happy") && (
              <>
                <path d="M 57 67 Q 70 80 83 67 Z" fill="#C0392B" stroke="#922B21" strokeWidth="1" />
                {/* Teeth hint */}
                <path d="M 62 67 L 78 67" stroke="#FFFFFF" strokeWidth="1.5" />
              </>
            )}
            {emotion === "sad" && (
              <path d="M 58 73 Q 70 65 82 73" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}
            {emotion === "thinking" && (
              <path d="M 60 69 Q 70 71 80 66" stroke="#1A1A2E" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            )}
            {emotion === "idle" && (
              <path d="M 57 67 Q 70 76 83 67" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}
          </g>

          {/* --- STYLED HAIR ON TOP (Textured Fade with Volume) --- */}
          <g id="StyledTopHair">
            {/* Main hair mass — Voluminous top with side fade */}
            <path
              d="M 46 48 C 46 30, 56 24, 70 24 C 84 24, 94 30, 94 48 L 96 50 C 96 40, 88 36, 70 36 C 52 36, 44 40, 44 50 Z"
              fill="url(#styledHair)"
            />
            {/* Hair volume/texture on top */}
            <path
              d="M 50 40 C 50 28, 60 22, 72 22 C 84 22, 90 28, 90 38"
              fill="url(#styledHair)"
            />
            {/* Side fade lines */}
            <path d="M 46 50 Q 46 46 48 44" stroke="#1A1A2E" strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M 94 50 Q 94 46 92 44" stroke="#1A1A2E" strokeWidth="1.5" fill="none" opacity="0.4" />

            {/* Hair shine highlight */}
            <path
              d="M 56 28 Q 70 24 84 28"
              stroke="url(#hairShine)"
              strokeWidth="3"
              fill="none"
            />
          </g>

          {/* --- PANAMA HAT — Tilted at Cool Angle --- */}
          <g id="PanamaHat" transform="rotate(-8, 70, 30)">
            {/* Hat shadow on head */}
            <ellipse cx="70" cy="33" rx="36" ry="6" fill="#000000" opacity="0.15" />

            {/* Wide Brim */}
            <ellipse cx="70" cy="30" rx="40" ry="9" fill="url(#vacationStraw)" stroke="#D4BC82" strokeWidth="1.2" />

            {/* Crown */}
            <path
              d="M 44 28 C 44 12, 54 8, 70 8 C 86 8, 96 12, 96 28 Z"
              fill="url(#vacationStraw)"
              stroke="#D4BC82"
              strokeWidth="1.2"
            />

            {/* Crown Crease */}
            <path d="M 55 12 Q 70 15 85 12" stroke="#C7A66F" strokeWidth="1.6" fill="none" />

            {/* Teal Tropical Ribbon */}
            <path
              d="M 44.5 24 C 52 22, 88 22, 95.5 24 L 96 28 C 88 26, 52 26, 44 28 Z"
              fill="url(#tealRibbon)"
            />

            {/* Small Gold Pin on Ribbon */}
            <circle cx="52" cy="25" r="2.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.5" />

            {/* Small Tropical Flower on Hat */}
            <g transform="translate(90, 22)">
              <circle cx="0" cy="0" r="3.5" fill="#FF6B6B" />
              <circle cx="0" cy="-3" r="2" fill="#FF8A80" />
              <circle cx="2.5" cy="-1" r="2" fill="#FF8A80" />
              <circle cx="-2.5" cy="-1" r="2" fill="#FF8A80" />
              <circle cx="0" cy="0" r="1.5" fill="#FFD700" />
            </g>
          </g>

          {/* --- AVIATOR SUNGLASSES (Pushed Up on Forehead) --- */}
          <g id="AviatorSunglasses" transform="translate(0, -10)">
            {/* Left Lens — Teardrop Aviator Shape */}
            <path
              d="M 47 40 Q 47 36 52 35 L 62 35 Q 67 36 67 40 Q 67 48 57 50 Q 47 48 47 40 Z"
              fill="url(#aviatorLens)"
              stroke="url(#aviatorFrame)"
              strokeWidth="1.2"
            />
            {/* Lens Reflection */}
            <path d="M 50 37 Q 54 36 58 37" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.35" />

            {/* Right Lens */}
            <path
              d="M 73 40 Q 73 36 78 35 L 88 35 Q 93 36 93 40 Q 93 48 83 50 Q 73 48 73 40 Z"
              fill="url(#aviatorLens)"
              stroke="url(#aviatorFrame)"
              strokeWidth="1.2"
            />
            <path d="M 76 37 Q 80 36 84 37" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.35" />

            {/* Bridge */}
            <path d="M 67 38 Q 70 36 73 38" stroke="url(#aviatorFrame)" strokeWidth="1.8" fill="none" />
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
