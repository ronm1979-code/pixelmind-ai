import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search", "/compare"],
    },
    sitemap: "https://pixelmind-ai-delta.vercel.app/sitemap.xml",
  };
}
