# Plan: Fix Create Event Page Typography Size

## Problem Statement

Form Create Event terlihat terlalu besar karena menggunakan Hero Title size (text-5xl/6xl = 48-64px) untuk page header. Ini tidak sesuai dengan UI_GUIDELINES.md dan tidak konsisten dengan halaman form lainnya (Login, Register, Edit Event).

## Root Cause

CreateEventPage salah menggunakan Hero size typography karena didesain untuk "match Landing Page aesthetic". Landing Page **components** (navbar, footer, sections) reused dengan benar, tetapi Landing Page **Hero title sizes** tidak seharusnya digunakan untuk internal form pages.

## Design System Standards (UI_GUIDELINES.md)

### Typography Hierarchy:
- **Hero Title**: 56-64px → Landing hero sections only (OrganizerHome)
- **Section Title**: 32px → Section headers on landing pages
- **Card Title**: 20-24px → Card/Form headers
- **Body**: 16px → Body text
- **Caption**: 14px → Labels, small text

### Current Issues:
| Element | Current | Should Be | Standard |
|---------|---------|-----------|----------|
| Page Title | text-5xl/6xl (48-64px) | text-3xl/4xl (30-36px) | Form page header |
| Subtitle | text-lg (18px) | text-base (16px) | Body text |
| Form Labels | text-base (16px) | text-sm (14px) | Caption/label text |
| Label Spacing | mb-3 (0.75rem) | mb-2 (0.5rem) | Tighter spacing |
| Form Spacing | space-y-8 (2rem) | space-y-6 (1.5rem) | More compact |

## Comparison with Existing Pages

### EditEventPage (Already Correct):
```jsx
<h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
  Edit Event
</h1>
```
- Uses `text-2xl` (24px) ✅
- Uses DashboardLayout (sidebar)

### LoginPage (Already Correct):
```jsx
<h2 className="text-3xl font-bold text-white mb-2">
  Login to Tickify
</h2>
<p className="text-sm text-[#A0A0A0]">...</p>
```
- Title: `text-3xl` (30px) ✅
- Subtitle: `text-sm` (14px) ✅

### RegisterPage (Already Correct):
```jsx
<h2 className="text-3xl font-bold text-white mb-2">
  Create Account
</h2>
```
- Title: `text-3xl` (30px) ✅

### Recommendation:
CreateEventPage should use `text-3xl md:text-4xl` to match Login/Register pattern (full-width pages without sidebar).

## Implementation Changes

### File: `frontend/src/pages/Organizer/CreateEventPage.jsx`

#### 1. Page Header Title (Line ~142-144)
**Before:**
```jsx
<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
  Create Event
</h1>
```

**After:**
```jsx
<h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
  Create Event
</h1>
```

#### 2. Page Subtitle (Line ~145-147)
**Before:**
```jsx
<p className="max-w-2xl text-lg text-[#A0A0A0]">
  Publish a new blockchain event on Tickify.
</p>
```

**After:**
```jsx
<p className="max-w-2xl text-base text-[#A0A0A0]">
  Publish a new blockchain event on Tickify.
</p>
```

#### 3. All Form Labels (Multiple Lines)
**Before:**
```jsx
<label className="block text-base font-semibold text-white mb-3">
  Event Title
</label>
```

**After:**
```jsx
<label className="block text-sm font-semibold text-white mb-2">
  Event Title
</label>
```

**Affected lines (approximate):**
- Line ~167: Event Title label
- Line ~188: Description label
- Line ~211: Location label
- Line ~232: Event Date label
- Line ~255: Ticket Price label
- Line ~278: Quota label
- Line ~301: Banner label

#### 4. Form Section Spacing (Line ~164)
**Before:**
```jsx
<form onSubmit={handleSubmit} className="space-y-8" noValidate>
```

**After:**
```jsx
<form onSubmit={handleSubmit} className="space-y-6" noValidate>
```

## Files Affected

1. `frontend/src/pages/Organizer/CreateEventPage.jsx`
   - Page title size (1 change)
   - Subtitle size (1 change)
   - Form labels (7 changes)
   - Form spacing (1 change)
   - **Total: ~10 changes**

## Impact Assessment

### Visual Impact:
✅ Page header becomes proportional and less overwhelming
✅ Form feels more compact and professional
✅ Better visual hierarchy
✅ Consistent with Login/Register/Edit pages

### Zero Functional Impact:
✅ All validation logic unchanged
✅ All API calls unchanged
✅ All input functionality unchanged
✅ All event handlers unchanged
✅ Responsive behavior unchanged

### Cross-Page Consistency:
✅ CreateEventPage matches Login/Register pattern
✅ OrganizerHome hero remains large (correct for landing hero)
✅ EditEventPage already correct (no changes needed)

## Edge Cases Verified

### EditEventPage Status:
- Checked: Already uses correct typography (`text-2xl`)
- No changes needed ✅

### Back Button:
- Keep as-is (provides quick exit option)
- Not redundant with navbar on mobile

### Navbar Active State:
- "Create Event" link will remain highlighted
- No changes needed

### Responsive Behavior:
- Mobile: `text-3xl` (30px) for title
- Desktop: `text-4xl` (36px) for title
- Scales appropriately across breakpoints

## Validation Steps

1. Navigate to `/dashboard/organizer/events/create`
2. Verify page title is proportional (not overwhelming)
3. Verify subtitle is readable and subtle
4. Verify form labels are clear but not oversized
5. Verify form sections have appropriate spacing
6. Compare visually with Login/Register pages
7. Test on mobile (< 768px), tablet (768-1024px), desktop (>1024px)
8. Verify form validation still works
9. Verify form submission still works
10. Verify build succeeds

## Implementation Tasks

1. Update page title: `text-5xl md:text-6xl` → `text-3xl md:text-4xl`
2. Update subtitle: `text-lg` → `text-base`
3. Update all 7 form labels: `text-base mb-3` → `text-sm mb-2`
4. Update form spacing: `space-y-8` → `space-y-6`
5. Run build test
6. Visual verification across breakpoints

## Risks

**Risk Level: Very Low**

- Typography-only changes
- No logic modifications
- No API changes
- No structural changes
- Already proven pattern from Login/Register pages

## Open Questions

None. All decisions resolved:
- ✅ Apply all typography fixes
- ✅ Check EditEventPage (already correct, no changes needed)
- ✅ Use `text-3xl/4xl` to match Login/Register pattern
- ✅ Reduce form spacing to `space-y-6`

## Ready for Implementation

This plan is implementation-ready. All design decisions are resolved and validated against existing codebase patterns.
