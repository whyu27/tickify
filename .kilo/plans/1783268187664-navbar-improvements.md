# Navbar Improvements Plan

## Overview
Improve navbar consistency across Landing Page, Participant Dashboard, and Organizer Dashboard by:
1. Removing Profile links/buttons from all navbars
2. Centering navigation menu items on dashboard pages
3. Adding logo component to Landing Page and Participant navbars (matching Organizer style)
4. Adding Logout button to Organizer and Participant navbars

## Current State Analysis

### 1. Organizer Navbar (`components/organizer/OrganizerNavbar.jsx`)
- ✅ Has logo component (white square with "T" + "Tickify" text)
- ✅ Navigation links are left-aligned (not centered)
- ❌ Has Profile button in desktop/mobile menu (lines 56-62, 102-108)
- ❌ No Logout button
- ✅ Already imports `useAuth` hook (line 4)
- Structure: Logo (left) | Nav Links (center-left) | Wallet + Profile (right)

### 2. Participant Navbar (`components/participant/ParticipantNavbar.jsx`)
- ❌ No logo component (only text "Tickify")
- ✅ Navigation is centered using absolute positioning
- ❌ Has Profile button (lines 31-37)
- ❌ No Logout button
- ❌ Does not import `useAuth` hook
- Structure: Text Logo (left) | Centered Nav | Wallet + Profile (right)

### 3. Landing Navbar (`components/landing/Navbar.jsx`)
- ❌ No logo component (only text "Tickify")
- ✅ Navigation is centered using absolute positioning
- ✅ No Profile link (has Login/Register instead)
- Structure: Text Logo (left) | Centered Nav | Login + Register (right)

### 4. Dashboard Layout (`layouts/DashboardLayout.jsx`)
- Uses sidebar navigation (different pattern)
- Has Profile in sidebar menu
- Not affected by this plan

## Design Decisions

### Logo Component
Based on Organizer Navbar pattern (lines 24-29):
```jsx
<Link to="[HOME_PATH]" className="flex items-center gap-2">
  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
    <span className="text-black font-black text-lg">T</span>
  </div>
  <span className="text-xl font-bold text-white">Tickify</span>
</Link>
```

### Navigation Centering
- Organizer Navbar needs to center navigation menu items
- Participant and Landing navbars already use centered pattern with absolute positioning
- Apply same pattern: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`

### Profile Removal & Logout Addition Strategy
- Remove Profile button/link from right action section
- Add Logout button to replace Profile button
- Keep Connect Wallet button
- Use `useAuth` hook's `logout` function (available in AuthContext)
- Logout button should use `LogOut` icon from lucide-react
- Do NOT modify DashboardLayout sidebar (Profile still accessible there)

## Implementation Tasks

### Task 1: Update Organizer Navbar
**File**: `frontend/src/components/organizer/OrganizerNavbar.jsx`

1. Import LogOut icon:
   - Add `LogOut` to lucide-react imports (line 3)
   - Example: `import { Menu, X, Wallet, LogOut } from 'lucide-react';`

2. Extract logout function from useAuth:
   - Update line 8: `const { user, logout } = useAuth();`

3. Center navigation menu items (desktop):
   - Wrap navLinks in absolute positioned container (lines 32-46)
   - Add: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`

4. Replace Profile button with Logout button (desktop):
   - Delete Profile Link element (lines 56-62)
   - Add Logout button after Connect Wallet button
   - Button style: secondary button (border style, not primary)
   - Icon: `<LogOut className="w-4 h-4" strokeWidth={1.5} />`
   - Text: "Logout"
   - onClick: call `logout()` function

5. Replace Profile button with Logout button (mobile):
   - Delete Profile Link from mobile menu (lines 102-108)
   - Add Logout button after Connect Wallet button
   - Use same secondary button style as desktop

### Task 2: Update Participant Navbar
**File**: `frontend/src/components/participant/ParticipantNavbar.jsx`

1. Import required dependencies:
   - Add `LogOut` to lucide-react imports (line 2)
   - Import `useAuth` hook: `import useAuth from '../../hooks/useAuth';`

2. Extract logout function from useAuth:
   - Add inside component: `const { logout } = useAuth();`

3. Add logo component:
   - Replace text-only logo (line 9-11) with Organizer-style logo component
   - Use same structure: white square + "T" + "Tickify" text

4. Replace Profile button with Logout button:
   - Delete Profile Link (lines 31-37)
   - Add Logout button after Connect Wallet button
   - Button style: secondary button (border style)
   - Icon: `<LogOut className="w-4 h-4" strokeWidth={1.5} />`
   - Text: "Logout"
   - onClick: call `logout()` function

5. Add mobile menu (if needed):
   - Currently no mobile menu exists
   - May need to add mobile responsiveness similar to Organizer pattern

### Task 3: Update Landing Navbar
**File**: `frontend/src/components/landing/Navbar.jsx`

1. Add logo component:
   - Replace text-only logo (line 8-10) with Organizer-style logo component
   - Use same structure: white square + "T" + "Tickify" text
   - Link destination: "/" (home)

2. Keep existing centered navigation (no changes needed)

3. Keep Login/Register buttons (no changes needed)

## File Changes Summary

| File | Changes |
|------|---------|
| `components/organizer/OrganizerNavbar.jsx` | Center nav menu, replace Profile with Logout button (desktop + mobile), import LogOut icon, extract logout from useAuth |
| `components/participant/ParticipantNavbar.jsx` | Add logo component, replace Profile with Logout button, import useAuth hook and LogOut icon |
| `components/landing/Navbar.jsx` | Add logo component (no logout needed - not authenticated) |

## UI Consistency Rules (from UI_GUIDELINES.md)

### Navbar Structure
- Dark Mode Only: `#0A0A0A` background
- Navbar Height: `72px`
- Border: `border-white/8`

### Logo Component
- Typography: `text-xl font-bold` for logo text
- Logo square: `w-8 h-8 bg-white rounded-lg`
- Logo letter: `text-black font-black text-lg`
- Spacing: `gap-2` between logo icon and text

### Button Styling
- **Primary Button**: `bg-white text-black` (for important actions)
- **Secondary Button**: `bg-transparent border border-white/12 text-white` (for supporting actions)
- **Logout Button**: Use secondary style (consistent with Connect Wallet)
- Button height: `py-2` or `py-2.5`
- Button padding: `px-4` or `px-5`
- Border radius: `rounded-xl`
- Font: `text-sm font-semibold`
- Icon size: `w-4 h-4` with `strokeWidth={1.5}`
- Hover state: `hover:border-white/25 hover:bg-white/5`

## Validation Steps

1. **Visual Consistency**
   - All three navbars should have identical logo component
   - Navigation items should be centered on Organizer and Participant navbars
   - No Profile button/link visible on any navbar

2. **Functionality**
   - Logo links work correctly (Organizer → `/dashboard/organizer/home`, Participant → `/participant/home`, Landing → `/`)
   - Navigation links remain functional
   - Connect Wallet button still present on authenticated navbars
   - Login/Register buttons still present on Landing navbar
   - **Logout button works**: clicking it should call `logout()` function and redirect to `/login`
   - **Logout button positioning**: appears after Connect Wallet button in right action section

3. **Responsive Behavior**
   - Logo component displays correctly on mobile
   - Mobile menus show Logout button instead of Profile option
   - Navigation remains centered on all screen sizes
   - Logout button is accessible on mobile menu

4. **Accessibility**
   - Profile still accessible via DashboardLayout sidebar (not removed from app)
   - All navigation remains keyboard accessible
   - Screen readers can interpret logo component

## Edge Cases & Considerations

1. **Profile Access**: Users can still access profile via sidebar in DashboardLayout (unchanged)
2. **Logout Behavior**: 
   - `logout()` function from AuthContext removes token from localStorage
   - Redirects to `/login` page via `window.location.href`
   - Clears user state completely
3. **Mobile Navigation**: Participant Navbar may need mobile menu implementation if not already present
4. **Logo Click Behavior**: Ensure logo navigation doesn't break user flow
5. **Wallet Integration**: Connect Wallet button remains for future blockchain integration
6. **Button Order**: Right section should be: Connect Wallet | Logout (consistent across both navbars)

## Out of Scope

- Modifying DashboardLayout sidebar (Profile item stays there)
- Implementing actual wallet connection logic
- Adding new navigation items
- Changing color scheme or typography beyond logo component
- Mobile menu implementation for Landing Navbar (if not needed)

## Risk Assessment

**Low Risk Changes:**
- Adding logo component (purely visual, no logic change)
- Centering navigation (CSS-only change)

**Medium Risk Changes:**
- Removing Profile buttons (ensure no broken links elsewhere)
- Adding Logout functionality (ensure logout works correctly)

**Mitigation:**
- Test all navbar links after changes
- Verify Profile is still accessible via sidebar
- Test logout functionality: verify token removal, state clearing, and redirect to `/login`
- Check responsive behavior on mobile devices
- Verify useAuth hook is properly imported and logout function is extracted
