# Navbar FAQ Link Update Plan

## Objective
Update the Navbar component to link to the FAQ section instead of the About section, since the About section has been replaced with FAQ in the Landing Page.

## Current State
- `frontend/src/components/landing/Navbar.jsx` line 20-22 has a link to `#about`
- The AboutSection component has been replaced with FAQSection
- FAQSection uses `id="faq"` (frontend/src/components/landing/FAQSection.jsx:3)

## Changes Required

### File: frontend/src/components/landing/Navbar.jsx

**Line 20-22**: Update the About link to FAQ
```jsx
// Current:
<a href="#about" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
  About
</a>

// Change to:
<a href="#faq" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
  FAQ
</a>
```

## Validation
1. Verify the FAQ link scrolls to the FAQ section on the landing page
2. Confirm navigation menu displays "FAQ" instead of "About"
3. Test that hover states and styling remain consistent with other navigation items

## Notes
- This is a simple text and href update
- No structural changes to the Navbar component
- Maintains consistency with the landing page structure where AboutSection was replaced by FAQSection
