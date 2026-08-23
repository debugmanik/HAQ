"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2, ChevronRight, FileText, ArrowLeft, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type CaseState = {
  id: string;
  category: string | null;
  readinessScore: number;
  status: string;
  extractedData: Record<string, any>;
};

type SchemaDetails = {
  categoryLabel: string;
  rightsNavigator: {
    title: string;
    description: string;
    sourceName: string;
    sourceUrl: string;
  };
};

export default function AssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I am HAQ, your Civic & Legal Assistant. To get started, please briefly describe the issue you are facing. (e.g., 'My scholarship hasn't arrived.' or 'My landlord won't return my deposit of Rs. 50,000.')"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [caseState, setCaseState] = useState<CaseState | null>(null);
  const [schemaDetails, setSchemaDetails] = useState<SchemaDetails | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const QUICK_PROMPTS = [
    "My landlord has not returned my security deposit of Rs 50,000.",
    "My post-matric scholarship application is delayed for 4 months.",
    "Unauthorized UPI transaction of Rs 35,000 debited from my bank.",
    "Defective mobile phone delivered from online store and refund refused."
  ];

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          caseId: caseState?.id
        })
      });

      const data = await res.json();
      
      if (data.caseState) {
        setCaseState(data.caseState);
        try {
          localStorage.setItem("haq_active_case_id", data.caseState.id);
        } catch {}
      }

      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      } else {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "I have recorded your grievance. Could you please specify your city/state and any reference numbers?"
        }]);
      }

      if (data.schemaDetails) {
        setSchemaDetails(data.schemaDetails);
      }
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I have noted down your grievance details. Please provide your city or state to help me locate the correct public authority."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCase = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Hello! I am HAQ, your Civic & Legal Assistant. To get started, please briefly describe the issue you are facing."
      }
    ]);
    setCaseState(null);
    setSchemaDetails(null);
    setInput("");
    try {
      localStorage.removeItem("haq_active_case_id");
    } catch {}
  };

  const isReady = caseState?.status === "ready" || (caseState?.readinessScore || 0) >= 80;

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto min-h-[calc(100dvh-5rem)] border border-stone-border bg-paper rounded-lg overflow-hidden my-4 shadow-xs">
      {/* Left Panel: The Interviewer (Chat) */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-stone-border bg-paper">
        {/* Header */}
        <div className="p-4 border-b border-stone-border flex items-center justify-between bg-stone-border/20">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/")} 
              className="h-8 w-8 p-0 rounded-full border-stone-border text-slate-muted flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                HAQ AI Legal Assistant
              </h1>
              <p className="text-[10px] text-slate-muted">Interactive Case & Evidence Assessment</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetCase}
            className="h-7 text-[11px] text-slate-muted hover:text-navy flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> New Case
          </Button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-paper/60 min-h-[380px] max-h-[500px] lg:max-h-[calc(100dvh-14rem)]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-navy text-paper rounded-br-xs" 
                  : "bg-paper border border-stone-border text-foreground shadow-xs rounded-bl-xs"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-paper border border-stone-border rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-2 shadow-xs">
                <Loader2 className="h-4 w-4 animate-spin text-navy" />
                <span className="text-xs text-slate-muted">Analyzing case with Gemini AI...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-stone-border/10 border-t border-stone-border/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-navy tracking-wider block">Quick test prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-paper border border-stone-border text-slate-muted hover:text-navy hover:bg-stone-border/30 transition-colors text-left cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Box */}
        <div className="p-3 bg-paper border-t border-stone-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your dispute, dates, amounts, or reply to question..."
              disabled={isLoading}
              className="flex-1 h-10 bg-paper border-stone-border focus-visible:ring-navy rounded-md text-xs px-3"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-10 px-4 rounded-md bg-navy hover:bg-navy-hover text-paper flex-shrink-0 cursor-pointer text-xs"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel: Command Center Dashboard */}
      <div className="w-full lg:w-1/2 flex flex-col bg-paper p-6 overflow-y-auto space-y-6">
        {/* Case Understanding Card */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Case Understanding</h2>
          <div className="border border-stone-border bg-paper rounded-lg p-4 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-muted uppercase tracking-wider font-semibold">Matched Category</p>
                <p className="text-sm font-bold text-navy">
                  {schemaDetails?.categoryLabel || (caseState?.category ? caseState.category.replace(/_/g, " ") : "Awaiting Grievance Input")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-muted uppercase tracking-wider font-semibold">Status</p>
                <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                  {isReady ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                  )}
                  <span className="text-xs font-semibold text-navy">
                    {isReady ? "Ready for Action" : "Gathering Facts"}
                  </span>
                </div>
              </div>
            </div>

            {/* Readiness Score Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-muted">Evidentiary Readiness</span>
                <span className={isReady ? "text-emerald-700 font-bold" : "text-navy font-bold"}>
                  {caseState?.readinessScore || 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-stone-border/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isReady ? 'bg-emerald-600' : 'bg-navy'}`} 
                  style={{ width: `${caseState?.readinessScore || 0}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-muted">
                Score measures information completeness for filing official statutory complaints.
              </p>
            </div>
          </div>
        </div>

        {/* Resolution Plan Timeline */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Resolution Roadmap</h2>
          <div className="border border-stone-border bg-paper rounded-lg p-4 shadow-xs">
            <div className="relative border-l-2 border-stone-border/60 ml-3 space-y-4 pb-1 text-xs">
              <div className="relative pl-5">
                <div className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 ${caseState ? 'bg-emerald-600 border-emerald-600' : 'bg-paper border-stone-border'}`} />
                <p className="font-semibold text-navy">1. Fact Intake & Intent Extraction</p>
                <p className="text-[11px] text-slate-muted">Classified under relevant Indian statutory act.</p>
              </div>

              <div className="relative pl-5">
                <div className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 ${isReady ? 'bg-emerald-600 border-emerald-600' : (caseState ? 'bg-amber-400 border-amber-400 animate-pulse' : 'bg-paper border-stone-border')}`} />
                <p className="font-semibold text-navy">2. Evidence & Authority Identification</p>
                <p className="text-[11px] text-slate-muted">Mapping to Public Authority / Grievance Portal.</p>
              </div>

              <div className="relative pl-5">
                <div className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 ${isReady ? 'bg-navy border-navy' : 'bg-paper border-stone-border'}`} />
                <p className="font-semibold text-navy">3. Generate Notice / Section 6(1) RTI</p>
                <p className="text-[11px] text-slate-muted">Formal legal demand notice or statutory filing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rights Navigator */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> Rights Navigator
          </h2>
          <div className="border border-stone-border bg-stone-border/20 rounded-lg p-4 text-xs text-foreground space-y-2">
            <p className="font-bold text-navy">{schemaDetails?.rightsNavigator?.title || "Civic & Statutory Protections"}</p>
            <p className="text-slate-muted leading-relaxed">
              {schemaDetails?.rightsNavigator?.description || "Describe your dispute so we can cite the exact Indian laws, Supreme Court precedents, and time-bound statutory redressal mechanisms."}
            </p>
            {schemaDetails?.rightsNavigator?.sourceName && (
              <a 
                href={schemaDetails.rightsNavigator.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-semibold text-navy hover:underline inline-flex items-center gap-1 pt-1"
              >
                Official Portal: {schemaDetails.rightsNavigator.sourceName} <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Document Studio CTA */}
        <div className="pt-2">
          <Link href="/documents">
            <Button 
              className={`w-full h-11 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isReady 
                  ? 'bg-navy hover:bg-navy-hover text-paper' 
                  : 'bg-stone-border/80 hover:bg-stone-border text-navy'
              }`}
            >
              <FileText className="h-4 w-4" />
              {isReady ? "Open Document Studio to Generate Draft" : "Draft Legal Notice in Document Studio"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
