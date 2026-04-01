"use client";

import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Campaign, PaginatedResponse } from "@/lib/types";
import Link from "next/link";
import { Plus, Search, Filter, ArrowUpDown, Pause, Play, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-slate-100 text-slate-600",
  completed: "bg-blue-100 text-blue-700",
  error: "bg-red-100 text-red-700",
  draft: "bg-indigo-100 text-indigo-700",
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const params: Record<string, string> = { per_page: "50" };
  if (filter !== "all") params.status = filter;
  if (search) params.q = search;

  const { data, loading, refetch } = useApi<PaginatedResponse<Campaign>>(
    () => api.campaigns.list(params),
    [filter, search]
  );

  const campaigns = data?.data || [];
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);

  const handlePauseResume = async (c: Campaign) => {
    if (c.status === "active") {
      await api.campaigns.pause(c.id);
    } else if (c.status === "paused") {
      await api.campaigns.resume(c.id);
    }
    refetch();
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-muted-foreground mt-1">Manage all your ad campaigns in one place.</p>
        </div>
        <Link href="/onboarding" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Campaigns", value: data?.meta.total || campaigns.length },
          { label: "Active", value: campaigns.filter((c) => c.status === "active").length },
          { label: "Total Spend", value: `$${totalSpend.toLocaleString()}` },
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["all", "active", "paused"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-lg transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/30 w-56"
            />
          </div>
          <button className="p-2 bg-muted rounded-lg hover:bg-border transition" aria-label="Filter">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 bg-muted rounded-lg hover:bg-border transition" aria-label="Sort">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Campaign</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">ROAS</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">Spend</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">Revenue</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">Orders</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-3 py-3">CPA</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition group">
                  <td className="px-5 py-4">
                    <Link href={`/campaigns/${c.id}`} className="block">
                      <p className="text-sm font-medium group-hover:text-primary transition">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.product?.name} · {c.targetMarket}</p>
                    </Link>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status] || "bg-slate-100 text-slate-600"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className={`px-3 py-4 text-right text-sm font-semibold ${c.roas >= 3 ? "text-success" : c.roas >= 2 ? "text-foreground" : "text-warning"}`}>
                    {c.roas}x
                  </td>
                  <td className="px-3 py-4 text-right text-sm">${c.spend}</td>
                  <td className="px-3 py-4 text-right text-sm font-medium">${c.revenue.toLocaleString()}</td>
                  <td className="px-3 py-4 text-right text-sm">{c.orders}</td>
                  <td className="px-3 py-4 text-right text-sm">${c.cpa.toFixed(2)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handlePauseResume(c)}
                        className="p-1.5 rounded-lg hover:bg-muted transition"
                        aria-label={c.status === "active" ? "Pause" : "Resume"}
                      >
                        {c.status === "active" ? <Pause className="w-3.5 h-3.5 text-muted-foreground" /> : <Play className="w-3.5 h-3.5 text-muted-foreground" />}
                      </button>
                      <Link href={`/campaigns/${c.id}`} className="p-1.5 rounded-lg hover:bg-muted transition">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
