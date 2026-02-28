# ClearUp Backend Testing

- [Setup](#setup)
- [Product Testing](#product-testing)
- [Routine Testing](#routine-testing)

## SETUP

### DOCKER RELATED

To start all Docker containers:

```bash
cd backend
docker-compose up --build
```

Background when everything is already built:

```bash
docker-compose up -d
```

Stop all Docker containers:

```bash
docker-compose down
```

Look at Local Postgre Table via Docker
on windows:

````bash
docker exec -it skincare-db psql -U postgres -d skincare
``
on mac:
```bash
docker exec -it skincare-postgres psql -U postgres -d skincare
````

cmds
do \dt to see all tables
do \q to quit

### TERMINAL RELATED

To run backend Server in cd backend:

```bash
npm run dev
```

notes:
Development/testing: npm run dev
Production deployment: npm run build then npm start
Docker/AWS deployment: Use npm run build + npm start

## POSTMAN TESTING

### Testing All Features Script:

```bash
npx ts-node src/scripts/testRoutine.ts
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
