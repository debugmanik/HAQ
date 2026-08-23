"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2.5 text-xs font-medium border-stone-border bg-paper text-navy hover:bg-stone-border/20 flex items-center gap-1.5 cursor-pointer rounded-md"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5 text-slate-muted" />
        <span>{currentLangObj.nativeName}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-1.5 w-44 rounded-md border border-stone-border bg-paper shadow-md z-50 py-1 text-xs">
            <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-muted border-b border-stone-border/40">
              Select Language / भाषा
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-stone-border/20 transition-colors cursor-pointer ${
                  language === lang.code ? "text-navy font-bold bg-stone-border/10" : "text-foreground"
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-muted">{lang.name}</span>
                </div>
                {language === lang.code && <Check className="h-3.5 w-3.5 text-navy" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
