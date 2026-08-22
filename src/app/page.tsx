"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, HelpCircle, AlertCircle, Info, BookOpen } from "lucide-react";
import { useHAQ } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function IntakePage() {
  const router = useRouter();
  const { categories, intakeText, setIntakeText, resetSession } = useHAQ();
  const [localText, setLocalText] = useState(intakeText);
  const [error, setError] = useState("");

  const EXAMPLES = [
    {
      label: "My scholarship application is delayed",
      text: "I applied for the post-matric scholarship scheme 60 days ago. The application status has been stuck at 'Under Verification' at the district welfare office, and no funds have been disbursed."
    },
    {
      label: "My municipal sanitation complaint is unanswered",
      text: "The public garbage dump in Sector 4 has been overflowing for the last 3 weeks, blockading the sidewalk. We registered an online grievance (Ref: SAN-9921) with the municipal corporation but no cleanup has occurred."
    },
    {
      label: "My landlord has not returned my security deposit",
      text: "I vacated my rented flat 2 months ago after giving 1 month notice. The landlord inspected the flat, confirmed no damages, but is now ignoring my messages and has not returned my security deposit of Rs. 50,000."
    },
    {
      label: "My online purchase is defective and refund is delayed",
      text: "I purchased a smartphone from an online retailer on July 10th for Rs. 15,000. Within 3 days, the screen started flickering. The brand service center refused replacement claiming physical damage, which is incorrect as the phone has no scratches."
    },
    {
      label: "My welfare-scheme eligibility application has no update",
      text: "I applied for the Senior Citizen Pension scheme (Application Ref: PEN-88712) at the Block Social Welfare office 90 days ago. I meet all eligibility criteria, but no verification has been conducted and no pension has been credited."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localText.trim()) {
      setError("Please describe your issue in a few sentences before proceeding.");
      return;
    }
    if (localText.trim().length < 20) {
      setError("Please provide a more detailed description (minimum 20 characters) so we can analyze the issue.");
      return;
    }
    setError("");
    setIntakeText(localText);
    router.push("/help");
  };

  const handleQuickSelect = (exampleText: string) => {
    setLocalText(exampleText);
    setError("");
  };

  return (
    <div className="flex flex-col space-y-10 max-w-2xl mx-auto py-8">
      {/* Hero Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-navy sm:text-4xl leading-tight">
          Understand your rights.<br />Take the next step.
        </h1>
        <p className="text-sm text-slate-muted max-w-xl leading-relaxed">
          Describe your civic concern in simple words. HAQ turns it into a clear action plan.
        </p>
      </div>

      {/* Main Intake Form */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="issue-description" className="sr-only">Describe your issue</label>
            <Textarea
              id="issue-description"
              placeholder="Describe your concern here (mention key details like dates, location, or reference numbers if you have them)..."
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                if (e.target.value.trim().length >= 20) {
                  setError("");
                }
              }}
              className="min-h-[160px] w-full p-4 text-sm border border-stone-border bg-paper rounded-md focus-visible:ring-1 focus-visible:ring-navy focus-visible:border-navy leading-relaxed text-foreground placeholder:text-slate-muted/60"
            />
            <div className="flex justify-between items-center text-xs text-slate-muted">
              <span>Write in plain English. Be specific.</span>
              <span>{localText.length} characters</span>
            </div>
          </div>

          {/* Example Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-navy uppercase tracking-wider block">Example concerns (Click to test):</span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickSelect(ex.text)}
                  className="text-xs px-3 py-1.5 border border-stone-border rounded-full bg-paper hover:bg-stone-border/20 text-slate-muted hover:text-navy cursor-pointer transition-colors text-left focus-visible:ring-1 focus-visible:ring-navy focus-visible:outline-none"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-navy text-paper hover:bg-navy-hover transition-colors font-semibold px-6 h-11 rounded-md cursor-pointer">
              Find my next step
              <ArrowRight className="h-4 w-4" />
            </Button>
            {intakeText && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetSession();
                  setLocalText("");
                }}
                className="sm:flex-none border-stone-border text-slate-muted hover:border-red-200 hover:text-red-800 h-11 cursor-pointer"
              >
                Clear Session
              </Button>
            )}
          </div>
        </form>

        {/* Small Legal Disclaimer */}
        <div className="p-4 border border-stone-border/60 bg-paper/60 rounded-md text-xs text-slate-muted flex items-start gap-3">
          <Info className="h-4 w-4 text-slate-muted flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            HAQ is an open civic information platform. It provides legal guidelines, step-by-step resolution routes, and document templates under the RTI Act and relevant laws, but does not constitute formal legal advice.
          </p>
        </div>
      </div>

      {/* How HAQ Works Section */}
      <div className="border-t border-stone-border/60 pt-8 space-y-4">
        <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4.5 w-4.5 text-slate-muted" />
          How HAQ Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 border border-stone-border bg-paper rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 bg-navy text-paper flex items-center justify-center font-bold font-mono rounded-full text-[10px]">1</span>
              <strong className="text-navy uppercase">Describe</strong>
            </div>
            <p className="text-slate-muted leading-relaxed">
              Describe your administrative concern or delay in plain language.
            </p>
          </div>
          <div className="p-4 border border-stone-border bg-paper rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 bg-navy text-paper flex items-center justify-center font-bold font-mono rounded-full text-[10px]">2</span>
              <strong className="text-navy uppercase">Answer</strong>
            </div>
            <p className="text-slate-muted leading-relaxed">
              Complete a short, conversational guided flow to fill in dates, reference IDs, and jurisdictions.
            </p>
          </div>
          <div className="p-4 border border-stone-border bg-paper rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 bg-navy text-paper flex items-center justify-center font-bold font-mono rounded-full text-[10px]">3</span>
              <strong className="text-navy uppercase">Resolve</strong>
            </div>
            <p className="text-slate-muted leading-relaxed">
              Get an escalation route, an interactive checklist of documents, and an editable, printable RTI/Legal Notice draft.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Areas Grid - Clean & Minimalist */}
      <div className="border-t border-stone-border/60 pt-8 space-y-4">
        <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-slate-muted" />
          Supported Areas of Civil Resolution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 border border-stone-border bg-paper rounded-md flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-xs text-navy uppercase tracking-wide">{cat.title}</h3>
                <p className="text-xs text-slate-muted leading-relaxed">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Privacy notice */}
      <div className="text-center text-[10px] text-slate-muted/80 leading-relaxed border-t border-stone-border/40 pt-4">
        Privacy & Usage Notice: HAQ is a demonstration prototype. All inputs entered are for testing purposes only and do not constitute official records or binding legal filings. No personal data is stored on our servers.
      </div>
    </div>
  );
}
