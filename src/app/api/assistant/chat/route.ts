import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI, Type, Schema } from "@google/genai";

// Ensure AI key is available
const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Define the expected schema for the Scholarship demo
const SCHOLARSHIP_SCHEMA = {
  category: "Education / Government Scheme",
  requiredFields: [
    { key: "state", label: "State of Residence", type: "string" },
    { key: "scholarshipName", label: "Name of the Scholarship", type: "string" },
    { key: "applicationId", label: "Application/Reference Number", type: "string" },
    { key: "durationDelayed", label: "Duration of Delay (e.g., 4 months)", type: "string" },
    { key: "departmentContacted", label: "Have you contacted the department?", type: "boolean" }
  ]
};

export async function POST(request: Request) {
  try {
    const { message, caseId } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('haq_session_id')?.value;
    if (!sessionId) {
      // In a real app, we handle session creation earlier, but fallback here
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
          category: SCHOLARSHIP_SCHEMA.category,
          extractedData: { _retries: {} }
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "user", content: message }
    });

    const currentExtractedData = aiCase.extractedData as Record<string, any>;
    const retries = currentExtractedData._retries || {};

    // 2. Intent & Extraction Service (LLM)
    const properties: Record<string, Schema> = {};
    for (const field of SCHOLARSHIP_SCHEMA.requiredFields) {
      if (!currentExtractedData[field.key]) {
        properties[field.key] = {
          type: field.type === "boolean" ? Type.BOOLEAN : Type.STRING,
          description: field.label,
          nullable: true
        };
      }
    }
    
    let newlyExtracted: Record<string, any> = {};
    if (Object.keys(properties).length > 0) {
      const extractionSchema: Schema = {
        type: Type.OBJECT,
        properties
      };

      const extractionPrompt = `
You are an intent extractor for a civic legal assistant.
Extract the relevant fields from the user's latest message. If a field is not mentioned, leave it null.
User's message: "${message}"
      `;

      try {
        const extractRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: extractionPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: extractionSchema,
            temperature: 0.1
          }
        });
        
        if (extractRes.text) {
          newlyExtracted = JSON.parse(extractRes.text);
        }
      } catch (e) {
        console.error("Extraction error:", e);
      }
    }

    // Merge extracted data
    let missingFieldToAsk = null;
    let missingFieldLabel = "";
    let readinessScore = 0;
    let fieldsAnswered = 0;

    for (const field of SCHOLARSHIP_SCHEMA.requiredFields) {
      if (newlyExtracted[field.key] !== undefined && newlyExtracted[field.key] !== null) {
        currentExtractedData[field.key] = newlyExtracted[field.key];
      }
      
      if (currentExtractedData[field.key] !== undefined && currentExtractedData[field.key] !== null) {
        fieldsAnswered++;
      } else {
        // Evaluate retries
        if (!missingFieldToAsk) {
          const currentRetries = retries[field.key] || 0;
          if (currentRetries < 2) {
            missingFieldToAsk = field.key;
            missingFieldLabel = field.label;
            retries[field.key] = currentRetries + 1;
          } else {
            // Skip this field, mark as skipped
            currentExtractedData[field.key] = "SKIPPED";
            fieldsAnswered++; // Count as handled so we can move on
          }
        }
      }
    }

    currentExtractedData._retries = retries;
    readinessScore = Math.floor((fieldsAnswered / SCHOLARSHIP_SCHEMA.requiredFields.length) * 100);
    
    let newStatus = aiCase.status;
    if (readinessScore === 100) {
      newStatus = "ready";
    }

    // Update case state
    const updatedCase = await prisma.aiCase.update({
      where: { id: aiCase.id },
      data: {
        extractedData: currentExtractedData,
        readinessScore,
        status: newStatus
      }
    });

    // 3. Response Generator Service (LLM)
    let aiResponseText = "";
    
    if (newStatus === "ready") {
      aiResponseText = "Thank you. I have gathered all the necessary information regarding your scholarship delay. Your case profile is complete. We can now generate a formal RTI application or a Grievance Notice based on this data.";
    } else if (missingFieldToAsk) {
      const genPrompt = `
You are HAQ, an empathetic civic assistant case interviewer. 
The user is reporting a delayed scholarship.
You need to ask them about: ${missingFieldLabel}.
Keep it to ONE concise, polite sentence. Do not offer solutions yet.
      `;
      try {
        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: genPrompt,
          config: { temperature: 0.7 }
        });
        aiResponseText = res.text || `Could you please provide your ${missingFieldLabel}?`;
      } catch (e) {
        aiResponseText = `Could you please provide your ${missingFieldLabel}?`;
      }
    } else {
      aiResponseText = "I have noted that down. Is there anything else you want to add?";
    }

    // Save assistant message
    const savedMsg = await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "assistant", content: aiResponseText }
    });

    return NextResponse.json({
      caseState: updatedCase,
      message: savedMsg
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
