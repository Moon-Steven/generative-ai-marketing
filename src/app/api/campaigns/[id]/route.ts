import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      product: true,
      creatives: { orderBy: { createdAt: "asc" } },
      metrics: { orderBy: { date: "asc" } },
      audienceMetrics: true,
      optimizations: { orderBy: { proposedAt: "desc" } },
    },
  });

  if (!campaign) return errorResponse("Campaign not found", 404);

  // Compute aggregate stats
  const totals = await prisma.campaignMetric.aggregate({
    where: { campaignId: id },
    _sum: { spend: true, revenue: true, orders: true },
  });

  const spend = totals._sum.spend || 0;
  const revenue = totals._sum.revenue || 0;
  const orders = totals._sum.orders || 0;

  return jsonResponse({
    ...campaign,
    spend,
    revenue,
    orders,
    roas: spend > 0 ? Math.round((revenue / spend) * 10) / 10 : 0,
    cpa: orders > 0 ? Math.round((spend / orders) * 100) / 100 : 0,
    performanceHistory: campaign.metrics.map((m) => ({
      date: m.date.toISOString().split("T")[0].replace(/2026-0?/, "").replace(/-/, "/"),
      spend: m.spend,
      revenue: m.revenue,
      roas: m.roas,
    })),
    audienceBreakdown: campaign.audienceMetrics.map((a) => ({
      segment: a.segmentKey,
      percentage: a.percentage,
      roas: a.roas,
    })),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return errorResponse("Campaign not found", 404);

  const updated = await prisma.campaign.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.dailyBudget !== undefined && { dailyBudget: body.dailyBudget }),
      ...(body.totalBudget !== undefined && { totalBudget: body.totalBudget }),
      ...(body.minRoas !== undefined && { minRoas: body.minRoas }),
      ...(body.targetMarket !== undefined && { targetMarket: body.targetMarket }),
    },
    include: { product: true },
  });

  return jsonResponse(updated);
}
