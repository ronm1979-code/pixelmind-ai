import Anthropic from "@anthropic-ai/sdk";
import { prisma, articleExists } from "./db";

// Tool definitions sent to Claude
export const customTools: Anthropic.Tool[] = [
  {
    name: "create_article",
    description: "Save a finished news article to the PixelMind database. Call this once per article after writing it.",
    input_schema: {
      type: "object" as const,
      required: ["title", "slug", "excerpt", "content", "category", "source"],
      properties: {
        title:     { type: "string", description: "Article headline" },
        slug:      { type: "string", description: "Unique kebab-case URL identifier, max 60 chars" },
        excerpt:   { type: "string", description: "1-2 sentence summary, max 200 chars" },
        content:   { type: "string", description: "Full article body as HTML with <p>, <h2>, <ul>, <li>, <strong>" },
        category:  { type: "string", enum: ["models", "products", "companies", "research", "industry"] },
        source:    { type: "string", description: "Publication name, e.g. 'TechCrunch'" },
        sourceUrl: { type: "string", description: "URL of original article" },
        image:     { type: "string", description: "Relevant Unsplash image URL: https://images.unsplash.com/photo-{id}?w=800&q=80" },
      },
    },
  },
];

export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  if (name === "create_article") {
    const { slug, title, excerpt, content, category, source, sourceUrl, image } = input as {
      slug: string; title: string; excerpt: string; content: string;
      category: string; source: string; sourceUrl?: string; image?: string;
    };

    // Prevent duplicates
    if (await articleExists(slug)) {
      return `Skipped: article with slug "${slug}" already exists.`;
    }

    await prisma.article.create({
      data: { title, slug, excerpt, content, category, source, sourceUrl, image, published: true, updatedAt: new Date() },
    });

    console.log(`✅ Created: "${title}"`);
    return `Article "${title}" created successfully at /news/${slug}`;
  }

  return `Unknown tool: ${name}`;
}
