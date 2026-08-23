import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EliteCaseState, RightsInfo, RoadmapStep, NextAction, FactValue } from "./types";
import { getRequiredFieldsForCategory, CaseFieldSchema } from "./caseSchemas";

export async function processCaseStateSinglePass(
  ai: GoogleGenAI, 
  userMessage: string, 
  currentState: EliteCaseState
): Promise<{ 
  state: EliteCaseState;
  responseText: string;
}> {
  
  const categories = [
    "Tenant / Rental", "Consumer Complaint", "Government Scheme", "Government Service Delay",
    "RTI", "Workplace / Employment", "Harassment / Abuse", "Banking / Financial Complaint",
    "Land / Property", "Identity / Documentation", "Public Services", "Document Understanding", "General Inquiry"
  ];

  const currentCategory = currentState.category || "Unknown";
  const requiredFields = getRequiredFieldsForCategory(currentCategory);
  
  const megaPrompt = `
You are HAQ, an elite, empathetic Civic and Legal Assistant for India.
You must extract facts from the user's latest message, categorize the case, and formulate a brief acknowledgment.

CURRENT CASE FILE:
Category: ${currentCategory}
Sub-Category: ${currentState.subCategory || "Unknown"}
Summary: ${currentState.summary || "None"}

ALREADY KNOWN FACTS:
${JSON.stringify(currentState.facts, null, 2)}

REQUIRED FIELDS SCHEMA (Use these exactly if extracting new facts):
${JSON.stringify(requiredFields.map(f => f.id))}

USER'S NEW MESSAGE:
"${userMessage}"

INSTRUCTIONS:
1. Detect Language: Use the user's exact language/script (e.g. Hindi, Hinglish, English) for your acknowledgment.
2. Fact Extraction: Extract ANY relevant facts from the user's message that match the REQUIRED FIELDS SCHEMA. 
   - Set status to "known", "yes", "no", or "unknown".
   - Even if the user says "I don't know", extract it with status "unknown".
   - If they say "no", extract it with status "no".
3. Acknowledgment: Write a very short (1 sentence) acknowledgment of the specific facts the user just provided. DO NOT ASK ANY QUESTIONS in this acknowledgment. Example: "Got it — ₹50,000 recorded and no reason provided."
4. Categorization: If Category is Unknown, classify it into one of: ${categories.join(", ")}. Provide a Sub-Category and a 1-sentence Summary.
5. Rights & Roadmap: If the user has provided a lot of information, generate a basic rights analysis and roadmap.

Output strictly as JSON matching the schema.
  `;

  const megaSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isImmediateDanger: { type: Type.BOOLEAN },
      dangerResponse: { type: Type.STRING, nullable: true },
      category: { type: Type.STRING, nullable: true },
      subCategory: { type: Type.STRING, nullable: true },
      summary: { type: Type.STRING, nullable: true },
      newFacts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            value: { type: Type.STRING, nullable: true },
            status: { type: Type.STRING, enum: ["known", "yes", "no", "unknown"] }
          }
        },
        description: "Array of newly extracted facts matching the required fields schema."
      },
      acknowledgment: {
        type: Type.STRING,
        description: "A short 1-sentence acknowledgment of what the user just said. NEVER ask a question here."
      },
      rights: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
          source: { 
            type: Type.OBJECT, 
            nullable: true,
            properties: {
              name: { type: Type.STRING },
              url: { type: Type.STRING }
            }
          }
        }
      },
      roadmap: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["completed", "current", "pending"] },
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      nextAction: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["generate_document", "open_portal", "call_helpline", "wait", "gather_evidence", "safety_check"] },
          url: { type: Type.STRING, nullable: true }
        }
      }
    }
  };

  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: megaPrompt,
      config: { responseMimeType: "application/json", responseSchema: megaSchema, temperature: 0.1 }
    });

    if (res.text) {
      let cleanText = res.text;
      if (cleanText.startsWith("\`\`\`json")) cleanText = cleanText.substring(7);
      if (cleanText.startsWith("\`\`\`")) cleanText = cleanText.substring(3);
      if (cleanText.endsWith("\`\`\`")) cleanText = cleanText.substring(0, cleanText.length - 3);
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      
      if (parsed.isImmediateDanger && parsed.dangerResponse) {
        return {
          state: currentState,
          responseText: parsed.dangerResponse
        };
      }

      // Step 2: Merge Facts
      const updatedFacts = { ...currentState.facts };
      if (parsed.newFacts && Array.isArray(parsed.newFacts)) {
        for (const fact of parsed.newFacts) {
          if (fact.id) {
            updatedFacts[fact.id] = {
              value: fact.value || fact.status,
              source: "user",
              confidence: "high",
              status: fact.status as any
            };
          }
        }
      }

      const activeCategory = parsed.category || currentCategory;
      const schemaFields = getRequiredFieldsForCategory(activeCategory);

      // Step 3: Compute Missing Fields
      const missingFields: CaseFieldSchema[] = [];
      const uiMissingFieldNames: string[] = [];
      
      for (const field of schemaFields) {
        // If it's not in updatedFacts at all, it's missing.
        // If it is in updatedFacts, it is NO LONGER missing (even if "no" or "unknown")
        if (!updatedFacts[field.id]) {
          missingFields.push(field);
          uiMissingFieldNames.push(field.id.replace(/_/g, " "));
        }
      }

      // Sort missing fields by priority
      missingFields.sort((a, b) => b.priority - a.priority);

      let finalResponseText = parsed.acknowledgment || "Got it.";
      let nextQuestionId: string | null = null;
      let nextQuestionText: string | null = null;

      // Filter out fields we have already asked about (to prevent loops, just in case, though they shouldn't be missing if answered)
      const unaskedMissingFields = missingFields.filter(f => !currentState.askedQuestions.includes(f.id));

      if (unaskedMissingFields.length > 0) {
        // Pick the top priority missing field
        const nextField = unaskedMissingFields[0];
        nextQuestionId = nextField.id;
        nextQuestionText = nextField.questionText;
        
        finalResponseText = `${finalResponseText}\n\n${nextQuestionText}`;
      } else if (missingFields.length > 0) {
        // We have asked about everything that is missing, but the user hasn't answered them.
        // We should stop asking to avoid loops, and move to ready state.
        finalResponseText = `${finalResponseText}\n\nI think I have enough information to analyze your case now.`;
      } else {
        // Nothing is missing
        finalResponseText = `${finalResponseText}\n\nI have gathered all the necessary facts. I will now analyze your case.`;
      }

      const newAskedQuestions = [...currentState.askedQuestions];
      if (nextQuestionId && !newAskedQuestions.includes(nextQuestionId)) {
        newAskedQuestions.push(nextQuestionId);
      }

      const isReadyForAction = missingFields.length === 0 || unaskedMissingFields.length === 0;
      
      const updatedState: EliteCaseState = {
        category: activeCategory,
        subCategory: parsed.subCategory || currentState.subCategory,
        summary: parsed.summary || currentState.summary,
        facts: updatedFacts,
        missingInformation: uiMissingFieldNames,
        evidenceReady: currentState.evidenceReady,
        askedQuestions: newAskedQuestions,
        rights: parsed.rights || currentState.rights,
        roadmap: parsed.roadmap || currentState.roadmap,
        nextAction: parsed.nextAction || currentState.nextAction,
        confidence: parsed.confidence || currentState.confidence,
        jurisdiction: currentState.jurisdiction,
        currentStep: isReadyForAction ? "ready_for_action" : "gathering_facts"
      };

      return {
        state: updatedState,
        responseText: finalResponseText
      };
    }
  } catch (e: any) {
    console.error("State Engine failed", e);
    return {
      state: currentState,
      responseText: `I'm having trouble analyzing that right now. (Debug Error: ${e.message})`
    };
  }

  // Fallback
  return {
    state: currentState,
    responseText: "I'm having trouble analyzing that right now. Could you provide a bit more detail?"
  };
}
