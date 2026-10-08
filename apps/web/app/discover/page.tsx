"use client";

import { useRecommendations } from "@/hooks/useDiscover";
import { useNeeds } from "@/hooks/useNeeds";
import { useSevaList } from "@/hooks/useSeva";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function DiscoverPage() {
  const { isAuthenticated } = useAuthContext();
  const [tab, setTab] = useState<'recommended' | 'needs' | 'seva'>('needs'); // Default to public tab
  
  // Set tab to recommended if authenticated on mount
  useEffect(() => {
    if (isAuthenticated) setTab('recommended');
  }, [isAuthenticated]);
  
  const { data: recs, isLoading: recsLoading } = useRecommendations();
  const { data: needs, isLoading: needsLoading } = useNeeds();
  const { data: sevas, isLoading: sevasLoading } = useSevaList();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-serif text-deep mb-8">Discover Opportunities</h1>
      
      <div className="flex gap-4 mb-8 border-b border-border/50 pb-4">
        {isAuthenticated && <button onClick={() => setTab('recommended')} className={`font-medium pb-2 ${tab === 'recommended' ? 'text-primary border-b-2 border-primary' : 'text-ink/60'}`}>For You</button>}
        <button onClick={() => setTab('needs')} className={`font-medium pb-2 ${tab === 'needs' ? 'text-primary border-b-2 border-primary' : 'text-ink/60'}`}>Community Needs</button>
        <button onClick={() => setTab('seva')} className={`font-medium pb-2 ${tab === 'seva' ? 'text-primary border-b-2 border-primary' : 'text-ink/60'}`}>Active Sevas</button>
      </div>

      {tab === 'recommended' && isAuthenticated && (
        <div className="space-y-6">
          {recsLoading ? <p>Loading recommendations...</p> : recs?.map((rec: any, i: number) => (
            <div key={i} className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="text-xl font-serif text-deep mb-2">{rec.seva.title}</h3>
              <p className="text-sm text-ink/80 mb-4 bg-primary/10 inline-block px-3 py-1 rounded-full text-primary">{rec.matchReason}</p>
              <p className="text-ink/70">{rec.seva.description}</p>
              <button className="mt-4 px-6 py-2 bg-primary text-ink rounded-full text-sm font-medium hover:bg-accent hover:text-white transition">View Details</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'needs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {needsLoading ? <p>Loading needs...</p> : needs?.map((need: any) => (
             <div key={need.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="text-lg font-serif text-deep mb-2">{need.title}</h3>
              <p className="text-ink/70 mb-4 line-clamp-3">{need.description}</p>
              <span className="text-xs text-ink/50 uppercase tracking-wider">{need.category}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'seva' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sevasLoading ? <p>Loading sevas...</p> : sevas?.map((seva: any) => (
             <div key={seva.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="text-lg font-serif text-deep mb-2">{seva.title}</h3>
              <p className="text-ink/70 mb-4 line-clamp-3">{seva.description}</p>
              <button className="px-4 py-2 border border-primary text-primary rounded-full text-sm font-medium">Join Circle</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
