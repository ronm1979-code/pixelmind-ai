import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug, published: true } });
  if (!article) notFound();

  const related = await prisma.article.findMany({
    where: { published: true, category: article.category, id: { not: article.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-primary transition-colors">News</Link>
        <span>/</span>
        <span className="text-text line-clamp-1">{article.title}</span>
      </nav>

      {/* Hero Image */}
      {article.image ? (
        <div className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="rounded-2xl mb-8 h-48 bg-gradient-to-br from-primary/5 to-accent/5 border border-white/5 flex items-center justify-center">
          <span className="text-6xl opacity-20">📰</span>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <CategoryBadge category={article.category} />
        <time className="text-sm text-text-secondary">
          {new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </time>
        {article.source && (
          <>
            <span className="text-text-secondary">·</span>
            {article.sourceUrl ? (
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                {article.source}
              </a>
            ) : (
              <span className="text-sm text-text-secondary">{article.source}</span>
            )}
          </>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-5">{article.title}</h1>

      <p className="text-lg text-text-secondary leading-relaxed mb-8 border-l-3 border-primary/40 pl-4">
        {article.excerpt}
      </p>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

      <div className="mt-12 pt-8 border-t border-white/5">
        <Link href="/news" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
          ← Back to News
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-white/5">
          <h2 className="text-xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`}>
                <div className="card-glow rounded-xl overflow-hidden h-full">
                  {item.image ? (
                    <div className="h-32"><img src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                      <span className="text-3xl opacity-20">📰</span>
                    </div>
                  )}
                  <div className="p-3">
                    <CategoryBadge category={item.category} />
                    <h3 className="mt-2 text-sm font-semibold line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
