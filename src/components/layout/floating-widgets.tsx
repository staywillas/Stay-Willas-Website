"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Lazy-load non-critical floating UI widgets (not needed at first paint)
const WhatsAppSticky = dynamic(() => import("@/components/layout/whatsapp-sticky"), { ssr: false });
const CallSticky = dynamic(() => import("@/components/layout/call-sticky"), { ssr: false });

export default function FloatingWidgets() {
  const pathname = usePathname();
  if (pathname?.startsWith("/care")) return null;

  return (
    <>
      <WhatsAppSticky />
      <CallSticky />
    </>
  );
}
