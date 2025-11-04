# Assignment Management Feature Documentation

## Overview

Complete CRUD (Create, Read, Delete) functionality for managing assignments in the admin panel, with full backend API integration.

## Components Created/Updated

### 1. Assignment Service (`src/services/assignmentService.ts`)

- **Purpose**: Handles all assignment-related API calls
- **Functions**:

  - `getAssignments(pageNumber, pageSize)` - Fetch paginated list of assignments
  - `getAssignmentById(id)` - Fetch single assignment details
  - `createAssignment(data)` - Create new assignment (returns assignment ID)
  - `updateAssignment(id, data)` - Update existing assignment
  - `deleteAssignment(id)` - Delete an assignment

- **API Endpoints Used**:

  - `GET /admin/assignments?pageNumber={n}&pageSize={n}` - List assignments
  - `GET /admin/assignments/{id}` - Get assignment details
  - `POST /admin/assignments` - Create assignment
  - `PUT /admin/assignments/{id}` - Update assignment
  - `DELETE /admin/assignments/{id}` - Delete assignment

- **Request/Response Format**:

  ```typescript
  // Assignment Interface
  interface Assignment {
    id: number
    courseId: number
    title: string
    createdAt: string
    submissionCount: number
    description?: string
  }

  // Create/Update Request
  {
    courseId: number
    title: string
    description: string
  }

  // Paginated Response
  {
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: Assignment[]
    details: null
    errors: null
  }
  ```

### 2. Assignment Create Dialog (`src/components/admin/assignments/assignment-create-dialog.tsx`)

- **Purpose**: Modal dialog for creating new assignments
- **Features**:

  - Course selection dropdown (fetches from courses API)
  - Title and description input fields
  - Form validation
  - Loading states
  - Error handling with user feedback
  - Auto-reset on success

- **Usage**:
  ```tsx
  <AssignmentCreateDialog
    open={createOpen}
    onOpenChange={setCreateOpen}
    onSuccess={fetchAssignments}
  />
  ```

### 3. Assignment Management Page (`src/app/pages/admin/assignments/Assignment.tsx`)

- **Purpose**: Main admin page for managing assignments
- **Features**:

  - Displays all assignments in a table format
  - Shows assignment details: ID, title, course, created date, submission count
  - Delete functionality with confirmation
  - Loading and error states
  - Global search integration (searches by title, ID, course ID)
  - Responsive design with mobile support

- **Columns Displayed**:
  - Assignment ID
  - Assignment Title (with icon and description)
  - Course ID (with badge)
  - Created Date
  - Submission Count (with visual indicators)
  - Actions (Delete button)

### 4. Page Route (`src/app/pages/admin/assignments/page.tsx`)

- **Purpose**: Next.js page wrapper for the assignment management component
- **Route**: `/pages/admin/assignments`

### 5. Sidebar Navigation (`src/components/layout/dashboard-sidebar.tsx`)

- **Update**: Added "Assignment Management" link to sidebar
- **Icon**: FileText icon from lucide-react
- **Route**: `/pages/admin/assignments`

## Features Implemented

### ✅ List Assignments

- Fetches all assignments from backend API
- Displays in a clean, organized table
- Shows submission count for each assignment
- Visual indicators for assignments with/without submissions

### ✅ Create Assignment

- Modal dialog with form
- Course selection dropdown (dynamically loaded)
- Required fields validation
- Success/error feedback
- Auto-refresh list on success

### ✅ Delete Assignment

- One-click delete with confirmation
- Error handling
- Auto-refresh list on success

### ✅ Global Search

- Search by assignment title
- Search by assignment ID
- Search by course ID
- Real-time filtering
- Integrated with SearchContext

### ✅ Error Handling

- API error display
- Form validation errors
- Network error handling
- User-friendly error messages

### ✅ Loading States

- Loading indicator while fetching data
- Disabled buttons during operations
- Loading text feedback

## Backend API Integration

### Authentication

All API requests include Bearer token authentication via `fetchWithAuth` utility.

### Response Handling

- All responses are wrapped in standard API response format
- Success/error states are properly handled
- Status codes and messages are displayed to users

### Error Cases

- 401: Unauthorized - redirects to login
- 404: Not found - displays error message
- 500: Server error - displays error message
- Network errors - displays connection error

## Usage Examples

### Creating an Assignment

1. Click "Add Assignment" button
2. Select a course from dropdown
3. Enter assignment title and description
4. Click "Create Assignment"
5. Dialog closes and list refreshes automatically

### Deleting an Assignment

1. Click trash icon next to assignment
2. Confirm deletion in browser prompt
3. Assignment is deleted and list refreshes

### Searching Assignments

1. Type in search box in dashboard header
2. Results filter automatically
3. Search across title, ID, and course ID

## TypeScript Type Safety

All components are fully typed with TypeScript:

- Assignment interface matches backend schema
- Form data is properly typed
- API responses are typed
- Props are strongly typed

## UI/UX Features

- Clean, modern design matching existing admin pages
- Responsive layout (desktop, tablet, mobile)
- Consistent with other admin management pages
- Visual feedback for all actions
- Loading states prevent multiple submissions
- Error messages are clear and actionable

## Future Enhancements (Optional)

- [ ] Add edit/update dialog for assignments
- [ ] Add assignment detail view
- [ ] Add bulk delete functionality
- [ ] Add filtering by course
- [ ] Add date range filtering
- [ ] Add pagination controls
- [ ] Add submission management
- [ ] Add export to CSV/Excel
- [ ] Add assignment templates

## Testing Checklist

- [x] List assignments loads correctly
- [x] Create assignment works
- [x] Delete assignment works
- [x] Search functionality works
- [x] Error handling works
- [x] Loading states work
- [x] Responsive design works
- [x] TypeScript compiles without errors
- [x] Navigation from sidebar works

## Files Modified/Created

1. ✅ `src/services/assignmentService.ts` - Assignment API service
2. ✅ `src/components/admin/assignments/assignment-create-dialog.tsx` - Create dialog
3. ✅ `src/app/pages/admin/assignments/Assignment.tsx` - Main page component
4. ✅ `src/app/pages/admin/assignments/page.tsx` - Next.js page route
5. ✅ `src/components/layout/dashboard-sidebar.tsx` - Added navigation link

## Dependencies

- React hooks (useState, useEffect)
- Next.js Link and routing
- Lucide React icons
- Custom UI components (Button, Card, Dialog, etc.)
- SearchContext for global search
- API utility (fetchWithAuth)

## Notes

- All API endpoints use `/admin/assignments` prefix
- Authentication is required for all operations
- Search is case-insensitive
- Date formatting uses locale-specific format
- Submission count is displayed with visual badges
- Course dropdown in create dialog fetches live data

## Status

✅ **COMPLETE** - All assignment management features are implemented, tested, and working without errors.
