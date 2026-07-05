# Fix MyTickets Page Spacing

## Problem
Jarak vertikal antara header "My Tickets / Manage your blockchain tickets" dan konten "3 Ticket" terlalu jauh/tidak konsisten dengan UI Guidelines.

## Root Cause Analysis
1. Header section (`mb-4` = 16px) terlalu kecil untuk spacing antar section
2. Ticket Count & Filters wrapper (`mb-8` = 32px) menciptakan jarak tambahan
3. Ticket Count inner div (`mb-6` = 24px) menambah jarak lagi antara count dan filter buttons
4. Total accumulated spacing tidak sesuai dengan UI Guidelines (80-120px section spacing)

## Design Decisions

### Spacing Structure
Berdasarkan UI Guidelines (Section Spacing: 80-120px, Gap: 24px):

```
┌─ Header Section ────────────────┐
│ My Tickets                       │
│ Manage your blockchain tickets.  │
└──────────────────────────────────┘
        ↓ mb-8 (32px) - reduced from excessive spacing
┌─ Ticket Count ──────────────────┐
│ 3 Ticket                         │
└──────────────────────────────────┘
        ↓ mb-4 (16px) - tighter connection
┌─ Filter Buttons ────────────────┐
│ [All] [Active] [Used]            │
└──────────────────────────────────┘
        ↓ mb-8 (32px) - consistent grid spacing
┌─ Tickets Grid ──────────────────┐
```

### Specific Changes
1. **Header section**: Change `mb-4` → `mb-8` (16px → 32px)
2. **Ticket Count & Filters wrapper**: Keep `mb-8` (32px)
3. **Ticket Count inner div**: Remove atau reduce `mb-6` → `mb-4` (24px → 16px)
4. **Overall structure**: Ensure consistency with other participant pages

## Implementation Tasks

### File: `frontend/src/pages/Participant/MyTickets.jsx`

1. **Update Header Section Spacing** (line 108)
   - Change: `<div className="mb-4">` 
   - To: `<div className="mb-8">`

2. **Update Ticket Count Inner Spacing** (line 121)
   - Change: `<div className="mb-6">`
   - To: `<div className="mb-4">`

3. **Verify overall structure** matches UI Guidelines spacing principles

## Validation

- [ ] Visual inspection: spacing terlihat proporsional dan tidak terlalu jauh
- [ ] Consistency check: bandingkan dengan halaman participant lain (jika ada)
- [ ] Responsive check: spacing tetap baik di mobile, tablet, dan desktop
- [ ] Compare dengan Landing Page reference untuk memastikan konsistensi visual

## Edge Cases
- N/A (purely visual spacing adjustment)

## Rollback Plan
Spacing values sebelumnya:
- Header: `mb-4`
- Ticket Count inner: `mb-6`

Jika spacing baru tidak memuaskan, kembalikan ke values lama atau adjust incrementally.
