export interface CaseStoryItem {
  id: string;
  title: string;
  category: "consumer" | "tenancy" | "rti_impact" | "workplace" | "police";
  summary: string;
  fullStory: string;
  resolutionRoute: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  outcome: string;
  takeaways: string[];
  state: string;
  authorName: string;
  likes: number;
  publishedAt: string;
}

export const CASE_STORIES: CaseStoryItem[] = [
  {
    id: "story-1",
    title: "Recovered ₹65,000 Unreturned Rental Security Deposit from Landlord in Bengaluru",
    category: "tenancy",
    summary: "After 3 months of ignored messages, a formal Legal Demand Notice under the Model Tenancy Act and Consumer Protection provisions yielded a full refund in 10 days without going to court.",
    fullStory: "I vacated my 2BHK rented flat in Koramangala, Bengaluru after serving a full 1-month written notice. The owner inspected the flat, agreed there were no damages, and promised to transfer the ₹65,000 security deposit within 7 days. However, after moving to Pune, my calls were avoided and the landlord gave vague excuses for 90 days. Using HAQ's Demand Notice generator, I drafted a 15-day formal Legal Notice stating statutory interest under Karnataka Rent Control and consumer liability. I sent it via Speed Post with tracking. Within 10 days of delivery, the landlord transferred the entire ₹65,000 plus utility settlement.",
    resolutionRoute: [
      { step: 1, title: "Gathered Move-out Evidence", description: "Compiled move-out handover video, clean handover messages, and bank statement showing original deposit transfer.", duration: "Day 1" },
      { step: 2, title: "Drafted Formal Demand Notice", description: "Generated a 15-day Demand Notice specifying statutory interest and legal consequences.", duration: "Day 3" },
      { step: 3, title: "Dispatched via Speed Post & Email", description: "Sent physical Speed Post with postal tracking slip and emailed a digital copy.", duration: "Day 4" },
      { step: 4, title: "Landlord Settled in Full", description: "Landlord called and settled ₹65,000 online before the 15-day notice expired.", duration: "Day 14" }
    ],
    outcome: "100% deposit (₹65,000) refunded without court litigation.",
    takeaways: [
      "Always document move-out condition with dated video and photos.",
      "A formal written Speed Post notice carries tremendous legal weight compared to WhatsApp messages.",
      "Specify a strict 15-day statutory deadline and mention interest liability."
    ],
    state: "Karnataka",
    authorName: "Aniket M. (Software Engineer)",
    likes: 428,
    publishedAt: "2025-01-28"
  },
  {
    id: "story-2",
    title: "RTI Application Unlocked Delayed ₹48,000 Post-Matric State Scholarship",
    category: "rti_impact",
    summary: "A student whose scholarship was stuck for 9 months under 'Verification Pending' used Section 6(1) of RTI Act 2005 to inspect processing logs, resulting in fund release within 3 weeks.",
    fullStory: "I applied for the state social welfare post-matric scholarship in August 2024. Despite my college submitting all verification documents, the state scholarship portal status remained stuck at 'Pending with District Social Welfare Officer' for 9 months. I filed an RTI application under Section 6(1) with a ₹10 Postal Order, asking for: (1) Date-wise file movement record, (2) Name and designation of the verification officer, and (3) Reason for delay beyond the citizen charter timeline. Within 18 days of the PIO receiving the application, my scholarship was approved and ₹48,000 was credited directly to my bank account.",
    resolutionRoute: [
      { step: 1, title: "Tracked Portal Timeline", description: "Documented the 9-month delay exceeding the 60-day statutory citizen charter.", duration: "Month 9" },
      { step: 2, title: "Filed Section 6(1) RTI", description: "Drafted 3 focused questions seeking file processing records and officer accountability.", duration: "Day 1" },
      { step: 3, title: "PIO Transferred to Welfare Dept", description: "PIO triggered urgent internal review to prepare RTI response.", duration: "Day 12" },
      { step: 4, title: "Scholarship Disbursed", description: "Funds credited to bank account; PIO provided confirmation letter.", duration: "Day 21" }
    ],
    outcome: "₹48,000 scholarship disbursed with full explanation.",
    takeaways: [
      "Government officers must respond to RTI within 30 days under threat of ₹250/day personal penalty.",
      "Asking for 'date-wise file movement' is the most effective RTI question for delayed approvals."
    ],
    state: "Bihar",
    authorName: "Pooja Kumari (B.Tech Student)",
    likes: 512,
    publishedAt: "2025-02-02"
  },
  {
    id: "story-3",
    title: "National Consumer Helpline (1915) Resolved Defective Laptop Refund of ₹72,000",
    category: "consumer",
    summary: "Brand refused warranty replacement citing false 'water damage'. A Consumer Helpline docket followed by a formal Consumer Demand Notice secured a complete refund.",
    fullStory: "I bought a premium laptop from a major e-commerce store. Within 15 days, the motherboard failed. The authorized brand service center refused warranty, claiming internal moisture damage which was false as the device never contacted liquids. I lodged a grievance on the National Consumer Helpline (NCH Docket #449102) and concurrently sent a formal Consumer Notice to the manufacturer's grievance officer citing Product Liability under Section 84 of Consumer Protection Act 2019. The brand senior relations team called within a week, arranged reverse pickup, and credited the entire ₹72,000 to my bank.",
    resolutionRoute: [
      { step: 1, title: "Documented Service Denial", description: "Preserved service center job sheet, original invoice, and photos of undamaged laptop.", duration: "Day 1" },
      { step: 2, title: "Raised NCH 1915 Ticket", description: "Registered online consumer docket on consumerhelpline.gov.in.", duration: "Day 2" },
      { step: 3, title: "Sent Legal Consumer Notice", description: "Served notice giving 15 days before filing in District Consumer Commission.", duration: "Day 3" },
      { step: 4, title: "Full Refund Processed", description: "Company escalations desk issued full refund.", duration: "Day 9" }
    ],
    outcome: "Full ₹72,000 refund processed in 9 days.",
    takeaways: [
      "Always get a signed job sheet when visiting an authorized service center.",
      "National Consumer Helpline (1915) has direct integration with 800+ major corporate brands.",
      "Citing Section 84 (Product Liability) signals that you are ready for legal action."
    ],
    state: "Delhi",
    authorName: "Saurabh V. (Graphic Designer)",
    likes: 389,
    publishedAt: "2025-01-14"
  },
  {
    id: "story-4",
    title: "Helpline 1930 Froze and Recovered ₹35,000 from Fake Electricity Bill APK Scam",
    category: "police",
    summary: "Quick action within 40 minutes of an unauthorized UPI debit allowed cyber police to freeze the scammer's bank wallet before withdrawal.",
    fullStory: "My elderly father received an SMS: 'Your electricity will be disconnected tonight. Update via link.' He downloaded an APK that debited ₹35,000 from his SBI account. Within 40 minutes, we called the 1930 National Cyber Crime Helpline. The operator registered the complaint with the transaction UTR number. Because we called during the 'Golden Hour', the cyber cell sent an automated freeze notice to the recipient wallet. Within 3 weeks of filing the formal cybercrime portal acknowledgment at the local station, the court ordered the bank to reverse the frozen ₹35,000.",
    resolutionRoute: [
      { step: 1, title: "Called 1930 Within 40 Mins", description: "Reported victim bank, fraud amount, and UPI reference number.", duration: "Min 40" },
      { step: 2, title: "Blocked Cards & Netbanking", description: "Contacted bank toll-free number to prevent further debits.", duration: "Hour 1" },
      { step: 3, title: "Submitted Portal Complaint", description: "Filled cybercrime.gov.in report with screenshots.", duration: "Day 1" },
      { step: 4, title: "Court Reversal Order", description: "Magistrate ordered release of frozen funds from beneficiary account.", duration: "Week 3" }
    ],
    outcome: "₹35,000 recovered in full.",
    takeaways: [
      "Calling 1930 in the first 2 hours is the single most critical step in financial cyber fraud.",
      "Never install .apk files received via SMS or WhatsApp."
    ],
    state: "Maharashtra",
    authorName: "Dr. Rohit Deshmukh",
    likes: 674,
    publishedAt: "2025-02-08"
  }
];
