import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.audienceMetric.deleteMany();
  await prisma.campaignMetric.deleteMany();
  await prisma.optimization.deleteMany();
  await prisma.creative.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.metaAccount.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const user = await prisma.user.create({
    data: {
      id: "user-1",
      email: "admin@generative-ai-marketing.com",
      name: "Shaohua",
      planTier: "pro",
    },
  });

  // Create meta account
  await prisma.metaAccount.create({
    data: {
      id: "meta-1",
      userId: user.id,
      metaAccountId: "act_123456789",
      tokenRef: "vault://meta/user-1",
      status: "connected",
    },
  });

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        id: "prod-1",
        userId: user.id,
        name: "Pro Max Earbuds",
        description: "Bluetooth 5.3 earbuds with ANC 3.0, 40hr battery",
        price: 49.99,
        currency: "USD",
        images: JSON.stringify(["earbuds-hero.jpg", "earbuds-lifestyle.jpg", "earbuds-white.jpg"]),
        sourceUrl: "https://store.example.com/products/pro-max-earbuds",
        sourcePlatform: "shopify",
      },
    }),
    prisma.product.create({
      data: {
        id: "prod-2",
        userId: user.id,
        name: "FlexFit Leggings",
        description: "High-waist yoga pants with 4-way stretch",
        price: 39.99,
        currency: "USD",
        sourcePlatform: "shopify",
      },
    }),
    prisma.product.create({
      data: {
        id: "prod-3",
        userId: user.id,
        name: "UltraShield Case",
        description: "Military-grade drop protection phone case",
        price: 24.99,
        currency: "USD",
        sourcePlatform: "shopify",
      },
    }),
    prisma.product.create({
      data: {
        id: "prod-4",
        userId: user.id,
        name: "SilicTip Pro Pack",
        description: "Premium silicone ear tips, 3 sizes",
        price: 12.99,
        currency: "USD",
        sourcePlatform: "manual",
      },
    }),
    prisma.product.create({
      data: {
        id: "prod-5",
        userId: user.id,
        name: "LumiPro Desk Light",
        description: "LED desk lamp with adjustable color temperature",
        price: 59.99,
        currency: "EUR",
        sourcePlatform: "manual",
      },
    }),
  ]);

  // Campaign definitions matching mock-data.ts
  const campaignDefs = [
    {
      id: "1", name: "Bluetooth Earbuds US", productId: "prod-1", status: "active",
      dailyBudget: 50, minRoas: 1.0, targetMarket: "United States",
      startDate: new Date("2026-03-10"),
      creatives: [
        { id: "c1", name: "Creative A", headline: "Premium Sound, Zero Compromise", ctr: 2.8, roas: 3.8, status: "live", image: "🎧" },
        { id: "c2", name: "Creative B", headline: "Never Miss a Beat", ctr: 1.2, roas: 1.9, status: "live", image: "🎵" },
        { id: "c3", name: "Creative C", headline: "Music Without Limits", ctr: 2.1, roas: 3.1, status: "live", image: "🔊" },
      ],
      audience: [
        { segment: "25-28M", percentage: 38, roas: 4.2 },
        { segment: "29-34M", percentage: 26, roas: 3.1 },
        { segment: "25-28F", percentage: 17, roas: 2.8 },
        { segment: "35-44M", percentage: 12, roas: 1.4 },
        { segment: "Other", percentage: 7, roas: 0.9 },
      ],
      history: [
        { date: "2026-03-10", spend: 48, revenue: 120, roas: 2.5 },
        { date: "2026-03-12", spend: 50, revenue: 155, roas: 3.1 },
        { date: "2026-03-14", spend: 50, revenue: 142, roas: 2.8 },
        { date: "2026-03-16", spend: 49, revenue: 178, roas: 3.6 },
        { date: "2026-03-18", spend: 50, revenue: 190, roas: 3.8 },
        { date: "2026-03-20", spend: 48, revenue: 185, roas: 3.9 },
        { date: "2026-03-22", spend: 50, revenue: 195, roas: 3.9 },
        { date: "2026-03-24", spend: 50, revenue: 180, roas: 3.6 },
        { date: "2026-03-26", spend: 49, revenue: 192, roas: 3.9 },
        { date: "2026-03-28", spend: 50, revenue: 200, roas: 4.0 },
      ],
    },
    {
      id: "2", name: "Yoga Pants EU", productId: "prod-2", status: "active",
      dailyBudget: 40, minRoas: 1.0, targetMarket: "Europe",
      startDate: new Date("2026-03-05"),
      creatives: [
        { id: "c4", name: "Creative A", headline: "Flex Without Limits", ctr: 3.1, roas: 4.5, status: "live", image: "🧘" },
        { id: "c5", name: "Creative B", headline: "Comfort Meets Performance", ctr: 2.4, roas: 3.8, status: "live", image: "💪" },
      ],
      audience: [
        { segment: "25-34F", percentage: 45, roas: 4.8 },
        { segment: "35-44F", percentage: 28, roas: 3.5 },
        { segment: "18-24F", percentage: 15, roas: 3.2 },
        { segment: "Other", percentage: 12, roas: 2.1 },
      ],
      history: [
        { date: "2026-03-05", spend: 38, revenue: 140, roas: 3.7 },
        { date: "2026-03-08", spend: 40, revenue: 156, roas: 3.9 },
        { date: "2026-03-11", spend: 40, revenue: 160, roas: 4.0 },
        { date: "2026-03-14", spend: 39, revenue: 168, roas: 4.3 },
        { date: "2026-03-17", spend: 40, revenue: 172, roas: 4.3 },
        { date: "2026-03-20", spend: 41, revenue: 164, roas: 4.0 },
        { date: "2026-03-23", spend: 40, revenue: 180, roas: 4.5 },
        { date: "2026-03-26", spend: 42, revenue: 178, roas: 4.2 },
      ],
    },
    {
      id: "3", name: "Phone Cases US", productId: "prod-3", status: "active",
      dailyBudget: 25, minRoas: 1.0, targetMarket: "United States",
      startDate: new Date("2026-03-15"),
      creatives: [
        { id: "c6", name: "Creative A", headline: "Protection That Stands Out", ctr: 2.2, roas: 3.0, status: "live", image: "📱" },
        { id: "c7", name: "Creative B", headline: "Drop-Proof Guaranteed", ctr: 1.9, roas: 2.5, status: "live", image: "🛡️" },
      ],
      audience: [
        { segment: "18-24M", percentage: 32, roas: 3.2 },
        { segment: "25-34M", percentage: 28, roas: 2.9 },
        { segment: "18-24F", percentage: 22, roas: 2.5 },
        { segment: "Other", percentage: 18, roas: 1.8 },
      ],
      history: [
        { date: "2026-03-15", spend: 24, revenue: 60, roas: 2.5 },
        { date: "2026-03-18", spend: 25, revenue: 68, roas: 2.7 },
        { date: "2026-03-21", spend: 25, revenue: 72, roas: 2.9 },
        { date: "2026-03-24", spend: 24, revenue: 75, roas: 3.1 },
        { date: "2026-03-27", spend: 25, revenue: 70, roas: 2.8 },
        { date: "2026-03-30", spend: 25, revenue: 74, roas: 3.0 },
      ],
    },
    {
      id: "4", name: "Earbuds Accessories UK", productId: "prod-4", status: "active",
      dailyBudget: 20, minRoas: 1.0, targetMarket: "United Kingdom",
      startDate: new Date("2026-03-18"),
      creatives: [
        { id: "c8", name: "Creative A", headline: "Upgrade Your Sound", ctr: 2.6, roas: 3.7, status: "live", image: "🎶" },
      ],
      audience: [
        { segment: "25-34M", percentage: 40, roas: 3.8 },
        { segment: "25-34F", percentage: 30, roas: 3.4 },
        { segment: "35-44M", percentage: 20, roas: 2.9 },
        { segment: "Other", percentage: 10, roas: 1.5 },
      ],
      history: [
        { date: "2026-03-18", spend: 18, revenue: 58, roas: 3.2 },
        { date: "2026-03-21", spend: 20, revenue: 72, roas: 3.6 },
        { date: "2026-03-24", spend: 19, revenue: 70, roas: 3.7 },
        { date: "2026-03-27", spend: 20, revenue: 74, roas: 3.7 },
        { date: "2026-03-30", spend: 20, revenue: 68, roas: 3.4 },
      ],
    },
    {
      id: "5", name: "LED Desk Lamp DE", productId: "prod-5", status: "paused",
      dailyBudget: 30, minRoas: 1.0, currency: "EUR", targetMarket: "Germany",
      startDate: new Date("2026-03-01"),
      creatives: [
        { id: "c9", name: "Creative A", headline: "Light Up Your Workspace", ctr: 0.8, roas: 0.8, status: "live", image: "💡" },
      ],
      audience: [
        { segment: "25-34M", percentage: 35, roas: 1.0 },
        { segment: "35-44M", percentage: 30, roas: 0.7 },
        { segment: "Other", percentage: 35, roas: 0.6 },
      ],
      history: [
        { date: "2026-03-01", spend: 28, revenue: 20, roas: 0.7 },
        { date: "2026-03-04", spend: 30, revenue: 22, roas: 0.7 },
        { date: "2026-03-07", spend: 25, revenue: 24, roas: 1.0 },
        { date: "2026-03-10", spend: 12, revenue: 10, roas: 0.8 },
      ],
    },
  ];

  for (const def of campaignDefs) {
    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        id: def.id,
        userId: user.id,
        productId: def.productId,
        name: def.name,
        status: def.status,
        dailyBudget: def.dailyBudget,
        minRoas: def.minRoas,
        currency: def.currency || "USD",
        targetMarket: def.targetMarket,
        startDate: def.startDate,
      },
    });

    // Create creatives
    for (const cr of def.creatives) {
      await prisma.creative.create({
        data: {
          id: cr.id,
          userId: user.id,
          campaignId: campaign.id,
          headline: cr.headline,
          status: cr.status,
          ctr: cr.ctr,
          roas: cr.roas,
          image: cr.image,
          bodyText: cr.name,
        },
      });
    }

    // Create audience metrics
    for (const aud of def.audience) {
      await prisma.audienceMetric.create({
        data: {
          campaignId: campaign.id,
          segmentKey: aud.segment,
          percentage: aud.percentage,
          roas: aud.roas,
        },
      });
    }

    // Create performance history
    for (const h of def.history) {
      await prisma.campaignMetric.create({
        data: {
          campaignId: campaign.id,
          date: new Date(h.date),
          spend: h.spend,
          revenue: h.revenue,
          roas: h.roas,
          orders: Math.round(h.revenue / 20),
        },
      });
    }
  }

  // Create optimization (action item)
  await prisma.optimization.create({
    data: {
      id: "opt-1",
      campaignId: "1",
      type: "creative",
      status: "proposed",
      description: "Creative fatigue detected — CTR dropped 23% in 3 days. Generate 3 new creative variants to replace fatigued assets.",
      expectedImpact: "Restore CTR to previous levels, estimated +15% ROAS",
      riskLevel: "low",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`  - 1 user`);
  console.log(`  - 1 meta account`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${campaignDefs.length} campaigns`);
  console.log(`  - ${campaignDefs.reduce((s, d) => s + d.creatives.length, 0)} creatives`);
  console.log(`  - ${campaignDefs.reduce((s, d) => s + d.history.length, 0)} metric records`);
  console.log(`  - ${campaignDefs.reduce((s, d) => s + d.audience.length, 0)} audience segments`);
  console.log(`  - 1 optimization`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
