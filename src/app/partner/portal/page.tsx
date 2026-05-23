import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPartnerDashboardData } from "@/app/actions/partner";
import PartnerPortal from "@/components/partner/partner-portal";

export const metadata: Metadata = {
  title: "Partner Portal | Stay Willas",
  description: "Curated dashboard for homeowners to monitor their villa syncs, earnings pipelines, occupancy stats, and customize calendar blackouts.",
};

export const dynamic = "force-dynamic";

export default async function PartnerPortalPage() {
  let userEmail = "";
  let isAuthenticated = false;
  let isDevMode = false;

  // 1. Authenticate user using secure staywillas_session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("staywillas_session");
    
    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === "partner" || session.role === "admin") {
        userEmail = session.email;
        isAuthenticated = true;
        
        // Enable account switching switcher in dev mode or local testing
        if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || session.role === "admin") {
          isDevMode = true;
        }
      }
    }
  } catch (e) {
    console.error("Custom partner authentication verification failed:", e);
  }

  if (!isAuthenticated) {
    redirect("/login?role=partner");
  }

  // 2. Fetch initial dashboard metrics
  const initialData = await getPartnerDashboardData(userEmail);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <PartnerPortal 
        initialData={initialData} 
        defaultEmail={userEmail}
        isDevMode={isDevMode}
      />
    </main>
  );
}
