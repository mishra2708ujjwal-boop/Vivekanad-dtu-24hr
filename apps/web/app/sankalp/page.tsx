"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ArrowRight, HeartHandshake, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface SankalpQuality {
  id: string;
  name: string;
  meaning: string;
}

export default function SankalpSelectionPage() {
  const router = useRouter();
  const [qualities, setQualities] = useState<SankalpQuality[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadQualitiesAndTodaySankalp();
  }, []);

  const loadQualitiesAndTodaySankalp = async () => {
    setLoading(true);
    try {
      // Load qualities catalog
      const catalog = await apiFetch("/sankalps/qualities");
      setQualities(catalog);

      // Check if user already picked a Sankalp today
      const today = await apiFetch("/sankalps/today").catch(() => null);
      if (today && today.quality) {
        setSelectedQuality(today.quality);
      }
    } catch (err: any) {
      setErrorMsg("Please sign in to choose your daily Sankalp.");
      setTimeout(() => router.push("/welcome"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSankalp = async () => {
    if (!selectedQuality) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiFetch("/sankalps/", {
        method: "POST",
        body: JSON.stringify({ quality: selectedQuality }),
      });
      router.push("/home");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to set today's Sankalp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center text-stone-600 text-sm">
        Loading today's Sankalps...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Top Header */}
      <header className="pt-4 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 1 of Daily Loop</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
          Choose Today's Sankalp
        </h1>
        <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto">
          Select an inner quality or intention to guide your interactions and Seva today.
        </p>
      </header>

      {errorMsg && (
        <div className="my-4 p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {qualities.map((item) => {
          const isSelected = selectedQuality === item.name;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedQuality(item.name)}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-amber-600 text-white border-amber-600 shadow-md transform scale-[1.01]"
                  : "bg-white/90 backdrop-blur-md text-stone-800 border-amber-100 hover:border-amber-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-serif font-semibold text-sm ${
                    isSelected ? "text-white" : "text-stone-900"
                  }`}
                >
                  {item.name}
                </span>
                {isSelected ? (
                  <div className="p-1 bg-white/20 rounded-full text-white">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300" />
                )}
              </div>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  isSelected ? "text-amber-100" : "text-stone-500"
                }`}
              >
                {item.meaning}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <footer className="pt-2 pb-6 max-w-md mx-auto w-full">
        <button
          onClick={handleConfirmSankalp}
          disabled={!selectedQuality || submitting}
          className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Confirm Today's Intention</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </main>
  );
}
