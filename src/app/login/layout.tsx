import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Stay Willas",
  description: "Sign in to your Stay Willas account to access bookings, saved villas, and exclusive offers.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
