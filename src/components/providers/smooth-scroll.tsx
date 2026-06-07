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
        lerp: 0.08,             // Very smooth frame-by-frame interpolation
        smoothWheel: true, 
        syncTouch: false,       // Prevent touch lag
        touchMultiplier: 1.0,   // Native touch swipe speed
        wheelMultiplier: 1.0,   // Native wheel response
        infinite: false,
      }}
    >
      <ScrollRestorer />
      {children}
    </ReactLenis>
  );
}

