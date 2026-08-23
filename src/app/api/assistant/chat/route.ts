import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SCHEMAS } from "@/lib/schemas";

// Ensure AI key is available
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
          category: null, // Null until categorized
          extractedData: { _retries: {} }
        },
        include: { messages: true }
      });
    }

    // Save user message
    await prisma.aiCaseMessage.create({
      data: { aiCaseId: aiCase.id, role: "user", content: message }
    });

    // 1.5 Dynamic Categorization (Only if category is null)
    let currentCategoryKey = aiCase.category;
    if (!currentCategoryKey) {
      const categorySchema: Schema = {
        type: Type.OBJECT,
        properties: {
          categoryKey: {
            type: Type.STRING,
            enum: Object.keys(SCHEMAS),
            description: "The matched category key based on the user issue"
          }
        }
      };

      const categorizationPrompt = `
You are a civic legal categorization engine. Match the user's issue to one of the following schema keys:
${Object.keys(SCHEMAS).join(", ")}
If it doesn't clearly fit, return GENERAL.
User's message: "${message}"
      `;

      try {
        const catRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: categorizationPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: categorySchema,
            temperature: 0.1
          }
        });
        
        if (catRes.text) {
          const parsed = JSON.parse(catRes.text);
          currentCategoryKey = parsed.categoryKey || "GENERAL";
        } else {
          currentCategoryKey = "GENERAL";
        }
      } catch (e) {
        console.error("Categorization error:", e);
        currentCategoryKey = "GENERAL";
      }

      // Update case with initial category
      aiCase = await prisma.aiCase.update({
        where: { id: aiCase.id },
        data: { category: currentCategoryKey },
        include: { messages: true }
      });
    }

    const ACTIVE_SCHEMA = SCHEMAS[currentCategoryKey as string] || SCHEMAS.GENERAL;
    const currentExtractedData = aiCase.extractedData as Record<string, any>;
    const retries = currentExtractedData._retries || {};

    // 2. Intent & Extraction Service (LLM)
    let newlyExtracted: Record<string, any> = {};
    
    if (ACTIVE_SCHEMA.requiredFields.length > 0) {
      const properties: Record<string, Schema> = {};
      for (const field of ACTIVE_SCHEMA.requiredFields) {
        if (!currentExtractedData[field.key]) {
          properties[field.key] = {
            type: field.type === "boolean" ? Type.BOOLEAN : Type.STRING,
            description: field.label,
            nullable: true
          };
        }
      }
      
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
    }

    // Merge extracted data
    let missingFieldToAsk = null;
    let missingFieldLabel = "";
    let readinessScore = 0;
    let fieldsAnswered = 0;

    if (ACTIVE_SCHEMA.requiredFields.length > 0) {
      for (const field of ACTIVE_SCHEMA.requiredFields) {
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
      readinessScore = Math.floor((fieldsAnswered / ACTIVE_SCHEMA.requiredFields.length) * 100);
    } else {
      readinessScore = 100; // General fallback schema has no required fields
    }

    currentExtractedData._retries = retries;
    
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
    
    if (currentCategoryKey === "GENERAL") {
      aiResponseText = "I can help with administrative delays, tenancy disputes, municipal issues, and consumer fraud. Could you provide a bit more detail about your legal or civic issue so I can guide you properly?";
      if (readinessScore === 100) {
         // reset readiness score so it doesn't show ready for action
         await prisma.aiCase.update({ where: { id: aiCase.id }, data: { readinessScore: 0, status: "gathering_context" } });
         updatedCase.readinessScore = 0;
         updatedCase.status = "gathering_context";
      }
    } else if (newStatus === "ready") {
      aiResponseText = "Thank you. I have gathered all the necessary information regarding your issue. Your case profile is complete. We can now generate a formal RTI application or a Grievance Notice based on this data.";
    } else if (missingFieldToAsk) {
      const genPrompt = `
You are HAQ, an empathetic civic assistant case interviewer. 
The user is reporting an issue related to: ${ACTIVE_SCHEMA.category}.
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

    // We will attach the ACTIVE_SCHEMA so the frontend can render the dynamic texts.
    return NextResponse.json({
      caseState: updatedCase,
      message: savedMsg,
      schemaDetails: {
        categoryLabel: ACTIVE_SCHEMA.category,
        rightsNavigator: ACTIVE_SCHEMA.rightsNavigator
      }
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
