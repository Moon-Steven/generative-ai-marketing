import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { campaigns: { select: { id: true, name: true, status: true } } },
  });

  if (!product) return errorResponse("Product not found", 404);
  return jsonResponse(product);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return errorResponse("Product not found", 404);

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.currency !== undefined && { currency: body.currency }),
    },
  });

  return jsonResponse(updated);
}
