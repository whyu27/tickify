# Plan: Consolidate Participant Routes - Use Only /participant/home

## Goal
Remove the duplicate `/dashboard/participant` route and keep only `/participant/home` as the single participant home page.

## Problem
Currently two routes show the same participant home page:
- `/dashboard/participant` - wrapped in DashboardLayout (sidebar + header)
- `/participant/home` - standalone with ParticipantNavbar

Both now have identical content (Hero, Statistics, Events, FAQ, Footer), which is confusing and redundant.

## Decision
**Keep `/participant/home` as the primary route** and remove `/dashboard/participant` completely.

Rationale:
- `/participant/home` uses the new ParticipantNavbar matching the Landing Page design
- Consistent with `/participant/tickets` and `/participant/profile` URL pattern
- DashboardLayout sidebar is more suitable for organizer workflows, not participant browsing

## Implementation Steps

### Step 1: Update AppRoutes.jsx
**File**: `frontend/src/routes/AppRoutes.jsx`

1. Remove import: `import ParticipantDashboard from '../pages/Participant/ParticipantDashboard';`
2. In the Participant Protected Routes section:
   - Remove the entire `<Route element={<DashboardLayout />}>` wrapper that contains `/dashboard/participant` and `/participant/profile`
   - Keep `/participant/home` route as-is: `<Route path="/participant/home" element={<ParticipantHome />} />`
   - Keep `/participant/tickets` route as-is: `<Route path="/participant/tickets" element={<MyTickets />} />`
   - Move `/participant/profile` route outside DashboardLayout: `<Route path="/participant/profile" element={<ProfilePage />} />`

### Step 2: Delete ParticipantDashboard.jsx
**File**: `frontend/src/pages/Participant/ParticipantDashboard.jsx`

Action: Delete this file completely. It's now duplicate of ParticipantHome.

### Step 3: Update LoginPage.jsx Redirect
**File**: `frontend/src/pages/Auth/LoginPage.jsx`

Change line 55:
- From: `navigate('/dashboard/participant');`
- To: `navigate('/participant/home');`

### Step 4: Update DashboardLayout.jsx Participant Menu
**File**: `frontend/src/layouts/DashboardLayout.jsx`

Update the `participantMenu` array (lines 16-21):
```javascript
const participantMenu = [
  { name: 'Home', path: '/participant/home', icon: LayoutDashboard, disabled: false },
  { name: 'Browse Events', path: '/', icon: Calendar, disabled: false },
  { name: 'My Tickets', path: '/participant/tickets', icon: Ticket, disabled: false },
  { name: 'Profile', path: '/participant/profile', icon: User, disabled: false },
];
```

**Note**: This menu is still used if participants ever access DashboardLayout (e.g., through organizer routes or shared pages). The updated paths ensure consistency.

### 5. Update Profile Page Route for Participants
**Decision**: Use ParticipantNavbar for `/participant/profile` (consistent with other participant pages)

**Note**: ProfilePage currently uses DashboardLayout styling (gray/zinc colors, cards). When moved outside DashboardLayout, it will need its own wrapper or to be styled to match the Tickify dark theme (#0A0A0A).

**Options**:
- **A**: Move route outside DashboardLayout and let ProfilePage render as-is (may look inconsistent)
- **B**: Wrap ProfilePage content in a layout with ParticipantNavbar + Footer (recommended for consistency)
- **C**: Create a separate ParticipantProfilePage that uses Tickify dark theme styling

**Recommendation**: Option B - Move the route and ensure ProfilePage is accessible, but styling updates can be done separately if needed.

## Files to Modify

1. `frontend/src/routes/AppRoutes.jsx` - Remove /dashboard/participant route and ParticipantDashboard import
2. `frontend/src/pages/Participant/ParticipantDashboard.jsx` - DELETE this file
3. `frontend/src/pages/Auth/LoginPage.jsx` - Update redirect URL after participant login
4. `frontend/src/layouts/DashboardLayout.jsx` - Update participantMenu paths

## Validation

After implementation, verify:

1. **Login Flow**
   - Login as participant → redirects to `/participant/home` ✓
   - Shows Hero, Statistics, Events with "Buy Ticket", FAQ, Footer ✓

2. **Navigation**
   - `/participant/home` → Participant home page with ParticipantNavbar ✓
   - `/participant/tickets` → My Tickets page ✓
   - `/participant/profile` → Profile page (no DashboardLayout sidebar) ✓
   - `/dashboard/participant` → 404 Not Found or no route match ✓

3. **ParticipantNavbar Links**
   - Home link → `/participant/home` ✓
   - My Tickets link → `/participant/tickets` ✓
   - Connect Wallet button → UI only (console log) ✓
   - Profile link → `/participant/profile` ✓

4. **DashboardLayout Updates**
   - Participant menu paths updated (even if not actively used) ✓
   - Organizer routes unaffected ✓

5. **File Cleanup**
   - `ParticipantDashboard.jsx` file deleted ✓
   - No imports referencing ParticipantDashboard remain ✓

## Open Questions

None. All design decisions have been resolved.

## No Changes Required

- Backend/API endpoints
- Blockchain logic  
- Database schema
- ParticipantHome, MyTickets, ParticipantNavbar components (already correct)
- Organizer routes and DashboardLayout usage for organizers
