"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Lazy-load non-critical floating UI widgets (not needed at first paint)
const WhatsAppSticky = dynamic(() => import("@/components/layout/whatsapp-sticky"), { ssr: false });
const Preloader = dynamic(() => import("@/components/layout/preloader"), { ssr: false });

export default function FloatingWidgets() {
  const pathname = usePathname();
  const [previewPreloader, setPreviewPreloader] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const previewFrame = params.get("preloader") === "preview" || params.get("preview") === "preloader"
      ? window.requestAnimationFrame(() => setPreviewPreloader(true))
      : null;
    const replay = () => setPreviewPreloader(true);
    window.addEventListener("replay-preloader", replay);
    return () => {
      if (previewFrame !== null) window.cancelAnimationFrame(previewFrame);
      window.removeEventListener("replay-preloader", replay);
    };
  }, []);
  if (pathname?.startsWith("/care")) return null;

  return (
    <>
      <WhatsAppSticky />
      {previewPreloader && <Preloader preview />}
    </>
  );
}
