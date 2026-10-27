import type { Metadata } from "next";
import SlatewoodSimpleView from "@/components/slatewood/slatewood-simple-view";

export const metadata: Metadata = {
  title: "Slatewood Villa | Coming Soon with Private Pool & Sports Turf | Stay Willas",
  description: "Meet Slatewood, a Stay Willas retreat coming soon in Maharashtra with a private pool, floodlit sports turf and thoughtful in-villa hospitality.",
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
    description: "A new Stay Willas retreat with a private pool, sports turf and thoughtful in-villa hospitality. Coming soon to Maharashtra.",
    url: "https://www.staywillas.com/slatewood",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Slatewood Villa | Coming Soon with Private Pool & Sports Turf | Stay Willas",
    description: "A new Stay Willas retreat with a private pool and sports turf. Coming soon to Maharashtra.",
  },
};

export default function SlatewoodPage() {
  return <SlatewoodSimpleView />;
}
