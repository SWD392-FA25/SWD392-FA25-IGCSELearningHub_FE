/**
 * Application Configuration
 * Centralized config for environment variables
 */

export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const

// Validate required environment variables
if (!config.apiBaseUrl) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is required')
}
