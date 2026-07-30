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
  AlertTriangle
} from "lucide-react";
import { createManualBooking, deleteBooking } from "@/app/actions/admin";

interface Villa {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  category: string;
  bedrooms: number;
  guests: number;
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
}

interface AvailabilityCalendarProps {
  villas: Villa[];
  bookings: Booking[];
  onBookingsChange: (newBookings: Booking[]) => void;
}

export default function AvailabilityCalendar({ villas, bookings, onBookingsChange }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Modal Overlays state
  const [selectedCell, setSelectedCell] = useState<{ villaId: string; date: Date } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalView, setModalView] = useState<"OPTIONS" | "MANUAL_BOOKING" | "MAINTENANCE" | "OWNER_USE">("OPTIONS");

  // Form Fields states
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [totalPriceOverride, setTotalPriceOverride] = useState<number | "">("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState("CONFIRMED");
  const [checkInStr, setCheckInStr] = useState("");
  const [checkOutStr, setCheckOutStr] = useState("");

  const [nightlyRate, setNightlyRate] = useState(0);
  const [numGuests, setNumGuests] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Recalculate price override automatically when dates or nightly rate changes
  React.useEffect(() => {
    if (checkInStr && checkOutStr) {
      const inDate = new Date(checkInStr);
      const outDate = new Date(checkOutStr);
      const nights = Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
      setTotalPriceOverride(nights * nightlyRate);
    }
  }, [checkInStr, checkOutStr, nightlyRate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get number of days in the current selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate list of days
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format month name
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  // Get status of a specific day for a specific villa from the real DB bookings prop
  const getDayStatus = (villaId: string, date: Date) => {
    // Check if booked or blocked
    const booking = bookings.find(b => {
      if (b.villaId !== villaId) return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      
      // Normalize to midnight for accurate day comparison
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // A booking covers checkIn day up to (but not including) checkOut day.
      // This is standard hotel room rack behavior.
      return check >= start && check < end;
    });

    if (booking) {
      return { status: booking.status, data: booking };
    }

    return { status: "AVAILABLE", data: null };
  };

  const handleCellClick = (villaId: string, date: Date, statusInfo: { status: string; data: any }) => {
    if (statusInfo.status === "CONFIRMED" || statusInfo.status === "PENDING" || statusInfo.status === "BLOCKED") {
      setSelectedBooking(statusInfo.data);
      setSelectedCell(null);
    } else {
      setSelectedCell({ villaId, date });
      setSelectedBooking(null);
      setModalView("OPTIONS");
      
      // Reset form states
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setTotalPriceOverride("");
      setBookingNotes("");
      setBookingStatus("CONFIRMED");

      const selectedVilla = villas.find(v => v.id === villaId);
      setNightlyRate(selectedVilla ? selectedVilla.price : 0);
      setNumGuests(selectedVilla ? selectedVilla.guests : 1);

      // Set default dates strings (YYYY-MM-DD)
      const inDate = new Date(date);
      const outDate = new Date(date);
      outDate.setDate(outDate.getDate() + 1);

      setCheckInStr(inDate.toISOString().split("T")[0]);
      setCheckOutStr(outDate.toISOString().split("T")[0]);
    }
  };

  // Handle saving manual bookings or date blackouts
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCell) return;

    setIsSubmitting(true);
    try {
      const selectedVilla = villas.find(v => v.id === selectedCell.villaId);
      const inDate = new Date(checkInStr);
      const outDate = new Date(checkOutStr);
      
      const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
      const basePrice = selectedVilla ? selectedVilla.price : 10000;
      
      let finalPrice = basePrice * nights;
      if (modalView === "MANUAL_BOOKING" && totalPriceOverride !== "") {
        finalPrice = Number(totalPriceOverride);
      } else if (modalView === "MAINTENANCE" || modalView === "OWNER_USE") {
        finalPrice = 0; // Blackout blocks have zero financial transaction values
      }

      let type: "GUEST" | "MAINTENANCE" | "OWNER_USE" = "GUEST";
      let status = bookingStatus;
      let name = guestName;

      if (modalView === "MAINTENANCE") {
        type = "MAINTENANCE";
        status = "BLOCKED";
        name = guestName || "Routine Maintenance Check";
      } else if (modalView === "OWNER_USE") {
        type = "OWNER_USE";
        status = "BLOCKED";
        name = guestName || "Private Owner Occupancy";
      }

      const res = await createManualBooking({
        villaId: selectedCell.villaId,
        checkIn: inDate.toISOString(),
        checkOut: outDate.toISOString(),
        guestName: name,
        guestEmail,
        guestPhone,
        totalPrice: finalPrice,
        status,
        notes: bookingNotes,
        type,
        guests: numGuests,
        nightlyRate: nightlyRate,
      });

      if (res.success && res.booking) {
        // cast dates back to native Dates for frontend model
        const villaObj = villas.find((v) => v.id === selectedCell.villaId);
        if (!villaObj) {
          throw new Error("Target villa not found in local state registry.");
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
        setSelectedCell(null);
      } else {
        alert(res.error || "Failed to log reservation. Overlapping dates?");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error adding manual room block: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting manual bookings or clearing maintenance blocks
  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to clear this reservation/blackout block? This immediately releases the dates for guest bookings.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteBooking(id);
      if (res.success) {
        onBookingsChange(bookings.filter(b => b.id !== id));
        setSelectedBooking(null);
      } else {
        alert(res.error || "Failed to remove blackout block.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong while removing block.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Parsing Inspector details dynamically
  const parseBookingDetails = (booking: Booking) => {
    let parsed: {
      type: string;
      name: string;
      email: string;
      phone: string;
      notes: string;
      channel: string;
      guests?: number;
      nightlyRate?: number;
    } = {
      type: "CUSTOMER",
      name: "Stay Guest",
      email: "",
      phone: "",
      notes: "",
      channel: "",
      guests: 1,
      nightlyRate: 0,
    };

    if (booking.userId.startsWith("{")) {
      try {
        const json = JSON.parse(booking.userId);
        if (json.type === "MANUAL") {
          parsed = {
            type: "MANUAL",
            name: json.name || "Manual Booking",
            email: json.email || "",
            phone: json.phone || "",
            notes: json.notes || "",
            guests: json.guests || 1,
            nightlyRate: json.nightlyRate || 0,
            channel: "Direct Call-in"
          };
        } else if (json.type === "MAINTENANCE") {
          parsed = {
            type: "MAINTENANCE",
            name: "Facility Blackout",
            email: "",
            phone: "",
            notes: json.reason || "Routine maintenance checks",
            channel: "System Administrator"
          };
        } else if (json.type === "OWNER_USE") {
          parsed = {
            type: "OWNER_USE",
            name: "Owner Stays",
            email: "",
            phone: "",
            notes: json.reason || "Private owner occupancy blackout",
            channel: "System Administrator"
          };
        }
      } catch (e) {
        // Fallback on JSON parse error
      }
    } else if (booking.userId.startsWith("CHANNEL_SYNC|")) {
      const parts = booking.userId.split("|");
      parsed = {
        type: "CHANNEL",
        name: "Synced Reservation",
        email: "",
        phone: "",
        notes: `External Platform ID: ${parts[2] || "N/A"}`,
        channel: (parts[1] || "External Channel").toUpperCase()
      };
    } else {
      parsed = {
        type: "ONLINE",
        name: "Online Booking",
        email: "Processed via Stripe Node",
        phone: "",
        notes: `User Identifier: ${booking.userId}`,
        channel: "Web Portal"
      };
    }

    return parsed;
  };

  const activeDetails = selectedBooking ? parseBookingDetails(selectedBooking) : null;

  return (
    <div className="glass border border-slate-200 rounded-[32px] p-8 overflow-hidden animate-fade-in relative shadow-2xl">
      
      {/* Calendar Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-heading italic flex items-center gap-3">
            <CalendarIcon className="text-blue-600" size={22} />
            Availability Scheduler
          </h3>
          <p className="text-slate-500 text-xs mt-1">Real-time room rack scheduling, blackout locks, and reservation timeline.</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full self-start sm:self-auto">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900 cursor-pointer border border-transparent hover:border-slate-200"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs uppercase tracking-widest font-bold font-sans text-blue-600 whitespace-nowrap min-w-[120px] text-center">
            {monthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900 cursor-pointer border border-transparent hover:border-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 text-xs font-sans text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/30"></span>
          <span>Confirmed Stay / Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/30"></span>
          <span>Verification Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-red-500/20 border border-red-500/30"></span>
          <span>Maintenance / Blackout</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-200"></span>
          <span>Available Sanctuary</span>
        </div>
      </div>

      {/* Timeline Rack Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white border border-slate-200">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              {/* Villa Header Column */}
              <th className="py-4 px-6 text-left text-[10px] uppercase tracking-widest font-sans font-bold text-slate-500 sticky left-0 bg-white text-slate-900 z-20 w-64 border-r border-slate-100">
                Boutique Villa
              </th>
              {/* Days Header Columns */}
              {days.map((day) => {
                const isToday = new Date().toDateString() === day.toDateString();
                return (
                  <th 
                    key={day.getDate()} 
                    className={`py-3 px-1 text-center text-[9px] uppercase tracking-wider font-sans font-medium min-w-[32px] border-r border-slate-100 ${
                      isToday ? "text-blue-600 font-bold bg-blue-50" : "text-slate-400"
                    }`}
                  >
                    <div>{day.getDate()}</div>
                    <div className="text-[7px] mt-0.5">{day.toLocaleString("en-US", { weekday: "short" }).substring(0, 2)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {villas.map((villa) => (
              <tr key={villa.id} className="hover:bg-slate-50/20 transition-colors">
                {/* Sticky Left Villa Selector */}
                <td className="py-4 px-6 text-sm font-heading italic text-blue-600 sticky left-0 bg-white text-slate-900 z-20 border-r border-slate-100 font-semibold w-64 shadow-[8px_0_15px_-8px_rgba(0,0,0,0.5)]">
                  {villa.name}
                  <div className="text-[9px] font-sans text-slate-400 tracking-wider uppercase mt-1 not-italic font-normal">
                    ₹{villa.price.toLocaleString("en-IN")} / night
                  </div>
                </td>
                {/* Days Grid Cells */}
                {days.map((day) => {
                  const statusInfo = getDayStatus(villa.id, day);
                  
                  // Color codes
                  let cellClass = "bg-slate-50/20 hover:bg-blue-50 hover:border-blue-200 text-slate-300 hover:text-blue-600 cursor-pointer";
                  if (statusInfo.status === "CONFIRMED") {
                    cellClass = "bg-emerald-50 border-y border-emerald-200 text-emerald-700 cursor-pointer shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]";
                  } else if (statusInfo.status === "PENDING") {
                    cellClass = "bg-amber-50 border-y border-amber-200 text-amber-700 cursor-pointer shadow-[inset_0_0_8px_rgba(245,158,11,0.1)]";
                  } else if (statusInfo.status === "BLOCKED") {
                    cellClass = "bg-red-50 border-y border-red-200 text-red-700 cursor-pointer shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]";
                  }

                  return (
                    <td 
                      key={day.getDate()} 
                      onClick={() => handleCellClick(villa.id, day, statusInfo)}
                      className={`p-0 text-center border-r border-slate-100 h-12 transition-all ${cellClass}`}
                      title={`${villa.name} - ${day.toLocaleDateString("en-IN")}`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {statusInfo.status === "AVAILABLE" && (
                          <Plus size={10} className="opacity-0 hover:opacity-100 transition-opacity" />
                        )}
                        {statusInfo.status === "BLOCKED" && (
                          <Wrench size={10} className="text-red-700" />
                        )}
                        {statusInfo.status === "CONFIRMED" && (
                          <CheckCircle size={10} className="text-emerald-700" />
                        )}
                        {statusInfo.status === "PENDING" && (
                          <Clock size={10} className="text-amber-700" />
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

      {/* Dynamic Popups/Modals overlay rendered at document.body via Portal */}
      
      {/* 1. Availability Action Block Modal */}
      {mounted && selectedCell && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-4xl lg:max-w-5xl w-full relative shadow-2xl flex flex-col max-h-[85vh] my-auto overflow-hidden">
            {/* Fixed Header */}
            <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h4 className="text-lg md:text-xl font-heading italic text-blue-600 font-bold">Sanctuary Availability Controller</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure room rack blocks or villa stay bookings for <span className="text-slate-900 font-bold">{villas.find(v => v.id === selectedCell.villaId)?.name}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
              {modalView === "OPTIONS" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <button 
                    onClick={() => setModalView("MANUAL_BOOKING")}
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus size={20} />
                    <span>BOOKED FOR VILLA STAY</span>
                  </button>
                  <button 
                    onClick={() => setModalView("MAINTENANCE")}
                    className="bg-red-500/10 border border-red-500/30 text-red-700 py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench size={20} />
                    <span>BLOCK ROUTINE MAINTENANCE</span>
                  </button>
                  <button 
                    onClick={() => setModalView("OWNER_USE")}
                    className="bg-purple-500/10 border border-purple-500/30 text-purple-700 py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert size={20} />
                    <span>BLOCK PRIVATE OWNER USE</span>
                  </button>
                </div>
              )}

              {modalView !== "OPTIONS" && (
                <form id="availability-block-form" onSubmit={handleFormSubmit} className="space-y-4">
                  {modalView === "MANUAL_BOOKING" ? (
                    <div className="space-y-4">
                      {/* Row 1: Stay Dates & Basic Rates (Horizontal 4-Column Grid) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-In Date *</label>
                          <input 
                            type="date" 
                            value={checkInStr}
                            onChange={(e) => setCheckInStr(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-Out Date *</label>
                          <input 
                            type="date" 
                            value={checkOutStr}
                            min={checkInStr}
                            onChange={(e) => setCheckOutStr(e.target.value)}
                            required
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Nightly Rate (₹) *</label>
                          <input 
                            type="number" 
                            value={nightlyRate || ""}
                            onChange={(e) => setNightlyRate(Number(e.target.value) || 0)}
                            required
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Guest Count *</label>
                          <input 
                            type="number" 
                            value={numGuests || ""}
                            onChange={(e) => setNumGuests(Number(e.target.value) || 1)}
                            required
                            min="1"
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* Row 2: Guest Details (Horizontal 3-Column Grid) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-blue-500 outline-none font-medium"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Phone Number</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="tel" 
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-blue-500 outline-none font-medium"
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
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-blue-500 outline-none font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Billing, Status & Calculated Duration (Horizontal 3-Column Grid) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Total Tariff Override (₹)</label>
                          <input 
                            type="number" 
                            value={totalPriceOverride}
                            onChange={(e) => setTotalPriceOverride(e.target.value !== "" ? Number(e.target.value) : "")}
                            placeholder="Leave blank for base rates"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Reservation Status</label>
                          <select 
                            value={bookingStatus}
                            onChange={(e) => setBookingStatus(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none font-semibold"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PENDING">VERIFICATION PENDING</option>
                          </select>
                        </div>
                        <div>
                          {checkInStr && checkOutStr ? (
                            <div className="text-xs text-[#1B3564] font-bold bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl flex justify-between items-center h-[38px]">
                              <span>Stay Duration:</span>
                              <span className="bg-[#1B3564] text-white px-2 py-0.5 rounded-md text-[11px]">
                                {Math.max(0, Math.round((new Date(checkOutStr).getTime() - new Date(checkInStr).getTime()) / (1000 * 60 * 60 * 24)))} Nights
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl h-[38px] flex items-center">
                              Select Dates to Calculate
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Call Notes */}
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Special Directives / Call Notes</label>
                        <div className="relative">
                          <FileText size={14} className="absolute left-3 top-2.5 text-slate-400" />
                          <input 
                            type="text"
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            placeholder="Add payment status, specific food requests, early check-in notes, etc."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-blue-500 outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-In Date</label>
                        <input 
                          type="date" 
                          value={checkInStr}
                          onChange={(e) => setCheckInStr(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Check-Out Date</label>
                        <input 
                          type="date" 
                          value={checkOutStr}
                          min={checkInStr}
                          onChange={(e) => setCheckOutStr(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Reason/Notes for Blackout *</label>
                        <input 
                          type="text" 
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={modalView === "MAINTENANCE" ? "e.g., Deep Cleaning / Pool Repair" : "e.g., Owner Private Stays"}
                          required
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Pinned Sticky Footer */}
            {modalView !== "OPTIONS" && (
              <div className="shrink-0 bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-end gap-3 rounded-b-[28px]">
                <button 
                  type="button"
                  onClick={() => setModalView("OPTIONS")}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  form="availability-block-form"
                  disabled={isSubmitting}
                  className="bg-[#1B3564] hover:bg-[#152a50] text-[#DAA520] hover:text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "RECORD ROOM BLOCK"}
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* 2. Detailed Reservation Inspector Modal rendered at document.body via Portal */}
      {mounted && selectedBooking && activeDetails && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="glass border border-slate-200 rounded-[32px] p-8 max-w-md w-full relative shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-xl font-heading italic text-blue-600">{activeDetails.name}</h4>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block mt-0.5">Channel: {activeDetails.channel}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                selectedBooking.status === "CONFIRMED" 
                  ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/25" 
                  : selectedBooking.status === "PENDING"
                  ? "bg-amber-500/10 text-amber-700 border border-amber-500/25"
                  : "bg-red-500/10 text-red-700 border border-red-500/25"
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Sanctuary Estate</span>
                <span className="font-heading text-base text-slate-900 font-medium">{villas.find(v => v.id === selectedBooking.villaId)?.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Check-In</span>
                  <span className="font-sans text-slate-900 font-semibold">{new Date(selectedBooking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Check-Out</span>
                  <span className="font-sans text-slate-900 font-semibold">{new Date(selectedBooking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>

              {activeDetails.type === "MANUAL" && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[8px] text-[#1B3564] font-bold uppercase tracking-widest block mb-1">GUEST DETAILS</span>
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
                  <div className="pt-2 border-t border-slate-200 mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">GUESTS</span>
                      <span className="font-bold text-slate-850">{activeDetails.guests ?? 1} Guests</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">NIGHTLY RATE</span>
                      <span className="font-bold text-slate-850">₹{(activeDetails.nightlyRate ?? 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
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

              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5 font-bold">Transaction Value</span>
                <span className="text-lg font-bold text-emerald-700">
                  {selectedBooking.totalPrice > 0 
                    ? `₹${selectedBooking.totalPrice.toLocaleString("en-IN")}` 
                    : "₹0 (Blocked Sanctuary)"}
                </span>
              </div>
            </div>

            {/* Inspector Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {/* Show Clear button only for manual bookings, synced bookings or blackouts */}
              {activeDetails.type !== "ONLINE" ? (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={isDeleting}
                  className="w-full bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/25 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : "CLEAR BLOCK / CANCEL STAY"}
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-2 items-start text-[10px] text-amber-700/80 leading-normal">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>Stripe bookings must be cancelled directly inside the Stripe dashboard to trigger refunds.</span>
                </div>
              )}
              
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
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
