import { GoogleGenAI, Type, Schema } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function main() {
  const dangerSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isImmediateDanger: { type: Type.BOOLEAN },
      dangerResponse: { type: Type.STRING, nullable: true }
    }
  };

  try {
    const dangerRes = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Are you dangerous?",
      config: { responseMimeType: "application/json", responseSchema: dangerSchema, temperature: 0.1 }
    });
    console.log("Success with gemini-2.0-flash:", dangerRes.text);
  } catch (e: any) {
    console.error("Error with gemini-2.0-flash:", e.message);
  }

  try {
    const dangerRes = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Are you dangerous?",
      config: { responseMimeType: "application/json", responseSchema: dangerSchema, temperature: 0.1 }
    });
    console.log("Success with gemini-1.5-flash:", dangerRes.text);
  } catch (e: any) {
    console.error("Error with gemini-1.5-flash:", e.message);
  }
}

main();
