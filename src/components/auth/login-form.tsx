"use client";

import React, { useState, startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Users, Loader2, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { loginAction } from "@/app/actions/login-actions";

interface LoginFormProps {
  role: "guest" | "admin" | "partner";
  redirectUrl?: string;
  showHeader?: boolean;
}

export default function LoginForm({ role, redirectUrl, showHeader = true }: LoginFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  const getRoleHeader = () => {
    switch (role) {
      case "admin":
        return {
          eyebrow: "Operations Gate",
          title: "Administrative Suite",
          desc: "Manage villa inventory, reservations, and rates.",
        };
      case "partner":
        return {
          eyebrow: "Homeowner Network",
          title: "Partner Portal",
          desc: "Access calendar sync, occupancy data, and villa analytics.",
        };
      case "guest":
      default:
        return {
          eyebrow: "Luxury Stays",
          title: "Guest Portal",
          desc: "Access your bookings, wishlist, and concierge services.",
        };
    }
  };

  const headerInfo = getRoleHeader();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      {showHeader && (
        <div className="text-center mb-8">
          <span className="text-[#C9A84C] font-montserrat font-semibold tracking-[0.3em] uppercase text-[10px] block mb-2">
            {headerInfo.eyebrow}
          </span>
          <h2 className="font-cormorant text-4xl sm:text-5xl text-[#1B3564] leading-tight mb-2">
            {headerInfo.title}
          </h2>
          <p className="text-[#1B3564]/60 font-montserrat text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            {headerInfo.desc}
          </p>
        </div>
      )}

      {/* Custom Login Form */}
      <div className="bg-white border border-[#DAA520]/20 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(27,53,100,0.08)]">
        {state?.error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start animate-shake">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-red-500 font-semibold leading-relaxed">{state.error}</p>
          </div>
        )}

        {role === "guest" && (
          <div className="mb-6 p-3.5 bg-[#FAF8F3] border border-[#DAA520]/20 rounded-2xl flex items-center gap-2.5 text-[11px] text-[#1B3564]/70">
            <Sparkles size={14} className="text-[#C9A84C] shrink-0" />
            <span>New guest? Enter your email & create a password to sign in instantly.</span>
          </div>
        )}

        <form
          action={(formData) => {
            formData.append("role", role);
            if (redirectUrl) {
              formData.append("redirect", redirectUrl);
            }
            startTransition(() => {
              formAction(formData);
            });
          }}
          className="space-y-5"
        >
          {/* Username/Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#1B3564]/60 uppercase tracking-widest text-left">
              {role === "admin"
                ? "Administrative ID"
                : role === "partner"
                ? "Homeowner Email"
                : "Email Address"}
            </label>
            <div className="relative flex items-center">
              {role === "admin" ? (
                <Users size={16} className="absolute left-4 text-[#1B3564]/40" />
              ) : (
                <Mail size={16} className="absolute left-4 text-[#1B3564]/40" />
              )}
              <input
                type={role === "admin" ? "text" : "email"}
                name="username"
                required
                autoComplete={role === "admin" ? "username" : "email"}
                placeholder={
                  role === "admin"
                    ? "e.g. admin"
                    : role === "partner"
                    ? "e.g. owner@staywillas.com"
                    : "e.g. guest@example.com"
                }
                className="w-full bg-[#FAFAFA] border border-[#DAA520]/25 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-[#1B3564] focus:outline-none focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/20 transition-all placeholder:text-[#1B3564]/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#1B3564]/60 uppercase tracking-widest text-left">
                {role === "guest" ? "Security Password" : "Password"}
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-[#1B3564]/40" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#FAFAFA] border border-[#DAA520]/25 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-medium text-[#1B3564] focus:outline-none focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/20 transition-all placeholder:text-[#1B3564]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#1B3564]/40 hover:text-[#1B3564] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white font-montserrat font-bold tracking-widest uppercase text-xs rounded-full py-4 transition-all duration-300 shadow-[0_4px_20px_rgba(27,53,100,0.18)] hover:shadow-[0_6px_25px_rgba(27,53,100,0.3)] flex items-center justify-center gap-2 cursor-pointer border-none mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>SIGNING IN...</span>
              </>
            ) : role === "admin" ? (
              <span>ENTER ADMIN SUITE</span>
            ) : role === "partner" ? (
              <span>SIGN IN TO PARTNER PORTAL</span>
            ) : (
              <span>ENTER GUEST PORTAL</span>
            )}
          </button>
        </form>

        {role === "admin" && (
          <p className="text-center text-[#1B3564]/40 font-montserrat text-[10px] mt-4">
            Default credentials: ID: <code className="text-[#1B3564]/70 font-semibold">admin</code> • Pass: <code className="text-[#1B3564]/70 font-semibold">staywillas2026</code>
          </p>
        )}
        {role === "partner" && (
          <p className="text-center text-[#1B3564]/40 font-montserrat text-[10px] mt-4">
            Partner access: <code className="text-[#1B3564]/70 font-semibold">owner@staywillas.com</code> • Pass: <code className="text-[#1B3564]/70 font-semibold">partner2026</code>
          </p>
        )}
      </div>
    </div>
  );
}
