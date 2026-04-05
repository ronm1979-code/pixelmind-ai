import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [articles, guides, tools] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      select: { title: true, slug: true, views: true, createdAt: true },
      orderBy: { views: "desc" },
      take: 10,
    }),
    prisma.guide.findMany({
      where: { published: true },
      select: { title: true, slug: true, views: true },
      orderBy: { views: "desc" },
      take: 10,
    }),
    prisma.tool.findMany({
      select: { name: true, slug: true, views: true },
      orderBy: { views: "desc" },
      take: 10,
    }),
  ]);

  const totalViews =
    articles.reduce((s, a) => s + a.views, 0) +
    guides.reduce((s, g) => s + g.views, 0) +
    tools.reduce((s, t) => s + t.views, 0);

  return NextResponse.json({
    totalViews,
    topArticles: articles,
    topGuides: guides,
    topTools: tools,
  });
}
