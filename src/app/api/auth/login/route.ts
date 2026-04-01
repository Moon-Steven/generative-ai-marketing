import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { errorResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email) return errorResponse("email is required");

  // MVP: accept any email from seeded users, no password check
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return errorResponse("User not found", 401);

  const token = await signToken(user.id);

  const response = Response.json({
    data: {
      user: { id: user.id, email: user.email, name: user.name, planTier: user.planTier },
      token,
    },
  });

  // Also set as httpOnly cookie
  response.headers.set(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
  );

  return response;
}
