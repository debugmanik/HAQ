import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { EliteCaseState, INITIAL_ELITE_STATE } from "@/lib/ai/types";
import { processCaseStateSinglePass } from "@/lib/ai/stateEngineService";

export const maxDuration = 60; // Just in case, though it should be fast now

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: Request) {
  try {
    const { message, caseId } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('haq_session_id')?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // 1. Load or Create Case
    let aiCase;
    if (caseId) {
      aiCase = await prisma.aiCase.findUnique({
        where: { id: caseId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      if (!aiCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });
    } else {
      aiCase = await prisma.aiCase.create({
        data: {
          sessionId,
          category: null,
          extractedData: INITIAL_ELITE_STATE as any
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "user", content: message }
    });

    let currentState = (aiCase.extractedData || INITIAL_ELITE_STATE) as EliteCaseState;

    // SINGLE-PASS STATE ENGINE: Merges Intent, Extraction, Advisory, and Question Generation
    const { state: updatedEliteState, responseText } = await processCaseStateSinglePass(ai, message, currentState);

    // Determine readiness score
    let readinessScore = 0;
    if (updatedEliteState.category && updatedEliteState.category !== "General Inquiry") {
      const knownCount = Object.keys(updatedEliteState.facts).length;
      const totalCount = knownCount + updatedEliteState.missingInformation.length;
      readinessScore = totalCount > 0 ? Math.floor((knownCount / totalCount) * 100) : 10;
      if (updatedEliteState.currentStep === "ready_for_action") readinessScore = 100;
    }

    // Save state
    const updatedCase = await prisma.aiCase.update({
      where: { id: aiCase.id },
      data: {
        category: updatedEliteState.category,
        extractedData: updatedEliteState as any,
        readinessScore,
        status: updatedEliteState.currentStep === "ready_for_action" ? "ready" : "gathering_context"
      }
    });

    // Save assistant message
    const savedMsg = await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "assistant", content: responseText }
    });

    return NextResponse.json({
      caseState: updatedCase,
      message: savedMsg,
      eliteState: updatedEliteState
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
