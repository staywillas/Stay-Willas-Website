"use client";

import React, { useEffect, useRef } from "react";

interface WarpLinesProps {
  colorGold?: string;
  colorPurple?: string;
  count?: number;
  baseSpeed?: number;
  interactive?: boolean;
}

interface LineParticle {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  color: string;
  weight: number;
}

export default function WarpLines({
  colorGold = "#DAA520",
  colorPurple = "#B497CF",
  count = 60,
  baseSpeed = 4,
  interactive = true,
}: WarpLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const speedRef = useRef(baseSpeed);
  const targetSpeedRef = useRef(baseSpeed);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: LineParticle[] = [];
    const maxDepth = 1000;

    // Helper to generate a random particle
    const createParticle = (initZ = false): LineParticle => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 300 + 20;
      
      // Assign random color from gold / purple palette
      const colors = [colorGold, colorPurple, "#ffffff", "#8E75A8", "#E2A63B"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: initZ ? Math.random() * maxDepth : maxDepth,
        px: 0,
        py: 0,
        color,
        weight: Math.random() * 1.5 + 0.5,
      };
    };

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resize);

    // Track mouse input for interactive warp speed
    const handleMouseDown = () => {
      if (!interactive) return;
      mouseRef.current.isDown = true;
      targetSpeedRef.current = baseSpeed * 4; // Hyper speed on click!
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      targetSpeedRef.current = baseSpeed;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left - width / 2;
      mouseRef.current.y = e.clientY - rect.top - height / 2;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousedown", handleMouseDown);
      parent.addEventListener("mouseup", handleMouseUp);
      parent.addEventListener("mouseleave", handleMouseUp);
      parent.addEventListener("mousemove", handleMouseMove);
      
      // Touch support
      parent.addEventListener("touchstart", handleMouseDown);
      parent.addEventListener("touchend", handleMouseUp);
    }

    // Main animation loop
    const animate = () => {
      // Clear with trailing alpha for motion blur
      ctx.fillStyle = "rgba(7, 5, 13, 0.15)";
      ctx.fillRect(0, 0, width, height);

      const fov = 200;
      const centerX = width / 2 + (mouseRef.current.isDown ? mouseRef.current.x * 0.15 : mouseRef.current.x * 0.05);
      const centerY = height / 2 + (mouseRef.current.isDown ? mouseRef.current.y * 0.15 : mouseRef.current.y * 0.05);

      // Smoothly interpolate speed
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

      particles.forEach((p) => {
        // Cache previous screen coords
        const prevX = (p.x / p.z) * fov + centerX;
        const prevY = (p.y / p.z) * fov + centerY;

        // Move particle forward (closer to camera)
        p.z -= speedRef.current;

        // Recycle particle if it passes the camera
        if (p.z <= 0) {
          Object.assign(p, createParticle(false));
          p.px = (p.x / p.z) * fov + centerX;
          p.py = (p.y / p.z) * fov + centerY;
          return;
        }

        // Calculate new screen coords
        const currX = (p.x / p.z) * fov + centerX;
        const currY = (p.y / p.z) * fov + centerY;

        // Only draw if inside canvas boundaries
        if (
          currX >= 0 &&
          currX <= width &&
          currY >= 0 &&
          currY <= height &&
          p.z < maxDepth - 100
        ) {
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currX, currY);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.weight * (1 - p.z / maxDepth) * (mouseRef.current.isDown ? 2.5 : 1.2);
          ctx.lineCap = "round";
          ctx.stroke();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("mousedown", handleMouseDown);
        parent.removeEventListener("mouseup", handleMouseUp);
        parent.removeEventListener("mouseleave", handleMouseUp);
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("touchstart", handleMouseDown);
        parent.removeEventListener("touchend", handleMouseUp);
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [colorGold, colorPurple, count, baseSpeed, interactive]);

  return <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />;
}
