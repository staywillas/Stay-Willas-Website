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
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-4 text-white select-none">
      {/* Language Switcher Pill */}
      <div className="w-full flex items-center justify-center gap-1.5 mb-6 bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl shadow-md">
        <Globe size={14} className="text-[#DAA520] ml-2 mr-1 shrink-0" />
        <button
          type="button"
          onClick={() => onLangChange("en")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            lang === "en" ? "bg-[#DAA520] text-[#1B3564] shadow-sm" : "text-slate-300 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => onLangChange("hi")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            lang === "hi" ? "bg-[#DAA520] text-[#1B3564] shadow-sm" : "text-slate-300 hover:text-white"
          }`}
        >
          हिंदी
        </button>
        <button
          type="button"
          onClick={() => onLangChange("mr")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            lang === "mr" ? "bg-[#DAA520] text-[#1B3564] shadow-sm" : "text-slate-300 hover:text-white"
          }`}
        >
          मराठी
        </button>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DAA520] to-[#B8860B] flex items-center justify-center mx-auto mb-2.5 shadow-[0_8px_24px_rgba(218,165,32,0.3)]">
          <ShieldCheck size={28} className="text-[#1B3564] stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black tracking-wider uppercase font-heading text-white">
          Stay Willas <span className="text-[#DAA520]">Care</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          {t.villaName}
        </p>
      </div>

      {/* PIN Indicator Dots */}
      <div className="mb-6 w-full flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-3 flex items-center gap-1.5">
          <Lock size={12} className="text-[#DAA520]" />
          <span>{t.enterPin}</span>
        </div>

        <div className={`flex items-center gap-4 py-2 transition-transform ${isShaking ? "animate-shake" : ""}`}>
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

        {/* Error / Loading Feedback */}
        <div className="h-6 flex items-center justify-center mt-1">
          {isVerifying ? (
            <div className="flex items-center gap-1.5 text-xs text-[#DAA520] font-bold">
              <Loader2 size={13} className="animate-spin" />
              <span>{t.loggingIn}</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-400 font-bold text-center">{error}</span>
          ) : null}
        </div>
      </div>

      {/* Tactile Touch Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[290px] mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit.toString())}
            disabled={isVerifying}
            className="w-full aspect-square rounded-2xl bg-slate-800/90 hover:bg-[#1B3564] border border-slate-700/80 active:bg-[#DAA520] active:text-[#1B3564] active:scale-95 text-2xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={isVerifying || pin.length === 0}
          className="w-full aspect-square rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-xs uppercase font-bold text-slate-400 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          C
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          onClick={() => handleDigit("0")}
          disabled={isVerifying}
          className="w-full aspect-square rounded-2xl bg-slate-800/90 hover:bg-[#1B3564] border border-slate-700/80 active:bg-[#DAA520] active:text-[#1B3564] active:scale-95 text-2xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
        >
          0
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isVerifying || pin.length === 0}
          aria-label="Delete"
          className="w-full aspect-square rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 transition-all flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          <Delete size={20} />
        </button>
      </div>

      {/* Role PIN Quick-Reference Cards (Super Easy for Staff) */}
      <div className="w-full max-w-[290px] grid grid-cols-3 gap-2">
        <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-center">
          <span className="text-[10px] text-slate-400 font-bold block">{t.caretakerRole}</span>
          <span className="text-xs font-mono font-bold text-[#DAA520] block mt-0.5">1122</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-center">
          <span className="text-[10px] text-slate-400 font-bold block">{t.chefRole}</span>
          <span className="text-xs font-mono font-bold text-[#DAA520] block mt-0.5">3344</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl text-center">
          <span className="text-[10px] text-slate-400 font-bold block">{t.adminRole}</span>
          <span className="text-xs font-mono font-bold text-[#DAA520] block mt-0.5">9900</span>
        </div>
      </div>
    </div>
  );
}
