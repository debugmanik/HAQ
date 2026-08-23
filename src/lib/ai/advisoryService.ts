import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EliteCaseState, RightsInfo, RoadmapStep, NextAction } from "./types";

export async function generateAdvisory(
  ai: GoogleGenAI, 
  currentState: EliteCaseState
): Promise<{ 
  rights: RightsInfo | null; 
  roadmap: RoadmapStep[]; 
  nextAction: NextAction | null;
  confidence: "high" | "medium" | "low";
  isReadyForAction: boolean;
}> {
  if (!currentState.category || currentState.category === "General Inquiry") {
    return { rights: null, roadmap: currentState.roadmap, nextAction: null, confidence: "low", isReadyForAction: false };
  }

  // Determine readiness: If there are fewer missing facts, we are closer to action.
  const isReadyForAction = currentState.missingInformation.length === 0 && Object.keys(currentState.facts).length > 0;

  const advisoryPrompt = `
You are an expert Indian Legal and Civic Rights Advisor.
The user's case is: ${currentState.category} (${currentState.subCategory}).
Summary: ${currentState.summary}
Known Facts: ${JSON.stringify(currentState.facts)}
Evidence the user has: ${JSON.stringify(currentState.evidenceReady)}
Are all necessary facts gathered? ${isReadyForAction ? 'YES' : 'NO'}

Tasks:
1. Identify the specific legal rights or civic rules that apply (e.g., Model Tenancy Act, POSH Act, RTI Act). Keep descriptions simple and actionable. Provide a real, authoritative source (e.g., india.gov.in, specific Ministry portal). Do not hallucinate URLs.
2. Generate a 3 to 5 step resolution roadmap. Mark early steps as "completed", current steps as "current", and future steps as "pending".
3. Determine the SINGLE Next Best Action the user should take right now. If facts are missing, the action might be "Provide missing details". If ready, it might be "Generate Formal Request" or "File Grievance".
4. Determine your confidence in this advice ("high", "medium", "low").

Output as JSON.
  `;

  const advisorySchema: Schema = {
    type: Type.OBJECT,
    properties: {
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
      }
    }
  };

  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: advisoryPrompt,
      config: { responseMimeType: "application/json", responseSchema: advisorySchema, temperature: 0.1 }
    });

    if (res.text) {
      const parsed = JSON.parse(res.text);
      return {
        rights: parsed.rights || null,
        roadmap: parsed.roadmap || currentState.roadmap,
        nextAction: parsed.nextAction || null,
        confidence: parsed.confidence || "low",
        isReadyForAction
      };
    }
  } catch (e) {
    console.error("Advisory generation failed", e);
  }

  return { rights: null, roadmap: currentState.roadmap, nextAction: null, confidence: "low", isReadyForAction: false };
}
