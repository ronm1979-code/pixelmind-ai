import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Discover the best AI tools for text, images, video, code, audio and business.",
};

const categories = [
  { value: "", label: "All" },
  { value: "text", label: "Text & Chat" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "code", label: "Code" },
  { value: "audio", label: "Audio" },
  { value: "business", label: "Business" },
];

const pricingOptions = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

const pricingLabels: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid", enterprise: "Enterprise",
};

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; pricing?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const categoryFilter = params.category ?? "";
  const pricingFilter = params.pricing ?? "";

  const where: Record<string, unknown> = {};
  if (query) where.OR = [{ name: { contains: query } }, { description: { contains: query } }, { tags: { contains: query } }];
  if (categoryFilter) where.category = categoryFilter;
  if (pricingFilter) where.pricing = pricingFilter;

  const tools = await prisma.tool.findMany({
    where,
    orderBy: [{ featured: "desc" }, { rating: "desc" }, { createdAt: "desc" }],
  });

  function buildHref(overrides: Record<string, string>) {
    const merged = { q: query, category: categoryFilter, pricing: pricingFilter, ...overrides };
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
    const qs = sp.toString();
    return qs ? `/tools?${qs}` : "/tools";
  }

  return (
    <div>
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            AI{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tools</span>
          </h1>
          <p className="mt-3 text-text-secondary text-lg max-w-2xl mx-auto">
            Discover the most powerful AI tools, filtered by category and pricing.
          </p>
          <form action="/tools" method="GET" className="mt-8 max-w-xl mx-auto">
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            {pricingFilter && <input type="hidden" name="pricing" value={pricingFilter} />}
            <div className="relative">
              <input
                type="text" name="q" defaultValue={query}
                placeholder="Search AI tools..."
                className="w-full px-5 py-3 pl-12 rounded-xl bg-card border border-white/8 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-text placeholder:text-text-secondary"
              />
              <button type="submit" className="absolute top-1/2 -translate-y-1/2 left-4 text-text-secondary hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <Link key={cat.value} href={buildHref({ category: cat.value })}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === cat.value
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm shadow-primary/20"
                  : "bg-card border border-white/8 text-text-secondary hover:border-primary/30 hover:text-text"
              }`}
            >{cat.label}</Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <span className="text-xs text-text-secondary uppercase tracking-wider mr-1">Pricing:</span>
          {pricingOptions.map((opt) => (
            <Link key={opt.value} href={buildHref({ pricing: opt.value })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                pricingFilter === opt.value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-card border border-white/8 text-text-secondary hover:border-accent/30 hover:text-text"
              }`}
            >{opt.label}</Link>
          ))}
        </div>
        <p className="text-sm text-text-secondary mb-6">
          {tools.length === 0 ? "No tools found" : `${tools.length} tool${tools.length !== 1 ? "s" : ""} found`}
        </p>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <div className="card-glow rounded-xl h-full flex flex-col">
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {tool.image ? (
                          <img src={tool.image} alt={tool.name} className="w-11 h-11 rounded-xl object-cover" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/5 flex items-center justify-center text-base font-bold text-primary">
                            {tool.name[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{tool.name}</h3>
                          <CategoryBadge category={tool.category} />
                        </div>
                      </div>
                      <Rating value={tool.rating} />
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 flex-1">{tool.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-white/8 text-text-secondary">
                        {pricingLabels[tool.pricing] ?? tool.pricing}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                        Try it
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 mb-16">
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <h2 className="text-xl font-bold">No tools found</h2>
            <p className="mt-2 text-text-secondary">Try adjusting your search or filters.</p>
            <Link href="/tools" className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity">
              Reset filters
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
