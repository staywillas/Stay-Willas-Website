"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";

export default function PublicNavbar() {
  const pathname = usePathname();
  if (/^\/(admin|care)(\/|$)/.test(pathname)) return null;
  return <Navbar key={pathname} />;
}
