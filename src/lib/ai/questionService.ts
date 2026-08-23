import { GoogleGenAI } from "@google/genai";
import { EliteCaseState } from "./types";

export async function generateNextQuestion(
  ai: GoogleGenAI, 
  userMessage: string,
  currentState: EliteCaseState,
  isImmediateDanger: boolean,
  dangerResponse?: string
): Promise<string> {
  
  if (isImmediateDanger && dangerResponse) {
    return dangerResponse;
  }

  if (!currentState.category || currentState.category === "General Inquiry") {
    return "I can help with administrative delays, tenancy disputes, municipal issues, workplace harassment, domestic abuse, and more. Could you provide a bit more detail about your legal or civic issue so I can guide you properly?";
  }

  const isReady = currentState.missingInformation.length === 0 && Object.keys(currentState.facts).length > 0;

  const genPrompt = `
You are HAQ, an empathetic, highly intelligent civic and legal assistant for India.
The user's issue is: ${currentState.category} (${currentState.subCategory}).
Summary: ${currentState.summary}
Known Facts: ${JSON.stringify(currentState.facts)}
Missing Information: ${JSON.stringify(currentState.missingInformation)}

User's last message: "${userMessage}"

INSTRUCTIONS:
1. Detect the language of the user's message (e.g., English, Hindi in Devanagari, Hinglish).
2. Respond NATURALLY in that SAME language.
3. First, acknowledge what they just said concisely.
4. If there is missing information, ask the SINGLE most important next question from the "Missing Information" list. Do NOT ask multiple questions.
5. If there is NO missing information, tell them you have gathered the necessary context and point them to the "Next Best Action" button.
6. Keep the response to 1 or 2 short sentences. Do not use complex legal jargon.

Generate the exact response text to display to the user.
  `;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: genPrompt,
      config: { temperature: 0.7 }
    });
    
    return res.text || "Could you provide more details?";
  } catch (e) {
    console.error("Question generation failed", e);
    return "Could you provide more details?";
  }
}
