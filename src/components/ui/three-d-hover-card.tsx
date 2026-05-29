"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDHoverCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;      // Maximum tilt angle in degrees (default: 10)
  scale?: number;        // Scale on hover (default: 1.03)
  lift?: number;         // Y-translation on hover (default: -10)
  glareOpacity?: number; // Maximum opacity of glare/reflection (default: 0.3)
}

export default function ThreeDHoverCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.03,
  lift = -8,
  glareOpacity = 0.25,
}: ThreeDHoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion Values for performance (no state-induced React re-renders)
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);
  const liftVal = useMotionValue(0);
  const scaleVal = useMotionValue(1);
  
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacityVal = useMotionValue(0);

  // Detection for touch devices to avoid scroll interference
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  // Spring configuration for silky smooth physical response
  const springConfig = { 
    stiffness: 140, 
    damping: 22, 
    mass: 0.6 
  };

  const springRotateX = useSpring(rotateXVal, springConfig);
  const springRotateY = useSpring(rotateYVal, springConfig);
  const springLift = useSpring(liftVal, springConfig);
  const springScale = useSpring(scaleVal, springConfig);
  const springGlareOpacity = useSpring(glareOpacityVal, springConfig);

  // Dynamic glare background gradient tracking the cursor
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates of the mouse within the card (0 to width/height)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (-maxTilt to +maxTilt)
    // tiltX controls rotation around the X-axis (looks like vertical tilt)
    // tiltY controls rotation around the Y-axis (looks like horizontal tilt)
    const tiltX = -((mouseY / height) - 0.5) * maxTilt;
    const tiltY = ((mouseX / width) - 0.5) * maxTilt;

    rotateXVal.set(tiltX);
    rotateYVal.set(tiltY);

    // Calculate glare percentage (0 to 100)
    glareX.set((mouseX / width) * 100);
    glareY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    liftVal.set(lift);
    scaleVal.set(scale);
    glareOpacityVal.set(glareOpacity);
  };

  const handleMouseLeave = () => {
    // Reset all spring targets back to resting state
    rotateXVal.set(0);
    rotateYVal.set(0);
    liftVal.set(0);
    scaleVal.set(1);
    glareOpacityVal.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative w-full h-full select-none", className)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: isTouchDevice ? 0 : springRotateX,
          rotateY: isTouchDevice ? 0 : springRotateY,
          y: isTouchDevice ? 0 : springLift,
          scale: isTouchDevice ? 1 : springScale,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-[inherit] overflow-hidden transition-shadow duration-300"
      >
        {/* Child Content */}
        <div 
          className="w-full h-full rounded-[inherit] overflow-hidden"
          style={{ transform: "translateZ(0px)" }} // Safari rendering bug fix
        >
          {children}
        </div>

        {/* Premium Glassmorphic Glare Reflection Overlay */}
        {!isTouchDevice && (
          <motion.div
            style={{
              background: glareBackground,
              opacity: springGlareOpacity,
              transform: "translateZ(1px)",
            }}
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-50 transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
}

