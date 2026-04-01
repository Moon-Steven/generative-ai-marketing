import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUserId, parsePagination, paginatedResponse, jsonResponse, errorResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const { page, perPage, sort, order, q, status, skip } = parsePagination(request);

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (q) where.name = { contains: q };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: { product: true, creatives: true },
        orderBy: { [sort]: order },
        skip,
        take: perPage,
      }),
      prisma.campaign.count({ where }),
    ]);

    const enriched = await Promise.all(
      campaigns.map(async (c) => {
        const metrics = await prisma.campaignMetric.aggregate({
          where: { campaignId: c.id },
          _sum: { spend: true, revenue: true, orders: true },
        });
        const spend = metrics._sum.spend || 0;
        const revenue = metrics._sum.revenue || 0;
        const orders = metrics._sum.orders || 0;
        return {
          ...c,
          spend,
          revenue,
          orders,
          roas: spend > 0 ? Math.round((revenue / spend) * 10) / 10 : 0,
          cpa: orders > 0 ? Math.round((spend / orders) * 100) / 100 : 0,
        };
      })
    );

    return paginatedResponse(enriched, total, page, perPage);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid JSON body");

    if (!body.name || !body.productId) {
      return errorResponse("name and productId are required");
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId,
        productId: body.productId,
        name: body.name,
        status: body.status || "draft",
        dailyBudget: body.dailyBudget || 0,
        totalBudget: body.totalBudget || 0,
        minRoas: body.minRoas || 1.0,
        currency: body.currency || "USD",
        targetMarket: body.targetMarket || "",
        targetAudience: body.targetAudience || "",
      },
      include: { product: true },
    });

    return jsonResponse(campaign, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
