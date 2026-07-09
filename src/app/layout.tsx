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
  title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
  description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
  metadataBase: new URL("https://www.staywillas.com"),
  keywords: [
    "villas near mumbai",
    "villas near pune",
    "private pool villa",
    "pet friendly villas",
    "villas with chef",
    "pool villas lonavala",
    "alibaug pool villa",
    "karjat pool villa",
    "khopoli villa",
    "luxury staycation",
    "weekend getaways",
    "Stay Willas"
  ],
  authors: [{ name: "Stay Willas" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Stay Willas",
    title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
    description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
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
    title: "Stay Willas | Luxury Villas & Staycations in Maharashtra",
    description: "Experience world-class luxury staycations in Maharashtra. Curated premium villas in Lonavala, Alibaug, Karjat and more.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
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
