"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuizHistory } from "@/components/quiz/quiz-history";
import { QuizAttemptViewer } from "@/components/quiz/quiz-attempt-viewer";

export default function MyQuizzesPage() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleViewAttempt = (quizId: number, attemptId: number) => {
    setSelectedQuizId(quizId);
    setSelectedAttemptId(attemptId);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedQuizId(null);
    setSelectedAttemptId(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Quizzes
            </h1>
            <p className="text-muted-foreground">
              View your quiz attempts and results
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <QuizHistory onViewAttempt={handleViewAttempt} />
          </div>
        </div>
      </main>
      <Footer />

      <QuizAttemptViewer
        quizId={selectedQuizId}
        attemptId={selectedAttemptId}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
