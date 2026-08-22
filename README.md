# HAQ — Legal & Civil Help (Indian Civic Assistance MVP)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)

HAQ is a full-stack civic-tech web MVP built to help Indian citizens describe civic or legal problems in plain language, understand their official escalation routes, get a step-by-step checklist of actions, and draft formal applications under Section 6(1) of the Right to Information (RTI) Act, 2005.

---

## 🌟 Key Features

- **Plain-Language Intake**: Users can describe their problems naturally.
- **AI-Powered Legal Categorization**: Automatically determines the nature of the issue and legal status.
- **Guided Multi-Step Flow**: A simple, fatigue-free 3-step interview process to gather necessary details.
- **Interactive Action Checklists**: Step-by-step guidance customized to the user's specific case.
- **Automated Document Drafting**: Instantly generates print-ready RTI applications or legal demand notices based on the provided details.
- **Accessible & Trust-Focused Design**: Built with a minimalist, high-contrast UI inspired by official legal documents.

---

## 🏛️ Project Principles & Design System

In compliance with the minimalist, high-contrast, trust-focused requirement:
- **Background**: Solid off-white (`#FAF9F5`) to replicate official legal paper.
- **Typography**: Clean, highly readable default sans-serif (`Geist` / `system-ui`) with clear hierarchies.
- **Accents**: Muted navy (`#122438`) for buttons, active state highlights, and structural icons only.
- **Borders**: Thin, flat stone lines (`#E5E3DC`) instead of card shadows, gradients, or glassmorphism.
- **Accessibility**: High contrast text (`#1C1C1C` charcoal) designed for readability on both desktop and mobile layouts.

---

## 🛠️ Stack & Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first configurations)
- **Icons**: Lucide React (used sparingly to keep the interface professional and fast-loading)
- **Radix UI**: Headless accessible primitives (`@radix-ui/react-slot` & `@radix-ui/react-dialog`)
- **State Management**: React Context (`src/lib/store.tsx`) capturing issue descriptions, categories, and multi-step interview data, synchronized with `localStorage` for session persistence.

---

## 📂 Project Structure

```
haq/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Configures layout wrap, Header, Footer, and Session Context
│   │   ├── page.tsx           # / (Landing and free-text grievance intake)
│   │   ├── help/
│   │   │   └── page.tsx       # /help (3-step guided interview flow & verification)
│   │   ├── result/
│   │   │   └── page.tsx       # /result (Resolution pathway, interactive checklist, and RTI draft)
│   │   └── globals.css        # Clean, solid styling definitions (Tailwind v4 theme variables)
│   ├── components/
│   │   ├── ui/                # Custom styled atomic components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── dialog.tsx
│   │   └── haq/               # Layout components
│   │       ├── Header.tsx     # Dynamic header with session reset controls
│   │       └── Footer.tsx     # Footer containing disclaimers and official links
│   └── lib/
│       ├── utils.ts           # Class name merger helper
│       ├── mock-data.ts       # Structured grievance categories, questions, paths, & RTI templates
│       └── store.tsx          # Multi-step state management context
├── tailwind.config.ts         # Post-CSS tailwind hook
├── package.json
└── README.md
```

---

## 🚀 Setup & Run Instructions

Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or above recommended).

### 1. Install Dependencies
Navigate to the project root directory and install npm packages:
```bash
npm install
```

### 2. Run the Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### 3. Build & Production Check
Verify compilation and generate production static assets:
```bash
npm run build
```

### 4. Run ESLint checks
Verify code quality and linting constraints:
```bash
npm run lint
```

---

## 🚀 Vercel Deployment Steps

You can easily deploy HAQ to Vercel for a live demo:

1. **Push to GitHub**: Initialize a Git repository and push the code to your GitHub/GitLab account.
2. **Import to Vercel**: Sign in to [Vercel](https://vercel.com/) and click **Add New Project**. Select your repository.
3. **Configure Environment Variables**: Under the "Environment Variables" section, add:
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here` (starts with `sk-`)
4. **Deploy**: Click **Deploy**. Vercel will build and serve the application globally.

---

## ⏱️ 90-Second Hackathon Demo Script

Follow this script to deliver a flawless, high-impact demonstration of HAQ under 90 seconds:

- **0:00 - 0:15 | Intake & Landing**:
  - Present the homepage: *"HAQ translates plain-language citizen concerns into clear legal action plans."*
  - Click the example chip: **"My landlord has not returned my security deposit"**. Show how the text area is pre-filled with a realistic, detailed dispute.
  - Click the primary CTA **"Find my next step"** to start.

- **0:15 - 0:40 | The Guided Flow**:
  - Show the **one-question-per-screen card layout** and the progress bar. Explain that this prevents form fatigue.
  - Step through the questions: Select State/UT, District, enter Landlord's Name, Property Address, Deposit Amount (Rs. 50,000), Vacate Date, and Desired Outcome.
  - On the final screen, enter your name (*"Arun Kumar"*) and address. Click **"Generate Notice"**.

- **0:40 - 1:10 | AI Analysis & Fallback Resiliency**:
  - Land on `/result`. Point out the custom **pulsating skeleton screens** as the AI analyzes the case.
  - Point to the **AI Category** badge, **Confidence rating**, and the **Plain-Language legal status** box explaining tenant rights under the Model Tenancy Act.
  - Scroll down to review the custom interactive checklist and the **"Missing Questions"** panel which highlights what other details the user should verify.

- **1:10 - 1:30 | Standalone RTI Draft & PDF Export**:
  - Scroll to the draft panel. Explain that because it is a private dispute, HAQ automatically generated a **Formal Legal Demand Notice** instead of an RTI.
  - Type directly inside the preview textarea to demonstrate that it is fully editable.
  - Click **"Print PDF"** (or Download PDF) to launch the print preview. Show the beautiful, print-ready document formatted in a classic Georgia-serif legal layout.
  - Conclude: *"HAQ empowers citizens to know their routes and claim their rights."*
