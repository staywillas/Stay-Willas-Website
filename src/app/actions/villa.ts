"use server";

import { prisma } from "@/lib/db";

interface ConciergeRecommendationParams {
  location: string;
  budget: string;
  guests: string;
}

export async function getConciergeRecommendation(params: ConciergeRecommendationParams) {
  try {
    console.log("AI Concierge: Matching params:", params);
    // 1. Fetch all available villas
    const villas = await prisma.villa.findMany();
    console.log("AI Concierge: Total villas retrieved from DB:", villas.length);
    if (villas.length === 0) {
      console.log("AI Concierge: No villas found in DB.");
      return null;
    }

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
    console.log(`AI Concierge: Parsed filters: minGuests=${minGuests}, minBudget=${minBudget}, maxBudget=${maxBudget}`);

    // 4. Perform dynamic filtering
    // We strictly filter by maximum budget (we shouldn't show properties more expensive than maxBudget),
    // but we can allow cheaper properties (we'll prioritize those within the budget range).
    let filtered = villas.filter((villa) => {
      // Check location match (e.g., Lonavala vs Lonavala, Maharashtra)
      if (params.location && params.location !== "Anywhere") {
        const hasLoc = villa.location.toLowerCase().includes(params.location.toLowerCase());
        if (!hasLoc) return false;
      }

      // Check guest capacity limit
      if (villa.guests < minGuests) return false;

      // Check max budget limit
      if (villa.price > maxBudget) return false;

      return true;
    });

    // Sort to prioritize villas that are perfectly within the budget range,
    // and then sort by price descending to recommend the closest premium matches.
    filtered.sort((a, b) => {
      const aInRange = a.price >= minBudget && a.price <= maxBudget;
      const bInRange = b.price >= minBudget && b.price <= maxBudget;

      if (aInRange && !bInRange) return -1;
      if (!aInRange && bInRange) return 1;

      // If both are in range or both are out of range, sort by price descending (closest to budget)
      return b.price - a.price;
    });

    console.log("AI Concierge: Villas matching all criteria (sorted):", filtered.map(v => `${v.name} (₹${v.price})`));

    // If no match found under the budget limit, fallback to location-only matches
    if (filtered.length === 0 && params.location && params.location !== "Anywhere") {
      console.log("AI Concierge: No match under budget. Falling back to location match:", params.location);
      filtered = villas.filter((v) =>
        v.location.toLowerCase().includes(params.location.toLowerCase())
      );
      console.log("AI Concierge: Location-only match villas:", filtered.map(v => v.name));
    }

    // If still no match found, fallback to the seeded Angle House or the first available villa
    if (filtered.length === 0) {
      console.log("AI Concierge: No location match. Falling back to global default (The Angle House or first villa).");
      const angleHouse = villas.find((v) => v.slug === "the-angle-house");
      filtered = angleHouse ? [angleHouse] : [villas[0]];
    }

    const villa = filtered[0];
    console.log("AI Concierge: Recommending villa:", villa.name);

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
