import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://pixelmind-ai-delta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, guides, tools, reviews] = await Promise.all([
    prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.guide.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.tool.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.review.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...articles.map((a) => ({ url: `${BASE}/news/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...guides.map((g) => ({ url: `${BASE}/guides/${g.slug}`, lastModified: g.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...tools.map((t) => ({ url: `${BASE}/tools/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...reviews.map((r) => ({ url: `${BASE}/reviews/${r.slug}`, lastModified: r.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
