"use client";

import React, { useState, useEffect } from "react";
import { QuizAttempt } from "@/types/api-types";
import { Button } from "@/components/ui/Button";
import { quizService } from "@/services/quiz-service";

interface QuizHistoryProps {
  onViewAttempt: (quizId: number, attemptId: number) => void;
}

export function QuizHistory({ onViewAttempt }: QuizHistoryProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadAttempts();
  }, [pageNumber]);

  const loadAttempts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quizService.getQuizAttempts(pageNumber, pageSize);
      if (response.succeeded && response.data) {
        setAttempts(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        setError(response.message || "Failed to load quiz history");
      }
    } catch (err) {
      setError("Failed to load quiz history. Please try again later.");
      console.error("Error loading quiz attempts:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScorePercentage = (score: number | null, maxScore: number) => {
    if (score === null || maxScore === 0) return 0;
    return (score / maxScore) * 100;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadAttempts}>Retry</Button>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quiz attempts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Quiz History</h2>
        <div className="text-sm text-muted-foreground">
          Total: {totalCount} attempt{totalCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {attempts.map((attempt) => {
          const percentage = getScorePercentage(attempt.score, attempt.maxScore);
          return (
            <div
              key={attempt.attemptId}
              className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {attempt.quizTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{formatDate(attempt.attemptDate)}</span>
                  </div>
                  {attempt.score !== null ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Score:{" "}
                        <span className={`font-semibold ${getScoreColor(percentage)}`}>
                          {attempt.score.toFixed(2)} / {attempt.maxScore}
                        </span>
                      </span>
                      <span className={`text-sm font-semibold ${getScoreColor(percentage)}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-orange-600">Not submitted</span>
                  )}
                </div>
                {attempt.score !== null && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewAttempt(attempt.quizId, attempt.attemptId)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
            disabled={pageNumber === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
