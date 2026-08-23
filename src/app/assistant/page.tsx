"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2, ChevronRight, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function AssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Hello! I am HAQ, your Civic & Legal Assistant. To get started, please briefly describe the issue you are facing. (e.g., 'My scholarship hasn't arrived.')"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [caseState, setCaseState] = useState<CaseState | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
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
      
      if (res.ok) {
        setCaseState(data.caseState);
        setMessages(prev => [...prev, data.message]);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isReady = caseState?.status === "ready";

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto min-h-[calc(100dvh-4rem)] bg-background">
      {/* Left Panel: The Interviewer (Chat) */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-stone-border">
        {/* Header */}
        <div className="p-4 border-b border-stone-border flex items-center gap-4 bg-navy-light/10">
          <Button variant="outline" size="icon" onClick={() => router.push("/")} className="h-8 w-8 rounded-full border-stone-border text-slate-muted">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-navy uppercase tracking-wider">HAQ AI Interviewer</h1>
            <p className="text-[10px] text-slate-muted">Gathering Context for Resolution</p>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-paper/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-navy text-white rounded-br-sm" 
                  : "bg-white border border-stone-border text-foreground shadow-xs rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-muted" />
                <span className="text-xs text-slate-muted">Analyzing case...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white border-t border-stone-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading || isReady}
              className="flex-1 h-12 bg-paper border-stone-border focus-visible:ring-navy rounded-full px-5"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || isReady}
              className="h-12 w-12 rounded-full bg-navy hover:bg-navy-hover text-white flex-shrink-0"
            >
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel: Command Center Dashboard */}
      <div className="w-full md:w-1/2 flex flex-col bg-paper p-6 overflow-y-auto">
        <div className="space-y-8">
          
          {/* Case Understanding Card */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Case Understanding</h2>
            <div className="border border-stone-border bg-white rounded-xl p-5 shadow-xs space-y-5">
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-slate-muted uppercase tracking-wider font-semibold">Category</p>
                  <p className="text-sm font-medium text-foreground">{caseState?.category || "Analyzing..."}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-muted uppercase tracking-wider font-semibold">Status</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isReady ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                    )}
                    <span className="text-sm font-medium">{isReady ? "Ready for Action" : "Gathering Context"}</span>
                  </div>
                </div>
              </div>

              {/* Readiness Score Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-muted">Case Readiness</span>
                  <span className={isReady ? "text-green-600 font-bold" : "text-navy"}>{caseState?.readinessScore || 0}%</span>
                </div>
                <div className="h-2 w-full bg-stone-border/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${isReady ? 'bg-green-600' : 'bg-navy'}`} 
                    style={{ width: \`\${caseState?.readinessScore || 0}%\` }}
                  />
                </div>
                <p className="text-[10px] text-slate-muted italic pt-1">
                  *Disclaimer: This score indicates information completeness, not a probability of legal success.
                </p>
              </div>

            </div>
          </div>

          {/* Resolution Plan Timeline */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Resolution Plan</h2>
            <div className="border border-stone-border bg-white rounded-xl p-5 shadow-xs">
              <div className="relative border-l-2 border-stone-border/60 ml-3 space-y-6 pb-2">
                
                <div className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${caseState ? 'bg-green-500 border-green-500' : 'bg-white border-stone-border'}`} />
                  <p className="text-sm font-semibold text-foreground">Understand Problem</p>
                  <p className="text-xs text-slate-muted">Extracting intent and required legal facts.</p>
                </div>

                <div className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${isReady ? 'bg-green-500 border-green-500' : (caseState ? 'bg-amber-400 border-amber-400 animate-pulse' : 'bg-white border-stone-border')}`} />
                  <p className="text-sm font-semibold text-foreground">Gather Evidence & Authority</p>
                  <p className="text-xs text-slate-muted">Identifying the correct jurisdiction and rules.</p>
                </div>

                <div className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${isReady ? 'bg-navy border-navy' : 'bg-white border-stone-border'}`} />
                  <p className="text-sm font-semibold text-foreground">Generate Grievance/RTI</p>
                  <p className="text-xs text-slate-muted">Drafting formal legal representation.</p>
                </div>

              </div>
            </div>
          </div>

          {/* Rights Navigator */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Rights Navigator
            </h2>
            <div className="border border-stone-border bg-blue-50/30 rounded-xl p-4 text-sm text-foreground space-y-2">
              <p className="font-semibold text-navy">Post-Matric Scholarship Rules</p>
              <p className="text-xs text-slate-muted leading-relaxed">
                As per the Ministry of Social Justice guidelines, applications must be verified within a stipulated timeframe. Delays over 60 days can be queried via the RTI Act, 2005 to the District Welfare Officer.
              </p>
              <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-navy hover:underline inline-flex items-center gap-1 pt-1">
                Source: National Scholarship Portal <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Case Kit CTA */}
          <div className="pt-4">
            <Button 
              className={`w-full h-14 text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all ${
                isReady 
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer translate-y-0 opacity-100' 
                  : 'bg-stone-border text-slate-muted cursor-not-allowed translate-y-2 opacity-50'
              }`}
              disabled={!isReady}
            >
              <FileText className="h-5 w-5" />
              {isReady ? "Generate Grievance Draft" : "Gathering Data..."}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
