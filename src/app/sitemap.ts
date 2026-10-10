import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { blogsData } from "@/data/blogs";

const BASE_URL = "https://www.staywillas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Omit lastmod for static pages without a recorded editorial update date.

  // 1. Primary Core Landing & High-Intent Conversion Sitelinks
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/villas`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/escape`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/destinations`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/experiences`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/partner`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cancellation-policy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Area Destination Hubs
  const regions = [
    "lonavala",
    "khopoli",
    "panchgani"
  ];
  const areaRoutes: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${BASE_URL}/areas/${region}`,
    changeFrequency: "daily" as const,
    priority: region === "lonavala" ? 0.98 : 0.95,
  }));

  // 3. Blog Post & Travel Guide Sitelinks
  const highPriorityBlogs = new Set([
    "lonavala-vs-khandala-villa-comparison",
    "lonavala-villa-willow-peak-staycation-guide",
    "affordable-villa-lonavala-willow-peak-budget-luxury",
    "family-villas-in-lonavala-with-private-pool",
    "3-bhk-4-bhk-villa-in-lonavala-with-private-pool-price-guide",
    "panchgani-valley-view-villas-near-mapro-garden-guide",
    "panchgani-vs-mahabaleshwar-villa-stay-for-groups",
    "lonavala-stay-villa-private-pool-guide",
    "best-villas-for-stay-in-lonavala-family-groups"
  ]);
  const blogRoutes: MetadataRoute.Sitemap = blogsData.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.date),
    changeFrequency: "weekly" as const,
    priority: highPriorityBlogs.has(blog.slug) ? 0.92 : 0.75,
  }));

  // 4. Dynamic Villa Estate Sitelinks from Database
  const topVillaSlugs = new Set(["the-angle-house", "canopy-crest", "willow-peak"]);
  let villaRoutes: MetadataRoute.Sitemap = [];
  try {
    const villas = await prisma.villa.findMany({
      select: { slug: true, updatedAt: true },
    });
    villaRoutes = villas.map((villa) => ({
      url: `${BASE_URL}/villa/${villa.slug}`,
      lastModified: villa.updatedAt,
      changeFrequency: "daily" as const,
      priority: topVillaSlugs.has(villa.slug) ? 0.98 : 0.9,
    }));
  } catch {
    // If DB is unavailable during build, fallback to known core villas
    villaRoutes = [
      {
        url: `${BASE_URL}/villa/the-angle-house`,
        changeFrequency: "daily" as const,
        priority: 0.98,
      },
      {
        url: `${BASE_URL}/villa/canopy-crest`,
        changeFrequency: "daily" as const,
        priority: 0.98,
      },
      {
        url: `${BASE_URL}/villa/willow-peak`,
        changeFrequency: "daily" as const,
        priority: 0.98,
      },
      {
        url: `${BASE_URL}/villa/casa-de-reva`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/villa/willow-peak-cottage-a`,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      },
      {
        url: `${BASE_URL}/villa/willow-peak-cottage-b`,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      },
      {
        url: `${BASE_URL}/villa/willow-peak-cottage-c`,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      },
    ];
  }

  // 5. High-Intent Celebration & Occasion Landing Pages (Zero-Cannibalization Intent)
  const occasionRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/private-villa-for-birthday-celebration-near-mumbai`,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/anniversary-celebration-villa-with-private-pool`,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${BASE_URL}/milestone-birthday-celebration-villa-maharashtra`,
      changeFrequency: "weekly",
      priority: 0.90,
    },
    {
      url: `${BASE_URL}/private-pool-party-villa-near-pune-for-family`,
      changeFrequency: "weekly",
      priority: 0.90,
    },
  ];

  return [...staticRoutes, ...areaRoutes, ...blogRoutes, ...villaRoutes, ...occasionRoutes];
}
