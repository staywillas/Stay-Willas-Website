import type { Villa } from "@prisma/client";
import { nieevantGallery } from "@/data/nieevant-images";

export const NIEEVANT_SLUG = "nieevant-by-stay-willas";
export const NIEEVANT_PREVIEW_ID = "nieevant-local-preview";

export const nieevantVillaData: Omit<Villa, "id" | "createdAt" | "updatedAt"> = {
  slug: NIEEVANT_SLUG,
  name: "Nieevant by Stay Willas",
  location: "Plot No. 8, Nalavade Farms, Hatond Village, Khopoli, Maharashtra 410205",
  description:
    "A 3-bedroom hilltop villa in Hatond Village, Khopoli, with a private swimming pool and room for up to 15 guests. Enjoy open valley views, a terrace and balcony, air conditioning, Wi-Fi, private parking and comfortable shared living spaces. Barbecue service is available for an additional charge. The listed rate starts at ₹19,999 per night plus taxes; confirm your dates and final quote with our team.",
  price: 19999,
  guests: 15,
  baseGuests: 15,
  extraGuestFee: 0,
  bedrooms: 3,
  bathrooms: 3,
  images: nieevantGallery.map((photo) => photo.src),
  amenities: [
    "Private swimming pool",
    "Air conditioning",
    "Private parking",
    "Barbecue (chargeable)",
    "Sofa",
    "Dining table",
    "Flat-screen TV",
    "Wardrobe",
    "Refrigerator",
    "Wi-Fi",
    "Balcony",
    "Terrace",
  ],
  category: "Mountain View",
  weekendPrice: null,
  fridayPrice: null,
  saturdayPrice: null,
  sundayPrice: null,
  iCalUrl: null,
};

export const nieevantPreviewVilla: Villa = {
  ...nieevantVillaData,
  id: NIEEVANT_PREVIEW_ID,
  createdAt: new Date("2026-10-31T00:00:00.000Z"),
  updatedAt: new Date("2026-10-31T00:00:00.000Z"),
};

export function withNieevantFallback<T extends { slug: string }>(villas: T[]): T[] {
  if (villas.some((villa) => villa.slug === NIEEVANT_SLUG)) return villas;
  return [...villas, nieevantPreviewVilla as unknown as T];
}
