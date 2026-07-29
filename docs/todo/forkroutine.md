# Fork routine → builder (“Copy to builder”)

## Goal

PCPartPicker-style fork: from a saved routine, one button copies products + notes into the user’s builder draft. Save creates a **new** routine id (never overwrite the source).

Not in scope: in-place grid edit on `/routine/[id]`.

## Product decisions (locked)

| Decision | Choice |
|----------|--------|
| Save result | Always **fork** → new id via existing `POST /api/routines/bulk` |
| CTA | **Copy to builder** (include AM/PM notes + step order) |
| Slot placement on load | Use denormalized join `routine_products.category` (preserve author’s layout), **not** live catalog category |
| Auth | Any signed-in user who can view the routine can fork; guest → sign-in then resume |

## Difficulty

**~M (small–medium), mostly frontend.** Roughly **0.5–1.5 days** for a solid MVP if focused.

Why it’s tractable:

- Builder already drafts in `localStorage` and saves only via **create/bulk** (new id).
- `getRoutineWithProducts` already returns products + nested catalog + notes fields.
- No new backend endpoint required for MVP.

Main work is hydration + UX (draft overwrite, deep link), not a second editor.

## Caveat (slots vs live catalog)

Fork **load** should bucket by join `rp.category`.

On **save**, `applyLiveProductCategories` still overwrites category from the catalog. If a product’s catalog category changed since the source routine was built, the forked save may land in a different slot than the copied draft.

MVP: accept that (document in UI lightly if needed). Later option: toast on hydrate when join ≠ live category.

## Reuse

- `getRoutineWithProducts` — `frontend/src/lib/routines.ts`
- Draft keys / expand — `useBuilderRoutine`, `useBuilderProductNotes`, `slimBuilderRoutineStorage`
- Save path — `buildRoutineSaveItems` → `createRoutine` (bulk)
- Notes shape for display — `hydrateRoutineProductNotesFromApi` (need sibling mapper → `BuilderProductNoteEntry`)

## Build

1. **CTA** on `/routine/[id]` (and maybe created-routines cards): “Copy to builder”.
2. **Hydrate helper** — API products → builder slots using **`rp.category`**, plus notes → `BuilderProductNoteEntry[]` (include `amNote` / `pmNote` / step orders). Optionally prefetch merchant prices like `addProductToSlot`.
3. **Entry** — e.g. `/builder?fromRoutine=<id>` (one-shot): fetch → write both draft stores (or `setRoutine` / `setEntries`) → strip query / mark consumed.
4. **Draft conflict** — if builder already has products/notes, confirm replace vs cancel.
5. **Prefill save modal** — name like `Copy of {name}`, optional description / skin tags from source.
6. **Guest** — redirect to login with return URL preserving `fromRoutine`.

## Out of scope (later)

- Upsert / overwrite same routine id
- Backend “fork” endpoint
- Preserving join category through bulk save (would fight live-category source of truth)
- Public “remix” analytics / attribution

## Smoke test

- [ ] Owner copies own routine → builder matches slots + notes → save → new id
- [ ] Other user copies public routine → same; source unchanged
- [ ] Empty builder: no confirm; dirty builder: confirm
- [ ] Guest: sign-in → returns and hydrates
- [ ] Product with live category ≠ join category: draft uses join slot (document save remap if it happens)
