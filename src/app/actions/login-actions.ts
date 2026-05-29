"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { sendEmail } from "@/lib/mail";
import ownerConfig from "@/data/owner-config.json";

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

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      id: user.id
    };

    const cookieStore = await cookies();
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

      return { success: true, redirectTo: "/homeowner" };
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

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: guestEmail }
    });

    const redirectVal = formData.get("redirect") as string || "/dashboard";

    if (!user) {
      // 3A. Registration Phase
      const guestName = password.trim() || "Guest Traveler";
      const token = crypto.randomBytes(32).toString("hex");

      const newUser = await prisma.user.create({
        data: {
          email: guestEmail,
          name: guestName,
          role: "guest",
          isVerified: false,
          verificationToken: token
        }
      });

      // Send Verification Email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyLink = `${appUrl}/login/verify?token=${token}${redirectVal ? `&redirect=${encodeURIComponent(redirectVal)}` : ""}`;

      await sendEmail({
        to: guestEmail,
        subject: "Activate your Stay Willas Account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1b3564; font-family: Georgia, serif; font-size: 28px; margin: 0;">Stay <span style="font-style: italic; color: #f59e0b;">Willas</span></h2>
              <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 5px; font-weight: bold;">Secure Entry Gate</p>
            </div>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hi <strong>${newUser.name}</strong>,</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Thank you for choosing Stay Willas for your bespoke holiday experience. To activate your guest account, prevent fake reservation attempts, and set up your password, please click the secure link below:</p>
            <div style="margin: 35px 0; text-align: center;">
              <a href="${verifyLink}" style="background-color: #f59e0b; color: #0f172a; padding: 16px 36px; border-radius: 9999px; text-decoration: none; font-weight: 900; font-size: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 0.15em; box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);">ACTIVATE ACCOUNT & SET PASSWORD</a>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6;">Once verified, you will be automatically signed in and can instantly request bespoke villa bookings with temporary holds directly connected to WhatsApp.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Stay Willas Luxury Collection • Private Estates & Boutique Villa Staycations</p>
          </div>
        `
      });

      return {
        success: true,
        isNewUser: true,
        message: "An activation link has been sent to your email. Please check your inbox to set up your password and secure your stay bookings!"
      };
    }

    if (!user.isVerified) {
      // 3B. Registered but Unverified Resend Link
      let token = user.verificationToken;
      if (!token) {
        token = crypto.randomBytes(32).toString("hex");
        await prisma.user.update({
          where: { id: user.id },
          data: { verificationToken: token }
        });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyLink = `${appUrl}/login/verify?token=${token}${redirectVal ? `&redirect=${encodeURIComponent(redirectVal)}` : ""}`;

      await sendEmail({
        to: guestEmail,
        subject: "Activate your Stay Willas Account (Reminder)",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1b3564; font-family: Georgia, serif; font-size: 28px; margin: 0;">Stay <span style="font-style: italic; color: #f59e0b;">Willas</span></h2>
            </div>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">It looks like your email address has not been verified yet. To prevent fake bookings and finalize your registration, please activate your account and choose a security password by clicking below:</p>
            <div style="margin: 35px 0; text-align: center;">
              <a href="${verifyLink}" style="background-color: #f59e0b; color: #0f172a; padding: 16px 36px; border-radius: 9999px; text-decoration: none; font-weight: 900; font-size: 12px; display: inline-block; text-transform: uppercase; letter-spacing: 0.15em;">VERIFY EMAIL & SET PASSWORD</a>
            </div>
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">If you did not request this, please ignore this email.</p>
          </div>
        `
      });

      return {
        success: false,
        error: "Your guest email is not verified yet. We have resent the secure activation link to your inbox."
      };
    }

    // 3C. Registered & Verified Guest Login
    if (!verifyPassword(password, user.passwordHash!)) {
      return { success: false, error: "Incorrect password. Please verify your credentials and try again." };
    }

    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
      id: user.id
    };

    const cookieStore = await cookies();
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

    return { success: true, redirectTo: redirectVal };
  }

  return { success: false, error: "Invalid login attempt." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("staywillas_session");
  cookieStore.delete("staywillas_user");
  return { success: true };
}
