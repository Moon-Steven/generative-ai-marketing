"use client";

import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Campaign } from "@/lib/types";
import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Pause, Play, Calendar, DollarSign, Shield, BarChart3, Loader2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const creativeStatusStyle: Record<string, { bg: string; text: string; label: string }> = {
  live: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Live" },
  draft: { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" },
  paused: { bg: "bg-amber-100", text: "text-amber-700", label: "Paused" },
  retired: { bg: "bg-red-100", text: "text-red-700", label: "Retired" },
};

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BarChart3 className="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-background/60 hover:text-background text-sm">✕</button>
    </div>
  );
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: campaign, loading, refetch } = useApi<Campaign>(() => api.campaigns.get(id), [id]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground mb-4">Campaign not found</p>
        <Link href="/campaigns" className="text-primary text-sm hover:underline">Back to Campaigns</Link>
      </div>
    );
  }

  const hasCreatives = campaign.creatives && campaign.creatives.length > 0;
  const hasAudience = campaign.audienceBreakdown && campaign.audienceBreakdown.length > 0;
  const hasHistory = campaign.performanceHistory && campaign.performanceHistory.length > 0;

  const handlePauseResume = async () => {
    if (campaign.status === "active") {
      await api.campaigns.pause(campaign.id);
      showToast("Campaign paused");
    } else {
      await api.campaigns.resume(campaign.id);
      showToast("Campaign resumed");
    }
    refetch();
  };

  return (
    <div className="max-w-7xl">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="p-2 rounded-lg hover:bg-muted transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{campaign.name}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{campaign.product?.name} · {campaign.targetMarket}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${campaign.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {campaign.status}
          </span>
          <button onClick={handlePauseResume} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg text-sm hover:bg-border transition">
            {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {campaign.status === "active" ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Calendar, label: "Started", value: new Date(campaign.startDate).toLocaleDateString() },
          { icon: DollarSign, label: "Daily Budget", value: `$${campaign.dailyBudget}/day` },
          { icon: Shield, label: "Guardrail", value: `Stop if ROAS < ${campaign.minRoas}` },
          { icon: DollarSign, label: "Total Spent", value: `$${campaign.spend}` },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <m.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-sm font-semibold">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Spend", value: `$${campaign.spend}` },
          { label: "Revenue", value: `$${campaign.revenue.toLocaleString()}`, color: "text-success" },
          { label: "ROAS", value: `${campaign.roas}x`, color: campaign.roas >= 2 ? "text-success" : "text-danger" },
          { label: "Orders", value: campaign.orders },
          { label: "CPA", value: `$${campaign.cpa.toFixed(2)}` },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
            <p className={`text-xl md:text-2xl font-bold ${k.color || ""}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-4">Spend vs Revenue</h3>
            {hasHistory ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={campaign.performanceHistory}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#colorRev)" name="Revenue" />
                  <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={2} fill="url(#colorSpend)" name="Spend" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No performance data yet" description="Data appears after 24 hours of ad delivery." />
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-sm">Active Creatives</h3>
            </div>
            {hasCreatives ? (
              <div className="divide-y divide-border">
                {campaign.creatives.map((cr) => {
                  const style = creativeStatusStyle[cr.status] || creativeStatusStyle.draft;
                  return (
                    <div key={cr.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">{cr.image}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{cr.bodyText}</p>
                        <p className="text-xs text-muted-foreground truncate">{cr.headline}</p>
                      </div>
                      <div className="text-center px-2 md:px-4">
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-sm font-semibold">{cr.ctr}%</p>
                      </div>
                      <div className="text-center px-2 md:px-4">
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className="text-sm font-semibold">{cr.roas}x</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text} hidden sm:inline`}>{style.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="No creatives yet" description="Generate creatives in Creative Studio." />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-4">Audience Breakdown</h3>
            {hasAudience ? (
              <div className="space-y-3">
                {campaign.audienceBreakdown!.map((a) => (
                  <div key={a.segment}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{a.segment}</span>
                      <span className="text-xs text-muted-foreground">{a.percentage}% · ROAS {a.roas}x</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${a.roas >= 3 ? "bg-success" : a.roas >= 2 ? "bg-primary" : "bg-warning"}`} style={{ width: `${a.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No audience data yet" description="Appears after 48 hours." />
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-4">ROAS Trend</h3>
            {hasHistory ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={campaign.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="roas" fill="#6366f1" radius={[4, 4, 0, 0]} name="ROAS" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No ROAS data yet" description="Check back in 24 hours." />
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-900">Campaign Agent</span>
            </div>
            <p className="text-sm text-indigo-800 leading-relaxed mb-3">
              {hasAudience
                ? `This campaign is performing ${campaign.roas >= 2 ? "well" : "below target"}. Top segment (${campaign.audienceBreakdown![0].segment}) has the highest ROAS at ${campaign.audienceBreakdown![0].roas}x.`
                : "Collecting data... Recommendations will appear soon."}
            </p>
            <button onClick={() => showToast("Recommendation applied")} className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-indigo-500 transition">
              Apply Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
