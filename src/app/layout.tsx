import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const BASE = "https://pixelmind-ai-delta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "PixelMind — The AI Intelligence Hub",
    template: "%s | PixelMind",
  },
  description:
    "News, guides, tools and reviews from the world of artificial intelligence. Everything AI in one place.",
  keywords: ["AI news", "artificial intelligence", "AI tools", "ChatGPT", "machine learning", "AI guides"],
  authors: [{ name: "PixelMind" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE,
    siteName: "PixelMind",
    title: "PixelMind — The AI Intelligence Hub",
    description: "News, guides, tools and reviews from the world of artificial intelligence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelMind — The AI Intelligence Hub",
    description: "News, guides, tools and reviews from the world of artificial intelligence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
