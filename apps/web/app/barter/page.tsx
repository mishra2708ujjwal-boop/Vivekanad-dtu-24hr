"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRightLeft, Sparkles, CheckCircle2, UserCircle, Briefcase, BookOpen } from "lucide-react";
import Link from "next/link";

const DUMMY_BARTERS = [
  {
    id: "b1",
    user: "Rahul Desai",
    offers: "Expert Plumbing & Pipe Fixing",
    needs: "Basic Math Tutoring for 8th Grade",
    matchScore: 98,
    tags: ["Physical", "Education"],
  },
  {
    id: "b2",
    user: "Sneha Patel",
    offers: "Web Design & UI/UX",
    needs: "Someone to run errands / Grocery delivery",
    matchScore: 85,
    tags: ["Digital", "Errands"],
  },
  {
    id: "b3",
    user: "Amit Kumar",
    offers: "Legal Consultation (Tenant Rights)",
    needs: "Spoken English Practice",
    matchScore: 72,
    tags: ["Legal", "Language"],
  }
];

export default function BarterPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(DUMMY_BARTERS);
  const [showMatches, setShowMatches] = useState(false);

  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setShowMatches(false);
    
    // Simulate AI Semantic Search delay
    setTimeout(() => {
      // Very basic dummy filter just to show interaction
      if (query.toLowerCase().includes("math") || query.toLowerCase().includes("plumb")) {
        setResults([DUMMY_BARTERS[0]]);
      } else if (query.toLowerCase().includes("design") || query.toLowerCase().includes("errand")) {
        setResults([DUMMY_BARTERS[1]]);
      } else {
        setResults(DUMMY_BARTERS);
      }
      setIsSearching(false);
      setShowMatches(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-amber-50/50 p-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200/60 shadow-sm mx-auto">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Semantic Matchmaking</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Seva Barter Exchange
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Describe what you can offer and what you need in plain English. Our AI will semantically match you with community members for a direct exchange of Seva.
          </p>
        </header>

        {/* Semantic Search Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-amber-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl -z-10 opacity-50" />
          
          <form onSubmit={handleSemanticSearch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600" />
                Describe your barter
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., I can teach basic math to kids, and I need someone to help fix my leaky kitchen sink..."
                className="w-full h-32 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSearching || !query}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI is finding your perfect match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Find Barter Matches</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showMatches && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Found {results.length} Matches
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {results.map((barter) => (
                <div key={barter.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200">
                        <UserCircle className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900">{barter.user}</h3>
                        <div className="flex gap-2 mt-1">
                          {barter.tags.map(t => (
                            <span key={t} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold text-sm">{barter.matchScore}% Semantic Match</span>
                    </div>

                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-800 font-bold mb-2 text-sm">
                        <Briefcase className="w-4 h-4" /> They Can Offer
                      </div>
                      <p className="text-stone-700 text-sm">{barter.offers}</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="flex items-center gap-2 text-stone-800 font-bold mb-2 text-sm">
                        <BookOpen className="w-4 h-4" /> They Need
                      </div>
                      <p className="text-stone-700 text-sm">{barter.needs}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4" />
                      Initiate Barter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}
