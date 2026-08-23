"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, RotateCcw, LayoutDashboard, Sparkles } from "lucide-react";
import { useHAQ } from "@/lib/store";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resetSession, intakeText } = useHAQ();
  const { t } = useLanguage();

  const handleReset = () => {
    if (confirm("Are you sure you want to clear your current progress? This will reset all form answers.")) {
      resetSession();
      router.push("/");
    }
  };

  const hasSession = intakeText.length > 0;

  const navLinks = [
    { href: "/", label: t("nav_intake") || "Intake" },
    { 
      href: "/assistant", 
      label: t("nav_assistant") || "AI Assistant", 
      badge: true 
    },
    { href: "/documents", label: t("nav_documents") || "Documents" },
    { href: "/kyr", label: t("nav_kyr") || "Rights (KYR)" },
    { href: "/lawyers", label: t("nav_lawyers") || "Lawyers" },
    { href: "/stories", label: t("nav_stories") || "Stories" },
    { href: "/dashboard", label: t("nav_dashboard") || "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-border bg-background/95 backdrop-blur-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 flex-shrink-0">
            <Scale className="h-5 w-5 text-navy" />
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold tracking-tight text-navy uppercase">{t("appName")}</span>
              <span className="text-[9px] leading-none text-slate-muted font-sans font-medium uppercase tracking-wider">{t("tagline")}</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              if (item.badge) {
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors font-bold ${
                      isActive 
                        ? "bg-navy text-paper" 
                        : "bg-navy-light/10 text-navy hover:bg-navy-light/20"
                    }`}
                  >
                    <span className="relative flex h-1.5 w-1.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                    </span>
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-1.5 py-1 transition-colors ${
                    isActive ? "text-navy font-bold border-b-2 border-navy" : "text-slate-muted hover:text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {hasSession && (
              <Link 
                href="/result" 
                className={pathname === "/result" ? "text-navy font-bold border-b-2 border-navy" : "text-slate-muted hover:text-navy"}
              >
                Case Result
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />

          {hasSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs hidden sm:flex items-center gap-1.5 h-8 px-2 border-stone-border text-slate-muted hover:border-navy hover:text-navy"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}

          <Link href="/dashboard" className="lg:hidden">
            <Button variant="outline" size="sm" className="h-8 px-2 border-stone-border text-navy">
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
