"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAccountById, AccountDetail } from "@/services/accountService"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Shield } from "lucide-react"

interface ProfileDialogProps {
  accountId: number
  open: boolean
  onClose: () => void
}

export function ProfileDialog({ accountId, open, onClose }: ProfileDialogProps) {
  const [profile, setProfile] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await getAccountById(accountId)
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && accountId) {
      loadProfile()
    }
  }, [open, accountId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile Information</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-sm text-muted-foreground">@{profile.userName}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={profile.status === "Active" ? "default" : "secondary"}>
                  {profile.status}
                </Badge>
                <Badge variant="outline">{profile.role}</Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-sm">{profile.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-sm capitalize">{profile.gender}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-sm">{formatDate(profile.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Authentication</p>
                  <p className="text-sm">
                    {profile.isExternal
                      ? `External (${profile.externalProvider})`
                      : "Internal"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No profile data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
