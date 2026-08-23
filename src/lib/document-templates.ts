export interface DocumentTemplateItem {
  id: string;
  type: "rti_6_1" | "consumer_notice" | "tenancy_demand" | "cyber_fraud" | "workplace_posh" | "breach_notice";
  title: string;
  badge: string;
  category: string;
  description: string;
  applicableLaw: string;
  defaultFields: Record<string, string>;
  fieldsMeta: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "date" | "number";
    required: boolean;
  }[];
  templateText: string;
}

export const LEGAL_TEMPLATES: DocumentTemplateItem[] = [
  {
    id: "doc-rti",
    type: "rti_6_1",
    title: "RTI Application under Section 6(1)",
    badge: "Official Central/State",
    category: "Right to Information",
    description: "Standard statutory application to inspect government records, file movements, tender contracts, or public grievance delays.",
    applicableLaw: "Right to Information Act, 2005 (Section 6(1))",
    defaultFields: {
      applicantName: "",
      applicantAddress: "",
      applicantPhone: "",
      departmentName: "Public Works Department / Municipal Corporation",
      officeLocation: "District Head Office",
      stateName: "State / UT",
      subjectMatter: "Inordinate delay in civic road repair and fund allocation",
      specificQuestions: "1. Date-wise record of processing of complaint (Ref: ______)\n2. Names and designations of officers responsible for processing\n3. Certified copies of all work orders and sanction letters issued",
      paymentMethod: "Indian Postal Order (IPO)",
      paymentRef: "IPO No. 56F 987654"
    },
    fieldsMeta: [
      { key: "applicantName", label: "Applicant Full Name", placeholder: "e.g. Arun Kumar", type: "text", required: true },
      { key: "applicantAddress", label: "Applicant Address", placeholder: "House No, Street, City, Pincode", type: "textarea", required: true },
      { key: "applicantPhone", label: "Phone Number", placeholder: "+91 98765 43210", type: "text", required: false },
      { key: "departmentName", label: "Public Authority / Department", placeholder: "e.g. Directorate of Social Welfare", type: "text", required: true },
      { key: "officeLocation", label: "Office District / Location", placeholder: "e.g. Patna District Office", type: "text", required: true },
      { key: "stateName", label: "State / UT", placeholder: "e.g. Bihar", type: "text", required: true },
      { key: "subjectMatter", label: "Subject of Information Sought", placeholder: "e.g. Verification status of Scholarship Ref: SCH-1029", type: "text", required: true },
      { key: "specificQuestions", label: "Numbered Questions (Specific records/files)", placeholder: "1. Please provide...\n2. Certified copy of...", type: "textarea", required: true },
      { key: "paymentMethod", label: "Fee Payment Mode", placeholder: "Indian Postal Order (IPO) / Cash / DD", type: "text", required: true },
      { key: "paymentRef", label: "Receipt / IPO / DD Number", placeholder: "e.g. IPO No. 45G 112233", type: "text", required: true }
    ],
    templateText: `APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1)
OF THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO) / Assistant PIO,
Office of: [departmentName]
Location: [officeLocation], [stateName]

1. Full Name of the Applicant: [applicantName]
2. Address for Correspondence: [applicantAddress]
3. Contact Phone / Email: [applicantPhone]
4. Citizenship: Citizen of India

5. Particulars of Information Required:
   Subject: [subjectMatter]

   Specific Information Sought:
[specificQuestions]

6. Period to which the information relates: Past 12 Months / Current Financial Year

7. I hereby declare that the information sought does not fall within any of the exemptions contained in Section 8 or 9 of the RTI Act, 2005, and to the best of my knowledge, it pertains to your esteemed office.

8. Mandatory Fee Particulars:
   Application fee of Rs. 10/- (Rupees Ten Only) has been duly deposited via [paymentMethod], bearing Reference/Serial Number: [paymentRef], dated [currentDate].

Place: [officeLocation]
Date: [currentDate]

_________________________
Signature of the Applicant
([applicantName])`
  },
  {
    id: "doc-consumer",
    type: "consumer_notice",
    title: "Consumer Legal Demand Notice",
    badge: "Consumer Protection",
    category: "Consumer Law",
    description: "Formal 15-day pre-litigation demand notice to e-commerce companies, brands, or retailers for defective products, deficient service, or delayed refunds.",
    applicableLaw: "Consumer Protection Act, 2019 (Section 2(11), Section 84)",
    defaultFields: {
      senderName: "",
      senderAddress: "",
      companyName: "Brand / Seller Pvt. Ltd.",
      companyAddress: "Registered Office Address, Corporate Tower",
      productName: "Smartphone / Appliance / Service",
      invoiceNo: "INV-2025-99812",
      purchaseDate: "2025-01-10",
      amountPaid: "25000",
      defectDescription: "Device screen ceased functioning within 5 days of delivery; authorized service center refused replacement claiming unfounded physical damage.",
      remedySought: "Immediate full refund of Rs. 25,000/- along with Rs. 10,000/- compensation for mental agony"
    },
    fieldsMeta: [
      { key: "senderName", label: "Your Full Name (Consumer)", placeholder: "e.g. Priya Sharma", type: "text", required: true },
      { key: "senderAddress", label: "Your Address", placeholder: "Complete residential address", type: "textarea", required: true },
      { key: "companyName", label: "Opposite Party / Company Name", placeholder: "e.g. Retailer India Pvt Ltd", type: "text", required: true },
      { key: "companyAddress", label: "Company Official / Registered Address", placeholder: "Corporate office address", type: "textarea", required: true },
      { key: "productName", label: "Product / Service Name", placeholder: "Model / Item Name", type: "text", required: true },
      { key: "invoiceNo", label: "Invoice / Order Reference No", placeholder: "e.g. OD-9921827", type: "text", required: true },
      { key: "purchaseDate", label: "Date of Purchase", placeholder: "YYYY-MM-DD", type: "date", required: true },
      { key: "amountPaid", label: "Amount Paid (in INR)", placeholder: "e.g. 25000", type: "number", required: true },
      { key: "defectDescription", label: "Description of Defect / Service Deficiency", placeholder: "Explain clearly what failed and what the seller did...", type: "textarea", required: true },
      { key: "remedySought", label: "Demand (Refund / Replacement / Damages)", placeholder: "e.g. Full refund of ₹25,000 plus ₹10,000 compensation", type: "textarea", required: true }
    ],
    templateText: `FORMAL LEGAL NOTICE UNDER SECTION 2(11) & SECTION 84
OF THE CONSUMER PROTECTION ACT, 2019

WITHOUT PREJUDICE / VIA REGISTERED SPEED POST & EMAIL

Date: [currentDate]

To,
[companyName]
Through its Managing Director / Grievance Officer
Registered Address: [companyAddress]

Subject: Legal Notice for Deficiency in Service, Defective Product, and Unfair Trade Practice regarding Order/Invoice No. [invoiceNo].

Dear Sir / Madam,

Under instructions and on behalf of my client / the undersigned, [senderName], residing at [senderAddress], I hereby serve you with this formal Legal Notice as under:

1. That the undersigned purchased [productName] from your platform/store on [purchaseDate] vide Invoice/Bill No: [invoiceNo] after making a payment of Rs. [amountPaid]/- (Rupees [amountPaid] Only).

2. That shortly after delivery/activation, the said product/service exhibited severe defects and deficiency, namely:
   "[defectDescription]"

3. That despite multiple representations, emails, and complaints lodged with your customer support and authorized service center, you have neglected and failed to redress the genuine consumer grievance, which constitutes a clear "Deficiency in Service" and "Unfair Trade Practice" under the Consumer Protection Act, 2019.

4. YOU ARE HEREBY CALLED UPON to fulfill the following demands within FIFTEEN (15) DAYS of receipt of this notice:
   (a) [remedySought]; and
   (b) Pay a sum of Rs. 5,000/- towards the cost of this legal notice.

TAKE NOTICE that in the event of your failure to comply within the stipulated 15 days, the undersigned shall be constrained to institute appropriate legal proceedings before the competent District Consumer Disputes Redressal Commission (DCDRC) and file a complaint on the National Consumer Portal, holding you liable for all consequential damages, litigation costs, and statutory interest.

Yours faithfully,

_________________________
[senderName]
[senderAddress]`
  },
  {
    id: "doc-tenant",
    type: "tenancy_demand",
    title: "Landlord-Tenant Deposit Refund Notice",
    badge: "Property & Housing",
    category: "Tenancy Law",
    description: "Formal legal demand letter calling upon landlord to refund withheld security deposit with statutory interest following peaceful vacation of premises.",
    applicableLaw: "Model Tenancy Act, 2021 & State Rent Control Acts",
    defaultFields: {
      tenantName: "",
      tenantAddress: "",
      landlordName: "Landlord Full Name",
      landlordAddress: "Landlord Residential Address",
      propertyAddress: "Flat No. 402, Sunshine Heights, Koramangala",
      depositAmount: "60000",
      vacateDate: "2025-01-15",
      noticePeriodServed: "1 month advance notice as per agreement"
    },
    fieldsMeta: [
      { key: "tenantName", label: "Your Full Name (Tenant)", placeholder: "e.g. Arun Kumar", type: "text", required: true },
      { key: "tenantAddress", label: "Your Current Address (For correspondence)", placeholder: "New address where you reside", type: "textarea", required: true },
      { key: "landlordName", label: "Landlord Full Name", placeholder: "e.g. Ramesh Chandra", type: "text", required: true },
      { key: "landlordAddress", label: "Landlord Address", placeholder: "Landlord's residential address", type: "textarea", required: true },
      { key: "propertyAddress", label: "Rented Premises Address", placeholder: "Address of the vacated property", type: "textarea", required: true },
      { key: "depositAmount", label: "Security Deposit Amount (INR)", placeholder: "e.g. 60000", type: "number", required: true },
      { key: "vacateDate", label: "Date Vacated", placeholder: "YYYY-MM-DD", type: "date", required: true },
      { key: "noticePeriodServed", label: "Notice Period Details", placeholder: "e.g. 30 days notice served via email on...", type: "text", required: true }
    ],
    templateText: `FORMAL LEGAL DEMAND NOTICE FOR IMMEDIATE REFUND
OF SECURITY DEPOSIT UNDER THE MODEL TENANCY ACT

Date: [currentDate]

To,
[landlordName]
Address: [landlordAddress]

Subject: Final Demand Notice for Refund of Security Deposit of Rs. [depositAmount]/- for Rented Premises at [propertyAddress].

Dear Sir / Madam,

I hereby serve you with this formal Legal Demand Notice regarding the unreturned security deposit:

1. That the undersigned was a tenant in respect of premises situated at [propertyAddress] under the Tenancy Agreement executed between us.

2. That the undersigned paid an advance Security Deposit of Rs. [depositAmount]/- (Rupees [depositAmount] Only) at the commencement of the tenancy.

3. That the undersigned duly served [noticePeriodServed], peacefully vacated the rented premises on [vacateDate], and handed over vacant, peaceful possession along with keys. Inspection of the premises was carried out and no damage beyond ordinary wear and tear was found.

4. That despite repeated verbal and written requests following vacation, you have unlawfully withheld and failed to refund the said Security Deposit of Rs. [depositAmount]/-, which is a direct violation of the Tenancy Agreement and applicable Rent Control / Model Tenancy legislation.

5. I HEREBY CALL UPON YOU to transfer and refund the entire sum of Rs. [depositAmount]/- along with interest @ 12% per annum from [vacateDate] until realization, within FIFTEEN (15) DAYS of the receipt of this notice.

TAKE FURTHER NOTICE that if the aforesaid payment is not received within 15 days, I shall be compelled to initiate civil and criminal proceedings before the Rent Authority / Civil Court and Consumer Commission, holding you fully liable for all legal expenses and interest.

Yours sincerely,

_________________________
[tenantName]
[tenantAddress]`
  },
  {
    id: "doc-cyber",
    type: "cyber_fraud",
    title: "Cybercrime Financial Fraud Representation",
    badge: "Cyber Law & Banking",
    category: "Cybercrime",
    description: "Formal representation to Bank Branch Manager and Cyber Police following unauthorized UPI/Netbanking fraud to freeze beneficiary accounts and reverse debits under RBI Circular on Zero Customer Liability.",
    applicableLaw: "RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 & IT Act 2000",
    defaultFields: {
      victimName: "",
      victimAddress: "",
      bankName: "State Bank of India / HDFC Bank",
      branchName: "Main Branch, Indiranagar",
      accountNo: "XXXXXXXX1234",
      fraudAmount: "35000",
      fraudDateTime: "2025-02-10 at 14:30 hrs",
      transactionRef: "UPI / UTR Ref No: 409182736192",
      cyberTicketNo: "Cyber Helpline 1930 Acknowledgment: #ACK-991823"
    },
    fieldsMeta: [
      { key: "victimName", label: "Account Holder Name", placeholder: "e.g. Rohit Verma", type: "text", required: true },
      { key: "victimAddress", label: "Address", placeholder: "Your residential address", type: "textarea", required: true },
      { key: "bankName", label: "Bank Name", placeholder: "e.g. State Bank of India", type: "text", required: true },
      { key: "branchName", label: "Branch Name & City", placeholder: "e.g. Indiranagar Branch, Bengaluru", type: "text", required: true },
      { key: "accountNo", label: "Bank Account Number", placeholder: "Account Number", type: "text", required: true },
      { key: "fraudAmount", label: "Unauthorized Amount Debited (INR)", placeholder: "e.g. 35000", type: "number", required: true },
      { key: "fraudDateTime", label: "Date and Time of Incident", placeholder: "e.g. 10 Feb 2025 at 2:30 PM", type: "text", required: true },
      { key: "transactionRef", label: "Transaction UTR / UPI Ref", placeholder: "e.g. UTR: 409182736192", type: "text", required: true },
      { key: "cyberTicketNo", label: "Cybercrime Portal / 1930 Ticket No", placeholder: "e.g. 1930 Ticket #881290", type: "text", required: true }
    ],
    templateText: `URGENT FORMAL REPRESENTATION: UNAUTHORIZED ELECTRONIC TRANSACTION
CLAIM FOR ZERO CUSTOMER LIABILITY UNDER RBI MANDATE

Date: [currentDate]

To,
The Branch Manager / Nodal Grievance Officer,
[bankName], [branchName]

Subject: Urgent Dispute of Unauthorized Electronic Debit of Rs. [fraudAmount]/- from A/c No: [accountNo] — Request for Immediate Reversal and Lien Marking on Beneficiary Account.

Dear Sir / Madam,

I am writing to formally report an unauthorized fraudulent electronic transaction debited from my bank account without my informed consent or authorization:

1. Account Details:
   - Account Holder Name: [victimName]
   - Account Number: [accountNo]
   - Bank & Branch: [bankName], [branchName]

2. Particulars of Fraudulent Debit:
   - Date & Time of Incident: [fraudDateTime]
   - Fraudulent Amount Debited: Rs. [fraudAmount]/-
   - Transaction Reference / UPI UTR: [transactionRef]

3. Immediate Actions Taken:
   - Blocked cards, Netbanking, and UPI access immediately upon discovering the debit.
   - Lodged immediate complaint with National Cyber Crime Reporting Helpline 1930 vide Reference: [cyberTicketNo].

4. Invoking RBI Circular on Customer Protection:
   Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 dated July 6, 2017 on "Customer Protection — Limiting Liability of Customers in Unauthorized Electronic Banking Transactions", since this unauthorized transaction has been notified to the bank within statutory timelines, the customer has ZERO LIABILITY.

5. PRAYER / DEMAND:
   (a) Immediately communicate with the destination/beneficiary bank and payment gateway to place an urgent LIEN/FREEZE on the fraudulent beneficiary account.
   (b) Credit shadow/provisional reversal of Rs. [fraudAmount]/- to my account within 10 working days as mandated by the Reserve Bank of India.

Yours faithfully,

_________________________
[victimName]
[victimAddress]`
  },
  {
    id: "doc-workplace",
    type: "workplace_posh",
    title: "Workplace Grievance & Unpaid Salary Notice",
    badge: "Labor & Employment",
    category: "Labor Law",
    description: "Formal demand letter to employer for clearance of withheld Full & Final (FnF) settlement, unpaid salary, and statutory PF/Gratuity dues.",
    applicableLaw: "Payment of Wages Act 1936 & Industrial Disputes Act",
    defaultFields: {
      employeeName: "",
      employeeAddress: "",
      companyName: "Employer Tech Solutions Pvt. Ltd.",
      hrEmail: "hr@company.com / management@company.com",
      designation: "Senior Associate",
      joiningDate: "2022-04-01",
      lastWorkingDay: "2025-01-15",
      unpaidSalaryAmount: "120000",
      noticePeriodServed: "Served full 60-day notice period as agreed"
    },
    fieldsMeta: [
      { key: "employeeName", label: "Your Full Name (Employee)", placeholder: "e.g. Ananya Rao", type: "text", required: true },
      { key: "employeeAddress", label: "Your Address", placeholder: "Residential address", type: "textarea", required: true },
      { key: "companyName", label: "Company / Employer Name", placeholder: "e.g. Alpha Solutions Pvt Ltd", type: "text", required: true },
      { key: "hrEmail", label: "HR / Management Email", placeholder: "hr@company.com", type: "text", required: true },
      { key: "designation", label: "Your Designation / Role", placeholder: "e.g. Marketing Lead", type: "text", required: true },
      { key: "joiningDate", label: "Date of Joining", placeholder: "YYYY-MM-DD", type: "date", required: true },
      { key: "lastWorkingDay", label: "Last Working Day (LWD)", placeholder: "YYYY-MM-DD", type: "date", required: true },
      { key: "unpaidSalaryAmount", label: "Total Unpaid Dues / FnF Amount (INR)", placeholder: "e.g. 120000", type: "number", required: true }
    ],
    templateText: `FORMAL LEGAL DEMAND NOTICE FOR CLEARANCE OF UNPAID
SALARY AND FULL & FINAL SETTLEMENT (FnF) DUES

Date: [currentDate]

To,
The Management / Human Resources Department,
[companyName]
Contact: [hrEmail]

Subject: Final Legal Demand Notice for Payment of Overdue FnF Settlement and Unpaid Salary amounting to Rs. [unpaidSalaryAmount]/-.

Dear Sir / Madam,

Under instructions and on behalf of the undersigned, [employeeName], former [designation] at [companyName], this notice is served upon you as follows:

1. That the undersigned was employed with [companyName] from [joiningDate] until [lastWorkingDay], performing duties with utmost diligence and exemplary record.

2. That upon tendering resignation, the undersigned served the complete stipulated notice period, handed over all company assets, credentials, and documentation, and received formal release and clearance approvals.

3. That despite the lapse of statutory timelines (30 days from last working day), you have illegally withheld and failed to disburse the Full and Final settlement (FnF) comprising earned salary, leave encashment, and statutory dues totaling Rs. [unpaidSalaryAmount]/-.

4. Under the Payment of Wages Act, 1936 and applicable state Shops and Establishments Acts, an employer is legally prohibited from withholding earned wages without statutory cause.

5. YOU ARE HEREBY CALLED UPON to disburse the entire outstanding amount of Rs. [unpaidSalaryAmount]/- into my registered bank account within SEVEN (7) DAYS of receipt of this notice.

Failure to comply shall compel the undersigned to file a formal complaint before the jurisdictional Labor Commissioner and initiate recovery proceedings under Section 33C of the Industrial Disputes Act, 1947, at your sole cost and consequence.

Yours faithfully,

_________________________
[employeeName]
[employeeAddress]`
  },
  {
    id: "doc-breach",
    type: "breach_notice",
    title: "General Legal Notice for Breach of Contract",
    badge: "Contract & Civil Law",
    category: "Civil Law",
    description: "Standard formal legal notice served prior to instituting civil litigation for breach of contract, unpaid invoices, or failure of performance.",
    applicableLaw: "Indian Contract Act, 1872 & Specific Relief Act",
    defaultFields: {
      senderName: "",
      senderAddress: "",
      respondentName: "Respondent Individual / Entity",
      respondentAddress: "Respondent Address",
      agreementDate: "2024-06-15",
      agreementDetails: "Service Level Agreement for Web Development Services",
      breachDescription: "Failed to release milestone payment of Rs. 85,000/- upon successful delivery and signoff of final project deliverables.",
      demandAmount: "85000",
      complianceWindow: "15"
    },
    fieldsMeta: [
      { key: "senderName", label: "Your Full Name (Claimant)", placeholder: "e.g. Manish Gupta", type: "text", required: true },
      { key: "senderAddress", label: "Your Address", placeholder: "Your address", type: "textarea", required: true },
      { key: "respondentName", label: "Defaulting Party / Respondent", placeholder: "Company / Person Name", type: "text", required: true },
      { key: "respondentAddress", label: "Respondent Address", placeholder: "Address of defaulting party", type: "textarea", required: true },
      { key: "agreementDate", label: "Date of Contract / Invoice", placeholder: "YYYY-MM-DD", type: "date", required: true },
      { key: "agreementDetails", label: "Contract / Agreement Title", placeholder: "e.g. Freelance Service Agreement", type: "text", required: true },
      { key: "breachDescription", label: "Factual Details of Contractual Breach", placeholder: "Describe how the agreement was violated...", type: "textarea", required: true },
      { key: "demandAmount", label: "Claim / Debt Amount (INR)", placeholder: "e.g. 85000", type: "number", required: true }
    ],
    templateText: `FORMAL LEGAL NOTICE FOR BREACH OF CONTRACT
UNDER THE INDIAN CONTRACT ACT, 1872

WITHOUT PREJUDICE / VIA REGISTERED SPEED POST & EMAIL

Date: [currentDate]

To,
[respondentName]
Address: [respondentAddress]

Subject: Legal Notice for Breach of Contract dated [agreementDate] ([agreementDetails]) and Demand for Payment of Rs. [demandAmount]/-.

Sir / Madam,

Under instructions from my client / the undersigned, [senderName], residing at [senderAddress], I hereby serve you with this Legal Notice:

1. That you entered into a legally binding agreement titled "[agreementDetails]" dated [agreementDate] with the undersigned, whereunder mutual obligations and payment terms were solemnly covenanted.

2. That the undersigned performed all contractual covenants with due diligence. However, you have willfully committed a material breach of the said agreement by:
   "[breachDescription]"

3. That your said failure and neglect has caused immense financial loss, commercial hardship, and mental agony to the undersigned.

4. YOU ARE HEREBY CALLED UPON to rectify the breach and pay the outstanding sum of Rs. [demandAmount]/- along with interest @ 18% per annum within FIFTEEN (15) DAYS of receipt hereof.

TAKE NOTICE that should you fail to comply, the undersigned shall institute civil and commercial proceedings for recovery and specific performance before the competent court of law, holding you liable for all legal costs and damages.

Yours faithfully,

_________________________
[senderName]
[senderAddress]`
  }
];
