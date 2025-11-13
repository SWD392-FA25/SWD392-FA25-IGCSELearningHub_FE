"use client";

import React from "react";
import { QuizSummary } from "@/types/api-types";
import { Button } from "@/components/ui/Button";

interface QuizListProps {
  quizzes: QuizSummary[];
  onStartQuiz: (quizId: number) => void;
  loading?: boolean;
}

export function QuizList({ quizzes, onStartQuiz, loading }: QuizListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No quizzes available for this course.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {quiz.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{quiz.totalQuestions} questions</span>
                <span>•</span>
                <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button
              onClick={() => onStartQuiz(quiz.id)}
              size="sm"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
