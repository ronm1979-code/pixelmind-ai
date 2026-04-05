import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Metadata } from "next";

const difficultyMap: Record<string, { label: string; class: string }> = {
  beginner:     { label: "Beginner",     class: "bg-green-500/10 text-green-400 border border-green-500/20" },
  intermediate: { label: "Intermediate", class: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  advanced:     { label: "Advanced",     class: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug } });
  if (!guide) return { title: "Guide not found" };
  return { title: guide.title, description: guide.excerpt };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await prisma.guide.findUnique({ where: { slug, published: true } });
  if (!guide) notFound();

  const relatedGuides = await prisma.guide.findMany({
    where: { published: true, category: guide.category, id: { not: guide.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const diff = difficultyMap[guide.difficulty] ?? difficultyMap.beginner;

  return (
    <div>
      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
            <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-text line-clamp-1">{guide.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CategoryBadge category={guide.category} />
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${diff.class}`}>{diff.label}</span>
            {guide.toolName && (
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{guide.toolName}</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{guide.title}</h1>
          <p className="mt-3 text-lg text-text-secondary">{guide.excerpt}</p>
          <p className="mt-3 text-sm text-text-secondary">
            {new Date(guide.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <article className="flex-1 min-w-0">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guide.content }} />
          </article>

          {relatedGuides.length > 0 && (
            <aside className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-base font-bold mb-4 text-text-secondary uppercase tracking-wider text-xs">Related Guides</h2>
                <div className="flex flex-col gap-3">
                  {relatedGuides.map((related) => {
                    const rDiff = difficultyMap[related.difficulty] ?? difficultyMap.beginner;
                    return (
                      <Link key={related.id} href={`/guides/${related.slug}`}>
                        <div className="card-glow rounded-xl overflow-hidden">
                          <div className="h-24 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <span className="text-2xl opacity-20">📖</span>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CategoryBadge category={related.category} />
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${rDiff.class}`}>{rDiff.label}</span>
                            </div>
                            {related.toolName && <span className="mt-1 block text-xs text-text-secondary">{related.toolName}</span>}
                            <h3 className="mt-1 text-sm font-semibold line-clamp-2">{related.title}</h3>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
