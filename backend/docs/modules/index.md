# Backend Entry Point Module (`index.ts`)

The backend `index.ts` file is the **application bootstrap and runtime organizer**.  
It does not contain business-domain logic; instead, it wires middleware, security controls, route modules, database startup, and server lifecycle into one execution flow.

## Core Responsibility

This file is responsible for:

- Creating and configuring the Express app instance.
- Registering global middleware in the correct order.
- Mounting auth and feature routes (like product, routine, merchant).
- Has a `/health` endpoint.
- Security configuration and initializing Sequelize.
- Starting the HTTP server only after startup checks succeed.

## Middleware and Request Pipeline

The file defines a top-down request pipeline that applies protections before business routes execute:

- CORS setup using `TRUSTED_ORIGINS`, with credentials enabled.
- Proxy trust (`app.set("trust proxy", 1)`) for deployment environments behind reverse proxies.
- JSON body parsing (`express.json()`).
- Global rate limiter for broad API abuse protection.
- Compression middleware for response-size optimization.
- Auth-specific security middleware stack on `/api/auth`:
  - route limiter
  - brute-force limiter
  - audit logging

## Authentication Wiring

`index.ts` provides two auth integration points:

- `GET /api/auth/me`:
  - Requires authentication (`requireAuth`).
  - Returns a normalized user identity payload (`id`, `email`, `role`).
- `ALL /api/auth/*path`:
  - Delegates auth endpoints to Better Auth via `toNodeHandler(auth)`.

## Route Composition

The file mounts feature modules and applies route-level controls where needed:

- `/api/products` -> `productRoutes`
- `/api/routines` -> `routineRoutes`
- `/api/merchant` -> `merchantRoutes`

This makes `index.ts` the central place where cross-cutting concerns (rate limits, auth guards, middleware ordering) are composed with route modules.

## Startup Lifecycle (`startServer`)

The startup sequence is intentionally explicit and defensive:

1. Validate required security configuration (`validateSecurityConfig()`).
2. Authenticate database connectivity (`sequelize.authenticate()`).
3. Register model associations (`defineAssociations()`).
4. Sync models (`sequelize.sync(...)`) with env-driven behavior:
   - `FORCE_SYNC=true` -> destructive sync (`force: true`)
   - default path -> non-destructive sync (`alter: false`) // need to update
5. Start listening on `PORT` (default `5000`).
6. On startup failure, log details and exit with non-zero status.
