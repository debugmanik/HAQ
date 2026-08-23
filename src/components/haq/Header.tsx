"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, RotateCcw } from "lucide-react";
import { useHAQ } from "@/lib/store";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resetSession, intakeText } = useHAQ();

  const handleReset = () => {
    if (confirm("Are you sure you want to clear your current progress? This will reset all form answers.")) {
      resetSession();
      router.push("/");
    }
  };

  const hasSession = intakeText.length > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-border bg-background/95 backdrop-blur-xs">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90">
            <Scale className="h-5 w-5 text-navy" />
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold tracking-tight text-navy uppercase">HAQ</span>
              <span className="text-[10px] leading-none text-slate-muted font-sans font-medium uppercase tracking-wider">Legal & Civil Help</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/" 
              className={pathname === "/" ? "text-navy" : "text-slate-muted hover:text-navy"}
            >
              Grievance Intake
            </Link>
            <Link 
              href="/help" 
              className={pathname === "/help" ? "text-navy" : "text-slate-muted hover:text-navy"}
            >
              Guided Interview
            </Link>

            <Link 
              href="/assistant" 
              className="flex items-center gap-1 text-xs font-bold text-navy bg-navy-light/10 px-2 py-1 rounded-md hover:bg-navy-light/20 transition-colors"
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-navy opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-navy"></span>
              </span>
              HAQ AI
            </Link>

            {hasSession && (
              <Link 
                href="/result" 
                className={pathname === "/result" ? "text-navy" : "text-slate-muted hover:text-navy"}
              >
                Case Result & RTI
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {hasSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 h-8 px-2 border-stone-border text-slate-muted hover:border-navy hover:text-navy"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Session
            </Button>
          )}
          <span className="hidden sm:inline-block text-xs font-medium text-slate-muted bg-stone-border/30 px-2 py-1 rounded-sm border border-stone-border/40">
            Government of India Act Compliance
          </span>
        </div>
      </div>
    </header>
  );
}
