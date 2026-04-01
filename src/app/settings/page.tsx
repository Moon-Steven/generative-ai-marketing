"use client";

import { useAuth } from "@/components/auth-provider";
import { User, CreditCard, Bell, Shield, Link2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="max-w-3xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <span className="text-sm">{toast}</span>
          <button onClick={() => setToast(null)} className="text-background/60 hover:text-background text-sm">✕</button>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Name</label>
              <input defaultValue={user?.name || ""} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Email</label>
              <input defaultValue={user?.email || ""} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button onClick={() => showToast("Profile updated")} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Save Changes
            </button>
          </div>
        </div>

        {/* Ad Account */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Ad Account</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div>
              <p className="text-sm font-medium text-emerald-800">Meta Ad Account Connected</p>
              <p className="text-xs text-emerald-600">act_123456789</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Active</span>
          </div>
        </div>

        {/* Plan */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Plan & Billing</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div>
              <p className="text-sm font-medium text-indigo-800">Pro Plan — $49/month</p>
              <p className="text-xs text-indigo-600">5 products, 20 creatives/month, priority support</p>
            </div>
            <button onClick={() => showToast("Upgrade flow coming soon")} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition">
              Upgrade
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Daily performance report", desc: "Receive a summary every morning", defaultOn: true },
              { label: "Action required alerts", desc: "Get notified when campaigns need attention", defaultOn: true },
              { label: "Budget guardrail triggers", desc: "Alert when spending limits are reached", defaultOn: true },
              { label: "Weekly digest email", desc: "Weekly summary of all campaigns", defaultOn: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={n.defaultOn} className="sr-only peer" onChange={() => showToast("Notification preference updated")} />
                  <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <button onClick={() => showToast("Password change flow coming soon")} className="text-sm text-primary hover:underline">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
