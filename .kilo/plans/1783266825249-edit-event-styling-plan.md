# Plan: Fix Banner Deletion on Edit Event Without Banner Change

## Problem Statement

When editing an event without uploading a new banner, the existing banner is being deleted/set to null. This happens because the backend update logic always overwrites the `banner_url` field, even when no new file is uploaded.

## Root Cause Analysis

### Current Flow

1. **Frontend** (`EditEventPage.jsx:155-158`):
   ```javascript
   // Only append banner if a new file is selected
   if (bannerFile) {
     formDataToSend.append('banner', bannerFile);
   }
   ```
   - Frontend correctly sends banner only when a new file is selected
   - When no new banner: `req.file` is `undefined` on backend

2. **Backend Controller** (`eventController.js:149-164`):
   ```javascript
   // Get banner path from uploaded file, or keep existing if no new file
   const bannerUrl = req.file ? `/uploads/events/${req.file.filename}` : undefined;
   
   const eventData = {
     title: title.trim(),
     description: description || null,
     location: location.trim(),
     event_date,
     price_eth,
     quota: Number(quota),
   };
   
   // Only update banner_url if a new file was uploaded
   if (bannerUrl !== undefined) {
     eventData.banner_url = bannerUrl;
   }
   ```
   - Controller correctly sets `bannerUrl = undefined` when no file uploaded
   - Controller correctly only adds `banner_url` to `eventData` when `bannerUrl !== undefined`
   - **This logic appears correct**

3. **Backend Service** (`eventService.js:67-74`):
   ```javascript
   const result = await pool.query(
     `UPDATE events
      SET title = $1, description = $2, location = $3, event_date = $4,
          price_eth = $5, quota = $6, banner_url = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING ...`,
     [title, description || null, location, event_date, price_eth, quota, banner_url || null, eventId]
   );
   ```
   - **PROBLEM FOUND**: The SQL UPDATE always includes `banner_url = $7`
   - When `data.banner_url` is `undefined`, it becomes `null` in the SQL parameter
   - This overwrites the existing banner with `null`

## The Issue

The service layer (`eventService.js`) always includes `banner_url` in the UPDATE statement, even when the controller intentionally omits it from `eventData`. JavaScript object destructuring of `data.banner_url` returns `undefined` when the property doesn't exist, which then gets passed as a SQL parameter and converted to `null`.

## Solution Options

### Option 1: Dynamic SQL Query (Recommended)
Build the UPDATE SQL dynamically to only include fields that should be updated.

**Pros:**
- Clean separation: only fields present in `data` are updated
- Preserves existing values for omitted fields
- Most flexible for future partial updates

**Cons:**
- Slightly more complex SQL building logic
- Need to handle dynamic parameter indexing

### Option 2: Fetch Current Banner Before Update
Query the current event, check if `data.banner_url` exists, and use the old value if not.

**Pros:**
- Simple logic
- Explicit about keeping old value

**Cons:**
- Extra database query
- Less efficient

### Option 3: Frontend Sends Existing Banner URL
Frontend sends the existing banner URL when no new file is uploaded.

**Pros:**
- No backend changes needed
- Simple

**Cons:**
- Frontend becomes responsible for preserving server state
- Violates separation of concerns
- Vulnerable if frontend state is stale

## Recommended Solution: Option 1 (Dynamic SQL)

Modify `eventService.js` `updateEvent` function to build SQL dynamically based on which fields are present in `data`.

## Implementation Steps

### 1. Update `eventService.js` - `updateEvent` function

**File**: `backend/services/eventService.js`
**Lines**: 51-77

Replace the static UPDATE query with dynamic field building:

```javascript
const updateEvent = async (eventId, organizerId, data) => {
  const event = await pool.query(
    'SELECT organizer_id FROM events WHERE id = $1',
    [eventId]
  );

  if (event.rows.length === 0) {
    throw new Error('Event not found');
  }

  if (event.rows[0].organizer_id !== organizerId) {
    throw new Error('Forbidden');
  }

  const { title, description, location, event_date, banner_url, price_eth, quota } = data;

  // Build SET clause dynamically based on provided fields
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  // Always update these core fields
  setClauses.push(`title = $${paramIndex++}`);
  values.push(title);

  setClauses.push(`description = $${paramIndex++}`);
  values.push(description || null);

  setClauses.push(`location = $${paramIndex++}`);
  values.push(location);

  setClauses.push(`event_date = $${paramIndex++}`);
  values.push(event_date);

  setClauses.push(`price_eth = $${paramIndex++}`);
  values.push(price_eth);

  setClauses.push(`quota = $${paramIndex++}`);
  values.push(quota);

  // Only update banner_url if explicitly provided (even if null)
  if (data.hasOwnProperty('banner_url')) {
    setClauses.push(`banner_url = $${paramIndex++}`);
    values.push(banner_url || null);
  }

  setClauses.push(`updated_at = NOW()`);

  // Add eventId as the final parameter for WHERE clause
  values.push(eventId);

  const query = `
    UPDATE events
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, description, location, event_date, price_eth, quota, banner_url, status
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};
```

**Key Changes:**
- Use `data.hasOwnProperty('banner_url')` to check if the property exists (not just if it's truthy)
- Only include `banner_url` in UPDATE when the property is present in `data`
- Build SQL and parameters dynamically
- This preserves the existing banner when `banner_url` is not in `data`

### 2. Verify Controller Logic (No changes needed)

**File**: `backend/controllers/eventController.js`
**Lines**: 149-164

The existing controller logic is correct:
- Sets `bannerUrl = undefined` when no file uploaded
- Only adds `banner_url` to `eventData` when `bannerUrl !== undefined`
- This means when no new banner is uploaded, `eventData` will NOT have a `banner_url` property

### 3. Verify Frontend Logic (No changes needed)

**File**: `frontend/src/pages/Organizer/EditEventPage.jsx`
**Lines**: 155-158

The frontend correctly only sends banner when a new file is selected.

## Edge Cases Considered

1. **New banner uploaded**: `banner_url` property exists in `data`, new path is saved ✅
2. **No banner change**: `banner_url` property doesn't exist in `data`, existing banner preserved ✅
3. **Banner explicitly set to null**: If we ever want to remove a banner, pass `banner_url: null` in data, it will be set to null ✅
4. **Create event without banner**: Create flow uses static SQL with `banner_url` parameter, works correctly ✅

## Testing Validation

After implementation:

1. **Edit event with new banner**:
   - Upload a new banner file
   - Submit form
   - Verify new banner is saved and displayed

2. **Edit event without changing banner**:
   - Edit event fields (title, description, etc.)
   - Do NOT upload a new banner
   - Submit form
   - Verify existing banner is preserved and still displays

3. **Create new event**:
   - Verify event creation still works with banner upload
   - Verify event creation still works without banner

4. **Edit event that has no banner**:
   - Edit an event that was created without a banner
   - Verify update succeeds without errors

## Risk Assessment

**Low Risk** - Isolated change to the update logic:
- Only affects `updateEvent` function in `eventService.js`
- No breaking changes to API contract
- Backward compatible with existing frontend
- Controller and frontend logic remain unchanged
- Create event flow unaffected

## Files to Modify

1. `backend/services/eventService.js` - Update `updateEvent` function (lines 51-77)

## Open Questions

None - the issue is clear and the solution is straightforward.
