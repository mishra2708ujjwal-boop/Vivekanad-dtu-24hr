"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Clock, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface OpportunityDetail {
  id: number;
  title: string;
  category: string;
  location_name: string;
  time_needed_minutes: number;
}

export default function SevaMomentPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = Number(params.id);

  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [duration, setDuration] = useState(30);
  const [isSilent, setIsSilent] = useState(false);
  const [sankalpQuality, setSankalpQuality] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [opportunityId]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (opportunityId && !isNaN(opportunityId)) {
        const oppData = await apiFetch(`/opportunities/${opportunityId}`).catch(() => {
          if (opportunityId >= 990) {
            return {
              id: opportunityId,
              title: "Community Seva Activity",
              category: "General Support",
              location_name: "Local Area",
              time_needed_minutes: 60
            };
          }
          return null;
        });
        if (oppData) setOpp(oppData);
      }

      const todaySankalp = await apiFetch("/sankalps/today").catch(() => null);
      if (todaySankalp && todaySankalp.quality) {
        setSankalpQuality(todaySankalp.quality);
      }
    } catch (err: any) {
      console.log("Error loading moment data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMoment = async () => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/moments/", {
        method: "POST",
        body: JSON.stringify({
          opportunity_id: opp ? opp.id : null,
          duration_minutes: duration,
          is_silent: isSilent,
        }),
      });

      router.push(`/mirror/${res.id}`);
    } catch (err: any) {
      alert("Failed to complete Seva Moment. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center text-stone-600 text-sm">
        Preparing Seva Moment...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Seva Moment
        </span>
      </div>

      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Practice Seva</h1>
        <p className="text-xs text-stone-600 max-w-xs mx-auto">
          Perform your act of service with full presence and mindfulness.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          {/* Selected Activity & Sankalp Summary */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-amber-100 shadow-sm space-y-3">
        {opp && (
          <div>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              {opp.category} Activity
            </span>
            <h2 className="font-serif font-semibold text-stone-900 text-base mt-0.5">
              {opp.title}
            </h2>
          </div>
        )}

        {sankalpQuality && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-600 shrink-0 fill-amber-500/20" />
            <span>Today's Intention: <strong>{sankalpQuality}</strong></span>
          </div>
        )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Duration & Silent Seva Controls */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-amber-100 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-stone-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Duration Spent</span>
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setDuration(mins)}
              className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                duration === mins
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
              }`}
            >
              {mins} mins
            </button>
          ))}
        </div>

        {/* Silent Seva Toggle */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[240px]">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-stone-500" />
              <span>Silent Seva</span>
            </span>
            <p className="text-[11px] text-stone-500">
              Keep this act completely silent (excluded from any group/circle views).
            </p>
          </div>

          <input
            type="checkbox"
            checked={isSilent}
            onChange={(e) => setIsSilent(e.target.checked)}
            className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Complete Action Button */}
      <button
        onClick={handleCompleteMoment}
        disabled={submitting}
        className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>Complete & Open Mirror Reflection</span>
        <ArrowRight className="w-4 h-4" />
      </button>
        </div>
      </div>
    </main>
  );
}
