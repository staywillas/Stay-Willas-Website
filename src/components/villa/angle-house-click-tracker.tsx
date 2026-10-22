"use client";

import { useEffect } from "react";
import { getAngleHouseAttribution, trackAngleHouseEngagement } from "@/lib/angle-house-measurement";

export default function AngleHouseClickTracker() {
  useEffect(() => {
    getAngleHouseAttribution();

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackAngleHouseEngagement("call_click");
      else if (/^https?:\/\/(?:api\.)?wa\.me\//i.test(href)) trackAngleHouseEngagement("whatsapp_click");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
