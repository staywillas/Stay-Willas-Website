import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import FloatingWidgets from "@/components/layout/floating-widgets";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

// Fonts: swap display for fastest text paint
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Mahabaleshwar and more.",
  metadataBase: new URL("https://staywillas.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cormorant.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <SmoothScrollProvider>
            {children}
            <FloatingWidgets />
            <MobileBottomNav />
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
