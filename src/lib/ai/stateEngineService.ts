import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EliteCaseState, RightsInfo, RoadmapStep, NextAction } from "./types";

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

  const megaPrompt = `
You are HAQ, an elite, empathetic, lightning-fast Civic and Legal Assistant for India.
You must analyze the user's latest message, update their case file, and generate your direct response.

CURRENT CASE FILE:
Category: ${currentState.category || "Unknown"}
Sub-Category: ${currentState.subCategory || "Unknown"}
Summary: ${currentState.summary || "None"}
Known Facts: ${JSON.stringify(currentState.facts)}
Previously Missing Info: ${JSON.stringify(currentState.missingInformation)}
Evidence: ${JSON.stringify(currentState.evidenceReady)}

USER'S NEW MESSAGE:
"${userMessage}"

INSTRUCTIONS:
1. Detect Language: Respond in the exact language/script the user used (e.g. Hinglish, Hindi, English).
2. Intent & Danger: If the user is in immediate physical danger, set 'isImmediateDanger' to true and formulate a 'dangerResponse' telling them to call 112.
3. Categorization: If the Category is Unknown or General Inquiry, classify it into one of: ${categories.join(", ")}. Provide a Sub-Category and a 1-sentence Summary.
4. Facts & Missing Info: Extract any NEW facts provided in the message. Identify up to 3 CRITICAL missing facts still needed (do not ask for things already known).
5. Advisory & Roadmap: Generate applicable rights (with a real source like india.gov.in) and a 3-5 step roadmap. 
6. Next Action: Decide the next best action.
7. Response Formulation: Write your conversational reply. Acknowledge what they said. If there is missing info, ask for the SINGLE most important missing fact. If none, tell them they are ready to proceed. Keep it to 1-2 short sentences.

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
        type: Type.OBJECT,
        description: "Key-value pairs of newly extracted facts (strings, numbers, booleans)."
      },
      missingInformation: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "1 to 3 critical pieces of info still needed."
      },
      evidenceReady: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
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
      },
      confidence: {
        type: Type.STRING,
        enum: ["high", "medium", "low"]
      },
      aiResponseText: {
        type: Type.STRING,
        description: "The actual conversational text you will say back to the user."
      }
    }
  };

  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: megaPrompt,
      config: { responseMimeType: "application/json", responseSchema: megaSchema, temperature: 0.1 }
    });

    if (res.text) {
      let cleanText = res.text;
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      
      if (parsed.isImmediateDanger && parsed.dangerResponse) {
        return {
          state: currentState,
          responseText: parsed.dangerResponse
        };
      }

      // Merge Facts & Evidence
      const updatedFacts = { ...currentState.facts, ...(parsed.newFacts || {}) };
      
      const newEv = (parsed.evidenceReady || []).filter((e: string) => !currentState.evidenceReady.includes(e));
      const updatedEvidence = [...currentState.evidenceReady, ...newEv];

      const isReadyForAction = (parsed.missingInformation || []).length === 0 && Object.keys(updatedFacts).length > 0;
      
      const updatedState: EliteCaseState = {
        category: parsed.category || currentState.category,
        subCategory: parsed.subCategory || currentState.subCategory,
        summary: parsed.summary || currentState.summary,
        facts: updatedFacts,
        missingInformation: parsed.missingInformation || [],
        evidenceReady: updatedEvidence,
        rights: parsed.rights || currentState.rights,
        roadmap: parsed.roadmap || currentState.roadmap,
        nextAction: parsed.nextAction || currentState.nextAction,
        confidence: parsed.confidence || currentState.confidence,
        jurisdiction: currentState.jurisdiction,
        currentStep: isReadyForAction ? "ready_for_action" : "gathering_facts"
      };

      return {
        state: updatedState,
        responseText: parsed.aiResponseText || "Could you provide more details?"
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
