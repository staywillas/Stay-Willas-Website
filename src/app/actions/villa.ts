"use server";

import { prisma } from "@/lib/db";

interface ConciergeRecommendationParams {
  location: string;
  budget: string;
  guests: string;
}

export async function getConciergeRecommendation(params: ConciergeRecommendationParams) {
  try {
    // 1. Fetch all available villas
    const villas = await prisma.villa.findMany();
    if (villas.length === 0) return null;

    // 2. Parse guest input (e.g. "1-4 Guests" -> 1, "5-8 Guests" -> 5, "9+ Guests" -> 9)
    let minGuests = 1;
    if (params.guests.includes("5-8")) {
      minGuests = 5;
    } else if (params.guests.includes("9+")) {
      minGuests = 9;
    }

    // 3. Parse budget input (e.g. "₹10,000 - ₹25,000" or "₹25,000 - ₹50,000")
    let minBudget = 0;
    let maxBudget = 100000;
    if (params.budget.includes("10,000") && params.budget.includes("25,000")) {
      minBudget = 10000;
      maxBudget = 25000;
    } else if (params.budget.includes("25,000") && params.budget.includes("50,000")) {
      minBudget = 25000;
      maxBudget = 50000;
    }

    // 4. Perform dynamic filtering
    let filtered = villas.filter((villa) => {
      // Check location match (e.g., Lonavala vs Lonavala, Maharashtra)
      if (params.location && params.location !== "Anywhere") {
        const hasLoc = villa.location.toLowerCase().includes(params.location.toLowerCase());
        if (!hasLoc) return false;
      }

      // Check guest capacity limit
      if (villa.guests < minGuests) return false;

      // Check base price boundary
      if (villa.price > maxBudget) return false;

      return true;
    });

    // If no perfect match found, fallback to the primary available property
    if (filtered.length === 0) {
      // Look for the seeded Angled House
      const angled = villas.find(v => v.slug === "angled-house");
      filtered = angled ? [angled] : [villas[0]];
    }

    const villa = filtered[0];

    return {
      id: villa.slug, // Slug used as dynamic route identifier
      name: villa.name,
      location: villa.location.split(",")[0], // e.g. "Lonavala"
      image: villa.images[0] || "/images/hero-villa.png",
      price: villa.price.toLocaleString("en-IN"),
      guests: villa.guests,
      bedrooms: villa.bedrooms,
      bathrooms: villa.bathrooms,
    };
  } catch (error) {
    console.error("AI Concierge recommendation matching failed:", error);
    return null;
  }
}
