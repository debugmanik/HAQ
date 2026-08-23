import { NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { rawText, documentType, senderName, recipientName } = await request.json();

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { error: "Raw grievance or draft text is required." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      // Fallback offline enhancement if API key is not configured
      const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      const offlineEnhanced = `LEGAL DEMAND NOTICE / FORMAL GRIEVANCE REPRESENTATION
VIA REGISTERED POST WITH ACKNOWLEDGEMENT DUE / EMAIL

Date: ${today}

To,
${recipientName || "Concerned Authority / Opposite Party"}
Address: Specified Jurisdiction

From:
${senderName || "Complainant / Aggrieved Citizen"}

SUBJECT: FORMAL DEMAND NOTICE REGARDING: ${documentType ? documentType.toUpperCase() : "GRIEVANCE REDRESSAL"}

Sir / Madam,

Under instructions and on behalf of the undersigned, I hereby serve you with this formal Legal Representation as follows:

1. STATEMENT OF FACTS:
${rawText}

2. STATUTORY BREACH & VIOLATIONS:
That your failure, delay, and neglect to resolve the aforementioned grievance constitutes a severe deficiency in service, breach of statutory duty, and violation of natural justice under relevant Indian statutes.

3. FORMAL DEMAND & STATUTORY NOTICE:
YOU ARE HEREBY CALLED UPON to redress the grievance, release pending dues/service, and communicate formal compliance within FIFTEEN (15) DAYS of receipt of this notice.

TAKE NOTICE that upon your failure to comply within the stipulated 15 days, appropriate legal proceedings shall be instituted before the competent Court / Tribunal / Forum holding you liable for all consequential damages, interest, and legal costs.

Yours faithfully,

_____________________________
${senderName || "Aggrieved Citizen"}`;

      return NextResponse.json({ enhancedText: offlineEnhanced, isOfflineFallback: true });
    }

    const ai = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" });

    const systemInstruction = `You are HAQ AI Legal Drafter, an expert Indian legal drafting assistant.
Your task is to transform raw, unstructured citizen complaints or informal grievance notes into an authoritative, highly professional, print-ready Indian Legal Demand Notice or Statutory Representation.

GUIDELINES FOR ENHANCEMENT:
1. Format with standard Indian legal conventions:
   - Header with "WITHOUT PREJUDICE / VIA REGISTERED SPEED POST & EMAIL"
   - Date, Addressee (To), Subject line with statutory references
   - Numbered paragraphs presenting facts chronologically
   - Explicit Section citations (e.g., Consumer Protection Act 2019, Model Tenancy Act, RTI Act 2005, Contract Act 1872, Payment of Wages Act)
   - Specific prayer/demand clause with a strict 15-day compliance window
   - Default clause warning of escalation to District Consumer Commission, High Court, or Civil Court
2. Maintain formal legal English ('undersigned', 'called upon', 'deficiency in service', 'prejudice').
3. Keep placeholders like [INVOICE_NO], [DATE], or [AMOUNT] only if specific details are missing.
4. Do NOT output conversational filler or markdown fences around the text; output ONLY the complete clean legal draft.`;

    const prompt = `Please enhance the following raw citizen complaint into a formal legal notice:
Document Category: ${documentType || "General Legal Notice"}
Sender: ${senderName || "The Undersigned Citizen"}
Recipient: ${recipientName || "The Respondent / Opposite Party"}

RAW GRIEVANCE TEXT:
"${rawText}"`;

    const response = await ai.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    const enhancedText = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ enhancedText, isOfflineFallback: false });

  } catch (error: unknown) {
    console.error("AI Document Enhancement error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to enhance document";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
