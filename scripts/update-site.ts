/**
 * update-site.ts - RSS Feed Aggregator for PixelMind
 *
 * Fetches AI news from official AI company blogs and top publications.
 * Run: npx tsx scripts/update-site.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RSSFeed {
  name: string;
  url: string;
  category: string;
}

interface ParsedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: string;
  image?: string;
}

// Official AI company blogs + top AI publications
const RSS_FEEDS: RSSFeed[] = [
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "models",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.research.google/feeds/posts/default",
    category: "models",
  },
  {
    name: "Anthropic Blog",
    url: "https://www.anthropic.com/rss.xml",
    category: "models",
  },
  {
    name: "DeepMind Blog",
    url: "https://deepmind.google/blog/rss.xml",
    category: "research",
  },
  {
    name: "Meta AI Blog",
    url: "https://ai.meta.com/blog/rss/",
    category: "research",
  },
  {
    name: "Microsoft AI Blog",
    url: "https://blogs.microsoft.com/ai/feed/",
    category: "products",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "industry",
  },
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "companies",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

function extractText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1];
}

async function fetchRSS(feed: RSSFeed): Promise<ParsedArticle[]> {
  try {
    console.log(`  Fetching ${feed.name}...`);
    const response = await fetch(feed.url, {
      headers: {
        "User-Agent": "PixelMind AI News Aggregator/1.0",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      console.log(`  ⚠ ${feed.name}: HTTP ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const articles: ParsedArticle[] = [];

    // Match both RSS <item> and Atom <entry> elements
    const items = [
      ...(xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? []),
      ...(xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? []),
    ];

    for (const item of items.slice(0, 8)) {
      const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch =
        item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/) ||
        item.match(/<link[^>]*>(?:<!\[CDATA\[)?(https?[^\s<\]]+)(?:\]\]>)?<\/link>/i);
      const descMatch = item.match(/<(?:description|summary)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|summary)>/i);
      const contentMatch = item.match(/<(?:content:encoded|content)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:content:encoded|content)>/i);

      const title = titleMatch ? extractText(titleMatch[1]) : "";
      const link = linkMatch ? extractText(linkMatch[1] || linkMatch[0]) : "";
      const desc = descMatch ? descMatch[1] : "";
      const content = contentMatch ? contentMatch[1] : desc;

      if (!title || title.length < 5) continue;

      const excerpt = extractText(desc).slice(0, 250);
      const image = extractImage(content) || extractImage(desc);

      articles.push({
        title,
        slug: slugify(title),
        excerpt: excerpt || title,
        content: `<p>${excerpt}</p><p><a href="${link}" target="_blank" rel="noopener">Read the full article on ${feed.name} →</a></p>`,
        source: feed.name,
        sourceUrl: link,
        category: feed.category,
        image,
      });
    }

    console.log(`  ✓ ${feed.name}: ${articles.length} article${articles.length !== 1 ? "s" : ""}`);
    return articles;
  } catch (error) {
    console.log(`  ✗ ${feed.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
    return [];
  }
}

async function main() {
  console.log("🔄 PixelMind RSS Update — Official AI Sources\n");

  let added = 0;
  let skipped = 0;

  for (const feed of RSS_FEEDS) {
    const articles = await fetchRSS(feed);

    for (const article of articles) {
      const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
      if (existing) { skipped++; continue; }

      try {
        await prisma.article.create({ data: article });
        added++;
        console.log(`  + ${article.title.slice(0, 70)}`);
      } catch {
        skipped++;
      }
    }
  }

  console.log(`\n✅ Done: ${added} new articles added, ${skipped} skipped`);
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
