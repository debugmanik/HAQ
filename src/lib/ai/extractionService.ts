import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EliteCaseState } from "./types";

export async function extractFacts(
  ai: GoogleGenAI, 
  userMessage: string, 
  currentState: EliteCaseState
): Promise<{ 
  newFacts: Record<string, string | number | boolean>; 
  missingInformation: string[];
  evidenceReady: string[];
}> {
  
  if (!currentState.category || currentState.category === "General Inquiry") {
    return { newFacts: {}, missingInformation: [], evidenceReady: [] };
  }

  const extractionPrompt = `
You are an elite legal and civic fact extractor.
The user is facing an issue classified as: ${currentState.category} (${currentState.subCategory}).
Here is what we already know: ${JSON.stringify(currentState.facts)}
User's latest message: "${userMessage}"

Tasks:
1. Extract any NEW facts from the user's message that are relevant to this type of case (e.g., amounts, dates, locations, whether they have a contract/receipt, people involved).
2. Identify what CRITICAL information is still missing to build a complete case profile (e.g., location, date of incident, name of authority). Do not list things we already know. Keep the missing info list to a maximum of 3 crucial items.
3. Identify any evidence the user mentioned they have (e.g., "screenshots", "lease agreement", "receipt", "photos").

Output as JSON.
  `;

  const extractionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      newFacts: {
        type: Type.OBJECT,
        description: "Key-value pairs of newly extracted facts. Values can be strings, numbers, or booleans.",
      },
      missingInformation: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 1 to 3 critical pieces of information still needed."
      },
      evidenceReady: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of evidence items the user possesses."
      }
    }
  };

  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: extractionPrompt,
      config: { responseMimeType: "application/json", responseSchema: extractionSchema, temperature: 0.1 }
    });

    if (res.text) {
      const parsed = JSON.parse(res.text);
      return {
        newFacts: parsed.newFacts || {},
        missingInformation: parsed.missingInformation || [],
        evidenceReady: parsed.evidenceReady || []
      };
    }
  } catch (e) {
    console.error("Fact extraction failed", e);
  }

  return { newFacts: {}, missingInformation: [], evidenceReady: [] };
}
