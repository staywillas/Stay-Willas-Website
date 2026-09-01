"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDHoverCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;      // Maximum tilt angle in degrees (default: 8)
  scale?: number;        // Scale on hover (default: 1.03)
  lift?: number;         // Y-translation on hover (default: -8)
  glareOpacity?: number; // Maximum opacity of glare/reflection (default: 0.25)
}

function DesktopTiltCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.03,
  lift = -8,
  glareOpacity = 0.25,
}: ThreeDHoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);
  const liftVal = useMotionValue(0);
  const scaleVal = useMotionValue(1);
  
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacityVal = useMotionValue(0);

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

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tiltX = -((mouseY / height) - 0.5) * maxTilt;
    const tiltY = ((mouseX / width) - 0.5) * maxTilt;

    rotateXVal.set(tiltX);
    rotateYVal.set(tiltY);

    glareX.set((mouseX / width) * 100);
    glareY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    liftVal.set(lift);
    scaleVal.set(scale);
    glareOpacityVal.set(glareOpacity);
  };

  const handleMouseLeave = () => {
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
          rotateX: springRotateX,
          rotateY: springRotateY,
          y: springLift,
          scale: springScale,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-[inherit] overflow-hidden transition-shadow duration-300"
      >
        <div 
          className="w-full h-full rounded-[inherit] overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {children}
        </div>

        <motion.div
          style={{
            background: glareBackground,
            opacity: springGlareOpacity,
            transform: "translateZ(1px)",
          }}
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-50 transition-opacity duration-300"
        />
      </motion.div>
    </div>
  );
}

export default function ThreeDHoverCard(props: ThreeDHoverCardProps) {
  const [isDesktopWithMouse, setIsDesktopWithMouse] = useState(false);

  useEffect(() => {
    // Check if device is desktop with mouse pointer (not touch screen or mobile)
    const isDesktop =
      window.innerWidth >= 1024 &&
      window.matchMedia("(pointer: fine)").matches &&
      !("ontouchstart" in window);

    setIsDesktopWithMouse(isDesktop);
  }, []);

  // For touch/mobile devices: 100% pure lightweight DOM with zero Framer Motion physics loops
  if (!isDesktopWithMouse) {
    return (
      <div className={cn("relative w-full h-full rounded-[inherit] overflow-hidden transition-transform duration-300", props.className)}>
        {props.children}
      </div>
    );
  }

  return <DesktopTiltCard {...props} />;
}


