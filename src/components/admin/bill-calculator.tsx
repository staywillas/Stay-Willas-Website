"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, User, FileText, Plus, Trash2, Download, Calculator, Mail, Send, Share2, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
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
}

interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export default function BillCalculator({ villas }: BillCalculatorProps) {
  // Guest Details
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Stay Settings
  const [selectedVillaSlug, setSelectedVillaSlug] = useState("");
  const [ratePerNight, setRatePerNight] = useState(0);
  const [weekendRatePerNight, setWeekendRatePerNight] = useState(0);
  const [nights, setNights] = useState(1);
  const [weekendNights, setWeekendNights] = useState(0); // number of weekend nights in the stay
  const [guestsCount, setGuestsCount] = useState(1);
  const [baseGuests, setBaseGuests] = useState(12);
  const [extraGuestFee, setExtraGuestFee] = useState(1500);

  // Food Settings
  const [foodPlan, setFoodPlan] = useState<"none" | "standard" | "deluxe" | "custom">("none");
  const [foodRatePerPersonPerDay, setFoodRatePerPersonPerDay] = useState(0);
  const [foodGuestsCount, setFoodGuestsCount] = useState(0);

  // Extra Charges List
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newExtraDesc, setNewExtraDesc] = useState("");
  const [newExtraAmount, setNewExtraAmount] = useState<number | "">("");

  // Adjustments & Discounts & Advance
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);
  const [advancePaid, setAdvancePaid] = useState(0);

  // Email & Communication States
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Reset all calculator inputs
  const handleResetAll = () => {
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setSelectedVillaSlug("");
    setRatePerNight(0);
    setWeekendRatePerNight(0);
    setNights(1);
    setWeekendNights(0);
    setGuestsCount(1);
    setBaseGuests(12);
    setExtraGuestFee(1500);
    setFoodPlan("none");
    setFoodRatePerPersonPerDay(0);
    setFoodGuestsCount(0);
    setExtraCharges([]);
    setNewExtraDesc("");
    setNewExtraAmount("");
    setDiscountPercent(0);
    setDiscountFlat(0);
    setGstPercent(18);
    setAdvancePaid(0);
    setEmailFeedback(null);
  };

  // Auto-Draft Mailto Link Launcher (Opens client email app with pre-written text & details)
  const handleDraftMailto = () => {
    const selectedVilla = villas.find((v) => v.slug === selectedVillaSlug);
    const villaName = selectedVilla ? selectedVilla.name : "Villa Property";
    const villaLoc = selectedVilla ? selectedVilla.location : "";

    const mailSubject = `Stay Willas Booking Invoice - ${villaName} (${guestName || "Guest"})`;
    const mailBody = `Dear ${guestName || "Valued Guest"},\n\n` +
      `Thank you for choosing Stay Willas Luxury Estates!\n\n` +
      `Below is your reservation invoice summary for your stay at ${villaName} (${villaLoc}):\n` +
      `------------------------------------------\n` +
      `• Primary Guest: ${guestName || "N/A"}\n` +
      `• Contact Phone: ${guestPhone || "N/A"}\n` +
      `• Total Duration: ${nights} Night(s)\n` +
      `• Guest Count: ${guestsCount} Guest(s)\n` +
      `------------------------------------------\n` +
      `• Stay Accommodation Tariff: Rs. ${totalStayCost.toLocaleString("en-IN")}\n` +
      (foodPlan !== "none" ? `• Catering Plan (${foodPlan}): Rs. ${totalFoodCost.toLocaleString("en-IN")}\n` : "") +
      (totalExtrasCost > 0 ? `• Add-ons & Custom Extras: Rs. ${totalExtrasCost.toLocaleString("en-IN")}\n` : "") +
      `• Subtotal: Rs. ${subtotalBeforeDiscount.toLocaleString("en-IN")}\n` +
      `• GST Tax (${gstPercent}%): Rs. ${gstAmount.toLocaleString("en-IN")}\n` +
      `• NET PAYABLE GRAND TOTAL: Rs. ${grandTotal.toLocaleString("en-IN")}\n` +
      `------------------------------------------\n` +
      `• Advance Received: Rs. ${advancePaid.toLocaleString("en-IN")}\n` +
      `• BALANCE REMAINING: ${balanceDue <= 0 ? "PAID IN FULL" : `Rs. ${balanceDue.toLocaleString("en-IN")}`}\n` +
      `------------------------------------------\n\n` +
      `Please find your detailed invoice statement PDF attached.\n\n` +
      `Warm regards,\n` +
      `Stay Willas Luxury Estates Concierge\n` +
      `WhatsApp / Call: +91 9619042310 | www.staywillas.com`;

    const mailtoUrl = `mailto:${encodeURIComponent(guestEmail || "")}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoUrl;
  };

  // Direct Server-Side Email Dispatch via Resend / Nodemailer
  const handleSendDirectEmail = async () => {
    const selectedVilla = villas.find((v) => v.slug === selectedVillaSlug);
    if (!selectedVilla) return;

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
      villaName: selectedVilla.name,
      location: selectedVilla.location,
      nights,
      guestsCount,
      totalStayCost,
      foodPlanName: foodPlan === "none" ? "No Meal Plan" : foodPlan,
      totalFoodCost,
      totalExtrasCost,
      subtotal: subtotalBeforeDiscount,
      gstPercent,
      gstAmount,
      grandTotal,
      advancePaid,
      balanceDue,
    });

    setIsSendingEmail(false);
    if (res.success) {
      setEmailFeedback({ type: "success", msg: res.message || "Invoice email dispatched to guest!" });
    } else {
      setEmailFeedback({ type: "error", msg: res.error || "Failed to send email." });
    }
  };

  // Share via WhatsApp Web / App
  const handleShareWhatsApp = () => {
    const selectedVilla = villas.find((v) => v.slug === selectedVillaSlug);
    const villaName = selectedVilla ? selectedVilla.name : "Stay Willas Property";

    const msg = `✨ *Stay Willas - Reservation Invoice* ✨\n` +
      `------------------------------------------\n` +
      `🏰 *Property:* ${villaName}\n` +
      `👤 *Guest Name:* ${guestName || "Valued Guest"}\n` +
      `🌙 *Stay Duration:* ${nights} Night(s)\n` +
      `👥 *Guests:* ${guestsCount} Pax\n` +
      `------------------------------------------\n` +
      `💰 *Grand Total:* Rs. ${grandTotal.toLocaleString("en-IN")}\n` +
      `💳 *Advance Received:* Rs. ${advancePaid.toLocaleString("en-IN")}\n` +
      `📌 *Balance Due:* ${balanceDue <= 0 ? "PAID IN FULL" : `Rs. ${balanceDue.toLocaleString("en-IN")}`}\n` +
      `------------------------------------------\n` +
      `Thank you for booking with Stay Willas! 🥂`;

    const cleanPhone = guestPhone ? guestPhone.replace(/[^0-9]/g, "") : "";
    const waUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");
  };

  // Prefill values when villa changes
  useEffect(() => {
    if (!selectedVillaSlug) return;
    const villa = villas.find((v) => v.slug === selectedVillaSlug);
    if (villa) {
      setRatePerNight(villa.price);
      setWeekendRatePerNight(villa.weekendPrice || villa.price * 1.2); // default 20% markup if not defined
      setBaseGuests(villa.baseGuests ?? 12);
      setExtraGuestFee(villa.extraGuestFee ?? 1500);
      setGuestsCount(villa.baseGuests ?? 12);
      setFoodGuestsCount(villa.baseGuests ?? 12);
    }
  }, [selectedVillaSlug, villas]);

  // Adjust food rate based on plan type
  useEffect(() => {
    if (foodPlan === "none") {
      setFoodRatePerPersonPerDay(0);
    } else if (foodPlan === "standard") {
      setFoodRatePerPersonPerDay(1200);
    } else if (foodPlan === "deluxe") {
      setFoodRatePerPersonPerDay(1500);
    }
  }, [foodPlan]);

  // Calculations
  const weekdayNights = Math.max(0, nights - weekendNights);
  const weekdayStayCost = weekdayNights * ratePerNight;
  const weekendStayCost = weekendNights * weekendRatePerNight;
  const totalBaseStayCost = weekdayStayCost + weekendStayCost;

  // Extra guests stays
  const extraGuestsCount = Math.max(0, guestsCount - baseGuests);
  const extraGuestsCost = extraGuestsCount * extraGuestFee * nights;

  // Total Stay Cost
  const totalStayCost = totalBaseStayCost + extraGuestsCost;

  // Total Food Cost
  const totalFoodCost = foodPlan !== "none" ? foodRatePerPersonPerDay * foodGuestsCount * nights : 0;

  // Total Extras
  const totalExtrasCost = extraCharges.reduce((acc, curr) => acc + curr.amount, 0);

  // Subtotal before discount
  const subtotalBeforeDiscount = totalStayCost + totalFoodCost + totalExtrasCost;

  // Calculate discount
  const calculatedPercentDiscount = subtotalBeforeDiscount * (discountPercent / 100);
  const totalDiscount = calculatedPercentDiscount + discountFlat;

  // Subtotal after discount
  const subtotal = Math.max(0, subtotalBeforeDiscount - totalDiscount);

  // GST & Total
  const gstAmount = subtotal * (gstPercent / 100);
  const grandTotal = subtotal + gstAmount;
  const balanceDue = grandTotal - advancePaid;

  // Add Extra Charge line
  const handleAddExtra = (e: React.FormEvent) => {
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

  // Remove Extra Charge
  const handleRemoveExtra = (id: string) => {
    setExtraCharges(extraCharges.filter((c) => c.id !== id));
  };

  // Generate & Download PDF Function (Bulletproof & Fast)
  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Load transparent company logo for PDF header & compress to reduce file size under 60KB
      let logoDataUrl: string | null = null;
      try {
        const logoImg = await loadImage("/images/STAY WILLAS logo transparent.png");
        const canvas = document.createElement("canvas");
        // Target 500px width for crystal-clear sharp print while keeping PDF size under 60KB
        const targetW = 500;
        const targetH = Math.round((logoImg.height / logoImg.width) * targetW) || 160;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(logoImg, 0, 0, targetW, targetH);
          logoDataUrl = canvas.toDataURL("image/png");
        }
      } catch (e) {
        console.warn("Could not load transparent logo for PDF, falling back to clean text header", e);
      }

      const activeVillaName = villas.find((v) => v.slug === selectedVillaSlug)?.name || "Stay Willas Estate";

      // Executive Brand Palette (Stay Willas Theme)
      const navyColor = [27, 53, 100];   // #1B3564 Navy
      const goldColor = [218, 165, 32];  // #DAA520 Gold
      const darkCharcoal = [30, 41, 59]; // #1E293B Text
      const lightBeige = [250, 248, 245]; // #FAF8F5 Card BG
      const borderGray = [226, 232, 240]; // #E2E8F0

      // Page margins & baseline
      const marginX = 15;
      let currentY = 0;

      // Header Top Dual Accent Stripe (Navy & Gold)
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(0, 0, 210, 6, "F");
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(0, 6, 210, 1.5, "F");

      currentY = 14;

      // Logo & Brand Header Info (Prominent, Big & Crisp)
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "PNG", marginX, currentY - 2, 56, 18, undefined, "FAST");
      } else {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
        doc.text("STAY WILLAS", marginX, currentY + 6);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.text("L U X U R Y   E S T A T E S   &   V I L L A S", marginX, currentY + 11);
      }

      // Invoice Header metadata (Right Aligned)
      doc.setFontSize(15);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("TAX INVOICE STATEMENT", 210 - marginX, currentY + 4, { align: "right" });

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
      doc.text(`Date Issued: ${invoiceDate}`, 210 - marginX, currentY + 13, { align: "right" });
      doc.text(`Billing Mode: LIVE RESERVATION`, 210 - marginX, currentY + 17, { align: "right" });

      currentY += 24;

      // Gold Divider Line
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.line(marginX, currentY, 210 - marginX, currentY);

      currentY += 6;

      // Guest Info Box (Left) & Property Operator Box (Right)
      const cardWidth = 87;
      const cardHeight = 26;

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
      doc.text(`Contact: ${guestPhone || "N/A"}`, marginX + 4, currentY + 15);
      doc.text(`Email: ${guestEmail || "N/A"}`, marginX + 4, currentY + 19);

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
      doc.setFontSize(8.5);
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
      doc.text("Stay Willas Luxury Estates", rightCardX + 4, currentY + 10);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text("Ghatkopar West, Mumbai, MH 400084", rightCardX + 4, currentY + 15);
      doc.text("Concierge Hotline: +91 9619042310", rightCardX + 4, currentY + 19);

      currentY += cardHeight + 6;

      // Reservation Overview Banner
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 14, "F");
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.rect(marginX, currentY, 210 - marginX * 2, 14, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("RESERVATION SUMMARY", marginX + 4, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      const reservationDetails = `${activeVillaName}  |  ${nights} Night(s) (${weekdayNights} Weekday, ${weekendNights} Weekend)  |  ${guestsCount} Guests`;
      doc.text(reservationDetails, marginX + 4, currentY + 10);

      currentY += 19;

      // Tariff Itemization Table Header
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 7.5, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("ITEM DESCRIPTION", marginX + 4, currentY + 5);
      doc.text("QTY / DURATION", 100, currentY + 5);
      doc.text("RATE", 145, currentY + 5);
      doc.text("TOTAL TARIFF", 175, currentY + 5);

      currentY += 7.5;

      // Table rows helper
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
        doc.text(qty, 100, currentY + 5);
        doc.text(rate, 145, currentY + 5);
        doc.setFont("Helvetica", "bold");
        doc.text(total, 175, currentY + 5);

        isRowEven = !isRowEven;
        currentY += 7.5;
      };

      // Row 1: Weekday Stay
      if (weekdayNights > 0) {
        drawTableRow(
          `Stay Tariff - Weekday Nights`,
          `${weekdayNights} Night(s)`,
          `Rs. ${ratePerNight.toLocaleString("en-IN")}`,
          `Rs. ${weekdayStayCost.toLocaleString("en-IN")}`
        );
      }

      // Row 2: Weekend Stay
      if (weekendNights > 0) {
        drawTableRow(
          `Stay Tariff - Weekend Nights`,
          `${weekendNights} Night(s)`,
          `Rs. ${weekendRatePerNight.toLocaleString("en-IN")}`,
          `Rs. ${weekendStayCost.toLocaleString("en-IN")}`
        );
      }

      // Row 3: Extra Guests Fee
      if (extraGuestsCount > 0) {
        drawTableRow(
          `Extra Guests Fee`,
          `${extraGuestsCount} Pax * ${nights} Nights`,
          `Rs. ${extraGuestFee.toLocaleString("en-IN")}`,
          `Rs. ${extraGuestsCost.toLocaleString("en-IN")}`
        );
      }

      // Row 4: Food plan cost
      if (foodPlan !== "none") {
        const foodPlanTitle =
          foodPlan === "standard"
            ? "STANDARD MENU"
            : foodPlan === "deluxe"
            ? "DELUXE MENU"
            : "CUSTOM MENU";
        drawTableRow(
          `Catering Package - ${foodPlanTitle}`,
          `${foodGuestsCount} Pax * ${nights} Days`,
          `Rs. ${foodRatePerPersonPerDay.toLocaleString("en-IN")}`,
          `Rs. ${totalFoodCost.toLocaleString("en-IN")}`
        );
      }

      // Custom Extras rows
      extraCharges.forEach((c) => {
        drawTableRow(
          c.description,
          "Add-on Service",
          `Rs. ${c.amount.toLocaleString("en-IN")}`,
          `Rs. ${c.amount.toLocaleString("en-IN")}`
        );
      });

      currentY += 8;

      // Subtotal, Discounts, Tax & Grand Total (Right Aligned Summary Block)
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
        drawSummaryRow("Discount Applied:", `- Rs. ${totalDiscount.toLocaleString("en-IN")}`, false, [180, 40, 40]);
      }
      drawSummaryRow(`Net Taxable Amount:`, `Rs. ${subtotal.toLocaleString("en-IN")}`);
      drawSummaryRow(`GST Tax (${gstPercent}%):`, `Rs. ${gstAmount.toLocaleString("en-IN")}`);
      
      // Grand Total Highlight Bar
      currentY += 1;
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(rightAlignX - 2, currentY - 4, 210 - marginX - (rightAlignX - 2), 9, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("NET PAYABLE AMOUNT:", rightAlignX, currentY + 1.5);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Rs. ${grandTotal.toLocaleString("en-IN")}`, 175, currentY + 1.5);

      currentY += 10;

      if (advancePaid > 0) {
        drawSummaryRow("Advance Paid:", `Rs. ${advancePaid.toLocaleString("en-IN")}`, false, [16, 122, 68]);
        const balanceText = balanceDue <= 0 ? "PAID IN FULL" : `Rs. ${balanceDue.toLocaleString("en-IN")}`;
        drawSummaryRow("BALANCE REMAINING:", balanceText, true, balanceDue <= 0 ? [16, 122, 68] : navyColor);
      }

      // Terms & Conditions Block (Bottom Left)
      let tcY = currentY - 28;
      if (tcY < 150) tcY = 175; // ensure proper position on page

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text("TERMS & BOOKING CONDITIONS:", marginX, tcY);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(110, 110, 110);
      doc.text("1. Security deposit is refundable within 48 hours post check-out verification.", marginX, tcY + 4);
      doc.text("2. Standard Check-in is 2:00 PM and Check-out is 11:00 AM.", marginX, tcY + 7.5);
      doc.text("3. Quiet hours apply in residential zones after 10:00 PM.", marginX, tcY + 11);
      doc.text("4. Meal plans once confirmed cannot be partially cancelled during stay.", marginX, tcY + 14.5);

      // Thank you banner & Footer
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("THANK YOU FOR CHOOSING STAY WILLAS!", marginX, tcY + 23);

      // Footer border line
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.setLineWidth(0.3);
      doc.line(marginX, 282, 210 - marginX, 282);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text("Stay Willas Luxury Estates  |  www.staywillas.com  |  WhatsApp Concierge: +91 9619042310", marginX, 286);
      doc.text("Page 1 of 1", 210 - marginX, 286, { align: "right" });

      // Trigger PDF download
      const safeGuestName = (guestName || "Guest").replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`StayWillas_Invoice_${safeGuestName}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Notice: PDF download encountered an issue. Check browser permissions.");
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-border-subtle rounded-3xl p-4 md:p-8 max-w-7xl mx-auto shadow-sm text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1B3564] text-white flex items-center justify-center shadow-md shrink-0">
            <Calculator className="w-6 h-6 text-[#DAA520]" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#1B3564]">Admin Invoice & Bill Calculator</h2>
            <p className="text-xs text-text-primary/60 mt-0.5">Calculate tariffs, food plans, add custom charges, and download invoice PDFs instantly.</p>
          </div>
        </div>
        
        {/* Quick Info Badge */}
        {selectedVillaSlug && (
          <div className="bg-white border border-[#DAA520]/40 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Selected Property</span>
              <span className="text-xs font-bold text-[#1B3564]">
                {villas.find(v => v.slug === selectedVillaSlug)?.name}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Container (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Guest Details */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#1B3564]">
                <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px] font-bold">1</span>
                <User size={16} className="text-[#DAA520]" />
                <span>Guest Details</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Primary Contact Info</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Primary Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 transition-colors font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 transition-colors font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 transition-colors font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Stay Configuration */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#1B3564]">
                <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px] font-bold">2</span>
                <Calendar size={16} className="text-[#DAA520]" />
                <span>Stay Configuration & Rates</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Property & Tariff Setup</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Villa Location *</label>
                <select
                  value={selectedVillaSlug}
                  onChange={(e) => setSelectedVillaSlug(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold text-[#1B3564]"
                >
                  <option value="">-- Select Villa Property --</option>
                  {villas.map((v) => (
                    <option key={v.slug} value={v.slug}>
                      {v.name} ({v.location}) - Rs. {v.price.toLocaleString("en-IN")}/n
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Weekday Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={ratePerNight || ""}
                    onChange={(e) => setRatePerNight(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Weekend Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={weekendRatePerNight || ""}
                    onChange={(e) => setWeekendRatePerNight(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Total Stay Nights</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={nights || ""}
                    onChange={(e) => setNights(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Weekend Nights</label>
                  <input
                    type="number"
                    min={0}
                    max={nights}
                    placeholder="0"
                    value={weekendNights || ""}
                    onChange={(e) => setWeekendNights(e.target.value === "" ? 0 : Math.min(nights, Math.max(0, Number(e.target.value))))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold text-amber-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Total Guests Count</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={guestsCount || ""}
                    onChange={(e) => setGuestsCount(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Base Included Guests</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={baseGuests || ""}
                    onChange={(e) => setBaseGuests(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none font-bold"
                  />
                </div>
              </div>

              {extraGuestsCount > 0 && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center text-xs text-emerald-900 font-semibold">
                  <span>Extra Guest Tariff ({extraGuestsCount} Pax @ ₹{extraGuestFee.toLocaleString("en-IN")}/night):</span>
                  <span className="font-bold text-emerald-950">₹{extraGuestsCost.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Food Packages */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#1B3564]">
                <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px] font-bold">3</span>
                <Sparkles size={16} className="text-[#DAA520]" />
                <span>Catering & Food Plans</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Meal Package Options</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Food Plan</label>
                <select
                  value={foodPlan}
                  onChange={(e) => setFoodPlan(e.target.value as any)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold"
                >
                  <option value="none">No Meal Plan</option>
                  <option value="standard">Standard Pricing (Rs. 1,200/day)</option>
                  <option value="deluxe">Deluxe Pricing (Rs. 1,500/day)</option>
                  <option value="custom">Custom Rate Package</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Rate per Person / Day (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  disabled={foodPlan === "none"}
                  value={foodRatePerPersonPerDay || ""}
                  onChange={(e) => setFoodRatePerPersonPerDay(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Total Eating Guest Count</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  disabled={foodPlan === "none"}
                  value={foodGuestsCount || ""}
                  onChange={(e) => setFoodGuestsCount(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-3 bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#1B3564]/50 font-bold disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Extra Custom Charges */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-[#1B3564]">
                <span className="w-6 h-6 rounded-full bg-[#1B3564] text-[#DAA520] flex items-center justify-center text-[11px] font-bold">4</span>
                <Plus size={16} className="text-[#DAA520]" />
                <span>Custom Add-ons & Extra Charges</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Pool heating, BBQ, Decor</span>
            </div>

            <form onSubmit={handleAddExtra} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-[#FAF8F5] p-4.5 rounded-2xl border border-border-subtle/40">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Charge Description</label>
                <input
                  type="text"
                  placeholder="e.g. Pool Heating, BBQ Setup, Hookah Set"
                  value={newExtraDesc}
                  onChange={(e) => setNewExtraDesc(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#1B3564]/50"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={newExtraAmount}
                    onChange={(e) => setNewExtraAmount(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="w-full text-xs border border-border-subtle rounded-xl px-4 py-2.5 bg-white focus:outline-none font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 h-[40px] flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Add Charge
                </button>
              </div>
            </form>

            {extraCharges.length > 0 && (
              <div className="border border-border-subtle/30 rounded-2xl overflow-hidden text-xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-border-subtle/30 flex justify-between font-bold text-[#1B3564]">
                  <span>Item Description</span>
                  <span>Total Amount</span>
                </div>
                <div className="divide-y divide-border-subtle/20 bg-white">
                  {extraCharges.map((item) => (
                    <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-800">{item.description}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1B3564]">₹{item.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(item.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Summary Card Column (Sticky & Smooth Scrollable) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#DAA520]/40 rounded-3xl shadow-xl sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden transition-all duration-300">
            
            {/* Header (Fixed at top of summary) */}
            <div className="px-5 py-3.5 bg-[#1B3564] text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                <FileText size={16} className="text-[#DAA520]" />
                <span>Bill Breakdown Summary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetAll}
                  title="Reset calculator inputs"
                  className="text-[10px] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
                <span className="text-[10px] text-[#DAA520] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">Live Calc</span>
              </div>
            </div>

            {/* Body Content (Scrollable with overscroll containment) */}
            <div className="p-5 space-y-4 text-xs flex-1 overflow-y-auto overscroll-contain custom-scrollbar scroll-smooth">
              {/* Stays Cost */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Stay Tariff ({nights} Nights)</span>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block text-sm">₹{totalStayCost.toLocaleString("en-IN")}</span>
                  {extraGuestsCount > 0 && (
                    <span className="text-[10px] text-emerald-700 block font-semibold">(Incl. {extraGuestsCount} Extra Guests)</span>
                  )}
                </div>
              </div>

              {/* Food Cost */}
              {foodPlan !== "none" && (
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Food Package ({foodGuestsCount} Pax)</span>
                  <span className="font-bold text-slate-900 text-sm">₹{totalFoodCost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Extras Cost */}
              {totalExtrasCost > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Add-ons & Extras</span>
                  <span className="font-bold text-slate-900 text-sm">₹{totalExtrasCost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Gross Subtotal */}
              <div className="flex justify-between items-center font-bold text-slate-900 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span>Subtotal:</span>
                <span className="text-sm">₹{subtotalBeforeDiscount.toLocaleString("en-IN")}</span>
              </div>

              {/* Discounts & Taxes Inputs */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-border-subtle/50 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Discount %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      value={discountPercent || ""}
                      onChange={(e) => setDiscountPercent(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full text-xs border border-border-subtle rounded-xl px-2.5 py-1.5 bg-white focus:outline-none font-bold text-slate-900 focus:border-[#1B3564]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Flat Discount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={discountFlat || ""}
                      onChange={(e) => setDiscountFlat(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full text-xs border border-border-subtle rounded-xl px-2.5 py-1.5 bg-white focus:outline-none font-bold text-slate-900 focus:border-[#1B3564]"
                    />
                  </div>
                </div>

                {/* Preset Discount Chips */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Quick %:</span>
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        discountPercent === pct
                          ? "bg-[#1B3564] text-white border-[#1B3564]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#1B3564]/50"
                      }`}
                    >
                      {pct === 0 ? "Off" : `${pct}%`}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border-subtle/30">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1B3564]">GST Rate</label>
                  <select
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="text-xs border border-border-subtle rounded-xl px-2.5 py-1.5 bg-white focus:outline-none font-bold cursor-pointer"
                  >
                    <option value={18}>18% GST (Standard)</option>
                    <option value={12}>12% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={0}>0% (Tax Exempt)</option>
                  </select>
                </div>

                {/* Advance Payment Field */}
                <div className="pt-2 border-t border-border-subtle/30 flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1B3564]">Advance Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={advancePaid || ""}
                    onChange={(e) => setAdvancePaid(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-32 text-xs border border-emerald-300 rounded-xl px-3 py-1.5 bg-emerald-50 focus:outline-none font-bold text-right text-emerald-800 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Net Taxable Value & GST Amount */}
              <div className="space-y-1 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Net Taxable Value:</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax ({gstPercent}%):</span>
                  <span className="font-semibold text-slate-800">₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#1B3564]/5 border border-[#1B3564]/15 rounded-2xl p-3.5 flex justify-between items-center font-bold text-[#1B3564]">
                <span className="font-heading text-xs uppercase tracking-wider">GRAND TOTAL:</span>
                <span className="font-sans text-lg text-slate-900 font-extrabold">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              {/* Advance Paid & Remaining Balance Display */}
              {advancePaid > 0 && (
                <div className="space-y-2 pt-2 border-t border-dashed border-border-subtle/40">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Advance Received:</span>
                    <span className="font-bold text-emerald-700">₹{advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bg-[#1B3564] text-white rounded-2xl p-3.5 flex justify-between items-center font-bold shadow-sm">
                    <span className="font-heading text-[#DAA520] tracking-wider text-xs">BALANCE REMAINING:</span>
                    <span className="text-base text-white">
                      {balanceDue <= 0 ? "PAID IN FULL" : `₹${balanceDue.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Permanent Compact Action Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
              {/* PDF Download Button (Always active & instant) */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Download size={15} />
                Download PDF Invoice
              </button>

              {/* Email & WhatsApp Quick Action 3-Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* WhatsApp Share */}
                <button
                  type="button"
                  disabled={!selectedVillaSlug}
                  onClick={handleShareWhatsApp}
                  title="Share summary on WhatsApp"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl py-2 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 shadow-xs"
                >
                  <Share2 size={13} />
                  WhatsApp
                </button>

                {/* Mail App */}
                <button
                  type="button"
                  disabled={!selectedVillaSlug}
                  onClick={handleDraftMailto}
                  title="Open default email client"
                  className="bg-white hover:bg-slate-100 text-[#1B3564] border border-[#1B3564]/30 rounded-xl py-2 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Mail size={13} className="text-[#DAA520]" />
                  Mail App
                </button>

                {/* Direct Mail */}
                <button
                  type="button"
                  disabled={!selectedVillaSlug || !guestEmail || isSendingEmail}
                  onClick={handleSendDirectEmail}
                  title="Send direct email via server"
                  className="bg-[#1B3564] hover:bg-[#152a50] text-white rounded-xl py-2 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  {isSendingEmail ? (
                    <span className="animate-spin text-xs">🌀</span>
                  ) : (
                    <Send size={13} className="text-[#DAA520]" />
                  )}
                  {isSendingEmail ? "Sending" : "Direct Mail"}
                </button>
              </div>

              {/* Feedback Alerts */}
              {emailFeedback && (
                <div
                  className={`p-2 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 ${
                    emailFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {emailFeedback.type === "success" ? (
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="text-red-600 shrink-0" />
                  )}
                  <span className="truncate">{emailFeedback.msg}</span>
                </div>
              )}

              {!selectedVillaSlug && (
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-1 text-center block font-semibold">
                  ⚠️ Select a villa property to enable invoice actions
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
