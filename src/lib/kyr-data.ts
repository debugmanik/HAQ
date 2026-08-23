export interface KYRArticleItem {
  id: string;
  slug: string;
  title: string;
  category: "consumer" | "police_fir" | "tenant" | "women_posh" | "cybercrime" | "labor" | "rti" | "senior_citizens";
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
  citations: string[];
  publishedAt: string;
  keyTakeaways: string[];
  actionSteps: string[];
}

export const KYR_CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "police_fir", label: "Police & FIR Rights" },
  { id: "consumer", label: "Consumer Protection" },
  { id: "tenant", label: "Tenant & Housing" },
  { id: "women_posh", label: "Women & PoSH Rights" },
  { id: "cybercrime", label: "Cybercrime & Online Fraud" },
  { id: "labor", label: "Labor & Employee Rights" },
  { id: "rti", label: "Right to Information" },
  { id: "senior_citizens", label: "Senior Citizens Rights" },
];

export const KYR_ARTICLES: KYRArticleItem[] = [
  {
    id: "kyr-1",
    slug: "rights-when-arrested-or-detained-by-police",
    title: "Your Fundamental Rights When Stopped, Detained, or Arrested by Police",
    category: "police_fir",
    excerpt: "Learn what the law strictly mandates during police questioning, arrest procedures under Section 50 CrPC / BNSS, and the landmark D.K. Basu guidelines.",
    tags: ["Police", "Arrest", "BNSS", "CrPC", "Bail", "Constitutional Rights"],
    readTime: "5 min",
    citations: ["Section 50 CrPC / BNSS", "Article 22(1) Constitution of India", "D.K. Basu v. State of West Bengal (1997)"],
    publishedAt: "2025-01-15",
    keyTakeaways: [
      "Police must inform you of the exact grounds of arrest immediately upon detention.",
      "You have the constitutional right to consult and be defended by a legal practitioner of your choice.",
      "Arresting officers must bear clear identification and name tags with designations.",
      "An arrest memo must be prepared at the time of arrest and signed by at least one witness (family or respectable neighborhood member).",
      "You must be produced before the nearest Judicial Magistrate within 24 hours of arrest (excluding journey time)."
    ],
    actionSteps: [
      "Ask calmly: 'Officer, am I under arrest or free to leave?'",
      "Do not resist physically; ask for the official Arrest Memo and insist on contacting your lawyer or family.",
      "Request a medical examination at the time of arrest under Section 54 CrPC to document existing health conditions.",
      "If mistreated, inform the Magistrate immediately upon your 24-hour court production."
    ],
    content: `Under the Constitution of India (Article 22) and criminal procedure codes, every individual possesses inviolable rights during police encounters.

### 1. Ground of Arrest & Bailable Information
Under Section 50(1) of CrPC / BNSS, every police officer arresting any person without a warrant must forthwith communicate to them full particulars of the offence or other grounds for such arrest. If the offence is bailable, police must inform the person that they are entitled to be released on bail and arrange sureties.

### 2. The Landmark D.K. Basu Guidelines
The Supreme Court of India laid down mandatory directives to prevent custodial torture:
1. Police personnel carrying out the arrest and handling interrogation must wear clear identification with their designations.
2. A Memo of Arrest must be prepared at the time of arrest, containing the date, time, and signed by at least one witness.
3. The person arrested is entitled to have one friend, relative, or known person informed of their arrest and place of detention within 8 to 12 hours.

### 3. Special Protections for Women
Under Section 46(4) of CrPC, no woman shall be arrested after sunset and before sunrise, except in unavoidable circumstances with prior permission from a Judicial Magistrate First Class. Women can only be searched by female police personnel with strict regard to decency.`
  },
  {
    id: "kyr-2",
    slug: "how-to-file-fir-and-what-to-do-if-police-refuse",
    title: "How to Register an FIR and Legal Remedies if Police Refuse",
    category: "police_fir",
    excerpt: "What is a Cognizable Offence, how to demand a free copy of the FIR under Section 154(2), and step-by-step escalation to Superintendent of Police and Magistrate under Section 156(3).",
    tags: ["FIR", "Zero FIR", "Police Refusal", "Section 156(3)", "Criminal Law"],
    readTime: "6 min",
    citations: ["Section 154 CrPC / BNSS", "Section 156(3) CrPC / BNSS", "Lalita Kumari v. Govt of UP (2014) 2 SCC 1"],
    publishedAt: "2025-02-01",
    keyTakeaways: [
      "Registration of FIR is mandatory under Section 154 for all cognizable offences (thefts, assault, cyber fraud, cheating).",
      "You are legally entitled to receive a FREE copy of the signed FIR immediately.",
      "Zero FIR can be filed at ANY police station in India regardless of territorial jurisdiction.",
      "If an officer refuses to file an FIR, they can be prosecuted under Section 166A of IPC / BNS."
    ],
    actionSteps: [
      "Draft a clear chronological written complaint mentioning dates, times, accused details, and witnesses.",
      "Visit the police station; request the Duty Officer to register it under Section 154 CrPC.",
      "If refused, send the complaint via Registered Post / Speed Post to the Superintendent of Police (SP / DCP) under Section 154(3).",
      "If no action is taken within 15 days, hire an advocate to file an application before the Metropolitan/Judicial Magistrate under Section 156(3) CrPC."
    ],
    content: `A First Information Report (FIR) is the official starting point of any criminal investigation in India.

### Mandatory Nature of FIR (Lalita Kumari Ruling)
In the constitutional bench judgment *Lalita Kumari v. Govt. of U.P.*, the Supreme Court ruled that registration of an FIR is mandatory under Section 154 of the Code if the information discloses commission of a cognizable offence. Police officers cannot conduct a preliminary inquiry to decide whether to register an FIR for serious crimes.

### What is a 'Zero FIR'?
A Zero FIR allows any police station to accept a complaint and register an FIR without assigning a regular station number, irrespective of where the crime occurred. It is then transferred to the jurisdictional police station for ongoing investigation.

### Escalation when Police Refuse:
1. **Superintendent of Police (SP)**: Under Section 154(3), send the substance of information in writing by post to the SP/DCP.
2. **Judicial Magistrate (Section 156(3))**: If the SP fails to act, a complaint can be filed before the Magistrate, who has the power to order police to register the FIR and investigate.`
  },
  {
    id: "kyr-3",
    slug: "tenant-rights-security-deposit-refund-and-illegal-eviction",
    title: "Tenant Rights in India: Security Deposit Refund and Protection from Illegal Eviction",
    category: "tenant",
    excerpt: "Understand maximum security deposit caps under the Model Tenancy Act, legal notice periods, and how to recover withheld deposit money.",
    tags: ["Tenant", "Landlord", "Security Deposit", "Model Tenancy Act", "Eviction"],
    readTime: "4 min",
    citations: ["Model Tenancy Act 2021", "State Rent Control Acts", "Transfer of Property Act 1882 (Sec 106)"],
    publishedAt: "2025-01-20",
    keyTakeaways: [
      "Security deposits for residential premises are capped at maximum 2 months of rent under the Model Tenancy Act.",
      "Landlords cannot cut off essential supplies (water, electricity, lift) even in dispute cases.",
      "A landlord cannot evict a tenant by force or lock changing; eviction requires formal notice and order from Rent Authority.",
      "Deposits must be refunded upon handing over vacant possession, after reasonable adjustments for documented unpaid utility bills."
    ],
    actionSteps: [
      "Always execute a written, registered rental agreement specifying deposit return timelines.",
      "Conduct a move-out video walk-through and take dated photos of walls, fixtures, and meters.",
      "If deposit is delayed beyond 15 days, send a Formal Legal Demand Notice citing the agreement and tenancy laws.",
      "File a claim before the District Rent Authority or Small Causes Court for recovery with interest."
    ],
    content: `Rental housing disputes are governed by state Rent Control Acts and the Model Tenancy Act guidelines.

### Maximum Deposit Caps
Under Section 11 of the Model Tenancy Act, the security deposit to be paid by the tenant in advance shall not exceed:
- Two months' rent for residential premises.
- Six months' rent for non-residential/commercial premises.

### Protection from Harassment & Arbitrary Eviction
Landlords cannot withhold essential supply or services (electricity, water, sanitation) under any pretext. Landlords who forcibly lock out tenants or disconnect utilities face statutory penalties.

### Recovery of Unreturned Deposits
When a tenancy concludes and the tenant has vacated without causing structural damage, the security deposit must be returned. If the landlord unjustifiably withholds it, the tenant can serve a 15-day Legal Demand Notice and subsequently approach the Rent Court or Consumer Forum for unfair trade practice.`
  },
  {
    id: "kyr-4",
    slug: "consumer-rights-defective-goods-and-delayed-refunds",
    title: "Consumer Rights 2025: Defective Products, False Advertising, and Delayed Refunds",
    category: "consumer",
    excerpt: "How the Consumer Protection Act 2019 protects online and offline shoppers with E-Daakhil filing, product liability, and National Consumer Helpline (1915).",
    tags: ["Consumer Protection", "E-Commerce", "Defective Product", "Refund", "NCH 1915"],
    readTime: "5 min",
    citations: ["Consumer Protection Act, 2019", "Consumer Protection (E-Commerce) Rules, 2020"],
    publishedAt: "2025-01-10",
    keyTakeaways: [
      "Consumers are entitled to replacement, refund, or compensation for defective goods and deficiency in service.",
      "E-commerce platforms cannot cancel orders arbitrarily or impose unreasonable return penalty fees.",
      "Complaints can be lodged directly from home via the National Consumer Helpline (1915) or WhatsApp bot.",
      "Online filing of formal consumer court cases is enabled nationwide through the E-Daakhil portal (edaakhil.nic.in)."
    ],
    actionSteps: [
      "Preserve order invoices, delivery receipts, photos/videos of defective items, and email correspondence.",
      "Register a grievance on the National Consumer Helpline portal (consumerhelpline.gov.in) or call 1915.",
      "Send a 15-day formal Consumer Demand Notice to the seller and manufacturer.",
      "If unresolved, file an e-complaint on the E-Daakhil portal without needing a lawyer for claims up to ₹50 Lakhs (District Commission)."
    ],
    content: `The Consumer Protection Act 2019 replaced the 1986 Act, introducing powerful protections for modern e-commerce and digital consumers.

### 6 Core Consumer Rights (Section 2(9)):
1. **Right to Safety**: Protection against hazardous goods and services.
2. **Right to be Informed**: Right to know quantity, potency, purity, standard, and price of goods.
3. **Right to Choose**: Access to a variety of goods at competitive prices.
4. **Right to be Heard**: Assurance that consumer interests will receive due consideration.
5. **Right to Redressal**: Remedy against unfair trade practices or exploitation.
6. **Right to Consumer Education**: Awareness of consumer rights and responsibilities.

### Pecuniary Jurisdiction of Consumer Commissions:
- **District Commission**: Claims up to ₹50 Lakhs (formerly ₹1 Crore, revised).
- **State Commission**: Claims between ₹50 Lakhs and ₹2 Crores.
- **National Commission (NCDRC)**: Claims exceeding ₹2 Crores.`
  },
  {
    id: "kyr-5",
    slug: "women-rights-posh-act-and-domestic-violence-remedies",
    title: "Women's Legal Rights: PoSH Act at Workplace and Domestic Violence Protections",
    category: "women_posh",
    excerpt: "Complete overview of the Prevention of Sexual Harassment (PoSH) Act 2013, Internal Complaints Committees (ICC), and Section 498A / PWDVA remedies.",
    tags: ["Women Rights", "PoSH Act", "Workplace Harassment", "ICC", "Domestic Violence"],
    readTime: "7 min",
    citations: ["Sexual Harassment of Women at Workplace (PoSH) Act 2013", "Protection of Women from Domestic Violence Act 2005 (PWDVA)", "BNS Sections 74-79 / IPC 354"],
    publishedAt: "2025-01-25",
    keyTakeaways: [
      "Every workplace with 10 or more employees must mandatorily constitute an Internal Complaints Committee (ICC).",
      "Complaints of sexual harassment can be filed with the ICC within 3 months of the incident.",
      "The ICC inquiry must be completed within 90 days, and the identity of the complainant must remain strictly confidential.",
      "Under PWDVA 2005, a woman has the right to reside in the shared household and obtain protection orders against violence."
    ],
    actionSteps: [
      "Document dates, times, messages, emails, or witness statements immediately following any inappropriate conduct.",
      "Submit a written complaint to the Presiding Officer of your organization's ICC or the Local Complaints Committee (LCC) at the District Collectorate.",
      "For online harassment or stalking, register on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930.",
      "For domestic emergencies, call Women Helpline 1091 or Emergency 112 immediately."
    ],
    content: `The PoSH Act 2013 provides comprehensive safety for women at both private and government workplaces.

### What Constitutes Sexual Harassment?
Under Section 2(n), sexual harassment includes unwelcome acts or behavior such as:
- Physical contact and advances.
- A demand or request for sexual favors.
- Making sexually colored remarks.
- Showing pornography.
- Any other unwelcome physical, verbal, or non-verbal conduct of sexual nature.

### Quid Pro Quo & Hostile Work Environment
Implied or explicit promise of preferential treatment or threat of detrimental treatment in employment in exchange for sexual favors constitutes unlawful harassment.`
  },
  {
    id: "kyr-6",
    slug: "cybercrime-financial-fraud-and-digital-arrest-scams",
    title: "Cybercrime Protections: Immediate Steps for UPI Fraud, Identity Theft, and Fake Digital Arrests",
    category: "cybercrime",
    excerpt: "The Golden Hour protocol for frozen bank accounts, reporting to Helpline 1930, and protections against fake police/CBI video call scams.",
    tags: ["Cybercrime", "UPI Fraud", "Helpline 1930", "Digital Arrest Scam", "RBI Circular"],
    readTime: "5 min",
    citations: ["Information Technology Act, 2000 (Sec 43, 66D)", "National Cyber Crime Reporting Portal (cybercrime.gov.in)", "Helpline 1930 (Citizen Financial Cyber Fraud Reporting)"],
    publishedAt: "2025-02-10",
    keyTakeaways: [
      "Reporting financial cyber fraud on Helpline 1930 within the first 2 hours ('Golden Hour') allows banks to freeze stolen funds before withdrawal.",
      "No Indian law enforcement agency (Police, CBI, ED, Courts) ever conducts 'Digital Arrests' via WhatsApp/Skype video calls.",
      "RBI guidelines mandate zero customer liability for third-party fraud if reported to the bank within 3 working days.",
      "Cyber police must register formal complaints without demanding physical presence for remote internet fraud."
    ],
    actionSteps: [
      "Immediately call 1930 (National Cyber Crime Reporting Helpline) to raise an instant transaction hold ticket.",
      "Inform your bank branch and block ATM/UPI/Netbanking access.",
      "Take screenshots of payment transaction IDs, fraudulent messages, phone numbers, and profile URLs.",
      "Lodge a formal digital complaint on cybercrime.gov.in and download the acknowledgment receipt."
    ],
    content: `Cyber fraud and digital scams are on the rise across India. Swift action is critical for asset recovery.

### The 1930 Helpline & Golden Hour Rule
The Ministry of Home Affairs operates Helpline 1930 (formerly 155260). When a victim calls 1930 within 2 to 3 hours of unauthorized transactions, the backend system triggers real-time alerts across integrated banks and payment gateways (NPCI) to freeze money in the beneficiary accounts before scammers can cash out.

### The Truth About 'Digital Arrest' Scams
Scammers impersonate police, customs, or court officials on video calls claiming parcels with contraband or money laundering allegations.
**Fact:** There is no legal provision for 'digital arrest' or video interrogation in Indian criminal jurisprudence. Real law enforcement summons individuals via physical notices under Section 41A / 160 CrPC.`
  },
  {
    id: "kyr-7",
    slug: "employee-rights-unpaid-salary-gratuity-and-wrongful-termination",
    title: "Employee Rights: Unpaid Salary Recovery, PF/Gratuity Claims, and Notice Pay",
    category: "labor",
    excerpt: "Statutory rights under the Payment of Wages Act, Industrial Disputes Act, and Payment of Gratuity Act 1972.",
    tags: ["Employee Rights", "Unpaid Salary", "Gratuity", "Termination", "PF Recovery"],
    readTime: "5 min",
    citations: ["Payment of Wages Act 1936", "Payment of Gratuity Act 1972", "Employees' Provident Funds and Miscellaneous Provisions Act 1952"],
    publishedAt: "2025-01-18",
    keyTakeaways: [
      "Salaries must be disbursed before the 7th or 10th of the following month.",
      "Gratuity is mandatory for employees with 5 or more years of continuous service (calculated as 15 days salary per year of service).",
      "Employers cannot deduct arbitrary penalties or withhold Full & Final (FnF) settlement beyond 30 to 45 days.",
      "Termination without requisite notice period or pay-in-lieu violates employment agreements and state labor laws."
    ],
    actionSteps: [
      "Collect appointment letters, payslips, bank statements, email resignation acceptance, and timesheets.",
      "Send a formal HR demand letter giving a 15-day deadline for unpaid dues.",
      "If ignored, lodge a grievance with the District Labor Commissioner under the Payment of Wages Act.",
      "File a complaint on the EPFO Grievance Management System (epfigms.gov.in) if PF contributions were deducted but not deposited."
    ],
    content: `Employees in both organized and unorganized sectors possess statutory protections for their earned compensation.

### Full & Final (FnF) Settlement Timelines
Upon resignation or termination, employers must calculate and clear:
1. Earned salary up to the last working day.
2. Encashment of accumulated privilege leave.
3. Gratuity (if eligible).
4. Pro-rata bonus and statutory allowances.

If an employer delays settlement without valid cause, interest can be claimed on delayed payments.`
  },
  {
    id: "kyr-8",
    slug: "right-to-information-how-to-file-and-timelines",
    title: "Mastering the RTI Act 2005: Section 6(1) Drafting, Fees, and First Appeals",
    category: "rti",
    excerpt: "How to use Section 6(1) to inspect government files, tender records, scholarship delays, and public infrastructure spending.",
    tags: ["RTI Act 2005", "Section 6(1)", "Public Records", "Transparency", "First Appeal"],
    readTime: "5 min",
    citations: ["Right to Information Act, 2005 (Sec 6, 7, 19)", "Central Information Commission (CIC) Guidelines"],
    publishedAt: "2025-02-05",
    keyTakeaways: [
      "Any Indian citizen can seek information from any Central or State public authority without giving reasons.",
      "Information must be provided within 30 days (or within 48 hours if concerning life and liberty).",
      "Application fee is only ₹10 (cash, IPO, demand draft, or online payment via rtionline.gov.in). BPL cardholders are exempt.",
      "If the Public Information Officer (PIO) fails to respond, a First Appeal must be filed within 30 days under Section 19(1)."
    ],
    actionSteps: [
      "Identify the relevant department and Public Information Officer (PIO).",
      "Frame numbered, concise questions asking for specific records, file notes, or inspection dates (do not ask 'why' or opinions).",
      "Pay the ₹10 fee and obtain a dated receipt/acknowledgment.",
      "If no response within 30 days, submit a First Appeal under Section 19(1) to the First Appellate Authority (FAA)."
    ],
    content: `The Right to Information (RTI) Act 2005 is India's premier transparency instrument.

### How to Frame RTI Questions Correctly
- Seek 'material records' (copies of memos, inspection sheets, sanctioned budgets, attendance logs).
- Avoid asking theoretical or speculative questions ('Why was my street not paved?'). Instead ask: 'Please provide certified copies of all road repair work orders sanctioned for Sector 4 in financial year 2024-25.'

### Life & Liberty Exception (Section 7(1))
If the information sought concerns the life or liberty of a person, the PIO is legally mandated to provide the information within 48 hours of receipt of the request.`
  }
];
