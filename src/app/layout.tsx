import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import MobileNav from "@/components/layout/mobile-nav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Mahabaleshwar and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${outfit.variable} ${cormorant.variable} antialiased font-sans`}
        >
          <SmoothScrollProvider>
            {children}
            <MobileNav />
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
