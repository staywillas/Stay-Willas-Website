"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Lazy-load non-critical floating UI widgets (not needed at first paint)
const WhatsAppSticky = dynamic(() => import("@/components/layout/whatsapp-sticky"), { ssr: false });
const CallButton = dynamic(() => import("@/components/layout/call-button"), { ssr: false });
const Preloader = dynamic(() => import("@/components/layout/preloader"), { ssr: false });

export default function FloatingWidgets() {
  const pathname = usePathname();
  const [previewPreloader, setPreviewPreloader] = useState(false);
  const [hideContactWidgets, setHideContactWidgets] = useState(false);
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

  useEffect(() => {
    if (pathname !== "/") {
      setHideContactWidgets(false);
      return;
    }

    let frame = 0;
    const updateContactWidgetVisibility = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const searchForm = document.querySelector<HTMLElement>("[data-home-search-form]");
        const isMobile = window.matchMedia("(max-width: 600px)").matches;
        if (!isMobile || !searchForm) {
          setHideContactWidgets(false);
          return;
        }

        const formBounds = searchForm.getBoundingClientRect();
        const widgetBottom = window.innerHeight - 80;
        const widgetTop = widgetBottom - 56;
        const overlapsSearchForm = formBounds.bottom > widgetTop && formBounds.top < widgetBottom;
        setHideContactWidgets(overlapsSearchForm);
      });
    };

    updateContactWidgetVisibility();
    window.addEventListener("scroll", updateContactWidgetVisibility, { passive: true });
    window.addEventListener("resize", updateContactWidgetVisibility);
    const formObserver = new MutationObserver(updateContactWidgetVisibility);
    formObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      formObserver.disconnect();
      window.removeEventListener("scroll", updateContactWidgetVisibility);
      window.removeEventListener("resize", updateContactWidgetVisibility);
    };
  }, [pathname]);

  if (pathname?.startsWith("/care") || pathname?.startsWith("/ads/")) return null;

  return (
    <>
      {!hideContactWidgets && <WhatsAppSticky />}
      {!hideContactWidgets && <CallButton />}
      {previewPreloader && <Preloader preview />}
    </>
  );
}
