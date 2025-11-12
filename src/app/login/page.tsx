"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { authService } from "@/services/auth-service"

interface LoginResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: {
    jwtToken: string
    id: number
    userName: string
    fullName: string
    email: string
    role: string
    status: string
    isExternal: boolean
  }
  details: any
  errors: any
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call auth service directly
      const data = await authService.login({ username, password })

      if (data.succeeded && data.data) {
        // Use the login function from useAuth hook
        login(data.data, data.data.accessToken)

        // Redirect based on user role
        switch (data.data.role.toLowerCase()) {
          case 'admin':
            window.location.href = '/admin'
            break
          case 'teacher':
            window.location.href = '/teacher'
            break
          case 'student':
            window.location.href = '/student'
            break
          default:
            window.location.href = '/'
            break
        }
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      setError("Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-xl text-foreground">IGCSE-Learning Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your courses and continue learning</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Email or Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </div>

          {/* Guest Access */}
          <Link
            href="/"
            className="w-full flex items-center justify-center px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            Continue as Guest
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">Login Information</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-card border border-border rounded-lg">
              <p className="font-medium text-foreground">Sample Login</p>
              <p className="text-muted-foreground">Email: admin123@example.com</p>
              <p className="text-muted-foreground">Password: StrongPass123</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-primary/10">
            <h4 className="font-semibold text-foreground mb-2">Why sign in?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Track your learning progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Save your favorite courses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Access personalized recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Get certificates upon completion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
