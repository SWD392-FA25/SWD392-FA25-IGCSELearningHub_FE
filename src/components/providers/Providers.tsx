'use client'

import { AuthProvider } from '@/hooks/useAuth'
import { SearchProvider } from '@/context/SearchContext'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SearchProvider>
        {children}
      </SearchProvider>
    </AuthProvider>
  )
}
