export interface LawyerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  barCouncilNo: string;
  experienceYears: number;
  city: string;
  state: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  languages: string[];
  specializations: string[];
  bio: string;
  education: string;
  courtPractice: string[];
}

export const LAWYER_SPECIALIZATIONS = [
  "All Specializations",
  "Consumer Protection",
  "Tenancy & Property Law",
  "Criminal Defense & Bail",
  "Cybercrime & Data Privacy",
  "Labor & Employment",
  "Family & Matrimonial",
  "RTI & Administrative Law",
  "Corporate & Contracts"
];

export const INDIAN_CITIES = [
  "All Cities",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Lucknow",
  "Patna",
  "Chandigarh",
  "Jaipur"
];

export const LAWYERS_DATA: LawyerProfile[] = [
  {
    id: "lawyer-1",
    name: "Adv. Rajeshwari Sen",
    email: "rajeshwari.sen@delhibar.org",
    phone: "+91 98110 44219",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "D/1420/2012",
    experienceYears: 13,
    city: "New Delhi",
    state: "Delhi",
    consultationFee: 750,
    rating: 4.9,
    reviewCount: 124,
    isVerified: true,
    languages: ["English", "Hindi", "Bengali"],
    specializations: ["Consumer Protection", "RTI & Administrative Law", "Tenancy & Property Law"],
    bio: "Senior practicing advocate at Delhi High Court with over a decade of dedicated expertise in civic administrative disputes, government service delays, consumer forums, and RTI first appeals.",
    education: "LL.B. (Campus Law Centre, University of Delhi), LL.M. (National Law School of India University)",
    courtPractice: ["Delhi High Court", "National Consumer Commission (NCDRC)", "Central Administrative Tribunal (CAT)"]
  },
  {
    id: "lawyer-2",
    name: "Adv. Vikramaditya Rao",
    email: "v.rao@mumbaibar.com",
    phone: "+91 98201 39182",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "MAH/2981/2009",
    experienceYears: 16,
    city: "Mumbai",
    state: "Maharashtra",
    consultationFee: 1000,
    rating: 4.8,
    reviewCount: 98,
    isVerified: true,
    languages: ["English", "Hindi", "Marathi"],
    specializations: ["Tenancy & Property Law", "Corporate & Contracts", "Consumer Protection"],
    bio: "Specialist in Mumbai rent control, redevelopment agreements, RERA property disputes, and residential tenancy security deposit recovery with a 92% pre-litigation settlement record.",
    education: "B.A. LL.B. (Government Law College, Mumbai)",
    courtPractice: ["Bombay High Court", "MahaRERA Tribunal", "City Civil & Sessions Court Mumbai"]
  },
  {
    id: "lawyer-3",
    name: "Adv. Ananya Deshmukh",
    email: "ananya.cyberlaw@bengalurubar.in",
    phone: "+91 97410 88204",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "KAR/1842/2017",
    experienceYears: 8,
    city: "Bengaluru",
    state: "Karnataka",
    consultationFee: 600,
    rating: 4.9,
    reviewCount: 142,
    isVerified: true,
    languages: ["English", "Hindi", "Kannada", "Marathi"],
    specializations: ["Cybercrime & Data Privacy", "Labor & Employment", "Consumer Protection"],
    bio: "Cyber law advocate and tech policy consultant assisting citizens in recovering frozen bank funds from UPI fraud, phishing disputes, and unfair workplace terminations in tech companies.",
    education: "B.B.A. LL.B. (Symbiosis Law School, Pune), Certified Cyber Crime Investigator",
    courtPractice: ["Karnataka High Court", "Cyber Crime Police Station CID Bengaluru", "District Consumer Commission Bengaluru"]
  },
  {
    id: "lawyer-4",
    name: "Adv. Mohammad Farhan Qureshi",
    email: "farhan.qureshi@upadvocates.org",
    phone: "+91 94150 22910",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "UP/5102/2011",
    experienceYears: 14,
    city: "Lucknow",
    state: "Uttar Pradesh",
    consultationFee: 500,
    rating: 4.7,
    reviewCount: 76,
    isVerified: true,
    languages: ["English", "Hindi", "Urdu"],
    specializations: ["Criminal Defense & Bail", "Police & FIR Matters", "RTI & Administrative Law"],
    bio: "Criminal defense practitioner focusing on safeguarding citizen constitutional protections during police custody, illegal detentions, FIR registration refusals, and anticipatory bail proceedings.",
    education: "LL.B. (Faculty of Law, Aligarh Muslim University)",
    courtPractice: ["Allahabad High Court (Lucknow Bench)", "District & Sessions Court Lucknow"]
  },
  {
    id: "lawyer-5",
    name: "Adv. Preeti Sundaram",
    email: "preeti.sundaram@madrasbar.in",
    phone: "+91 94440 33190",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "TN/3120/2015",
    experienceYears: 10,
    city: "Chennai",
    state: "Tamil Nadu",
    consultationFee: 700,
    rating: 4.8,
    reviewCount: 88,
    isVerified: true,
    languages: ["English", "Tamil", "Telugu"],
    specializations: ["Family & Matrimonial", "Labor & Employment", "PoSH Compliance"],
    bio: "Specializing in women's workplace safety laws, Internal Complaints Committee (ICC) investigations, labor disputes, and compassionate family mediation.",
    education: "B.A. LL.B. (Dr. Ambedkar Government Law College, Chennai)",
    courtPractice: ["Madras High Court", "Family Courts Chennai", "Industrial Tribunal"]
  },
  {
    id: "lawyer-6",
    name: "Adv. Subhash Chandra Jha",
    email: "subhash.jha@patnahighcourt.org",
    phone: "+91 98350 71205",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "BR/890/2006",
    experienceYears: 19,
    city: "Patna",
    state: "Bihar",
    consultationFee: 500,
    rating: 4.9,
    reviewCount: 160,
    isVerified: true,
    languages: ["English", "Hindi", "Maithili"],
    specializations: ["RTI & Administrative Law", "Consumer Protection", "Property & Revenue"],
    bio: "Pioneer in Bihar public interest litigation and RTI activism. Experienced in pushing government departments on delayed welfare disbursements, pensions, and land registry records.",
    education: "LL.B. (Patna Law College, Patna University)",
    courtPractice: ["Patna High Court", "State Information Commission Bihar", "State Consumer Commission"]
  },
  {
    id: "lawyer-7",
    name: "Adv. K. Venkat Reddy",
    email: "venkat.reddy@hyderabadbar.com",
    phone: "+91 98480 19283",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "TS/2410/2013",
    experienceYears: 12,
    city: "Hyderabad",
    state: "Telangana",
    consultationFee: 650,
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    languages: ["English", "Telugu", "Hindi"],
    specializations: ["Consumer Protection", "Cybercrime & Data Privacy", "Tenancy & Property Law"],
    bio: "Advises individuals and IT professionals across Hyderabad on consumer fraud, tenant security deposit recovery, and online investment scams.",
    education: "LL.B. (Osmania University, Hyderabad)",
    courtPractice: ["Telangana High Court", "City Civil Court Hyderabad", "District Consumer Forum"]
  },
  {
    id: "lawyer-8",
    name: "Adv. Sanya Kapoor",
    email: "sanya.kapoor@punjabar.org",
    phone: "+91 98140 66201",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    barCouncilNo: "P&H/1920/2016",
    experienceYears: 9,
    city: "Chandigarh",
    state: "Punjab & Haryana",
    consultationFee: 600,
    rating: 4.9,
    reviewCount: 110,
    isVerified: true,
    languages: ["English", "Hindi", "Punjabi"],
    specializations: ["Labor & Employment", "Consumer Protection", "Family & Matrimonial"],
    bio: "Compassionate advocate handling workplace discrimination, unpaid severance pay, insurance claim rejections, and healthcare consumer disputes.",
    education: "B.A. LL.B. (Panjab University Chandigarh)",
    courtPractice: ["Punjab & Haryana High Court", "District Courts Chandigarh"]
  }
];
