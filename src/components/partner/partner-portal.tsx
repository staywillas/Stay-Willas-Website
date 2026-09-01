"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Loader2, 
  CreditCard, 
  PieChart, 
  RefreshCw, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Link2, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  Lock,
  Wrench,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { getPartnerDashboardData, blockPartnerDates, deletePartnerBlock } from "@/app/actions/partner";
import { logoutAction } from "@/app/actions/login-actions";
import { Button } from "@/components/ui/button";

interface PartnerPortalProps {
  initialData: any;
  defaultEmail: string;
}

export default function PartnerPortal({ initialData, defaultEmail }: PartnerPortalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<"overview" | "blocking" | "sync">("overview");
  
  // Interaction/State loaders
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  
  // Date Blocking Form State
  const [blockVillaId, setBlockVillaId] = useState("");
  const [blockCheckIn, setBlockCheckIn] = useState("");
  const [blockCheckOut, setBlockCheckOut] = useState("");
  const [blockType, setBlockType] = useState<"PERSONAL" | "MAINTENANCE">("PERSONAL");
  const [blockNotes, setBlockNotes] = useState("");

  useEffect(() => {
    if (data.villas?.length > 0 && !blockVillaId) {
      setBlockVillaId(data.villas[0].id);
    }
  }, [data]);

  // Submit new block
  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);
    setIsSubmittingBlock(true);

    try {
      const res = await blockPartnerDates(email, {
        villaId: blockVillaId,
        checkIn: blockCheckIn,
        checkOut: blockCheckOut,
        type: blockType,
        notes: blockNotes
      });

      if (res.success) {
        alert("Dates successfully blocked! Calendar has been updated.");
        // Reset form
        setBlockCheckIn("");
        setBlockCheckOut("");
        setBlockNotes("");
        // Reload dashboard
        const updated = await getPartnerDashboardData(email);
        setData(updated);
      } else {
        setBlockError(res.error || "Failed to block dates.");
      }
    } catch (error: any) {
      setBlockError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // Remove block
  const handleDeleteBlock = async (bookingId: string) => {
    if (!confirm("Are you sure you want to remove this personal date block? It will reopen these dates for guest reservations.")) {
      return;
    }

    try {
      const res = await deletePartnerBlock(email, bookingId);
      if (res.success) {
        alert("Block removed successfully.");
        // Reload dashboard
        const updated = await getPartnerDashboardData(email);
        setData(updated);
      } else {
        alert(res.error || "Failed to delete block.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete block.");
    }
  };

  // Safe helper to render customized manual/block statuses
  const renderGuestRow = (b: any) => {
    let name = "Guest Booking";
    let contact = "";
    let notes = "";

    if (b.isCustomBlock) {
      name = b.userId.startsWith("OWNER_BLOCK") ? "Owner Personal Stay" : "Maintenance Blackout";
      const parts = b.userId.split("|");
      notes = parts[1] || "";
    } else if (b.isChannelSync) {
      const parts = b.userId.split("|");
      name = `${parts[1]?.toUpperCase() || "OTA"} External Reservation`;
      notes = `UID: ${parts[2]?.substring(0, 8) || ""}`;
    } else {
      // Direct direct reservations could store customer profiles
      try {
        const payload = JSON.parse(b.userId);
        if (payload.type === "MANUAL") {
          name = payload.name;
          contact = `${payload.email} | ${payload.phone}`;
          notes = payload.notes || "";
        }
      } catch {
        // Fallback for direct bookings
        name = "Stay Willas Direct Guest";
      }
    }

    return (
      <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
        <td className="py-4 px-6">
          <span className="font-semibold text-slate-200 block text-sm">{b.villaName}</span>
          <span className="text-[10px] text-accent-secondary uppercase tracking-widest mt-1 block">ID: {b.villaId}</span>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            {b.isCustomBlock ? (
              b.userId.startsWith("OWNER_BLOCK") ? <Lock size={14} className="text-yellow-400" /> : <Wrench size={14} className="text-orange-400" />
            ) : b.isChannelSync ? (
              <RefreshCw size={14} className="text-indigo-400 animate-spin-slow" />
            ) : (
              <Users size={14} className="text-emerald-400" />
            )}
            <span className="font-heading text-sm text-white font-medium">{name}</span>
          </div>
          {contact && <span className="text-[11px] text-white/40 block mt-0.5">{contact}</span>}
        </td>
        <td className="py-4 px-6 text-sm text-slate-300">
          {format(new Date(b.checkIn), "MMM dd, yyyy")}
        </td>
        <td className="py-4 px-6 text-sm text-slate-300">
          {format(new Date(b.checkOut), "MMM dd, yyyy")}
        </td>
        <td className="py-4 px-6">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${
            b.status === "CONFIRMED" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : b.status === "PENDING"
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {b.status}
          </span>
        </td>
        <td className="py-4 px-6 text-right font-semibold text-slate-200">
          {b.isCustomBlock || b.isChannelSync ? "—" : `₹${b.totalPrice.toLocaleString("en-IN")}`}
        </td>
      </tr>
    );
  };

  const activeBlocks = data.bookings?.filter((b: any) => b.isCustomBlock) || [];
  const guestReservations = data.bookings?.filter((b: any) => !b.isCustomBlock) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">


      {/* Main Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <span className="text-accent-secondary font-medium tracking-[0.3em] uppercase text-xs block mb-2">
            Homeowner Services
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-light tracking-wide text-white">
            Homeowner Portal <span className="italic text-accent-primary font-serif">Workspace</span>
          </h1>
          <p className="text-xs text-white/40 mt-1">Account email address: {email}</p>
        </div>
        
        {/* Connection status & Sign Out */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border border-white/10 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="text-xs uppercase tracking-widest font-bold text-slate-300">Live PMS Feed Connected</span>
          </div>
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to sign out?")) {
                await logoutAction();
                window.location.href = "/login?role=partner";
              }
            }}
            className="text-xs bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 px-4 py-2 rounded-2xl tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer border-none"
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {isDataLoading ? (
        <div className="min-h-[400px] flex items-center justify-center flex-col gap-4">
          <Loader2 className="animate-spin text-accent-primary" size={48} />
          <p className="text-xs text-white/40 uppercase tracking-widest">Synchronizing property files...</p>
        </div>
      ) : (
        <>
          {/* Key Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Revenue card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20">
                <CreditCard size={22} />
              </div>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1">Total Earnings</span>
              <h2 className="text-3xl font-heading text-white font-semibold">
                ₹{(data.stats?.totalEarnings || 0).toLocaleString("en-IN")}
              </h2>
              <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                <span>Confirmed reservations only</span>
              </p>
              {/* Soft visual glow background */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Occupancy card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <PieChart size={22} />
              </div>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1">Occupancy Rate</span>
              <h2 className="text-3xl font-heading text-white font-semibold">
                {data.stats?.occupancyRate || 0}%
              </h2>
              <p className="text-[10px] text-blue-400 mt-2">
                Across all properties next 90 days
              </p>
              {/* Soft visual glow background */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Active stays card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                <Calendar size={22} />
              </div>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold block mb-1">Active Guest Stays</span>
              <h2 className="text-3xl font-heading text-white font-semibold">
                {data.stats?.activeBookingsCount || 0}
              </h2>
              <p className="text-[10px] text-purple-400 mt-2">
                Confirmed & Pending reservations
              </p>
              {/* Soft visual glow background */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 mb-10 gap-2">
            {[
              { id: "overview", label: "Overview & Bookings", icon: Users },
              { id: "blocking", label: "Manage Blackout Dates", icon: Calendar },
              { id: "sync", label: "iCal Sync Feeds", icon: RefreshCw }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-accent-primary text-accent-primary font-black"
                      : "border-transparent text-white/50 hover:text-white hover:border-white/10"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[400px]">
            {/* Overview / Bookings Tab */}
            {activeTab === "overview" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Linked Properties cards */}
                <div>
                  <h3 className="text-lg font-heading font-medium text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span>Linked Villa Portfolio</span>
                    <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-white/60 font-mono">
                      {data.villas?.length || 0}
                    </span>
                  </h3>
                  
                  {data.villas?.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-slate-900 border border-white/5 text-center">
                      <AlertCircle className="mx-auto text-white/20 mb-4" size={40} />
                      <p className="text-sm text-white/50">No linked villas found for this owner email address.</p>
                      <p className="text-xs text-white/30 mt-1">Please contact Stay Willas support to map your property portfolios.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.villas.map((villa: any) => (
                        <div key={villa.id} className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex gap-6 items-center shadow-xl hover:border-accent-primary/20 transition-all group">
                          {villa.images?.[0] && (
                            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                              <Image 
                                src={villa.images[0]} 
                                alt={villa.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading text-lg font-bold text-white truncate">{villa.name}</h4>
                            <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                              <MapPin size={12} className="text-accent-secondary" />
                              <span>{villa.location}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-[11px] text-white/60">
                              <span className="font-semibold uppercase tracking-wider text-accent-primary">₹{villa.price.toLocaleString("en-IN")} / night</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              <span>{villa.bedrooms} Bedrooms</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              <span>{villa.reviewsCount} Reviews</span>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-white/20 group-hover:text-accent-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reservation grid */}
                <div>
                  <h3 className="text-lg font-heading font-medium text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span>Recent Stays & Reservation Pipeline</span>
                    <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-white/60 font-mono">
                      {data.bookings?.length || 0}
                    </span>
                  </h3>

                  {data.bookings?.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-slate-900 border border-white/5 text-center">
                      <Calendar className="mx-auto text-white/20 mb-4" size={40} />
                      <p className="text-sm text-white/50">No stay pipeline logged in our records yet.</p>
                      <p className="text-xs text-white/30 mt-1">Guest checkouts and calendar listings appear automatically here.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/[0.03] border-b border-white/5">
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50">Property</th>
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50">Resident / Guest</th>
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50">Check In</th>
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50">Check Out</th>
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50">Status</th>
                              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-white/50 text-right">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.bookings.map(renderGuestRow)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Date Blocking Tab */}
            {activeTab === "blocking" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Block dates form */}
                <div className="lg:col-span-5">
                  <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl relative">
                    <h3 className="text-lg font-heading font-medium text-white mb-6 uppercase tracking-wider">
                      Request Date Blackout
                    </h3>
                    
                    {blockError && (
                      <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-red-400 leading-relaxed">{blockError}</p>
                      </div>
                    )}

                    <form onSubmit={handleCreateBlock} className="space-y-6">
                      {/* Select Villa */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                          Target Villa
                        </label>
                        <select
                          required
                          value={blockVillaId}
                          onChange={(e) => setBlockVillaId(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-accent-primary transition-colors focus:ring-1 focus:ring-accent-primary/20"
                        >
                          {data.villas?.map((v: any) => (
                            <option key={v.id} value={v.id} className="bg-slate-950 text-white">
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Selectors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                            Start Date
                          </label>
                          <input
                            type="date"
                            required
                            min={format(new Date(), "yyyy-MM-dd")}
                            value={blockCheckIn}
                            onChange={(e) => setBlockCheckIn(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-accent-primary transition-colors [color-scheme:dark]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                            End Date
                          </label>
                          <input
                            type="date"
                            required
                            min={blockCheckIn || format(new Date(), "yyyy-MM-dd")}
                            value={blockCheckOut}
                            onChange={(e) => setBlockCheckOut(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-accent-primary transition-colors [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      {/* Block Type */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                          Block Reason
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setBlockType("PERSONAL")}
                            className={`py-3 rounded-2xl border text-xs uppercase tracking-widest font-bold transition-all ${
                              blockType === "PERSONAL"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-black"
                                : "bg-transparent text-white/50 border-white/10 hover:bg-white/5"
                            }`}
                          >
                            Personal Use
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlockType("MAINTENANCE")}
                            className={`py-3 rounded-2xl border text-xs uppercase tracking-widest font-bold transition-all ${
                              blockType === "MAINTENANCE"
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/30 font-black"
                                : "bg-transparent text-white/50 border-white/10 hover:bg-white/5"
                            }`}
                          >
                            Maintenance
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                          Remarks / Notes
                        </label>
                        <textarea
                          placeholder="e.g. Clean pool filters & paint master bedroom balcony"
                          value={blockNotes}
                          onChange={(e) => setBlockNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-accent-primary transition-colors focus:ring-1 focus:ring-accent-primary/20 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingBlock}
                        className="w-full bg-accent-primary hover:bg-accent-secondary text-white py-6 text-xs font-black tracking-widest uppercase rounded-full shadow-lg flex items-center justify-center gap-2"
                      >
                        {isSubmittingBlock ? <Loader2 className="animate-spin" /> : <Plus size={16} />}
                        <span>SUBMIT DATE BLOCKOUT</span>
                      </Button>
                    </form>
                  </div>
                </div>

                {/* List of custom blocks */}
                <div className="lg:col-span-7">
                  <h3 className="text-lg font-heading font-medium text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span>Active Date Blocks</span>
                    <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-white/60 font-mono">
                      {activeBlocks.length}
                    </span>
                  </h3>

                  {activeBlocks.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-slate-900 border border-white/5 text-center">
                      <Lock className="mx-auto text-white/20 mb-4" size={40} />
                      <p className="text-sm text-white/50">No custom date blocks configured for your properties.</p>
                      <p className="text-xs text-white/30 mt-1">Use the blackout request form to hold dates for personal stays.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBlocks.map((block: any) => {
                        const isPersonal = block.userId.startsWith("OWNER_BLOCK");
                        const notes = block.userId.split("|")[1] || "";
                        return (
                          <div 
                            key={block.id} 
                            className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-between shadow-xl gap-4"
                          >
                            <div className="flex gap-4 items-center min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                isPersonal 
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              }`}>
                                {isPersonal ? <Lock size={16} /> : <Wrench size={16} />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">{block.villaName}</h4>
                                <p className="text-xs text-white/40 mt-1">
                                  {format(new Date(block.checkIn), "MMM dd, yyyy")} – {format(new Date(block.checkOut), "MMM dd, yyyy")}
                                </p>
                                {notes && <p className="text-xs text-slate-300 mt-2 font-mono italic">“{notes}”</p>}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteBlock(block.id)}
                              className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                              title="Delete Date Block"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* iCal sync feeds Tab */}
            {activeTab === "sync" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl">
                  <h3 className="text-lg font-heading font-medium text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw size={18} className="text-accent-secondary" />
                    <span>Synchronize External Calendars (Channel Manager)</span>
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    Stay Willas supports instant bidirectional synchronization with top-tier OTA channels. To prevent double-bookings, configure your import feeds in the admin panel, and copy your exportable Stay Willas calendar feeds below to synchronize external sites with your direct website bookings in real time.
                  </p>

                  <div className="space-y-6 pt-4">
                    {data.villas?.map((villa: any) => {
                      const exportUrl = `${window.location.origin}/api/ical/${villa.id}`;
                      return (
                        <div key={villa.id} className="p-6 rounded-2xl bg-slate-950 border border-white/5 shadow-inner">
                          <h4 className="font-heading text-sm font-bold text-white mb-4 uppercase tracking-widest">{villa.name}</h4>
                          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                            <div className="flex gap-2 items-center min-w-0 w-full md:w-auto">
                              <Link2 size={16} className="text-accent-primary shrink-0" />
                              <span className="text-xs text-white/40 shrink-0 font-bold uppercase tracking-wider">Export Feed:</span>
                              <span className="text-xs font-mono text-slate-300 truncate w-full">{exportUrl}</span>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(exportUrl);
                                alert("Export feed URL copied successfully!");
                              }}
                              className="text-xs bg-accent-primary hover:bg-accent-secondary text-white font-bold uppercase tracking-widest py-2 px-4 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer border-none"
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
