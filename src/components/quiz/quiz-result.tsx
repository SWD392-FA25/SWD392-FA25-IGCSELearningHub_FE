"use client";

import React from "react";
import { QuizAttemptResult, QuizForTake } from "@/types/api-types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface QuizResultProps {
  result: QuizAttemptResult;
  quiz: QuizForTake;
  onClose: () => void;
}

export function QuizResult({ result, quiz, onClose }: QuizResultProps) {
  const percentage = (result.score / result.maxScore) * 100;
  const isPassed = percentage >= 60;

  const getQuestionById = (questionId: number) => {
    return quiz.questions.find((q) => q.questionId === questionId);
  };

  const getOptionById = (questionId: number, optionId: number | null) => {
    const question = getQuestionById(questionId);
    if (!question || !optionId) return null;
    return question.options.find((o) => o.optionId === optionId);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Quiz Completed!
          </h2>
          <div className="flex items-center justify-center gap-8 mb-4">
            <div>
              <div className="text-4xl font-bold text-primary">
                {result.score.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                out of {result.maxScore}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          <div
            className={`inline-block px-4 py-2 rounded-full ${
              isPassed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPassed ? "Passed" : "Not Passed"}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Completed on {new Date(result.attemptDate).toLocaleString()}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Answer Review</h3>
        {result.details.map((detail, index) => {
          const question = getQuestionById(detail.questionId);
          const selectedOption = getOptionById(
            detail.questionId,
            detail.selectedOptionId
          );

          if (!question) return null;

          return (
            <Card
              key={detail.questionId}
              className={`p-6 border-l-4 ${
                detail.isCorrect
                  ? "border-l-green-500"
                  : "border-l-red-500"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-foreground">
                  Question {index + 1}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      detail.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {detail.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {detail.awarded} / {question.points} points
                  </span>
                </div>
              </div>

              <p className="text-foreground mb-4">{question.stem}</p>

              <div className="space-y-2 mb-4">
                {question.options.map((option) => {
                  const isSelected = option.optionId === detail.selectedOptionId;
                  return (
                    <div
                      key={option.optionId}
                      className={`p-3 rounded-lg border ${
                        isSelected
                          ? detail.isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isSelected && (
                          <span className="flex-shrink-0">
                            {detail.isCorrect ? "✓" : "✗"}
                          </span>
                        )}
                        <span className={isSelected ? "font-medium" : ""}>
                          {option.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!detail.isCorrect && (
                <div className="text-sm text-muted-foreground">
                  {detail.selectedOptionId === null ? (
                    <p className="text-orange-600">You did not answer this question.</p>
                  ) : null}
                </div>
              )}

              {detail.explanation && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {detail.explanation}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onClose} size="lg">
          Close
        </Button>
      </div>
    </div>
  );
}
