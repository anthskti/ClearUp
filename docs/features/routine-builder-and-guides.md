# Routine builder & community guides

Routines are the core domain object: a named collection of products in skincare step order, optionally tagged by skin type and shared publicly as a **guide**.

## Data model

```
User 1──* Routine *──* Product
              │
              └── RoutineProduct (join: order, notes, snapshot fields)
```

- **`Routine`** — `name`, `description` (often JSON notes), `userId`, `skinTypeTags[]`.
- **`RoutineProduct`** — links a product into a routine; prices can be resolved live via merchant offers when viewing.
- **`featured_routines`** — admin-curated subset surfaced on the home page (`FeaturedRoutine` model).

Deleting a user cascades to their routines.

## Routine builder (client-first)

**Route:** `/builder` (`frontend/src/app/(main)/builder/page.tsx`)

The builder is primarily **client-side** until the user saves:

| Concern | Implementation |
|---------|----------------|
| Slot layout | Fixed categories: cleanser, toner, essence, serum, eyecare, moisturizer, sunscreen, other |
| Persistence (draft) | `localStorage` key `builder-routine` via `useBuilderRoutine` |
| Notes | `useBuilderNotes` — per-step notes, also local until save |
| Merchant preview | When adding a product, fetches lowest `product_merchant` price |
| Save | Requires login; opens `SaveRoutineModal`, then `POST /api/routines` + bulk product attach |

Skin type tags on save use `RoutineSkinTypeTagPicker` and are stored on the routine record.

After save, users get a shareable URL: `/routine/[id]`.

### Builder hook API (`useBuilderRoutine`)

- `addProductToSlot(category, product)` — supports multiple products per slot (migrated from older single-product shape).
- `removeProductFromSlot`, `clearRoutine`
- Auto-save to `localStorage` after hydration

## Viewing a routine

**Route:** `/routine/[id]`

Server/client code loads:

- `GET /api/routines/id/:id` — routine metadata
- `GET /api/routines/id/:id/products` — products in the routine
- Batched merchant offers via `getMerchantOffersByProductIds` (6h revalidate on server fetches)

Displayed prices favor the **lowest merchant offer** per product (`pickLowestPriceOffer`), consistent with the builder.

## Community guides

**Route:** `/guides`

Public, read-only listing of routines from **registered** authors (server-filtered).

**API:** `GET /api/routines/guides`

Query params (see `GuidesFilters`):

- `tags` — skin type filter (parsed via `routineSkinTypeTags`)
- `maxPrice` — budget ceiling on routine total
- `limit` / `offset` — pagination (24 per page in UI)

Guides are ordered with intentional randomness on the backend so the grid does not feel static.

## Featured routines (home)

**API:** `GET /api/routines/featured` (public)

**Admin:** `GET/POST/DELETE /api/routines/admin/featured/:id`

Admins curate featured guides at `/admin/content` (`ContentGuidesClient`), with a cap enforced in the UI (`FEATURED_CAP`).

## Authenticated user routines

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/routines/me` | Yes | Current user's routines |
| `GET /api/routines/user/:userId` | Yes | Specific user (owner-oriented) |
| `POST /api/routines` | Yes | Create routine |
| `POST /api/routines/bulk` | Yes | Attach many products at once |
| `PUT /api/routines/id/:id` | Yes | Update metadata |
| `DELETE /api/routines/id/:id` | Yes | Delete |
| `POST /api/routines/id/:id/products` | Yes | Add product to routine |
| `PUT/DELETE /api/routines/products/:id` | Yes | Update/remove join row |

Routine creation is rate-limited (10 per hour per IP) to reduce abuse.

## Profile pages

Under `/profile/`:

- **Saved routines** — bookmarks/favorites (UI layer; confirm against current API usage in `saved-routines/page.tsx`)
- **Created routines** — lists routines owned by the signed-in user

## Design notes

- **Live vs copied pricing:** Routines reference product IDs; merchant prices are fetched at read time so offer changes propagate without duplicating catalog rows.
- **Live category:** Display and slot grouping use `products.category` from the join (see `effectiveRoutineProductCategory`). `routine_products.category` is a denormalized snapshot kept in sync on save/attach and when catalog category changes (CSV / product update). Builder `localStorage` drafts are temporary and are not auto-migrated.
- **Bulk attach:** Preferred over many single-product POSTs when saving from the builder.
- **Comments:** A `Comment` model exists in the codebase but is not wired into the main guides flow yet.

## Related files

| Area | Path |
|------|------|
| API service | `backend/src/services/RoutineService.ts` |
| Routes | `backend/src/routes/routineRoutes.ts` |
| Frontend API | `frontend/src/lib/routines.ts` |
| Types | `frontend/src/types/routine.ts`, `backend/src/types/routine.ts` |
| Module doc | `backend/docs/modules/routine.md` |
