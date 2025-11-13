import { apiClient } from './api-client';
import { PaginatedApiResponse, ApiResponse, Assignment, AssignmentSubmission, SubmitAssignmentRequest } from '@/types/api-types';

interface GetAssignmentsParams {
  courseId?: number;
  submitted?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

class AssignmentService {
  async getAssignments(params: GetAssignmentsParams): Promise<PaginatedApiResponse<Assignment[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.courseId) queryParams.append('courseId', params.courseId.toString());
    if (params.submitted !== undefined) queryParams.append('submitted', params.submitted.toString());
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    return apiClient.get<PaginatedApiResponse<Assignment[]>>(`/student/assignments${queryString ? `?${queryString}` : ''}`);
  }

  async submitAssignment(assignmentId: number, data: SubmitAssignmentRequest): Promise<ApiResponse<AssignmentSubmission>> {
    return apiClient.post<ApiResponse<AssignmentSubmission>>(`/me/assignments/${assignmentId}/submissions`, data);
  }

  async getSubmissions(assignmentId: number, pageNumber: number = 1, pageSize: number = 20): Promise<PaginatedApiResponse<AssignmentSubmission[]>> {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });
    return apiClient.get<PaginatedApiResponse<AssignmentSubmission[]>>(`/me/assignments/${assignmentId}/submissions?${queryParams.toString()}`);
  }
}

export const assignmentService = new AssignmentService();
