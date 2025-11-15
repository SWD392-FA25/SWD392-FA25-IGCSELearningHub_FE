"use client";

import React, { useState } from "react";
import { Modal, Input } from "antd";
import toast from "react-hot-toast";
import { Assignment } from "@/types/api-types";
import { assignmentService } from "@/services/assignment-service";
import { Button } from "@/components/ui/Button";

const { TextArea } = Input;

interface AssignmentSubmitModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignmentSubmitModal({
  assignment,
  isOpen,
  onClose,
  onSuccess,
}: AssignmentSubmitModalProps) {
  const [textAnswer, setTextAnswer] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setTextAnswer("");
    setAttachmentUrl("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    if (!textAnswer.trim() && !attachmentUrl.trim()) {
      toast.error("Please provide either a text answer or an attachment URL");
      return;
    }

    setSubmitting(true);
    try {
      const response = await assignmentService.submitAssignment(assignment.assignmentId, {
        attachmentUrl: attachmentUrl.trim(),
        textAnswer: textAnswer.trim(),
      });

      if (response.succeeded) {
        toast.success("Assignment submitted successfully!");
        onSuccess();
        handleClose();
      } else {
        toast.error(response.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`Submit Assignment: ${assignment?.title || ""}`}
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" variant="outline" onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>,
        <Button key="submit" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Assignment"}
        </Button>,
      ]}
      width={700}
    >
      {assignment && (
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Assignment Description</h4>
            <p className="text-sm text-muted-foreground">{assignment.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Text Answer
            </label>
            <TextArea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows={6}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Attachment URL (Optional)
            </label>
            <Input
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://example.com/your-file.pdf"
              disabled={submitting}
              type="url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a valid HTTPS URL to your uploaded file
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
