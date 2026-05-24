"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { verifyAndSetupPasswordAction } from "@/app/actions/login-actions";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const redirect = searchParams.get("redirect") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Activation token is missing. Please check your email link again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your typing.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await verifyAndSetupPasswordAction(token, password, redirect);
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push(result.redirectTo || "/dashboard");
            router.refresh();
          }, 1500);
        } else {
          setError(result.error || "Activation failed. The token may be expired or invalid.");
        }
      } catch (err) {
        setError("A network error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-10 select-none">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-[10px] block mb-3">
            Secure Activation Node
          </span>
          <h2 className="text-4xl font-heading text-white tracking-wide">
            Stay <span className="italic text-amber-400 font-serif">Willas</span>
          </h2>
          <p className="text-xs text-white/40 mt-2 font-medium">Configure password and verify your guest profile</p>
        </div>

        {/* Dynamic Glass Verification Container */}
        <div className="glass-premium border border-white/5 rounded-[32px] p-8 shadow-2xl relative">
          
          {/* Success activation card */}
          {success ? (
            <div className="text-center py-6 space-y-4 animate-fade-in select-none">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/5">
                <Check size={28} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-heading text-white">Account Activated!</h3>
                <p className="text-xs text-white/50 mt-1 font-semibold">Redirecting you to Stay Willas Collection...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start animate-shake">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-red-400 leading-relaxed font-semibold">{error}</p>
                </div>
              )}

              {!token ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-heading text-white font-bold">Invalid Activation Link</h3>
                    <p className="text-xs text-white/40 mt-2 leading-relaxed">This setup link appears to be broken or expired. Please attempt to register or sign in again on our secure login page.</p>
                  </div>
                  <Link 
                    href="/login" 
                    className="inline-block bg-amber-500 text-slate-950 font-black text-[10px] tracking-widest uppercase rounded-full px-8 py-3.5 mt-2 hover:bg-amber-600 transition-colors cursor-pointer"
                  >
                    Go to Secure Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-[10px] text-white/50 leading-normal select-none text-left">
                    <span className="font-semibold text-amber-400">🛡️ Set a password for your account:</span>
                    <span className="block mt-1">This secures your email address from being used by fake accounts or unauthorized bookings.</span>
                  </div>

                  {/* Choose Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Choose Password</label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-4 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Min 6 characters..."
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-white/30 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-4 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter password..."
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all font-black text-xs tracking-widest uppercase rounded-full py-4.5 shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>ACTIVATING SECURE ACCOUNT...</span>
                      </>
                    ) : (
                      <span>ACTIVATE & SIGN IN</span>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
