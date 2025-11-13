"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import {
  QuizSummary,
  QuizForTake,
  QuizAnswer,
  QuizAttemptResult,
} from "@/types/api-types";
import { quizService } from "@/services/quiz-service";
import { QuizTaking } from "./quiz-taking";
import { QuizResult } from "./quiz-result";
import { Button } from "@/components/ui/Button";

type QuizState = "taking" | "result";

interface QuizModalProps {
  quiz: QuizSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ quiz, isOpen, onClose }: QuizModalProps) {
  const [state, setState] = useState<QuizState>("taking");
  const [quizData, setQuizData] = useState<QuizForTake | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && quiz) {
      loadQuizAndCreateAttempt();
    } else {
      resetState();
    }
  }, [isOpen, quiz]);

  const resetState = () => {
    setState("taking");
    setQuizData(null);
    setAttemptId(null);
    setQuizResult(null);
    setError("");
  };

  const loadQuizAndCreateAttempt = async () => {
    if (!quiz) return;

    setLoading(true);
    setError("");
    try {
      const [quizResponse, attemptResponse] = await Promise.all([
        quizService.getQuizForTake(quiz.id, false, true),
        quizService.createQuizAttempt(quiz.id),
      ]);

      if (quizResponse.succeeded && quizResponse.data) {
        setQuizData(quizResponse.data);
      } else {
        throw new Error(quizResponse.message || "Failed to load quiz");
      }

      if (attemptResponse.succeeded && attemptResponse.data) {
        setAttemptId(attemptResponse.data);
      } else {
        throw new Error(attemptResponse.message || "Failed to create attempt");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start quiz. Please try again."
      );
      console.error("Error starting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (answers: QuizAnswer[]) => {
    if (!quizData || !attemptId) return;

    setLoading(true);
    setError("");
    try {
      const response = await quizService.submitQuizAttempt(
        quizData.quizId,
        attemptId,
        { answers }
      );

      if (response.succeeded && response.data) {
        setQuizResult(response.data);
        setState("result");
        setTimeout(() => {
          const modalBody = document.querySelector('.ant-modal-body');
          if (modalBody) {
            modalBody.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        setError(response.message || "Failed to submit quiz");
      }
    } catch (err) {
      setError("Failed to submit quiz. Please try again later.");
      console.error("Error submitting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelQuiz = () => {
    onClose();
  };

  const handleCloseResult = () => {
    onClose();
  };

  return (
    <Modal
      title={
        state === "taking"
          ? `Taking Quiz: ${quiz?.title || ""}`
          : `Quiz Results: ${quiz?.title || ""}`
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
      destroyOnClose
    >
      {loading && !quizData && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      )}

      {error && !quizData && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={loadQuizAndCreateAttempt}>Retry</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}

      {state === "taking" && quizData && (
        <div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <QuizTaking
            quiz={quizData}
            onSubmit={handleSubmitQuiz}
            onCancel={handleCancelQuiz}
            loading={loading}
          />
        </div>
      )}

      {state === "result" && quizResult && quizData && (
        <QuizResult
          result={quizResult}
          quiz={quizData}
          onClose={handleCloseResult}
        />
      )}
    </Modal>
  );
}
