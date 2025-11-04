'use client'

import { useEffect, useState } from 'react'

export default function TestAPIPage() {
  const [status, setStatus] = useState('Testing...')
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testAPI()
  }, [])

  const testAPI = async () => {
    try {
      setStatus('Loading API functions...')

      // Dynamic import to ensure client-side
      const apiModule = await import('@/services/api')
      const userServiceModule = await import('@/services/userService')

      setStatus('API functions loaded. Type: ' + typeof apiModule.fetchWithAuth)

      // Test fetching users
      setStatus('Fetching all accounts...')
      const allUsers = await userServiceModule.getAllAccounts()
      setUsers(allUsers)

      // Filter students
      const students = allUsers.filter((u) => u.role === 'Student')

      setStatus(
        `Success! Found ${allUsers.length} users, ${students.length} students`
      )
    } catch (err: any) {
      setError(err.message)
      setStatus('Error occurred')
      console.error('Test error:', err)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="mb-4">
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <strong>JWT Token:</strong>{' '}
        {typeof window !== 'undefined' && localStorage.getItem('jwtToken')
          ? 'Found ✅'
          : 'Not found ❌'}
      </div>

      {users.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Users ({users.length}):</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="p-2 border rounded">
                <div>
                  <strong>ID:</strong> {user.id}
                </div>
                <div>
                  <strong>Username:</strong> {user.userName}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Role:</strong> {user.role}
                </div>
                <div>
                  <strong>Status:</strong> {user.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
