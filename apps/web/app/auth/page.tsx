"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      if (isForgotPassword) {
        alert("Password reset link sent to your email!");
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (!isLogin) {
        // Sign Up successful, go to Login
        // Save initial profile details
        localStorage.setItem("user_profile", JSON.stringify({
          name: name,
          cityArea: cityArea,
          primarySkill: primarySkill,
          timeAvailability: "Weekends",
          learningInterests: "",
          resourcesOffered: ""
        }));
        
        alert("Account created successfully! Please log in.");
        setIsLogin(true);
        setPassword("");
      } else {
        // Login successful, go to Home
        localStorage.setItem("user_name", name || "Seeker (Demo)");
        // Dispatch event so Navbar can update immediately
        window.dispatchEvent(new Event('auth-change'));
        router.push("/home");
      }
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-stone-200/50">
        
        {/* Left Side: Philosophy / Quote (Hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-700 to-amber-900 p-12 flex-col justify-between relative overflow-hidden text-amber-50">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-rose-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-serif font-bold tracking-tight mb-2">Seva-Sadhana</h2>
              <div className="w-16 h-1 bg-amber-400/60 rounded-full" />
            </Link>
          </div>

          <div className="relative z-10 space-y-6 max-w-md">
            <Sparkles className="w-12 h-12 text-amber-300" />
            <h1 className="text-5xl font-serif font-bold leading-tight">
              {isLogin ? "Welcome back to the path." : "Begin your journey of selfless action."}
            </h1>
            <p className="text-xl text-amber-200/90 italic font-serif">
              "We serve not to elevate ourselves, but to dissolve the ego. Every act of Seva is an opportunity for Sadhana."
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-stone-50">
          
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-4xl font-serif font-bold text-stone-900">
                {isForgotPassword ? "Reset Password" : isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-lg text-stone-600">
                {isForgotPassword 
                  ? "Enter your email to receive a password reset link."
                  : isLogin 
                    ? "Enter your credentials to continue your journey."
                    : "Join the community without leaderboards."}
              </p>
            </div>

            {/* Toggle Login/Signup (Hide on Forgot Password) */}
            {!isForgotPassword && (
              <div className="flex bg-stone-200 p-1 rounded-2xl relative">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${isLogin ? 'left-1' : 'left-[calc(50%+0.25rem)]'}`}
                />
                <button 
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-lg font-bold relative z-10 transition-colors ${isLogin ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Log In
                </button>
                <button 
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 text-lg font-bold relative z-10 transition-colors ${!isLogin ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className={`space-y-5 transition-all duration-300 ${!isLogin && !isForgotPassword ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden m-0'}`}>
                <div className="relative">
                  <label className="text-sm font-bold text-stone-700 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin && !isForgotPassword}
                      placeholder="Ananda"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-stone-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none text-lg transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm font-bold text-stone-700 mb-1 block">City / Area</label>
                  <input 
                    type="text" 
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    required={!isLogin && !isForgotPassword}
                    placeholder="e.g. South Delhi, Lajpat Nagar"
                    className="w-full px-4 py-4 bg-white border-2 border-stone-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none text-lg transition-all"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-bold text-stone-700 mb-1 block">Your Primary Skill (to offer)</label>
                  <input 
                    type="text" 
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    placeholder="e.g. Teaching Math, Web Dev, Cooking"
                    className="w-full px-4 py-4 bg-white border-2 border-stone-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none text-lg transition-all"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <label className="text-sm font-bold text-stone-700 mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seeker@ashram.org"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-stone-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none text-lg transition-all"
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                  <div className="relative">
                    <label className="text-sm font-bold text-stone-700 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!isForgotPassword}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-stone-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none text-lg transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-bold text-amber-700 hover:text-amber-800">Forgot password?</button>
                </div>
              )}
              
              {isForgotPassword && (
                <div className="text-center">
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="text-sm font-bold text-stone-500 hover:text-stone-800">Back to Log In</button>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xl rounded-2xl shadow-xl shadow-stone-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isForgotPassword ? "Send Reset Link" : isLogin ? "Sign In" : "Start Journey"}</span>
                    {!isForgotPassword && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>
            </form>

            {!isForgotPassword && (
              <>
                <div className="relative flex items-center justify-center mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-stone-200" />
                  </div>
                  <span className="relative bg-stone-50 px-4 text-sm font-bold text-stone-500">
                    Or continue with
                  </span>
                </div>

                <button type="button" className="w-full py-4 bg-white border-2 border-stone-200 hover:bg-stone-100 text-stone-800 font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 mt-8">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </>
            )}
            
          </div>
        </div>

      </div>
    </main>
  );
}
