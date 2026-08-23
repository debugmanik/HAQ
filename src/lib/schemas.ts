export type SchemaField = {
  key: string;
  label: string;
  type: "string" | "boolean";
};

export type DynamicSchema = {
  key: string;
  category: string;
  requiredFields: SchemaField[];
  rightsNavigator: {
    title: string;
    description: string;
    sourceName: string;
    sourceUrl: string;
  };
};

export const SCHEMAS: Record<string, DynamicSchema> = {
  SCHOLARSHIP_DELAY: {
    key: "SCHOLARSHIP_DELAY",
    category: "Education / Government Scheme",
    requiredFields: [
      { key: "state", label: "State of Residence", type: "string" },
      { key: "scholarshipName", label: "Name of the Scholarship", type: "string" },
      { key: "applicationId", label: "Application/Reference Number", type: "string" },
      { key: "durationDelayed", label: "Duration of Delay (e.g., 4 months)", type: "string" },
      { key: "departmentContacted", label: "Have you contacted the department?", type: "boolean" }
    ],
    rightsNavigator: {
      title: "Post-Matric Scholarship Rules",
      description: "As per the Ministry of Social Justice guidelines, applications must be verified within a stipulated timeframe. Delays over 60 days can be queried via the RTI Act, 2005 to the District Welfare Officer.",
      sourceName: "National Scholarship Portal",
      sourceUrl: "https://scholarships.gov.in"
    }
  },
  TENANCY_DISPUTE: {
    key: "TENANCY_DISPUTE",
    category: "Civil Rights / Tenancy",
    requiredFields: [
      { key: "state", label: "State or City", type: "string" },
      { key: "leaseAgreement", label: "Do you have a written lease agreement?", type: "boolean" },
      { key: "depositAmount", label: "Security Deposit Amount", type: "string" },
      { key: "evictionNotice", label: "Have you been given a formal notice?", type: "boolean" },
      { key: "durationDelayed", label: "How long has the deposit been withheld?", type: "string" }
    ],
    rightsNavigator: {
      title: "Rent Control & Security Deposits",
      description: "Under the Model Tenancy Act, security deposits for residential premises cannot exceed two months' rent. Landlords must refund the deposit within one month of premises vacation. Withholding it arbitrarily is illegal.",
      sourceName: "Model Tenancy Act (MoHUA)",
      sourceUrl: "https://mohua.gov.in"
    }
  },
  MUNICIPAL_SANITATION: {
    key: "MUNICIPAL_SANITATION",
    category: "Civic / Municipal Services",
    requiredFields: [
      { key: "city", label: "City and Locality", type: "string" },
      { key: "issueType", label: "Type of Issue (e.g., Garbage, Pothole, Water)", type: "string" },
      { key: "previousComplaints", label: "Have you filed previous complaints?", type: "boolean" },
      { key: "duration", label: "How long has this been unresolved?", type: "string" }
    ],
    rightsNavigator: {
      title: "Municipal Corporation Act",
      description: "Local bodies are statutorily bound to maintain public health and sanitation. Under the Right to Public Services Act (RTS), citizens can demand time-bound resolution for municipal grievances.",
      sourceName: "Swachh Bharat Urban",
      sourceUrl: "https://swachhbharaturban.gov.in"
    }
  },
  CONSUMER_FRAUD: {
    key: "CONSUMER_FRAUD",
    category: "Consumer Rights",
    requiredFields: [
      { key: "state", label: "State of Purchase", type: "string" },
      { key: "productService", label: "Product or Service Name", type: "string" },
      { key: "disputeAmount", label: "Amount in Dispute", type: "string" },
      { key: "transactionDate", label: "Date of Transaction", type: "string" },
      { key: "sellerContacted", label: "Have you contacted the seller/brand?", type: "boolean" }
    ],
    rightsNavigator: {
      title: "Consumer Protection Act, 2019",
      description: "E-commerce platforms and retailers are mandated to acknowledge consumer grievances within 48 hours and resolve them within 1 month. Defective goods must be replaced or refunded.",
      sourceName: "National Consumer Helpline",
      sourceUrl: "https://consumerhelpline.gov.in"
    }
  },
  GENERAL: {
    key: "GENERAL",
    category: "General Inquiry",
    requiredFields: [],
    rightsNavigator: {
      title: "Civic & Legal Rights",
      description: "HAQ is designed to help with specific administrative delays, consumer rights, and civic grievances. Please provide more details about your specific legal or governmental issue.",
      sourceName: "India.gov.in",
      sourceUrl: "https://www.india.gov.in"
    }
  }
};
