# Hero Button Sizing Fix Plan

## Problem

Hero section CTA buttons are too large compared to other buttons in the application.

**Current state:**
- Hero buttons: `px-8 py-4` (32px horizontal, 16px vertical padding)
- Navbar buttons: `px-5 py-2.5` (20px horizontal, 10px vertical padding)
- Other buttons: `px-6 py-3` (24px horizontal, 12px vertical padding)

## Analysis

Checking button sizing across landing components:

| Component | Padding | Text Size | Usage |
|-----------|---------|-----------|-------|
| Navbar | `px-5 py-2.5` | `text-sm` | Auth buttons |
| Hero | `px-8 py-4` | `text-base` | CTA buttons (too large) |
| EventCard | `px-6 py-3` | `text-sm` | Action buttons |
| EventSection | `px-6 py-2.5` | `text-sm` | Filter buttons |
| SubscriptionSection | `px-6 py-3` | `text-sm` | Plan CTA buttons |

The Hero buttons use `px-8 py-4` which creates buttons that are visually too prominent and inconsistent with the rest of the landing page.

## Design Guidelines Reference

From `UI_GUIDELINES.md`:
- Button radius: 12px ✓ (using `rounded-xl`)
- Buttons use transitions ✓
- No specific padding dimensions specified

From `LANDING_REFERENCE.md`:
- Hero CTA mentioned but no specific sizing requirements

## Recommendation

**Reduce Hero button padding to match standard CTA buttons:**
- Change from `px-8 py-4` to `px-6 py-3`
- Keep `text-base` font size (Hero is main CTA, should be slightly larger)
- Keep all other styling (colors, rounded-xl, transitions, hover effects)

This creates visual hierarchy:
- Hero buttons: Medium size with base text (primary CTA)
- Navbar buttons: Small size with sm text (utility actions)
- Card buttons: Medium size with sm text (secondary actions)

## Implementation

**File:** `frontend/src/components/landing/Hero.jsx`

**Changes:**
1. Line 38: Change `px-8 py-4` to `px-6 py-3` (Explore Events button)
2. Line 44: Change `px-8 py-4` to `px-6 py-3` (Learn More button)

**Before:**
```jsx
className="px-8 py-4 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-105"
```

**After:**
```jsx
className="px-6 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-105"
```

## Validation

1. Build frontend successfully
2. Visually compare Hero buttons with other landing page buttons
3. Verify responsive behavior on mobile/tablet/desktop
4. Confirm buttons are still easily clickable (target size)

## Risk Assessment

**Low risk:**
- Only visual change, no functionality impact
- Maintains accessibility (buttons still have adequate click target)
- Consistent with rest of landing page design
