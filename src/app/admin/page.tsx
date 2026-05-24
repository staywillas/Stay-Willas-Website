import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Administrative Suite | Stay Willas",
  description: "Stay Willas private management dashboard for tracking bookings, inquiries, revenue pipelines, and luxury property portfolios.",
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
    redirect("/login?role=admin");
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

  // 3. Render the interactive, stunning administration panel
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-900 pt-24 pb-12 font-montserrat">
      <AdminDashboard 
        initialVillas={dbVillas as any} 
        initialBookings={dbBookings as any} 
        initialInquiries={dbInquiries}
        userEmail={userEmail}
      />
    </main>
  );
}
