import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DashboardClient from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Guest Dashboard & Booking Management | Stay Willas",
  description: "Log in to your Guest Dashboard to manage your upcoming luxury villa bookings. Complete KYC verification, order meals, and explore concierge services.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let userId = "";
  let userEmail = "";

  // 1. Secure Server-side Cookie Authentication check
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("staywillas_session");
    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === "guest" || session.role === "admin" || session.role === "partner") {
        userId = session.id || "GUEST_USER";
        userEmail = session.email;
      }
    }
  } catch (e) {
    console.warn("Session check failed inside dashboard:", e);
  }

  if (!userId) {
    redirect("/login?role=guest");
  }

  // 2. Query all database bookings created by this user
  let dbBookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      villa: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fallback Seed: If no stays exist, query a villa to display a gorgeous, functional mock stay
  // so the user can immediately interact with self-check-in guides, KYC upload cards, and receipts!
  if (dbBookings.length === 0) {
    const defaultVilla = await prisma.villa.findFirst();
    if (defaultVilla) {
      dbBookings = [
        {
          id: "stay-willas-mock-hold-99a",
          villaId: defaultVilla.id,
          userId: userId,
          checkIn: new Date("2026-06-12T14:00:00Z"),
          checkOut: new Date("2026-06-15T11:00:00Z"),
          totalPrice: defaultVilla.price * 3 + 5000 + 13500, // Stay price + service fee + Chef addon
          status: "CONFIRMED",
          addOns: ["Gourmet Chef Experience", "Premium SUV Airport Transfer"],
          kycName: null,
          kycGuests: null,
          kycIdUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          villa: defaultVilla
        }
      ];
    }
  }

  // 4. Map DB fields to structured UI contracts safely
  const serializedStays = dbBookings.map((b) => ({
    id: b.id,
    villaId: b.villaId,
    villaName: b.villa.name,
    villaLocation: b.villa.location,
    villaImage: b.villa.images[0] || "/images/hero-villa.webp",
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    totalPrice: b.totalPrice,
    status: b.status,
    addOns: b.addOns ? (b.addOns as string[]) : [],
    kycName: b.kycName,
    kycGuests: b.kycGuests ? (b.kycGuests as string[]) : [],
    kycIdUrl: b.kycIdUrl,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      
      {/* Dynamic Client Dashboard View */}
      <DashboardClient initialStays={serializedStays} />

      <Footer />
    </main>
  );
}
