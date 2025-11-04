# 🗑️ Delete Enrollment Function - User Guide

## ✅ Chức Năng Đã Có Sẵn!

Chức năng **xóa enrollment** đã được implement đầy đủ trong Enrollment Management page.

## 📍 Vị Trí

**File**: `src/app/pages/admin/enrollments/Enrollment.tsx`

**Route**: `/pages/admin/enrollments`

## 🎯 Cách Sử Dụng

### Bước 1: Truy Cập Enrollment Page

1. Mở sidebar
2. Click "Enrollment Management"
3. Hoặc truy cập: `/pages/admin/enrollments`

### Bước 2: Tìm Enrollment Cần Xóa

Bạn sẽ thấy danh sách enrollments được nhóm theo khóa học:

```
┌────────────────────────────────────────────────┐
│ 📚 Mathematics (9-1)          Course ID: 3    │
│ 5 students enrolled                           │
├────────────────────────────────────────────────┤
│ ID  │ Student  │ Date    │ Status  │ Actions │
├─────┼──────────┼─────────┼─────────┼─────────┤
│ #5  │ test     │ Nov 4   │ Active  │  🗑️    │  ← Nút xóa
│ #4  │ test2    │ Nov 4   │ Active  │  🗑️    │
└────────────────────────────────────────────────┘
```

### Bước 3: Xóa Enrollment

1. **Click** icon thùng rác (🗑️) bên cạnh enrollment muốn xóa
2. **Xác nhận** trong popup: "Are you sure you want to delete this enrollment?"
3. Click **OK** để xóa hoặc **Cancel** để hủy

### Bước 4: Kết Quả

- ✅ Enrollment bị xóa khỏi hệ thống
- ✅ Danh sách tự động refresh
- ✅ Nếu có lỗi, alert sẽ hiện lên

## 🔧 Technical Implementation

### Function Handler

```typescript
const handleDelete = async (enrollmentId: number) => {
  if (confirm('Are you sure you want to delete this enrollment?')) {
    try {
      await deleteEnrollment(enrollmentId) // API call
      fetchEnrollments() // Refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to delete enrollment')
    }
  }
}
```

### API Service

```typescript
// File: src/services/enrollmentService.ts
export const deleteEnrollment = async (
  enrollmentId: number
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete enrollment')
  }

  return response.data
}
```

### Button Component

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8 text-destructive"
  onClick={() => handleDelete(enrollment.enrollmentId)}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

## 📊 API Details

### Endpoint

```
DELETE /admin/enrollments/{enrollmentId}
```

### Request

```bash
curl -X 'DELETE' \
  'https://...api.../api/v1/admin/enrollments/2' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer {token}'
```

### Response (Success)

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

### Response (Error)

```json
{
  "succeeded": false,
  "status": "error",
  "statusCode": 400,
  "message": "Enrollment not found",
  "data": false,
  "details": null,
  "errors": ["Error details..."]
}
```

## ✅ Features

### 1. Confirmation Dialog

- Prevents accidental deletion
- Browser native `confirm()` popup
- User must click OK to proceed

### 2. Error Handling

- API errors are caught and displayed
- User-friendly error messages
- Network errors handled

### 3. Auto Refresh

- List updates automatically after deletion
- No need to manually refresh page
- Maintains search/filter state

### 4. Visual Feedback

- Button has red color (destructive)
- Trash icon for clarity
- Hover effects

## 🎨 UI Elements

### Delete Button

- **Icon**: 🗑️ Trash2 from lucide-react
- **Color**: Red/Destructive
- **Size**: Small (8x8)
- **Style**: Ghost (transparent background)
- **Location**: Actions column, rightmost

### Confirmation Popup

```
┌────────────────────────────────────────┐
│ ⚠️ Confirm                             │
├────────────────────────────────────────┤
│ Are you sure you want to delete this   │
│ enrollment?                            │
│                                        │
│              [Cancel]  [OK]            │
└────────────────────────────────────────┘
```

## 🔒 Security

### Authorization

- Requires Bearer token authentication
- Admin role required
- Token included in all API calls

### Validation

- Enrollment ID must exist
- User must have delete permission
- Cannot delete if referenced by other data

## ⚠️ Important Notes

### What Happens When You Delete?

1. **Enrollment record** is removed from database
2. **Student loses access** to the course
3. **Cannot be undone** - permanent deletion
4. **No cascade delete** - course and student remain

### Limitations

- No bulk delete (must delete one by one)
- No soft delete (permanent)
- No undo functionality
- No deletion history/audit log

### Best Practices

1. **Double check** before clicking OK
2. **Verify** the correct enrollment ID
3. **Consider** if student should be inactive instead
4. **Communicate** with student before removing access

## 🚨 Error Scenarios

| Scenario             | What Happens           |
| -------------------- | ---------------------- |
| Enrollment not found | Error alert shown      |
| No permission        | 403 Forbidden error    |
| Network error        | Connection error shown |
| Invalid ID           | Validation error       |
| Token expired        | Redirect to login      |

## 🎯 Use Cases

### 1. Student Withdrew from Course

"Student John dropped Mathematics course"
→ Find John's enrollment in Mathematics
→ Click delete → Confirm

### 2. Duplicate Enrollment

"Student was enrolled twice by mistake"
→ Find duplicate enrollment
→ Click delete → Confirm

### 3. Wrong Course

"Student was enrolled in wrong course"
→ Delete wrong enrollment
→ Create new enrollment in correct course

## 🔄 Alternative to Delete

Instead of deleting, consider **changing status to Inactive**:

- Student data is preserved
- Can be reactivated later
- History is maintained

_Note: Status change feature may need to be implemented if not available_

## 📝 Testing Checklist

- [x] Delete button appears in table
- [x] Confirmation popup shows
- [x] API call works correctly
- [x] List refreshes after delete
- [x] Error handling works
- [x] Authorization required
- [x] Success response handled
- [x] Error response handled

## 📚 Related Files

```
src/
├── services/
│   └── enrollmentService.ts      ✅ Delete API call
├── app/
│   └── pages/
│       └── admin/
│           └── enrollments/
│               └── Enrollment.tsx  ✅ Delete handler & UI
```

## 💡 Tips

1. **Search First**: Use search to find enrollment quickly
2. **Check ID**: Verify enrollment ID before deleting
3. **Read Popup**: Make sure you're deleting the right one
4. **Refresh**: List updates automatically, no need to reload page

## 🎉 Status

✅ **FULLY IMPLEMENTED** and working!

- Delete function: ✅ Works
- Confirmation dialog: ✅ Shows
- API integration: ✅ Connected
- Error handling: ✅ Complete
- Auto refresh: ✅ Updates
- TypeScript: ✅ No errors

---

**Feature**: Delete Enrollment
**API**: DELETE /admin/enrollments/{id}
**Confirmation**: Required
**Undo**: Not available
**Status**: ✅ Production Ready
