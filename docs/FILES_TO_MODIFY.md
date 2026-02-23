# Files That Need Changes - Complete Action List

## 🔴 PHASE 1: CRITICAL FIXES (Today - 45 minutes)

### 1. Image Optimization

**File: `frontend/src/components/ui/ProductGallery.tsx`**

- [ ] Remove `unoptimized={true}`
- [ ] Add `sizes` prop for responsive images
- [ ] Keep `priority={index === 0}` for first image

**File: `frontend/src/components/products/ProductListClient.tsx`**

- [ ] Fix width/height from `width={10} height={10}` to `width={44} height={44}`
- [ ] Add `sizes` prop
- [ ] Remove `unoptimized={true}`

**File: `frontend/src/app/product/id/[slug]/page.tsx`**

- [ ] No changes needed (looks good)

**File: `frontend/src/components/home/HeroSection.tsx`**

- [ ] Verify it has `priority` on Image
- [ ] Add `sizes="(max-width: 768px) 100vw, 50vw"`

**File: `frontend/next.config.ts`**

- [ ] Add `formats: ['image/avif', 'image/webp']`
- [ ] Add `deviceSizes` and `imageSizes`
- [ ] Set `unoptimized: false`

---

### 2. Add Caching

**File: `frontend/src/lib/products.ts`**

- [ ] Change `cache: "no-store"` to `cache: "force-cache"`
- [ ] Add `next: { revalidate: 3600 }` (products)
- [ ] Add `next: { revalidate: 1800 }` (merchants)

**File: `frontend/src/lib/routines.ts`**

- [ ] Change `cache: "no-store"` to `cache: "force-cache"`
- [ ] Add `next: { revalidate: 3600 }` for routine fetches

---

### 3. Add Compression

**File: `backend/package.json`**

- [ ] Add `"compression": "^2.8.5"` to dependencies
- [ ] Run: `npm install`

**File: `backend/src/index.ts`**

- [ ] Add: `import compression from 'compression';`
- [ ] Add: `app.use(compression());` after `app.use(express.json());`

---

## 🟠 PHASE 2: HIGH IMPACT (This week - 3-4 hours)

### 4. Database Indexes

**File: `backend/src/models/Product.ts`**

- [ ] Add `indexes` array to `Product.init()` options:
  ```typescript
  indexes: [
    { fields: ["category"] },
    { fields: ["brand"] },
    { fields: ["createdAt"] },
  ];
  ```

**File: `backend/src/models/RoutineProduct.ts`**

- [ ] Add indexes for `routineId`, `productId`, and combined key

**File: `backend/src/models/ProductMerchant.ts`**

- [ ] Add indexes for `productId` and `merchantId`

---

### 5. Database Query Optimization

**File: `backend/src/repositories/ProductMerchantRepository.ts`**

- [ ] Add `attributes` selection in `findByProductId()`
- [ ] Only select: `['id', 'productId', 'merchantId', 'website', 'price', 'stock', 'shipping']`
- [ ] Add to merchant include: `attributes: ['id', 'name', 'logo']`

**File: `backend/src/repositories/RoutineRepository.ts`**

- [ ] In `findByIdWithProducts()`, add attributes:
  - ProductModel: `['id', 'name', 'brand', 'price', 'averageRating', 'imageUrls']`
  - RoutineProductModel: `['id', 'productId', 'category']`

**File: `backend/src/repositories/ProductRepository.ts`**

- [ ] No changes - basic queries already optimized

---

### 6. Pagination

**File: `backend/src/repositories/ProductRepository.ts`**

- [ ] Add new method: `findAllPaginated(limit, offset)`
- [ ] Add new method: `findByCategoryPaginated(category, limit, offset)`
- [ ] Both should return: `{ products, total, page, pageSize }`

**File: `backend/src/services/ProductService.ts`**

- [ ] Add: `getAllProductsPaginated()`
- [ ] Add: `getProductsByCategoryPaginated()`

**File: `backend/src/controllers/productController.ts`**

- [ ] Update `getAllProducts()` to handle `page` and `limit` query params
- [ ] Update `getProductsByCategory()` to handle pagination

**File: `frontend/src/hooks/usePaginatedProducts.ts`** (NEW FILE)

- [ ] Create new hook for paginated product fetching
- [ ] Handle loading state, page state, total count

**File: `frontend/src/components/products/ProductListClient.tsx`**

- [ ] Update to use `usePaginatedProducts` hook instead of direct fetch
- [ ] Add pagination controls (previous/next buttons)
- [ ] Add page number display

---

## 🟡 PHASE 3: NICE-TO-HAVE (Next 1-2 weeks)

### 7. Dynamic Imports (Code Splitting)

**File: `frontend/src/app/page.tsx`**

- [ ] Import `dynamic` from 'next/dynamic'
- [ ] Convert to dynamic imports:
  - `TrendingBuilds`
  - `Matches`
  - `HowItWorks`
- [ ] Add loading fallbacks (skeletons)

**File: `frontend/src/components/home/HeroSection.tsx`**

- [ ] Can stay static (first thing on page)

---

### 8. Lazy Loading Components

**File: `frontend/src/components/ui/ProductGallery.tsx`**

- [ ] Add `loading="lazy"` to thumbnail images
- [ ] Keep `loading="eager"` for main image (priority)

**File: `frontend/src/components/products/ProductListClient.tsx`**

- [ ] Add `loading="lazy"` to product thumbnail images

---

### 9. Response Cache Headers

**File: `backend/src/index.ts`**

- [ ] Add cache control middleware function
- [ ] Apply to product routes: `max-age=3600`
- [ ] Apply to merchant routes: `max-age=1800`
- [ ] Apply to routine routes: `no-cache` (user-specific)

---

## 📋 Implementation Checklist

### Phase 1 (Today)

- [ ] ProductGallery.tsx - remove unoptimized
- [ ] ProductListClient.tsx - fix image dimensions
- [ ] HeroSection.tsx - add sizes
- [ ] next.config.ts - update image config
- [ ] products.ts - update cache strategy
- [ ] routines.ts - update cache strategy
- [ ] backend/package.json - add compression
- [ ] backend/src/index.ts - add compression middleware
- [ ] TEST: Visit product page, verify loads faster

### Phase 2 (This Week)

- [ ] Add indexes to all models
- [ ] Add query optimization (attributes selection)
- [ ] Create usePaginatedProducts hook
- [ ] Update ProductRepository with pagination
- [ ] Update ProductService with pagination
- [ ] Update ProductController with pagination
- [ ] Update ProductListClient to use pagination
- [ ] TEST: Load products page with 1000+ items, should still be fast

### Phase 3 (Next Week)

- [ ] Convert home page components to dynamic imports
- [ ] Add lazy loading to images
- [ ] Add response cache headers
- [ ] TEST: Run Lighthouse, verify score > 85

---

## 🧪 Testing After Each Phase

**After Image Fixes:**

```bash
# Load product page in DevTools Network tab
# Image sizes should be < 100kb each
# Should see webp/avif in Network > IMG column
```

**After Caching:**

```bash
# Hard refresh first time: 8-10s
# Refresh again: < 1s (from cache)
# Check response headers: Cache-Control should be present
```

**After Compression:**

```bash
# Check API response headers
# Should see: Content-Encoding: gzip
# Response size should be ~70% smaller
```

**After Pagination:**

```bash
# Load products page
# Should only see 50 items, not 10000
# Database query should take < 1 second
```

---

## 🚀 Priority Order for Implementation

1. **Images** (15 min) - Biggest user impact
2. **Compression** (10 min) - Easiest to implement
3. **Caching** (20 min) - High ROI
4. **Pagination** (2 hrs) - Prevents future disasters
5. **Indexes** (30 min) - Performance foundation
6. **Query Optimization** (1 hr) - Speed up database
7. **Dynamic Imports** (1 hr) - Smaller JS bundle
8. **Lazy Loading** (1 hr) - Better First Paint
9. **Response Headers** (30 min) - Complete the caching strategy

**Total Time: ~8 hours for all improvements**
**Total Impact: 70-80% faster website**

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't:** Keep `unoptimized={true}` on images
✅ **Do:** Remove it and test that images still load

❌ **Don't:** Cache user-specific data (routines, preferences)
✅ **Do:** Only cache public data (products, categories)

❌ **Don't:** Return all 10,000 products in one request
✅ **Do:** Implement pagination with limit: 50

❌ **Don't:** Fetch width/height measurements in product queries
✅ **Do:** Select only needed attributes

❌ **Don't:** Add compression to compressed responses
✅ **Do:** Compression handles all responses automatically

❌ **Don't:** Use dynamic imports for components above the fold
✅ **Do:** Only dynamic import below-the-fold content

---

## 📞 Questions?

If you get stuck on any file:

1. Check IMPLEMENTATION_GUIDE.md for code examples
2. Check the corresponding file in the project for context
3. Refer to PERFORMANCE_OPTIMIZATION_REPORT.md for why each change matters
