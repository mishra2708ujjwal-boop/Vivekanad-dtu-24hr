"use client";

import { useState } from "react";
import { useStructureNeed, useCreateNeed } from "@/hooks/useNeeds";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function CreatePage() {
  const { isAuthenticated } = useAuthContext();
  const [rawText, setRawText] = useState("");
  const [structuredDraft, setStructuredDraft] = useState<any>(null);
  
  const structureMutation = useStructureNeed();
  const createMutation = useCreateNeed();

  const handleStructure = async () => {
    if (!rawText) return;
    const draft = await structureMutation.mutateAsync({ rawText });
    setStructuredDraft(draft);
  };

  const handlePublish = async () => {
    if (!structuredDraft) return;
    await createMutation.mutateAsync({
      title: structuredDraft.title || "Community Service Need",
      rawText: rawText || "Community expressed need for support",
      structured: structuredDraft.structured || {
        requiredContributions: [{ label: "General Support", count: 2 }],
        sessions: 2,
        potentialLearning: ["Community collaboration", "Active listening"],
      },
      empowermentNote: structuredDraft.empowermentSuggestion || "Empowers the community with lasting self-reliance.",
      category: structuredDraft.category || "Community",
    });
    alert("Need Published!");
    setStructuredDraft(null);
    setRawText("");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h1 className="text-3xl font-serif text-deep mb-4">Please log in</h1>
        <p className="text-ink/70">You must be logged in to create a Need or Seva.</p>
        <button className="mt-8 px-6 py-2 bg-primary text-ink rounded-full" onClick={() => alert("Login flow to be added!")}>Simulate Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-serif text-deep mb-8">Post a Community Need</h1>
      
      <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <p className="text-ink/80 mb-4">Describe what your community needs in your own words. Our AI will help structure it.</p>
        <textarea 
          className="w-full h-32 p-4 border border-border/50 rounded-lg bg-bg focus:outline-none focus:border-primary mb-4"
          placeholder="e.g., We need someone to teach the kids at our center how to use computers..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        
        <button 
          className="px-6 py-2 bg-primary text-ink font-medium rounded-full"
          onClick={handleStructure}
          disabled={structureMutation.isPending}
        >
          {structureMutation.isPending ? "Structuring..." : "Structure Need"}
        </button>

        {structuredDraft && (
          <div className="mt-8 p-6 bg-surface-alt rounded-lg border border-primary/20">
            <h3 className="text-xl font-serif text-deep mb-2">Draft Preview</h3>
            <div className="space-y-2 text-sm text-ink/80 mb-6">
              <p><strong>Title:</strong> {structuredDraft.title}</p>
              <p><strong>Category:</strong> {structuredDraft.category}</p>
              <p><strong>Description:</strong> {structuredDraft.description}</p>
            </div>
            
            <button 
              className="px-6 py-2 bg-deep text-bg font-medium rounded-full"
              onClick={handlePublish}
              disabled={createMutation.isPending}
            >
               {createMutation.isPending ? "Publishing..." : "Publish Need"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
