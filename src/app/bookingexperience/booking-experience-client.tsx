"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  MessageCircle, 
  Lock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  ChefHat, 
  PhoneCall, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Send, 
  FileText, 
  Compass, 
  Check, 
  Star,
  MapPin,
  ChevronDown
} from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";

interface VillaOption {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
}

interface BookingExperienceClientProps {
  villas: VillaOption[];
}

export default function BookingExperienceClient({ villas }: BookingExperienceClientProps) {
  // Active option tab (1, 2, 3, or 4)
  const [selectedOption, setSelectedOption] = useState<number>(1);

  // Interactive Quiz state
  const [quizGroup, setQuizGroup] = useState<string>("friends");
  const [quizPriority, setQuizPriority] = useState<string>("deposit");

  // Inline Quick Inquiry / Hold Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formVilla, setFormVilla] = useState(villas[0]?.id || "");
  const [formOptionChoice, setFormOptionChoice] = useState("Option 3: 25% Token Hold");
  const [formDates, setFormDates] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Determine quiz recommendation
  const getRecommendation = () => {
    if (quizPriority === "speed") return 1;
    if (quizPriority === "human") return 2;
    if (quizPriority === "deposit") return 3;
    if (quizPriority === "group" || quizGroup === "corporate" || quizGroup === "celebration") return 4;
    return 3;
  };

  const recommendedOption = getRecommendation();

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setFormError("Please enter your name and contact phone number.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    try {
      const selectedVillaObj = villas.find((v) => v.id === formVilla);
      const res = await submitInquiry({
        name: formName,
        phone: formPhone,
        email: formEmail || "guest@staywillas.com",
        message: `[Booking Flow Request - ${formOptionChoice}]
Selected Villa: ${selectedVillaObj?.name || "Flexible"}
Preferred Dates: ${formDates || "Not specified"}
Special Notes: ${formNotes || "None"}`,
        villaId: formVilla || undefined,
        type: "BOOKING_LEAD",
      });

      if (res?.success) {
        setFormSuccess(true);
      } else {
        setFormError("Failed to submit request. Please try WhatsApp directly.");
      }
    } catch (err: any) {
      setFormError(err.message || "Something went wrong. Please reach out via WhatsApp.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const bookingOptions = [
    {
      id: 1,
      badge: "Fastest & Guaranteed",
      icon: Zap,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      title: "Instant Direct Online",
      subtitle: "Zero platform fees, real-time live calendar lock, instant payment",
      time: "2 Minutes",
      paymentTerms: "100% Secure Checkout (UPI, Cards, NetBanking)",
      bestFor: "Couples, small families, and guests who know their exact travel dates.",
      flowSteps: [
        {
          step: 1,
          title: "Select Villa & Dates",
          desc: "Choose from our curated Lonavala, Khopoli & Panchgani villas with live availability calendars.",
        },
        {
          step: 2,
          title: "Customise Add-Ons",
          desc: "Select optional personal chef service, barbecue grills, or anniversary decoration.",
        },
        {
          step: 3,
          title: "Direct 0% Markup Checkout",
          desc: "Pay securely via Stripe / UPI with no OTA platform markups.",
        },
        {
          step: 4,
          title: "Instant Booking Pass & Self-Check-in",
          desc: "Receive immediate WhatsApp confirmation, GPS coordinates, and Caretaker direct line.",
        },
      ],
      actionLabel: "Explore Villas & Book Online",
      actionLink: "/villas",
      actionType: "internal",
    },
    {
      id: 2,
      badge: "Most Popular",
      icon: MessageCircle,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      title: "VIP WhatsApp Concierge",
      subtitle: "1-on-1 human support, video walkthroughs & custom meal planning",
      time: "5-10 Minutes",
      paymentTerms: "Instant UPI link with custom payment split",
      bestFor: "Guests wanting video walkthroughs, pet travel queries, or Jain/Veg meal customizations.",
      flowSteps: [
        {
          step: 1,
          title: "Connect with Concierge",
          desc: "Tap the direct WhatsApp line to chat with a dedicated Stay Willas Villa Specialist.",
        },
        {
          step: 2,
          title: "Curated Live Video Walkthrough",
          desc: "Get recent drone videos, bedroom photos, and lawn layouts suited to your group size.",
        },
        {
          step: 3,
          title: "Customized Chef Menu",
          desc: "Pick your meals with our chef: Jain-pure, Maharashtrian home-style, or evening BBQ.",
        },
        {
          step: 4,
          title: "Quick UPI Token Transfer",
          desc: "Transfer advance via official UPI ID and receive instant digital PDF voucher.",
        },
      ],
      actionLabel: "Chat on WhatsApp Concierge",
      actionLink: `https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas Concierge! 🌿 I am looking to book a villa and would love 1-on-1 assistance with villa options, video tours, and meal planning.")}`,
      actionType: "external",
    },
    {
      id: 3,
      badge: "High Flexibility",
      icon: Lock,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      title: "25% Token Hold (Flexi-Pay)",
      subtitle: "Lock high-demand weekend dates now, settle balance prior to check-in",
      time: "15 Minutes",
      paymentTerms: "25% Deposit Now • 75% 48 hrs before check-in or arrival",
      bestFor: "Friends groups pooling funds or guests wanting to lock dates without paying 100% upfront.",
      flowSteps: [
        {
          step: 1,
          title: "Select Dates & Request Hold",
          desc: "Pick your preferred villa and submit a date-hold request online or on WhatsApp.",
        },
        {
          step: 2,
          title: "Pay 25% Token Advance",
          desc: "Transfer a 25% token deposit to lock down your chosen dates.",
        },
        {
          step: 3,
          title: "OTA Calendar Lock",
          desc: "Our automated sync immediately blocks your dates across Airbnb, Agoda, and Booking.com.",
        },
        {
          step: 4,
          title: "Settle Balance at Ease",
          desc: "Pay the remaining 75% 48 hours prior to arrival or via guest dashboard.",
        },
      ],
      actionLabel: "Request 25% Date Hold",
      actionLink: "#hold-form",
      actionType: "scroll",
    },
    {
      id: 4,
      badge: "Retreats & Events",
      icon: Users,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      title: "Bespoke Group & Corporate",
      subtitle: "Multi-cottage buyouts, 15-50+ guests, GST invoices & dedicated event manager",
      time: "Same-Day Custom Plan",
      paymentTerms: "Corporate PO / Milestone invoicing with 18% GST input credit",
      bestFor: "Corporate offsites, 40th/50th birthday milestones, anniversaries, and large joint families.",
      flowSteps: [
        {
          step: 1,
          title: "Submit Group Blueprint",
          desc: "Tell us guest headcount, room allocation needs, and team bonding or celebration schedule.",
        },
        {
          step: 2,
          title: "Dedicated Event Host Assigned",
          desc: "A senior hospitality manager arranges multi-cottage estates (e.g. Willow Peak 3 Cottages: Breeze, Crest & Heaven).",
        },
        {
          step: 3,
          title: "Full-Board Chef & Setup",
          desc: "High-tea, live poolside grills, acoustic music setup, and lawn activities coordinated.",
        },
        {
          step: 4,
          title: "GST Invoice & VIP Handover",
          desc: "Receive formal corporate tax invoices and full on-ground manager support throughout.",
        },
      ],
      actionLabel: "Plan Group / Corporate Stay",
      actionLink: "#hold-form",
      actionType: "scroll",
    },
  ];

  const currentOptionData = bookingOptions.find((o) => o.id === selectedOption) || bookingOptions[0];

  const faqs = [
    {
      q: "Can I really reserve my dates with only a 25% token advance?",
      a: "Yes! For guests who want peace of mind without tying up the full trip budget upfront, Option 3 allows you to hold your preferred dates with just a 25% token advance. Once paid, the dates are blocked across all internal and third-party OTA calendars (Airbnb, Booking.com). You can settle the remaining balance 48 hours before arrival.",
    },
    {
      q: "What are your official bank account & UPI details for direct transfers?",
      a: "You can make direct token or balance payments via NEFT, IMPS, RTGS, or UPI to our official account: Federal Bank | A/C: 99980100571517 | Name: Sushant Girish Chandra Tiwari | Branch: Kalyan | IFSC: FDRL0001542 | MMID: 9049517 | UPI ID: sushant650@federal. Please share your transaction UTR / payment screenshot on WhatsApp (+91 96190 42310) for instant reconciliation.",
    },
    {
      q: "What is the fastest way to get confirmed if I am checking in tomorrow or this weekend?",
      a: "Option 1 (Instant Online Booking) or Option 2 (WhatsApp Concierge) are the fastest. Option 1 takes under 2 minutes for immediate digital voucher issuance, while Option 2 gives you instant human verification from our concierge team via WhatsApp (+91 96190 42310).",
    },
    {
      q: "How does the private chef and food service work across these options?",
      a: "Every Stay Willas estate comes with a fully equipped kitchen and private chef service options. You can choose all-inclusive meal packages (breakfast, lunch, hi-tea, and dinner) with pure veg, Jain, and non-veg cooked separately. Our team connects you with the head chef 24 hours prior to check-in to customize dishes.",
    },
    {
      q: "Do you provide corporate GST invoices for company offsites?",
      a: "Absolutely. Under Option 4 (Group & Corporate Retreats), we provide compliant GST proforma invoices and tax receipts so your business can claim standard input tax credit (ITC). We also accommodate corporate vendor onboarding and advance PO processing.",
    },
    {
      q: "What happens if our group size increases after booking?",
      a: "You can easily add extra guests! Each villa lists its base guest limit and extra guest fee. Simply inform your concierge or update your booking up to 24 hours prior to check-in so additional bedding and dining arrangements are prepared.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans selection:bg-[#DAA520]/20 selection:text-[#1B3564]">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Subtle Decorative Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1B3564]/10 via-[#DAA520]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 bg-[#1B3564]/5 border border-[#1B3564]/15 px-4 py-1.5 rounded-full text-xs font-bold text-[#1B3564] uppercase tracking-[0.2em] mb-5">
          <Sparkles size={14} className="text-[#DAA520]" />
          Tailored Guest Experience
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1B3564] leading-tight max-w-4xl mx-auto tracking-tight">
          How Would You Like to Book?
          <span className="block text-2xl sm:text-3xl md:text-4xl font-light italic text-[#DAA520] font-serif mt-2">
            4 Transparent Booking Journeys
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
          We heard your feedback. Booking a luxury villa shouldn&apos;t be rigid. Whether you prefer 
          <strong className="text-slate-800 font-semibold"> instant 2-minute digital checkout</strong>, 
          <strong className="text-slate-800 font-semibold"> personal WhatsApp concierge</strong>, 
          <strong className="text-slate-800 font-semibold"> holding dates with a 25% token</strong>, or 
          <strong className="text-slate-800 font-semibold"> corporate event planning</strong> — select the path that works best for you below.
        </p>

        {/* Visual Summary Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full shadow-xs">
            <CheckCircle2 size={15} className="text-emerald-600" /> 0% Platform Fees
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full shadow-xs">
            <CheckCircle2 size={15} className="text-emerald-600" /> 1-on-1 Human Support
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full shadow-xs">
            <CheckCircle2 size={15} className="text-emerald-600" /> 25% Token Hold Option
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2 rounded-full shadow-xs">
            <CheckCircle2 size={15} className="text-emerald-600" /> Corporate GST Invoicing
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW BOOKING WORKS ON STAY WILLAS (WEBSITE WORKFLOW & 4 QUICK OPTIONS) */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DAA520] mb-1">
                <Compass size={14} /> Website Workflow & Booking Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3564]">
                How Booking Works on Stay Willas
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Choose any of our 4 flexible booking options below to see how each workflow operates from date selection to key handover at your private pool villa:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/downloads/Ekostay_vs_StayVista_Booking_Case_Study.pdf"
                download="Ekostay_vs_StayVista_Booking_Case_Study.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-[#1B3564] hover:bg-[#152a50] text-white px-4 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5"
                title="Download Comprehensive Case Study: EkoStay vs StayVista vs Stay Willas"
              >
                <FileText size={13} className="text-[#DAA520]" />
                <span>Download Case Study PDF</span>
              </a>
              <Link
                href="/#booking-bar-section"
                className="text-xs font-bold bg-[#DAA520] hover:bg-[#c99516] text-[#1B3564] px-4 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5"
              >
                <Zap size={13} />
                <span>Quick Book on Homepage</span>
              </Link>
            </div>
          </div>

          {/* Flowchart Node Selector (The 4 Options Hub) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 relative group flex flex-col justify-between ${
                    isSelected
                      ? "border-[#1B3564] bg-[#1B3564]/5 shadow-md -translate-y-1"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected ? "bg-[#1B3564] text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      Option {opt.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {opt.time}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl ${opt.bgColor} ${opt.iconColor}`}>
                        <IconComp size={20} />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#1B3564] leading-tight">
                        {opt.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {opt.subtitle}
                    </p>
                  </div>

                  {/* Bottom indicator */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? "text-[#1B3564]" : "text-slate-400 group-hover:text-slate-700"}>
                      {isSelected ? "Active Workflow" : "View Workflow Steps"}
                    </span>
                    <ChevronRight size={14} className={`transition-transform ${isSelected ? "text-[#1B3564] translate-x-1" : "text-slate-400"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Flowchart Visual Journey Canvas for Active Option */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#1B3564]/10 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${currentOptionData.bgColor} ${currentOptionData.iconColor}`}>
                  <currentOptionData.icon size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#DAA520]">
                      Step-by-Step Booking Workflow
                    </span>
                    <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                      Est. Time: {currentOptionData.time}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B3564]">
                    Option {currentOptionData.id}: {currentOptionData.title}
                  </h3>
                </div>
              </div>

              {/* Action Button for Active Option */}
              <div>
                {currentOptionData.actionType === "internal" ? (
                  <Link
                    href={currentOptionData.actionLink}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E0534C] via-[#E7625A] to-[#D9413A] hover:from-[#D9413A] hover:to-[#C9332C] text-white transition-all font-bold text-sm shadow-[0_8px_25px_rgba(224,83,76,0.35)] hover:shadow-[0_12px_35px_rgba(224,83,76,0.45)] cursor-pointer"
                  >
                    <span>{currentOptionData.actionLabel}</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : currentOptionData.actionType === "external" ? (
                  <a
                    href={currentOptionData.actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#1eb855] transition-colors font-bold text-sm shadow-md"
                  >
                    <MessageCircle size={17} />
                    <span>{currentOptionData.actionLabel}</span>
                  </a>
                ) : (
                  <a
                    href={currentOptionData.actionLink}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1B3564] text-white hover:bg-[#152a50] transition-colors font-bold text-sm shadow-md"
                  >
                    <span>{currentOptionData.actionLabel}</span>
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* 4 Step Horizontal / Vertical Node Line */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {currentOptionData.flowSteps.map((step, idx) => (
                <div key={step.step} className="relative flex flex-col">
                  {/* Step Card */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs h-full flex flex-col justify-between hover:border-[#1B3564]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-full bg-[#1B3564] text-white flex items-center justify-center text-xs font-bold">
                          0{step.step}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Step {idx + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1B3564] mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                      <Check size={12} className="text-emerald-600" />
                      <span>Verified Stage</span>
                    </div>
                  </div>

                  {/* Desktop connector arrow */}
                  {idx < currentOptionData.flowSteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 shadow-2xs">
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Option Highlights Footer Bar */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-600">
                <div>
                  <strong className="text-slate-800">Payment Terms:</strong> {currentOptionData.paymentTerms}
                </div>
                <div className="hidden sm:block text-slate-300">|</div>
                <div>
                  <strong className="text-slate-800">Best For:</strong> {currentOptionData.bestFor}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE "WHICH OPTION FITS ME?" FINDER */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#1B3564] to-[#0f203e] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          {/* Background subtle art */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DAA520] mb-2">
              <Sparkles size={14} /> 10-Second Selector
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              Unsure which path to choose? Let us match your style.
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-2">
              Answer 2 simple questions to get your personalized booking workflow recommendation:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#DAA520] mb-3">
                1. Who are you traveling with?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "couple", label: "Couple / Solo", desc: "Private romantic escape" },
                  { id: "family", label: "Family & Kids", desc: "Relaxed private pool stay" },
                  { id: "friends", label: "Group of Friends", desc: "Splitting costs & dates" },
                  { id: "corporate", label: "Corporate / Event", desc: "15+ guests with catering" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuizGroup(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs ${
                      quizGroup === item.id
                        ? "bg-[#DAA520] text-[#1B3564] font-bold border-[#DAA520] shadow-sm"
                        : "bg-white/5 text-white/90 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className={`text-[10px] ${quizGroup === item.id ? "text-[#1B3564]/80" : "text-white/50"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#DAA520] mb-3">
                2. What is your top priority right now?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "speed", label: "Instant & Zero Fee", desc: "Fastest checkout, best direct rate" },
                  { id: "human", label: "Speak to Concierge", desc: "Need video tour & meal plan" },
                  { id: "deposit", label: "25% Token Hold", desc: "Lock dates, pay balance later" },
                  { id: "group", label: "Corporate / Event Plan", desc: "Full buyout & GST tax invoice" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuizPriority(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs ${
                      quizPriority === item.id
                        ? "bg-[#DAA520] text-[#1B3564] font-bold border-[#DAA520] shadow-sm"
                        : "bg-white/5 text-white/90 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className={`text-[10px] ${quizPriority === item.id ? "text-[#1B3564]/80" : "text-white/50"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Match Result Banner */}
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#DAA520] flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Recommended Path For You
              </div>
              <div className="text-xl font-serif font-bold text-white mt-1">
                Option {recommendedOption}: {bookingOptions[recommendedOption - 1].title}
              </div>
              <p className="text-white/70 text-xs mt-1 max-w-xl">
                {bookingOptions[recommendedOption - 1].subtitle} ({bookingOptions[recommendedOption - 1].time})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedOption(recommendedOption);
                  const el = document.querySelector("section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
              >
                Inspect Flowchart
              </button>
              {recommendedOption === 2 ? (
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas Concierge! 🌿 I used your booking path selector and would love to book via WhatsApp VIP Concierge.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#1eb855] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  <span>Start on WhatsApp</span>
                </a>
              ) : recommendedOption === 1 ? (
                <Link
                  href="/villas"
                  className="px-5 py-2.5 rounded-xl bg-[#DAA520] text-[#1B3564] text-xs font-bold shadow-md hover:bg-[#e4b335] transition-colors flex items-center gap-1.5"
                >
                  <span>Browse Villas</span>
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <a
                  href="#hold-form"
                  className="px-5 py-2.5 rounded-xl bg-[#DAA520] text-[#1B3564] text-xs font-bold shadow-md hover:bg-[#e4b335] transition-colors flex items-center gap-1.5"
                >
                  <span>Submit Hold Request</span>
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DEEP-DIVE COMPARISON MATRIX */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DAA520]">
            Side-By-Side Comparison
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3564] mt-1">
            Compare All 4 Booking Methods
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-light">
            Every option guarantees our signature Stay Willas hospitality, sanitized pools, and private chef services.
          </p>
        </div>

        <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 sm:p-5 font-bold text-slate-700 w-1/4">Feature / Metric</th>
                <th className="p-4 sm:p-5 font-bold text-[#1B3564] w-[18.75%] bg-amber-500/5">
                  Option 1: Instant Online
                </th>
                <th className="p-4 sm:p-5 font-bold text-[#1B3564] w-[18.75%] bg-emerald-500/5">
                  Option 2: WhatsApp VIP
                </th>
                <th className="p-4 sm:p-5 font-bold text-[#1B3564] w-[18.75%] bg-blue-500/5">
                  Option 3: 25% Token Hold
                </th>
                <th className="p-4 sm:p-5 font-bold text-[#1B3564] w-[18.75%] bg-purple-500/5">
                  Option 4: Group & Corporate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">Confirmation Speed</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-amber-500/5">Instant (~2 mins)</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-emerald-500/5">5 - 10 Minutes</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-blue-500/5">~15 Minutes</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-purple-500/5">Same-Day Proposal</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">Initial Payment Required</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-amber-500/5">100% Upfront</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-emerald-500/5">Custom Token / Full</td>
                <td className="p-4 sm:p-5 font-bold text-blue-600 bg-blue-500/5">Only 25% Advance</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-purple-500/5">Corporate PO / Milestone</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">Payment Modes Accepted</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-amber-500/5">Cards, UPI, NetBanking</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-emerald-500/5">Direct UPI, QR, RTGS</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-blue-500/5">UPI, Bank Transfer</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-purple-500/5">NEFT / RTGS / Corporate Card</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">Video Walkthroughs & Custom Menus</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-amber-500/5">Online Gallery & Menus</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-emerald-500/5">Live Video + Chef Customization</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-blue-500/5">Pre-arrival Chef Connect</td>
                <td className="p-4 sm:p-5 text-purple-700 font-bold bg-purple-500/5">Dedicated Event Planner</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">GST Input Tax Credit Invoice</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-amber-500/5">Automated GST Receipt</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-emerald-500/5">Manual GST Tax Invoice</td>
                <td className="p-4 sm:p-5 text-slate-700 bg-blue-500/5">Tax Invoice on Final Settle</td>
                <td className="p-4 sm:p-5 text-purple-700 font-bold bg-purple-500/5">Formal B2B GST ITC Invoice</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-800">Primary Call To Action</td>
                <td className="p-4 sm:p-5 bg-amber-500/5">
                  <Link href="/villas" className="font-bold text-[#1B3564] hover:underline flex items-center gap-1">
                    Book Online <ChevronRight size={12} />
                  </Link>
                </td>
                <td className="p-4 sm:p-5 bg-emerald-500/5">
                  <a href={`https://wa.me/919619042310`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline flex items-center gap-1">
                    Chat WhatsApp <ChevronRight size={12} />
                  </a>
                </td>
                <td className="p-4 sm:p-5 bg-blue-500/5">
                  <a href="#hold-form" className="font-bold text-blue-700 hover:underline flex items-center gap-1">
                    Request Hold <ChevronRight size={12} />
                  </a>
                </td>
                <td className="p-4 sm:p-5 bg-purple-500/5">
                  <a href="#hold-form" className="font-bold text-purple-700 hover:underline flex items-center gap-1">
                    Get Proposal <ChevronRight size={12} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: INLINE REQUEST / HOLD / INQUIRY FORM */}
      <section id="hold-form" className="py-12 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto scroll-mt-24">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DAA520] block mb-1">
              Direct Booking Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3564]">
              Request a 25% Date Hold, WhatsApp Callback, or Group Quote
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-light">
              Submit your details and our reservation manager will confirm availability and send your reservation voucher within 15 minutes.
            </p>
          </div>

          {formSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-emerald-950">
                Booking Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{formName}</strong>. Our villa reservation team is processing your request for 
                <strong> {formOptionChoice}</strong>. We will message/call you on <strong>{formPhone}</strong> within 15 minutes.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setFormSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
                >
                  Submit Another Request
                </button>
                <a
                  href={`https://wa.me/919619042310?text=${encodeURIComponent(`Hi Stay Willas! I just submitted a booking request under ${formName} for ${formOptionChoice}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1eb855] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  <span>Notify via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-5">
              {formError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Preferred Booking Path
                  </label>
                  <select
                    value={formOptionChoice}
                    onChange={(e) => setFormOptionChoice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors"
                  >
                    <option value="Option 3: 25% Token Hold">Option 3: 25% Token Hold</option>
                    <option value="Option 2: VIP WhatsApp Concierge">Option 2: VIP WhatsApp Concierge</option>
                    <option value="Option 4: Group & Corporate Retreat">Option 4: Group & Corporate Retreat</option>
                    <option value="Option 1: Instant Online Assistance">Option 1: Instant Online Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Villa Choice
                  </label>
                  <select
                    value={formVilla}
                    onChange={(e) => setFormVilla(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors"
                  >
                    <option value="">Any / Recommend Best Villa</option>
                    {villas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.location.split(",")[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Travel Dates
                  </label>
                  <input
                    type="text"
                    value={formDates}
                    onChange={(e) => setFormDates(e.target.value)}
                    placeholder="e.g. 15th - 17th Nov (2 Nights)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Special Requirements / Food Preferences / Group Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Tell us about guest count, Jain/Veg meal requests, pet travel, or birthday celebration plans..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#1B3564] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>No spam. Instant WhatsApp response within 15 minutes.</span>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1B3564] text-white font-bold text-xs shadow-md hover:bg-[#152a50] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Booking Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 5: WHAT HAPPENS AFTER YOU BOOK? */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DAA520]">
            Complete Peace of Mind
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3564] mt-1">
            What Happens After You Book?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-light">
            Our 4-stage guest care process ensures your arrival and stay are 100% effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              time: "Immediate (Day 0)",
              title: "Digital Booking Pass",
              desc: "You receive an official booking pass with Google Maps pin, gate codes, and WiFi details.",
              icon: FileText,
            },
            {
              time: "24 Hours Prior",
              title: "Head Chef Call",
              desc: "Our resident chef contacts you to finalize your menu preferences (pure Veg, Jain, Non-Veg).",
              icon: ChefHat,
            },
            {
              time: "Check-in Day (1:00 PM)",
              title: "Heated Pool & AC Ready",
              desc: "The caretaker turns on pool filtration, chilling bedrooms, and preps welcome drinks.",
              icon: Sparkles,
            },
            {
              time: "At Check-in & Departure",
              title: "Warm Handover",
              desc: "Zero-friction key handover, luggage assistance, and 24/7 on-ground attendant support.",
              icon: CheckCircle2,
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#DAA520] bg-[#DAA520]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                  {item.time}
                </span>
                <h3 className="font-serif font-bold text-base text-[#1B3564] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-semibold uppercase">Stage 0{idx + 1}</span>
                <item.icon size={16} className="text-[#1B3564]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FAQS */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DAA520]">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3564] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-[#1B3564] hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-[#1B3564]" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 font-light leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: STICKY / BOTTOM QUICK ACTION BAR */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="bg-[#1B3564] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              Ready to Experience Your Dream Escape?
            </h2>
            <p className="text-white/75 text-xs sm:text-sm mt-3 font-light">
              Choose any of the 4 options above or speak with our team directly. We are always happy to help.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/villas"
                className="px-6 py-3.5 rounded-xl bg-[#DAA520] text-[#1B3564] text-xs font-bold shadow-lg hover:bg-[#e4b335] transition-colors flex items-center gap-2"
              >
                <Zap size={15} />
                <span>Option 1: Browse & Book Online</span>
              </Link>

              <a
                href={`https://wa.me/919619042310?text=${encodeURIComponent("Hi Stay Willas Concierge! 🌿 I am exploring booking options and would love to chat.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-lg hover:bg-[#1eb855] transition-colors flex items-center gap-2"
              >
                <MessageCircle size={15} />
                <span>Option 2: WhatsApp VIP Concierge</span>
              </a>

              <a
                href="tel:+919619042310"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-2"
              >
                <PhoneCall size={14} />
                <span>Call +91 96190 42310</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
