import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stay Willas Care | Villa Operations & Readiness Portal",
  description: "Internal operations and proof portal for caretakers and culinary staff at The Angle House, Lonavala.",
  robots: { index: false, follow: false },
};

export default function CareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070e1c] text-white flex flex-col font-sans antialiased selection:bg-[#DAA520] selection:text-black">
      {/* Explicitly eliminate consumer bottom nav and floating widgets on Care portal */}
      <style>{`
        #mobile-bottom-nav,
        .mobile-bottom-nav-root,
        [data-floating-widgets] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
      {children}
    </div>
  );
}
