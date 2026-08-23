import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  
  if (data.models) {
    const freeModels = data.models
      .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
      .map((m: any) => m.name);
    console.log("Available models for generateContent:");
    console.log(freeModels);
  } else {
    console.error("Failed to list models:", data);
  }
}

listModels();
