"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setAccessToken, apiClient } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  displayName?: string;
  systemRole: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Attempt silent refresh on mount to restore session
    const initAuth = async () => {
      try {
        const res = await apiClient.post("/auth/refresh");
        const token = res.data.accessToken;
        setAccessToken(token);

        // Fetch user profile to get details
        const profileRes = await apiClient.get("/profile");
        setUser({
          id: profileRes.data.userId,
          email: "user@example.com", // Normally returned from /profile or decode JWT
          displayName: profileRes.data.displayName,
          systemRole: "participant", // Normally decoded from token
        });
      } catch (e) {
        // Not logged in or refresh failed
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to global unauthorized events from api-client
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = (accessToken: string, newUser: User) => {
    setAccessToken(accessToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {
      // Ignore errors on logout
    }
    setAccessToken(null);
    setUser(null);
    queryClient.clear(); // Clear all cached tanstack queries
    
    // Only redirect if not already on the homepage
    if (typeof window !== 'undefined' && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
