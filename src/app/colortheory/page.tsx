import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Footer from "@/components/layout/footer";
import ColorTheoryPreview from "./preview";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: "Stay Willas | A slower kind of escape",
  description: "Discover private villas and Jacuzzi cottages in Lonavala, Khopoli and Panchgani.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ColorTheoryPage() {
  const villas = await prisma.villa.findMany({
    where: { slug: { in: ["the-angle-house", "canopy-crest", "casa-de-reva", "willow-peak-cottage-c"] } },
    select: { id: true, slug: true, name: true, location: true, price: true, guests: true, bedrooms: true },
  });
  const order = ["the-angle-house", "canopy-crest", "casa-de-reva", "willow-peak-cottage-c"];
  villas.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  return (
    <>
      <ColorTheoryPreview villas={villas}>
        <HomeContent villas={villas} />
      </ColorTheoryPreview>
      <div data-lenis-prevent><Footer /></div>
    </>
  );
}
