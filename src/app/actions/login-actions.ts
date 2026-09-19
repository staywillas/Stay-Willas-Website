"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { sendEmail } from "@/lib/mail";
import { signSessionPayload, SessionPayload } from "@/lib/session";
import ownerConfig from "@/data/owner-config.json";

const getSessionCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days session
  path: "/"
});

const getUserCookieOptions = () => ({
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days session
  path: "/"
});

interface LoginResponse {
  success: boolean;
  error?: string;
  redirectTo?: string;
  isNewUser?: boolean;
  message?: string;
}

/**
 * Checks whether a guest email is registered and verified to dynamically alter the frontend login layout.
 */
export async function checkEmailAction(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });
    return {
      exists: !!user,
      isVerified: user ? user.isVerified : false
    };
  } catch (error) {
    console.error("Failed to check email:", error);
    return { exists: false, isVerified: false };
  }
}

/**
 * Completes email activation, sets guest password hash, and registers active session cookies.
 */
export async function verifyAndSetupPasswordAction(
  token: string,
  password: string,
  redirectUrl?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return { success: false, error: "Invalid or expired activation link." };
    }

    const hash = hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hash,
        isVerified: true,
        verificationToken: null
      }
    });

    const payload: SessionPayload = {
      email: user.email,
      role: user.role as "admin" | "partner" | "guest",
      name: user.name,
      id: user.id
    };

    const cookieStore = await cookies();
    cookieStore.set("staywillas_session", signSessionPayload(payload), getSessionCookieOptions());
    cookieStore.set("staywillas_user", JSON.stringify(payload), getUserCookieOptions());

    return { success: true, redirectTo: redirectUrl || "/dashboard" };
  } catch (error: any) {
    console.error("Failed to verify and set up password:", error);
    return { success: false, error: error.message || "Activation failed." };
  }
}

/**
 * Handles security checks, admin/partner credentials, and dynamic verified guest registrations.
 */
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
  const configuredAdminUser = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const configuredAdminPass = process.env.ADMIN_PASSWORD || "staywillas2026";

  if (role === "admin") {
    if (username.trim().toLowerCase() === configuredAdminUser && password === configuredAdminPass) {
      const cookieStore = await cookies();
      const payload: SessionPayload = {
        email: "admin@staywillas.com",
        role: "admin",
        name: "Stay Willas Admin",
        id: "ADMIN_SUITE"
      };
      
      cookieStore.set("staywillas_session", signSessionPayload(payload), getSessionCookieOptions());
      cookieStore.set("staywillas_user", JSON.stringify(payload), getUserCookieOptions());

      return { success: true, redirectTo: "/admin" };
    } else {
      return { success: false, error: "Invalid Admin ID or Password." };
    }
  }

  // 2. Validate Partner/Homeowner Portal Access
  const configuredPartnerPass = process.env.PARTNER_PASSWORD || "partner2026";

  if (role === "partner") {
    const config = ownerConfig as Record<string, string[]>;
    const partnerEmail = username.trim().toLowerCase();

    if (!config[partnerEmail]) {
      return { success: false, error: "This email address is not registered as an active homeowner partner." };
    }

    if (password === configuredPartnerPass) {
      const cookieStore = await cookies();
      const payload: SessionPayload = {
        email: partnerEmail,
        role: "partner",
        name: partnerEmail.split("@")[0].toUpperCase(),
        id: "OWNER_" + partnerEmail.replace(/[^a-zA-Z0-9]/g, "")
      };

      cookieStore.set("staywillas_session", signSessionPayload(payload), getSessionCookieOptions());
      cookieStore.set("staywillas_user", JSON.stringify(payload), getUserCookieOptions());

      return { success: true, redirectTo: "/partner" };
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

    if (!password || password.trim().length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    const redirectVal = (formData.get("redirect") as string) || "/dashboard";

    // Check if user exists in the database
    let user = await prisma.user.findUnique({
      where: { email: guestEmail }
    });

    if (!user) {
      // 3A. Auto-create new guest user and sign in immediately
      const guestName = guestEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
      const formattedName = guestName.charAt(0).toUpperCase() + guestName.slice(1);
      const hash = hashPassword(password);

      try {
        user = await prisma.user.create({
          data: {
            email: guestEmail,
            name: formattedName || "Guest Traveler",
            role: "guest",
            isVerified: true,
            passwordHash: hash
          }
        });
      } catch (e: any) {
        console.error("Failed to create guest user:", e);
        return { success: false, error: "Unable to create account. Please try again." };
      }
    } else {
      // 3B. User exists: if passwordHash doesn't exist, set it now
      if (!user.passwordHash) {
        const hash = hashPassword(password);
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            passwordHash: hash,
            isVerified: true
          }
        });
      } else {
        // 3C. Verify existing password
        if (!verifyPassword(password, user.passwordHash)) {
          return { success: false, error: "Incorrect password. Please verify your credentials and try again." };
        }
      }
    }

    const payload: SessionPayload = {
      email: user.email,
      role: user.role as "admin" | "partner" | "guest",
      name: user.name,
      id: user.id
    };

    const cookieStore = await cookies();
    cookieStore.set("staywillas_session", signSessionPayload(payload), getSessionCookieOptions());
    cookieStore.set("staywillas_user", JSON.stringify(payload), getUserCookieOptions());

    return { success: true, redirectTo: redirectVal };
  }

  return { success: false, error: "Invalid login attempt." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("staywillas_session");
  cookieStore.delete("staywillas_user");
  cookieStore.delete("staywillas_admin_token");
  return { success: true };
}
