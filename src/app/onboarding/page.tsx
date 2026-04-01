"use client";

import { useState } from "react";
import { Zap, Globe, ShoppingBag, DollarSign, Check, ArrowRight, ArrowLeft, Rocket, Link2, Shield } from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Connect Meta", icon: Globe },
  { label: "Import Product", icon: ShoppingBag },
  { label: "Set Budget", icon: DollarSign },
  { label: "Launch", icon: Rocket },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [metaConnected, setMetaConnected] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [productImported, setProductImported] = useState(false);
  const [dailyBudget, setDailyBudget] = useState("50");
  const [minRoas, setMinRoas] = useState("1.0");
  const [selectedDirection, setSelectedDirection] = useState<number | null>(null);
  const [launched, setLaunched] = useState(false);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Generative-AI-in-Marketing</h1>
          <p className="text-muted-foreground text-sm mt-1">Launch your first ad in 5 minutes</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isDone ? "bg-success text-white" : isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-1.5 ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 mb-5 ${i < currentStep ? "bg-success" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
          {/* Step 1: Connect Meta */}
          {currentStep === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect Your Meta Ad Account</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                We need access to your Meta (Facebook/Instagram) ad account to create and manage campaigns on your behalf.
              </p>
              {!metaConnected ? (
                <div>
                  <button
                    onClick={() => setMetaConnected(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-blue-500 transition flex items-center gap-2 mx-auto"
                  >
                    <Globe className="w-4 h-4" />
                    Connect with Meta
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Secure OAuth — we never store your password</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-emerald-800">Connected Successfully</p>
                      <p className="text-xs text-emerald-600">Ad Account: Shaohua&apos;s Business</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Import Product */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Import Your Product</h3>
                <p className="text-muted-foreground text-sm">Paste your product URL and we&apos;ll extract everything automatically.</p>
              </div>
              {!productImported ? (
                <div className="max-w-md mx-auto">
                  <div className="relative mb-4">
                    <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://your-store.myshopify.com/products/..."
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={() => { setProductUrl("https://store.example.com/products/pro-max-earbuds"); setProductImported(true); }}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
                  >
                    Import Product
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">Supports Shopify, WooCommerce, and any public product page</p>
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-5 max-w-md mx-auto">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-4xl shrink-0">
                      🎧
                    </div>
                    <div>
                      <p className="font-semibold">Pro Max Earbuds</p>
                      <p className="text-sm text-muted-foreground mt-0.5">$49.99 · Bluetooth 5.3 · ANC</p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Product detected</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">3 images found</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Set Budget */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Set Your Budget & Guardrails</h3>
                <p className="text-muted-foreground text-sm">We&apos;ll protect your budget and pause ads automatically if performance drops.</p>
              </div>
              <div className="max-w-md mx-auto space-y-5">
                <div>
                  <label className="text-sm font-medium block mb-2">Daily Budget</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      min="5"
                      max="10000"
                      value={dailyBudget}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (Number(v) >= 0 && Number(v) <= 10000)) setDailyBudget(v);
                      }}
                      className="w-full pl-9 pr-16 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/ day</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {["20", "50", "100"].map((v) => (
                      <button key={v} onClick={() => setDailyBudget(v)} className={`text-xs px-3 py-1.5 rounded-lg border transition ${dailyBudget === v ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"}`}>
                        ${v}/day
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Minimum ROAS (Auto-pause below this)</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.1"
                      value={minRoas}
                      min="0.1"
                      max="10"
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setMinRoas(v);
                      }}
                      className="w-full pl-9 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Ads will automatically pause if ROAS drops below {minRoas}x — your money is protected.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-indigo-800">
                    <strong>Estimated:</strong> At ${dailyBudget || "0"}/day with a 2.0x ROAS, you could generate ~${(Number(dailyBudget) || 0) * 2}/day in revenue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Launch */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Choose Your Creative Direction</h3>
                <p className="text-muted-foreground text-sm">AI generated 3 directions based on your product and target market. Pick one to launch.</p>
              </div>
              {!launched ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { id: 0, title: "Premium Quality", copy: "Experience crystal-clear audio with our Pro Max Earbuds. 40hr battery life.", tone: "Premium", emoji: "✨" },
                      { id: 1, title: "Active Lifestyle", copy: "Your workout deserves better sound. Sweat-proof. Deep bass. Zero compromise.", tone: "Active", emoji: "🏃" },
                      { id: 2, title: "Value Proposition", copy: "Premium sound doesn't have to cost a fortune. Free shipping + 30-day guarantee.", tone: "Value", emoji: "💰" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDirection(d.id)}
                        className={`text-left p-4 rounded-xl border-2 transition ${
                          selectedDirection === d.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-3xl block mb-2">{d.emoji}</span>
                        <p className="text-sm font-semibold mb-1">{d.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{d.copy}</p>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-2 ${toneTag(d.tone)}`}>
                          {d.tone}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setLaunched(true)}
                    disabled={selectedDirection === null}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    Launch Campaign
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">Campaign Launched! 🎉</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Your ad is now live on Meta. We&apos;ll send you the first performance report tomorrow morning.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {!(currentStep === 3 && launched) && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {currentStep < 3 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={(currentStep === 0 && !metaConnected) || (currentStep === 1 && !productImported)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function toneTag(tone: string): string {
  const map: Record<string, string> = {
    Premium: "bg-purple-100 text-purple-700",
    Active: "bg-orange-100 text-orange-700",
    Value: "bg-emerald-100 text-emerald-700",
  };
  return map[tone] || "bg-slate-100 text-slate-600";
}
