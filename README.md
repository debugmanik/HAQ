# HAQ (हक) — Indian Civic & Legal Intelligence Platform

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma)
![Google GenAI](https://img.shields.io/badge/Google_GenAI-Gemini-4285F4?style=for-the-badge&logo=google)

**HAQ** (*"Right" / "हक"*) is a comprehensive, full-stack civic-tech and legal reasoning platform built to empower Indian citizens in understanding their rights, navigating administrative roadblocks, resolving legal disputes, drafting official statutory notices, and connecting with verified advocates.

---

## 🌟 Core Modules & Capabilities

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              HAQ ECOSYSTEM                                │
├───────────────────┬───────────────────┬───────────────────┬───────────────┤
│  🤖 AI ASSISTANT  │  📄 DOC STUDIO    │  📚 RIGHTS (KYR)  │ 👨‍💼 ADVOCATES │
│  • Evidence Score │  • RTI 6(1) Draft │  • 8 Legal Topics │ • Bar Verified│
│  • Dynamic Schema │  • Consumer Notice│  • Section Citings│ • City Filters│
│  • Action Roadmap │  • AI Polisher    │  • Action Guides  │ • Consultations│
├───────────────────┴───────────────────┴───────────────────┴───────────────┤
│  📖 CASE STORIES  │  🌐 7 INDIAN LANGS│  📊 DASHBOARD     │ ⚖️ INTAKE     │
│  • Precedents     │  • EN, HI, BN, TA │  • Case Tracker   │ • Guided Flow │
│  • Timeline Steps │  • TE, MR, KN     │  • Saved Drafts   │ • RTI Output  │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1. 🤖 Flagship HAQ AI Legal Assistant (`/assistant`)
- Multi-turn conversational AI specialized in Indian legal reasoning powered by `@google/genai` (Gemini).
- **Dynamic Legal Schema Extraction**: Dynamically identifies issue categories (*Administrative Delays, PoSH / Workplace Harassment, Tenant Deposit Disputes, Civic Complaints*).
- **Evidence Readiness Score**: Calculates a real-time 0–100% evidentiary readiness score as the citizen provides details.
- **Action Roadmap**: Generates sequential escalation steps with responsible authorities and official grievance portals (CPGRAMS, NCH 1915, Cyber Helpline 1930).

### 2. 📄 Legal Document Studio & AI Enhancer (`/documents`)
- **Template Library**: 6 standardized Indian legal templates:
  1. *Right to Information (RTI) Application under Section 6(1)*
  2. *Consumer Demand Notice under Consumer Protection Act 2019*
  3. *Landlord-Tenant Security Deposit Refund Notice under Model Tenancy Act*
  4. *Cybercrime Financial Fraud Bank Representation under RBI Circular*
  5. *Workplace Salary & Full and Final (FnF) Grievance Notice*
  6. *General Breach of Contract Notice under Indian Contract Act 1872*
- **AI Document Polisher**: Paste raw, informal dispute notes and let Gemini transform them into an authoritative legal demand notice with statutory citations and a strict 15-day compliance window.
- **Print & Export**: Print-ready Georgia legal serif A4 layout, `.txt` download, and clipboard copy.

### 3. 📚 Know Your Rights (KYR) Knowledge Base (`/kyr`)
- Searchable library across 8 core Indian legal domains (*Police & FIR Procedures, Consumer Protection, Housing & Tenancy, Women & PoSH Rights, Cybercrime & Online Fraud, Labor & Wages, RTI Act, Senior Citizens*).
- Reader view with landmark Supreme Court rulings (*D.K. Basu arrest guidelines, Lalita Kumari mandatory FIR ruling*), statutory sections, key takeaways, and action checklists.
- One-click article bookmarking synced with the Citizen Dashboard.

### 4. 👨‍💼 Verified Indian Advocate Directory (`/lawyers`)
- Directory of verified advocates across major Indian cities (*Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Lucknow, Patna, Chandigarh*).
- Search and filter by legal specialization, city, court practice, and experience.
- Interactive **Consultation Booking Modal** to schedule direct 45-minute consultations with Bar Council verified advocates.

### 5. 📖 Citizen Case Stories & Precedents (`/stories`)
- Real-life precedent stories of how Indian citizens resolved security deposit disputes, recovered stolen cyber funds via Helpline 1930, or unlocked delayed scholarships via RTI.
- Includes step-by-step resolution timelines, key takeaways, and a community "Share Your Story" submission dialog.

### 6. 🌐 Multilingual Localization (7 Indian Languages)
- Instant language switcher in navigation supporting **English**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, **Marathi (मराठी)**, and **Kannada (ಕನ್ನಡ)**.

### 7. 📊 Unified Citizen Dashboard (`/dashboard`)
- Centralized hub tracking:
  - Active AI Assistant cases with readiness scores.
  - Saved legal notices and RTI applications.
  - Scheduled advocate consultation bookings.
  - Bookmarked Know Your Rights guides.

### 8. ⚖️ Guided Grievance Intake & Section 6(1) Drafting (`/` & `/help` & `/result`)
- 3-step fatigue-free intake interview with custom category builder, statutory analysis, and print-ready legal document generation.

---

## 🏛️ Design System & Principles

In compliance with HAQ's trust-focused, high-accessibility design principles:
- **Background**: Solid off-white legal paper (`#FAF9F5`).
- **Accents**: Deep institutional navy (`#122438`) for buttons, active state highlights, and structural icons.
- **Borders**: Clean, flat stone lines (`#E5E3DC`) instead of heavy shadows or glassmorphism.
- **Typography**: Clean modern sans-serif (`Geist` / `system-ui`) paired with classic Georgia legal serif for formal document previews.
- **Legal Safeguards**: Zero deceptive legal promises, strict educational disclaimers across all views, and automatic safety escalations (Emergency 112 / Women Helpline 1091).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language & Runtime** | [TypeScript 5](https://www.typescriptlang.org/), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (CSS variables & @theme) |
| **Database & ORM** | [Prisma 7.9](https://www.prisma.io/) with PostgreSQL & `@prisma/adapter-pg` |
| **AI Intelligence** | Google GenAI SDK (`@google/genai`) with Gemini 2.5 / 3.0 |
| **UI Primitives** | Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-slot`), Lucide React |

---

## 📂 Project Directory Structure

```
haq/
├── prisma/
│   ├── schema.prisma             # Extended Prisma schema (KYR, Lawyers, Bookings, Drafts, Stories, AiCase)
│   └── seed.ts                   # Seed dataset for advocates, articles, templates
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assistant/chat/   # Multi-turn Gemini AI Assistant with dynamic schema
│   │   │   ├── documents/enhance/# AI Document Polisher endpoint
│   │   │   ├── kyr/              # Know Your Rights search & category API
│   │   │   ├── lawyers/          # Lawyer directory & consultation booking API
│   │   │   ├── stories/          # Case stories listing & submission API
│   │   │   ├── analyze/          # Standalone grievance analysis API
│   │   │   ├── categories/       # Category retrieval API
│   │   │   └── session/          # Cookie-backed session management
│   │   ├── assistant/page.tsx    # HAQ AI Legal Assistant interface
│   │   ├── documents/page.tsx    # Legal Document Studio & AI Enhancer
│   │   ├── kyr/
│   │   │   ├── page.tsx          # Know Your Rights library
│   │   │   └── [id]/page.tsx     # Single KYR article deep-dive reader
│   │   ├── lawyers/page.tsx      # Verified Advocate Directory
│   │   ├── stories/page.tsx      # Case Stories & Precedents
│   │   ├── dashboard/page.tsx    # Unified Citizen Dashboard
│   │   ├── help/page.tsx         # Guided 3-step interview flow
│   │   ├── result/page.tsx       # Grievance analysis & RTI draft result
│   │   ├── layout.tsx            # Global layout with LanguageProvider & HAQProvider
│   │   ├── page.tsx              # Homepage showcasing all 6 ecosystem modules
│   │   └── globals.css           # Tailwind v4 theme variables
│   ├── components/
│   │   ├── haq/
│   │   │   ├── Header.tsx        # Top navbar with navigation links & language switcher
│   │   │   ├── Footer.tsx        # Government portal links & legal disclaimers
│   │   │   ├── LanguageSwitcher.tsx # Multilingual dropdown for 7 Indian languages
│   │   │   └── ConsultationModal.tsx# Advocate consultation booking dialog
│   │   └── ui/                   # Reusable atomic UI components (Button, Input, Textarea, Dialog, Card)
│   └── lib/
│       ├── i18n.tsx              # Multilingual dictionary & context hook
│       ├── kyr-data.ts           # Comprehensive Know Your Rights dataset
│       ├── lawyer-data.ts        # Verified Indian advocate dataset
│       ├── story-data.ts         # Citizen resolution case stories dataset
│       ├── document-templates.ts # 6 standardized legal document templates
│       ├── schemas.ts            # Dynamic legal schemas (PoSH, Tenancy, Delays, Civic)
│       ├── prisma.ts             # Prisma client instance with PostgreSQL pool
│       └── store.tsx             # Multi-step state management context
├── package.json
└── README.md
```

---

## 🚀 Setup & Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or above recommended)
- [PostgreSQL](https://www.postgresql.org/) database (optional; offline fallbacks are included)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:
```env
# Google Gemini AI API Key (Get from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Connection String (Optional / Supabase / Neon / Local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/haq
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build & Linting
```bash
npm run build
npm run lint
```

---

## ⏱️ Comprehensive Demo Walkthrough

1. **Homepage (`/`)**: Explore the 6 core ecosystem cards or toggle regional languages (English, Hindi, Bengali, Tamil, Telugu, Marathi, Kannada) in the top navigation.
2. **HAQ AI Assistant (`/assistant`)**: Describe a complex dispute (e.g. landlord withheld deposit or workplace salary delay). Watch the AI calculate the evidence readiness score, extract parties and monetary claims, and build a sequential action roadmap.
3. **Legal Document Studio (`/documents`)**:
   - Select the *Consumer Demand Notice* or *RTI 6(1)* template, fill the dynamic variables, and click **Print A4 / PDF**.
   - Switch to **AI Document Polisher**, paste raw dispute notes, and watch Gemini generate a complete formal legal notice with statutory clauses.
4. **Know Your Rights (`/kyr`)**: Search for `"FIR"`, `"deposit"`, or `"cyber"`. Open an article to view statutory citations, landmark judgments, and step-by-step action checklists. Click **Bookmark**.
5. **Advocate Directory (`/lawyers`)**: Filter by city (*Bengaluru*, *Delhi*, *Mumbai*) and specialization (*Tenancy*, *Cybercrime*, *Consumer*). Click **Book Consultation** to schedule an appointment.
6. **Citizen Dashboard (`/dashboard`)**: View all your active AI inquiries, saved document drafts, advocate consultation bookings, and bookmarked guides in one place.

---

## ⚖️ Legal Disclaimer
HAQ is an open civic and legal education platform. It provides statutory guidelines, step-by-step resolution routes, and document templates, but does not constitute formal legal advice or create an attorney-client relationship.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
