export type GuestPricing = {
  includedGuests: number;
  extraGuestFee: number;
};

/**
 * Keep the two signed-off property policies compatible with existing seeded
 * data while allowing an intentional admin edit to remain the source of truth.
 */
export function getGuestPricing(
  slug: string,
  configuredIncludedGuests: number | null | undefined,
  configuredExtraGuestFee: number | null | undefined,
  maxGuests: number,
): GuestPricing {
  const configured = {
    includedGuests: configuredIncludedGuests ?? maxGuests,
    extraGuestFee: configuredExtraGuestFee ?? 0,
  };

  if (
    slug === "the-angle-house" &&
    (
      (configuredIncludedGuests == null && configuredExtraGuestFee == null) ||
      (configured.includedGuests === 8 && configured.extraGuestFee === 1000)
    )
  ) {
    return { includedGuests: 6, extraGuestFee: 1200 };
  }

  if (
    slug === "canopy-crest" &&
    (
      (configuredIncludedGuests == null && configuredExtraGuestFee == null) ||
      (configured.includedGuests === 12 && configured.extraGuestFee === 1200)
    )
  ) {
    return { includedGuests: 8, extraGuestFee: 1200 };
  }

  return configured;
}
