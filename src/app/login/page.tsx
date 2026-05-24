"use client";

import React, { useState, useEffect, startTransition, useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Users, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { loginAction, checkEmailAction } from "@/app/actions/login-actions";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract initial role from search parameters (defaults to guest)
  const roleParam = searchParams.get("role");
  const role = (roleParam === "admin" || roleParam === "partner") ? roleParam : "guest";

  const redirectParam = searchParams.get("redirect") || "";

  // Dynamic Login States (used for Guest role)
  // "email" -> user inputs email
  // "password" -> returning verified user inputs password
  // "register" -> new user inputs name to sign up
  // "unverified" -> account registered but email activation link has been sent
  const [step, setStep] = useState<"email" | "password" | "register" | "unverified">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [verificationSentMessage, setVerificationSentMessage] = useState("");

  // React 19 useActionState for form handling
  const [state, formAction, isPending] = useActionState(loginAction, null);

  // Trigger redirects reactive to successful logins
  useEffect(() => {
    if (state?.success) {
      if (state.isNewUser && state.message) {
        setVerificationSentMessage(state.message);
        setStep("unverified");
      } else if (state.redirectTo) {
        router.push(state.redirectTo);
        router.refresh();
      }
    }
  }, [state, router]);

  // Google-style 2-Step verification check
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setEmailCheckLoading(true);
    try {
      const result = await checkEmailAction(email);
      if (result.exists) {
        if (result.isVerified) {
          setStep("password");
        } else {
          setStep("unverified");
          setVerificationSentMessage("Your account is registered but unverified. We have resent the secure activation link to your inbox.");
        }
      } else {
        setStep("register");
      }
    } catch (err) {
      setEmailError("Failed to check registration state. Please try again.");
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setEmailCheckLoading(true);
    try {
      const formData = new FormData();
      formData.append("role", "guest");
      formData.append("username", email);
      formData.append("password", ""); // Trigger resend logic
      formData.append("redirect", redirectParam);
      
      startTransition(() => {
        formAction(formData);
      });
      setVerificationSentMessage("A fresh activation link has been dispatched to your email address!");
    } catch (err) {
      setEmailError("Failed to resend activation link. Please try again.");
    } finally {
      setEmailCheckLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Circles with Golden Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Return to Home collection */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors text-xs uppercase tracking-widest font-semibold animate-fade-in"
      >
        <ArrowLeft size={14} />
        <span>Return to Collection</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-10 select-none">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-[10px] block mb-3">
            {role === "admin" ? "Administrative Portal" : role === "partner" ? "Homeowner Portal" : "Secure Guest Entry"}
          </span>
          <h2 className="text-4xl font-heading text-white tracking-wide">
            Stay <span className="italic text-amber-400 font-serif">Willas</span>
          </h2>
          <p className="text-xs text-white/40 mt-2 font-medium">
            {role === "admin" ? "Internal System Administration Node" : role === "partner" ? "Homeowner Earnings & Availability Dashboard" : "Bespoke Holiday Homes & Private Estates"}
          </p>
        </div>

        {/* Dynamic Glass Login Container */}
        <div className="glass-premium border border-white/5 rounded-[32px] p-8 shadow-2xl relative transition-all duration-500">
          
          {/* Verification Warnings Frame */}
          {(state?.error || emailError) && (
            <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start animate-shake">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-red-400 leading-relaxed font-semibold">{state?.error || emailError}</p>
            </div>
          )}

          {/* Admin & Partner Standard Login Portal */}
          {role !== "guest" && (
            <form action={(formData) => {
              formData.append("role", role);
              if (redirectParam) {
                formData.append("redirect", redirectParam);
              }
              startTransition(() => {
                formAction(formData);
              });
            }} className="space-y-6">
              
              {/* Username Input field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">
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
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Security Password</label>
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

              {/* Credentials Hint */}
              <div className="p-3 bg-slate-950 border border-white/10 rounded-xl text-[10px] text-white/60 leading-normal select-none text-left">
                <p className="font-semibold text-amber-400 mb-0.5">🔒 Credentials Hint:</p>
                {role === "admin" ? (
                  <span>ID: <code className="text-white font-bold">admin</code> | PW: <code className="text-white font-bold">staywillas2026</code></span>
                ) : (
                  <span>Email: <code className="text-white font-bold">owner@staywillas.com</code> | PW: <code className="text-white font-bold">partner2026</code></span>
                )}
              </div>

              {/* Submit Portal */}
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
                  <span>CONFIRM & SIGN IN</span>
                )}
              </button>
            </form>
          )}

          {/* Guest Verified 2-Step Login Portal */}
          {role === "guest" && (
            <div className="space-y-6">
              
              {/* STEP 1: Enter Email address */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Your Email Address</label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-4 text-white/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g. traveler@gmail.com"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors focus:ring-1 focus:ring-amber-500/25 placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={emailCheckLoading}
                    className="w-full bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all font-black text-xs tracking-widest uppercase rounded-full py-4.5 shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none animate-fade-in"
                  >
                    {emailCheckLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>CHECKING CREDENTIALS...</span>
                      </>
                    ) : (
                      <span>CONTINUE</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2A: Returning Verified Guest Password Prompt */}
              {step === "password" && (
                <form action={(formData) => {
                  formData.append("role", "guest");
                  formData.append("username", email);
                  if (redirectParam) {
                    formData.append("redirect", redirectParam);
                  }
                  startTransition(() => {
                    formAction(formData);
                  });
                }} className="space-y-6 animate-fade-in">
                  
                  <div className="text-left bg-slate-950 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest block">Returning Guest</span>
                      <span className="text-xs text-white/60 font-semibold truncate block mt-0.5 max-w-[200px]">{email}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep("email")}
                      className="text-[9px] text-amber-500 font-black hover:underline tracking-widest uppercase cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Your Security Password</label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-4 text-white/30" />
                      <input
                        type="password"
                        name="password"
                        required
                        autoFocus
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors focus:ring-1 focus:ring-amber-500/25 placeholder:text-white/20"
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
                        <span>VERIFYING PASSWORD...</span>
                      </>
                    ) : (
                      <span>CONFIRM & SIGN IN</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2B: Brand-New Guest Signup Name Prompt */}
              {step === "register" && (
                <form action={(formData) => {
                  formData.append("role", "guest");
                  formData.append("username", email);
                  if (redirectParam) {
                    formData.append("redirect", redirectParam);
                  }
                  startTransition(() => {
                    formAction(formData);
                  });
                }} className="space-y-6 animate-fade-in">
                  
                  <div className="text-left bg-slate-950 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest block">New Account Registration</span>
                      <span className="text-xs text-white/60 font-semibold truncate block mt-0.5 max-w-[200px]">{email}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep("email")}
                      className="text-[9px] text-amber-500 font-black hover:underline tracking-widest uppercase cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest text-left">Your Full Name</label>
                    <div className="relative flex items-center">
                      <Users size={16} className="absolute left-4 text-white/30" />
                      <input
                        type="text"
                        name="password" // Reused to pass fullname inside the action payload
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors focus:ring-1 focus:ring-amber-500/25 placeholder:text-white/20"
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
                        <span>DISPATCHING ACTIVATION...</span>
                      </>
                    ) : (
                      <span>REGISTER & SEND ACTIVATION</span>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2C: Registered Unverified Guest Prompt */}
              {step === "unverified" && (
                <div className="space-y-6 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/5">
                    <Mail size={28} className="animate-pulse" />
                  </div>
                  <div className="space-y-2 select-none">
                    <h3 className="text-lg font-heading text-white">Email Activation Required</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-semibold">{verificationSentMessage || "A verification link has been sent to your email inbox."}</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-[10px] text-white/50 leading-normal text-left font-medium select-none">
                    <p className="font-semibold text-amber-400 mb-1">💡 What should I do now?</p>
                    <p className="mb-2">1. Open your email inbox for <strong className="text-white">{email}</strong>.</p>
                    <p className="mb-2">2. Click the <strong className="text-white">Activate Account & Set Password</strong> link.</p>
                    <p>3. Choose a password to secure your account. Once verified, you can immediately confirm booking reservations via WhatsApp!</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleResendVerification}
                      disabled={emailCheckLoading}
                      className="w-full bg-amber-500 text-slate-950 hover:bg-amber-600 transition-all font-black text-xs tracking-widest uppercase rounded-full py-4 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
                    >
                      {emailCheckLoading ? (
                        <>
                          <RefreshCw className="animate-spin" size={14} />
                          <span>SENDING NEW LINK...</span>
                        </>
                      ) : (
                        <span>RESEND ACTIVATION EMAIL</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setStep("email");
                        setEmailError("");
                      }}
                      className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase font-bold py-2 cursor-pointer"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
