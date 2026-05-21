"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
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
  AlertTriangle
} from "lucide-react";
import Image from "next/image";
import AvailabilityCalendar from "@/components/admin/availability-calendar";
import { 
  updateVillaDetails, 
  getChannelConfigs, 
  updateChannelConfig, 
  syncExternalChannels 
} from "@/app/actions/admin";

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

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  villaId: string | null;
  type: string;
  createdAt: Date;
}

interface AdminDashboardProps {
  initialVillas: Villa[];
  initialBookings: Booking[];
  initialInquiries: Inquiry[];
  userEmail: string;
}

const AdminDashboard = ({ 
  initialVillas, 
  initialBookings, 
  initialInquiries,
  userEmail 
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "stays" | "bookings" | "inquiries" | "calendar">("overview");
  const [inquiryFilter, setInquiryFilter] = useState<"ALL" | "GUEST" | "OWNER">("ALL");

  // Lift properties and bookings to states for high reactivity
  const [villas, setVillas] = useState<Villa[]>(initialVillas);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

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
          bedrooms: editBedrooms,
          category: editCategory,
          description: editDescription
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
  const totalInquiriesCount = initialInquiries.length;
  const partnerRequestsCount = initialInquiries.filter(i => i.type === "OWNER").length;

  const filteredInquiries = initialInquiries.filter(i => {
    if (inquiryFilter === "ALL") return true;
    return i.type === inquiryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-4xl font-heading tracking-wide italic">Administrative Suite</h1>
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
        <div className="flex items-center gap-6 mt-6 md:mt-0 glass border border-slate-200 rounded-full px-6 py-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Logged In As</p>
            <p className="text-sm font-medium text-blue-400 font-heading italic">Stay Willas Admin</p>
          </div>
          <UserButton />
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
          <h2 className="text-4xl font-heading mb-2">{totalVillas}</h2>
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
          <h2 className="text-4xl font-heading mb-2">{totalBookings}</h2>
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
          <h2 className="text-4xl font-heading mb-2 text-slate-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-slate-500 text-xs">Processed from confirmed stays</p>
        </div>

        {/* Metric 4 */}
        <div className="glass border border-slate-200 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Inquiries</span>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
              <MessageSquare size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-heading mb-2 text-slate-900">{totalInquiriesCount}</h2>
          <p className="text-slate-500 text-xs">
            Includes <span className="text-blue-400 font-bold">{partnerRequestsCount} partner requests</span>
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-slate-100 mb-8 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "overview" 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "calendar" 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          Availability Scheduler
        </button>
        <button
          onClick={() => setActiveTab("stays")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "stays" 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          Properties ({totalVillas})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "bookings" 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          Bookings Pipeline ({totalBookings})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "inquiries" 
              ? "border-blue-500 text-blue-400" 
              : "border-transparent text-slate-500 hover:text-white"
          }`}
        >
          User Inquiries ({totalInquiriesCount})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "calendar" && (
        <AvailabilityCalendar 
          villas={villas} 
          bookings={bookings} 
          onBookingsChange={(newBookings) => setBookings(newBookings)}
        />
      )}

      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Bookings */}
            <div className="glass border border-slate-200 rounded-[32px] p-8 lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-heading italic">Recent Reservations</h3>
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className="text-blue-400 text-xs uppercase tracking-widest font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  View All <ExternalLink size={12} />
                </button>
              </div>

              {initialBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No reservations logged yet.</div>
              ) : (
                <div className="space-y-6">
                  {initialBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                          <Image 
                            src={booking.villa.images[0] || "/images/hero-villa.png"} 
                            alt={booking.villa.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading text-sm text-blue-400">{booking.villa.name}</h4>
                          <p className="text-slate-500 text-xs">
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
              <h3 className="text-xl font-heading italic mb-8">Quick Operations</h3>
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
                  onClick={() => {
                    setActiveTab("inquiries");
                    setInquiryFilter("OWNER");
                  }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  <span>Acquisitions Queue</span>
                  <Users size={14} />
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
                  src={villa.images[0] || "/images/hero-villa.png"} 
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
                  <h3 className="text-xl font-heading text-slate-900 italic group-hover:text-blue-600 transition-colors mb-4">{villa.name}</h3>
                  
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
        <div className="glass border border-slate-200 rounded-[32px] p-8 overflow-hidden">
          <h3 className="text-2xl font-heading italic mb-8">Active Reservation Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="py-4">Property</th>
                  <th className="py-4">Dates</th>
                  <th className="py-4">User Ident</th>
                  <th className="py-4">Net Price</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {initialBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 font-heading italic text-blue-400 group-hover:text-slate-900 transition-colors">
                      {booking.villa.name}
                    </td>
                    <td className="py-5 text-slate-700">
                      {new Date(booking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-5 font-mono text-xs text-slate-500">{booking.userId}</td>
                    <td className="py-5 font-bold text-slate-900">₹{booking.totalPrice.toLocaleString("en-IN")}</td>
                    <td className="py-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                        booking.status === "CONFIRMED" 
                          ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" 
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "inquiries" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-heading italic">Communication Queue</h3>
            {/* Filter buttons */}
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setInquiryFilter("ALL")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "ALL" ? "bg-blue-600 text-white font-black" : "text-slate-500 hover:text-white"
                }`}
              >
                All ({totalInquiriesCount})
              </button>
              <button 
                onClick={() => setInquiryFilter("GUEST")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "GUEST" ? "bg-blue-600 text-white font-black" : "text-slate-500 hover:text-white"
                }`}
              >
                Guests
              </button>
              <button 
                onClick={() => setInquiryFilter("OWNER")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "OWNER" ? "bg-blue-600 text-white font-black" : "text-slate-500 hover:text-white"
                }`}
              >
                Partners ({partnerRequestsCount})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredInquiries.length === 0 ? (
              <div className="glass border border-slate-200 rounded-[32px] p-12 text-center text-slate-400 text-sm">
                No inquiries matching this criteria.
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="glass border border-slate-200 rounded-[32px] p-8 hover:border-blue-500/20 transition-all">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="text-lg font-heading text-blue-400 italic">{inquiry.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          inquiry.type === "OWNER" 
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" 
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                        }`}>
                          {inquiry.type === "OWNER" ? "PARTNERSHIP REQUEST" : "GUEST INQUIRY"}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs">
                        Email: <span className="text-slate-800 mr-4">{inquiry.email}</span> Phone: <span className="text-slate-800">{inquiry.phone}</span>
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">RECEIVED ON</span>
                      <p className="text-xs text-slate-600">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Message</h5>
                    <p className="text-slate-800 leading-relaxed text-sm bg-slate-50 border border-slate-200 rounded-2xl p-6 italic">
                      &ldquo;{inquiry.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* 1. PMS Property Editor & Channel Sync Modal */}
      {editingVilla && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in">
          <form 
            onSubmit={handleSaveVilla}
            className="glass border border-slate-200 rounded-[32px] p-8 max-w-2xl w-full my-8 relative shadow-2xl space-y-6"
          >
            <div>
              <h4 className="text-2xl font-heading italic text-blue-400">Property Management Console</h4>
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
                    className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Location</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
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
                      className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Category</label>
                    <input 
                      type="text" 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
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
                      className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5 font-bold">Bedrooms</label>
                    <input 
                      type="number" 
                      value={editBedrooms}
                      onChange={(e) => setEditBedrooms(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
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
                    className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Booking.com Import URL</label>
                  <input 
                    type="url" 
                    value={editBooking}
                    onChange={(e) => setEditBooking(e.target.value)}
                    placeholder="https://ical.booking.com/v1/..."
                    className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-bold">Vrbo Import URL</label>
                  <input 
                    type="url" 
                    value={editVrbo}
                    onChange={(e) => setEditVrbo(e.target.value)}
                    placeholder="https://www.vrbo.com/icalendar/..."
                    className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl px-4 py-2 text-xs focus:border-blue-500 outline-none"
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
                className="w-full bg-slate-50 border border-slate-200 text-white rounded-xl p-4 text-xs focus:border-blue-500 outline-none leading-relaxed"
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
              <h5 className="font-heading text-emerald-400 text-sm font-semibold">Synchronization Successful</h5>
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
    </div>
  );
};

export default AdminDashboard;
