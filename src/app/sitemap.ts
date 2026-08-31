import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { blogsData } from "@/data/blogs";

const BASE_URL = "https://www.staywillas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Primary Core Landing & High-Intent Conversion Sitelinks
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/villas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/escape`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/areas`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/experiences`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/partner`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cancellation-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Area Destination Hubs
  const regions = [
    "lonavala",
    "khopoli",
    "pawna"
  ];
  const areaRoutes: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${BASE_URL}/areas/${region}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // 3. Blog Post & Travel Guide Sitelinks
  const blogRoutes: MetadataRoute.Sitemap = blogsData.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // 4. Dynamic Villa Estate Sitelinks from Database
  let villaRoutes: MetadataRoute.Sitemap = [];
  try {
    const villas = await prisma.villa.findMany({
      select: { slug: true, updatedAt: true },
    });
    villaRoutes = villas.map((villa) => ({
      url: `${BASE_URL}/villa/${villa.slug}`,
      lastModified: villa.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    // If DB is unavailable during build, fallback to known core villas
    villaRoutes = [
      {
        url: `${BASE_URL}/villa/the-angle-house`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/villa/canopy-crest`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/villa/willow-peak`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
    ];
  }

  return [...staticRoutes, ...areaRoutes, ...blogRoutes, ...villaRoutes];
}
