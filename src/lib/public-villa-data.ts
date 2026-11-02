import React from "react";
import { prisma } from "@/lib/db";
import {
  nieevantPreviewVilla,
  nieevantVillaData,
  NIEEVANT_SLUG,
} from "@/data/nieevant-villa";
import {
  SLATEWOOD_SLUG,
  slatewoodPreviewVilla,
  slatewoodVillaData,
} from "@/data/slatewood-villa";
import {
  normalizePublicCopy,
  publicVillaAmenities,
  publicVillaCategory,
  publicVillaName,
} from "@/lib/public-copy";

async function fetchPublicVilla(slug: string) {
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

  const savedVilla =
    (await prisma.villa.findUnique({ where: { slug }, include })) ??
    (await prisma.villa.findUnique({ where: { id: slug }, include }));
  const previewVilla =
    slug === NIEEVANT_SLUG
      ? nieevantPreviewVilla
      : slug === SLATEWOOD_SLUG
        ? slatewoodPreviewVilla
        : null;
  const villa =
    savedVilla ??
    (previewVilla
      ? { ...previewVilla, dailyPrices: [], seasonalPrices: [] }
      : null);
  if (!villa) return null;

  return {
    ...villa,
    images:
      villa.slug === NIEEVANT_SLUG
        ? nieevantVillaData.images
        : villa.slug === SLATEWOOD_SLUG
          ? slatewoodVillaData.images
          : villa.images,
    name: publicVillaName(villa.slug, villa.name),
    description: normalizePublicCopy(villa.description, villa.slug),
    category: publicVillaCategory(villa.category),
    amenities: publicVillaAmenities(villa.amenities, villa.slug),
  };
}

export const getCachedPublicVilla = React.cache
  ? React.cache(fetchPublicVilla)
  : fetchPublicVilla;
