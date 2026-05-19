"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  ShieldAlert, 
  Info, 
  CheckCircle,
  Clock,
  Wrench
} from "lucide-react";

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
}

interface Booking {
  id: string;
  villaId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: string;
  userId: string;
}

interface AvailabilityCalendarProps {
  villas: Villa[];
  bookings: Booking[];
}

export default function AvailabilityCalendar({ villas, bookings }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState<{ villaId: string; date: Date } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Custom mock local blackout dates state to demonstrate functionality immediately!
  const [blackouts, setBlackouts] = useState<Array<{ id: string; villaId: string; dateStr: string; reason: string }>>([
    { id: "b1", villaId: "lonavala-estate", dateStr: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-20`, reason: "Pool Resurfacing & Deep Cleaning" },
    { id: "b2", villaId: "alibaug-shores", dateStr: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-08`, reason: "Private Owner Occupancy" },
  ]);

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

  // Get status of a specific day for a specific villa
  const getDayStatus = (villaId: string, date: Date) => {
    const checkDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Check if blacked out
    const blackout = blackouts.find(b => b.villaId === villaId && b.dateStr === checkDateStr);
    if (blackout) return { status: "BLOCKED", data: blackout };

    // Check if booked
    const booking = bookings.find(b => {
      if (b.villaId !== villaId) return false;
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      // Normalize to midnight for accurate day comparison
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      return check >= start && check <= end;
    });

    if (booking) {
      return { status: booking.status, data: booking };
    }

    return { status: "AVAILABLE", data: null };
  };

  const handleCellClick = (villaId: string, date: Date, statusInfo: { status: string; data: any }) => {
    if (statusInfo.status === "CONFIRMED" || statusInfo.status === "PENDING") {
      setSelectedBooking(statusInfo.data);
      setSelectedCell(null);
    } else {
      setSelectedCell({ villaId, date });
      setSelectedBooking(null);
    }
  };

  const handleAddBlackout = (reason: string) => {
    if (!selectedCell) return;
    const dateStr = `${selectedCell.date.getFullYear()}-${String(selectedCell.date.getMonth() + 1).padStart(2, '0')}-${String(selectedCell.date.getDate()).padStart(2, '0')}`;
    
    setBlackouts([
      ...blackouts,
      {
        id: Math.random().toString(),
        villaId: selectedCell.villaId,
        dateStr,
        reason: reason || "Routine Maintenance"
      }
    ]);
    setSelectedCell(null);
  };

  return (
    <div className="glass-dark border border-white/10 rounded-[32px] p-8 overflow-hidden animate-fade-in relative">
      
      {/* Calendar Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-heading italic flex items-center gap-3">
            <CalendarIcon className="text-gold" size={22} />
            Availability Scheduler
          </h3>
          <p className="text-white/40 text-xs mt-1">Real-time room rack scheduling, blackout locks, and reservation timeline.</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full self-start sm:self-auto">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs uppercase tracking-widest font-bold font-sans text-gold whitespace-nowrap min-w-[120px] text-center">
            {monthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 text-xs font-sans text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/30"></span>
          <span>Confirmed Stay</span>
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
          <span className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10"></span>
          <span>Available Sanctuary</span>
        </div>
      </div>

      {/* Timeline Rack Table */}
      <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/20">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {/* Villa Header Column */}
              <th className="py-4 px-6 text-left text-[10px] uppercase tracking-widest font-sans font-bold text-white/40 sticky left-0 bg-[#121212] z-20 w-64 border-r border-white/5">
                Boutique Villa
              </th>
              {/* Days Header Columns */}
              {days.map((day) => {
                const isToday = new Date().toDateString() === day.toDateString();
                return (
                  <th 
                    key={day.getDate()} 
                    className={`py-3 px-1 text-center text-[9px] uppercase tracking-wider font-sans font-medium min-w-[32px] border-r border-white/5 ${
                      isToday ? "text-gold font-bold bg-gold/5" : "text-white/30"
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
              <tr key={villa.id} className="hover:bg-white/[0.01] transition-colors">
                {/* Sticky Left Villa Selector */}
                <td className="py-4 px-6 text-sm font-heading italic text-gold sticky left-0 bg-[#121212] z-20 border-r border-white/5 font-semibold w-64 shadow-[8px_0_15px_-8px_rgba(0,0,0,0.5)]">
                  {villa.name}
                  <div className="text-[9px] font-sans text-white/30 tracking-wider uppercase mt-1 not-italic font-normal">
                    ₹{villa.price.toLocaleString("en-IN")} / night
                  </div>
                </td>
                {/* Days Grid Cells */}
                {days.map((day) => {
                  const statusInfo = getDayStatus(villa.id, day);
                  
                  // Color codes
                  let cellClass = "bg-white/[0.02] hover:bg-gold/10 hover:border-gold/30 text-white/10 hover:text-gold cursor-pointer";
                  if (statusInfo.status === "CONFIRMED") {
                    cellClass = "bg-emerald-500/20 border-y border-emerald-500/30 text-emerald-400 cursor-pointer shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]";
                  } else if (statusInfo.status === "PENDING") {
                    cellClass = "bg-amber-500/20 border-y border-amber-500/30 text-amber-400 cursor-pointer shadow-[inset_0_0_8px_rgba(245,158,11,0.1)]";
                  } else if (statusInfo.status === "BLOCKED") {
                    cellClass = "bg-red-500/20 border-y border-red-500/30 text-red-400 cursor-pointer shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]";
                  }

                  return (
                    <td 
                      key={day.getDate()} 
                      onClick={() => handleCellClick(villa.id, day, statusInfo)}
                      className={`p-0 text-center border-r border-white/5 h-12 transition-all ${cellClass}`}
                      title={`${villa.name} - ${day.toLocaleDateString("en-IN")}`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {statusInfo.status === "AVAILABLE" && (
                          <Plus size={10} className="opacity-0 hover:opacity-100 transition-opacity" />
                        )}
                        {statusInfo.status === "BLOCKED" && (
                          <Wrench size={10} className="text-red-400" />
                        )}
                        {statusInfo.status === "CONFIRMED" && (
                          <CheckCircle size={10} className="text-emerald-400" />
                        )}
                        {statusInfo.status === "PENDING" && (
                          <Clock size={10} className="text-amber-400" />
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

      {/* Dynamic Popups/Modals overlay */}
      
      {/* 1. Availability Action Block Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-dark border border-white/10 rounded-[32px] p-8 max-w-md w-full relative">
            <h4 className="text-xl font-heading mb-4 italic text-gold">Modify Sanctuary Availability</h4>
            <p className="text-sm text-white/60 mb-6">
              Lock availability for <span className="text-white font-bold">{villas.find(v => v.id === selectedCell.villaId)?.name}</span> on <span className="text-white font-bold">{selectedCell.date.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>.
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => handleAddBlackout("Routine Maintenance Check")}
                className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wrench size={14} /> BLOCK FOR MAINTENANCE
              </button>
              <button 
                onClick={() => handleAddBlackout("Private Owner Use")}
                className="w-full bg-purple-500/10 border border-purple-500/30 text-purple-400 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert size={14} /> BLOCK FOR OWNER USE
              </button>
              <button 
                onClick={() => setSelectedCell(null)}
                className="w-full bg-white/5 border border-white/10 text-white/60 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
              >
                CANCEL OPERATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Detailed Reservation Inspector Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-dark border border-white/10 rounded-[32px] p-8 max-w-md w-full relative">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-heading italic text-gold">Reservation Detail</h4>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                selectedBooking.status === "CONFIRMED" 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-6 text-sm mb-8">
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Sanctuary Estate</span>
                <span className="font-heading text-lg text-white font-medium">{villas.find(v => v.id === selectedBooking.villaId)?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Check In</span>
                  <span className="font-sans text-white">{new Date(selectedBooking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Check Out</span>
                  <span className="font-sans text-white">{new Date(selectedBooking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Guest Key Ident</span>
                <span className="font-mono text-xs text-white/60">{selectedBooking.userId}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-widest block mb-1">Total Transaction Price</span>
                <span className="text-lg font-bold text-emerald-400">₹{selectedBooking.totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedBooking(null)}
              className="w-full bg-gold hover:bg-gold/80 text-charcoal py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              CLOSE INSPECTOR
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
