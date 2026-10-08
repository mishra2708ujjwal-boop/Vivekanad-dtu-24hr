"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Calendar, ArrowLeft, Check, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Circle {
  id: number;
  group_name: string;
  description: string;
  recurring_activity: string;
  schedule: string;
  member_count: number;
}

interface ChatMessage {
  author: string;
  text: string;
  color: string;
}

export default function CirclePage() {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [activeCircle, setActiveCircle] = useState<number | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { author: "Aarav", text: "Looking forward to our next session! Let me know if anyone needs a ride.", color: "text-amber-700" },
    { author: "Priya", text: "I'll bring some extra supplies for the workshop. See you all there.", color: "text-emerald-700" },
    { author: "Ravi", text: "Can't wait! The new members are doing great.", color: "text-blue-700" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // New Circle Form
  const [groupName, setGroupName] = useState("");
  const [activity, setActivity] = useState("");
  const [schedule, setSchedule] = useState("Saturdays 10 AM");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [joinedMsg, setJoinedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/circles/");
      setCircles(data);
    } catch (err: any) {
      console.log("Failed to load circles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !activity) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiFetch("/circles/", {
        method: "POST",
        body: JSON.stringify({
          group_name: groupName,
          recurring_activity: activity,
          schedule,
          description,
        }),
      });
      setGroupName("");
      setActivity("");
      setDescription("");
      setShowCreate(false);
      loadCircles();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create Seva Circle.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinCircle = async (circleId: number) => {
    try {
      const res = await apiFetch(`/circles/${circleId}/join`, { method: "POST" });
      setJoinedMsg(res.message);
      setActiveCircle(circleId);
      loadCircles();
      setTimeout(() => setJoinedMsg(""), 3000);
    } catch (err: any) {
      alert("Please sign in to join a circle.");
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { author: "You", text: newMessage, color: "text-stone-900" }]);
    setNewMessage("");
  };

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
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
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>Seva Circles</span>
        </div>
        <div className="w-12" />
      </div>

      <header className="space-y-1 text-center">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Community Circles</h1>
        <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto">
          Join or start recurring group Seva activities with local neighbors.
        </p>
      </header>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Action to Toggle Create Form */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-medium shadow-sm flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showCreate ? "Cancel" : "New Seva Circle"}</span>
        </button>
      </div>

      {/* Create Circle Form */}
      {showCreate && (
        <form onSubmit={handleCreateCircle} className="max-w-md mx-auto p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-stone-900">Start a Recurring Circle</h2>

          <div>
            <label className="text-xs font-medium text-stone-600">Circle Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Lajpat Nagar Teaching Circle"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600">Recurring Activity</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekly Digital Literacy Help Desk"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600">Schedule</label>
            <input
              type="text"
              placeholder="e.g. Every Saturday 10 AM - 11:30 AM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-xs transition-all disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Circle"}
          </button>
        </form>
      )}

      {/* Circles List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">
          Loading Seva Circles...
        </div>
      ) : circles.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-white/60 rounded-2xl border border-amber-100 p-6 space-y-2">
          <p className="font-semibold text-stone-700">No active circles yet.</p>
          <p>Tap "New Seva Circle" above to create the first recurring group activity!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {circles.map((c) => (
            <div
              key={c.id}
              className="p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {c.member_count} Members
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {c.schedule}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-base text-stone-900">{c.group_name}</h3>
                <p className="text-xs text-stone-600 mt-0.5">{c.recurring_activity}</p>
              </div>

              {activeCircle === c.id ? (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200/60 shadow-inner h-64 flex flex-col">
                  <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between shrink-0">
                    <span>Community Messages</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">Joined</span>
                  </h4>
                  <div className="space-y-2 overflow-y-auto flex-1 mb-2 pr-1">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-lg text-xs shadow-sm border border-amber-100/50">
                        <span className={`font-semibold ${msg.color}`}>{msg.author}:</span> {msg.text}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="pt-2 flex gap-2 shrink-0 border-t border-amber-200/40">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    />
                    <button type="submit" className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => handleJoinCircle(c.id)}
                  className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-medium border border-amber-300 transition-colors"
                >
                  Join Circle
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notification Pop-up on Bottom Right */}
      {joinedMsg && (
        <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-emerald-50 text-emerald-900 text-sm font-medium border border-emerald-200 shadow-xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{joinedMsg}</span>
        </div>
      )}
    </main>
  );
}
