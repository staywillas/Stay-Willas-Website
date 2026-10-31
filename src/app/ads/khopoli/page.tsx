import type { Metadata } from "next";
import KhopoliAdsLeadPage from "@/components/ads/khopoli-ads-lead-page";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Khopoli Villa Stays | Canopy Crest and Nieevant | Stay Willas",
  description:
    "Share your Khopoli stay plans with Stay Willas. Our team will help you compare Canopy Crest and Nieevant.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.staywillas.com/ads/khopoli",
  },
  openGraph: {
    title: "Khopoli Villa Stays | Canopy Crest and Nieevant | Stay Willas",
    description:
      "Share your Khopoli stay plans with Stay Willas. Our team will help you compare Canopy Crest and Nieevant.",
    url: "https://www.staywillas.com/ads/khopoli",
    siteName: "Stay Willas",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `https://www.staywillas.com${canopyCrestPhotos.hero.src}`,
        alt: "Canopy Crest villa and private swimming pool in Khopoli",
      },
    ],
  },
};

export default function KhopoliAdsPage() {
  return <KhopoliAdsLeadPage />;
}
