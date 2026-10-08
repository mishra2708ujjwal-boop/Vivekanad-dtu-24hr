"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("aarav@example.com"); // default to seed user
  const [password, setPassword] = useState("password123");
  const loginMutation = useLogin();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      router.push("/discover");
    } catch (err) {
      alert("Login failed! Did you run the seed script?");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-8 py-24 text-center">
        <h1 className="text-3xl font-serif text-deep mb-4">You are logged in!</h1>
        <button onClick={() => logout()} className="px-6 py-2 border border-primary text-primary rounded-full">Log out</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-8 py-24">
      <h1 className="text-4xl font-serif text-deep mb-8 text-center">Sign In</h1>
      <form onSubmit={handleLogin} className="space-y-4 bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-border/60 bg-bg focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-border/60 bg-bg focus:border-primary focus:outline-none"
          />
        </div>
        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="w-full py-3 mt-4 bg-primary text-ink font-medium rounded-full hover:bg-accent hover:text-white transition"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
