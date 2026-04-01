export interface Campaign {
  id: string;
  name: string;
  status: string;
  dailyBudget: number;
  totalBudget: number;
  minRoas: number;
  currency: string;
  targetMarket: string;
  startDate: string;
  product: Product;
  creatives: Creative[];
  spend: number;
  revenue: number;
  orders: number;
  roas: number;
  cpa: number;
  healthTag?: string;
  performanceHistory?: { date: string; spend: number; revenue: number; roas: number }[];
  audienceBreakdown?: { segment: string; percentage: number; roas: number }[];
  optimizations?: Optimization[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string;
  sourceUrl: string;
  sourcePlatform: string;
}

export interface Creative {
  id: string;
  campaignId: string;
  headline: string;
  bodyText: string;
  cta: string;
  status: string;
  ctr: number;
  roas: number;
  image: string;
  predictedCtr: number;
}

export interface Optimization {
  id: string;
  campaignId: string;
  type: string;
  status: string;
  description: string;
  expectedImpact: string;
  riskLevel: string;
}

export interface KpiItem {
  value: number;
  change: number;
  label: string;
  prefix: string;
  suffix?: string;
}

export interface OverviewData {
  kpiData: {
    revenue: KpiItem;
    orders: KpiItem;
    roas: KpiItem;
    spend: KpiItem;
  };
  trendData: { day: string; revenue: number; spend: number; orders: number }[];
  campaigns: Campaign[];
  actionItems: {
    id: string;
    type: string;
    campaign: string;
    campaignId: string;
    message: string;
    severity: string;
  }[];
  agentSuggestion: {
    message: string;
    actions: string[];
  };
  quickStats: {
    activeProducts: number;
    totalCreatives: number;
    monthRevenue: number;
    monthSpend: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
