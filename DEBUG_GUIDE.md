# 🔧 Hướng Dẫn Test và Sửa Lỗi API

## 📋 Tình Trạng Hiện Tại

### ✅ Đã Hoàn Thành

1. ✅ Đã tạo lại file `src/services/api.ts` với export functions đúng
2. ✅ Đã xóa cache `.next` và restart dev server
3. ✅ Dev server đang chạy ở `http://localhost:3000`
4. ✅ Tạo trang test API tại `/test-api`

### 🔍 Các File Quan Trọng

- `src/services/api.ts` - Core API functions (fetchWithAuth, get, post, put, del)
- `src/services/userService.ts` - User service sử dụng API
- `src/app/pages/admin/students/Student.tsx` - Students page
- `src/app/pages/admin/teachers/Teacher.tsx` - Teachers page
- `src/app/pages/admin/parents/Parent.tsx` - Parents page
- `src/app/test-api/page.tsx` - Test page để kiểm tra API

## 🧪 BƯỚC 1: Login và Lấy JWT Token

1. Mở browser: `http://localhost:3000/login`
2. Đăng nhập với:
   - Username/Email: `admin` hoặc `admin123@example.com`
   - Password: mật khẩu của bạn
3. Sau khi login, mở Console (F12) và check:
   ```javascript
   localStorage.getItem('jwtToken')
   ```
4. Nếu có token, copy token đó ra

**Token mẫu từ API:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwianRpIjoiNTQ1NTQzMzgtYjc2MS00NDE1LWE2MDEtNDI4MzZiODlhOGNkIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwiQWNjb3VudFN0YXR1cyI6IkFjdGl2ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzYyMjUzNjE5LCJpc3MiOiJJR0NTRUxlYXJuaW5nSHViQXBwIiwiYXVkIjoiSUdDU0VMZWFybmluZ0h1YlVzZXJzIn0.PTndsN5ddD1X8EJs0Qh8ctHrfbF8jIEbplCf0qw1CWQ
```

## 🧪 BƯỚC 2: Test API Trực Tiếp

### Option A: Dùng Test Page

1. Mở: `http://localhost:3000/test-api`
2. Trang này sẽ tự động:
   - Check xem fetchWithAuth có phải là function không
   - Gọi getAllAccounts()
   - Hiển thị tất cả users
   - Filter theo role

### Option B: Test Trong Browser Console

Mở Console (F12) và chạy:

```javascript
// 1. Set token nếu chưa có
localStorage.setItem('jwtToken', 'YOUR_TOKEN_HERE')

// 2. Test fetch trực tiếp
fetch(
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1/Accounts',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      Accept: '*/*',
    },
  }
)
  .then((res) => res.json())
  .then((data) => {
    console.log('Total users:', data.data.length)
    console.log(
      'Students:',
      data.data.filter((u) => u.role === 'Student').length
    )
    console.log(
      'Teachers:',
      data.data.filter((u) => u.role === 'Teacher').length
    )
    console.log('Parents:', data.data.filter((u) => u.role === 'Parent').length)
    console.log('All users:', data.data)
  })
  .catch((err) => console.error('Error:', err))
```

## 🧪 BƯỚC 3: Test Admin Pages

### Test Students Page

1. Mở: `http://localhost:3000/pages/admin/students`
2. Kiểm tra:
   - [ ] Có loading state không?
   - [ ] Có hiển thị data không?
   - [ ] Có lỗi gì trong Console không?
3. Nếu có lỗi, check Console và gửi cho tôi screenshot

### Test Teachers Page

1. Mở: `http://localhost:3000/pages/admin/teachers`
2. Kiểm tra tương tự

### Test Parents Page

1. Mở: `http://localhost:3000/pages/admin/parents`
2. Kiểm tra tương tự

## 🐛 Nếu Vẫn Còn Lỗi "fetchWithAuth is not a function"

### Fix 1: Hard Refresh Browser

1. Mở trang bị lỗi
2. Nhấn `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
3. Hoặc mở DevTools > Network tab > check "Disable cache" > reload

### Fix 2: Clear Browser Cache

1. Mở Console (F12)
2. Chạy:

```javascript
localStorage.clear()
sessionStorage.clear()
location.reload(true)
```

### Fix 3: Restart Dev Server

```powershell
# Trong terminal
Ctrl + C  # Dừng server
npm run dev  # Chạy lại
```

### Fix 4: Xóa Cache Hoàn Toàn

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache
npm run dev
```

## 📊 Dữ Liệu Mong Đợi

Theo API response, bạn có:

- **Total Users**: 11
- **Students**: 9 users (id: 2, 3, 5, 6, 7, 8, 9, 10, 11)
- **Teachers**: 0 users (chưa có)
- **Parents**: 0 users (chưa có)
- **Admins**: 2 users (id: 1, 4)

### Expected Display:

- Students Page: Hiển thị 9 students
- Teachers Page: "No teachers found"
- Parents Page: "No parents found"

## 🔍 Debug Checklist

Nếu vẫn lỗi, check các điều sau:

### 1. Check API File

```powershell
Get-Content src\services\api.ts | Select-Object -First 10
```

Phải thấy:

```typescript
// API Service - Client-side only
export const API_BASE_URL = ...
```

### 2. Check Import Trong userService.ts

```powershell
Get-Content src\services\userService.ts | Select-Object -First 5
```

Phải thấy:

```typescript
import { PaginatedResponse, User } from '@/types/api'
import { fetchWithAuth } from './api'
```

### 3. Check Browser Console

- Mở Console (F12)
- Check có error message nào không
- Screenshot và gửi cho tôi

### 4. Check Network Tab

- Mở Network tab
- Reload trang
- Check xem có call API đến `/Accounts` không
- Nếu có, check response status và data

## 💡 Giải Pháp Cuối Cùng

Nếu tất cả đều không work, có thể dùng cách fetch trực tiếp trong component:

```typescript
const fetchStudents = async () => {
  try {
    const token = localStorage.getItem('jwtToken')
    const response = await fetch(
      'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1/Accounts',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
      }
    )
    const result = await response.json()
    const students = result.data.filter((u) => u.role === 'Student')
    setStudents(students)
  } catch (err) {
    console.error(err)
  }
}
```

## 📞 Next Steps

1. ✅ Login và lấy JWT token
2. ✅ Mở `/test-api` và xem kết quả
3. ✅ Test từng admin page
4. 📸 Nếu có lỗi, chụp màn hình Console và gửi cho tôi
5. 📝 Ghi lại error message đầy đủ

**Current Status**:

- ✅ Server running: http://localhost:3000
- ✅ Test page available: http://localhost:3000/test-api
- ⏳ Waiting for your test results
