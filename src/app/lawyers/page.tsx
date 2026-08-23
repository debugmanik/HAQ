"use client";

import { useState, useEffect, useMemo } from "react";
import { LAWYERS_DATA, LAWYER_SPECIALIZATIONS, INDIAN_CITIES, LawyerProfile } from "@/lib/lawyer-data";
import { ConsultationModal } from "@/components/haq/ConsultationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Search, MapPin, Award, Star, ShieldCheck, 
  IndianRupee, Calendar, Filter, Phone, Mail, GraduationCap, Gavel
} from "lucide-react";

export default function LawyersDirectoryPage() {
  const [lawyers, setLawyers] = useState<LawyerProfile[]>(LAWYERS_DATA);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Consultation booking modal state
  const [selectedLawyerForBooking, setSelectedLawyerForBooking] = useState<LawyerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch lawyers from API
  useEffect(() => {
    async function loadLawyers() {
      try {
        const res = await fetch("/api/lawyers");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLawyers(data);
          }
        }
      } catch {}
    }
    loadLawyers();
  }, []);

  // Filtered lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const matchesCity = selectedCity === "All Cities" || lawyer.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesSpec = selectedSpecialization === "All Specializations" || lawyer.specializations.includes(selectedSpecialization);
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.city.toLowerCase().includes(query) ||
        lawyer.bio.toLowerCase().includes(query) ||
        lawyer.specializations.some(s => s.toLowerCase().includes(query));

      return matchesCity && matchesSpec && matchesQuery;
    });
  }, [lawyers, selectedCity, selectedSpecialization, searchQuery]);

  const handleOpenBooking = (lawyer: LawyerProfile) => {
    setSelectedLawyerForBooking(lawyer);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-3 border-b border-stone-border/60 pb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-navy" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
            Verified Indian Advocate Directory
          </h1>
        </div>
        <p className="text-xs text-slate-muted max-w-2xl leading-relaxed">
          Connect with Bar Council verified advocates across India specializing in consumer rights, tenancy disputes, criminal defense, cyber fraud, and administrative law.
        </p>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-muted" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, practice area..."
              className="pl-9 h-9 text-xs border-stone-border bg-paper"
            />
          </div>

          <div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-stone-border bg-paper text-xs text-foreground"
            >
              {LAWYER_SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-stone-border bg-paper text-xs text-foreground"
            >
              {INDIAN_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-muted">
          <span>Showing <strong>{filteredLawyers.length}</strong> verified advocates</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% Bar Council Number Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLawyers.map((lawyer) => (
            <Card key={lawyer.id} className="border-stone-border bg-paper shadow-none hover:border-navy transition-all duration-150 flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-navy">{lawyer.name}</h3>
                      {lawyer.isVerified && (
                        <span title="Bar Council Verified">
                          <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-muted flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {lawyer.city}, {lawyer.state} • {lawyer.experienceYears} Years Exp.
                    </p>
                    <span className="text-[10px] font-mono text-slate-muted bg-stone-border/30 px-1.5 py-0.5 rounded-xs border border-stone-border/40 inline-block">
                      Bar Council ID: {lawyer.barCouncilNo}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end text-xs font-bold text-navy">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{lawyer.rating}</span>
                      <span className="text-[10px] text-slate-muted">({lawyer.reviewCount})</span>
                    </div>
                    <span className="text-xs font-bold text-navy flex items-center justify-end mt-1">
                      <IndianRupee className="h-3.5 w-3.5" />{lawyer.consultationFee}
                    </span>
                    <span className="text-[10px] text-slate-muted block">45-min Consult</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-muted leading-relaxed line-clamp-3">
                  {lawyer.bio}
                </p>

                {/* Specializations & Courts */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specializations.map((spec, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-stone-border/25 text-navy rounded-xs border border-stone-border/50 font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-muted flex items-center gap-1 truncate">
                    <Gavel className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{lawyer.courtPractice.join(" • ")}</span>
                  </div>
                </div>
              </CardContent>

              {/* Action Footer */}
              <div className="px-5 py-3 border-t border-stone-border/40 bg-stone-border/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-muted">
                  Languages: <strong>{lawyer.languages.join(", ")}</strong>
                </span>
                <Button
                  size="sm"
                  onClick={() => handleOpenBooking(lawyer)}
                  className="bg-navy text-paper hover:bg-navy-hover text-xs h-8 px-3.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="h-3 w-3" /> Book Consultation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        lawyer={selectedLawyerForBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
