# User Edit Dialog - Visual Flow

## UI Changes

### Before (Old Pencil Button)

```
┌─────────────────────────────────────────────────────────────┐
│ Actions Column                                               │
├─────────────────────────────────────────────────────────────┤
│  👁️ Eye     ✏️ Pencil (No Action)    🗑️ Delete             │
└─────────────────────────────────────────────────────────────┘
```

### After (Functional Edit Button)

```
┌─────────────────────────────────────────────────────────────┐
│ Actions Column                                               │
├─────────────────────────────────────────────────────────────┤
│  👁️ View    ✏️ Edit (Opens Dialog)   🗑️ Delete             │
└─────────────────────────────────────────────────────────────┘
```

## Edit Dialog Structure

```
┌───────────────────────────────────────────────────────┐
│  Edit Student Information                        ✕    │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Full Name *                                          │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Nguyen Van H                                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Username *                                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ teststuupdate                                   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Email *                                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │ nguyenvanh@example.com                          │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Phone Number                                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 0900123509                                      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│                          [Cancel]  [Save Changes]     │
└───────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
┌─────────────────┐
│ Admin Dashboard │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Select User Type        │
│ • Students              │
│ • Teachers              │
│ • Parents               │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ View User List          │
│ with Search & Filters   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Click Pencil Icon ✏️    │
│ on User Row             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Edit Dialog Opens       │
│ • Pre-filled with data  │
│ • All fields editable   │
└────────┬────────────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐     ┌─────────┐
    │  Edit   │      │  Cancel  │     │ Click   │
    │ & Save  │      │  Button  │     │ Outside │
    └────┬────┘      └────┬─────┘     └────┬────┘
         │                │                  │
         │                └──────┬───────────┘
         ▼                       ▼
    ┌──────────┐          ┌──────────┐
    │ Loading  │          │  Dialog  │
    │   ...    │          │  Closes  │
    └────┬─────┘          └──────────┘
         │
         ├──────────┬──────────┐
         ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Success │ │ Error  │ │Network │
    │        │ │Message │ │ Error  │
    └───┬────┘ └───┬────┘ └───┬────┘
        │          │           │
        ▼          ▼           ▼
    ┌──────────────────────────────┐
    │ • Success: Auto-close        │
    │   + Refresh list             │
    │ • Error: Stay open           │
    │   + Show error message       │
    └──────────────────────────────┘
```

## State Management

### Component States

```typescript
;[sidebarOpen, setSidebarOpen] =
  useState(false)[(selectedUser, setSelectedUser)] =
  useState<User | null>(null)[(detailOpen, setDetailOpen)] =
  useState(false)[(editOpen, setEditOpen)] = // View dialog
  useState(false)[(users, setUsers)] = // Edit dialog  ← NEW
  useState<User[]>([])[(filteredUsers, setFilteredUsers)] =
  useState<User[]>([])[(isLoading, setIsLoading)] =
  useState(true)[(error, setError)] =
    useState<string | null>(null)
```

### Dialog Form States

```typescript
;[formData, setFormData] =
  useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
  })[(isLoading, setIsLoading)] =
  useState(false)[(error, setError)] =
    useState<string | null>(null)
```

## API Request Flow

```
┌──────────────────────────────────────────────────────┐
│ 1. User clicks "Save Changes"                        │
└────────────────────┬─────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│ 2. handleSubmit(e)                                   │
│    • e.preventDefault()                              │
│    • setIsLoading(true)                              │
└────────────────────┬─────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│ 3. updateAccount(userId, formData)                   │
│    • Calls fetchWithAuth                             │
│    • PUT /Accounts/{id}                              │
│    • Bearer token attached automatically             │
└────────────────────┬─────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│ 4. API Response                                      │
│    {                                                 │
│      "succeeded": true,                              │
│      "message": "Account updated successfully.",     │
│      "data": { ...updated user object... }           │
│    }                                                 │
└────────────────────┬─────────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────────┐
│ 5. Success Handler                                   │
│    • onUpdate() → Refresh user list                  │
│    • onOpenChange(false) → Close dialog              │
│    • setIsLoading(false)                             │
└──────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
API Call Failed
     │
     ├─── Network Error ────────► Show: "Failed to update user"
     │
     ├─── Validation Error ─────► Show: API message
     │
     ├─── Auth Error ───────────► Show: "Unauthorized"
     │
     └─── Server Error ─────────► Show: "Server error occurred"

Error Display:
┌─────────────────────────────────────────────┐
│ 🔴 Failed to update user                    │
│    Please check your connection and try     │
│    again.                                   │
└─────────────────────────────────────────────┘
```

## Code Structure

```
src/
├── components/
│   └── admin/
│       └── users/
│           └── user-edit-dialog.tsx  ← NEW COMPONENT
│
├── services/
│   └── userService.ts                ← ENHANCED updateAccount
│
└── app/
    └── pages/
        └── admin/
            ├── students/Student.tsx  ← INTEGRATED
            ├── teachers/Teacher.tsx  ← INTEGRATED
            └── parents/Parent.tsx    ← INTEGRATED
```

## Integration Points

### Student.tsx

```typescript
// Import
import { UserEditDialog } from '@/components/admin/users/user-edit-dialog'

// State
const [editOpen, setEditOpen] = useState(false)

// Handler
const handleEdit = (student: User) => {
  setSelectedStudent(student)
  setEditOpen(true)
}

// Button
<Button onClick={() => handleEdit(student)}>
  <Pencil />
</Button>

// Dialog
<UserEditDialog
  user={selectedStudent}
  open={editOpen}
  onOpenChange={setEditOpen}
  onUpdate={fetchStudents}
/>
```

---

**Implementation Complete!** ✨
All three admin pages now support user editing with the same dialog component.
