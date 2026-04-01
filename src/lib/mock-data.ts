// KPI data: "today" values should be consistent fractions of weekly totals
// Weekly totals: revenue ~$3,040, spend ~$890, orders ~129
// Today's values are roughly 1 day's average
export const kpiData = {
  revenue: { value: 434, change: 12.3, label: "Revenue", prefix: "$" },
  orders: { value: 18, change: 8.1, label: "Orders", prefix: "" },
  roas: { value: 3.2, change: 14.3, label: "ROAS", prefix: "", suffix: "x" },
  spend: { value: 136, change: 5.2, label: "Ad Spend", prefix: "$" },
};

export const trendData = [
  { day: "Mon", revenue: 380, spend: 120, orders: 16 },
  { day: "Tue", revenue: 420, spend: 125, orders: 18 },
  { day: "Wed", revenue: 350, spend: 115, orders: 14 },
  { day: "Thu", revenue: 490, spend: 135, orders: 21 },
  { day: "Fri", revenue: 410, spend: 128, orders: 17 },
  { day: "Sat", revenue: 520, spend: 140, orders: 23 },
  { day: "Sun", revenue: 470, spend: 132, orders: 20 },
];

export const campaigns = [
  {
    id: "1",
    name: "Bluetooth Earbuds US",
    product: "Pro Max Earbuds",
    status: "active" as const,
    roas: 3.8,
    spend: 342,
    revenue: 1094,
    orders: 47,
    cpa: 7.28,
    dailyBudget: 50,
    startDate: "2026-03-10",
    market: "United States",
    healthTag: "top",
    creatives: [
      { id: "c1", name: "Creative A", headline: "Premium Sound, Zero Compromise", ctr: 2.8, roas: 3.8, status: "top" as const, image: "🎧" },
      { id: "c2", name: "Creative B", headline: "Never Miss a Beat", ctr: 1.2, roas: 1.9, status: "low" as const, image: "🎵" },
      { id: "c3", name: "Creative C", headline: "Music Without Limits", ctr: 2.1, roas: 3.1, status: "ok" as const, image: "🔊" },
    ],
    audienceBreakdown: [
      { segment: "25-28M", percentage: 38, roas: 4.2 },
      { segment: "29-34M", percentage: 26, roas: 3.1 },
      { segment: "25-28F", percentage: 17, roas: 2.8 },
      { segment: "35-44M", percentage: 12, roas: 1.4 },
      { segment: "Other", percentage: 7, roas: 0.9 },
    ],
    performanceHistory: [
      { date: "Mar 10", spend: 48, revenue: 120, roas: 2.5 },
      { date: "Mar 12", spend: 50, revenue: 155, roas: 3.1 },
      { date: "Mar 14", spend: 50, revenue: 142, roas: 2.8 },
      { date: "Mar 16", spend: 49, revenue: 178, roas: 3.6 },
      { date: "Mar 18", spend: 50, revenue: 190, roas: 3.8 },
      { date: "Mar 20", spend: 48, revenue: 185, roas: 3.9 },
      { date: "Mar 22", spend: 50, revenue: 195, roas: 3.9 },
      { date: "Mar 24", spend: 50, revenue: 180, roas: 3.6 },
      { date: "Mar 26", spend: 49, revenue: 192, roas: 3.9 },
      { date: "Mar 28", spend: 50, revenue: 200, roas: 4.0 },
    ],
  },
  {
    id: "2",
    name: "Yoga Pants EU",
    product: "FlexFit Leggings",
    status: "active" as const,
    roas: 4.1,
    spend: 280,
    revenue: 1148,
    orders: 52,
    cpa: 5.38,
    dailyBudget: 40,
    startDate: "2026-03-05",
    market: "Europe",
    healthTag: "top",
    creatives: [
      { id: "c4", name: "Creative A", headline: "Flex Without Limits", ctr: 3.1, roas: 4.5, status: "top" as const, image: "🧘" },
      { id: "c5", name: "Creative B", headline: "Comfort Meets Performance", ctr: 2.4, roas: 3.8, status: "ok" as const, image: "💪" },
    ],
    audienceBreakdown: [
      { segment: "25-34F", percentage: 45, roas: 4.8 },
      { segment: "35-44F", percentage: 28, roas: 3.5 },
      { segment: "18-24F", percentage: 15, roas: 3.2 },
      { segment: "Other", percentage: 12, roas: 2.1 },
    ],
    performanceHistory: [
      { date: "Mar 05", spend: 38, revenue: 140, roas: 3.7 },
      { date: "Mar 08", spend: 40, revenue: 156, roas: 3.9 },
      { date: "Mar 11", spend: 40, revenue: 160, roas: 4.0 },
      { date: "Mar 14", spend: 39, revenue: 168, roas: 4.3 },
      { date: "Mar 17", spend: 40, revenue: 172, roas: 4.3 },
      { date: "Mar 20", spend: 41, revenue: 164, roas: 4.0 },
      { date: "Mar 23", spend: 40, revenue: 180, roas: 4.5 },
      { date: "Mar 26", spend: 42, revenue: 178, roas: 4.2 },
    ],
  },
  {
    id: "3",
    name: "Phone Cases US",
    product: "UltraShield Case",
    status: "active" as const,
    roas: 2.8,
    spend: 156,
    revenue: 437,
    orders: 31,
    cpa: 5.03,
    dailyBudget: 25,
    startDate: "2026-03-15",
    market: "United States",
    healthTag: "ok",
    creatives: [
      { id: "c6", name: "Creative A", headline: "Protection That Stands Out", ctr: 2.2, roas: 3.0, status: "ok" as const, image: "📱" },
      { id: "c7", name: "Creative B", headline: "Drop-Proof Guaranteed", ctr: 1.9, roas: 2.5, status: "ok" as const, image: "🛡️" },
    ],
    audienceBreakdown: [
      { segment: "18-24M", percentage: 32, roas: 3.2 },
      { segment: "25-34M", percentage: 28, roas: 2.9 },
      { segment: "18-24F", percentage: 22, roas: 2.5 },
      { segment: "Other", percentage: 18, roas: 1.8 },
    ],
    performanceHistory: [
      { date: "Mar 15", spend: 24, revenue: 60, roas: 2.5 },
      { date: "Mar 18", spend: 25, revenue: 68, roas: 2.7 },
      { date: "Mar 21", spend: 25, revenue: 72, roas: 2.9 },
      { date: "Mar 24", spend: 24, revenue: 75, roas: 3.1 },
      { date: "Mar 27", spend: 25, revenue: 70, roas: 2.8 },
      { date: "Mar 30", spend: 25, revenue: 74, roas: 3.0 },
    ],
  },
  {
    id: "4",
    name: "Earbuds Accessories UK",
    product: "SilicTip Pro Pack",
    status: "active" as const,
    roas: 3.5,
    spend: 112,
    revenue: 392,
    orders: 28,
    cpa: 4.0,
    dailyBudget: 20,
    startDate: "2026-03-18",
    market: "United Kingdom",
    healthTag: "ok",
    creatives: [
      { id: "c8", name: "Creative A", headline: "Upgrade Your Sound", ctr: 2.6, roas: 3.7, status: "top" as const, image: "🎶" },
    ],
    audienceBreakdown: [
      { segment: "25-34M", percentage: 40, roas: 3.8 },
      { segment: "25-34F", percentage: 30, roas: 3.4 },
      { segment: "35-44M", percentage: 20, roas: 2.9 },
      { segment: "Other", percentage: 10, roas: 1.5 },
    ],
    performanceHistory: [
      { date: "Mar 18", spend: 18, revenue: 58, roas: 3.2 },
      { date: "Mar 21", spend: 20, revenue: 72, roas: 3.6 },
      { date: "Mar 24", spend: 19, revenue: 70, roas: 3.7 },
      { date: "Mar 27", spend: 20, revenue: 74, roas: 3.7 },
      { date: "Mar 30", spend: 20, revenue: 68, roas: 3.4 },
    ],
  },
  {
    id: "5",
    name: "LED Desk Lamp DE",
    product: "LumiPro Desk Light",
    status: "paused" as const,
    roas: 0.8,
    spend: 95,
    revenue: 76,
    orders: 4,
    cpa: 23.75,
    dailyBudget: 30,
    startDate: "2026-03-01",
    market: "Germany",
    healthTag: "paused",
    creatives: [
      { id: "c9", name: "Creative A", headline: "Light Up Your Workspace", ctr: 0.8, roas: 0.8, status: "low" as const, image: "💡" },
    ],
    audienceBreakdown: [
      { segment: "25-34M", percentage: 35, roas: 1.0 },
      { segment: "35-44M", percentage: 30, roas: 0.7 },
      { segment: "Other", percentage: 35, roas: 0.6 },
    ],
    performanceHistory: [
      { date: "Mar 01", spend: 28, revenue: 20, roas: 0.7 },
      { date: "Mar 04", spend: 30, revenue: 22, roas: 0.7 },
      { date: "Mar 07", spend: 25, revenue: 24, roas: 1.0 },
      { date: "Mar 10", spend: 12, revenue: 10, roas: 0.8 },
    ],
  },
];

export const actionItems = [
  {
    id: "act1",
    type: "creative_fatigue" as const,
    campaign: "Bluetooth Earbuds US",
    campaignId: "1",
    message: "Creative fatigue detected — CTR dropped 23% in 3 days",
    suggestion: "Generate 3 new creative variants to replace fatigued assets",
    severity: "warning" as const,
  },
];

export const agentSuggestion = {
  message: "This week's overall ROAS improved 15%. I recommend increasing the Yoga Pants EU daily budget by $20 for scaling. Based on audience data, 25-34F segment shows strong conversion potential.",
  actions: ["Execute", "Later"],
};

export const creativeVariants = [
  { id: "v1", headline: "Premium Sound, Zero Compromise", body: "Experience crystal-clear audio with our Pro Max Earbuds. 40hr battery. ANC 3.0.", ctr: 2.1, tone: "Premium", image: "🎧", status: "live" as const },
  { id: "v2", headline: "Never Miss a Beat", body: "Your workout deserves better sound. Sweat-proof, 40hr battery, deep bass.", ctr: 2.8, tone: "Active", image: "🏃", status: "live" as const },
  { id: "v3", headline: "Music Without Limits", body: "From commute to gym — one pair that does it all. Free shipping today.", ctr: 1.9, tone: "Casual", image: "🎵", status: "draft" as const },
  { id: "v4", headline: "Sound That Moves You", body: "Engineered for life on the go. Premium drivers. All-day comfort.", ctr: 2.4, tone: "Premium", image: "✨", status: "draft" as const },
  { id: "v5", headline: "50% Off — Today Only", body: "Limited time: Get our best-selling earbuds at half price. Don't wait.", ctr: 3.2, tone: "Urgency", image: "🔥", status: "draft" as const },
];

export const assetLibrary = [
  { id: "ast1", name: "Earbuds Hero Shot", type: "image", status: "live" as const, usedIn: 2 },
  { id: "ast2", name: "Lifestyle — Gym", type: "image", status: "live" as const, usedIn: 1 },
  { id: "ast3", name: "Product — White BG", type: "image", status: "draft" as const, usedIn: 0 },
  { id: "ast4", name: "Yoga Pants — Studio", type: "image", status: "live" as const, usedIn: 1 },
  { id: "ast5", name: "Phone Case — Lifestyle", type: "image", status: "used" as const, usedIn: 0 },
  { id: "ast6", name: "Earbuds — Unboxing", type: "image", status: "used" as const, usedIn: 0 },
];

// Derived stats for Quick Stats section
export const quickStats = {
  activeProducts: 5,
  totalCreatives: campaigns.reduce((sum, c) => sum + c.creatives.length, 0) + creativeVariants.length,
  monthRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
  monthSpend: campaigns.reduce((sum, c) => sum + c.spend, 0),
};
