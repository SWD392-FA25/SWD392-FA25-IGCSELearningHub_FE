"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Assignment, AssignmentSubmission } from "@/types/api-types";
import { assignmentService } from "@/services/assignment-service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface AssignmentViewModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentViewModal({
  assignment,
  isOpen,
  onClose,
}: AssignmentViewModalProps) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && assignment) {
      loadSubmissions();
    } else {
      resetState();
    }
  }, [isOpen, assignment]);

  const resetState = () => {
    setSubmissions([]);
    setError("");
  };

  const loadSubmissions = async () => {
    if (!assignment) return;

    setLoading(true);
    setError("");
    try {
      const response = await assignmentService.getSubmissions(assignment.assignmentId);
      if (response.succeeded && response.data) {
        setSubmissions(response.data);
      } else {
        setError(response.message || "Failed to load submissions");
      }
    } catch (err) {
      setError("Failed to load submissions. Please try again.");
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Assignment: ${assignment?.title || ""}`}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      {assignment && (
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{assignment.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Your Submissions</h4>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={loadSubmissions}>Retry</Button>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.submissionId} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Submission #{submission.submissionId}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(submission.submittedDate).toLocaleString()}
                        </span>
                      </div>

                      {submission.textAnswer && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Text Answer:</p>
                          <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded">
                            {submission.textAnswer}
                          </p>
                        </div>
                      )}

                      {submission.attachmentUrl && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Attachment:</p>
                          <a
                            href={submission.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}

                      {submission.score !== null && (
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Score:</span>
                            <span className="text-lg font-semibold text-primary">
                              {submission.score}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
