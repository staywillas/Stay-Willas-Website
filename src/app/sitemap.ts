import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = "https://www.staywillas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/villas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/experiences`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/areas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic area routes
  const regions = ["lonavala", "alibaug", "karjat", "khopoli", "goa", "igatpuri"];
  const areaRoutes: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${BASE_URL}/areas/${region}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Dynamic villa routes from database
  let villaRoutes: MetadataRoute.Sitemap = [];
  try {
    const villas = await prisma.villa.findMany({
      select: { slug: true, updatedAt: true },
    });
    villaRoutes = villas.map((villa) => ({
      url: `${BASE_URL}/villa/${villa.slug}`,
      lastModified: villa.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If DB is unavailable during build, return static routes only
  }

  return [...staticRoutes, ...areaRoutes, ...villaRoutes];
}
