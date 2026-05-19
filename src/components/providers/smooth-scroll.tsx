"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,              // Slightly faster easing for snappier response
        duration: 1.0,           // Balanced smooth transition timing
        smoothWheel: true, 
        syncTouch: false,        // Use native mobile gesture momentum (prevents mobile scroll lag)
        touchMultiplier: 2,      // Faster touch response on mobile
        wheelMultiplier: 1,      // Normal wheel speed
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
