# ClearUp with AWS SES (Better Auth)

This project sends **password reset** and **verification** emails from the backend using **Amazon SES** (`backend/src/lib/sesEmail.ts` and `backend/src/config/auth.ts`).

## 1) AWS SES console

1. **Region** — Pick a region (e.g. `us-east-1`) and use the same value for `AWS_REGION`.
2. **Verified identity** — Under _Verified identities_:
   - Either verify your **domain** (recommended for production), or verify a single **email address** (fine for testing).
3. **Sandbox** — New accounts are in **sandbox**:
   - You can only send **to** verified recipient addresses (or verify production access in SES).
   - For dev: verify your own Gmail (or another inbox) as a recipient.

## 2) IAM credentials

Create an IAM user (or use a role on your host) with permission to send mail, for example:

- `ses:SendEmail`
- (Often scoped to your account/region; narrow further if you use policies.)

Put in the backend:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Or omit keys and use the **default credential chain** (EC2/ECS task role, etc.) in production.

## 3) Backend environment

Copy from `backend/.env.example`:

| Variable                                      | Purpose                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `AWS_REGION`                                  | SES region                                                                                             |
| `SES_FROM_EMAIL`                              | Must match a **verified** sender in that region                                                        |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user (if not using instance role)                                                                  |
| `TRUSTED_ORIGINS`                             | Comma-separated frontend URLs for Better Auth (e.g. `http://localhost:3000`, `https://yourdomain.com`) |

Restart the backend after changing env.

## 4) Test it (recommended order)

### A) SES only (fastest)

From `backend/` with `.env` loaded (same vars as the running server):

```bash
TEST_SES_TO_EMAIL=your-verified-recipient@example.com npm run test:ses
```

In **sandbox**, that address must be a **verified identity** in SES. If this fails, fix IAM/region/From/recipient before testing auth.

### B) Better Auth → `sendResetPassword` (integration)

1. Start the backend (`npm run dev`).
2. Use a user that **exists** in your DB (sign up first if needed).
3. Call the Better Auth endpoint (default path below; your `PORT` may differ — check `.env`):

```bash
curl -sS -X POST "http://localhost:5050/api/auth/request-password-reset" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "redirectTo": "http://localhost:3000/reset-password"
  }'
```

- Replace host/port if your API runs elsewhere (`PORT` in `.env`, often `5050` or `5000`).
- The email link uses your auth **base URL** (`BETTER_AUTH_URL` / server URL). Ensure that matches where the handler is mounted (`/api/auth/...`).
- After this succeeds, check the inbox for the reset message (and spam).

### C) Full flow (optional)

Wire **Forgot password** on the frontend to call the same API the client library uses (`requestPasswordReset`), then click the link and complete reset on `/reset-password`.

---

## 5) Better Auth behaviour

- **Reset password** — `emailAndPassword.sendResetPassword` sends the SES email with the link Better Auth provides (`url`).
- **Verify email** — `emailVerification.sendVerificationEmail` sends when Better Auth triggers verification (e.g. after you enable `requireEmailVerification` or `sendOnSignUp` per docs).

## 6) Troubleshooting

- **Email not received** — Check SES _Sending statistics_, spam folder, and sandbox restrictions (recipient must be verified in sandbox).
- **403 / MessageRejected** — From address not verified, wrong region, or IAM missing `ses:SendEmail`.
- **`MessageRejected: Email address is not verified … in region US-EAST-1`** — SES identities are **per-region**. Either:
  1. Open **Amazon SES** in the **same region** as `AWS_REGION` (e.g. **US East N. Virginia** for `us-east-1`), go to **Verified identities**, and ensure that exact address (or domain) shows **Verified** — if not, create it and click the verification link in your inbox; or
  2. If you already verified the email in **another** region (e.g. `us-east-2`), set `AWS_REGION` in `.env` to **that** region, or verify the address again in `us-east-1`.
- **`dotenv` loaded 0 vars** — Run `npm run test:ses` from the `backend/` folder, or rely on the script’s explicit path to `backend/.env` (see `scripts/testSesEmail.ts`).
- **Link wrong host** — Fix `TRUSTED_ORIGINS` and `BETTER_AUTH_URL` / app URL so Better Auth builds the correct `url` in emails.
