"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  Info, 
  CheckCircle,
  Clock,
  Wrench,
  User,
  Phone,
  Mail,
  FileText,
  Loader2,
  AlertTriangle,
  Download,
  Send,
  Share2,
  Trash2,
  DollarSign,
  Receipt,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Eye
} from "lucide-react";
import { createManualBooking, deleteBooking, sendInvoiceEmailAction } from "@/app/actions/admin";

interface SeasonalPrice {
  id: string;
  villaId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  label?: string | null;
}

interface DailyPrice {
  id: string;
  villaId: string;
  date: Date;
  price: number;
}

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  category: string;
  bedrooms: number;
  guests: number;
  baseGuests?: number | null;
  extraGuestFee?: number | null;
  weekendPrice?: number | null;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  images: string[];
  description: string;
}

interface Booking {
  id: string;
  villaId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  userId: string;
  villa: Villa;
  addOns?: any;
  kycName?: string | null;
  kycGuests?: any;
  kycIdUrl?: string | null;
  createdAt?: Date;
}

interface ExtraCharge {
  id: string;
  description: string;
  amount: number;
}

interface AvailabilityCalendarProps {
  villas: Villa[];
  bookings: Booking[];
  onBookingsChange: (newBookings: Booking[]) => void;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export default function AvailabilityCalendar({ villas, bookings, onBookingsChange }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Modal Overlays state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalMode, setModalMode] = useState<"GUEST_BOOKING" | "MAINTENANCE" | "OWNER_USE">("GUEST_BOOKING");

  // Selected Villa in Modal
  const [selectedVillaId, setSelectedVillaId] = useState<string>("");
  const [cottagesCount, setCottagesCount] = useState<number>(1);
  const [cottageSelection, setCottageSelection] = useState<"A" | "B" | "C" | "ALL">("A");

  // Section 1: Guest Information
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestCount, setGuestCount] = useState<number>(2);

  // Section 2: Stay Dates & Rates
  const [checkInStr, setCheckInStr] = useState("");
  const [checkOutStr, setCheckOutStr] = useState("");
  const [nights, setNights] = useState<number>(1);
  // Night-by-Night Pricing (Night 1, Night 2, etc. - Empty by default for client entry)
  const [nightRates, setNightRates] = useState<(number | "")[]>([""]);

  // Section 3: Dining / Meal Plan
  const [foodPlan, setFoodPlan] = useState<"none" | "standard" | "deluxe" | "custom">("none");
  const [foodRatePerPersonPerDay, setFoodRatePerPersonPerDay] = useState<number>(0);
  const [foodGuestsCount, setFoodGuestsCount] = useState<number>(2);

  // Section 4: Add-on Services / Extras
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newExtraDesc, setNewExtraDesc] = useState("");
  const [newExtraAmount, setNewExtraAmount] = useState<number | "">("");

  // Section 5: Discounts, Taxes, Deposits & Advance
  const [discountFlat, setDiscountFlat] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState<string>("CONFIRMED");

  // Loading and Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Helper to format date label for a given night (0-indexed)
  const getNightDateLabel = (index: number) => {
    if (!checkInStr) return `Night ${index + 1}`;
    try {
      const d = new Date(checkInStr + "T12:00:00");
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

    if (checkInStr) {
      try {
        const d = new Date(checkInStr + "T12:00:00");
        d.setDate(d.getDate() + safeCount);
        setCheckOutStr(d.toISOString().split("T")[0]);
      } catch {}
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

  // When villa changes in the modal, populate standard limits
  useEffect(() => {
    if (!selectedVillaId) return;
    const villa = villas.find((v) => v.id === selectedVillaId);
    if (villa) {
      const isWillow = villa.slug === "willow-peak";
      if (guestCount < 1) {
        setGuestCount(villa.guests || 2);
        setFoodGuestsCount(villa.guests || 2);
      }
      if (isWillow) {
        setCottagesCount(Math.max(1, Math.min(3, Math.ceil((guestCount || 2) / 4))));
      } else {
        setCottagesCount(1);
      }
    }
  }, [selectedVillaId, villas]);

  // Adjust food rate based on plan type
  useEffect(() => {
    if (foodPlan === "none") {
      setFoodRatePerPersonPerDay(0);
    } else if (foodPlan === "standard") {
      setFoodRatePerPersonPerDay(1250);
    } else if (foodPlan === "deluxe") {
      setFoodRatePerPersonPerDay(1500);
    }
  }, [foodPlan]);

  // Auto calculate nights from dates and sync night rates array
  const handleDateChange = (cin: string, cout: string) => {
    setCheckInStr(cin);
    setCheckOutStr(cout);

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
      }
    }
  };

  // Add Extra Charge line
  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraDesc.trim() || !newExtraAmount || Number(newExtraAmount) <= 0) return;
    setExtraCharges([...extraCharges, { id: "extra-" + Date.now(), description: newExtraDesc.trim(), amount: Number(newExtraAmount) }]);
    setNewExtraDesc("");
    setNewExtraAmount("");
  };

  // Remove Extra Charge
  const handleRemoveExtra = (id: string) => {
    setExtraCharges(extraCharges.filter((c) => c.id !== id));
  };

  // Financial Calculations
  const isWillowSelected = villas.find((v) => v.id === selectedVillaId)?.slug === "willow-peak";

  // Total Stay Tariff (Sum of each night rate, no extra guest fee per request)
  const totalStayCost = modalMode === "GUEST_BOOKING"
    ? nightRates.reduce<number>((sum, r) => sum + (typeof r === "number" ? r : 0), 0)
    : 0;

  // No separate guest fee
  const totalExtraGuestsCost = 0;
  const extraGuestsCost = 0;

  // Total Food Cost
  const totalFoodCost = modalMode === "GUEST_BOOKING" && foodPlan !== "none" 
    ? (foodRatePerPersonPerDay * foodGuestsCount * nights) 
    : 0;

  // Total Extras
  const totalExtrasCost = modalMode === "GUEST_BOOKING" 
    ? extraCharges.reduce((acc, curr) => acc + curr.amount, 0) 
    : 0;

  // Subtotal before discount
  const subtotalBeforeDiscount = totalStayCost + totalFoodCost + totalExtrasCost;

  // Calculate discount
  const calculatedPercentDiscount = subtotalBeforeDiscount * (discountPercent / 100);
  const totalDiscount = calculatedPercentDiscount + discountFlat;

  // Subtotal after discount
  const subtotal = Math.max(0, subtotalBeforeDiscount - totalDiscount);

  // GST & Total
  const gstAmount = Math.round(subtotal * (gstPercent / 100));
  const taxInclusiveTotal = modalMode === "GUEST_BOOKING" ? (subtotal + gstAmount) : 0;
  const grandTotal = modalMode === "GUEST_BOOKING" ? Math.round(taxInclusiveTotal + (securityDeposit || 0)) : 0;
  const balanceDue = Math.max(0, grandTotal - (advancePaid || 0));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get number of days in the current selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  // Get status of a specific day for a specific villa from the real DB bookings prop
  const getDayStatus = (villaId: string, date: Date) => {
    const villa = villas.find(v => v.id === villaId);
    const isWillowEntire = villa?.slug === "willow-peak";
    const isWillowCottage = villa?.slug?.startsWith("willow-peak-cottage");

    const check = new Date(date);
    check.setHours(0, 0, 0, 0);

    const isDateOverlapping = (b: Booking) => {
      if (b.status === "CANCELLED") return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return check >= start && check < end;
    };

    if (isWillowEntire) {
      // Find bookings for Entire Estate OR any individual cottage
      const entireEstateBookings = bookings.filter(b => b.villaId === villaId && isDateOverlapping(b));
      if (entireEstateBookings.length > 0) {
        return { status: entireEstateBookings[0].status, data: entireEstateBookings[0], bookedCottages: 3, totalCottages: 3, label: "Full Estate Booked" };
      }

      const allCottageVillaIds = villas.filter(v => v.slug?.startsWith("willow-peak-cottage")).map(v => v.id);
      const cottageBookings = bookings.filter(b => allCottageVillaIds.includes(b.villaId) && isDateOverlapping(b));
      
      if (cottageBookings.length > 0) {
        return {
          status: "CONFIRMED",
          data: cottageBookings[0],
          bookedCottages: cottageBookings.length,
          totalCottages: 3,
          label: `${cottageBookings.length}/3 Cottage(s) Booked`
        };
      }

      return { status: "AVAILABLE", data: null, bookedCottages: 0, totalCottages: 3, label: "Available (3 Cottages)" };
    }

    if (isWillowCottage) {
      // 1. Check if Entire Estate is booked on this date
      const entireEstateVilla = villas.find(v => v.slug === "willow-peak");
      if (entireEstateVilla) {
        const entireBooking = bookings.find(b => b.villaId === entireEstateVilla.id && isDateOverlapping(b));
        if (entireBooking) {
          return { status: "CONFIRMED", data: entireBooking, bookedCottages: 1, totalCottages: 1, label: "Booked (Full Estate)" };
        }
      }

      // 2. Check direct booking on this specific cottage
      const directBooking = bookings.find(b => b.villaId === villaId && isDateOverlapping(b));
      if (directBooking) {
        return { status: directBooking.status, data: directBooking, bookedCottages: 1, totalCottages: 1, label: directBooking.status };
      }

      return { status: "AVAILABLE", data: null, bookedCottages: 0, totalCottages: 1, label: "Available" };
    }

    // Standard single-unit villas
    const dayBookings = bookings.filter(b => b.villaId === villaId && isDateOverlapping(b));
    if (dayBookings.length === 0) {
      return { status: "AVAILABLE", data: null, bookedCottages: 0, totalCottages: 1, label: "Available" };
    }

    return { status: dayBookings[0].status, data: dayBookings[0], bookedCottages: 1, totalCottages: 1, label: dayBookings[0].status };
  };

  // Reset form states
  const resetFormState = (initialVillaId?: string, initialDate?: Date) => {
    const targetVillaId = initialVillaId || villas[0]?.id || "";
    setSelectedVillaId(targetVillaId);

    const villa = villas.find((v) => v.id === targetVillaId);
    if (villa) {
      setGuestCount(villa.guests || 2);
      setFoodGuestsCount(villa.guests || 2);
    }
    setNightRates([""]);

    if (initialDate) {
      const inDate = new Date(initialDate);
      const outDate = new Date(initialDate);
      outDate.setDate(outDate.getDate() + 1);
      handleDateChange(inDate.toISOString().split("T")[0], outDate.toISOString().split("T")[0]);
    } else {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      handleDateChange(today.toISOString().split("T")[0], tomorrow.toISOString().split("T")[0]);
    }

    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setFoodPlan("none");
    setFoodRatePerPersonPerDay(0);
    setExtraCharges([]);
    setNewExtraDesc("");
    setNewExtraAmount("");
    setDiscountFlat(0);
    setDiscountPercent(0);
    setGstPercent(18);
    setSecurityDeposit(0);
    setAdvancePaid(0);
    setBookingNotes("");
    setBookingStatus("CONFIRMED");
    setModalMode("GUEST_BOOKING");
    setEmailFeedback(null);
  };

  // Open modal from top button or grid cell
  const handleOpenCreateModal = (villaId?: string, date?: Date) => {
    setSelectedBooking(null);
    resetFormState(villaId, date);
    setIsModalOpen(true);
  };

  const handleCellClick = (villaId: string, date: Date, statusInfo: { status: string; data: any }) => {
    if (statusInfo.status === "CONFIRMED" || statusInfo.status === "PENDING" || statusInfo.status === "BLOCKED") {
      setSelectedBooking(statusInfo.data);
      setIsModalOpen(false);
    } else {
      handleOpenCreateModal(villaId, date);
    }
  };

  // Helper to trim empty transparent borders & compute crisp logo aspect ratio
  const getCroppedLogoDataUrl = (img: HTMLImageElement): { dataUrl: string; aspect: number } => {
    try {
      const canvas = document.createElement("canvas");
      const w = img.naturalWidth || img.width || 1000;
      const h = img.naturalHeight || img.height || 1000;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return { dataUrl: img.src, aspect: w / h };

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let found = false;

      for (let y = 0; y < h; y += 4) {
        for (let x = 0; x < w; x += 4) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 15) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      if (!found || maxX <= minX || maxY <= minY) {
        minX = 0; minY = 0; maxX = w; maxY = h;
      }

      const cropW = maxX - minX;
      const cropH = maxY - minY;
      const padX = Math.round(cropW * 0.02);
      const padY = Math.round(cropH * 0.02);

      const startX = Math.max(0, minX - padX);
      const startY = Math.max(0, minY - padY);
      const finalW = Math.min(w - startX, cropW + padX * 2);
      const finalH = Math.min(h - startY, cropH + padY * 2);

      const targetW = 600;
      const targetH = Math.round((finalH / finalW) * targetW) || 200;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = targetW;
      cropCanvas.height = targetH;
      const cropCtx = cropCanvas.getContext("2d");
      if (cropCtx) {
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = "high";
        cropCtx.drawImage(canvas, startX, startY, finalW, finalH, 0, 0, targetW, targetH);
      }

      return {
        dataUrl: cropCanvas.toDataURL("image/png"),
        aspect: targetW / targetH,
      };
    } catch (err) {
      console.warn("Error cropping logo", err);
      return { dataUrl: img.src, aspect: (img.naturalWidth || 1) / (img.naturalHeight || 1) };
    }
  };

  // Generate & Download Tax Invoice PDF
  const generateAndDownloadInvoicePDF = async (customBookingData?: any) => {
    try {
      setIsDownloadingPDF(true);
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let logoData: { dataUrl: string; aspect: number } | null = null;
      try {
        const logoImg = await loadImage("/images/STAY WILLAS logo transparent.webp");
        logoData = getCroppedLogoDataUrl(logoImg);
      } catch (e) {
        console.warn("Could not load transparent logo for PDF", e);
      }

      const targetVilla = customBookingData?.villa || villas.find((v) => v.id === selectedVillaId);
      const activeVillaName = targetVilla?.name || "Stay Willas Sanctuary";
      const targetGuestName = customBookingData?.guestName || guestName || "Valued Guest";
      const targetGuestPhone = customBookingData?.guestPhone || guestPhone || "N/A";
      const targetGuestEmail = customBookingData?.guestEmail || guestEmail || "N/A";
      const targetCheckIn = customBookingData?.checkIn || checkInStr;
      const targetCheckOut = customBookingData?.checkOut || checkOutStr;
      const targetNights = customBookingData?.nights || nights;
      const targetNightRates: (number | "")[] = customBookingData?.nightRates || nightRates;
      const targetGuestsCount = customBookingData?.guestsCount || guestCount;
      const targetStayCost = customBookingData?.totalStayCost !== undefined ? customBookingData.totalStayCost : totalStayCost;
      const targetFoodPlan = customBookingData?.foodPlan || foodPlan;
      const targetFoodRate = customBookingData?.foodRate || foodRatePerPersonPerDay;
      const targetFoodGuests = customBookingData?.foodGuests || foodGuestsCount;
      const targetTotalFoodCost = customBookingData?.totalFoodCost !== undefined ? customBookingData.totalFoodCost : totalFoodCost;
      const targetExtras: ExtraCharge[] = customBookingData?.extraCharges || extraCharges;
      const targetSubtotalBeforeDiscount = customBookingData?.subtotalBeforeDiscount !== undefined ? customBookingData.subtotalBeforeDiscount : subtotalBeforeDiscount;
      const targetTotalDiscount = customBookingData?.totalDiscount !== undefined ? customBookingData.totalDiscount : totalDiscount;
      const targetSubtotal = customBookingData?.subtotal !== undefined ? customBookingData.subtotal : subtotal;
      const targetGstPercent = customBookingData?.gstPercent !== undefined ? customBookingData.gstPercent : gstPercent;
      const targetGstAmount = customBookingData?.gstAmount !== undefined ? customBookingData.gstAmount : gstAmount;
      const targetSecurityDeposit = customBookingData?.securityDeposit !== undefined ? customBookingData.securityDeposit : securityDeposit;
      const targetGrandTotal = customBookingData?.grandTotal !== undefined ? customBookingData.grandTotal : grandTotal;
      const targetAdvancePaid = customBookingData?.advancePaid !== undefined ? customBookingData.advancePaid : advancePaid;
      const targetBalanceDue = customBookingData?.balanceDue !== undefined ? customBookingData.balanceDue : balanceDue;

      const navyColor = [27, 53, 100];   // #1B3564 Navy
      const goldColor = [218, 165, 32];  // #DAA520 Gold
      const darkCharcoal = [30, 41, 59]; // #1E293B Text
      const lightBeige = [250, 248, 245]; // #FAF8F5 Card BG
      const borderGray = [226, 232, 240]; // #E2E8F0

      const marginX = 15;
      let currentY = 0;

      // Header Top Dual Accent Stripe (Navy & Gold)
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(0, 0, 210, 6, "F");
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(0, 6, 210, 1.5, "F");

      currentY = 14;

      if (logoData && logoData.aspect) {
        const maxLogoW = 62;
        const maxLogoH = 16.5;
        let logoW = maxLogoW;
        let logoH = logoW / logoData.aspect;
        if (logoH > maxLogoH) {
          logoH = maxLogoH;
          logoW = logoH * logoData.aspect;
        }
        doc.addImage(logoData.dataUrl, "PNG", marginX, currentY - 2, logoW, logoH, undefined, "FAST");
      } else {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
        doc.text("STAY WILLAS", marginX, currentY + 6);
      }

      // Invoice Header metadata
      doc.setFontSize(14);
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
      doc.text(`Status: CONFIRMED RESERVATION`, 210 - marginX, currentY + 17, { align: "right" });

      currentY += 24;

      // Gold Divider Line
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.line(marginX, currentY, 210 - marginX, currentY);

      currentY += 6;

      // Guest & Operator Cards
      const cardWidth = 87;
      const cardHeight = 26;

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
      doc.text(targetGuestName, marginX + 4, currentY + 10);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Contact: ${targetGuestPhone}`, marginX + 4, currentY + 15);
      doc.text(`Email: ${targetGuestEmail}`, marginX + 4, currentY + 19);

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
      doc.setFontSize(9.5);
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
      doc.text("Stay Willas", rightCardX + 4, currentY + 10);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text("Ghatkopar West, Mumbai, MH 400084", rightCardX + 4, currentY + 15);
      doc.text("Concierge Hotline: +91 9619042310", rightCardX + 4, currentY + 19);

      currentY += cardHeight + 6;

      // Reservation Banner
      const reservationBoxHeight = (targetCheckIn || targetCheckOut) ? 20 : 14;
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, reservationBoxHeight, "F");
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.4);
      doc.rect(marginX, currentY, 210 - marginX * 2, reservationBoxHeight, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("RESERVATION SUMMARY", marginX + 4, currentY + 5);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`${activeVillaName}  |  ${targetNights} Night(s)  |  ${targetGuestsCount} Guests`, marginX + 4, currentY + 10);

      if (targetCheckIn || targetCheckOut) {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(218, 165, 32);
        doc.text(`Check-In: ${targetCheckIn} (2:00 PM)   |   Check-Out: ${targetCheckOut} (11:00 AM)`, marginX + 4, currentY + 15);
      }

      currentY += reservationBoxHeight + 5;

      // Tariff Table Header
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

      // Rows: Each Night Tariff
      targetNightRates.forEach((r, idx) => {
        const nightLbl = getNightDateLabel(idx);
        const amt = typeof r === "number" ? r : 0;
        drawTableRow(
          `Stay Tariff - ${nightLbl}`,
          `1 Night`,
          `Rs. ${amt.toLocaleString("en-IN")}`,
          `Rs. ${amt.toLocaleString("en-IN")}`
        );
      });

      if (targetFoodPlan && targetFoodPlan !== "none") {
        const planLabel = targetFoodPlan.toUpperCase() + " MENU";
        drawTableRow(
          `Catering Package - ${planLabel}`,
          `${targetFoodGuests} Pax * ${targetNights} Days`,
          `Rs. ${targetFoodRate.toLocaleString("en-IN")}`,
          `Rs. ${targetTotalFoodCost.toLocaleString("en-IN")}`
        );
      }

      targetExtras.forEach((c) => {
        drawTableRow(
          c.description,
          "Add-on Service",
          `Rs. ${c.amount.toLocaleString("en-IN")}`,
          `Rs. ${c.amount.toLocaleString("en-IN")}`
        );
      });

      currentY += 8;

      // Summary
      const rightAlignX = 135;
      const drawSummaryRow = (label: string, value: string, isBold = false, textColor = darkCharcoal) => {
        doc.setFont("Helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(isBold ? 9.5 : 8.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(label, rightAlignX, currentY);
        doc.text(value, 175, currentY);
        currentY += 5.5;
      };

      drawSummaryRow("Gross Subtotal:", `Rs. ${targetSubtotalBeforeDiscount.toLocaleString("en-IN")}`);
      if (targetTotalDiscount > 0) {
        drawSummaryRow("Discount Applied:", `- Rs. ${targetTotalDiscount.toLocaleString("en-IN")}`, false, [180, 40, 40]);
      }
      drawSummaryRow(`Net Taxable Amount:`, `Rs. ${targetSubtotal.toLocaleString("en-IN")}`);
      drawSummaryRow(`GST Tax (${targetGstPercent}%):`, `Rs. ${targetGstAmount.toLocaleString("en-IN")}`);
      if (targetSecurityDeposit > 0) {
        drawSummaryRow("Security Deposit (Refundable):", `Rs. ${targetSecurityDeposit.toLocaleString("en-IN")}`, false, [180, 100, 20]);
      }
      
      currentY += 1;
      doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.rect(rightAlignX - 2, currentY - 4, 210 - marginX - (rightAlignX - 2), 9, "F");

      const finalNetPayable = targetGrandTotal;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.text("NET PAYABLE AMOUNT:", rightAlignX, currentY + 1.5);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Rs. ${finalNetPayable.toLocaleString("en-IN")}`, 175, currentY + 1.5);

      currentY += 14;

      // Payment Box
      doc.setFillColor(lightBeige[0], lightBeige[1], lightBeige[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 14, "F");
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.rect(marginX, currentY, 210 - marginX * 2, 14, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
      doc.text(`Advance Received: Rs. ${targetAdvancePaid.toLocaleString("en-IN")}`, marginX + 5, currentY + 6);

      doc.setFontSize(9);
      doc.setTextColor(targetBalanceDue <= 0 ? 34 : 180, targetBalanceDue <= 0 ? 139 : 40, targetBalanceDue <= 0 ? 34 : 40);
      doc.text(`Balance Due on Check-In: ${targetBalanceDue <= 0 ? "PAID IN FULL" : `Rs. ${targetBalanceDue.toLocaleString("en-IN")}`}`, marginX + 5, currentY + 10.5);

      // Save PDF to browser
      const cleanFileName = `StayWillas_Invoice_${targetGuestName.replace(/[^a-zA-Z0-9]/g, "_")}_${invoiceNum}.pdf`;
      doc.save(cleanFileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Submit Handler (Saves to DB -> Blocks Property -> Optionally Downloads PDF)
  const handleSaveAndBlockProperty = async (e: React.FormEvent, shouldDownloadPDF: boolean = false) => {
    e.preventDefault();
    if (!selectedVillaId) {
      alert("Please select a property.");
      return;
    }
    if (!checkInStr || !checkOutStr) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    setIsSubmitting(true);
    try {
      const inDate = new Date(checkInStr);
      const outDate = new Date(checkOutStr);

      let type: "GUEST" | "MAINTENANCE" | "OWNER_USE" = "GUEST";
      let status = bookingStatus;
      let name = guestName;
      let finalPrice = grandTotal;

      if (modalMode === "MAINTENANCE") {
        type = "MAINTENANCE";
        status = "BLOCKED";
        name = guestName || "Routine Maintenance Blackout";
        finalPrice = 0;
      } else if (modalMode === "OWNER_USE") {
        type = "OWNER_USE";
        status = "BLOCKED";
        name = guestName || "Private Owner Occupancy";
        finalPrice = 0;
      }

      const res = await createManualBooking({
        villaId: selectedVillaId,
        checkIn: inDate.toISOString(),
        checkOut: outDate.toISOString(),
        guestName: name,
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        totalPrice: finalPrice,
        status,
        notes: bookingNotes,
        type,
        guests: guestCount,
        cottagesCount: isWillowSelected ? cottagesCount : 1,
        nightlyRate: nights > 0 ? Math.round(totalStayCost / nights) : (typeof nightRates[0] === "number" ? nightRates[0] : 0),
        foodPlan,
        foodRatePerPersonPerDay,
        foodGuestsCount,
        foodTotal: totalFoodCost,
        extraCharges,
        discountFlat,
        discountPercent,
        discountTotal: totalDiscount,
        gstPercent,
        gstTotal: gstAmount,
        advancePaid,
        securityDeposit,
        balanceDue,
      });

      if (res.success && res.booking) {
        const villaObj = villas.find((v) => v.id === selectedVillaId);
        if (!villaObj) {
          throw new Error("Target villa not found in local registry.");
        }

        const formattedBooking: Booking = {
          id: res.booking.id,
          villaId: res.booking.villaId,
          checkIn: new Date(res.booking.checkIn),
          checkOut: new Date(res.booking.checkOut),
          totalPrice: res.booking.totalPrice,
          status: res.booking.status,
          userId: res.booking.userId,
          villa: villaObj,
        };

        onBookingsChange([...bookings, formattedBooking]);

        // If requested, immediately trigger PDF download
        if (shouldDownloadPDF && modalMode === "GUEST_BOOKING") {
          await generateAndDownloadInvoicePDF();
        }

        setIsModalOpen(false);
      } else {
        alert(res.error || "Failed to block property. Overlapping dates?");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error creating reservation & property block: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Server-Side Email Dispatch
  const handleSendEmailInvoice = async () => {
    const selectedVilla = villas.find((v) => v.id === selectedVillaId);
    if (!selectedVilla) return;

    if (!guestEmail || !guestEmail.includes("@")) {
      setEmailFeedback({ type: "error", msg: "Please enter a valid guest email address." });
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
      guestsCount: guestCount,
      checkInDate: checkInStr,
      checkOutDate: checkOutStr,
      totalStayCost,
      foodPlanName: foodPlan === "none" ? "No Meal Plan" : foodPlan,
      totalFoodCost,
      totalExtrasCost,
      subtotal: subtotalBeforeDiscount,
      gstPercent,
      gstAmount,
      grandTotal,
      advancePaid,
      securityDeposit,
      balanceDue,
    });

    setIsSendingEmail(false);
    if (res.success) {
      setEmailFeedback({ type: "success", msg: res.message || "Invoice email dispatched to guest!" });
    } else {
      setEmailFeedback({ type: "error", msg: res.error || "Failed to dispatch invoice email." });
    }
  };

  // WhatsApp Quote Share
  const handleShareWhatsApp = (specificBookingData?: any) => {
    const targetVilla = specificBookingData?.villa || villas.find((v) => v.id === selectedVillaId);
    const villaName = targetVilla ? targetVilla.name : "Stay Willas Estate";
    const name = specificBookingData?.name || guestName || "Valued Guest";
    const phone = specificBookingData?.phone || guestPhone || "";
    const cin = specificBookingData?.checkIn || checkInStr;
    const cout = specificBookingData?.checkOut || checkOutStr;
    const numNights = specificBookingData?.nights || nights;
    const numGuests = specificBookingData?.guests || guestCount;
    const total = specificBookingData?.grandTotal || grandTotal;
    const advance = specificBookingData?.advancePaid !== undefined ? specificBookingData.advancePaid : advancePaid;
    const balance = specificBookingData?.balanceDue !== undefined ? specificBookingData.balanceDue : balanceDue;

    const msg = `✨ *Stay Willas - Reservation Invoice & Booking Block* ✨\n` +
      `------------------------------------------\n` +
      `🏰 *Property:* ${villaName}\n` +
      `👤 *Guest Name:* ${name}\n` +
      (cin ? `📅 *Check-In:* ${cin}\n` : "") +
      (cout ? `📅 *Check-Out:* ${cout}\n` : "") +
      `🌙 *Stay Duration:* ${numNights} Night(s)\n` +
      `👥 *Guests:* ${numGuests} Pax\n` +
      `------------------------------------------\n` +
      `🏠 *Nightly Stay Tariff:*\n` +
      nightRates.map((r, i) => `   • ${getNightDateLabel(i)}: Rs. ${typeof r === "number" ? r.toLocaleString("en-IN") : "0"}`).join("\n") +
      `\n   *Total Stay Tariff:* Rs. ${totalStayCost.toLocaleString("en-IN")}\n` +
      (totalFoodCost > 0 ? `🍽️ *Catering Plan:* Rs. ${totalFoodCost.toLocaleString("en-IN")}\n` : "") +
      (totalExtrasCost > 0 ? `✨ *Add-ons & Extras:* Rs. ${totalExtrasCost.toLocaleString("en-IN")}\n` : "") +
      (securityDeposit > 0 ? `🛡️ *Refundable Deposit:* Rs. ${securityDeposit.toLocaleString("en-IN")}\n` : "") +
      `💰 *Grand Total:* Rs. ${total.toLocaleString("en-IN")}\n` +
      (advance > 0 ? `💳 *Advance Received:* Rs. ${advance.toLocaleString("en-IN")}\n` : "") +
      `📌 *Balance Due on Check-In:* ${balance <= 0 ? "PAID IN FULL" : `Rs. ${balance.toLocaleString("en-IN")}`}\n` +
      `------------------------------------------\n` +
      `Thank you for booking with Stay Willas! 🥂`;

    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
    const waUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");
  };

  // Delete / Cancel Booking
  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to clear this reservation/blackout block? This immediately releases the dates for online bookings.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteBooking(id);
      if (res.success) {
        onBookingsChange(bookings.filter(b => b.id !== id));
        setSelectedBooking(null);
      } else {
        alert(res.error || "Failed to remove block.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong while removing block.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Parse Booking Inspector details
  const parseBookingDetails = (booking: Booking) => {
    let parsed: any = {
      type: "CUSTOMER",
      name: "Stay Guest",
      email: "",
      phone: "",
      notes: "",
      channel: "",
      guests: 1,
      nightlyRate: 0,
      foodPlan: "none",
      foodTotal: 0,
      extraCharges: [],
      discountTotal: 0,
      gstPercent: 18,
      gstTotal: 0,
      advancePaid: 0,
      securityDeposit: 0,
      balanceDue: 0,
    };

    if (booking.userId.startsWith("{")) {
      try {
        const json = JSON.parse(booking.userId);
        parsed = {
          ...parsed,
          ...json,
          channel: json.type === "MANUAL" ? "Direct Booking & Invoice" : json.type === "MAINTENANCE" ? "Facility Maintenance" : "Owner Occupancy"
        };
      } catch (e) {}
    } else if (booking.userId.startsWith("CHANNEL_SYNC|")) {
      const parts = booking.userId.split("|");
      parsed = {
        ...parsed,
        type: "CHANNEL",
        name: "External Synced Reservation",
        notes: `Platform UID: ${parts[2] || "N/A"}`,
        channel: (parts[1] || "External Channel").toUpperCase()
      };
    } else {
      parsed = {
        ...parsed,
        type: "ONLINE",
        name: "Online Web Booking",
        email: "Processed via Payment Node",
        notes: `User ID: ${booking.userId}`,
        channel: "Online Portal"
      };
    }

    return parsed;
  };

  const activeDetails = selectedBooking ? parseBookingDetails(selectedBooking) : null;

  return (
    <div className="glass border border-slate-200 rounded-[32px] p-6 sm:p-8 overflow-hidden animate-fade-in relative shadow-2xl space-y-6">
      
      {/* Top Header & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-heading italic flex items-center gap-3 text-[#1B3564] font-bold">
            <CalendarIcon className="text-blue-600" size={24} />
            Availability Scheduler & Invoice Suite
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Visual room rack timeline, instant date blocking, and dynamic tax invoice generation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Month Navigation */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
            <button 
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs uppercase tracking-wider font-black text-[#1B3564] min-w-[110px] text-center font-sans">
              {monthName} {year}
            </span>
            <button 
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Primary CTA: Block Property & Generate Invoice */}
          <button
            onClick={() => handleOpenCreateModal()}
            className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Block Property & Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-slate-500 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/40"></span>
            <span className="font-medium text-slate-700">Confirmed Stay / Synced</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/40"></span>
            <span className="font-medium text-slate-700">Verification Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-red-500/20 border border-red-500/40"></span>
            <span className="font-medium text-slate-700">Maintenance / Blackout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></span>
            <span className="font-medium text-slate-700">Available Sanctuary (Click to Block)</span>
          </div>
        </div>

        <span className="text-[11px] text-blue-600 font-bold hidden lg:inline">
          💡 Click on any date cell to quickly block that property
        </span>
      </div>

      {/* Timeline Rack Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="py-4 px-6 text-left text-[10px] uppercase tracking-widest font-sans font-black text-[#1B3564] sticky left-0 bg-slate-50 z-20 w-64 border-r border-slate-200">
                Boutique Villa
              </th>
              {days.map((day) => {
                const isToday = new Date().toDateString() === day.toDateString();
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <th 
                    key={day.getDate()} 
                    className={`py-3 px-1 text-center text-[9px] uppercase tracking-wider font-sans font-medium min-w-[32px] border-r border-slate-100 ${
                      isToday 
                        ? "text-blue-600 font-black bg-blue-50/80" 
                        : isWeekend 
                        ? "text-amber-700 bg-amber-50/30" 
                        : "text-slate-400"
                    }`}
                  >
                    <div>{day.getDate()}</div>
                    <div className="text-[7px] mt-0.5 font-bold">{day.toLocaleString("en-US", { weekday: "short" }).substring(0, 2)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {villas.map((villa) => (
              <tr key={villa.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="py-3 px-5 text-sm font-heading italic text-[#1B3564] sticky left-0 bg-white z-20 border-r border-slate-200 font-bold w-64 shadow-[8px_0_15px_-8px_rgba(0,0,0,0.15)]">
                  <div className="truncate">{villa.name}</div>
                  <div className="text-[9px] font-sans text-slate-400 tracking-wider uppercase mt-0.5 not-italic font-semibold flex items-center gap-1">
                    <span>₹{villa.price.toLocaleString("en-IN")}/n</span>
                    <span>•</span>
                    <span>{villa.location.split(",")[0]}</span>
                  </div>
                </td>
                {days.map((day) => {
                  const statusInfo = getDayStatus(villa.id, day);
                  
                  let cellClass = "bg-white hover:bg-blue-50 text-slate-300 hover:text-blue-600 cursor-pointer";
                  if (statusInfo.status === "CONFIRMED") {
                    cellClass = "bg-emerald-50 border-y border-emerald-200 text-emerald-700 cursor-pointer shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]";
                  } else if (statusInfo.status === "PENDING") {
                    cellClass = "bg-amber-50 border-y border-amber-200 text-amber-700 cursor-pointer shadow-[inset_0_0_8px_rgba(245,158,11,0.1)]";
                  } else if (statusInfo.status === "BLOCKED") {
                    cellClass = "bg-red-50 border-y border-red-200 text-red-700 cursor-pointer shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]";
                  } else if (statusInfo.status === "PARTIAL") {
                    cellClass = "bg-amber-100/70 border-y border-amber-300 text-amber-900 cursor-pointer shadow-[inset_0_0_8px_rgba(245,158,11,0.15)]";
                  }

                  return (
                    <td 
                      key={day.getDate()} 
                      onClick={() => handleCellClick(villa.id, day, statusInfo)}
                      className={`p-0 text-center border-r border-slate-100 h-11 transition-all ${cellClass}`}
                      title={`${villa.name} - ${day.toLocaleDateString("en-IN")} (${statusInfo.label || statusInfo.status})`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {statusInfo.status === "AVAILABLE" && (
                          <Plus size={10} className="opacity-0 hover:opacity-100 transition-opacity text-blue-600" />
                        )}
                        {statusInfo.status === "BLOCKED" && (
                          <Wrench size={11} className="text-red-700" />
                        )}
                        {statusInfo.status === "CONFIRMED" && (
                          <CheckCircle size={11} className="text-emerald-700" />
                        )}
                        {statusInfo.status === "PENDING" && (
                          <Clock size={11} className="text-amber-700" />
                        )}
                        {statusInfo.status === "PARTIAL" && (
                          <span className="text-[7.5px] font-black px-1 py-0.5 rounded bg-[#1B3564] text-[#DAA520] leading-none whitespace-nowrap">
                            {statusInfo.label}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* UNIFIED MODAL: BLOCK PROPERTY & GENERATE INVOICE */}
      {mounted && isModalOpen && createPortal(
        <div 
          data-lenis-prevent="true"
          style={{ overscrollBehavior: "contain" }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in overflow-y-auto"
        >
          <div 
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
            className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full relative shadow-2xl flex flex-col max-h-[92vh] my-auto overflow-hidden text-left"
          >
            
            {/* Modal Header */}
            <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#1B3564] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#DAA520]/20 border border-[#DAA520]/40 flex items-center justify-center text-[#DAA520]">
                  <Receipt size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-heading font-bold text-[#DAA520]">
                    Property Block & Invoice Generator
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Lock dates across website & external channels while creating a detailed client invoice.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form 
              id="block-and-invoice-form" 
              onSubmit={(e) => handleSaveAndBlockProperty(e, true)} 
              data-lenis-prevent="true"
              style={{ overscrollBehavior: "contain" }}
              className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6"
            >
              
              {/* Type Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalMode("GUEST_BOOKING")}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    modalMode === "GUEST_BOOKING"
                      ? "bg-[#1B3564] text-[#DAA520] shadow-md"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Receipt size={16} />
                  <span>Guest Stay & Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalMode("MAINTENANCE")}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    modalMode === "MAINTENANCE"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Wrench size={16} />
                  <span>Routine Maintenance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalMode("OWNER_USE")}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    modalMode === "OWNER_USE"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShieldAlert size={16} />
                  <span>Owner Private Stay</span>
                </button>
              </div>

              {/* Property & Dates Selection (Common to All Modes) */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                  1. Property & Stay Dates
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Select Property *</label>
                    <select
                      value={selectedVillaId}
                      onChange={(e) => setSelectedVillaId(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none"
                    >
                      {villas.map((villa) => (
                        <option key={villa.id} value={villa.id}>
                          {villa.name} ({villa.location}) - ₹{villa.price.toLocaleString("en-IN")}/n
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-In Date *</label>
                    <input
                      type="date"
                      value={checkInStr}
                      onChange={(e) => handleDateChange(e.target.value, checkOutStr)}
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-Out Date *</label>
                    <input
                      type="date"
                      value={checkOutStr}
                      min={checkInStr}
                      onChange={(e) => handleDateChange(checkInStr, e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#1B3564] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <span>Stay Duration:</span>
                  <span className="bg-[#1B3564] text-white px-2.5 py-0.5 rounded-full text-[11px]">
                    {nights} Total Night{nights > 1 ? "s" : ""}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{guestCount} Guests</span>
                </div>
              </div>

              {/* Maintenance / Owner Use Simple Fields */}
              {modalMode !== "GUEST_BOOKING" && (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                    2. Blackout Reason & Directives
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={modalMode === "MAINTENANCE" ? "e.g. Deep cleaning, pool servicing, electrical repairs" : "e.g. Villa owner family vacation"}
                    required
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-xs focus:border-[#1B3564] outline-none font-medium"
                  />
                </div>
              )}

              {/* Full Invoice Fields (Guest Booking Mode) */}
              {modalMode === "GUEST_BOOKING" && (
                <>
                  {/* Section 2: Guest Details */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                      2. Guest Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Primary Guest Name *</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#1B3564] outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Phone / WhatsApp</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#1B3564] outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Email Address</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="guest@domain.com"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#1B3564] outline-none font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">
                          Guest Count (Pax) {isWillowSelected ? "(Max 12)" : "*"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={isWillowSelected ? 12 : 60}
                          value={guestCount}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setGuestCount(val);
                            setFoodGuestsCount(val);
                            if (isWillowSelected) {
                              setCottagesCount(Math.max(1, Math.min(3, Math.ceil(val / 4))));
                            }
                          }}
                          required
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-[#1B3564] outline-none font-bold"
                        />
                      </div>
                    </div>

                    {/* Willow Peak Cottage Selector - Cottage A, B, C, or ALL */}
                    {isWillowSelected && (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 space-y-2.5 mt-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1B3564]">
                          <span className="flex items-center gap-1.5">
                            <span>🏡</span> Willow Peak Cottage Selection:
                          </span>
                          <span className="bg-[#1B3564] text-[#DAA520] px-2.5 py-0.5 rounded-full text-[10px] font-black">
                            {cottageSelection === "ALL" ? "All 3 Cottages (Full Estate)" : `Cottage ${cottageSelection} (1 Cottage)`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "A", label: "Cottage A", sub: "Max 4 Guests" },
                            { id: "B", label: "Cottage B", sub: "Max 4 Guests" },
                            { id: "C", label: "Cottage C", sub: "Max 4 Guests" },
                            { id: "ALL", label: "All 3 Cottages", sub: "Max 12 Guests" },
                          ].map((item) => {
                            const isSel = cottageSelection === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  const newSel = item.id as "A" | "B" | "C" | "ALL";
                                  setCottageSelection(newSel);
                                  const count = newSel === "ALL" ? 3 : 1;
                                  setCottagesCount(count);
                                  if (newSel !== "ALL" && guestCount > 4) {
                                    setGuestCount(4);
                                    setFoodGuestsCount(4);
                                  } else if (newSel === "ALL" && guestCount < 5) {
                                    setGuestCount(6);
                                    setFoodGuestsCount(6);
                                  }
                                }}
                                className={`py-2 px-2 rounded-xl text-center transition-all cursor-pointer border ${
                                  isSel
                                    ? "bg-[#1B3564] text-white border-[#1B3564] shadow-xs"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-400"
                                }`}
                              >
                                <div className="text-xs font-black">{item.label}</div>
                                <div className={`text-[9px] font-bold mt-0.5 ${isSel ? "text-[#DAA520]" : "text-slate-400"}`}>
                                  {item.sub}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {cottageSelection === "ALL"
                            ? "All 3 Cottages (A, B, and C) reserved (Entire Willow Peak property blocked for these dates)."
                            : `Cottage ${cottageSelection} allocated for ${guestCount} guest(s). The other 2 cottages remain open for separate reservations.`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Night-by-Night Stay Rates */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                        3. Nightly Stay Rates ({nights} Night{nights > 1 ? "s" : ""})
                      </span>
                      <div className="flex items-center gap-1.5">
                        {nights > 1 && nightRates[0] !== "" && (
                          <button
                            type="button"
                            onClick={handleCopyNight1ToAll}
                            className="text-[10px] font-bold text-[#1B3564] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Copy Night 1 to All
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleNightsChange(nights + 1)}
                          className="text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg cursor-pointer"
                        >
                          + 1 Night
                        </button>
                        {nights > 1 && (
                          <button
                            type="button"
                            onClick={() => handleNightsChange(nights - 1)}
                            className="text-[10px] font-bold text-red-600 bg-white hover:bg-red-50 border border-slate-200 px-2 py-0.5 rounded-lg cursor-pointer"
                          >
                            - 1 Night
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Enter tariff for each booked night (Night 1, Night 2, etc.). Pricing fields are left blank so you can enter the agreed rates directly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {nightRates.map((rate, index) => {
                        const nightLabel = getNightDateLabel(index);
                        return (
                          <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 focus-within:border-[#1B3564] transition-all">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                <span className="w-4 h-4 rounded-full bg-[#1B3564] text-white text-[9px] flex items-center justify-center font-black">
                                  {index + 1}
                                </span>
                                <span>{nightLabel}</span>
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Tariff</span>
                            </div>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">₹</span>
                              <input
                                type="number"
                                placeholder="Enter tariff..."
                                value={rate}
                                onChange={(e) => handleNightRateChange(index, e.target.value)}
                                className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg pl-6 pr-2.5 py-1.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#1B3564]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Total Stay Accommodation Tariff:</span>
                      <span className="text-base font-black text-[#1B3564]">₹{totalStayCost.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Section 4: Dining & Catering Packages */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                      4. Dining & Catering Package
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Menu Package</label>
                        <select
                          value={foodPlan}
                          onChange={(e) => setFoodPlan(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        >
                          <option value="none">No Meals Plan (Self / External)</option>
                          <option value="standard">Standard Menu (₹1,250/day)</option>
                          <option value="deluxe">Deluxe Gourmet Menu (₹1,500/day)</option>
                          <option value="custom">Custom Dining Rate</option>
                        </select>
                      </div>

                      {foodPlan !== "none" && (
                        <>
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Rate / Person / Day (₹)</label>
                            <input
                              type="number"
                              value={foodRatePerPersonPerDay}
                              onChange={(e) => setFoodRatePerPersonPerDay(Number(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Meal Guests Count</label>
                            <input
                              type="number"
                              value={foodGuestsCount}
                              onChange={(e) => setFoodGuestsCount(Number(e.target.value) || 1)}
                              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {foodPlan !== "none" && (
                      <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                        <span className="text-slate-600">Total Catering Cost:</span>
                        <span className="text-sm font-black text-emerald-700">₹{totalFoodCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Add-ons & Extra Services */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                      5. Custom Add-ons & Extra Services
                    </span>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newExtraDesc}
                        onChange={(e) => setNewExtraDesc(e.target.value)}
                        placeholder="e.g. Pool Heating, Bonfire Setup, BBQ Grill, Butler Service"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                      <input
                        type="number"
                        value={newExtraAmount}
                        onChange={(e) => setNewExtraAmount(e.target.value !== "" ? Number(e.target.value) : "")}
                        placeholder="Amount (₹)"
                        className="w-32 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleAddExtra}
                        className="px-4 py-2 bg-[#1B3564] text-[#DAA520] hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {extraCharges.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {extraCharges.map((charge) => (
                          <div key={charge.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="font-medium text-slate-800">{charge.description}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900">₹{charge.amount.toLocaleString("en-IN")}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveExtra(charge.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer border-none bg-transparent p-1"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 6: Advance Paid, Security Deposit & Adjustments */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-extrabold text-[#1B3564] uppercase tracking-widest block font-sans">
                      6. Advance Paid, Security Deposit & Taxes
                    </span>

                    {/* Dedicated Advance Paid & Security Deposit Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Advance Paid */}
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            <span>Advance Received / Paid (₹)</span>
                          </label>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                            Paid by Guest
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 select-none">₹</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={advancePaid || ""}
                            onChange={(e) => setAdvancePaid(Number(e.target.value) || 0)}
                            className="w-full bg-emerald-50/40 border border-emerald-200 text-emerald-950 rounded-lg pl-6 pr-3 py-1.5 text-xs font-black outline-none focus:bg-white focus:border-emerald-500"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block">Deducted from the total to calculate balance at check-in</span>
                      </div>

                      {/* Security Deposit */}
                      <div className="bg-white p-3.5 rounded-xl border border-amber-300 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
                            <ShieldAlert size={13} className="text-[#DAA520]" />
                            <span>Security Deposit (₹)</span>
                          </label>
                          <span className="text-[9px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                            Refundable
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700 select-none">₹</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={securityDeposit || ""}
                            onChange={(e) => setSecurityDeposit(Number(e.target.value) || 0)}
                            className="w-full bg-amber-50/40 border border-amber-200 text-slate-900 rounded-lg pl-6 pr-3 py-1.5 text-xs font-black outline-none focus:bg-white focus:border-[#DAA520]"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block">Refundable deposit for property damage care</span>
                      </div>
                    </div>

                    {/* Discounts, Tax Rate & Status */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Flat Discount (₹)</label>
                        <input
                          type="number"
                          value={discountFlat || ""}
                          placeholder="0"
                          onChange={(e) => setDiscountFlat(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Percent Discount (%)</label>
                        <input
                          type="number"
                          value={discountPercent || ""}
                          placeholder="0"
                          onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">GST Tax Rate</label>
                        <select
                          value={gstPercent}
                          onChange={(e) => setGstPercent(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        >
                          <option value="18">18% GST (Standard)</option>
                          <option value="12">12% GST</option>
                          <option value="5">5% GST</option>
                          <option value="0">0% (Tax Exempt)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Reservation Status</label>
                        <select
                          value={bookingStatus}
                          onChange={(e) => setBookingStatus(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                        >
                          <option value="CONFIRMED">CONFIRMED STAY</option>
                          <option value="PENDING">VERIFICATION PENDING</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 7: Booking Notes */}
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Directives & Special Notes</label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Early check-in approved, pure veg food preferences, birthday celebration setup"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  {/* Live Financial Summary Banner */}
                  <div className="bg-[#1B3564] text-white p-5 rounded-2xl border border-[#DAA520]/30 shadow-lg space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-300 border-b border-white/10 pb-2">
                      <span>Stay Subtotal ({nights}N):</span>
                      <span className="font-bold text-white">₹{totalStayCost.toLocaleString("en-IN")}</span>
                    </div>

                    {totalFoodCost > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-300 border-b border-white/10 pb-2">
                        <span>Catering Charges:</span>
                        <span className="font-bold text-white">₹{totalFoodCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {totalExtrasCost > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-300 border-b border-white/10 pb-2">
                        <span>Add-ons & Extras:</span>
                        <span className="font-bold text-white">₹{totalExtrasCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {gstAmount > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-300 border-b border-white/10 pb-2">
                        <span>GST ({gstPercent}%):</span>
                        <span className="font-bold text-white">₹{gstAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {securityDeposit > 0 && (
                      <div className="flex justify-between items-center text-xs text-amber-300 border-b border-white/10 pb-2">
                        <span>+ Refundable Security Deposit:</span>
                        <span className="font-bold">₹{securityDeposit.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-bold text-[#DAA520]">
                      <span>NET GRAND TOTAL:</span>
                      <span className="text-xl font-black">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-white/10">
                      <span className="text-emerald-300">Advance Paid: ₹{advancePaid.toLocaleString("en-IN")}</span>
                      <span className={balanceDue <= 0 ? "text-emerald-300" : "text-amber-300"}>
                        Balance on Check-In: {balanceDue <= 0 ? "PAID IN FULL" : `₹${balanceDue.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Email Feedback */}
              {emailFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  emailFeedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {emailFeedback.type === "success" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                  <span>{emailFeedback.msg}</span>
                </div>
              )}

            </form>

            {/* Modal Footer Actions */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl">
              <div className="flex items-center gap-2">
                {modalMode === "GUEST_BOOKING" && (
                  <>
                    <button
                      type="button"
                      onClick={handleSendEmailInvoice}
                      disabled={isSendingEmail}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      {isSendingEmail ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                      <span className="hidden sm:inline">Send Email Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp()}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Share2 size={13} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                {modalMode === "GUEST_BOOKING" ? (
                  <>
                    {/* Block Property & Download PDF */}
                    <button
                      type="button"
                      disabled={isSubmitting || isDownloadingPDF}
                      onClick={(e) => handleSaveAndBlockProperty(e, true)}
                      className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                    >
                      {isSubmitting || isDownloadingPDF ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      <span>BLOCK & DOWNLOAD PDF INVOICE</span>
                    </button>

                    {/* Block Only */}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => handleSaveAndBlockProperty(e, false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Block Only
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    form="block-and-invoice-form"
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "RECORD BLACKOUT BLOCK"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* DETAILED RESERVATION INSPECTOR MODAL */}
      {mounted && selectedBooking && activeDetails && createPortal(
        <div 
          data-lenis-prevent="true"
          style={{ overscrollBehavior: "contain" }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 md:p-6 animate-fade-in text-left"
        >
          <div 
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
            className="glass border border-slate-200 rounded-[32px] p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          >
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-xl font-heading italic text-[#1B3564] font-bold">{activeDetails.name}</h4>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block mt-0.5">
                  Source: {activeDetails.channel}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                selectedBooking.status === "CONFIRMED" 
                  ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30" 
                  : selectedBooking.status === "PENDING"
                  ? "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                  : "bg-red-500/15 text-red-700 border border-red-500/30"
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            {/* Inspector Content */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Sanctuary Estate</span>
                <span className="font-heading text-lg text-slate-900 font-bold">{villas.find(v => v.id === selectedBooking.villaId)?.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Check-In</span>
                  <span className="font-sans text-slate-900 font-bold">{new Date(selectedBooking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Check-Out</span>
                  <span className="font-sans text-slate-900 font-bold">{new Date(selectedBooking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              {/* Guest Details */}
              {(activeDetails.phone || activeDetails.email) && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="text-[9px] text-[#1B3564] font-black uppercase tracking-widest block mb-1">GUEST CONTACT</span>
                  {activeDetails.phone && (
                    <div className="flex items-center gap-2 text-slate-800">
                      <Phone size={12} className="text-blue-600" />
                      <span>{activeDetails.phone}</span>
                    </div>
                  )}
                  {activeDetails.email && (
                    <div className="flex items-center gap-2 text-slate-800">
                      <Mail size={12} className="text-blue-600" />
                      <span className="truncate">{activeDetails.email}</span>
                    </div>
                  )}
                </div>
              )}

              {activeDetails.notes && (
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1 font-bold">Directive / Sync Notes</span>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed italic">
                    &ldquo;{activeDetails.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Financial Snapshot */}
              <div className="bg-[#1B3564] text-white p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#DAA520] uppercase tracking-widest block font-bold">Transaction Value</span>
                <div className="text-xl font-black">
                  {selectedBooking.totalPrice > 0 
                    ? `₹${selectedBooking.totalPrice.toLocaleString("en-IN")}` 
                    : "₹0 (Blocked Sanctuary)"}
                </div>
                {activeDetails.advancePaid !== undefined && (
                  <div className="text-[11px] text-slate-300 pt-1 flex justify-between">
                    <span>Advance Received: ₹{activeDetails.advancePaid.toLocaleString("en-IN")}</span>
                    <span>Balance: ₹{(activeDetails.balanceDue || 0).toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inspector Actions */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              {/* PDF Invoice Re-Download Button & WhatsApp Share */}
              {activeDetails.type !== "CHANNEL" && selectedBooking.totalPrice > 0 && (() => {
                const bVilla = villas.find(v => v.id === selectedBooking.villaId);
                const bNights = Math.max(1, Math.round((new Date(selectedBooking.checkOut).getTime() - new Date(selectedBooking.checkIn).getTime()) / (1000 * 60 * 60 * 24)));
                const bRate = activeDetails.nightlyRate || (bVilla?.price) || Math.round(selectedBooking.totalPrice / bNights);
                const bBaseGuests = bVilla?.baseGuests ?? 12;
                const bExtraFee = bVilla?.extraGuestFee ?? 1500;
                const bGuests = activeDetails.guests || 2;
                const bExtraGuestsCount = Math.max(0, bGuests - bBaseGuests);
                const bExtraGuestsCost = bExtraGuestsCount * bExtraFee * bNights;
                const bFoodPlan = activeDetails.food?.plan || activeDetails.foodPlan || "none";
                const bFoodRate = activeDetails.food?.ratePerPersonPerDay || activeDetails.foodRate || 0;
                const bFoodGuests = activeDetails.food?.guestsCount || bGuests;
                const bFoodTotal = activeDetails.food?.total || (bFoodPlan !== "none" ? bFoodRate * bFoodGuests * bNights : 0);
                const bExtras = Array.isArray(activeDetails.extraCharges) ? activeDetails.extraCharges : [];
                const bExtrasTotal = bExtras.reduce((sum: number, x: any) => sum + (x.amount || 0), 0);
                const bStayTotal = (bNights * bRate) + bExtraGuestsCost;
                const bGrossSubtotal = bStayTotal + bFoodTotal + bExtrasTotal;
                const bDiscountFlat = activeDetails.discount?.flat || activeDetails.discountFlat || 0;
                const bDiscountPct = activeDetails.discount?.percent || activeDetails.discountPercent || 0;
                const bDiscountTotal = activeDetails.discount?.total || activeDetails.discountTotal || Math.round(bDiscountFlat + (bGrossSubtotal * (bDiscountPct / 100)));
                const bTaxable = Math.max(0, bGrossSubtotal - bDiscountTotal);
                const bGstPercent = activeDetails.gst?.percent !== undefined ? activeDetails.gst.percent : (activeDetails.gstPercent !== undefined ? activeDetails.gstPercent : 18);
                const bGstAmount = activeDetails.gst?.total !== undefined ? activeDetails.gst.total : Math.round(bTaxable * (bGstPercent / 100));
                const bDeposit = activeDetails.securityDeposit || 0;
                const bGrandTotal = selectedBooking.totalPrice || (bTaxable + bGstAmount + bDeposit);
                const bAdvance = activeDetails.advancePaid || 0;
                const bBalance = activeDetails.balanceDue !== undefined ? activeDetails.balanceDue : Math.max(0, bGrandTotal - bAdvance);

                return (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => generateAndDownloadInvoicePDF({
                        villa: bVilla,
                        guestName: activeDetails.name,
                        guestPhone: activeDetails.phone,
                        guestEmail: activeDetails.email,
                        checkIn: new Date(selectedBooking.checkIn).toISOString().split("T")[0],
                        checkOut: new Date(selectedBooking.checkOut).toISOString().split("T")[0],
                        nights: bNights,
                        nightRates: Array(bNights).fill(bRate),
                        totalStayCost: bNights * bRate,
                        foodPlan: bFoodPlan,
                        foodRate: bFoodRate,
                        foodGuests: bFoodGuests,
                        totalFoodCost: bFoodTotal,
                        extraCharges: bExtras,
                        subtotalBeforeDiscount: bGrossSubtotal,
                        totalDiscount: bDiscountTotal,
                        subtotal: bTaxable,
                        gstPercent: bGstPercent,
                        gstAmount: bGstAmount,
                        securityDeposit: bDeposit,
                        grandTotal: bGrandTotal,
                        advancePaid: bAdvance,
                        balanceDue: bBalance,
                        ratePerNight: bRate,
                        guestsCount: bGuests,
                      })}
                      className="py-2.5 px-3 bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp({
                        villa: bVilla,
                        name: activeDetails.name,
                        phone: activeDetails.phone,
                        checkIn: new Date(selectedBooking.checkIn).toLocaleDateString("en-IN"),
                        checkOut: new Date(selectedBooking.checkOut).toLocaleDateString("en-IN"),
                        nights: bNights,
                        guests: bGuests,
                        grandTotal: bGrandTotal,
                        advancePaid: bAdvance,
                        balanceDue: bBalance,
                      })}
                      className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={13} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                );
              })()}

              {/* Show Clear button only for manual bookings, synced bookings or blackouts */}
              {activeDetails.type !== "ONLINE" && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={isDeleting}
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  <span>CLEAR BLOCK / CANCEL STAY</span>
                </button>
              )}
              
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
              >
                CLOSE INSPECTOR
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
