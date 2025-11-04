# Code Reference - User Edit Feature

## Quick Testing Guide

### 1. Test the Edit Dialog

Open any admin page and click the pencil icon. The dialog should open with pre-filled data.

### 2. API Test (cURL)

```bash
curl -X 'PUT' \
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1/Accounts/2' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
  "fullName": "Updated Name",
  "phoneNumber": "0900123509",
  "userName": "updatedusername",
  "email": "updated@example.com"
}'
```

### 3. Component Props

#### UserEditDialog Props

```typescript
interface UserEditDialogProps {
  user: User | null // The user to edit
  open: boolean // Dialog open state
  onOpenChange: (open: boolean) => void // Dialog close handler
  onUpdate: () => void // Callback after successful update
}
```

#### Usage Example

```tsx
import { UserEditDialog } from '@/components/admin/users/user-edit-dialog'

// In your component
const [selectedUser, setSelectedUser] = useState<User | null>(null)
const [editOpen, setEditOpen] = useState(false)

const handleEdit = (user: User) => {
  setSelectedUser(user)
  setEditOpen(true)
}

const fetchUsers = async () => {
  // Your fetch logic
}

// In JSX
;<UserEditDialog
  user={selectedUser}
  open={editOpen}
  onOpenChange={setEditOpen}
  onUpdate={fetchUsers}
/>
```

### 4. Service Function

#### updateAccount Usage

```typescript
import { updateAccount } from '@/services/userService'

try {
  const updatedUser = await updateAccount(userId, {
    fullName: 'New Name',
    userName: 'newusername',
    email: 'new@email.com',
    phoneNumber: '0900123456',
  })

  console.log('Updated:', updatedUser)
} catch (error) {
  console.error('Update failed:', error.message)
}
```

### 5. Form Data Structure

```typescript
interface FormData {
  fullName: string // Required
  userName: string // Required
  email: string // Required
  phoneNumber: string // Optional
}
```

### 6. Expected API Responses

#### Success Response

```json
{
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Account updated successfully.",
  "data": {
    "id": 2,
    "userName": "updatedusername",
    "fullName": "Updated Name",
    "email": "updated@example.com",
    "phoneNumber": "0900123509",
    "role": "Student",
    "status": "Active",
    "isExternal": false,
    "externalProvider": null,
    "createdAt": "2025-10-28T07:16:20.1636149"
  }
}
```

#### Error Response

```json
{
  "succeeded": false,
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed: Email is already in use",
  "data": null,
  "errors": ["Email already exists"]
}
```

### 7. Console Debug Commands

Open browser console and test:

```javascript
// Get localStorage token
const token = localStorage.getItem('token')
console.log('Token:', token)

// Test API call
fetch(
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1/Accounts/2',
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: 'Test Name',
      phoneNumber: '0900123456',
      userName: 'testuser',
      email: 'test@example.com',
    }),
  }
)
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error)
```

### 8. State Management Pattern

```typescript
// Component state structure
const [sidebarOpen, setSidebarOpen] = useState(false)
const [selectedUser, setSelectedUser] = useState<User | null>(null)
const [detailOpen, setDetailOpen] = useState(false) // View dialog
const [editOpen, setEditOpen] = useState(false) // Edit dialog
const [users, setUsers] = useState<User[]>([])
const [filteredUsers, setFilteredUsers] = useState<User[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// Handlers
const handleViewDetail = (user: User) => {
  setSelectedUser(user)
  setDetailOpen(true) // Opens view dialog
}

const handleEdit = (user: User) => {
  setSelectedUser(user)
  setEditOpen(true) // Opens edit dialog
}

const fetchUsers = async () => {
  // Fetch and set users
}
```

### 9. Component Integration Checklist

For each admin page (Students/Teachers/Parents):

- [ ] Import UserEditDialog
- [ ] Add editOpen state
- [ ] Add handleEdit function
- [ ] Connect Pencil button onClick
- [ ] Add UserEditDialog to JSX
- [ ] Pass correct props (user, open, onOpenChange, onUpdate)

### 10. Troubleshooting

#### If dialog doesn't open:

```typescript
// Check state
console.log('Edit Open:', editOpen)
console.log('Selected User:', selectedUser)

// Verify button click
const handleEdit = (user: User) => {
  console.log('Edit clicked for:', user)
  setSelectedUser(user)
  setEditOpen(true)
}
```

#### If API call fails:

```typescript
// Check token
const token = localStorage.getItem('token')
console.log('Has token:', !!token)

// Check request
try {
  const result = await updateAccount(userId, data)
  console.log('Success:', result)
} catch (error) {
  console.error('Failed:', error)
  console.error('Error details:', error.message)
}
```

#### If form doesn't submit:

```typescript
// Check form validation
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log('Form data:', formData)

  // Validate required fields
  if (!formData.fullName || !formData.userName || !formData.email) {
    console.error('Missing required fields')
    return
  }

  // Continue with API call...
}
```

### 11. Browser DevTools

#### Network Tab - Check Request

```
Method: PUT
URL: /api/v1/Accounts/{id}
Status: 200 OK
Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json
Body:
  {"fullName":"...","userName":"...","email":"...","phoneNumber":"..."}
```

#### Console - Error Messages

```
Look for:
- 401 Unauthorized → Check token
- 400 Bad Request → Check data format
- 500 Server Error → Check API server
- Network error → Check internet connection
```

### 12. Test Cases

#### Happy Path

1. Click edit pencil icon ✅
2. Dialog opens with data ✅
3. Change a field ✅
4. Click "Save Changes" ✅
5. Dialog closes ✅
6. List refreshes ✅
7. See updated data ✅

#### Error Cases

1. Empty required field → Validation error ✅
2. Invalid email format → Validation error ✅
3. Network failure → Error message ✅
4. API error → Error message ✅
5. Duplicate username → API error message ✅

---

**Ready to test!** 🚀

Start your dev server and try editing a user!
