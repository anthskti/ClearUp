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

### Testing _product_ REST commands using Postman:

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

body - raw \* NOTE Be sure to have one of the skinTypes: oily, dry, combination, sensitive, normal, acne-prone

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

### Testing _routines and products_ REST commands using Postman:

getting all routines

```bash
GET http://localhost:3000/api/routines/
```

getting a specifics user routines (will update the id once user is created)

```bash
GET http://localhost:3000/api/routines/user/1
```

getting a specific routine

```bash
GET http://localhost:3000/api/routines/id/1
```

getting routine along with products \*NOTE if products is empty, will return an empty list.

```bash
GET http://localhost:3000/api/routines/id/1/products
```

posting routine

```bash
POST http://localhost:3000/api/routines
```

body - raw

```bash
{
    "name": "My Second Routine",
    "description": "making my second routine",
    "userId": 1
}
```

updating routine by id

```bash
PUT http://localhost:3000/api/routines/id/1
```

body - raw

```bash
{
    "name": "My Second Routine",
    "description": "updating my second routine",
    "userId": 1
}
```

deleting routine by id

```bash
DELETE http://localhost:3000/api/routines/id/2
```

adding a product to a routine

```bash
POST http://localhost:3000/api/routines/id/2/products
```

raw - body

```bash
{
    "productId": 3,
    "category": "Cleanser",
    "timeOfDay": "evening",
    "notes": "First to apply. Usually used with regular cleanser"
}
```

deleting specific product from a routine

```bash
http://localhost:3000/api/routines/1/products/3
```

updating a products personal information

```bash
http://localhost:3000/api/routines/1/products/2
```

body - raw
full

```bash
{
    "productId": 2,
    "category": "Cleanser",
    "timeOfDay": "morning",
    "notes": "This should be the first step, emusify first in hands. Give 2 minutes to settle on face for oils to get out."
}
```

or can comment any of the following lines (ex. just want to update the notes) but need full link.

```bash
{
    "notes": "This should be the first step, emusify first in hands. Give 2 minutes to settle on face for oils to get out."
}
```

Only thing i want to improve is automatic category generation, since each product knows their category
