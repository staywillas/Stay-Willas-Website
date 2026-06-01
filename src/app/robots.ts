import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/homeowner", "/login", "/booking", "/api"],
      },
    ],
    sitemap: "https://staywillas.com/sitemap.xml",
  };
}
