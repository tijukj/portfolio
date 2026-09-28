import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  resetRateLimit,
  timingSafeCompare,
  createSessionToken,
  COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${rateLimit.retryAfterSec} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const password = body.password || "";

    const expectedPassword = process.env.ADMIN_PASSWORD || "";
    if (!expectedPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 500 }
      );
    }

    const isValid = timingSafeCompare(password, expectedPassword);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid admin password.",
          remainingAttempts: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    resetRateLimit(ip);

    // Create session token
    const token = createSessionToken();
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
