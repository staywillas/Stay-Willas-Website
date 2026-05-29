"use client";

import React, { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Users, Loader2, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions/login-actions";

interface LoginFormProps {
  role: "admin" | "partner";
}

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      router.push(role === "admin" ? "/admin" : "/homeowner");
      router.refresh();
    }
  }, [state, router, role]);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[#C9A84C] font-montserrat font-semibold tracking-[0.3em] uppercase text-[10px] block mb-3">
          {role === "admin" ? "Administrative Suite" : "Homeowner Portal"}
        </span>
        <h1 className="font-cormorant text-5xl text-[#1B3564] leading-tight mb-3">
          Sign In to{" "}
          <span className="italic font-medium text-[#C9A84C]">Stay Willas</span>
        </h1>
        <p className="text-[#1B3564]/50 font-montserrat text-sm leading-relaxed">
          {role === "admin" 
            ? "Access the administrative dashboard to manage bookings and villas." 
            : "Access the homeowner dashboard to sync calendars and view earnings."
          }
        </p>
      </div>

      {/* Custom Login Form */}
      <div className="bg-white border border-[#DAA520]/15 rounded-3xl p-8 shadow-[0_8px_40px_rgba(27,53,100,0.10)]">
        {state?.error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start animate-shake">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-red-500 font-semibold leading-relaxed">{state.error}</p>
          </div>
        )}

        <form action={(formData) => {
          formData.append("role", role);
          startTransition(() => {
            formAction(formData);
          });
        }} className="space-y-6">
          
          {/* Username/Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1B3564]/50 uppercase tracking-widest text-left">
              {role === "admin" ? "Administrative ID" : "Homeowner Email"}
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
                placeholder={role === "admin" ? "e.g. admin" : "e.g. owner@staywillas.com"}
                className="w-full bg-[#FAFAFA] border border-[#DAA520]/25 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-[#1B3564] focus:outline-none focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/20 transition-all placeholder:text-[#1B3564]/30"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-[#1B3564]/50 uppercase tracking-widest text-left">Security Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-4 text-[#1B3564]/40" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#FAFAFA] border border-[#DAA520]/25 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-[#1B3564] focus:outline-none focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/20 transition-all placeholder:text-[#1B3564]/30"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white font-montserrat font-black tracking-widest uppercase text-xs rounded-full py-4.5 transition-all duration-300 shadow-[0_0_20px_rgba(27,53,100,0.15)] hover:shadow-[0_0_30px_rgba(27,53,100,0.3)] flex items-center justify-center gap-2 cursor-pointer border-none"
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
      </div>
    </div>
  );
}
