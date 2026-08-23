import OpenAI from "openai";
import { EliteCaseState, RightsInfo, RoadmapStep, NextAction, FactValue } from "./types";
import { getRequiredFieldsForCategory, CaseFieldSchema } from "./caseSchemas";

export async function processCaseStateSinglePass(
  ai: OpenAI, 
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

  const currentCategory = currentState.category || "Unknown";
  const requiredFields = getRequiredFieldsForCategory(currentCategory);
  
  const megaSchema = {
    type: "object",
    properties: {
      isImmediateDanger: { type: "boolean" },
      dangerResponse: { type: "string", description: "Null if false" },
      category: { type: "string", description: "Null if unknown" },
      subCategory: { type: "string", description: "Null if unknown" },
      summary: { type: "string", description: "Null if unknown" },
      newFacts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: "string", description: "Null if unknown" },
            status: { type: "string", enum: ["known", "yes", "no", "unknown"] }
          }
        },
        description: "Array of newly extracted facts matching the required fields schema."
      },
      acknowledgment: {
        type: "string",
        description: "A short 1-sentence acknowledgment of what the user just said. NEVER ask a question here."
      },
      rights: {
        type: "object",
        description: "Null if not enough info",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          actions: { type: "array", items: { type: "string" } },
          evidence: { type: "array", items: { type: "string" } },
          source: { 
            type: "object",
            properties: {
              name: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      },
      roadmap: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: { type: "string", enum: ["completed", "current", "pending"] },
            title: { type: "string" },
            description: { type: "string" }
          }
        }
      },
      nextAction: {
        type: "object",
        description: "Null if not ready",
        properties: {
          title: { type: "string" },
          type: { type: "string", enum: ["generate_document", "open_portal", "call_helpline", "wait", "gather_evidence", "safety_check"] },
          url: { type: "string", description: "Null if none" }
        }
      }
    }
  };

  const megaPrompt = `
You are HAQ, an elite, empathetic Civic and Legal Assistant for India.
You must extract facts from the user's latest message, categorize the case, and formulate a brief acknowledgment.

CURRENT CASE FILE:
Category: ${currentCategory}
Sub-Category: ${currentState.subCategory || "Unknown"}
Summary: ${currentState.summary || "None"}

ALREADY KNOWN FACTS:
${JSON.stringify(currentState.facts, null, 2)}

REQUIRED FIELDS:
${JSON.stringify(requiredFields.map(f => f.id))}

USER'S NEW MESSAGE:
"${userMessage}"

INSTRUCTIONS:
1. Detect Language: Use the user's exact language/script for your acknowledgment.
2. Fact Extraction: Extract relevant facts that match the REQUIRED FIELDS.
   - Set status to "known", "yes", "no", or "unknown".
3. Acknowledgment: Write a very short (1 sentence) acknowledgment of the specific facts the user just provided. DO NOT ASK ANY QUESTIONS in this acknowledgment.
4. Categorization: If Category is Unknown, classify it into one of: ${categories.join(", ")}. Provide a Sub-Category and a 1-sentence Summary.
5. Rights & Roadmap: If the user has provided a lot of information, generate a basic rights analysis and roadmap.

OUTPUT STRICTLY AS JSON MATCHING THIS SCHEMA:
${JSON.stringify(megaSchema, null, 2)}
  `;

  const modelsToTry = ["grok-2-latest", "grok-beta"];
  let rawJsonOutput: string | null = null;
  let errorMsg = "Unknown error";

  for (const modelName of modelsToTry) {
    try {
      console.log(`[StateEngine] Trying model: ${modelName}`);
      const res = await ai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: megaPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });
      if (res && res.choices && res.choices[0].message.content) {
        rawJsonOutput = res.choices[0].message.content;
        break;
      }
    } catch (e: any) {
      console.warn(`[StateEngine] Model ${modelName} failed:`, e.message);
      errorMsg = e.message;
    }
  }

  try {
    if (rawJsonOutput) {
      let cleanText = rawJsonOutput;
      if (cleanText.startsWith("```json")) cleanText = cleanText.substring(7);
      if (cleanText.startsWith("```")) cleanText = cleanText.substring(3);
      if (cleanText.endsWith("```")) cleanText = cleanText.substring(0, cleanText.length - 3);
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      
      if (parsed.isImmediateDanger && parsed.dangerResponse) {
        return {
          state: currentState,
          responseText: parsed.dangerResponse
        };
      }

      const updatedFacts = { ...currentState.facts };
      if (parsed.newFacts && Array.isArray(parsed.newFacts)) {
        for (const fact of parsed.newFacts) {
          if (fact.id) {
            updatedFacts[fact.id] = {
              value: fact.value || fact.status,
              source: "user",
              confidence: "high",
              status: fact.status as any
            };
          }
        }
      }

      const activeCategory = parsed.category || currentCategory;
      const schemaFields = getRequiredFieldsForCategory(activeCategory);

      const missingFields: CaseFieldSchema[] = [];
      const uiMissingFieldNames: string[] = [];
      
      for (const field of schemaFields) {
        if (!updatedFacts[field.id]) {
          missingFields.push(field);
          uiMissingFieldNames.push(field.id.replace(/_/g, " "));
        }
      }

      missingFields.sort((a, b) => b.priority - a.priority);

      let finalResponseText = parsed.acknowledgment || "Got it.";
      let nextQuestionId: string | null = null;
      let nextQuestionText: string | null = null;

      const unaskedMissingFields = missingFields.filter(f => !currentState.askedQuestions.includes(f.id));

      if (unaskedMissingFields.length > 0) {
        const nextField = unaskedMissingFields[0];
        nextQuestionId = nextField.id;
        nextQuestionText = nextField.questionText;
        
        finalResponseText = `${finalResponseText}\n\n${nextQuestionText}`;
      } else if (missingFields.length > 0) {
        finalResponseText = `${finalResponseText}\n\nI think I have enough information to analyze your case now.`;
      } else {
        finalResponseText = `${finalResponseText}\n\nI have gathered all the necessary facts. I will now analyze your case.`;
      }

      const newAskedQuestions = [...currentState.askedQuestions];
      if (nextQuestionId && !newAskedQuestions.includes(nextQuestionId)) {
        newAskedQuestions.push(nextQuestionId);
      }

      const isReadyForAction = missingFields.length === 0 || unaskedMissingFields.length === 0;
      
      const updatedState: EliteCaseState = {
        category: activeCategory,
        subCategory: parsed.subCategory || currentState.subCategory,
        summary: parsed.summary || currentState.summary,
        facts: updatedFacts,
        missingInformation: uiMissingFieldNames,
        evidenceReady: currentState.evidenceReady,
        askedQuestions: newAskedQuestions,
        rights: parsed.rights || currentState.rights,
        roadmap: parsed.roadmap || currentState.roadmap,
        nextAction: parsed.nextAction || currentState.nextAction,
        confidence: parsed.confidence || currentState.confidence,
        jurisdiction: currentState.jurisdiction,
        currentStep: isReadyForAction ? "ready_for_action" : "gathering_facts"
      };

      return {
        state: updatedState,
        responseText: finalResponseText
      };
    }
  } catch (e: any) {
    console.error("State Engine parsing failed", e);
    return {
      state: currentState,
      responseText: `I'm having trouble analyzing that right now. (Parsing Error: ${e.message})`
    };
  }

  return {
    state: currentState,
    responseText: `I'm having trouble analyzing that right now. (API Error: ${errorMsg})`
  };
}
