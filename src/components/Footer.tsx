import Link from "next/link";

const footerLinks = {
  explore: [
    { href: "/news", label: "AI News" },
    { href: "/guides", label: "Guides" },
    { href: "/tools", label: "AI Tools" },
    { href: "/reviews", label: "Reviews" },
    { href: "/compare", label: "Compare" },
  ],
  categories: [
    { href: "/guides?category=text", label: "Text & Chat" },
    { href: "/guides?category=image", label: "Image Generation" },
    { href: "/guides?category=video", label: "Video Generation" },
    { href: "/guides?category=code", label: "Code & Dev" },
    { href: "/guides?category=audio", label: "Audio & Music" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16" style={{ background: "rgba(10,10,12,0.95)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
                P
              </div>
              <span className="font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PixelMind
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your hub for AI news, guides, tool reviews and comparisons. Stay ahead of the curve.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
          <p>&copy; {new Date().getFullYear()} PixelMind. All rights reserved.</p>
          <p>Built with Next.js + AI</p>
        </div>
      </div>
    </footer>
  );
}
