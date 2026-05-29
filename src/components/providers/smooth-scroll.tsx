"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

// Synchronizes Next.js App Router navigation with the Lenis scroller
// to ensure standard page transitions start smoothly at the top.
function ScrollRestorer() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // Force instantaneous scroll reset to top of viewport on path changes.
      // Doing this immediately on path resolution prevents browser/Next.js scroll-snap flashes.
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08,             // Softer easing cushion for luxurious slowdown
        duration: 1.2,          // Elongated transition timing for maximum smoothness
        smoothWheel: true, 
        syncTouch: false,       // Use native momentum on touch screens (prevents lag)
        touchMultiplier: 1.5,   // Elegant touch response
        wheelMultiplier: 1.1,   // Silky scrolling wheel response
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // World-class exponential ease-out
        infinite: false,
      }}
    >
      <ScrollRestorer />
      {children}
    </ReactLenis>
  );
}

