"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { dispatchTelegramCareAlert } from "@/lib/telegram";
import crypto from "crypto";

const CARE_SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "staywillas-care-operations-secret-2026";

export interface CareSession {
  role: "caretaker" | "chef" | "admin";
  staffName: string;
  villaSlug: string;
  villaName: string;
}

/**
 * Signs the care session payload using HMAC-SHA256
 */
function signCareToken(session: CareSession): string {
  const data = JSON.stringify({ ...session, iat: Date.now() });
  const encoded = Buffer.from(data, "utf-8").toString("base64url");
  const signature = crypto.createHmac("sha256", CARE_SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verifies signed care token
 */
function verifyCareToken(token: string | undefined): CareSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", CARE_SESSION_SECRET).update(encoded).digest("base64url");

  const b1 = Buffer.from(sig, "utf-8");
  const b2 = Buffer.from(expectedSig, "utf-8");
  if (b1.length !== b2.length || !crypto.timingSafeEqual(b1, b2)) {
    return null;
  }

  try {
    const json = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(json) as CareSession;
  } catch (e) {
    return null;
  }
}

export async function getCareSession(): Promise<CareSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("staywillas_care_session")?.value;
  return verifyCareToken(token);
}

export async function logoutCareAction() {
  const cookieStore = await cookies();
  cookieStore.delete("staywillas_care_session");
  return { success: true };
}

/**
 * Fast 1-Step PIN Authentication
 * - Caretaker PIN: 1122 (default)
 * - Chef PIN: 3344 (default)
 * - Admin PIN: 9900 (default)
 */
export async function verifyCarePin(pin: string) {
  const cleanPin = pin.trim();

  const CARETAKER_PIN = process.env.CARETAKER_PIN || "1122";
  const CHEF_PIN = process.env.CHEF_PIN || "3344";
  const ADMIN_PIN = process.env.CARE_ADMIN_PIN || "9900";

  let role: "caretaker" | "chef" | "admin" | null = null;
  let staffName = "";

  if (cleanPin === CARETAKER_PIN) {
    role = "caretaker";
    staffName = "Caretaker (The Angle House)";
  } else if (cleanPin === CHEF_PIN) {
    role = "chef";
    staffName = "Chef (The Angle House)";
  } else if (cleanPin === ADMIN_PIN) {
    role = "admin";
    staffName = "Admin / Operations Head";
  }

  if (!role) {
    return { success: false, error: "Incorrect PIN. Please check and try again." };
  }

  const sessionPayload: CareSession = {
    role,
    staffName,
    villaSlug: "the-angle-house",
    villaName: "The Angle House (Lonavala)",
  };

  const token = signCareToken(sessionPayload);
  const cookieStore = await cookies();
  cookieStore.set("staywillas_care_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days session
    path: "/",
  });

  return {
    success: true,
    session: sessionPayload,
  };
}

/**
 * Submits an operational proof log with timestamped watermarked photo
 */
export async function submitCareLog(data: {
  category: string;
  notes?: string;
  imageBase64: string;
  villaSlug?: string;
}) {
  try {
    const session = await getCareSession();
    if (!session) {
      return { success: false, error: "Session expired. Please enter PIN again." };
    }

    const villaSlug = data.villaSlug || session.villaSlug || "the-angle-house";
    const villaName = session.villaName || "The Angle House (Lonavala)";
    const now = new Date();

    const formattedTimestamp = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " IST";

    // 1. Save to Database
    const log = await prisma.careLog.create({
      data: {
        role: session.role,
        staffName: session.staffName,
        villaSlug,
        category: data.category,
        notes: data.notes?.trim() || null,
        images: [data.imageBase64],
        timestamp: now,
      },
    });

    // 2. Dispatch to Telegram (if configured)
    dispatchTelegramCareAlert({
      role: session.role,
      staffName: session.staffName,
      villaName,
      category: data.category,
      notes: data.notes,
      imageBase64: data.imageBase64,
      timestamp: formattedTimestamp,
    }).catch(err => console.error("Async Telegram alert error:", err));

    revalidatePath("/care");
    return { success: true, log };
  } catch (error: any) {
    console.error("Failed to submit care log:", error);
    return { success: false, error: error.message || "Failed to submit operations log." };
  }
}

/**
 * Returns today's logs for the selected villa
 */
export async function getTodayCareLogs(villaSlug = "the-angle-house") {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.careLog.findMany({
      where: {
        villaSlug,
        createdAt: { gte: today },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, logs };
  } catch (error: any) {
    console.error("Failed to fetch today's logs:", error);
    return { success: false, logs: [] };
  }
}

/**
 * Returns historical logs for admin review
 */
export async function getCareLogsHistory(villaSlug = "the-angle-house", days = 7) {
  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    sinceDate.setHours(0, 0, 0, 0);

    const logs = await prisma.careLog.findMany({
      where: {
        villaSlug,
        createdAt: { gte: sinceDate },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { success: true, logs };
  } catch (error: any) {
    console.error("Failed to fetch logs history:", error);
    return { success: false, logs: [] };
  }
}
