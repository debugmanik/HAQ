import { GoogleGenAI, Type, Schema } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

import { processCaseStateSinglePass } from "../src/lib/ai/stateEngineService";
import { INITIAL_ELITE_STATE } from "../src/lib/ai/types";

async function main() {
  console.log("Testing State Engine...");
  try {
    const res = await processCaseStateSinglePass(ai, "My landlord won't return my deposit", INITIAL_ELITE_STATE);
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (e: any) {
    console.error("Test failed:", e.message);
  }
}

main();
