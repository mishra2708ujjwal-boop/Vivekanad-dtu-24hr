"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Heart, Sparkles, Inbox as InboxIcon, CheckCircle2, Quote } from "lucide-react";
import Link from "next/link";

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "Rahul Desai",
    date: "Today, 10:30 AM",
    opportunity: "Math Tutoring",
    message: "Bhaiya, thank you so much for explaining algebra to me yesterday. I gave my test today and I was able to solve all the questions! Your 1 hour of help really saved me.",
    read: false,
  },
  {
    id: 2,
    sender: "Elderly Neighbor (via app)",
    date: "Yesterday, 6:15 PM",
    opportunity: "Groceries Pickup",
    message: "God bless you beta. My knees were hurting very badly and I couldn't walk to the market. The fresh vegetables you brought made my whole week. Sending lots of blessings your way.",
    read: true,
  },
  {
    id: 3,
    sender: "Animal Rescue NGO",
    date: "Oct 4, 2026",
    opportunity: "Website Fixes",
    message: "We just wanted to drop a quick note to say thank you. Because you fixed our donation button on the website, we received enough funds this weekend to cover food for 50 dogs!",
    read: true,
  }
];

export default function InboxPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);

  const unreadCount = messages.filter(m => !m.read).length;

  const handleOpenMessage = (id: number) => {
    setActiveMessageId(activeMessageId === id ? null : id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
  };

  return (
    <main className="min-h-screen bg-stone-50 p-6 space-y-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b-2 border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-sm font-bold shadow-sm mb-3">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <span>Gratitude Notes</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-stone-900 tracking-tight">
              Blessings Inbox
            </h1>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm">
              <InboxIcon className="w-8 h-8 text-stone-600" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </div>
            )}
          </div>
        </header>

        <p className="text-stone-600 text-xl font-serif italic border-l-4 border-rose-400 pl-4 py-2">
          "True Seva is done without expectation of reward. But the sincere gratitude of a helped soul is the greatest blessing one can receive."
        </p>

        {/* Message List */}
        <div className="space-y-4 pt-4">
          {messages.map((msg) => {
            const isActive = activeMessageId === msg.id;
            
            return (
              <div 
                key={msg.id} 
                className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${
                  !msg.read ? "border-rose-300 shadow-lg shadow-rose-100" : "border-stone-200 shadow-sm opacity-90"
                }`}
              >
                {/* Message Header (Clickable) */}
                <button 
                  onClick={() => handleOpenMessage(msg.id)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                    !msg.read ? "bg-rose-100 text-rose-600" : "bg-stone-100 text-stone-500"
                  }`}>
                    {msg.read ? <CheckCircle2 className="w-7 h-7" /> : <Mail className="w-7 h-7" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-serif text-2xl ${!msg.read ? "font-bold text-stone-900" : "font-semibold text-stone-700"}`}>
                        {msg.sender}
                      </h3>
                      <span className="text-sm font-bold text-stone-500">{msg.date}</span>
                    </div>
                    <p className={`text-lg truncate max-w-sm ${!msg.read ? "text-stone-800 font-bold" : "text-stone-500"}`}>
                      Regarding: {msg.opportunity}
                    </p>
                  </div>
                </button>

                {/* Message Body (Expanded) */}
                {isActive && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50">
                    <div className="relative p-6 bg-white rounded-2xl shadow-inner border border-stone-100 mt-4">
                      <Quote className="absolute top-4 left-4 w-10 h-10 text-rose-100 -z-10 transform -rotate-12" />
                      <p className="text-xl text-stone-800 leading-relaxed font-serif relative z-10 pl-6">
                        {msg.message}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-rose-600 font-bold justify-end">
                        <Sparkles className="w-5 h-5" />
                        Blessing Received
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
