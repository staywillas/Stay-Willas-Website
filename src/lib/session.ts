import crypto from "crypto";
import { cookies } from "next/headers";

export interface SessionPayload {
  email: string;
  role: "admin" | "partner" | "guest";
  name?: string;
  id: string;
  timestamp?: number;
}

// Session secret key from env or cryptographically secure fallback for local dev
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "staywillas-ultra-secure-hmac-sha256-secret-key-2026";

/**
 * Signs a payload with HMAC-SHA256 and returns a URL-safe signed token string:
 * "<base64_payload>.<signature>"
 */
export function signSessionPayload(payload: SessionPayload): string {
  const data = JSON.stringify({
    ...payload,
    timestamp: payload.timestamp || Date.now(),
  });
  const encodedData = Buffer.from(data, "utf-8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(encodedData)
    .digest("base64url");
  return `${encodedData}.${signature}`;
}

/**
 * Validates a signed session token.
 * Uses timingSafeEqual to prevent timing side-channel attacks.
 * Returns the decoded SessionPayload if valid and untampered, or null if invalid.
 */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedData, providedSignature] = parts;
  if (!encodedData || !providedSignature) return null;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(encodedData)
      .digest("base64url");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const providedBuffer = Buffer.from(providedSignature, "utf-8");

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return null;
    }

    const jsonStr = Buffer.from(encodedData, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;

    if (!payload.role || !payload.id) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Reads and verifies the current session from incoming HTTP cookies.
 */
export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("staywillas_session");
    if (!sessionCookie?.value) return null;

    return verifySessionToken(sessionCookie.value);
  } catch (error) {
    return null;
  }
}

/**
 * Server-side guard: ensures caller is an authenticated admin.
 * Throws an Error if unauthorized.
 */
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

/**
 * Server-side guard: ensures caller is an authenticated partner/homeowner.
 * Throws an Error if unauthorized.
 */
export async function requirePartnerSession(): Promise<SessionPayload> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "admin")) {
    throw new Error("Unauthorized: Partner access required.");
  }
  return session;
}
