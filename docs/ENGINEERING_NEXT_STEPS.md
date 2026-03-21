# ClearUp Engineering Next Steps

This document outlines what is left to ship for a production-ready monolith, based on the current state of the Better Auth implementation and near-term plans for external data scraping.

## 1) Finish Better Auth End-to-End

### 1.1 Auth flow hardening
- Enforce route guards consistently for protected pages and APIs.
    - Purpose: Auth protecting some pages, but not others. Ex. Dashboard, but not settings. 
- Prevent authenticated users from reaching `login` and `register`.
    - Updated (auth)/layout.ts to check session token.
- Standardize auth checks to avoid client-side race conditions (especially around initial load and redirects).
    - Highlights the order of loading in data and checking if they're logged in. Ex. fetching a users created routines while not being logged in. To fix this, just use a loading state.
- Define one source of truth for auth state between frontend and backend.

### 1.2 Account lifecycle
- Complete password reset flow (request, token validation, reset form, success state).
- Finish email verification flow (token creation, resend, expiration handling).
- Add account recovery UX states for expired/invalid links.
- Verify sign-out behavior across tabs and stale session handling.

### 1.3 Session and token management
- Validate session expiry behavior and silent refresh strategy (if used).
- Ensure session invalidation works after password change.
- Add device/session management policy (optional now, but define now to avoid migration later).
- Confirm secure cookie configuration per environment (local, staging, production).

### 1.4 OAuth/provider readiness
- Audit provider config and callback URL handling.
- Add explicit error states for provider failures and denied permissions.
- Confirm account linking/duplicate identity behavior.
- Define whether email verification is required for OAuth-only users.

## 2) Authorization and Security Controls

### 2.1 Role and permission model
- Define default user roles and permission boundaries.
- Add backend-level authorization checks for routine CRUD and saved items.
- Remove any frontend-only authorization assumptions.

### 2.2 Security baseline
- Add rate limiting for auth and other abuse-prone endpoints.
- Add brute-force protections for login and reset routes.
- Validate CSRF, CORS, and cookie policies for monolith deployment.
- Add audit logging for key security events (login, reset, verification, revoke).

### 2.3 Data and privacy
- Validate what user data is stored, why, and retention window.
- Add account deletion/data export policy (can be phased, but document now).
- Redact sensitive fields in logs and error output.

## 3) Monolith Architecture Cleanup (Auth + Product Domain)

### 3.1 Module boundaries
- Clearly separate `auth`, `user`, `routine`, and `product` domains in code layout.
- Establish service-level interfaces so domains can evolve without tight coupling.
- Centralize shared utilities (validation, error handling, response envelopes).

### 3.2 Contract consistency
- Standardize API response shape and error format.
- Standardize frontend API client behavior (retry, auth error handling, cancellation).
- Introduce schema validation at boundaries (request + response).

### 3.3 Reliability improvements
- Add structured logging with request correlation ID.
- Add global error taxonomy (auth errors vs validation vs system).
- Add health checks and runtime readiness indicators.

## 4) Data Scraper Integration Plan (Cross-Repo)

You are building the scraper in another repo; treat it as an external producer.

### 4.1 Integration contract first
- Define a stable payload contract (schema version, required fields, IDs).
- Decide update semantics (`replace`, `upsert`, `partial merge`).
- Define deduplication keys and source-of-truth precedence.
- Add idempotency strategy for repeated scraper runs.

### 4.2 Ingestion workflow
- Create a dedicated ingestion endpoint or queue consumer in this monolith.
- Add validation + normalization before persistence.
- Add failure handling with dead-letter/retry strategy.
- Track ingestion metrics (received, accepted, rejected, retried).

### 4.3 Operational concerns
- Add manual replay capability for failed batches.
- Create an ingestion dashboard/log view for debugging source data quality.
- Add alerting thresholds for spikes in reject rate.
- Version scraper payloads so backend changes are backward compatible.

## 5) Testing and Release Readiness

### 5.1 Test coverage priorities
- Integration tests for auth flows (register/login/logout/reset/verify).
- Authorization tests for protected resources.
- Contract tests for scraper payload ingestion.
- Critical frontend flow tests: first load, auth redirect, profile/routine pages.

### 5.2 Environment setup
- Confirm env var matrix is documented (`dev`, `staging`, `prod`).
- Add seed data and local bootstrap scripts for fast onboarding.
- Ensure migrations are safe, reversible where possible, and documented.

### 5.3 CI/CD quality gates
- Enforce lint, typecheck, and test checks before merge.
- Add smoke tests post-deploy for auth and core routine flows.
- Define rollback strategy for auth-breaking regressions.

## 6) Suggested Implementation Order (Practical)

1. Complete password reset + verify flows.
2. Fix auth race conditions and guard behavior.
3. Add authorization checks on backend domain endpoints.
4. Add auth integration tests and key frontend flow tests.
5. Define scraper payload contract and build ingestion path.
6. Add observability and failure recovery for ingestion.
7. Harden security controls (rate limits, logging, policy checks).

## 7) Definition of Done for "Auth Is Complete"

Auth is considered complete when:
- Users can register/login/logout/reset/verify without dead-end states.
- Protected routes and APIs are consistently enforced.
- Session behavior is predictable across refresh, expiry, and sign-out.
- Core auth/security tests pass in CI.
- OAuth and local auth behavior is documented and production-configured.
