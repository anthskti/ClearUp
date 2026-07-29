# Product catalog & merchants

The catalog is a structured skincare inventory: each **product** has rich metadata; each product can be sold by multiple **merchants** with independent URLs and prices.

## Data model

```
Product *──* Merchant
         │
         └── ProductMerchant (price, url, merchant-specific fields)
```

### Product fields (high level)

| Field | Notes |
|-------|--------|
| `category` | Enum: `cleanser`, `toner`, `essence`, `serum`, `moisturizer`, `sunscreen`, `other` |
| `labels`, `skinType`, `tags` | String arrays for filtering and display |
| `instructions` | Text array (usage steps) |
| `price` | Base/list price on the product row |
| `imageUrls` | CDN URLs; Next.js `images.remotePatterns` allow common retailers |

### Merchant

Master list of storefronts (name, logo, base URL, etc.). Linked to products through `ProductMerchant`.

**Lowest offer wins** in the UI: `pickLowestPriceOffer` sorts `product_merchant.price` ascending. The builder and PDP use the same rule.

## API

Base path: `/api/products`

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| GET | `/` | Public | Paginated all products |
| GET | `/category/:category` | Public | Category listing |
| GET | `/id/:id` | Public | Product detail |
| GET | `/id/:id/merchants` | Public | Offers for one product |
| GET | `/merchants/batch?ids=1,2,3` | Public | Batched offers (routine pages) |
| POST | `/` | Admin | Create product |
| PUT/DELETE | `/id/:id` | Admin | Update/delete |
| POST | `/id/:id/merchants` | Admin | Link merchant to product |
| PUT/DELETE | `/product-merchant/:id` | Admin | Update/remove offer row |
| POST | `/import` (and related) | Admin | CSV import pipeline |

Merchant CRUD: `/api/merchant` (admin for writes).

## Frontend

| Route | Behavior |
|-------|----------|
| `/products/category/[slug]` | `ProductListClient` — grid, skin-type tooltips, add-to-builder |
| `/product/id/[slug]` | `ProductClient` — gallery, ingredients, merchant table, add merchant (admin) |

### Caching strategy (`frontend/src/lib/products.ts`)

Server fetches use Next.js `revalidate` tiers:

| Constant | TTL | Use |
|----------|-----|-----|
| `CATALOG_REVALIDATE_SEC` | 1h | Category lists |
| `PRODUCT_MERCHANTS_REVALIDATE_SEC` | 30m | Single-product merchants |
| `BATCH_MERCHANT_OFFERS_REVALIDATE_SEC` | 6h | Routine batch merchant fetch |
| Product-by-id (`getProductById`) | `no-store` | PDP body — always fresh after catalog edits |

This keeps catalog pages fast without stale prices living forever on high-churn offers.

## Admin import

Admins import catalog data via CSV:

- Backend parses CSV in `ProductService` (admin endpoints + `parseCsvBody` middleware).
- UI: `/admin/imports` (`ImportsAdminClient`) — status, manual triggers, error logs for scraper quirks.

A separate datascraper produces CSV aligned with `backend/src/types/csv.ts`. Merchant seed data also ships as `backend/src/data/merchant_table.csv` (`bun run seed:merchants`).

## Categories & skin types

Categories map to builder slots and URL slugs. Skin types (`oily`, `dry`, `combination`, `sensitive`, `normal`, `acne-prone`) appear on products and routines; routine-level tags were added in migration `001-add-routine-skin-type-tags`.

The backend module doc notes that merchant-sourced skin-type labeling may need normalization over time—treat tags as best-effort filters, not strict dermatology claims.

## Images

Product images are external URLs. `frontend/next.config.ts` whitelists hosts (CloudFront, Shopify CDNs, brand sites). Override default CDN host with `NEXT_PUBLIC_IMAGE_DOMAIN` if needed.

## Related files

| Area | Path |
|------|------|
| Product service | `backend/src/services/ProductService.ts` |
| Repositories | `ProductRepository.ts`, `ProductMerchantRepository.ts` |
| Frontend API | `frontend/src/lib/products.ts`, `lib/merchants.ts` |
| Types | `frontend/src/types/product.ts`, `merchant.ts` |
| Module doc | `backend/docs/modules/product.md` |
