# Plan: Remove My Events Page and Redirect to Home After Edit

## Goal
1. Remove the "My Events" page (`MyEventsPage.jsx`) from the application
2. Change redirect after successful event edit to go to organizer home instead of My Events page
3. Change redirect after successful event creation to go to organizer home instead of My Events page
4. Remove all navigation links and routes to My Events page

## Context

### Current State
- **My Events Page**: `frontend/src/pages/Organizer/MyEventsPage.jsx` - A dashboard-style page showing all events in a grid with edit/delete actions
- **Edit Event Redirect**: Currently redirects to `/dashboard/organizer/events` after successful update
- **Create Event Redirect**: Currently redirects to `/dashboard/organizer/events` after successful creation
- **Navigation Links**: 
  - `DashboardLayout.jsx` sidebar has "My Events" menu item
  - Route defined in `AppRoutes.jsx` at `/dashboard/organizer/events`
- **Organizer Home**: Already has a `MyEventsSection` component that displays events in a similar way

### Why Remove My Events Page
The organizer home page (`/dashboard/organizer/home`) already displays all events through the `MyEventsSection` component, making the separate My Events page redundant.

## Implementation Steps

### 1. Update Edit Event Redirect
**File**: `frontend/src/pages/Organizer/EditEventPage.jsx`
- **Line 169**: Change `navigate('/dashboard/organizer/events')` to `navigate('/dashboard/organizer/home')`

### 2. Update Create Event Redirect
**File**: `frontend/src/pages/Organizer/CreateEventPage.jsx`
- **Line 118**: Change `navigate('/dashboard/organizer/events')` to `navigate('/dashboard/organizer/home')`

### 3. Remove My Events Route
**File**: `frontend/src/routes/AppRoutes.jsx`
- **Line 9**: Remove import `import MyEventsPage from '../pages/Organizer/MyEventsPage';`
- **Line 49**: Remove route `<Route path="/dashboard/organizer/events" element={<MyEventsPage />} />`

### 4. Update Dashboard Layout Sidebar Menu
**File**: `frontend/src/layouts/DashboardLayout.jsx`
- **Line 11**: Remove the "My Events" menu item from `organizerMenu` array
- **Lines 42-43**: Remove the isActive check logic for `/dashboard/organizer/events` path

### 5. Delete My Events Page File
**File**: `frontend/src/pages/Organizer/MyEventsPage.jsx`
- Delete this entire file (319 lines)

## Files to Modify

1. `frontend/src/pages/Organizer/EditEventPage.jsx` - Update redirect path
2. `frontend/src/pages/Organizer/CreateEventPage.jsx` - Update redirect path
3. `frontend/src/routes/AppRoutes.jsx` - Remove import and route
4. `frontend/src/layouts/DashboardLayout.jsx` - Remove menu item
5. `frontend/src/pages/Organizer/MyEventsPage.jsx` - DELETE file

## Files NOT to Change

- `frontend/src/components/organizer/MyEventsSection.jsx` - Keep this component (used in organizer home)
- `frontend/src/components/organizer/OrganizerEventCard.jsx` - Keep this component (used by MyEventsSection)
- `frontend/src/components/organizer/OrganizerNavbar.jsx` - No changes needed (doesn't link to My Events)
- Backend routes - No changes needed

## Edge Cases & Considerations

1. **Direct URL Access**: If a user bookmarks or directly accesses `/dashboard/organizer/events`, they will get a 404 or fall through to a not-found route. This is acceptable since we're removing the page.

2. **Edit Links in Event Cards**: The event cards in `OrganizerEventCard.jsx` (line 18) already use the correct edit route pattern `/dashboard/organizer/events/edit/${event.id}`, which is different from the My Events list page route, so no changes needed there.

3. **MyEventsPage vs MyEventsSection**: 
   - `MyEventsPage.jsx` = standalone dashboard page being removed
   - `MyEventsSection.jsx` = component used within organizer home page (keeping)

4. **Navigation Flow**:
   - Create Event → Success → Organizer Home
   - Edit Event → Success → Organizer Home
   - User can view/manage events from the home page's event section

## Validation

After implementation:
1. Navigate to create event page, create an event, verify redirect goes to `/dashboard/organizer/home`
2. Navigate to edit event page, update an event, verify redirect goes to `/dashboard/organizer/home`
3. Check that sidebar no longer shows "My Events" menu item
4. Verify that organizer home page still displays all events correctly via `MyEventsSection`
5. Verify edit and delete actions work from event cards on home page
6. Try accessing `/dashboard/organizer/events` directly - should not resolve to a valid page
7. Verify `MyEventsPage.jsx` file has been deleted

## Risk Assessment

**Low Risk** - This is a straightforward removal of redundant functionality:
- No data model changes
- No backend changes
- No breaking changes to other components
- The functionality (viewing events) is preserved in the home page
- Only navigation and routing changes

## Open Questions

None - implementation is straightforward.
