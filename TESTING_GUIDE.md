# Testing Guide for Admin Pages

## ✅ Changes Completed

### 1. Fixed `api.ts` Service

- **Removed** `'use client'` directive from `src/services/api.ts`
- This was causing module resolution issues with `fetchWithAuth`
- All exports are now proper ES6 named exports

### 2. Cache Cleared

- Cleared `.next` build cache
- Cleared `node_modules/.cache`
- Dev server restarted successfully

### 3. All Admin Pages Configured

All three admin pages are properly set up to fetch and display users filtered by role:

- ✅ **Students Page**: `src/app/pages/admin/students/Student.tsx`
- ✅ **Teachers Page**: `src/app/pages/admin/teachers/Teacher.tsx`
- ✅ **Parents Page**: `src/app/pages/admin/parents/Parent.tsx`

## 🧪 How to Test

### Prerequisites

1. Make sure you're logged in and have a valid JWT token stored in localStorage
2. Dev server is running on `http://localhost:3001`

### Test Each Admin Page

#### Students Page

1. Navigate to `/pages/admin/students`
2. Should see a list of users with `role: "Student"`
3. Features to test:
   - Search by username, email, full name, or ID
   - View student details (eye icon)
   - Delete student (trash icon)
   - Add new student (Plus button)

#### Teachers Page

1. Navigate to `/pages/admin/teachers`
2. Should see a list of users with `role: "Teacher"`
3. Features to test:
   - Search by username, email, full name, or ID
   - Edit teacher details (pencil icon)
   - Delete teacher (trash icon)
   - Add new teacher (Plus button)

#### Parents Page

1. Navigate to `/pages/admin/parents`
2. Should see a list of users with `role: "Parent"`
3. Features to test:
   - Search by username, email, full name, or ID
   - View parent details (eye icon)
   - Delete parent (trash icon)
   - Add new parent (Plus button)

## 🔍 What to Look For

### Expected Behavior

1. **Loading State**: Should see loading message while fetching data
2. **Data Display**: Users should be filtered correctly by role
3. **Search**: Search should filter results in real-time
4. **Error Handling**: If API fails, should see error message

### Expected Data Structure

Each user should have:

```typescript
{
  id: number
  userName: string
  fullName: string | null
  email: string
  phoneNumber: string | null
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
  status: 'Active' | 'Inactive'
  isExternal: boolean
  externalProvider: string | null
  createdAt: string
}
```

## 🐛 Troubleshooting

### If you see "fetchWithAuth is not a function"

1. Stop the dev server (Ctrl+C)
2. Clear cache:
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules/.cache
   ```
3. Restart: `npm run dev`

### If data doesn't load

1. Check browser console for errors
2. Verify JWT token exists in localStorage: `localStorage.getItem('jwtToken')`
3. Check Network tab to see API response

### If wrong users are shown

1. Verify the API response includes the `role` field
2. Check that `getAccountsByRole` is filtering correctly

## 📋 API Endpoints Used

- **Get All Accounts**: `GET /api/v1/Accounts`
  - Returns all users (students, teachers, parents, admins)
  - Client-side filtering by role

## ✨ Features Implemented

1. **Role-based Filtering**: Each page shows only users with the correct role
2. **Search Functionality**: Real-time search across username, email, full name, and ID
3. **Loading States**: Shows loading indicator while fetching data
4. **Error Handling**: Displays error messages if API calls fail
5. **Authentication**: All API calls include Bearer token from localStorage
6. **Auto-redirect**: If token is invalid (401), user is redirected to login

## 🎯 Next Steps

1. Test login flow to ensure JWT token is stored correctly
2. Test each admin page to verify data loads and displays properly
3. Test search functionality on each page
4. Test CRUD operations (view, edit, delete)
5. Verify that authentication works (try accessing pages without being logged in)
