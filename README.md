# Clearup

Clearup is a full-stacks skincare organizer: browse a product catalog, compare merchant offers, build step-by-step routines in a visual builder, and share them as community guides. Authentication, admin tooling, and email delivery are production-ready; the app is deployed at [clearup.skin](https://clearup.skin).

## What it does

| Area                | Summary                                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Catalog**         | Products by category (cleanser → sunscreen), skin-type tags, PDP with multi-merchant pricing                          |
| **Routine builder** | Slot-based AM/PM flow persisted in `localStorage`, saved to the API when signed in + notes                            |
| **Guides**          | Public routines from registered users; filter by skin type and max price                                              |
| **Admin**           | Dashboard stats, CSV product import, featured-routine curation, user list                                             |
| **Auth**            | Email/password + Google OAuth via [Better Auth](https://www.better-auth.com); SES for verification and password reset |

## Architecture

```
┌─────────────────────┐     HTTPS + cookies      ┌─────────────────────┐
│  Next.js 16 (React) │ ◄──────────────────────► │  Express 5 API (Bun)│
│  frontend/          │   NEXT_PUBLIC_API_URL    │  backend/           │
│  Vercel             │                          │  Render             │
└─────────────────────┘                          └──────────┬──────────┘
                                                              │
                                                   PostgreSQL 15
                                                   (Docker local / hosted)
```

Both apps talk to one Postgres database. Better Auth uses a `pg` pool; domain data uses Sequelize. Umzug migrations run on API startup.

**Backend layers:** `routes` → `controllers` → `services` → `repositories` → `models`

**Frontend patterns:** App Router route groups, server components for catalog/guides, client components for builder and admin interactions, shared `src/lib/*` API clients with Next.js `revalidate` tiers for caching.

## Repository layout

```
ClearUp/
├── frontend/          # Next.js app (UI, auth client, admin UI)
├── backend/           # Express API, Sequelize models, migrations
│   ├── docker-compose.yml   # Local Postgres only
│   ├── docs/modules/        # Per-module backend notes (legacy)
│   └── testREADME.md        # API testing & troubleshooting
├── docs/              # Feature-focused guides (see below)
└── LICENSE            # MIT
```

## Tech stack

| Layer    | Choices                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Radix/shadcn-style UI, Framer Motion |
| Backend  | Bun, Express 5, TypeScript, Sequelize 6, Umzug                             |
| Database | PostgreSQL 15                                                              |
| Auth     | Better Auth (+ admin plugin), session cookies                              |
| Email    | AWS SES v2 (+ SNS webhooks for bounces/complaints)                         |
| Images   | Next/Image with remote allowlist; CDN assets (e.g. CloudFront)             |

## Quick start (local)

**Prerequisites:** [Bun](https://bun.sh), [Docker](https://www.docker.com/), Node 20+ (for Next if not using Bun on frontend).

### 1. Database

```bash
cd backend
docker compose up -d
```

Postgres listens on `localhost:5432` (`skincare` / `postgres` / `password123` per `docker-compose.yml`).

### 2. API

Create `backend/.env` (do **not** set `DATABASE_URL` for local Docker—use `DB_*` so auth and Sequelize share the same rules):

```env
NODE_ENV=development
PORT=5050
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skincare
DB_USER=postgres
DB_PASSWORD=password123
TRUSTED_ORIGINS=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5050
ADMIN_EMAILS=you@example.com
```

```bash
cd backend
bun install
bun run dev
```

Migrations apply on boot. Health check: `GET http://localhost:5050/health`.

Optional: `bun run seed` (destructive `force: true` sync—dev only) or seed merchants via `bun run seed:merchants`.

### 3. Frontend

Create `frontend/.env.local` from `frontend/.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5050
```

```bash
cd frontend
bun install   # or npm install
bun run dev   # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Port note:** The API defaults to `5000` in code if `PORT` is unset; the frontend defaults to `5050`. Set `PORT=5050` locally so docs, OAuth redirects, and `NEXT_PUBLIC_API_URL` stay aligned.

## Environment variables (production-oriented)

| Variable                                                | Where    | Purpose                                                                    |
| ------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`                                          | API      | Hosted Postgres (Supabase, etc.); enables SSL via `certs/prod-ca-2021.crt` |
| `DB_*`                                                  | API      | Local fallback when `DATABASE_URL` is empty                                |
| `PORT`                                                  | API      | Listen port (e.g. `5050`)                                                  |
| `TRUSTED_ORIGINS`                                       | API      | Comma-separated frontend origins (CORS + Better Auth)                      |
| `BETTER_AUTH_URL`                                       | API      | Public API origin for OAuth redirects                                      |
| `BETTER_AUTH_CROSS_SITE_COOKIES`                        | API      | `1` when frontend and API are on different hosts (HTTPS)                   |
| `BETTER_AUTH_SECRET`                                    | API      | Auth signing secret                                                        |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`             | API      | Google OAuth                                                               |
| `ADMIN_EMAILS`                                          | API      | Comma-separated emails promoted to `admin`                                 |
| `AWS_REGION`, `SES_FROM_EMAIL`, `SES_CONFIGURATION_SET` | API      | Outbound mail                                                              |
| `NEXT_PUBLIC_API_URL`                                   | Frontend | API base URL                                                               |
| `NEXT_PUBLIC_APP_URL`                                   | Frontend | Canonical site URL                                                         |
| `NEXT_PUBLIC_IMAGE_DOMAIN`                              | Frontend | Optional default image host                                                |

See [docs/authentication.md](docs/authentication.md) and [backend/testREADME.md](backend/testREADME.md) for OAuth, SES, and troubleshooting.

## API surface (summary)

| Prefix                  | Auth         | Role                                    |
| ----------------------- | ------------ | --------------------------------------- |
| `/api/auth/*`           | Better Auth  | Sign-up, sign-in, OAuth, sessions       |
| `GET /api/auth/me`      | Session      | Current user `{ id, email, role }`      |
| `/api/products`         | Mixed        | Catalog CRUD; admin for writes/imports  |
| `/api/routines`         | Mixed        | Routines, guides, featured, admin stats |
| `/api/merchant`         | Admin writes | Merchant master data                    |
| `/api/users/admin`      | Admin        | User listing                            |
| `/api/webhooks/aws-ses` | SNS          | Bounce/complaint handling               |
| `/health`               | Public       | DB connectivity probe                   |

Rate limits: global (300 / 15 min), stricter caps on routine/merchant POST and auth brute-force paths.

## Frontend routes (high level)

| Path                        | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `/`                         | Landing: hero, featured routines, how it works |
| `/products/category/[slug]` | Category product grid                          |
| `/product/id/[slug]`        | Product detail + merchant offers               |
| `/builder`                  | Routine builder (local + save)                 |
| `/routine/[id]`             | Shared routine view                            |
| `/routines`                 | Community routines with filters (`/guides` redirects here) |
| `/profile/*`                | Saved/created routines, preferences            |
| `/login`, `/register`, …    | Auth flows                                     |
| `/admin/*`                  | Admin dashboard (role-gated)                   |

## Scripts

**Backend (`backend/`):**

| Command                               | Description                        |
| ------------------------------------- | ---------------------------------- |
| `bun run dev`                         | Watch mode API                     |
| `bun run build` / `bun run start`     | Production compile + run           |
| `bun run migrate:up` / `migrate:down` | Umzug migrations                   |
| `bun run seed`                        | Dev seed (wipes via `force: true`) |
| `bun run test:ses`                    | Send test email via SES            |

**Frontend (`frontend/`):**

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Next dev server                  |
| `npm run build` / `start` | Production build                 |
| `npm run analyze`         | Bundle analysis (`ANALYZE=true`) |

## Feature documentation

Backend module notes remain under `backend/docs/modules/` for controller/service/repository detail.

## Deployment (typical)

- **Frontend:** Vercel — set `NEXT_PUBLIC_*`, enable Analytics/Speed Insights as needed.
- **API:** Render (or container via `backend/Dockerfile`) — set `DATABASE_URL`, auth secrets, `BETTER_AUTH_URL`, `TRUSTED_ORIGINS`, SES vars.
- **Database:** Managed Postgres; place CA cert at `backend/certs/prod-ca-2021.crt` when required.
- **DNS:** Production cookies use domain `.clearup.skin` when `NODE_ENV=production`.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2025 Anthony Pham.

## Contact

Anthony Pham — phamanthony47@gmail.com
