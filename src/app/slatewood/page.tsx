import type { Metadata } from "next";
import SlatewoodSimpleView from "@/components/slatewood/slatewood-simple-view";

export const metadata: Metadata = {
  title: "Slatewood Villa | Coming Soon with Private Pool & Sports Turf | Stay Willas",
  description: "Experience Slatewood, our upcoming luxury modern villa near Mumbai & Pune featuring an Olympic-proportioned private pool, private sports turf, and signature chef hospitality. Coming soon.",
  keywords: [
    "Slatewood villa",
    "private pool villa with turf",
    "luxury villa with sports turf maharashtra",
    "villas with box cricket turf near mumbai",
    "coming soon luxury villa stay willas",
    "private pool villas near mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/slatewood",
  },
  openGraph: {
    title: "Slatewood Villa | Coming Soon with Private Pool & Sports Turf | Stay Willas",
    description: "Experience Slatewood, our upcoming luxury modern villa near Mumbai & Pune featuring an Olympic-proportioned private pool, private sports turf, and signature chef hospitality.",
    url: "https://www.staywillas.com/slatewood",
    images: [
      {
        url: "https://www.staywillas.com/images/stay-willas-emblem.png",
        width: 1200,
        height: 630,
        alt: "Stay Willas - Slatewood Villa Coming Soon",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slatewood Villa | Coming Soon with Private Pool & Sports Turf | Stay Willas",
    description: "Experience Slatewood, our upcoming luxury modern villa near Mumbai & Pune featuring an Olympic-proportioned private pool and private sports turf.",
    images: ["https://www.staywillas.com/images/stay-willas-emblem.png"],
  },
};

export default function SlatewoodPage() {
  return <SlatewoodSimpleView />;
}
