"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Home,
  Loader2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";
import {
  PARTNER_BLANK_TEMPLATE,
  PARTNER_WHATSAPP_NUMBER,
  encodeWhatsAppMessage,
  formatPartnerConfigurationMessage,
  getPartnerBlankWhatsAppUrl,
  type PartnerPropertyConfig,
} from "@/lib/whatsapp";

const initialConfig: PartnerPropertyConfig = {
  villaName: "",
  ownerName: "",
  phone: "",
  email: "",
  bedrooms: "",
  bathrooms: "",
  threePhaseMeter: "Yes",
  inverter: "Yes",
  inverterBatteries: "",
  generator: "No",
  generatorKva: "",
  undergroundTankLitres: "",
  overheadTankLitres: "",
  governmentWaterline: "Yes",
  acsInBedroom: "",
  acsInLivingRoom: "",
  caretakerAvailable: "Yes",
  separateCaretakerRoom: "Yes",
  googleLocation: "",
  plotSizeSqFt: "",
  equippedKitchen: "Yes",
  rentalExpectations: "",
};

function YesNoToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: "Yes" | "No") => void;
}) {
  return (
    <div className="inline-flex w-fit self-start shrink-0 rounded-xl border border-border-subtle bg-bg-secondary/60 p-1 gap-1">
      {(["Yes", "No"] as const).map((option) => {
        const active = value.toLowerCase() === option.toLowerCase();
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              active
                ? "bg-accent-primary text-white shadow-sm"
                : "text-text-primary/60 hover:text-text-primary"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const PartnerForm = () => {
  const [config, setConfig] = useState<PartnerPropertyConfig>(initialConfig);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState("");
  const [lastFormattedText, setLastFormattedText] = useState("");
  const [copiedBlank, setCopiedBlank] = useState(false);
  const [copiedFilled, setCopiedFilled] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof PartnerPropertyConfig>(
    field: K,
    value: PartnerPropertyConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const copyBlankTemplate = async () => {
    try {
      await navigator.clipboard.writeText(PARTNER_BLANK_TEMPLATE);
      setCopiedBlank(true);
      setTimeout(() => setCopiedBlank(false), 2500);
    } catch {}
  };

  const copyFilledDetails = async (textToCopy?: string) => {
    try {
      const text = textToCopy || formatPartnerConfigurationMessage(config);
      await navigator.clipboard.writeText(text);
      setCopiedFilled(true);
      setTimeout(() => setCopiedFilled(false), 2500);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.villaName.trim() || !config.ownerName.trim() || !config.phone?.trim()) {
      setError("Please fill in at least the Villa Name, Owner Name, and Phone Number.");
      return;
    }

    setError("");
    setLoading(true);

    const formattedMessage = formatPartnerConfigurationMessage(config);
    const waUrl = `https://wa.me/${PARTNER_WHATSAPP_NUMBER}?text=${encodeWhatsAppMessage(
      formattedMessage
    )}`;

    try {
      // Save lead to Admin Dashboard database (non-blocking for WhatsApp handoff if DB is unreachable)
      await submitInquiry({
        name: config.ownerName.trim(),
        email: config.email?.trim() || "no-email@staywillas.com",
        phone: config.phone.trim(),
        message: formattedMessage,
        type: "OWNER",
      }).catch(() => {});

      setLastWhatsappUrl(waUrl);
      setLastFormattedText(formattedMessage);
      setSuccess(true);
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-bg-primary border border-accent-secondary/25 rounded-[40px] p-8 md:p-12 text-center shadow-[0_10px_40px_rgba(44,31,14,0.08)] flex flex-col items-center justify-center min-h-[450px] animate-fade-in max-w-3xl mx-auto my-12">
        <div className="w-20 h-20 rounded-full bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-6">
          <CheckCircle2 size={44} />
        </div>
        <h3 className="text-3xl font-heading text-text-primary mb-3 italic">
          Property Configuration Ready on WhatsApp
        </h3>
        <p className="text-text-primary/60 text-sm max-w-lg leading-relaxed mb-8 mx-auto">
          We&apos;ve saved your property details and opened WhatsApp with your complete 17-point
          configuration pre-filled. Simply tap <strong>Send</strong> in WhatsApp to connect with
          our acquisitions team!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <a
            href={lastWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-widest shadow-lg transition-all"
          >
            <MessageCircle size={18} /> Open WhatsApp Again
          </a>
          <button
            type="button"
            onClick={() => copyFilledDetails(lastFormattedText)}
            className="inline-flex items-center gap-2 border border-border-subtle bg-white hover:border-accent-primary text-text-primary rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            {copiedFilled ? <Check size={16} /> : <Copy size={16} />}
            {copiedFilled ? "Copied Configuration!" : "Copy Formatted Text"}
          </button>
        </div>

        <Button
          onClick={() => {
            setSuccess(false);
            setConfig(initialConfig);
          }}
          className="border border-accent-primary/30 text-accent-primary hover:bg-accent-primary hover:text-white rounded-full px-8 py-4 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold bg-transparent"
        >
          Submit Another Property
        </Button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-border-subtle rounded-2xl px-5 py-3.5 focus:border-accent-primary outline-none transition-all text-text-primary text-sm placeholder:text-text-primary/30";
  const labelClass =
    "block text-[11px] font-bold uppercase tracking-wider text-text-primary/70 mb-2";

  return (
    <div
      id="partner-form"
      className="bg-bg-primary border border-border-subtle rounded-[36px] p-6 sm:p-10 md:p-12 shadow-[0_10px_40px_rgba(44,31,14,0.08)] max-w-5xl mx-auto my-12 scroll-mt-32"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center mx-auto mb-4">
          <Home size={24} />
        </div>
        <h3 className="text-3xl md:text-4xl font-heading text-text-primary italic">
          Property Configuration Checklist
        </h3>
        <p className="text-text-primary/55 text-sm mt-2 max-w-xl mx-auto">
          Kindly fill in these 17 configuration details so our team can evaluate your villa, or
          open the checklist directly in WhatsApp.
        </p>
      </div>

      {/* Hybrid Direct WhatsApp Banner */}
      <div className="bg-bg-secondary/80 border border-border-subtle rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#1f9d4c] flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-text-primary">
              Prefer to fill this directly inside WhatsApp?
            </p>
            <p className="text-[11px] sm:text-xs text-text-primary/55">
              Open WhatsApp with all 17 questions pre-loaded in your chat box, or copy the blank
              template.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={copyBlankTemplate}
            className="inline-flex items-center justify-center gap-2 border border-border-subtle bg-white hover:border-accent-primary text-text-primary rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-1 md:flex-initial"
          >
            {copiedBlank ? <Check size={14} /> : <Copy size={14} />}
            {copiedBlank ? "Copied!" : "Copy Template"}
          </button>
          <a
            href={getPartnerBlankWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap flex-1 md:flex-initial"
          >
            <MessageCircle size={15} /> Fill on WhatsApp
          </a>
        </div>
      </div>

      {/* 17-Point Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Owner & Property Identity */}
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Part 1 · Property & Owner Details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>1. Villa Name *</label>
              <input
                type="text"
                required
                value={config.villaName}
                onChange={(e) => updateField("villaName", e.target.value)}
                className={inputClass}
                placeholder="e.g., Sunset Crest Villa"
              />
            </div>

            <div>
              <label className={labelClass}>2. Villa Owner Name *</label>
              <input
                type="text"
                required
                value={config.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
                className={inputClass}
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className={labelClass}>Owner WhatsApp / Phone Number *</label>
              <input
                type="tel"
                required
                value={config.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className={labelClass}>Email Address (Optional)</label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
                placeholder="owner@example.com"
              />
            </div>

            <div>
              <label className={labelClass}>14. Google Location (Maps Link or Area) *</label>
              <input
                type="text"
                required
                value={config.googleLocation}
                onChange={(e) => updateField("googleLocation", e.target.value)}
                className={inputClass}
                placeholder="Paste Google Maps link or area (e.g., Lonavala / Khopoli)"
              />
            </div>

            <div>
              <label className={labelClass}>15. Plot Size (sq ft)</label>
              <div className="relative">
                <input
                  type="text"
                  value={config.plotSizeSqFt}
                  onChange={(e) => updateField("plotSizeSqFt", e.target.value)}
                  className={`${inputClass} pr-16`}
                  placeholder="e.g., 10,000"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-primary/40">
                  sq ft
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Rooms & Air Conditioning */}
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Part 2 · Rooms & Air Conditioning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>3. Bedrooms *</label>
              <input
                type="text"
                required
                value={config.bedrooms}
                onChange={(e) => updateField("bedrooms", e.target.value)}
                className={inputClass}
                placeholder="e.g., 4 BHK"
              />
            </div>

            <div>
              <label className={labelClass}>4. Bathrooms *</label>
              <input
                type="text"
                required
                value={config.bathrooms}
                onChange={(e) => updateField("bathrooms", e.target.value)}
                className={inputClass}
                placeholder="e.g., 5"
              />
            </div>

            <div>
              <label className={labelClass}>10. ACs in Bedroom</label>
              <input
                type="text"
                value={config.acsInBedroom}
                onChange={(e) => updateField("acsInBedroom", e.target.value)}
                className={inputClass}
                placeholder="e.g., Yes, all 4 bedrooms"
              />
            </div>

            <div>
              <label className={labelClass}>11. ACs in Living Room</label>
              <input
                type="text"
                value={config.acsInLivingRoom}
                onChange={(e) => updateField("acsInLivingRoom", e.target.value)}
                className={inputClass}
                placeholder="e.g., Yes (2 ACs) / No"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Power & Water Backup */}
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Part 3 · Electricity Backup & Water Supply
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border-subtle rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-text-primary">
                  5. Is 3-phase meter available for electricity backup?
                </span>
                <span className="text-[11px] text-text-primary/50">
                  Required for stable heavy load & ACs
                </span>
              </div>
              <YesNoToggle
                value={config.threePhaseMeter}
                onChange={(val) => updateField("threePhaseMeter", val)}
              />
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-text-primary">
                  9. Government waterline available?
                </span>
                <span className="text-[11px] text-text-primary/50">
                  Direct municipal/gram panchayat water connection
                </span>
              </div>
              <YesNoToggle
                value={config.governmentWaterline}
                onChange={(val) => updateField("governmentWaterline", val)}
              />
            </div>

            {/* 6. Inverter + Batteries */}
            <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-text-primary">6. Inverter</span>
                  <span className="text-[11px] text-text-primary/50">
                    Battery backup for lights & fans
                  </span>
                </div>
                <YesNoToggle
                  value={config.inverter}
                  onChange={(val) => updateField("inverter", val)}
                />
              </div>
              {config.inverter === "Yes" && (
                <div>
                  <label className={labelClass}>How many batteries?</label>
                  <input
                    type="text"
                    value={config.inverterBatteries}
                    onChange={(e) => updateField("inverterBatteries", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 2 batteries / 4 batteries"
                  />
                </div>
              )}
            </div>

            {/* 7. Generator + kVA */}
            <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-text-primary">7. Generator</span>
                  <span className="text-[11px] text-text-primary/50">
                    Diesel/petrol genset backup
                  </span>
                </div>
                <YesNoToggle
                  value={config.generator}
                  onChange={(val) => updateField("generator", val)}
                />
              </div>
              {config.generator === "Yes" && (
                <div>
                  <label className={labelClass}>How many kVA?</label>
                  <input
                    type="text"
                    value={config.generatorKva}
                    onChange={(e) => updateField("generatorKva", e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 15 kVA / 25 kVA"
                  />
                </div>
              )}
            </div>

            {/* 8. Water Tank Capacities */}
            <div>
              <label className={labelClass}>
                8a. Underground Water Tank Capacity (How many litres?)
              </label>
              <input
                type="text"
                value={config.undergroundTankLitres}
                onChange={(e) => updateField("undergroundTankLitres", e.target.value)}
                className={inputClass}
                placeholder="e.g., 5,000 Litres"
              />
            </div>

            <div>
              <label className={labelClass}>
                8b. Overhead Water Tank Capacity (How many litres?)
              </label>
              <input
                type="text"
                value={config.overheadTankLitres}
                onChange={(e) => updateField("overheadTankLitres", e.target.value)}
                className={inputClass}
                placeholder="e.g., 2,000 Litres"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Staff, Kitchen & Rental Expectations */}
        <div className="space-y-6">
          <div className="border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary">
              Part 4 · Staff, Kitchen & Rental Expectations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border-subtle rounded-2xl p-5 flex flex-col justify-between gap-4">
              <span className="block text-xs font-bold text-text-primary">
                12. Is caretaker available?
              </span>
              <YesNoToggle
                value={config.caretakerAvailable}
                onChange={(val) => updateField("caretakerAvailable", val)}
              />
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl p-5 flex flex-col justify-between gap-4">
              <span className="block text-xs font-bold text-text-primary">
                13. Separate room for caretaker available?
              </span>
              <YesNoToggle
                value={config.separateCaretakerRoom}
                onChange={(val) => updateField("separateCaretakerRoom", val)}
              />
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl p-5 flex flex-col justify-between gap-4">
              <span className="block text-xs font-bold text-text-primary">
                16. Is there an equipped kitchen for chef service?
              </span>
              <YesNoToggle
                value={config.equippedKitchen}
                onChange={(val) => updateField("equippedKitchen", val)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>17. Rental Expectations *</label>
            <input
              type="text"
              required
              value={config.rentalExpectations}
              onChange={(e) => updateField("rentalExpectations", e.target.value)}
              className={inputClass}
              placeholder="e.g., Expected monthly rental, minimum guarantee, or revenue share expectation"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs ml-2 animate-pulse">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-stretch gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="min-w-0 h-14 px-8 bg-accent-primary hover:bg-accent-secondary text-white rounded-full text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(27,53,100,0.25)] disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? (
              <>
                PREPARING WHATSAPP DETAILS... <Loader2 className="animate-spin" size={20} />
              </>
            ) : (
              <>
                SEND CONFIGURATION ON WHATSAPP <ArrowRight size={20} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => copyFilledDetails()}
            className="h-14 px-7 inline-flex items-center justify-center gap-2.5 border border-border-subtle bg-white hover:border-accent-primary hover:bg-bg-secondary/40 text-text-primary rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {copiedFilled ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedFilled ? "Copied!" : "Copy Filled Text"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerForm;

