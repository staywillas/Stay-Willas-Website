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
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "Luxury Villas in Maharashtra | Stay Willas",
  description: "Experience premium luxury villas in maharashtra with private pool villas & personal chefs. Book verified staycations in Lonavala & Khopoli today.",
  metadataBase: new URL("https://www.staywillas.com"),
  keywords: ["luxury villas in maharashtra"],
  authors: [{ name: "Stay Willas" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Stay Willas",
    title: "Luxury Villas in Maharashtra | Stay Willas",
    description: "Experience premium luxury villas in maharashtra with private pool villas & personal chefs. Book verified staycations in Lonavala & Khopoli today.",
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
    title: "Luxury Villas in Maharashtra | Stay Willas",
    description: "Experience premium luxury villas in maharashtra with private pool villas & personal chefs. Book verified staycations in Lonavala & Khopoli today.",
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
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${outfit.variable} ${cormorant.variable} ${montserrat.variable} antialiased font-sans overflow-x-hidden max-w-full w-full relative`}
        suppressHydrationWarning
      >
        <ClerkProvider>
          <SmoothScrollProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebSite",
                      "@id": "https://www.staywillas.com/#website",
                      "url": "https://www.staywillas.com",
                      "name": "Stay Willas",
                      "alternateName": "StayWillas",
                      "description": "Premium luxury villas with private pool & personal chefs across Lonavala, Khopoli & Maharashtra.",
                      "publisher": {
                        "@id": "https://www.staywillas.com/#organization"
                      },
                      "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://www.staywillas.com/villas?search={search_term_string}",
                        "query-input": "required name=search_term_string"
                      },
                      "hasPart": [
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Luxury Villas",
                          "url": "https://www.staywillas.com/villas"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Villas in Lonavala with Private Pool",
                          "url": "https://www.staywillas.com/villas-in-lonavala-with-private-pool"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Khopoli Villas",
                          "url": "https://www.staywillas.com/khopoli-villas"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Group Escape Villas",
                          "url": "https://www.staywillas.com/escape"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Destinations",
                          "url": "https://www.staywillas.com/destinations"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Travel Blog",
                          "url": "https://www.staywillas.com/blog"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Contact Concierge",
                          "url": "https://www.staywillas.com/contact"
                        }
                      ]
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://www.staywillas.com/#organization",
                      "name": "Stay Willas",
                      "alternateName": ["StayWillas", "Stay Willas Luxury Collection"],
                      "url": "https://www.staywillas.com",
                      "logo": "https://www.staywillas.com/icon.png",
                      "image": "https://www.staywillas.com/images/hero-villa.png",
                      "description": "Stay Willas is a luxury villa rental brand in Maharashtra, specializing in handpicked private pool villas in Lonavala and Khopoli.",
                      "telephone": "+91-9619042310",
                      "email": "bookings@staywillas.com",
                      "sameAs": [
                        "https://www.instagram.com/staywillas"
                      ],
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+91-9619042310",
                        "contactType": "customer service",
                        "availableLanguage": ["English", "Hindi", "Marathi"]
                      }
                    },
                    {
                      "@type": "LodgingBusiness",
                      "@id": "https://www.staywillas.com/#lodging",
                      "name": "Stay Willas Luxury Villa Collection",
                      "url": "https://www.staywillas.com",
                      "priceRange": "₹₹₹",
                      "telephone": "+91-9619042310",
                      "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Kim Cottage, 14 PR Kadam Marg, Maneklal Estate, Ghatkopar West",
                        "addressLocality": "Mumbai",
                        "addressRegion": "Maharashtra",
                        "postalCode": "400084",
                        "addressCountry": "IN"
                      },
                      "areaServed": [
                        { "@type": "Place", "name": "Lonavala" },
                        { "@type": "Place", "name": "Khopoli" }
                      ]
                    }
                  ]
                })
              }}
            />
            <div className="overflow-x-hidden w-full max-w-full relative">
              {children}
            </div>
            <FloatingWidgets />
            <MobileBottomNav />
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
