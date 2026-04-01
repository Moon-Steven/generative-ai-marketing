"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <>
      {!isOnboarding && <Sidebar />}
      <main className={`flex-1 ${isOnboarding ? "" : "ml-64 p-8"} overflow-auto`}>
        {children}
      </main>
    </>
  );
}
