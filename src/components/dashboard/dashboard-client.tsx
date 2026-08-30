"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Calendar, MapPin, Key, Wifi, Phone, ShieldCheck, 
  Trash2, FileText, CheckCircle2, ChevronRight, Info, Plus, X, Loader2 
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { submitBookingKYC, cancelBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";

interface SerializedStay {
  id: string;
  villaId: string;
  villaName: string;
  villaLocation: string;
  villaImage: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  addOns: string[];
  kycName: string | null;
  kycGuests: string[];
  kycIdUrl: string | null;
  createdAt: string;
}

interface DashboardClientProps {
  initialStays: SerializedStay[];
}

export default function DashboardClient({ initialStays }: DashboardClientProps) {
  const [stays, setStays] = useState<SerializedStay[]>(initialStays);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [expandedStayId, setExpandedStayId] = useState<string | null>(
    initialStays.length > 0 ? initialStays[0].id : null
  );

  // KYC form local states
  const [kycName, setKycName] = useState("");
  const [coGuests, setCoGuests] = useState<string[]>([]);
  const [coGuestInput, setCoGuestInput] = useState("");
  const [uploadedIdFileName, setUploadedIdFileName] = useState("");
  const [isKycSubmitting, setIsKycSubmitting] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState<string | null>(null);

  // Filter Stays
  const now = new Date();
  
  const upcomingStays = stays.filter(s => 
    s.status === "CONFIRMED" && isAfter(new Date(s.checkOut), now)
  );
  
  const pastStays = stays.filter(s => 
    s.status === "CONFIRMED" && !isAfter(new Date(s.checkOut), now)
  );

  const cancelledStays = stays.filter(s => 
    s.status === "CANCELLED" || s.status === "HELD"
  );

  const displayedStays = 
    activeTab === "upcoming" ? upcomingStays :
    activeTab === "past" ? pastStays : cancelledStays;

  const handleAddCoGuest = () => {
    if (coGuestInput.trim()) {
      setCoGuests(prev => [...prev, coGuestInput.trim()]);
      setCoGuestInput("");
    }
  };

  const handleRemoveCoGuest = (index: number) => {
    setCoGuests(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleKycSubmit = async (bookingId: string) => {
    if (!kycName.trim()) {
      alert("Please enter the Primary Guest Legal Name.");
      return;
    }
    if (!uploadedIdFileName) {
      alert("Please upload a mock ID Document (Aadhaar or Passport).");
      return;
    }

    setIsKycSubmitting(true);
    try {
      // Call secure database Server Action to register KYC
      const res = await submitBookingKYC({
        bookingId,
        kycName: kycName.trim(),
        kycGuests: coGuests,
        kycIdUrl: `/uploads/kyc/${uploadedIdFileName}`
      });

      if (res.success && res.booking) {
        // Sync local states
        setStays(prev => prev.map(s => 
          s.id === bookingId 
            ? { 
                ...s, 
                kycName: res.booking!.kycName, 
                kycGuests: res.booking!.kycGuests as string[], 
                kycIdUrl: res.booking!.kycIdUrl 
              } 
            : s
        ));
        alert("KYC Compliance Document submitted and verified successfully! Your stay check-in instructions are now fully active.");
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      alert(error.message || "Failed to submit KYC compliance files.");
    } finally {
      setIsKycSubmitting(false);
    }
  };

  const handleCancellation = async (bookingId: string) => {
    const check = confirm(
      "Are you absolutely sure you want to cancel this booking? This will immediately release the locked calendar dates and trigger a refund request."
    );
    if (!check) return;

    setIsCancelLoading(bookingId);
    try {
      const res = await cancelBooking(bookingId);
      if (res.success && res.booking) {
        setStays(prev => prev.map(s => 
          s.id === bookingId ? { ...s, status: "CANCELLED" } : s
        ));
        alert("Stay reservation cancelled successfully. Calendar dates have been released.");
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      alert(error.message || "Failed to process stay cancellation.");
    } finally {
      setIsCancelLoading(null);
    }
  };

  return (
    <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      {/* Header Banner */}
      <section className="mb-16 text-left relative overflow-hidden p-10 rounded-[2.5rem] bg-white border border-border-subtle shadow-[0_15px_40px_rgba(44,31,14,0.04)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#DAA520]/5 rounded-full blur-3xl pointer-events-none" />
        
        <span className="text-accent-secondary font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
          MEMBERS SANCTUARY PORTAL
        </span>
        <h1 className="text-4xl md:text-6xl font-heading leading-tight mb-4 text-[#1B3564]">
          My Guest <span className="italic font-serif pr-2 text-[#DAA520]">Dashboard</span>
        </h1>
        <p className="text-text-primary/60 text-base max-w-2xl leading-relaxed">
          Welcome to your private Stay Willas dashboard. Access active caretaker coordinates, complete state compliance verifications, and download print invoice statements.
        </p>
      </section>

      {/* Booking Category Navigation Tabs */}
      <div className="flex border-b border-border-subtle/80 mb-12 gap-8">
        {[
          { id: "upcoming", label: "Upcoming Escapes", count: upcomingStays.length },
          { id: "past", label: "Past Stays", count: pastStays.length },
          { id: "cancelled", label: "Cancellations / Holds", count: cancelledStays.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setExpandedStayId(null);
            }}
            className={`pb-5 text-sm font-bold uppercase tracking-widest relative transition-all cursor-pointer ${
              activeTab === tab.id 
                ? "text-[#1B3564]" 
                : "text-text-primary/40 hover:text-text-primary/75"
            }`}
          >
            <span>{tab.label}</span>
            <span className="ml-2 text-xs opacity-60 bg-border-subtle/40 px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B3564] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {displayedStays.length === 0 ? (
        <div className="p-16 text-center bg-white border border-border-subtle rounded-[2rem] shadow-sm select-none">
          <Info size={36} className="text-text-primary/20 mx-auto mb-4" />
          <p className="text-text-primary/50 text-sm font-semibold uppercase tracking-widest">
            No stay reservations found in this tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Stays List (Left Hand Side) */}
          <div className="lg:col-span-5 space-y-6">
            {displayedStays.map(stay => {
              const isExpanded = expandedStayId === stay.id;
              return (
                <div
                  key={stay.id}
                  onClick={() => setExpandedStayId(stay.id)}
                  className={`p-6 border rounded-[1.8rem] text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isExpanded 
                      ? "border-[#1B3564] bg-white shadow-md ring-1 ring-[#1B3564]/10" 
                      : "border-border-subtle bg-white hover:border-[#1B3564]/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Villa Thumbnail */}
                    <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0">
                      <Image 
                        src={stay.villaImage} 
                        alt={stay.villaName} 
                        fill 
                        className="object-cover" 
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-[#1B3564] truncate">{stay.villaName}</h3>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            stay.status === "CONFIRMED" ? "bg-[#559C24]/10 text-[#559C24] border border-[#559C24]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}>
                            {stay.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-primary/50 font-semibold uppercase tracking-wider mt-1">{stay.villaLocation}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-text-primary/70 mt-3 pt-3 border-t border-border-subtle/40">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#DAA520]" />
                          {format(new Date(stay.checkIn), "MMM dd")} - {format(new Date(stay.checkOut), "MMM dd")}
                        </span>
                        <ChevronRight size={14} className={`text-text-primary/30 transition-transform ${isExpanded ? "rotate-90 text-[#1B3564]" : ""}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stay Active Details (Right Hand Side) */}
          <div className="lg:col-span-7">
            {displayedStays.map(stay => {
              if (expandedStayId !== stay.id) return null;
              
              const checkInDate = new Date(stay.checkIn);
              const checkOutDate = new Date(stay.checkOut);
              const isKycVerified = !!stay.kycName;

              return (
                <div key={stay.id} className="bg-white border border-border-subtle rounded-[2.5rem] p-8 text-left shadow-[0_15px_40px_rgba(44,31,14,0.06)] space-y-8 relative overflow-hidden animate-fade-in-scale">
                  {/* Decorative ambient background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAA520]/3 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Title */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-subtle/60 pb-6 gap-4">
                    <div>
                      <h2 className="text-3xl font-heading text-[#1B3564] leading-tight">{stay.villaName}</h2>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DAA520] block mt-1">Reference: #{stay.id.toUpperCase().substring(0, 10)}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => window.print()}
                        className="flex-1 sm:flex-none border border-border-subtle hover:bg-bg-primary text-[#1B3564] text-[10px] md:text-xs font-black tracking-widest uppercase rounded-full px-5 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={12} />
                        Invoice
                      </button>

                      {stay.status === "CONFIRMED" && (
                        <Button
                          disabled={!!isCancelLoading}
                          onClick={() => handleCancellation(stay.id)}
                          className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100/60 border border-red-200 text-red-500 text-[10px] md:text-xs font-black tracking-widest uppercase rounded-full px-5 py-2.5 flex items-center justify-center gap-1.5 shadow-none shrink-0"
                        >
                          {isCancelLoading === stay.id ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={12} />}
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Caretaker / Security Guidelines Card */}
                  {stay.status === "CONFIRMED" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#DAA520] flex items-center gap-1.5">
                        <Key size={14} className="stroke-[2.5]" />
                        Check-in & Gate Security Guidelines
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Caretaker */}
                        <div className="p-4 border border-border-subtle rounded-2xl bg-bg-primary/40 flex items-start gap-3">
                          <Phone className="text-[#1B3564] mt-0.5 shrink-0" size={16} />
                          <div>
                            <span className="text-[9px] text-text-primary/45 uppercase tracking-widest block mb-0.5">ESTATE MANAGER</span>
                            <span className="text-xs font-bold text-[#1B3564]">Sagar Kadam</span>
                            <a href="tel:+919120044883" className="text-[10px] text-text-primary/75 mt-0.5 block hover:underline">+91 91200 44883</a>
                          </div>
                        </div>

                        {/* Wi-Fi Credentials */}
                        <div className="p-4 border border-border-subtle rounded-2xl bg-bg-primary/40 flex items-start gap-3">
                          <Wifi className="text-[#1B3564] mt-0.5 shrink-0" size={16} />
                          <div>
                            <span className="text-[9px] text-text-primary/45 uppercase tracking-widest block mb-0.5">ESTATE WI-FI</span>
                            <span className="text-xs font-bold text-[#1B3564]">StayWillas_VIP</span>
                            <span className="text-[10px] text-text-primary/75 mt-0.5 block select-all font-mono">slow_luxury_stays</span>
                          </div>
                        </div>

                        {/* Gate Keypad Code */}
                        <div className="p-4 border border-border-subtle rounded-2xl bg-bg-primary/40 flex items-start gap-3">
                          <Key className="text-[#1B3564] mt-0.5 shrink-0" size={16} />
                          <div>
                            <span className="text-[9px] text-text-primary/45 uppercase tracking-widest block mb-0.5">SECURE KEY CODE</span>
                            <span className="text-xs font-bold text-[#1B3564]">Gate PIN Lock</span>
                            <span className="text-[10px] text-[#559C24] font-black mt-0.5 block font-mono">#1082</span>
                          </div>
                        </div>

                        {/* Maps Navigation */}
                        <div className="p-4 border border-border-subtle rounded-2xl bg-bg-primary/40 flex items-start gap-3">
                          <MapPin className="text-[#1B3564] mt-0.5 shrink-0" size={16} />
                          <div>
                            <span className="text-[9px] text-text-primary/45 uppercase tracking-widest block mb-0.5">LOCATION COORDINATES</span>
                            <span className="text-xs font-bold text-[#1B3564]">{stay.villaLocation || "Exact Coordinates"}</span>
                            <a 
                              href={
                                stay.villaName.toLowerCase().includes("angle")
                                  ? "https://www.google.com/maps/place/StayWillas+The+Angle+House+%7C+With+Jacuzzi+%7C+Lonavala/@18.7687773,73.5659749,17z/data=!3m1!4b1!4m9!3m8!1s0x3bc2ad6536845e45:0x4a41e2fba2fc985c!5m2!4m1!1i2!8m2!3d18.7687773!4d73.5685498!16s%2Fg%2F11zb_x4877"
                                  : stay.villaName.toLowerCase().includes("canopy")
                                  ? "https://www.google.com/maps/place/StayWillas+Canopy+Crest+Khopoli+%7C+Premium+Villa+with+Swimming+Pool/@18.7101381,73.3318344,17z/data=!3m1!4b1!4m6!3m5!1s0x3be80541e66fe4dd:0xf311fa62a65e318f!8m2!3d18.7101381!4d73.3344093!16s%2Fg%2F11zcgpz6w2"
                                  : "https://maps.google.com/?q=Kurwande,+Lonavala,+Maharashtra"
                              } 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] text-[#DAA520] font-bold mt-0.5 block hover:underline"
                            >
                              Open in Google Maps →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Concierge Add-ons Invoice Details */}
                  <div className="space-y-4 pt-4 border-t border-border-subtle/60">
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#DAA520]">
                      💎 Reserved Experience Add-ons
                    </h3>
                    {stay.addOns.length === 0 ? (
                      <p className="text-xs italic text-text-primary/40">No concierge experiential add-ons reserved for this stay.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {stay.addOns.map(addon => (
                          <span key={addon} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B3564]/5 border border-[#1B3564]/10 rounded-xl text-xs font-bold text-[#1B3564]">
                            ✦ {addon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* KYC Compliance Section */}
                  {stay.status === "CONFIRMED" && (
                    <div className="space-y-4 pt-4 border-t border-border-subtle/60">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#DAA520] flex items-center gap-1.5">
                          <ShieldCheck size={14} className="stroke-[2.5]" />
                          KYC Compliance Check
                        </h3>

                        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shrink-0 flex items-center gap-1 ${
                          isKycVerified 
                            ? "bg-[#559C24]/10 text-[#559C24] border-[#559C24]/20" 
                            : "bg-[#DAA520]/10 text-[#DAA520] border-[#DAA520]/20 animate-pulse"
                        }`}>
                          {isKycVerified ? <CheckCircle2 size={10} /> : null}
                          {isKycVerified ? "VERIFIED COMPLIANT" : "PENDING COMPLIANCE"}
                        </span>
                      </div>

                      {isKycVerified ? (
                        <div className="p-4 border border-[#559C24]/20 rounded-2xl bg-[#559C24]/5 space-y-3">
                          <div>
                            <span className="text-[9px] text-[#559C24] uppercase tracking-widest block mb-0.5">PRIMARY GUEST NAME</span>
                            <span className="text-xs font-bold text-[#1B3564]">{stay.kycName}</span>
                          </div>
                          {stay.kycGuests.length > 0 && (
                            <div>
                              <span className="text-[9px] text-[#559C24] uppercase tracking-widest block mb-0.5">REGISTERED CO-GUESTS</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {stay.kycGuests.map(g => (
                                  <span key={g} className="text-[9px] font-bold text-[#1B3564] border border-[#1B3564]/10 bg-white px-2 py-0.5 rounded-md">
                                    {g}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] text-[#559C24] font-semibold mt-2">
                            ✔ Government check completed. Physical keys will be released at the check-in time. Enjoy your escape!
                          </p>
                        </div>
                      ) : (
                        <div className="p-6 border border-border-subtle rounded-2xl bg-[#F5F2EA]/40 space-y-4">
                          <p className="text-[11px] text-text-primary/60 leading-relaxed mb-2">
                            Please upload your identification credentials and list your co-guests. All ID documents are protected securely on our servers under legal data privacy frameworks.
                          </p>

                          {/* Primary Guest Name Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] text-text-primary/50 font-extrabold uppercase tracking-wider block">Primary Guest Full Name (Government ID Name)</label>
                            <input 
                              type="text"
                              placeholder="e.g. Johnathan Doe"
                              className="w-full text-xs font-semibold px-4 py-3 bg-white border border-border-subtle rounded-xl outline-none focus:border-[#1B3564]"
                              value={kycName}
                              onChange={(e) => setKycName(e.target.value)}
                            />
                          </div>

                          {/* Co-guest Adder */}
                          <div className="space-y-2">
                            <label className="text-[9px] text-text-primary/50 font-extrabold uppercase tracking-wider block">Co-Guests Roster</label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Add guest full name..."
                                className="flex-1 text-xs font-semibold px-4 py-3 bg-white border border-border-subtle rounded-xl outline-none focus:border-[#1B3564]"
                                value={coGuestInput}
                                onChange={(e) => setCoGuestInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCoGuest())}
                              />
                              <button 
                                type="button"
                                onClick={handleAddCoGuest}
                                className="bg-[#1B3564] hover:bg-[#152A50] text-white px-4 rounded-xl flex items-center justify-center shrink-0"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Roster Badges */}
                            {coGuests.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {coGuests.map((guest, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 text-[9px] font-bold text-[#1B3564] border border-[#1B3564]/10 bg-white pl-2.5 pr-1.5 py-0.5 rounded-lg">
                                    {guest}
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveCoGuest(idx)}
                                      className="text-red-500 hover:text-red-700 shrink-0 w-3 h-3 flex items-center justify-center"
                                    >
                                      <X size={8} className="stroke-[3]" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ID Document mock Upload */}
                          <div className="space-y-2">
                            <label className="text-[9px] text-text-primary/50 font-extrabold uppercase tracking-wider block">Upload Secure Identity Document (Passport / Aadhaar)</label>
                            <div className="flex items-center gap-4">
                              <label className="bg-white border border-border-subtle hover:border-[#1B3564]/40 text-[#1B3564] text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl cursor-pointer shadow-sm select-none">
                                <span>Choose Document</span>
                                <input 
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setUploadedIdFileName(e.target.files[0].name);
                                    }
                                  }}
                                />
                              </label>
                              <span className="text-[10px] text-text-primary/50 font-mono truncate max-w-[200px]">
                                {uploadedIdFileName || "No file selected."}
                              </span>
                            </div>
                          </div>

                          {/* KYC submission Button */}
                          <button
                            type="button"
                            disabled={isKycSubmitting}
                            onClick={() => handleKycSubmit(stay.id)}
                            className="w-full bg-[#559C24] hover:bg-[#46821C] text-white font-extrabold tracking-widest text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md shadow-green-500/10 hover:shadow-lg transition-all duration-300"
                          >
                            {isKycSubmitting ? <Loader2 className="animate-spin" size={14} /> : null}
                            SUBMIT KYC COMPLIANCE CHECK
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Billing Pricing Summary Details */}
                  <div className="space-y-3 pt-6 border-t border-border-subtle/60 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-primary/50">Accommodation Rate & Charges</span>
                      <span className="font-semibold text-[#1B3564]">Processed via Stripe Card</span>
                    </div>
                    <div className="flex justify-between text-base font-heading pt-3 border-t border-dashed border-border-subtle">
                      <span className="text-text-primary">Total Paid Bill</span>
                      <span className="text-accent-primary font-bold">₹{stay.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
