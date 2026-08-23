export type CaseFieldSchema = {
  id: string;
  questionText: string;
  priority: number;
};

export const CASE_SCHEMAS: Record<string, CaseFieldSchema[]> = {
  "Tenant / Rental": [
    { id: "location", questionText: "Which city and state is the property located in?", priority: 10 },
    { id: "deposit_amount", questionText: "Approximately how much is the security deposit?", priority: 10 },
    { id: "move_out_date", questionText: "When did you move out of the property, or are you still living there?", priority: 9 },
    { id: "agreement_exists", questionText: "Do you have a written rent agreement?", priority: 9 },
    { id: "agreement_registered", questionText: "Is the rent agreement registered?", priority: 8 },
    { id: "landlord_reason", questionText: "Did your landlord give you a reason for withholding the deposit?", priority: 8 },
    { id: "payment_evidence", questionText: "Do you have bank statements or receipts showing you paid the deposit?", priority: 7 },
    { id: "written_communication", questionText: "Have you sent any written messages or emails asking for the deposit back?", priority: 6 },
    { id: "monthly_rent", questionText: "What is your monthly rent?", priority: 5 }
  ],
  "DEFAULT": [
    { id: "core_issue", questionText: "Can you describe the exact problem you are facing in a bit more detail?", priority: 10 },
    { id: "location", questionText: "Where did this happen (City/State)?", priority: 9 },
    { id: "involved_parties", questionText: "Who else is involved in this dispute?", priority: 8 },
    { id: "evidence_available", questionText: "Do you have any documents or photos related to this issue?", priority: 7 },
    { id: "desired_outcome", questionText: "What is the specific outcome you are hoping for?", priority: 5 }
  ]
};

export function getRequiredFieldsForCategory(category: string | null): CaseFieldSchema[] {
  if (!category) return CASE_SCHEMAS["DEFAULT"];
  return CASE_SCHEMAS[category] || CASE_SCHEMAS["DEFAULT"];
}
