# Plan: Fix ValidatorPage Render Crash

## Problem

The ValidatorPage crashes on render with error:
```
An error occurred in the <div> component.
Stack trace points to: ValidatorPage.jsx around line 204
```

## Root Cause Analysis

**Location:** `ValidatorPage.jsx` line 24
```javascript
const { isScanning, error: scannerError, toggleScanner } = useQRScanner(handleScanSuccess);
```

**Issue:** The `useQRScanner` hook is being called **during component render** and immediately tries to access DOM element with id `qr-reader`. However:

1. Line 24: `useQRScanner` hook is initialized
2. Line 196: `<div id="qr-reader">` is rendered in JSX
3. **Problem:** Hook tries to initialize `Html5Qrcode` with `'qr-reader'` element during construction, but the DOM element doesn't exist yet during initial render

**From `useQRScanner.js` line 50:**
```javascript
if (!html5QrCodeRef.current) {
  html5QrCodeRef.current = new Html5Qrcode('qr-reader'); // ❌ DOM doesn't exist yet!
}
```

The `Html5Qrcode` constructor tries to query `document.getElementById('qr-reader')` during hook initialization, but this element hasn't been mounted to the DOM yet, causing a runtime exception.

## Solution

**Fix:** Initialize the `Html5Qrcode` instance lazily - only when `startScanner()` is actually called, not during hook initialization.

### Changes Required

**File:** `frontend/src/hooks/useQRScanner.js`

**Current problematic flow:**
1. Hook initializes
2. Constructor tries to find `#qr-reader` (doesn't exist)
3. Crash

**Fixed flow:**
1. Hook initializes (no DOM access)
2. User clicks "Start Scanner"
3. `startScanner()` creates instance (DOM exists now)
4. Success

### Implementation

**Modify `startScanner()` in `frontend/src/hooks/useQRScanner.js` (line 44-100):**

Remove the early initialization check and always create the scanner when starting:

```javascript
const startScanner = async () => {
  try {
    setError(null);

    // Always initialize scanner when starting (DOM is now mounted)
    // Don't reuse existing instance to avoid state issues
    if (html5QrCodeRef.current) {
      // Clean up any existing instance first
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) {
          await html5QrCodeRef.current.stop();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      html5QrCodeRef.current = null;
    }

    // Create new scanner instance (DOM element exists now)
    html5QrCodeRef.current = new Html5Qrcode('qr-reader');

    const qrCodeSuccessCallback = (decodedText) => {
      // Stop scanner after successful scan
      stopScanner();
      onScanSuccess(decodedText);
    };

    const qrCodeErrorCallback = (errorMessage) => {
      // This is called frequently during scanning, not actual errors
      // Only log if onScanError is provided
      if (onScanError) {
        onScanError(errorMessage);
      }
    };

    // Configuration for the scanner
    const config = {
      fps: 10, // Frames per second for scanning
      qrbox: { width: 250, height: 250 }, // Scanning box size
      aspectRatio: 1.0, // Square aspect ratio
    };

    // Start scanning with back camera (prefer environment for mobile)
    await html5QrCodeRef.current.start(
      { facingMode: 'environment' }, // Use back camera on mobile
      config,
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    );

    setIsScanning(true);
  } catch (err) {
    console.error('Error starting scanner:', err);
    
    // Handle specific error types
    if (err.name === 'NotAllowedError') {
      setError('Camera access denied. Please allow camera permissions and try again.');
    } else if (err.name === 'NotFoundError') {
      setError('No camera found on this device. Please use manual verification.');
    } else if (err.name === 'NotReadableError') {
      setError('Camera is already in use by another application.');
    } else if (err.message && err.message.includes('Camera access')) {
      setError('Unable to access camera. Please check your browser permissions.');
    } else {
      setError('Failed to start camera. Please use manual verification.');
    }
    
    setIsScanning(false);
  }
};
```

**Key changes:**
1. ✅ Remove conditional initialization check `if (!html5QrCodeRef.current)`
2. ✅ Always create fresh instance when starting scanner
3. ✅ Clean up any existing instance before creating new one
4. ✅ Initialization only happens when user clicks "Start Scanner" (DOM exists)

## Why This Fixes The Crash

**Before (crashes):**
- Hook init → Try to create `Html5Qrcode('qr-reader')` → DOM doesn't exist → Crash

**After (works):**
- Hook init → Do nothing
- User clicks button → `startScanner()` → Create `Html5Qrcode('qr-reader')` → DOM exists → Success

## Files To Modify

1. `frontend/src/hooks/useQRScanner.js` - Lines 44-100 (startScanner function)

## Validation

After fix:
1. ✅ Page loads without crash
2. ✅ Scanner button visible and clickable
3. ✅ Clicking "Start Scanner" initializes camera
4. ✅ Scanning QR code works
5. ✅ No unmount errors when navigating away

## Out of Scope

- No Error Boundary needed
- No page redesign
- No changes to ValidatorPage.jsx

## Root Cause

The cleanup logic in lines 16-25 of `useQRScanner.js` has race condition issues:

```javascript
useEffect(() => {
  return () => {
    if (html5QrCodeRef.current && isScanning) {
      html5QrCodeRef.current
        .stop()
        .catch((err) => console.error('Error stopping scanner on unmount:', err));
    }
  };
}, [isScanning]);
```

**Issues:**
1. Depends on `isScanning` state which may be stale during cleanup
2. Doesn't check if scanner is actually running (`.getState()`)
3. Doesn't clear the scanner instance reference after cleanup
4. html5-qrcode tries to manipulate DOM that React already removed

## Solution

Fix the cleanup logic in `useQRScanner.js`:

### Changes Required

**1. Remove dependency on `isScanning` state in cleanup**
- Use scanner's internal state via `.getState()` method
- Check if state is `Html5QrcodeScannerState.SCANNING` before calling stop

**2. Properly clear the scanner instance**
- Call `.clear()` after `.stop()` to remove DOM elements
- Set `html5QrCodeRef.current = null` after cleanup

**3. Add defensive checks**
- Wrap in try-catch to handle any DOM manipulation errors silently
- Check if scanner instance exists and has required methods

### Implementation

Replace lines 16-25 in `frontend/src/hooks/useQRScanner.js`:

```javascript
useEffect(() => {
  // Cleanup on unmount
  return () => {
    const scanner = html5QrCodeRef.current;
    if (scanner) {
      // Import scanner state enum
      const { Html5QrcodeScannerState } = require('html5-qrcode');
      
      try {
        const state = scanner.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          scanner.stop()
            .then(() => {
              // Clear DOM elements after stopping
              scanner.clear();
            })
            .catch((err) => {
              // Silently handle DOM cleanup errors on unmount
              console.warn('Scanner cleanup warning:', err.message);
            })
            .finally(() => {
              html5QrCodeRef.current = null;
            });
        }
      } catch (err) {
        // Handle any errors accessing scanner state
        console.warn('Scanner state check warning:', err.message);
        html5QrCodeRef.current = null;
      }
    }
  };
}, []); // Empty dependency array - only run on mount/unmount
```

**Alternative simpler approach (recommended):**

```javascript
useEffect(() => {
  // Cleanup on unmount
  return () => {
    const scanner = html5QrCodeRef.current;
    if (scanner) {
      try {
        // Check if scanner is running by attempting to get state
        const state = scanner.getState();
        if (state === 2) { // 2 = SCANNING state
          scanner.stop()
            .catch(() => {}) // Ignore errors during cleanup
            .finally(() => {
              html5QrCodeRef.current = null;
            });
        } else {
          html5QrCodeRef.current = null;
        }
      } catch (err) {
        // Scanner not initialized or already cleaned up
        html5QrCodeRef.current = null;
      }
    }
  };
}, []); // Empty deps - only cleanup on unmount
```

### Additional Fix in `stopScanner()`

Update lines 86-97 to also handle state checking:

```javascript
const stopScanner = async () => {
  try {
    const scanner = html5QrCodeRef.current;
    if (scanner) {
      // Check scanner state before stopping
      const state = scanner.getState();
      if (state === 2) { // SCANNING state
        await scanner.stop();
      }
      setIsScanning(false);
      setError(null);
    }
  } catch (err) {
    console.error('Error stopping scanner:', err);
    // Still update state even if stop fails
    setIsScanning(false);
  }
};
```

## Testing Validation

After fix, verify:

1. **Normal stop:** Click "Stop Scanner" → No errors
2. **Navigate away while scanning:** Start scanner → Navigate to another page → No console errors
3. **Scan then navigate:** Scan QR → Result shows → Navigate away → No errors
4. **Multiple start/stop cycles:** Start → Stop → Start → Stop → No errors
5. **Browser back button:** Start scanner → Use browser back → No errors

## Risk Assessment

**Risk:** Scanner state check may fail if html5-qrcode library changes API
**Mitigation:** Wrap all state checks in try-catch, gracefully degrade to null reference

**Risk:** Memory leaks if scanner instance not properly cleared
**Mitigation:** Always set `html5QrCodeRef.current = null` in all cleanup paths

## Files to Modify

- `frontend/src/hooks/useQRScanner.js` - Lines 16-25 (cleanup), lines 86-97 (stopScanner)

## Decisions

### QR Code Format
- **Content:** Plain string containing only `ticket_id_onchain` (e.g. `"125"`)
- **Rationale:** Simple, efficient, and sufficient for lookup

### Authorization
- **Rule:** Organizers can only verify/check-in tickets for events they created
- **Implementation:** Backend validates `events.organizer_id = current_user.id`

### Scope
- **In scope:** QR scanner UI and verification flow
- **Out of scope:** QR code generation (will be implemented after ticket purchase flow)

### Ticket Status Flow
- **Single check-in only:** `active` → `used`
- **Rejection:** Already `used` tickets cannot be checked in again
- **Invalid:** Ticket not found or not owned by organizer's event

## Current State

### Frontend (`frontend/src/pages/Organizer/ValidatorPage.jsx`)
- Hero, QR Scanner Card, Manual Verification, Result Card UI complete
- Scanner shows loading animation only (no real scanning)
- Hardcoded placeholder verification data
- Uses: React, Axios, lucide-react

### Backend
- Database table `tickets` exists with fields: `id`, `ticket_id_onchain`, `event_id`, `participant_id`, `owner_wallet`, `transaction_hash`, `status`, `used_at`, `verified_by`, `created_at`
- No ticket verification endpoints exist yet
- Uses: Express, PostgreSQL (pg), JWT auth middleware
- Pattern: Routes → Controllers → Services → Database

## Implementation Tasks

### Backend

#### 1. Create Ticket Routes (`backend/routes/ticketRoutes.js`)
```javascript
POST /api/tickets/verify
POST /api/tickets/check-in
```
- Require authentication (organizer role only)
- Import controllers and middleware

#### 2. Create Ticket Controller (`backend/controllers/ticketController.js`)
**Verify endpoint:**
- Extract `ticketIdOnChain` from request body
- Validate input (required, numeric)
- Call service layer
- Return ticket details or error

**Check-in endpoint:**
- Extract `ticketIdOnChain` from request body
- Validate input
- Call service layer
- Return success/error

#### 3. Create Ticket Service (`backend/services/ticketService.js`)
**`verifyTicket(ticketIdOnChain, organizerId)`:**
- Query database:
  ```sql
  SELECT t.*, e.title as event_name, e.organizer_id, u.wallet_address
  FROM tickets t
  JOIN events e ON t.event_id = e.id
  JOIN users u ON t.participant_id = u.id
  WHERE t.ticket_id_onchain = $1
  ```
- Validate organizer owns the event (`e.organizer_id = organizerId`)
- Return status: `active`, `used`, or `invalid` (not found / wrong organizer)
- Return: `{ ticketId, eventName, walletAddress, status, eventId }`

**`checkInTicket(ticketIdOnChain, organizerId)`:**
- Call `verifyTicket` first
- If status !== `active`, reject with error
- If already `used`, return error: "Ticket already used"
- If `invalid`, return error: "Ticket not found or unauthorized"
- Update ticket:
  ```sql
  UPDATE tickets 
  SET status = 'used', used_at = NOW(), verified_by = $1
  WHERE ticket_id_onchain = $2 AND status = 'active'
  ```
- Return success message

#### 4. Register Routes (`backend/server.js`)
```javascript
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);
```

### Frontend

#### 5. Install QR Scanner Library
```bash
npm install html5-qrcode
```

#### 6. Create QR Scanner Hook (`frontend/src/hooks/useQRScanner.js`)
- Manage `Html5QrcodeScanner` instance
- Handle camera initialization
- Handle scan success callback
- Handle scan error callback
- Cleanup on unmount
- Return: `{ startScanner, stopScanner, isScanning, error }`

#### 7. Update ValidatorPage (`frontend/src/pages/Organizer/ValidatorPage.jsx`)

**State management:**
- Add: `verificationData` (nullable, from API response)
- Add: `isVerifying` (loading state)
- Add: `errorMessage` (error display)
- Add: `scannerError` (camera/permission errors)
- Remove hardcoded placeholder data

**QR Scanner integration:**
- Import `useQRScanner` hook
- Replace placeholder div with `<div id="qr-reader"></div>`
- On "Start Scanner" click: call `startScanner()` with `onScanSuccess` callback
- On scan success: call `handleVerifyTicket(ticketIdOnChain)`
- On "Stop Scanner" click: call `stopScanner()`
- Display `scannerError` if camera permission denied or unavailable

**API integration:**
- `handleVerifyTicket(ticketIdOnChain)`:
  - Call `POST /api/tickets/verify` with `{ ticketIdOnChain }`
  - Update `verificationData` state
  - Show result card
  - Handle errors (show error message)

- `handleCheckIn()`:
  - Call `POST /api/tickets/check-in` with `{ ticketIdOnChain: verificationData.ticketId }`
  - Update UI to show success message
  - Optionally refresh verification data
  - Handle errors (already used, invalid)

**Error handling:**
- Camera permission denied → Show message: "Camera access denied. Please use manual verification."
- Browser doesn't support camera → Show message: "Camera not available. Please use manual verification."
- Ticket not found → Display status: "Invalid"
- Ticket already used → Display status: "Used"
- Unauthorized ticket (wrong organizer) → Display status: "Invalid" with message

**UI states:**
- Scanner inactive: Show QR icon placeholder
- Scanner active: Show camera feed in `#qr-reader` div
- Scanning success: Auto-stop scanner, show verification result
- Verifying: Show loading spinner on result card

## Data Flow

1. **Scan Flow:**
   - User clicks "Start Scanner"
   - Camera permission requested
   - Camera feed displayed in scanner area
   - User shows QR code to camera
   - Library decodes `ticketIdOnChain` (e.g. `"125"`)
   - Scanner stops automatically
   - `handleVerifyTicket("125")` called

2. **Verification Flow:**
   - Frontend: `POST /api/tickets/verify { ticketIdOnChain: "125" }`
   - Backend: Query database with JOIN
   - Backend: Check organizer authorization
   - Backend: Return ticket data + status
   - Frontend: Display result card with status badge

3. **Check-in Flow:**
   - User clicks "Check In" button (if status === `active`)
   - Frontend: `POST /api/tickets/check-in { ticketIdOnChain: "125" }`
   - Backend: Verify ticket is still `active`
   - Backend: Update status to `used`, set `used_at` and `verified_by`
   - Frontend: Show success message, disable check-in button

## Edge Cases & Validation

### Backend
- Ticket ID not numeric → Return 400 error
- Ticket not found → Return `{ status: 'invalid' }`
- Organizer doesn't own event → Return `{ status: 'invalid' }`
- Ticket already used → Verification shows `used`, check-in rejects
- Missing authentication → Return 401

### Frontend
- QR contains non-numeric data → Show error: "Invalid QR code format"
- Camera permission denied → Show fallback message
- Network error → Show error message, keep result card hidden
- Empty manual input → Disable verify button
- Check-in on non-active ticket → Button disabled

## Security

- All endpoints require JWT authentication
- Role check: `authorize('organizer')` middleware
- Authorization: Backend validates `events.organizer_id = req.user.id`
- SQL injection prevented: Use parameterized queries (`$1`, `$2`)
- Camera access: Browser-level permission required

## Testing Validation

**Backend (manual or Postman):**
1. Verify valid ticket for own event → Returns ticket details, status `active`
2. Verify ticket for another organizer's event → Returns status `invalid`
3. Verify non-existent ticket → Returns status `invalid`
4. Check in active ticket → Success, status updated to `used`
5. Check in already used ticket → Error: "Ticket already used"
6. Check in without auth → 401 Unauthorized

**Frontend (browser):**
1. Start scanner → Camera permission requested, feed displayed
2. Scan valid QR → Result card shows with correct data
3. Scan invalid QR → Result shows "Invalid" status
4. Manual verify valid ticket → Result card shows
5. Check in active ticket → Success message, button disabled
6. Check in used ticket → Error message shown
7. Deny camera permission → Error message, manual input available
8. Stop scanner → Camera feed stops, inactive state restored

## Risks & Mitigations

**Risk:** Browser doesn't support camera API
**Mitigation:** Manual verification input always available as fallback

**Risk:** QR code format changes in future
**Mitigation:** Backend validates and rejects invalid formats gracefully

**Risk:** Multiple organizers scan same ticket simultaneously
**Mitigation:** Database transaction ensures only one check-in succeeds (status update atomic)

**Risk:** Organizer sees tickets from other events
**Mitigation:** Backend authorization check prevents cross-event access

## Open Questions
None. All critical decisions resolved.

## Out of Scope
- QR code generation for tickets (future task after purchase flow)
- Multiple camera selection UI
- Scan history/logging
- Offline scanning capability
- Ticket transfer/resale verification
