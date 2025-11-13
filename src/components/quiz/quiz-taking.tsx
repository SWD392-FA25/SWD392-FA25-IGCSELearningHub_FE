"use client";

import React, { useState, useEffect } from "react";
import { Popconfirm } from "antd";
import { QuizForTake, QuizAnswer } from "@/types/api-types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface QuizTakingProps {
  quiz: QuizForTake;
  onSubmit: (answers: QuizAnswer[]) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function QuizTaking({ quiz, onSubmit, onCancel, loading }: QuizTakingProps) {
  const [answers, setAnswers] = useState<Map<number, number | null>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const initialAnswers = new Map<number, number | null>();
    quiz.questions.forEach((q) => {
      initialAnswers.set(q.questionId, null);
    });
    setAnswers(initialAnswers);
  }, [quiz]);

  const handleSelectOption = (questionId: number, optionId: number) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, optionId);
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    const answerList: QuizAnswer[] = Array.from(answers.entries()).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );
    onSubmit(answerList);
  };

  const answeredCount = Array.from(answers.values()).filter((v) => v !== null).length;
  const totalQuestions = quiz.questions.length;
  const hasNoQuestions = totalQuestions === 0;

  if (hasNoQuestions) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Questions Available
          </h3>
          <p className="text-muted-foreground mb-6">
            This quiz does not contain any questions yet.
          </p>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-background z-10 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">{quiz.title}</h2>
          <div className="text-sm text-muted-foreground">
            {answeredCount} / {totalQuestions} answered
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Total Questions: {totalQuestions}
          </div>
          <div className="flex gap-2">
            <Popconfirm
              title="Cancel Quiz"
              description="Are you sure you want to cancel? Your progress will not be saved."
              onConfirm={onCancel}
              okText="Yes, cancel"
              cancelText="No"
              disabled={loading}
            >
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Popconfirm>
            <Button onClick={handleSubmit} disabled={loading || hasNoQuestions}>
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const selectedOption = answers.get(question.questionId);
          return (
            <Card key={question.questionId} className="p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Question {index + 1}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {question.points} {question.points === 1 ? 'point' : 'points'}
                  </span>
                </div>
                <p className="text-foreground">{question.stem}</p>
              </div>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.optionId;
                  return (
                    <button
                      key={option.optionId}
                      onClick={() => handleSelectOption(question.questionId, option.optionId)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                        <span className="text-foreground">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-background pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {answeredCount < totalQuestions && (
              <span className="text-orange-500">
                You have {totalQuestions - answeredCount} unanswered question(s)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Popconfirm
              title="Cancel Quiz"
              description="Are you sure you want to cancel? Your progress will not be saved."
              onConfirm={onCancel}
              okText="Yes, cancel"
              cancelText="No"
              disabled={loading}
            >
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Popconfirm>
            <Button onClick={handleSubmit} disabled={loading || hasNoQuestions}>
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
