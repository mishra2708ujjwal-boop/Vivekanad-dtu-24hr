"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, PlayCircle, Users, ArrowLeft, Radio, Search } from "lucide-react";

const LIVE_SESSIONS = [
  { id: "class-1", title: "Basic Algebra for 8th Grade", host: "Priya K.", viewers: 14, tags: ["Education", "Math"] },
  { id: "class-2", title: "Digital Literacy: Using Govt Portals", host: "Rahul D.", viewers: 32, tags: ["Digital Seva", "Form Help"] },
];

const PAST_RECORDINGS = [
  { id: "rec-1", title: "English Communication Basics", host: "Aarav S.", duration: "45 mins", date: "Yesterday" },
  { id: "rec-2", title: "Introduction to Organic Farming", host: "Dev P.", duration: "1 hr 10 mins", date: "3 days ago" },
];

export default function LiveSevaPage() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 space-y-6">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between pt-2">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Live Seva</span>
        </div>
        <div className="w-12" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-600 to-orange-600 border border-amber-700 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-4 max-w-xl z-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Teach & Help Anyone, Anywhere.</h1>
            <p className="text-sm md:text-base text-amber-100 leading-relaxed">
              Start a free live session to share your knowledge. All sessions are securely recorded and saved for others to learn from later.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => router.push("/live/new")}
                className="px-6 py-3 bg-white text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Video className="w-5 h-5" />
                <span>Start Live Seva</span>
              </button>
            </div>
          </div>
          
          <div className="z-10 hidden md:flex items-center justify-center p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
             <div className="w-56 h-36 bg-stone-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-stone-800 shadow-inner">
                <Radio className="w-8 h-8 text-red-500 animate-pulse mb-2" />
                <div className="text-stone-300 text-xs font-medium">Recording saved securely.</div>
                <span className="absolute top-2 left-2 text-[10px] bg-red-500 px-2 py-0.5 rounded text-white font-bold tracking-wider">REC ON</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Active Live Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Happening Now
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LIVE_SESSIONS.map(session => (
                <Link href={`/live/${session.id}`} key={session.id} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/60 hover:border-amber-400 transition-colors group space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      {session.tags[0]}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {session.viewers} tuning in
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">{session.title}</h3>
                    <p className="text-xs text-stone-500 mt-1">Host: {session.host}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs font-medium text-amber-600">
                    Join Live Seva <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Past Recordings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-amber-600" />
              Saved Recordings
            </h2>
            
            <div className="space-y-3">
              {PAST_RECORDINGS.map(rec => (
                <div key={rec.id} className="p-3 bg-white/90 backdrop-blur-md rounded-xl border border-amber-200/60 hover:bg-amber-50 transition-colors cursor-pointer flex gap-3 items-center shadow-sm">
                  <div className="w-24 h-16 bg-stone-100 rounded-lg flex items-center justify-center shrink-0 border border-stone-200 relative overflow-hidden">
                    <PlayCircle className="w-5 h-5 text-stone-400" />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 rounded">{rec.duration}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 truncate">{rec.title}</h4>
                    <p className="text-xs text-stone-500 truncate mt-0.5">By {rec.host} • {rec.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
