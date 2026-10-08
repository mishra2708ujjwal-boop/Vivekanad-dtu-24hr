"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function AuthButton() {
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      setUserName(localStorage.getItem("user_name"));
    };
    
    // Check initially
    checkAuth();
    
    // Listen for custom auth events
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  if (userName) {
    return (
      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-full hover:bg-amber-200 transition-all shadow-sm">
        <User className="w-5 h-5" />
        <span className="max-w-[120px] truncate">{userName}</span>
      </Link>
    );
  }

  return (
    <Link href="/auth" className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-sm">
      Sign In
    </Link>
  );
}
