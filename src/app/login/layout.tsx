import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Access Your Guest Bookings | Stay Willas",
  description: "Sign in to your Stay Willas guest account to access your bookings, edit wishlist retreats, and unlock exclusive discounts. Access guest portal today.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
