import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { type, slug } = await req.json();

    if (!type || !slug) {
      return NextResponse.json({ error: "Missing type or slug" }, { status: 400 });
    }

    if (type === "article") {
      await prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } });
    } else if (type === "guide") {
      await prisma.guide.update({ where: { slug }, data: { views: { increment: 1 } } });
    } else if (type === "tool") {
      await prisma.tool.update({ where: { slug }, data: { views: { increment: 1 } } });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
