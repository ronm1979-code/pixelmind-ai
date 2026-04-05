import Anthropic from "@anthropic-ai/sdk";
import { customTools, executeTool } from "./tools";
import { getRecentSlugs } from "./db";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an AI news journalist for PixelMind, an AI intelligence website.

Your job:
1. Search the web for the latest AI news from the past 24 hours
2. Pick 2-3 of the most significant stories
3. Write a full professional article for each story
4. Save each article using the create_article tool

Article writing rules:
- Title: clear, informative, max 80 chars
- Slug: kebab-case, unique, max 60 chars (e.g. "openai-releases-gpt5-model")
- Excerpt: 1-2 sentences summarizing the story, max 200 chars
- Content: at least 4 paragraphs of HTML using <p>, <h2>, <ul>, <li>, <strong> tags
- Category: one of: models | products | companies | research | industry
- Source: the publication name
- SourceUrl: the original article URL
- Image: find a relevant Unsplash photo URL for the topic

Focus on: new model releases, funding rounds, product launches, research papers, industry news.
Avoid: opinion pieces, speculation, duplicate topics.
Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

async function runNewsAgent() {
  console.log("🤖 PixelMind News Agent starting...\n");

  // Get recent articles to avoid duplicates
  const recentTitles = await getRecentSlugs();
  const avoidList = recentTitles.length > 0
    ? `\n\nAvoid covering these recently published topics:\n${recentTitles.map(t => `- ${t}`).join("\n")}`
    : "";

  const userMessage = `Search for the latest AI news from the past 24 hours and write 2-3 articles for the PixelMind website.${avoidList}

Search for breaking AI news now, write the articles, and save them to the database.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  let continueLoop = true;
  let pauseCount = 0;

  while (continueLoop) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [
        { type: "web_search_20260209" as any, name: "web_search" },
        ...customTools,
      ],
      messages,
    });

    // Always append full assistant response
    messages.push({ role: "assistant", content: response.content });

    // Log thinking/text
    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        console.log("💬", block.text.substring(0, 200) + (block.text.length > 200 ? "..." : ""));
      }
    }

    if (response.stop_reason === "end_turn") {
      console.log("\n✅ Agent finished.");
      continueLoop = false;

    } else if (response.stop_reason === "pause_turn") {
      // Server-side tool (web_search) hit iteration limit — resume
      pauseCount++;
      if (pauseCount > 5) { console.log("Max pauses reached, stopping."); break; }
      console.log("⏸ Resuming web search...");

    } else if (response.stop_reason === "tool_use") {
      // Client-side tool calls (create_article)
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        console.log(`🔧 Tool: ${block.name}`);
        const result = await executeTool(block.name, block.input as Record<string, unknown>);
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
      }

      messages.push({ role: "user", content: toolResults });

    } else {
      console.log("Stop reason:", response.stop_reason);
      continueLoop = false;
    }
  }
}

runNewsAgent().catch((err) => {
  console.error("Agent error:", err.message);
  process.exit(1);
});
