"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Protected } from "@/components/auth/Protected"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Protected roles={["Admin"]}>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </div>
    </Protected>
  )
}
