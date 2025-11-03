"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { accountService, UpdateAccountRequest } from "@/services/account-service"
import { AccountDetail } from "@/types/api-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    phoneNumber: '',
    email: '' // Read-only but needed for API
  })

  useEffect(() => {
    async function fetchProfile() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
        if (!token || !userId) {
          setError('Authentication data not found')
          setLoading(false)
          return
        }

        const response = await accountService.getAccountById(parseInt(userId), token)
        
        if (response.succeeded && response.data) {
          setProfile(response.data)
          // Update local storage with fresh data
          localStorage.setItem('user', JSON.stringify(response.data))
          // Initialize form data
          setFormData({
            fullName: response.data.fullName,
            userName: response.data.userName,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email
          })
        } else {
          setError(response.message || 'Failed to load profile')
        }
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated])

  const handleEditToggle = () => {
    if (isEditing && profile) {
      // Cancel edit - reset form data
      setFormData({
        fullName: profile.fullName,
        userName: profile.userName,
        phoneNumber: profile.phoneNumber,
        email: profile.email
      })
    }
    setIsEditing(!isEditing)
    setSaveMessage(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setSaveMessage(null)

    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      if (!token || !userId) {
        setSaveMessage({ type: 'error', text: 'Authentication data not found' })
        setSaving(false)
        return
      }

      const updateData: UpdateAccountRequest = {
        fullName: formData.fullName,
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        email: formData.email // Email không đổi nhưng phải gửi lên
      }

      const response = await accountService.updateAccount(parseInt(userId), updateData, token)

      if (response.succeeded && response.data) {
        setProfile(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        setFormData({
          fullName: response.data.fullName,
          userName: response.data.userName,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email
        })
        setIsEditing(false)
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ 
          type: 'error', 
          text: response.message || 'Failed to update profile' 
        })
      }
    } catch (err) {
      console.error('Update error:', err)
      setSaveMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please login to view your profile.</p>
            <Link 
              href="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            {profile && !loading && (
              <Button
                onClick={handleEditToggle}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            )}
          </div>

          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              saveMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {saveMessage.text}
            </div>
          )}
          
          {loading ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : profile ? (
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg text-foreground mt-1">{profile.fullName}</p>
                  )}
                </div>
                
                {/* Username */}
                <div>
                  <Label htmlFor="userName">Username</Label>
                  {isEditing ? (
                    <Input
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg text-foreground mt-1">{profile.userName}</p>
                  )}
                </div>
                
                {/* Email - Read Only */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <p className="text-lg text-foreground mt-1">{profile.email}</p>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-lg text-foreground mt-1">{profile.phoneNumber || 'Not provided'}</p>
                  )}
                </div>
                
                {/* Save Button in Edit Mode */}
                {isEditing && (
                  <div className="pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border my-6"></div>
                
                {/* Read-only Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Account Information</h3>

                  <div>
                    <Label>Account Type</Label>
                    <p className="text-lg text-foreground mt-1">
                      {profile.isExternal ? `External (${profile.externalProvider})` : 'Local Account'}
                    </p>
                  </div>
                  
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-lg text-foreground mt-1">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}