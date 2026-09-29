import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "portfolio_admin_session";

// Base64url helper for Web Crypto in middleware
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function verifyTokenInMiddleware(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadBase64, signatureBase64] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signature = base64UrlToUint8Array(signatureBase64);
    const data = encoder.encode(payloadBase64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as unknown as BufferSource,
      data
    );
    if (!isValid) return false;

    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    if (!payload.admin || typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API route freely
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin and /api/admin routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthenticated = await verifyTokenInMiddleware(sessionCookie);

    if (!isAuthenticated) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Unauthorized. Admin session required." },
          { status: 401 }
        );
      }
      // Redirect to admin login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
