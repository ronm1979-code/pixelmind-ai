import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Rating } from "@/components/Rating";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { tool: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Tool Reviews</span>
        </h1>
        <p className="mt-3 text-text-secondary text-lg">In-depth, objective reviews of the leading AI tools</p>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {reviews.map((review) => {
            const pros = review.pros?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
            const cons = review.cons?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
            return (
              <Link key={review.id} href={`/reviews/${review.slug}`}>
                <div className="card-glow rounded-xl h-full p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.tool.image ? (
                        <img src={review.tool.image} alt={review.tool.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 border border-white/5 flex items-center justify-center text-sm font-bold text-primary">
                          {review.tool.name[0]}
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-text-secondary">{review.tool.name}</span>
                        <div><CategoryBadge category={review.tool.category} /></div>
                      </div>
                    </div>
                    <Rating value={review.rating} />
                  </div>
                  <h2 className="mt-4 text-lg font-bold line-clamp-2">{review.title}</h2>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-3">{review.excerpt}</p>
                  {(pros.length > 0 || cons.length > 0) && (
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      {pros.length > 0 && (
                        <div>
                          <span className="font-semibold text-green-500">Pros</span>
                          <ul className="mt-1 space-y-0.5">
                            {pros.slice(0, 2).map((p, i) => (
                              <li key={i} className="text-text-secondary flex items-start gap-1">
                                <span className="text-green-500 mt-0.5 shrink-0">+</span>
                                <span className="line-clamp-1">{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {cons.length > 0 && (
                        <div>
                          <span className="font-semibold text-red-500">Cons</span>
                          <ul className="mt-1 space-y-0.5">
                            {cons.slice(0, 2).map((c, i) => (
                              <li key={i} className="text-text-secondary flex items-start gap-1">
                                <span className="text-red-500 mt-0.5 shrink-0">-</span>
                                <span className="line-clamp-1">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="mt-4 block text-sm font-medium text-primary">Read full review →</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No reviews yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
