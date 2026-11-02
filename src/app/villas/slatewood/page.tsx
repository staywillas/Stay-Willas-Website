import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getReviews } from "@/app/actions/review";
import PropertyEditorialDetails from "@/components/villa/property-editorial-details";
import { getCachedPublicVilla } from "@/lib/public-villa-data";
import { getTemporaryAvailabilityBlocks } from "@/lib/temporary-availability-blocks";
import { resolvePropertyImage } from "@/lib/property-images";
import { normalizePublicCopy } from "@/lib/public-copy";
import { SLATEWOOD_PREVIEW_ID, SLATEWOOD_SLUG } from "@/data/slatewood-villa";

export const revalidate = 3600;

const publicPath = "/villas/slatewood";

const getCachedReviews = React.cache
  ? React.cache(async (villaId: string) => getReviews(villaId))
  : async (villaId: string) => getReviews(villaId);

export async function generateMetadata(): Promise<Metadata> {
  const villa = await getCachedPublicVilla(SLATEWOOD_SLUG);
  const image = villa?.images[0]
    ? resolvePropertyImage(villa.images[0])
    : "/assets/villas/slatewood/slatewood-exterior-evening.webp";
  const title = "Slatewood by Stay Willas | 3BHK Infinity Pool Villa";
  const description =
    "Explore Slatewood by Stay Willas, a 3-bedroom private infinity pool villa on a landscaped 1.5-acre estate, with a garden, lawn, gazebo and dedicated turf.";

  return {
    title,
    description,
    keywords: [
      "Slatewood by Stay Willas",
      "3 bedroom private infinity pool villa",
      "private pool villa with garden and gazebo",
      "villa with dedicated turf",
    ],
    alternates: { canonical: `https://www.staywillas.com${publicPath}` },
    openGraph: {
      title,
      description,
      url: `https://www.staywillas.com${publicPath}`,
      type: "website",
      siteName: "Stay Willas",
      images: [{ url: image, alt: "Slatewood by Stay Willas private pool villa" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SlatewoodVillaPage() {
  const villa = await getCachedPublicVilla(SLATEWOOD_SLUG);
  if (!villa) notFound();

  const dbReviews = await getCachedReviews(villa.id);
  const reviews = dbReviews.map((review) => ({
    ...review,
    comment: normalizePublicCopy(review.comment, villa.slug),
  }));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const activeBookings =
    villa.id === SLATEWOOD_PREVIEW_ID
      ? []
      : await prisma.booking.findMany({
          where: {
            villaId: villa.id,
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

  const bookings = activeBookings.map((booking) => ({
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    status: booking.status,
    cottagesCount: 1,
  }));
  if (villa.id !== SLATEWOOD_PREVIEW_ID) {
    bookings.push(...getTemporaryAvailabilityBlocks(villa.slug));
  }

  return (
    <PropertyEditorialDetails
      key={villa.id}
      villa={villa}
      reviews={reviews}
      bookings={bookings}
      publicPath={publicPath}
    />
  );
}
