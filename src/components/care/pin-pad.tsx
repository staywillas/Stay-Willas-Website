"use client";

import React, { useState } from "react";
import { Lock, Delete, Loader2, Sparkles, ShieldCheck } from "lucide-react";

interface PinPadProps {
  onSuccess: (session: any) => void;
  verifyPinAction: (pin: string) => Promise<{ success: boolean; session?: any; error?: string }>;
}

export default function PinPad({ onSuccess, verifyPinAction }: PinPadProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleDigit = async (digit: string) => {
    if (isVerifying || pin.length >= 4) return;
    setError("");

    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setIsVerifying(true);
      try {
        const result = await verifyPinAction(newPin);
        if (result.success && result.session) {
          onSuccess(result.session);
        } else {
          setIsShaking(true);
          setError(result.error || "Incorrect PIN code");
          setTimeout(() => {
            setPin("");
            setIsShaking(false);
          }, 600);
        }
      } catch (err: any) {
        setIsShaking(true);
        setError("Verification error");
        setTimeout(() => {
          setPin("");
          setIsShaking(false);
        }, 600);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleDelete = () => {
    if (isVerifying) return;
    setError("");
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isVerifying) return;
    setError("");
    setPin("");
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-6 text-white select-none">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center mx-auto mb-3 shadow-[0_10px_30px_rgba(218,165,32,0.3)]">
          <ShieldCheck size={32} className="text-[#1B3564] stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black tracking-wider uppercase font-heading text-white">
          Stay Willas <span className="text-[#DAA520]">Care</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1">
          The Angle House Operations • Kamshet, Lonavala
        </p>
      </div>

      {/* PIN Dots Display */}
      <div className="mb-6 w-full flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-3 flex items-center gap-1.5">
          <Lock size={12} className="text-[#DAA520]" />
          <span>Enter 4-Digit Access PIN</span>
        </div>

        <div className={`flex items-center gap-4 py-3 transition-transform ${isShaking ? "animate-shake" : ""}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  isFilled
                    ? "bg-[#DAA520] border-[#DAA520] scale-125 shadow-[0_0_12px_rgba(218,165,32,0.7)]"
                    : "border-slate-500 bg-slate-800/60"
                }`}
              />
            );
          })}
        </div>

        {/* Status / Error Message */}
        <div className="h-6 mt-2 flex items-center justify-center">
          {isVerifying ? (
            <div className="flex items-center gap-2 text-xs text-[#DAA520] font-bold animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              <span>Verifying PIN...</span>
            </div>
          ) : error ? (
            <span className="text-xs font-bold text-rose-400">{error}</span>
          ) : (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Instant access • No password needed
            </span>
          )}
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num.toString())}
            disabled={isVerifying}
            className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#DAA520] active:text-[#1B3564] border border-white/10 text-2xl font-black text-white transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {num}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={isVerifying || pin.length === 0}
          className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          Clear
        </button>

        {/* 0 Key */}
        <button
          type="button"
          onClick={() => handleDigit("0")}
          disabled={isVerifying}
          className="h-16 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-[#DAA520] active:text-[#1B3564] border border-white/10 text-2xl font-black text-white transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          0
        </button>

        {/* Backspace Key */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isVerifying || pin.length === 0}
          className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          <Delete size={20} />
        </button>
      </div>

      {/* Role PIN Quick Reference Pill for Staff */}
      <div className="w-full bg-[#122A54]/80 border border-[#DAA520]/20 rounded-2xl p-3.5 text-center">
        <span className="text-[10px] uppercase font-bold text-[#DAA520] tracking-wider block mb-1.5 flex items-center justify-center gap-1">
          <Sparkles size={11} />
          Role PIN Quick Reference
        </span>
        <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-200">
          <div className="bg-black/20 py-1 px-2 rounded-lg">
            <span className="text-slate-400 block text-[9px] uppercase">Caretaker</span>
            <strong className="text-[#DAA520] font-mono font-bold">1122</strong>
          </div>
          <div className="bg-black/20 py-1 px-2 rounded-lg">
            <span className="text-slate-400 block text-[9px] uppercase">Chef</span>
            <strong className="text-[#DAA520] font-mono font-bold">3344</strong>
          </div>
          <div className="bg-black/20 py-1 px-2 rounded-lg">
            <span className="text-slate-400 block text-[9px] uppercase">Admin</span>
            <strong className="text-[#DAA520] font-mono font-bold">9900</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
