import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

const BASE = "https://pixelmind-ai-delta.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const review = await prisma.review.findUnique({ where: { slug }, include: { tool: true } });
  if (!review) return { title: "Review not found" };
  return {
    title: review.title,
    description: review.excerpt,
    alternates: { canonical: `${BASE}/reviews/${slug}` },
    openGraph: {
      title: review.title,
      description: review.excerpt,
      url: `${BASE}/reviews/${slug}`,
      type: "article",
      ...(review.tool.image ? { images: [{ url: review.tool.image, width: 128, height: 128 }] } : {}),
    },
    twitter: { card: "summary_large_image", title: review.title, description: review.excerpt },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const review = await prisma.review.findUnique({ where: { slug }, include: { tool: true } });
  if (!review || !review.published) return notFound();

  const pros = review.pros?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const cons = review.cons?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-text-secondary mb-8">
        <Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link>
        <span className="mx-2">/</span>
        <span>{review.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          {review.tool.image ? (
            <img src={review.tool.image} alt={review.tool.name} className="w-12 h-12 rounded-xl object-cover border border-white/8" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-white/8 flex items-center justify-center text-lg font-bold text-primary">
              {review.tool.name[0]}
            </div>
          )}
          <div>
            <Link href={`/tools/${review.tool.slug}`} className="font-semibold hover:text-primary transition-colors">
              {review.tool.name}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryBadge category={review.tool.category} />
              <span className="text-xs text-text-secondary capitalize">{review.tool.pricing}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto"><Rating value={review.rating} /></div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">{review.title}</h1>
      <p className="text-text-secondary mb-8">{review.excerpt}</p>

      {(pros.length > 0 || cons.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {pros.length > 0 && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
              <h2 className="font-bold text-green-400 mb-3">Pros</h2>
              <ul className="space-y-2">
                {pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cons.length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <h2 className="font-bold text-red-400 mb-3">Cons</h2>
              <ul className="space-y-2">
                {cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: review.content }} />

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href={`/tools/${review.tool.slug}`}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 transition-all">
          View {review.tool.name} →
        </Link>
        <a href={review.tool.url} target="_blank" rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl border border-white/10 text-text-secondary font-semibold hover:bg-white/5 hover:text-text transition-all">
          Visit official site →
        </a>
      </div>
    </div>
  );
}
