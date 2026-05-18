"use client";

import React from "react";

// 1. Infinity Pool Waves Icon
export const AnimatedPoolIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <style>{`
        .pool-wave-1 {
          animation: pool-wave-anim-1 3s ease-in-out infinite;
        }
        .pool-wave-2 {
          animation: pool-wave-anim-2 2.5s ease-in-out infinite;
        }
        .pool-wave-3 {
          animation: pool-wave-anim-3 3.5s ease-in-out infinite;
        }
        @keyframes pool-wave-anim-1 {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(1px) scaleY(0.9); }
        }
        @keyframes pool-wave-anim-2 {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-1.2px) scaleY(1.05); }
        }
        @keyframes pool-wave-anim-3 {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(0.8px) scaleY(0.95); }
        }
      `}</style>
      
      {/* Pool ladder */}
      <path d="M2 4v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4" />
      <path d="M17 4v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4" />
      <path d="M2 8h4" />
      <path d="M18 8h4" />
      
      {/* Dynamic Wave Lines */}
      <path className="pool-wave-1" d="M2 14c2-1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="#c5a059" />
      <path className="pool-wave-2" d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
      <path className="pool-wave-3" d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="#c5a059" />
    </svg>
  );
};

// 2. Bonfire Flicker Icon
export const AnimatedBonfireIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <style>{`
        .fire-flame-main {
          animation: flame-flicker 1.8s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .fire-flame-side {
          animation: flame-flicker-side 2.2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .fire-flame-inner {
          animation: flame-flicker-inner 1.2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.95; }
          33% { transform: scaleY(1.15) scaleX(0.92) skewX(-2deg); opacity: 1; filter: drop-shadow(0 0 2px #ff8c00); }
          66% { transform: scaleY(0.9) scaleX(1.08) skewX(2deg); opacity: 0.9; }
        }
        @keyframes flame-flicker-side {
          0%, 100% { transform: scaleY(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scaleY(1.1) rotate(5deg) scaleX(0.95); opacity: 0.95; }
        }
        @keyframes flame-flicker-inner {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(0.85) translateY(0.5px); opacity: 0.8; }
        }
      `}</style>
      
      {/* Wood Logs */}
      <path d="M5 20l14-4M19 20L5 16" stroke="#444" />
      <path d="M12 18v2" stroke="#444" />
      
      {/* Outer flame */}
      <path
        className="fire-flame-main"
        d="M12 2C8.5 7 7.5 10.5 7.5 14a4.5 4.5 0 0 0 9 0C16.5 10.5 15.5 7 12 2z"
        fill="rgba(197, 160, 89, 0.15)"
        stroke="#c5a059"
      />
      
      {/* Side spurts */}
      <path
        className="fire-flame-side"
        d="M9.5 8.5C8.5 11 8.5 13 8.5 14.5a3.5 3.5 0 0 0 7 0c0-1.5 0-3.5-1-6"
        fill="rgba(255, 140, 0, 0.05)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Core flame */}
      <path
        className="fire-flame-inner"
        d="M12 7c-1.5 2.5-2 4.5-2 6.5a2 2 0 0 0 4 0c0-2-.5-4-2-6.5z"
        fill="rgba(255, 215, 0, 0.3)"
        stroke="#ffd700"
        strokeWidth="1.5"
      />
    </svg>
  );
};

// 3. Chef Steam Icon
export const AnimatedChefIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <style>{`
        .chef-steam-1 {
          animation: steam-float 2.2s ease-in-out infinite;
          opacity: 0;
        }
        .chef-steam-2 {
          animation: steam-float 2.2s ease-in-out infinite 0.7s;
          opacity: 0;
        }
        .chef-steam-3 {
          animation: steam-float 2.2s ease-in-out infinite 1.4s;
          opacity: 0;
        }
        @keyframes steam-float {
          0% { transform: translateY(2px) scaleX(0.8); opacity: 0; }
          20% { opacity: 0.75; }
          60% { transform: translateY(-4px) scaleX(1.1); opacity: 0.4; }
          100% { transform: translateY(-9px) scaleX(0.7); opacity: 0; }
        }
      `}</style>
      
      {/* Plate */}
      <path d="M3 18h18" />
      <path d="M5 21h14" strokeWidth="1.5" />
      
      {/* Covered Cloche (Food Cover Dome) */}
      <path d="M12 6a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" fill="rgba(197, 160, 89, 0.05)" />
      
      {/* Handle */}
      <path d="M12 3v3" strokeWidth="3" />
      
      {/* Steam Trails */}
      <path className="chef-steam-1" d="M9 2a1.5 1.5 0 0 1 0-3" stroke="#c5a059" strokeWidth="1.5" />
      <path className="chef-steam-2" d="M12 1.5a1.5 1.5 0 0 1 0-3" stroke="#c5a059" strokeWidth="1.5" />
      <path className="chef-steam-3" d="M15 2a1.5 1.5 0 0 1 0-3" stroke="#c5a059" strokeWidth="1.5" />
    </svg>
  );
};

// 4. Mountain Clouds Icon
export const AnimatedMountainIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <style>{`
        .mtn-cloud-left {
          animation: cloud-drift-left 14s linear infinite;
        }
        .mtn-cloud-right {
          animation: cloud-drift-right 12s linear infinite;
        }
        .mtn-peak-sun {
          animation: sun-glow 4s ease-in-out infinite alternate;
        }
        @keyframes cloud-drift-left {
          0% { transform: translateX(0); }
          50% { transform: translateX(2.5px); }
          100% { transform: translateX(0); }
        }
        @keyframes cloud-drift-right {
          0% { transform: translateX(0); }
          50% { transform: translateX(-3.5px); }
          100% { transform: translateX(0); }
        }
        @keyframes sun-glow {
          0% { filter: drop-shadow(0 0 1px rgba(197, 160, 89, 0.4)); opacity: 0.8; }
          100% { filter: drop-shadow(0 0 4px rgba(197, 160, 89, 0.9)); opacity: 1; }
        }
      `}</style>
      
      {/* Sun rising behind peak */}
      <circle className="mtn-peak-sun" cx="8" cy="11" r="3" fill="rgba(197, 160, 89, 0.2)" stroke="#c5a059" strokeWidth="1" />
      
      {/* Mountains */}
      <path d="M2 20L10 6l9 14" fill="rgba(255, 255, 255, 0.02)" />
      <path d="M12 20l4-6.5L22 20" fill="rgba(255, 255, 255, 0.01)" />
      
      {/* Mountain Ridge Highlights */}
      <path d="M10 6l-3 6M10 6v14" stroke="#c5a059" strokeWidth="1" />
      <path d="M16 13.5l-1.5 2.5" stroke="#c5a059" strokeWidth="1" />
      
      {/* Drifting Clouds */}
      <path
        className="mtn-cloud-left"
        d="M2 17.5a1.5 1.5 0 0 1 2.3-1.3A3.5 3.5 0 0 1 10 17"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <path
        className="mtn-cloud-right"
        d="M13 18.5a2.5 2.5 0 0 1 4.5-1.5A3 3 0 0 1 22 19"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};
