import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

export const dynamic = "force-dynamic";

const pricingLabels: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid", enterprise: "Enterprise",
};

const popularComparisons = [
  { label: "ChatGPT vs Claude vs Gemini", slugs: "chatgpt,claude,gemini" },
  { label: "Midjourney vs DALL-E 3 vs Stable Diffusion", slugs: "midjourney,dall-e-3,stable-diffusion" },
  { label: "GitHub Copilot vs Cursor vs Replit", slugs: "github-copilot,cursor,replit" },
  { label: "ElevenLabs vs Suno", slugs: "elevenlabs,suno" },
];

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ tools?: string }> }) {
  const { tools: toolsParam } = await searchParams;
  const slugs = toolsParam?.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3) ?? [];

  const tools = slugs.length > 0
    ? await prisma.tool.findMany({
        where: { slug: { in: slugs } },
        include: { reviews: { where: { published: true }, select: { rating: true } } },
      })
    : [];

  const sorted = slugs.map((s) => tools.find((t) => t.slug === s)).filter(Boolean) as (typeof tools)[number][];
  const showTable = sorted.length >= 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Compare AI Tools</span>
        </h1>
        <p className="mt-3 text-text-secondary text-lg">Compare AI tools side by side to find the best fit for you</p>
      </div>

      {showTable ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-sm font-semibold text-text-secondary border-b border-white/8 w-36 text-left" />
                  {sorted.map((tool) => (
                    <th key={tool.id} className="p-4 text-center border-b border-white/8">
                      <Link href={`/tools/${tool.slug}`} className="inline-flex flex-col items-center gap-2 group">
                        {tool.image ? (
                          <img src={tool.image} alt={tool.name} className="w-14 h-14 rounded-xl object-cover border border-white/8" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/8 flex items-center justify-center text-xl font-bold text-primary">
                            {tool.name[0]}
                          </div>
                        )}
                        <span className="font-bold group-hover:text-primary transition-colors">{tool.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold text-text-secondary">Category</td>
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4 text-center"><CategoryBadge category={tool.category} /></td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold text-text-secondary">Pricing</td>
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4 text-center text-text-secondary">{pricingLabels[tool.pricing] ?? tool.pricing}</td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold text-text-secondary">Rating</td>
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4"><div className="flex justify-center"><Rating value={tool.rating} /></div></td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold text-text-secondary">Description</td>
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4 text-center text-text-secondary text-xs leading-relaxed">{tool.description}</td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold text-text-secondary">Reviews</td>
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4 text-center">
                      {tool.reviews.length > 0
                        ? <span>{tool.reviews.length} review{tool.reviews.length !== 1 ? "s" : ""}</span>
                        : <span className="text-text-secondary">None yet</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 pt-8" />
                  {sorted.map((tool) => (
                    <td key={tool.id} className="p-4 pt-8 text-center">
                      <Link href={`/tools/${tool.slug}`}
                        className="inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                        View Tool
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {sorted.length < slugs.length && (
            <p className="mt-6 text-sm text-yellow-400 text-center">Some requested tools were not found in the database.</p>
          )}
        </>
      ) : (
        <>
          {slugs.length > 0 && sorted.length < 2 && (
            <p className="text-center text-yellow-400 mb-8">Not enough tools found. Try different slugs.</p>
          )}
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">Popular Comparisons</h2>
            <div className="flex flex-col gap-4">
              {popularComparisons.map((comp) => (
                <Link key={comp.slugs} href={`/compare?tools=${comp.slugs}`}>
                  <div className="card-glow rounded-xl p-5 text-center font-semibold hover:text-primary transition-colors">
                    {comp.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
