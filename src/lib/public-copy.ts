/** Small copy cleanups for public villa data that may still be in the database. */
export function normalizePublicCopy(value: string, slug?: string): string {
  let copy = value;

  if (slug === "willow-peak") {
    copy = copy
      .replace(/\b(?:the\s+)?(?:entire|full|whole)\s+Willow Peak\s+estate\b/gi, "all three Willow Peak cottages")
      .replace(/\bWillow Peak estate\b/gi, "Willow Peak property")
      .replace(/\bthe estate\b/gi, "the property")
      .replace(/\bestates\b/gi, "properties")
      .replace(/\bestate\b/gi, "property");
  } else {
    copy = copy
      .replace(/\bPrivate Estates\b/gi, "Private Villas")
      .replace(/\bestates\b/gi, "villas")
      .replace(/\bestate\b/gi, "villa");
  }

  return copy
    .replace(/\bescape\s+to\b/gi, (match) =>
      match === match.toUpperCase() ? "ENJOY A STAY AT" : match[0] === "E" ? "Enjoy a stay at" : "enjoy a stay at",
    )
    .replace(/\bescapes\b/gi, (match) =>
      match === match.toUpperCase() ? "GETAWAYS" : match[0] === "E" ? "Getaways" : "getaways",
    )
    .replace(/\bescape\b/gi, (match) =>
      match === match.toUpperCase() ? "GETAWAY" : match[0] === "E" ? "Getaway" : "getaway",
    );
}

export function publicVillaName(slug: string, name: string): string {
  if (slug === "willow-peak") return "Willow Peak";
  return normalizePublicCopy(name, slug);
}

export function publicVillaCategory(category: string): string {
  return normalizePublicCopy(category);
}

export function publicVillaAmenities(amenities: string[], slug: string): string[] {
  return amenities.map((amenity) => {
    if (slug === "willow-peak" && /exclusive estate/i.test(amenity)) {
      return "3 Standalone Cottages (All Booked Together)";
    }
    return normalizePublicCopy(amenity, slug);
  });
}
