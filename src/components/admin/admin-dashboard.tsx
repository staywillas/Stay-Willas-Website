"use client";

import React, { useState } from "react";
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
  Plus
} from "lucide-react";
import Image from "next/image";

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
  const [activeTab, setActiveTab] = useState<"overview" | "stays" | "bookings" | "inquiries">("overview");
  const [inquiryFilter, setInquiryFilter] = useState<"ALL" | "GUEST" | "OWNER">("ALL");

  // Calculate metrics
  const totalVillas = initialVillas.length;
  const totalBookings = initialBookings.length;
  
  // Sum up totalPrice of CONFIRMED bookings for Revenue
  const totalRevenue = initialBookings
    .filter(b => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookings = initialBookings.filter(b => b.status === "PENDING").length;
  const totalInquiriesCount = initialInquiries.length;
  const partnerRequestsCount = initialInquiries.filter(i => i.type === "OWNER").length;

  const filteredInquiries = initialInquiries.filter(i => {
    if (inquiryFilter === "ALL") return true;
    return i.type === inquiryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-heading tracking-wide italic">Administrative Suite</h1>
            <span className="bg-gold/10 text-gold text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border border-gold/30">
              SYSTEM LIVE
            </span>
          </div>
          <p className="text-white/40 text-sm">
            Managing <span className="text-white/80 font-bold">{userEmail}</span> • Real-time Supabase Cloud Node
          </p>
        </div>

        {/* Clerk User Button & Branding */}
        <div className="flex items-center gap-6 mt-6 md:mt-0 glass-dark border border-white/10 rounded-full px-6 py-3">
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Logged In As</p>
            <p className="text-sm font-medium text-gold font-heading italic">Stay Willas Admin</p>
          </div>
          <UserButton />
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Metric 1 */}
        <div className="glass-dark border border-white/10 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Stays Collection</span>
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-gold flex items-center justify-center group-hover:bg-gold/10 transition-colors">
              <HomeIcon size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-heading mb-2">{totalVillas}</h2>
          <p className="text-white/40 text-xs">Active boutique properties listed</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-dark border border-white/10 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Total Bookings</span>
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-gold flex items-center justify-center group-hover:bg-gold/10 transition-colors">
              <Calendar size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-heading mb-2">{totalBookings}</h2>
          <p className="text-white/40 text-xs">
            <span className="text-amber-400 font-bold">{pendingBookings} pending</span> verification
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-dark border border-white/10 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Live Net Revenue</span>
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
              <IndianRupee size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-heading mb-2 text-emerald-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-white/40 text-xs">Processed from confirmed stays</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-dark border border-white/10 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Total Inquiries</span>
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
              <MessageSquare size={20} />
            </div>
          </div>
          <h2 className="text-4xl font-heading mb-2 text-purple-400">{totalInquiriesCount}</h2>
          <p className="text-white/40 text-xs">
            Includes <span className="text-gold font-bold">{partnerRequestsCount} partner requests</span>
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-white/5 mb-8 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "overview" 
              ? "border-gold text-gold" 
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("stays")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "stays" 
              ? "border-gold text-gold" 
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Properties ({totalVillas})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "bookings" 
              ? "border-gold text-gold" 
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Bookings Pipeline ({totalBookings})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-4 text-xs uppercase tracking-widest font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "inquiries" 
              ? "border-gold text-gold" 
              : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          User Inquiries ({totalInquiriesCount})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Bookings */}
            <div className="glass-dark border border-white/10 rounded-[32px] p-8 lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-heading italic">Recent Reservations</h3>
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className="text-gold text-xs uppercase tracking-widest font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  View All <ExternalLink size={12} />
                </button>
              </div>

              {initialBookings.length === 0 ? (
                <div className="text-center py-12 text-white/30 text-sm">No reservations logged yet.</div>
              ) : (
                <div className="space-y-6">
                  {initialBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-charcoal">
                          <Image 
                            src={booking.villa.images[0] || "/images/hero-villa.png"} 
                            alt={booking.villa.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading text-sm text-gold">{booking.villa.name}</h4>
                          <p className="text-white/40 text-xs">
                            {new Date(booking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-white mb-1">
                          ₹{booking.totalPrice.toLocaleString("en-IN")}
                        </p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          booking.status === "CONFIRMED" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
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
            <div className="glass-dark border border-white/10 rounded-[32px] p-8">
              <h3 className="text-xl font-heading italic mb-8">Quick Operations</h3>
              <div className="space-y-4">
                <a 
                  href="/villas"
                  target="_blank"
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-gold/5 border border-gold/20 text-gold hover:bg-gold/10 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <span>Browse Villa Grid</span>
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => {
                    setActiveTab("inquiries");
                    setInquiryFilter("OWNER");
                  }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  <span>Acquisitions Queue</span>
                  <Users size={14} />
                </button>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Prisma Client Status</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
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
          {initialVillas.map((villa) => (
            <div key={villa.id} className="glass-dark border border-white/10 rounded-[32px] overflow-hidden hover:border-gold/30 transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-48 bg-charcoal">
                <Image 
                  src={villa.images[0] || "/images/hero-villa.png"} 
                  alt={villa.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md text-gold text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10">
                  {villa.category}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs uppercase tracking-wider mb-2">
                    <MapPin size={12} className="text-gold" />
                    <span>{villa.location}</span>
                  </div>
                  <h3 className="text-xl font-heading text-white italic group-hover:text-gold transition-colors mb-4">{villa.name}</h3>
                  
                  <div className="flex items-center gap-6 text-xs text-white/60 mb-6">
                    <div>
                      <span className="font-bold text-white">{villa.bedrooms}</span> Bedrooms
                    </div>
                    <div>
                      <span className="font-bold text-white">{villa.guests}</span> Max Guests
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block">Base Rate</span>
                    <span className="text-base font-bold text-gold">₹{villa.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-white/40">/night</span></span>
                  </div>
                  
                  <a 
                    href={`/villa/${villa.slug}`}
                    target="_blank"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="glass-dark border border-white/10 rounded-[32px] p-8 overflow-hidden">
          <h3 className="text-2xl font-heading italic mb-8">Active Reservation Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  <th className="py-4">Property</th>
                  <th className="py-4">Dates</th>
                  <th className="py-4">User Ident</th>
                  <th className="py-4">Net Price</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {initialBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-5 font-heading italic text-gold group-hover:text-white transition-colors">
                      {booking.villa.name}
                    </td>
                    <td className="py-5 text-white/70">
                      {new Date(booking.checkIn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} - {new Date(booking.checkOut).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-5 font-mono text-xs text-white/40">{booking.userId}</td>
                    <td className="py-5 font-bold text-white">₹{booking.totalPrice.toLocaleString("en-IN")}</td>
                    <td className="py-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                        booking.status === "CONFIRMED" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
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
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setInquiryFilter("ALL")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "ALL" ? "bg-gold text-charcoal" : "text-white/40 hover:text-white"
                }`}
              >
                All ({totalInquiriesCount})
              </button>
              <button 
                onClick={() => setInquiryFilter("GUEST")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "GUEST" ? "bg-gold text-charcoal" : "text-white/40 hover:text-white"
                }`}
              >
                Guests
              </button>
              <button 
                onClick={() => setInquiryFilter("OWNER")}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inquiryFilter === "OWNER" ? "bg-gold text-charcoal" : "text-white/40 hover:text-white"
                }`}
              >
                Partners ({partnerRequestsCount})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredInquiries.length === 0 ? (
              <div className="glass-dark border border-white/10 rounded-[32px] p-12 text-center text-white/30 text-sm">
                No inquiries matching this criteria.
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="glass-dark border border-white/10 rounded-[32px] p-8 hover:border-gold/20 transition-all">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="text-lg font-heading text-gold italic">{inquiry.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          inquiry.type === "OWNER" 
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" 
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                        }`}>
                          {inquiry.type === "OWNER" ? "PARTNERSHIP REQUEST" : "GUEST INQUIRY"}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs">
                        Email: <span className="text-white/80 mr-4">{inquiry.email}</span> Phone: <span className="text-white/80">{inquiry.phone}</span>
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-1">RECEIVED ON</span>
                      <p className="text-xs text-white/60">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Message</h5>
                    <p className="text-white/80 leading-relaxed text-sm bg-white/5 border border-white/5 rounded-2xl p-6 italic">
                      &ldquo;{inquiry.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
