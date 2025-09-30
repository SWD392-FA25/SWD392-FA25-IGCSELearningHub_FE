"use client"

import { cn } from "@/lib/cn"
import { BookOpen, GraduationCap, Users, School, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (item: string) => {
    setExpandedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 md:sticky md:top-0 md:z-30",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-sidebar-foreground">IGCSE-Learning Hub</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <School className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/courses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>Course Management</span>
          </Link>

          <div>
            <button
              onClick={() => toggleItem("user-management")}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expandedItems.includes("user-management") && "rotate-180",
                )}
              />
            </button>
            {expandedItems.includes("user-management") && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                <Link
                  href="/users/students"
                  className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  Student Role
                </Link>
                <Link
                  href="/users/parents"
                  className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  Parent Role
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/teachers"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <GraduationCap className="h-5 w-5" />
            <span>Teacher Management</span>
          </Link>

          <Link
            href="/classes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <School className="h-5 w-5" />
            <span>Class Management</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
