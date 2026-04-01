import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const creative = await prisma.creative.findUnique({
    where: { id },
    include: { campaign: { select: { name: true, id: true } } },
  });

  if (!creative) return errorResponse("Creative not found", 404);
  return jsonResponse(creative);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const creative = await prisma.creative.findUnique({ where: { id } });
  if (!creative) return errorResponse("Creative not found", 404);

  const updated = await prisma.creative.update({
    where: { id },
    data: {
      ...(body.headline !== undefined && { headline: body.headline }),
      ...(body.bodyText !== undefined && { bodyText: body.bodyText }),
      ...(body.cta !== undefined && { cta: body.cta }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.assetUrl !== undefined && { assetUrl: body.assetUrl }),
    },
  });

  return jsonResponse(updated);
}
