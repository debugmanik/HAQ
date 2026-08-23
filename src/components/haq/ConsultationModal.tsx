"use client";

import { useState } from "react";
import { LawyerProfile } from "@/lib/lawyer-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Calendar, Clock, ShieldCheck, MapPin, IndianRupee, AlertCircle } from "lucide-react";

interface ConsultationModalProps {
  lawyer: LawyerProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationModal({ lawyer, isOpen, onClose }: ConsultationModalProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("11:00 AM - 11:45 AM");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  if (!lawyer) return null;

  const TIME_SLOTS = [
    "10:00 AM - 10:45 AM",
    "11:00 AM - 11:45 AM",
    "02:00 PM - 02:45 PM",
    "04:00 PM - 04:45 PM",
    "06:00 PM - 06:45 PM"
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim() || !bookingDate) {
      setError("Please fill out all required personal and date fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lawyers/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          lawyerName: lawyer.name,
          lawyerCity: lawyer.city,
          userName,
          userEmail,
          userPhone,
          bookingDate,
          timeSlot,
          issueCategory: lawyer.specializations[0] || "General Law",
          issueDescription: issueDescription || "Legal guidance requested via HAQ"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book consultation");
      }

      // Also persist to localStorage for offline dashboard display
      try {
        const existing = JSON.parse(localStorage.getItem("haq_saved_bookings") || "[]");
        existing.unshift({
          id: data.bookingId || `BK-${Date.now()}`,
          lawyerName: lawyer.name,
          lawyerCity: lawyer.city,
          lawyerSpecialization: lawyer.specializations[0],
          userName,
          userPhone,
          bookingDate,
          timeSlot,
          status: "confirmed",
          fee: lawyer.consultationFee,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem("haq_saved_bookings", JSON.stringify(existing));
      } catch {}

      setBookingId(data.bookingId || `BK-${Date.now().toString().slice(-6)}`);
      setSuccess(true);
      setLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking error";
      setError(msg);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError("");
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setBookingDate("");
    setIssueDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg bg-paper border border-stone-border p-6 rounded-lg text-foreground">
        {!success ? (
          <>
            <DialogHeader className="space-y-2 text-left pb-3 border-b border-stone-border/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <DialogTitle className="text-base font-bold text-navy">
                  Book Advocate Consultation
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-muted">
                Schedule a 45-minute direct legal consultation with a Bar Council verified advocate.
              </DialogDescription>
            </DialogHeader>

            {/* Lawyer Quick Summary Card */}
            <div className="p-3 bg-stone-border/20 rounded-md border border-stone-border/50 flex items-center justify-between text-xs my-2">
              <div className="space-y-0.5">
                <span className="font-bold text-navy block">{lawyer.name}</span>
                <span className="text-slate-muted flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {lawyer.city}, {lawyer.state} • Bar ID: {lawyer.barCouncilNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-muted block">Consultation Fee</span>
                <span className="font-bold text-navy flex items-center justify-end text-sm">
                  <IndianRupee className="h-3.5 w-3.5" />{lawyer.consultationFee}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-navy">Your Full Name *</label>
                  <Input
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="h-8 text-xs border-stone-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-navy">Phone Number (WhatsApp) *</label>
                  <Input
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-8 text-xs border-stone-border"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-navy">Email Address *</label>
                <Input
                  required
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="h-8 text-xs border-stone-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-navy flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Preferred Date *
                  </label>
                  <Input
                    required
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-8 text-xs border-stone-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-navy flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full h-8 px-2 rounded-md border border-stone-border bg-paper text-xs text-foreground focus-visible:ring-1 focus-visible:ring-navy"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-navy">Brief Summary of Your Legal Issue</label>
                <Textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe key facts, notices received, or dates..."
                  className="min-h-[70px] text-xs border-stone-border"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <DialogFooter className="pt-2 flex flex-row gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset} 
                  className="text-xs h-8 px-3 border-stone-border cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="text-xs h-8 px-4 bg-navy text-paper hover:bg-navy-hover cursor-pointer"
                >
                  {loading ? "Confirming..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-navy">Consultation Request Confirmed!</h3>
              <p className="text-xs text-slate-muted max-w-sm mx-auto leading-relaxed">
                Your consultation booking with <strong className="text-navy">{lawyer.name}</strong> has been scheduled for <strong className="text-navy">{bookingDate}</strong> at <strong className="text-navy">{timeSlot}</strong>.
              </p>
            </div>

            <div className="p-3 bg-stone-border/20 rounded-md border border-stone-border text-xs text-left max-w-sm mx-auto space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-muted">Booking Reference:</span>
                <span className="font-mono font-bold text-navy">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-muted">Advocate:</span>
                <span className="font-semibold text-navy">{lawyer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-muted">Status:</span>
                <span className="font-bold text-emerald-700">Confirmed (Saved to Dashboard)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-muted">
              The advocate's chamber will contact you via WhatsApp / Phone to confirm the meeting link or venue.
            </p>

            <Button 
              onClick={handleReset} 
              className="bg-navy text-paper hover:bg-navy-hover text-xs h-9 px-6 cursor-pointer"
            >
              Done & View on Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
