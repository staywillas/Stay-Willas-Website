"use server";

import { cookies } from "next/headers";
import ownerConfig from "@/data/owner-config.json";

interface LoginResponse {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<LoginResponse> {
  const role = formData.get("role") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please enter both credentials." };
  }

  // 1. Validate Admin Portal Access
  if (role === "admin") {
    if (username.trim() === "admin" && password === "staywillas2026") {
      const cookieStore = await cookies();
      cookieStore.set("staywillas_session", JSON.stringify({
        email: "admin@staywillas.com",
        role: "admin"
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days session
        path: "/"
      });
      return { success: true, redirectTo: "/admin" };
    } else {
      return { success: false, error: "Invalid Admin ID or Password." };
    }
  }

  // 2. Validate Partner/Homeowner Portal Access
  if (role === "partner") {
    const config = ownerConfig as Record<string, string[]>;
    const partnerEmail = username.trim().toLowerCase();

    if (!config[partnerEmail]) {
      return { success: false, error: "This email address is not registered as an active homeowner partner." };
    }

    if (password === "partner2026") {
      const cookieStore = await cookies();
      cookieStore.set("staywillas_session", JSON.stringify({
        email: partnerEmail,
        role: "partner"
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days session
        path: "/"
      });
      return { success: true, redirectTo: "/partner/portal" };
    } else {
      return { success: false, error: "Invalid Partner Password." };
    }
  }

  return { success: false, error: "Invalid login attempt." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("staywillas_session");
  return { success: true };
}
