"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KYR_ARTICLES, KYRArticleItem } from "@/lib/kyr-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Clock, Bookmark, BookmarkCheck, Share2, 
  CheckCircle2, Scale, ShieldCheck, FileText, ArrowRight 
} from "lucide-react";

export default function KYRArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [article, setArticle] = useState<KYRArticleItem | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = KYR_ARTICLES.find(a => a.slug === id || a.id === id);
    if (found) {
      setArticle(found);
    }
  }, [id]);

  useEffect(() => {
    if (article) {
      try {
        const saved = JSON.parse(localStorage.getItem("haq_saved_bookmarks") || "[]");
        setIsBookmarked(saved.includes(article.id));
      } catch {}
    }
  }, [article]);

  const handleToggleBookmark = () => {
    if (!article) return;
    try {
      const saved = JSON.parse(localStorage.getItem("haq_saved_bookmarks") || "[]");
      let updated: string[];
      if (saved.includes(article.id)) {
        updated = saved.filter((i: string) => i !== article.id);
        setIsBookmarked(false);
      } else {
        updated = [...saved, article.id];
        setIsBookmarked(true);
      }
      localStorage.setItem("haq_saved_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  if (!article) {
    return (
      <div className="py-12 text-center space-y-4 max-w-lg mx-auto">
        <h2 className="text-base font-bold text-navy">Article Not Found</h2>
        <p className="text-xs text-slate-muted">The requested legal rights article does not exist or has moved.</p>
        <Link href="/kyr">
          <Button variant="outline" size="sm" className="text-xs border-stone-border">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Rights Library
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-stone-border/60 pb-4">
        <Link href="/kyr">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> All Rights Guides
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleBookmark}
            className="h-8 text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1.5 cursor-pointer"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-700" />
                Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                Bookmark
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 text-xs border-stone-border text-slate-muted hover:text-navy flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copiedLink ? "Link Copied!" : "Share"}
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-wider bg-stone-border/30 text-navy border-stone-border/50">
            {article.category.replace("_", " & ").toUpperCase()}
          </Badge>
          <span className="text-xs text-slate-muted flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readTime} read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy leading-tight">
          {article.title}
        </h1>

        <p className="text-sm text-slate-muted leading-relaxed">
          {article.excerpt}
        </p>

        {/* Statutory Citations Tags */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-navy flex items-center gap-1">
            <Scale className="h-3.5 w-3.5" /> Statutory References:
          </span>
          {article.citations.map((cit, idx) => (
            <span key={idx} className="text-xs px-2.5 py-1 bg-stone-border/20 text-navy rounded-sm border border-stone-border font-mono font-medium">
              {cit}
            </span>
          ))}
        </div>
      </div>

      {/* Key Takeaways Callout Card */}
      <Card className="border-navy/20 bg-stone-border/20 shadow-none">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" /> Key Legal Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-foreground">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Main Article Content */}
      <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4 text-xs sm:text-sm">
        <div className="whitespace-pre-line">
          {article.content}
        </div>
      </div>

      {/* Practical Action Checklist */}
      <Card className="border-stone-border bg-paper shadow-none">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-navy flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-navy" /> What You Should Do (Action Checklist):
          </h3>
          <div className="space-y-2.5">
            {article.actionSteps.map((step, idx) => (
              <div key={idx} className="p-3 bg-stone-border/15 border border-stone-border/40 rounded-md text-xs flex items-start gap-2.5">
                <span className="w-5 h-5 bg-navy text-paper rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-foreground leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA to Document Studio */}
      <div className="p-6 border border-stone-border bg-paper rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-navy">Need to Draft a Formal Notice or RTI?</h4>
          <p className="text-xs text-slate-muted">Generate a print-ready legal document customized to your issue.</p>
        </div>
        <Link href="/documents">
          <Button className="bg-navy text-paper hover:bg-navy-hover text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer">
            <FileText className="h-3.5 w-3.5" /> Open Document Studio <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
