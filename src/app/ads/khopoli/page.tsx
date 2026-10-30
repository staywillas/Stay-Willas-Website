import type { Metadata } from "next";
import KhopoliAdsLeadPage from "@/components/ads/khopoli-ads-lead-page";
import { canopyCrestPhotos } from "@/data/canopy-crest-images";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Villas in Khopoli | Canopy Crest by Stay Willas",
  description:
    "See Canopy Crest photos, amenities and spaces. Tell us about your Khopoli stay and our team will contact you.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.staywillas.com/ads/khopoli",
  },
  openGraph: {
    title: "Villas in Khopoli | Canopy Crest by Stay Willas",
    description:
      "See Canopy Crest photos, amenities and spaces. Tell us about your Khopoli stay and our team will contact you.",
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
