"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { authService } from "@/services/auth-service"

interface RegisterResponse {
  succeeded?: boolean
  status?: string
  statusCode?: number
  message?: string
  data?: any
  details?: any
  errors?: any
  // For validation errors from API
  type?: string
  title?: string
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  })

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const validatePassword = (password: string) => {
    // Common password requirements - adjust based on API requirements
    return password.length >= 6
  }

  const validateUsername = (username: string) => {
    return username.length >= 3 && username.length <= 50
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setFieldErrors({})
    setSuccess("")

    try {
      // Client-side validation
      if (!formData.userName.trim()) {
        setError("Username is required")
        return
      }

      if (!validateUsername(formData.userName)) {
        setError("Username must be between 3 and 50 characters")
        return
      }

      if (!formData.fullName.trim()) {
        setError("Full name is required")
        return
      }

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address")
        return
      }

      if (!validatePassword(formData.password)) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!formData.phoneNumber.trim()) {
        setError("Phone number is required")
        return
      }

      if (!validatePhone(formData.phoneNumber)) {
        setError("Please enter a valid phone number")
        return
      }

      // Call register service directly
      const data = await authService.register({
        userName: formData.userName,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      })

      if (data.succeeded || data.succeeded === undefined) {
        setSuccess("Registration successful! You can now login with your credentials.")
        // Reset form
        setFormData({
          userName: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: ""
        })
      } else {
        // Handle validation errors from API
        if (data.errors && typeof data.errors === 'object') {
          // Map API field names to form field names
          const fieldMapping: Record<string, string> = {
            'UserName': 'userName',
            'FullName': 'fullName',
            'Email': 'email',
            'Password': 'password',
            'PhoneNumber': 'phoneNumber'
          }
          
          const mappedErrors: Record<string, string[]> = {}
          Object.entries(data.errors).forEach(([key, value]) => {
            const mappedKey = fieldMapping[key] || key.toLowerCase()
            mappedErrors[mappedKey] = Array.isArray(value) ? value : [value as string]
          })
          
          setFieldErrors(mappedErrors)
          setError("Please fix the errors below and try again.")
        } else {
          setError(data.message || "Registration failed. Please try again.")
        }
      }
    } catch (err) {
      setError("Failed to register. Please check your connection and try again.")
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us and start your IGCSE learning journey</p>
        </div>

        {/* Register Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username *</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your username (3-50 characters)"
                value={formData.userName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full ${fieldErrors.userName ? 'border-destructive' : ''}`}
              />
              {fieldErrors.userName && (
                <div className="text-sm text-destructive">
                  {fieldErrors.userName.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full ${fieldErrors.fullName ? 'border-destructive' : ''}`}
              />
              {fieldErrors.fullName && (
                <div className="text-sm text-destructive">
                  {fieldErrors.fullName.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full ${fieldErrors.email ? 'border-destructive' : ''}`}
              />
              {fieldErrors.email && (
                <div className="text-sm text-destructive">
                  {fieldErrors.email.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number (e.g., +84901234567)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full ${fieldErrors.phoneNumber ? 'border-destructive' : ''}`}
              />
              {fieldErrors.phoneNumber && (
                <div className="text-sm text-destructive">
                  {fieldErrors.phoneNumber.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className={`w-full ${fieldErrors.password ? 'border-destructive' : ''}`}
              />
              {fieldErrors.password && (
                <div className="text-sm text-destructive">
                  {fieldErrors.password.map((err, index) => (
                    <p key={index}>{err}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 mt-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Access to all IGCSE courses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Track your learning progress</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Get certificates upon completion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Access to expert instructors</span>
            </li>
          </ul>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By creating an account, you agree to our{" "}
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