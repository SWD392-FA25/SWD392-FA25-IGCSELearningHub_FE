# ✅ Global Search từ Header - IMPLEMENTATION GUIDE

## 🎯 Đã Hoàn Thành

### 1. SearchContext (`src/context/SearchContext.tsx`) ✅

Context để chia sẻ search query giữa header và pages.

```typescript
export function SearchProvider({ children })
export function useSearch() => { searchQuery, setSearchQuery }
```

### 2. Dashboard Header (`src/components/layout/dashboard-header.tsx`) ✅

Header search box giờ đây control search cho toàn bộ pages.

**Changes:**

- Import `useSearch` from context
- Bind search input với `searchQuery` và `setSearchQuery`
- Placeholder: "Search in current page..."

### 3. Course Page ✅

- Đã wrap với `SearchProvider`
- Đã xóa search bar riêng
- Sử dụng `searchQuery` từ header context

## 🔄 Cần Áp Dụng cho Students, Teachers, Parents Pages

### Steps để Update Các Pages Còn Lại:

#### 1. Update Imports

```typescript
// BEFORE
import { Input } from '@/components/ui/input'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { deleteAccount, getAccountsByRole } from '@/services/userService'

// AFTER
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteAccount } from '@/services/userService'
```

#### 2. Rename Component

```typescript
// BEFORE
export default function TeachersPage() {

// AFTER
function TeachersPageContent() {
```

#### 3. Remove Local searchQuery State

```typescript
// REMOVE THIS
const [searchQuery, setSearchQuery] = useState('')

// ADD THIS
const { searchQuery } = useSearch()
```

#### 4. Update fetchData Function

```typescript
// ADD dynamic import
const fetchTeachers = async () => {
  try {
    setIsLoading(true)
    setError(null)

    // Dynamic import to ensure client-side
    const { getAccountsByRole } = await import('@/services/userService')
    const data = await getAccountsByRole('Teacher')

    // ...rest of code
  }
}
```

#### 5. Remove Search Bar JSX

```typescript
// REMOVE THIS ENTIRE BLOCK
{
  /* Search Bar */
}
;<div className="mb-6">
  <div className="relative">
    <Search className="absolute left-3..." />
    <Input
      type="text"
      placeholder="..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>
</div>
```

#### 6. Add Wrapper Component at End

```typescript
// ADD THIS AT THE END OF FILE
// Wrap with SearchProvider
export default function TeachersPage() {
  return (
    <SearchProvider>
      <TeachersPageContent />
    </SearchProvider>
  )
}
```

## 📋 Quick Checklist per Page

### Teachers Page

- [ ] Import SearchProvider và useSearch
- [ ] Remove Search icon import
- [ ] Remove Input import
- [ ] Rename function to TeachersPageContent
- [ ] Remove searchQuery useState
- [ ] Add useSearch hook
- [ ] Add dynamic import in fetchTeachers
- [ ] Remove search bar JSX
- [ ] Add wrapper component with SearchProvider

### Parents Page

- [ ] Import SearchProvider và useSearch
- [ ] Remove Search icon import
- [ ] Remove Input import
- [ ] Rename function to ParentsPageContent
- [ ] Remove searchQuery useState
- [ ] Add useSearch hook
- [ ] Add dynamic import in fetchParents
- [ ] Remove search bar JSX
- [ ] Add wrapper component with SearchProvider

## 🎨 User Experience

### Trước (Before)

```
┌─────────────────────────────────────────┐
│ Header (empty search)                   │
├─────────────────────────────────────────┤
│ Page Title                              │
│ [Search box in page] ← Riêng từng page │
│ ┌─────────────────────────────────────┐ │
│ │ Table with data                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Sau (After)

```
┌─────────────────────────────────────────┐
│ [Global Search in Header] ← Dùng chung │
├─────────────────────────────────────────┤
│ Page Title                              │
│ (no search bar here)                    │
│ ┌─────────────────────────────────────┐ │
│ │ Table filtered by header search     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## ✨ Benefits

1. **Consistent UX** - Search ở cùng một vị trí cho tất cả pages
2. **Less Code** - Không cần duplicate search bar code
3. **Cleaner UI** - Giảm clutter trong page content
4. **Better Mobile** - Header search luôn accessible
5. **Context Aware** - Search chỉ affect page hiện tại

## 🧪 Testing

### Test Each Page:

1. Navigate to page (Students/Teachers/Parents/Courses)
2. Type in header search box
3. Verify table data filters correctly
4. Clear search → verify all data shows again
5. Switch to another page → verify search resets

### Expected Behavior:

- ✅ Search filters data in real-time
- ✅ Search is case-insensitive
- ✅ Search across multiple fields (username, email, full name, ID)
- ✅ Search resets when navigating to different page
- ✅ Empty search shows all data

## 📊 Current Status

| Page     | Search Context | Dynamic Import | Search Bar Removed | Wrapper Added | Status     |
| -------- | -------------- | -------------- | ------------------ | ------------- | ---------- |
| Courses  | ✅             | N/A            | ✅                 | ✅            | ✅ Done    |
| Students | ✅             | ✅             | ✅                 | ✅            | ✅ Done    |
| Teachers | ⏳             | ⏳             | ⏳                 | ⏳            | 🔄 Pending |
| Parents  | ⏳             | ⏳             | ⏳                 | ⏳            | 🔄 Pending |

## 🚀 Next Actions

1. ✅ ~~Create SearchContext~~ - DONE
2. ✅ ~~Update Dashboard Header~~ - DONE
3. ✅ ~~Update Course Page~~ - DONE
4. ✅ ~~Update Students Page~~ - DONE
5. ⏳ Update Teachers Page - TODO
6. ⏳ Update Parents Page - TODO
7. ⏳ Test all pages - TODO

---

**Estimated Time to Complete**: 10-15 minutes
**Complexity**: Low - mostly copy/paste pattern
**Files to Edit**: 2 remaining (Teachers.tsx, Parents.tsx)
