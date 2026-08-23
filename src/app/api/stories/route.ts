import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CASE_STORIES } from "@/lib/story-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query")?.toLowerCase();

    try {
      const dbStories = await prisma.caseStory.findMany({
        orderBy: { createdAt: "desc" }
      });
      if (dbStories && dbStories.length > 0) {
        let filtered = dbStories;
        if (category && category !== "all") {
          filtered = filtered.filter(s => s.category === category);
        }
        if (query) {
          filtered = filtered.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.summary.toLowerCase().includes(query) ||
            s.fullStory.toLowerCase().includes(query)
          );
        }
        return NextResponse.json(filtered);
      }
    } catch {
      // Fallback
    }

    let result = CASE_STORIES;

    if (category && category !== "all") {
      result = result.filter(s => s.category === category);
    }

    if (query) {
      result = result.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.fullStory.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/stories:", error);
    return NextResponse.json(CASE_STORIES);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, summary, fullStory, resolutionRoute, outcome, takeaways, state, authorName } = body;

    if (!title || !category || !summary || !fullStory || !outcome) {
      return NextResponse.json({ error: "Missing required story fields." }, { status: 400 });
    }

    try {
      const created = await prisma.caseStory.create({
        data: {
          title,
          category,
          summary,
          fullStory,
          resolutionRoute: resolutionRoute || [],
          outcome,
          takeaways: takeaways || [],
          state: state || "India",
          authorName: authorName || "Anonymous Citizen",
          likes: 1
        }
      });
      return NextResponse.json({ success: true, story: created });
    } catch (dbErr) {
      console.warn("DB save failed for story submission, using memory response:", dbErr);
      return NextResponse.json({
        success: true,
        story: {
          id: `story-${Date.now()}`,
          title,
          category,
          summary,
          fullStory,
          resolutionRoute: resolutionRoute || [],
          outcome,
          takeaways: takeaways || [],
          state: state || "India",
          authorName: authorName || "Anonymous Citizen",
          likes: 1,
          publishedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error("Error submitting story:", error);
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 });
  }
}
