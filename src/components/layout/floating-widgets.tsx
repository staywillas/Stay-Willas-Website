"use client";

import dynamic from "next/dynamic";

// Lazy-load non-critical floating UI widgets (not needed at first paint)
const MobileNav = dynamic(() => import("@/components/layout/mobile-nav"), { ssr: false });
const AiConcierge = dynamic(() => import("@/components/chatbot/ai-concierge"), { ssr: false });
const WhatsAppSticky = dynamic(() => import("@/components/layout/whatsapp-sticky"), { ssr: false });

export default function FloatingWidgets() {
  return (
    <>
      <MobileNav />
      <AiConcierge />
      <WhatsAppSticky />
    </>
  );
}
