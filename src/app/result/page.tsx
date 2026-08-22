"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Copy, Download, Check, CheckSquare, Square, 
  ArrowLeft, ExternalLink, Info, AlertTriangle, ShieldCheck, Printer,
  Loader2, RefreshCw
} from "lucide-react";
import { useHAQ } from "@/lib/store";
import { generateRTIDraft } from "@/lib/draft-generator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIResponse {
  category: "rti" | "consumer" | "tenant" | "workplace" | "welfare_scheme" | "unknown";
  summary: string;
  plain_language_explanation: string;
  confidence: "low" | "medium" | "high";
  missing_questions: string[];
  recommended_actions: string[];
  documents_needed: string[];
  should_generate_rti_draft: boolean;
  safety_notice: string;
  official_route_type: "central" | "state" | "local" | "unknown";
}

export default function ResultPage() {
  const router = useRouter();
  const {
    intakeText,
    category,
    answers,
    fullName,
    fullAddress,
    paymentMethod,
    paymentRef,
    isInitialized
  } = useHAQ();

  // AI Response States
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  // UI States
  const [copied, setCopied] = useState(false);
  const [rtiText, setRtiText] = useState("");
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});

  // Fetch AI Analysis from route
  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFallbackMode(false);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: intakeText, answers })
      });
      
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      setTimeout(() => {
        setAiResponse(data);
        setLoading(false);
      }, 0);
    } catch (err: unknown) {
      console.error("AI Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to communicate with AI analysis server.";
      setTimeout(() => {
        setError(errorMessage);
        setLoading(false);
      }, 0);
    }
  }, [intakeText, answers]);

  // Trigger analysis on load
  useEffect(() => {
    if (isInitialized && intakeText && !fallbackMode && !aiResponse) {
      const timer = setTimeout(() => {
        fetchAnalysis();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, intakeText, fallbackMode, aiResponse, fetchAnalysis]);

  // Local storage for checklist
  useEffect(() => {
    if (category?.id) {
      try {
        const saved = localStorage.getItem(`haq_checklist_${category.id}`);
        setTimeout(() => {
          if (saved) {
            setChecklist(JSON.parse(saved));
          } else {
            setChecklist({});
          }
        }, 0);
      } catch (err) {
        console.error("Failed to load checklist", err);
      }
    }
  }, [category?.id]);

  // Generate RTI draft/Notice and sync state when parameters change
  useEffect(() => {
    if (isInitialized && intakeText) {
      // If AI recommended not to generate RTI, force notice type document
      if (!category) return;
      const tempCategory = { ...category };
      if (aiResponse) {
        tempCategory.type = aiResponse.should_generate_rti_draft ? "rti" : "notice";
      }

      const generated = generateRTIDraft(
        tempCategory,
        {
          ...answers,
          fullName,
          fullAddress,
          paymentMethod,
          paymentRef
        },
        intakeText
      );
      setTimeout(() => {
        setRtiText(generated);
      }, 0);
    }
  }, [category, answers, fullName, fullAddress, paymentMethod, paymentRef, intakeText, isInitialized, aiResponse]);

  // If session is empty and fully initialized, redirect back to /
  useEffect(() => {
    if (isInitialized && !intakeText) {
      router.push("/");
    }
  }, [intakeText, isInitialized, router]);

  if (!isInitialized || !intakeText || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-sm text-slate-muted">Generating case analysis...</p>
      </div>
    );
  }

  // Handle skip AI analysis
  const handleSkipToOffline = () => {
    setFallbackMode(true);
    setLoading(false);
    setError(null);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-4 space-y-10">
        {/* Skeleton Header */}
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-9 w-36 bg-stone-border/50 rounded-sm" />
          <div className="h-6 w-24 bg-stone-border/50 rounded-sm" />
        </div>

        {/* Centered Loading Card */}
        <div className="border border-stone-border bg-paper rounded-md p-6 max-w-md mx-auto text-center space-y-4 shadow-xs">
          <div className="flex justify-center">
            <Loader2 className="h-10 w-10 text-navy animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-navy">Analyzing Grievance with HAQ AI...</h2>
            <p className="text-xs text-slate-muted max-w-xs mx-auto leading-relaxed">
              We are classifying your issue, checking jurisdiction, and preparing your resolution roadmap.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSkipToOffline}
            className="w-full text-xs text-slate-muted border-stone-border hover:border-navy hover:text-navy cursor-pointer mt-2"
          >
            Skip AI & Use Offline Fallback
          </Button>
        </div>

        {/* Skeletons Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 pointer-events-none">
          {/* Left Column Skeletons */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-6 w-3/4 bg-stone-border/50 rounded-sm" />
              <div className="h-4 w-full bg-stone-border/40 rounded-sm" />
              <div className="h-4 w-5/6 bg-stone-border/40 rounded-sm" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-stone-border/50 rounded-md p-5 flex items-start gap-4 animate-pulse">
                  <div className="h-5 w-5 bg-stone-border/50 rounded-sm flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-4 w-1/3 bg-stone-border/50 rounded-sm" />
                    <div className="h-3 w-full bg-stone-border/40 rounded-sm" />
                    <div className="h-3 w-5/6 bg-stone-border/40 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeletons */}
          <div className="space-y-6 animate-pulse">
            <div className="border border-stone-border/50 rounded-md p-4 space-y-4">
              <div className="h-4 w-1/2 bg-stone-border/50 rounded-sm" />
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-stone-border/40 rounded-sm" />
                <div className="h-3 w-1/2 bg-stone-border/40 rounded-sm" />
              </div>
            </div>
            <div className="border border-stone-border/50 rounded-md p-4 space-y-3">
              <div className="h-4 w-1/3 bg-stone-border/50 rounded-sm" />
              <div className="h-3 w-full bg-stone-border/40 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-lg mx-auto py-12 space-y-6">
        <Card className="border-red-200 bg-red-50/20 shadow-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-650 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-red-900">AI Analysis Connection Error</h3>
                <p className="text-xs text-red-800 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-muted leading-relaxed">
              If the server key is missing or invalid, you can still view the generated checklist and document draft using our offline static routing templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={fetchAnalysis}
                className="flex-1 flex items-center justify-center gap-1.5 bg-navy text-paper hover:bg-navy-hover transition-colors text-xs h-9 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry AI Analysis
              </Button>
              <Button 
                variant="outline"
                onClick={handleSkipToOffline}
                className="flex-1 border-stone-border text-slate-muted hover:border-navy hover:text-navy text-xs h-9 cursor-pointer"
              >
                Use Offline Static Routing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleChecklist = (index: number) => {
    const updated = {
      ...checklist,
      [index]: !checklist[index]
    };
    setChecklist(updated);
    try {
      const storageKey = aiResponse && !fallbackMode ? `haq_ai_checklist_${category.id}` : `haq_checklist_${category.id}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update checklist", err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rtiText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rtiText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const filename = isNoticeDoc 
      ? `HAQ_Legal_Notice_${category.id}.txt` 
      : `HAQ_RTI_Draft_${category.id}.txt`;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const docTitle = isNoticeDoc ? "Legal Notice / Demand Notice" : "Right to Information (RTI) Application";
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${docTitle}</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 14px;
              line-height: 1.6;
              color: #111;
              padding: 40px 50px;
              max-width: 750px;
              margin: 0 auto;
              background-color: #fff;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: inherit;
              margin: 0;
            }
            .legal-border {
              border: 1px solid #ddd;
              padding: 24px;
              min-height: 90vh;
            }
            @media print {
              body {
                padding: 0;
              }
              .legal-border {
                border: none;
                padding: 0;
              }
              @page {
                size: A4;
                margin: 25mm 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="legal-border">
            <pre>${rtiText}</pre>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Category title mapper for AI responses
  const getCategoryTitle = (catStr: string) => {
    const mapping: Record<string, string> = {
      rti: "Right to Information filing",
      consumer: "Consumer Rights Protection",
      tenant: "Tenant-Landlord Dispute",
      workplace: "Workplace / Labor Grievance",
      welfare_scheme: "Delayed Welfare Benefits",
      unknown: "General Civic Concern"
    };
    return mapping[catStr] || category.title;
  };

  // Determine whether to show notice or RTI template
  const isNoticeDoc = aiResponse && !fallbackMode 
    ? !aiResponse.should_generate_rti_draft 
    : category.type === "notice";

  // Actions list configuration
  const actionList = aiResponse && !fallbackMode
    ? aiResponse.recommended_actions
    : category.route.map(step => `Step ${step.stepNumber}: ${step.title} — ${step.description}`);

  const progressPercent = Math.round(
    (actionList.filter((_, idx) => checklist[idx]).length / actionList.length) * 100
  );

  // Explanation configuration
  const plainExplanation = aiResponse && !fallbackMode
    ? aiResponse.plain_language_explanation
    : (category.plainExplanation || `You have a right to resolve administrative delays or grievances regarding ${category.title}.`);

  // Documents list configuration
  const documentList = aiResponse && !fallbackMode
    ? aiResponse.documents_needed
    : (category.documents || ["Copy of your original complaint receipt", "Photographs/evidence of the issue"]);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-10">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/help")}
            className="border-stone-border text-slate-muted hover:border-navy hover:text-navy flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Edit Interview Answers
          </Button>
          {!fallbackMode && aiResponse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAnalysis}
              className="text-slate-muted hover:text-navy text-xs h-8 px-2 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh AI
            </Button>
          )}
        </div>
        
        <Badge variant="secondary" className="px-3 py-1 font-mono uppercase tracking-wider text-[10px] bg-stone-border/20 border border-stone-border/40 text-slate-muted">
          Case ID: HAQ-{category.id.substring(0, 4).toUpperCase()}
        </Badge>
      </div>

      {/* Immediate Safety Warning Banner (AI Mode Only) */}
      {!fallbackMode && aiResponse && aiResponse.safety_notice && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-900 rounded-md text-xs flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-red-650 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-semibold">Immediate Safety & Emergency Notice</strong>
            <p className="leading-relaxed">{aiResponse.safety_notice}</p>
          </div>
        </div>
      )}

      {/* Case Overview & Plain Explanation */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-navy leading-none">Your Case Resolution Route</h1>
          <Badge className="bg-navy text-paper font-sans text-xs px-2.5 py-0.5 border-none">
            {fallbackMode ? `Category: ${category.title}` : `AI Category: ${getCategoryTitle(aiResponse?.category || "")}`}
          </Badge>
          <Badge variant="outline" className="border-stone-border text-slate-muted font-sans text-xs">
            Confidence: {fallbackMode ? "Static Rules" : `AI ${aiResponse?.confidence || "medium"}`}
          </Badge>
          {!fallbackMode && aiResponse && (
            <Badge variant="outline" className="border-stone-border text-slate-muted font-sans text-xs">
              Route: {aiResponse.official_route_type} jurisdiction
            </Badge>
          )}
          {fallbackMode && (
            <Badge variant="outline" className="border-stone-border text-orange-700 bg-orange-50 font-sans text-xs">
              Offline Fallback Active
            </Badge>
          )}
        </div>
        
        {/* Plain Language Explanation Box */}
        <div className="p-5 border border-stone-border bg-paper rounded-md space-y-2">
          <span className="text-[10px] font-bold text-navy uppercase tracking-wider block">Plain-Language Legal Status</span>
          <p className="text-sm text-foreground leading-relaxed">
            {plainExplanation}
          </p>
        </div>
      </div>

      {/* Checklist and Details Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Steps Checklist */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">What you can do now (Checklist)</h3>
            <span className="text-xs text-slate-muted font-mono">{progressPercent}% Completed</span>
          </div>

          <div className="space-y-3">
            {actionList.map((step, idx) => (
              <div 
                key={idx} 
                className={`border border-stone-border rounded-md p-4 flex items-start gap-4 transition-colors bg-paper ${
                  checklist[idx] ? "bg-stone-border/10 border-stone-border/50" : ""
                }`}
              >
                <button
                  onClick={() => toggleChecklist(idx)}
                  className="mt-0.5 focus:outline-none text-navy hover:opacity-80 cursor-pointer flex-shrink-0"
                  aria-label={checklist[idx] ? "Mark step uncompleted" : "Mark step completed"}
                >
                  {checklist[idx] ? (
                    <CheckSquare className="h-5 w-5 text-navy" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-muted" />
                  )}
                </button>

                <div className="space-y-1 flex-1 text-xs">
                  <p className={`leading-relaxed ${checklist[idx] ? "line-through text-slate-muted/70" : "text-slate-muted"}`}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Missing Questions Clarifications (AI Mode Only) */}
          {!fallbackMode && aiResponse && aiResponse.missing_questions && aiResponse.missing_questions.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/15 shadow-none mt-6">
              <CardHeader className="py-3 px-4 border-b border-amber-200/50 bg-amber-50/20">
                <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-amber-700" />
                  Strengthen Your Dispute: Key Details Missing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-xs text-amber-850 leading-relaxed mb-3">
                  To pursue this legally or draft formal representations, you should also discover and document the following:
                </p>
                <ul className="text-xs text-amber-850 space-y-2 list-disc list-inside leading-relaxed">
                  {aiResponse.missing_questions.map((q, index) => (
                    <li key={index} className="marker:text-amber-700">
                      {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Documents, Links, and Info */}
        <div className="space-y-6">
          {/* Documents to keep ready */}
          <Card className="border-stone-border bg-paper shadow-none">
            <CardHeader className="bg-navy-light/30 py-3 px-4 border-b border-stone-border/60">
              <CardTitle className="text-xs font-bold text-navy uppercase tracking-wider">
                Documents to keep ready
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="text-xs text-slate-muted space-y-2 list-disc list-inside leading-relaxed">
                {documentList.map((doc, index) => (
                  <li key={index} className="marker:text-navy">
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Official link section */}
          <Card className="border-stone-border bg-paper shadow-none">
            <CardHeader className="bg-navy-light/30 py-3 px-4 border-b border-stone-border/60">
              <CardTitle className="text-xs font-bold text-navy uppercase tracking-wider">
                Official Links
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <p className="text-slate-muted leading-relaxed">
                Use official portals to submit complaints online:
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 border border-stone-border rounded-sm hover:border-navy hover:text-navy text-slate-muted transition-colors font-medium"
                >
                  CPGRAMS National Portal
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://rtionline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 border border-stone-border rounded-sm hover:border-navy hover:text-navy text-slate-muted transition-colors font-medium"
                >
                  RTI Online central website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Clearly visible disclaimer */}
          <div className="p-4 border border-stone-border bg-stone-border/10 rounded-md text-xs text-slate-muted flex items-start gap-2">
            <Info className="h-4 w-4 text-navy mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed font-semibold">
              Disclaimer: HAQ provides legal information, not legal advice.
            </p>
          </div>
        </div>
      </div>

      <hr className="border-stone-border/60" />

      {/* Document Draft Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <FileText className="h-5 w-5 text-navy" />
            {isNoticeDoc ? "Legal Notice & Demand Draft" : "Right to Information (RTI) Application Draft"}
          </h2>
          <p className="text-xs text-slate-muted leading-relaxed">
            {isNoticeDoc 
              ? "Because this dispute is with a private entity, a standard RTI does not apply. Instead, we have drafted a formal Legal Notice. Review, edit directly below, and copy or download." 
              : "If your initial public grievance is ignored after 30 days, you can file this RTI application. Review and edit details directly in the box below."}
          </p>
        </div>

        {/* Draft Panel */}
        <Card className="border-stone-border shadow-none overflow-hidden bg-paper">
          <CardHeader className="bg-navy py-3.5 px-6 border-b border-stone-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <CardTitle className="text-xs font-bold text-paper uppercase tracking-wider">
                {isNoticeDoc ? "Legal Notice Form" : "Section 6(1) RTI Form"}
              </CardTitle>
              <CardDescription className="text-[10px] text-paper/70 font-mono">
                {isNoticeDoc ? "Private Tenancy & Consumer Protection Act 2019" : "Right to Information Act 2005"}
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-transparent border-paper/40 text-paper hover:bg-paper/10 hover:text-paper text-xs h-8 px-2.5 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Draft"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-transparent border-paper/40 text-paper hover:bg-paper/10 hover:text-paper text-xs h-8 px-2.5 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="bg-transparent border-paper/40 text-paper hover:bg-paper/10 hover:text-paper text-xs h-8 px-2.5 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Download PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <textarea
              value={rtiText}
              onChange={(e) => setRtiText(e.target.value)}
              className="w-full min-h-[440px] p-6 font-mono text-xs bg-paper leading-relaxed text-foreground border-none resize-y focus:outline-none focus:ring-0"
              aria-label="Editable Application Draft"
              placeholder="Notice text goes here..."
            />
            <div className="bg-navy-light/20 p-2 text-[10px] text-slate-muted border-t border-stone-border/40 text-center font-mono">
              Note: You can type directly in the box above to edit the draft before copying or downloading.
            </div>
          </CardContent>
        </Card>

        {/* Submission Guide */}
        <Card className="border-stone-border shadow-none bg-navy-light/10">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-navy flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-navy" />
              How to Proceed with this Document
            </h3>
            
            <ol className="text-xs space-y-2 text-slate-muted list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-foreground">Print & Sign:</strong> Print the document on plain A4 sheet paper and sign manually at the bottom.
              </li>
              {isNoticeDoc ? (
                <>
                  <li>
                    <strong className="text-foreground">Send via Registered Post:</strong> Mail the signed copy to the opposing party (landlord/retailer/brand head office) via <strong className="text-foreground">Registered Post AD</strong> or Speed Post. Keep the postal tracking receipt safely.
                  </li>
                  <li>
                    <strong className="text-foreground">Wait for response:</strong> Give them exactly 15 days from delivery to refund/replace. If they ignore, file your petition in the Rent Authority or Consumer Forum (e-Daakhil).
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong className="text-foreground">Attach Filing Fee:</strong> Purchase a <strong className="text-foreground">Rs. 10 Indian Postal Order (IPO)</strong> from any post office. Write the serial number on the form (currently entered as <code className="bg-stone-border/40 px-1 font-mono text-foreground font-semibold">{paymentRef || "IPO No."}</code>).
                  </li>
                  <li>
                    <strong className="text-foreground">Mail via Post:</strong> Send the signed document and IPO to the Public Information Officer (PIO) of the concerned department via Speed Post or Registered Post.
                  </li>
                  <li>
                    <strong className="text-foreground">Statutory Timeline:</strong> Under the law, the PIO must reply within <strong className="text-foreground">30 days</strong>. If they fail, you are entitled to file a First Appeal.
                  </li>
                </>
              )}
            </ol>
          </CardContent>
        </Card>

        {/* Additional State Disclaimer Warning */}
        <div className="p-4 border border-stone-border/60 bg-paper/60 rounded-md text-xs text-slate-muted flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-slate-muted flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-navy block font-semibold">Important State Filing Info</strong>
            <p className="leading-relaxed">
              Ensure you comply with your state&apos;s specific legal notice rules or RTI fee rules. Some states require stamps, others accept demand drafts, and some support online submissions. Check the official state portals for confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
