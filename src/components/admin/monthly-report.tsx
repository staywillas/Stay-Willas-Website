"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  CreditCard,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Eye,
  Calculator,
  Printer,
  Sparkles,
  Receipt,
  HelpCircle
} from "lucide-react";

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  baseGuests?: number | null;
  extraGuestFee?: number | null;
  bedrooms: number;
}

interface Booking {
  id: string;
  villaId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  userId: string;
  villa: any;
  addOns?: any;
  kycName?: string | null;
  createdAt?: Date;
}

interface MonthlyReportProps {
  villas: any[];
  bookings: any[];
  onSelectBooking?: (booking: any) => void;
  onOpenInCalculator?: (booking: any) => void;
}

interface ParsedBookingBill {
  id: string;
  booking: Booking;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  villaName: string;
  villaLocation: string;
  checkIn: Date;
  checkOut: Date;
  checkInStr: string;
  checkOutStr: string;
  nights: number;
  guestsCount: number;
  status: string;
  channel: string;
  nightlyRate: number;
  stayTariff: number;
  foodPlan: string;
  foodTotal: number;
  extraCharges: Array<{ description: string; amount: number }>;
  extrasTotal: number;
  discountTotal: number;
  taxableSubtotal: number;
  gstPercent: number;
  gstTotal: number;
  securityDeposit: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthlyReport({
  villas,
  bookings,
  onSelectBooking,
  onOpenInCalculator
}: MonthlyReportProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-11
  const [filterVillaId, setFilterVillaId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleCurrentMonth = () => {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  };

  // Parse booking details safely
  const parseBooking = (b: Booking): ParsedBookingBill => {
    let guestName = "Guest Traveler";
    let guestEmail = "N/A";
    let guestPhone = "N/A";
    let guestsCount = 1;
    let nightlyRate = 0;
    let foodPlan = "none";
    let foodTotal = 0;
    let extraCharges: Array<{ description: string; amount: number }> = [];
    let discountTotal = 0;
    let gstPercent = 0;
    let gstTotal = 0;
    let advancePaid = 0;
    let securityDeposit = 0;
    let balanceDue = 0;
    let channel = "DIRECT";

    try {
      if (b.userId && b.userId.startsWith("{")) {
        const p = JSON.parse(b.userId);
        if (p.name) guestName = p.name;
        if (p.email) guestEmail = p.email;
        if (p.phone) guestPhone = p.phone;
        if (p.guests) guestsCount = p.guests;
        if (p.nightlyRate) nightlyRate = p.nightlyRate;
        if (p.channel) channel = p.channel;

        if (p.food) {
          foodPlan = p.food.plan || "none";
          foodTotal = p.food.total || 0;
        }
        if (Array.isArray(p.extraCharges)) {
          extraCharges = p.extraCharges;
        }
        if (p.discount) {
          discountTotal = p.discount.total || 0;
        }
        if (p.gst) {
          gstPercent = p.gst.percent || 0;
          gstTotal = p.gst.total || 0;
        }
        if (p.advancePaid !== undefined) advancePaid = Number(p.advancePaid) || 0;
        if (p.securityDeposit !== undefined) securityDeposit = Number(p.securityDeposit) || 0;
        if (p.balanceDue !== undefined) balanceDue = Number(p.balanceDue) || 0;
      } else {
        guestName = b.userId || "Guest Traveler";
      }
    } catch (e) {}

    const cin = new Date(b.checkIn);
    const cout = new Date(b.checkOut);
    const nights = Math.max(1, Math.round((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24)));

    const computedRate = nightlyRate || (b.villa?.price) || Math.round((b.totalPrice || 0) / nights);
    const stayTariff = computedRate * nights;
    const extrasTotal = extraCharges.reduce((sum, x) => sum + (x.amount || 0), 0);
    const grossSubtotal = stayTariff + foodTotal + extrasTotal;
    const taxableSubtotal = Math.max(0, grossSubtotal - discountTotal);
    const grandTotal = b.totalPrice > 0 ? b.totalPrice : Math.round(taxableSubtotal + gstTotal + securityDeposit);
    const finalBalance = balanceDue > 0 ? balanceDue : Math.max(0, grandTotal - advancePaid);

    return {
      id: b.id,
      booking: b,
      guestName,
      guestEmail,
      guestPhone,
      villaName: b.villa?.name || "Stay Willas Estate",
      villaLocation: b.villa?.location || "Maharashtra",
      checkIn: cin,
      checkOut: cout,
      checkInStr: cin.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      checkOutStr: cout.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      nights,
      guestsCount,
      status: b.status,
      channel,
      nightlyRate: computedRate,
      stayTariff,
      foodPlan,
      foodTotal,
      extraCharges,
      extrasTotal,
      discountTotal,
      taxableSubtotal,
      gstPercent,
      gstTotal,
      securityDeposit,
      grandTotal,
      advancePaid,
      balanceDue: finalBalance,
    };
  };

  // Filter bookings that overlap with or occurred in the selected month
  const monthBookings = useMemo(() => {
    const startOfMonth = new Date(selectedYear, selectedMonth, 1, 0, 0, 0);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);

    return bookings
      .filter((b) => {
        const cin = new Date(b.checkIn);
        const cout = new Date(b.checkOut);
        const overlaps = cin <= endOfMonth && cout >= startOfMonth;
        if (!overlaps) return false;

        if (filterVillaId !== "ALL" && b.villaId !== filterVillaId) return false;
        if (filterStatus !== "ALL" && b.status !== filterStatus) return false;

        return true;
      })
      .map(parseBooking)
      .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime());
  }, [bookings, selectedYear, selectedMonth, filterVillaId, filterStatus]);

  // Aggregate Metrics for the Selected Month
  const metrics = useMemo(() => {
    const activeBookings = monthBookings.filter((b) => b.status !== "CANCELLED" && b.status !== "BLOCKED");
    
    const liveNetRevenue = activeBookings.reduce((sum, b) => sum + b.grandTotal, 0);
    const totalAdvanceReceived = activeBookings.reduce((sum, b) => sum + b.advancePaid, 0);
    const totalBalancePending = activeBookings.reduce((sum, b) => sum + (b.balanceDue > 0 ? b.balanceDue : 0), 0);
    const totalSecurityDeposit = activeBookings.reduce((sum, b) => sum + b.securityDeposit, 0);
    const totalNights = activeBookings.reduce((sum, b) => sum + b.nights, 0);
    const totalFoodRevenue = activeBookings.reduce((sum, b) => sum + b.foodTotal, 0);
    const totalExtrasRevenue = activeBookings.reduce((sum, b) => sum + b.extrasTotal, 0);
    const totalGstCollected = activeBookings.reduce((sum, b) => sum + b.gstTotal, 0);

    const averageBookingValue = activeBookings.length > 0 ? Math.round(liveNetRevenue / activeBookings.length) : 0;
    const averageDailyRate = totalNights > 0 ? Math.round(liveNetRevenue / totalNights) : 0;

    // Property-wise distribution
    const propertyMap = new Map<string, { name: string; revenue: number; bookings: number; nights: number }>();
    activeBookings.forEach((b) => {
      const cur = propertyMap.get(b.villaName) || { name: b.villaName, revenue: 0, bookings: 0, nights: 0 };
      cur.revenue += b.grandTotal;
      cur.bookings += 1;
      cur.nights += b.nights;
      propertyMap.set(b.villaName, cur);
    });

    const propertyDistribution = Array.from(propertyMap.values()).sort((a, b) => b.revenue - a.revenue);

    return {
      totalBookingsCount: activeBookings.length,
      allBookingsCount: monthBookings.length,
      liveNetRevenue,
      totalAdvanceReceived,
      totalBalancePending,
      totalSecurityDeposit,
      totalNights,
      totalFoodRevenue,
      totalExtrasRevenue,
      totalGstCollected,
      averageBookingValue,
      averageDailyRate,
      propertyDistribution,
    };
  }, [monthBookings]);

  // Generate & Download Comprehensive Monthly Audit PDF
  const handleDownloadMonthlyPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const { jsPDF } = await import("jspdf");

      // Landscape A4 for maximum table clarity
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 14;
      let currentY = 0;

      const navyColor = [27, 53, 100];
      const goldColor = [218, 165, 32];
      const charcoal = [30, 41, 59];
      const lightBg = [250, 248, 245];
      const borderLine = [226, 232, 240];

      // Helper for header banner on every page
      const drawHeader = (pageNumber: number, totalPages: number) => {
        // Top colored stripes
        doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
        doc.rect(0, 0, pageWidth, 7, "F");
        doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.rect(0, 7, pageWidth, 1.8, "F");

        currentY = 16;

        // Brand & Title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
        doc.text("STAY WILLAS", margin, currentY + 3);

        doc.setFontSize(8);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.text("LUXURY SANCTUARY ESTATES — FINANCIAL AUDIT & REVENUE STATEMENT", margin, currentY + 8);

        // Month Title (Right Aligned)
        doc.setFontSize(14);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
        const statementTitle = `MONTHLY REVENUE REPORT — ${MONTH_NAMES[selectedMonth].toUpperCase()} ${selectedYear}`;
        doc.text(statementTitle, pageWidth - margin, currentY + 3, { align: "right" });

        doc.setFontSize(8.5);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const generatedDate = new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        doc.text(`Generated: ${generatedDate} | Live Database Audit`, pageWidth - margin, currentY + 8, { align: "right" });

        currentY += 14;

        // Thin Gold line
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.4);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      };

      drawHeader(1, 1);

      // Executive KPI Cards (Row of 4 cards)
      const cardWidth = (pageWidth - margin * 2 - 9) / 4;
      const cardHeight = 16;

      const drawKPICard = (x: number, title: string, value: string, sub: string, titleColor = navyColor) => {
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(x, currentY, cardWidth, cardHeight, "F");
        doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
        doc.setLineWidth(0.2);
        doc.rect(x, currentY, cardWidth, cardHeight, "S");

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(title.toUpperCase(), x + 3.5, currentY + 4);

        doc.setFontSize(11);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
        doc.text(value, x + 3.5, currentY + 9.5);

        doc.setFontSize(6.5);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(sub, x + 3.5, currentY + 13.5);
      };

      drawKPICard(
        margin,
        "Live Net Revenue",
        `Rs. ${metrics.liveNetRevenue.toLocaleString("en-IN")}`,
        `${metrics.totalBookingsCount} active bookings recorded`,
        navyColor
      );

      drawKPICard(
        margin + cardWidth + 3,
        "Advance Collected",
        `Rs. ${metrics.totalAdvanceReceived.toLocaleString("en-IN")}`,
        "Paid upfront by guests",
        [16, 122, 68]
      );

      drawKPICard(
        margin + (cardWidth + 3) * 2,
        "Balance Outstanding",
        `Rs. ${metrics.totalBalancePending.toLocaleString("en-IN")}`,
        "To collect upon arrival / check-in",
        metrics.totalBalancePending > 0 ? [180, 100, 20] : [16, 122, 68]
      );

      drawKPICard(
        margin + (cardWidth + 3) * 3,
        "Total Nights & ADR",
        `${metrics.totalNights} Nights (ADR: Rs. ${metrics.averageDailyRate.toLocaleString("en-IN")})`,
        `Avg booking: Rs. ${metrics.averageBookingValue.toLocaleString("en-IN")}`,
        charcoal
      );

      currentY += cardHeight + 6;

      // Table Header Setup
      const cols = [
        { title: "#", width: 8, align: "left" },
        { title: "GUEST NAME", width: 40, align: "left" },
        { title: "VILLA PROPERTY", width: 44, align: "left" },
        { title: "SCHEDULE (IN - OUT)", width: 42, align: "left" },
        { title: "NTS", width: 12, align: "center" },
        { title: "STAY TARIFF", width: 28, align: "right" },
        { title: "FOOD / EXTRAS", width: 26, align: "right" },
        { title: "TOTAL BILL", width: 28, align: "right" },
        { title: "ADVANCE PAID", width: 26, align: "right" },
        { title: "BALANCE DUE", width: 26, align: "right" },
        { title: "STATUS", width: 19, align: "center" },
      ];

      const drawTableHeader = () => {
        doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
        doc.rect(margin, currentY, pageWidth - margin * 2, 7, "F");

        let curX = margin;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);

        cols.forEach((c) => {
          const textX = c.align === "right" ? curX + c.width - 2 : c.align === "center" ? curX + c.width / 2 : curX + 2;
          doc.text(c.title, textX, currentY + 4.8, { align: c.align as any });
          curX += c.width;
        });

        currentY += 7;
      };

      drawTableHeader();

      // Render Rows
      let isEven = false;
      let pageNum = 1;

      monthBookings.forEach((b, idx) => {
        // Page break check
        if (currentY + 7 > pageHeight - 16) {
          doc.addPage();
          pageNum += 1;
          drawHeader(pageNum, pageNum);
          drawTableHeader();
        }

        if (isEven) {
          doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
          doc.rect(margin, currentY, pageWidth - margin * 2, 6.8, "F");
        }

        doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
        doc.setLineWidth(0.1);
        doc.line(margin, currentY + 6.8, pageWidth - margin, currentY + 6.8);

        let curX = margin;
        doc.setFontSize(7.5);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);

        const rowValues = [
          { text: `${idx + 1}`, align: "left" },
          { text: b.guestName.length > 22 ? b.guestName.substring(0, 20) + "..." : b.guestName, align: "left" },
          { text: b.villaName.length > 24 ? b.villaName.substring(0, 22) + "..." : b.villaName, align: "left" },
          { text: `${b.checkIn.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${b.checkOut.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`, align: "left" },
          { text: `${b.nights}N`, align: "center" },
          { text: `Rs. ${b.stayTariff.toLocaleString("en-IN")}`, align: "right" },
          { text: `Rs. ${(b.foodTotal + b.extrasTotal).toLocaleString("en-IN")}`, align: "right" },
          { text: `Rs. ${b.grandTotal.toLocaleString("en-IN")}`, align: "right", isBold: true },
          { text: `Rs. ${b.advancePaid.toLocaleString("en-IN")}`, align: "right", color: [16, 122, 68] },
          { text: b.balanceDue <= 0 ? "PAID" : `Rs. ${b.balanceDue.toLocaleString("en-IN")}`, align: "right", color: b.balanceDue <= 0 ? [16, 122, 68] : [180, 40, 40], isBold: true },
          { text: b.status, align: "center" },
        ];

        rowValues.forEach((val, i) => {
          const colDef = cols[i];
          const textX = colDef.align === "right" ? curX + colDef.width - 2 : colDef.align === "center" ? curX + colDef.width / 2 : curX + 2;

          doc.setFont("Helvetica", val.isBold ? "bold" : "normal");
          if (val.color) {
            doc.setTextColor(val.color[0], val.color[1], val.color[2]);
          } else {
            doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
          }

          doc.text(val.text, textX, currentY + 4.6, { align: colDef.align as any });
          curX += colDef.width;
        });

        isEven = !isEven;
        currentY += 6.8;
      });

      // Bottom Totals Row
      currentY += 2;
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(margin, currentY, pageWidth - margin * 2, 7.5, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("MONTHLY AUDIT TOTALS:", margin + 4, currentY + 5);

      doc.setTextColor(255, 255, 255);
      // Align totals with columns
      let totalX = margin;
      cols.forEach((col, i) => {
        if (i === 4) {
          doc.text(`${metrics.totalNights}N`, totalX + col.width / 2, currentY + 5, { align: "center" });
        } else if (i === 7) {
          doc.text(`Rs. ${metrics.liveNetRevenue.toLocaleString("en-IN")}`, totalX + col.width - 2, currentY + 5, { align: "right" });
        } else if (i === 8) {
          doc.text(`Rs. ${metrics.totalAdvanceReceived.toLocaleString("en-IN")}`, totalX + col.width - 2, currentY + 5, { align: "right" });
        } else if (i === 9) {
          doc.text(`Rs. ${metrics.totalBalancePending.toLocaleString("en-IN")}`, totalX + col.width - 2, currentY + 5, { align: "right" });
        }
        totalX += col.width;
      });

      currentY += 13;

      // Footer Notice & Sign-off
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(110, 110, 110);
      doc.text(
        "Official accounting statement generated by Stay Willas Reservation System. Includes live reconciled bookings, advance deposits, and check-in receivables.",
        margin,
        pageHeight - 8
      );
      doc.text(`Page 1 of ${pageNum} | www.staywillas.com`, pageWidth - margin, pageHeight - 8, { align: "right" });

      const fileName = `StayWillas_Monthly_Report_${MONTH_NAMES[selectedMonth]}_${selectedYear}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("Monthly PDF generation failed:", err);
      alert("Failed to generate monthly PDF report. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-[#1B3564]">
              <span className="p-2.5 rounded-2xl bg-[#1B3564] text-[#DAA520] shadow-sm">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold font-serif tracking-tight text-slate-900">
                  Monthly Revenue & Booking Audit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live net revenue, advance collections, pending receivables, and itemized bill records for all bookings.
                </p>
              </div>
            </div>
          </div>

          {/* Month & Year Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#FAF8F5] border border-slate-200/90 rounded-2xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 text-slate-600 hover:text-[#1B3564] hover:bg-white rounded-xl transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="px-3 py-1 text-center min-w-[150px]">
                <div className="text-xs font-black text-[#1B3564] uppercase tracking-wider">
                  {MONTH_NAMES[selectedMonth]} {selectedYear}
                </div>
                <button
                  type="button"
                  onClick={handleCurrentMonth}
                  className="text-[10px] text-slate-400 hover:text-[#DAA520] font-bold transition-colors cursor-pointer"
                >
                  Jump to Current Month
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 text-slate-600 hover:text-[#1B3564] hover:bg-white rounded-xl transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Always Keep PDF Download Button */}
            <button
              type="button"
              disabled={isGeneratingPDF || monthBookings.length === 0}
              onClick={handleDownloadMonthlyPDF}
              className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download size={15} />
              <span>{isGeneratingPDF ? "Generating PDF..." : "Download Monthly PDF"}</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <Filter size={13} className="text-[#DAA520]" />
            <span>Filter Report:</span>
          </div>

          {/* Property Selector */}
          <select
            value={filterVillaId}
            onChange={(e) => setFilterVillaId(e.target.value)}
            className="text-xs font-semibold bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#1B3564]"
          >
            <option value="ALL">All Properties ({villas.length})</option>
            {villas.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#1B3564]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>

          {/* Year Picker */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs font-semibold bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-[#1B3564]"
          >
            {[2024, 2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Primary Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Live Net Revenue */}
        <div className="bg-gradient-to-br from-[#1B3564] to-[#152a50] text-white p-5 rounded-3xl shadow-sm space-y-2 border border-[#DAA520]/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#DAA520]">
              Live Net Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#DAA520]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            ₹{metrics.liveNetRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 pt-1 border-t border-white/10">
            <span>{metrics.totalBookingsCount} active bookings</span>
            <span>•</span>
            <span>{metrics.totalNights} nights</span>
          </div>
        </div>

        {/* Card 2: Advance Collected */}
        <div className="bg-white border border-emerald-200/90 p-5 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-800">
              Advance Collected
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-emerald-900">
            ₹{metrics.totalAdvanceReceived.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1 border-t border-emerald-100">
            <span>✓ Confirmed payment in bank / gateway</span>
          </div>
        </div>

        {/* Card 3: Balance Outstanding Due */}
        <div className="bg-white border border-amber-200/90 p-5 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-900">
              Balance Due on Check-In
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-serif tracking-tight ${metrics.totalBalancePending > 0 ? "text-amber-900" : "text-emerald-700"}`}>
            ₹{metrics.totalBalancePending.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 pt-1 border-t border-amber-100">
            <span>To be collected upon guest arrivals</span>
          </div>
        </div>

        {/* Card 4: ADR & Average Booking */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
              Average Daily Rate (ADR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#1B3564] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-[#1B3564]">
            ₹{metrics.averageDailyRate.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 pt-1 border-t border-slate-100">
            <span>Avg / Booking: ₹{metrics.averageBookingValue.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Property Revenue Distribution Summary */}
      {metrics.propertyDistribution.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#DAA520]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3564]">
                Property Revenue Performance — {MONTH_NAMES[selectedMonth]} {selectedYear}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              {metrics.propertyDistribution.length} properties booked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {metrics.propertyDistribution.map((prop) => {
              const sharePercent = metrics.liveNetRevenue > 0 ? Math.round((prop.revenue / metrics.liveNetRevenue) * 100) : 0;
              return (
                <div key={prop.name} className="p-4 bg-[#FAF8F5] border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{prop.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {prop.bookings} booking{prop.bookings > 1 ? "s" : ""} • {prop.nights} nights
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#1B3564] bg-blue-100/70 px-2 py-0.5 rounded-full">
                      {sharePercent}% Share
                    </span>
                  </div>
                  <div className="text-base font-black text-[#1B3564]">
                    ₹{prop.revenue.toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Itemized Bookings with Complete Bill Information */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-serif text-[#1B3564]">
              Itemized Bookings & Full Bill Details ({monthBookings.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed billing breakdown for every reservation in {MONTH_NAMES[selectedMonth]} {selectedYear}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadMonthlyPDF}
            disabled={isGeneratingPDF || monthBookings.length === 0}
            className="text-xs font-bold text-[#1B3564] bg-[#FAF8F5] hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Download size={13} className="text-[#DAA520]" />
            <span>Export Statement PDF</span>
          </button>
        </div>

        {monthBookings.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Reservations in {MONTH_NAMES[selectedMonth]} {selectedYear}</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no confirmed or scheduled stays recorded for this period with the current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Guest & Villa</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4 text-center">Nights / Pax</th>
                  <th className="py-3 px-4 text-right">Stay Tariff</th>
                  <th className="py-3 px-4 text-right">Food / Extras</th>
                  <th className="py-3 px-4 text-right">Total Bill</th>
                  <th className="py-3 px-4 text-right">Advance Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthBookings.map((b, idx) => {
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF8F5]/80 transition-colors group">
                      <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Guest & Villa */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-bold text-slate-900 group-hover:text-[#1B3564] transition-colors truncate">
                          {b.guestName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <Building2 size={11} className="text-[#DAA520] shrink-0" />
                          <span>{b.villaName}</span>
                        </div>
                        {b.guestPhone !== "N/A" && (
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {b.guestPhone}
                          </div>
                        )}
                      </td>

                      {/* Stay Dates */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {b.checkInStr}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          to {b.checkOutStr}
                        </div>
                      </td>

                      {/* Nights & Pax */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="font-bold text-[#1B3564] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                          {b.nights}N
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {b.guestsCount} Pax
                        </div>
                      </td>

                      {/* Stay Tariff */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-800">
                          ₹{b.stayTariff.toLocaleString("en-IN")}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          @ ₹{b.nightlyRate.toLocaleString("en-IN")}/n
                        </div>
                      </td>

                      {/* Food & Extras */}
                      <td className="py-4 px-4 text-right whitespace-nowrap text-slate-600 font-medium">
                        {b.foodTotal + b.extrasTotal > 0 ? (
                          <>
                            <span className="font-bold text-slate-800">
                              ₹{(b.foodTotal + b.extrasTotal).toLocaleString("en-IN")}
                            </span>
                            {b.foodTotal > 0 && (
                              <div className="text-[10px] text-emerald-700 mt-0.5">
                                Food: ₹{b.foodTotal.toLocaleString("en-IN")}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-300">₹0</span>
                        )}
                      </td>

                      {/* Total Bill */}
                      <td className="py-4 px-4 text-right whitespace-nowrap font-black text-slate-900 text-sm">
                        ₹{b.grandTotal.toLocaleString("en-IN")}
                      </td>

                      {/* Advance Paid */}
                      <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                        {b.advancePaid > 0 ? (
                          `₹${b.advancePaid.toLocaleString("en-IN")}`
                        ) : (
                          <span className="text-slate-300">₹0</span>
                        )}
                      </td>

                      {/* Balance Due */}
                      <td className="py-4 px-4 text-right whitespace-nowrap font-black">
                        {b.balanceDue <= 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                            PAID FULL
                          </span>
                        ) : (
                          <span className="text-amber-900">
                            ₹{b.balanceDue.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : b.status === "BLOCKED"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onSelectBooking && (
                            <button
                              type="button"
                              onClick={() => onSelectBooking(b.booking)}
                              className="p-1.5 text-slate-500 hover:text-[#1B3564] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Booking Inspector"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {onOpenInCalculator && (
                            <button
                              type="button"
                              onClick={() => onOpenInCalculator(b.booking)}
                              className="p-1.5 text-slate-500 hover:text-[#DAA520] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Open in Invoice Calculator"
                            >
                              <Calculator size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer Totals */}
              <tfoot>
                <tr className="bg-[#1B3564] text-white font-black text-xs">
                  <td colSpan={4} className="py-3.5 px-4 text-left font-serif text-sm text-[#DAA520]">
                    MONTHLY TOTALS ({metrics.totalBookingsCount} Stays):
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    ₹{monthBookings.reduce((sum, b) => sum + b.stayTariff, 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    ₹{(metrics.totalFoodRevenue + metrics.totalExtrasRevenue).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-sm text-[#DAA520]">
                    ₹{metrics.liveNetRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-300">
                    ₹{metrics.totalAdvanceReceived.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-amber-300">
                    ₹{metrics.totalBalancePending.toLocaleString("en-IN")}
                  </td>
                  <td colSpan={2} className="py-3.5 px-4 text-right text-[10px] text-slate-300 font-medium">
                    Reconciled Live
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
