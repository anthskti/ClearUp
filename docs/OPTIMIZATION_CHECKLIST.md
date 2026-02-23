# Performance Optimization Checklist & Architecture Recommendations

## ⚡ QUICK Fix Checklist (Do These Today)

### Frontend Changes - 15 minutes

- [ ] Remove `unoptimized={true}` from all Image components
  - Files: ProductGallery.tsx, ProductListClient.tsx, HeroSection.tsx
- [ ] Add `sizes` prop to responsive images
- [ ] Fix width/height props (should match CSS dimensions)

### Backend Changes - 30 minutes

- [ ] Install `compression` package
- [ ] Add `app.use(compression())` middleware
- [ ] Add cache-control headers for GET requests
- [ ] Test with curl: `curl -I http://localhost:5000/api/products`
  - Should see: `Content-Encoding: gzip` and `Cache-Control: public, max-age=3600`

### Data Fetching - 30 minutes

- [ ] Update all `cache: "no-store"` to `cache: "force-cache"`
- [ ] Add `next: { revalidate: 3600 }` for time-based revalidation
- [ ] Test: Visit product page, refresh - should load instantly from cache

---

## 🏗️ Architecture Recommendations

### Current Data Flow (Slow)

```
Browser → Next.js (no cache) → Express Server (no compression)
        ↓                              ↓
    10 seconds                    Database query
                                   (5-8 sec)
```

### Recommended Data Flow (Fast)

```
Browser → Next.js ISR Cache ──────────→ User (instant)
            ↓
        Stale? ──→ Express + Redis Cache ──→ Fast response
                      ↓
                    Database (optimized queries)
```

### Caching Strategy

**Products & Categories:**

- Cache: **1-24 hours** (rarely change)
- Revalidation: ISR or on-demand
- TTL: `next: { revalidate: 3600 }`

**Merchants/Pricing:**

- Cache: **30 minutes** (updates may happen)
- TTL: `next: { revalidate: 1800 }`

**User Data (Routines):**

- Cache: **Don't cache** (personal data)
- TTL: `cache: "no-store"`

---

## 📊 Performance Metrics to Track

### Before Optimization

- Page Load: ~8-10s
- First Contentful Paint: ~3-4s
- Largest Contentful Paint: ~6-8s
- Cumulative Layout Shift: ~0.3+
- Total Blocking Time: ~2-3s
- Bundle Size: ~250kb (uncompressed)

### After Phase 1 (15-30 min work)

- Page Load: ~4-5s ✅
- FCP: ~1.5-2s ✅
- LCP: ~3-4s ✅
- CLS: ~0.1 (after image fixes)
- TBT: ~0.5s ✅
- Bundle Size: ~120kb gzipped ✅

### After All Phases (8-12 hours work)

- Page Load: ~1-2s ⚡
- FCP: ~0.5-1s ⚡
- LCP: ~1-1.5s ⚡
- CLS: ~0.05 ⚡
- TBT: ~0.1s ⚡
- Bundle Size: ~80kb gzipped ⚡

---

## 🚀 Implementation Priority Matrix

| Priority | Task                        | Effort | Impact | Do This   |
| -------- | --------------------------- | ------ | ------ | --------- |
| 🔴       | Remove `unoptimized={true}` | 15min  | 30%    | TODAY     |
| 🔴       | Add caching to fetches      | 20min  | 20%    | TODAY     |
| 🔴       | Add compression             | 10min  | 60%    | TODAY     |
| 🟠       | Pagination                  | 2hrs   | 70%    | THIS WEEK |
| 🟠       | Migrate images to CDN       | 2hrs   | 50%    | THIS WEEK |
| 🟠       | Dynamic imports             | 1hr    | 25%    | THIS WEEK |
| 🟠       | Database indexes            | 30min  | 30%    | THIS WEEK |
| 🟡       | Lazy loading                | 1hr    | 15%    | NEXT WEEK |
| 🟡       | Search implementation       | 3hrs   | 10%    | NEXT WEEK |
| 🔵       | PWA setup                   | 2hrs   | 5%     | LATER     |

---

## 💾 Recommended CDN & Services

### Image Hosting

**Current:** Google Drive (slow, not designed for this)
**Better Options:**

1. **Vercel Image Optimization** (built into Next.js) - $$$
2. **Cloudflare Image Resizing** (paid) - Best price/performance
3. **AWS CloudFront + S3** (reliable, scalable) - $$
4. **Bunny CDN** (cheap, global) - $

**Recommendation:** Start with Cloudflare CDN (free tier available)

### Backend Hosting

**Current:** Unknown
**Recommendation:**

- If self-hosted: Add Nginx reverse proxy with caching
- If using Vercel: Switch Express to Node.js function (serverless)
- Add Redis for session/query caching

### Database

**Current:** Postgres
**Additions:**

- Add **Redis** for caching frequent queries
- Add **Elasticsearch** if search gets complex
- Setup **connection pooling** (PgBouncer)

---

## 🔒 Caching Strategy Code

### Add to Backend

```typescript
// backend/src/middleware/cacheControl.ts
export const cacheProducts = (
  req: Express.Request,
  res: Express.Response,
  next: Function,
) => {
  res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  next();
};

export const cacheProductDetails = (
  req: Express.Request,
  res: Express.Response,
  next: Function,
) => {
  res.set("Cache-Control", "public, max-age=7200, s-maxage=7200");
  next();
};

export const cacheMerchants = (
  req: Express.Request,
  res: Express.Response,
  next: Function,
) => {
  res.set("Cache-Control", "public, max-age=1800, s-maxage=1800");
  next();
};

export const noCache = (
  req: Express.Request,
  res: Express.Response,
  next: Function,
) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
};
```

Usage in routes:

```typescript
// backend/src/routes/productRoutes.ts
import { cacheProducts, cacheProductDetails } from "../middleware/cacheControl";

router.get("/", cacheProducts, (req, res) =>
  productController.getAllProducts(req, res),
);
router.get("/id/:id", cacheProductDetails, (req, res) =>
  productController.getProductById(req, res),
);
```

---

## 📈 Monitoring & Analytics

### Add Performance Monitoring

```typescript
// frontend/src/lib/metrics.ts
export function trackPerformance() {
  if (typeof window === "undefined") return;

  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log(`Page Load: ${pageLoadTime}ms`);
    console.log(`Server Response: ${connectTime}ms`);
    console.log(`DOM Render: ${renderTime}ms`);

    // Send to analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_load_time", {
        value: pageLoadTime,
        event_category: "page_load",
      });
    }
  });
}
```

Call in layout.tsx:

```typescript
import { trackPerformance } from "@/lib/metrics";
useEffect(() => {
  trackPerformance();
}, []);
```

---

## 🧪 Testing Performance

### Local Testing

```bash
# Check bundle size
npm run build

# Run Lighthouse
npm run build && npm start
# Then use DevTools Lighthouse tab

# Monitor network (DevTools → Network tab)
# Check:
# - Time to First Byte (TTFB)
# - Largest Contentful Paint
# - Total Blocking Time
# - Cumulative Layout Shift
```

### Production Testing

- Use Google PageSpeed Insights
- Use WebPageTest.org
- Monitor with Datadog/New Relic

---

## 🎯 30-Day Performance Goals

### Week 1: Critical Path (Quick Wins)

- [ ] Images optimized (remove unoptimized)
- [ ] Caching enabled
- [ ] Compression active
- **Target:** 40% faster

### Week 2: Pagination & Structure

- [ ] Pagination implemented
- [ ] Database indexes added
- [ ] Query optimization done
- **Target:** 60% faster

### Week 3: Advanced (CDN, Dynamic Imports)

- [ ] Images on CDN
- [ ] Dynamic imports active
- [ ] Lazy loading for components
- **Target:** 70% faster

### Week 4: Polish & Monitoring

- [ ] Search functionality
- [ ] Performance monitoring
- [ ] Mobile optimization
- **Target:** 75-80% faster

---

## 📝 Code Review Checklist

When reviewing performance changes:

- [ ] All Images have `priority` or `loading="lazy"` attributes
- [ ] No `unoptimized={true}` in Image components
- [ ] All API calls have cache strategy defined
- [ ] Database queries select only needed attributes
- [ ] Pagination implemented for large datasets
- [ ] Heavy components use dynamic imports
- [ ] Compression middleware active
- [ ] Cache headers set on backend
- [ ] No N+1 queries in test data
- [ ] Lighthouse score > 85

---

## 🎓 Key Performance Concepts for Your Team

### Why Caching Matters

Without cache: Every request hits database (slow)
With cache: Most requests served instantly (fast)

### Why Images Matter

Unoptimized: Full resolution everywhere (60-70% of page size)
Optimized: Smaller + webp + CDN (20-30% of page size)

### Why Pagination Matters

No pagination: Load 10,000 items = browser crashes
Pagination: Load 50 items = smooth UI

### Why Compression Matters

No compression: 100kb JSON response
With compression: 20kb JSON response (80% smaller!)

---

## 🆘 Troubleshooting

### "Cache isn't working"

Checklist:

- [ ] Check Response Headers: `Cache-Control: public, max-age=...`
- [ ] Browser DevTools → Application → Cache Storage
- [ ] Hard refresh (Ctrl+Shift+R) to test

### "Images still slow"

Checklist:

- [ ] Remove `unoptimized={true}`
- [ ] Check file sizes (should be < 50kb)
- [ ] Verify CDN is serving images (not Google Drive)
- [ ] Test in incognito (bypasses browser cache)

### "Database still slow"

Checklist:

- [ ] Add index: `CREATE INDEX idx_column ON table(column);`
- [ ] Check query: Use `EXPLAIN ANALYZE` in psql
- [ ] Monitor load: `SELECT * FROM pg_stat_statements;`
- [ ] Consider Redis caching for hot data
