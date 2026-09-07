"use client";

import React, { useState } from "react";
import { Lock, Delete, Loader2, ShieldCheck, Globe } from "lucide-react";
import { CareLanguage, translations } from "@/lib/care-translations";

interface PinPadProps {
  onSuccess: (session: any) => void;
  verifyPinAction: (pin: string) => Promise<{ success: boolean; session?: any; error?: string }>;
  lang: CareLanguage;
  onLangChange: (lang: CareLanguage) => void;
}

export default function PinPad({ onSuccess, verifyPinAction, lang, onLangChange }: PinPadProps) {
  const t = translations[lang] || translations.en;

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
          setError(result.error || t.invalidPin);
          setTimeout(() => {
            setPin("");
            setIsShaking(false);
          }, 600);
        }
      } catch (err: any) {
        setIsShaking(true);
        setError(t.invalidPin);
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
    <div className="w-full max-w-[270px] mx-auto flex flex-col items-center justify-center p-2 text-white select-none">
      {/* Language Switcher Pill (Compact) */}
      <div className="w-full flex items-center justify-center gap-1 mb-3 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-md">
        <Globe size={13} className="text-[#DAA520] ml-1 mr-0.5 shrink-0" />
        <button
          type="button"
          onClick={() => onLangChange("en")}
          className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
            lang === "en" ? "bg-[#DAA520] text-black shadow-xs" : "text-slate-300 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => onLangChange("hi")}
          className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
            lang === "hi" ? "bg-[#DAA520] text-black shadow-xs" : "text-slate-300 hover:text-white"
          }`}
        >
          हिंदी
        </button>
        <button
          type="button"
          onClick={() => onLangChange("mr")}
          className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
            lang === "mr" ? "bg-[#DAA520] text-black shadow-xs" : "text-slate-300 hover:text-white"
          }`}
        >
          मराठी
        </button>
      </div>

      {/* Brand Header (Compact) */}
      <div className="text-center mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center mx-auto mb-1.5 shadow-md">
          <ShieldCheck size={20} className="text-black stroke-[2.5]" />
        </div>
        <h1 className="text-lg font-black font-heading text-white tracking-wide leading-tight">
          {t.villaName}
        </h1>
      </div>

      {/* PIN Prompt & Dots */}
      <div className="mb-3 w-full flex flex-col items-center">
        <div className="text-xs font-bold text-[#DAA520] mb-2 flex items-center gap-1.5">
          <Lock size={12} className="text-[#DAA520]" />
          <span>{t.enterPin}</span>
        </div>

        <div className={`flex items-center gap-3 py-1 transition-transform ${isShaking ? "animate-shake" : ""}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  isFilled
                    ? "bg-[#DAA520] border-[#DAA520] scale-110 shadow-[0_0_10px_rgba(218,165,32,0.6)]"
                    : "border-slate-500 bg-slate-800/60"
                }`}
              />
            );
          })}
        </div>

        {/* Feedback / Error */}
        <div className="h-5 flex items-center justify-center mt-1">
          {isVerifying ? (
            <div className="flex items-center gap-1 text-[11px] text-[#DAA520] font-bold">
              <Loader2 size={12} className="animate-spin" />
              <span>{t.loggingIn}</span>
            </div>
          ) : error ? (
            <span className="text-[11px] text-red-400 font-bold text-center">{error}</span>
          ) : null}
        </div>
      </div>

      {/* Compact Tactile Touch Keypad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[230px] mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit.toString())}
            disabled={isVerifying}
            className="w-full aspect-square max-h-[58px] rounded-xl bg-slate-800/90 hover:bg-[#1B3564] border border-slate-700/80 active:bg-[#DAA520] active:text-black active:scale-95 text-xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={isVerifying || pin.length === 0}
          className="w-full aspect-square max-h-[58px] rounded-xl bg-slate-800/40 hover:bg-slate-800 text-[11px] uppercase font-bold text-slate-400 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          C
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          onClick={() => handleDigit("0")}
          disabled={isVerifying}
          className="w-full aspect-square max-h-[58px] rounded-xl bg-slate-800/90 hover:bg-[#1B3564] border border-slate-700/80 active:bg-[#DAA520] active:text-black active:scale-95 text-xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isVerifying || pin.length === 0}
          aria-label="Delete"
          className="w-full aspect-square max-h-[58px] rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          <Delete size={17} />
        </button>
      </div>

      {/* Discreet Help Notice */}
      <div className="w-full max-w-[230px] text-center pt-1">
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 shadow-xs">
          <Lock size={10} className="text-[#DAA520]" />
          <span>{t.helpText}</span>
        </div>
      </div>
    </div>
  );
}
