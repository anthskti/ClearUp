# ClearUp Backend Testing

- [Setup](#setup)
- [Product Testing](#product-testing)
- [Routine Testing](#routine-testing)

## SETUP

### Local Development: Docker Database

`docker-compose.yml` only runs **Postgres**. The backend is **not** containerized for day-to-day dev.

1. **Environment** — Copy `backend/.env.example` → `backend/.env`:
   - `NODE_ENV=development`
   - Use `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` 
   - **Comment out or remove `DATABASE_URL`** — if it is set, the app connects to Supabase instead of Docker
2. **Start Postgres**:

```bash
cd backend
docker compose up -d
```

Wait until healthy (`docker compose ps`). First run creates the `skincare` database automatically.

3. **Start API** (migrations run on boot):

```bash
cd backend
bun run dev
```

4. **Frontend** — `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5050
```

5. **Optional seed data**:

```bash
bun run seed
```

Or paste scraper CSV on the admin import page (requires `ADMIN_EMAILS` + logged-in admin).

**Stop Postgres:** `docker compose down` (add `-v` only if you want to wipe all local data).

### Troubleshooting

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| Better Auth / sign-in DB errors | `DATABASE_URL` empty but auth only read that before; or SSL mismatch with Supabase in dev | Leave `DATABASE_URL` unset for local Docker; use `DB_*`. Pull latest — auth now uses `src/lib/dbConfig.ts` (same URL + SSL as Sequelize). |
| `relation "featured_routines" does not exist` | Migration `003-create-featured-routines.ts` never ran | `docker compose up -d` then `bun run migrate:up` or restart `bun run dev` (migrations on boot). |
| Bun vs npm issues | Mixed lockfiles / `ts-node` | Use only `bun install` and `bun run dev` (see `package.json`). |
| Google OAuth alert `undefined` | API returns 500; `verification.value` was `varchar(255)` but OAuth state is longer | Run `bun run migrate:up` (migration `004-verification-value-text`). In Google Cloud, redirect URI must be `http://localhost:5050/api/auth/callback/google` (API host, not `:3000`). |
| `unable_to_create_user` / missing `banned` | `plugins: [admin()]` expects extra `user` columns | Run `bun run migrate:up` (migration `005-add-better-auth-admin-columns`). |

**Inspect tables:**

```bash
docker exec -it skincare-db psql -U postgres -d skincare
```

In `psql`: `\dt` lists tables, `\q` quits.

### Dockerfile note

`Dockerfile` builds the API image with **Bun** (`bun install`, `bun run build`, `bun run start`). It is **not** used by `docker compose` today (compose only starts Postgres). You do not need to build it for local DB testing.

### Commands cheat sheet

| Goal | Command |
|------|---------|
| DB in background | `docker compose up -d` |
| DB logs | `docker compose logs -f postgres` |
| Stop DB | `docker compose down` |
| API dev server | `bun run dev` |
| Production build | `bun run build` then `bun run start` |

## POSTMAN TESTING (highkey all invalidated after updating so much)

### Testing All Features Script:

```bash
bunx ts-node src/scripts/testRoutine.ts
```

### Testing _product and productmerchants_ REST commands using Postman:

GET all products

```bash
GET http://localhost:3000/api/products/
```

GET by category

```bash
GET http://localhost:3000/api/products/serum
```

GET product by id

```bash
GET http://localhost:3000/api/products/id/2
```

POST a product

```bash
POST http://localhost:3000/api/products/
```

body -> raw
Be sure to have one of the category: cleanser, toner, essence, serum, moisturizer, sunscreen, other.
Be sure to have one of the skinTypes: oily, dry, combination, sensitive, normal, acne-prone.

```bash
{
    "name": "Heartleaf Oil Cleanser",
    "brand": "Anua",
    "category": "cleanser",
    "labels": ["oil"],
    "skinType": ["sensitive", "oily", "dry"],
    "country": "South Korea",
    "capacity": "100ml",
    "price": 21.99,
    "instructions": [
      "After cleansing and toning, apply 2-3 drops on face.",
      "Pat gently for better absorption."
    ],
    "activeIngredient": ["Heartleaf Extract"],
    "ingredients": "Heartleaf Extract, Water.",
    "imageUrls": ["/placeholder-image.jpg"],
    "averageRating": 4.6,
    "reviewCount": 1,
    "tags": ["hydrating"]
}
```

update a product

```bash
PUT http://localhost:3000/api/products/id/3
```

body -> raw
All subjects can be updated independently.

```bash
{
    "skinType": ["sensitive", "combination", "oily", "dry"],
    "country": "South Korea",
    "capacity": "100ml",
    "price": 20.99,
    "instructions": [
      "After cleansing and toning, apply 2-3 drops on face.",
      "Pat gently for better absorption."
    ],
    "ingredients": "Heartleaf Extract, Saylicic Acid, Water.",
    "averageRating": 4.7,
    "reviewCount": 3,
    "tags": ["Makeup Melter", "Lightweight"]
}
```

DEL a product

```bash
DELETE http://localhost:3000/api/products/id/3
```

GET merchant by product Id

```bash
GET http://localhost:3000/api/products/id/1/merchants
```

POST new merchant for a product

```bash
POST http://localhost:3000/api/products/id/2/merchants
```

body -> raw

```bash
{
    "productId": 2,
    "merchantId": 1,
    "website":
      "https://global.oliveyoung.com/product/detail?snailmucin",
    "price": 21.32,
    "stock": true,
    "shipping": "Free Shipping < US$60"
}
```

PUT a product-merchant info

```bash
PUT http://localhost:3000/api/products/product-merchant/2
```

body -> raw

```bash
{
    "price": 15.32,
    "stock": false,
    "shipping": "Free Shipping < US$50"
}
```

DEL a products merchant

```bash
DEL http://localhost:3000/api/products/product-merchant/2
```

### Testing _routines and routineproducts_ REST commands using Postman:

GET all routines

```bash
GET http://localhost:3000/api/routines/
```

GET routine (singular) by Id

```bash
GET http://localhost:3000/api/routines/user/1
```

GET routine with its products

```bash
GET http://localhost:3000/api/routines/id/1
```

GET routines products

```bash
GET http://localhost:3000/api/routines/id/1/products
```

POST a single routine

```bash
POST http://localhost:3000/api/routines
```

body -> raw

```bash
{
    "name": "My Second Routine",
    "description": "making my second routine",
    # "userId": 1
}
```

PUT a single routine by ID

```bash
PUT http://localhost:3000/api/routines/id/1
```

body -> raw

```bash
{
    "name": "My first Routine",
    "description": "updating my first routine",
    "userId": 1
}
```

DEL routine by id

```bash
DELETE http://localhost:3000/api/routines/id/2
```

POST add a product to a routine

```bash
POST http://localhost:3000/api/routines/id/2/products
```

raw -> body

```bash
{
    "productId": 3,
    "category": "cleanser",
    "timeOfDay": "evening",
    "notes": "First to apply. Usually used with regular cleanser"
}
```

DELETE a product from a routine

```bash
http://localhost:3000/api/routines/1/products/3
```

PUT a products personal information

```bash
http://localhost:3000/api/routines/1/products/2
```

body -> raw
Note: any var is available for change.

```bash
{
    "timeOfDay": "morning"
}
```

### Testing _merchants_ REST commands using Postman:

GET all merchants

```bash
GET http://localhost:3000/api/merchant/
```

POST a merchant

```bash
POST http://localhost:3000/api/merchant/
```

body -> raw

```bash
{
    "name": "Amazon",
    "logo": "/placeholder-image.jpg"
}
```

PUT update a merchant

```bash
PUT http://localhost:3000/api/merchant/
```

body -> raw

```bash
{
    "logo": "/placeholder-image22.jpg"
}
```

DEL a merchant

```bash
DEL http://localhost:3000/api/merchant/3
```


## Testing Amazon SES
Go to AWS SES

For adding identities:
Search "SES" --> Amazon Simple Email Services.
Click the menu on the left --> Identity. add Domain when domain is purchase.
Current utilizing email instead of domain name though.

```bash
bun run test:ses
```