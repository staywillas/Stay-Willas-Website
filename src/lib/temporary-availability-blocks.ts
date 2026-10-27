/**
 * Temporary calendar fixture requested for the Angle House availability review.
 * Remove this entry after the calendar test is complete.
 */
const TEMPORARY_AVAILABILITY_BLOCKS = [
  {
    villaSlug: "the-angle-house",
    checkIn: "2026-10-29",
    checkOut: "2026-10-30",
  },
] as const;

function getDateKey(value: string | Date) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTemporaryAvailabilityBlocks(villaSlug: string) {
  return TEMPORARY_AVAILABILITY_BLOCKS
    .filter((block) => block.villaSlug === villaSlug)
    .map((block) => ({
      // Keep the fixture as local midnight so clients in different timezones
      // still see the intended calendar dates.
      checkIn: `${block.checkIn}T00:00:00`,
      checkOut: `${block.checkOut}T00:00:00`,
      status: "BLOCKED",
      cottagesCount: 1,
    }));
}

export function hasTemporaryAvailabilityConflict(
  villaSlug: string,
  checkIn: string | Date,
  checkOut: string | Date,
) {
  const start = getDateKey(checkIn);
  const end = getDateKey(checkOut);
  if (!start || !end || start >= end) return false;

  return TEMPORARY_AVAILABILITY_BLOCKS.some((block) =>
    block.villaSlug === villaSlug && start < block.checkOut && end > block.checkIn,
  );
}
