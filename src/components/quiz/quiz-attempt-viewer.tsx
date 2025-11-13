"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { QuizAttemptResult, QuizForTake } from "@/types/api-types";
import { quizService } from "@/services/quiz-service";
import { QuizResult } from "./quiz-result";
import { Button } from "@/components/ui/Button";

interface QuizAttemptViewerProps {
  quizId: number | null;
  attemptId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizAttemptViewer({
  quizId,
  attemptId,
  isOpen,
  onClose,
}: QuizAttemptViewerProps) {
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [quiz, setQuiz] = useState<QuizForTake | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && quizId && attemptId) {
      loadAttemptDetails();
    } else {
      resetState();
    }
  }, [isOpen, quizId, attemptId]);

  const resetState = () => {
    setResult(null);
    setQuiz(null);
    setError("");
  };

  const loadAttemptDetails = async () => {
    if (!quizId || !attemptId) return;

    setLoading(true);
    setError("");
    try {
      const [resultResponse, quizResponse] = await Promise.all([
        quizService.getQuizAttemptResult(quizId, attemptId),
        quizService.getQuizForTake(quizId),
      ]);

      if (resultResponse.succeeded && resultResponse.data) {
        setResult(resultResponse.data);
      } else {
        throw new Error(resultResponse.message || "Failed to load result");
      }

      if (quizResponse.succeeded && quizResponse.data) {
        setQuiz(quizResponse.data);
      } else {
        throw new Error(quizResponse.message || "Failed to load quiz");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load attempt details. Please try again."
      );
      console.error("Error loading attempt details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quiz Attempt Details"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      destroyOnClose
    >
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={loadAttemptDetails}>Retry</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && result && quiz && (
        <QuizResult result={result} quiz={quiz} onClose={onClose} />
      )}
    </Modal>
  );
}
