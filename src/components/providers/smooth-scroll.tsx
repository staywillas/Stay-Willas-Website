"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08,             // Slower, more luxurious easing
        duration: 1.2,          // Buttery-smooth transition timing
        smoothWheel: true, 
        syncTouch: false,       // Use native mobile gesture momentum (prevents mobile scroll lag)
      }}
    >
      {children}
    </ReactLenis>
  );
}
