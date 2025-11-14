/**
 * Sign Out Button Component
 * Button to sign out user
 */

'use client'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  children?: React.ReactNode
}

export function SignOutButton({
  variant = 'ghost',
  size = 'default',
  showIcon = true,
  children,
}: SignOutButtonProps) {
  const { signOut, loading } = useAuth()

  return (
    <Button variant={variant} size={size} onClick={signOut} disabled={loading}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || 'Sign Out'}
    </Button>
  )
}
