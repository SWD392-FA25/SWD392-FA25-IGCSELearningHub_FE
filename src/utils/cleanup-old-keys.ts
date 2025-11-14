/**
 * Cleanup Old LocalStorage Keys
 * Script to remove deprecated igl.* keys from localStorage
 * Run this in browser console after migration
 */

export function cleanupOldAuthKeys() {
  if (typeof window === 'undefined') {
    console.warn('This script must run in browser context')
    return
  }

  console.log('🧹 Starting cleanup of old auth keys...')

  const oldKeys = [
    'igl.session',
    'igl.accessToken',
    'igl.refreshToken',
    'igl.user',
    'igl.guest',
  ]

  let cleanedCount = 0

  oldKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      console.log(`✅ Removed: ${key}`)
      cleanedCount++
    } else {
      console.log(`⏭️  Not found: ${key}`)
    }
  })

  // Also clean old cookies
  const oldCookies = [
    'igl.accessToken',
    'igl.refreshToken',
    'igl.user',
    'igl.guest',
  ]

  oldCookies.forEach((cookieName) => {
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    console.log(`🍪 Cleared cookie: ${cookieName}`)
  })

  console.log(
    `\n🎉 Cleanup complete! Removed ${cleanedCount} localStorage keys`
  )
  console.log('✅ Old igl.* keys have been removed')
  console.log('✅ Old cookies have been cleared')
  console.log('\n📦 Current auth keys:')
  console.log('  - auth-storage (Zustand)')
  console.log('  - jwtToken')
  console.log('  - refreshToken')
  console.log('  - userData')
  console.log('  - isGuest')
}

// Auto-run in browser console
if (typeof window !== 'undefined') {
  // Check if old keys exist
  const hasOldKeys = Object.keys(localStorage).some((k) => k.startsWith('igl.'))

  if (hasOldKeys) {
    console.log('⚠️  Detected old igl.* keys in localStorage')
    console.log('💡 Run cleanupOldAuthKeys() to remove them')
  }
}
