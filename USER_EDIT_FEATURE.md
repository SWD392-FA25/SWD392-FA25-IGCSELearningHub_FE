# User Edit Feature Implementation

## Overview

Implemented a user edit dialog that allows administrators to update user information (Students, Teachers, and Parents) via the PUT `/Accounts/{id}` endpoint.

## Implementation Details

### 1. New Component: UserEditDialog

**Location:** `src/components/admin/users/user-edit-dialog.tsx`

A reusable dialog component for editing user information with the following features:

- Form fields for: Full Name, Username, Email, Phone Number
- Client-side form validation
- Loading states during API calls
- Error handling and display
- Automatic list refresh after successful update

### 2. API Integration

#### Endpoint

```
PUT /Accounts/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body

```json
{
  "fullName": "string",
  "phoneNumber": "string",
  "userName": "string",
  "email": "string"
}
```

#### Response

```json
{
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Account updated successfully.",
  "data": {
    "id": 2,
    "userName": "teststuupdate",
    "fullName": "Nguyen Van H",
    "email": "nguyenvanh@example.com",
    "phoneNumber": "0900123509",
    "role": "Student",
    "status": "Active",
    "isExternal": false,
    "externalProvider": null,
    "createdAt": "2025-10-28T07:16:20.1636149"
  }
}
```

### 3. Updated Service

**Location:** `src/services/userService.ts`

Enhanced the `updateAccount` function to:

- Handle the wrapped API response structure
- Extract the actual user data from `response.data`
- Properly handle errors with meaningful messages

```typescript
export const updateAccount = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: User
    details: null
    errors: null
  }>(`/Accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update account')
  }

  return response.data
}
```

### 4. Integration into Admin Pages

#### Students Page (`src/app/pages/admin/students/Student.tsx`)

- Added `editOpen` state for the edit dialog
- Added `handleEdit` function to open the dialog
- Integrated `UserEditDialog` component
- Connected the Pencil icon button to the edit handler

#### Teachers Page (`src/app/pages/admin/teachers/Teacher.tsx`)

- Added `userEditOpen` state (separate from detail dialog)
- Renamed existing `handleEdit` to `handleViewDetail`
- Created new `handleEdit` for the user edit dialog
- Integrated both `TeacherEditDialog` and `UserEditDialog`

#### Parents Page (`src/app/pages/admin/parents/Parent.tsx`)

- Added `editOpen` state for the edit dialog
- Added `handleEdit` function to open the dialog
- Integrated `UserEditDialog` component
- Connected the Pencil icon button to the edit handler

## User Experience Flow

1. **Open Edit Dialog**

   - Admin clicks the Pencil icon in any user row
   - Dialog opens with current user data pre-filled

2. **Edit Information**

   - Admin modifies any of the four editable fields:
     - Full Name
     - Username
     - Email
     - Phone Number

3. **Submit Changes**

   - Admin clicks "Save Changes" button
   - Form is validated (required fields)
   - Loading state is shown
   - API request is sent with Bearer token

4. **Handle Response**
   - **Success:**
     - Dialog closes automatically
     - User list is refreshed with updated data
   - **Error:**
     - Error message is displayed in the dialog
     - Dialog remains open for corrections

## Features

✅ **Form Validation**

- All fields except phone number are required
- Email field has type validation

✅ **Error Handling**

- Network errors are caught and displayed
- API errors are shown with meaningful messages
- User remains on the form to make corrections

✅ **Loading States**

- Buttons are disabled during submission
- "Saving..." text is shown
- Prevents duplicate submissions

✅ **Auto-refresh**

- List is automatically refreshed after successful update
- User sees the updated information immediately

✅ **Consistent UI**

- Matches the design system of other dialogs
- Responsive and accessible

## Testing Checklist

- [ ] Open edit dialog for Student, Teacher, and Parent
- [ ] Verify all fields are pre-filled with current data
- [ ] Edit each field and submit
- [ ] Verify validation (try submitting empty required fields)
- [ ] Test with valid data and verify success
- [ ] Test with invalid data and verify error handling
- [ ] Verify list refreshes after successful update
- [ ] Test cancel button functionality
- [ ] Test clicking outside dialog to close

## Technical Notes

- The edit dialog is separate from the detail/view dialog
- State management keeps the dialogs independent
- The component uses controlled inputs with React state
- Error states are cleared when the dialog reopens
- The dialog uses the existing `fetchWithAuth` utility for authentication

## Future Enhancements

Potential improvements:

- Add role change capability (requires admin privileges check)
- Add status toggle (Active/Inactive)
- Add password reset functionality
- Add profile picture upload
- Add audit log of changes
- Add confirmation dialog before saving
- Add undo functionality
