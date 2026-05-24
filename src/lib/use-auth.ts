"use client";

import { useState, useEffect } from "react";
import { logoutAction } from "@/app/actions/login-actions";

export interface UserSession {
  email: string;
  role: "admin" | "partner" | "guest";
  name: string;
  id: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!);
    return null;
  };

  const refreshSession = () => {
    try {
      const userCookie = getCookie("staywillas_user");
      if (userCookie) {
        const parsed = JSON.parse(userCookie) as UserSession;
        setUser(parsed);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
    } catch (e) {
      console.error("Failed to parse staywillas_user cookie:", e);
      setUser(null);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
    
    // Listen for cookie changes reactively in background
    const interval = setInterval(refreshSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await logoutAction();
    setUser(null);
    setIsSignedIn(false);
    setIsLoading(false);
    
    // Fast redirect back to home page
    window.location.href = "/";
  };

  return {
    user,
    isSignedIn,
    isLoading,
    signOut,
    refreshSession
  };
}
