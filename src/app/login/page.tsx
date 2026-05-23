"use client";

import React, { useState, useEffect, startTransition, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Users, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions/login-actions";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract initial role from search parameters
  const initialRole = searchParams.get("role") === "admin" ? "admin" : "partner";
  
  const [role, setRole] = useState<"admin" | "partner">(initialRole);
  
  // React 19 useActionState for form handling
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Trigger redirects reactive to successful logins
  useEffect(() => {
    if (state?.success && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Circles with Golden Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Return to Home collection */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors text-xs uppercase tracking-widest font-semibold"
      >
        <ArrowLeft size={14} />
        <span>Return to Collection</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-10">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-[10px] block mb-3">
            Secure Entry Gate
          </span>
          <h2 className="text-4xl font-heading text-white tracking-wide">
            Stay <span className="italic text-amber-400 font-serif">Willas</span>
          </h2>
          <p className="text-xs text-white/40 mt-2 font-medium">Bespoke Holiday Homes & Private Estates</p>
        </div>

        {/* Dynamic Glass Login Container */}
        <div className="glass-premium border border-white/5 rounded-[32px] p-8 shadow-2xl relative">
          
          {/* Role Toggles Tabs */}
          <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setRole("partner")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                role === "partner"
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10 scale-102"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Users size={12} />
              Homeowner
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                role === "admin"
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/10 scale-102"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Lock size={12} />
              Admin Suite
            </button>
          </div>

          {/* Verification Warnings Frame */}
          {state?.error && (
            <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start animate-shake">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-red-400 leading-relaxed font-semibold">{state.error}</p>
            </div>
          )}

          <form action={(formData) => {
            formData.append("role", role);
            startTransition(() => {
              formAction(formData);
            });
          }} className="space-y-6">
            
            {/* Username / Email Input field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                {role === "admin" ? "Administrative ID" : "Homeowner Email"}
              </label>
              <div className="relative flex items-center">
                {role === "admin" ? (
                  <Users size={16} className="absolute left-4 text-white/30" />
                ) : (
                  <Mail size={16} className="absolute left-4 text-white/30" />
                )}
                <input
                  type={role === "admin" ? "text" : "email"}
                  name="username"
                  required
                  placeholder={role === "admin" ? "e.g. admin" : "e.g. owner@staywillas.com"}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors focus:ring-1 focus:ring-amber-500/25 placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Password Input field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                Security Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-white/30" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors focus:ring-1 focus:ring-amber-500/25 placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Hint message to guide dev users */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] text-white/40 leading-normal select-none">
              <p className="font-semibold text-amber-400/80 mb-0.5">🔒 Credentials Hint:</p>
              {role === "admin" ? (
                <span>ID: <code className="text-white/70">admin</code> | PW: <code className="text-white/70">staywillas2026</code></span>
              ) : (
                <span>Email: <code className="text-white/70">owner@staywillas.com</code> | PW: <code className="text-white/70">partner2026</code></span>
              )}
            </div>

            {/* Submit Auth session */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all font-black text-xs tracking-widest uppercase rounded-full py-4.5 shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>AUTHORIZING GATE...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & SIGN IN</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
