"use client"

import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { authService } from "@/services/auth-service"
import { auth } from "@/lib/firebase"

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
  const { signIn, signInWithGoogle } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get user role first to determine redirect
      const data = await authService.login({ username, password })

      if (data.succeeded && data.data) {
        // Determine redirect path based on role
        let redirectPath = '/'
        switch (data.data.role.toLowerCase()) {
          case 'admin':
            redirectPath = '/pages/admin/dashboard'
            break
          case 'teacher':
            redirectPath = '/teacher'
            break
          case 'student':
            redirectPath = '/'
            break
        }

        // Use signIn from useAuth hook with proper parameters
        await signIn({ emailOrUsername: username, password }, redirectPath)
        toast.success("Login successful!")
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await authService.loginWithGoogle()

      if (data.succeeded && data.data) {
        // Determine redirect path based on role
        let redirectPath = '/'
        switch (data.data.role.toLowerCase()) {
          case 'admin':
            redirectPath = '/pages/admin/dashboard'
            break
          case 'teacher':
            redirectPath = '/teacher'
            break
          case 'student':
            redirectPath = '/'
            break
        }

        // Get the Google ID token and use signInWithGoogle from useAuth hook
        const firebaseUser = auth.currentUser
        if (firebaseUser) {
          const googleIdToken = await firebaseUser.getIdToken()
          await signInWithGoogle(googleIdToken, redirectPath)
          toast.success("Google login successful!")
        }
      } else {
        setError(data.message || "Google login failed.")
        toast.error(data.message || "Google login failed")
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError(err instanceof Error ? err.message : "Failed to login with Google. Please try again.")
      toast.error("Failed to login with Google")
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

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
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
