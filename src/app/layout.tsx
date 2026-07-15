import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import FloatingWidgets from "@/components/layout/floating-widgets";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import Script from "next/script";

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
  title: "Luxury Villas in Maharashtra | Staycations with Private Pools | Stay Willas",
  description: "Experience premium luxury villas in Maharashtra with private pools and chefs. Book handpicked verified staycations in Lonavala, Alibaug, and Karjat.",
  metadataBase: new URL("https://www.staywillas.com"),
  keywords: ["luxury villas in maharashtra"],
  authors: [{ name: "Stay Willas" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Stay Willas",
    title: "Luxury Villas & Staycations in Maharashtra | Stay Willas",
    description: "Experience world-class luxury staycations in Maharashtra. Rent handpicked private pool villas in Lonavala and Alibaug with chefs. Book your stay now.",
    url: "https://www.staywillas.com",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.png",
        width: 1200,
        height: 630,
        alt: "Stay Willas Luxury Villas and Staycations",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Villas & Staycations in Maharashtra | Stay Willas",
    description: "Experience world-class luxury staycations in Maharashtra. Rent handpicked private pool villas in Lonavala and Alibaug with chefs. Book your stay now.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YFK9H723YJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YFK9H723YJ');
          `}
        </Script>
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="tL823LIpA1b/wcL/aWHL1Q"
          strategy="afterInteractive"
        />
      </head>
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
                  "url": "https://www.staywillas.com",
                  "logo": "https://www.staywillas.com/icon.png",
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
