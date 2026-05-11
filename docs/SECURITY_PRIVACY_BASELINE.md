# Security and Privacy Baseline

This document captures the current baseline decisions for authorization, security controls, and privacy handling.

## 1) Roles and Permissions

- `user` (default): can read/write only resources they own.
- `admin`: can perform support and moderation actions, including cross-user routine operations when explicitly needed.

Enforcement principle:
- All ownership checks must be validated in backend controllers/services.
- Frontend checks are UX-only hints and not a security boundary.

## 2) Auth Endpoint Protections

- Global auth limiter is applied to `/api/auth/*`.
- Brute-force limiter is applied with stricter thresholds for sign-in/reset/verification paths.
- Security events are audit-logged for authentication flows:
  - sign-in/login attempts
  - password reset flows
  - verification flows
  - sign-out/revoke-like flows

## 3) Logging and Redaction

Sensitive data is redacted before writing logs. This includes (non-exhaustive):
- `password`, `newPassword`
- `token`, `accessToken`, `refreshToken`
- `authorization`, `cookie`, `set-cookie`
- `secret`

Rule:
- Never log raw credentials, cookies, or opaque tokens.

## 4) Data Inventory and Retention (Initial Policy)

User/auth data retained for product operation:
- account identity (`id`, `email`, metadata needed for auth)
- session records and verification/reset artifacts managed by auth provider
- routine and routine-product data authored by users

Retention baseline:
- account + routines retained until user deletes account, or admin action under policy.
- security logs retained for 30 days initially (subject to infra constraints), then rotated/deleted.

## 5) Account Deletion and Data Export (Phased Policy)

Current:
- account deletion capability is enabled through auth provider configuration.

Planned:
- add export endpoint/flow to provide user-owned routines and related profile data in machine-readable format.
- add deletion confirmation + grace-period UX if needed by product/legal requirements.

## 6) Deployment Policy Checks

Required for production:
- `TRUSTED_ORIGINS` must list explicit origins (no wildcard).
- secure cookie behavior should be validated by environment configuration and HTTPS deployment.
- CORS must only allow product frontends that need credentialed requests.
