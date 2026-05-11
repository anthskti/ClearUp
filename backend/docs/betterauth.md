backend/src/models:
- User.ts: stores profile data.
- Session.ts: handles user logs in. Securely hashes password here along with other auth sessions.
- Account.ts: Better Auth states, instead of JWT, tracks active token, expiry, and metadata. 
- Verification.ts: Utility table that handle temporaary tokes for email verification, password reesets, or magic links.
