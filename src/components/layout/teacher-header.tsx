"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getStoredUser, clearAuthData } from "@/services/authService"
import { ProfileDialog } from "@/components/teacher/profile-dialog"

export function TeacherHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const userData = getStoredUser()
    setUser(userData)
  }, [])

  const handleLogout = () => {
    clearAuthData()
    setUser(null)
    window.location.href = '/login'
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">IGCSE-Learning Hub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/teacher"
                className={`text-sm font-medium transition-colors ${
                  isActive("/teacher") ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/teacher/courses"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/teacher/courses") ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                My Courses
              </Link>
            </nav>

            {/* Desktop Login/User Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => setShowProfile(true)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {user.fullName || user.userName}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-border">
              <nav className="flex flex-col gap-2 pt-4">
                <Link
                  href="/teacher"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive("/teacher") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/teacher/courses"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pathname.startsWith("/teacher/courses") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Courses
                </Link>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setShowProfile(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-4 py-2 text-sm font-medium text-foreground border-t border-border text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      {user.fullName || user.userName}
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Profile Dialog */}
      {user && (
        <ProfileDialog
          accountId={user.id}
          open={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  )
}
