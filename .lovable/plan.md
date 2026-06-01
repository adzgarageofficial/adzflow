## Goal

Magdagdag ng **face recognition step** pagkatapos ng successful email + password login. Kung may enrolled face ang user, kailangan niya munang mag-face-match bago makapasok sa dashboard. Admin/Owner lang ang pwedeng mag-enroll ng mukha ng users.

> Tandaan: hindi kasama ang attendance face check sa scope na ito (kakalimutan muna ayon sa request).

## How it works (technical)

- **Library:** `face-api.js` (TensorFlow.js, runs 100% sa browser, walang external API cost)
- **Models:** `tiny_face_detector` + `face_landmark_68` + `face_recognition` (~6MB, isasave sa `public/models/`, cached after first load)
- **Descriptor:** 128-dimensional float array per mukha, istinor sa `profiles.face_descriptor` (jsonb)
- **Match:** Euclidean distance < 0.5 = same person (industry standard threshold)

## Database changes

Migration na magdadagdag sa `profiles` table:
- `face_descriptor` (jsonb, nullable) — 128-number array
- `face_enrolled_at` (timestamptz, nullable)
- `face_enrolled_by` (uuid, nullable) — sino ang admin nag-enroll

RLS:
- User pwedeng mag-read ng sariling descriptor
- Owner/Admin pwedeng mag-read/write sa lahat (gamit ang existing `has_any_role` function)

## Files na gagawin / babaguhin

### Bago
1. `public/models/` — face-api.js model files (download via script)
2. `src/lib/face-recognition.ts` — model loader, capture from webcam, extract descriptor, compare
3. `src/components/face-capture.tsx` — reusable webcam component (live preview + capture button)
4. `src/components/face-verify-dialog.tsx` — 2FA modal na lumalabas after password login
5. `src/routes/_app.face-enrollment.tsx` — admin page: pumili ng user → i-enroll ang mukha (3 snapshots, kunin average descriptor)

### Babaguhin
1. `src/routes/login.tsx` — after `signInWithPassword` success:
   - Kunin ang `face_descriptor` ng user
   - Kung may enrolled → show `FaceVerifyDialog`, kung match lang → navigate to `/`
   - Kung walang enrolled → direct entry (para hindi ma-lock out kung di pa naka-enroll)
2. `src/components/app-sidebar.tsx` — magdagdag ng "Face Enrollment" link sa Users section (owner/admin only)
3. Install `face-api.js` package

## Login flow (after this change)

```text
[Email + Password form]
        ↓ submit
[Supabase verifies credentials]
        ↓ success
[Fetch profile.face_descriptor]
        ↓
   has descriptor? ─── No ──→ [Navigate to / ]   (di pa naka-enroll)
        │ Yes
        ↓
[FaceVerifyDialog opens]
  • Live webcam preview
  • Auto-capture every 1s, compare with stored
  • Match (distance < 0.5) → [Navigate to / ]
  • 5 attempts fail → sign out + error toast
  • "Skip / I can't access camera" → sign out
```

## Enrollment flow (admin only)

```text
/face-enrollment page
  ↓
[Select user dropdown]  →  [Camera preview]
                            ↓
                  [Capture 3 snapshots]
                            ↓
            Average ang 3 descriptors → save sa profiles
                            ↓
                  Toast: "Face enrolled for {name}"
                  Option: "Re-enroll" / "Remove face"
```

## Limitations (honest disclosure)

- Hindi to bank-grade — pwedeng i-spoof ng printed photo o video (walang liveness detection sa free models). Para sa internal POS staff verification, OK na to.
- Kailangan ng webcam at HTTPS (Lovable preview/published OK).
- First load ~6MB ng models (cached after).
- Kung mawala ang descriptor sa user (re-enrollment needed), si admin lang ang makakapag-reset.
