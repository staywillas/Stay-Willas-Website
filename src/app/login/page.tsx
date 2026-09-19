"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import LoginForm from "@/components/auth/login-form";
import { UserCheck, KeyRound, Building2 } from "lucide-react";

type RoleType = "guest" | "partner" | "admin";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");
  const redirectParam = searchParams.get("redirect") || "";

  const [activeRole, setActiveRole] = useState<RoleType>("guest");

  useEffect(() => {
    if (initialRoleParam === "admin" || initialRoleParam === "partner" || initialRoleParam === "guest") {
      setActiveRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  const tabs = [
    {
      id: "guest" as RoleType,
      label: "Guest Portal",
      icon: UserCheck,
      desc: "For travelers & holiday guests",
    },
    {
      id: "partner" as RoleType,
      label: "Homeowner",
      icon: Building2,
      desc: "For villa owners & partners",
    },
    {
      id: "admin" as RoleType,
      label: "Admin Suite",
      icon: KeyRound,
      desc: "Operations & reservations",
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Role Navigation Pills */}
      <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#DAA520]/20 mb-8 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRole === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveRole(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-montserrat text-xs font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[#1B3564] text-[#DAA520] shadow-md shadow-[#1B3564]/15"
                  : "text-[#1B3564]/60 hover:text-[#1B3564] hover:bg-slate-100/50"
              }`}
            >
              <Icon size={15} className={isActive ? "text-[#DAA520]" : "text-[#1B3564]/50"} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === "guest" ? "Guest" : tab.id === "partner" ? "Partner" : "Admin"}</span>
            </button>
          );
        })}
      </div>

      {/* Render the Login Form */}
      <LoginForm role={activeRole} redirectUrl={redirectParam} />

      <p className="text-center text-[#1B3564]/40 font-montserrat text-[11px] tracking-wider mt-8 uppercase">
        Protected by Stay Willas 256-Bit Encrypted Security
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-28 sm:py-36">
        <Suspense
          fallback={
            <div className="text-center py-20 font-montserrat text-sm text-[#1B3564]/50">
              Loading secure access portal...
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </main>
  );
}
