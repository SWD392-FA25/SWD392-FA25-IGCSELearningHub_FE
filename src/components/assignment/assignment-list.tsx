"use client";

import React from "react";
import { Assignment } from "@/types/api-types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

interface AssignmentListProps {
  assignments: Assignment[];
  onSubmit: (assignmentId: number) => void;
  loading?: boolean;
}

export function AssignmentList({ assignments, onSubmit, loading }: AssignmentListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No assignments available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div
          key={assignment.assignmentId}
          className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {assignment.title}
                </h3>
                {assignment.submitted ? (
                  <Badge className="bg-green-100 text-green-700 px-3">Submitted</Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-700 px-3">Pending</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {assignment.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Created {new Date(assignment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Button
              onClick={() => onSubmit(assignment.assignmentId)}
              size="sm"
              variant={assignment.submitted ? "outline" : "default"}
            >
              {assignment.submitted ? "View Submission" : "Submit"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
