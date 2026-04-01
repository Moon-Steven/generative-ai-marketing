"use client";

import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Creative, PaginatedResponse } from "@/lib/types";
import { Sparkles, Filter, Grid3X3, List, Eye, Rocket, Pencil, Loader2 } from "lucide-react";
import { useState } from "react";

const toneColors: Record<string, string> = {
  Premium: "bg-purple-100 text-purple-700",
  Active: "bg-orange-100 text-orange-700",
  Casual: "bg-blue-100 text-blue-700",
  Urgency: "bg-red-100 text-red-700",
};

const statusBadge: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-600",
  paused: "bg-amber-100 text-amber-600",
  retired: "bg-red-100 text-red-600",
};

export default function CreativeStudioPage() {
  const { data, loading } = useApi<PaginatedResponse<Creative>>(() => api.creatives.list());
  const [selectedProduct, setSelectedProduct] = useState("Bluetooth Earbuds Pro");
  const [selectedMarket, setSelectedMarket] = useState("United States");
  const [selectedTones, setSelectedTones] = useState<string[]>(["Premium"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerated, setShowGenerated] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const creatives = data?.data || [];
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const toggleTone = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerated(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <span className="text-sm">{toast}</span>
          <button onClick={() => setToast(null)} className="text-background/60 hover:text-background text-sm">✕</button>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Creative Studio</h2>
        <p className="text-muted-foreground mt-1">Generate, manage, and test ad creatives powered by AI.</p>
      </div>

      {/* Generator */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Generate New Creatives</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-indigo-700 font-medium block mb-1.5">Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>Bluetooth Earbuds Pro</option>
              <option>FlexFit Leggings</option>
              <option>UltraShield Case</option>
              <option>SilicTip Pro Pack</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-indigo-700 font-medium block mb-1.5">Market</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>United States</option>
              <option>Europe</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Japan</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-indigo-700 font-medium block mb-1.5">Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {["Premium", "Casual", "Urgency", "Active"].map((tone) => (
                <button
                  key={tone}
                  onClick={() => toggleTone(tone)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                    selectedTones.includes(tone)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate 5 Variants
            </>
          )}
        </button>
      </div>

      {/* Creatives from API */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : showGenerated && creatives.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Creatives</h3>
            <span className="text-xs text-muted-foreground">{creatives.length} total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creatives.slice(0, 3).map((v) => (
              <div key={v.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                  <span className="text-6xl">{v.image || "🖼️"}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white/90 backdrop-blur-sm text-sm font-medium px-4 py-2 rounded-lg shadow">
                      <Eye className="w-4 h-4 inline mr-1" /> Preview
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold mb-1">&ldquo;{v.headline}&rdquo;</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{v.bodyText}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">CTR</span>
                      <span className={`text-sm font-bold ${v.ctr >= 2.5 ? "text-success" : v.ctr >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                        {v.ctr}%
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[v.status] || "bg-slate-100 text-slate-600"}`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => showToast("Creative launched")} className="flex-1 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1">
                      <Rocket className="w-3.5 h-3.5" /> Launch
                    </button>
                    <button onClick={() => showToast("Opening editor...")} className="flex-1 bg-muted text-xs font-medium py-2 rounded-lg hover:bg-border transition flex items-center justify-center gap-1">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {creatives.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {creatives.slice(3).map((v) => (
                <div key={v.id} className="bg-card rounded-xl border border-border shadow-sm p-4 flex gap-4 hover:shadow-md transition">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl shrink-0">
                    {v.image || "🖼️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">&ldquo;{v.headline}&rdquo;</p>
                    <p className="text-xs text-muted-foreground truncate">{v.bodyText}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">CTR {v.ctr}%</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[v.status] || "bg-slate-100 text-slate-600"}`}>{v.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => showToast("Creative launched")} className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition">Launch</button>
                    <button onClick={() => showToast("Opening editor...")} className="bg-muted text-xs px-3 py-1.5 rounded-lg hover:bg-border transition">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No creatives yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Use the generator above to create your first ad creatives.</p>
        </div>
      )}
    </div>
  );
}
