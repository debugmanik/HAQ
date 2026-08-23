"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, AlertCircle, Info, Bot, FileText, 
  BookOpen, Users, BookMarked, LayoutDashboard, Sparkles, ShieldCheck, CheckCircle2
} from "lucide-react";
import { useHAQ } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const router = useRouter();
  const { intakeText, setIntakeText, resetSession } = useHAQ();
  const { t } = useLanguage();
  const [localText, setLocalText] = useState(intakeText);
  const [error, setError] = useState("");

  const EXAMPLES = [
    {
      label: "Delayed scholarship application",
      text: "I applied for the post-matric scholarship scheme 60 days ago. The application status has been stuck at 'Under Verification' at the district welfare office, and no funds have been disbursed."
    },
    {
      label: "Unreturned rental security deposit",
      text: "I vacated my rented flat 2 months ago after giving 1 month notice. The landlord inspected the flat, confirmed no damages, but is now ignoring my messages and has not returned my security deposit of Rs. 50,000."
    },
    {
      label: "Defective online product & refund refusal",
      text: "I purchased a smartphone from an online retailer on July 10th for Rs. 15,000. Within 3 days, the screen started flickering. The brand service center refused replacement claiming physical damage, which is incorrect as the phone has no scratches."
    },
    {
      label: "Cyber UPI debit / unauthorized transaction",
      text: "An unauthorized debit of Rs. 35,000 occurred from my bank account via UPI without receiving any OTP. I reported it to my bank within 24 hours but no shadow credit has been provided."
    },
    {
      label: "Workplace unpaid salary & withheld FnF",
      text: "I resigned from my company and completed my full 2-month notice period on Dec 31. The employer has not released my Full and Final (FnF) settlement or salary for 60 days."
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

  const FEATURE_PORTALS = [
    {
      title: "HAQ AI Legal Assistant",
      desc: "Interactive conversational AI with evidence readiness score, timeline tracking, and dynamic legal schema extraction.",
      href: "/assistant",
      icon: Bot,
      badge: "Flagship AI",
      highlight: true
    },
    {
      title: "Document Studio & AI Enhancer",
      desc: "Draft standardized RTI 6(1) queries, consumer demand notices, tenancy letters, or enhance raw dispute notes with Gemini.",
      href: "/documents",
      icon: FileText,
      badge: "Print-Ready A4"
    },
    {
      title: "Know Your Rights (KYR)",
      desc: "Searchable plain-language guides to Indian civil, criminal, cyber, and consumer laws with statutory citations.",
      href: "/kyr",
      icon: BookOpen,
      badge: "8 Legal Domains"
    },
    {
      title: "Verified Advocate Directory",
      desc: "Connect with Bar Council verified advocates across Indian cities and book direct 45-minute consultations.",
      href: "/lawyers",
      icon: Users,
      badge: "Bar Verified"
    },
    {
      title: "Citizen Case Stories",
      desc: "Real-life case precedents and step-by-step resolution journeys from citizens who successfully asserted their rights.",
      href: "/stories",
      icon: BookMarked,
      badge: "Precedents"
    },
    {
      title: "My Dashboard",
      desc: "Your centralized citizen hub tracking active AI cases, saved document drafts, advocate bookings, and bookmarks.",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Central Hub"
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Hero Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-stone-border/60 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-border/30 border border-stone-border/60 rounded-full text-xs font-semibold text-navy">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>{t("gov_compliance")}</span>
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy leading-tight">
          {t("hero_title")}
        </h1>
        <p className="text-sm sm:text-base text-slate-muted max-w-2xl leading-relaxed">
          {t("hero_subtitle")}
        </p>
      </div>

      {/* Feature Exploration Grid (6 Key Modules) */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-navy" /> Explore HAQ Ecosystem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link key={portal.href} href={portal.href}>
                <Card className={`h-full border transition-all duration-150 group shadow-none cursor-pointer flex flex-col justify-between ${
                  portal.highlight 
                    ? "border-navy bg-stone-border/15 hover:bg-stone-border/25" 
                    : "border-stone-border bg-paper hover:border-navy"
                }`}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-md ${portal.highlight ? "bg-navy text-paper" : "bg-stone-border/30 text-navy"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono bg-stone-border/30 text-navy">
                        {portal.badge}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-bold text-navy group-hover:underline">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-muted leading-relaxed">
                      {portal.desc}
                    </p>
                  </CardContent>

                  <div className="px-5 py-3 border-t border-stone-border/40 flex items-center justify-between text-xs text-slate-muted group-hover:text-navy font-semibold">
                    <span>Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Intake Form Section */}
      <div className="border-t border-stone-border/60 pt-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-navy">
            Quick Grievance Intake & Guided Resolution
          </h2>
          <p className="text-xs text-slate-muted">
            Prefer a guided 3-step intake? Describe your dispute in plain English below to generate a tailored resolution checklist and Section 6(1) RTI / Legal Notice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="issue-description"
              placeholder="Describe your concern here (mention key details like dates, disputed amounts, reference numbers, or official departments)..."
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                if (e.target.value.trim().length >= 20) setError("");
              }}
              className="min-h-[140px] w-full p-4 text-xs sm:text-sm border border-stone-border bg-paper rounded-md focus-visible:ring-1 focus-visible:ring-navy focus-visible:border-navy leading-relaxed text-foreground placeholder:text-slate-muted/60"
            />
            <div className="flex justify-between items-center text-xs text-slate-muted">
              <span>Write in simple language. Be specific.</span>
              <span>{localText.length} characters</span>
            </div>
          </div>

          {/* Example Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-navy uppercase tracking-wider block">
              Quick test examples (Click to fill):
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickSelect(ex.text)}
                  className="text-xs px-3 py-1.5 border border-stone-border rounded-full bg-paper hover:bg-stone-border/20 text-slate-muted hover:text-navy cursor-pointer transition-colors text-left"
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
            <Button 
              type="submit" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-navy text-paper hover:bg-navy-hover transition-colors font-semibold px-6 h-11 rounded-md cursor-pointer"
            >
              {t("find_next_step")}
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

        {/* Small Legal Notice */}
        <div className="p-4 border border-stone-border/60 bg-paper/60 rounded-md text-xs text-slate-muted flex items-start gap-3">
          <Info className="h-4 w-4 text-slate-muted flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t("footer_disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
