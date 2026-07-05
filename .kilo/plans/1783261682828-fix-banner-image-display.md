# Fix Banner Image Display Issue

## Problem

Gambar banner event tidak muncul setelah event dipublish karena:

1. **Path tidak lengkap di frontend**: Component `EventCard.jsx` dan komponen lainnya menggunakan `event.banner_url` langsung tanpa menambahkan base URL backend
2. **Backend menyimpan path relatif**: Backend menyimpan `/uploads/events/{filename}` di database
3. **Frontend tidak tahu base URL backend**: Saat render, frontend mencoba load gambar dari path relatif tanpa domain backend

## Root Cause

Di `EventCard.jsx` line 19:
```jsx
<img src={event.banner_url} alt={event.title} />
```

Jika `banner_url` dari database adalah `/uploads/events/banner-123.jpg`, browser akan mencoba load dari frontend URL (misalnya `http://localhost:5173/uploads/events/banner-123.jpg`) bukan dari backend (`http://localhost:5000/uploads/events/banner-123.jpg`).

Ini terjadi di semua komponen yang render event banner:
- `frontend/src/components/landing/EventCard.jsx:19`
- `frontend/src/components/organizer/OrganizerEventCard.jsx:32`
- `frontend/src/components/participant/ParticipantEventCard.jsx:24`
- `frontend/src/pages/Public/EventDetailPage.jsx:133`
- `frontend/src/pages/Organizer/MyEventsPage.jsx:178`
- `frontend/src/pages/Organizer/EditEventPage.jsx:351` (sudah benar, tapi hardcoded)

## Solution

### Option A: Helper Function (Recommended)
Buat helper function untuk construct full image URL di semua komponen.

**Pros:**
- Centralized logic
- Easy to change base URL
- Works with environment variables
- No backend changes needed

**Cons:**
- Need to update multiple components

### Option B: Backend Returns Full URL
Ubah backend controller untuk return full URL instead of relative path.

**Pros:**
- Frontend tidak perlu logic tambahan
- Cleaner component code

**Cons:**
- Backend harus tahu public URL-nya sendiri
- Harder saat deploy ke different environments

**Recommendation: Option A** karena lebih flexible dan sesuai dengan best practice separation of concerns.

## Implementation Plan - Option A

### 1. Create Image URL Helper
**File**: `frontend/src/utils/imageHelper.js` (new file)

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api suffix

export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If already full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If relative path, prepend base URL
  return `${BASE_URL}${path}`;
};
```

### 2. Update All Components Using Banner URL

Update these files to use the helper:

**Files to modify:**
1. `frontend/src/components/landing/EventCard.jsx`
2. `frontend/src/components/organizer/OrganizerEventCard.jsx`
3. `frontend/src/components/participant/ParticipantEventCard.jsx`
4. `frontend/src/pages/Public/EventDetailPage.jsx`
5. `frontend/src/pages/Organizer/MyEventsPage.jsx`
6. `frontend/src/pages/Organizer/EditEventPage.jsx`

**Pattern:**
```jsx
import { getImageUrl } from '../../utils/imageHelper';

// Change from:
<img src={event.banner_url} alt={event.title} />

// To:
<img src={getImageUrl(event.banner_url)} alt={event.title} />
```

### 3. Fix EditEventPage Hardcoded URL

In `EditEventPage.jsx` line 351, replace:
```jsx
src={`http://localhost:5000${existingBannerUrl}`}
```

With:
```jsx
src={getImageUrl(existingBannerUrl)}
```

## Validation Steps

1. Create new event with banner image upload
2. Verify image appears in:
   - Landing page event list
   - Event detail page
   - Organizer dashboard
   - Edit event page (existing banner preview)
3. Test with different environments (development/production)
4. Test with external URLs (should still work for legacy data)

## Edge Cases Handled

- `banner_url` is null or empty → `getImageUrl` returns null, component shows "No Banner"
- `banner_url` is already full URL (legacy data) → `getImageUrl` returns as is
- `banner_url` is relative path → `getImageUrl` prepends base URL
- Different environments → Uses `VITE_API_URL` from env variables

## Files to Create
- `frontend/src/utils/imageHelper.js`

## Files to Modify
- `frontend/src/components/landing/EventCard.jsx`
- `frontend/src/components/organizer/OrganizerEventCard.jsx`
- `frontend/src/components/participant/ParticipantEventCard.jsx`
- `frontend/src/pages/Public/EventDetailPage.jsx`
- `frontend/src/pages/Organizer/MyEventsPage.jsx`
- `frontend/src/pages/Organizer/EditEventPage.jsx`

## Risk Assessment

**Low Risk** - Changes are isolated to image URL construction, no business logic affected.

## Rollback Plan

If issues occur, revert all components to use `event.banner_url` directly and temporarily serve images from frontend build.
