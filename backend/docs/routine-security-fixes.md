# Routine & Builder Security Fixes

This document records vulnerabilities found in a pre-deploy audit (builder + saved routines) and how each was fixed.

## Summary

| ID | Severity | Issue | Fix |
|----|----------|-------|-----|
| C-1 | Critical | `PUT /products` with missing/empty body wiped all junction rows | Server refuses empty replace unless `confirmClear: true`; requires explicit `products` or `items` array |
| H-1 | High | `buildRoutineSaveItems` dropped notes without grid products | Merge `note.category` into category map; fallback when building rows |
| H-2 | High | Note editor used full `replaceAll` | `RoutineUsageNotesEditor` uses `PATCH` / `POST` per slot only |
| H-3 | High | CSRF on cookie-authenticated mutations | `x-clearup-client: 1` required on routine `POST`/`PUT`/`PATCH`/`DELETE` |
| H-4 | High | `deleteRoutineById` continued after invalid id | Added missing `return` |
| M-1 | Medium | No rate limit on routine updates | `routineMutateLimiter` on `PUT`/`PATCH`/`DELETE` |
| M-2 | Medium | (Partial) Concurrent saves | Note path no longer full-replace; bulk PUT still last-write-wins (documented) |
| M-3 | Medium | Product delete left orphan junction rows | `RoutineProduct` rows removed before product delete |
| M-4 | Medium | Unbounded `userNote` / description | Max lengths enforced/truncated |
| M-5 | Medium | Duplicate `productId` in one payload | Merged/deduped in `parseRoutineProductItems` (one row per product) |
| M-6 | Medium | Builder cleared localStorage before user closed success UI | `onSuccess` runs when user clicks Close after save |

Low items (public `GET` routines, share-by-id, localStorage) are **accepted product behavior** — not changed here.

---

## C-1: Silent routine product wipe

### Why it happened

`RoutineProductRepository.replaceAllForRoutine` runs `destroy` for all rows on a routine, then `bulkCreate`. The controller treated non-array bodies as `[]`:

```typescript
// Before: body.products null → []
const incomingProducts = Array.isArray(body.products) ? ... : [];
```

Any failed client, bad proxy, or CSRF `PUT` could erase every product while the routine name remained.

### What we did

1. **`RoutineService.upsertRoutineProducts`** counts existing rows. If `items.length === 0` and existing &gt; 0, throws `RoutineProductReplaceError` unless `options.confirmClear === true`.
2. **Controller** returns `400` if neither `products` nor `items` is an array.
3. **Controller** passes `confirmClear: body.confirmClear === true` for intentional clears (admin/scripts only; app does not send this by default).

### Files

- `backend/src/lib/routineSecurity.ts` — `RoutineProductReplaceError`
- `backend/src/services/RoutineService.ts`
- `backend/src/controllers/RoutineController.ts`

---

## H-1: Builder save dropped orphan notes

### Why it happened

`buildRoutineSaveItems` only mapped categories from the grid. Notes in localStorage for products no longer in the grid were skipped (`continue`), producing incomplete `POST /bulk` payloads.

### What we did

1. Seed `categoryByProductId` from each note’s `category`.
2. Use `note.category` as fallback when pushing AM/PM rows.
3. **`assertRoutineSaveItemsValid`** on the builder before opening the save modal (client-side).
4. **`createRoutineWithProducts`** rejects `items.length === 0` on the server.

### Files

- `frontend/src/lib/buildRoutineSaveItems.ts`
- `frontend/src/app/(main)/builder/page.tsx`

---

## H-2: Note editor used full replace

### Why it happened

`RoutineUsageNotesEditor` called `updateRoutineProductsById` (full PUT). Any mismatch between `initialProducts` and built `items` risked the same wipe semantics as C-1.

### What we did

Save notes by:

- **`PATCH`** `/api/routines/id/:id/notes` with `{ updates: [{ productId, amNote?, pmNote?, amStepOrder?, pmStepOrder? }] }` in one atomic transaction.

No full replace on the routine page for note edits.

### Files

- `backend/src/lib/routineProductNotes.ts`
- `frontend/src/components/routine/RoutineUsageNotesEditor.tsx`
- `frontend/src/lib/routines.ts` — `saveRoutineNotes`

---

## H-3: CSRF on routine mutations

### Why it happened

Session cookies with `SameSite=None` (cross-site deploy) allow browsers to send cookies on cross-origin requests. Simple form POSTs from attacker sites could hit mutating endpoints.

### What we did

1. Middleware **`requireMutationHeader`** on all `/api/routines` routes for `POST`/`PUT`/`PATCH`/`DELETE`.
2. Requires header **`x-clearup-client: 1`** (browsers do not send custom headers on cross-site form posts).
3. Frontend **`mutationHeaders()`** added to every routine mutation in `routines.ts` and server actions in `admin-server.ts`.

### Files

- `backend/src/middleware/requireMutationHeader.ts`
- `backend/src/routes/routineRoutes.ts`
- `frontend/src/lib/mutationHeaders.ts`
- `frontend/src/lib/routines.ts`
- `frontend/src/lib/admin-server.ts`

### Deploy note

Any non-browser client (curl, scripts) must send `x-clearup-client: 1` on routine mutations.

---

## H-4: Delete routine missing return

### Why it happened

Invalid routine id set `404` but execution continued.

### What we did

Added `return` after `res.status(404).json({ error: "Invalid Routine Id" })`.

### Files

- `backend/src/controllers/RoutineController.ts`

---

## M-1: Rate limit on updates

### What we did

`routineMutateLimiter`: 60 requests / 15 minutes per IP for `PUT`/`PATCH`/`DELETE` on `/api/routines` (in addition to global 300/15m).

### Files

- `backend/src/index.ts`

---

## M-3: Product delete and junction rows

### Why it happened

Deleting a catalog product did not remove `routine_products` rows. Routines could show empty product cards or break joins.

### What we did

`ProductService.deleteProduct` destroys `routine_products` where `productId` matches, then deletes the product.

### Files

- `backend/src/services/ProductService.ts`

---

## M-4: Field size limits

| Field | Limit |
|-------|-------|
| `userNote` | 4096 chars (reject if over) |
| Routine `name` | 200 chars (truncate on update/create) |
| Routine `description` | 8000 chars (truncate) |

### Files

- `backend/src/lib/routineSecurity.ts`
- `backend/src/lib/routineProductItems.ts`
- `backend/src/controllers/RoutineController.ts`

---

## M-5: Duplicate slots in one PUT

### What we did

After parsing, `parseRoutineProductItems` keeps one row per `productId` (AM/PM notes merged on the same row).

### Files

- `backend/src/lib/routineProductItems.ts`

---

## M-6: Builder cleared before user acknowledged save

### What we did

`SaveRoutineModal` calls `onSuccess()` (clears `localStorage`) only in **`handleCloseAfterSave`**, not immediately after API success.

### Files

- `frontend/src/components/routine/SaveRoutineModal.tsx`

---

## Verification checklist

Before deploy:

1. Create routine with 3+ products → `GET .../products` → count N.
2. `PUT .../products` with `{}` → **400**, count still N.
3. `PUT .../products` with `products: []` → **400**, count still N.
4. Edit notes on `/routine/[id]` → save → count still N; notes updated.
5. Save from builder → products remain in modal until Close → localStorage cleared after Close.
6. curl without `x-clearup-client` → **403** on `POST /api/routines/bulk`.
7. Admin delete product → routines no longer reference that product id in junction table.

---

## Intentionally not changed

- **Public `GET /api/routines` and `/id/:id/products`** — required for guides and share links.
- **Optimistic locking / ETags** — future improvement; shrinking a routine via intentional full PUT from builder is still valid when `products` is a non-empty array.
- **localStorage builder state** — client-only; documented cross-tab last-write-wins.

---

## Related modules

- [routine.md](./modules/routine.md) — routine API overview
- Frontend: `src/lib/mutationHeaders.ts`, `src/lib/buildRoutineSaveItems.ts`
