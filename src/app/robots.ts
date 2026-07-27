import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/homeowner", "/login", "/booking", "/api"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot-Extended",
          "Bytespider"
        ],
        allow: "/",
        disallow: ["/admin", "/dashboard", "/homeowner", "/login", "/api"],
      }
    ],
    sitemap: "https://www.staywillas.com/sitemap.xml",
  };
}
