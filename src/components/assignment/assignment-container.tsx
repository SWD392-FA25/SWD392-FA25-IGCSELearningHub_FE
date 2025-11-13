"use client";

import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { Assignment } from "@/types/api-types";
import { assignmentService } from "@/services/assignment-service";
import { AssignmentList } from "./assignment-list";
import { AssignmentSubmitModal } from "./assignment-submit-modal";
import { AssignmentViewModal } from "./assignment-view-modal";
import { Button } from "@/components/ui/Button";

const { Option } = Select;

interface AssignmentContainerProps {
  courseId: number;
}

export function AssignmentContainer({ courseId }: AssignmentContainerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterSubmitted, setFilterSubmitted] = useState<boolean | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadAssignments();
  }, [courseId, filterSubmitted, pageNumber]);

  const loadAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await assignmentService.getAssignments({
        courseId,
        submitted: filterSubmitted,
        pageNumber,
        pageSize,
      });

      if (response.succeeded && response.data) {
        setAssignments(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } else {
        setError(response.message || "Failed to load assignments");
      }
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentClick = (assignmentId: number) => {
    const assignment = assignments.find((a) => a.assignmentId === assignmentId);
    if (assignment) {
      setSelectedAssignment(assignment);
      if (assignment.submitted) {
        setViewModalOpen(true);
      } else {
        setSubmitModalOpen(true);
      }
    }
  };

  const handleSubmitSuccess = () => {
    loadAssignments();
  };

  const handleFilterChange = (value: string) => {
    if (value === "all") {
      setFilterSubmitted(undefined);
    } else if (value === "submitted") {
      setFilterSubmitted(true);
    } else if (value === "pending") {
      setFilterSubmitted(false);
    }
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadAssignments}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Course Assignments</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={handleFilterChange}
          >
            <Option value="all">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="submitted">Submitted</Option>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {assignments.length} of {totalCount} assignments
      </div>

      <AssignmentList
        assignments={assignments}
        onSubmit={handleAssignmentClick}
        loading={loading}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <AssignmentSubmitModal
        assignment={selectedAssignment}
        isOpen={submitModalOpen}
        onClose={() => {
          setSubmitModalOpen(false);
          setSelectedAssignment(null);
        }}
        onSuccess={handleSubmitSuccess}
      />

      <AssignmentViewModal
        assignment={selectedAssignment}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedAssignment(null);
        }}
      />
    </div>
  );
}
