import type { Villa } from "@prisma/client";

export const SLATEWOOD_SLUG = "slatewood";
export const SLATEWOOD_PREVIEW_ID = "slatewood-local-preview";

export const slatewoodVillaData: Omit<Villa, "id" | "createdAt" | "updatedAt"> = {
  slug: SLATEWOOD_SLUG,
  name: "Slatewood by Stay Willas",
  location: "Location shared by the concierge",
  description:
    "Slatewood by Stay Willas is a 3-bedroom private infinity pool villa on a landscaped 1.5-acre estate. Each air-conditioned bedroom has an attached bathroom. The living hall has two air conditioners and a kitchenette. Outdoors, guests can enjoy a 14 × 22 ft infinity-edge pool, 4.5 ft deep, a garden, lawn, gazebo, butterfly-attracting plants and a dedicated 6 × 35 ft turf. Private parking is available for 3–4 cars on the upper level. The base rate is ₹13,000 per night for up to 6 guests; each additional guest is ₹1,200 per night, up to 12 guests. Confirm the final quote with our team. Contact the concierge for the exact location and availability.",
  price: 13000,
  guests: 12,
  baseGuests: 6,
  extraGuestFee: 1200,
  bedrooms: 3,
  bathrooms: 3,
  images: [
    "/assets/villas/slatewood/drive-slatewood-exterior-evening.webp",
    "/assets/villas/slatewood/drive-slatewood-estate-aerial.webp",
    "/assets/villas/slatewood/drive-slatewood-infinity-pool.webp",
    "/assets/villas/slatewood/drive-slatewood-living-room.webp",
    "/assets/villas/slatewood/drive-slatewood-bedroom-window.webp",
    "/assets/villas/slatewood/drive-slatewood-dining.webp",
    "/assets/villas/slatewood/drive-slatewood-kitchenette.webp",
    "/assets/villas/slatewood/drive-slatewood-bedroom.webp",
    "/assets/villas/slatewood/drive-slatewood-living-area.webp",
    "/assets/villas/slatewood/drive-slatewood-exterior-day.webp",
    "/assets/villas/slatewood/drive-slatewood-garden-gazebo.webp",
    "/assets/villas/slatewood/drive-slatewood-bedroom-three.webp",
    "/assets/villas/slatewood/drive-slatewood-bathroom.webp",
    "/assets/villas/slatewood/drive-slatewood-pool-evening.webp",
    "/assets/villas/slatewood/drive-slatewood-dining-angle.webp",
    "/assets/villas/slatewood/drive-slatewood-bedroom-angle.webp",
  ],
  amenities: [
    "Private infinity-edge swimming pool",
    "Three air-conditioned bedrooms",
    "Attached bathrooms",
    "Living hall with two air conditioners",
    "Kitchenette",
    "Garden and lawn",
    "Gazebo",
    "Butterfly-attracting plants",
    "Dedicated 6 × 35 ft turf",
    "Private parking for 3–4 cars",
  ],
  category: "Private Estate",
  weekendPrice: null,
  fridayPrice: null,
  saturdayPrice: null,
  sundayPrice: null,
  iCalUrl: null,
};

export const slatewoodPreviewVilla: Villa = {
  ...slatewoodVillaData,
  id: SLATEWOOD_PREVIEW_ID,
  createdAt: new Date("2026-11-02T00:00:00.000Z"),
  updatedAt: new Date("2026-11-02T00:00:00.000Z"),
};

export function withSlatewoodFallback<T extends { slug: string }>(villas: T[]): T[] {
  if (villas.some((villa) => villa.slug === SLATEWOOD_SLUG)) return villas;
  return [...villas, slatewoodPreviewVilla as unknown as T];
}
