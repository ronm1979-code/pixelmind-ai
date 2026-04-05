import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

export const dynamic = "force-dynamic";

const sourceColors: Record<string, string> = {
  "OpenAI Blog": "from-emerald-600 to-emerald-800",
  "Anthropic": "from-orange-500 to-rose-600",
  "Google AI Blog": "from-blue-500 to-indigo-600",
  "DeepMind Blog": "from-blue-600 to-blue-800",
  "Midjourney": "from-gray-600 to-gray-800",
  "NVIDIA": "from-green-500 to-green-700",
  "TechCrunch": "from-green-600 to-teal-700",
  "Bloomberg": "from-red-500 to-red-700",
  "Suno Blog": "from-violet-500 to-purple-700",
  "ElevenLabs": "from-yellow-500 to-orange-600",
  "The Verge AI": "from-red-500 to-pink-600",
  "Nature Medicine": "from-teal-500 to-cyan-700",
  "European Parliament": "from-blue-600 to-indigo-700",
};

export default async function HomePage() {
  const [articles, guides, tools] = await Promise.all([
    prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.guide.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.tool.findMany({ where: { featured: true }, orderBy: { rating: "desc" }, take: 6 }),
  ]);

  const heroArticle = articles[0];

  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            The AI Intelligence Hub
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              PixelMind
            </span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            News, guides, tools and reviews from the world of artificial intelligence.
            Everything AI, in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Explore AI Tools
            </Link>
            <Link
              href="/guides"
              className="px-6 py-3 rounded-xl border border-white/10 text-text-secondary font-semibold hover:bg-white/5 hover:text-text transition-all"
            >
              Browse Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {heroArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
          <Link href={`/news/${heroArticle.slug}`}>
            <div className="card-glow rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {heroArticle.image ? (
                  <div className="md:w-2/5 h-52 md:h-auto">
                    <img src={heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`md:w-2/5 h-52 md:h-auto bg-gradient-to-br ${sourceColors[heroArticle.source ?? ""] ?? "from-primary/20 to-secondary/20"} flex flex-col items-center justify-center gap-3`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white text-2xl font-bold">
                      {(heroArticle.source ?? "?")[0]}
                    </div>
                    <span className="text-white/70 text-sm font-medium">{heroArticle.source}</span>
                  </div>
                )}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">Featured</span>
                    <CategoryBadge category={heroArticle.category} />
                  </div>
                  <h2 className="text-2xl font-bold leading-snug">{heroArticle.title}</h2>
                  <p className="mt-2 text-text-secondary line-clamp-2">{heroArticle.excerpt}</p>
                  {heroArticle.source && (
                    <p className="mt-3 text-xs text-text-secondary">Source: {heroArticle.source}</p>
                  )}
                  <span className="mt-4 text-sm text-primary font-medium">Read more →</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News */}
      {articles.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <Link href="/news" className="text-sm text-primary font-medium hover:underline">All news →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.slice(1).map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <div className="card-glow rounded-xl overflow-hidden h-full flex flex-col">
                  {article.image ? (
                    <div className="h-40">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`h-40 bg-gradient-to-br ${sourceColors[article.source ?? ""] ?? "from-primary/20 to-secondary/20"} flex flex-col items-center justify-center gap-2`}>
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white text-lg font-bold">
                        {(article.source ?? "?")[0]}
                      </div>
                      <span className="text-white/70 text-xs font-medium">{article.source}</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <CategoryBadge category={article.category} />
                    <h3 className="mt-2 font-semibold leading-snug line-clamp-2">{article.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-2 flex-1">{article.excerpt}</p>
                    {article.source && (
                      <p className="mt-2 text-xs text-text-secondary">{article.source}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Top Guides */}
      {guides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Guides</h2>
            <Link href="/guides" className="text-sm text-primary font-medium hover:underline">All guides →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <div className="card-glow rounded-xl overflow-hidden h-full flex flex-col">
                  {guide.image ? (
                    <div className="h-36"><img src={guide.image} alt={guide.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="h-36 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                      <span className="text-4xl opacity-30">📖</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CategoryBadge category={guide.category} />
                      {guide.toolName && <span className="text-xs text-text-secondary">{guide.toolName}</span>}
                    </div>
                    <h3 className="mt-2 font-semibold text-sm leading-snug line-clamp-2 flex-1">{guide.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Tools */}
      {tools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending AI Tools</h2>
            <Link href="/tools" className="text-sm text-primary font-medium hover:underline">All tools →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <div className="card-glow rounded-xl h-full">
                  <div className="p-5">
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
                    <p className="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-text-secondary capitalize border border-white/8 rounded-full px-2 py-0.5">{tool.pricing}</span>
                      <span className="text-sm font-medium text-accent">Try it →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && guides.length === 0 && tools.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="text-6xl mb-4 opacity-30">🤖</div>
          <h2 className="text-2xl font-bold">Welcome to PixelMind</h2>
          <p className="mt-2 text-text-secondary">Content coming soon. Run the seed script to populate the database.</p>
        </section>
      )}
    </div>
  );
}
