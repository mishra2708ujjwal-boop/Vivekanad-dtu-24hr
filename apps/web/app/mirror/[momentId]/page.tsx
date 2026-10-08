"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ArrowRight, HeartHandshake } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function MirrorReflectionPage() {
  const params = useParams();
  const router = useRouter();
  const momentId = Number(params.momentId);

  const [learned, setLearned] = useState("");
  const [listened, setListened] = useState("");
  const [expectedRecognition, setExpectedRecognition] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      await apiFetch(`/moments/${momentId}/reflection`, {
        method: "POST",
        body: JSON.stringify({
          moment_id: momentId,
          learned,
          listened,
          expected_recognition: expectedRecognition,
          is_private: true,
        }),
      });
      router.push("/journey");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save reflection.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push("/journey");
  };

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Top Header */}
      <header className="pt-4 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 4: Mirror Reflection</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Mirror Reflection
        </h1>
        <p className="text-xs text-stone-600 max-w-xs mx-auto">
          A private mirror for your inner growth. Skippable anytime.
        </p>
      </header>

      {/* Philosophy Banner */}
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/60 shadow-sm text-xs text-amber-900 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Reflections remain 100% private to you and are never shown publicly.</span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Reflection Form */}
      <form onSubmit={handleSaveReflection} className="space-y-4">
        {/* Prompt 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-100 shadow-sm space-y-2">
          <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>1. What did I learn during this act?</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Learned about patient explanation without assuming what they know..."
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none bg-white"
          />
        </div>

        {/* Prompt 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-100 shadow-sm space-y-2">
          <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>2. What did I listen to or observe deeply?</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Listened to their stories about past struggles..."
            value={listened}
            onChange={(e) => setListened(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none bg-white"
          />
        </div>

        {/* Prompt 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-amber-100 shadow-sm space-y-2">
          <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>3. Did I expect any recognition or praise?</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Noticed a subtle desire for thanks, but let it go..."
            value={expectedRecognition}
            onChange={(e) => setExpectedRecognition(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none bg-white"
          />
        </div>

        {/* Submit and Skip Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>Save Private Reflection</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 text-center"
          >
            Skip reflection for now
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
