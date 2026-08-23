import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KYR_ARTICLES } from "@/lib/kyr-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query")?.toLowerCase();
    const slug = searchParams.get("slug");

    // If single article requested by slug
    if (slug) {
      const found = KYR_ARTICLES.find(a => a.slug === slug || a.id === slug);
      if (found) return NextResponse.json(found);
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Try DB first
    try {
      const dbArticles = await prisma.kYRArticle.findMany({
        orderBy: { publishedAt: "desc" }
      });
      if (dbArticles && dbArticles.length > 0) {
        let filtered = dbArticles;
        if (category && category !== "all") {
          filtered = filtered.filter(a => a.category === category);
        }
        if (query) {
          filtered = filtered.filter(a =>
            a.title.toLowerCase().includes(query) ||
            a.excerpt.toLowerCase().includes(query) ||
            a.content.toLowerCase().includes(query) ||
            a.tags.some(t => t.toLowerCase().includes(query))
          );
        }
        return NextResponse.json(filtered);
      }
    } catch {
      // Fallback to static dataset
    }

    let result = KYR_ARTICLES;

    if (category && category !== "all") {
      result = result.filter(a => a.category === category);
    }

    if (query) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/kyr:", error);
    return NextResponse.json(KYR_ARTICLES);
  }
}
