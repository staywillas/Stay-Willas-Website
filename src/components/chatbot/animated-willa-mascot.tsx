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
          {/* Volumetric Skin Gradients */}
          <linearGradient id="realSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2E5" />
            <stop offset="45%" stopColor="#FCD5B5" />
            <stop offset="85%" stopColor="#EBB388" />
            <stop offset="100%" stopColor="#C98B60" />
          </linearGradient>

          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E29F74" opacity="0.6" />
            <stop offset="100%" stopColor="#B36E44" opacity="0.9" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="realHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A3825" />
            <stop offset="50%" stopColor="#3B2214" />
            <stop offset="100%" stopColor="#1C0E07" />
          </linearGradient>

          {/* Hair Highlight */}
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8D5C40" opacity="0" />
            <stop offset="50%" stopColor="#D49B74" opacity="0.5" />
            <stop offset="100%" stopColor="#8D5C40" opacity="0" />
          </linearGradient>

          {/* Iris Gradient */}
          <radialGradient id="irisGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1B3564" />
            <stop offset="100%" stopColor="#0B1936" />
          </radialGradient>

          {/* Linen Shirt Gradient */}
          <linearGradient id="realLinen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Navy Blue Lapel & Accents */}
          <linearGradient id="navySilk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B3564" />
            <stop offset="100%" stopColor="#0A1833" />
          </linearGradient>

          {/* Panama Straw Weave Texture */}
          <linearGradient id="realStraw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="35%" stopColor="#F7E8C9" />
            <stop offset="70%" stopColor="#EAD3A3" />
            <stop offset="100%" stopColor="#CCA86E" />
          </linearGradient>

          {/* 24K Gold Metallic Shine */}
          <linearGradient id="gold24k" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1AA" />
            <stop offset="30%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Tropical Coconut Drink */}
          <radialGradient id="realCoconut" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8A5A36" />
            <stop offset="60%" stopColor="#4E311A" />
            <stop offset="100%" stopColor="#2A170A" />
          </radialGradient>

          {/* Soft Cheek Blush */}
          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
          </radialGradient>

          {/* Sunglasses Reflective Mirror Gradient */}
          <linearGradient id="sunglassMirror" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="30%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Ambient Drop Shadows */}
          <filter id="ambientShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.22" />
          </filter>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grounding Shadow */}
        <ellipse cx="70" cy="142" rx="42" ry="6" fill="#1B3564" opacity="0.16" />

        {/* --- REALISTIC TORSO & RESORT LINEN SHIRT --- */}
        <g id="RealisticBody" filter="url(#ambientShadow)">
          {/* Main Torso */}
          <path
            d="M 36 90 Q 70 82 104 90 L 112 142 Q 70 148 28 142 Z"
            fill="url(#realLinen)"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />

          {/* Chest & Shoulder Seams */}
          <path d="M 36 90 Q 48 102 60 102" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M 104 90 Q 92 102 80 102" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.6" />

          {/* Tailored Navy Collar */}
          <path
            d="M 48 88 L 70 106 L 92 88 L 84 88 L 70 98 L 56 88 Z"
            fill="url(#navySilk)"
          />

          {/* Gold Button Placket & Stitches */}
          <line x1="70" y1="98" x2="70" y2="128" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="70" cy="106" r="1.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.4" />
          <circle cx="70" cy="116" r="1.5" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.4" />

          {/* Chest Pocket */}
          <path d="M 84 105 L 98 105 L 98 120 Q 91 124 84 120 Z" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <path d="M 84 105 L 98 105" stroke="url(#navySilk)" strokeWidth="2" />

          {/* HIGH RESOLUTION STAY WILLAS BRAND LOGO ON CHEST */}
          <g id="BrandLogoOnChest" transform="translate(70, 122)">
            {/* Crown Crest Icon */}
            <path
              d="M -6 -9 L 0 -14 L 6 -9 L 4 -5 L -4 -5 Z"
              fill="url(#gold24k)"
            />
            {/* STAY WILLAS Text */}
            <text
              x="0"
              y="1"
              textAnchor="middle"
              fill="#1B3564"
              fontSize="6"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.8"
            >
              STAY WILLAS
            </text>
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fill="#DAA520"
              fontSize="3.5"
              fontWeight="800"
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              LUXURY CONCIERGE
            </text>
          </g>
        </g>

        {/* --- TROPICAL COCONUT DRINK ACCESSORY (HAPPY & IDLE) --- */}
        <AnimatePresence>
          {(emotion === "happy" || emotion === "idle") && (
            <motion.g
              id="RealisticCoconutDrink"
              initial={{ opacity: 0, scale: 0.5, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              transform="translate(110, 92)"
              filter="url(#ambientShadow)"
            >
              {/* Coconut Shell */}
              <circle cx="0" cy="0" r="13" fill="url(#realCoconut)" stroke="#1C0E07" strokeWidth="1.2" />
              {/* Fibrous Texture */}
              <path d="M -8 -2 Q -4 4 -8 8" stroke="#3B2214" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M 4 -6 Q 8 0 4 6" stroke="#3B2214" strokeWidth="1" fill="none" opacity="0.6" />

              {/* White Creamy Rim */}
              <ellipse cx="0" cy="-7" rx="10.5" ry="4" fill="#FFFFFF" />
              <ellipse cx="0" cy="-7" rx="8.5" ry="3" fill="#FFFBF5" />

              {/* Cocktail Umbrella */}
              <path d="M 2 -8 L 14 -25 L 2 -20 L -9 -25 Z" fill="#EF4444" />
              <path d="M 2 -8 L 8 -25 L 2 -20 L -4 -25 Z" fill="url(#gold24k)" />
              <line x1="2" y1="-8" x2="2" y2="-25" stroke="#DAA520" strokeWidth="1.4" />

              {/* Bended Straw */}
              <path d="M -3 -7 L -9 -19 L -15 -21" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              {/* Hibiscus Flower */}
              <circle cx="8" cy="-3" r="3" fill="#F43F5E" />
              <circle cx="8" cy="-3" r="1.2" fill="url(#gold24k)" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC HANDS & GESTURES --- */}
        <AnimatePresence mode="wait">
          {/* NAMASTE GESTURE: Realistically Folded Hands 🙏 */}
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
                d="M 38 92 Q 52 108 66 94"
                stroke="url(#realSkin)"
                strokeWidth="9.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Arm */}
              <path
                d="M 102 92 Q 88 108 74 94"
                stroke="url(#realSkin)"
                strokeWidth="9.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Folded Hands 🙏 */}
              <path
                d="M 63 98 Q 70 78 70 78 Q 70 78 77 98 Z"
                fill="url(#realSkin)"
                stroke="#D49B74"
                strokeWidth="1.2"
              />
              {/* Folded Fingers Details */}
              <line x1="70" y1="78" x2="70" y2="92" stroke="#C98B60" strokeWidth="1" />

              {/* Radiating Golden Sparkle Aura */}
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

          {/* HAPPY GESTURE: Hands up & Waving */}
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
                d="M 38 92 Q 22 74 16 56"
                stroke="url(#realSkin)"
                strokeWidth="9.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand with Fingers */}
              <circle cx="16" cy="54" r="6" fill="url(#realSkin)" />
              <path d="M 11 50 L 14 44 M 14 48 L 18 42 M 18 49 L 22 44" stroke="#D49B74" strokeWidth="1.5" strokeLinecap="round" />

              {/* Right Arm Holding Drink */}
              <path
                d="M 102 92 Q 108 86 108 92"
                stroke="url(#realSkin)"
                strokeWidth="9.5"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>
          )}

          {/* SAD / FAREWELL GESTURE: Drooping arms & sorrowful posture */}
          {emotion === "sad" && (
            <motion.g
              key="arm-sad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Arm Drooping */}
              <path
                d="M 38 92 Q 28 114 26 128"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="26" cy="130" r="5" fill="url(#realSkin)" />

              {/* Right Arm Drooping */}
              <path
                d="M 102 92 Q 112 114 114 128"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="114" cy="130" r="5" fill="url(#realSkin)" />
            </motion.g>
          )}

          {/* THINKING GESTURE: Hand on Chin Pondering */}
          {emotion === "thinking" && (
            <motion.g
              key="arm-thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Arm Resting */}
              <path
                d="M 38 92 Q 28 112 30 125"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Arm to Chin */}
              <path
                d="M 102 92 Q 86 92 76 74"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="75" cy="72" r="5.5" fill="url(#realSkin)" />

              {/* Floating Glowing Question Bubbles */}
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

          {/* IDLE GESTURE: Warm Wave */}
          {emotion === "idle" && (
            <motion.g key="arm-idle">
              {/* Left Arm Resting */}
              <path
                d="M 38 92 Q 28 110 30 124"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Arm Waving */}
              <motion.path
                d="M 102 92 Q 114 80 112 66"
                stroke="url(#realSkin)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{ originX: "102px", originY: "92px" }}
              />
              <circle cx="112" cy="64" r="5.5" fill="url(#realSkin)" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- HEAD & SCULPTED FACIAL FEATURES --- */}
        <motion.g
          id="RealisticHeadGroup"
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
          filter="url(#ambientShadow)"
        >
          {/* Neck with Shading */}
          <rect x="62" y="68" width="16" height="18" rx="6" fill="url(#realSkin)" />
          <path d="M 62 68 Q 70 78 78 68 Z" fill="url(#skinShadow)" />

          {/* Layered Hair (Back) */}
          <path
            d="M 42 56 C 42 32, 98 32, 98 56 L 98 66 L 42 66 Z"
            fill="url(#realHair)"
          />

          {/* Sculpted Head Base */}
          <path
            d="M 44 56 C 44 42, 52 38, 70 38 C 88 38, 96 42, 96 56 C 96 72, 86 82, 70 82 C 54 82, 44 72, 44 56 Z"
            fill="url(#realSkin)"
          />

          {/* Anatomical Ears with Stud Earring */}
          <g id="Ears">
            <ellipse cx="43" cy="58" rx="4.5" ry="7" fill="url(#realSkin)" />
            <path d="M 43 54 Q 45 58 43 62" stroke="#D49B74" strokeWidth="1" fill="none" />
            <circle cx="43" cy="62" r="1.2" fill="url(#gold24k)" />

            <ellipse cx="97" cy="58" rx="4.5" ry="7" fill="url(#realSkin)" />
            <path d="M 97 54 Q 95 58 97 62" stroke="#D49B74" strokeWidth="1" fill="none" />
            <circle cx="97" cy="62" r="1.2" fill="url(#gold24k)" />
          </g>

          {/* Soft Cheek Blush */}
          <ellipse cx="52" cy="65" rx="5" ry="3.5" fill="url(#cheekBlush)" />
          <ellipse cx="88" cy="65" rx="5" ry="3.5" fill="url(#cheekBlush)" />

          {/* Sculpted Nose Bridge & Nostrils */}
          <path d="M 70 54 Q 72 63 67 66 Q 70 68 73 66" stroke="#D49B74" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* --- REALISTIC EYES EXPRESSIONS --- */}
          <g id="RealisticEyes">
            {/* NAMASTE or HAPPY EYES: Curved Joyful Arcs (^ ^) */}
            {(emotion === "namaste" || emotion === "happy") && (
              <>
                <path
                  d="M 51 57 Q 58 48 65 57"
                  stroke="#1B3564"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 75 57 Q 82 48 89 57"
                  stroke="#1B3564"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}

            {/* SAD EYES: Sorrowful Slanted Eyebrows & Tear Drop */}
            {emotion === "sad" && (
              <>
                <path d="M 50 49 L 63 53" stroke="#3B2214" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 90 49 L 77 53" stroke="#3B2214" strokeWidth="2.5" strokeLinecap="round" />

                <ellipse cx="57" cy="58" rx="4.5" ry="5.2" fill="url(#irisGrad)" />
                <ellipse cx="83" cy="58" rx="4.5" ry="5.2" fill="url(#irisGrad)" />

                {/* Animated Glistening Tear */}
                <motion.path
                  d="M 89 62 Q 91 69 89 73 Q 87 69 89 62 Z"
                  fill="#60A5FA"
                  animate={{ y: [0, 9, 18], opacity: [1, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
              </>
            )}

            {/* THINKING EYES: Pondering Upward Iris */}
            {emotion === "thinking" && (
              <>
                <path d="M 50 49 Q 57 45 64 49" stroke="#3B2214" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 76 46 Q 83 42 90 46" stroke="#3B2214" strokeWidth="2.4" strokeLinecap="round" />

                <circle cx="59" cy="54" r="4.8" fill="url(#irisGrad)" />
                <circle cx="85" cy="54" r="4.8" fill="url(#irisGrad)" />
                <circle cx="61" cy="52" r="1.8" fill="#FFFFFF" />
                <circle cx="87" cy="52" r="1.8" fill="#FFFFFF" />
              </>
            )}

            {/* IDLE EYES: Open Sparkling Iris with Double Catchlights */}
            {emotion === "idle" && (
              <>
                {/* Eyebrows */}
                <path d="M 50 49 Q 57 46 64 49" stroke="#3B2214" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 76 49 Q 83 46 90 49" stroke="#3B2214" strokeWidth="2.4" strokeLinecap="round" />

                <ellipse cx="57" cy="57" rx="5" ry="5.5" fill="url(#irisGrad)" />
                <ellipse cx="83" cy="57" rx="5" ry="5.5" fill="url(#irisGrad)" />

                {/* Catchlight sparkles */}
                <circle cx="59" cy="55" r="1.8" fill="#FFFFFF" />
                <circle cx="55" cy="59" r="1" fill="#FFFFFF" />

                <circle cx="85" cy="55" r="1.8" fill="#FFFFFF" />
                <circle cx="81" cy="59" r="1" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* --- REALISTIC MOUTH EXPRESSIONS --- */}
          <g id="RealisticMouth">
            {/* NAMASTE or HAPPY MOUTH: Big Cheerful Smile */}
            {(emotion === "namaste" || emotion === "happy") && (
              <path
                d="M 56 68 Q 70 82 84 68 Z"
                fill="#E11D48"
                stroke="#9F1239"
                strokeWidth="1.2"
              />
            )}

            {/* SAD MOUTH: Downturned Sorrowful Pout */}
            {emotion === "sad" && (
              <path
                d="M 58 74 Q 70 66 82 74"
                stroke="#1B3564"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* THINKING MOUTH: Side Smirk */}
            {emotion === "thinking" && (
              <path
                d="M 60 70 Q 70 72 80 67"
                stroke="#1B3564"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* IDLE MOUTH: Warm Welcoming Smile */}
            {emotion === "idle" && (
              <path
                d="M 57 68 Q 70 77 83 68"
                stroke="#1B3564"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* --- PANAMA STRAW HAT & SUNGLASSES --- */}
          <g id="RealisticPanamaHat">
            {/* Ambient Hat Shadow */}
            <ellipse cx="70" cy="39" rx="36" ry="6" fill="#000000" opacity="0.18" />

            {/* Wide Woven Panama Brim */}
            <ellipse cx="70" cy="35" rx="38" ry="8" fill="url(#realStraw)" stroke="#C7B282" strokeWidth="1.4" />

            {/* Crown Body */}
            <path
              d="M 44 34 C 44 18, 52 14, 70 14 C 88 14, 96 18, 96 34 Z"
              fill="url(#realStraw)"
              stroke="#C7B282"
              strokeWidth="1.4"
            />

            {/* Crown Center Crease */}
            <path d="M 55 17 Q 70 20 85 17" stroke="#C7A66F" strokeWidth="1.8" fill="none" />

            {/* Silk Navy Hat Ribbon */}
            <path
              d="M 44.5 30 C 52 28, 88 28, 95.5 30 L 96 34 C 88 32, 52 32, 44 34 Z"
              fill="url(#navySilk)"
            />

            {/* 24K Gold Crest Pin on Ribbon */}
            <circle cx="50" cy="31" r="3" fill="url(#gold24k)" stroke="#B8860B" strokeWidth="0.6" />

            {/* COOL RESORT SUNGLASSES (Perched on Hat Brim) */}
            <g id="PerchedSunglasses" transform="translate(0, -6)">
              <rect x="47" y="38" width="20" height="10" rx="3.5" fill="url(#sunglassMirror)" stroke="#1E293B" strokeWidth="0.8" />
              <rect x="49" y="39.5" width="7" height="3" rx="1" fill="#FFFFFF" opacity="0.45" />

              <rect x="73" y="38" width="20" height="10" rx="3.5" fill="url(#sunglassMirror)" stroke="#1E293B" strokeWidth="0.8" />
              <rect x="75" y="39.5" width="7" height="3" rx="1" fill="#FFFFFF" opacity="0.45" />

              <line x1="67" y1="42" x2="73" y2="42" stroke="url(#gold24k)" strokeWidth="2" />
            </g>
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
