import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUserId, parsePagination, paginatedResponse, jsonResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const { page, perPage, skip, q } = parsePagination(request);

    const where: Record<string, unknown> = { userId };
    if (q) where.name = { contains: q };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { campaigns: { select: { id: true, name: true, status: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(products, total, page, perPage);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid JSON body");
    if (!body.name) return errorResponse("name is required");

    const product = await prisma.product.create({
      data: {
        userId,
        name: body.name,
        description: body.description || "",
        price: body.price || 0,
        currency: body.currency || "USD",
        images: body.images ? JSON.stringify(body.images) : "[]",
        sourceUrl: body.sourceUrl || "",
        sourcePlatform: body.sourcePlatform || "manual",
      },
    });

    return jsonResponse(product, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
