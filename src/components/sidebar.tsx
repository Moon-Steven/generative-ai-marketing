"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Paintbrush,
  Package,
  BarChart3,
  Settings,
  Zap,
  MessageCircle,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/creative-studio", label: "Creative Studio", icon: Paintbrush },
  { href: "#", label: "Products", icon: Package, disabled: true },
  { href: "#", label: "Insights", icon: BarChart3, disabled: true },
  { href: "#", label: "Settings", icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/onboarding") return null;

  return (
    <aside className="w-64 bg-sidebar-bg text-sidebar-text fixed h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">Marketing AI</h1>
            <p className="text-xs text-sidebar-text">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href) && item.href !== "#";
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-40 cursor-not-allowed"
                aria-disabled="true"
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Soon</span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-sidebar-active/15 text-white"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-sidebar-active" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Chat Agent CTA */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">AI Agent</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <p className="text-xs text-slate-400 mb-3">Chat with your growth agent anytime</p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-2 rounded-lg transition-colors">
            Open Chat
          </button>
        </div>
      </div>

      {/* User */}
      <div className="px-4 pb-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">Shaohua</p>
            <p className="text-xs text-sidebar-text">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
