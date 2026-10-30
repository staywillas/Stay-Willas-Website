"use client";

import { useEffect } from "react";
import {
  trackCanopyCrestInteraction,
  trackWebsiteWhatsAppClick,
} from "@/lib/angle-house-measurement";

const managementRoute = /^\/(admin|dashboard|care|login|signup)(\/|$)/;

function isWhatsAppLink(href: string): boolean {
  try {
    const url = new URL(href, window.location.href);
    return /(^|\.)wa\.me$|(^|\.)whatsapp\.com$/.test(url.hostname)
      || url.hostname === "api.whatsapp.com";
  } catch {
    return false;
  }
}

export default function SiteConversionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (managementRoute.test(window.location.pathname)) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      if (
        link.dataset.conversionEvent === "canopy_crest_check_dates_click" &&
        window.location.pathname === "/villa/canopy-crest"
      ) {
        trackCanopyCrestInteraction(
          "canopy_crest_check_dates_click",
          link.dataset.conversionSurface ?? "property_cta",
        );
      }

      const href = link.getAttribute("href") ?? "";
      if (!isWhatsAppLink(href)) return;

      trackWebsiteWhatsAppClick("whatsapp_link");
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
