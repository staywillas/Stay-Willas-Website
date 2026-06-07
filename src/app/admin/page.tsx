import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/admin/admin-dashboard";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Dashboard | Stay Willas",
  description: "Stay Willas private administrative dashboard.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1. Authenticate user using secure staywillas_session cookie
  let userEmail = "";
  let isAuthenticated = false;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("staywillas_session");
    
    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === "admin") {
        userEmail = session.email || "admin@staywillas.com";
        isAuthenticated = true;
      }
    }
  } catch (e) {
    console.error("Custom authentication verification failed:", e);
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF8F3] flex flex-col justify-center items-center py-20 font-montserrat">
        <LoginForm role="admin" />
      </main>
    );
  }

  // 2. Query all database statistics & pipelines dynamically in parallel
  const [dbVillas, dbBookings, dbInquiries] = await Promise.all([
    prisma.villa.findMany({
      include: {
        seasonalPrices: true,
        dailyPrices: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      include: {
        villa: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Sort dbVillas in memory to ensure priorities are at the top
  const sortedVillas = [...dbVillas].sort((a, b) => {
    // 1st Priority
    if (a.slug === "the-angle-house" && b.slug !== "the-angle-house") return -1;
    if (b.slug === "the-angle-house" && a.slug !== "the-angle-house") return 1;
    
    // 2nd Priority
    if (a.slug === "canopy-crest" && b.slug !== "canopy-crest") return -1;
    if (b.slug === "canopy-crest" && a.slug !== "canopy-crest") return 1;
    
    return 0;
  });

  // 3. Render the interactive, stunning administration panel
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-900 pt-24 pb-12 font-montserrat">
      <AdminDashboard 
        initialVillas={sortedVillas as any} 
        initialBookings={dbBookings as any} 
        initialInquiries={dbInquiries}
        userEmail={userEmail}
      />
    </main>
  );
}
