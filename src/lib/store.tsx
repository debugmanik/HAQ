"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface InterviewQuestion {
  id: string;
  label: string;
  type: "text" | "select" | "textarea" | "date";
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface RouteStep {
  stepNumber: number;
  title: string;
  description: string;
  timeframe: string;
  authority: string;
}

export interface IssueCategory {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  questions: InterviewQuestion[];
  route: RouteStep[];
  rtiTemplate: string;
  type?: "rti" | "notice";
  plainExplanation?: string;
  documents?: string[];
}

interface HAQContextType {
  categories: IssueCategory[];
  intakeText: string;
  category: IssueCategory | null;
  answers: Record<string, string>;
  fullName: string;
  fullAddress: string;
  paymentMethod: string;
  paymentRef: string;
  setIntakeText: (text: string) => void;
  setCategoryId: (id: string) => void;
  setCustomCategory: (cat: IssueCategory) => void;
  setAnswer: (key: string, value: string) => void;
  setPersonalInfo: (name: string, address: string, paymentMethod?: string, paymentRef?: string) => void;
  resetSession: () => void;
  isInitialized: boolean;
}

const HAQContext = createContext<HAQContextType | undefined>(undefined);

function detectCategory(text: string, categories: IssueCategory[]): IssueCategory | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  
  let bestMatch: IssueCategory | null = null;
  let maxScore = 0;

  for (const cat of categories) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = cat;
    }
  }

  return bestMatch || (categories.length > 0 ? categories[0] : null);
}

export function HAQProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [intakeText, setIntakeTextState] = useState("");
  const [category, setCategoryState] = useState<IssueCategory | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Indian Postal Order (IPO)");
  const [paymentRef, setPaymentRef] = useState("56F 987654");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch('/api/categories');
        const cats = await catRes.json();
        setCategories(cats);

        const sessRes = await fetch('/api/session');
        if (sessRes.ok) {
          const session = await sessRes.json();
          if (session.fullName) setFullName(session.fullName);
          if (session.fullAddress) setFullAddress(session.fullAddress);
          if (session.paymentMethod) setPaymentMethod(session.paymentMethod);
          if (session.paymentRef) setPaymentRef(session.paymentRef);
        }
        
        if (cats.length > 0) {
          setCategoryState(cats[0]);
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to load initial data", err);
        setIsInitialized(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, fullAddress, paymentMethod, paymentRef })
    }).catch(err => console.error("Failed to sync session", err));
    
  }, [fullName, fullAddress, paymentMethod, paymentRef, isInitialized]);

  const setIntakeText = (text: string) => {
    setIntakeTextState(text);
    const detected = detectCategory(text, categories);
    if (detected) setCategoryState(detected);
    setAnswers({});
  };

  const setCategoryId = (id: string) => {
    const selected = categories.find((c) => c.id === id);
    if (selected) {
      setCategoryState(selected);
      setAnswers({});
    }
  };

  const setCustomCategory = (customCat: IssueCategory) => {
    setCategoryState(customCat);
    setAnswers({});
  };

  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const setPersonalInfo = (
    name: string,
    address: string,
    method = "Indian Postal Order (IPO)",
    ref = "56F 987654"
  ) => {
    setFullName(name);
    setFullAddress(address);
    setPaymentMethod(method);
    setPaymentRef(ref);
  };

  const resetSession = () => {
    setIntakeTextState("");
    setCategoryState(categories.length > 0 ? categories[0] : null);
    setAnswers({});
    setFullName("");
    setFullAddress("");
    setPaymentMethod("Indian Postal Order (IPO)");
    setPaymentRef("56F 987654");
  };

  return (
    <HAQContext.Provider
      value={{
        categories,
        intakeText,
        category,
        answers,
        fullName,
        fullAddress,
        paymentMethod,
        paymentRef,
        setIntakeText,
        setCategoryId,
        setCustomCategory,
        setAnswer,
        setPersonalInfo,
        resetSession,
        isInitialized
      }}
    >
      {children}
    </HAQContext.Provider>
  );
}

export function useHAQ() {
  const context = useContext(HAQContext);
  if (context === undefined) {
    throw new Error("useHAQ must be used within a HAQProvider");
  }
  return context;
}
