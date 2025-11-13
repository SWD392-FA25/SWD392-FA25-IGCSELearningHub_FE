"use client"

import { useEffect, useState } from 'react'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { LivestreamDetailDialog } from "@/components/teacher/livestream-detail-dialog"
import { useAuth } from "@/hooks/useAuth"
import { Livestream, getLivestreamsByTeacherId } from "@/services/livestreamService"
import { getCourseById } from "@/services/courseService"
import { Calendar, Users, DollarSign, Video, Eye } from "lucide-react"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [livestreams, setLivestreams] = useState<Livestream[]>([])
  const [courseMap, setCourseMap] = useState<Map<number, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 9

  useEffect(() => {
    if (user?.id) {
      fetchLivestreams()
    }
  }, [user, currentPage])

  const fetchLivestreams = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await getLivestreamsByTeacherId(user.id, currentPage, pageSize)
      
      // Filter livestreams to only show the ones belonging to this teacher
      const teacherLivestreams = response.data.filter(ls => ls.teacherId === user.id)
      
      setLivestreams(teacherLivestreams)
      // Update pagination based on filtered results
      const filteredTotalCount = teacherLivestreams.length
      const filteredTotalPages = Math.ceil(filteredTotalCount / pageSize)
      setTotalPages(filteredTotalPages)
      setTotalCount(filteredTotalCount)

      // Fetch course names
      const uniqueCourseIds = [...new Set(teacherLivestreams.map(ls => ls.courseId))]
      const newCourseMap = new Map<number, string>()
      
      await Promise.all(
        uniqueCourseIds.map(async (courseId) => {
          try {
            const course = await getCourseById(courseId)
            newCourseMap.set(courseId, course.title)
          } catch (error) {
            console.error(`Failed to fetch course ${courseId}:`, error)
            newCourseMap.set(courseId, `Course ${courseId}`)
          }
        })
      )
      
      setCourseMap(newCourseMap)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch livestreams')
      console.error('Error fetching livestreams:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (livestream: Livestream) => {
    setSelectedLivestream(livestream)
    setDetailOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <LivestreamDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        livestream={selectedLivestream}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || user?.userName}! Here are your livestream sessions.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your livestreams...</p>
          </div>
        ) : livestreams.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Video className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Livestreams Yet
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any scheduled livestream sessions at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livestreams.map((livestream) => (
                <Card
                  key={livestream.id}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-gradient-to-br from-primary/5 via-background to-background"
                >
                  <CardContent className="p-0">
                    {/* Header section */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <Video className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold text-primary">
                            #{livestream.id}
                          </span>
                        </div>
                        
                        {/* Status Badge */}
                        {new Date(livestream.schedule) > new Date() ? (
                          <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></div>
                            Upcoming
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            Completed
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {livestream.title}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {courseMap.get(livestream.courseId) || `Course ${livestream.courseId}`}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-4 space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground font-medium mb-0.5">Schedule</p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {formatDate(livestream.schedule)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Students</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {livestream.registrationCount}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">Price</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400 truncate">
                              {formatPrice(livestream.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="px-6 pb-6">
                      <Button
                        onClick={() => handleViewDetails(livestream)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> livestreams
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-9 min-w-[2.5rem]"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
