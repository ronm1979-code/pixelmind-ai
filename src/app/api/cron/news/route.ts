import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

export const maxDuration = 300; // 5 minutes

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getPrisma() {
  const adapter = new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

const SYSTEM_PROMPT = `You are an AI news journalist for PixelMind, an AI intelligence website.

Your job:
1. Search the web for the latest AI news from the past 24 hours
2. Pick 2-3 of the most significant stories
3. Write a full professional article for each story
4. Save each article using the create_article tool

Article rules:
- Title: clear headline, max 80 chars
- Slug: kebab-case unique identifier, max 60 chars
- Excerpt: 1-2 sentences, max 200 chars
- Content: 4+ paragraphs of HTML using <p>, <h2>, <ul>, <li>, <strong>
- Category: models | products | companies | research | industry
- Source: publication name
- SourceUrl: original article URL
- Image: relevant Unsplash URL https://images.unsplash.com/photo-{id}?w=800&q=80

Focus on: model releases, funding, product launches, research breakthroughs, industry news.
Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

const createArticleTool: Anthropic.Tool = {
  name: "create_article",
  description: "Save a finished news article to the database.",
  input_schema: {
    type: "object",
    required: ["title", "slug", "excerpt", "content", "category", "source"],
    properties: {
      title:     { type: "string" },
      slug:      { type: "string" },
      excerpt:   { type: "string" },
      content:   { type: "string" },
      category:  { type: "string", enum: ["models", "products", "companies", "research", "industry"] },
      source:    { type: "string" },
      sourceUrl: { type: "string" },
      image:     { type: "string" },
    },
  },
};

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron (or manually with the secret)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  const created: string[] = [];

  try {
    // Get recent articles to avoid duplicates
    const recent = await prisma.article.findMany({
      select: { title: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const recentTitles = recent.map((a) => `- ${a.title}`).join("\n");

    const userMessage = `Search for the latest AI news from the past 24 hours and write 2-3 articles.
${recentTitles.length ? `\nAvoid these recently covered topics:\n${recentTitles}` : ""}`;

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
    ];

    let pauseCount = 0;

    while (true) {
      const response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        tools: [
          { type: "web_search_20260209" as any, name: "web_search" },
          createArticleTool,
        ],
        messages,
      });

      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "end_turn") break;

      if (response.stop_reason === "pause_turn") {
        if (++pauseCount > 5) break;
        continue;
      }

      if (response.stop_reason === "tool_use") {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type !== "tool_use") continue;

          if (block.name === "create_article") {
            const input = block.input as {
              title: string; slug: string; excerpt: string; content: string;
              category: string; source: string; sourceUrl?: string; image?: string;
            };

            const exists = await prisma.article.count({ where: { slug: input.slug } });
            let result: string;

            if (exists > 0) {
              result = `Skipped: slug "${input.slug}" already exists.`;
            } else {
              await prisma.article.create({
                data: { ...input, published: true, updatedAt: new Date() },
              });
              created.push(input.title);
              result = `Created: "${input.title}"`;
            }

            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
          }
        }

        messages.push({ role: "user", content: toolResults });
      }
    }

    return NextResponse.json({
      success: true,
      created,
      count: created.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
