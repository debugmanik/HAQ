export type NextAction = {
  title: string;
  type: "generate_document" | "open_portal" | "call_helpline" | "wait" | "gather_evidence" | "safety_check";
  url?: string;
};

export type RoadmapStep = {
  id: string;
  status: "completed" | "current" | "pending";
  title: string;
  description: string;
};

export type RightsInfo = {
  title: string;
  description: string;
  actions: string[];
  evidence: string[];
  source: {
    name: string;
    url: string;
  } | null;
};

export type FactValue = {
  value: string | number | boolean | null;
  source: string;
  confidence: "high" | "medium" | "low";
  status: "known" | "yes" | "no" | "unknown";
};

export type EliteCaseState = {
  category: string | null;
  subCategory: string | null;
  summary: string | null;
  jurisdiction: string | null;
  facts: Record<string, FactValue>;
  missingInformation: string[]; // These are just strings for UI display
  evidenceReady: string[];
  askedQuestions: string[]; // Keep track of fields we have already asked about
  currentStep: string | null;
  nextAction: NextAction | null;
  confidence: "high" | "medium" | "low" | null;
  rights: RightsInfo | null;
  roadmap: RoadmapStep[];
};

// Initial state template
export const INITIAL_ELITE_STATE: EliteCaseState = {
  category: null,
  subCategory: null,
  summary: null,
  jurisdiction: null,
  facts: {},
  missingInformation: [],
  evidenceReady: [],
  askedQuestions: [],
  currentStep: "intent_detection",
  nextAction: null,
  confidence: null,
  rights: null,
  roadmap: [
    { id: "1", status: "current", title: "Understand Problem", description: "Extracting intent and required legal facts." },
    { id: "2", status: "pending", title: "Gather Evidence", description: "Identifying the correct jurisdiction and rules." },
    { id: "3", status: "pending", title: "Generate Resolution", description: "Drafting formal legal representation or next steps." }
  ]
};
