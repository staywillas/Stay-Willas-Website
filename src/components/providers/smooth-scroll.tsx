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
  const [isTouchOrMobile, setIsTouchOrMobile] = useState(false);

  useEffect(() => {
    const checkTouchOrMobile = () => {
      const isMobileScreen = window.innerWidth < 1024;
      const hasTouchSupport =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      setIsTouchOrMobile(isMobileScreen || hasTouchSupport);
    };

    checkTouchOrMobile();
    window.addEventListener("resize", checkTouchOrMobile);
    return () => window.removeEventListener("resize", checkTouchOrMobile);
  }, []);

  // For mobile and touch devices, bypass JS scroll hijacking to guarantee 100% native, lag-free scrolling
  if (isTouchOrMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.12,             // Snappy, responsive interpolation
        smoothWheel: true, 
        syncTouch: false,       // Prevent touch lag
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

