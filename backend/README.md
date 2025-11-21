# ClearUp - Skincare Organizer Application

A monolithic skincare organizer application built with Node.js, Express, TypeScript, and PostgreSQL. This application helps users organize their skincare products and create personalized routines.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Testing](#testing)

## 🎯 Overview

ClearUp is a skincare organizer application that allows users to:
- Manage their skincare product collection
- Organize products by category (Cleanser, Toner, Essence, Serum, Eye Cream, Moisturizer, Sunscreen, Other)
- Filter products by skin type (oily, dry, combination, sensitive, normal, acne-prone)
- Create personalized skincare routines
- Track product details including benefits, ingredients, country of origin, and images

## 🏗️ Architecture

This application follows a **monolithic architecture** with a layered structure:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Repositories**: Data access layer (translates between database models and application types)
- **Models**: Sequelize ORM models for database interaction
- **Routes**: Express route definitions
- **Types**: TypeScript type definitions and DTOs

### Design Patterns

- **Repository Pattern**: Abstracts data access logic
- **Service Layer Pattern**: Separates business logic from controllers
- **Dependency Injection**: Services and controllers use constructor injection

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.2
- **ORM**: Sequelize 6.37.7
- **Database**: PostgreSQL 15
- **Environment**: dotenv 17.2.1

### Development Tools
- **TypeScript Compiler**: tsc
- **Development Server**: ts-node 10.9.2
- **Linting**: ESLint with TypeScript support
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure
clearup/
└── backend/
├── src/
│ ├── associations.ts # Sequelize model associations
│ ├── db.ts # Database connection configuration
│ ├── index.ts # Express app entry point
│ ├── controllers/
│ │ ├── ProductController.ts # Product HTTP handlers
│ │ └── RoutineController.ts # Routine HTTP handlers
│ ├── services/
│ │ ├── ProductService.ts # Product business logic
│ │ └── RoutineService.ts # Routine business logic
│ ├── repositories/
│ │ ├── ProductRepository.ts # Product data access
│ │ ├── RoutineRepository.ts # Routine data access
│ │ └── RoutineProductRepository.ts # RoutineProduct data access
│ ├── models/
│ │ ├── Product.ts # Product Sequelize model
│ │ ├── Routine.ts # Routine Sequelize model
│ │ ├── RoutineProduct.ts # Join table model
│ │ └── User.js # User model (MongoDB schema - legacy)
│ ├── routes/
│ │ ├── productRoutes.ts # Product API routes
│ │ └── routineRoutes.ts # Routine API routes
│ ├── types/
│ │ ├── product.ts # Product TypeScript types
│ │ └── routine.ts # Routine TypeScript types
│ └── scripts/
│   ├── testProduct.ts # Product database testing script
│   └── testRoutine.ts # Routine database testing script
├── dist/ # Compiled JavaScript output
├── docker-compose.yml # Docker services configuration
├── env.example # Environment variables template
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
├── server.js # Legacy server file
└── README.md # Backend-specific documentation


## 🗄️ Database Schema

### Models

#### Product
Stores skincare product information.

**Fields:**
- `id` (INTEGER, Primary Key, Auto-increment)
- `name` (STRING, Required) - Product name
- `brand` (STRING, Required) - Brand name
- `category` (ENUM, Required) - One of: Cleanser, Toner, Essence, Serum, Eye Cream, Moisturizer, Sunscreen, Other
- `skinTypes` (ARRAY[ENUM], Required) - Array of: oily, dry, combination, sensitive, normal, acne-prone
- `benefits` (STRING, Optional) - Product benefits description
- `ingredients` (STRING, Optional) - Ingredients list
- `country` (STRING, Optional) - Country of origin
- `imageUrls` (ARRAY[STRING], Optional) - Array of image URLs
- `averageRating` (FLOAT, Default: 0) - Average user rating
- `reviewCount` (INTEGER, Default: 0) - Number of reviews
- `tags` (ARRAY[STRING], Optional) - Product tags (e.g., "glass skin", "daily-use")

**Table Name:** `products`

#### Routine
Stores user skincare routines.

**Fields:**
- `id` (INTEGER, Primary Key, Auto-increment)
- `name` (STRING, Required) - Routine name
- `description` (STRING, Optional) - Routine description
- `userId` (INTEGER, Required) - Foreign key to user

**Table Name:** `routines`

#### RoutineProduct
Join table for many-to-many relationship between Routines and Products with additional metadata.

**Fields:**
- `id` (INTEGER, Primary Key, Auto-increment)
- `routineId` (INTEGER, Required) - Foreign key to Routine
- `productId` (INTEGER, Required) - Foreign key to Product
- `category` (ENUM, Required) - Product category in this routine
- `timeOfDay` (ENUM, Optional) - One of: morning, evening, both
- `notes` (TEXT, Optional) - User notes for this product in routine
- `createdAt` (TIMESTAMP) - Auto-generated
- `updatedAt` (TIMESTAMP) - Auto-generated

**Table Name:** `routine_products`

### Relationships

- **Routine ↔ Product**: Many-to-Many relationship through `RoutineProduct`
  - A Routine can have many Products
  - A Product can belong to many Routines
  - Additional metadata stored in join table (timeOfDay, notes, category)

- **Routine → RoutineProduct**: One-to-Many
  - A Routine has many RoutineProduct entries

- **Product → RoutineProduct**: One-to-Many
  - A Product can appear in many RoutineProduct entries

**Associations are defined in:** `src/associations.ts`

## 🔌 API Endpoints

### Base URL
http://localhost:3000
### Health Check
```bash
GET /health
```
Returns server status.

### Product Endpoints

#### Get All Products
```bash
GET /api/products/
```
Returns all products in the database.

**Response:** Array of Product objects

#### Get Products by Category
```bash
GET /api/products/:category
```
Returns all products in a specific category.

**Parameters:**
- `category` - One of: Cleanser, Toner, Essence, Serum, Eye Cream, Moisturizer, Sunscreen, Other

**Example:**
```bash
GET /api/products/Cleanser
```
#### Get Product by ID
```bash
GET /api/products/id/:id
```
Returns a single product by its ID.

**Parameters:**
- `id` - Product ID (integer)

**Example:**
```bash
GET /api/products/id/2
```
#### Create Product
```bash
POST /api/products/
```
Creates a new product.

**Request Body:**
```json
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

**Response:** Created Product object (201)

#### Update Product
```bash
PUT /api/products/id/:id
```
Updates an existing product.

**Parameters:**
- `id` - Product ID (integer)

**Request Body:** (All fields optional)
```json
{
  "name": "Madagascar Centella Ampoule",
  "brand": "SKIN 1004",
  "category": "Serum",
  "skinTypes": ["oily"],
  "benefits": "centella ampoule benefits",
  "ingredients": "centella ampoule ingredients",
  "country": "South Korea",
  "imageUrls": ["test.jpg", "test2.jpg"],
  "tags": ["glass skin", "daily-use"]
}
```

**Response:** Updated Product object

#### Delete Product
```bash
DELETE /api/products/id/:id
```
Deletes a product by ID.

**Parameters:**
- `id` - Product ID (integer)

**Response:** 204 No Content

### Routine Endpoints

#### Get All Routines
```bash
GET /api/routines/
```
Returns all routines in the database.

**Response:** Array of Routine objects

#### Get Routines by User ID
```bash
GET /api/routines/user/:userId
```
Returns all routines for a specific user.

**Parameters:**
- `userId` - User ID (integer)

**Example:**
```bash
GET /api/routines/user/1
```

**Response:** Array of Routine objects

#### Get Routine by ID
```bash
GET /api/routines/id/:id
```
Returns a single routine by its ID.

**Parameters:**
- `id` - Routine ID (integer)

**Example:**
```bash
GET /api/routines/id/1
```

**Response:** Routine object

#### Get Routine with Products
```bash
GET /api/routines/id/:id/products
```
Returns a routine with all its products included.

**Parameters:**
- `id` - Routine ID (integer)

**Example:**
```bash
GET /api/routines/id/1/products
```

**Response:** RoutineWithProducts object (includes products array)

#### Create Routine
```bash
POST /api/routines/
```
Creates a new routine.

**Request Body:**
```json
{
  "name": "Morning Routine",
  "description": "My morning skincare routine",
  "userId": 1
}
```

**Response:** Created Routine object (201)

#### Update Routine
```bash
PUT /api/routines/id/:id
```
Updates a routine's name and/or description.

**Parameters:**
- `id` - Routine ID (integer)

**Request Body:** (All fields optional)
```json
{
  "name": "Evening Routine",
  "description": "Updated description"
}
```

**Response:** Updated Routine object

#### Delete Routine
```bash
DELETE /api/routines/id/:id
```
Deletes a routine (cascades to RoutineProducts).

**Parameters:**
- `id` - Routine ID (integer)

**Response:** 204 No Content

### RoutineProduct Endpoints

#### Add Product to Routine
```bash
POST /api/routines/:id/products
```
Adds a product to a routine with metadata.

**Parameters:**
- `id` - Routine ID (integer)

**Request Body:**
```json
{
  "productId": 1,
  "category": "Serum",
  "timeOfDay": "morning",
  "notes": "Apply after toner"
}
```

**Response:** Created RoutineProduct object (201)

#### Remove Product from Routine
```bash
DELETE /api/routines/:id/products/:productId
```
Removes a specific product from a routine.

**Parameters:**
- `id` - Routine ID (integer)
- `productId` - Product ID (integer)

**Example:**
```bash
DELETE /api/routines/1/products/5
```

**Response:** 204 No Content

#### Update Product in Routine
```bash
PUT /api/routines/:id/products/:productId
```
Updates metadata for a product in a routine (category, timeOfDay, notes).

**Parameters:**
- `id` - Routine ID (integer)
- `productId` - Product ID (integer)

**Request Body:** (All fields optional)
```json
{
  "category": "Serum",
  "timeOfDay": "evening",
  "notes": "Updated notes"
}
```

**Response:** Updated RoutineProduct objectry:**
   cd backend
   3. **Create environment file:**
   cp env.example .env
   4. **Configure environment variables** in `.env`:v
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=skincare
   DB_USER=postgres
   DB_PASSWORD=password123
   PORT=3000
   ### Database Setup

1. **Start PostgreSQL using Docker:**
   docker-compose up --build
      This will:
   - Start PostgreSQL 15 container
   - Create database named `skincare`
   - Expose port 5432

2. **Access PostgreSQL directly (optional):**sh
   docker exec -it skincare-db psql -U postgres -d skincare
   ### Install Dependencies

npm install## 💻 Development

### Start Development Server

```bash
npm run dev
```

This starts the server using `ts-node` on `http://localhost:3000`

**Note:** The server will automatically:
- Test database connection
- Define model associations
- Sync database models (uses `force: true` in development - drops existing tables)

### Build for Production

npm run buildCompiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server

npm startRuns the compiled JavaScript from `dist/index.js`.

### Watch Mode

npm run watchContinuously compiles TypeScript on file changes.

### Stop Docker Services
ash
docker-compose down## 🧪 Testing

### Test Database Connection

#### Test Products
Run the test script to verify database connectivity and product creation:

```bash
npx ts-node src/scripts/testProduct.ts
```

This script will:
- Sync database models (with `force: true` - **WARNING**: This drops existing tables)
- Create a test product
- Fetch and display all products

#### Test Routines
Run the test script to verify routine and RoutineProduct functionality:

```bash
npx ts-node src/scripts/testRoutine.ts
```

This script will:
- Sync database models (with `force: true` - **WARNING**: This drops existing tables)
- Create test products
- Create a test routine
- Add products to the routine
- Test associations by fetching routine with products

### API Testing with Postman/curl

See the [API Endpoints](#api-endpoints) section for all available endpoints and example requests.

## 📝 Type Definitions

### ProductCategoryscript
type ProductCategory =
  | "Cleanser"
  | "Toner"
  | "Essence"
  | "Serum"
  | "Eye Cream"
  | "Moisturizer"
  | "Sunscreen"
  | "Other";### SkinTypeript
type SkinType =
  | "oily"
  | "dry"
  | "combination"
  | "sensitive"
  | "normal"
  | "acne-prone";

### Product Interfacepescript
interface Product {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  skinTypes: SkinType[];
  benefits: string;
  ingredients: string;
  country: string;
  imageUrls: string[];
  averageRating: number;
  reviewCount: number;
  tags: string[];
}## 🔧 Configuration

### TypeScript Configuration
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps and declaration files enabled
- Output directory: `dist/`

### Database Configuration
- Dialect: PostgreSQL
- Connection pooling handled by Sequelize
- Logging disabled in production

## 📦 Dependencies

### Production Dependencies
- `express`: ^5.1.0 - Web framework
- `sequelize`: ^6.37.7 - ORM
- `pg`: ^8.16.3 - PostgreSQL client
- `pg-hstore`: ^2.3.4 - PostgreSQL hstore support
- `dotenv`: ^17.2.1 - Environment variable management

### Development Dependencies
- `typescript`: ^5.9.2
- `ts-node`: ^10.9.2
- `@types/express`: ^5.0.3
- `@types/node`: ^24.3.0
- `eslint`: ^9.34.0
- `@typescript-eslint/eslint-plugin`: ^8.41.0
- `@typescript-eslint/parser`: ^8.41.0

## 🚧 Future Enhancements

- [x] Routine CRUD operations
- [x] RoutineProduct relationship management
- [ ] User authentication and authorization
- [ ] Product search and filtering
- [ ] Image upload functionality
- [ ] Product reviews and ratings
- [ ] Routine scheduling and reminders
- [ ] Frontend application
- [ ] API documentation with Swagger/OpenAPI

## 📄 License

ISC

## 👤 Author

Anthony Pham - phamanthony47@gmail.com

---
