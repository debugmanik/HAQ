import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LAWYERS_DATA } from "@/lib/lawyer-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const specialization = searchParams.get("specialization");
    const query = searchParams.get("query")?.toLowerCase();

    // Try fetching from database first
    try {
      const dbLawyers = await prisma.lawyer.findMany();
      if (dbLawyers && dbLawyers.length > 0) {
        let filtered = dbLawyers;

        if (city && city !== "All Cities") {
          filtered = filtered.filter(l => l.city.toLowerCase() === city.toLowerCase());
        }

        if (specialization && specialization !== "All Specializations") {
          filtered = filtered.filter(l => l.specializations.includes(specialization));
        }

        if (query) {
          filtered = filtered.filter(l => 
            l.name.toLowerCase().includes(query) ||
            l.bio.toLowerCase().includes(query) ||
            l.city.toLowerCase().includes(query) ||
            l.specializations.some(s => s.toLowerCase().includes(query))
          );
        }

        return NextResponse.json(filtered);
      }
    } catch {
      // Fallback to embedded dataset if DB is empty or disconnected
    }

    // Filter embedded fallback dataset
    let result = LAWYERS_DATA;

    if (city && city !== "All Cities") {
      result = result.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }

    if (specialization && specialization !== "All Specializations") {
      result = result.filter(l => l.specializations.includes(specialization));
    }

    if (query) {
      result = result.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.bio.toLowerCase().includes(query) ||
        l.city.toLowerCase().includes(query) ||
        l.specializations.some(s => s.toLowerCase().includes(query))
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/lawyers:", error);
    return NextResponse.json(LAWYERS_DATA);
  }
}
