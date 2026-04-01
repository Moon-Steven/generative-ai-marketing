import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUserId, jsonResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid JSON body");

    const metaAccountId = body.metaAccountId || `act_${Date.now()}`;

    const existing = await prisma.metaAccount.findFirst({
      where: { userId, metaAccountId },
    });

    if (existing) {
      return jsonResponse({ ...existing, message: "Account already connected" });
    }

    const metaAccount = await prisma.metaAccount.create({
      data: {
        userId,
        metaAccountId,
        tokenRef: `vault://meta/${userId}/${metaAccountId}`,
        status: "connected",
      },
    });

    return jsonResponse(metaAccount, 201);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const accounts = await prisma.metaAccount.findMany({
      where: { userId },
    });
    return jsonResponse(accounts);
  } catch (e) {
    return handleApiError(e);
  }
}
