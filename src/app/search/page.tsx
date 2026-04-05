import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  let guides: Awaited<ReturnType<typeof prisma.guide.findMany>> = [];
  let tools: Awaited<ReturnType<typeof prisma.tool.findMany>> = [];

  if (query) {
    [articles, guides, tools] = await Promise.all([
      prisma.article.findMany({
        where: { published: true, OR: [{ title: { contains: query } }, { excerpt: { contains: query } }] },
        orderBy: { createdAt: "desc" }, take: 10,
      }),
      prisma.guide.findMany({
        where: { published: true, OR: [{ title: { contains: query } }, { excerpt: { contains: query } }, { toolName: { contains: query } }] },
        orderBy: { createdAt: "desc" }, take: 10,
      }),
      prisma.tool.findMany({
        where: { OR: [{ name: { contains: query } }, { description: { contains: query } }, { tags: { contains: query } }] },
        orderBy: { rating: "desc" }, take: 10,
      }),
    ]);
  }

  const totalResults = articles.length + guides.length + tools.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-3">
          <input
            type="text" name="q" defaultValue={query}
            placeholder="Search tools, guides, news..."
            className="flex-1 px-4 py-3 rounded-xl border border-white/8 bg-card text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="text-text-secondary mb-6">
          {totalResults > 0 ? `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"` : `No results for "${query}"`}
        </p>
      )}

      {tools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">AI Tools</h2>
          <div className="space-y-3">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <div className="card-glow rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 border border-white/5 flex items-center justify-center text-base font-bold text-primary shrink-0">
                    {tool.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tool.name}</h3>
                      <CategoryBadge category={tool.category} />
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-1">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Guides</h2>
          <div className="space-y-3">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <div className="card-glow rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={guide.category} />
                    {guide.toolName && <span className="text-xs text-text-secondary">{guide.toolName}</span>}
                  </div>
                  <h3 className="font-semibold">{guide.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-1">{guide.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">News</h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <div className="card-glow rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={article.category} />
                    {article.source && <span className="text-xs text-text-secondary">{article.source}</span>}
                  </div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-1">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!query && (
        <div className="text-center py-12 text-text-secondary">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Type to search tools, guides and news</p>
        </div>
      )}
    </div>
  );
}
