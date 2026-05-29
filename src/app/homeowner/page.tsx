import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { getPartnerDashboardData } from "@/app/actions/partner";
import PartnerPortal from "@/components/partner/partner-portal";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Homeowner Portal | Stay Willas",
  description: "Homeowner dashboard to monitor villa occupancy, earnings, and availability.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function HomeownerPortalPage() {
  let userEmail = "";
  let isAuthenticated = false;

  // 1. Authenticate user using secure staywillas_session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("staywillas_session");
    
    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === "partner") {
        userEmail = session.email;
        isAuthenticated = true;
      }
    }
  } catch (e) {
    console.error("Custom partner authentication verification failed:", e);
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAF8F3] flex flex-col justify-center items-center py-20 font-montserrat">
        <LoginForm role="partner" />
      </main>
    );
  }

  // 2. Fetch initial dashboard metrics
  const initialData = await getPartnerDashboardData(userEmail);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16">
      <PartnerPortal 
        initialData={initialData} 
        defaultEmail={userEmail}
      />
    </main>
  );
}
