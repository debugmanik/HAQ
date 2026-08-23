"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2, ChevronRight, FileText, ArrowLeft, Loader2, Info, ArrowRightCircle, XCircle, HelpCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EliteCaseState } from "@/lib/ai/types";

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
      content: "Hello! I am HAQ, your Civic & Legal Assistant. To get started, please briefly describe the issue you are facing. (e.g., 'My scholarship hasn't arrived.' or 'My landlord won't return my deposit.')"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [caseState, setCaseState] = useState<CaseState | null>(null);
  const [eliteState, setEliteState] = useState<EliteCaseState | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

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
        if (data.eliteState) {
          setEliteState(data.eliteState);
        }
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
  
  const lastAssistantIndex = messages.findLastIndex(m => m.role === "assistant");
  const splitIndex = lastAssistantIndex >= 0 ? lastAssistantIndex : 0;
  const pastMessages = messages.slice(0, splitIndex);
  const currentMessages = messages.slice(splitIndex);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto h-[calc(100dvh-4rem)] bg-background overflow-hidden">
      {/* Left Panel: The Interviewer (Chat) */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-stone-border">
        {/* Header */}
        <div className="p-4 border-b border-stone-border flex items-center gap-4 bg-navy-light/10">
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="h-8 w-8 p-0 rounded-full border-stone-border text-slate-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-navy uppercase tracking-wider">HAQ AI Interviewer</h1>
            <p className="text-[10px] text-slate-muted">Gathering Context for Resolution</p>
          </div>
        </div>

        {/* Chat Feed / Interview Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col relative">
          
          {/* History Toggle */}
          {pastMessages.length > 0 && (
            <div className="flex justify-center mb-6 pt-2 shrink-0">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-slate-500 hover:text-navy font-medium bg-white border border-stone-border px-4 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-2"
              >
                <History className="h-3.5 w-3.5" />
                {showHistory ? "Hide Previous Context" : `View Previous Context (${pastMessages.length})`}
              </button>
            </div>
          )}

          {/* Past Messages Container */}
          {showHistory && pastMessages.length > 0 && (
            <div className="space-y-4 mb-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
              {pastMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-navy/80 text-white rounded-br-sm" 
                      : "bg-white/80 border border-stone-border/60 text-slate-700 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-stone-border/60 flex-1" />
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Current Question</span>
                <div className="h-px bg-stone-border/60 flex-1" />
              </div>
            </div>
          )}

          {/* Spacer to push current question down if history is hidden, making it feel like a focused card */}
          {!showHistory && <div className="flex-1 min-h-0" />}

          {/* Current Question */}
          <div className="space-y-6 shrink-0">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-navy text-white rounded-br-sm" 
                    : "bg-white border border-navy/10 text-foreground shadow-md rounded-bl-sm ring-1 ring-navy/5"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white border border-stone-border rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-navy" />
                  <span className="text-sm font-medium text-slate-600">Analyzing case...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white border-t border-stone-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 h-12 bg-paper border-stone-border focus-visible:ring-navy rounded-full px-5"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
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
                  <p className="text-sm font-medium text-foreground">
                    {eliteState?.category 
                      ? (eliteState.subCategory ? `${eliteState.category} / ${eliteState.subCategory}` : eliteState.category) 
                      : (caseState?.category === "GENERAL" ? "General Inquiry" : "Analyzing...")}
                  </p>
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

              {eliteState?.summary && (
                <div className="bg-slate-50 p-3 rounded-lg border border-stone-border">
                  <p className="text-sm text-foreground">{eliteState.summary}</p>
                </div>
              )}

              {/* Known Facts and Missing Info */}
              {(eliteState && Object.keys(eliteState.facts).length > 0) && (
                <div className="space-y-2 pt-2 border-t border-stone-border">
                  <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Known Facts</p>
                  <ul className="space-y-1">
                    {Object.entries(eliteState.facts).map(([key, val]: [string, any]) => (
                      <li key={key} className="text-sm flex items-start gap-2">
                        {val.status === 'no' ? (
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : val.status === 'unknown' ? (
                          <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="capitalize text-slate-700">
                          {key.replace(/_/g, ' ')}: 
                          <span className="font-medium text-foreground ml-1">
                            {val.status === 'no' ? 'No' : 
                             val.status === 'unknown' ? 'Unknown' : 
                             val.status === 'yes' ? 'Yes' : 
                             String(val.value)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(eliteState && eliteState.missingInformation.length > 0) && (
                <div className="space-y-2 pt-2 border-t border-stone-border">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Still Needed</p>
                  <ul className="space-y-1">
                    {eliteState.missingInformation.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <div className="h-4 w-4 rounded-full border border-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 capitalize">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Readiness Score Progress */}
              <div className="space-y-1.5 pt-2 border-t border-stone-border">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-muted">Evidence Readiness</span>
                  <span className={isReady ? "text-green-600 font-bold" : "text-navy"}>{caseState?.readinessScore || 0}%</span>
                </div>
                <div className="h-2 w-full bg-stone-border/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${isReady ? 'bg-green-600' : 'bg-navy'}`} 
                    style={{ width: `${caseState?.readinessScore || 0}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Resolution Plan Timeline */}
          {eliteState?.roadmap && eliteState.roadmap.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Resolution Plan</h2>
              <div className="border border-stone-border bg-white rounded-xl p-5 shadow-xs">
                <div className="relative border-l-2 border-stone-border/60 ml-3 space-y-6 pb-2">
                  
                  {eliteState.roadmap.map((step) => (
                    <div key={step.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${
                        step.status === 'completed' ? 'bg-green-500 border-green-500' : 
                        step.status === 'current' ? 'bg-amber-400 border-amber-400 animate-pulse' : 
                        'bg-white border-stone-border'
                      }`} />
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-slate-muted">{step.description}</p>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          )}

          {/* Rights Navigator */}
          {eliteState?.rights && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> Rights Navigator
              </h2>
              <div className="border border-stone-border bg-blue-50/30 rounded-xl p-4 text-sm text-foreground space-y-4">
                <div>
                  <p className="font-semibold text-navy">{eliteState.rights.title}</p>
                  <p className="text-xs text-slate-muted leading-relaxed mt-1">
                    {eliteState.rights.description}
                  </p>
                </div>
                
                {eliteState.rights.actions && eliteState.rights.actions.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-navy uppercase mb-1">What you can do</p>
                    <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc">
                      {eliteState.rights.actions.map((act, i) => <li key={i}>{act}</li>)}
                    </ul>
                  </div>
                )}

                {eliteState.rights.evidence && eliteState.rights.evidence.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-navy uppercase mb-1">Evidence to preserve</p>
                    <div className="flex flex-wrap gap-2">
                      {eliteState.rights.evidence.map((ev, i) => (
                        <span key={i} className="text-[10px] bg-white border border-stone-border px-2 py-0.5 rounded-full text-slate-600">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {eliteState.rights.source && (
                  <a href={eliteState.rights.source.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-navy hover:underline inline-flex items-center gap-1 pt-1">
                    Source: {eliteState.rights.source.name} <ChevronRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Next Best Action CTA */}
          {eliteState?.nextAction && (
            <div className="space-y-3 pt-4">
              <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Next Best Action</h2>
              <div className="border border-stone-border bg-white rounded-xl p-5 shadow-xs text-center space-y-4">
                <p className="text-sm font-medium text-foreground">{eliteState.nextAction.title}</p>
                <Button 
                  className="w-full h-12 text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all bg-navy hover:bg-navy-hover text-white"
                  onClick={() => {
                    if (eliteState.nextAction?.url) {
                      window.open(eliteState.nextAction.url, "_blank");
                    }
                  }}
                >
                  {eliteState.nextAction.type === 'generate_document' ? <FileText className="h-4 w-4" /> : <ArrowRightCircle className="h-4 w-4" />}
                  {eliteState.nextAction.type === 'generate_document' ? "Generate Document" : 
                   eliteState.nextAction.type === 'open_portal' ? "Open Official Portal" : 
                   "Take Action"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
