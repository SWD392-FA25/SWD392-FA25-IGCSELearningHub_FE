/**
 * Sign Out API Route
 * Handles server-side logout by clearing session cookies
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear all auth-related cookies
    cookieStore.delete('session')
    cookieStore.delete('isGuest')

    return NextResponse.json(
      { success: true, message: 'Signed out successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
