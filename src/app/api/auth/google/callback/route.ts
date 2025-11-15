/**
 * Google OAuth Callback Handler
 * Handles the OAuth callback from Google and exchanges code for tokens
 */

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state') // redirect URL
  const error = searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Google authentication failed')}`,
        request.url
      )
    )
  }

  // Validate code
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Missing authorization code', request.url)
    )
  }

  try {
    // Exchange code for Google ID token (you may need to implement token exchange)
    // For now, we'll call your backend's Google login endpoint with the code
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: code, // or googleIdToken if you exchange the code first
      }),
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Login failed' }))
      throw new Error(errorData.message || 'Google authentication failed')
    }

    const data = await response.json()

    // Store session in cookie
    const session = {
      user: data.data.userProfile,
      tokens: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      },
    }

    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Redirect to destination
    const redirectTo = state || '/pages/admin/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Authentication failed'
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
}
