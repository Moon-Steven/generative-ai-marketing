import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for non-API routes and auth login endpoint
  if (!pathname.startsWith("/api") || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    request.cookies.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured");
      return Response.json({ error: "Server configuration error" }, { status: 500 });
    }
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
