import crypto from "crypto";

const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hashes a plain password using PBKDF2 sync with a random 16-byte salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password attempt against a stored PBKDF2 hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const [salt, hash] = parts;
    const verifyHash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
    
    const verifyBuffer = Buffer.from(verifyHash, "utf-8");
    const hashBuffer = Buffer.from(hash, "utf-8");
    if (verifyBuffer.length !== hashBuffer.length) return false;

    return crypto.timingSafeEqual(verifyBuffer, hashBuffer);
  } catch (error) {
    return false;
  }
}

