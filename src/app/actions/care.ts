"use server";

import { cookies, headers } from "next/headers";
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

// In-Memory Rate Limiting for PIN attempts (protects against brute-force)
interface RateLimitRecord {
  failures: number;
  lockoutUntil: number;
}
const pinRateLimitMap = new Map<string, RateLimitRecord>();

const MAX_FAILURES = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Signs the care session payload using HMAC-SHA256 with 7-day expiration
 */
function signCareToken(session: CareSession): string {
  const payload = {
    ...session,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = crypto.createHmac("sha256", CARE_SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verifies signed care token and checks expiration
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
    const parsed = JSON.parse(json);
    // Expiration check
    if (parsed.exp && typeof parsed.exp === "number" && parsed.exp < Date.now()) {
      return null;
    }
    return {
      role: parsed.role,
      staffName: parsed.staffName,
      villaSlug: parsed.villaSlug,
      villaName: parsed.villaName,
    };
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
 * Fast 1-Step PIN Authentication with Anti-Brute-Force Rate Limiting
 */
export async function verifyCarePin(pin: string) {
  const cleanPin = pin.trim();

  // 1. Get Client IP for Rate Limiting
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  const record = pinRateLimitMap.get(clientIp);

  if (record && record.lockoutUntil > now) {
    const remainingMins = Math.ceil((record.lockoutUntil - now) / 60000);
    return {
      success: false,
      error: `Too many failed attempts. Locked for ${remainingMins} min(s).`,
    };
  }

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

  // Failed PIN Attempt
  if (!role) {
    const currentFailures = (record?.failures || 0) + 1;
    if (currentFailures >= MAX_FAILURES) {
      pinRateLimitMap.set(clientIp, {
        failures: currentFailures,
        lockoutUntil: now + LOCKOUT_DURATION_MS,
      });
      return {
        success: false,
        error: "Too many incorrect attempts. Please wait 10 minutes.",
      };
    } else {
      pinRateLimitMap.set(clientIp, {
        failures: currentFailures,
        lockoutUntil: 0,
      });
      return {
        success: false,
        error: `Incorrect PIN code. (${MAX_FAILURES - currentFailures} attempts remaining)`,
      };
    }
  }

  // Successful Login: Reset Rate Limit
  pinRateLimitMap.delete(clientIp);

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
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return {
    success: true,
    session: sessionPayload,
  };
}

const VALID_CATEGORIES = new Set([
  "POOL",
  "BEDROOMS",
  "BATHROOMS",
  "LIVING",
  "OUTDOOR",
  "BREAKFAST",
  "LUNCH",
  "HI_TEA",
  "DINNER",
  "GENERAL",
]);

const CARETAKER_ALLOWED = new Set(["POOL", "BEDROOMS", "BATHROOMS", "LIVING", "OUTDOOR", "GENERAL"]);
const CHEF_ALLOWED = new Set(["BREAKFAST", "LUNCH", "HI_TEA", "DINNER", "GENERAL"]);

/**
 * Submits an operational proof log with validation and sanitization
 */
export async function submitCareLog(data: {
  category: string;
  notes?: string;
  imageBase64?: string;
  images?: string[];
  villaSlug?: string;
}) {
  try {
    const session = await getCareSession();
    if (!session) {
      return { success: false, error: "Session expired. Please enter PIN again." };
    }

    // 1. Validate Category
    const category = data.category?.trim().toUpperCase();
    if (!VALID_CATEGORIES.has(category)) {
      return { success: false, error: "Invalid operational category." };
    }

    // 2. Role-Based Authorization
    if (session.role === "caretaker" && !CARETAKER_ALLOWED.has(category)) {
      return { success: false, error: "Unauthorized category for caretaker." };
    }
    if (session.role === "chef" && !CHEF_ALLOWED.has(category)) {
      return { success: false, error: "Unauthorized category for chef." };
    }

    // 3. Validate & Sanitize Notes
    const sanitizedNotes = data.notes
      ? data.notes.slice(0, 500).replace(/[<>]/g, "").trim()
      : null;

    // 4. Validate Images (Array constraint & size)
    const imageList: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      imageList.push(...data.images.filter(Boolean));
    } else if (data.imageBase64) {
      imageList.push(data.imageBase64);
    }

    if (imageList.length === 0) {
      return { success: false, error: "At least one live photo is required." };
    }
    if (imageList.length > 6) {
      return { success: false, error: "Maximum 6 photos allowed per submission." };
    }

    for (const img of imageList) {
      if (!img.startsWith("data:image/") && !img.startsWith("https://")) {
        return { success: false, error: "Invalid image format received." };
      }
      // Safety limit: 1.5MB per image string
      if (img.length > 2_000_000) {
        return { success: false, error: "Image file size exceeds allowed limit." };
      }
    }

    const villaSlug = data.villaSlug || session.villaSlug || "the-angle-house";
    const villaName = session.villaName || "The Angle House (Lonavala)";
    const now = new Date();

    const formattedTimestamp =
      now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " IST";

    // 5. Save to Database
    const log = await prisma.careLog.create({
      data: {
        role: session.role,
        staffName: session.staffName,
        villaSlug,
        category,
        notes: sanitizedNotes,
        images: imageList,
        timestamp: now,
      },
    });

    // 6. Dispatch to Telegram (if configured)
    dispatchTelegramCareAlert({
      role: session.role,
      staffName: session.staffName,
      villaName,
      category,
      notes: sanitizedNotes || undefined,
      imageBase64: imageList[0],
      timestamp: formattedTimestamp,
    }).catch((err) => console.error("Async Telegram alert error:", err));

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
