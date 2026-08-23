import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testModel(modelName: string) {
  console.log(`Testing ${modelName}...`);
  try {
    const res = await ai.models.generateContent({
      model: modelName,
      contents: "Say hello",
    });
    console.log(`[SUCCESS] ${modelName}:`, res.text);
  } catch (e: any) {
    console.log(`[ERROR] ${modelName}:`, e.message);
  }
}

async function main() {
  await testModel("gemini-3.1-flash-lite");
  await testModel("gemini-2.5-flash-lite");
  await testModel("gemini-3.6-flash");
}
main();
