"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Mic, Send, Bot, User, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  action?: string; // Optional URL to navigate to
}

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Namaste! I am SevaBot. How can I help you navigate the platform today? You can ask me about Radar, Barter, Inbox, or Spot a Need.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: "user" };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");

    // Simple keyword matching for routing / responses
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite catch that. Could you ask about Radar, Reporting a need, Bartering, or your Inbox?";
      let routeAction = "";

      const lowerText = userText.toLowerCase();

      if (lowerText.includes("radar") || lowerText.includes("opportunity") || lowerText.includes("find seva")) {
        botResponse = "The Radar helps you find nearby Seva opportunities matched to your skills. Let me take you there!";
        routeAction = "/radar";
      } else if (lowerText.includes("report") || lowerText.includes("spot") || lowerText.includes("photo")) {
        botResponse = "You can report a local need by uploading a photo and GPS location. Let's go to the Spot & Report page.";
        routeAction = "/report";
      } else if (lowerText.includes("barter") || lowerText.includes("exchange") || lowerText.includes("need something")) {
        botResponse = "Our Seva Barter Exchange lets you offer your skills in exchange for what you need. Navigating to Barter Match now.";
        routeAction = "/barter";
      } else if (lowerText.includes("inbox") || lowerText.includes("blessing") || lowerText.includes("gratitude") || lowerText.includes("thank you")) {
        botResponse = "You can read gratitude notes from people you have helped in your Blessings Inbox. Opening it now.";
        routeAction = "/inbox";
      } else if (lowerText.includes("home") || lowerText.includes("dashboard")) {
        botResponse = "Taking you back to your main dashboard.";
        routeAction = "/home";
      } else if (lowerText.includes("how to help") || lowerText.includes("want to help") || lowerText.includes("guide me") || lowerText.includes("kya karu") || lowerText.includes("kaise help") || lowerText.includes("kaise karu")) {
        botResponse = "It's beautiful that you want to help! The best way to start is by checking the 'Radar' for local needs, or 'Spot a Need' if you saw someone today. But remember, the actual act of helping is secondary; the primary goal is your inner intention. Do you want me to take you to the Radar?";
      } else if (lowerText.includes("superior") || lowerText.includes("inferior") || lowerText.includes("ego") || lowerText.includes("arrogance") || lowerText.includes("ahankar") || lowerText.includes("bada") || lowerText.includes("samjhu")) {
        botResponse = "This is the core of Seva-Sadhana. When we help someone, we must never feel superior. The person receiving help is not inferior. In fact, they are giving us a precious opportunity to purify our own ego. Seva is a mirror for our own spiritual growth. We serve with extreme humility, keeping dignity first.";
      } else if (lowerText.includes("what is seva") || lowerText.includes("philosophy") || lowerText.includes("meaning")) {
        botResponse = "Seva means selfless service. But here, it is 'Seva-Sadhana'—service as a spiritual practice. Technology is just the enabler, but the real work happens inside your heart. We don't have leaderboards because Seva shouldn't feed the ego.";
      } else {
        botResponse = "That is a noble thought. Remember, in Seva-Sadhana, the giver and receiver are equal. We serve not to feel superior, but to dissolve our ego. If you'd like to find an opportunity to practice this, you can visit the Radar or Barter pages.";
      }

      const botMsg: Message = { id: Date.now() + 1, text: botResponse, sender: "bot", action: routeAction };
      setMessages(prev => [...prev, botMsg]);

      // If action exists, navigate after a short delay
      if (routeAction) {
        setTimeout(() => {
          router.push(routeAction);
          setIsOpen(false); // Optionally close chat after routing
        }, 2000);
      }
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-amber-700 hover:scale-110 transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-amber-600" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border-2 border-amber-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight">SevaBot Guide</h3>
                <p className="text-amber-100 text-[10px] font-medium">Voice & Text Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === "user" 
                    ? "bg-amber-100 text-stone-800 rounded-tr-sm" 
                    : "bg-white border border-stone-200 text-stone-700 rounded-tl-sm shadow-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-end">
                <div className="bg-stone-200 text-stone-600 p-3 rounded-2xl rounded-tr-sm text-sm animate-pulse flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Listening...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0">
            <button
              onClick={toggleListen}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask or say something..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
