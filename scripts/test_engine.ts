import OpenAI from "openai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY;
const ai = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" });

import { processCaseStateSinglePass } from "../src/lib/ai/stateEngineService";
import { INITIAL_ELITE_STATE, EliteCaseState } from "../src/lib/ai/types";

async function main() {
  console.log("Testing State Engine Repetition Bug Fix...\n");
  try {
    let currentState: EliteCaseState = { ...INITIAL_ELITE_STATE };
    
    const messages = [
      "My landlord won't return my deposit",
      "yes",
      "delhi",
      "no reason",
      "yes, 50000",
      "rohini delhi, 30000 rent"
    ];

    for (const msg of messages) {
      console.log(`\n\nUSER: "${msg}"`);
      console.log(`Current askedQuestions:`, currentState.askedQuestions);
      console.log("Processing...");
      
      const res = await processCaseStateSinglePass(ai, msg, currentState);
      currentState = res.state;
      
      console.log(`AI: "${res.responseText}"`);
      console.log(`Extracted Facts:`, Object.keys(currentState.facts).map(k => `${k}: ${currentState.facts[k].value} (${currentState.facts[k].status})`));
      console.log(`Missing Info:`, currentState.missingInformation);
    }
  } catch (e: any) {
    console.error("Test failed:", e.message);
  }
}

main();
