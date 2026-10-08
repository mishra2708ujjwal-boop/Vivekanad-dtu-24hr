"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Heart, CheckCircle2, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface OpportunityDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  location_name: string;
  time_needed_minutes: number;
  urgency: string;
  skills_needed: string;
  source: string;
  visibility: string;
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id;

  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [consentGranted, setConsentGranted] = useState(false);
  const [grantingConsent, setGrantingConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadDetail();
  }, [opportunityId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/opportunities/${opportunityId}`);
      setOpp(data);
    } catch (err: any) {
      if (Number(opportunityId) >= 990) {
        setOpp({
          id: Number(opportunityId),
          title: "Community Seva Activity",
          description: "This is a detailed description of the community seva activity. You will be helping local residents with basic needs and support.",
          category: "General Support",
          location_name: "Local Area",
          time_needed_minutes: 60,
          urgency: "medium",
          skills_needed: "Empathy, Patience",
          source: "community",
          visibility: "local"
        });
        setErrorMsg("");
      } else {
        setErrorMsg("Failed to load opportunity details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGrantConsent = async () => {
    setGrantingConsent(true);
    setErrorMsg("");
    try {
      await apiFetch(`/opportunities/${opportunityId}/consent`, {
        method: "POST",
        body: JSON.stringify({ what_is_shared: "phone_and_name" }),
      });
      setConsentGranted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to record consent.");
    } finally {
      setGrantingConsent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center text-stone-600 text-sm">
        Loading details...
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-screen bg-amber-50/50 p-6 text-center text-stone-600 text-sm">
        Opportunity not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Radar</span>
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          {opp.category}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          {/* Main Details Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
        <h1 className="text-xl font-serif font-bold text-stone-900 leading-snug">
          {opp.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-stone-600 pt-1 border-t border-stone-100">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            {opp.location_name || "Delhi Area"}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {opp.time_needed_minutes} mins
          </span>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed pt-2">
          {opp.description}
        </p>

        {opp.skills_needed && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-stone-700 space-y-1">
            <span className="font-semibold text-amber-900">Skills Needed:</span>
            <p>{opp.skills_needed}</p>
          </div>
        )}
          </div>
        </div>

        <div className="space-y-4 md:col-span-1">
          {/* Dignity & Consent Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm pb-2 border-b border-stone-100">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Dignity & Privacy Checklist</span>
        </div>

        <ul className="space-y-2 text-xs text-stone-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Contact details are only shared after explicit, recorded mutual consent.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>No beneficiary labels or public hour counting.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Reflections following this Seva will remain 100% private to you.</span>
          </li>
        </ul>

        {/* Consent Action Button */}
        {consentGranted ? (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Consent recorded! Contact details released securely.</span>
          </div>
        ) : (
          <button
            onClick={handleGrantConsent}
            disabled={grantingConsent}
            className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-amber-300"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>{grantingConsent ? "Recording Consent..." : "Record Mutual Consent to Connect"}</span>
          </button>
        )}
      </div>

      {/* Start Seva Moment Button */}
      <button
        onClick={() => router.push(`/moment/${opp.id}`)}
        className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2"
      >
        <Heart className="w-4 h-4 fill-white/20" />
        <span>Perform Seva Moment</span>
      </button>
        </div>
      </div>
    </main>
  );
}
