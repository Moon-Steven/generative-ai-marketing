"use client";

import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { OverviewData } from "@/lib/types";
import { BarChart3, TrendingUp, Users, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function InsightsPage() {
  const { data: overview, loading } = useApi<OverviewData>(() => api.insights.overview());

  if (loading || !overview) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { campaigns, trendData, quickStats } = overview;
  const activeCampaigns = campaigns.filter((c) => c.status === "active");

  const campaignRoasData = campaigns
    .filter((c) => c.roas > 0)
    .map((c) => ({ name: c.name.split(" ").slice(0, 2).join(" "), roas: c.roas, spend: c.spend, revenue: c.revenue }));

  const spendByMarket = campaigns.reduce((acc, c) => {
    const market = c.targetMarket || "Unknown";
    acc[market] = (acc[market] || 0) + c.spend;
    return acc;
  }, {} as Record<string, number>);

  const marketData = Object.entries(spendByMarket).map(([name, value]) => ({ name, value: Math.round(value) }));

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Insights</h2>
        <p className="text-muted-foreground mt-1">Performance analytics and audience intelligence.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BarChart3, label: "Total Revenue", value: `$${quickStats.monthRevenue.toLocaleString()}`, color: "text-success" },
          { icon: TrendingUp, label: "Avg ROAS", value: `${(campaigns.reduce((s, c) => s + c.roas, 0) / (campaigns.length || 1)).toFixed(1)}x` },
          { icon: Users, label: "Active Campaigns", value: activeCampaigns.length },
          { icon: BarChart3, label: "Total Spend", value: `$${quickStats.monthSpend.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROAS by Campaign */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4">ROAS by Campaign</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={campaignRoasData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="roas" fill="#6366f1" radius={[4, 4, 0, 0]} name="ROAS" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend by Market */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <h3 className="font-semibold text-sm mb-4">Spend by Market</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={marketData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: $${value}`}>
                {marketData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-4">Revenue vs Spend (7-Day)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="spend" fill="#6366f1" radius={[4, 4, 0, 0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
