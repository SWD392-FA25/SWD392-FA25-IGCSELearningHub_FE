"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Users } from "lucide-react"

interface Parent {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  children: string[]
}

interface ParentDetailDialogProps {
  parent: Parent
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ParentDetailDialog({ parent, open, onOpenChange }: ParentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Parent Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/.jpg?height=80&width=80&query=${parent.name}`} />
              <AvatarFallback className="text-2xl">{parent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{parent.name}</h3>
              <p className="text-sm text-muted-foreground">Parent ID: {parent.id}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {parent.email}
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                parent.status === "Online"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              <span
                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${parent.status === "Online" ? "bg-green-600" : "bg-gray-600"}`}
              />
              {parent.status}
            </Badge>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Parent of</h4>
            </div>
            <div className="space-y-2">
              {parent.children.map((child, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/.jpg?height=40&width=40&query=${child}`} />
                    <AvatarFallback>{child.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{child}</p>
                    <p className="text-sm text-muted-foreground">Student</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold">Additional Information</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Account created: August 15, 2024</p>
              <p>• Number of children: {parent.children.length}</p>
              <p>• Last login: 2 hours ago</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
