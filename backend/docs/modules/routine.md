# Routine Module (Backend)

The **routine** module is the core idea around ClearUp, as it supports developing skincare routine. It aggregates multiple products to create a routine that show final price and user comments.

## Data Models

Routine uses a relational PostgreSQL schema and constructed by two primary models:

- Routines (`Routine.ts`): Holds standard information about a persons routine.
- Routine's Product (`RoutineProduct.ts`): A junction model managing the many to many relationship between products and routines. Why? because if a routines products price updates, we want that to show in the routine, if its copied, it wouldn't get its new information.

## Repositories

The **repository layer** handles database transactions directly, allowing seperation of logic along with security (from sql injection).

- Routine Repository (`RoutineRepository.ts`): Executes CRUD operations for routines. It also includes pagination for some of the get routines. Additionally, there are admin related queries, for statistics on day guides are created, top authors,, and featured routines.
- Routine Product Repository (`RoutineProductRepository.ts`): Handles database operations specific to product CRUD commands for specific routine.

## Type Definitions

Enforce strict type safety and prevent repetitive inline object declarations, this file contains the core interfaces and Data Transfer Objects (DTOs) used across the module. This helps negate code smells (like repeated code in the repository or service).

- Routine Types (`routines.ts`): Defines the base entity for routine, base entity for routineproduct, and types utilized for object creation and object updates.
- Routine Admin Types (`routine-admin.ts`): Defines admin statistics data transfer objects for the admin dashboard.

## Routine Services (`RoutineService.ts`)

The service layer contains the core business logic, acting as the bridge between the controllers and the database repositories.

- Standard Operations: Organize product and merchant CRUD actions, alongside paginated search logic.
- Admin Operations: Includes a dedicated methods for Admin Stats and Featured Routines for landing page.
- Might need to redesign the CRUD Commands for "adding product to a routine" since instead, I have a BULK method to push. Need a proper way to UPDATE, i don't really understand what the pipeline will be. There is an alternative of just creating a new one.

## Routine Controller (`RoutineController.ts`)

The HTTP communication layer. The controller is responsible for receiving client requests, validating inputs, passing data to the RoutineService, and formatting the final HTTP responses. It contains no important business logic, validating that the internal data structures are not leaked to the client.

## Routine Routes (`routineRoutes.ts`)

Routine routes hold all the server/backend endpoints to Routine.
There are all the Admin Endpoints that requireAdmin to get to them, and the rest of the endpoints are standard CRUD endpoints available to any auth.
