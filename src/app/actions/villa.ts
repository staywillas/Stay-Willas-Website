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

    // 3. Parse budget input dynamically (e.g. "₹10,000 - ₹15,000" -> min: 10000, max: 15000)
    let minBudget = 0;
    let maxBudget = 1000000;
    const numbers = params.budget.match(/\d+[\d,.]*/g);
    if (numbers && numbers.length >= 2) {
      minBudget = parseInt(numbers[0].replace(/,/g, ""), 10);
      maxBudget = parseInt(numbers[1].replace(/,/g, ""), 10);
    } else if (numbers && numbers.length === 1) {
      const num = parseInt(numbers[0].replace(/,/g, ""), 10);
      if (params.budget.toLowerCase().includes("under") || params.budget.toLowerCase().includes("below")) {
        maxBudget = num;
      } else if (params.budget.toLowerCase().includes("above") || params.budget.toLowerCase().includes("over")) {
        minBudget = num;
      }
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

      // Check price range boundaries (both min and max)
      if (villa.price < minBudget || villa.price > maxBudget) return false;

      return true;
    });

    // If no perfect match found, try to fall back to a villa in the selected location first
    if (filtered.length === 0 && params.location && params.location !== "Anywhere") {
      filtered = villas.filter((v) =>
        v.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    // If still no match found, fallback to the seeded Angled House or the first available villa
    if (filtered.length === 0) {
      const angled = villas.find((v) => v.slug === "angled-house");
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
