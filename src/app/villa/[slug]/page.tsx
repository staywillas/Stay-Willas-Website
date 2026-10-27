import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getReviews } from "@/app/actions/review";
import { resolvePropertyImage } from "@/lib/property-images";
import PropertyEditorialDetails from "@/components/villa/property-editorial-details";
import { getTemporaryAvailabilityBlocks } from "@/lib/temporary-availability-blocks";

export const revalidate = 3600; // 1 hour edge cache (on-demand revalidated on admin updates)

export async function generateStaticParams() {
  const villas = await prisma.villa.findMany({
    select: { slug: true },
  });
  return villas.map((v) => ({ slug: v.slug }));
}

// Fetch only pricing rules that can affect a guest's upcoming stay. This also
// keeps stale historical overrides out of the client-side booking payload.
async function fetchVillaWithUpcomingPricing(slug: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const include = {
    dailyPrices: {
      where: { date: { gte: today } },
      orderBy: { date: "asc" as const },
    },
    seasonalPrices: {
      where: { endDate: { gte: today } },
      orderBy: { startDate: "asc" as const },
    },
  };

  return (
    (await prisma.villa.findUnique({ where: { slug }, include })) ??
    (await prisma.villa.findUnique({ where: { id: slug }, include }))
  );
}

// Avoid duplicate database roundtrips between generateMetadata and the page.
const getCachedVilla = React.cache
  ? React.cache(fetchVillaWithUpcomingPricing)
  : fetchVillaWithUpcomingPricing;

const getCachedReviews = React.cache
  ? React.cache(async (villaId: string) => {
      return await getReviews(villaId);
    })
  : async (villaId: string) => {
      return await getReviews(villaId);
    };

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const villa = await getCachedVilla(slug);

  if (!villa) {
    return {
      title: "Requested Luxury Villa Was Not Found | Stay Willas",
    };
  }

  const city = villa.location.split(",")[0].trim();
  let titleText = `${villa.name} | Private Pool Villa in ${city} | Stay Willas`;
  let descText = `Book ${villa.name}, a ${villa.bedrooms} BHK private pool villa in ${city} with in-house chef service, private pool & luxury staycation amenities. Best direct rates with 0% platform fee.`;
  let keywordsList = [
    `${villa.bedrooms} BHK private pool villa in ${city}`,
    `${villa.name.toLowerCase()}`,
    `villa in ${city.toLowerCase()}`,
    `private pool villa ${city.toLowerCase()}`,
  ];

  if (villa.slug === "the-angle-house") {
    titleText = "The Angle House Kamshet, Lonavala | Private Pool & Jacuzzi";
    descText =
      "Book The Angle House in Kamshet, Lonavala: a 3 BHK villa for up to 12 guests with a private waterfall pool and Jacuzzi. Stays from ₹13,000/night.";
    keywordsList = [
      "staywillas the angle house",
      "staywillas the angle house with jacuzzi lonavala",
      "the angle house lonavala",
      "staywillas the angle house reviews",
      "the angle house with jacuzzi lonavala reviews",
      "the angle house 3 bhk private pool villa",
      "angel house lonavala",
      "glass house villa lonavala",
      "villa with waterfall pool in lonavala",
      "jacuzzi villa lonavala",
      "pet friendly villa lonavala",
    ];
  } else if (villa.slug === "canopy-crest") {
    titleText = "Canopy Crest Khopoli | 4 BHK Pool Villa | Stay Willas";
    descText =
      "Book Canopy Crest in Khopoli: a 4 BHK private pool villa for a maximum of 16 guests. Stays from ₹15,000/night; ask about dates and meal options.";
    keywordsList = [
      "staywillas canopy crest khopoli",
      "staywillas canopy crest khopoli premium villa with swimming pool chavani",
      "staywillas canopy crest khopoli premium villa with swimming pool chavani reviews",
      "canopy crest khopoli",
      "premium villa with swimming pool chavani",
      "canopy crest chavani khopoli",
      "4 bhk private pool villa in khopoli",
      "chavani private villa with pool",
      "staywillas canopy crest reviews",
    ];
  } else if (villa.slug === "willow-peak") {
    titleText = "Willow Peak Lonavala | Jacuzzi Cottages | Stay Willas";
    descText =
      "Willow Peak in Kurwande, Lonavala offers A-frame cottages with private Jacuzzis. Base rates start at ₹4,999/night per cottage; full-estate pricing is separate.";
    keywordsList = [
      "willow peak resort kurvande",
      "willow peak lonavala",
      "willow peak resort",
      "willow peak resort kurvande reviews",
      "willow peak resort kurvande lonavala",
      "willow peak kurwande",
      "willow peak",
      "a-frame cottage lonavala",
      "jacuzzi cottage lonavala",
      "resort in kurvande lonavala",
      "couples villa with jacuzzi lonavala",
    ];
  } else if (villa.slug.startsWith("willow-peak-cottage")) {
    const letter = villa.slug.replace("willow-peak-cottage-", "").toLowerCase();
    const cottageName =
      letter === "a" ? "Breeze" : letter === "b" ? "Crest" : "Heaven";
    titleText = `${cottageName} | A-Frame Jacuzzi Chalet Lonavala | Stay Willas`;
    descText = `Book ${cottageName} (Cottage ${letter.toUpperCase()} at Willow Peak) in Kurwande, Lonavala — a private 1 BHK wooden A-frame chalet featuring an ensuite jacuzzi bath, scenic mountain sit-out, and on-demand chef dining. Direct bookings from ₹4,999/night.`;
    keywordsList = [
      `willow peak ${cottageName.toLowerCase()} lonavala`,
      `willow peak cottage ${letter} lonavala`,
      "a frame cottage lonavala with jacuzzi",
      "couples cottage lonavala",
      "kurwande cottage stay",
      "chalet with jacuzzi lonavala",
    ];
  } else if (
    villa.slug === "casa-de-reva" ||
    villa.slug === "terra-cotta-villa"
  ) {
    titleText =
      "Casa De Reva | 4 BHK Pool Villa in Panchgani | Stay Willas";
    descText =
      "Book Casa De Reva in Panchgani — a premier 4 BHK private pool sanctuary featuring terracotta architecture, hillside gazebo, mountain views, and on-demand chef service. Direct bookings from ₹16,000/night.";
    keywordsList = [
      "casa de reva panchgani",
      "casa de reva villa with pool",
      "4 bhk private pool villa in panchgani",
      "terra cotta villa panchgani",
      "kaswand luxury villa panchgani",
      "staywillas casa de reva",
    ];
  }

  const coverImage = villa.images[0]
    ? resolvePropertyImage(villa.images[0])
    : "";
  const ogImageUrl = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `https://www.staywillas.com${coverImage}`
    : "https://www.staywillas.com/images/hero-villa.webp";

  return {
    title: titleText,
    description: descText,
    keywords: keywordsList,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: `https://www.staywillas.com/villa/${villa.slug}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://www.staywillas.com/villa/${villa.slug}`,
      siteName: "Stay Willas",
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${villa.name} - Luxury Villa Staycation in ${city}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [ogImageUrl],
    },
  };
}

export default async function VillaDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const villa = await getCachedVilla(slug);

  if (!villa) {
    notFound();
  }

  const dbReviews = await getCachedReviews(villa.id);
  const reviews = dbReviews;
  const isWillowCottage = villa.slug.startsWith("willow-peak-cottage");
  const isWillowEntire = villa.slug === "willow-peak";

  let relatedVillaIds = [villa.id];
  if (isWillowCottage) {
    const entireEstate = await prisma.villa.findFirst({
      where: { slug: "willow-peak" },
    });
    if (entireEstate) relatedVillaIds.push(entireEstate.id);
  } else if (isWillowEntire) {
    const allWillow = await prisma.villa.findMany({
      where: {
        OR: [
          { slug: "willow-peak" },
          { slug: { startsWith: "willow-peak-cottage" } },
        ],
      },
      select: { id: true },
    });
    relatedVillaIds = allWillow.map((v) => v.id);
  }

  const activeBookings = await getLiveActiveBookings(relatedVillaIds);

  const serializedBookings = activeBookings.map((b) => {
    let cottagesCount = 1;
    try {
      if (b.userId && b.userId.startsWith("{")) {
        const parsed = JSON.parse(b.userId);
        if (parsed.cottagesCount) cottagesCount = parsed.cottagesCount;
        else if (parsed.guests)
          cottagesCount = Math.max(
            1,
            Math.min(3, Math.ceil(parsed.guests / 4)),
          );
      }
    } catch {}

    return {
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
      status: b.status,
      cottagesCount,
    };
  });
  serializedBookings.push(...getTemporaryAvailabilityBlocks(villa.slug));

  return (
    <PropertyEditorialDetails
      villa={villa}
      reviews={reviews}
      bookings={serializedBookings}
    />
  );
}

async function getLiveActiveBookings(relatedVillaIds: string[]) {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.booking.findMany({
    where: {
      villaId: { in: relatedVillaIds },
      checkOut: { gt: today },
      status: { in: ["CONFIRMED", "PENDING", "BLOCKED", "HELD"] },
      OR: [
        { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
        { status: "HELD", createdAt: { gte: tenMinutesAgo } },
      ],
    },
    select: {
      checkIn: true,
      checkOut: true,
      status: true,
      userId: true,
    },
    orderBy: { checkIn: "asc" },
  });
}
