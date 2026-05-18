import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import MobileNav from "@/components/layout/mobile-nav";
import AiConcierge from "@/components/chatbot/ai-concierge";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = (...args) => {
                  if (
                    args[0] &&
                    typeof args[0] === 'string' &&
                    (args[0].includes('Hydration') || 
                     args[0].includes('hydration') ||
                     args[0].includes('bis_skin_checked') ||
                     args[0].includes('Extra attributes from the server'))
                  ) {
                    return;
                  }
                  originalError(...args);
                };
              }
            `
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${cormorant.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <SmoothScrollProvider>
            {children}
            <MobileNav />
            <AiConcierge />
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
