"use client";

import React, { useState } from "react";
import { Modal, Upload, Input } from "antd";
import toast from "react-hot-toast";
import { InboxOutlined } from "@ant-design/icons";
import { Assignment } from "@/types/api-types";
import { assignmentService } from "@/services/assignment-service";
import { uploadFileToFirebase, generateFirebasePath } from "@/lib/firebase-upload";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const { Dragger } = Upload;
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
  const { user } = useAuth();
  const [textAnswer, setTextAnswer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setTextAnswer("");
    setFile(null);
    onClose();
  };

  const handleFileChange = (info: any) => {
    const { file } = info;
    if (file.status !== 'uploading') {
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    if (!textAnswer.trim() && !file) {
      toast.error("Please provide either a text answer or upload a file");
      return;
    }

    setSubmitting(true);
    try {
      let attachmentUrl = "";

      if (file && user) {
        setUploading(true);
        const path = generateFirebasePath(user.id, assignment.assignmentId, file.name);
        attachmentUrl = await uploadFileToFirebase(file, path);
        setUploading(false);
      }

      const response = await assignmentService.submitAssignment(assignment.assignmentId, {
        attachmentUrl,
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
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`Submit Assignment: ${assignment?.title || ""}`}
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" variant="outline" onClick={handleClose} disabled={submitting || uploading}>
          Cancel
        </Button>,
        <Button key="submit" onClick={handleSubmit} disabled={submitting || uploading}>
          {uploading ? "Uploading..." : submitting ? "Submitting..." : "Submit Assignment"}
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
              disabled={submitting || uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File (Optional)
            </label>
            <Dragger
              name="file"
              multiple={false}
              onChange={handleFileChange}
              beforeUpload={() => false}
              disabled={submitting || uploading}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single file upload. PDF, DOC, DOCX, or images.
              </p>
            </Dragger>
          </div>

          {uploading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading file...</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
