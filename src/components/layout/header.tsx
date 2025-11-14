"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
<<<<<<< HEAD
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
=======
import { useState, useEffect } from "react"
import { getStoredUser, clearAuthData } from "@/services/authService"
>>>>>>> master

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
<<<<<<< HEAD
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
=======
  const [user, setUser] = useState<any>(null)

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
>>>>>>> master

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
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
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors ${
                isActive("/courses") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              About
            </Link>
            {/* <Link
              href="/teacher"
              className={`text-sm font-medium transition-colors ${
                isActive("/teacher") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Teacher
            </Link> */}
          </nav>

<<<<<<< HEAD
          {/* Desktop Login/Register Buttons or User Menu */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {/* People Icon */}
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                
                {/* Dropdown Arrow */}
                <svg className="w-4 h-4 text-muted-foreground ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <p className="font-medium text-foreground">{user?.fullName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <div className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {user?.role}
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      
                      <Link
                        href="/my-learning"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Learning
                      </Link>
                      
                      <Link
                        href="/my-learning/quizzes"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        My Quizzes
                      </Link>
                      
                      {/* <Link
                        href="/assignments-quizzes"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Assignments & Quizzes
                      </Link> */}
                      
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Orders & Payment
                      </Link>
                    </div>
                    
                    <div className="border-t border-border py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
=======
          {/* Desktop Login/User Button */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {user.fullName || user.userName}
              </span>
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
>>>>>>> master
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
                href="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive("/") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive("/courses") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive("/about") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/teacher"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive("/teacher") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Teacher
              </Link>
<<<<<<< HEAD
              
              {/* Mobile User Menu or Login/Register */}
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {/* People Icon for Mobile */}
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user?.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Menu Items */}
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link
                    href="/my-learning"
                    className="flex items-center px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Learning
                  </Link>
                  
                  <Link
                    href="/my-learning/quizzes"
                    className="flex items-center px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    My Quizzes
                  </Link>
                  
                  {/* <Link
                    href="/assignments-quizzes"
                    className="flex items-center px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Assignments & Quizzes
                  </Link> */}
                  
                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Orders & Payment
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center w-full px-4 py-2 text-destructive hover:bg-muted rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
=======
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-foreground border-t border-border">
                    {user.fullName || user.userName}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  >
>>>>>>> master
                    Logout
                  </button>
                </>
              ) : (
<<<<<<< HEAD
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
=======
                <Link
                  href="/login"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
>>>>>>> master
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
