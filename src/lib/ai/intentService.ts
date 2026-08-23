import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EliteCaseState } from "./types";

export async function detectIntentAndDanger(
  ai: GoogleGenAI, 
  userMessage: string, 
  currentState: EliteCaseState
): Promise<{ 
  isImmediateDanger: boolean; 
  category: string | null; 
  subCategory: string | null;
  summary: string | null;
  dangerResponse?: string;
}> {
  // 1. Hard check for Immediate Danger (Safety First Mode)
  const dangerPrompt = `
You are a safety classification engine. Determine if the user's message indicates IMMEDIATE PHYSICAL DANGER, A THREAT TO LIFE, OR ACTIVE ASSAULT.
User message: "${userMessage}"
If yes, provide a concise, supportive response asking if they are safe and advising them to contact emergency services (112 in India). DO NOT give legal advice.
  `;

  const dangerSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isImmediateDanger: { type: Type.BOOLEAN },
      dangerResponse: { type: Type.STRING, nullable: true }
    }
  };

  const dangerPromise = ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: dangerPrompt,
    config: { responseMimeType: "application/json", responseSchema: dangerSchema, temperature: 0.1 }
  }).catch(e => {
    console.error("Danger detection failed", e);
    return null;
  });

  let catPromise: Promise<any> = Promise.resolve(null);
  
  if (!currentState.category || currentState.category === "General Inquiry") {
    const categories = [
      "Tenant / Rental", "Consumer Complaint", "Government Scheme", "Government Service Delay",
      "RTI", "Workplace / Employment", "Harassment / Abuse", "Banking / Financial Complaint",
      "Land / Property", "Identity / Documentation", "Public Services", "Document Understanding", "General Inquiry"
    ];

    const categoryPrompt = `
Analyze the user's issue and classify it into one of the following main categories: ${categories.join(", ")}.
Also provide a specific sub-category (e.g., "Security Deposit", "Sexual Harassment", "Scholarship").
Finally, write a 1-sentence summary of the issue.
User message: "${userMessage}"
    `;

    const categorySchema: Schema = {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        subCategory: { type: Type.STRING },
        summary: { type: Type.STRING }
      }
    };

    catPromise = ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: categoryPrompt,
      config: { responseMimeType: "application/json", responseSchema: categorySchema, temperature: 0.1 }
    }).catch(e => {
      console.error("Categorization failed", e);
      return null;
    });
  }

  // Run both in parallel
  const [dangerRes, catRes] = await Promise.all([dangerPromise, catPromise]);

  if (dangerRes && dangerRes.text) {
    try {
      const parsed = JSON.parse(dangerRes.text);
      if (parsed.isImmediateDanger) {
        return {
          isImmediateDanger: true,
          category: "Immediate Safety Concern",
          subCategory: "Emergency",
          summary: "User is in immediate danger.",
          dangerResponse: parsed.dangerResponse || "Please ensure you are in a safe place. If you are in immediate danger, dial 112 for emergency police assistance immediately."
        };
      }
    } catch(e) {}
  }

  if (catRes && catRes.text) {
    try {
      const parsed = JSON.parse(catRes.text);
      return {
        isImmediateDanger: false,
        category: parsed.category,
        subCategory: parsed.subCategory,
        summary: parsed.summary
      };
    } catch(e) {}
  }

  return {
    isImmediateDanger: false,
    category: currentState.category,
    subCategory: currentState.subCategory,
    summary: currentState.summary
  };
}
