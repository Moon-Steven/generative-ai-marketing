import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return errorResponse("Campaign not found", 404);
  if (campaign.status !== "paused") return errorResponse("Campaign is not paused", 400);

  const updated = await prisma.campaign.update({
    where: { id },
    data: { status: "active" },
  });

  return jsonResponse(updated);
}
