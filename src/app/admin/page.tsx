import React from "react";
import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Administrative Suite | Stay Willas",
  description: "Stay Willas private management dashboard for tracking bookings, inquiries, revenue pipelines, and luxury property portfolios.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1. Authenticate user server-side using Clerk
  let userEmail = "Admin";
  let isAuthenticated = false;

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    userEmail = "admin@staywillas.com";
    isAuthenticated = true;
  } else {
    try {
      const user = await currentUser();
      if (user) {
        userEmail = user.emailAddresses[0]?.emailAddress || "Admin";
        isAuthenticated = true;
      }
    } catch (e) {
      console.warn("Clerk auth failed, falling back to local admin in dev:", e);
      userEmail = "admin@staywillas.com";
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  // 2. Query all database statistics & pipelines dynamically in parallel
  const [dbVillas, dbBookings, dbInquiries] = await Promise.all([
    prisma.villa.findMany({
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
    <main className="min-h-screen bg-white text-slate-900 pt-24 pb-12">
      <AdminDashboard 
        initialVillas={dbVillas} 
        initialBookings={dbBookings} 
        initialInquiries={dbInquiries}
        userEmail={userEmail}
      />
    </main>
  );
}
