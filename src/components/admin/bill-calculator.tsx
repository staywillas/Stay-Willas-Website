"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, User, FileText, Plus, Trash2, Download, Calculator } from "lucide-react";

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
  const [foodPlan, setFoodPlan] = useState<"none" | "veg" | "nonveg" | "mixed" | "custom">("none");
  const [foodRatePerPersonPerDay, setFoodRatePerPersonPerDay] = useState(0);
  const [foodGuestsCount, setFoodGuestsCount] = useState(0);

  // Extra Charges List
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newExtraDesc, setNewExtraDesc] = useState("");
  const [newExtraAmount, setNewExtraAmount] = useState<number | "">("");

  // Adjustments & Discounts
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountFlat, setDiscountFlat] = useState(0);
  const [gstPercent, setGstPercent] = useState(18);

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
    } else if (foodPlan === "veg") {
      setFoodRatePerPersonPerDay(1500);
    } else if (foodPlan === "nonveg") {
      setFoodRatePerPersonPerDay(2000);
    } else if (foodPlan === "mixed") {
      setFoodRatePerPersonPerDay(1800);
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

  // Generate & Download PDF Function
  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const activeVillaName = villas.find((v) => v.slug === selectedVillaSlug)?.name || "Stay Willas Estate";

    // Colors Setup (Stay Willas theme colors)
    const navyColor = [27, 53, 100]; // #1B3564
    const goldColor = [218, 165, 32]; // #DAA520
    const darkGray = [26, 26, 26];

    // Page styling & margins
    const marginX = 15;
    let currentY = 15;

    // Header Background Accent Stripe
    doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.rect(0, 0, 210, 8, "F");

    currentY += 12;

    // Logo & Header Info
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text("STAY WILLAS", marginX, currentY);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text("L U X U R Y   E S T A T E S", marginX, currentY + 4);

    // Invoice Header details (Right aligned)
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text("INVOICE SUMMARY", 145, currentY);

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const invoiceNum = `SW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    doc.text(`Invoice ID: ${invoiceNum}`, 145, currentY + 5);
    doc.text(`Date: ${invoiceDate}`, 145, currentY + 9);

    currentY += 16;

    // Horizontal Rule
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(marginX, currentY, 210 - marginX, currentY);

    currentY += 8;

    // Bill To & Company Details column layout
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text("PREPARED FOR GUEST:", marginX, currentY);
    doc.text("PROPERTY OPERATOR:", 120, currentY);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    // Guest info rows
    doc.setFont("Helvetica", "bold");
    doc.text(guestName || "Valued Guest", marginX, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    if (guestPhone) doc.text(`Phone: ${guestPhone}`, marginX, currentY + 9);
    if (guestEmail) doc.text(`Email: ${guestEmail}`, marginX, currentY + 13);

    // Operator Details
    doc.text("Stay Willas Luxury Collections", 120, currentY + 5);
    doc.text("Kim cottage, 14, PR Kadam Marg,", 120, currentY + 9);
    doc.text("Maneklal Estate, Ghatkopar West,", 120, currentY + 13);
    doc.text("Mumbai, Maharashtra 400084", 120, currentY + 17);
    doc.text("Contact: +91-9619042310", 120, currentY + 21);

    currentY += 28;

    // Reservation info box
    doc.setFillColor(250, 248, 245); // light beige matching --color-brand-beige
    doc.rect(marginX, currentY, 210 - marginX * 2, 20, "F");
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.3);
    doc.rect(marginX, currentY, 210 - marginX * 2, 20, "S");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text("RESERVATION SUMMARY:", marginX + 4, currentY + 6);

    doc.setFont("Helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const reservationInfo = `${activeVillaName}  |  ${nights} Nights (${weekdayNights} Weekday, ${weekendNights} Weekend)  |  ${guestsCount} Guests`;
    doc.text(reservationInfo, marginX + 4, currentY + 12);

    currentY += 28;

    // Table Header
    doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.rect(marginX, currentY, 210 - marginX * 2, 8, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("ITEM DESCRIPTION", marginX + 4, currentY + 5.5);
    doc.text("QTY / DETAILS", 100, currentY + 5.5);
    doc.text("RATE", 145, currentY + 5.5);
    doc.text("TOTAL TARIFF", 175, currentY + 5.5);

    currentY += 8;

    // Table rows drawing helper
    const drawTableRow = (desc: string, qty: string, rate: string, total: string) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      
      // Draw background stripe if row alternate
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.1);
      doc.line(marginX, currentY + 8, 210 - marginX, currentY + 8);

      doc.text(desc, marginX + 4, currentY + 5.5);
      doc.text(qty, 100, currentY + 5.5);
      doc.text(rate, 145, currentY + 5.5);
      doc.text(total, 175, currentY + 5.5);

      currentY += 8;
    };

    // Row 1: Stay Base Cost (Weekday Nights)
    if (weekdayNights > 0) {
      drawTableRow(
        `Stay Tariff - Weekdays`,
        `${weekdayNights} Nights`,
        `Rs. ${ratePerNight.toLocaleString("en-IN")}`,
        `Rs. ${weekdayStayCost.toLocaleString("en-IN")}`
      );
    }

    // Row 2: Stay Base Cost (Weekend Nights)
    if (weekendNights > 0) {
      drawTableRow(
        `Stay Tariff - Weekends`,
        `${weekendNights} Nights`,
        `Rs. ${weekendRatePerNight.toLocaleString("en-IN")}`,
        `Rs. ${weekendStayCost.toLocaleString("en-IN")}`
      );
    }

    // Row 3: Extra Guests Fee
    if (extraGuestsCount > 0) {
      drawTableRow(
        `Extra Guests Fee`,
        `${extraGuestsCount} Guests * ${nights} Nights`,
        `Rs. ${extraGuestFee.toLocaleString("en-IN")}`,
        `Rs. ${extraGuestsCost.toLocaleString("en-IN")}`
      );
    }

    // Row 4: Food plan cost
    if (foodPlan !== "none") {
      drawTableRow(
        `Food Program - ${foodPlan.toUpperCase()} Menu`,
        `${foodGuestsCount} Pax * ${nights} Days`,
        `Rs. ${foodRatePerPersonPerDay.toLocaleString("en-IN")}`,
        `Rs. ${totalFoodCost.toLocaleString("en-IN")}`
      );
    }

    // Custom Extras rows
    extraCharges.forEach((c) => {
      drawTableRow(
        c.description,
        "Custom Add-on",
        `Rs. ${c.amount.toLocaleString("en-IN")}`,
        `Rs. ${c.amount.toLocaleString("en-IN")}`
      );
    });

    currentY += 10;

    // Subtotal, discounts and tax box (Right Aligned)
    const rightAlignX = 140;

    const drawSummaryRow = (label: string, value: string, isBold = false) => {
      doc.setFont("Helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(isBold ? 10 : 9);
      doc.setTextColor(isBold ? navyColor[0] : darkGray[0], isBold ? navyColor[1] : darkGray[1], isBold ? navyColor[2] : darkGray[2]);
      doc.text(label, rightAlignX, currentY);
      doc.text(value, 175, currentY);
      currentY += 6;
    };

    drawSummaryRow("Gross Subtotal:", `Rs. ${subtotalBeforeDiscount.toLocaleString("en-IN")}`);
    if (totalDiscount > 0) {
      drawSummaryRow("Discount Applied:", `- Rs. ${totalDiscount.toLocaleString("en-IN")}`);
    }
    drawSummaryRow(`GST / Taxes (${gstPercent}%):`, `Rs. ${gstAmount.toLocaleString("en-IN")}`);
    
    // Draw boundary line for final total
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.setLineWidth(0.5);
    doc.line(rightAlignX, currentY - 2, 210 - marginX, currentY - 2);
    currentY += 3;
    
    drawSummaryRow("Net Payable Amount:", `Rs. ${grandTotal.toLocaleString("en-IN")}`, true);

    // Terms & Conditions block (Left bottom side)
    let tcY = currentY - 25;
    if (tcY < 120) tcY = 160; // safety check to prevent overlap

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text("TERMS & BOOKING CONDITIONS:", marginX, tcY);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text("1. Security deposit is refundable within 48 hours post check-out verification.", marginX, tcY + 4);
    doc.text("2. Standard Check-in is 2:00 PM and Check-out is 11:00 AM.", marginX, tcY + 8);
    doc.text("3. Noise limits apply inside residential zones post 10:00 PM.", marginX, tcY + 12);
    doc.text("4. Meal plans once confirmed cannot be partially cancelled during stay.", marginX, tcY + 16);

    // Thank you message
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text("THANK YOU FOR CHOOSING STAY WILLAS!", marginX, tcY + 28);

    // Footer signature line
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Stay Willas Invoice Summary  |  Automated Billing System", marginX, 280);

    // Save PDF file
    const safeGuestName = guestName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "guest";
    doc.save(`staywillas-bill-${safeGuestName}.pdf`);
  };

  return (
    <div className="bg-[#FAF8F5] border border-border-subtle rounded-3xl p-6 md:p-8 max-w-6xl mx-auto shadow-sm text-left">
      <div className="flex items-center gap-3 border-b border-border-subtle pb-6 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#1B3564] text-white flex items-center justify-center shadow-md">
          <Calculator className="w-6 h-6 text-[#DAA520]" />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-[#1B3564]">Admin Invoice & Bill Calculator</h2>
          <p className="text-xs text-text-primary/60 mt-0.5">Calculate tariffs, food plans, add custom charges, and download invoice PDFs instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Guest Information */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1B3564]">
              <User size={16} className="text-[#DAA520]" />
              <span>1. Guest Details</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Primary Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Stay Configuration */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1B3564]">
              <Calendar size={16} className="text-[#DAA520]" />
              <span>2. Stay Configuration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Select Villa Location</label>
                <select
                  value={selectedVillaSlug}
                  onChange={(e) => setSelectedVillaSlug(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                >
                  <option value="">-- Select Property --</option>
                  {villas.map((v) => (
                    <option key={v.slug} value={v.slug}>
                      {v.name} ({v.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Base Rate (Weekday)</label>
                  <input
                    type="number"
                    value={ratePerNight}
                    onChange={(e) => setRatePerNight(Number(e.target.value))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Weekend Rate</label>
                  <input
                    type="number"
                    value={weekendRatePerNight}
                    onChange={(e) => setWeekendRatePerNight(Number(e.target.value))}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Total Nights</label>
                <input
                  type="number"
                  min={1}
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Weekend Nights</label>
                <input
                  type="number"
                  min={0}
                  max={nights}
                  value={weekendNights}
                  onChange={(e) => setWeekendNights(Math.min(nights, Math.max(0, Number(e.target.value))))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Total Guests</label>
                <input
                  type="number"
                  min={1}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Base Guests</label>
                  <input
                    type="number"
                    value={baseGuests}
                    onChange={(e) => setBaseGuests(Number(e.target.value))}
                    className="w-full text-[10px] border border-border-subtle rounded-xl px-2 py-2.5 bg-[#FAF8F5] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Extra Fee (Pax)</label>
                  <input
                    type="number"
                    value={extraGuestFee}
                    onChange={(e) => setExtraGuestFee(Number(e.target.value))}
                    className="w-full text-[10px] border border-border-subtle rounded-xl px-2 py-2.5 bg-[#FAF8F5] focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Food Packages */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1B3564]">
              <Sparkles size={16} className="text-[#DAA520]" />
              <span>3. Catering Plans</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Food Package type</label>
                <select
                  value={foodPlan}
                  onChange={(e) => setFoodPlan(e.target.value as any)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold"
                >
                  <option value="none">No Meal Plan</option>
                  <option value="veg">Vegetarian Plan (Rs. 1,500/day)</option>
                  <option value="nonveg">Non-Veg Plan (Rs. 2,000/day)</option>
                  <option value="mixed">Mixed Menu (Rs. 1,800/day)</option>
                  <option value="custom">Custom Rate Package</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Rate per Person / Day</label>
                <input
                  type="number"
                  disabled={foodPlan === "none"}
                  value={foodRatePerPersonPerDay}
                  onChange={(e) => setFoodRatePerPersonPerDay(Number(e.target.value))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Total Eating Count</label>
                <input
                  type="number"
                  min={0}
                  disabled={foodPlan === "none"}
                  value={foodGuestsCount}
                  onChange={(e) => setFoodGuestsCount(Number(e.target.value))}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-[#FAF8F5] focus:outline-none focus:border-[#1B3564]/50 font-bold disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Extra Custom Charges */}
          <div className="bg-white border border-border-subtle/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1B3564]">
              <Plus size={16} className="text-[#DAA520]" />
              <span>4. Custom Extras & Add-ons</span>
            </div>

            <form onSubmit={handleAddExtra} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-[#FAF8F5] p-4 rounded-xl border border-border-subtle/40">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Charge Description</label>
                <input
                  type="text"
                  placeholder="e.g. Pool Heating Charges, BBQ Setup, Hookah Set"
                  value={newExtraDesc}
                  onChange={(e) => setNewExtraDesc(e.target.value)}
                  className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:border-[#1B3564]/50"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-text-primary/50 block mb-1.5">Amount (Rs.)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={newExtraAmount}
                    onChange={(e) => setNewExtraAmount(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="w-full text-xs border border-border-subtle rounded-xl px-3.5 py-2.5 bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-4.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 h-[38px] flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Add
                </button>
              </div>
            </form>

            {extraCharges.length > 0 && (
              <div className="border border-border-subtle/30 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-50 px-4 py-2 border-b border-border-subtle/30 flex justify-between font-bold text-[#1B3564]">
                  <span>Item Description</span>
                  <span>Total Amount</span>
                </div>
                <div className="divide-y divide-border-subtle/20 bg-white">
                  {extraCharges.map((item) => (
                    <div key={item.id} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="font-medium text-slate-800">{item.description}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1B3564]">Rs. {item.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(item.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Summary Card Column (Takes 1 column) */}
        <div>
          <div className="bg-white border border-[#DAA520]/25 rounded-3xl p-6 shadow-md space-y-6 sticky top-28">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1b3564] border-b border-border-subtle/40 pb-4">
              <FileText size={16} className="text-[#DAA520]" />
              <span>Bill Breakdown Summary</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Stays Cost */}
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-light">Stay Cost ({nights} Nights)</span>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">Rs. {totalStayCost.toLocaleString("en-IN")}</span>
                  {extraGuestsCount > 0 && (
                    <span className="text-[9px] text-[#4A5D23] block">(Incl. {extraGuestsCount} Extra Guests)</span>
                  )}
                </div>
              </div>

              {/* Food Cost */}
              {foodPlan !== "none" && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-500 font-light">Food Cost ({foodGuestsCount} Pax)</span>
                  <span className="font-bold text-slate-900">Rs. {totalFoodCost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Extras Cost */}
              {totalExtrasCost > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-slate-500 font-light">Add-ons & Extras</span>
                  <span className="font-bold text-slate-900">Rs. {totalExtrasCost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Summary Gross Subtotal */}
              <div className="border-t border-dashed border-border-subtle/40 pt-4 flex justify-between font-bold text-slate-900">
                <span>Subtotal:</span>
                <span>Rs. {subtotalBeforeDiscount.toLocaleString("en-IN")}</span>
              </div>

              {/* Discounts Inputs */}
              <div className="border-t border-border-subtle/30 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-wider text-text-primary/50 block mb-1">Discount %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full text-[10px] border border-border-subtle rounded-xl px-2 py-1.5 bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-wider text-text-primary/50 block mb-1">Flat Discount (Rs.)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountFlat}
                      onChange={(e) => setDiscountFlat(Number(e.target.value))}
                      className="w-full text-[10px] border border-border-subtle rounded-xl px-2 py-1.5 bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#1B3564]">GST percentage</label>
                  <select
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}
                    className="text-xs border border-border-subtle rounded-lg px-2 py-1 bg-[#FAF8F5] focus:outline-none font-bold"
                  >
                    <option value={18}>18% GST (Standard)</option>
                    <option value={12}>12% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={0}>0% (Tax Exempt)</option>
                  </select>
                </div>
              </div>

              {/* Summary Taxes & final */}
              <div className="border-t border-dashed border-border-subtle/40 pt-4 space-y-2">
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Net Taxable Value:</span>
                  <span className="font-semibold">Rs. {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-light">
                  <span>GST Amount ({gstPercent}%):</span>
                  <span className="font-semibold">Rs. {gstAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#1B3564]/5 border border-[#1B3564]/10 rounded-2xl p-4 flex justify-between items-center font-bold text-[#1B3564] text-base mt-2">
                <span className="font-heading">GRAND TOTAL:</span>
                <span className="font-sans text-lg text-slate-900">Rs. {grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Print/Download Actions */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!selectedVillaSlug}
                onClick={handleDownloadPDF}
                className="w-full bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white rounded-2xl py-4.5 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
              >
                <Download size={16} />
                Download PDF Invoice
              </button>
              {!selectedVillaSlug && (
                <span className="text-[10px] text-red-500 text-center block mt-2 font-semibold">Please select a property location first to enable PDF downloads.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
