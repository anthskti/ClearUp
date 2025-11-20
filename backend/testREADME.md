# ClearUp Backend Testing

- [Setup](#setup)
- [Product Testing](#product-testing)
- [Routine Testing](#routine-testing)


## Setup
### Start backend services
To start all Docker containers:
```bash
cd backend
docker-compose up --build
```

### Stopping docker services
To stop all Docker containers:
```bash
docker-compose down
```
To run backend Server in cd backend:

```bash
npm run dev
```

Development/testing: npm run dev
Production deployment: npm run build then npm start
Docker/AWS deployment: Use npm run build + npm start

Look at Local Postgre Table via Docker
on windows:
```bash
docker exec -it skincare-db psql -U postgres -d skincare
```
on mac:
```bash
docker exec -it skincare-postgres psql -U postgres -d skincare
```
do \q to quit
## Product Testing
### Testing Product Script:
```bash
npx ts-node src/scripts/testProduct.ts
```

### Testing *product* REST commands using Postman:

get all products
```bash
GET http://localhost:3000/api/products/
```

get by category
```bash
GET http://localhost:3000/api/products/Cleanser
```

get by id
```bash
GET http://localhost:3000/api/products/id/2
```

post a product
```bash
POST http://localhost:3000/api/products/
```

body - raw
```bash
{
"name": "Madagascar Centella Ampoule",
"brand": "SKIN 1004",
"category": "Serum",
"skinTypes": ["combination"],
"benefits": "centella benefits",
"ingredients": "centella ingredients",
"country": "South Korea",
"imageUrls": ["test.jpg"],
"tags": ["glass skin", "daily-use"]
}
```

update a product
```bash
PUT http://localhost:3000/api/products/id/2
```

body - raw
```bash
{
    "name": "Madagascar Centella Ampoule",
    "brand": "SKIN 1004",
    "category": "Serum",
    "skinTypes": ["oily"],
    "benefits": "centella ampoule benefits",
    "ingredients": "centella ampouleingredients",
    "country": "South Korea",
    "imageUrls": ["test.jpg", "test2.jpg"],
    "tags": ["glass skin", "daily-use"]
}
```

delete a product
```bash
DELETE http://localhost:3000/api/products/id/2
```

## Routine Testing
### Testing Product Script:
```bash
npx ts-node src/scripts/testRoutine.ts
```

### Testing *routines and products* REST commands using Postman:

