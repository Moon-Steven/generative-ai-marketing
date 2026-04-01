import type { Campaign, OverviewData, Creative, Product, PaginatedResponse } from "./types";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

async function fetchPaginated<T>(url: string): Promise<PaginatedResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  insights: {
    overview: () => fetchJSON<OverviewData>("/api/insights/overview"),
  },
  campaigns: {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return fetchPaginated<Campaign>(`/api/campaigns${qs}`);
    },
    get: (id: string) => fetchJSON<Campaign>(`/api/campaigns/${id}`),
    create: (data: Partial<Campaign>) =>
      fetchJSON<Campaign>("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Campaign>) =>
      fetchJSON<Campaign>(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    pause: (id: string) => fetchJSON<Campaign>(`/api/campaigns/${id}/pause`, { method: "POST" }),
    resume: (id: string) => fetchJSON<Campaign>(`/api/campaigns/${id}/resume`, { method: "POST" }),
  },
  creatives: {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return fetchPaginated<Creative>(`/api/creatives${qs}`);
    },
    get: (id: string) => fetchJSON<Creative>(`/api/creatives/${id}`),
  },
  products: {
    list: () => fetchPaginated<Product>("/api/products"),
  },
};
