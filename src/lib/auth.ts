import crypto from "crypto";

export const COOKIE_NAME = "portfolio_admin_session";
export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

interface SessionPayload {
  admin: boolean;
  exp: number;
}

// In-memory rate limiting map: ip -> { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSec: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count, retryAfterSec: 0 };
}

export function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}

// Constant-time string comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Dummy comparison to ensure consistent timing
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Create HMAC signed token
export function createSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured on the server.");
  }
  const payload: SessionPayload = {
    admin: true,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

// Verify HMAC signed token
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadBase64, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadBase64)
      .digest("base64url");

    if (!timingSafeCompare(signature, expectedSignature)) {
      return false;
    }

    const payloadText = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(payloadText);

    if (!payload.admin || typeof payload.exp !== "number") {
      return false;
    }

    // Check expiry
    if (Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
