"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Compass, User, RefreshCw, Sparkles, ShieldCheck, BookOpen, Users, Radio, Camera } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface SankalpToday {
  quality: string;
  date: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Practitioner");
  const [sankalp, setSankalp] = useState<SankalpToday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const storedName = localStorage.getItem("user_name");
      if (storedName) setUserName(storedName);

      const todayData = await apiFetch("/sankalps/today").catch(() => null);
      if (todayData && todayData.quality) {
        setSankalp(todayData);
      }
    } catch (err: any) {
      console.log("Not logged in");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center text-stone-600 text-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
            Namaste 🙏
          </span>
          <h1 className="text-xl font-serif font-bold text-stone-900">{userName}</h1>
        </div>
        <Link
          href="/profile"
          className="p-2.5 bg-white/90 rounded-full border border-amber-200/60 shadow-sm text-stone-700 hover:text-amber-700 transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </header>

      {/* Today's Sankalp Card */}
      <section className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Today's Inner Intention</span>
          </div>

          <Link
            href="/sankalp"
            className="text-xs text-amber-100 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Change</span>
          </Link>
        </div>

        {sankalp ? (
          <div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              {sankalp.quality}
            </h2>
            <p className="text-xs text-amber-100/90 mt-1">
              "Let this quality guide every service moment and interaction today."
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">No Sankalp Chosen Today</h2>
            <p className="text-xs text-amber-100">
              Pick today's quality to align your Seva actions with inner mindfulness.
            </p>
            <Link
              href="/sankalp"
              className="inline-block mt-2 px-4 py-2 bg-white text-amber-800 text-xs font-semibold rounded-xl shadow-sm hover:bg-amber-50 transition-colors"
            >
              Choose Sankalp Now
            </Link>
          </div>
        )}
      </section>

      {/* Live Seva Highlight */}
      <section className="p-1 border-[3px] border-amber-300/60 rounded-3xl animate-pulse-slow">
        <Link href="/live" className="block p-5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -z-10 group-hover:bg-white/20 transition-colors" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider border border-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                New Feature
              </div>
              <h3 className="text-xl font-serif font-bold tracking-wide">Live Seva</h3>
              <p className="text-xs text-amber-100 max-w-sm leading-relaxed">
                Teach or learn live online. All sessions are recorded and saved for the community.
              </p>
            </div>
            
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-inner">
              <Radio className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </section>

      {/* Barter Match Highlight */}
      <section className="p-1 border-[3px] border-emerald-300/60 rounded-3xl mt-2">
        <Link href="/barter" className="block p-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -z-10 group-hover:bg-white/20 transition-colors" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider border border-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                New Feature
              </div>
              <h3 className="text-xl font-serif font-bold tracking-wide">Seva Barter Match</h3>
              <p className="text-xs text-emerald-100 max-w-sm leading-relaxed">
                Offer your skills, get what you need. Semantic AI matchmaking for direct Seva exchange.
              </p>
            </div>
            
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </section>

      {/* Spot & Report Highlight */}
      <section className="p-1 border-[3px] border-red-300/60 rounded-3xl mt-2">
        <Link href="/report" className="block p-5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -z-10 group-hover:bg-white/20 transition-colors" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider border border-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Urgent Action
              </div>
              <h3 className="text-xl font-serif font-bold tracking-wide">Spot & Report</h3>
              <p className="text-xs text-red-100 max-w-sm leading-relaxed">
                Click a photo of someone in need and upload it to alert nearby givers.
              </p>
            </div>
            
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-inner">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Explore & Practice
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          <Link
            href="/radar"
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-3 bg-amber-100 rounded-xl text-amber-700 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                Opportunity Radar
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Discover local & online Seva matching your Sankalp
              </p>
            </div>
          </Link>

          <Link
            href="/journey"
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-3 bg-amber-100/60 rounded-xl text-amber-800 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                Personal Journey (/journey)
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Private timeline of Sankalps, Moments & Reflections
              </p>
            </div>
          </Link>

          <Link
            href="/circle"
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-3 bg-stone-100 rounded-xl text-stone-700 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                Seva Circles (/circle)
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Create or join recurring community group activities
              </p>
            </div>
          </Link>

          <Link
            href="/inbox"
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:scale-105 transition-transform relative">
              <Heart className="w-5 h-5 fill-rose-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm group-hover:text-rose-700 transition-colors">
                Blessings Inbox
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Read gratitude notes from people you helped
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="p-4 bg-amber-100/60 rounded-2xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Dignity Rule:</strong> Seva-Sadhana does not track public leaderboards or point counts. Every action is a private mirror for personal reflection.
        </p>
      </section>
    </main>
  );
}
