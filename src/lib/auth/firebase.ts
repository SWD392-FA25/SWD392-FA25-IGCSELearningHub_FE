/**
 * Firebase Configuration and Authentication
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase configuration
function validateFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  )
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined

if (typeof window !== 'undefined' && validateFirebaseConfig()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

/**
 * Sign in with Google using Firebase
 * Returns the Firebase ID token
 */
export async function signInWithGoogle(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth can only be used in browser')
  }

  if (!auth || !validateFirebaseConfig()) {
    throw new Error(
      'Firebase is not configured. Please add Firebase environment variables to .env.local file. See FIREBASE_SETUP.md for instructions.'
    )
  }

  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')

  try {
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()
    return idToken
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

export { auth }
