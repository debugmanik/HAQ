"use client";

import { useState, useEffect } from "react";
import { CASE_STORIES, CaseStoryItem } from "@/lib/story-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  BookMarked, ThumbsUp, PlusCircle, CheckCircle2, 
  MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Filter 
} from "lucide-react";

export default function CaseStoriesPage() {
  const [stories, setStories] = useState<CaseStoryItem[]>(CASE_STORIES);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likedStoryIds, setLikedStoryIds] = useState<Record<string, boolean>>({});

  // Share form states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"consumer" | "tenancy" | "rti_impact" | "workplace" | "police">("consumer");
  const [newSummary, setNewSummary] = useState("");
  const [newFullStory, setNewFullStory] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newState, setNewState] = useState("Delhi");
  const [newAuthor, setNewAuthor] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleLike = (storyId: string) => {
    if (likedStoryIds[storyId]) return;
    setLikedStoryIds(prev => ({ ...prev, [storyId]: true }));
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: s.likes + 1 } : s));
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim() || !newFullStory.trim() || !newOutcome.trim()) return;

    const newStoryItem: CaseStoryItem = {
      id: `story-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim(),
      fullStory: newFullStory.trim(),
      resolutionRoute: [
        { step: 1, title: "Gathered Evidence & Notice", description: "Documented facts and drafted formal notice via HAQ.", duration: "Week 1" },
        { step: 2, title: "Official Escalation", description: "Lodged complaint on statutory portal.", duration: "Week 2" },
        { step: 3, title: "Resolution", description: newOutcome.trim(), duration: "Week 3" }
      ],
      outcome: newOutcome.trim(),
      takeaways: ["Persistence and written documentation are key to resolving citizen grievances."],
      state: newState,
      authorName: newAuthor.trim() || "Anonymous Citizen",
      likes: 1,
      publishedAt: new Date().toISOString().split("T")[0]
    };

    setStories([newStoryItem, ...stories]);
    setFormSuccess(true);
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
    setFormSuccess(false);
    setNewTitle("");
    setNewSummary("");
    setNewFullStory("");
    setNewOutcome("");
  };

  const filteredStories = selectedCategory === "all" 
    ? stories 
    : stories.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-navy" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
              Citizen Case Stories & Precedents
            </h1>
          </div>
          <p className="text-xs text-slate-muted max-w-2xl leading-relaxed">
            Real stories of how everyday Indian citizens navigated administrative delays, recovered security deposits, filed RTI queries, and asserted consumer rights.
          </p>
        </div>

        <Button
          onClick={() => setIsShareModalOpen(true)}
          className="bg-navy text-paper hover:bg-navy-hover text-xs font-semibold h-9 px-4 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Share Your Story
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Stories" },
          { id: "tenancy", label: "Tenancy & Deposits" },
          { id: "consumer", label: "Consumer Disputes" },
          { id: "rti_impact", label: "RTI Resolutions" },
          { id: "police", label: "Cyber & Police Remedies" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-navy text-paper border-navy shadow-xs"
                : "bg-paper text-slate-muted border-stone-border hover:text-navy hover:bg-stone-border/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stories Feed */}
      <div className="space-y-6">
        {filteredStories.map((story) => (
          <Card key={story.id} className="border-stone-border bg-paper shadow-none">
            <CardHeader className="p-5 pb-3 border-b border-stone-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider bg-stone-border/30 text-navy border-stone-border/50">
                  {story.category.replace("_", " ").toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-muted flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {story.state} • By {story.authorName}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-navy leading-snug">
                {story.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <p className="text-foreground leading-relaxed">
                {story.fullStory}
              </p>

              {/* Resolution Journey Timeline */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-navy uppercase text-[10px] tracking-wider block">
                  Resolution Roadmap Followed:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {story.resolutionRoute.map((route) => (
                    <div key={route.step} className="p-2.5 bg-stone-border/20 border border-stone-border/40 rounded-md space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-navy">Step {route.step}</span>
                        <span className="text-slate-muted font-mono">{route.duration}</span>
                      </div>
                      <h4 className="font-semibold text-navy text-[11px]">{route.title}</h4>
                      <p className="text-[10px] text-slate-muted leading-tight">{route.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                <span className="font-semibold">Outcome: {story.outcome}</span>
              </div>

              {/* Key Takeaways & Like CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-border/40">
                <div className="text-[11px] text-slate-muted">
                  <strong>Key Takeaway:</strong> {story.takeaways[0]}
                </div>
                <button
                  onClick={() => handleLike(story.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors cursor-pointer ${
                    likedStoryIds[story.id]
                      ? "bg-navy text-paper border-navy"
                      : "bg-paper text-slate-muted border-stone-border hover:text-navy"
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{story.likes} Helpful</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Share Story Dialog Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-lg bg-paper border border-stone-border p-6 rounded-lg text-foreground">
          {!formSuccess ? (
            <>
              <DialogHeader className="space-y-1 text-left pb-3 border-b border-stone-border/60">
                <DialogTitle className="text-base font-bold text-navy">
                  Share Your Legal Resolution Story
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-muted">
                  Inspire fellow citizens with how you asserted your legal rights or resolved an official grievance.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleShareSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-navy">Headline / Title *</label>
                  <Input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. How I recovered my delayed security deposit in 10 days"
                    className="h-8 text-xs border-stone-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full h-8 px-2 rounded-md border border-stone-border bg-paper text-xs text-foreground"
                    >
                      <option value="tenancy">Tenancy & Deposits</option>
                      <option value="consumer">Consumer Protection</option>
                      <option value="rti_impact">RTI Impact</option>
                      <option value="police">Cyber / Police Remedy</option>
                      <option value="workplace">Workplace Grievance</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-navy">State / UT *</label>
                    <Input
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="h-8 text-xs border-stone-border"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy">Brief Summary (1 sentence) *</label>
                  <Input
                    required
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="e.g. Used formal notice to get full refund from landlord"
                    className="h-8 text-xs border-stone-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy">Full Story & Steps Taken *</label>
                  <Textarea
                    required
                    value={newFullStory}
                    onChange={(e) => setNewFullStory(e.target.value)}
                    placeholder="Describe what happened, what notices you drafted, and how the opposite party resolved it..."
                    className="min-h-[100px] text-xs border-stone-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-navy">Final Outcome / Result *</label>
                  <Input
                    required
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="e.g. Received full refund of ₹50,000 without litigation"
                    className="h-8 text-xs border-stone-border"
                  />
                </div>

                <DialogFooter className="pt-2 flex flex-row gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleCloseModal} className="text-xs h-8 px-3 border-stone-border">
                    Cancel
                  </Button>
                  <Button type="submit" className="text-xs h-8 px-4 bg-navy text-paper hover:bg-navy-hover">
                    Publish Story
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-700 mx-auto" />
              <h3 className="text-base font-bold text-navy">Story Published Successfully!</h3>
              <p className="text-xs text-slate-muted">Your case story is now live and helping other Indian citizens.</p>
              <Button onClick={handleCloseModal} className="bg-navy text-paper text-xs h-8 px-4 mt-2">
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
