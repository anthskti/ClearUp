# Merchant Module (Backend)

The **merchant** module is holds information of retailors.

## Data Model (`Merchant.ts`)

Merchant uses a relational PostgreSQL schema and constructed by a primary model holding information such as name, logo, and website so users can connect with external website easily.

## Repository (`MerchantRepository.ts`)

The **repository layer** handles database transactions directly, allowing seperation of logic along with security (from sql injection).

- Merchant Repository (`MerchantRepository.ts`): Executes CRUD operations for merchants.

## Type Definitions (`merchant.ts`)

Enforce strict type safety and prevent repetitive inline object declarations, this file contains the core interfaces and Data Transfer Objects (DTOs) used across the module. This helps negate code smells (like repeated code in the repository or service).

- Merchant Types (`merchant.ts`): Defines the base entity for merchant, and types utilized for object creation and object updates.

## Merchant Service (`MerchantService.ts`)

The service layer contains the core business logic, acting as the bridge between the controllers and the database repositories.

Merchant Service (`MerchantService.ts`): Has standard CRUD commands.

## Merchant Controller (`MerchantController.ts`)

The HTTP communication layer. The controller is responsible for receiving client requests, validating inputs, passing data to the MerchantService, and formatting the final HTTP responses. It contains no important business logic, validating that the internal data structures are not leaked to the client.

## Merchant Routes (`merchantRoutes.ts`)

Merchant routes hold all the server/backend endpoints to merchant.

- Future Implementation: I think i should only allow admin to post, put, and delete merchant information.
