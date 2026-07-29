# Database Migrations (Backend)

This project uses **Umzug** for versioned schema changes.

## Why

- Prevent accidental data loss from runtime sync behavior.
- Keep schema changes explicit, reviewed, and reproducible.
- Make deploys safer (`code + migration` shipped together).

## Commands

Run from `backend/`:

```bash
npm run migrate:up
npm run migrate:down
```

- `migrate:up`: applies all pending migrations.
- `migrate:down`: reverts one migration step.

## Current wiring

- Migration runner: `backend/src/migrations/index.ts`
- Migration files: `backend/src/migrations/[number]-name.ts`
- Startup flow (`backend/src/index.ts`) runs `runMigrations()` before server listen.

## Create a new migration

1. Add a new numbered file in `backend/src/migrations/`, e.g.:
   - `002-add-foo-column.ts`
2. Export:
   - `up({ context })` for apply
   - `down({ context })` for rollback
3. Keep migrations **idempotent** where practical (check table/column existence before changes).

Example skeleton:

```ts
import { DataTypes } from "sequelize";
import type { MigrationFn } from "umzug";

type Ctx = { sequelize: any; queryInterface: any };

export const up: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  // apply schema change
};

export const down: MigrationFn<Ctx> = async ({ context }) => {
  const { queryInterface } = context;
  // rollback schema change
};
```

## Deployment checklist

- Run `npm run migrate:up` in the deploy pipeline before app starts (or rely on startup migration if your platform does rolling restarts safely).
- Back up production DB before risky migrations.
- Never use destructive sync in production (`force`/`alter` behavior).

## Notes to self

`The up function`: You write the exact SQL command (or query interface method) to safely add that new column to products without touching existing rows.

`The down function`: If the deployment goes wrong, or you realize the new feature breaks the app, you can run migrate:down. This executes the exact instruction to safely remove that specific column, rolling the database back to the previous "checkpoint."