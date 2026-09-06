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
      {children}
    </div>
  );
}
