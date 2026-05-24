"use client";

import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-[#C9A84C] font-montserrat font-semibold tracking-[0.3em] uppercase text-[10px] block mb-3">
              Welcome Back
            </span>
            <h1 className="font-cormorant text-5xl text-[#1B3564] leading-tight mb-3">
              Sign In to{" "}
              <span className="italic font-medium text-[#C9A84C]">Stay Willas</span>
            </h1>
            <p className="text-[#1B3564]/50 font-montserrat text-sm leading-relaxed">
              Access your bookings, save your favourite villas, and get exclusive offers.
            </p>
          </div>

          {/* Clerk SignIn Component */}
          <Suspense>
            <div className="flex justify-center">
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "#1B3564",
                    colorText: "#1B3564",
                    colorBackground: "#FFFFFF",
                    colorInputBackground: "#FAFAFA",
                    fontFamily: "Montserrat, sans-serif",
                    borderRadius: "1rem",
                  },
                  elements: {
                    card: "shadow-[0_8px_40px_rgba(27,53,100,0.10)] border border-[#DAA520]/15 rounded-3xl",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    logoBox: "hidden",
                    formButtonPrimary:
                      "bg-[#1B3564] hover:bg-[#152A50] text-white font-montserrat font-black tracking-widest uppercase text-xs rounded-full py-3 transition-all duration-300 shadow-[0_0_20px_rgba(27,53,100,0.25)] hover:shadow-[0_0_30px_rgba(27,53,100,0.4)]",
                    formFieldInput:
                      "border-[#DAA520]/25 focus:border-[#1B3564] focus:ring-1 focus:ring-[#1B3564]/20 rounded-xl font-montserrat text-sm",
                    footerActionLink: "text-[#C9A84C] hover:text-[#1B3564] font-semibold",
                    identityPreviewEditButton: "text-[#C9A84C]",
                    socialButtonsBlockButton:
                      "border border-[#DAA520]/20 hover:border-[#DAA520]/50 rounded-xl font-montserrat font-semibold text-sm transition-all",
                    dividerLine: "bg-[#DAA520]/20",
                    dividerText: "text-[#1B3564]/40 font-montserrat text-xs",
                  },
                }}
                routing="hash"
              />
            </div>
          </Suspense>

          <p className="text-center text-[#1B3564]/30 font-montserrat text-[10px] tracking-wider mt-8 uppercase">
            Your personal details are always safe with us
          </p>
        </div>
      </div>
    </main>
  );
}
