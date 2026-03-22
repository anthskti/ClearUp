# Account lifecycle (1.2) — skeleton checklist

Rough map for **password reset**, **email verification**, **bad-link UX**, and **cross-tab sign-out**. Wire names to your installed `better-auth` version (check their docs for exact client/server APIs).

## Backend — `backend/src/config/auth.ts`

1. **Password reset emails**  
   - Enable/configure `emailAndPassword` with a `sendResetPassword` (or equivalent) callback.  
   - Callback receives something like `{ user, url, token }` — send email with `url` (or build `FRONTEND_URL/reset-password?token=...` if you compose links yourself).

2. **Email verification**  
   - Set `requireEmailVerification: true` when ready.  
   - Add `sendVerificationEmail` (or equivalent) callback.  
   - Point link to e.g. `FRONTEND_URL/verify-email?token=...` (whatever Better Auth expects).

3. **Env**  
   - `FRONTEND_URL`, mail provider keys, `DATABASE_URL` already there.

## Frontend routes

| Route | Purpose |
|--------|--------|
| `/forgot-password` | Form: email → trigger “request reset” API via `authClient`. |
| `/reset-password` | Read `token` from query → new password + confirm → “reset password” API. |
| `/verify-email` | Read `token` (or handle callback) → verify or show “resend” if logged in. |

## UX states (recovery)

Reuse one small pattern everywhere:

- `idle` → form  
- `loading`  
- `success` (short message + CTA to login)  
- `error` with **specific** copy: `expired`, `invalid`, `already_used`, `network`

## Cross-tab sign-out

1. On successful `authClient.signOut()`, broadcast a message (e.g. `BroadcastChannel` or `localStorage` tick).  
2. Mount **one** listener (e.g. hook below) in a client shell layout so other tabs call `authClient.signOut()` or `router.refresh()` / hard redirect to `/`.

## Files added (skeletons)

- `frontend/src/app/(auth)/forgot-password/page.tsx`
- `frontend/src/app/(auth)/reset-password/page.tsx` (replace placeholder)
- `frontend/src/app/(auth)/verify-email/page.tsx`
- `frontend/src/hooks/useCrossTabSignOut.ts`
- `frontend/src/app/middleware.ts` — allow `/forgot-password`, `/verify-email` as guest routes

## `authClient` calls (placeholders — confirm in Better Auth docs)

```ts
// Request reset (forgot page)
// await authClient.forgetPassword?.({ email, redirectTo: `${origin}/reset-password` });

// Complete reset (reset page, token from URL)
// await authClient.resetPassword?.({ token, newPassword });

// Verification
// await authClient.sendVerificationEmail?.({ email });
// await authClient.verifyEmail?.({ token });
```

Replace `?.` with the real method names from your version.
