"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  User,
  FileText,
  Plus,
  Trash2,
  Download,
  Calculator,
  Mail,
  Send,
  Share2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Utensils,
  Copy,
  Check,
  ArrowRight,
  Percent,
  ShieldCheck,
  Building2,
  CheckCheck,
} from "lucide-react";
import { sendInvoiceEmailAction } from "@/app/actions/admin";

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  baseGuests?: number | null;
  extraGuestFee?: number | null;
  bedrooms: number;
  weekendPrice?: number | null;
}

interface BillCalculatorProps {
  villas: Villa[];
  prefillData?: {
    villaSlug?: string;
    checkIn?: string;
    checkOut?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    guestsCount?: number;
    baseGuests?: number;
    extraGuestFee?: number;
    ratePerNight?: number;
    weekendRatePerNight?: number;
    weekendNights?: number;
    nightRates?: number[];
    foodPlan?: string;
    foodRate?: number;
    foodGuestsCount?: number;
    extraCharges?: ExtraCharge[];
    discountFlat?: number;
    discountPercent?: number;
    gstPercent?: number;
    advancePaid?: number;
    securityDeposit?: number;
  } | null;
}

interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
}

export default function BillCalculator({ villas, prefillData }: BillCalculatorProps) {
  // Mode Selector: "invoice" | "food"
  const [activeCalculator, setActiveCalculator] = useState<"invoice" | "food">("invoice");

  // =========================================================================
  // 1. INVOICE CALCULATOR STATE (PRICING STARTS EMPTY / BLANK)
  // =========================================================================
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Property & Dates
  const [selectedVillaSlug, setSelectedVillaSlug] = useState("");
  const [customPropertyName, setCustomPropertyName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [nights, setNights] = useState<number>(1);
  const [guestsCount, setGuestsCount] = useState<number | "">(12);

  // Night-by-Night Tariff (Night 1, Night 2, etc. - EMPTY BY DEFAULT FOR CLIENT TO ENTER)
  const [nightRates, setNightRates] = useState<(number | "")[]>([""]);

  // Food / Catering cost in Invoice
  const [invoiceFoodCost, setInvoiceFoodCost] = useState<number | "">("");
  const [invoiceFoodNote, setInvoiceFoodNote] = useState("");

  // Custom Extra Charges
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newExtraDesc, setNewExtraDesc] = useState("");
  const [newExtraAmount, setNewExtraAmount] = useState<number | "">("");

  // Adjustments (All empty or standard zero default)
  const [discountFlat, setDiscountFlat] = useState<number | "">("");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [gstPercent, setGstPercent] = useState<number>(0); // 0% by default
  const [customGst, setCustomGst] = useState<number | "">("");
  const [securityDeposit, setSecurityDeposit] = useState<number | "">("");
  const [advancePaid, setAdvancePaid] = useState<number | "">("");

  // UI status feedback
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // =========================================================================
  // 2. FOOD / CATERING CALCULATOR STATE (PRICING STARTS EMPTY / BLANK)
  // =========================================================================
  const [foodMenuType, setFoodMenuType] = useState<"veg" | "non-veg" | "mix" | "custom">("mix");
  const [foodPax, setFoodPax] = useState<number | "">(12);
  const [foodDays, setFoodDays] = useState<number | "">(1);
  // Rate per person/day is LEFT EMPTY for user to enter
  const [foodRatePerPerson, setFoodRatePerPerson] = useState<number | "">("");
  
  // Optional Food Extras (BBQ, High Tea, etc.)
  const [foodExtras, setFoodExtras] = useState<ExtraCharge[]>([]);
  const [newFoodExtraDesc, setNewFoodExtraDesc] = useState("");
  const [newFoodExtraAmount, setNewFoodExtraAmount] = useState<number | "">("");
  const [foodGstPercent, setFoodGstPercent] = useState<number>(0);
  const [foodAppliedToInvoice, setFoodAppliedToInvoice] = useState(false);
  const [copiedFood, setCopiedFood] = useState(false);

  // Helper to format date label for a given night (0-indexed)
  const getNightDateLabel = (index: number) => {
    if (!checkInDate) return `Night ${index + 1}`;
    try {
      const d = new Date(checkInDate + "T12:00:00");
      d.setDate(d.getDate() + index);
      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dayDate = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      return `Night ${index + 1} (${dayName}, ${dayDate})`;
    } catch {
      return `Night ${index + 1}`;
    }
  };

  // Adjust total nights and sync nightRates array length
  const handleNightsChange = (newCount: number) => {
    const safeCount = Math.max(1, newCount);
    setNights(safeCount);
    setNightRates((prev) => {
      const next = [...prev];
      while (next.length < safeCount) next.push("");
      return next.slice(0, safeCount);
    });

    if (checkInDate) {
      try {
        const d = new Date(checkInDate + "T12:00:00");
        d.setDate(d.getDate() + safeCount);
        setCheckOutDate(d.toISOString().split("T")[0]);
      } catch {}
    }

    if (foodDays === 1 || foodDays === nights) {
      setFoodDays(safeCount);
    }
  };

  const handleNightRateChange = (index: number, valStr: string) => {
    const val = valStr === "" ? "" : Number(valStr);
    setNightRates((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleCopyNight1ToAll = () => {
    const first = nightRates[0];
    if (first !== undefined && first !== "") {
      setNightRates(Array(nights).fill(first));
    }
  };

  // Auto calculate nights from dates and sync night slots
  const handleDateChange = (cin: string, cout: string) => {
    setCheckInDate(cin);
    setCheckOutDate(cout);

    if (cin && cout) {
      const start = new Date(cin + "T12:00:00");
      const end = new Date(cout + "T12:00:00");
      if (end > start) {
        const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        setNights(totalDays);
        setNightRates((prev) => {
          const next = [...prev];
          while (next.length < totalDays) next.push("");
          return next.slice(0, totalDays);
        });
        if (foodDays === 1 || foodDays === nights) {
          setFoodDays(totalDays);
        }
      }
    }
  };

  // Prefill handling from existing bookings (if opened from admin dashboard)
  useEffect(() => {
    if (prefillData) {
      if (prefillData.guestName) setGuestName(prefillData.guestName);
      if (prefillData.guestPhone) setGuestPhone(prefillData.guestPhone);
      if (prefillData.guestEmail) setGuestEmail(prefillData.guestEmail);
      if (prefillData.villaSlug) setSelectedVillaSlug(prefillData.villaSlug);
      if (prefillData.checkIn && prefillData.checkOut) {
        handleDateChange(prefillData.checkIn, prefillData.checkOut);
      }
      if (prefillData.guestsCount !== undefined) setGuestsCount(prefillData.guestsCount);
      if (prefillData.nightRates && Array.isArray(prefillData.nightRates)) {
        setNightRates(prefillData.nightRates);
        setNights(prefillData.nightRates.length);
      } else if (prefillData.ratePerNight !== undefined && prefillData.ratePerNight > 0) {
        setNightRates((prev) => prev.map(() => prefillData.ratePerNight!));
      }
      if (prefillData.foodRate !== undefined && prefillData.foodRate > 0) {
        setFoodRatePerPerson(prefillData.foodRate);
      }
      if (prefillData.foodGuestsCount !== undefined) setFoodPax(prefillData.foodGuestsCount);
      if (Array.isArray(prefillData.extraCharges)) setExtraCharges(prefillData.extraCharges);
      if (prefillData.discountFlat !== undefined && prefillData.discountFlat > 0) setDiscountFlat(prefillData.discountFlat);
      if (prefillData.discountPercent !== undefined && prefillData.discountPercent > 0) setDiscountPercent(prefillData.discountPercent);
      if (prefillData.gstPercent !== undefined) setGstPercent(prefillData.gstPercent);
      if (prefillData.advancePaid !== undefined && prefillData.advancePaid > 0) setAdvancePaid(prefillData.advancePaid);
      if (prefillData.securityDeposit !== undefined && prefillData.securityDeposit > 0) setSecurityDeposit(prefillData.securityDeposit);
    }
  }, [prefillData]);

  // Format date helper
  const formatDateLabel = (dStr: string) => {
    if (!dStr) return "N/A";
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? dStr : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Property Display Name (No prices included)
  const getSelectedVillaName = () => {
    if (selectedVillaSlug === "custom") {
      return customPropertyName.trim() || "Private Villa Estate";
    }
    const found = villas.find((v) => v.slug === selectedVillaSlug);
    return found ? found.name : "Luxury Villa";
  };

  const getSelectedVillaLocation = () => {
    if (selectedVillaSlug === "custom") return "Maharashtra";
    const found = villas.find((v) => v.slug === selectedVillaSlug);
    return found ? found.location : "Near Mumbai";
  };

  // =========================================================================
  // FINANCIAL CALCULATIONS: FOOD CALCULATOR
  // =========================================================================
  const numFoodPax = typeof foodPax === "number" ? foodPax : 0;
  const numFoodDays = typeof foodDays === "number" ? foodDays : 0;
  const numFoodRate = typeof foodRatePerPerson === "number" ? foodRatePerPerson : 0;

  const baseFoodCost = numFoodPax * numFoodDays * numFoodRate;
  const foodExtrasCost = foodExtras.reduce((acc, curr) => acc + curr.amount, 0);
  const subtotalFoodBeforeGst = baseFoodCost + foodExtrasCost;
  const foodGstAmount = Math.round(subtotalFoodBeforeGst * (foodGstPercent / 100));
  const totalFoodCostCalculated = subtotalFoodBeforeGst + foodGstAmount;
  const perPersonTotalFoodCost = numFoodPax > 0 ? Math.round(totalFoodCostCalculated / numFoodPax) : 0;

  // Transfer Food to Invoice
  const handleApplyFoodToInvoice = () => {
    if (totalFoodCostCalculated <= 0) return;
    setInvoiceFoodCost(totalFoodCostCalculated);
    const menuLabel =
      foodMenuType === "veg"
        ? "Pure Veg Menu"
        : foodMenuType === "non-veg"
        ? "Non-Veg Menu"
        : foodMenuType === "mix"
        ? "Mix Veg & Non-Veg Menu"
        : "Custom Food Package";
    setInvoiceFoodNote(`${menuLabel} (${numFoodPax} Pax for ${numFoodDays} Day(s) @ ₹${numFoodRate.toLocaleString("en-IN")}/pax/day)`);
    setFoodAppliedToInvoice(true);
    setActiveCalculator("invoice");
  };

  // =========================================================================
  // FINANCIAL CALCULATIONS: INVOICE CALCULATOR
  // =========================================================================
  const numNights = nights > 0 ? nights : 1;
  const numGuestsCount = typeof guestsCount === "number" ? guestsCount : 0;

  // Total Stay Tariff: sum of each night's rate entered by user (No extra guest fee per request)
  const totalStayCost = nightRates.reduce<number>((sum, r) => sum + (typeof r === "number" ? r : 0), 0);

  // Total Food Tariff in Invoice
  const totalInvoiceFoodCost = typeof invoiceFoodCost === "number" ? invoiceFoodCost : 0;

  // Total Extras
  const totalExtrasCost = extraCharges.reduce((acc, curr) => acc + curr.amount, 0);

  // Subtotal before discount
  const subtotalBeforeDiscount = totalStayCost + totalInvoiceFoodCost + totalExtrasCost;

  // Discounts
  const numDiscountFlat = typeof discountFlat === "number" ? discountFlat : 0;
  const numDiscountPercent = typeof discountPercent === "number" ? discountPercent : 0;
  const percentDiscountAmount = subtotalBeforeDiscount * (numDiscountPercent / 100);
  const totalDiscount = Math.round(percentDiscountAmount + numDiscountFlat);

  // Taxable subtotal
  const subtotal = Math.max(0, subtotalBeforeDiscount - totalDiscount);

  // GST
  const activeGstPercent = customGst !== "" ? Number(customGst) : gstPercent;
  const gstAmount = Math.round(subtotal * (activeGstPercent / 100));

  // Security deposit & Grand total
  const numDeposit = typeof securityDeposit === "number" ? securityDeposit : 0;
  const grandTotal = subtotal + gstAmount + numDeposit;

  // Advance paid & Balance due
  const numAdvance = typeof advancePaid === "number" ? advancePaid : 0;
  const balanceDue = Math.max(0, grandTotal - numAdvance);

  // =========================================================================
  // ACTIONS: ADD EXTRA CHARGES
  // =========================================================================
  const handleAddInvoiceExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraDesc || !newExtraAmount || Number(newExtraAmount) <= 0) return;
    setExtraCharges([
      ...extraCharges,
      {
        id: Math.random().toString(),
        description: newExtraDesc,
        amount: Number(newExtraAmount),
      },
    ]);
    setNewExtraDesc("");
    setNewExtraAmount("");
  };

  const handleAddFoodExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodExtraDesc || !newFoodExtraAmount || Number(newFoodExtraAmount) <= 0) return;
    setFoodExtras([
      ...foodExtras,
      {
        id: Math.random().toString(),
        description: newFoodExtraDesc,
        amount: Number(newFoodExtraAmount),
      },
    ]);
    setNewFoodExtraDesc("");
    setNewFoodExtraAmount("");
  };

  // Reset helpers
  const handleResetInvoice = () => {
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setSelectedVillaSlug("");
    setCustomPropertyName("");
    setCheckInDate("");
    setCheckOutDate("");
    setNights(1);
    setNightRates([""]);
    setGuestsCount(12);
    setInvoiceFoodCost("");
    setInvoiceFoodNote("");
    setExtraCharges([]);
    setNewExtraDesc("");
    setNewExtraAmount("");
    setDiscountFlat("");
    setDiscountPercent("");
    setGstPercent(0);
    setCustomGst("");
    setSecurityDeposit("");
    setAdvancePaid("");
    setEmailFeedback(null);
    setFoodAppliedToInvoice(false);
  };

  const handleResetFood = () => {
    setFoodMenuType("mix");
    setFoodPax(12);
    setFoodDays(1);
    setFoodRatePerPerson("");
    setFoodExtras([]);
    setNewFoodExtraDesc("");
    setNewFoodExtraAmount("");
    setFoodGstPercent(0);
  };

  // =========================================================================
  // SHARING & EXPORTS
  // =========================================================================
  const getInvoiceTextSummary = () => {
    const villaName = getSelectedVillaName();
    const villaLoc = getSelectedVillaLocation();

    return (
      `✨ *Stay Willas - Reservation Invoice* ✨\n` +
      `------------------------------------------\n` +
      `🏰 *Property:* ${villaName} (${villaLoc})\n` +
      `👤 *Guest Name:* ${guestName || "Valued Guest"}\n` +
      (guestPhone ? `📞 *Phone:* ${guestPhone}\n` : "") +
      (checkInDate ? `📅 *Check-In:* ${formatDateLabel(checkInDate)} (2:00 PM)\n` : "") +
      (checkOutDate ? `📅 *Check-Out:* ${formatDateLabel(checkOutDate)} (11:00 AM)\n` : "") +
      `🌙 *Duration:* ${numNights} Night(s)\n` +
      `👥 *Guests:* ${numGuestsCount} Pax\n` +
      `------------------------------------------\n` +
      `🏠 *Stay Tariff (${numNights} Night${numNights > 1 ? "s" : ""}):*\n` +
      nightRates.map((r, i) => `   • ${getNightDateLabel(i)}: Rs. ${typeof r === "number" ? r.toLocaleString("en-IN") : "0"}`).join("\n") +
      `\n   *Total Stay Tariff:* Rs. ${totalStayCost.toLocaleString("en-IN")}\n` +
      (totalInvoiceFoodCost > 0 ? `🍽️ *Food / Catering:* Rs. ${totalInvoiceFoodCost.toLocaleString("en-IN")}${invoiceFoodNote ? ` (${invoiceFoodNote})` : ""}\n` : "") +
      (totalExtrasCost > 0 ? `✨ *Add-ons & Extras:* Rs. ${totalExtrasCost.toLocaleString("en-IN")}\n` : "") +
      `• *Gross Subtotal:* Rs. ${subtotalBeforeDiscount.toLocaleString("en-IN")}\n` +
      (totalDiscount > 0 ? `🎁 *Discount:* - Rs. ${totalDiscount.toLocaleString("en-IN")}\n` : "") +
      (activeGstPercent > 0 ? `🏛️ *GST (${activeGstPercent}%):* Rs. ${gstAmount.toLocaleString("en-IN")}\n` : "") +
      (numDeposit > 0 ? `🛡️ *Refundable Deposit:* Rs. ${numDeposit.toLocaleString("en-IN")}\n` : "") +
      `💰 *GRAND TOTAL (Net Payable):* Rs. ${grandTotal.toLocaleString("en-IN")}\n` +
      (numAdvance > 0 ? `💳 *Advance Received:* Rs. ${numAdvance.toLocaleString("en-IN")}\n` : "") +
      `📌 *BALANCE DUE:* ${balanceDue <= 0 ? "PAID IN FULL" : `Rs. ${balanceDue.toLocaleString("en-IN")}`}\n` +
      `------------------------------------------\n` +
      `For inquiries: +91 9619042310 | www.staywillas.com 🥂`
    );
  };

  const getFoodTextSummary = () => {
    const menuTitle =
      foodMenuType === "veg"
        ? "Pure Vegetarian Menu"
        : foodMenuType === "non-veg"
        ? "Non-Vegetarian Menu"
        : foodMenuType === "mix"
        ? "Mix Veg & Non-Veg Menu"
        : "Custom Catering Package";

    return (
      `🍽️ *Stay Willas - Catering & Food Quotation* 🍽️\n` +
      `------------------------------------------\n` +
      `🥗 *Menu Plan:* ${menuTitle}\n` +
      `👥 *Guests:* ${numFoodPax} Pax\n` +
      `📅 *Duration:* ${numFoodDays} Day(s)\n` +
      (numFoodRate > 0 ? `💵 *Rate:* Rs. ${numFoodRate.toLocaleString("en-IN")} per person / day\n` : "") +
      `------------------------------------------\n` +
      `🥘 *Base Meals Total:* Rs. ${baseFoodCost.toLocaleString("en-IN")}\n` +
      (foodExtrasCost > 0 ? `🍢 *Add-ons (BBQ / Snacks):* Rs. ${foodExtrasCost.toLocaleString("en-IN")}\n` : "") +
      (foodGstAmount > 0 ? `🏛️ *GST (${foodGstPercent}%):* Rs. ${foodGstAmount.toLocaleString("en-IN")}\n` : "") +
      `💰 *TOTAL FOOD COST:* Rs. ${totalFoodCostCalculated.toLocaleString("en-IN")}\n` +
      (numFoodPax > 0 ? `👤 *Cost per Person:* Rs. ${perPersonTotalFoodCost.toLocaleString("en-IN")}\n` : "") +
      `------------------------------------------\n` +
      `Stay Willas Hospitality | WhatsApp: +91 9619042310`
    );
  };

  const handleShareWhatsApp = () => {
    const msg = getInvoiceTextSummary();
    const cleanPhone = guestPhone ? guestPhone.replace(/[^0-9]/g, "") : "";
    const waUrl =
      cleanPhone.length >= 10
        ? `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const handleShareFoodWhatsApp = () => {
    const msg = getFoodTextSummary();
    const cleanPhone = guestPhone ? guestPhone.replace(/[^0-9]/g, "") : "";
    const waUrl =
      cleanPhone.length >= 10
        ? `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyInvoiceText = () => {
    navigator.clipboard.writeText(getInvoiceTextSummary());
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handleCopyFoodText = () => {
    navigator.clipboard.writeText(getFoodTextSummary());
    setCopiedFood(true);
    setTimeout(() => setCopiedFood(false), 2000);
  };

  // Direct Server Email
  const handleSendDirectEmail = async () => {
    const propertyName = getSelectedVillaName();
    const propertyLoc = getSelectedVillaLocation();

    if (!guestEmail || !guestEmail.includes("@")) {
      setEmailFeedback({ type: "error", msg: "Please enter a valid guest email in Section 1." });
      return;
    }

    setIsSendingEmail(true);
    setEmailFeedback(null);

    const res = await sendInvoiceEmailAction({
      guestName: guestName || "Valued Guest",
      guestEmail: guestEmail.trim(),
      guestPhone,
      villaName: propertyName,
      location: propertyLoc,
      nights: numNights,
      guestsCount: numGuestsCount,
      checkInDate: checkInDate ? formatDateLabel(checkInDate) : undefined,
      checkOutDate: checkOutDate ? formatDateLabel(checkOutDate) : undefined,
      totalStayCost,
      foodPlanName: invoiceFoodNote || (totalInvoiceFoodCost > 0 ? "Catering Plan" : "No Meal Plan"),
      totalFoodCost: totalInvoiceFoodCost,
      totalExtrasCost,
      subtotal: subtotalBeforeDiscount,
      discountTotal: totalDiscount,
      discountPercent: numDiscountPercent,
      taxableAmount: subtotal,
      gstPercent: activeGstPercent,
      gstAmount,
      grandTotal,
      advancePaid: numAdvance,
      securityDeposit: numDeposit,
      balanceDue,
    });

    setIsSendingEmail(false);
    if (res.success) {
      setEmailFeedback({ type: "success", msg: res.message || "Invoice email dispatched to guest!" });
    } else {
      setEmailFeedback({ type: "error", msg: res.error || "Failed to send email." });
    }
  };

  // PDF Generation with bulletproof error safety
  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const navyColor = [27, 53, 100]; // #1B3564 Navy
      const goldColor = [218, 165, 32]; // #DAA520 Gold
      const darkCharcoal = [30, 41, 59]; // #1E293B Text
      const lightBeige = [250, 248, 245]; // #FAF8F5
      const borderGray = [226, 232, 240];

      const marginX = 15;
      let currentY = 0;

      // Header Top Accent Stripes
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(0, 0, 210, 6, "F");
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(0, 6, 210, 1.5, "F");

      currentY = 15;

      // Brand Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("STAY WILLAS", marginX, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("L U X U R Y   E S T A T E S   &   V I L L A S", marginX, currentY + 10);

      // Invoice Header metadata (Right Aligned)
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("RESERVATION INVOICE", 210 - marginX, currentY + 4, { align: "right" });

      doc.setFontSize(8.5);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const invoiceNum = `SW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc.text(`Invoice ID: ${invoiceNum}`, 210 - marginX, currentY + 9, { align: "right" });
      doc.text(`Date: ${invoiceDate}`, 210 - marginX, currentY + 13, { align: "right" });

      currentY += 22;

      // Gold Divider Line
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.line(marginX, currentY, 210 - marginX, currentY);

      currentY += 6;

      // Guest Info & Property Operator Cards
      const cardWidth = 87;
      const cardHeight = 24;

      // Left Card: Prepared For Guest
      doc.setFillColor(lightBeige[0], lightBeige[1], lightBeige[2]);
      doc.rect(marginX, currentY, cardWidth, cardHeight, "F");
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.2);
      doc.rect(marginX, currentY, cardWidth, cardHeight, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("PREPARED FOR GUEST:", marginX + 4, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
      doc.text(guestName || "Valued Guest", marginX + 4, currentY + 10);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Phone: ${guestPhone || "N/A"}`, marginX + 4, currentY + 14.5);
      doc.text(`Email: ${guestEmail || "N/A"}`, marginX + 4, currentY + 18.5);

      // Right Card: Property Operator
      const rightCardX = 210 - marginX - cardWidth;
      doc.setFillColor(lightBeige[0], lightBeige[1], lightBeige[2]);
      doc.rect(rightCardX, currentY, cardWidth, cardHeight, "F");
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.2);
      doc.rect(rightCardX, currentY, cardWidth, cardHeight, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("PROPERTY OPERATOR:", rightCardX + 4, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
      doc.text("Stay Willas Luxury Estates", rightCardX + 4, currentY + 10);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Concierge: +91 9619042310", rightCardX + 4, currentY + 14.5);
      doc.text("Website: www.staywillas.com", rightCardX + 4, currentY + 18.5);

      currentY += cardHeight + 6;

      // Summary Banner
      const activeVillaName = getSelectedVillaName();
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 16, "F");
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.rect(marginX, currentY, 210 - marginX * 2, 16, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("RESERVATION SUMMARY", marginX + 4, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`${activeVillaName}  |  ${numNights} Night(s)  |  ${numGuestsCount} Guests`, marginX + 4, currentY + 10);

      if (checkInDate || checkOutDate) {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(218, 165, 32);
        const cinStr = checkInDate ? formatDateLabel(checkInDate) : "N/A";
        const coutStr = checkOutDate ? formatDateLabel(checkOutDate) : "N/A";
        doc.text(`Check-In: ${cinStr} (2:00 PM)   |   Check-Out: ${coutStr} (11:00 AM)`, marginX + 4, currentY + 14);
      }

      currentY += 21;

      // Itemized Table Header
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 7.5, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("ITEM DESCRIPTION", marginX + 4, currentY + 5);
      doc.text("QTY / PAX", 105, currentY + 5);
      doc.text("RATE", 145, currentY + 5);
      doc.text("TOTAL TARIFF", 175, currentY + 5);

      currentY += 7.5;

      let isRowEven = false;
      const drawTableRow = (desc: string, qty: string, rate: string, total: string) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);

        if (isRowEven) {
          doc.setFillColor(lightBeige[0], lightBeige[1], lightBeige[2]);
          doc.rect(marginX, currentY, 210 - marginX * 2, 7.5, "F");
        }

        doc.setDrawColor(235, 235, 235);
        doc.setLineWidth(0.1);
        doc.line(marginX, currentY + 7.5, 210 - marginX, currentY + 7.5);

        doc.text(desc, marginX + 4, currentY + 5);
        doc.text(qty, 105, currentY + 5);
        doc.text(rate, 145, currentY + 5);
        doc.setFont("Helvetica", "bold");
        doc.text(total, 175, currentY + 5);

        isRowEven = !isRowEven;
        currentY += 7.5;
      };

      // Rows: Each Night Tariff
      nightRates.forEach((r, idx) => {
        const nightLbl = getNightDateLabel(idx);
        const amt = typeof r === "number" ? r : 0;
        drawTableRow(
          `Stay Tariff - ${nightLbl}`,
          `1 Night`,
          `Rs. ${amt.toLocaleString("en-IN")}`,
          `Rs. ${amt.toLocaleString("en-IN")}`
        );
      });

      if (totalInvoiceFoodCost > 0) {
        drawTableRow(
          invoiceFoodNote ? `Catering Plan: ${invoiceFoodNote}` : `Catering & Meal Plan`,
          `${numGuestsCount} Pax`,
          `Package`,
          `Rs. ${totalInvoiceFoodCost.toLocaleString("en-IN")}`
        );
      }

      extraCharges.forEach((c) => {
        drawTableRow(c.description, `Add-on`, `Rs. ${c.amount.toLocaleString("en-IN")}`, `Rs. ${c.amount.toLocaleString("en-IN")}`);
      });

      currentY += 6;

      // Right summary block
      const rightAlignX = 135;
      const drawSummaryRow = (label: string, value: string, isBold = false, textColor = darkCharcoal) => {
        doc.setFont("Helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(isBold ? 9.5 : 8.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(label, rightAlignX, currentY);
        doc.text(value, 175, currentY);
        currentY += 5.5;
      };

      drawSummaryRow("Gross Subtotal:", `Rs. ${subtotalBeforeDiscount.toLocaleString("en-IN")}`);
      if (totalDiscount > 0) {
        drawSummaryRow("Discount:", `- Rs. ${totalDiscount.toLocaleString("en-IN")}`, false, [180, 40, 40]);
      }
      if (activeGstPercent > 0) {
        drawSummaryRow(`GST Tax (${activeGstPercent}%):`, `Rs. ${gstAmount.toLocaleString("en-IN")}`);
      }
      if (numDeposit > 0) {
        drawSummaryRow("Refundable Deposit:", `Rs. ${numDeposit.toLocaleString("en-IN")}`);
      }

      currentY += 1;
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(rightAlignX - 2, currentY - 4, 210 - marginX - (rightAlignX - 2), 9, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("NET GRAND TOTAL:", rightAlignX, currentY + 1.5);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Rs. ${grandTotal.toLocaleString("en-IN")}`, 175, currentY + 1.5);

      currentY += 10;

      if (numAdvance > 0) {
        drawSummaryRow("Advance Paid:", `Rs. ${numAdvance.toLocaleString("en-IN")}`, false, [16, 122, 68]);
        drawSummaryRow("Balance Remaining:", balanceDue <= 0 ? "PAID IN FULL" : `Rs. ${balanceDue.toLocaleString("en-IN")}`, true, [27, 53, 100]);
      }

      currentY += 6;

      // Bank Payment Box
      doc.setFillColor(lightBeige[0], lightBeige[1], lightBeige[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 22, "F");
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 22, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("PAYMENT DETAILS & BANK TRANSFER:", marginX + 4, currentY + 5);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
      doc.text("Bank Name: HDFC Bank   |   Account Name: STAY WILLAS ENTERPRISES", marginX + 4, currentY + 10);
      doc.text("A/C No: 50200084729103   |   IFSC Code: HDFC0000241", marginX + 4, currentY + 14.5);
      doc.text("UPI / PhonePe / GPay: 9619042310@okbizaxis", marginX + 4, currentY + 19);

      // Save PDF
      doc.save(`StayWillas_Invoice_${guestName.replace(/[^a-zA-Z0-9]/g, "_") || "Guest"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please verify details and try again.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header & Simple Mode Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-[#1B3564]">
              <span className="p-2 rounded-xl bg-[#1B3564]/5 text-[#1B3564]">
                <Calculator className="w-5 h-5 text-[#DAA520]" />
              </span>
              <h2 className="text-xl font-bold font-serif tracking-tight">Stay Willas Quotation & Billing Suite</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Create clean villa invoices or catering quotes. All pricing fields start completely blank so you can enter custom rates directly.
            </p>
          </div>

          {/* Simple Tab Switcher */}
          <div className="flex items-center bg-[#FAF8F5] p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveCalculator("invoice")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCalculator === "invoice"
                  ? "bg-[#1B3564] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#1B3564]"
              }`}
            >
              <FileText className="w-4 h-4 text-[#DAA520]" />
              <span>Invoice Calculator</span>
              {totalInvoiceFoodCost > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveCalculator("food")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCalculator === "food"
                  ? "bg-[#1B3564] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#1B3564]"
              }`}
            >
              <Utensils className="w-4 h-4 text-[#DAA520]" />
              <span>Food Calculator</span>
              {totalFoodCostCalculated > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-700 px-1.5 py-0.5 rounded-md font-semibold">
                  ₹{totalFoodCostCalculated.toLocaleString("en-IN")}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sync notification if food was applied */}
        {foodAppliedToInvoice && activeCalculator === "invoice" && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Food Applied:</strong> {invoiceFoodNote} — <strong>₹{totalInvoiceFoodCost.toLocaleString("en-IN")}</strong>
              </span>
            </div>
            <button
              onClick={() => setFoodAppliedToInvoice(false)}
              className="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 1. INVOICE CALCULATOR TAB */}
      {/* =================================================================== */}
      {activeCalculator === "invoice" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Container (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Guest Information */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">1</span>
                  <User className="w-4 h-4 text-[#DAA520]" />
                  <span>Guest Information</span>
                </div>
                <span className="text-[11px] text-slate-400">Primary guest contact</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Primary Guest Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Villa & Dates */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">2</span>
                  <Building2 className="w-4 h-4 text-[#DAA520]" />
                  <span>Villa Property & Stay Dates</span>
                </div>
                <span className="text-[11px] text-slate-400">Select estate & schedule</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Villa Property</label>
                  <select
                    value={selectedVillaSlug}
                    onChange={(e) => setSelectedVillaSlug(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-medium text-slate-900"
                  >
                    <option value="">-- Choose Villa Property --</option>
                    {villas.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.name} ({v.location})
                      </option>
                    ))}
                    <option value="custom">✨ Custom Property / Other Estate</option>
                  </select>
                </div>

                {selectedVillaSlug === "custom" && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Custom Property Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Whispering Pines Villa, Lonavala"
                      value={customPropertyName}
                      onChange={(e) => setCustomPropertyName(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#DAA520]" />
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => handleDateChange(e.target.value, checkOutDate)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#DAA520]" />
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    min={checkInDate || undefined}
                    value={checkOutDate}
                    onChange={(e) => handleDateChange(checkInDate, e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-medium"
                  />
                </div>
              </div>

              {/* Nights & Guests Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-700">Total Nights Duration</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleNightsChange(nights + 1)}
                        className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        + 1 Night
                      </button>
                      {nights > 1 && (
                        <button
                          type="button"
                          onClick={() => handleNightsChange(nights - 1)}
                          className="text-[10px] font-bold bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          - 1 Night
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={nights || ""}
                    onChange={(e) => handleNightsChange(e.target.value === "" ? 1 : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-[#FAF8F5] focus:bg-white focus:outline-none font-bold text-[#1B3564]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Total Guests (Pax Count)</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 12"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-[#FAF8F5] focus:bg-white focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Night-by-Night Pricing (Night 1, Night 2, etc. - Empty by Default) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">3</span>
                  <Calendar className="w-4 h-4 text-[#DAA520]" />
                  <span>Nightly Stay Rates ({nights} Night{nights > 1 ? "s" : ""})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {nights > 1 && nightRates[0] !== "" && (
                    <button
                      type="button"
                      onClick={handleCopyNight1ToAll}
                      className="text-[11px] font-bold text-[#1B3564] hover:text-[#152a50] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#DAA520]" />
                      <span>Apply Night 1 to All</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleNightsChange(nights + 1)}
                    className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Night</span>
                  </button>
                  {nights > 1 && (
                    <button
                      type="button"
                      onClick={() => handleNightsChange(nights - 1)}
                      className="text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg cursor-pointer transition-all"
                    >
                      Remove Night
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Enter tariff for each booked night (Night 1, Night 2, etc.). Pricing fields are left blank so you can enter the agreed rates directly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
                {nightRates.map((rate, index) => {
                  const nightLabel = getNightDateLabel(index);
                  return (
                    <div key={index} className="bg-[#FAF8F5] border border-slate-200 rounded-2xl p-3.5 space-y-1.5 focus-within:border-[#1B3564] focus-within:bg-white transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#1B3564] text-white text-[10px] flex items-center justify-center font-black">
                            {index + 1}
                          </span>
                          <span>{nightLabel}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tariff</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">₹</span>
                        <input
                          type="number"
                          placeholder="Enter tariff..."
                          value={rate}
                          onChange={(e) => handleNightRateChange(index, e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 bg-white focus:outline-none focus:border-[#1B3564] font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 font-medium">
                  Total Stay Tariff ({nights} Night{nights > 1 ? "s" : ""}):
                </span>
                <span className="text-sm font-black text-[#1B3564]">
                  ₹{totalStayCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* 4. Food & Catering Options */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">4</span>
                  <Utensils className="w-4 h-4 text-[#DAA520]" />
                  <span>Food & Catering Cost</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCalculator("food")}
                  className="text-xs text-[#1B3564] hover:text-[#DAA520] font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Food Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Total Food / Catering Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter total food cost or use Food Calculator..."
                    value={invoiceFoodCost}
                    onChange={(e) => setInvoiceFoodCost(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Meal Notes / Package Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Veg & Non-Veg Menu, 12 Pax for 2 Days"
                    value={invoiceFoodNote}
                    onChange={(e) => setInvoiceFoodNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Custom Add-ons, Adjustments & Advance */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">5</span>
                  <ShieldCheck className="w-4 h-4 text-[#DAA520]" />
                  <span>Add-ons, Taxes & Payment Advance</span>
                </div>
                <span className="text-[11px] text-slate-400">Discounts, GST, Deposit</span>
              </div>

              {/* Add-on form */}
              <form onSubmit={handleAddInvoiceExtra} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200">
                <div className="sm:col-span-6">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Add-on Item Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Pool Heating, Bonfire Setup, Decor"
                    value={newExtraDesc}
                    onChange={(e) => setNewExtraDesc(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#1B3564]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={newExtraAmount}
                    onChange={(e) => setNewExtraAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1B3564] text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-[#1B3564]/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Extras List */}
              {extraCharges.length > 0 && (
                <div className="space-y-2">
                  {extraCharges.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span className="font-medium text-slate-800">{item.description}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1B3564]">₹{item.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => setExtraCharges(extraCharges.filter((c) => c.id !== item.id))}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Advance Paid & Security Deposit Dedicated Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-[#FAF8F5] to-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                {/* Advance Paid */}
                <div className="bg-white p-4 rounded-xl border border-emerald-300/80 shadow-xs space-y-1.5 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Advance Received / Paid (₹)</span>
                    </label>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Already Received
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 select-none">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full text-sm font-black border border-emerald-200 rounded-xl pl-7 pr-3 py-2.5 bg-emerald-50/40 focus:bg-white focus:outline-none focus:border-emerald-500 text-emerald-950"
                    />
                  </div>
                  <span className="text-[10.5px] text-slate-500 block">Deducted from the total to show remaining balance at check-in</span>
                </div>

                {/* Security Deposit */}
                <div className="bg-white p-4 rounded-xl border border-amber-300/80 shadow-xs space-y-1.5 focus-within:ring-2 focus-within:ring-amber-400/30 transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#DAA520]" />
                      <span>Security Deposit (₹)</span>
                    </label>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Refundable
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700 select-none">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full text-sm font-black border border-amber-200 rounded-xl pl-7 pr-3 py-2.5 bg-amber-50/40 focus:bg-white focus:outline-none focus:border-[#DAA520] text-slate-900"
                    />
                  </div>
                  <span className="text-[10.5px] text-slate-500 block">Refundable deposit held for property care during the stay</span>
                </div>
              </div>

              {/* Discounts & GST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                {/* Discount */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Discount Flat (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={discountFlat}
                    onChange={(e) => setDiscountFlat(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-[#FAF8F5] focus:bg-white focus:outline-none font-medium"
                  />
                </div>

                {/* GST Chips */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">GST Tax</label>
                  <div className="flex items-center gap-1.5">
                    {[0, 5, 12, 18].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setGstPercent(pct);
                          setCustomGst("");
                        }}
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          gstPercent === pct && customGst === ""
                            ? "bg-[#1B3564] text-white border-[#1B3564]"
                            : "bg-[#FAF8F5] text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {pct === 0 ? "0%" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Live Invoice Summary */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border-2 border-[#1B3564]/15 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#1B3564] font-serif">Invoice Breakdown</h3>
                <button
                  onClick={handleResetInvoice}
                  type="button"
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Property summary pill */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#1B3564]">{getSelectedVillaName()}</div>
                <div className="text-slate-500 text-[11px]">
                  {numNights} Night(s) | {numGuestsCount} Guests
                  {checkInDate && ` | In: ${formatDateLabel(checkInDate)}`}
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1.5 pb-2 border-b border-slate-100">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Villa Stay Tariff ({numNights}N):</span>
                    <span className="text-[#1B3564]">₹{totalStayCost.toLocaleString("en-IN")}</span>
                  </div>
                  {/* Night-by-night breakdown */}
                  <div className="space-y-1 pl-2 border-l-2 border-slate-200 text-[11px] text-slate-500">
                    {nightRates.map((rate, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{getNightDateLabel(i)}:</span>
                        <span className="font-semibold text-slate-700">
                          {typeof rate === "number" ? `₹${rate.toLocaleString("en-IN")}` : "₹0"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {totalInvoiceFoodCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Food & Catering:</span>
                    <span className="font-bold text-slate-900">₹{totalInvoiceFoodCost.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {totalExtrasCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Add-ons & Extras:</span>
                    <span className="font-bold text-slate-900">₹{totalExtrasCost.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-2 font-medium">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{subtotalBeforeDiscount.toLocaleString("en-IN")}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount Applied:</span>
                    <span className="font-bold">- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {activeGstPercent > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({activeGstPercent}%):</span>
                    <span className="font-bold text-slate-900">₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {numDeposit > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Refundable Deposit:</span>
                    <span className="font-bold">₹{numDeposit.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {/* Grand Total Bar */}
                <div className="p-4 bg-[#1B3564] text-white rounded-2xl flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-[#DAA520] font-bold uppercase tracking-wider block">Net Payable</span>
                    <span className="text-xl font-black font-serif">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {balanceDue <= 0 && numAdvance > 0 ? (
                    <span className="text-[11px] bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg">PAID FULL</span>
                  ) : null}
                </div>

                {/* Advance & Balance Due Section */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mt-2">
                  <div className="flex justify-between text-emerald-800 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Advance Received:
                    </span>
                    <span>{numAdvance > 0 ? `₹${numAdvance.toLocaleString("en-IN")}` : "₹0"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-black">
                    <span className="text-slate-700 uppercase tracking-wider text-[10px]">
                      Balance at Check-In:
                    </span>
                    <span className={`text-base font-black font-heading ${balanceDue <= 0 ? "text-emerald-600" : "text-amber-900"}`}>
                      {balanceDue <= 0 ? "PAID IN FULL" : `₹${balanceDue.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-full bg-[#1B3564] text-white py-3 px-4 rounded-xl text-xs font-bold hover:bg-[#1B3564]/90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#DAA520]" />
                  <span>Download PDF Invoice</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="bg-[#25D366] text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>💬 WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyInvoiceText}
                    className="bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedInvoice ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedInvoice ? "Copied!" : "Copy Quote"}</span>
                  </button>
                </div>

                {guestEmail && (
                  <button
                    type="button"
                    onClick={handleSendDirectEmail}
                    disabled={isSendingEmail}
                    className="w-full border border-slate-300 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4 text-[#1B3564]" />
                    <span>{isSendingEmail ? "Sending Email..." : "Email to Guest"}</span>
                  </button>
                )}

                {emailFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      emailFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {emailFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{emailFeedback.msg}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. FOOD / CATERING CALCULATOR TAB */}
      {/* =================================================================== */}
      {activeCalculator === "food" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Container */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Menu Package Selection */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">1</span>
                  <Utensils className="w-4 h-4 text-[#DAA520]" />
                  <span>Choose Menu Type</span>
                </div>
                <span className="text-[11px] text-slate-400">Pure Veg, Non-Veg or Mix</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "veg", label: "🥗 Veg Menu", desc: "Pure vegetarian spread" },
                  { id: "non-veg", label: "🍗 Non-Veg Menu", desc: "Chicken & Mutton dishes" },
                  { id: "mix", label: "🍲 Mix Menu", desc: "Veg & Non-Veg combo" },
                  { id: "custom", label: "✨ Custom Package", desc: "Bespoke meal plan" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFoodMenuType(item.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      foodMenuType === item.id
                        ? "bg-[#1B3564] text-white border-[#1B3564] shadow-xs"
                        : "bg-[#FAF8F5] text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${foodMenuType === item.id ? "text-slate-200" : "text-slate-400"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Pax, Days & Rate (PRICING FIELD STARTS BLANK PER CLIENT REQUIREMENT) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">2</span>
                  <Calendar className="w-4 h-4 text-[#DAA520]" />
                  <span>Guests, Duration & Custom Rate</span>
                </div>
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Pricing field is empty for manual input
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Number of Guests (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 12"
                    value={foodPax}
                    onChange={(e) => setFoodPax(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Total eating guests</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Number of Days / Meals</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 2"
                    value={foodDays}
                    onChange={(e) => setFoodDays(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Days of catering service</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Rate per Person / Day (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter rate per person..."
                    value={foodRatePerPerson}
                    onChange={(e) => setFoodRatePerPerson(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564] font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Empty by default — type agreed rate</span>
                </div>
              </div>

              {numFoodPax > 0 && numFoodDays > 0 && numFoodRate > 0 && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-slate-700">
                    Base Meals: <strong>{numFoodPax} Pax</strong> × <strong>{numFoodDays} Day(s)</strong> @ <strong>₹{numFoodRate.toLocaleString("en-IN")}</strong>:
                  </span>
                  <span className="font-bold text-[#1B3564] text-sm">₹{baseFoodCost.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            {/* Step 3: Catering Extras (BBQ, High Tea, Chef fees) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                  <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px]">3</span>
                  <Plus className="w-4 h-4 text-[#DAA520]" />
                  <span>Optional Food Extras & Add-ons</span>
                </div>
                <span className="text-[11px] text-slate-400">BBQ, High-tea, Starters</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  "Barbeque (BBQ) Setup",
                  "High Tea & Evening Snacks",
                  "Live Tandoor Counter",
                  "Dedicated Chef / Helper Fee",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewFoodExtraDesc(preset)}
                    className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddFoodExtra} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200">
                <div className="sm:col-span-6">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Add-on Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Barbeque Setup"
                    value={newFoodExtraDesc}
                    onChange={(e) => setNewFoodExtraDesc(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#1B3564]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    value={newFoodExtraAmount}
                    onChange={(e) => setNewFoodExtraAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1B3564] text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-[#1B3564]/90 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {foodExtras.length > 0 && (
                <div className="space-y-2">
                  {foodExtras.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span className="font-medium text-slate-800">{item.description}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1B3564]">₹{item.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => setFoodExtras(foodExtras.filter((c) => c.id !== item.id))}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Food GST toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Food GST / Tax:</span>
                <div className="flex items-center gap-2">
                  {[0, 5, 18].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setFoodGstPercent(pct)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        foodGstPercent === pct
                          ? "bg-[#1B3564] text-white border-[#1B3564]"
                          : "bg-[#FAF8F5] text-slate-600 border-slate-200"
                      }`}
                    >
                      {pct === 0 ? "No GST (0%)" : `${pct}% GST`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Food Quotation Summary */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border-2 border-[#1B3564]/15 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#1B3564] font-serif">Food Quotation</h3>
                <button
                  onClick={handleResetFood}
                  type="button"
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Menu Plan Badge */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#1B3564] uppercase tracking-wide">
                  {foodMenuType === "veg"
                    ? "🥗 Pure Vegetarian Menu"
                    : foodMenuType === "non-veg"
                    ? "🍗 Non-Vegetarian Menu"
                    : foodMenuType === "mix"
                    ? "🍲 Mix Veg & Non-Veg Menu"
                    : "✨ Custom Catering Package"}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {numFoodPax} Pax | {numFoodDays} Day(s)
                </div>
              </div>

              {/* Calculation lines */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Meal Tariff:</span>
                  <span className="font-bold text-slate-900">₹{baseFoodCost.toLocaleString("en-IN")}</span>
                </div>

                {foodExtrasCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Food Add-ons:</span>
                    <span className="font-bold text-slate-900">₹{foodExtrasCost.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {foodGstAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({foodGstPercent}%):</span>
                    <span className="font-bold text-slate-900">₹{foodGstAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {/* Total Box */}
                <div className="p-4 bg-[#1B3564] text-white rounded-2xl flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-[#DAA520] font-bold uppercase tracking-wider block">Total Food Cost</span>
                    <span className="text-xl font-black font-serif">₹{totalFoodCostCalculated.toLocaleString("en-IN")}</span>
                  </div>
                  {numFoodPax > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block">Per Person</span>
                      <span className="text-xs font-bold text-[#DAA520]">₹{perPersonTotalFoodCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 1-Click Action to Apply into Invoice */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleApplyFoodToInvoice}
                  disabled={totalFoodCostCalculated <= 0}
                  className="w-full bg-[#DAA520] hover:bg-[#c6951b] text-slate-950 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Apply to Invoice Calculator</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShareFoodWhatsApp}
                    className="bg-[#25D366] text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>💬 WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyFoodText}
                    className="bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedFood ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedFood ? "Copied!" : "Copy Quote"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
