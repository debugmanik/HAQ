"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { KYR_ARTICLES, KYRArticleItem } from "@/lib/kyr-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Bot, FileText, Calendar, Bookmark, 
  ArrowRight, Trash2, Clock, CheckCircle2, MapPin, IndianRupee, Sparkles, AlertTriangle
} from "lucide-react";

export default function CitizenDashboardPage() {
  const [activeTab, setActiveTab] = useState<"cases" | "drafts" | "bookings" | "bookmarks">("cases");
  
  // Dashboard states
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [savedBookings, setSavedBookings] = useState<any[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<KYRArticleItem[]>([]);
  const [aiCases, setAiCases] = useState<any[]>([]);

  useEffect(() => {
    try {
      // 1. Saved drafts
      const drafts = JSON.parse(localStorage.getItem("haq_saved_drafts") || "[]");
      setSavedDrafts(drafts);

      // 2. Saved bookings
      const bookings = JSON.parse(localStorage.getItem("haq_saved_bookings") || "[]");
      setSavedBookings(bookings);

      // 3. Bookmarks
      const bookmarkIds: string[] = JSON.parse(localStorage.getItem("haq_saved_bookmarks") || "[]");
      const matched = KYR_ARTICLES.filter(a => bookmarkIds.includes(a.id));
      setBookmarkedArticles(matched);

      // 4. Check for active AI assistant case in localStorage
      const activeCaseId = localStorage.getItem("haq_active_case_id");
      if (activeCaseId) {
        setAiCases([{
          id: activeCaseId,
          category: "Administrative / Civic Grievance",
          readinessScore: 75,
          status: "ready",
          updatedAt: new Date().toLocaleDateString("en-IN")
        }]);
      }
    } catch {}
  }, []);

  const handleDeleteDraft = (id: string) => {
    const updated = savedDrafts.filter(d => d.id !== id);
    setSavedDrafts(updated);
    try {
      localStorage.setItem("haq_saved_drafts", JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteBooking = (id: string) => {
    const updated = savedBookings.filter(b => b.id !== id);
    setSavedBookings(updated);
    try {
      localStorage.setItem("haq_saved_bookings", JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarkedArticles.filter(a => a.id !== id);
    setBookmarkedArticles(updated);
    try {
      const bookmarkIds = updated.map(a => a.id);
      localStorage.setItem("haq_saved_bookmarks", JSON.stringify(bookmarkIds));
    } catch {}
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2 border-b border-stone-border/60 pb-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-navy" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
            Citizen Dashboard
          </h1>
        </div>
        <p className="text-xs text-slate-muted max-w-2xl leading-relaxed">
          Your centralized hub for tracking active AI legal inquiries, saved demand notices, advocate consultation bookings, and bookmarked statutory guides.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab("cases")}
          className={`p-4 rounded-md border transition-all cursor-pointer ${
            activeTab === "cases" ? "border-navy bg-stone-border/20 shadow-xs" : "border-stone-border bg-paper hover:bg-stone-border/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted">AI Cases</span>
            <Bot className="h-4 w-4 text-navy" />
          </div>
          <div className="text-2xl font-bold text-navy mt-2">{aiCases.length}</div>
          <span className="text-[10px] text-slate-muted">Active assessments</span>
        </div>

        <div 
          onClick={() => setActiveTab("drafts")}
          className={`p-4 rounded-md border transition-all cursor-pointer ${
            activeTab === "drafts" ? "border-navy bg-stone-border/20 shadow-xs" : "border-stone-border bg-paper hover:bg-stone-border/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted">Saved Drafts</span>
            <FileText className="h-4 w-4 text-navy" />
          </div>
          <div className="text-2xl font-bold text-navy mt-2">{savedDrafts.length}</div>
          <span className="text-[10px] text-slate-muted">Notices & RTI letters</span>
        </div>

        <div 
          onClick={() => setActiveTab("bookings")}
          className={`p-4 rounded-md border transition-all cursor-pointer ${
            activeTab === "bookings" ? "border-navy bg-stone-border/20 shadow-xs" : "border-stone-border bg-paper hover:bg-stone-border/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted">Consultations</span>
            <Calendar className="h-4 w-4 text-navy" />
          </div>
          <div className="text-2xl font-bold text-navy mt-2">{savedBookings.length}</div>
          <span className="text-[10px] text-slate-muted">Advocate bookings</span>
        </div>

        <div 
          onClick={() => setActiveTab("bookmarks")}
          className={`p-4 rounded-md border transition-all cursor-pointer ${
            activeTab === "bookmarks" ? "border-navy bg-stone-border/20 shadow-xs" : "border-stone-border bg-paper hover:bg-stone-border/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted">Bookmarked</span>
            <Bookmark className="h-4 w-4 text-navy" />
          </div>
          <div className="text-2xl font-bold text-navy mt-2">{bookmarkedArticles.length}</div>
          <span className="text-[10px] text-slate-muted">Rights & guides</span>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {/* Tab 1: AI Assistant Cases */}
        {activeTab === "cases" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                AI Legal Assistant Assessments
              </h2>
              <Link href="/assistant">
                <Button size="sm" className="bg-navy text-paper text-xs h-8 px-3 flex items-center gap-1 cursor-pointer">
                  <Bot className="h-3.5 w-3.5" /> Start New Case Assessment
                </Button>
              </Link>
            </div>

            {aiCases.length > 0 ? (
              aiCases.map((c) => (
                <Card key={c.id} className="border-stone-border bg-paper shadow-none">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-mono bg-stone-border/30 text-navy">
                          ACTIVE CASE
                        </Badge>
                        <span className="text-xs font-bold text-navy">{c.category}</span>
                      </div>
                      <p className="text-xs text-slate-muted">
                        Case ID: {c.id} • Last updated {c.updatedAt}
                      </p>
                      <div className="flex items-center gap-2 text-xs pt-1">
                        <span className="text-slate-muted">Evidence Readiness Score:</span>
                        <strong className="text-emerald-700 font-mono">{c.readinessScore}%</strong>
                      </div>
                    </div>

                    <Link href="/assistant">
                      <Button variant="outline" size="sm" className="border-stone-border text-xs text-navy hover:bg-stone-border/20 flex items-center gap-1 cursor-pointer">
                        Resume Assessment <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-stone-border rounded-md bg-paper space-y-3">
                <Bot className="h-8 w-8 text-slate-muted mx-auto" />
                <h3 className="text-xs font-bold text-navy">No Active AI Cases</h3>
                <p className="text-xs text-slate-muted max-w-sm mx-auto">
                  Use the HAQ AI Assistant to analyze your grievance, calculate evidence readiness, and generate an official escalation plan.
                </p>
                <Link href="/assistant">
                  <Button size="sm" className="bg-navy text-paper text-xs h-8 px-4 cursor-pointer">
                    Launch AI Assistant
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Legal Drafts */}
        {activeTab === "drafts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                Saved Legal Notices & RTI Applications
              </h2>
              <Link href="/documents">
                <Button size="sm" className="bg-navy text-paper text-xs h-8 px-3 flex items-center gap-1 cursor-pointer">
                  <FileText className="h-3.5 w-3.5" /> Create New Document
                </Button>
              </Link>
            </div>

            {savedDrafts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDrafts.map((draft) => (
                  <Card key={draft.id} className="border-stone-border bg-paper shadow-none flex flex-col justify-between">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-navy">{draft.title}</h4>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="text-slate-muted hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-slate-muted line-clamp-3 bg-stone-border/10 p-2 rounded border border-stone-border/30">
                        {draft.content}
                      </p>
                      <span className="text-[10px] text-slate-muted block">
                        Saved: {new Date(draft.updatedAt).toLocaleDateString("en-IN")}
                      </span>
                    </CardContent>
                    <div className="px-4 py-2 border-t border-stone-border/40 flex justify-end">
                      <Link href="/documents">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] border-stone-border cursor-pointer">
                          Edit in Studio
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-stone-border rounded-md bg-paper space-y-3">
                <FileText className="h-8 w-8 text-slate-muted mx-auto" />
                <h3 className="text-xs font-bold text-navy">No Saved Document Drafts</h3>
                <p className="text-xs text-slate-muted">
                  Use the Document Studio to draft RTI applications or formal legal demand notices and save them here.
                </p>
                <Link href="/documents">
                  <Button size="sm" className="bg-navy text-paper text-xs h-8 px-4 cursor-pointer">
                    Open Document Studio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Consultation Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                Scheduled Advocate Consultations
              </h2>
              <Link href="/lawyers">
                <Button size="sm" className="bg-navy text-paper text-xs h-8 px-3 flex items-center gap-1 cursor-pointer">
                  <Calendar className="h-3.5 w-3.5" /> Find Advocate
                </Button>
              </Link>
            </div>

            {savedBookings.length > 0 ? (
              <div className="space-y-3">
                {savedBookings.map((b) => (
                  <Card key={b.id} className="border-stone-border bg-paper shadow-none">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            {b.status.toUpperCase()}
                          </Badge>
                          <strong className="text-navy">{b.lawyerName}</strong>
                          <span className="text-slate-muted">({b.lawyerCity})</span>
                        </div>
                        <p className="text-slate-muted flex items-center gap-2">
                          <span>📅 {b.bookingDate}</span>
                          <span>⏰ {b.timeSlot}</span>
                          <span>Ref: {b.id}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="text-slate-muted hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-stone-border rounded-md bg-paper space-y-3">
                <Calendar className="h-8 w-8 text-slate-muted mx-auto" />
                <h3 className="text-xs font-bold text-navy">No Scheduled Consultations</h3>
                <p className="text-xs text-slate-muted">
                  Browse our verified advocate directory and book a 45-minute consultation.
                </p>
                <Link href="/lawyers">
                  <Button size="sm" className="bg-navy text-paper text-xs h-8 px-4 cursor-pointer">
                    Browse Advocate Directory
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Bookmarked Rights */}
        {activeTab === "bookmarks" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">
                Bookmarked Rights & Statutory Guides
              </h2>
              <Link href="/kyr">
                <Button size="sm" className="bg-navy text-paper text-xs h-8 px-3 flex items-center gap-1 cursor-pointer">
                  <Bookmark className="h-3.5 w-3.5" /> Explore All Rights
                </Button>
              </Link>
            </div>

            {bookmarkedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarkedArticles.map((article) => (
                  <Card key={article.id} className="border-stone-border bg-paper shadow-none flex flex-col justify-between">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] bg-stone-border/30 text-navy font-mono">
                          {article.category.toUpperCase()}
                        </Badge>
                        <button
                          onClick={() => handleRemoveBookmark(article.id)}
                          className="text-slate-muted hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-navy">{article.title}</h4>
                      <p className="text-xs text-slate-muted line-clamp-2">{article.excerpt}</p>
                    </CardContent>
                    <div className="px-4 py-2 border-t border-stone-border/40 flex justify-end">
                      <Link href={`/kyr/${article.slug}`}>
                        <Button variant="outline" size="sm" className="h-7 text-[11px] border-stone-border cursor-pointer">
                          Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-stone-border rounded-md bg-paper space-y-3">
                <Bookmark className="h-8 w-8 text-slate-muted mx-auto" />
                <h3 className="text-xs font-bold text-navy">No Bookmarked Articles</h3>
                <p className="text-xs text-slate-muted">
                  Explore the Know Your Rights library and bookmark important guides for quick access.
                </p>
                <Link href="/kyr">
                  <Button size="sm" className="bg-navy text-paper text-xs h-8 px-4 cursor-pointer">
                    Browse Rights Library
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
