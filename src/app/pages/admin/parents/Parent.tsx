"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { ParentDetailDialog } from "@/components/admin/parents/parent-detail-dialog"

interface Parent {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  children: string[]
}

export default function ParentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [parents, setParents] = useState<Parent[]>([
    {
      id: "P001",
      name: "Robert Doe",
      email: "robert.doe@example.com",
      status: "Online",
      children: ["John Doe"],
    },
    {
      id: "P002",
      name: "Mary Smith",
      email: "mary.smith@example.com",
      status: "Offline",
      children: ["Jane Smith"],
    },
    {
      id: "P003",
      name: "David Johnson",
      email: "david.j@example.com",
      status: "Online",
      children: ["Mike Johnson"],
    },
  ])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this parent account?")) {
      setParents(parents.filter((p) => p.id !== id))
    }
  }

  const handleViewDetail = (parent: Parent) => {
    setSelectedParent(parent)
    setDetailOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Parent Management</h1>
                <p className="mt-1 text-muted-foreground">Manage parent accounts and relationships</p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Parent
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Parents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">User ID</th>
                        <th className="pb-3 font-medium text-muted-foreground">User Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Email</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parents.map((parent) => (
                        <tr key={parent.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{parent.id}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/.jpg?height=40&width=40&query=${parent.name}`}
                                />
                                <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{parent.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{parent.email}</td>
                          <td className="py-4">
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
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewDetail(parent)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(parent.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {selectedParent && <ParentDetailDialog parent={selectedParent} open={detailOpen} onOpenChange={setDetailOpen} />}
    </div>
  )
}
