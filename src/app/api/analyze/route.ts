import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";export async function POST(request: Request) {
  try {
    const { description, answers, categoryId } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description of the issue is required." },
        { status: 400 }
      );
    }

    // We'll use GEMINI_API_KEY if present, but fallback to OPENAI_API_KEY just in case the user reuses the same variable
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key (GEMINI_API_KEY) is not configured on the server." },
        { status: 500 }
      );
    }

    // Format user inputs for the LLM prompt
    const formattedAnswers = Object.entries(answers || {})
      .map(([key, val]) => `- ${key}: ${val}`)
      .join("\n");

    const systemPrompt = `You are HAQ, an empathetic, factual civic assistance AI designed for Indian citizens. Your role is to analyze a citizen's civic or administrative grievance and route them to the correct legal/procedural path.

CRITICAL RULES:
1. Do NOT claim to be a lawyer or provide definitive legal advice. Make it clear that this is educational guidance.
2. Do NOT predict case outcomes (e.g. "you will win your money back").
3. Do NOT invent/hallucinate specific laws, sections, departments, portals, deadlines, or citations. Only mention standard, widely known tools (like the RTI Act 2005, CPGRAMS portal, National Consumer Helpline 1915, Rent Authority under Tenancy Act) if they actually exist and apply.
4. If crucial information is missing, use the "missing_questions" array to ask focused questions (maximum 5).
5. For urgent threats, violence, domestic abuse, harassment, arrest, or immediate safety hazards, use the "safety_notice" field to clearly advise contacting emergency services (like 112) or local authorities immediately.
6. Use simple, direct, non-legal English suitable for a common citizen.
7. Be concise, factual, and empathetic.
8. Treat this interaction as an informational prototype.

You must output a structured JSON response matching the exact schema required.`;

    const userPrompt = `Here is the citizen's grievance:
"${description}"

Here are the details gathered from the conversational guided flow:
${formattedAnswers || "No details provided yet."}`;

    // Call the free Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              category: { 
                type: "STRING", 
                enum: ["rti", "consumer", "tenant", "workplace", "welfare_scheme", "unknown"] 
              },
              summary: { type: "STRING" },
              plain_language_explanation: { type: "STRING" },
              confidence: { type: "STRING", enum: ["low", "medium", "high"] },
              missing_questions: { 
                type: "ARRAY", 
                description: "Up to 5 focused questions to ask the user to clarify missing details", 
                items: { type: "STRING" } 
              },
              recommended_actions: { 
                type: "ARRAY", 
                description: "3 to 5 concrete action steps for the user", 
                items: { type: "STRING" } 
              },
              documents_needed: { 
                type: "ARRAY", 
                description: "List of documents the user should gather", 
                items: { type: "STRING" } 
              },
              should_generate_rti_draft: { type: "BOOLEAN" },
              safety_notice: { 
                type: "STRING", 
                description: "Important warnings, emergency advice, or safety notifications if applicable" 
              },
              official_route_type: { 
                type: "STRING", 
                enum: ["central", "state", "local", "unknown"] 
              }
            },
            required: [
              "category", "summary", "plain_language_explanation", "confidence",
              "missing_questions", "recommended_actions", "documents_needed",
              "should_generate_rti_draft", "safety_notice", "official_route_type"
            ]
          }
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return NextResponse.json(
        { error: `Gemini API Error: ${errorText}` },
        { status: geminiResponse.status }
      );
    }

    const geminiData = await geminiResponse.json();
    
    // Extract text content from Gemini's response structure
    const resultJsonString = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultJsonString) {
      throw new Error("Failed to extract JSON from Gemini response");
    }
    
    const parsedResult = JSON.parse(resultJsonString);
    
    // Save to database
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('haq_session_id')?.value;

    if (sessionId && categoryId) {
      await prisma.caseInquiry.create({
        data: {
          intakeText: description,
          answers: answers || {},
          categoryId: categoryId,
          sessionId: sessionId,
          aiResponse: parsedResult,
        }
      });
    }

    return NextResponse.json(parsedResult);
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during analysis.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
