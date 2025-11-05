"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardMobileNav } from "./dashboard-mobile-nav";

export function DashboardNav() {
  return (
    <>
      <DashboardSidebar />
      <DashboardMobileNav />
    </>
  );
}
