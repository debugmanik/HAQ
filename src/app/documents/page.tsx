"use client";

import { useState, useEffect } from "react";
import { LEGAL_TEMPLATES, DocumentTemplateItem } from "@/lib/document-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Sparkles, Copy, Check, Download, Printer, 
  RotateCcw, Save, ShieldCheck, HelpCircle, ArrowRight, Loader2, AlertCircle
} from "lucide-react";

export default function DocumentStudioPage() {
  const [activeTab, setActiveTab] = useState<"template" | "ai_enhancer">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplateItem>(LEGAL_TEMPLATES[0]);
  const [formFields, setFormFields] = useState<Record<string, string>>(LEGAL_TEMPLATES[0].defaultFields);
  const [renderedDoc, setRenderedDoc] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Enhancer state
  const [rawGrievance, setRawGrievance] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [aiDocType, setAiDocType] = useState("Consumer Legal Notice");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Format today's date
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Generate document text from template and fields
  const updateRenderedDocument = (template: DocumentTemplateItem, fields: Record<string, string>) => {
    let result = template.templateText;
    
    // Replace current date
    result = result.replace(/\[currentDate\]/g, today);

    // Replace each field
    Object.entries(fields).forEach(([key, val]) => {
      const placeholder = `[${key}]`;
      const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "g");
      result = result.replace(regex, val?.trim() || `[${key.toUpperCase()}]`);
    });

    setRenderedDoc(result);
  };

  useEffect(() => {
    updateRenderedDocument(selectedTemplate, formFields);
  }, [selectedTemplate, formFields]);

  const handleTemplateChange = (tmpl: DocumentTemplateItem) => {
    setSelectedTemplate(tmpl);
    setFormFields(tmpl.defaultFields);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormFields(prev => ({ ...prev, [key]: value }));
  };

  // AI Enhancement Call
  const handleAIEnhance = async () => {
    if (!rawGrievance.trim()) {
      setAiError("Please enter your rough dispute notes or complaint before clicking enhance.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("/api/documents/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: rawGrievance,
          documentType: aiDocType,
          senderName,
          recipientName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to enhance document");

      setRenderedDoc(data.enhancedText);
      setActiveTab("template"); // Switch to editor preview
      setAiLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "AI enhancement failed";
      setAiError(msg);
      setAiLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedDoc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([renderedDoc], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `HAQ_${selectedTemplate.type}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToDashboard = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("haq_saved_drafts") || "[]");
      existing.unshift({
        id: `draft-${Date.now()}`,
        title: selectedTemplate.title,
        type: selectedTemplate.type,
        content: renderedDoc,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem("haq_saved_drafts", JSON.stringify(existing));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {}
  };

  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedTemplate.title}</title>
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
              body { padding: 0; }
              .legal-border { border: none; padding: 0; }
              @page { size: A4; margin: 25mm 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="legal-border">
            <pre>${renderedDoc}</pre>
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-navy" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
              Legal Document Studio
            </h1>
          </div>
          <p className="text-xs text-slate-muted max-w-2xl leading-relaxed">
            Generate standardized RTI applications, formal legal demand notices, or enhance raw dispute notes with AI into print-ready statutory legal drafts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-border/30 p-1 rounded-md border border-stone-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("template")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === "template" ? "bg-paper text-navy shadow-xs" : "text-slate-muted hover:text-navy"
            }`}
          >
            Templates & Editor
          </button>
          <button
            onClick={() => setActiveTab("ai_enhancer")}
            className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === "ai_enhancer" ? "bg-navy text-paper shadow-xs" : "text-slate-muted hover:text-navy"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            AI Document Polisher
          </button>
        </div>
      </div>

      {activeTab === "ai_enhancer" ? (
        /* AI Polisher View */
        <Card className="border-stone-border bg-paper shadow-none">
          <CardHeader className="p-6 pb-4 border-b border-stone-border/40 space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-bold text-navy">
                AI Legal Document Polisher
              </CardTitle>
            </div>
            <p className="text-xs text-slate-muted">
              Paste your rough notes, email threads, or informal complaints. HAQ's AI will transform them into an authoritative legal demand notice with statutory citations and a 15-day compliance notice.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-navy">Document Type</label>
                <select
                  value={aiDocType}
                  onChange={(e) => setAiDocType(e.target.value)}
                  className="w-full h-8 px-2 rounded-md border border-stone-border bg-paper text-xs text-foreground"
                >
                  <option value="Consumer Legal Notice">Consumer Legal Notice</option>
                  <option value="Landlord Deposit Demand Notice">Landlord Deposit Demand Notice</option>
                  <option value="Workplace Salary & FnF Grievance">Workplace Salary & FnF Grievance</option>
                  <option value="Cyber Fraud Bank Representation">Cyber Fraud Bank Representation</option>
                  <option value="Breach of Agreement Notice">Breach of Agreement Notice</option>
                  <option value="Public Grievance Statutory Notice">Public Grievance Statutory Notice</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-navy">Your Name (Sender)</label>
                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="h-8 text-xs border-stone-border"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-navy">Recipient (Opposite Party)</label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. ABC Technologies / Landlord Name"
                  className="h-8 text-xs border-stone-border"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-navy">Paste Raw Grievance / Fact Notes *</label>
              <Textarea
                required
                value={rawGrievance}
                onChange={(e) => {
                  setRawGrievance(e.target.value);
                  setAiError("");
                }}
                placeholder="Example: I worked at XYZ Corp for 2 years as a designer. I resigned in Dec and served 2 months notice. They have not released my last 2 months salary (Rs 1,20,000) and are ignoring my emails..."
                className="min-h-[180px] p-3 text-xs border-stone-border font-sans leading-relaxed"
              />
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={handleAIEnhance}
                disabled={aiLoading}
                className="bg-navy text-paper hover:bg-navy-hover transition-colors text-xs font-semibold px-6 h-10 rounded-md cursor-pointer flex items-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enhancing with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Enhance to Legal Notice
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Template & Field Editor View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Template Selector & Fields */}
          <div className="lg:col-span-5 space-y-6">
            {/* Template Selector Carousel / Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                Select Legal Document Template:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LEGAL_TEMPLATES.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplate.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl)}
                      className={`w-full text-left p-3 rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? "border-navy bg-stone-border/20 shadow-xs"
                          : "border-stone-border bg-paper hover:border-slate-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-navy" : "text-foreground"}`}>
                          {tmpl.title}
                        </span>
                        <Badge variant="secondary" className="text-[10px] bg-stone-border/40 text-slate-muted">
                          {tmpl.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-muted mt-1 line-clamp-1">
                        {tmpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Applicable Law Banner */}
            <div className="p-3 bg-stone-border/20 border border-stone-border/50 rounded-md text-[11px] text-slate-muted flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-navy flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy block">Applicable Indian Legislation:</strong>
                {selectedTemplate.applicableLaw}
              </div>
            </div>

            {/* Form Fields Generator */}
            <Card className="border-stone-border bg-paper shadow-none">
              <CardHeader className="p-4 pb-2 border-b border-stone-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-navy">
                  Fill Document Variables
                </CardTitle>
                <button
                  onClick={() => setFormFields(selectedTemplate.defaultFields)}
                  className="text-[10px] text-slate-muted hover:text-navy flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Fields
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {selectedTemplate.fieldsMeta.map((meta) => (
                  <div key={meta.key} className="space-y-1 text-xs">
                    <label className="font-semibold text-navy flex items-center justify-between">
                      <span>{meta.label} {meta.required && <span className="text-red-600">*</span>}</span>
                    </label>
                    {meta.type === "textarea" ? (
                      <Textarea
                        value={formFields[meta.key] || ""}
                        onChange={(e) => handleFieldChange(meta.key, e.target.value)}
                        placeholder={meta.placeholder}
                        className="text-xs min-h-[60px] border-stone-border"
                      />
                    ) : (
                      <Input
                        type={meta.type}
                        value={formFields[meta.key] || ""}
                        onChange={(e) => handleFieldChange(meta.key, e.target.value)}
                        placeholder={meta.placeholder}
                        className="h-8 text-xs border-stone-border"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Printable Document Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Live Document Preview
              </span>
              
              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveToDashboard}
                  className="h-8 text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  {savedSuccess ? "Saved!" : "Save Draft"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  TXT
                </Button>
                <Button
                  size="sm"
                  onClick={handlePrintPDF}
                  className="h-8 text-xs bg-navy text-paper hover:bg-navy-hover flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print A4 / PDF
                </Button>
              </div>
            </div>

            {/* Editable Georgia Serif Paper Preview */}
            <div className="relative border border-stone-border bg-paper rounded-md p-6 shadow-xs min-h-[580px]">
              <div className="border border-stone-border/40 p-5 min-h-[540px] bg-paper">
                <Textarea
                  value={renderedDoc}
                  onChange={(e) => setRenderedDoc(e.target.value)}
                  className="w-full h-[520px] resize-none border-none p-0 focus-visible:ring-0 text-foreground font-serif leading-relaxed text-xs sm:text-sm bg-transparent"
                />
              </div>
              <div className="text-right mt-2 text-[10px] text-slate-muted">
                Editable text area • Formatted in Indian Legal Standard Georgia-serif
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
