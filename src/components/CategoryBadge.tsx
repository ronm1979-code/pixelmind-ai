const categoryMap: Record<string, { label: string; class: string }> = {
  text:     { label: "Text & Chat",    class: "badge-text" },
  image:    { label: "Image",          class: "badge-image" },
  video:    { label: "Video",          class: "badge-video" },
  code:     { label: "Code",           class: "badge-code" },
  audio:    { label: "Audio",          class: "badge-audio" },
  business: { label: "Business",       class: "badge-business" },
  general:  { label: "General",        class: "badge-text" },
  models:   { label: "Models",         class: "badge-code" },
  products: { label: "Products",       class: "badge-business" },
  companies:{ label: "Companies",      class: "badge-business" },
  research: { label: "Research",       class: "badge-audio" },
  industry: { label: "Industry",       class: "badge-image" },
};

export function CategoryBadge({ category }: { category: string }) {
  const cat = categoryMap[category] ?? { label: category, class: "badge-text" };
  return (
    <span className={`${cat.class} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {cat.label}
    </span>
  );
}
