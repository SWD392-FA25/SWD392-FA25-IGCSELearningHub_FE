# Course Delete Feature - Updated

## Summary

Updated the course delete functionality to use the correct admin API endpoint `DELETE /admin/courses/{id}` with proper response handling.

## What Was Updated

### Enhanced Course Service

**File:** `src/services/courseService.ts`

Updated `deleteCourse` function to:

- ✅ Use correct endpoint: `/admin/courses/{id}`
- ✅ Handle wrapped API response structure
- ✅ Return boolean (true if deleted successfully)
- ✅ Provide meaningful error messages
- ✅ Properly handle authentication

## API Integration

### Endpoint Details

```
DELETE /admin/courses/{id}
Authorization: Bearer {token}
```

### Response Structure

```json
{
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Deleted",
  "data": true,
  "details": null,
  "errors": null
}
```

Note: The API returns `true` in the `data` field when deletion is successful.

## User Flow

1. **Admin navigates** to Courses page
2. **Admin views** the course list
3. **Admin clicks** the Delete (🗑️) icon on any course row
4. **Confirmation dialog** appears: "Are you sure you want to delete this course?"
5. **Admin confirms** deletion
6. **System sends** DELETE request to API
7. **On success:**
   - Course is deleted from database
   - Course list automatically refreshes
   - Deleted course is removed from the table
8. **On error:**
   - Alert message shows the error
   - Course remains in the list

## Implementation Details

### Service Function

```typescript
export const deleteCourse = async (id: number): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean // Returns true if deleted
    details: null
    errors: null
  }>(`/admin/courses/${id}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete course')
  }

  return response.data
}
```

### Usage in Course Page

```typescript
const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await deleteCourse(id)
      fetchCourses() // Refresh the list
    } catch (err: any) {
      alert(err.message || 'Failed to delete course')
    }
  }
}
```

### Button Integration

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8 text-destructive"
  onClick={() => handleDelete(course.id)}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

## Features

✅ **Confirmation Dialog** - Prevents accidental deletions
✅ **Proper Endpoint** - Uses admin API endpoint
✅ **Error Handling** - Clear error messages
✅ **Auto-refresh** - List updates after deletion
✅ **Type Safety** - Full TypeScript support
✅ **Authentication** - Bearer token automatic
✅ **Response Handling** - Properly unwraps API response

## Error Handling

### Client-side

- User cancels → No action taken
- Network failure → "Failed to delete course"

### Server-side

- Course not found → API error message shown
- Course has dependencies → API error message shown
- Authorization error → "Unauthorized" or API message
- Validation error → API error message shown

## Success Flow

```
User clicks Delete (Trash icon)
      ↓
Confirmation dialog appears
      ↓
User confirms "OK"
      ↓
API request sent
      ↓
Response: { succeeded: true, data: true }
      ↓
fetchCourses() called
      ↓
List refreshes
      ↓
Course removed from table
```

## Testing Checklist

### Manual Testing

- [ ] Click delete icon on any course
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel" and verify no deletion
- [ ] Click "OK" and verify deletion
- [ ] Check course is removed from list
- [ ] Verify list refreshes correctly
- [ ] Test error scenario (invalid ID)
- [ ] Verify error message displays

## Example API Call

### Request

```bash
curl -X 'DELETE' \
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1/admin/courses/8' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer {token}'
```

### Success Response

```json
{
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Deleted",
  "data": true,
  "details": null,
  "errors": null
}
```

### Error Response (Course Not Found)

```json
{
  "succeeded": false,
  "status": "error",
  "statusCode": 404,
  "message": "Course not found",
  "data": false,
  "errors": ["Course with ID 8 does not exist"]
}
```

## Technical Notes

- **Endpoint:** Changed from `/courses/{id}` to `/admin/courses/{id}`
- **Response Type:** Changed from `void` to `boolean`
- **Error Handling:** Enhanced with wrapped response handling
- **Confirmation:** Browser native `confirm()` dialog
- **Refresh:** Automatic via `fetchCourses()` call

## Security

- ✅ Requires admin authentication (Bearer token)
- ✅ Confirmation before deletion
- ✅ Server-side authorization check
- ✅ Proper error messages (no sensitive data exposed)

## UI/UX

- **Icon:** Trash2 icon in red color (text-destructive)
- **Confirmation:** Native browser confirm dialog
- **Feedback:**
  - Success: List refreshes silently
  - Error: Alert with error message
- **No Loading State:** Delete is fast, no spinner needed

## Comparison: Before vs After

| Aspect            | Before            | After                 |
| ----------------- | ----------------- | --------------------- |
| Endpoint          | `/courses/{id}`   | `/admin/courses/{id}` |
| Response Type     | `void`            | `boolean`             |
| Error Handling    | Basic             | Enhanced with message |
| Response Wrapping | Not handled       | Properly unwrapped    |
| Status            | ❌ Wrong endpoint | ✅ Correct endpoint   |

## Files Modified

1. ✅ `src/services/courseService.ts` - Updated deleteCourse function

## Integration Status

The delete function is already integrated into:

- ✅ Course.tsx page
- ✅ Delete button in table actions
- ✅ Confirmation dialog
- ✅ Auto-refresh after deletion

## Future Enhancements

Potential improvements:

- Add custom confirmation modal (instead of browser confirm)
- Add "undo" functionality
- Add soft delete option (archive instead of permanent delete)
- Add bulk delete capability
- Add confirmation with course name display
- Add loading state during deletion
- Add toast notification instead of alert
- Add audit log of deletions

---

**Status:** ✅ **UPDATED AND READY**

The delete functionality now uses the correct admin API endpoint and properly handles the response!

**Date:** November 5, 2025
**Feature:** Course Delete with Admin API
**Endpoint:** DELETE /admin/courses/{id}
**Response:** { succeeded: true, data: true }
