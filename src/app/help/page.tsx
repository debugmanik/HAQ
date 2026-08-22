"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertTriangle, Plus, X, Check } from "lucide-react";
import { useHAQ } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HelpFlowPage() {
  const router = useRouter();
  const {
    categories,
    intakeText,
    category,
    setCategoryId,
    setCustomCategory,
    answers,
    setAnswer,
    fullName,
    fullAddress,
    paymentMethod,
    paymentRef,
    setPersonalInfo,
    isInitialized
  } = useHAQ();

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Custom Category Builder states
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customType, setCustomType] = useState<"rti" | "notice">("rti");
  const [customError, setCustomError] = useState("");
  
  // Local state for personal info
  const [localName, setLocalName] = useState(fullName);
  const [localAddress, setLocalAddress] = useState(fullAddress);
  const [localMethod, setLocalMethod] = useState(paymentMethod);
  const [localRef, setLocalRef] = useState(paymentRef);

  // Sync local state when store is initialized
  useEffect(() => {
    if (isInitialized) {
      setTimeout(() => {
        setLocalName(fullName);
        setLocalAddress(fullAddress);
        setLocalMethod(paymentMethod);
        setLocalRef(paymentRef);
      }, 0);
    }
  }, [fullName, fullAddress, paymentMethod, paymentRef, isInitialized]);

  // Restore step from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("haq_current_step");
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep > 0) {
          setTimeout(() => {
            setCurrentStep(parsedStep);
          }, 0);
        }
      }
    } catch (err) {
      console.error("Failed to restore current step", err);
    }
  }, []);

  // Save step to localStorage when it changes
  const updateStep = (step: number) => {
    setCurrentStep(step);
    try {
      localStorage.setItem("haq_current_step", step.toString());
    } catch (err) {
      console.error("Failed to save step", err);
    }
  };

  // If session is empty and fully initialized, redirect back to /
  useEffect(() => {
    if (isInitialized && !intakeText) {
      router.push("/");
    }
  }, [intakeText, isInitialized, router]);

  if (!isInitialized || !intakeText || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <p className="text-sm text-slate-muted">Loading session details...</p>
      </div>
    );
  }

  // Total steps: 1 (Category Confirmation) + number of questions + 1 (Personal Filing info)
  const totalQuestions = category.questions.length;
  const totalSteps = 1 + totalQuestions + 1;

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};

    // If on a question step
    if (currentStep > 1 && currentStep <= totalQuestions + 1) {
      const q = category.questions[currentStep - 2];
      if (q.required && !answers[q.id]?.trim()) {
        errors[q.id] = `${q.label} is required.`;
      }
    }

    // If on the personal info step
    if (currentStep === totalSteps) {
      if (!localName.trim()) {
        errors.fullName = "Full Name of applicant is required.";
      }
      if (!localAddress.trim()) {
        errors.fullAddress = "Complete contact address is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        updateStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        // Save personal info to store and route to result
        setPersonalInfo(localName, localAddress, localMethod, localRef);
        // Clear saved step on complete
        try {
          localStorage.removeItem("haq_current_step");
        } catch {}
        router.push("/result");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      router.push("/");
    }
  };

  const handleApplyCustomCategory = () => {
    if (!customTitle.trim()) {
      setCustomError("Category Title is required.");
      return;
    }
    if (!customDesc.trim()) {
      setCustomError("Category Description is required.");
      return;
    }
    setCustomError("");

    const newCustomCategory = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      description: customDesc.trim(),
      keywords: [],
      type: customType,
      questions: [
        {
          id: "state",
          label: "Your State/Union Territory",
          type: "select" as const,
          options: [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
            "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
            "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
            "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry"
          ],
          required: true
        },
        {
          id: "district",
          label: "District/City",
          type: "text" as const,
          placeholder: "e.g., Patna, Indore, Raipur",
          required: true
        },
        {
          id: "customGrievance",
          label: `Specific details about your ${customTitle}`,
          type: "textarea" as const,
          placeholder: "Describe the specific events, dates, and what information/action you are seeking...",
          required: true
        },
        {
          id: "desiredOutcome",
          label: "Your Desired Resolution / Outcome",
          type: "select" as const,
          options: [
            "Release of pending service or file clearance",
            "Formal response regarding reason for delay",
            "Action against officer or refund of costs"
          ],
          required: true
        }
      ],
      route: [
        {
          stepNumber: 1,
          title: "Submit online grievance on public portal",
          description: "Register a complaint online through CPGRAMS or the state pg portal.",
          timeframe: "Immediate",
          authority: "Public Grievance Cell"
        },
        {
          stepNumber: 2,
          title: customType === "rti" ? "File a Section 6(1) RTI Application" : "Issue a formal legal notice",
          description: customType === "rti" 
            ? "Submit an RTI query to inspect files and obtain processing timeline records."
            : "Issue a 15-day formal legal notice to demand refund or action.",
          timeframe: "Within 15 days",
          authority: customType === "rti" ? "PIO (Public Authority)" : "Respondent Party"
        }
      ],
      rtiTemplate: customType === "rti" ? `To,
The Public Information Officer (PIO),
[DEPARTMENT_NAME]
[DISTRICT] Office, [STATE]

Subject: Request for Information under Section 6(1) of the Right to Information Act, 2005.

1. Full Name of the Applicant: [FULL_NAME]
2. Contact Address: [FULL_ADDRESS]

3. Particulars of Information Required:
Concerning: [CUSTOM_TITLE] - [CUSTOM_GRIEVANCE]

Please provide the following information:
(a) Please provide the current processing status of my complaint/matter and date-wise record of processing since submission.
(b) Please state the names and designations of the officers responsible for handling my request.
(c) Please provide certified copies of all file notes, correspondences, and inspection reports recorded in this regard.

4. I state that the information sought does not fall within the restrictions contained in Section 8 or 9 of the RTI Act, 2005, and to the best of my knowledge, it pertains to your office.
5. A fee of Rs. 10 has been paid via [PAYMENT_METHOD] (Receipt/IPO No: [PAYMENT_REF]).

Date: [CURRENT_DATE]
Place: [DISTRICT]

Yours faithfully,
(Signature of the Applicant)` : `FORMAL LEGAL DEMAND NOTICE

Date: [CURRENT_DATE]

To,
[DEPARTMENT_NAME] / Respondent,
[DISTRICT], [STATE]

Subject: Notice regarding pending resolution of [CUSTOM_TITLE].

Dear Sir/Madam,

Under instructions from my client [FULL_NAME], resident of [FULL_ADDRESS], I hereby serve you with this formal legal notice:

1. My client had submitted a request regarding [CUSTOM_TITLE] with details: [CUSTOM_GRIEVANCE].
2. Despite elapsed timelines, no action has been taken by your office.
3. This failure has caused my client severe inconvenience and grievance.

I therefore call upon you to address the grievance and deliver the desired resolution: [DESIRED_OUTCOME] within 15 days of this notice, failing which appropriate legal steps will be initiated.

Yours faithfully,
[FULL_NAME]`,
      plainExplanation: `This custom category governs grievances concerning ${customTitle.trim()}. Depending on whether the authority is public (requires RTI) or private (requires a Legal Notice), you must follow the corresponding route.`,
      documents: [
        "Aadhar Card / Identity verification document",
        "Copy of the custom representation or previous correspondence",
        "Proof of payment or transaction records (if any)"
      ]
    };

    setCustomCategory(newCustomCategory);
    setIsAddingCustom(false);
    setCustomTitle("");
    setCustomDesc("");
  };

  // Render content based on current step
  const renderStepContent = () => {
    // Step 1: Category Confirmation
    if (currentStep === 1) {
      return (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-background border border-stone-border rounded-md space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-muted">Your Description</span>
            <p className="text-sm italic text-foreground leading-relaxed">&ldquo;{intakeText}&rdquo;</p>
          </div>

          {isAddingCustom ? (
            <div className="border border-stone-border rounded-md p-4 space-y-4 bg-navy-light/10">
              <div className="flex justify-between items-center pb-2 border-b border-stone-border">
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Create Custom Category
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustom(false);
                    setCustomError("");
                  }}
                  className="text-slate-muted hover:text-red-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="custom-title-field" className="block text-[11px] font-bold text-navy uppercase">Category Title</label>
                  <Input
                    id="custom-title-field"
                    placeholder="e.g., Public Bus Delay / Pothole Damage Reimbursement"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="custom-desc-field" className="block text-[11px] font-bold text-navy uppercase">Short Description</label>
                  <Input
                    id="custom-desc-field"
                    placeholder="e.g., Delays in service operations or municipal compensation claims"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-navy uppercase">Filing Document Type</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="custom-type"
                        checked={customType === "rti"}
                        onChange={() => setCustomType("rti")}
                        className="accent-navy"
                      />
                      RTI Application (Public Body)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="custom-type"
                        checked={customType === "notice"}
                        onChange={() => setCustomType("notice")}
                        className="accent-navy"
                      />
                      Legal Demand Notice (Private/Retailer)
                    </label>
                  </div>
                </div>

                {customError && (
                  <p className="text-xs text-red-700 flex items-center gap-1 font-medium pt-1">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    {customError}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyCustomCategory}
                    className="bg-navy text-paper flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" /> Apply
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingCustom(false);
                      setCustomError("");
                    }}
                    className="border-stone-border text-slate-muted cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="category-select" className="block text-sm font-bold text-navy">
                  Confirm / Adjust Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="text-xs font-bold text-navy hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Or add custom category
                </button>
              </div>
              <select
                id="category-select"
                value={category.id}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setFormErrors({});
                }}
                className="flex h-11 w-full rounded-md border border-stone-border bg-paper px-3 py-2 text-sm text-foreground cursor-pointer focus:ring-1 focus:ring-navy focus:border-navy"
              >
                {/* Include custom category if selected */}
                {category.id.startsWith("custom-") && (
                  <option value={category.id}>[Custom] {category.title}</option>
                )}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-muted leading-relaxed">
                {category.id.startsWith("custom-") 
                  ? "You are using a custom defined category."
                  : "We auto-detected this category based on your text. Confirming the category configures the guided questions."}
              </p>
            </div>
          )}

          <div className="p-4 bg-navy-light/30 border border-stone-border/60 rounded-md space-y-2">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Estimated Escalation Route:</h4>
            <ol className="text-xs space-y-2 text-slate-muted list-decimal list-inside">
              {category.route.map((step) => (
                <li key={step.stepNumber} className="leading-relaxed">
                  <strong className="text-foreground">{step.title}</strong> &mdash; {step.authority}
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }

    // Step 2 to N+1: Individual Questions
    if (currentStep > 1 && currentStep <= totalQuestions + 1) {
      const q = category.questions[currentStep - 2];
      return (
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor={q.id} className="block text-base font-bold text-navy">
              {q.label} {q.required && <span className="text-red-650 text-xs font-normal">(Required)</span>}
            </label>
            
            {q.type === "select" && (
              <select
                id={q.id}
                value={answers[q.id] || ""}
                onChange={(e) => {
                  setAnswer(q.id, e.target.value);
                  if (e.target.value.trim()) {
                    setFormErrors((prev) => ({ ...prev, [q.id]: "" }));
                  }
                }}
                className="flex h-11 w-full rounded-md border border-stone-border bg-paper px-3 py-2 text-sm text-foreground cursor-pointer focus:ring-1 focus:ring-navy focus:border-navy"
              >
                <option value="">Select an option</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {q.type === "text" && (
              <Input
                id={q.id}
                type="text"
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={(e) => {
                  setAnswer(q.id, e.target.value);
                  if (e.target.value.trim()) {
                    setFormErrors((prev) => ({ ...prev, [q.id]: "" }));
                  }
                }}
                className="border-stone-border"
              />
            )}

            {q.type === "textarea" && (
              <Textarea
                id={q.id}
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={(e) => {
                  setAnswer(q.id, e.target.value);
                  if (e.target.value.trim()) {
                    setFormErrors((prev) => ({ ...prev, [q.id]: "" }));
                  }
                }}
                className="min-h-[110px] border-stone-border"
              />
            )}

            {q.type === "date" && (
              <Input
                id={q.id}
                type="date"
                value={answers[q.id] || ""}
                onChange={(e) => {
                  setAnswer(q.id, e.target.value);
                  if (e.target.value.trim()) {
                    setFormErrors((prev) => ({ ...prev, [q.id]: "" }));
                  }
                }}
                className="border-stone-border"
              />
            )}

            {formErrors[q.id] && (
              <p className="text-xs text-red-700 flex items-center gap-1 font-medium mt-1">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {formErrors[q.id]}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Step Last: Personal Details
    const isNotice = category.type === "notice";
    return (
      <div className="space-y-5 pt-2">
        <div className="p-3 bg-navy-light/40 border border-stone-border/60 rounded-md">
          <p className="text-xs text-slate-muted leading-relaxed">
            {isNotice 
              ? "To draft your Legal Notice, we require your official name and contact address for formal communication." 
              : "Under Section 6(1) of the RTI Act 2005, applicants must provide their name and mailing address. A nominal filing fee (usually Rs. 10) is also required."}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="full-name" className="block text-sm font-bold text-navy">
            Applicant&apos;s Full Name <span className="text-red-650 text-xs font-normal">(Required)</span>
          </label>
          <Input
            id="full-name"
            type="text"
            placeholder="e.g., Rajesh Kumar"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              if (e.target.value.trim()) {
                setFormErrors((prev) => ({ ...prev, fullName: "" }));
              }
            }}
          />
          {formErrors.fullName && (
            <p className="text-xs text-red-700 flex items-center gap-1 font-medium mt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {formErrors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="full-address" className="block text-sm font-bold text-navy">
            Complete Mailing Address with PIN Code <span className="text-red-650 text-xs font-normal">(Required)</span>
          </label>
          <Textarea
            id="full-address"
            placeholder="e.g., Flat 302, Block B, Green Apartments, Sector 15, Vasundhara, Ghaziabad, Uttar Pradesh - 201012"
            value={localAddress}
            onChange={(e) => {
              setLocalAddress(e.target.value);
              if (e.target.value.trim()) {
                setFormErrors((prev) => ({ ...prev, fullAddress: "" }));
              }
            }}
            className="min-h-[90px]"
          />
          {formErrors.fullAddress && (
            <p className="text-xs text-red-700 flex items-center gap-1 font-medium mt-1">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {formErrors.fullAddress}
            </p>
          )}
        </div>

        {!isNotice && (
          <div className="space-y-4 border-t border-stone-border/40 pt-4">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">RTI Application Fee Payment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="payment-method" className="block text-xs font-bold text-navy">
                  Payment Mode
                </label>
                <select
                  id="payment-method"
                  value={localMethod}
                  onChange={(e) => setLocalMethod(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-stone-border bg-paper px-3 py-2 text-sm text-foreground cursor-pointer focus:ring-1 focus:ring-navy focus:border-navy"
                >
                  <option value="Indian Postal Order (IPO)">Indian Postal Order (IPO)</option>
                  <option value="Court Fee Stamp">Court Fee Stamp</option>
                  <option value="Demand Draft (DD)">Demand Draft (DD)</option>
                  <option value="Cash Receipt">Cash Receipt</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="payment-ref" className="block text-xs font-bold text-navy">
                  Reference / IPO Serial Number
                </label>
                <Input
                  id="payment-ref"
                  type="text"
                  placeholder="e.g., 56F 123456"
                  value={localRef}
                  onChange={(e) => setLocalRef(e.target.value)}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-muted italic">
              Note: A Rs. 10 postal order or court stamp is standard. Central Govt departments accept online fee payment, whereas local offices require physical IPOs or stamps.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8">
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-muted font-medium">
          <span>Guided Interview</span>
          <span className="font-mono">Step {currentStep} of {totalSteps}</span>
        </div>
        
        {/* Flat minimal progress bar */}
        <div className="w-full h-1 bg-stone-border/40 rounded-full overflow-hidden">
          <div 
            className="h-full bg-navy transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Card */}
      <Card className="border border-stone-border bg-paper shadow-none rounded-md">
        <CardHeader className="bg-navy-light/40 border-b border-stone-border/60 py-4">
          <CardTitle className="text-sm font-bold text-navy uppercase tracking-wider">
            {currentStep === 1 && "Step 1: Confirm Issue Category"}
            {currentStep > 1 && currentStep <= totalQuestions + 1 && `Question ${currentStep - 1} of ${totalQuestions}`}
            {currentStep === totalSteps && "Final Step: Filing Information"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-muted font-sans mt-1">
            {currentStep === 1 && "Confirm the identified category for your case."}
            {currentStep > 1 && currentStep <= totalQuestions + 1 && category.title}
            {currentStep === totalSteps && (category.type === "notice" ? "Provide notice sender details." : "Provide applicant details under Section 6(1).")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-stone-border/60 p-6 bg-paper">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-stone-border text-slate-muted hover:border-navy hover:text-navy flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-navy text-paper hover:bg-navy-hover transition-colors px-5 font-semibold cursor-pointer"
          >
            {currentStep === totalSteps 
              ? (category.type === "notice" ? "Generate Notice" : "Generate RTI Draft") 
              : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
