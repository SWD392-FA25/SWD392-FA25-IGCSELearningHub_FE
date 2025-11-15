'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getSubmissionsByAssignment,
  gradeSubmission,
  Submission,
} from '@/services/assignmentService'
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Star,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface AssignmentSubmissionDialogProps {
  assignmentId: number | null
  assignmentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignmentSubmissionDialog({
  assignmentId,
  assignmentTitle,
  open,
  onOpenChange,
}: AssignmentSubmissionDialogProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)
  const [grading, setGrading] = useState(false)
  const [gradeValue, setGradeValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchSubmissions = async () => {
    if (!assignmentId) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await getSubmissionsByAssignment(
        assignmentId,
        currentPage,
        pageSize
      )
      setSubmissions(response.data)
      setFilteredSubmissions(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch submissions')
      console.error('Error fetching submissions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && assignmentId) {
      fetchSubmissions()
      setSearchQuery('')
      setSelectedSubmission(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, assignmentId, currentPage])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSubmissions(submissions)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = submissions.filter(
        (sub) =>
          sub.accountUserName.toLowerCase().includes(query) ||
          sub.submissionId.toString().includes(query) ||
          sub.accountId.toString().includes(query)
      )
      setFilteredSubmissions(filtered)
    }
  }, [searchQuery, submissions])

  const handleGradeSubmit = async () => {
    if (!selectedSubmission || !assignmentId) return

    const grade = parseFloat(gradeValue)
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100')
      return
    }

    try {
      setGrading(true)
      await gradeSubmission(selectedSubmission.submissionId, grade)
      
      // Refresh submissions
      await fetchSubmissions()
      
      // Clear form
      setSelectedSubmission(null)
      setGradeValue('')
      
      alert('Submission graded successfully!')
    } catch (err) {
      const error = err as Error
      alert(error.message || 'Failed to grade submission')
    } finally {
      setGrading(false)
    }
  }

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setGradeValue(submission.score?.toString() || '')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (score: number | null) => {
    if (score !== null) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-green-600 bg-green-50">
          <CheckCircle className="h-3 w-3" />
          Graded
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-50">
        <Clock className="h-3 w-3" />
        Pending
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Submissions: {assignmentTitle}
          </DialogTitle>
          <DialogDescription>
            View and grade student submissions for this assignment
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">All Submissions</h3>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {totalCount} Total
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading submissions...
                  </p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-4">
                    {searchQuery
                      ? 'No submissions found matching your search.'
                      : 'No submissions yet for this assignment.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {filteredSubmissions.map((submission) => (
                      <Card
                        key={submission.submissionId}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedSubmission?.submissionId === submission.submissionId
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">
                                  {submission.accountUserName}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                Account ID: {submission.accountId}
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDate(submission.submittedDate)}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(submission.score)}
                              {submission.score !== null && (
                                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                  <Star className="h-4 w-4" />
                                  {submission.score}/100
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Submission Detail & Grading */}
            <div className="space-y-4">
              {selectedSubmission ? (
                <>
                  <Card>
                    <CardHeader className="border-b bg-muted/50">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Submission Detail
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Student</Label>
                        <p className="text-lg font-semibold">
                          {selectedSubmission.accountUserName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Account ID: {selectedSubmission.accountId}
                        </p>
                      </div>

                      <div>
                        <Label className="text-muted-foreground">
                          Submitted At
                        </Label>
                        <p className="text-sm">
                          {formatDate(selectedSubmission.submittedDate)}
                        </p>
                      </div>

                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="mt-1">
                          {getStatusBadge(selectedSubmission.score)}
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground">
                          Current Score
                        </Label>
                        <p className="text-lg font-semibold text-primary">
                          {selectedSubmission.score !== null ? `${selectedSubmission.score}/100` : 'Not graded yet'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="border-b bg-muted/50">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        Grade Submission
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label htmlFor="grade">
                          Score (0-100) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="grade"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          placeholder="Enter score"
                          value={gradeValue}
                          onChange={(e) => setGradeValue(e.target.value)}
                          className="mt-2"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enter a score between 0 and 100
                        </p>
                      </div>

                      <Button
                        onClick={handleGradeSubmit}
                        disabled={grading || !gradeValue}
                        className="w-full"
                      >
                        {grading ? 'Submitting...' : 'Submit Score'}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      Select a submission to view details and grade
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
