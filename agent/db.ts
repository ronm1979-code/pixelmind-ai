import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually
try {
  const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^=\s#]+)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

export const prisma = new PrismaClient({
  adapter: new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});

export async function articleExists(slug: string): Promise<boolean> {
  const count = await prisma.article.count({ where: { slug } });
  return count > 0;
}

export async function getRecentSlugs(): Promise<string[]> {
  const articles = await prisma.article.findMany({
    select: { slug: true, title: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return articles.map((a) => a.title);
}
