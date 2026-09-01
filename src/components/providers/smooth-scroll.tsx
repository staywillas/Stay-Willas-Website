"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function ScrollRestorer() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    // Only enable Lenis on desktop devices with mouse/pointer (no touch/mobile)
    const isDesktop =
      window.innerWidth >= 1024 &&
      window.matchMedia("(pointer: fine)").matches &&
      !("ontouchstart" in window);

    if (isDesktop) {
      setEnableLenis(true);
    }
  }, []);

  // For mobile, iPhone, and touch devices: 100% native lag-free WebKit scrolling
  if (!enableLenis) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.12,
        smoothWheel: true, 
        syncTouch: false,
        wheelMultiplier: 1.0,   
        touchMultiplier: 1.0,   
        infinite: false,
      }}
    >
      <ScrollRestorer />
      {children}
    </ReactLenis>
  );
}

