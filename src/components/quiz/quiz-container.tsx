"use client";

import React, { useState, useEffect } from "react";
import { QuizSummary } from "@/types/api-types";
import { quizService } from "@/services/quiz-service";
import { QuizList } from "./quiz-list";
import { QuizModal } from "./quiz-modal";
import { Button } from "@/components/ui/Button";

interface QuizContainerProps {
  courseId: number;
  onClose?: () => void;
}

export function QuizContainer({ courseId, onClose }: QuizContainerProps) {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSummary | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuizzes();
  }, [courseId]);

  const loadQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await quizService.getQuizzesByCourse(courseId);
      if (response.succeeded && response.data) {
        setQuizzes(response.data);
      } else {
        setError(response.message || "Failed to load quizzes");
      }
    } catch (err) {
      setError("Failed to load quizzes. Please try again later.");
      console.error("Error loading quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setQuizModalOpen(true);
    }
  };

  const handleCloseQuizModal = () => {
    setQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadQuizzes}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Course Quizzes</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <QuizList
        quizzes={quizzes}
        onStartQuiz={handleStartQuiz}
        loading={loading}
      />

      <QuizModal
        quiz={selectedQuiz}
        isOpen={quizModalOpen}
        onClose={handleCloseQuizModal}
      />
    </div>
  );
}
