import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SCHEMAS } from "@/lib/schemas";

// Heuristic matcher for offline / fallback categorization
function matchCategoryOffline(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("scholarship") || lower.includes("stipend") || lower.includes("fellowship") || lower.includes("matric") || lower.includes("pension") || lower.includes("welfare")) {
    return "SCHOLARSHIP_DELAY";
  }
  if (lower.includes("landlord") || lower.includes("tenant") || lower.includes("deposit") || lower.includes("rent") || lower.includes("flat") || lower.includes("eviction") || lower.includes("lease")) {
    return "TENANCY_DISPUTE";
  }
  if (lower.includes("garbage") || lower.includes("road") || lower.includes("pothole") || lower.includes("drain") || lower.includes("sanitation") || lower.includes("municipal") || lower.includes("water supply")) {
    return "MUNICIPAL_SANITATION";
  }
  if (lower.includes("refund") || lower.includes("defective") || lower.includes("amazon") || lower.includes("flipkart") || lower.includes("product") || lower.includes("fraud") || lower.includes("invoice") || lower.includes("broken")) {
    return "CONSUMER_FRAUD";
  }
  if (lower.includes("harass") || lower.includes("posh") || lower.includes("abuse") || lower.includes("threat") || lower.includes("stalk") || lower.includes("fir") || lower.includes("assault")) {
    return "SEXUAL_HARASSMENT_ABUSE";
  }
  return "GENERAL";
}

// Heuristic field extractor for offline / fallback mode
function extractFieldsOffline(message: string, schemaKey: string, currentData: Record<string, any>): Record<string, any> {
  const extracted: Record<string, any> = {};
  const lower = message.toLowerCase();

  if (schemaKey === "TENANCY_DISPUTE") {
    const depositMatch = message.match(/(?:rs\.?|inr|₹|\s)(\d{3,7})/i);
    if (depositMatch && !currentData.depositAmount) extracted.depositAmount = `₹${depositMatch[1]}`;
    if ((lower.includes("yes") || lower.includes("signed") || lower.includes("registered")) && currentData.leaseAgreement === undefined) extracted.leaseAgreement = true;
    if ((lower.includes("no") || lower.includes("verbal")) && currentData.leaseAgreement === undefined) extracted.leaseAgreement = false;
    if (lower.includes("delhi") || lower.includes("mumbai") || lower.includes("bengaluru") || lower.includes("bangalore") || lower.includes("pune") || lower.includes("hyderabad")) {
      if (!currentData.state) extracted.state = message;
    }
  } else if (schemaKey === "SCHOLARSHIP_DELAY") {
    if (lower.includes("post-matric") || lower.includes("nsp") || lower.includes("merit")) {
      if (!currentData.scholarshipName) extracted.scholarshipName = message;
    }
    const durationMatch = message.match(/(\d+\s*(?:month|day|week|year)s?)/i);
    if (durationMatch && !currentData.durationDelayed) extracted.durationDelayed = durationMatch[1];
  } else if (schemaKey === "CONSUMER_FRAUD") {
    const amountMatch = message.match(/(?:rs\.?|inr|₹|\s)(\d{3,7})/i);
    if (amountMatch && !currentData.disputeAmount) extracted.disputeAmount = `₹${amountMatch[1]}`;
    if (!currentData.productService && (lower.includes("phone") || lower.includes("laptop") || lower.includes("order") || lower.includes("item"))) {
      extracted.productService = message;
    }
  }

  return extracted;
}

export async function POST(request: Request) {
  try {
    const { message, caseId } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('haq_session_id')?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    const hasAiKey = !!apiKey && apiKey.length > 5;
    let ai: GoogleGenAI | null = null;
    if (hasAiKey) {
      try {
        ai = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn("GoogleGenAI client init error:", err);
      }
    }

    // 1. Load or Create Case (with DB fallback)
    let aiCase: any = null;
    let isDbConnected = false;

    try {
      if (caseId) {
        aiCase = await prisma.aiCase.findUnique({
          where: { id: caseId },
          include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
      }
      
      if (!aiCase) {
        aiCase = await prisma.aiCase.create({
          data: {
            sessionId,
            category: null,
            extractedData: { _retries: {} }
          },
          include: { messages: true }
        });
      }

      await prisma.aiCaseMessage.create({
        data: { aiCaseId: aiCase.id, role: "user", content: message }
      });
      isDbConnected = true;
    } catch (dbErr) {
      console.warn("Database unavailable, operating with session memory:", dbErr);
      aiCase = {
        id: caseId || `case-${Date.now()}`,
        sessionId,
        category: null,
        extractedData: { _retries: {} },
        readinessScore: 0,
        status: "gathering_context",
        messages: [{ id: `msg-${Date.now()}`, role: "user", content: message }]
      };
    }

    // 1.5 Categorization
    let currentCategoryKey = aiCase.category;
    if (!currentCategoryKey) {
      if (ai) {
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
            currentCategoryKey = parsed.categoryKey || matchCategoryOffline(message);
          } else {
            currentCategoryKey = matchCategoryOffline(message);
          }
        } catch (e) {
          console.error("AI Categorization error, using heuristic:", e);
          currentCategoryKey = matchCategoryOffline(message);
        }
      } else {
        currentCategoryKey = matchCategoryOffline(message);
      }

      // Update case category
      aiCase.category = currentCategoryKey;
      if (isDbConnected) {
        try {
          aiCase = await prisma.aiCase.update({
            where: { id: aiCase.id },
            data: { category: currentCategoryKey },
            include: { messages: true }
          });
        } catch {}
      }
    }

    const ACTIVE_SCHEMA = SCHEMAS[currentCategoryKey as string] || SCHEMAS.GENERAL;
    const currentExtractedData = (aiCase.extractedData || {}) as Record<string, any>;
    const retries = currentExtractedData._retries || {};

    // 2. Extraction
    let newlyExtracted: Record<string, any> = {};

    if (ACTIVE_SCHEMA.requiredFields.length > 0) {
      if (ai) {
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
            console.error("AI Extraction error, using heuristic:", e);
            newlyExtracted = extractFieldsOffline(message, currentCategoryKey, currentExtractedData);
          }
        }
      } else {
        newlyExtracted = extractFieldsOffline(message, currentCategoryKey, currentExtractedData);
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
          if (!missingFieldToAsk) {
            const currentRetries = retries[field.key] || 0;
            if (currentRetries < 2) {
              missingFieldToAsk = field.key;
              missingFieldLabel = field.label;
              retries[field.key] = currentRetries + 1;
            } else {
              currentExtractedData[field.key] = "SKIPPED";
              fieldsAnswered++;
            }
          }
        }
      }
      readinessScore = Math.floor((fieldsAnswered / ACTIVE_SCHEMA.requiredFields.length) * 100);
    } else {
      readinessScore = 100;
    }

    currentExtractedData._retries = retries;

    let newStatus = aiCase.status || "gathering_context";
    if (readinessScore === 100) {
      newStatus = "ready";
    }

    let updatedCase = {
      ...aiCase,
      category: currentCategoryKey,
      extractedData: currentExtractedData,
      readinessScore,
      status: newStatus
    };

    if (isDbConnected) {
      try {
        updatedCase = await prisma.aiCase.update({
          where: { id: aiCase.id },
          data: {
            extractedData: currentExtractedData,
            readinessScore,
            status: newStatus
          }
        });
      } catch {}
    }

    // 3. Response Generation
    let aiResponseText = "";

    if (currentCategoryKey === "GENERAL") {
      aiResponseText = "I can help with administrative delays, tenancy disputes, municipal issues, cyber fraud, and workplace rights. Could you provide a bit more detail about your specific legal or civic issue so I can guide you properly?";
      updatedCase.readinessScore = 0;
      updatedCase.status = "gathering_context";
    } else if (newStatus === "ready") {
      aiResponseText = `Thank you. I have gathered the necessary facts regarding your ${ACTIVE_SCHEMA.category} issue. Your evidentiary readiness score is 100%. You can now generate an official Section 6(1) RTI Application or a Formal Legal Demand Notice from the Document Studio.`;
    } else if (missingFieldToAsk) {
      if (ai) {
        const genPrompt = `
You are HAQ, an empathetic Indian civic assistant case interviewer. 
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
          aiResponseText = res.text?.trim() || `Could you please provide your ${missingFieldLabel}?`;
        } catch {
          aiResponseText = `Could you please provide your ${missingFieldLabel}?`;
        }
      } else {
        aiResponseText = `Could you please specify your ${missingFieldLabel}?`;
      }
    } else {
      aiResponseText = "I have noted that down. Is there any additional detail, reference number, or date you would like to add?";
    }

    let savedMsg: any = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: aiResponseText,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected) {
      try {
        savedMsg = await prisma.aiCaseMessage.create({
          data: { aiCaseId: aiCase.id, role: "assistant", content: aiResponseText }
        });
      } catch {}
    }

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
    return NextResponse.json({
      error: error.message || "An unexpected error occurred",
      caseState: {
        id: `case-${Date.now()}`,
        category: "General Civic Concern",
        readinessScore: 30,
        status: "gathering_context",
        extractedData: {}
      },
      message: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "I have recorded your issue. Could you please provide your city/state and any reference numbers so we can identify the correct authority?"
      },
      schemaDetails: {
        categoryLabel: "General Civic Concern",
        rightsNavigator: SCHEMAS.GENERAL.rightsNavigator
      }
    });
  }
}
