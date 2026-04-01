"use client";

import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Product, PaginatedResponse } from "@/lib/types";
import { Package, Plus, ExternalLink, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { data, loading } = useApi<PaginatedResponse<Product>>(() => api.products.list());
  const products = data?.data || [];

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground mt-1">Manage your product catalog.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          Import Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No products yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Import your first product to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm font-bold">${p.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{p.currency}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.sourcePlatform === "shopify" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {p.sourcePlatform}
                    </span>
                  </div>
                  {p.sourceUrl && (
                    <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
