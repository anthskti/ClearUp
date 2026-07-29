# Authentication & sessions

ClearUp uses [Better Auth](https://www.better-auth.com) on the API with cookie-based sessions. The Next.js app does not implement its own auth server; it calls the API via `authClient` and server-side `fetch` with forwarded cookies.

## Components

| Piece | Location | Role |
|-------|----------|------|
| Auth config | `backend/src/config/auth.ts` | Providers, email hooks, DB pool, plugins |
| Auth routes | `backend/src/index.ts` | `toNodeHandler(auth)` on `/api/auth/*` |
| Session guard | `backend/src/middleware/requireAuth.ts` | `requireAuth`, `requireAdmin` |
| Client | `frontend/src/lib/auth-client.ts` | `createAuthClient({ baseURL })` |
| Server session | `frontend/src/lib/auth.ts` | `getSession`, `getEffectiveUser` |
| Models | `User`, `Session`, `Account`, `Verification` | Same Postgres as app data |

## Sign-in methods

1. **Email + password** — verification required before full access (`requireEmailVerification: true`).
2. **Google OAuth** — configured with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

Password reset and verification emails are sent through **AWS SES** (`sendSesEmail` in `backend/src/lib/sesEmail.ts`). Failures are logged; sends are fire-and-forget to reduce timing side channels.

## Roles

- Default role: `user`.
- **Admin** is granted when:
  - The user's `role` column is `admin`, or
  - Their verified email is listed in `ADMIN_EMAILS` (middleware may persist `role: "admin"` on match).

Admin UI (`frontend/src/app/admin/layout.tsx`) calls `GET /api/auth/me` and redirects non-admins to `/`.

Better Auth's **admin plugin** is enabled; migrations add columns such as `banned` / `banReason` expected by that plugin.

## Request flow

```
Browser → Next.js page
              │
              ├─ Client: authClient.useSession() → API /api/auth/get-session
              │
              └─ Server: headers().get("cookie") → GET /api/auth/me (role-aware)
```

`GET /api/auth/me` returns:

```json
{ "id": "…", "email": "user@example.com", "role": "user" | "admin" }
```

Protected API routes use `requireAuth` or `requireAdmin` after Better Auth validates the session cookie.

## Security middleware

On `/api/auth`, the API applies (in order):

- `authRouteLimiter` — general auth traffic cap
- `authBruteForceLimiter` — tighter limits on sensitive paths
- `authAuditLogger` — structured audit logs with redaction (`lib/security.ts`)

Global rate limiting and CORS (`TRUSTED_ORIGINS`, `credentials: true`) are configured in `index.ts`.

## Cross-origin / production cookies

When the frontend (e.g. `https://clearup.skin`) and API (e.g. `https://api.clearup.skin`) differ:

- Set `BETTER_AUTH_URL` to the **public API origin**.
- Set `TRUSTED_ORIGINS` to include the frontend origin(s).
- Set `BETTER_AUTH_CROSS_SITE_COOKIES=1` for `SameSite=None; Secure` cookies (HTTPS only).

Production may set cookie domain `.clearup.skin` in `auth.ts`. OAuth redirect URIs in Google Cloud must point at the **API** host, e.g. `https://your-api.example.com/api/auth/callback/google`, not the Next.js port.

## Frontend auth UX

- Auth pages live under `frontend/src/app/(auth)/` (login, register, forgot/reset password, verify email).
- `frontend/src/proxy.ts` redirects authenticated users away from auth pages (when wired as middleware).
- `AuthSync` in the main layout keeps client state aligned after navigation.

## Email webhooks

`POST /api/webhooks/aws-ses` accepts SNS notifications for SES bounces and complaints and can update user email status—keep this URL registered in AWS when using SES in production.

## Local setup checklist

1. API running with `BETTER_AUTH_URL=http://localhost:5050` and `TRUSTED_ORIGINS=http://localhost:3000`.
2. `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5050`.
3. For Google OAuth locally: redirect URI `http://localhost:5050/api/auth/callback/google`.
4. Run migrations (`004`, `005`) if OAuth or admin user creation fails—see [backend/testREADME.md](../backend/testREADME.md).

## Related code

- `backend/docs/betterauth.md` — short model reference
- `backend/docs/modules/users.md` — middleware and HTTP surface detail
