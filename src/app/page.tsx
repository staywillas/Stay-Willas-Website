import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Footer from "@/components/layout/footer";
import HomeExperience from "@/components/home/editorial/home-experience";
import HomeContent from "@/components/home/editorial/home-content";

export const metadata: Metadata = {
  title: "Private Pool Villas Near Mumbai | Stay Willas",
  description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli. Best direct rates with 0% booking fee.",
  keywords: [
    "private pool villas near Mumbai",
    "weekend getaway villas near mumbai",
    "luxury villa staycations near pune",
    "private pool villas for rent maharashtra",
    "exclusive villas near Mumbai"
  ],
  alternates: {
    canonical: "https://www.staywillas.com",
  },
  openGraph: {
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli. Best direct rates with 0% booking fee.",
    url: "https://www.staywillas.com",
    images: [
      {
        url: "https://www.staywillas.com/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg",
        width: 1254,
        height: 1254,
        alt: "Canopy Crest villa and private pool in Khopoli",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Pool Villas Near Mumbai | Exclusive Weekend Stays | Stay Willas",
    description: "Book beautiful private pool villas near Mumbai with delicious home-cooked meals & chef services in Lonavala and Khopoli.",
    images: ["https://www.staywillas.com/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const order = ["the-angle-house", "canopy-crest", "casa-de-reva", "willow-peak-cottage-c"];
  const villas = await prisma.villa.findMany({
    where: { slug: { in: order } },
    select: { id: true, slug: true, name: true, location: true, price: true, guests: true, bedrooms: true },
  });
  villas.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  return (
    <>
      <HomeExperience villas={villas}>
        <HomeContent villas={villas} />
      </HomeExperience>
      <div data-lenis-prevent><Footer /></div>
    </>
  );
}
