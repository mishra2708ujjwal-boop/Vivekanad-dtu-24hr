"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Clock, EyeOff, ShieldCheck, ArrowLeft, BookOpen, Calendar, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface TimelineItem {
  type: "sankalp" | "moment";
  id: number;
  title: string;
  date: string;
  details?: string;
  duration_minutes?: number;
  is_silent?: boolean;
  reflection?: {
    learned?: string;
    listened?: string;
    expected_recognition?: string;
  };
}

export default function JourneyPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Practitioner");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/journey/");
      setUserName(data.user_name || "Practitioner");
      const fetchedTimeline = data.timeline || [];
      const dummyTimeline: TimelineItem[] = [
        { type: "sankalp", id: 999, title: "Sankalp: Courage", date: "2024-03-10", details: "Embrace the fear and do it anyway." },
        { type: "moment", id: 998, title: "Taught Math to Kids", date: "2024-03-11", details: "Helped 3 students with algebra.", duration_minutes: 60, is_silent: false, reflection: { learned: "Patience and different ways to explain formulas.", listened: "The kids' struggles with fractions." } },
        { type: "moment", id: 997, title: "Cleaned Local Park", date: "2024-03-14", details: "Picked up trash around the benches.", duration_minutes: 45, is_silent: true, reflection: { learned: "How much plastic is wasted daily." } },
        { type: "sankalp", id: 996, title: "Sankalp: Compassion", date: "2024-03-15", details: "To feel with others." },
        { type: "moment", id: 995, title: "Served Food at Shelter", date: "2024-03-15", details: "Helped serve lunch to 50 people.", duration_minutes: 120, is_silent: false, reflection: { learned: "The power of a warm meal and a smile.", listened: "Many stories of hardship and hope." } },
      ];
      setTimeline([...fetchedTimeline, ...dummyTimeline]);
    } catch (err: any) {
      setErrorMsg("Please sign in to view your personal journey.");
      setTimeout(() => router.push("/welcome"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Personal Journey</span>
        </div>
        <div className="w-12" />
      </div>

      <header className="space-y-1 text-center">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
          {userName}'s Journey
        </h1>
        <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto">
          A private chronological mirror of your intentions, service acts, and reflections.
        </p>
      </header>

      {/* Dignity Callout */}
      <div className="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/60 shadow-sm text-xs text-amber-900 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Strictly private view. No leaderboards, ranks, or public hour counts.</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">
          Loading personal timeline...
        </div>
      ) : errorMsg ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-100 text-center">
          {errorMsg}
        </div>
      ) : timeline.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-white/60 rounded-2xl border border-amber-100 p-6 space-y-2">
          <p className="font-semibold text-stone-700">Your journey timeline is empty.</p>
          <p>Choose a daily Sankalp or complete a Seva Moment to begin logging your practice.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-200/80">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 space-y-2">
              {/* Timeline Marker */}
              <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border text-xs shadow-sm ${
                item.type === "sankalp"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-amber-700 border-amber-300"
              }`}>
                {item.type === "sankalp" ? <Sparkles className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5 fill-amber-500/20" />}
              </div>

              {/* Card Container */}
              <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-semibold text-sm text-stone-900">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>

                {item.details && (
                  <p className="text-xs text-stone-600">{item.details}</p>
                )}

                {item.duration_minutes && (
                  <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {item.duration_minutes} mins
                    </span>
                    {item.is_silent && (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium text-[11px] border border-amber-200">
                        <EyeOff className="w-3 h-3" /> Silent Seva
                      </span>
                    )}
                  </div>
                )}

                {/* Reflection Notes */}
                {item.reflection && (
                  <div className="mt-2 p-3 bg-amber-50/60 rounded-xl border border-amber-100/80 space-y-1.5 text-xs text-stone-700">
                    <span className="font-semibold text-amber-900 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-700" /> Mirror Reflection
                    </span>
                    {item.reflection.learned && (
                      <p><strong>Learned:</strong> {item.reflection.learned}</p>
                    )}
                    {item.reflection.listened && (
                      <p><strong>Listened to:</strong> {item.reflection.listened}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
