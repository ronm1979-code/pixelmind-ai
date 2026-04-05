import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Guides",
  description: "Step-by-step guides for using the best AI tools — ChatGPT, Midjourney, Stable Diffusion and more.",
};

const categories = [
  { key: "all", label: "All" },
  { key: "text", label: "Text & Chat" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video" },
  { key: "code", label: "Code" },
  { key: "audio", label: "Audio" },
  { key: "business", label: "Business" },
];

const difficultyMap: Record<string, { label: string; class: string }> = {
  beginner:     { label: "Beginner",     class: "bg-green-500/10 text-green-400 border border-green-500/20" },
  intermediate: { label: "Intermediate", class: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  advanced:     { label: "Advanced",     class: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

export default async function GuidesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const guides = await prisma.guide.findMany({
    where: { published: true, ...(activeCategory !== "all" ? { category: activeCategory } : {}) },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            AI{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Guides</span>
          </h1>
          <p className="mt-3 text-text-secondary text-lg max-w-2xl mx-auto">
            Master AI tools with step-by-step guides. From beginner to advanced.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.key === "all" ? "/guides" : `/guides?category=${cat.key}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-card border border-white/8 text-text-secondary hover:border-primary/30 hover:text-text"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {guides.map((guide) => {
              const diff = difficultyMap[guide.difficulty] ?? difficultyMap.beginner;
              return (
                <Link key={guide.id} href={`/guides/${guide.slug}`}>
                  <div className="card-glow rounded-xl overflow-hidden h-full flex flex-col">
                    {guide.image ? (
                      <div className="h-44"><img src={guide.image} alt={guide.title} className="w-full h-full object-cover" /></div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                        <span className="text-4xl opacity-20">📖</span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CategoryBadge category={guide.category} />
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff.class}`}>
                          {diff.label}
                        </span>
                      </div>
                      {guide.toolName && (
                        <span className="mt-1.5 text-xs text-text-secondary">{guide.toolName}</span>
                      )}
                      <h3 className="mt-1 font-semibold leading-snug line-clamp-2 flex-1">{guide.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary line-clamp-2">{guide.excerpt}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl opacity-30">🔍</span>
            <h2 className="mt-4 text-xl font-bold">No guides found</h2>
            <p className="mt-2 text-text-secondary">Try a different category.</p>
            <Link href="/guides" className="inline-block mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              All Guides
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
