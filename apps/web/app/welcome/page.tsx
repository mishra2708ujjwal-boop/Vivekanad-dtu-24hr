"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState<"welcome" | "otp_request" | "otp_verify">("welcome");
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setLoading(true);
    setError("");
    try {
      await apiFetch("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ auth_identifier: identifier }),
      });
      setStep("otp_verify");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({
          auth_identifier: identifier,
          otp_code: otp,
          name: name || undefined,
        }),
      });

      localStorage.setItem("seva_token", res.access_token);
      localStorage.setItem("user_name", res.name);

      router.push("/sankalp");
    } catch (err: any) {
      setError(err.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pink-50 text-stone-800 flex flex-col justify-between p-6 max-w-6xl mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="pt-6 text-center">
        <div className="flex justify-center mb-5">
          <img
            src="https://akm-img-a-in.tosshub.com/aajtak/images/story/202401/65a0d568433d4-swami-vivekananda-jayanti-2024-120006920-16x9.jpg"
            alt="Swami Vivekananda"
            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-amber-200/60"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/80 text-pink-800 text-sm font-bold mb-4 shadow-sm border border-pink-200/60">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span>Dignified Service & Reflection</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-display font-extrabold text-pink-900 tracking-tight mt-2 mb-3">
          Seva-Sadhana
        </h1>
        <p className="text-lg md:text-xl text-pink-700/80 font-medium max-w-lg mx-auto">
          Where act of service meets inner mindfulness
        </p>
      </header>

      {/* 2-Column Layout */}
      <div className="flex flex-col md:flex-row items-center gap-12 my-auto py-8 w-full">
        
        {/* Left Column: Structured Info & Dummy Data */}
        <div className="flex-1 space-y-8 w-full hidden md:block">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-black text-pink-900">Why Join Seva Sadhana?</h2>
            <p className="text-lg text-pink-800/80 leading-relaxed font-medium">
              We believe that service is not just about helping others; it is a mirror for your own inner growth. Join thousands of practitioners who are serving their community with dignity, mindfulness, and zero public leaderboards.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-200/40 shadow-sm">
              <h3 className="text-5xl font-display font-black text-pink-600">12,450+</h3>
              <p className="text-sm font-medium text-pink-800/60 mt-1">Acts of Seva Completed</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-200/40 shadow-sm">
              <h3 className="text-5xl font-display font-black text-rose-500">8,200+</h3>
              <p className="text-sm font-medium text-pink-800/60 mt-1">Active Community Members</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-200/40 shadow-sm">
              <h3 className="text-5xl font-display font-black text-fuchsia-600">450+</h3>
              <p className="text-sm font-medium text-pink-800/60 mt-1">Active Seva Circles</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-200/40 shadow-sm">
              <h3 className="text-5xl font-display font-black text-pink-500">100%</h3>
              <p className="text-sm font-medium text-pink-800/60 mt-1">Private & Dignity-First</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-200/60">
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">What Our Members Say</h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50/80 rounded-lg text-xs text-stone-700 italic border-l-4 border-amber-400">
                "The focus on inner reflection rather than social media likes has completely changed how I volunteer." 
                <span className="block mt-1 font-semibold not-italic text-stone-900">— Rahul D.</span>
              </div>
              <div className="p-3 bg-amber-50/80 rounded-lg text-xs text-stone-700 italic border-l-4 border-emerald-400">
                "Teaching math to local kids became a lesson in patience for me. The private mirror feature is brilliant."
                <span className="block mt-1 font-semibold not-italic text-stone-900">— Priya K.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Flow */}
        <div className="w-full max-w-md flex-1 shrink-0">
        {step === "welcome" && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-pink-100 text-left space-y-4">
              <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />
                <span>I want to practice Seva</span>
              </h2>
              <p className="text-stone-700 text-base leading-relaxed font-medium">
                Connect with local opportunities based on intention, skill, and mutual respect — with no rankings, leaderboards, or fixed receiver labels.
              </p>

              <ul className="space-y-2 text-xs text-stone-600 pt-2 border-t border-amber-50">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Choose a daily inner Sankalp (intention)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Find dignity-first opportunities near you</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Private reflections to mirror your growth</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setStep("otp_request")}
              className="w-full py-4 px-4 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Begin Your Practice</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === "otp_request" && (
          <form onSubmit={handleRequestOtp} className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-pink-100 space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-stone-900">Sign in with Phone or Email</h2>
            <p className="text-xs text-stone-500">We send a simple OTP — no passwords to remember.</p>

            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-100">{error}</div>}

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700">Phone or Email Address</label>
              <input
                type="text"
                required
                placeholder="e.g. +91 9876543210 or user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Get OTP Code"}
            </button>

            <button
              type="button"
              onClick={() => setStep("welcome")}
              className="w-full text-xs text-stone-500 hover:text-stone-700 text-center pt-2"
            >
              Back to welcome
            </button>
          </form>
        )}

        {step === "otp_verify" && (
          <form onSubmit={handleVerifyOtp} className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-pink-100 space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-stone-900">Enter Verification Code</h2>
            <p className="text-xs text-stone-500">
              Sent to <span className="font-medium text-stone-800">{identifier}</span>
            </p>

            <div className="p-2.5 bg-pink-50 rounded-lg text-pink-800 text-xs flex items-center gap-2 border border-pink-200/60">
              <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0" />
              <span>Demo OTP: <strong className="font-mono text-stone-900">123456</strong></span>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-100">{error}</div>}

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="How should we address you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700">6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              type="button"
              onClick={() => setStep("otp_request")}
              className="w-full text-xs text-stone-500 hover:text-stone-700 text-center pt-2"
            >
              Change phone/email
            </button>
          </form>
        )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-400 py-4">
        Built with dignity • No leaderboards or point public scoring
      </footer>
    </main>
  );
}
