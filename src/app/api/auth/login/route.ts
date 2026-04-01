import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { errorResponse, handleApiError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid JSON body");

    const { email } = body;
    if (!email) return errorResponse("email is required");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse("User not found", 401);

    const token = await signToken(user.id);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieFlags = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      `Max-Age=${7 * 24 * 60 * 60}`,
      "SameSite=Lax",
      ...(isProduction ? ["Secure"] : []),
    ].join("; ");

    const response = Response.json({
      data: {
        user: { id: user.id, email: user.email, name: user.name, planTier: user.planTier },
        token,
      },
    });

    response.headers.set("Set-Cookie", cookieFlags);

    return response;
  } catch (e) {
    return handleApiError(e);
  }
}
