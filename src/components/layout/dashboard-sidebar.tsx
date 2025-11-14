'use client'

import { cn } from '@/lib/cn'
import {
  Baby,
  BookOpen,
  FileQuestion,
  FileText,
  GraduationCap,
  Package,
  School,
  UserPlus,
  Users,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-full bg-sidebar text-sidebar-foreground transition-all duration-300 overflow-hidden',
          isMobile 
            ? 'fixed left-0 top-0 z-50' 
            : 'sticky top-0 z-30',
          isOpen ? 'w-64' : 'w-16',
          isMobile && !isOpen && '-translate-x-full'
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border transition-all",
          isOpen ? "px-6 justify-between" : "px-4 justify-center"
        )}>
          {isOpen ? (
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-sidebar-foreground whitespace-nowrap overflow-hidden">IGCSE-Learning Hub</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center" title="IGCSE-Learning Hub">
              <GraduationCap className="h-6 w-6 text-primary" />
            </Link>
          )}
        </div>

        <nav className={cn("flex flex-col gap-2 p-4", !isOpen && "items-center px-2")}>
          <Link
            href="/pages/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname === "/pages/admin" && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Dashboard" : undefined}
          >
            <School className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Dashboard</span>}
          </Link>

          <Link
            href="/pages/admin/courses"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/courses") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Course Management" : undefined}
          >
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Course Management</span>}
          </Link>

          <Link
            href="/pages/admin/assignments"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/assignments") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Assignment Management" : undefined}
          >
            <FileText className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Assignment Management</span>}
          </Link>

          <Link
            href="/pages/admin/quizzes"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/quizzes") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Quiz Management" : undefined}
          >
            <FileQuestion className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Quiz Management</span>}
          </Link>

          <Link
            href="/pages/admin/enrollments"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/enrollments") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Enrollment Management" : undefined}
          >
            <UserPlus className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Enrollment Management</span>}
          </Link>

          <Link
            href="/pages/admin/livestreams"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/livestreams") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Livestream Management" : undefined}
          >
            <Video className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Livestream Management</span>}
          </Link>

          <Link
            href="/pages/admin/packages"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/packages") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Package Management" : undefined}
          >
            <Package className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Package Management</span>}
          </Link>

          <Link
            href="/pages/admin/students"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/students") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Student Role" : undefined}
          >
            <Baby className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Student Management</span>}
          </Link>

          <Link
            href="/pages/admin/teachers"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/teachers") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Teacher Management" : undefined}
          >
            <Users className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Teacher Management</span>}
          </Link>

          {/* <Link
            href="/pages/admin/classes"
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors overflow-hidden",
              isOpen ? "px-3" : "px-2 justify-center",
              pathname?.startsWith("/pages/admin/classes") && "bg-sidebar-accent text-primary font-semibold"
            )}
            title={!isOpen ? "Class Management" : undefined}
          >
            <School className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Class Management</span>}
          </Link> */}
        </nav>
      </aside>
    </>
  )
}
