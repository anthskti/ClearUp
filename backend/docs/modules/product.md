# Product Module (Backend)

The **products** module is the core domain for the skincare inventory system. It aggregates product data and manages pricing relationships across various external vendors.The module follows a strict Controller-Service-Repository architecture.

## Data Models

The product domain uses a relational PostgreSQL schema and constructed by two primary models:

- Products (`product.ts`): Holds standard information of a product.
- A Product's Merchants (`productMerchant.ts`): A junction model managing the many to many relationship between products and merchants, this allows a single product to be linked to multiple storefronts to track varying prices and external URLs.

## Repositories

The **repository layer** handles database transactions directly, allowing seperation of logic along with security (from sql injection).

To support high volume production data, all large response queries implement **pagination**, ensuring when there is a query the database in small, efficient chunks rather than loading large datasets into memory.

- Product Repository (`ProductRepository.ts`): Executes CRUD operations for products. It also contains complex queries for category filtering and search functionality.
- A Product's Merchant Repository (`ProductMerchantRepository.ts`): Handles database operations specific to merchant links, including updating prices and external vendor URLs for specific products.

## Type Definitions

To enforce strict type safety and prevent repetitive inline object declarations, this file contains the core interfaces and Data Transfer Objects (DTOs) used across the module. This helps negate code smells (like repeated code in the repository or service).

- Product Types (`products.ts`): Defines the base entity shapes, category enums, and types utilized for object creation and object updates.
  - Note on **Skin Types**: The current implementation includes strict skin type typings. However, this pattern requires a rework soon, as real-world merchant websites do not consistently format or categorize products by skin type in a standardized way.
  - Same with **tags**.
- CSV Analyzer (`csv.ts`): defines a data transfer object from CSV into the system.

## Product Services (`ProductService.ts`)

The service layer contains the core business logic, acting as the bridge between the controllers and the database repositories.

- Standard Operations: Organize product and merchant CRUD actions, alongside paginated search logic.
- Admin Operations: Includes a dedicated method for parsing and pushing CSV data directly into the database via an admin endpoint. Given my current implementation of my datascraper, it follows that.

## Product Controller (`productController.ts`)

The HTTP communication layer. The controller is responsible for receiving client requests, validating inputs, passing data to the ProductService, and formatting the final HTTP responses. It contains no important business logic, validating that the internal data structures are not leaked to the client.

## Product Routes (`productRoutes.ts`)

Product routes hold all the server/backend endpoints to Products.
There are all the Admin Endpoints that requireAdmin to get to them, and the rest of the endpoints are standard CRUD endpoints available to any auth.
