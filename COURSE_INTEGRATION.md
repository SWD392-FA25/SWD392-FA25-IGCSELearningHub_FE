# ✅ Course Management - Integration Complete

## 🎯 Đã Hoàn Thành

### 1. Tạo Course Service (`src/services/courseService.ts`)

```typescript
export interface Course {
  id: number
  title: string
  level: string
  price: number
  shortDescription: string
  totalQuizzes: number
  totalAssignments: number
  // Additional fields for UI (từ BE sau)
  students?: number
  teacher?: string
  status?: 'Active' | 'Disabled'
  progress?: number
}
```

**Functions:**

- ✅ `getCourses(pageNumber, pageSize)` - Fetch all courses with pagination
- ✅ `getCourseById(id)` - Get single course
- ✅ `deleteCourse(id)` - Delete course
- ✅ `createCourse(data)` - Create new course
- ✅ `updateCourse(id, data)` - Update course

### 2. Cập Nhật Course Page (`src/app/pages/admin/courses/Course.tsx`)

**Features Đã Thêm:**

- ✅ Fetch data từ API khi component mount
- ✅ Search functionality (title, level, description, ID)
- ✅ Loading state
- ✅ Error handling
- ✅ Display API data với các trường:
  - **ID** - Course ID
  - **Title** - Tên khóa học
  - **Level** - Cấp độ (Core / Extended, Nâng cao, etc.)
  - **Price** - Giá (format VND currency)
  - **Description** - Mô tả ngắn
  - **Students** - Số học sinh (N/A nếu chưa có)
  - **Teacher** - Giáo viên (N/A nếu chưa có)
  - **Status** - Trạng thái (Active/Disabled - default Active)
  - **Progress** - Tiến độ (N/A nếu chưa có)

## 📊 API Endpoint

```bash
GET /api/v1/courses?pageNumber=1&pageSize=20
Authorization: Bearer {token}
```

**Response Structure:**

```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 3,
  "totalPages": 1,
  "hasNext": false,
  "hasPrevious": false,
  "succeeded": true,
  "status": "success",
  "statusCode": 200,
  "message": "Operation successful.",
  "data": [
    {
      "id": 3,
      "title": "Mathematics (9–1)",
      "level": "Core / Extended",
      "price": 800000,
      "shortDescription": "Phiên bản đánh giá theo thang điểm 9–1",
      "totalQuizzes": 0,
      "totalAssignments": 0
    }
  ]
}
```

## 🎨 UI Features

### Hiển Thị Data

```
┌─────────────────────────────────────────────────────────────────┐
│ ID │ Title             │ Level    │ Price      │ Description    │
├─────────────────────────────────────────────────────────────────┤
│ 3  │ Mathematics (9–1) │ Core/Ext │ 800.000 ₫  │ Phiên bản...  │
│    │ 📚 0 quizzes      │          │            │                │
│    │ 0 assignments     │          │            │                │
└─────────────────────────────────────────────────────────────────┘
```

### Search Bar

- Search by: title, level, description, ID
- Real-time filtering

### Price Formatting

- Vietnamese currency format: `800.000 ₫`
- Using `Intl.NumberFormat('vi-VN')`

### Additional Info

- Shows `totalQuizzes` and `totalAssignments` under course title
- Badge for level
- Truncated description with tooltip

## 🔄 Workflow

1. **Load Page** → Fetch courses from API
2. **Display** → Show all courses in table with API data
3. **Search** → Filter courses by search query
4. **Actions:**
   - 👁️ View - Open detail dialog
   - ✏️ Edit - Open edit dialog
   - 🗑️ Delete - Delete course and refresh list

## 📝 Data Flow

```
API Response
    ↓
courseService.getCourses()
    ↓
Course.tsx (setState)
    ↓
filteredCourses (with search)
    ↓
Table Display
```

## 🎯 Các Trường Placeholder (Chờ BE)

Các trường sau hiện tại hiển thị "N/A" hoặc giá trị mặc định, sẽ được BE cung cấp sau:

- `students` - Số lượng học sinh (hiện tại: N/A)
- `teacher` - Tên giáo viên (hiện tại: N/A)
- `status` - Trạng thái (hiện tại: Active mặc định)
- `progress` - Tiến độ (hiện tại: N/A)

## 🧪 Test

1. **Đảm bảo có JWT token:**

```javascript
localStorage.getItem('jwtToken')
```

2. **Mở Course Page:**

```
http://localhost:3000/pages/admin/courses
```

3. **Kiểm tra:**

- [ ] Courses load từ API
- [ ] Hiển thị đúng: ID, Title, Level, Price, Description
- [ ] Price format đúng (VND)
- [ ] Search hoạt động
- [ ] View/Edit/Delete buttons
- [ ] Loading state khi fetch data
- [ ] Error message nếu API fail

## 📦 Files Changed

1. ✅ **Created**: `src/services/courseService.ts`
2. ✅ **Updated**: `src/app/pages/admin/courses/Course.tsx`

## 🚀 Ready to Use

Course page đã sẵn sàng để:

- Hiển thị data từ API
- Search courses
- CRUD operations (khi BE implements)
- Chờ BE cung cấp thêm fields: students, teacher, status, progress

---

**Status**: ✅ COMPLETE
**Last Updated**: Now
**API Integrated**: YES
