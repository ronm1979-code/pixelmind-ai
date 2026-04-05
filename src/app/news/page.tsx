import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";

export const dynamic = "force-dynamic";

const sourceColors: Record<string, string> = {
  "OpenAI Blog": "from-emerald-600 to-emerald-800",
  "Anthropic": "from-orange-500 to-rose-600",
  "Google AI Blog": "from-blue-500 to-indigo-600",
  "DeepMind Blog": "from-blue-600 to-blue-800",
  "Meta AI Blog": "from-blue-400 to-blue-600",
  "Microsoft AI Blog": "from-sky-500 to-blue-600",
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

const categories = [
  { key: "all", label: "All" },
  { key: "models", label: "Models" },
  { key: "products", label: "Products" },
  { key: "companies", label: "Companies" },
  { key: "research", label: "Research" },
  { key: "industry", label: "Industry" },
];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(activeCategory !== "all" ? { category: activeCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI News</span>
        </h1>
        <p className="mt-3 text-text-secondary text-lg">Latest updates from the world of artificial intelligence</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={cat.key === "all" ? "/news" : `/news?category=${cat.key}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.key
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20"
                : "bg-card border border-white/8 text-text-secondary hover:border-primary/30 hover:text-text"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`}>
              <article className="card-glow rounded-xl overflow-hidden h-full flex flex-col">
                {article.image ? (
                  <div className="h-52">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`h-52 bg-gradient-to-br ${sourceColors[article.source ?? ""] ?? "from-primary/20 to-secondary/20"} flex flex-col items-center justify-center gap-2`}>
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white text-xl font-bold">
                      {(article.source ?? "?")[0]}
                    </div>
                    <span className="text-white/70 text-xs font-medium">{article.source}</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <CategoryBadge category={article.category} />
                    <time className="text-xs text-text-secondary">
                      {new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                  </div>
                  <h2 className="font-bold leading-snug line-clamp-2 flex-1">{article.title}</h2>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">{article.excerpt}</p>
                  {article.source && <p className="mt-2 text-xs text-text-secondary">{article.source}</p>}
                  <span className="mt-3 text-sm font-medium text-primary">Read more →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-30">📭</div>
          <h2 className="text-xl font-bold">No articles in this category</h2>
          <p className="mt-2 text-text-secondary">Try a different filter or check back later.</p>
        </div>
      )}
    </div>
  );
}
