import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { EliteCaseState, INITIAL_ELITE_STATE } from "@/lib/ai/types";
import { detectIntentAndDanger } from "@/lib/ai/intentService";
import { extractFacts } from "@/lib/ai/extractionService";
import { generateAdvisory } from "@/lib/ai/advisoryService";
import { generateNextQuestion } from "@/lib/ai/questionService";

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

    // STEP 1: Intent & Safety Override
    const intentResult = await detectIntentAndDanger(ai, message, currentState);
    currentState.category = intentResult.category;
    currentState.subCategory = intentResult.subCategory;
    currentState.summary = intentResult.summary;

    if (!intentResult.isImmediateDanger && currentState.category && currentState.category !== "General Inquiry") {
      // STEP 2: Fact Extraction (Memory)
      const extractionResult = await extractFacts(ai, message, currentState);
      
      // Merge new facts
      currentState.facts = { ...currentState.facts, ...extractionResult.newFacts };
      
      // Merge evidence
      const newEvidence = extractionResult.evidenceReady.filter(e => !currentState.evidenceReady.includes(e));
      currentState.evidenceReady = [...currentState.evidenceReady, ...newEvidence];
      
      // Update missing info
      currentState.missingInformation = extractionResult.missingInformation;

      // STEP 3: Advisory & Roadmap
      const advisoryResult = await generateAdvisory(ai, currentState);
      currentState.rights = advisoryResult.rights;
      currentState.roadmap = advisoryResult.roadmap;
      currentState.nextAction = advisoryResult.nextAction;
      currentState.confidence = advisoryResult.confidence;
      
      if (advisoryResult.isReadyForAction) {
        currentState.currentStep = "ready_for_action";
      } else {
        currentState.currentStep = "gathering_facts";
      }
    }

    // Determine readiness score
    let readinessScore = 0;
    if (currentState.category && currentState.category !== "General Inquiry") {
      const knownCount = Object.keys(currentState.facts).length;
      const totalCount = knownCount + currentState.missingInformation.length;
      readinessScore = totalCount > 0 ? Math.floor((knownCount / totalCount) * 100) : 10;
      if (currentState.currentStep === "ready_for_action") readinessScore = 100;
    }

    // STEP 4: Smart Question Selection
    const aiResponseText = await generateNextQuestion(
      ai, 
      message, 
      currentState, 
      intentResult.isImmediateDanger, 
      intentResult.dangerResponse
    );

    // Save state
    const updatedCase = await prisma.aiCase.update({
      where: { id: aiCase.id },
      data: {
        category: currentState.category,
        extractedData: currentState as any,
        readinessScore,
        status: currentState.currentStep === "ready_for_action" ? "ready" : "gathering_context"
      }
    });

    // Save assistant message
    const savedMsg = await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "assistant", content: aiResponseText }
    });

    return NextResponse.json({
      caseState: updatedCase,
      message: savedMsg,
      eliteState: currentState // Pass the strongly-typed state directly for UI ease
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
