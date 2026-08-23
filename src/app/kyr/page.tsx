"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { KYR_ARTICLES, KYR_CATEGORIES, KYRArticleItem } from "@/lib/kyr-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, Search, Clock, Tag, ArrowRight, Bookmark, 
  BookmarkCheck, Scale, CheckCircle2, ShieldAlert
} from "lucide-react";

export default function KYRIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load bookmarks from local storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("haq_saved_bookmarks") || "[]");
      setBookmarkedIds(saved);
    } catch {}
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(item => item !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem("haq_saved_bookmarks", JSON.stringify(updated));
    } catch {}
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return KYR_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(t => t.toLowerCase().includes(query)) ||
        article.citations.some(c => c.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Hero / Header */}
      <div className="space-y-3 border-b border-stone-border/60 pb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-navy" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
            Know Your Rights (KYR)
          </h1>
        </div>
        <p className="text-xs text-slate-muted max-w-2xl leading-relaxed">
          Comprehensive, plain-language guides to Indian civil, criminal, consumer, and administrative laws. Understand your legal protections, relevant acts, and practical action checklists.
        </p>

        {/* Search Bar */}
        <div className="relative pt-2 max-w-xl">
          <Search className="absolute left-3.5 top-5 h-4 w-4 text-slate-muted" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rights by keyword (e.g. 'FIR', 'arrest', 'deposit', 'posh', 'cyber', 'salary')..."
            className="pl-10 h-10 text-xs border-stone-border bg-paper"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {KYR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                isSelected
                  ? "bg-navy text-paper border-navy shadow-xs"
                  : "bg-paper text-slate-muted border-stone-border hover:text-navy hover:bg-stone-border/20"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <Link key={article.id} href={`/kyr/${article.slug}`}>
                <Card className="h-full border-stone-border bg-paper hover:border-navy transition-all duration-150 group shadow-none cursor-pointer flex flex-col justify-between">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono tracking-wider bg-stone-border/30 text-navy border-stone-border/50">
                        {article.category.replace("_", " & ").toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                        <button
                          onClick={(e) => toggleBookmark(article.id, e)}
                          title={isBookmarked ? "Remove Bookmark" : "Save Article"}
                          className="text-slate-muted hover:text-navy cursor-pointer"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-navy group-hover:underline leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-muted leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Citations Preview */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      {article.citations.slice(0, 2).map((cit, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-stone-border/20 text-slate-muted rounded-sm border border-stone-border/40">
                          {cit}
                        </span>
                      ))}
                    </div>
                  </CardContent>

                  <div className="px-5 py-3 border-t border-stone-border/40 flex items-center justify-between text-xs text-slate-muted group-hover:text-navy font-semibold">
                    <span>Read Full Guide & Checklist</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-2 py-12 text-center border border-dashed border-stone-border rounded-md space-y-2">
            <ShieldAlert className="h-8 w-8 text-slate-muted mx-auto" />
            <h3 className="text-sm font-bold text-navy">No articles match your search</h3>
            <p className="text-xs text-slate-muted">Try different keywords or select "All Topics".</p>
          </div>
        )}
      </div>
    </div>
  );
}
