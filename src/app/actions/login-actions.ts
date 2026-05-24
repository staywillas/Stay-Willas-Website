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
      const payload = {
        email: "admin@staywillas.com",
        role: "admin",
        name: "Stay Willas Admin",
        id: "ADMIN_SUITE"
      };
      
      cookieStore.set("staywillas_session", JSON.stringify(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days session
        path: "/"
      });

      cookieStore.set("staywillas_user", JSON.stringify(payload), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days session
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
      const payload = {
        email: partnerEmail,
        role: "partner",
        name: partnerEmail.split("@")[0].toUpperCase(),
        id: "OWNER_" + partnerEmail.replace(/[^a-zA-Z0-9]/g, "")
      };

      cookieStore.set("staywillas_session", JSON.stringify(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days session
        path: "/"
      });

      cookieStore.set("staywillas_user", JSON.stringify(payload), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days session
        path: "/"
      });

      return { success: true, redirectTo: "/partner/portal" };
    } else {
      return { success: false, error: "Invalid Partner Password." };
    }
  }

  // 3. Validate Guest Portal Access
  if (role === "guest") {
    const guestEmail = username.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const guestName = password.trim() || "Guest Traveler";
    const cookieStore = await cookies();
    const payload = {
      email: guestEmail,
      role: "guest",
      name: guestName,
      id: "GUEST_" + Math.random().toString(36).substring(2, 11).toUpperCase()
    };

    cookieStore.set("staywillas_session", JSON.stringify(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days session
      path: "/"
    });

    cookieStore.set("staywillas_user", JSON.stringify(payload), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days session
      path: "/"
    });

    // Extract optional redirect parameter
    const redirectUrl = formData.get("redirect") as string || "/dashboard";
    return { success: true, redirectTo: redirectUrl };
  }

  return { success: false, error: "Invalid login attempt." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("staywillas_session");
  cookieStore.delete("staywillas_user");
  return { success: true };
}
