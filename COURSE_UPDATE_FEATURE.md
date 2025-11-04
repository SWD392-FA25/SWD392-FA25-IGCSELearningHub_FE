# Course Update Feature - Implementation Complete

## Summary

Successfully implemented a course update form dialog that allows administrators to edit existing courses using the `PUT /admin/courses/{id}` API endpoint.

## What Was Implemented

### 1. New Component: CourseUpdateDialog

**File:** `src/components/admin/courses/course-update-dialog.tsx`

A fully functional update dialog with:

- ✅ Form inputs for: Title, Description, Level, Price
- ✅ Pre-filled with current course data
- ✅ Form validation (all fields required)
- ✅ Loading states during API calls
- ✅ Error handling and display
- ✅ Auto-close on success
- ✅ Auto-refresh course list after update
- ✅ Number validation for price field

### 2. Enhanced Course Service

**File:** `src/services/courseService.ts`

Updated `updateCourse` function to:

- ✅ Use correct endpoint: `/admin/courses/{id}`
- ✅ Handle wrapped API response structure
- ✅ Accept correct parameters: `{ title, description, level, price }`
- ✅ Return boolean (true if updated successfully)
- ✅ Provide meaningful error messages

### 3. Integrated into Course Management Page

**File:** `src/app/pages/admin/courses/Course.tsx`

- ✅ Added `updateOpen` state for the update dialog
- ✅ Modified `handleEdit` to open update dialog
- ✅ Integrated `CourseUpdateDialog` component
- ✅ Passes `fetchCourses` as onSuccess callback

## API Integration

### Endpoint Details

```
PUT /admin/courses/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Art & Design",
  "description": "Vẽ, điêu khắc, hội họa, phân tích nghệ thuật",
  "level": "Coursework-based",
  "price": 2000000
}
```

### Response Structure

```json
{
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Updated",
  "data": true,
  "details": null,
  "errors": null
}
```

Note: The API returns `true` in the `data` field when update is successful.

## User Flow

1. **Admin navigates** to Courses page
2. **Admin clicks** the Pencil (✏️) icon on any course row
3. **Dialog opens** with pre-filled course data
4. **Admin edits:**
   - Course Title (required)
   - Description (required, multiline textarea)
   - Level (required, with examples)
   - Price in VND (required, number input)
5. **Admin clicks** "Save Changes"
6. **System validates** and sends update request
7. **On success:**
   - Dialog closes automatically
   - Course list refreshes with updated data
   - Updated course info appears in the table
8. **On error:**
   - Error message displays in dialog
   - Dialog stays open for corrections
   - User can edit and retry

## Form Fields (Same as Create)

### Title

- **Type:** Text input
- **Required:** Yes
- **Pre-filled:** Current course title
- **Validation:** Must not be empty

### Description

- **Type:** Multiline textarea
- **Required:** Yes
- **Pre-filled:** Current course description (shortDescription)
- **Min Height:** 100px
- **Validation:** Must not be empty

### Level

- **Type:** Text input
- **Required:** Yes
- **Pre-filled:** Current course level
- **Examples shown:** Core, Extended, Coursework-based
- **Validation:** Must not be empty

### Price (VND)

- **Type:** Number input
- **Required:** Yes
- **Pre-filled:** Current course price
- **Min Value:** 0
- **Step:** 1000
- **Helper Text:** "Enter price in Vietnamese Dong (VND)"
- **Validation:** Must be a valid positive number

## Features

✅ **Pre-filled Form** - Shows current course data
✅ **Multiline Description** - Textarea for longer text
✅ **Number Validation** - Ensures price is valid
✅ **Form Validation** - All fields required
✅ **Error Handling** - Clear error messages
✅ **Loading States** - Visual feedback during update
✅ **Auto-refresh** - List updates after successful update
✅ **Type Safety** - Full TypeScript support
✅ **Consistent UI** - Matches create dialog design
✅ **Authentication** - Bearer token automatic

## Dialog Structure

```
┌───────────────────────────────────────────────────────┐
│  Edit Course                                     ✕    │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Course Title *                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Art & Design                                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Description *                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Vẽ, điêu khắc, hội họa, phân tích nghệ thuật   │ │
│  │                                                 │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Level *                                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Coursework-based                                │ │
│  └─────────────────────────────────────────────────┘ │
│  Examples: Core, Extended, Coursework-based          │
│                                                       │
│  Price (VND) *                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 2000000                                         │ │
│  └─────────────────────────────────────────────────┘ │
│  Enter price in Vietnamese Dong (VND)                │
│                                                       │
│                          [Cancel]  [Save Changes]     │
└───────────────────────────────────────────────────────┘
```

## Files Created/Modified

### Created

1. ✅ `src/components/admin/courses/course-update-dialog.tsx` - New update dialog

### Modified

1. ✅ `src/services/courseService.ts` - Updated updateCourse function
2. ✅ `src/app/pages/admin/courses/Course.tsx` - Integrated update dialog

## Code Examples

### Opening the Dialog

```tsx
// In Course.tsx
const handleEdit = (course: Course) => {
  setEditingCourse(course)
  setUpdateOpen(true)
}

// In table actions
;<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => handleEdit(course)}
>
  <Pencil className="h-4 w-4" />
</Button>
```

### Using the Dialog Component

```tsx
<CourseUpdateDialog
  course={editingCourse}
  open={updateOpen}
  onOpenChange={setUpdateOpen}
  onSuccess={fetchCourses}
/>
```

### API Call in Service

```typescript
const response = await fetchWithAuth<{
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: boolean // Returns true if updated
  details: null
  errors: null
}>(`/admin/courses/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
    title: 'Art & Design',
    description: 'Vẽ, điêu khắc, hội họa, phân tích nghệ thuật',
    level: 'Coursework-based',
    price: 2000000,
  }),
})
```

## Testing Checklist

### Pre-launch Checks

- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Component compiles successfully
- ✅ Service function type-safe
- ✅ All imports resolved

### Manual Testing

- [ ] Click pencil icon on any course
- [ ] Verify dialog opens with pre-filled data
- [ ] Verify all fields match current course
- [ ] Try submitting with empty fields (should show validation)
- [ ] Edit some fields with valid data
- [ ] Submit and verify success
- [ ] Check that updated data appears in list
- [ ] Test error handling with invalid data
- [ ] Test cancel button functionality
- [ ] Test closing dialog by clicking outside

## Example Update

### Before

```
Course ID: 1
Title: Mathematics
Description: Basic math
Level: Core
Price: 1500000
```

### After Update

```json
{
  "title": "Art & Design",
  "description": "Vẽ, điêu khắc, hội họa, phân tích nghệ thuật",
  "level": "Coursework-based",
  "price": 2000000
}
```

### Result

```
Course ID: 1
Title: Art & Design
Description: Vẽ, điêu khắc, hội họa, phân tích nghệ thuật
Level: Coursework-based
Price: 2,000,000 VND
```

## Validation Rules

Same as Create:

1. **Title** - Cannot be empty, any valid string
2. **Description** - Cannot be empty, multiline supported
3. **Level** - Cannot be empty, any valid string
4. **Price** - Must be a number >= 0, converted to float

## Error Handling

### Client-side Errors

- Empty fields → HTML5 validation
- Invalid price → "Price must be a valid positive number"
- Network failure → "Failed to update course"

### Server-side Errors

- Course not found → API error message shown
- Validation errors → API error message shown
- Authorization error → "Unauthorized" or API message

## Success Flow

```
User clicks Edit (Pencil)
      ↓
Dialog opens with pre-filled data
      ↓
User edits fields
      ↓
Clicks "Save Changes"
      ↓
Validation passes
      ↓
API request sent
      ↓
Response: { succeeded: true, data: true }
      ↓
Dialog closes
      ↓
fetchCourses() called
      ↓
List refreshes
      ↓
Updated course visible in table
```

## Comparison: Create vs Update

| Feature       | Create Dialog                    | Update Dialog           |
| ------------- | -------------------------------- | ----------------------- |
| Form Fields   | Title, Description, Level, Price | Same                    |
| Pre-filled    | No (empty form)                  | Yes (current data)      |
| API Endpoint  | POST /admin/courses              | PUT /admin/courses/{id} |
| Response Data | Course ID (number)               | Success flag (boolean)  |
| Button Text   | "Create Course"                  | "Save Changes"          |
| Dialog Title  | "Create New Course"              | "Edit Course"           |
| Use Case      | Add new course                   | Modify existing course  |

## Technical Notes

- **Form State:** Local component state
- **Pre-fill Logic:** useEffect watches `course` prop
- **Authentication:** Uses `fetchWithAuth` utility
- **Response Handling:** Checks `succeeded` flag
- **Form Reset:** Not needed (closes on success)
- **Loading State:** Disables buttons during submission
- **Error Display:** Red alert box at top of form

## State Management

```typescript
// In Course.tsx
const [editingCourse, setEditingCourse] = useState<Course | null>(null)
const [updateOpen, setUpdateOpen] = useState(false)

// When pencil is clicked
const handleEdit = (course: Course) => {
  setEditingCourse(course) // Set the course to edit
  setUpdateOpen(true) // Open the update dialog
}
```

## Integration with Existing Dialogs

The course page now has **4 dialogs**:

1. **CourseDetailDialog** - View course details (Eye icon)
2. **CourseEditDialog** - Legacy edit (currently unused)
3. **CourseUpdateDialog** - Update course data (Pencil icon) ← NEW
4. **CourseCreateDialog** - Create new course (Add button)

## Future Enhancements

Potential improvements:

- Add course image update
- Add status toggle in update form
- Add more fields (duration, syllabus updates)
- Add level dropdown instead of text input
- Add rich text editor for description
- Add validation for unique titles
- Add preview of changes before saving
- Add undo functionality
- Add audit log of changes

---

**🎉 Implementation Status: COMPLETE**

The course update feature is fully implemented and ready for testing!

**Date:** November 5, 2025
**Feature:** Course Update Form Dialog
**Status:** ✅ Ready for Testing
**Files Changed:** 2 modified, 1 created
**Compilation:** ✅ No errors
**API Endpoint:** PUT /admin/courses/{id}
