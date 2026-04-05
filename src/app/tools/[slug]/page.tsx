import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

const pricingLabels: Record<string, string> = {
  free: "Free", freemium: "Freemium", paid: "Paid", enterprise: "Enterprise",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await prisma.tool.findUnique({ where: { slug } });
  if (!tool) return { title: "Tool not found" };
  return { title: tool.name, description: tool.description };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: { reviews: { where: { published: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!tool) notFound();

  const tags = tool.tags ? tool.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const relatedTools = await prisma.tool.findMany({
    where: { category: tool.category, id: { not: tool.id } },
    orderBy: { rating: "desc" },
    take: 3,
  });

  return (
    <div>
      {/* Hero */}
      <section className="py-12 sm:py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {tool.image ? (
              <img src={tool.image} alt={tool.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/8" />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/8 flex items-center justify-center text-3xl font-bold text-primary">
                {tool.name[0]}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CategoryBadge category={tool.category} />
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-white/8 text-text-secondary">
                  {pricingLabels[tool.pricing] ?? tool.pricing}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
              <p className="mt-2 text-text-secondary text-lg">{tool.description}</p>
              <div className="mt-3"><Rating value={tool.rating} /></div>
              <div className="mt-6">
                <a
                  href={tool.url} target="_blank" rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-xl bg-accent text-white font-semibold text-lg hover:opacity-90 hover:shadow-lg hover:shadow-accent/20 transition-all"
                >
                  Try it now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tool.fullDescription && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">About {tool.name}</h2>
            <div className="bg-card rounded-xl p-6 border border-white/5 leading-relaxed text-text-secondary">
              {tool.fullDescription}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/15 text-sm text-primary">{tag}</span>
              ))}
            </div>
          </section>
        )}

        {tool.reviews.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Reviews ({tool.reviews.length})</h2>
            <div className="space-y-4">
              {tool.reviews.map((review) => {
                const pros = review.pros ? review.pros.split(",").map((p) => p.trim()).filter(Boolean) : [];
                const cons = review.cons ? review.cons.split(",").map((c) => c.trim()).filter(Boolean) : [];
                return (
                  <Link key={review.id} href={`/reviews/${review.slug}`}>
                    <div className="card-glow rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{review.title}</h3>
                        <Rating value={review.rating} />
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-3 mb-4">{review.excerpt}</p>
                      {(pros.length > 0 || cons.length > 0) && (
                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                          {pros.length > 0 && (
                            <div className="flex-1">
                              <span className="font-medium text-green-400">Pros:</span>
                              <ul className="mt-1 space-y-1">
                                {pros.slice(0, 3).map((pro) => (
                                  <li key={pro} className="text-text-secondary flex items-center gap-1.5">
                                    <span className="text-green-400 text-xs">+</span>{pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {cons.length > 0 && (
                            <div className="flex-1">
                              <span className="font-medium text-red-400">Cons:</span>
                              <ul className="mt-1 space-y-1">
                                {cons.slice(0, 3).map((con) => (
                                  <li key={con} className="text-text-secondary flex items-center gap-1.5">
                                    <span className="text-red-400 text-xs">-</span>{con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <span className="inline-block mt-3 text-sm text-primary font-medium">Read full review →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {relatedTools.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-bold mb-4">Similar Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedTools.map((related) => (
                <Link key={related.id} href={`/tools/${related.slug}`}>
                  <div className="card-glow rounded-xl p-5 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {related.image ? (
                          <img src={related.image} alt={related.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/5 flex items-center justify-center text-sm font-bold text-primary">
                            {related.name[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-sm">{related.name}</h3>
                          <CategoryBadge category={related.category} />
                        </div>
                      </div>
                      <Rating value={related.rating} />
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">{related.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-text-secondary border border-white/8 rounded-full px-2 py-0.5">{pricingLabels[related.pricing] ?? related.pricing}</span>
                      <span className="text-sm font-medium text-accent">Try it →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link href="/tools" className="inline-block px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary font-semibold hover:bg-white/5 hover:text-text transition-all">
            ← Back to All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
