"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "kn";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appName: "HAQ",
    tagline: "Legal & Civil Help",
    nav_intake: "Grievance Intake",
    nav_assistant: "AI Legal Assistant",
    nav_documents: "Document Studio",
    nav_kyr: "Know Your Rights",
    nav_lawyers: "Lawyer Directory",
    nav_stories: "Case Stories",
    nav_dashboard: "My Dashboard",
    reset_session: "Reset Session",
    gov_compliance: "Government of India Act Compliance",
    hero_title: "Understand your rights. Take the next step.",
    hero_subtitle: "Describe your civic or legal concern. HAQ turns it into a clear action roadmap, AI legal assessment, verified advocate access, and print-ready official documents.",
    find_next_step: "Find my next step",
    explore_assistant: "Open AI Assistant",
    explore_documents: "Draft Legal Notice / RTI",
    explore_kyr: "Know Your Rights Library",
    explore_lawyers: "Find Verified Lawyers",
    explore_stories: "Read Case Stories",
    footer_disclaimer: "HAQ is an open civic and legal education platform. It provides statutory guidelines, step-by-step resolution routes, and document templates, but does not constitute formal advocate-client representation.",
  },
  hi: {
    appName: "हक (HAQ)",
    tagline: "कानूनी और नागरिक सहायता",
    nav_intake: "शिकायत दर्ज करें",
    nav_assistant: "AI कानूनी सहायक",
    nav_documents: "दस्तावेज़ स्टूडियो",
    nav_kyr: "अपने अधिकार जानें",
    nav_lawyers: "वकील निर्देशिका",
    nav_stories: "सफलता की कहानियां",
    nav_dashboard: "मेरा डैशबोर्ड",
    reset_session: "सत्र रीसेट करें",
    gov_compliance: "भारत सरकार अधिनियम अनुपालन",
    hero_title: "अपने अधिकारों को समझें। अगला कदम उठाएं।",
    hero_subtitle: "अपनी नागरिक या कानूनी समस्या बताएं। HAQ इसे एक स्पष्ट कार्य योजना, AI कानूनी विश्लेषण, सत्यापित वकील और प्रिंट-योग्य औपचारिक दस्तावेजों में बदलता है।",
    find_next_step: "मेरा अगला कदम खोजें",
    explore_assistant: "AI सहायक खोलें",
    explore_documents: "कानूनी नोटिस / RTI तैयार करें",
    explore_kyr: "अधिकार लाइब्रेरी पढ़ें",
    explore_lawyers: "वकील खोजें",
    explore_stories: "कहानियां पढ़ें",
    footer_disclaimer: "HAQ एक नागरिक और कानूनी शिक्षा मंच है। यह सांविधिक दिशानिर्देश, समाधान मार्ग और दस्तावेज़ टेम्पलेट प्रदान करता है, लेकिन औपचारिक वकील-मुवक्किल प्रतिनिधित्व नहीं करता है।",
  },
  bn: {
    appName: "হক (HAQ)",
    tagline: "আইনি ও নাগরিক সাহায্য",
    nav_intake: "অভিযোগ জমা দিন",
    nav_assistant: "AI আইনি সহকারী",
    nav_documents: "নথিপত্র স্টুডিও",
    nav_kyr: "আপনার অধিকার জানুন",
    nav_lawyers: "আইনজীবী নির্দেশিকা",
    nav_stories: "কেস স্টোরি",
    nav_dashboard: "ড্যাশবোর্ড",
    reset_session: "রিসেট সেশন",
    gov_compliance: "ভারত সরকার আইন সম্মতি",
    hero_title: "আপনার অধিকার বুঝুন। পরবর্তী পদক্ষেপ নিন।",
    hero_subtitle: "আপনার নাগরিক বা আইনি সমস্যা লিখুন। HAQ আপনাকে স্পষ্ট অ্যাকশন প্ল্যান ও আইনি নথি তৈরিতে সাহায্য করে।",
    find_next_step: "পরবর্তী পদক্ষেপ খুঁজুন",
    explore_assistant: "AI সহকারী খুলুন",
    explore_documents: "আইনি নোটিশ তৈরি করুন",
    explore_kyr: "অধিকার লাইব্রেরি",
    explore_lawyers: "আইনজীবী খুঁজুন",
    explore_stories: "কেস স্টোরি পড়ুন",
    footer_disclaimer: "HAQ একটি উন্মুক্ত নাগরিক শিক্ষা প্ল্যাটফর্ম। এটি আনুষ্ঠানিক আইনি পরামর্শ প্রদান করে না।",
  },
  ta: {
    appName: "ஹக் (HAQ)",
    tagline: "சட்ட & குடிமை உதவி",
    nav_intake: "புகார் பதிவு",
    nav_assistant: "AI சட்ட உதவியாளர்",
    nav_documents: "ஆவண மையம்",
    nav_kyr: "உங்கள் உரிமைகள்",
    nav_lawyers: "வழக்கறிஞர்கள்",
    nav_stories: "வெற்றிக் கதைகள்",
    nav_dashboard: "முகப்பு பலகை",
    reset_session: "மீட்டமை",
    gov_compliance: "இந்திய அரசு சட்ட இணக்கம்",
    hero_title: "உங்கள் உரிமைகளைப் புரிந்து கொள்ளுங்கள்.",
    hero_subtitle: "உங்கள் குடிமைப் புகாரை எளிய வார்த்தைகளில் விவரிக்கவும். HAQ தெளிவான சட்ட வழிகாட்டுதலை வழங்குகிறது.",
    find_next_step: "அடுத்த கட்ட நடவடிக்கை",
    explore_assistant: "AI உதவியாளர்",
    explore_documents: "சட்ட ஆவணம்",
    explore_kyr: "உரிமைகள் நூலகம்",
    explore_lawyers: "வழக்கறிஞர் தேடல்",
    explore_stories: "கதைகள்",
    footer_disclaimer: "HAQ என்பது குடிமை விழிப்புணர்வு தளமாகும்.",
  },
  te: {
    appName: "హక్ (HAQ)",
    tagline: "చట్టపరమైన & పౌర సహాయం",
    nav_intake: "ఫిర్యాదు నమోదు",
    nav_assistant: "AI లీగల్ అసిస్టెంట్",
    nav_documents: "డాక్యుమెంట్ స్టూడియో",
    nav_kyr: "మీ హక్కులను తెలుసుకోండి",
    nav_lawyers: "న్యాయవాదుల డైరెక్టరీ",
    nav_stories: "కేసు కథలు",
    nav_dashboard: "నా డాష్‌బోర్డ్",
    reset_session: "రీసెట్ సెషన్",
    gov_compliance: "భారత ప్రభుత్వ చట్టాల వర్తింపు",
    hero_title: "మీ హక్కులను అర్థం చేసుకోండి.",
    hero_subtitle: "మీ సమస్యను సులభంగా వివరించండి. HAQ మీకు సరైన చట్టపరమైన పరిష్కారాన్ని అందిస్తుంది.",
    find_next_step: "తదుపరి అడుగు వేయండి",
    explore_assistant: "AI అసిస్టెంట్",
    explore_documents: "నోటీసు డ్రాఫ్ట్",
    explore_kyr: "హక్కుల సమాచారం",
    explore_lawyers: "న్యాయవాదులను వెతకండి",
    explore_stories: "కథలు చదవండి",
    footer_disclaimer: "HAQ అనేది పౌర సమాచార వేదిక.",
  },
  mr: {
    appName: "हक (HAQ)",
    tagline: "कायदेशीर आणि नागरी मदत",
    nav_intake: "तक्रार नोंदवा",
    nav_assistant: "AI कायदेशीर सहाय्यक",
    nav_documents: "दस्तऐवज स्टुडिओ",
    nav_kyr: "आपले हक्क जाणा",
    nav_lawyers: "वकील निर्देशिका",
    nav_stories: "यशोगाथा",
    nav_dashboard: "डॅशबोर्ड",
    reset_session: "सत्र रीसेट करा",
    gov_compliance: "भारत सरकार कायदा पालन",
    hero_title: "आपले हक्क समजून घ्या. पुढचे पाऊल टाका.",
    hero_subtitle: "आपली नागरी किंवा कायदेशीर समस्या मांडा. HAQ आपल्याला योग्य कायदेशीर मार्ग दाखवतो.",
    find_next_step: "पुढचे पाऊल शोधा",
    explore_assistant: "AI सहाय्यक उघडा",
    explore_documents: "कायदेशीर नोटीस बनवा",
    explore_kyr: "हक्क लायब्ररी",
    explore_lawyers: "वकील शोधा",
    explore_stories: "कथा वाचा",
    footer_disclaimer: "HAQ एक नागरी आणि कायदेशीर शिक्षण मंच आहे.",
  },
  kn: {
    appName: "ಹಕ್ (HAQ)",
    tagline: "ಕಾನೂನು ಮತ್ತು ನಾಗರಿಕ ಸಹಾಯ",
    nav_intake: "ದೂರು ದಾಖಲಿಸಿ",
    nav_assistant: "AI ಕಾನೂನು ಸಹಾಯಕ",
    nav_documents: "ದಾಖಲೆ ಸ್ಟುಡಿಯೋ",
    nav_kyr: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
    nav_lawyers: "ವಕೀಲರ ಡೈರೆಕ್ಟರಿ",
    nav_stories: "ಪ್ರಕರಣ ಕಥೆಗಳು",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    reset_session: "ಮರುಹೊಂದಿಸಿ",
    gov_compliance: "ಭಾರತ ಸರ್ಕಾರ ಕಾಯ್ದೆ ಅನುಸರಣೆ",
    hero_title: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    hero_subtitle: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಿ. HAQ ನಿಮಗೆ ಸ್ಪಷ್ಟ ಪರಿಹಾರವನ್ನು ನೀಡುತ್ತದೆ.",
    find_next_step: "ಮುಂದಿನ ಹೆಜ್ಜೆ ಹುಡುಕಿ",
    explore_assistant: "AI ಸಹಾಯಕ",
    explore_documents: "ಕಾನೂನು ನೋಟಿಸ್ ರಚಿಸಿ",
    explore_kyr: "ಹಕ್ಕುಗಳ ಗ್ರಂಥಾಲಯ",
    explore_lawyers: "ವಕೀಲರನ್ನು ಹುಡುಕಿ",
    explore_stories: "ಕಥೆಗಳನ್ನು ಓದಿ",
    footer_disclaimer: "HAQ ನಾಗರಿಕ ಶಿಕ್ಷಣ ವೇದಿಕೆಯಾಗಿದೆ.",
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("haq_selected_lang") as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("haq_selected_lang", lang);
    } catch {}
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
