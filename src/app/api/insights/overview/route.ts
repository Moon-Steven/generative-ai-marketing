import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUserId, jsonResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
  const userId = await getAuthUserId(request);

  // Get all active campaigns
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: { product: true, creatives: true },
  });

  // Get today's date range (use latest metric date as "today" for demo)
  const latestMetric = await prisma.campaignMetric.findFirst({
    orderBy: { date: "desc" },
  });
  const today = latestMetric?.date || new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Today's KPIs
  const todayMetrics = await prisma.campaignMetric.aggregate({
    where: {
      campaign: { userId },
      date: today,
    },
    _sum: { spend: true, revenue: true, orders: true },
  });

  // Yesterday's KPIs (for change calculation)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 2); // use -2 since data isn't daily
  const yesterdayMetrics = await prisma.campaignMetric.aggregate({
    where: {
      campaign: { userId },
      date: yesterday,
    },
    _sum: { spend: true, revenue: true, orders: true },
  });

  const todayRevenue = todayMetrics._sum.revenue || 0;
  const todaySpend = todayMetrics._sum.spend || 0;
  const todayOrders = todayMetrics._sum.orders || 0;
  const yesterdayRevenue = yesterdayMetrics._sum.revenue || 1;
  const yesterdaySpend = yesterdayMetrics._sum.spend || 1;
  const yesterdayOrders = yesterdayMetrics._sum.orders || 1;

  const kpiData = {
    revenue: {
      value: Math.round(todayRevenue),
      change: Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 1000) / 10,
      label: "Revenue",
      prefix: "$",
    },
    orders: {
      value: todayOrders,
      change: Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 1000) / 10,
      label: "Orders",
      prefix: "",
    },
    roas: {
      value: todaySpend > 0 ? Math.round((todayRevenue / todaySpend) * 10) / 10 : 0,
      change: 14.3,
      label: "ROAS",
      prefix: "",
      suffix: "x",
    },
    spend: {
      value: Math.round(todaySpend),
      change: Math.round(((todaySpend - yesterdaySpend) / yesterdaySpend) * 1000) / 10,
      label: "Ad Spend",
      prefix: "$",
    },
  };

  // 7-day trend (last 7 unique dates)
  const recentMetrics = await prisma.campaignMetric.findMany({
    where: { campaign: { userId } },
    orderBy: { date: "desc" },
    take: 100,
  });

  const trendMap = new Map<string, { revenue: number; spend: number; orders: number }>();
  for (const m of recentMetrics) {
    const dayKey = m.date.toLocaleDateString("en-US", { weekday: "short" });
    const dateKey = m.date.toISOString().split("T")[0];
    const existing = trendMap.get(dateKey) || { revenue: 0, spend: 0, orders: 0, day: dayKey };
    existing.revenue += m.revenue;
    existing.spend += m.spend;
    existing.orders += m.orders;
    trendMap.set(dateKey, existing);
  }

  const trendData = Array.from(trendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([dateStr, data]) => ({
      day: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
      ...data,
    }));

  // Campaigns with computed metrics
  const enrichedCampaigns = await Promise.all(
    campaigns.map(async (c) => {
      const agg = await prisma.campaignMetric.aggregate({
        where: { campaignId: c.id },
        _sum: { spend: true, revenue: true, orders: true },
      });
      const spend = agg._sum.spend || 0;
      const revenue = agg._sum.revenue || 0;
      const orders = agg._sum.orders || 0;
      return {
        ...c,
        spend,
        revenue,
        orders,
        roas: spend > 0 ? Math.round((revenue / spend) * 10) / 10 : 0,
        cpa: orders > 0 ? Math.round((spend / orders) * 100) / 100 : 0,
        healthTag: spend > 0 && revenue / spend >= 3 ? "top" : spend > 0 && revenue / spend >= 2 ? "ok" : "low",
      };
    })
  );

  // Action items (pending optimizations)
  const optimizations = await prisma.optimization.findMany({
    where: { campaign: { userId }, status: "proposed" },
    include: { campaign: true },
  });

  const actionItems = optimizations.map((o) => ({
    id: o.id,
    type: o.type,
    campaign: o.campaign.name,
    campaignId: o.campaignId,
    message: o.description,
    severity: o.riskLevel === "high" ? "error" : "warning",
  }));

  // Quick stats
  const totalCreatives = await prisma.creative.count({ where: { userId } });
  const totalProducts = await prisma.product.count({ where: { userId } });
  const monthlyAgg = await prisma.campaignMetric.aggregate({
    where: { campaign: { userId } },
    _sum: { spend: true, revenue: true },
  });

  const quickStats = {
    activeProducts: totalProducts,
    totalCreatives,
    monthRevenue: Math.round(monthlyAgg._sum.revenue || 0),
    monthSpend: Math.round(monthlyAgg._sum.spend || 0),
  };

  // Agent suggestion
  const agentSuggestion = {
    message: "This week's overall ROAS improved 15%. I recommend increasing the Yoga Pants EU daily budget by $20 for scaling. Based on audience data, 25-34F segment shows strong conversion potential.",
    actions: ["Execute", "Later"],
  };

  return jsonResponse({
    kpiData,
    trendData,
    campaigns: enrichedCampaigns,
    actionItems,
    agentSuggestion,
    quickStats,
  });
  } catch (e) {
    return handleApiError(e);
  }
}
