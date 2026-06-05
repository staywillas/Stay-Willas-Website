import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit, Montserrat } from "next/font/google";
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

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
  metadataBase: new URL("https://staywillas.com"),
  keywords: ["luxury villa rental maharashtra", "book private pool villa near mumbai", "premium vacation rentals lonavala alibaug karjat", "stay willas luxury retreats", "private pool villa lonavala", "luxury staycation alibaug", "villa stay karjat", "Stay Willas"],
  authors: [{ name: "Stay Willas" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Stay Willas",
    title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
    description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
    url: "https://staywillas.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
    description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cormorant.variable} ${montserrat.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <SmoothScrollProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Stay Willas",
                  "url": "https://staywillas.com",
                  "logo": "https://staywillas.com/icon.png",
                  "description": "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-9619042310",
                    "contactType": "customer service"
                  }
                })
              }}
            />
            {children}
            <FloatingWidgets />
            <MobileBottomNav />
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
