"use client";

import React, { useState, useEffect } from "react";
import { logoutAction } from "@/app/actions/login-actions";
import { 
  Home as HomeIcon, 
  Calendar, 
  IndianRupee, 
  MessageSquare, 
  Users, 
  ShieldAlert, 
  MapPin, 
  DollarSign,
  TrendingUp,
  Mail,
  UserCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Settings,
  Copy,
  Loader2,
  Wrench,
  AlertTriangle,
  X,
  Receipt,
  User,
  Phone,
  CalendarDays,
  FileText,
  CheckCircle2,
  Trash2,
  Eye,
  CreditCard,
  Edit3,
  Save,
  Calculator
} from "lucide-react";
import Image from "next/image";
import AvailabilityCalendar from "@/components/admin/availability-calendar";
import DailyPricingCalendar from "@/components/admin/daily-pricing-calendar";
import BillCalculator from "@/components/admin/bill-calculator";
import { 
  updateVillaDetails, 
  getChannelConfigs, 
  updateChannelConfig, 
  syncExternalChannels,
  createManualBooking,
  deleteBooking,
  updateBookingPayment,
  updateBookingFullDetails
} from "@/app/actions/admin";

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
  baseGuests?: number;
  extraGuestFee?: number;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  images: string[];
  description: string;
  weekendPrice?: number | null;
  seasonalPrices: SeasonalPrice[];
  dailyPrices: DailyPrice[];
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

interface AdminDashboardProps {
  initialVillas: Villa[];
  initialBookings: Booking[];
  userEmail: string;
}

const AdminDashboard = ({ 
  initialVillas, 
  initialBookings, 
  userEmail 
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "stays" | "bookings" | "calendar" | "pricing" | "calculator">("overview");

  // Lift properties and bookings to states for high reactivity
  const [villas, setVillas] = useState<Villa[]>(initialVillas);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Selected Booking details modal state & invoice prefill
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [calculatorPrefill, setCalculatorPrefill] = useState<any>(null);

  // Inline Payment Editing States inside Modal
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentAdvanceInput, setPaymentAdvanceInput] = useState<number | "">("");
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Full Reservation & Bill Editing States
  const [isEditingFullBill, setIsEditingFullBill] = useState(false);
  const [editBillNightlyRate, setEditBillNightlyRate] = useState<number>(0);
  const [editBillFoodPlan, setEditBillFoodPlan] = useState<string>("none");
  const [editBillFoodRate, setEditBillFoodRate] = useState<number>(0);
  const [editBillExtraCharges, setEditBillExtraCharges] = useState<Array<{ id: string; description: string; amount: number }>>([]);
  const [editBillNewExtraDesc, setEditBillNewExtraDesc] = useState("");
  const [editBillNewExtraAmount, setEditBillNewExtraAmount] = useState<number | "">("");
  const [editBillDiscountFlat, setEditBillDiscountFlat] = useState<number>(0);
  const [editBillDiscountPercent, setEditBillDiscountPercent] = useState<number>(0);
  const [editBillGstPercent, setEditBillGstPercent] = useState<number>(0);
  const [editBillSecurityDeposit, setEditBillSecurityDeposit] = useState<number>(0);
  const [editBillAdvancePaid, setEditBillAdvancePaid] = useState<number>(0);
  const [editBillBalanceDue, setEditBillBalanceDue] = useState<number | "">("");
  const [isSavingFullBill, setIsSavingFullBill] = useState(false);

  // Inline Net Balance Editing States inside Modal
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState<number | "">("");
  const [isSavingBalance, setIsSavingBalance] = useState(false);

  // Quick Popover Calculator Widget States
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcHistory, setCalcHistory] = useState("");

  const evaluateMath = (expr: string): string => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/%.()]/g, '');
      if (!sanitized) return "0";
      const fn = new Function(`return (${sanitized});`);
      const res = fn();
      if (typeof res === "number" && !isNaN(res) && isFinite(res)) {
        return Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(4)).toString();
      }
      return "Error";
    } catch (e) {
      return "Error";
    }
  };

  const handleCalcPress = (btn: string) => {
    if (btn === "C") {
      setCalcDisplay("0");
      setCalcHistory("");
    } else if (btn === "CE") {
      setCalcDisplay("0");
    } else if (btn === "⌫") {
      if (calcDisplay.length <= 1 || calcDisplay === "Error") {
        setCalcDisplay("0");
      } else {
        setCalcDisplay(calcDisplay.slice(0, -1));
      }
    } else if (btn === "=") {
      const res = evaluateMath(calcDisplay);
      setCalcHistory(`${calcDisplay} =`);
      setCalcDisplay(res);
    } else {
      if (calcDisplay === "0" || calcDisplay === "Error") {
        if (["+", "-", "*", "/", "%"].includes(btn)) {
          setCalcDisplay("0" + btn);
        } else {
          setCalcDisplay(btn);
        }
      } else {
        setCalcDisplay(calcDisplay + btn);
      }
    }
  };

  const handleOpenInCalculator = (booking: Booking) => {
    let guestName = "";
    let guestEmail = "";
    let guestPhone = "";
    let ratePerNight = booking.villa?.price || 0;
    let foodPlan = "none";
    let foodRate = 0;
    let extraCharges: any[] = [];
    let discountFlat = 0;
    let discountPercent = 0;
    let gstPercent = 18;
    let advancePaid = 0;
    let securityDeposit = 0;

    try {
      if (booking.userId && booking.userId.startsWith("{")) {
        const parsed = JSON.parse(booking.userId);
        guestName = parsed.name || "";
        guestEmail = parsed.email || "";
        guestPhone = parsed.phone || "";
        if (parsed.nightlyRate) ratePerNight = parsed.nightlyRate;
        if (parsed.food) {
          foodPlan = parsed.food.plan || "none";
          foodRate = parsed.food.ratePerPersonPerDay || 0;
        }
        if (Array.isArray(parsed.extraCharges)) extraCharges = parsed.extraCharges;
        if (parsed.discount) {
          discountFlat = parsed.discount.flat || 0;
          discountPercent = parsed.discount.percent || 0;
        }
        if (parsed.gst) gstPercent = parsed.gst.percent || 0;
        if (parsed.advancePaid) advancePaid = parsed.advancePaid;
        if (parsed.securityDeposit) securityDeposit = parsed.securityDeposit;
      } else {
        guestName = booking.userId || "";
      }
    } catch (e) {}

    const cin = new Date(booking.checkIn).toISOString().split("T")[0];
    const cout = new Date(booking.checkOut).toISOString().split("T")[0];

    const parsedGuestsCount = (booking.userId && booking.userId.startsWith("{") ? (JSON.parse(booking.userId).guests || 1) : 1);
    const parsedFoodGuestsCount = (booking.userId && booking.userId.startsWith("{") ? (JSON.parse(booking.userId).food?.guestsCount || parsedGuestsCount) : parsedGuestsCount);

    setCalculatorPrefill({
      villaSlug: booking.villa?.slug || "",
      checkIn: cin,
      checkOut: cout,
      guestName,
      guestEmail,
      guestPhone,
      guestsCount: parsedGuestsCount,
      baseGuests: booking.villa?.baseGuests ?? 12,
      extraGuestFee: booking.villa?.extraGuestFee ?? 1500,
      ratePerNight,
      weekendRatePerNight: booking.villa?.weekendPrice || Math.round((booking.villa?.price || ratePerNight) * 1.2),
      foodPlan,
      foodRate,
      foodGuestsCount: parsedFoodGuestsCount,
      extraCharges,
      discountFlat,
      discountPercent,
      gstPercent,
      advancePaid,
      securityDeposit,
    });

    setSelectedBookingDetails(null);
    setActiveTab("calculator");
  };

  // Manual Booking Form States
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newBookingVillaId, setNewBookingVillaId] = useState("");
  const [newBookingCheckIn, setNewBookingCheckIn] = useState("");
  const [newBookingCheckOut, setNewBookingCheckOut] = useState("");
  const [newBookingGuestName, setNewBookingGuestName] = useState("");
  const [newBookingGuestEmail, setNewBookingGuestEmail] = useState("");
  const [newBookingGuestPhone, setNewBookingGuestPhone] = useState("");
  const [newBookingPrice, setNewBookingPrice] = useState(0);
  const [newBookingStatus, setNewBookingStatus] = useState("CONFIRMED");
  const [newBookingType, setNewBookingType] = useState<"GUEST" | "MAINTENANCE" | "OWNER_USE">("GUEST");
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [bookingFormError, setBookingFormError] = useState("");

  const [newBookingNightlyRate, setNewBookingNightlyRate] = useState(0);
  const [newBookingGuests, setNewBookingGuests] = useState(1);

  // Food & Dining Package States
  const [newBookingFoodPlan, setNewBookingFoodPlan] = useState<"none" | "standard" | "deluxe" | "custom">("none");
  const [newBookingFoodRate, setNewBookingFoodRate] = useState<number>(0);

  // Extra Charges List
  const [newBookingExtraCharges, setNewBookingExtraCharges] = useState<Array<{ id: string; description: string; amount: number }>>([]);
  const [newExtraDesc, setNewExtraDesc] = useState("");
  const [newExtraAmount, setNewExtraAmount] = useState<number | "">("");

  // Discounts & Adjustments
  const [newBookingDiscountFlat, setNewBookingDiscountFlat] = useState<number>(0);
  const [newBookingDiscountPercent, setNewBookingDiscountPercent] = useState<number>(0);
  const [newBookingGstPercent, setNewBookingGstPercent] = useState<number>(0);
  const [newBookingAdvancePaid, setNewBookingAdvancePaid] = useState<number>(0);
  const [newBookingSecurityDeposit, setNewBookingSecurityDeposit] = useState<number>(0);

  // Auto food rate helper when plan changes
  const handleFoodPlanChange = (plan: "none" | "standard" | "deluxe" | "custom") => {
    setNewBookingFoodPlan(plan);
    if (plan === "none") setNewBookingFoodRate(0);
    else if (plan === "standard") setNewBookingFoodRate(1000);
    else if (plan === "deluxe") setNewBookingFoodRate(1500);
  };

  // Prefill base nightly rate and guests limit when villa is selected
  useEffect(() => {
    if (newBookingVillaId) {
      const selectedVilla = villas.find(v => v.id === newBookingVillaId);
      if (selectedVilla) {
        setNewBookingNightlyRate(selectedVilla.price);
        setNewBookingGuests(selectedVilla.guests || 1);
      }
    }
  }, [newBookingVillaId, villas]);

  // Recalculate price override automatically when dates or nightly rate changes
  useEffect(() => {
    if (newBookingCheckIn && newBookingCheckOut) {
      const inDate = new Date(newBookingCheckIn + "T12:00:00");
      const outDate = new Date(newBookingCheckOut + "T12:00:00");
      const nights = Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      const selectedVilla = villas.find(v => v.id === newBookingVillaId);
      const baseGuestsLimit = selectedVilla?.baseGuests ?? 12;
      const extraFeePerGuest = selectedVilla?.extraGuestFee ?? 1500;
      const extraGuestsCount = Math.max(0, newBookingGuests - baseGuestsLimit);
      const extraGuestsCost = extraGuestsCount * extraFeePerGuest * nights;

      const stayTotal = (nights * newBookingNightlyRate) + extraGuestsCost;
      const foodTotal = newBookingFoodPlan !== "none" ? (newBookingFoodRate * newBookingGuests * nights) : 0;
      const extrasTotal = newBookingExtraCharges.reduce((acc, c) => acc + (c.amount || 0), 0);
      const subtotal = stayTotal + foodTotal + extrasTotal;
      
      const discFlat = newBookingDiscountFlat || 0;
      const discPct = newBookingDiscountPercent || 0;
      const discountVal = Math.round(discFlat + (subtotal * (discPct / 100)));
      
      const taxable = Math.max(0, subtotal - discountVal);
      const gstTotal = Math.round(taxable * ((newBookingGstPercent || 0) / 100));
      const grandTotal = Math.round(taxable + gstTotal + (newBookingSecurityDeposit || 0));

      setNewBookingPrice(grandTotal);
    }
  }, [
    newBookingCheckIn, 
    newBookingCheckOut, 
    newBookingVillaId,
    newBookingNightlyRate, 
    newBookingFoodPlan, 
    newBookingFoodRate, 
    newBookingGuests, 
    newBookingExtraCharges, 
    newBookingDiscountFlat, 
    newBookingDiscountPercent, 
    newBookingGstPercent, 
    newBookingSecurityDeposit,
    villas
  ]);

  const handleManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingFormError("");

    if (!newBookingVillaId || !newBookingCheckIn || !newBookingCheckOut || !newBookingGuestName || newBookingPrice <= 0) {
      setBookingFormError("Please fill out all required fields.");
      return;
    }

    setIsSavingBooking(true);
    try {
      const inDate = new Date(newBookingCheckIn + "T12:00:00");
      const outDate = new Date(newBookingCheckOut + "T12:00:00");
      const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      const selectedVilla = villas.find(v => v.id === newBookingVillaId);
      const baseGuestsLimit = selectedVilla?.baseGuests ?? 12;
      const extraFeePerGuest = selectedVilla?.extraGuestFee ?? 1500;
      const extraGuestsCount = Math.max(0, newBookingGuests - baseGuestsLimit);
      const extraGuestsCost = extraGuestsCount * extraFeePerGuest * nights;

      const stayTotal = (nights * newBookingNightlyRate) + extraGuestsCost;
      const foodTotal = newBookingFoodPlan !== "none" ? (newBookingFoodRate * newBookingGuests * nights) : 0;
      const extrasTotal = newBookingExtraCharges.reduce((acc, c) => acc + (c.amount || 0), 0);
      const subtotal = stayTotal + foodTotal + extrasTotal;
      const discFlat = newBookingDiscountFlat || 0;
      const discPct = newBookingDiscountPercent || 0;
      const discountVal = Math.round(discFlat + (subtotal * (discPct / 100)));
      const taxable = Math.max(0, subtotal - discountVal);
      const gstTotal = Math.round(taxable * ((newBookingGstPercent || 0) / 100));
      const grandTotal = Math.round(taxable + gstTotal + (newBookingSecurityDeposit || 0));
      const balanceDue = Math.max(0, grandTotal - (newBookingAdvancePaid || 0));

      const result = await createManualBooking({
        villaId: newBookingVillaId,
        checkIn: inDate.toISOString(),
        checkOut: outDate.toISOString(),
        guestName: newBookingGuestName,
        guestEmail: newBookingGuestEmail,
        guestPhone: newBookingGuestPhone,
        totalPrice: newBookingPrice || grandTotal,
        status: newBookingStatus,
        type: newBookingType,
        guests: newBookingGuests,
        nightlyRate: newBookingNightlyRate,
        foodPlan: newBookingFoodPlan,
        foodRatePerPersonPerDay: newBookingFoodRate,
        foodGuestsCount: newBookingGuests,
        foodTotal,
        extraCharges: newBookingExtraCharges.map(e => ({ description: e.description, amount: e.amount })),
        discountFlat: newBookingDiscountFlat,
        discountPercent: newBookingDiscountPercent,
        discountTotal: discountVal,
        gstPercent: newBookingGstPercent,
        gstTotal,
        advancePaid: newBookingAdvancePaid,
        securityDeposit: newBookingSecurityDeposit,
        balanceDue,
      });

      if (result.success && result.booking) {
        const selectedVilla = villas.find(v => v.id === newBookingVillaId);
        
        const newBookingRecord: any = {
          id: result.booking.id,
          villaId: newBookingVillaId,
          checkIn: new Date(newBookingCheckIn),
          checkOut: new Date(newBookingCheckOut),
          totalPrice: newBookingPrice || grandTotal,
          status: newBookingStatus,
          userId: result.booking.userId,
          addOns: null,
          kycName: null,
          kycGuests: null,
          kycIdUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          villa: selectedVilla || { name: "Property", slug: "", price: newBookingNightlyRate, images: [] }
        };

        setBookings([newBookingRecord, ...bookings]);
        setShowAddBooking(false);

        // Reset fields
        setNewBookingVillaId("");
        setNewBookingCheckIn("");
        setNewBookingCheckOut("");
        setNewBookingGuestName("");
        setNewBookingGuestEmail("");
        setNewBookingGuestPhone("");
        setNewBookingPrice(0);
        setNewBookingNightlyRate(0);
        setNewBookingGuests(1);
        setNewBookingFoodPlan("none");
        setNewBookingFoodRate(0);
        setNewBookingExtraCharges([]);
        setNewBookingDiscountFlat(0);
        setNewBookingDiscountPercent(0);
        setNewBookingGstPercent(0);
        setNewBookingAdvancePaid(0);
        setNewBookingSecurityDeposit(0);
      } else {
        setBookingFormError(result.error || "Failed to save booking.");
      }
    } catch (err: any) {
      setBookingFormError(err.message || "Failed to connect to backend server.");
    } finally {
      setIsSavingBooking(false);
    }
  };

  // iCal Sync States
  const [channelConfigs, setChannelConfigs] = useState<Record<string, { airbnb?: string; booking?: string; vrbo?: string }>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; syncedCount?: number; errors?: string[] } | null>(null);

  // PMS Villa Editor Modal States
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editGuests, setEditGuests] = useState(0);
  const [editBaseGuests, setEditBaseGuests] = useState<number | undefined>(undefined);
  const [editExtraGuestFee, setEditExtraGuestFee] = useState<number | undefined>(undefined);
  const [editFridayPrice, setEditFridayPrice] = useState<number | null>(null);
  const [editSaturdayPrice, setEditSaturdayPrice] = useState<number | null>(null);
  const [editSundayPrice, setEditSundayPrice] = useState<number | null>(null);
  const [editBedrooms, setEditBedrooms] = useState(0);
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAirbnb, setEditAirbnb] = useState("");
  const [editBooking, setEditBooking] = useState("");
  const [editVrbo, setEditVrbo] = useState("");
  const [isSavingVilla, setIsSavingVilla] = useState(false);

  // Load Channel Configs & trigger auto-sync on load
  useEffect(() => {
    getChannelConfigs().then(configs => setChannelConfigs(configs));

    const hasSynced = sessionStorage.getItem("staywillas_auto_synced");
    if (!hasSynced) {
      sessionStorage.setItem("staywillas_auto_synced", "true");
      handleSyncAll(true);
    }
  }, []);



  // Sync Channels Controller
  const handleSyncAll = async (isAuto = false) => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const result = await syncExternalChannels();
      if (result.success) {
        setSyncStatus(result);
        if (!isAuto) {
          // If manually clicked, reload after a short delay to refresh all bookings on the calendar
          setTimeout(() => {
            window.location.reload();
          }, 2500);
        }
      } else {
        if (!isAuto) {
          alert(result.error || "Channel manager synchronization encountered errors.");
        }
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Launch PMS Editor Form
  const handleEditClick = (villa: Villa) => {
    setEditingVilla(villa);
    setEditName(villa.name);
    setEditLocation(villa.location);
    setEditPrice(villa.price);
    setEditGuests(villa.guests);
    setEditBaseGuests(villa.baseGuests);
    setEditExtraGuestFee(villa.extraGuestFee);
    setEditFridayPrice(villa.fridayPrice ?? null);
    setEditSaturdayPrice(villa.saturdayPrice ?? null);
    setEditSundayPrice(villa.sundayPrice ?? null);
    setEditBedrooms(villa.bedrooms);
    setEditCategory(villa.category || "Mountain View");
    setEditDescription(villa.description || "");

    const config = channelConfigs[villa.id] || {};
    setEditAirbnb(config.airbnb || "");
    setEditBooking(config.booking || "");
    setEditVrbo(config.vrbo || "");
  };

  // Save PMS Villa Settings
  const handleSaveVilla = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVilla) return;

    setIsSavingVilla(true);
    try {
      // 1. Save villa specifications
      const villaRes = await updateVillaDetails({
        id: editingVilla.id,
        name: editName,
        location: editLocation,
        price: editPrice,
        guests: editGuests,
        baseGuests: editBaseGuests,
        extraGuestFee: editExtraGuestFee,
        fridayPrice: editFridayPrice,
        saturdayPrice: editSaturdayPrice,
        sundayPrice: editSundayPrice,
        bedrooms: editBedrooms,
        category: editCategory,
        description: editDescription,
      });

      // 2. Save Channel Manager iCal URLs
      const channelRes = await updateChannelConfig(editingVilla.id, {
        airbnb: editAirbnb,
        booking: editBooking,
        vrbo: editVrbo,
      });

      if (villaRes.success && channelRes.success) {
        // Update local state reactive feedback
        setVillas(prev => prev.map(v => v.id === editingVilla.id ? {
          ...v,
          name: editName,
          location: editLocation,
          price: editPrice,
          guests: editGuests,
          baseGuests: editBaseGuests,
          extraGuestFee: editExtraGuestFee,
          fridayPrice: editFridayPrice,
          saturdayPrice: editSaturdayPrice,
          sundayPrice: editSundayPrice,
          bedrooms: editBedrooms,
          category: editCategory,
          description: editDescription,
        } : v));

        setChannelConfigs(prev => ({
          ...prev,
          [editingVilla.id]: {
            airbnb: editAirbnb,
            booking: editBooking,
            vrbo: editVrbo,
          }
        }));

        setEditingVilla(null);
      } else {
        alert("Failed to save changes. Please verify database connection.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    } finally {
      setIsSavingVilla(false);
    }
  };

  // Calculate metrics dynamically based on active state data
  const totalVillas = villas.length;
  const totalBookings = bookings.length;
  
  // Sum up totalPrice of CONFIRMED bookings for Revenue
  const totalRevenue = bookings
    .filter(b => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookings = bookings.filter(b => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED").length;
  const blockedDatesCount = bookings.filter(b => b.status === "BLOCKED").length;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-4xl font-cormorant font-bold tracking-wide italic">Admin Dashboard & Operations</h1>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border border-blue-500/20">
              SYSTEM LIVE
            </span>
            <button
              onClick={() => handleSyncAll(false)}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all cursor-pointer ${
                isSyncing
                  ? "bg-blue-800/50 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.55)] border-transparent"
              }`}
            >
              {isSyncing ? (
                <>
                  <Loader2 size={10} className="animate-spin" />
                  <span>SYNCING...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={10} />
                  <span>SYNC CHANNELS</span>
                </>
              )}
            </button>
          </div>
          <p className="text-slate-500 text-sm">
            Managing <span className="text-slate-800 font-bold">{userEmail}</span> • Real-time Supabase Cloud Node
          </p>
        </div>

        {/* Clerk User Button & Branding */}
        <div className="flex items-center gap-4 sm:gap-6 mt-6 md:mt-0 glass border border-slate-200 rounded-full px-5 py-2.5">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Logged In As</p>
            <p className="text-sm font-medium text-blue-400 font-cormorant font-bold italic">Stay Willas Admin</p>
          </div>

          <button
            type="button"
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            className="flex items-center gap-1.5 text-xs bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-amber-500 px-3.5 py-1.5 rounded-full font-bold transition-all duration-300 cursor-pointer shadow-sm"
          >
            <Calculator size={13} />
            <span>CALCULATOR</span>
          </button>

          <button
            onClick={async () => {
              if (confirm("Are you sure you want to sign out?")) {
                await logoutAction();
                window.location.href = "/admin";
              }
            }}
            className="text-[10px] bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 px-3 py-1.5 rounded-full tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer border-none"
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Metric 1 */}
        <div className="glass border border-slate-200 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Stays Collection</span>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
              <HomeIcon size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">{totalVillas}</h2>
          <p className="text-slate-500 text-xs">Active boutique properties listed</p>
        </div>

        {/* Metric 2 */}
        <div className="glass border border-slate-200 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Bookings</span>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
              <Calendar size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">{totalBookings}</h2>
          <p className="text-slate-500 text-xs">
            <span className="text-blue-400 font-bold">{pendingBookings} pending</span> verification
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass border border-slate-200 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Live Net Revenue</span>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
              <IndianRupee size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 text-slate-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-slate-500 text-xs">Processed from confirmed stays</p>
        </div>

        {/* Metric 4 */}
        <div className="glass border border-slate-200 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Confirmed Stays</span>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
              <CheckCircle size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 text-slate-900">{confirmedBookings}</h2>
          <p className="text-slate-500 text-xs">
            <span className="text-emerald-600 font-bold">{blockedDatesCount} blocked/maintenance</span> dates
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-slate-100 mb-8 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "overview" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "calendar" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          <Calendar size={14} />
          <span>Availability & Invoicing</span>
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "pricing" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          Daily Pricing Scheduler
        </button>
        <button
          onClick={() => setActiveTab("stays")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "stays" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          Properties ({totalVillas})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "bookings" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          Bookings Pipeline ({totalBookings})
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "calculator" 
              ? "border-[#1B3564] text-[#1B3564]" 
              : "border-transparent text-slate-400 hover:text-[#1B3564]"
          }`}
        >
          🧮 Invoice Calculator
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "calculator" && (
        <BillCalculator villas={villas as any} prefillData={calculatorPrefill} />
      )}

      {activeTab === "pricing" && (
        <DailyPricingCalendar 
          villas={villas} 
          onVillasChange={(updatedVillas) => setVillas(updatedVillas)}
        />
      )}

      {activeTab === "calendar" && (
        <AvailabilityCalendar 
          villas={villas as any} 
          bookings={bookings as any} 
          onBookingsChange={(newBookings) => setBookings(newBookings as any)}
        />
      )}

      {activeTab === "overview" && (
        <div className="space-y-12">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions & Channels */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass border border-slate-200 rounded-[32px] p-8">
                <h3 className="text-xl font-cormorant font-bold italic mb-8">Quick Operations</h3>
                <div className="space-y-4">
                  <a 
                    href="/villas"
                    target="_blank"
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all text-xs font-bold uppercase tracking-widest"
                  >
                    <span>Browse Villa Grid</span>
                    <ExternalLink size={14} />
                  </a>
                  <button 
                    onClick={() => setActiveTab("pricing")}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    <span>Everyday Pricing Calendar</span>
                    <TrendingUp size={14} />
                  </button>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Prisma Client Status</p>
                    <div className="flex items-center gap-2 text-blue-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                      <span>Database Synchronized (Supabase AP-SE-2)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Bookings */}
            <div className="glass border border-slate-200 rounded-[32px] p-8 lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-cormorant font-bold italic">Recent Reservations</h3>
                  <p className="text-[11px] text-slate-400">Click any reservation to view full bill statement & stay info</p>
                </div>
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className="text-blue-400 text-xs uppercase tracking-widest font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  View All <ExternalLink size={12} />
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No reservations logged yet.</div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div 
                      key={booking.id} 
                      onClick={() => setSelectedBookingDetails(booking)}
                      className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400/60 hover:bg-blue-50/40 hover:shadow-md transition-all cursor-pointer group"
                      title="Click to view reservation & bill details"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                          <Image 
                            src={booking.villa.images[0] || "/images/hero-villa.webp"} 
                            alt={booking.villa.name} 
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-cormorant font-bold text-sm text-[#1B3564] group-hover:text-blue-600 transition-colors">{booking.villa.name}</h4>
                            <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              <Eye size={10} /> View Bill
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 mb-1">
                          ₹{booking.totalPrice.toLocaleString("en-IN")}
                        </p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          booking.status === "CONFIRMED" 
                            ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" 
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="glass border border-slate-200 rounded-[32px] p-8">
              <h3 className="text-xl font-cormorant font-bold italic mb-8">Quick Operations</h3>
              <div className="space-y-4">
                <a 
                  href="/villas"
                  target="_blank"
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <span>Browse Villa Grid</span>
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => setActiveTab("pricing")}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  <span>Everyday Pricing Calendar</span>
                  <TrendingUp size={14} />
                </button>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Prisma Client Status</p>
                  <div className="flex items-center gap-2 text-blue-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                    <span>Database Synchronized (Supabase AP-SE-2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stays" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa) => (
            <div key={villa.id} className="glass border border-slate-200 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-48 bg-slate-50 border border-slate-100">
                <Image 
                  src={villa.images[0] || "/images/hero-villa.webp"} 
                  alt={villa.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900/60 backdrop-blur-md text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-slate-200">
                  {villa.category}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs uppercase tracking-wider mb-2">
                    <MapPin size={12} className="text-blue-400" />
                    <span>{villa.location}</span>
                  </div>
                  <h3 className="text-xl font-cormorant font-bold text-slate-900 italic group-hover:text-blue-600 transition-colors mb-4">{villa.name}</h3>
                  
                  <div className="flex items-center gap-6 text-xs text-slate-600 mb-6">
                    <div>
                      <span className="font-bold text-slate-900">{villa.bedrooms}</span> Bedrooms
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{villa.guests}</span> Max Guests
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Base Rate</span>
                    <span className="text-base font-bold text-blue-400">₹{villa.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">/night</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditClick(villa)}
                      className="px-3.5 py-2 rounded-full bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
                    >
                      PMS / Sync
                    </button>
                    <a 
                      href={`/villa/${villa.slug}`}
                      target="_blank"
                      className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-400 hover:border-blue-500/30 transition-colors shrink-0"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Main Registry Table */}
          <div className="flex-1 w-full glass border border-slate-200 rounded-[32px] p-8 overflow-hidden font-sans">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-cormorant font-bold italic">Active Reservation Registry</h3>
              <button
                onClick={() => {
                  setShowAddBooking(!showAddBooking);
                  setBookingFormError("");
                }}
                className="text-[10px] bg-[#1B3564] hover:bg-[#152A50] text-white font-black px-4 py-2.5 rounded-full tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md border-none"
              >
                <Plus size={12} />
                {showAddBooking ? "Hide Panel" : "Booked for Villa Stay"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="py-4">Property</th>
                    <th className="py-4">Dates</th>
                    <th className="py-4">User Details / Ident</th>
                    <th className="py-4">Net Price</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic text-sm">
                        No active stay reservations registered yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => {
                      let parsedDetails = booking.userId;
                      try {
                        if (booking.userId.startsWith("{")) {
                          const parsed = JSON.parse(booking.userId);
                          if (parsed.name) {
                            parsedDetails = `${parsed.name} (${parsed.email || "N/A"})`;
                            if (parsed.guests || parsed.nightlyRate) {
                              parsedDetails += ` | ${parsed.guests || 1} Guests @ ₹${(parsed.nightlyRate || 0).toLocaleString("en-IN")}/n`;
                            }
                          } else {
                            parsedDetails = `${parsed.type || "Manual"}: ${parsed.reason || "N/A"}`;
                          }
                        }
                      } catch (e) {}

                      return (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-5 font-cormorant font-bold italic text-[#1B3564] group-hover:text-slate-900 transition-colors">
                            {booking.villa.name}
                          </td>
                          <td className="py-5 text-slate-700">
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="py-5 font-mono text-xs text-slate-500 max-w-[200px] truncate" title={parsedDetails}>
                            {parsedDetails}
                          </td>
                          <td className="py-5 font-bold text-slate-900">₹{booking.totalPrice.toLocaleString("en-IN")}</td>
                          <td className="py-5">
                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                              booking.status === "CONFIRMED" 
                                ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" 
                                : booking.status === "BLOCKED"
                                  ? "bg-red-600/15 text-red-400 border border-red-500/20"
                                  : "bg-slate-50 text-slate-600 border border-slate-200"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedBookingDetails(booking)}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1 border border-blue-200 cursor-pointer uppercase tracking-wider"
                              >
                                <Eye size={11} />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBookingDetails(booking);
                                  setIsEditingFullBill(true);
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1 border-none cursor-pointer uppercase tracking-wider shadow-sm"
                              >
                                <Edit3 size={11} />
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to cancel and remove this reservation? This will instantly release these dates on the calendars.")) {
                                    const res = await deleteBooking(booking.id);
                                    if (res.success) {
                                      setBookings(bookings.filter(b => b.id !== booking.id));
                                    } else {
                                      alert(res.error || "Failed to remove stay block.");
                                    }
                                  }
                                }}
                                className="text-[9px] text-red-500/80 hover:text-red-600 hover:underline tracking-widest uppercase font-bold cursor-pointer transition-colors ml-1"
                              >
                                Cancel Stays
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Manual Booking Sidebar Panel */}
          {showAddBooking && (
            <div className="w-full xl:w-96 bg-white border border-slate-200 rounded-[32px] p-8 font-sans shrink-0 animate-fade-in relative shadow-xl text-left">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-cormorant font-bold italic text-slate-800">Record Stay Stays</h3>
                <button
                  type="button"
                  onClick={() => setShowAddBooking(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors uppercase font-bold tracking-widest cursor-pointer border-none bg-none"
                >
                  Close
                </button>
              </div>

              {bookingFormError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-500">
                  {bookingFormError}
                </div>
              )}

              <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                {/* Choice of Villa */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Property Selected *</label>
                  <select
                    value={newBookingVillaId}
                    onChange={(e) => setNewBookingVillaId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-slate-800"
                  >
                    <option value="">-- Select Property --</option>
                    {villas.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Picker Pair */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Check-in *</label>
                    <input
                      type="date"
                      value={newBookingCheckIn}
                      onChange={(e) => setNewBookingCheckIn(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Check-out *</label>
                    <input
                      type="date"
                      value={newBookingCheckOut}
                      onChange={(e) => setNewBookingCheckOut(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                {/* Type Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Reservation Type *</label>
                  <select
                    value={newBookingType}
                    onChange={(e) => setNewBookingType(e.target.value as any)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-slate-800"
                  >
                    <option value="GUEST">Verified Guest Stays</option>
                    <option value="OWNER_USE">Owner Occupancy block</option>
                    <option value="MAINTENANCE">Blackout Maintenance Block</option>
                  </select>
                </div>

                {/* Guest Profile Information */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    {newBookingType === "GUEST" ? "Guest Name *" : "Block Out Reason *"}
                  </label>
                  <input
                    type="text"
                    value={newBookingGuestName}
                    onChange={(e) => setNewBookingGuestName(e.target.value)}
                    required
                    placeholder={newBookingType === "GUEST" ? "e.g. Rahul Sharma" : "e.g. Routine Pool Maintenance"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-slate-800"
                  />
                </div>

                {newBookingType === "GUEST" && (
                  <div className="grid grid-cols-2 gap-3 animate-fade-in">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Email</label>
                      <input
                        type="email"
                        value={newBookingGuestEmail}
                        onChange={(e) => setNewBookingGuestEmail(e.target.value)}
                        placeholder="e.g. name@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Phone</label>
                      <input
                        type="tel"
                        value={newBookingGuestPhone}
                        onChange={(e) => setNewBookingGuestPhone(e.target.value)}
                        placeholder="e.g. +91 99..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                )}

                {newBookingType === "GUEST" && (
                  <div className="grid grid-cols-2 gap-3 animate-fade-in bg-slate-50 p-4.5 rounded-2xl border border-slate-200/50">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <span className="text-[9px] text-[#1B3564]/60 font-bold uppercase tracking-widest block border-b border-slate-200 pb-1 mb-1">STAY PARAMETERS</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Nightly Rate (₹) *</label>
                      <input
                        type="number"
                        value={newBookingNightlyRate || ""}
                        onChange={(e) => setNewBookingNightlyRate(parseInt(e.target.value) || 0)}
                        required
                        placeholder="e.g. 15000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Guests count *</label>
                      <input
                        type="number"
                        value={newBookingGuests || ""}
                        onChange={(e) => setNewBookingGuests(parseInt(e.target.value) || 1)}
                        required
                        min="1"
                        placeholder="e.g. 4"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                )}

                {newBookingType === "GUEST" && (
                  <>
                    {/* Food & Meals Package Section */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                      <span className="text-[9px] text-[#1B3564]/60 font-bold uppercase tracking-widest block border-b border-slate-200 pb-1">
                        FOOD & DINING PACKAGE
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Food Plan</label>
                          <select
                            value={newBookingFoodPlan}
                            onChange={(e) => handleFoodPlanChange(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          >
                            <option value="none">None (Self Cook / Outside)</option>
                            <option value="standard">Standard (₹1,000/person/day)</option>
                            <option value="deluxe">Deluxe (₹1,500/person/day)</option>
                            <option value="custom">Custom Daily Rate</option>
                          </select>
                        </div>
                        {newBookingFoodPlan !== "none" && (
                          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rate/Person/Day (₹)</label>
                            <input
                              type="number"
                              value={newBookingFoodRate || ""}
                              onChange={(e) => setNewBookingFoodRate(parseInt(e.target.value) || 0)}
                              placeholder="e.g. 1500"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Extra Charges Section */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                      <span className="text-[9px] text-[#1B3564]/60 font-bold uppercase tracking-widest block border-b border-slate-200 pb-1">
                        EXTRA CHARGES & SERVICES
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Pool Heating / Chef"
                          value={newExtraDesc}
                          onChange={(e) => setNewExtraDesc(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                        />
                        <input
                          type="number"
                          placeholder="₹ Amount"
                          value={newExtraAmount}
                          onChange={(e) => setNewExtraAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newExtraDesc && newExtraAmount !== "") {
                              setNewBookingExtraCharges([
                                ...newBookingExtraCharges,
                                { id: Date.now().toString(), description: newExtraDesc, amount: Number(newExtraAmount) }
                              ]);
                              setNewExtraDesc("");
                              setNewExtraAmount("");
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 rounded-xl border-none cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>

                      {newBookingExtraCharges.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {newBookingExtraCharges.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-200">
                              <span className="text-slate-700">{item.description}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">₹{item.amount.toLocaleString("en-IN")}</span>
                                <button
                                  type="button"
                                  onClick={() => setNewBookingExtraCharges(newBookingExtraCharges.filter(x => x.id !== item.id))}
                                  className="text-red-500 hover:text-red-700 text-xs cursor-pointer border-none bg-none font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Discounts, Taxes & Payments */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                      <span className="text-[9px] text-[#1B3564]/60 font-bold uppercase tracking-widest block border-b border-slate-200 pb-1">
                        DISCOUNTS, GST & PAYMENTS
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Discount (Flat ₹)</label>
                          <input
                            type="number"
                            value={newBookingDiscountFlat || ""}
                            onChange={(e) => setNewBookingDiscountFlat(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 2000"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Discount (%)</label>
                          <input
                            type="number"
                            value={newBookingDiscountPercent || ""}
                            onChange={(e) => setNewBookingDiscountPercent(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 10"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">GST Tax (%)</label>
                          <input
                            type="number"
                            value={newBookingGstPercent || ""}
                            onChange={(e) => setNewBookingGstPercent(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 18"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Security Deposit (₹)</label>
                          <input
                            type="number"
                            value={newBookingSecurityDeposit || ""}
                            onChange={(e) => setNewBookingSecurityDeposit(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 5000"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Advance Paid Received (₹)</label>
                          <input
                            type="number"
                            value={newBookingAdvancePaid || ""}
                            onChange={(e) => setNewBookingAdvancePaid(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 15000"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Net Price & Booking Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Bill Payable (INR) *</label>
                    <input
                      type="number"
                      value={newBookingPrice || ""}
                      onChange={(e) => setNewBookingPrice(parseInt(e.target.value) || 0)}
                      required
                      placeholder="e.g. 45000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tariff Status *</label>
                    <select
                      value={newBookingStatus}
                      onChange={(e) => setNewBookingStatus(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-slate-800"
                    >
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="PENDING">Pending Hold</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingBooking}
                  className="w-full bg-[#1B3564] hover:bg-[#152A50] text-white font-black text-xs tracking-widest uppercase rounded-full py-4.5 mt-2 transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
                >
                  {isSavingBooking ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>SAVING BLOCK OUT...</span>
                    </>
                  ) : (
                    <span>CONFIRM & RECORD BLOCK</span>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* 1. PMS Property Editor & Channel Sync Modal */}
      {editingVilla && (
        <div 
          data-lenis-prevent="true"
          style={{ overscrollBehavior: "contain" }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in font-sans"
        >
          <form 
            onSubmit={handleSaveVilla}
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
            className="glass border border-slate-200 rounded-[32px] p-8 max-w-2xl w-full my-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div>
              <h4 className="text-2xl font-cormorant font-bold italic text-blue-400">Property Management Console</h4>
              <p className="text-slate-500 text-xs mt-1">Specify sanctuary base pricing, parameters, and sync calendars.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Properties Parameters */}
              <div className="space-y-4">
                <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5"><Settings size={12} className="text-blue-400" /> Parameters</h5>
                
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Property Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Location</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Base Rate (/Night)</label>
                    <input 
                      type="number" 
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Category</label>
                    <input 
                      type="text" 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Max Guests</label>
                    <input 
                      type="number" 
                      value={editGuests}
                      onChange={(e) => setEditGuests(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Bedrooms</label>
                    <input 
                      type="number" 
                      value={editBedrooms}
                      onChange={(e) => setEditBedrooms(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Base Guests (Included)</label>
                    <input 
                      type="number" 
                      value={editBaseGuests || ""}
                      onChange={(e) => setEditBaseGuests(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 12"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Extra Guest Fee / Night</label>
                    <input 
                      type="number" 
                      value={editExtraGuestFee || ""}
                      onChange={(e) => setEditExtraGuestFee(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1200"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Friday ₹</label>
                    <input 
                      type="number" 
                      value={editFridayPrice || ""}
                      onChange={(e) => setEditFridayPrice(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Auto"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Saturday ₹</label>
                    <input 
                      type="number" 
                      value={editSaturdayPrice || ""}
                      onChange={(e) => setEditSaturdayPrice(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Auto"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Sunday ₹</label>
                    <input 
                      type="number" 
                      value={editSundayPrice || ""}
                      onChange={(e) => setEditSundayPrice(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Auto"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Channel Manager (iCal Sync) */}
              <div className="space-y-4">
                <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5"><RefreshCw size={12} className="text-emerald-400" /> Channel Manager</h5>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Export Feed URL (ics)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly
                      value={typeof window !== "undefined" ? `${window.location.origin}/api/ical/${editingVilla.slug}` : `/api/ical/${editingVilla.slug}`}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-xs outline-none cursor-default font-mono truncate"
                      id="ical-export-link"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const linkInput = document.getElementById("ical-export-link") as HTMLInputElement;
                        if (linkInput) {
                          navigator.clipboard.writeText(linkInput.value);
                          alert("Export feed URL copied successfully!");
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title="Copy URL to Clipboard"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <span className="text-[8px] text-slate-400 block mt-1">Paste this link into Airbnb/Booking.com settings to export dates.</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Airbnb Import URL</label>
                  <input 
                    type="url" 
                    value={editAirbnb}
                    onChange={(e) => setEditAirbnb(e.target.value)}
                    placeholder="https://www.airbnb.com/calendar/ical/..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Booking.com Import URL</label>
                  <input 
                    type="url" 
                    value={editBooking}
                    onChange={(e) => setEditBooking(e.target.value)}
                    placeholder="https://ical.booking.com/v1/..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Vrbo Import URL</label>
                  <input 
                    type="url" 
                    value={editVrbo}
                    onChange={(e) => setEditVrbo(e.target.value)}
                    placeholder="https://www.vrbo.com/icalendar/..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Property Description</label>
              <textarea 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 text-xs focus:border-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={isSavingVilla}
                className="flex-grow bg-[#1B3564] text-white hover:bg-[#3B82F6] py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isSavingVilla ? <Loader2 size={14} className="animate-spin" /> : "Save Sanctuary Specs"}
              </button>
              <button 
                type="button"
                onClick={() => setEditingVilla(null)}
                className="px-8 bg-slate-50 border border-slate-200 text-slate-600 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Synced Channels Toast / Alert */}
      {syncStatus && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 shadow-2xl backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle size={20} />
            </div>
            <div className="flex-grow">
              <h5 className="font-cormorant font-bold text-emerald-400 text-sm font-semibold">Synchronization Successful</h5>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Synced <span className="text-emerald-700 font-bold">{syncStatus.syncedCount}</span> external events. Main scheduler updated.
              </p>
              {syncStatus.errors && syncStatus.errors.length > 0 && (
                <div className="mt-3 p-2 bg-red-500/5 border border-red-500/10 rounded-lg max-h-24 overflow-y-auto space-y-1">
                  <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider block">Sync Warnings:</span>
                  {syncStatus.errors.map((err: string, idx: number) => (
                    <span key={idx} className="text-[8px] text-slate-500 block leading-tight">• {err}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Refreshing UI Node...</span>
              </div>
            </div>
            <button 
              onClick={() => setSyncStatus(null)}
              className="text-slate-500 hover:text-white text-xs cursor-pointer font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Reservation & Bill Details Modal */}
      {selectedBookingDetails && (() => {
        const b = selectedBookingDetails;
        let parsedName = "Guest Traveler";
        let parsedEmail = "N/A";
        let parsedPhone = "N/A";
        let parsedGuests = 1;
        let parsedNightlyRate = 0;
        let parsedType = "GUEST";
        let parsedReason = "";

        let parsedFoodPlan = "none";
        let parsedFoodRate = 0;
        let parsedFoodTotal = 0;
        let parsedExtraCharges: Array<{ description: string; amount: number }> = [];
        let parsedDiscountTotal = 0;
        let parsedGstPercent = 0;
        let parsedGstTotal = 0;
        let parsedAdvancePaid = 0;
        let parsedSecurityDeposit = 0;
        let parsedBalanceDue = 0;

        try {
          if (b.userId && b.userId.startsWith("{")) {
            const parsed = JSON.parse(b.userId);
            if (parsed.name) parsedName = parsed.name;
            if (parsed.email) parsedEmail = parsed.email;
            if (parsed.phone) parsedPhone = parsed.phone;
            if (parsed.guests) parsedGuests = parsed.guests;
            if (parsed.nightlyRate) parsedNightlyRate = parsed.nightlyRate;
            if (parsed.type) parsedType = parsed.type;
            if (parsed.reason) parsedReason = parsed.reason;

            if (parsed.food) {
              parsedFoodPlan = parsed.food.plan || "none";
              parsedFoodRate = parsed.food.ratePerPersonPerDay || 0;
              parsedFoodTotal = parsed.food.total || 0;
            }
            if (Array.isArray(parsed.extraCharges)) {
              parsedExtraCharges = parsed.extraCharges;
            }
            if (parsed.discount) {
              parsedDiscountTotal = parsed.discount.total || 0;
            }
            if (parsed.gst) {
              parsedGstPercent = parsed.gst.percent || 0;
              parsedGstTotal = parsed.gst.total || 0;
            }
            if (parsed.advancePaid) parsedAdvancePaid = parsed.advancePaid;
            if (parsed.securityDeposit) parsedSecurityDeposit = parsed.securityDeposit;
            if (parsed.balanceDue) parsedBalanceDue = parsed.balanceDue;
          } else {
            parsedName = b.userId || "Guest Traveler";
          }
        } catch (e) {}

        const cin = new Date(b.checkIn);
        const cout = new Date(b.checkOut);
        const nights = Math.max(1, Math.round((cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24)));
        const computedNightly = parsedNightlyRate || (b.villa?.price) || (b.totalPrice / nights);
        const baseStayTotal = computedNightly * nights;

        let addOnsList: any[] = [];
        if (Array.isArray(b.addOns)) {
          addOnsList = b.addOns;
        }

        const calculatedBalance = parsedBalanceDue > 0 ? parsedBalanceDue : Math.max(0, b.totalPrice - parsedAdvancePaid);

        return (
          <div 
            data-lenis-prevent="true"
            style={{ overscrollBehavior: "contain" }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          >
            <div 
              data-lenis-prevent="true"
              style={{ overscrollBehavior: "contain" }}
              className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              
              {/* Header */}
              <div className="bg-[#1B3564] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between flex-shrink-0 border-b border-white/10">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 flex-shrink-0">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-cormorant font-bold text-lg sm:text-xl tracking-wide truncate">Reservation & Bill Details</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : b.status === "BLOCKED"
                          ? "bg-red-500/20 text-red-300 border border-red-400/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">Ref ID: {b.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingFullBill) {
                        setEditBillNightlyRate(computedNightly);
                        setEditBillFoodPlan(parsedFoodPlan);
                        setEditBillFoodRate(parsedFoodRate);
                        setEditBillExtraCharges(parsedExtraCharges.map((x, idx) => ({ id: idx.toString(), description: x.description, amount: x.amount })));
                        setEditBillDiscountFlat(parsedDiscountTotal);
                        setEditBillDiscountPercent(0);
                        setEditBillGstPercent(parsedGstPercent);
                        setEditBillSecurityDeposit(parsedSecurityDeposit);
                        setEditBillAdvancePaid(parsedAdvancePaid);
                        setEditBillBalanceDue(parsedBalanceDue || calculatedBalance);
                      }
                      setIsEditingFullBill(!isEditingFullBill);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer border-none transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Edit3 size={13} />
                    {isEditingFullBill ? "Close Editor" : "Edit Bill & Info"}
                  </button>
                  <button 
                    onClick={() => setSelectedBookingDetails(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-slate-200 border-none"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div 
                data-lenis-prevent="true"
                style={{ overscrollBehavior: "contain" }}
                className="p-3.5 sm:p-4 space-y-3 flex-1 overflow-y-auto text-slate-800 font-sans"
              >

                {/* Inline Full Bill Editor Box */}
                {isEditingFullBill ? (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-300 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                      <div>
                        <h4 className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                          <Edit3 size={15} className="text-amber-600" />
                          Edit Reservation Tariff & Financial Charges
                        </h4>
                        <p className="text-[10px] text-amber-700">Modify nightly rates, meal plans, extra charges, discounts, taxes, advance paid, or net balance due.</p>
                      </div>
                      <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase">Editing Mode</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Nightly Villa Rate (₹)</label>
                        <input
                          type="number"
                          value={editBillNightlyRate}
                          onChange={(e) => setEditBillNightlyRate(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Food / Dining Package</label>
                        <select
                          value={editBillFoodPlan}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditBillFoodPlan(val);
                            if (val === "standard") setEditBillFoodRate(1000);
                            else if (val === "deluxe") setEditBillFoodRate(1500);
                            else if (val === "none") setEditBillFoodRate(0);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        >
                          <option value="none">No Food Package (₹0)</option>
                          <option value="standard">Standard Catering (₹1,000 / person / day)</option>
                          <option value="deluxe">Deluxe Gourmet (₹1,500 / person / day)</option>
                          <option value="custom">Custom Food Rate</option>
                        </select>
                      </div>

                      {editBillFoodPlan !== "none" && (
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Food Rate / Person / Day (₹)</label>
                          <input
                            type="number"
                            value={editBillFoodRate}
                            onChange={(e) => setEditBillFoodRate(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Flat Discount (₹)</label>
                        <input
                          type="number"
                          value={editBillDiscountFlat}
                          onChange={(e) => setEditBillDiscountFlat(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">GST Tax (%)</label>
                        <input
                          type="number"
                          value={editBillGstPercent}
                          onChange={(e) => setEditBillGstPercent(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Refundable Security Deposit (₹)</label>
                        <input
                          type="number"
                          value={editBillSecurityDeposit}
                          onChange={(e) => setEditBillSecurityDeposit(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Advance Paid Received (₹)</label>
                        <input
                          type="number"
                          value={editBillAdvancePaid}
                          onChange={(e) => setEditBillAdvancePaid(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-amber-800 block mb-1">Override Net Balance Due (₹)</label>
                        <input
                          type="number"
                          value={editBillBalanceDue}
                          onChange={(e) => setEditBillBalanceDue(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g. 15000"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-900 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Extra Itemized Charges Editor */}
                    <div className="space-y-2 pt-2 border-t border-amber-200">
                      <label className="text-[10px] uppercase font-bold text-slate-700 block">Itemized Extra Services & Food Bills</label>
                      {editBillExtraCharges.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
                          <span className="flex-1 font-semibold text-slate-800">{item.description}</span>
                          <span className="font-bold text-slate-900">₹{item.amount.toLocaleString("en-IN")}</span>
                          <button
                            type="button"
                            onClick={() => setEditBillExtraCharges(editBillExtraCharges.filter(x => x.id !== item.id))}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer border-none bg-none"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Additional Food Bill / Pool Heating"
                          value={editBillNewExtraDesc}
                          onChange={(e) => setEditBillNewExtraDesc(e.target.value)}
                          className="flex-grow bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Amount ₹"
                          value={editBillNewExtraAmount}
                          onChange={(e) => setEditBillNewExtraAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-24 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!editBillNewExtraDesc || !editBillNewExtraAmount) return;
                            setEditBillExtraCharges([
                              ...editBillExtraCharges,
                              { id: Date.now().toString(), description: editBillNewExtraDesc, amount: Number(editBillNewExtraAmount) }
                            ]);
                            setEditBillNewExtraDesc("");
                            setEditBillNewExtraAmount("");
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer border-none"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2.5 border-t border-amber-200">
                      <button
                        type="button"
                        disabled={isSavingFullBill}
                        onClick={async () => {
                          setIsSavingFullBill(true);
                          const baseGuestsLimit = b.villa?.baseGuests ?? 12;
                          const extraFeePerGuest = b.villa?.extraGuestFee ?? 1500;
                          const extraGuestsCount = Math.max(0, parsedGuests - baseGuestsLimit);
                          const extraGuestsCost = extraGuestsCount * extraFeePerGuest * nights;
                          const stayTotal = (nights * editBillNightlyRate) + extraGuestsCost;
                          const foodTotal = editBillFoodPlan !== "none" ? (editBillFoodRate * parsedGuests * nights) : 0;
                          const extrasTotal = editBillExtraCharges.reduce((a, b) => a + (b.amount || 0), 0);
                          const subtotal = stayTotal + foodTotal + extrasTotal;
                          const discountVal = Math.round(editBillDiscountFlat + (subtotal * (editBillDiscountPercent / 100)));
                          const taxable = Math.max(0, subtotal - discountVal);
                          const gstTotal = Math.round(taxable * (editBillGstPercent / 100));
                          const grandTotal = Math.round(taxable + gstTotal + editBillSecurityDeposit);
                          const balanceDue = editBillBalanceDue !== "" ? Number(editBillBalanceDue) : Math.max(0, grandTotal - editBillAdvancePaid);

                          const res = await updateBookingFullDetails({
                            bookingId: b.id,
                            guests: parsedGuests,
                            nightlyRate: editBillNightlyRate,
                            foodPlan: editBillFoodPlan,
                            foodRatePerPersonPerDay: editBillFoodRate,
                            foodTotal,
                            extraCharges: editBillExtraCharges.map(x => ({ description: x.description, amount: x.amount })),
                            discountFlat: editBillDiscountFlat,
                            discountPercent: editBillDiscountPercent,
                            discountTotal: discountVal,
                            gstPercent: editBillGstPercent,
                            gstTotal,
                            totalPrice: grandTotal,
                            advancePaid: editBillAdvancePaid,
                            securityDeposit: editBillSecurityDeposit,
                            balanceDue,
                          });

                          setIsSavingFullBill(false);
                          if (res.success && res.booking) {
                            setIsEditingFullBill(false);
                            setSelectedBookingDetails(res.booking as any);
                            setBookings(bookings.map(x => x.id === b.id ? (res.booking as any) : x));
                          } else {
                            alert(res.error || "Failed to update reservation details.");
                          }
                        }}
                        className="flex-1 bg-[#1B3564] hover:bg-[#2A4985] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border-none shadow-md flex items-center justify-center gap-2"
                      >
                        {isSavingFullBill ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Reservation & Bill Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingFullBill(false)}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs cursor-pointer border-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                
                {/* Villa Banner & Dates Header Combined */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 items-center">
                  <div className="sm:col-span-5 flex items-center gap-3">
                    <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-200 flex-shrink-0">
                      <Image 
                        src={b.villa?.images?.[0] || "/images/hero-villa.webp"} 
                        alt={b.villa?.name || "Villa"} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-cormorant font-bold text-base text-[#1B3564] truncate leading-tight">{b.villa?.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {b.villa?.location || "Luxury Estate"} • {b.villa?.bedrooms || 4} BHK
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Base: <span className="font-bold text-slate-900">₹{(b.villa?.price || computedNightly).toLocaleString("en-IN")}</span>/night
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-7 grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <p className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">Check-In</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {cin.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <p className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">Check-Out</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                        {cout.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/60">
                      <p className="text-[9px] uppercase font-bold text-amber-700 tracking-wider">Duration</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{nights} {nights === 1 ? "Night" : "Nights"}</p>
                    </div>
                  </div>
                </div>

                {/* Guest Details Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User size={13} className="text-[#1B3564]" />
                    Guest / Booker Information
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Primary Guest</span>
                      <span className="font-semibold text-slate-900 truncate block">{parsedName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email Address</span>
                      <span className="font-semibold text-slate-900 truncate block">{parsedEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone Number</span>
                      <span className="font-semibold text-slate-900 truncate block">{parsedPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Guests & Type</span>
                      <span className="font-semibold text-slate-900 truncate block">{parsedGuests} Guests ({parsedType})</span>
                    </div>
                  </div>
                  {parsedReason && (
                    <div className="pt-1.5 border-t border-slate-200 text-xs text-slate-600 truncate">
                      <span className="font-bold text-slate-700">Note: </span>{parsedReason}
                    </div>
                  )}
                </div>

                {/* Itemized Bill / Financial Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <IndianRupee size={13} />
                      Itemized Financial Bill Statement
                    </h5>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">Invoice Breakdown</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span>Stay Nightly Charge (₹{computedNightly.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"})</span>
                      <span className="font-semibold text-white">₹{baseStayTotal.toLocaleString("en-IN")}</span>
                    </div>

                    {parsedFoodPlan !== "none" && (
                      <div className="flex justify-between items-center text-xs">
                        <span>Food Package ({parsedFoodPlan.toUpperCase()}: ₹{parsedFoodRate.toLocaleString("en-IN")}/person/day × {parsedGuests} guests × {nights} days)</span>
                        <span className="font-semibold text-emerald-300">₹{(parsedFoodTotal || (parsedFoodRate * parsedGuests * nights)).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {parsedExtraCharges.length > 0 && parsedExtraCharges.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span>Extra Charge: {item.description}</span>
                        <span className="font-semibold text-slate-200">₹{item.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}

                    {addOnsList.length > 0 && addOnsList.map((addon, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-400">
                        <span>Add-on Package: {addon.name || addon.title || "Extra Service"}</span>
                        <span className="text-slate-200 font-medium">₹{(addon.price || 0).toLocaleString("en-IN")}</span>
                      </div>
                    ))}

                    {parsedDiscountTotal > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 font-semibold text-xs pt-1 border-t border-slate-800/60">
                        <span>Special Discount Deduction</span>
                        <span>- ₹{parsedDiscountTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {parsedGstPercent > 0 && (
                      <div className="flex justify-between items-center text-slate-300 text-xs">
                        <span>GST Tax ({parsedGstPercent}%)</span>
                        <span className="font-semibold text-slate-200">₹{parsedGstTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {parsedSecurityDeposit > 0 && (
                      <div className="flex justify-between items-center text-amber-300 text-xs">
                        <span>Refundable Security Deposit</span>
                        <span className="font-semibold">₹{parsedSecurityDeposit.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Totals & Payments */}
                  <div className="border-t border-slate-800 pt-2 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60">
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Total Bill Payable</p>
                        <p className="text-xl font-bold font-cormorant text-amber-400 mt-0.5">₹{b.totalPrice.toLocaleString("en-IN")}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase text-slate-400 font-bold">Advance Received</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingPayment(!isEditingPayment);
                              setPaymentAdvanceInput(parsedAdvancePaid);
                            }}
                            className="text-[9px] text-amber-400 hover:underline font-bold cursor-pointer border-none bg-none flex items-center gap-0.5"
                          >
                            <CreditCard size={10} />
                            {isEditingPayment ? "Cancel" : "Update"}
                          </button>
                        </div>
                        <span className="font-bold text-emerald-400 text-base mt-0.5">₹{parsedAdvancePaid.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 text-right flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingBalance(!isEditingBalance);
                              setBalanceInput(calculatedBalance);
                            }}
                            className="text-[9px] text-amber-400 hover:underline font-bold cursor-pointer border-none bg-none flex items-center gap-0.5"
                          >
                            <Edit3 size={10} />
                            {isEditingBalance ? "Cancel" : "Update"}
                          </button>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Net Balance Due</span>
                        </div>
                        <span className="font-bold text-amber-400 text-base mt-0.5">₹{calculatedBalance.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Inline Payment Editor */}
                    {isEditingPayment && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Update Amount Paid by Customer</span>
                          <span className="text-[9px] text-slate-400">Total: ₹{b.totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={paymentAdvanceInput}
                              onChange={(e) => setPaymentAdvanceInput(e.target.value === "" ? "" : Number(e.target.value))}
                              placeholder="e.g. 20000"
                              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-6 pr-2 py-1.5 text-xs font-bold outline-none focus:border-amber-400"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setPaymentAdvanceInput(b.totalPrice)}
                            className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold border border-slate-700 cursor-pointer whitespace-nowrap"
                          >
                            Full Paid
                          </button>
                          <button
                            type="button"
                            disabled={isSavingPayment}
                            onClick={async () => {
                              setIsSavingPayment(true);
                              const val = Number(paymentAdvanceInput) || 0;
                              const res = await updateBookingPayment(b.id, val);
                              setIsSavingPayment(false);
                              if (res.success && res.booking) {
                                setIsEditingPayment(false);
                                setSelectedBookingDetails(res.booking as any);
                                setBookings(bookings.map(x => x.id === b.id ? (res.booking as any) : x));
                              } else {
                                alert(res.error || "Failed to update payment record.");
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer border-none shadow-md flex items-center gap-1"
                          >
                            {isSavingPayment ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Net Balance Editor */}
                    {isEditingBalance && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Override Net Balance Due Amount</span>
                          <span className="text-[9px] text-slate-400">Total: ₹{b.totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={balanceInput}
                              onChange={(e) => setBalanceInput(e.target.value === "" ? "" : Number(e.target.value))}
                              placeholder="e.g. 15000"
                              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-6 pr-2 py-1.5 text-xs font-bold outline-none focus:border-amber-400"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={isSavingBalance}
                            onClick={async () => {
                              setIsSavingBalance(true);
                              const val = Number(balanceInput) || 0;
                              const res = await updateBookingFullDetails({
                                bookingId: b.id,
                                totalPrice: b.totalPrice,
                                advancePaid: parsedAdvancePaid,
                                balanceDue: val,
                              });
                              setIsSavingBalance(false);
                              if (res.success && res.booking) {
                                setIsEditingBalance(false);
                                setSelectedBookingDetails(res.booking as any);
                                setBookings(bookings.map(x => x.id === b.id ? (res.booking as any) : x));
                              } else {
                                alert(res.error || "Failed to update net balance.");
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer border-none shadow-md flex items-center gap-1"
                          >
                            {isSavingBalance ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* KYC Information if available */}
                {(b.kycName || b.kycIdUrl) && (
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1 text-xs">
                    <h5 className="font-bold text-amber-800 uppercase tracking-wider text-[9px]">Verified KYC Identification</h5>
                    {b.kycName && <p className="text-slate-800"><strong>Registered KYC Name:</strong> {b.kycName}</p>}
                    {b.kycIdUrl && (
                      <a 
                        href={b.kycIdUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1 text-xs"
                      >
                        <ExternalLink size={12} /> View Uploaded Identity Document
                      </a>
                    )}
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0 font-sans">
                <button
                  onClick={() => handleOpenInCalculator(b)}
                  className="px-3.5 py-2 rounded-xl bg-[#1B3564] hover:bg-[#152A50] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <FileText size={14} className="text-amber-400" />
                  Open in Invoice Calculator & Export
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingFullBill) {
                        setEditBillNightlyRate(computedNightly);
                        setEditBillFoodPlan(parsedFoodPlan);
                        setEditBillFoodRate(parsedFoodRate);
                        setEditBillExtraCharges(parsedExtraCharges.map((x, idx) => ({ id: idx.toString(), description: x.description, amount: x.amount })));
                        setEditBillDiscountFlat(parsedDiscountTotal);
                        setEditBillDiscountPercent(0);
                        setEditBillGstPercent(parsedGstPercent);
                        setEditBillSecurityDeposit(parsedSecurityDeposit);
                        setEditBillAdvancePaid(parsedAdvancePaid);
                      }
                      setIsEditingFullBill(!isEditingFullBill);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-sm"
                  >
                    <Edit3 size={14} />
                    {isEditingFullBill ? "Close Editor" : "Edit Bill & Tariff"}
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm("Are you sure you want to cancel and remove this reservation? This will release dates on calendars immediately.")) {
                        const res = await deleteBooking(b.id);
                        if (res.success) {
                          setBookings(bookings.filter(x => x.id !== b.id));
                          setSelectedBookingDetails(null);
                        } else {
                          alert(res.error || "Failed to remove reservation.");
                        }
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border border-red-200"
                  >
                    <Trash2 size={14} />
                    Cancel Stays
                  </button>

                  <button
                    onClick={() => setSelectedBookingDetails(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border-none"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Quick Calculator Widget */}
      {isCalculatorOpen && (
        <div className="fixed top-20 right-6 z-50 w-72 bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl p-4 text-white animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Calculator size={14} /> Quick Calculator
            </span>
            <button 
              onClick={() => setIsCalculatorOpen(false)}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border-none cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Display */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-right mb-3">
            <p className="text-[10px] text-slate-400 font-mono min-h-[14px] truncate">{calcHistory}</p>
            <p className="text-2xl font-bold font-mono text-amber-400 truncate mt-0.5">{calcDisplay}</p>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
            {["C", "CE", "⌫", "/"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`p-2.5 rounded-xl font-bold border-none cursor-pointer transition-colors ${
                  btn === "C" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-slate-800 text-amber-300 hover:bg-slate-700"
                }`}
              >
                {btn}
              </button>
            ))}

            {["7", "8", "9", "*"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`p-2.5 rounded-xl font-bold border-none cursor-pointer transition-colors ${
                  ["*"].includes(btn) ? "bg-slate-800 text-amber-300 hover:bg-slate-700" : "bg-slate-800/60 text-white hover:bg-slate-700"
                }`}
              >
                {btn}
              </button>
            ))}

            {["4", "5", "6", "-"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`p-2.5 rounded-xl font-bold border-none cursor-pointer transition-colors ${
                  ["-"].includes(btn) ? "bg-slate-800 text-amber-300 hover:bg-slate-700" : "bg-slate-800/60 text-white hover:bg-slate-700"
                }`}
              >
                {btn}
              </button>
            ))}

            {["1", "2", "3", "+"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`p-2.5 rounded-xl font-bold border-none cursor-pointer transition-colors ${
                  ["+"].includes(btn) ? "bg-slate-800 text-amber-300 hover:bg-slate-700" : "bg-slate-800/60 text-white hover:bg-slate-700"
                }`}
              >
                {btn}
              </button>
            ))}

            {["0", ".", "%", "="].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                className={`p-2.5 rounded-xl font-bold border-none cursor-pointer transition-colors ${
                  btn === "=" ? "bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold" : "bg-slate-800/60 text-white hover:bg-slate-700"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
