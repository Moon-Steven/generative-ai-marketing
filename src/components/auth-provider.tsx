"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  planTier: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        // Check if we already have a valid session
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.data);
          setLoading(false);
          return;
        }

        // No valid session — auto-login with demo account
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: "admin@generative-ai-marketing.com" }),
        });

        if (loginRes.ok) {
          const loginData = await loginRes.json();
          setUser(loginData.data.user);
        } else {
          console.error("Login failed:", loginRes.status);
        }
      } catch (e) {
        console.error("Auth init failed:", e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
