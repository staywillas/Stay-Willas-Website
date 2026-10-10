import { blogsData, type BlogPost } from "./blogs";

export const guideTopics = [
  { id: "choosing", title: "Choose and budget for your stay", slugs: [
    "lonavala-vs-khandala-villa-comparison", "khopoli-vs-lonavala-villa-comparison",
    "3-bhk-4-bhk-villa-in-lonavala-with-private-pool-price-guide", "top-villas-in-lonavala-with-private-pool-guide",
    "villas-in-lonavala-luxury-guide", "lonavala-stay-villa-private-pool-guide", "best-villas-for-stay-in-lonavala-family-groups",
  ] },
  { id: "khopoli", title: "Khopoli groups, Imagica and team trips", slugs: [
    "best-villas-near-imagica-khopoli-with-private-pool", "things-to-do-near-adlabs-imagica-khopoli",
    "48-hour-weekend-itinerary-private-pool-villa-khopoli", "best-khopoli-villa-for-large-groups",
    "large-group-villa-staycation-khopoli-private-pool", "corporate-offsite-checklist-for-a-khopoli-villa",
    "corporate-offsite-startup-team-retreat-villas-khopoli", "skip-lonavala-traffic-khopoli-weekend-villa-getaway",
    "why-khopoli-is-mumbais-top-luxury-villa-escape",
  ] },
  { id: "couples", title: "Willow Peak cottages and couples' stays", slugs: [
    "romantic-a-frame-cottages-lonavala-couples-guide", "lonavala-villa-willow-peak-staycation-guide",
    "affordable-villa-lonavala-willow-peak-budget-luxury", "villas-in-lonavala-under-5000-with-pool-willow-peak",
    "villas-in-lonavala-under-10000-with-private-pool-willow-peak",
  ] },
  { id: "family", title: "Families, pets and celebrations", slugs: [
    "family-villas-in-lonavala-with-private-pool", "best-villa-in-lonavala-for-birthday-parties-family-reunions",
    "pet-friendly-villas-near-mumbai-why-the-angle-house", "pet-friendly-villa-rules-near-mumbai-what-to-know",
  ] },
  { id: "local", title: "Lonavala attractions and itineraries", slugs: [
    "ultimate-2-day-lonavala-weekend-itinerary", "top-7-hidden-gems-secret-viewpoints-in-lonavala",
    "villas-near-pawna-lake-lonavala", "villa-near-lohagad-fort-trek-lonavala",
    "villas-near-ekvira-devi-temple-lonavala", "best-lake-view-villas-in-lonavala-for-peaceful-retreats",
    "mumbai-to-lonavala-khopoli-road-trip-guide",
  ] },
  { id: "experiences", title: "Food, workations and time outdoors", slugs: [
    "luxury-villa-dining-private-chef-experience-lonavala", "farm-to-table-and-chulha-culinary-heritage-villas",
    "work-from-villa-staycation-guide-near-mumbai-pune", "stargazing-and-astrophotography-staycations-near-mumbai-pune",
  ] },
  { id: "seasonal", title: "Weekend routes and seasonal planning", slugs: [
    "best-weekend-getaways-near-mumbai-for-family-and-friends", "best-weekend-getaways-near-pune-for-family-and-friends",
    "lonavala-villa-monsoon-weekend-guide", "khopoli-waterfall-monsoon-villa-guide",
  ] },
  { id: "panchgani", title: "Panchgani and Kaswand stays", slugs: [
    "panchgani-valley-view-villas-near-mapro-garden-guide", "panchgani-vs-mahabaleshwar-villa-stay-for-groups",
  ] },
  { id: "owners", title: "For villa owners", slugs: ["how-to-partner-with-stay-willas-monetize-luxury-villa"] },
] as const;

export function getGuideTopic(slug: string) {
  return guideTopics.find(topic => (topic.slugs as readonly string[]).includes(slug));
}

export function getRelatedGuides(blog: BlogPost, limit = 3): BlogPost[] {
  const topic = getGuideTopic(blog.slug);
  if (!topic) return [];
  const slugs: readonly string[] = topic.slugs;
  const start = slugs.indexOf(blog.slug);
  // Rotate within the editorial topic: every guest guide gets relevant incoming links.
  return Array.from({ length: Math.min(limit, slugs.length - 1) }, (_, offset) =>
    blogsData.find(candidate => candidate.slug === slugs[(start + offset + 1) % slugs.length])
  ).filter((candidate): candidate is BlogPost => Boolean(candidate));
}

export function getGuideBookingLinks(blog: BlogPost) {
  const topic = getGuideTopic(blog.slug)?.id;
  if (topic === "owners") return [{ href: "/partner", label: "Explore Stay Willas property management" }];
  if (topic === "panchgani") return [
    { href: "/areas/panchgani", label: "Explore Panchgani private pool stays" },
    { href: "/villa/casa-de-reva", label: "See Casa De Reva in Kaswand" },
  ];
  if (topic === "khopoli" || blog.slug.includes("khopoli-waterfall")) return [
    { href: "/areas/khopoli", label: "Explore private pool villas in Khopoli" },
    { href: "/villa/canopy-crest", label: "See Canopy Crest: up to 16 guests" },
  ];
  if (topic === "couples") return [
    { href: "/villa/willow-peak", label: "Explore Willow Peak Jacuzzi cottages" },
    { href: "/anniversary-celebration-villa-with-private-pool", label: "Plan an anniversary stay" },
  ];
  if (topic === "seasonal" || topic === "experiences") return [
    { href: "/destinations", label: "Compare our three villa destinations" },
    { href: "/villas", label: "Browse pool villas and Jacuzzi cottages" },
  ];
  return [
    { href: "/areas/lonavala", label: "Compare Lonavala pool villas and Jacuzzi cottages" },
    { href: "/villa/the-angle-house", label: "See The Angle House in Kamshet" },
  ];
}

export const destinationGuides: Record<string, string[]> = {
  lonavala: ["lonavala-vs-khandala-villa-comparison", "3-bhk-4-bhk-villa-in-lonavala-with-private-pool-price-guide", "family-villas-in-lonavala-with-private-pool", "top-7-hidden-gems-secret-viewpoints-in-lonavala"],
  khopoli: ["khopoli-vs-lonavala-villa-comparison", "best-villas-near-imagica-khopoli-with-private-pool", "best-khopoli-villa-for-large-groups", "corporate-offsite-checklist-for-a-khopoli-villa"],
  panchgani: ["panchgani-valley-view-villas-near-mapro-garden-guide", "panchgani-vs-mahabaleshwar-villa-stay-for-groups"],
};

export function getPropertyGuides(slug: string): string[] {
  if (slug === "canopy-crest") return destinationGuides.khopoli;
  if (slug === "casa-de-reva") return destinationGuides.panchgani;
  if (slug.startsWith("willow-peak")) return ["romantic-a-frame-cottages-lonavala-couples-guide", "villas-in-lonavala-under-5000-with-pool-willow-peak", "villas-in-lonavala-under-10000-with-private-pool-willow-peak"];
  if (slug === "the-angle-house") return ["family-villas-in-lonavala-with-private-pool", "pet-friendly-villas-near-mumbai-why-the-angle-house", "3-bhk-4-bhk-villa-in-lonavala-with-private-pool-price-guide", "best-villa-in-lonavala-for-birthday-parties-family-reunions"];
  return [];
}
